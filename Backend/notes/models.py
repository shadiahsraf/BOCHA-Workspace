from django.conf import settings
from django.db import models


class Note(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes',
    )
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True, default='')
    category = models.CharField(max_length=100, default='Personal')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title

    @property
    def snippet(self) -> str:
        text = self.content.strip() if self.content else ''
        if not text:
            return self.title
        if len(text) > 120:
            return text[:117] + '...'
        return text
