import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';
import {
  Inbox as InboxIcon,
  Plus,
  CheckSquare,
  BookOpen,
  Trash2,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { useInbox } from '@/hooks/useInbox';
import { createTask } from '@/services/tasksService';
import { createNote } from '@/services/notesService';
import { fetchProjects } from '@/services/projectsService';
import type {
  InboxItem,
  ProjectItem,
  TaskItem,
  NoteItem,
  CreateTaskPayload,
  CreateNotePayload,
} from '@/types/api';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { NoteDialog } from '@/components/notes/NoteDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

export function InboxPage() {
  const { items, isLoading, isSubmitting, error, addItem, deleteItem, refresh } = useInbox();

  const [inputVal, setInputVal] = useState('');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Conversion States
  const [convertingTaskItem, setConvertingTaskItem] = useState<InboxItem | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const [convertingNoteItem, setConvertingNoteItem] = useState<InboxItem | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

  // Load project options for TaskDialog
  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => {});
  }, []);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Quick Capture Submit Handler
  const handleCapture = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const text = inputVal.trim();
    if (!text || isSubmitting) return;

    try {
      setInputVal('');
      await addItem(text);
      inputRef.current?.focus();
    } catch {
      // Error handled by hook
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCapture();
    }
  };

  // Convert to Task Flow
  const handleStartConvertToTask = (item: InboxItem) => {
    setConvertingTaskItem(item);
    setIsTaskDialogOpen(true);
  };

  const draftTask: TaskItem | null = convertingTaskItem
    ? {
        id: 'draft',
        title: convertingTaskItem.text,
        status: 'todo',
        completed: false,
        dueDate: 'No due date',
        priority: 'medium',
        project: 'General',
      }
    : null;

  const handleSaveConvertedTask = async (data: CreateTaskPayload) => {
    if (convertingTaskItem) {
      await createTask(data);
      await deleteItem(convertingTaskItem.id);
      setIsTaskDialogOpen(false);
      setConvertingTaskItem(null);
    }
  };

  // Convert to Note Flow
  const handleStartConvertToNote = (item: InboxItem) => {
    setConvertingNoteItem(item);
    setIsNoteDialogOpen(true);
  };

  const draftNote: NoteItem | null = convertingNoteItem
    ? {
        id: 'draft',
        title:
          convertingNoteItem.text.length > 50
            ? convertingNoteItem.text.slice(0, 50) + '...'
            : convertingNoteItem.text,
        content: convertingNoteItem.text,
        snippet: convertingNoteItem.text.slice(0, 100),
        updatedAt: 'Just now',
        category: 'General',
      }
    : null;

  const handleSaveConvertedNote = async (data: CreateNotePayload) => {
    if (convertingNoteItem) {
      await createNote(data);
      await deleteItem(convertingNoteItem.id);
      setIsNoteDialogOpen(false);
      setConvertingNoteItem(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <InboxIcon className="h-6 w-6 text-primary" />
            <span>Inbox</span>
            {items.length > 0 && (
              <Badge variant="outline" className="ms-1 font-mono text-xs">
                {items.length}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Capture thoughts, ideas, and fleeting todos without friction. Process them when ready.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refresh()}
          disabled={isLoading}
          className="self-start sm:self-auto gap-1.5 shadow-xs"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
          <span>Refresh</span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Hero Quick Capture Bar */}
      <Card className="border border-border bg-surface shadow-sm overflow-hidden">
        <form onSubmit={handleCapture}>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind? (Press Enter to capture)"
                className="h-12 text-base px-4 pr-10 border-border/80 focus-visible:ring-primary shadow-xs"
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!inputVal.trim() || isSubmitting}
              className="h-12 px-6 gap-2 text-sm font-semibold shrink-0 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Spinner aria-hidden={true} className="h-4 w-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Capture</span>
                </>
              )}
            </Button>
          </div>
          <div className="px-5 pb-3 pt-0 flex items-center gap-2 text-xs text-text-secondary border-t border-border/40 bg-surface-secondary/20">
            <Lightbulb className="h-3.5 w-3.5 text-warning shrink-0" />
            <span>
              Quick dump raw thoughts, links, or tasks. Convert them later into Projects, Tasks, or Notes.
            </span>
          </div>
        </form>
      </Card>

      {/* Feed List */}
      <div className="space-y-3">
        {isLoading && items.length === 0 ? (
          <div className="py-16 text-center">
            <Spinner aria-hidden={true} className="h-8 w-8 mx-auto text-primary" />
            <p className="text-sm text-text-secondary mt-3">Loading inbox items...</p>
          </div>
        ) : items.length === 0 ? (
          /* Empty State: Inbox Zero */
          <EmptyState
            title="Inbox Zero"
            description="All your thoughts and tasks are processed. Capture something above whenever inspiration strikes!"
            icon={CheckCircle2}
          />
        ) : (
          /* Captured Items Feed */
          items.map((item) => (
            <Card
              key={item.id}
              className="group border border-border bg-surface shadow-xs hover:shadow-sm hover:border-border/90 transition-all p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm text-text-primary whitespace-pre-wrap break-words leading-relaxed font-normal">
                  {item.text}
                </p>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>{item.createdAt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStartConvertToTask(item)}
                  className="h-8 text-xs gap-1.5"
                  title="Convert to Task"
                >
                  <CheckSquare className="h-3.5 w-3.5 text-primary" />
                  <span>Task</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStartConvertToNote(item)}
                  className="h-8 text-xs gap-1.5"
                  title="Convert to Note"
                >
                  <BookOpen className="h-3.5 w-3.5 text-text-secondary" />
                  <span>Note</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteItem(item.id)}
                  className="h-8 px-2.5 text-text-secondary hover:text-destructive hover:bg-destructive-soft transition-colors"
                  title="Dismiss / Delete"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Conversion Dialogs */}
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setConvertingTaskItem(null);
        }}
        task={draftTask}
        projects={projects}
        onSave={handleSaveConvertedTask}
      />

      <NoteDialog
        isOpen={isNoteDialogOpen}
        onClose={() => {
          setIsNoteDialogOpen(false);
          setConvertingNoteItem(null);
        }}
        note={draftNote}
        onSave={handleSaveConvertedNote}
      />
    </div>
  );
}
