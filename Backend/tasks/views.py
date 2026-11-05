from core.views import BaseUserScopedViewSet
from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer


class ProjectViewSet(BaseUserScopedViewSet):
    """
    CRUD API for Projects.
    Includes computed properties: tasks_total, tasks_completed, progress.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    search_fields = ['title', 'category', 'description']
    ordering_fields = ['created_at', 'due_date', 'title']
    ordering = ['-created_at']


class TaskViewSet(BaseUserScopedViewSet):
    """
    CRUD API for Tasks.
    Includes project_title and supports filtering by completion and priority.
    """
    queryset = Task.objects.select_related('project').all()
    serializer_class = TaskSerializer
    search_fields = ['title', 'project__title']
    ordering_fields = ['due_date', 'priority', 'completed', 'created_at']
    ordering = ['completed', '-created_at']
