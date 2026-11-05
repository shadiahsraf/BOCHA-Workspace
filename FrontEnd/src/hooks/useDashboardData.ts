import { useState, useEffect, useCallback } from 'react';
import type { TaskItem, ProjectItem, NoteItem } from '@/types/api';
import {
  fetchTasks,
  fetchProjects,
  fetchNotes,
  updateTaskCompletion,
} from '@/services/dashboardService';

export function useDashboardData() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData, notesData] = await Promise.all([
        fetchTasks(),
        fetchProjects(),
        fetchNotes(),
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setNotes(notesData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend server';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleTask = useCallback(
    async (id: number | string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;
      const nextCompleted = !target.completed;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
      );

      try {
        await updateTaskCompletion(id, nextCompleted);
        // Refresh projects in background to reflect updated project progress
        const updatedProjects = await fetchProjects();
        setProjects(updatedProjects);
      } catch (err) {
        console.error('Failed to toggle task:', err);
        // Rollback on failure
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: target.completed } : t))
        );
      }
    },
    [tasks]
  );

  return {
    tasks,
    projects,
    notes,
    isLoading,
    error,
    toggleTask,
    refetch: loadData,
  };
}
