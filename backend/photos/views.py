import boto3
import uuid
import os
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from botocore.exceptions import ClientError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
from django.conf import settings
from .models import Photo
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
    Form-data: image (file), taken_at (YYYY-MM-DD), title (opcional)
    Sube la imagen a S3 y guarda la URL en la DB.
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image_file = request.FILES.get('image')
        taken_at = request.data.get('taken_at')
        title = request.data.get('title', '')

        if not image_file:
            return Response({'error': 'Campo image requerido'}, status=400)
        if not taken_at:
            return Response({'error': 'Campo taken_at requerido (YYYY-MM-DD)'}, status=400)

        # Generar nombre único para S3
        ext = os.path.splitext(image_file.name)[1].lower() or '.jpg'
        s3_key = f"photos/{taken_at}/{uuid.uuid4().hex}{ext}"

        # Subir a S3
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

        # URL pública
        image_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{s3_key}"

        # Guardar en DB
        photo = Photo.objects.create(
            title=title,
            image=image_url,
            taken_at=taken_at,
        )

        return Response({
            'id': photo.id,
            'title': photo.title,
            'image': photo.image,
            'taken_at': str(photo.taken_at),
            'created_at': str(photo.created_at),
        }, status=201)


class CalendarDatesView(APIView):
    """GET /api/photos/calendar/?year=YYYY&month=MM"""

    def get(self, request):
        year = request.query_params.get('year')
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
