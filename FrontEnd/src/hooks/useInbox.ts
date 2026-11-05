import { useState, useEffect, useCallback } from 'react';
import type { InboxItem } from '@/types/api';
import { inboxService } from '@/services/inboxService';

export function useInbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await inboxService.fetchInbox();
      setItems(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inbox items.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (text: string): Promise<InboxItem> => {
    if (!text.trim()) {
      throw new Error('Inbox item text cannot be empty.');
    }

    const trimmed = text.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: InboxItem = {
      id: tempId,
      text: trimmed,
      isProcessed: false,
      createdAt: 'Just now',
      rawCreatedAt: new Date().toISOString(),
    };

    // Optimistically prepend to list
    setItems((prev) => [optimisticItem, ...prev]);
    setIsSubmitting(true);

    try {
      const created = await inboxService.addInboxItem(trimmed);
      setItems((prev) => prev.map((item) => (item.id === tempId ? created : item)));
      return created;
    } catch (err: unknown) {
      // Rollback on failure
      setItems((prev) => prev.filter((item) => item.id !== tempId));
      const message = err instanceof Error ? err.message : 'Failed to capture inbox item.';
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const markProcessed = async (id: number | string): Promise<void> => {
    const previous = [...items];
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await inboxService.markProcessed(id);
    } catch (err: unknown) {
      setItems(previous);
      const message = err instanceof Error ? err.message : 'Failed to mark item as processed.';
      setError(message);
      throw err;
    }
  };

  const deleteItem = async (id: number | string): Promise<void> => {
    const previous = [...items];
    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await inboxService.deleteInboxItem(id);
    } catch (err: unknown) {
      setItems(previous);
      const message = err instanceof Error ? err.message : 'Failed to delete inbox item.';
      setError(message);
      throw err;
    }
  };

  return {
    items,
    isLoading,
    isSubmitting,
    error,
    addItem,
    markProcessed,
    deleteItem,
    refresh: fetchItems,
  };
}
