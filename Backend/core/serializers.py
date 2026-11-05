from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'preferred_language',
            'preferred_theme',
        ]
        read_only_fields = ['id', 'email']
