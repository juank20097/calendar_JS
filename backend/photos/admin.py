from django.contrib import admin
from .models import Photo


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'taken_at', 'created_at']
    list_filter = ['taken_at']
    search_fields = ['title']
    date_hierarchy = 'taken_at'
