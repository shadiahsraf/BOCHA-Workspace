import api from '@/lib/api';
import type {
  BackendTask,
  BackendProject,
  BackendNote,
  PaginatedResponse,
  TaskItem,
  ProjectItem,
  NoteItem,
} from '@/types/api';

function formatDisplayDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'No due date';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diffHours = Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
  } catch {
    return dateStr;
  }
}

export async function fetchTasks(): Promise<TaskItem[]> {
  const response = await api.get<PaginatedResponse<BackendTask> | BackendTask[]>('/tasks/');
  const rawList = Array.isArray(response.data) ? response.data : response.data.results || [];
  return rawList.map((t) => ({
    id: t.id,
    title: t.title,
    completed: t.completed,
    dueDate: formatDisplayDate(t.due_date),
    priority: t.priority,
    project: t.project_title || 'General',
  }));
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  const response = await api.get<PaginatedResponse<BackendProject> | BackendProject[]>('/projects/');
  const rawList = Array.isArray(response.data) ? response.data : response.data.results || [];
  return rawList.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    progress: p.progress ?? 0,
    tasksCompleted: p.tasks_completed ?? 0,
    tasksTotal: p.tasks_total ?? 0,
    dueDate: formatDisplayDate(p.due_date),
  }));
}

export async function fetchNotes(): Promise<NoteItem[]> {
  const response = await api.get<PaginatedResponse<BackendNote> | BackendNote[]>('/notes/');
  const rawList = Array.isArray(response.data) ? response.data : response.data.results || [];
  return rawList.map((n) => ({
    id: n.id,
    title: n.title,
    snippet: n.snippet || (n.content ? n.content.slice(0, 100) : ''),
    updatedAt: formatRelativeTime(n.updated_at),
    category: n.category,
  }));
}

export async function updateTaskCompletion(
  id: number | string,
  completed: boolean
): Promise<TaskItem> {
  const response = await api.patch<BackendTask>(`/tasks/${id}/`, { completed });
  const t = response.data;
  return {
    id: t.id,
    title: t.title,
    completed: t.completed,
    dueDate: formatDisplayDate(t.due_date),
    priority: t.priority,
    project: t.project_title || 'General',
  };
}
