from django.contrib import admin
from .models import Photo, MonthCover


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'taken_at', 'created_at']
    list_filter = ['taken_at']
    search_fields = ['title']
    date_hierarchy = 'taken_at'


@admin.register(MonthCover)
class MonthCoverAdmin(admin.ModelAdmin):
    list_display = ['year', 'month', 'updated_at']
    ordering = ['-year', '-month']
