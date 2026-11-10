from rest_framework import generics, permissions, status, viewsets, filters, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from asgiref.sync import async_to_sync
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import User, InboxItem
from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    ChangePasswordSerializer,
    InboxItemSerializer,
)
from .ai_service import chat_with_agent_async, generate_5_pillar_persona


class CustomTokenObtainPairView(TokenObtainPairView):
    """Token obtain view returning access, refresh, and user profile metadata."""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Public registration endpoint that creates user and returns JWT tokens."""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class GoogleLoginView(views.APIView):
    """
    Public authentication endpoint for Google OAuth (ID token verification).
    Verifies the client-provided Google ID token, retrieves or creates the user,
    and returns SimpleJWT access & refresh tokens along with user metadata.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        token = request.data.get('token') or request.data.get('credential')
        if not token:
            return Response(
                {'detail': 'Google token is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client_id = getattr(settings, 'GOOGLE_CLIENT_ID', '')
        audience = client_id if client_id else None

        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                audience=audience,
            )
        except ValueError as e:
            return Response(
                {'detail': f'Invalid Google token: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {'detail': f'Google verification failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = idinfo.get('email')
        if not email:
            return Response(
                {'detail': 'Google token did not contain an email address.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.lower().strip()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            base_username = email.split('@')[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')

            user = User.objects.create(
                email=email,
                username=username,
                first_name=first_name,
                last_name=last_name,
            )
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class BaseUserScopedViewSet(viewsets.ModelViewSet):
    """
    Base ModelViewSet that strictly enforces authentication and scopes
    all operations to the currently authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class InboxItemViewSet(BaseUserScopedViewSet):
    """
    CRUD API for user Inbox items.
    Defaults to returning unprocessed items (is_processed=False).
    """
    queryset = InboxItem.objects.all()
    serializer_class = InboxItemSerializer
    search_fields = ['text']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        include_processed = self.request.query_params.get('include_processed')
        if include_processed is not None and include_processed.lower() in ['true', '1']:
            return self.queryset.filter(user=self.request.user).order_by('-created_at')
        return self.queryset.filter(user=self.request.user, is_processed=False).order_by('-created_at')


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve or update the authenticated user's profile.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    """
    API endpoint for authenticated users to change their password.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response(
            {'detail': 'Password changed successfully.'},
            status=status.HTTP_200_OK,
        )


class AgentChatView(views.APIView):
    """
    API endpoint to communicate with the Agentic AI.
    Executes Gemini function calling tools scoped strictly to request.user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])
        if not message:
            return Response(
                {'detail': 'Message content cannot be empty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Execute async AI service safely within DRF view
        result = async_to_sync(chat_with_agent_async)(request.user, message, history)
        return Response(result, status=status.HTTP_200_OK)


class PersonaGeneratorView(views.APIView):
    """
    API endpoint generating a rich 5-Pillar Markdown prompt
    summarizing the authenticated user's workspace state.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = generate_5_pillar_persona(request.user)
        return Response(data, status=status.HTTP_200_OK)

