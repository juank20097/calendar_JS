from django.urls import path
from .views import PhotosByDateView, PhotoUploadView, CalendarDatesView, MonthCoverView

urlpatterns = [
    path('photos/', PhotosByDateView.as_view(), name='photos-by-date'),
    path('photos/upload/', PhotoUploadView.as_view(), name='photos-upload'),
    path('photos/calendar/', CalendarDatesView.as_view(), name='calendar-dates'),
    path('photos/cover/', MonthCoverView.as_view(), name='month-cover'),
]
