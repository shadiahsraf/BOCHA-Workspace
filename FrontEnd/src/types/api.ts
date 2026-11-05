export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BackendTask {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  project: number | null;
  project_title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BackendProject {
  id: number;
  title: string;
  category: string;
  description?: string;
  due_date: string | null;
  progress: number;
  tasks_completed: number;
  tasks_total: number;
  created_at?: string;
  updated_at?: string;
}

export interface BackendNote {
  id: number;
  title: string;
  content: string;
  category: string;
  snippet: string;
  created_at?: string;
  updated_at: string;
}

export interface TaskItem {
  id: number | string;
  title: string;
  completed: boolean;
  dueDate: string;
  rawDueDate?: string | null;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  project: string;
  projectId?: number | null;
}

export interface ProjectItem {
  id: number | string;
  title: string;
  category: string;
  description?: string;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  dueDate: string;
  rawDueDate?: string | null;
}

export interface NoteItem {
  id: number | string;
  title: string;
  snippet: string;
  updatedAt: string;
  category: string;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export interface CreateProjectPayload {
  title: string;
  category?: string;
  description?: string;
  due_date?: string | null;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

export interface CreateTaskPayload {
  title: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  completed?: boolean;
  due_date?: string | null;
  project?: number | null;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export interface TaskFilterParams {
  completed?: boolean;
  priority?: string;
  project?: number | string;
  search?: string;
}
