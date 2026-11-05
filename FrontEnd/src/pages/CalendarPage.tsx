import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, type View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import {
  Calendar as CalendarIcon,
  Layers,
  CheckSquare,
  RefreshCw,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { useCalendar, type CalendarEvent } from '@/hooks/useCalendar';
import { updateTask } from '@/services/tasksService';
import { updateProject } from '@/services/projectsService';
import type { TaskItem, ProjectItem, CreateTaskPayload, CreateProjectPayload } from '@/types/api';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import '@/styles/calendar.css';

// Initialize date-fns localizer for react-big-calendar
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

type FilterType = 'all' | 'tasks' | 'projects';

export function CalendarPage() {
  const { events, projects, isLoading, error, refresh } = useCalendar();

  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [filterType, setFilterType] = useState<FilterType>('all');

  // Modal States
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  // Filter events based on selected filter
  const filteredEvents = useMemo(() => {
    if (filterType === 'tasks') {
      return events.filter((e) => e.type === 'task');
    }
    if (filterType === 'projects') {
      return events.filter((e) => e.type === 'project');
    }
    return events;
  }, [events, filterType]);

  // Event Click Handler
  const handleSelectEvent = (event: CalendarEvent) => {
    if (event.type === 'task' && event.rawTask) {
      setSelectedTask(event.rawTask);
      setIsTaskDialogOpen(true);
    } else if (event.type === 'project' && event.rawProject) {
      setSelectedProject(event.rawProject);
      setIsProjectDialogOpen(true);
    }
  };

  // Event Styling Configuration
  const eventPropGetter = (event: CalendarEvent) => {
    if (event.type === 'project') {
      return {
        className:
          'bg-indigo-600/90 text-white dark:bg-indigo-700 dark:text-indigo-50 border border-indigo-700/80 shadow-xs',
        style: {
          backgroundColor: undefined,
        },
      };
    }

    const isCompleted = event.rawTask?.completed;
    const priority = event.rawTask?.priority;

    if (isCompleted) {
      return {
        className:
          'line-through opacity-70 bg-surface-secondary text-text-secondary border border-border',
        style: {
          backgroundColor: undefined,
        },
      };
    }

    if (priority === 'urgent' || priority === 'high') {
      return {
        className:
          'bg-destructive/90 text-white dark:bg-destructive dark:text-white border border-destructive shadow-xs',
        style: {
          backgroundColor: undefined,
        },
      };
    }

    return {
      className:
        'bg-primary/90 text-white dark:bg-primary dark:text-white border border-primary/90 shadow-xs',
      style: {
        backgroundColor: undefined,
      },
    };
  };

  // Custom Event Inner Renderer
  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    if (event.type === 'project') {
      return (
        <div className="flex items-center gap-1.5 truncate text-xs font-medium py-0.5">
          <Layers className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{event.title}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 truncate text-xs font-medium py-0.5">
        <CheckSquare className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{event.title}</span>
      </div>
    );
  };

  // Dialog Save Handlers
  const handleSaveTask = async (data: CreateTaskPayload) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, data);
      await refresh();
      setIsTaskDialogOpen(false);
    }
  };

  const handleSaveProject = async (data: CreateProjectPayload) => {
    if (selectedProject) {
      await updateProject(selectedProject.id, data);
      await refresh();
      setIsProjectDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <span>Calendar</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Unified schedule of upcoming project deadlines and task due dates.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="inline-flex rounded-lg border border-border bg-surface p-1 shadow-xs text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors font-medium',
                filterType === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              All ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('tasks')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors font-medium',
                filterType === 'tasks'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Tasks ({events.filter((e) => e.type === 'task').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('projects')}
              className={cn(
                'px-2.5 py-1 rounded-md transition-colors font-medium',
                filterType === 'projects'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Projects ({events.filter((e) => e.type === 'project').length})
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refresh()}
            disabled={isLoading}
            className="gap-1.5 shadow-xs"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Legend & Summary Info */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary py-1 border-y border-border/60">
        <span className="font-semibold text-text-primary flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-text-secondary" /> Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          <span>Projects</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
          <span>Urgent/High Tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span>Standard Tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-surface-secondary border border-border" />
          <span>Completed</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Schedule</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Calendar Grid Container */}
      <Card className="border border-border bg-surface shadow-sm overflow-hidden p-4">
        <div className="lifeos-calendar h-[720px] min-h-[580px]">
          <Calendar<CalendarEvent>
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            defaultView={Views.MONTH}
            view={currentView}
            onView={(v) => setCurrentView(v)}
            date={currentDate}
            onNavigate={(d) => setCurrentDate(d)}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            components={{
              event: CustomEvent,
            }}
            popup
          />
        </div>
      </Card>

      {/* Modals for Direct Editing */}
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        projects={projects}
        onSave={handleSaveTask}
      />

      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onClose={() => {
          setIsProjectDialogOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSave={handleSaveProject}
      />
    </div>
  );
}
