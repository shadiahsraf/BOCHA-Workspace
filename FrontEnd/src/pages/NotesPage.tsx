import { useState } from 'react';
import {
  Notebook,
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
import { useNotes } from '@/hooks/useNotes';
import type { NoteItem, CreateNotePayload } from '@/types/api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { NoteDialog } from '@/components/notes/NoteDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotesPage() {
  const {
    filteredNotes,
    categories,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addNote,
    editNote,
    removeNote,
    refetch,
  } = useNotes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteItem | null>(null);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (note: NoteItem) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleOpenDelete = (note: NoteItem) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleSaveNote = async (data: CreateNotePayload) => {
    if (editingNote) {
      await editNote(editingNote.id, data);
    } else {
      await addNote(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      await removeNote(noteToDelete.id);
      setNoteToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary-soft text-text-primary dark:text-primary flex items-center justify-center border border-primary/20">
              <Notebook className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Notes &amp; Docs</h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Capture architecture memos, personal reflections, and quick ideas.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          variant="primary"
          size="sm"
          className="gap-1.5 h-9 px-4 text-xs shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
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

      {/* 2. Filter Toolbar (Categories Pills + Search Input) */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full transition-colors shrink-0',
              selectedCategory === 'all'
                ? 'bg-primary text-text-primary dark:text-background shadow-xs'
                : 'bg-surface-secondary text-text-secondary hover:text-text-primary border border-border'
            )}
          >
            All Notes
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-full transition-colors shrink-0',
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-primary text-text-primary dark:text-background shadow-xs'
                  : 'bg-surface-secondary text-text-secondary hover:text-text-primary border border-border'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:max-w-xs">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            startAdornment={<Search className="h-4 w-4 text-text-secondary" />}
            className="h-9 text-xs w-full"
          />
        </div>
      </section>

      {/* 3. Notes Grid */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={`note-skel-${i}`} className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="pt-2 border-t border-border">
                  <Skeleton className="h-3 w-20" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <EmptyState
            title={
              searchQuery || selectedCategory !== 'all'
                ? 'No Matching Notes'
                : 'No Notes Created Yet'
            }
            description={
              searchQuery || selectedCategory !== 'all'
                ? 'Try searching with different terms or selecting another category.'
                : 'Write your first note to build your personal knowledge base.'
            }
            icon={Notebook}
            actionButton={
              !searchQuery && selectedCategory === 'all' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreate}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create First Note</span>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                onClick={() => handleOpenEdit(note)}
                className="flex flex-col justify-between transition-all duration-normal hover:shadow-md hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer group"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border">
                      {note.category}
                    </span>

                    {/* Actions Dropdown */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="h-7 w-7 rounded-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                            aria-label="Note actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(note)}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(note)}
                            className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CardTitle className="text-base font-semibold text-text-primary mt-2 group-hover:text-primary transition-colors line-clamp-1">
                    {note.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 pb-3 flex-1">
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {note.snippet || note.content}
                  </p>
                </CardContent>

                <CardFooter className="border-t border-border pt-2.5 flex items-center justify-between text-[11px] text-text-secondary">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {note.updatedAt}
                  </span>
                  <span className="text-[10px] text-text-secondary-accessible">
                    {note.content ? `${note.content.length} chars` : ''}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <NoteDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        note={editingNote}
        onSave={handleSaveNote}
      />

      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        itemName={noteToDelete?.title}
      />
    </div>
  );
}

export default NotesPage;
