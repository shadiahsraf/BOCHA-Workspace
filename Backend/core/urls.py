from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    GoogleLoginView,
    CurrentUserView,
    ChangePasswordView,
    InboxItemViewSet,
    AgentChatView,
    PersonaGeneratorView,
    WorkspaceStatsView,
)

router = DefaultRouter()
router.register(r'inbox', InboxItemViewSet, basename='inbox')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/google/', GoogleLoginView.as_view(), name='auth-google'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('stats/', WorkspaceStatsView.as_view(), name='workspace-stats'),
    path('agent/chat/', AgentChatView.as_view(), name='agent-chat'),
    path('agent/persona/', PersonaGeneratorView.as_view(), name='agent-persona'),
    path('', include(router.urls)),
]
