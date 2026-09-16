import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { SectionLabel } from '../components/ui/os-portfolio';
import {
  ALL_ENTRIES,
  DESIGN_SYSTEM,
  OS_PORTFOLIO_DETAIL_IDS,
  NAV_GROUPS,
  PUBLIC_ALL_ENTRIES,
  PUBLIC_NAV_GROUPS,
  PUBLIC_VISIBILITY_MAP,
  OVERVIEW_ENTRY,
  type NavGroup,
} from './registry';

const THEME_STORAGE_KEY = 'portfolio-os-ds.theme';
const LEGACY_THEME_STORAGE_KEY = 'portfolio-os-design-system.theme';

function readStoredTheme(): 'light' | 'dark' {
  const requestedTheme = new URLSearchParams(window.location.search).get('theme');
  if (requestedTheme === 'light' || requestedTheme === 'dark') {
    return requestedTheme;
  }
  const storedTheme =
    localStorage.getItem(THEME_STORAGE_KEY) ??
    localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
  return storedTheme === 'dark' ? 'dark' : 'light';
}

function readHashId(): string {
  const id = new URLSearchParams(window.location.hash.slice(1)).get('page');
  if (!id) {
    return OVERVIEW_ENTRY.id;
  }
  // Allow any registered entry (including hidden ones) via direct deep-link
  return ALL_ENTRIES.some((entry) => entry.id === id)
    ? id
    : OVERVIEW_ENTRY.id;
}

