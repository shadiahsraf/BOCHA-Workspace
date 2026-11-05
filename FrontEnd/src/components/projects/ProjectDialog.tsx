import { useState, useEffect, type FormEvent } from 'react';
import type { ProjectItem, CreateProjectPayload } from '@/types/api';
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
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';

export interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectItem | null;
  onSave: (data: CreateProjectPayload) => Promise<void>;
}

export function ProjectDialog({
  isOpen,
  onClose,
  project,
  onSave,
}: ProjectDialogProps) {
  const isEditing = !!project;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category || 'General');
      setDescription(project.description || '');
      // Format rawDueDate if present (YYYY-MM-DD)
      setDueDate(project.rawDueDate ? project.rawDueDate.slice(0, 10) : '');
    } else {
      setTitle('');
      setCategory('General');
      setDescription('');
      setDueDate('');
    }
    setError(null);
  }, [project, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        category: category.trim() || 'General',
        description: description.trim(),
        due_date: dueDate || null,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {isEditing ? 'Edit Project' : 'New Project'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEditing
                ? 'Update milestone details and deadlines'
                : 'Define a new project milestone and category'}
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
              <label htmlFor="proj-title" className="text-xs font-medium text-text-primary block">
                Project Title *
              </label>
              <Input
                id="proj-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. LifeOS Redesign"
                required
                className="h-9 text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Category and Due Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="proj-cat" className="text-xs font-medium text-text-primary block">
                  Category
                </label>
                <Input
                  id="proj-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Engineering, Design"
                  className="h-9 text-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="proj-date" className="text-xs font-medium text-text-primary block">
                  Target Due Date
                </label>
                <Input
                  id="proj-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-9 text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="proj-desc" className="text-xs font-medium text-text-primary block">
                Description (optional)
              </label>
              <Textarea
                id="proj-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of milestones and objectives..."
                textareaSize="sm"
                disabled={isSubmitting}
                className="min-h-[80px]"
              />
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
                <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectDialog;
