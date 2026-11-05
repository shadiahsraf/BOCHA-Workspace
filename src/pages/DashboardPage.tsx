import { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  Layers,
  NotebookPen,
  Clock,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/stores/localeStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// ==========================================
// Mock Data Interfaces
// ==========================================

export interface MockMetric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export interface MockTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  project: string;
}

export interface MockProject {
  id: string;
  title: string;
  category: string;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  dueDate: string;
}

export interface MockNote {
  id: string;
  title: string;
  snippet: string;
  updatedAt: string;
  category: string;
}

// ==========================================
// Initial Mock Datasets
// ==========================================

const mockMetrics: MockMetric[] = [
  {
    id: 'tasks',
    label: 'Priority Tasks',
    value: '12',
    change: '+3 due today',
    trend: 'up',
    icon: CheckSquare,
  },
  {
    id: 'projects',
    label: 'Active Projects',
    value: '4',
    change: '2 near completion',
    trend: 'neutral',
    icon: Layers,
  },
  {
    id: 'notes',
    label: 'Notes & Docs',
    value: '48',
    change: '+8 this week',
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

const initialTasks: MockTask[] = [
  {
    id: 'task-1',
    title: 'Review LifeOS Design System Tokens & Typography',
    completed: false,
    dueDate: 'Today, 5:00 PM',
    priority: 'urgent',
    project: 'LifeOS Core',
  },
  {
    id: 'task-2',
    title: 'Implement Calendar Event Sync Provider & Hooks',
    completed: false,
    dueDate: 'Tomorrow',
    priority: 'high',
    project: 'Calendar',
  },
  {
    id: 'task-3',
    title: 'Draft weekly personal reflection & habit audit',
    completed: false,
    dueDate: 'Friday',
    priority: 'medium',
    project: 'Habits',
  },
  {
    id: 'task-4',
    title: 'Audit WCAG 2.2 AA contrast for light beige theme',
    completed: true,
    dueDate: 'Yesterday',
    priority: 'low',
    project: 'Design System',
  },
  {
    id: 'task-5',
    title: 'Optimize offline SQLite schema caching & migrations',
    completed: false,
    dueDate: 'In 3 days',
    priority: 'medium',
    project: 'Backend',
  },
];

const mockProjects: MockProject[] = [
  {
    id: 'proj-1',
    title: 'LifeOS Core Application',
    category: 'Engineering',
    progress: 75,
    tasksCompleted: 9,
    tasksTotal: 12,
    dueDate: 'Nov 15',
  },
  {
    id: 'proj-2',
    title: 'AI Assistant Interaction Pipeline',
    category: 'AI / LLM',
    progress: 45,
    tasksCompleted: 5,
    tasksTotal: 11,
    dueDate: 'Nov 22',
  },
  {
    id: 'proj-3',
    title: 'Arabic RTL Layout Refinement',
    category: 'i18n & UX',
    progress: 90,
    tasksCompleted: 9,
    tasksTotal: 10,
    dueDate: 'Nov 10',
  },
];

const mockNotes: MockNote[] = [
  {
    id: 'note-1',
    title: 'Sprint Architecture & Layout Strategy',
    snippet: 'Exploring collapsible sidebars with Radix tooltips and CSS logical properties.',
    updatedAt: '2 hours ago',
    category: 'Engineering',
  },
  {
    id: 'note-2',
    title: 'Personal Habit Scorecard Q4',
    snippet: 'Tracking daily mindfulness, deep work blocks, and physical recovery metrics.',
    updatedAt: 'Yesterday',
    category: 'Personal',
  },
  {
    id: 'note-3',
    title: 'Prompt Engineering Reference Guide',
    snippet: 'Chain-of-thought instructions and task decomposition prompts for productivity.',
    updatedAt: '3 days ago',
    category: 'AI Assistant',
  },
  {
    id: 'note-4',
    title: 'Health & Workout Routine',
    snippet: 'Hypertrophy schedule and recovery tracking across weekly intervals.',
    updatedAt: '4 days ago',
    category: 'Health',
  },
];

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

function getPriorityBadge(priority: MockTask['priority']) {
  switch (priority) {
    case 'urgent':
      return <Badge variant="destructive" size="sm">Urgent</Badge>;
    case 'high':
      return <Badge variant="warning" size="sm">High</Badge>;
    case 'medium':
      return <Badge variant="default" size="sm">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary" size="sm">Low</Badge>;
  }
}

export interface DashboardPageProps {
  locale?: 'en' | 'ar';
}

export function DashboardPage({ locale: localeProp }: DashboardPageProps = {}) {
  const storeLocale = useLocaleStore((s) => s.locale);
  const locale = localeProp ?? storeLocale;
  const [tasks, setTasks] = useState<MockTask[]>(initialTasks);
  const [aiPrompt, setAiPrompt] = useState('');

  const now = new Date();
  const greeting = getGreeting(locale, now.getHours());
  const formattedDate = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now);

  const completedCount = tasks.filter((t) => t.completed).length;

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

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
        {mockMetrics.map((metric) => {
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
                  {completedCount} of {tasks.length} tasks completed
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>New Task</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              {tasks.map((task, idx) => (
                <div key={task.id}>
                  <div className="flex items-start gap-3 py-1.5 transition-colors">
                    <div className="pt-0.5">
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        aria-label={`Mark "${task.title}" as ${
                          task.completed ? 'incomplete' : 'complete'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1 text-start">
                      <label
                        htmlFor={task.id}
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
              ))}
            </CardContent>
            <CardFooter className="pt-2 border-t border-border flex justify-between text-xs text-text-secondary">
              <span>Focus tasks due within 72 hours</span>
              <button
                type="button"
                className="text-primary hover:underline font-medium text-xs focus-visible:outline-none"
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
                {mockProjects.length} active
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockProjects.map((project, idx) => (
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
                  {idx < mockProjects.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
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
                className="text-xs text-primary hover:underline font-medium focus-visible:outline-none"
              >
                Open Notebook
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockNotes.map((note, idx) => (
                <div
                  key={note.id}
                  className="space-y-1 text-start group cursor-pointer"
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
                  {idx < mockNotes.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
