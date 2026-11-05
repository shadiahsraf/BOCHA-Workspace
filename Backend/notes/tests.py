from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import User
from notes.models import Note


class NoteAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='writer@lifeos.app',
            username='writer',
            password='password123',
        )
        self.client.force_authenticate(user=self.user)

    def test_unauthenticated_access_rejected(self):
        self.client.logout()
        res = self.client.get(reverse('note-list'))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_note_crud_and_snippet(self):
        long_content = "LifeOS architecture documentation covering data models, DRF serializers, viewsets, and REST endpoints for monorepo frontend integration."
        create_res = self.client.post(reverse('note-list'), {
            'title': 'Architecture Guidelines',
            'content': long_content,
            'category': 'Engineering',
        })
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        self.assertIn('snippet', create_res.data)
        self.assertTrue(len(create_res.data['snippet']) <= 120)

        note_id = create_res.data['id']
        get_res = self.client.get(reverse('note-detail', args=[note_id]))
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data['title'], 'Architecture Guidelines')