function useSelectedId(): [string, (id: string) => void] {
  const [selected, setSelected] = useState(readHashId);

  useEffect(() => {
    const onHashChange = () => setSelected(readHashId());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const select = (id: string) => {
    setSelected(id);
    window.location.hash = new URLSearchParams({ page: id }).toString();
  };

  return [selected, select];
}

function NavigationItems({
  showOverview,
  groups,
  activeId,
  query,
  select,
}: {
  showOverview: boolean;
  groups: NavGroup[];
  activeId: string;
  query: string;
  select: (id: string) => void;
}) {
  const foundationGroups = groups.filter((group) => group.name === 'Foundations');
  const patternGroups = groups.filter((group) => group.name === 'Patterns');
  const componentGroups = groups.filter(
    (group) => group.name !== 'Foundations' && group.name !== 'Patterns',
  );
  const renderEntries = (group: NavGroup) => (
    group.entries.map((entry) => (
      <button
        key={entry.id}
        type="button"
        onClick={() => select(entry.id)}
        aria-current={entry.id === activeId ? 'page' : undefined}
        className={`block w-full rounded-md py-1.5 text-left transition-colors hover:bg-muted aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground ${
          entry.navLevel === 2
            ? 'px-4 text-xs text-muted-foreground'
            : 'px-2 text-sm'
        }`}
      >
        {entry.name}
      </button>
    ))
  );

  return (
    <nav aria-label="Design system navigation" className="space-y-5 py-2">
      {showOverview ? (
        <button
          type="button"
          onClick={() => select(OVERVIEW_ENTRY.id)}
          aria-current={OVERVIEW_ENTRY.id === activeId ? 'page' : undefined}
          className="block w-full rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-muted aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
        >
          {OVERVIEW_ENTRY.name}
        </button>
      ) : null}

      {foundationGroups.map((group) => (
        <div key={group.name}>
          <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {group.name}
          </p>
          <div className="mt-2 space-y-1 border-l pl-2">
            {renderEntries(group)}
          </div>
        </div>
      ))}

      {componentGroups.length > 0 ? (
        <div>
          <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Components
          </p>
          <div className="mt-2 space-y-4 border-l pl-2">
            {componentGroups.map((group) => (
              <div key={group.name}>
                <p className="px-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {group.name}
                </p>
                <div className="mt-1 space-y-1 pl-2">
                  {renderEntries(group)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {patternGroups.map((group) => (
        <div key={group.name}>
          <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {group.name}
          </p>
          <div className="mt-2 space-y-1 border-l pl-2">
            {renderEntries(group)}
          </div>
        </div>
      ))}

      {!showOverview && groups.length === 0 ? (
        <p className="px-2 py-4 text-sm text-muted-foreground">
          No sections match &ldquo;{query}&rdquo;.
        </p>
      ) : null}
    </nav>
  );
}

export function DesignSystemBrowser() {
  const [theme, setTheme] = useState<'light' | 'dark'>(readStoredTheme);
  const [selectedId, select] = useSelectedId();
  const [query, setQuery] = useState('');
  const mobileNav = useRef<HTMLDetailsElement>(null);
  const mobileNavSummary = useRef<HTMLElement>(null);
  const normalizedQuery = query.trim().toLowerCase();

  // Navigation and search operate only on public entries
  const filteredGroups = useMemo(
    () =>
      PUBLIC_NAV_GROUPS.map((group) => {
        const matchingEntries = group.name.toLowerCase().includes(normalizedQuery)
          ? group.entries
          : group.entries.filter((entry) =>
              `${entry.name} ${entry.description}`
                .toLowerCase()
                .includes(normalizedQuery),
            );

        return {
          ...group,
          entries:
            group.name === 'Foundations'
              ? matchingEntries
              : [...matchingEntries].sort((a, b) =>
                  a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
                ),
        };
      }).filter((group) => group.entries.length > 0),
    [normalizedQuery],
  );

  // Active entry may be a hidden page (deep-linked) — resolve against ALL_ENTRIES
  const active =
    ALL_ENTRIES.find((entry) => entry.id === selectedId) ?? OVERVIEW_ENTRY;

  // For header breadcrumb group label, search public groups first, then full registry
  const activeGroup =
    PUBLIC_NAV_GROUPS.find((group) =>
      group.entries.some((entry) => entry.id === active.id),
    ) ??
    // fallback: detail page or hidden page may only appear in the full NAV_GROUPS
    NAV_GROUPS.find((group) =>
      group.entries.some((e) => e.id === active.id),
    );

  // A page is "hidden" only if it is not in public nav AND is not a known
  // public detail page (i.e. an OS Portfolio primitive or family overview that is
  // intentionally omitted from sidebar but is still a public-facing document).
  const isPublicDetailPage = OS_PORTFOLIO_DETAIL_IDS.has(active.id);
  const isPrimitiveDetailPage =
    isPublicDetailPage &&
    active.id !== 'os-portfolio-pilot' &&
    active.id !== 'os-portfolio-settings';
  const isHiddenPage =
    active.id !== OVERVIEW_ENTRY.id &&
    PUBLIC_VISIBILITY_MAP[active.id] !== true &&
    !isPublicDetailPage;

  const ActivePage = active.Page;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [active.id]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  }, [theme]);

  const showOverview = `${OVERVIEW_ENTRY.name} ${OVERVIEW_ENTRY.description}`
    .toLowerCase()
    .includes(normalizedQuery);

  const selectPage = (id: string) => {
    select(id);
    if (mobileNav.current?.open) {
      mobileNav.current.removeAttribute('open');
      mobileNavSummary.current?.focus();
    }
  };

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <TooltipProvider delayDuration={400}>
      <div className="min-h-[100dvh] bg-background text-foreground md:grid md:grid-cols-[260px_minmax(0,1fr)]">
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="border-b bg-muted/20 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
          {/* Sidebar header */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{DESIGN_SYSTEM.title}</p>
                <SectionLabel className="mt-0.5 block text-muted-foreground">
                  portfolio-scoped
                </SectionLabel>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(nextTheme)}
                    aria-label={`Switch to ${nextTheme} theme`}
                    className="shrink-0 font-mono text-[10px] uppercase tracking-wide"
                  >
                    {theme}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Switch to {nextTheme} theme
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Separator />

          {/* Search */}
          <div className="p-4 pb-2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search design system"
              placeholder="Search…"
            />
          </div>

          {/* Desktop nav */}
          <ScrollArea className="hidden min-h-0 flex-1 px-4 pb-4 md:block">
            <NavigationItems
              showOverview={showOverview}
              groups={filteredGroups}
              activeId={active.id}
              query={query}
              select={selectPage}
            />
          </ScrollArea>

          {/* Mobile nav */}
          <details ref={mobileNav} className="border-t px-4 py-3 md:hidden">
            <summary
              ref={mobileNavSummary as React.RefObject<HTMLElement>}
              className="cursor-pointer text-sm font-medium"
            >
              Browse:{' '}
              <span className="text-muted-foreground">{active.name}</span>
            </summary>
            <ScrollArea className="mt-3 h-64 pb-2">
              <NavigationItems
                showOverview={showOverview}
                groups={filteredGroups}
                activeId={active.id}
                query={query}
                select={selectPage}
              />
            </ScrollArea>
          </details>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="min-w-0 px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-5xl">
            {isPrimitiveDetailPage && (
              <Button
                variant="outline"
                size="sm"
                className="mb-6"
                onClick={() => selectPage('os-portfolio-primitives')}
              >
                ← Back to OS Portfolio primitives
              </Button>
            )}

            {/* Hidden-page notice — subtle, accessible, not obtrusive */}
            {isHiddenPage && (
              <aside
                aria-label="Internal page notice"
                className="mb-6 rounded-md border border-muted bg-muted/40 px-4 py-2.5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Internal — not surfaced in public navigation
                </p>
              </aside>
            )}

            <header className="border-b pb-8">
              {active.id === OVERVIEW_ENTRY.id ? (
                <>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {DESIGN_SYSTEM.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-muted-foreground">
                    {DESIGN_SYSTEM.description}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {activeGroup?.name}
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold">{active.name}</h1>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {active.description}
                  </p>
                </>
              )}
            </header>

            <div className="pt-8">
              <Suspense
                fallback={
                  <div
                    role="status"
                    className="rounded-xl border bg-card p-6 text-sm text-muted-foreground"
                  >
                    Loading preview…
                  </div>
                }
              >
                <ActivePage />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
