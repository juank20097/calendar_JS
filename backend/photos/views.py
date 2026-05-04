import boto3
import uuid
import os
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from botocore.exceptions import ClientError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
from django.conf import settings
from .models import Photo, MonthCover
from .serializers import PhotoSerializer


class PhotosByDateView(APIView):
    """GET /api/photos/?date=YYYY-MM-DD"""

    def get(self, request):
        date = request.query_params.get('date')
        if not date:
            return Response({'error': 'Parámetro date requerido (YYYY-MM-DD)'}, status=400)
        photos = Photo.objects.filter(taken_at=date)
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)


class PhotoUploadView(APIView):
    """POST /api/photos/upload/
    Form-data:
      - image       (file, requerido)
      - taken_at    (YYYY-MM-DD, requerido)
      - title       (texto, opcional)
      - is_cover    (true/false, opcional — si true reemplaza la portada del mes)
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image_file = request.FILES.get('image')
        taken_at   = request.data.get('taken_at')
        title      = request.data.get('title', '')
        is_cover   = request.data.get('is_cover', 'false').lower() == 'true'

        if not image_file:
            return Response({'error': 'Campo image requerido'}, status=400)
        if not taken_at:
            return Response({'error': 'Campo taken_at requerido (YYYY-MM-DD)'}, status=400)

        # Parsear año y mes del taken_at
        try:
            year  = int(taken_at.split('-')[0])
            month = int(taken_at.split('-')[1])
        except (IndexError, ValueError):
            return Response({'error': 'Formato de taken_at inválido, usa YYYY-MM-DD'}, status=400)

        # Subir imagen a S3
        image_url = self._upload_to_s3(image_file, taken_at)
        if isinstance(image_url, Response):
            return image_url  # error de S3

        # Guardar foto en DB
        photo = Photo.objects.create(
            title=title,
            image=image_url,
            taken_at=taken_at,
        )

        # Si is_cover=true, actualizar o crear portada del mes
        cover_updated = False
        if is_cover:
            MonthCover.objects.update_or_create(
                year=year,
                month=month,
                defaults={'image': image_url},
            )
            cover_updated = True

        return Response({
            'id': photo.id,
            'title': photo.title,
            'image': photo.image,
            'taken_at': str(photo.taken_at),
            'created_at': str(photo.created_at),
            'is_cover': cover_updated,
        }, status=201)

    def _upload_to_s3(self, image_file, taken_at):
        ext     = os.path.splitext(image_file.name)[1].lower() or '.jpg'
        s3_key  = f"photos/{taken_at}/{uuid.uuid4().hex}{ext}"

        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
            verify=False,
        )

        try:
            s3.upload_fileobj(
                image_file,
                settings.AWS_STORAGE_BUCKET_NAME,
                s3_key,
                ExtraArgs={'ContentType': image_file.content_type},
            )
        except ClientError as e:
            return Response({'error': f'Error subiendo a S3: {str(e)}'}, status=500)

        return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_key}"


class CalendarDatesView(APIView):
    """GET /api/photos/calendar/?year=YYYY&month=MM"""

    def get(self, request):
        year  = request.query_params.get('year')
        month = request.query_params.get('month')

        qs = Photo.objects.all()
        if year:
            qs = qs.filter(taken_at__year=year)
        if month:
            qs = qs.filter(taken_at__month=month)

        dates = (
            qs.values('taken_at')
            .annotate(count=Count('id'))
            .order_by('taken_at')
        )

        return Response([
            {'date': str(d['taken_at']), 'count': d['count']}
            for d in dates
        ])


class MonthCoverView(APIView):
    """GET /api/photos/cover/?year=YYYY&month=MM"""

    def get(self, request):
        year  = request.query_params.get('year')
        month = request.query_params.get('month')

        if not year or not month:
            return Response({'error': 'year y month requeridos'}, status=400)

        try:
            cover = MonthCover.objects.get(year=int(year), month=int(month))
            return Response({'image': cover.image})
        except MonthCover.DoesNotExist:
            return Response({'image': None})
