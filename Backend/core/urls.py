from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    CurrentUserView,
    ChangePasswordView,
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change-password'),
]
