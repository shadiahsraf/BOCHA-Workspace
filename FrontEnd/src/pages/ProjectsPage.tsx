import { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import type { ProjectItem, CreateProjectPayload } from '@/types/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { EmptyState } from '@/components/ui/EmptyState';

export function ProjectsPage() {
  const { projects, isLoading, error, addProject, editProject, removeProject, refetch } =
    useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  // Filter projects by search
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  // Project statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const completed = projects.filter((p) => p.progress === 100).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  }, [projects]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleOpenDelete = (project: ProjectItem) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleSaveProject = async (data: CreateProjectPayload) => {
    if (editingProject) {
      await editProject(editingProject.id, data);
    } else {
      await addProject(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await removeProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary-soft text-text-primary dark:text-primary flex items-center justify-center border border-primary/20">
              <Layers className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Projects</h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Organize long-term initiatives, milestones, and deliverable targets.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          variant="primary"
          size="sm"
          className="gap-1.5 h-9 px-4 text-xs shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </section>

      {/* Error Notice Banner */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-start flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={refetch} className="h-7 text-xs gap-1">
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* 2. KPI Summary Bar & Search Filter */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-secondary">Total Projects</span>
            <div className="text-xl font-bold text-text-primary mt-0.5">{stats.total}</div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-surface-secondary flex items-center justify-center text-text-secondary">
            <Layers className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-secondary">In Progress</span>
            <div className="text-xl font-bold text-warning mt-0.5">{stats.inProgress}</div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
            <Clock className="h-4 w-4" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-text-secondary">Completed</span>
            <div className="text-xl font-bold text-success mt-0.5">{stats.completed}</div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-success/10 text-success flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </Card>
      </section>

      {/* Search Input */}
      <div className="w-full sm:max-w-md">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter projects by title or category..."
          startAdornment={<Search className="h-4 w-4 text-text-secondary" />}
          className="h-10 text-sm"
        />
      </div>

      {/* 3. Projects Grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={`proj-skel-${i}`} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 w-3/4">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'No Matching Projects' : 'No Projects Created Yet'}
            description={
              searchQuery
                ? 'Try searching with a different keyword or clear your filter.'
                : 'Create your first project to organize priorities and track delivery progress.'
            }
            icon={Layers}
            actionButton={
              !searchQuery ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreate}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create First Project</span>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="flex flex-col justify-between transition-all duration-normal hover:shadow-md hover:-translate-y-0.5 motion-reduce:transform-none"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border">
                      {project.category}
                    </span>

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="h-7 w-7 rounded-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                          aria-label="Project actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(project)}
                          className="gap-2 text-xs cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleOpenDelete(project)}
                          className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <CardTitle className="text-base font-semibold text-text-primary mt-2 line-clamp-1">
                    {project.title}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="text-xs text-text-secondary line-clamp-2 mt-1">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary font-medium">Progress</span>
                      <span className="font-semibold text-text-primary">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border pt-3 flex items-center justify-between text-[11px] text-text-secondary">
                  <span>
                    {project.tasksCompleted} / {project.tasksTotal} tasks
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Calendar className="h-3 w-3" />
                    {project.dueDate}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <ProjectDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        project={editingProject}
        onSave={handleSaveProject}
      />

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        itemName={projectToDelete?.title}
      />
    </div>
  );
}

export default ProjectsPage;
