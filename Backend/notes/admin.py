from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'user', 'updated_at', 'created_at')
    list_filter = ('category', 'updated_at')
    search_fields = ('title', 'content', 'user__email')
