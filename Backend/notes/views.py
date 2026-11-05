from core.views import BaseUserScopedViewSet
from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(BaseUserScopedViewSet):
    """
    CRUD API for Notes.
    Includes computed property snippet.
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    search_fields = ['title', 'content', 'category']
    ordering_fields = ['updated_at', 'created_at', 'title']
    ordering = ['-updated_at']
