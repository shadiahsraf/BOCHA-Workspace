import { useState, useEffect, useCallback } from 'react';
import type { TaskItem, ProjectItem } from '@/types/api';
import { fetchTasks } from '@/services/tasksService';
import { fetchProjects } from '@/services/projectsService';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'task' | 'project';
  allDay: boolean;
  rawTask?: TaskItem;
  rawProject?: ProjectItem;
}

export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.slice(0, 10).split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }
  return new Date(dateStr);
}

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedTasks, fetchedProjects] = await Promise.all([
        fetchTasks(),
        fetchProjects(),
      ]);

      setTasks(fetchedTasks);
      setProjects(fetchedProjects);

      const taskEvents: CalendarEvent[] = fetchedTasks
        .filter((task) => !!task.rawDueDate)
        .map((task) => {
          const dueDate = parseLocalDate(task.rawDueDate!);
          return {
            id: `task-${task.id}`,
            title: task.title,
            start: dueDate,
            end: dueDate,
            type: 'task' as const,
            allDay: true,
            rawTask: task,
          };
        });

      const projectEvents: CalendarEvent[] = fetchedProjects
        .filter((project) => !!project.rawDueDate)
        .map((project) => {
          const dueDate = parseLocalDate(project.rawDueDate!);
          return {
            id: `project-${project.id}`,
            title: `[Project] ${project.title}`,
            start: dueDate,
            end: dueDate,
            type: 'project' as const,
            allDay: true,
            rawProject: project,
          };
        });

      setEvents([...projectEvents, ...taskEvents]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch calendar events.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    events,
    tasks,
    projects,
    isLoading,
    error,
    refresh,
  };
}
