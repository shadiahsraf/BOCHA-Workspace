from rest_framework import serializers
from .models import Project, Task


class ProjectSerializer(serializers.ModelSerializer):
    tasks_total = serializers.ReadOnlyField()
    tasks_completed = serializers.ReadOnlyField()
    progress = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'category',
            'description',
            'due_date',
            'progress',
            'tasks_completed',
            'tasks_total',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'progress', 'tasks_completed', 'tasks_total', 'created_at', 'updated_at']


class TaskSerializer(serializers.ModelSerializer):
    project_title = serializers.ReadOnlyField(source='project.title')

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'completed',
            'due_date',
            'priority',
            'project',
            'project_title',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'project_title', 'created_at', 'updated_at']
