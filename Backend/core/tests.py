from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
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

    def test_update_user_profile(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'email': 'alex_updated@lifeos.app',
            'username': 'alex_new',
            'preferred_language': 'ar',
            'preferred_theme': 'light',
            'bio': 'Senior Software Engineer specializing in Python & React.',
        }
        res = self.client.patch(reverse('current-user'), payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['email'], 'alex_updated@lifeos.app')
        self.assertEqual(res.data['username'], 'alex_new')
        self.assertEqual(res.data['preferred_language'], 'ar')
        self.assertEqual(res.data['preferred_theme'], 'light')
        self.assertEqual(res.data['bio'], 'Senior Software Engineer specializing in Python & React.')

        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'alex_updated@lifeos.app')
        self.assertEqual(self.user.username, 'alex_new')
        self.assertEqual(self.user.preferred_language, 'ar')
        self.assertEqual(self.user.preferred_theme, 'light')
        self.assertEqual(self.user.bio, 'Senior Software Engineer specializing in Python & React.')

    def test_change_password_success(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'old_password': 'password123',
            'new_password': 'NewSecurePassword2026!',
            'confirm_password': 'NewSecurePassword2026!',
        }
        res = self.client.post(reverse('change-password'), payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['detail'], 'Password changed successfully.')

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewSecurePassword2026!'))

    def test_change_password_wrong_old_password(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'old_password': 'wrongpassword',
            'new_password': 'NewSecurePassword2026!',
            'confirm_password': 'NewSecurePassword2026!',
        }
        res = self.client.post(reverse('change-password'), payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('old_password', res.data)

    def test_change_password_mismatch(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'old_password': 'password123',
            'new_password': 'NewSecurePassword2026!',
            'confirm_password': 'DifferentPassword2026!',
        }
        res = self.client.post(reverse('change-password'), payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', res.data)

    def test_google_login_missing_token(self):
        url = reverse('auth-google')
        res = self.client.post(url, {})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('token is required', res.data['detail'].lower())

    def test_google_login_invalid_token(self):
        url = reverse('auth-google')
        res = self.client.post(url, {'token': 'invalid.jwt.token'})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('google.oauth2.id_token.verify_oauth2_token')
    def test_google_login_success_creates_user(self, mock_verify):
        mock_verify.return_value = {
            'email': 'googleuser@example.com',
            'email_verified': True,
            'given_name': 'Google',
            'family_name': 'Tester',
        }
        url = reverse('auth-google')
        res = self.client.post(url, {'token': 'valid-mock-token'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)
        self.assertEqual(res.data['user']['email'], 'googleuser@example.com')
        self.assertTrue(User.objects.filter(email='googleuser@example.com').exists())


class InboxAPITests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            email='user1@lifeos.app',
            username='user1',
            password='password123',
        )
        self.user2 = User.objects.create_user(
            email='user2@lifeos.app',
            username='user2',
            password='password123',
        )

    def test_create_and_list_inbox_items(self):
        self.client.force_authenticate(user=self.user1)
        res = self.client.post('/api/inbox/', {'text': 'Read atomic habits'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['text'], 'Read atomic habits')
        self.assertFalse(res.data['is_processed'])

        # List should contain this item
        list_res = self.client.get('/api/inbox/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get('results', list_res.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['text'], 'Read atomic habits')

    def test_unprocessed_filtering(self):
        self.client.force_authenticate(user=self.user1)
        item1 = self.client.post('/api/inbox/', {'text': 'Thought 1'}).data
        item2 = self.client.post('/api/inbox/', {'text': 'Thought 2'}).data

        # Mark item1 as processed
        self.client.patch(f"/api/inbox/{item1['id']}/", {'is_processed': True})

        # By default only item2 is returned
        list_res = self.client.get('/api/inbox/')
        results = list_res.data.get('results', list_res.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['id'], item2['id'])

    def test_inbox_user_isolation(self):
        self.client.force_authenticate(user=self.user1)
        self.client.post('/api/inbox/', {'text': 'User 1 secret'})

        self.client.force_authenticate(user=self.user2)
        list_res = self.client.get('/api/inbox/')
        results = list_res.data.get('results', list_res.data)
        self.assertEqual(len(results), 0)


class AgentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='agentuser@lifeos.app',
            username='agentuser',
            password='password123',
            preferred_language='en',
            preferred_theme='dark',
        )

    def test_agent_chat_unauthenticated(self):
        res = self.client.post('/api/agent/chat/', {'message': 'Hello'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_agent_chat_empty_message(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post('/api/agent/chat/', {'message': ''})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_persona_generator_authenticated(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get('/api/agent/persona/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('persona_prompt', res.data)
        self.assertIn('stats', res.data)

        prompt = res.data['persona_prompt']
        # Verify 5 Pillars are present
        self.assertIn('1. INSTRUCTIONS & ROLE', prompt)
        self.assertIn('2. CONTEXT (WORKSPACE STATE)', prompt)
        self.assertIn('3. EXAMPLES & INTERACTION PATTERNS', prompt)
        self.assertIn('4. CONSTRAINTS & PRINCIPLES', prompt)
        self.assertIn('5. OUTPUT FORMAT', prompt)
        self.assertIn('agentuser', prompt)

    def test_persona_generator_unauthenticated(self):
        res = self.client.get('/api/agent/persona/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)



