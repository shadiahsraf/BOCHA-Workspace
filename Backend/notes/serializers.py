from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    snippet = serializers.ReadOnlyField()

    class Meta:
        model = Note
        fields = [
            'id',
            'title',
            'content',
            'category',
            'snippet',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'snippet', 'created_at', 'updated_at']
