from django.db import models


class Photo(models.Model):
    title = models.CharField(max_length=200, blank=True)
    image = models.URLField(max_length=500)  # URL de S3
    taken_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-taken_at', '-created_at']
        verbose_name = 'Foto'
        verbose_name_plural = 'Fotos'

    def __str__(self):
        return f"{self.title or 'Sin título'} — {self.taken_at}"
