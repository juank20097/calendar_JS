from django.urls import path
from .views import (
    PhotosByDateView, PhotoUploadView, PhotoDeleteView,
    CalendarDatesView, MonthCoverView, AdminAuthView,
)

urlpatterns = [
    path('auth/', AdminAuthView.as_view(), name='admin-auth'),
    path('photos/', PhotosByDateView.as_view(), name='photos-by-date'),
    path('photos/upload/', PhotoUploadView.as_view(), name='photos-upload'),
    path('photos/calendar/', CalendarDatesView.as_view(), name='calendar-dates'),
    path('photos/cover/', MonthCoverView.as_view(), name='month-cover'),
    path('photos/<int:pk>/', PhotoDeleteView.as_view(), name='photos-delete'),
]
