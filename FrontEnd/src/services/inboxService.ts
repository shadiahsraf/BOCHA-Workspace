import api from '@/lib/api';
import type {
  BackendInboxItem,
  PaginatedResponse,
  InboxItem,
  CreateInboxPayload,
} from '@/types/api';

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

function normalizeInboxItem(item: BackendInboxItem): InboxItem {
  return {
    id: item.id,
    text: item.text,
    isProcessed: item.is_processed,
    createdAt: formatRelativeTime(item.created_at),
    rawCreatedAt: item.created_at,
  };
}

export const inboxService = {
  /**
   * Fetches all active/unprocessed inbox items.
   */
  async fetchInbox(): Promise<InboxItem[]> {
    const response = await api.get<PaginatedResponse<BackendInboxItem> | BackendInboxItem[]>('/inbox/');
    const rawList = Array.isArray(response.data) ? response.data : response.data.results || [];
    return rawList.map(normalizeInboxItem);
  },

  /**
   * Captures a new thought/item in the inbox.
   */
  async addInboxItem(payload: CreateInboxPayload | string): Promise<InboxItem> {
    const body = typeof payload === 'string' ? { text: payload } : payload;
    const response = await api.post<BackendInboxItem>('/inbox/', body);
    return normalizeInboxItem(response.data);
  },

  /**
   * Marks an inbox item as processed (PATCH is_processed: true).
   */
  async markProcessed(id: number | string): Promise<InboxItem> {
    const response = await api.patch<BackendInboxItem>(`/inbox/${id}/`, {
      is_processed: true,
    });
    return normalizeInboxItem(response.data);
  },

  /**
   * Permanently deletes an inbox item.
   */
  async deleteInboxItem(id: number | string): Promise<void> {
    await api.delete(`/inbox/${id}/`);
  },
};
