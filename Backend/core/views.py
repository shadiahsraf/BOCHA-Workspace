from rest_framework import generics, permissions, viewsets, filters
from .models import User
from .serializers import UserSerializer


def get_or_create_fallback_user() -> User:
    """Helper to return an existing user or create a fallback demo user."""
    user = User.objects.first()
    if not user:
        user = User.objects.create_user(
            email='demo@lifeos.app',
            username='demo',
            password='demopassword123',
        )
    return user


class BaseUserScopedViewSet(viewsets.ModelViewSet):
    """
    Base ModelViewSet that scopes queries to the authenticated user.
    Falls back gracefully during initial development if unauthenticated.
    """
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return self.queryset.filter(user=user)
        return self.queryset.all()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            serializer.save(user=user)
        else:
            fallback_user = get_or_create_fallback_user()
            serializer.save(user=fallback_user)


class CurrentUserView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to retrieve or update the currently logged-in user profile.
    Falls back to a demo user when unauthenticated during initial development.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        user = self.request.user
        if user.is_authenticated:
            return user
        return get_or_create_fallback_user()
