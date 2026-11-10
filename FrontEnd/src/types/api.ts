export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BackendTask {
  id: number;
  title: string;
  status?: 'todo' | 'in_progress' | 'done';
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
  status: 'todo' | 'in_progress' | 'done';
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
  content: string;
  snippet: string;
  updatedAt: string;
  rawUpdatedAt?: string;
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

export interface CreateNotePayload {
  title: string;
  content?: string;
  category?: string;
}

export interface UpdateNotePayload extends Partial<CreateNotePayload> {}

export interface CreateProjectPayload {
  title: string;
  category?: string;
  description?: string;
  due_date?: string | null;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

export interface CreateTaskPayload {
  title: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  completed?: boolean;
  due_date?: string | null;
  project?: number | null;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export interface TaskFilterParams {
  status?: 'todo' | 'in_progress' | 'done';
  completed?: boolean;
  priority?: string;
  project?: number | string;
  search?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface BackendUserProfile {
  id: number | string;
  email: string;
  username: string;
  preferred_language: 'en' | 'ar';
  preferred_theme: 'light' | 'dark' | 'system';
  bio?: string | null;
}

export interface BackendInboxItem {
  id: number;
  text: string;
  is_processed: boolean;
  created_at: string;
}

export interface InboxItem {
  id: number | string;
  text: string;
  isProcessed: boolean;
  createdAt: string;
  rawCreatedAt: string;
}

export interface CreateInboxPayload {
  text: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AgentChatResponse {
  reply: string;
  history?: Array<{ role: string; parts: string[] }>;
}

export interface PersonaResponse {
  persona_prompt: string;
  stats: {
    projects_count: number;
    pending_tasks_count: number;
    inbox_items_count: number;
    notes_count: number;
  };
}



