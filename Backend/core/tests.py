from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import User


class CurrentUserAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='alex@lifeos.app',
            username='alex',
            password='password123',
            preferred_language='en',
            preferred_theme='dark',
        )

    def test_get_current_user_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('current-user'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'alex@lifeos.app')
        self.assertEqual(response.data['preferred_theme'], 'dark')

    def test_patch_current_user_preferences(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(reverse('current-user'), {
            'preferred_theme': 'light',
            'preferred_language': 'ar',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['preferred_theme'], 'light')
        self.assertEqual(response.data['preferred_language'], 'ar')
