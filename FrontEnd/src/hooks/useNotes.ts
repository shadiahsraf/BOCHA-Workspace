import { useState, useEffect, useCallback, useMemo } from 'react';
import type { NoteItem, CreateNotePayload, UpdateNotePayload } from '@/types/api';
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from '@/services/notesService';

export function useNotes() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNotes(searchQuery);
      setNotes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Derive unique categories from loaded notes
  const categories = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.category && n.category.trim()) {
        set.add(n.category.trim());
      }
    });
    return Array.from(set);
  }, [notes]);

  // Filter notes by category and client-side fallback query
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        n.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [notes, selectedCategory, searchQuery]);

  const addNote = async (payload: CreateNotePayload): Promise<NoteItem> => {
    const created = await createNote(payload);
    setNotes((prev) => [created, ...prev]);
    return created;
  };

  const editNote = async (
    id: number | string,
    payload: UpdateNotePayload
  ): Promise<NoteItem> => {
    const updated = await updateNote(id, payload);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  };

  const removeNote = async (id: number | string): Promise<void> => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notes,
    filteredNotes,
    categories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addNote,
    editNote,
    removeNote,
    refetch: loadNotes,
  };
}
