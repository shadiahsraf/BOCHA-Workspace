import { useState, useEffect, useCallback } from 'react';
import type { TaskItem, CreateTaskPayload, UpdateTaskPayload } from '@/types/api';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
} from '@/services/tasksService';

export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const completedParam =
        statusFilter === 'active' ? false : statusFilter === 'completed' ? true : undefined;

      const data = await fetchTasks({
        search: searchQuery.trim() || undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        completed: completedParam,
        project: projectFilter !== 'all' ? projectFilter : undefined,
      });
      setTasks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter, searchQuery, projectFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const toggleTask = async (id: number | string): Promise<void> => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;

    // Optimistic local update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );

    try {
      await toggleTaskCompletion(id, nextCompleted);
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: target.completed } : t))
      );
    }
  };

  const addTask = async (payload: CreateTaskPayload): Promise<TaskItem> => {
    const created = await createTask(payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const editTask = async (
    id: number | string,
    payload: UpdateTaskPayload
  ): Promise<TaskItem> => {
    const updated = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTask = async (id: number | string): Promise<void> => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tasks,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    projectFilter,
    setProjectFilter,
    toggleTask,
    addTask,
    editTask,
    removeTask,
    refetch: loadTasks,
  };
}
