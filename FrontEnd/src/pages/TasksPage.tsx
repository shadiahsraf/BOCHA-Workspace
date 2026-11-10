import { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import type { TaskItem, CreateTaskPayload } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { EmptyState } from '@/components/ui/EmptyState';

function getPriorityBadge(priority: TaskItem['priority']) {
  switch (priority) {
    case 'urgent':
      return <Badge variant="destructive" size="sm">Urgent</Badge>;
    case 'high':
      return <Badge variant="warning" size="sm">High</Badge>;
    case 'medium':
      return <Badge variant="default" size="sm">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary" size="sm">Low</Badge>;
    default:
      return <Badge variant="secondary" size="sm">{priority}</Badge>;
  }
}

export function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    toggleTask,
    addTask,
    editTask,
    removeTask,
    refetch,
  } = useTasks();

  const { projects } = useProjects();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleOpenDelete = (task: TaskItem) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleSaveTask = async (data: CreateTaskPayload) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
    } else {
      await addTask(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await removeTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary-soft text-text-primary dark:text-primary flex items-center justify-center border border-primary/20">
              <CheckSquare className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Tasks</h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Focus list, priority deadlines, and actionable deliverables.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          variant="primary"
          size="sm"
          className="gap-1.5 h-9 px-4 text-xs shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
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

      {/* 2. Filter Toolbar (Status Tabs, Priority Select, Search Input) */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface-secondary/60 border border-border shrink-0 self-start">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-md transition-colors',
              statusFilter === 'all'
                ? 'bg-surface text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-md transition-colors',
              statusFilter === 'active'
                ? 'bg-surface text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Active ({tasks.length - completedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-md transition-colors',
              statusFilter === 'completed'
                ? 'bg-surface text-text-primary shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Priority & Search Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-1 max-w-lg justify-end">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-36 h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            startAdornment={<Search className="h-4 w-4 text-text-secondary" />}
            className="h-9 text-xs w-full"
          />
        </div>
      </section>

      {/* 3. Tasks List Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold">
            {statusFilter === 'active'
              ? 'Active Tasks'
              : statusFilter === 'completed'
              ? 'Completed Tasks'
              : 'All Workspace Tasks'}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`task-skel-${i}`} className="space-y-2 py-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                  {i < 3 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-4 sm:p-6">
              <EmptyState
                title="No Tasks Found"
                description={
                  searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
                    ? 'No tasks matched your current filter selection.'
                    : 'Get started by creating your first task.'
                }
                icon={CheckSquare}
                actionButton={
                  !searchQuery && priorityFilter === 'all' && statusFilter === 'all' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpenCreate}
                      className="gap-1.5 text-xs shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create First Task</span>
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-surface-secondary/40 group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="pt-0.5">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        aria-label={`Mark "${task.title}" as ${
                          task.completed ? 'incomplete' : 'complete'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 space-y-1 text-start">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={cn(
                          'text-sm font-medium cursor-pointer block leading-snug transition-colors truncate',
                          task.completed
                            ? 'line-through text-text-secondary'
                            : 'text-text-primary'
                        )}
                      >
                        {task.title}
                      </label>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-secondary text-[10px] font-medium text-text-secondary border border-border">
                          {task.project}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div>{getPriorityBadge(task.priority)}</div>

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="h-7 w-7 rounded-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                          aria-label="Task actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => handleOpenEdit(task)}
                          className="gap-2 text-xs cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleOpenDelete(task)}
                          className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TaskDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={editingTask}
        projects={projects}
        onSave={handleSaveTask}
      />

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        itemName={taskToDelete?.title}
      />
    </div>
  );
}

export default TasksPage;
