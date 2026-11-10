import { useState, useEffect, type FormEvent } from 'react';
import type { TaskItem, ProjectItem, CreateTaskPayload } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskItem | null;
  projects?: ProjectItem[];
  defaultStatus?: 'todo' | 'in_progress' | 'done';
  onSave: (data: CreateTaskPayload) => Promise<void>;
}

export function TaskDialog({
  isOpen,
  onClose,
  task,
  projects = [],
  defaultStatus = 'todo',
  onSave,
}: TaskDialogProps) {
  const isEditing = !!task;

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [projectId, setProjectId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status || (task.completed ? 'done' : 'todo'));
      setPriority(task.priority);
      setProjectId(task.projectId ? String(task.projectId) : '');
      setDueDate(task.rawDueDate ? task.rawDueDate.slice(0, 10) : '');
    } else {
      setTitle('');
      setStatus(defaultStatus);
      setPriority('medium');
      setProjectId('');
      setDueDate('');
    }
    setError(null);
  }, [task, isOpen, defaultStatus]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        status,
        priority,
        project: projectId ? Number(projectId) : null,
        due_date: dueDate ? `${dueDate}T12:00:00Z` : null,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {isEditing ? 'Edit Task' : 'New Task'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEditing
                ? 'Update task priority, deadline, and project assignment'
                : 'Add a new priority task to your workspace'}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive text-start">
              {error}
            </div>
          )}

          <div className="space-y-3 text-start">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="task-title" className="text-xs font-medium text-text-primary block">
                Task Title *
              </label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Implement authentication tests"
                required
                className="h-9 text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Priority & Project Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="task-priority" className="text-xs font-medium text-text-primary block">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as 'urgent' | 'high' | 'medium' | 'low')
                  }
                  className="w-full h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="task-project" className="text-xs font-medium text-text-primary block">
                  Project
                </label>
                <select
                  id="task-project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="">No Project (General)</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="task-status" className="text-xs font-medium text-text-primary block">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'todo' | 'in_progress' | 'done')
                  }
                  className="w-full h-9 rounded-lg border border-border bg-surface px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-brand-rose"
                  disabled={isSubmitting}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="task-date" className="text-xs font-medium text-text-primary block">
                  Due Date
                </label>
                <Input
                  id="task-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <>
                  <Spinner size="sm" aria-hidden={true} />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDialog;
