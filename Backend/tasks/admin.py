from django.contrib import admin
from .models import Project, Task


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'user', 'due_date', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'description', 'user__email')


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'user', 'priority', 'completed', 'due_date', 'created_at')
    list_filter = ('completed', 'priority', 'created_at')
    search_fields = ('title', 'user__email', 'project__title')
