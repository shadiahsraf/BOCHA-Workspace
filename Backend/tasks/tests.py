from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from core.models import User
from tasks.models import Project, Task


class TaskAndProjectAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='builder@lifeos.app',
            username='builder',
            password='password123',
        )
        self.client.force_authenticate(user=self.user)

    def test_unauthenticated_access_rejected(self):
        self.client.logout()
        res = self.client.get(reverse('project-list'))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        res = self.client.get(reverse('task-list'))
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_project_crud_and_computed_properties(self):
        create_res = self.client.post(reverse('project-list'), {
            'title': 'Design System',
            'category': 'Design',
        })
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        project_id = create_res.data['id']
        self.assertEqual(create_res.data['progress'], 0)
        self.assertEqual(create_res.data['tasks_total'], 0)
        self.assertEqual(create_res.data['tasks_completed'], 0)

        task1_res = self.client.post(reverse('task-list'), {
            'title': 'Component Audit',
            'project': project_id,
            'completed': True,
            'priority': 'high',
        })
        self.assertEqual(task1_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(task1_res.data['project_title'], 'Design System')

        task2_res = self.client.post(reverse('task-list'), {
            'title': 'Accessibility Review',
            'project': project_id,
            'completed': False,
            'priority': 'medium',
        })
        self.assertEqual(task2_res.status_code, status.HTTP_201_CREATED)

        get_res = self.client.get(reverse('project-detail', args=[project_id]))
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data['progress'], 50)
        self.assertEqual(get_res.data['tasks_total'], 2)
        self.assertEqual(get_res.data['tasks_completed'], 1)

    def test_task_toggle_completion(self):
        task = Task.objects.create(
            user=self.user,
            title='Quick Task',
            completed=False,
        )
        patch_res = self.client.patch(reverse('task-detail', args=[task.id]), {
            'completed': True,
        })
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertTrue(patch_res.data['completed'])
