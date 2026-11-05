from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import User


class AuthenticationAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='alex@lifeos.app',
            username='alex',
            password='password123',
            preferred_language='en',
            preferred_theme='dark',
        )

    def test_register_new_user(self):
        url = reverse('auth-register')
        payload = {
            'email': 'newuser@lifeos.app',
            'username': 'newuser',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!',
            'preferred_language': 'ar',
            'preferred_theme': 'light',
        }
        res = self.client.post(url, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)
        self.assertEqual(res.data['user']['email'], 'newuser@lifeos.app')
        self.assertEqual(res.data['user']['preferred_language'], 'ar')

    def test_token_obtain_pair_login(self):
        url = reverse('token-obtain-pair')
        payload = {
            'email': 'alex@lifeos.app',
            'password': 'password123',
        }
        res = self.client.post(url, payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)
        self.assertIn('user', res.data)
        self.assertEqual(res.data['user']['email'], 'alex@lifeos.app')

    def test_token_refresh(self):
        obtain_res = self.client.post(reverse('token-obtain-pair'), {
            'email': 'alex@lifeos.app',
            'password': 'password123',
        })
        refresh_token = obtain_res.data['refresh']

        refresh_res = self.client.post(reverse('token-refresh'), {
            'refresh': refresh_token,
        })
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_res.data)

    def test_current_user_unauthenticated(self):
        res = self.client.get(reverse('current-user'))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_authenticated(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get(reverse('current-user'))
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], 'alex@lifeos.app')
