import api from '@/lib/api';
import type {
  BackendNote,
  PaginatedResponse,
  NoteItem,
  CreateNotePayload,
  UpdateNotePayload,
} from '@/types/api';

export function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function normalizeNote(n: BackendNote): NoteItem {
  return {
    id: n.id,
    title: n.title,
    content: n.content || '',
    snippet: n.snippet || (n.content ? n.content.slice(0, 117) + '...' : n.title),
    updatedAt: formatRelativeTime(n.updated_at),
    rawUpdatedAt: n.updated_at,
    category: n.category || 'Personal',
  };
}

export async function fetchNotes(search?: string): Promise<NoteItem[]> {
  const queryParams: Record<string, string> = {};
  if (search?.trim()) {
    queryParams.search = search.trim();
  }

  const response = await api.get<PaginatedResponse<BackendNote> | BackendNote[]>('/notes/', {
    params: queryParams,
  });

  const rawList = Array.isArray(response.data) ? response.data : response.data.results || [];
  return rawList.map(normalizeNote);
}

export async function createNote(payload: CreateNotePayload): Promise<NoteItem> {
  const response = await api.post<BackendNote>('/notes/', payload);
  return normalizeNote(response.data);
}

export async function updateNote(
  id: number | string,
  payload: UpdateNotePayload
): Promise<NoteItem> {
  const response = await api.patch<BackendNote>(`/notes/${id}/`, payload);
  return normalizeNote(response.data);
}

export async function deleteNote(id: number | string): Promise<void> {
  await api.delete(`/notes/${id}/`);
}
