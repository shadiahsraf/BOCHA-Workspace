import { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  Layers,
  NotebookPen,
  Clock,
  Plus,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/stores/localeStore';
import { useDashboardData } from '@/hooks/useDashboardData';
import type { TaskItem, ProjectItem, NoteItem, MetricItem } from '@/types/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Re-export types for backward compatibility
export type MockTask = TaskItem;
export type MockProject = ProjectItem;
export type MockNote = NoteItem;
export type MockMetric = MetricItem;

// ==========================================
// Helper Functions
// ==========================================

function getGreeting(locale: string, hour = new Date().getHours()): string {
  if (locale === 'ar') {
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  }
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

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

export interface DashboardPageProps {
  locale?: 'en' | 'ar';
}

export function DashboardPage({ locale: localeProp }: DashboardPageProps = {}) {
  const storeLocale = useLocaleStore((s) => s.locale);
  const locale = localeProp ?? storeLocale;
  const [aiPrompt, setAiPrompt] = useState('');

  const { tasks, projects, notes, isLoading, error, toggleTask, refetch } =
    useDashboardData();

  const now = new Date();
  const greeting = getGreeting(locale, now.getHours());
  const formattedDate = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now);

  const completedCount = tasks.filter((t) => t.completed).length;

  const metrics: MetricItem[] = [
    {
      id: 'tasks',
      label: 'Priority Tasks',
      value: tasks.length,
      change: `${completedCount} completed`,
      trend: 'up',
      icon: CheckSquare,
    },
    {
      id: 'projects',
      label: 'Active Projects',
      value: projects.length,
      change: `${projects.filter((p) => p.progress >= 70).length} near completion`,
      trend: 'neutral',
      icon: Layers,
    },
    {
      id: 'notes',
      label: 'Notes & Docs',
      value: notes.length,
      change: 'Synced from API',
      trend: 'up',
      icon: NotebookPen,
    },
    {
      id: 'ai',
      label: 'AI Interactions',
      value: '156',
      change: '94% helpfulness',
      trend: 'up',
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-10 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              {greeting}, Workspace User
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Here is your overview and active focus for today.
            </p>
          </div>
          <span className="text-xs sm:text-sm font-medium text-text-secondary-accessible shrink-0">
            {formattedDate}
          </span>
        </div>

        {/* Error Notification Banner with Retry */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-start flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  Backend API Connection Notice
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {error} (Ensure Django is running on port 8000)
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              className="h-8 text-xs gap-1.5 shrink-0 self-end sm:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        )}

        {/* Quick AI Command Prompt */}
        <div className="w-full">
          <Input
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            startAdornment={<Sparkles className="h-4 w-4 text-primary" />}
            endAdornment={
              <Button size="sm" variant="primary" className="h-7 text-xs px-3 shadow-xs">
                Ask AI
              </Button>
            }
            placeholder={
              locale === 'ar'
                ? 'اسأل المساعد الذكي عن أي شيء أو اكتب أمراً...'
                : 'Ask AI assistant anything or type a quick command...'
            }
            className="h-11 text-sm bg-surface shadow-xs"
          />
        </div>
      </section>

      {/* 2. KPI Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={`metric-skel-${i}`} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 w-3/4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-7 w-14" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-11 w-11 rounded-xl" />
                </div>
              </Card>
            ))
          : metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card
                  key={metric.id}
                  className="relative overflow-hidden transition-all duration-normal hover:shadow-md hover:-translate-y-0.5 motion-reduce:transform-none"
                >
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="space-y-1 text-start">
                      <span className="text-xs font-medium text-text-secondary">
                        {metric.label}
                      </span>
                      <div className="text-2xl font-bold text-text-primary tracking-tight">
                        {metric.value}
                      </div>
                      <span className="text-xs text-text-secondary-accessible block">
                        {metric.change}
                      </span>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-text-primary dark:text-primary border border-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </section>

      {/* 3. Main Content Grid (Tasks Column + Projects/Notes Column) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Priority Tasks (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="flex flex-col shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Priority Tasks</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  {isLoading
                    ? 'Loading tasks from backend...'
                    : `${completedCount} of ${tasks.length} tasks completed`}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>New Task</span>
              </Button>
            </CardHeader>

            <CardContent className="space-y-3 flex-1">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={`task-skel-${i}`} className="space-y-2 py-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                    {i < 3 && <Separator className="my-2" />}
                  </div>
                ))
              ) : tasks.length === 0 ? (
                <div className="py-8 text-center text-text-secondary text-sm">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 text-text-secondary/50" />
                  <p className="font-medium">No priority tasks found</p>
                  <p className="text-xs text-text-secondary-accessible mt-1">
                    Tasks created in Django or via the API will display here.
                  </p>
                </div>
              ) : (
                tasks.map((task, idx) => (
                  <div key={task.id}>
                    <div className="flex items-start gap-3 py-1.5 transition-colors">
                      <div className="pt-0.5">
                        <Checkbox
                          id={String(task.id)}
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          aria-label={`Mark "${task.title}" as ${
                            task.completed ? 'incomplete' : 'complete'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1 text-start">
                        <label
                          htmlFor={String(task.id)}
                          className={cn(
                            'text-sm font-medium cursor-pointer block leading-snug transition-colors',
                            task.completed
                              ? 'line-through text-text-secondary'
                              : 'text-text-primary'
                          )}
                        >
                          {task.title}
                        </label>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.dueDate}
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 rounded bg-surface-secondary text-[11px] font-medium text-text-secondary">
                            {task.project}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {getPriorityBadge(task.priority)}
                      </div>
                    </div>
                    {idx < tasks.length - 1 && <Separator className="my-2" />}
                  </div>
                ))
              )}
            </CardContent>

            <CardFooter className="pt-2 border-t border-border flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 text-xs text-text-secondary">
              <span>Focus tasks synced via REST API</span>
              <button
                type="button"
                className="text-primary hover:underline font-medium text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                View all tasks →
              </button>
            </CardFooter>
          </Card>
        </div>

        {/* Column 2: Active Projects & Recent Notes (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Projects Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Active Projects</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Milestones and initiatives in flight
                </CardDescription>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-soft text-text-primary dark:text-primary border border-primary/20">
                {isLoading ? '...' : `${projects.length} active`}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`proj-skel-${i}`} className="space-y-2 py-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    {i < 2 && <Separator className="my-2" />}
                  </div>
                ))
              ) : projects.length === 0 ? (
                <div className="py-6 text-center text-text-secondary text-sm">
                  <Layers className="h-7 w-7 mx-auto mb-2 text-text-secondary/50" />
                  <p className="font-medium">No active projects</p>
                  <p className="text-xs text-text-secondary-accessible mt-1">
                    Add projects to track your key milestones.
                  </p>
                </div>
              ) : (
                projects.map((project, idx) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-medium text-text-primary truncate">
                          {project.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-secondary text-text-secondary border border-border shrink-0">
                          {project.category}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-text-primary shrink-0">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} />
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>
                        {project.tasksCompleted} of {project.tasksTotal} tasks
                      </span>
                      <span>Target: {project.dueDate}</span>
                    </div>
                    {idx < projects.length - 1 && <Separator className="my-2" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Notes Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-semibold">Recent Notes</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Quick memos and architecture logs
                </CardDescription>
              </div>
              <button
                type="button"
                className="text-xs text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                Open Notebook
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`note-skel-${i}`} className="space-y-2 py-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    {i < 2 && <Separator className="my-1.5" />}
                  </div>
                ))
              ) : notes.length === 0 ? (
                <div className="py-6 text-center text-text-secondary text-sm">
                  <NotebookPen className="h-7 w-7 mx-auto mb-2 text-text-secondary/50" />
                  <p className="font-medium">No notes available</p>
                  <p className="text-xs text-text-secondary-accessible mt-1">
                    Create architecture memos or notes.
                  </p>
                </div>
              ) : (
                notes.map((note, idx) => (
                  <div key={note.id}>
                    <button
                      type="button"
                      className="w-full text-start space-y-1 p-2 -mx-2 rounded-lg transition-colors hover:bg-surface-secondary/60 focus-visible:bg-surface-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 block group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                          {note.title}
                        </h4>
                        <span className="text-[11px] text-text-secondary shrink-0 ms-2">
                          {note.updatedAt}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary-accessible line-clamp-1 leading-relaxed">
                        {note.snippet}
                      </p>
                    </button>
                    {idx < notes.length - 1 && <Separator className="my-1.5" />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
