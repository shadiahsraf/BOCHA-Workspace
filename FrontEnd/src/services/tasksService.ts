import api from '@/lib/api';
import type {
  BackendTask,
  PaginatedResponse,
  TaskItem,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskFilterParams,
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

function normalizeTask(t: BackendTask): TaskItem {
  return {
    id: t.id,
    title: t.title,
    completed: t.completed,
    dueDate: formatDisplayDate(t.due_date),
    rawDueDate: t.due_date,
    priority: t.priority,
    project: t.project_title || 'General',
    projectId: t.project,
  };
}

export async function fetchTasks(params?: TaskFilterParams): Promise<TaskItem[]> {
  const queryParams: Record<string, string | number | boolean> = {};

  if (params?.search) queryParams.search = params.search;
  if (params?.priority && params.priority !== 'all') queryParams.priority = params.priority;
  if (params?.completed !== undefined) queryParams.completed = params.completed;
  if (params?.project) queryParams.project = params.project;

  const response = await api.get<PaginatedResponse<BackendTask> | BackendTask[]>('/tasks/', {
    params: queryParams,
  });
  const rawList = Array.isArray(response.data) ? response.data : response.data.results || [];
  return rawList.map(normalizeTask);
}

export async function createTask(payload: CreateTaskPayload): Promise<TaskItem> {
  const response = await api.post<BackendTask>('/tasks/', payload);
  return normalizeTask(response.data);
}

export async function updateTask(
  id: number | string,
  payload: UpdateTaskPayload
): Promise<TaskItem> {
  const response = await api.patch<BackendTask>(`/tasks/${id}/`, payload);
  return normalizeTask(response.data);
}

export async function deleteTask(id: number | string): Promise<void> {
  await api.delete(`/tasks/${id}/`);
}

export async function toggleTaskCompletion(
  id: number | string,
  completed: boolean
): Promise<TaskItem> {
  const response = await api.patch<BackendTask>(`/tasks/${id}/`, { completed });
  return normalizeTask(response.data);
}
