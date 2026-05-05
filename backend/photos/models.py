from django.db import models


class Photo(models.Model):
    title = models.CharField(max_length=200, blank=True)
    image = models.URLField(max_length=500)
    taken_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-taken_at', '-created_at']
        verbose_name = 'Foto'
        verbose_name_plural = 'Fotos'

    def __str__(self):
        return f"{self.title or 'Sin título'} — {self.taken_at}"


class MonthCover(models.Model):
    """Portadas de carrusel para un mes específico."""
    year     = models.IntegerField()
    month    = models.IntegerField()  # 1-12
    images   = models.JSONField(default=list)  # lista de URLs
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('year', 'month')
        verbose_name = 'Portada de mes'
        verbose_name_plural = 'Portadas de mes'

    def __str__(self):
        return f"Portada {self.year}-{str(self.month).zfill(2)} ({len(self.images)} imágenes)"
