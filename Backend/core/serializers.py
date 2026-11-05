from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom SimpleJWT serializer including user profile metadata in response."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['preferred_language'] = user.preferred_language
        token['preferred_theme'] = user.preferred_theme
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'preferred_language': self.user.preferred_language,
            'preferred_theme': self.user.preferred_theme,
        }
        return data


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration with password confirmation."""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'password',
            'password_confirm',
            'preferred_language',
            'preferred_theme',
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'username': {'required': False, 'allow_blank': True},
            'preferred_language': {'required': False},
            'preferred_theme': {'required': False},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        email = validated_data.get('email')
        base_username = validated_data.get('username') or email.split('@')[0]
        
        candidate = base_username
        counter = 1
        while User.objects.filter(username=candidate).exists():
            candidate = f"{base_username}{counter}"
            counter += 1
            
        password = validated_data.pop('password')
        preferred_language = validated_data.get('preferred_language', 'en')
        preferred_theme = validated_data.get('preferred_theme', 'system')

        user = User.objects.create_user(
            email=email,
            username=candidate,
            password=password,
            preferred_language=preferred_language,
            preferred_theme=preferred_theme,
        )
        return user
