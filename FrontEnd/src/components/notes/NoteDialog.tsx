import { useState, useEffect, type FormEvent } from 'react';
import type { NoteItem, CreateNotePayload } from '@/types/api';
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

export interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  note?: NoteItem | null;
  onSave: (data: CreateNotePayload) => Promise<void>;
}

export function NoteDialog({
  isOpen,
  onClose,
  note,
  onSave,
}: NoteDialogProps) {
  const isEditing = !!note;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setCategory(note.category || 'Personal');
      setContent(note.content || '');
    } else {
      setTitle('');
      setCategory('Personal');
      setContent('');
    }
    setError(null);
  }, [note, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Note title is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        category: category.trim() || 'Personal',
        content: content.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {isEditing ? 'Edit Note' : 'New Note'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEditing
                ? 'Update note content, title, or category'
                : 'Write a memo, architecture log, or quick idea'}
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
              <label htmlFor="note-title" className="text-xs font-medium text-text-primary block">
                Title *
              </label>
              <Input
                id="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design Tokens Architecture"
                required
                className="h-9 text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="note-category" className="text-xs font-medium text-text-primary block">
                Category
              </label>
              <Input
                id="note-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Engineering, Personal, Ideas"
                className="h-9 text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Content (Generous height) */}
            <div className="space-y-1">
              <label htmlFor="note-content" className="text-xs font-medium text-text-primary block">
                Content
              </label>
              <Textarea
                id="note-content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note markdown, meeting minutes, or ideas here..."
                disabled={isSubmitting}
                className="min-h-[200px] text-sm leading-relaxed"
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
                <span>{isEditing ? 'Save Changes' : 'Create Note'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NoteDialog;
