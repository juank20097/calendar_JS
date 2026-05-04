from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from django.db.models.functions import TruncDate
from .models import Photo
from .serializers import PhotoSerializer, PhotoUploadSerializer


class PhotosByDateView(APIView):
    """GET /api/photos/?date=YYYY-MM-DD — fotos de un día específico"""

    def get(self, request):
        date = request.query_params.get('date')
        if not date:
            return Response(
                {'error': 'Parámetro date requerido (YYYY-MM-DD)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        photos = Photo.objects.filter(taken_at=date)
        serializer = PhotoSerializer(photos, many=True, context={'request': request})
        return Response(serializer.data)


class PhotoUploadView(generics.CreateAPIView):
    """POST /api/photos/upload/ — subir una foto"""
    queryset = Photo.objects.all()
    serializer_class = PhotoUploadSerializer


class CalendarDatesView(APIView):
    """GET /api/photos/calendar/?year=YYYY&month=MM — días con fotos"""

    def get(self, request):
        year = request.query_params.get('year')
        month = request.query_params.get('month')

        qs = Photo.objects.all()
        if year:
            qs = qs.filter(taken_at__year=year)
        if month:
            qs = qs.filter(taken_at__month=month)

        dates = (
            qs.annotate(date=TruncDate('taken_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        return Response([
            {'date': str(d['date']), 'count': d['count']}
            for d in dates
        ])
