import api from '@/lib/api';
import type {
  BackendProject,
  PaginatedResponse,
  ProjectItem,
  CreateProjectPayload,
  UpdateProjectPayload,
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

function normalizeProject(p: BackendProject): ProjectItem {
  return {
    id: p.id,
    title: p.title,
    category: p.category || 'General',
    description: p.description || '',
    progress: p.progress ?? 0,
    tasksCompleted: p.tasks_completed ?? 0,
    tasksTotal: p.tasks_total ?? 0,
    dueDate: formatDisplayDate(p.due_date),
    rawDueDate: p.due_date,
  };
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  const response = await api.get<PaginatedResponse<BackendProject> | BackendProject[]>('/projects/');
  const rawList = Array.isArray(response.data) ? response.data : response.data.results || [];
  return rawList.map(normalizeProject);
}

export async function createProject(payload: CreateProjectPayload): Promise<ProjectItem> {
  const response = await api.post<BackendProject>('/projects/', payload);
  return normalizeProject(response.data);
}

export async function updateProject(
  id: number | string,
  payload: UpdateProjectPayload
): Promise<ProjectItem> {
  const response = await api.patch<BackendProject>(`/projects/${id}/`, payload);
  return normalizeProject(response.data);
}

export async function deleteProject(id: number | string): Promise<void> {
  await api.delete(`/projects/${id}/`);
}
