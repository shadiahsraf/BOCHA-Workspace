import { useState, useEffect, useCallback } from 'react';
import type { ProjectItem, CreateProjectPayload, UpdateProjectPayload } from '@/types/api';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/services/projectsService';

export function useProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const addProject = async (payload: CreateProjectPayload): Promise<ProjectItem> => {
    const newProj = await createProject(payload);
    setProjects((prev) => [newProj, ...prev]);
    return newProj;
  };

  const editProject = async (
    id: number | string,
    payload: UpdateProjectPayload
  ): Promise<ProjectItem> => {
    const updated = await updateProject(id, payload);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const removeProject = async (id: number | string): Promise<void> => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    projects,
    isLoading,
    error,
    addProject,
    editProject,
    removeProject,
    refetch: loadProjects,
  };
}
