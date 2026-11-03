import { useThemeStore } from '@/stores/themeStore';

export function App() {
  const theme = useThemeStore((s) => s.theme);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="min-h-screen bg-background text-text-primary p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-10 pb-6 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LifeOS — Design System &amp; Theme Gallery</h1>
          <p className="mt-2 text-sm text-text-secondary-accessible">
            Phase 2 Design Tokens &amp; Phase 3.2 Theme Architecture (Zero-FOUC, OS Sync &amp; Cross-Tab Persistence)
          </p>
        </div>

        {/* Quick Theme Switcher Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-lg border border-border bg-surface shadow-xs shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              theme === 'light'
                ? 'bg-primary text-background shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
            aria-pressed={theme === 'light'}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              theme === 'dark'
                ? 'bg-primary text-background shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
            aria-pressed={theme === 'dark'}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              theme === 'system'
                ? 'bg-primary text-background shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
            }`}
            aria-pressed={theme === 'system'}
          >
            System
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-16">
        {/* Phase 3.2 Theme Architecture Section */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Theme Architecture (Phase 3.2)</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-primary-soft text-primary">
                Active
              </span>
            </div>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Synchronous anti-FOUC bootstrap, OS media query sync, safe validated storage, and real-time DOM coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-border bg-surface shadow-xs space-y-1">
              <div className="text-xs text-text-secondary-accessible font-medium">Selected Preference</div>
              <div className="text-lg font-bold capitalize flex items-center gap-2">
                <span>{theme}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-surface-secondary text-text-secondary-accessible border border-border">
                  mode
                </span>
              </div>
              <div className="text-xs text-text-secondary-accessible">Stored in lifeos-theme (v1)</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface shadow-xs space-y-1">
              <div className="text-xs text-text-secondary-accessible font-medium">Resolved Theme</div>
              <div className="text-lg font-bold capitalize flex items-center gap-2">
                <span>{resolvedTheme}</span>
                <span className={`text-xs font-normal px-2 py-0.5 rounded border ${
                  resolvedTheme === 'dark'
                    ? 'bg-surface-secondary text-primary border-primary/30'
                    : 'bg-primary-soft text-primary border-primary/20'
                }`}>
                  computed
                </span>
              </div>
              <div className="text-xs text-text-secondary-accessible">Evaluated via matchMedia / explicit</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface shadow-xs space-y-1">
              <div className="text-xs text-text-secondary-accessible font-medium">DOM &lt;html&gt; Class</div>
              <div className="text-lg font-bold font-mono text-primary flex items-center gap-2">
                <span>{resolvedTheme === 'dark' ? '.dark' : ':root (none)'}</span>
              </div>
              <div className="text-xs text-text-secondary-accessible">Toggles CSS custom property palette</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface shadow-xs space-y-1">
              <div className="text-xs text-text-secondary-accessible font-medium">Browser color-scheme</div>
              <div className="text-lg font-bold font-mono flex items-center gap-2">
                <span>{resolvedTheme}</span>
              </div>
              <div className="text-xs text-text-secondary-accessible">Aligns native scrollbars &amp; controls</div>
            </div>
          </div>
        </section>

        {/* 1. Core Palette Swatches & Opacity Demonstration */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Core Palette &amp; Opacity Utilities</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Tested across full opacity, /50, /20, and /10 alpha channels via canonical space-separated RGB custom properties.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Background */}
            <div className="p-4 rounded-lg border border-border bg-background">
              <div className="h-12 w-full rounded-md bg-background border border-border mb-2" />
              <div className="text-xs font-semibold">Background</div>
              <div className="text-xs text-text-secondary-accessible">#F7F7F5 (247 247 245)</div>
            </div>

            {/* Surface */}
            <div className="p-4 rounded-lg border border-border bg-surface shadow-xs">
              <div className="h-12 w-full rounded-md bg-surface border border-border mb-2" />
              <div className="text-xs font-semibold">Surface</div>
              <div className="text-xs text-text-secondary-accessible">#FFFFFF (255 255 255)</div>
            </div>

            {/* Surface Secondary */}
            <div className="p-4 rounded-lg border border-border bg-surface-secondary">
              <div className="h-12 w-full rounded-md bg-surface-secondary border border-border mb-2" />
              <div className="text-xs font-semibold">Surface Secondary</div>
              <div className="text-xs text-text-secondary-accessible">#F0F0ED (240 240 237)</div>
            </div>

            {/* Border */}
            <div className="p-4 rounded-lg border border-border bg-surface">
              <div className="h-12 w-full rounded-md bg-border mb-2" />
              <div className="text-xs font-semibold">Border</div>
              <div className="text-xs text-text-secondary-accessible">#E8E8E5 (232 232 229)</div>
            </div>

            {/* Primary & Opacity Steps */}
            <div className="p-4 rounded-lg border border-border bg-surface">
              <div className="h-12 w-full rounded-md bg-primary mb-2 flex items-center justify-center text-background text-xs font-medium">
                Solid (100%)
              </div>
              <div className="text-xs font-semibold text-primary">Primary</div>
              <div className="text-xs text-text-secondary-accessible">#6258D9 (98 88 217)</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface">
              <div className="h-12 w-full rounded-md bg-primary/50 mb-2 flex items-center justify-center text-text-primary text-xs font-medium">
                bg-primary/50
              </div>
              <div className="text-xs font-semibold text-primary">Primary 50%</div>
              <div className="text-xs text-text-secondary-accessible">rgb(98 88 217 / 0.5)</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface">
              <div className="h-12 w-full rounded-md bg-primary/20 mb-2 flex items-center justify-center text-primary text-xs font-medium">
                bg-primary/20
              </div>
              <div className="text-xs font-semibold text-primary">Primary 20%</div>
              <div className="text-xs text-text-secondary-accessible">rgb(98 88 217 / 0.2)</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface">
              <div className="h-12 w-full rounded-md bg-primary/10 mb-2 flex items-center justify-center text-primary text-xs font-medium">
                bg-primary/10
              </div>
              <div className="text-xs font-semibold text-primary">Primary 10%</div>
              <div className="text-xs text-text-secondary-accessible">rgb(98 88 217 / 0.1)</div>
            </div>
          </div>
        </section>

        {/* 2. Secondary Text Contrast & Primary Buttons */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">2. Secondary Text Contrast &amp; Accessible Button Strategy</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Demonstrating the difference between original decorative secondary text and the WCAG AA compliant variant, along with the approved button foreground strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary on Canvas */}
            <div className="p-6 rounded-lg border border-border bg-surface space-y-4">
              <h3 className="text-sm font-semibold">Surface Background</h3>
              <p className="text-sm text-text-primary">
                Primary Text: 16.05:1 contrast (WCAG AAA).
              </p>
              <p className="text-sm text-text-secondary-accessible">
                Accessible Secondary (#676974): 5.46:1 contrast (WCAG AA PASS for normal text).
              </p>
              <p className="text-sm text-text-secondary">
                Original Secondary (#777984): 4.33:1 contrast (Passes large text / decorative only).
              </p>
              <button
                type="button"
                className="w-full px-4 py-2.5 rounded-md bg-primary text-background font-medium text-sm transition-opacity duration-fast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
              >
                Primary Button (text-background: 5.00:1 AA)
              </button>
            </div>

            {/* Primary on Background Canvas */}
            <div className="p-6 rounded-lg border border-border bg-background space-y-4">
              <h3 className="text-sm font-semibold">Canvas Background</h3>
              <p className="text-sm text-text-primary">
                Primary Text: 14.96:1 contrast (WCAG AAA).
              </p>
              <p className="text-sm text-text-secondary-accessible">
                Accessible Secondary: 5.09:1 contrast (WCAG AA PASS).
              </p>
              <p className="text-sm text-text-secondary">
                Original Secondary: 4.03:1 contrast (Decorative / large text only).
              </p>
              <button
                type="button"
                className="w-full px-4 py-2.5 rounded-md bg-primary text-background font-medium text-sm transition-opacity duration-fast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                Primary Button on Canvas
              </button>
            </div>

            {/* Primary on Secondary Surface */}
            <div className="p-6 rounded-lg border border-border bg-surface-secondary space-y-4">
              <h3 className="text-sm font-semibold">Secondary Surface Background</h3>
              <p className="text-sm text-text-primary">
                Primary Text: 14.06:1 contrast (WCAG AAA).
              </p>
              <p className="text-sm text-text-secondary-accessible">
                Accessible Secondary: 4.78:1 contrast (WCAG AA PASS).
              </p>
              <p className="text-sm text-text-secondary">
                Original Secondary: 3.79:1 contrast (Decorative / large text only).
              </p>
              <button
                type="button"
                className="w-full px-4 py-2.5 rounded-md bg-primary text-background font-medium text-sm transition-opacity duration-fast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-secondary"
              >
                Primary Button on Secondary
              </button>
            </div>
          </div>
        </section>

        {/* 3. Dark Theme Local Preview Container */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">3. Dark Theme Local Preview (Isolated `.dark` Class Container)</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Verified without a global theme provider. Buttons strictly use text-background (#141619) with 6.38:1 AA contrast. White text on dark primary is prohibited (2.84:1).
            </p>
          </div>

          <div className="dark bg-background text-text-primary p-6 rounded-xl border border-border shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Dark Surface */}
              <div className="p-5 rounded-lg border border-border bg-surface space-y-3">
                <span className="text-xs font-mono text-text-secondary">Surface #1D2024</span>
                <p className="text-sm text-text-primary">Primary Text (#F1F1F3): 14.50:1 (AAA)</p>
                <p className="text-sm text-text-secondary">Secondary Text (#A3A6B0): 6.73:1 (AA PASS)</p>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 rounded-md bg-primary text-background font-semibold text-sm transition-opacity duration-fast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
                >
                  Dark Primary Button (6.38:1 AA)
                </button>
              </div>

              {/* Dark Canvas */}
              <div className="p-5 rounded-lg border border-border bg-background space-y-3">
                <span className="text-xs font-mono text-text-secondary">Canvas #141619</span>
                <p className="text-sm text-text-primary">Primary Text (#F1F1F3): 16.07:1 (AAA)</p>
                <p className="text-sm text-text-secondary">Secondary Text (#A3A6B0): 7.46:1 (AAA)</p>
                <div className="p-3 rounded-md bg-primary-soft text-primary text-xs font-medium">
                  Primary on Primary Soft: 4.60:1 (AA PASS)
                </div>
              </div>

              {/* Dark Secondary Surface */}
              <div className="p-5 rounded-lg border border-border bg-surface-secondary space-y-3">
                <span className="text-xs font-mono text-text-secondary">Secondary #22262B</span>
                <p className="text-sm text-text-primary">Primary Text: 13.49:1 (AAA)</p>
                <p className="text-sm text-text-secondary">Secondary Text: 6.26:1 (AA PASS)</p>
                <div className="h-10 rounded-md border border-border flex items-center justify-center text-xs text-text-secondary">
                  Hairline Border (#30343A)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Complete Typography Scale: English (Inter) vs Arabic (IBM Plex Sans Arabic) */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">4. Harmonized Typography Scale &amp; Fixed Arabic Line-Heights</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Every level displays font size, English Inter line-height, and the exact matching leading-arabic-* utility.
            </p>
          </div>

          <div className="space-y-6 rounded-xl border border-border bg-surface p-6 shadow-xs">
            {/* 4xl */}
            <div className="pb-6 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-4xl (2.25rem/36px) — English</span>
                <div className="font-sans text-4xl font-bold tracking-tight text-text-primary">
                  3,480 Active Pages
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-4xl (2.75rem/44px) — Arabic</span>
                <div className="font-arabic text-4xl leading-arabic-4xl font-bold text-text-primary">
                  ٣,٤٨٠ صفحة نشطة
                </div>
              </div>
            </div>

            {/* 3xl */}
            <div className="pb-6 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-3xl (1.875rem/30px) — English</span>
                <div className="font-sans text-3xl font-bold tracking-tight text-text-primary">
                  Personal Intelligence
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-3xl (2.5rem/40px) — Arabic</span>
                <div className="font-arabic text-3xl leading-arabic-3xl font-bold text-text-primary">
                  الذكاء الشخصي ومساحة العمل
                </div>
              </div>
            </div>

            {/* 2xl */}
            <div className="pb-6 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-2xl (1.5rem/24px) — English</span>
                <div className="font-sans text-2xl font-semibold text-text-primary">
                  Project Roadmaps &amp; Sprints
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-2xl (2.25rem/36px) — Arabic</span>
                <div className="font-arabic text-2xl leading-arabic-2xl font-semibold text-text-primary">
                  خرائط طريق المشاريع والمهام
                </div>
              </div>
            </div>

            {/* xl */}
            <div className="pb-6 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-xl (1.25rem/20px) — English</span>
                <div className="font-sans text-xl font-semibold text-text-primary">
                  Weekly Focus &amp; Daily Schedule
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-xl (2.0rem/32px) — Arabic</span>
                <div className="font-arabic text-xl leading-arabic-xl font-semibold text-text-primary">
                  التركيز الأسبوعي والجدول اليومي
                </div>
              </div>
            </div>

            {/* lg */}
            <div className="pb-6 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-lg (1.125rem/18px) — English</span>
                <div className="font-sans text-lg font-medium text-text-primary">
                  Prioritized Tasks &amp; Milestones
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-lg (1.875rem/30px) — Arabic</span>
                <div className="font-arabic text-lg leading-arabic-lg font-medium text-text-primary">
                  المهام ذات الأولوية والمعالم الرئيسية
                </div>
              </div>
            </div>

            {/* base */}
            <div className="pb-6 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-base (1.0rem/16px) — English</span>
                <div className="font-sans text-base font-normal text-text-primary">
                  The AI workspace analyzes connected pages and calendar events to deliver contextually aware productivity insights.
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-base (1.625rem/26px) — Arabic</span>
                <div className="font-arabic text-base leading-arabic-base font-normal text-text-primary">
                  يقوم المساعد الذكي بتحليل الصفحات المرتبطة وأحداث التقويم لتقديم رؤى إنتاجية مصممة خصيصاً لسياق عملك اليومي.
                </div>
              </div>
            </div>

            {/* sm */}
            <div className="pb-6 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-sm (0.875rem/14px) — English</span>
                <div className="font-sans text-sm font-normal text-text-secondary-accessible">
                  Navigation item label, input placeholder, and table cell standard typography.
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-sm (1.375rem/22px) — Arabic</span>
                <div className="font-arabic text-sm leading-arabic-sm font-normal text-text-secondary-accessible">
                  عناوين عناصر التنقل، نصوص الحقول، والنصوص الوصفية القياسية داخل الجداول.
                </div>
              </div>
            </div>

            {/* xs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div>
                <span className="text-xs font-mono text-text-secondary block mb-1">text-xs (0.75rem/12px) — English</span>
                <div className="font-sans text-xs font-medium text-text-secondary-accessible">
                  LAST MODIFIED: 12 MIN AGO • STATUS: IN PROGRESS
                </div>
              </div>
              <div dir="rtl">
                <span className="text-xs font-mono text-text-secondary block mb-1" dir="ltr">leading-arabic-xs (1.125rem/18px) — Arabic</span>
                <div className="font-arabic text-xs leading-arabic-xs font-medium text-text-secondary-accessible">
                  آخر تعديل: منذ ١٢ دقيقة • الحالة: قيد التنفيذ
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Font Weights Showcase (400, 500, 600, 700) */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">5. Verified Font Weights (No Faux-Bold Synthesis)</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Confirmed genuine WOFF2 glyph rendering for 400 (Regular), 500 (Medium), 600 (SemiBold), and 700 (Bold) across Inter and IBM Plex Sans Arabic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Weights */}
            <div className="p-6 rounded-xl border border-border bg-surface space-y-4">
              <span className="text-xs font-mono text-primary font-semibold block">Inter (Latin Subset)</span>
              <p className="font-sans text-base font-normal">Weight 400 (Regular): Personal Productivity Platform</p>
              <p className="font-sans text-base font-medium">Weight 500 (Medium): Navigation and Button Labels</p>
              <p className="font-sans text-base font-semibold">Weight 600 (SemiBold): Card Headers and Group Titles</p>
              <p className="font-sans text-base font-bold">Weight 700 (Bold): Primary Titles and Metrics</p>
            </div>

            {/* Arabic Weights */}
            <div className="p-6 rounded-xl border border-border bg-surface space-y-4 text-right" dir="rtl">
              <span className="text-xs font-mono text-primary font-semibold block" dir="ltr">IBM Plex Sans Arabic (Arabic &amp; Latin)</span>
              <p className="font-arabic text-base leading-arabic-base font-normal">الوزن ٤٠٠ (عادي): منصة الإنتاجية الشخصية الذكية</p>
              <p className="font-arabic text-base leading-arabic-base font-medium">الوزن ٥٠٠ (متوسط): عناصر التنقل وتسميات الأزرار</p>
              <p className="font-arabic text-base leading-arabic-base font-semibold">الوزن ٦٠٠ (شبه غامق): عناوين البطاقات والمجموعات</p>
              <p className="font-arabic text-base leading-arabic-base font-bold">الوزن ٧٠٠ (غامق): العناوين الرئيسية ومؤشرات الأداء</p>
            </div>
          </div>
        </section>

        {/* 6. Semantic Color Pairs (Success, Destructive, Warning) */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">6. Semantic Feedback Pairs &amp; Contrast</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Tested on surface and soft tint backgrounds. All pairs achieve $\ge$ 4.5:1 for normal text and $\ge$ 3.0:1 for non-text UI indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Success */}
            <div className="p-5 rounded-lg border border-border bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-success">Success State</span>
                <span className="text-xs font-mono text-text-secondary-accessible">5.41:1 AA</span>
              </div>
              <div className="p-3 rounded-md bg-success-soft text-success text-xs font-medium">
                Task Completed (#18794E on #E6F7ED: 4.86:1 AA PASS)
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary-accessible">
                <span className="w-2.5 h-2.5 rounded-full bg-success inline-block" />
                <span>Non-text indicator $\ge$ 3.0:1 PASS</span>
              </div>
            </div>

            {/* Destructive */}
            <div className="p-5 rounded-lg border border-border bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-destructive">Destructive State</span>
                <span className="text-xs font-mono text-text-secondary-accessible">5.21:1 AA</span>
              </div>
              <div className="p-3 rounded-md bg-destructive-soft text-destructive text-xs font-medium">
                Permanent Delete (#CE2C31 on #FFEBEB: 4.55:1 AA PASS)
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary-accessible">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" />
                <span>Non-text indicator $\ge$ 3.0:1 PASS</span>
              </div>
            </div>

            {/* Warning */}
            <div className="p-5 rounded-lg border border-border bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-warning">Warning State</span>
                <span className="text-xs font-mono text-text-secondary-accessible">5.55:1 AA</span>
              </div>
              <div className="p-3 rounded-md bg-warning-soft text-warning text-xs font-medium">
                Due Today (#9E5600 on #FFF4E5: 5.11:1 AA PASS)
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary-accessible">
                <span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" />
                <span>Non-text indicator $\ge$ 3.0:1 PASS</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Focus Ring Appearance on Three Surfaces */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">7. Focus Ring Appearance (WCAG 2.2 SC 1.4.11 Non-Text Contrast)</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Tested on Background (5.00:1), Surface (5.36:1), and Secondary Surface (4.70:1). Press Tab or click to inspect focus ring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-background flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-mono text-text-secondary">On Background (5.00:1)</span>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-surface border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              >
                Focus on Background
              </button>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-mono text-text-secondary">On Surface (5.36:1)</span>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-surface-secondary border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
              >
                Focus on Surface
              </button>
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface-secondary flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-mono text-text-secondary">On Sec. Surface (4.70:1)</span>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-surface border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-secondary"
              >
                Focus on Secondary Surface
              </button>
            </div>
          </div>
        </section>

        {/* 8. Radiuses, Shadows & Transitions */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">8. Radiuses, Shadows &amp; Transitions</h2>
            <p className="text-sm text-text-secondary-accessible mt-1">
              Hover cards to test duration-fast (150ms), duration-normal (200ms), duration-slow (300ms) and ease-default physics.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-sm border border-border bg-surface shadow-xs transition-all duration-fast hover:shadow-md hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <span className="text-xs font-mono text-text-secondary">rounded-sm (4px)</span>
              <div className="text-xs font-medium mt-1">duration-fast (150ms)</div>
            </div>

            <div className="p-4 rounded-md border border-border bg-surface shadow-sm transition-all duration-normal hover:shadow-lg hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <span className="text-xs font-mono text-text-secondary">rounded-md (8px)</span>
              <div className="text-xs font-medium mt-1">duration-normal (200ms)</div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-surface shadow-md transition-all duration-slow hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <span className="text-xs font-mono text-text-secondary">rounded-lg (12px)</span>
              <div className="text-xs font-medium mt-1">duration-slow (300ms)</div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-surface shadow-lg transition-all duration-normal hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <span className="text-xs font-mono text-text-secondary">rounded-xl (16px)</span>
              <div className="text-xs font-medium mt-1">Modal / Container</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pt-6 border-t border-border text-xs text-text-secondary-accessible flex justify-between">
        <span>LifeOS Design System — Phase 2 Verification</span>
        <span>Inter &bull; IBM Plex Sans Arabic &bull; Tailwind v3.4.17</span>
      </footer>
    </div>
  );
}

export default App;
