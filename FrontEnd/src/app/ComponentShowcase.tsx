import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { useLocaleStore } from '@/stores/localeStore';
import { useDirection } from '@/hooks/useDirection';

// 19 UI Primitives
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Lucide Icons
import {
  Search,
  Trash2,
  Settings,
  Sparkles,
  Plus,
  Moon,
  Sun,
  Laptop,
  Globe,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Mail,
  User,
  Sliders,
} from 'lucide-react';

/**
 * Interactive Component Showcase presenting all 19 Phase 4 UI primitives
 * across Theme (Light/Dark) and Direction (LTR/RTL) axes.
 */
export function ComponentShowcase() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const { direction, isRtl } = useDirection();

  // Interactive component states
  const [btnLoading, setBtnLoading] = useState(false);
  const [progressVal, setProgressVal] = useState(35);
  const [checkboxVal, setCheckboxVal] = useState<boolean | 'indeterminate'>(true);
  const [switchVal, setSwitchVal] = useState(true);
  const [selectVal, setSelectVal] = useState('engineering');
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showUrls, setShowUrls] = useState(false);
  const [personVal, setPersonVal] = useState('sarah');

  // Progress bar animated interval
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressVal((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <TooltipProvider>
      <section className="space-y-10 pb-16">
        {/* Showcase Banner & Quick Switchers */}
        <div className="rounded-xl border border-primary/20 bg-primary-soft p-6 text-text-primary shadow-xs">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm">Phase 4 Complete</Badge>
                <span className="text-xs text-text-secondary">19 UI Primitives Matrix ({direction.toUpperCase()})</span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                {isRtl ? 'معرض مكوّنات النظام الموحّد' : 'LifeOS Component System Showcase'}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {isRtl
                  ? 'اختبار تفاعلي حي لجميع المكوّنات عبر محوري السمات (فاتح/داكن) والاتجاه (عربي/إنجليزي).'
                  : 'Live multi-axis interactive testing across Light/Dark themes and English/Arabic reading directions.'}
              </p>
            </div>

            {/* Quick Control Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Locale Selector */}
              <div className="flex items-center rounded-lg border border-border bg-surface p-1 shadow-xs">
                <Button
                  variant={locale === 'en' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setLocale('en')}
                  className="h-7 px-2.5 text-xs"
                >
                  <Globe className="me-1.5 h-3.5 w-3.5" />
                  English
                </Button>
                <Button
                  variant={locale === 'ar' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setLocale('ar')}
                  className="h-7 px-2.5 text-xs"
                >
                  <Globe className="me-1.5 h-3.5 w-3.5" />
                  العربية
                </Button>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center rounded-lg border border-border bg-surface p-1 shadow-xs">
                <IconButton
                  aria-label="Light mode"
                  variant={theme === 'light' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className="h-7 w-7"
                >
                  <Sun className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                  aria-label="Dark mode"
                  variant={theme === 'dark' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="h-7 w-7"
                >
                  <Moon className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton
                  aria-label="System mode"
                  variant={theme === 'system' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setTheme('system')}
                  className="h-7 w-7"
                >
                  <Laptop className="h-3.5 w-3.5" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Actions & Layout Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Button Variants & Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>1. Button & Loading State</CardTitle>
              <CardDescription>
                Variants, sizes, and layout-preserving asynchronous loading states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Button
                  isLoading={btnLoading}
                  onClick={() => setBtnLoading(!btnLoading)}
                  variant="primary"
                >
                  {btnLoading ? 'Processing...' : 'Simulate Async Action'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setBtnLoading(!btnLoading)}
                >
                  Toggle State
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-text-secondary border-t border-border pt-4">
              Focus rings use 2px primary with 2px surface offset (WCAG AA).
            </CardFooter>
          </Card>

          {/* IconButton & Separator */}
          <Card>
            <CardHeader>
              <CardTitle>2. IconButton & Separator</CardTitle>
              <CardDescription>
                Accessible name enforcement, size scaling, and vertical/horizontal dividers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <IconButton aria-label="Search items" size="sm" variant="secondary">
                  <Search className="h-3.5 w-3.5" />
                </IconButton>
                <IconButton aria-label="Configure settings" size="md" variant="outline">
                  <Settings className="h-4 w-4" />
                </IconButton>
                <IconButton aria-label="Delete entry" size="lg" variant="danger">
                  <Trash2 className="h-5 w-5" />
                </IconButton>
                <IconButton aria-label="AI assistant" size="md" variant="primary">
                  <Sparkles className="h-4 w-4" />
                </IconButton>
              </div>

              <Separator />

              <div className="flex h-10 items-center gap-4 text-sm">
                <span>LifeOS Shell</span>
                <Separator orientation="vertical" />
                <span>Bilingual RTL</span>
                <Separator orientation="vertical" />
                <span>Zero Latency</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Form Controls Grid */}
        <Card>
          <CardHeader>
            <CardTitle>3. Form Controls</CardTitle>
            <CardDescription>
              Input sizes, error states, logical start/end adornments, textarea, checkbox, switch, and select dropdown.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Inputs & Textareas */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                inputSize="sm"
                placeholder="Search queries..."
                startAdornment={<Search className="h-3.5 w-3.5" />}
              />
              <Input
                inputSize="md"
                placeholder="User email address..."
                endAdornment={<Mail className="h-4 w-4" />}
              />
              <Input
                inputSize="md"
                error
                defaultValue="invalid.value@"
                placeholder="Invalid input state"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Textarea
                placeholder="Standard multiline note input..."
                rows={3}
              />
              <Textarea
                error
                placeholder="Textarea with destructive error border..."
                rows={3}
                defaultValue="Error: Exceeded allocated token context."
              />
            </div>

            <Separator />

            {/* Select, Checkbox, Switch Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Select Primitive */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary">
                  Team Department
                </label>
                <Select value={selectVal} onValueChange={setSelectVal}>
                  <SelectTrigger aria-label="Department selector">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Engineering</SelectLabel>
                      <SelectItem value="frontend">Frontend Architecture</SelectItem>
                      <SelectItem value="backend">Backend & Distributed</SelectItem>
                      <SelectItem value="ai">AI Research & Agents</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Operations</SelectLabel>
                      <SelectItem value="product">Product Management</SelectItem>
                      <SelectItem value="design">Design Systems</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Checkbox States */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-text-secondary">Checkbox States</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <Checkbox
                      checked={checkboxVal}
                      onCheckedChange={setCheckboxVal}
                    />
                    <span>Allow system notifications</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <Checkbox checked="indeterminate" />
                    <span>Partial task sync</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm opacity-50 cursor-not-allowed">
                    <Checkbox disabled checked={false} />
                    <span>Disabled permission</span>
                  </label>
                </div>
              </div>

              {/* Switch States */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-text-secondary">Switch Toggles</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center justify-between gap-2 text-sm cursor-pointer">
                    <span>Hardware acceleration</span>
                    <Switch checked={switchVal} onCheckedChange={setSwitchVal} />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-sm cursor-pointer">
                    <span>Reduced motion</span>
                    <Switch checked={false} />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-sm opacity-50 cursor-not-allowed">
                    <span>Enterprise audit log</span>
                    <Switch disabled checked={true} />
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Feedback Primitives Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Badges & Spinners */}
          <Card>
            <CardHeader>
              <CardTitle>4. Badges & Spinners</CardTitle>
              <CardDescription>
                Semantic status badges (WCAG 2.2 AA compliant) and animated spinners.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-text-secondary">Badge Variants</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Primary Soft</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-text-secondary">Badge Sizes</span>
                <div className="flex items-center gap-2">
                  <Badge size="sm" variant="success">Completed (sm)</Badge>
                  <Badge size="md" variant="success">Completed (md)</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="text-xs font-semibold text-text-secondary">Spinners</span>
                <div className="flex items-center gap-4">
                  <Spinner size="sm" label="Small loading" />
                  <Spinner size="md" label="Medium loading" />
                  <Spinner size="lg" label="Large loading" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skeletons & Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>5. Skeletons & Alerts</CardTitle>
              <CardDescription>
                Placeholder pulses and decoupled accessible alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skeleton Group */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>

              <Separator />

              {/* Alerts */}
              <div className="space-y-3">
                <Alert variant="info" role="status">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Bilingual System Advisory</AlertTitle>
                  <AlertDescription>
                    All portals and dialogs automatically synchronize with reading direction.
                  </AlertDescription>
                </Alert>

                <Alert variant="success" role="status">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Operation Completed</AlertTitle>
                  <AlertDescription>
                    Data storage and persistence rehydrated successfully.
                  </AlertDescription>
                </Alert>

                <Alert variant="warning" role="status">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Storage Warning</AlertTitle>
                  <AlertDescription>
                    Local persistence storage is approaching 80% capacity.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription>
                    Session token requires periodic revalidation.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Navigation & Data Display */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>6. Tabs Navigation</CardTitle>
              <CardDescription>
                Accessible tab switching with bidirectional keyboard roving focus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tasks">Tasks (14)</TabsTrigger>
                  <TabsTrigger value="notes">Notes (5)</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks" className="rounded-md border border-border p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Daily Productivity Checklist</div>
                    <p className="text-xs text-text-secondary">
                      Keyboard arrow keys invert automatically between LTR and RTL.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="notes" className="rounded-md border border-border p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Quick Capture Notes</div>
                    <p className="text-xs text-text-secondary">5 unorganized thoughts captured today.</p>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="rounded-md border border-border p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Workspace Preferences</div>
                    <p className="text-xs text-text-secondary">Configure defaults, locale, and persistence.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Avatar & Animated Progress */}
          <Card>
            <CardHeader>
              <CardTitle>7. Avatar & Progress</CardTitle>
              <CardDescription>
                Image fallbacks and hardware-accelerated RTL-aware progress indicator.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatars */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-text-secondary">User Avatars</span>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" alt="Sarah Connor" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>عس</AvatarFallback>
                  </Avatar>
                  <div className="ps-2 text-xs text-text-secondary">
                    Initial fallbacks rendered with semantic surface tokens.
                  </div>
                </div>
              </div>

              <Separator />

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-secondary">Simulated Task Progress</span>
                  <span className="font-mono text-primary">{progressVal}%</span>
                </div>
                <Progress value={progressVal} />
                <p className="text-xs text-text-secondary">
                  Fills left-to-right in English, and right-to-left in Arabic via hardware-accelerated translateX.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. Interactive Overlays (Tooltips, DropdownMenu, Dialog) */}
        <Card>
          <CardHeader>
            <CardTitle>8. Interactive Overlays</CardTitle>
            <CardDescription>
              High-contrast tooltips, deep cascade dropdown menus with shortcuts, and modal dialogs with focus trapping.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {/* 1. Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Sparkles className="me-2 h-4 w-4 text-primary" />
                    Hover Tooltip
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>High-contrast contextual tooltip with AAA contrast.</p>
                </TooltipContent>
              </Tooltip>

              {/* 2. Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    <Sliders className="me-2 h-4 w-4" />
                    Action Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Account & Workspace</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <User className="me-2 h-4 w-4" />
                    <span>Profile Profile</span>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="me-2 h-4 w-4" />
                    <span>Inbox</span>
                    <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={showBookmarks}
                    onCheckedChange={setShowBookmarks}
                  >
                    Show Bookmarks Bar
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showUrls}
                    onCheckedChange={setShowUrls}
                  >
                    Show Full URLs
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ShareIcon className="me-2 h-4 w-4" />
                      <span>Share Workspace</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email invite</DropdownMenuItem>
                      <DropdownMenuItem>Copy public link</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Export as JSON</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={personVal} onValueChange={setPersonVal}>
                    <DropdownMenuLabel>Active Persona</DropdownMenuLabel>
                    <DropdownMenuRadioItem value="sarah">Sarah Connor</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="john">John Doe</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 3. Dialog Modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="primary">
                    <Plus className="me-2 h-4 w-4" />
                    Open Modal Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Quick Search & Action Palette</DialogTitle>
                    <DialogDescription>
                      Search through system pages, recent notes, and execute commands.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <Input
                      placeholder="Type a command or search..."
                      startAdornment={<Search className="h-4 w-4 text-text-secondary" />}
                    />
                    <div className="rounded-md border border-border p-3 text-xs text-text-secondary space-y-1">
                      <div className="font-semibold text-text-primary">Navigation Hints:</div>
                      <div>• Press <kbd className="rounded border px-1">Tab</kbd> to cycle inside focus scope.</div>
                      <div>• Press <kbd className="rounded border px-1">Esc</kbd> to close and restore focus.</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="primary">Confirm Action</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </section>
    </TooltipProvider>
  );
}

// Inline fallback icon for dropdown submenus
function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
