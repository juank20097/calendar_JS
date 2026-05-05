import boto3
import uuid
import os
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from botocore.exceptions import ClientError
from urllib.parse import urlparse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
from django.conf import settings
from .models import Photo, MonthCover
from .serializers import PhotoSerializer


def _s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
        verify=False,
    )


def _delete_from_s3(image_url):
    """Borra un objeto de S3 dado su URL pública."""
    try:
        parsed = urlparse(image_url)
        key = parsed.path.lstrip('/')
        _s3_client().delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
    except Exception:
        pass


def _check_admin(request):
    """Verifica que la cédula enviada sea de un administrador."""
    cedula = request.data.get('cedula') or request.GET.get('cedula') or ''
    allowed = [c.strip() for c in settings.ADMIN_CEDULAS if c.strip()]
    return cedula.strip() in allowed


class AdminAuthView(APIView):
    """POST /api/auth/
    Body JSON: { "cedula": "1234567890" }
    Verifica si la cédula es de un administrador.
    """
    def post(self, request):
        if _check_admin(request):
            return Response({'ok': True})
        return Response({'ok': False, 'error': 'Cédula no autorizada'}, status=403)


class PhotosByDateView(APIView):
    """GET /api/photos/?date=YYYY-MM-DD"""

    def get(self, request):
        date = request.query_params.get('date')
        if not date:
            return Response({'error': 'Parámetro date requerido (YYYY-MM-DD)'}, status=400)
        photos = Photo.objects.filter(taken_at=date)
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)


class PhotoDeleteView(APIView):
    """DELETE /api/photos/{id}/
    Body JSON: { "cedula": "1234567890" }
    Borra foto de DB, S3 y la quita del carrusel si estaba.
    """
    def delete(self, request, pk):
        if not _check_admin(request):
            return Response({'error': 'No autorizado'}, status=403)

        try:
            photo = Photo.objects.get(pk=pk)
        except Photo.DoesNotExist:
            return Response({'error': 'Foto no encontrada'}, status=404)

        image_url = photo.image
        year      = photo.taken_at.year
        month     = photo.taken_at.month

        # Borrar de DB
        photo.delete()

        # Borrar de S3
        _delete_from_s3(image_url)

        # Quitar del carrusel si estaba
        try:
            cover = MonthCover.objects.get(year=year, month=month)
            if image_url in cover.images:
                cover.images = [img for img in cover.images if img != image_url]
                if cover.images:
                    cover.save()
                else:
                    cover.delete()
        except MonthCover.DoesNotExist:
            pass

        return Response({'ok': True, 'deleted_id': pk})


class PhotoUploadView(APIView):
    """POST /api/photos/upload/
    Form-data:
      - images    (files[], requerido)
      - taken_at  (YYYY-MM-DD, requerido)
      - title     (texto, opcional)
      - is_cover  (true/false — si true REEMPLAZA el carrusel del mes)
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image_files  = request.FILES.getlist('images')
        taken_at     = request.data.get('taken_at') or request.POST.get('taken_at')
        title        = request.data.get('title') or request.POST.get('title') or ''
        is_cover_raw = request.data.get('is_cover') or request.POST.get('is_cover') or 'false'
        is_cover     = is_cover_raw.lower() == 'true'

        if not image_files:
            return Response({'error': 'Campo images requerido'}, status=400)
        if not taken_at:
            return Response({'error': 'Campo taken_at requerido (YYYY-MM-DD)'}, status=400)

        try:
            year  = int(taken_at.split('-')[0])
            month = int(taken_at.split('-')[1])
        except (IndexError, ValueError):
            return Response({'error': 'Formato de taken_at inválido, usa YYYY-MM-DD'}, status=400)

        uploaded   = []
        cover_urls = []
        errors     = []

        for image_file in image_files:
            image_url = self._upload_to_s3(image_file, taken_at)
            if image_url is None:
                errors.append(f"Error subiendo {image_file.name} a S3")
                continue

            photo = Photo.objects.create(title=title, image=image_url, taken_at=taken_at)
            uploaded.append({
                'id': photo.id, 'title': photo.title,
                'image': photo.image, 'taken_at': str(photo.taken_at),
                'created_at': str(photo.created_at),
            })

            if is_cover:
                cover_urls.append(image_url)

        # Si is_cover=true REEMPLAZA el carrusel del mes
        cover_updated = False
        if is_cover and cover_urls:
            cover, _ = MonthCover.objects.get_or_create(
                year=year, month=month, defaults={'images': []}
            )
            cover.images = cover_urls  # reemplaza, no acumula
            cover.save()
            cover_updated = True

        return Response({
            'uploaded': uploaded,
            'total': len(uploaded),
            'is_cover': cover_updated,
            'errors': errors,
        }, status=201)

    def _upload_to_s3(self, image_file, taken_at):
        ext    = os.path.splitext(image_file.name)[1].lower() or '.jpg'
        s3_key = f"photos/{taken_at}/{uuid.uuid4().hex}{ext}"
        try:
            _s3_client().upload_fileobj(
                image_file,
                settings.AWS_STORAGE_BUCKET_NAME,
                s3_key,
                ExtraArgs={'ContentType': image_file.content_type},
            )
        except ClientError:
            return None
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
            return Response({'images': cover.images})
        except MonthCover.DoesNotExist:
            return Response({'images': []})
