from rest_framework import generics, permissions, status, viewsets, filters, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from asgiref.sync import async_to_sync

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

