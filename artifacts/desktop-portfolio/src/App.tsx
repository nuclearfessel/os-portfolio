import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Sparkle as Apple, ArrowLeft, ArrowUpRight, BatteryMedium, BookOpen, ChevronRight,
  Check, Keyboard as Command, GitGraph as FolderGit2, Mail, Maximize2, Menu, Minus,
  Cursor as MousePointer2, Terminal, CircleUser as UserRound, Wifi, X,
} from '@keyline-icons/react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type WindowId = 'about' | 'work' | 'notes' | 'contact' | 'terminal';
type WindowState = Record<WindowId, boolean>;
type IconSize = 'large' | 'small';
type Theme = 'dark' | 'light';
type FolderPositions = Partial<Record<WindowId, { left: number; top: number }>>;
type DesktopItemId = WindowId | 'sticky';
type ItemPositions = Partial<Record<DesktopItemId, { left: number; top: number }>>;
type ItemSizes = Partial<Record<DesktopItemId, { width: number; height: number }>>;

type SavedDesktopState = {
  folderPositions: FolderPositions;
  itemPositions: ItemPositions;
  itemSizes: ItemSizes;
  iconSize: IconSize;
  snapToGrid: boolean;
  theme: Theme;
  showDesktopIcons: boolean;
};

const DESKTOP_STORAGE_KEY = 'alex-os.desktop.v1';
const defaultDesktopState: SavedDesktopState = {
  folderPositions: {},
  itemPositions: {},
  itemSizes: {},
  iconSize: 'large',
  snapToGrid: false,
  theme: 'dark',
  showDesktopIcons: true,
};

function loadDesktopState(): SavedDesktopState {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY) ?? '{}') as Partial<SavedDesktopState>;
    const folderPositions = Object.fromEntries(
      Object.entries(parsed.folderPositions ?? {}).filter((entry): entry is [string, { left: number; top: number }] => {
        const position = entry[1];
        return Boolean(position) && Number.isFinite(position.left) && Number.isFinite(position.top);
      }),
    ) as FolderPositions;
    const itemPositions = Object.fromEntries(
      Object.entries(parsed.itemPositions ?? {}).filter((entry): entry is [string, { left: number; top: number }] => {
        const position = entry[1];
        return Boolean(position) && Number.isFinite(position.left) && Number.isFinite(position.top);
      }),
    ) as ItemPositions;
    const itemSizes = Object.fromEntries(
      Object.entries(parsed.itemSizes ?? {}).filter((entry): entry is [string, { width: number; height: number }] => {
        const size = entry[1];
        return Boolean(size) && Number.isFinite(size.width) && size.width > 0 && Number.isFinite(size.height) && size.height > 0;
      }),
    ) as ItemSizes;

    return {
      folderPositions,
      itemPositions,
      itemSizes,
      iconSize: parsed.iconSize === 'small' ? 'small' : defaultDesktopState.iconSize,
      snapToGrid: typeof parsed.snapToGrid === 'boolean' ? parsed.snapToGrid : defaultDesktopState.snapToGrid,
      theme: parsed.theme === 'light' ? 'light' : defaultDesktopState.theme,
      showDesktopIcons: typeof parsed.showDesktopIcons === 'boolean' ? parsed.showDesktopIcons : defaultDesktopState.showDesktopIcons,
    };
  } catch {
    return defaultDesktopState;
  }
}

const projects = [
  { id: '01', name: 'Orbit CRM', desc: 'A calmer command center for customer teams managing complex accounts.', tag: 'PRODUCT / 2024', color: '#e4ff5b' },
  { id: '02', name: 'Field Notes', desc: 'Offline-first field research software for teams who work beyond the signal.', tag: 'SYSTEMS / 2023', color: '#ff8d79' },
  { id: '03', name: 'Signal Kit', desc: 'A living component library that turns product intent into shipped interface.', tag: 'DESIGN ENG / 2023', color: '#86d9ee' },
];

const initialWindows: WindowState = {
  about: false,
  work: true,
  notes: false,
  contact: false,
  terminal: true,
};

function WindowFrame({
  id,
  title,
  active,
  children,
  onFocus,
  onClose,
  onMinimize,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  style,
}: {
  id: WindowId;
  title: string;
  active: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onResizeStart: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  onResizeMove: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  onResizeEnd: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <section
      className={`window ${id} ${active ? 'is-active' : ''}`}
      onMouseDown={onFocus}
      data-draggable-item
      style={style}
      data-testid={`window-${id}`}
      aria-label={`${title} window`}
    >
      <header className="window-header" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <span className="window-header-spacer" aria-hidden="true" />
        <div className="window-title"><strong>~/alex/</strong>{title.toLowerCase()}</div>
        <div className="traffic-lights" onPointerDown={(event) => event.stopPropagation()}>
          <button className="minimize" onClick={onMinimize} aria-label={`Minimize ${title}`} data-testid={`button-minimize-${id}`}><Minus size={10} strokeWidth={2.6} /></button>
          <button className="maximize" onClick={onFocus} aria-label={`Focus ${title}`} data-testid={`button-focus-${id}`}><Maximize2 size={9} strokeWidth={2.4} /></button>
          <button className="close" onClick={onClose} aria-label={`Close ${title}`} data-testid={`button-close-${id}`}><X size={9} strokeWidth={2.6} /></button>
        </div>
      </header>
      {children}
      <span
        className="desktop-resize-handle"
        onPointerDown={(event) => { event.stopPropagation(); onResizeStart(event); }}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        onPointerCancel={onResizeEnd}
        role="separator"
        aria-label={`Resize ${title} window`}
        tabIndex={0}
      />
    </section>
  );
}

function AboutWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  return (
    <WindowFrame {...props} id="about" title="About">
      <div className="window-body">
        <span className="section-kicker">readme.md</span>
        <h2>Interfaces with a pulse.</h2>
        <div className="about-grid">
          <div>
            <p>I’m Alex Rivera, a product-minded frontend engineer based in Brooklyn. I build the connective tissue between a good idea and a product people want to keep using.</p>
            <p>My favorite work lives where interaction design, resilient systems, and a sharp point of view overlap. I care about the small delays, the useful defaults, and the moment software gets out of your way.</p>
            <div className="signature">alex_rivera<span className="blink">_</span></div>
          </div>
          <div className="fact-list">
            <div className="fact"><label>currently</label><span>Independent / open to select teams</span></div>
            <div className="fact"><label>timezone</label><span>ET · UTC−05:00</span></div>
            <div className="fact"><label>outside the screen</label><span>Long walks, short novels, analog synths</span></div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

function WorkWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);

  return (
    <WindowFrame {...props} id="work" title="Selected work">
      {caseStudyOpen ? (
        <div className="window-body case-study" data-testid="case-study-orbit">
          <button className="case-study-back" onClick={() => setCaseStudyOpen(false)} data-testid="button-back-to-work"><ArrowLeft size={15} />all projects</button>
          <span className="section-kicker">case study / product systems / 2024</span>
          <div className="case-study-hero">
            <div>
              <h2>Orbit CRM</h2>
              <p>A calmer command center for customer teams managing complex accounts.</p>
            </div>
            <span className="case-study-role">Product design<br />Frontend engineering</span>
          </div>
          <div className="case-study-metrics" aria-label="Project outcomes">
            <div><strong>34%</strong><span>faster account reviews</span></div>
            <div><strong>2.1×</strong><span>more risks caught early</span></div>
            <div><strong>18%</strong><span>fewer support escalations</span></div>
          </div>
          <div className="orbit-preview" aria-label="Orbit CRM interface preview">
            <div className="orbit-sidebar"><span className="orbit-logo">ORBIT</span><i /><i /><i /><i /></div>
            <div className="orbit-dashboard">
              <div className="orbit-preview-header"><span>Account health</span><b>Q4 review</b></div>
              <div className="orbit-stat-row"><span><b>92</b> healthy</span><span><b>14</b> watch</span><span><b>03</b> at risk</span></div>
              <div className="orbit-chart"><span /><span /><span /><span /><span /><span /></div>
            </div>
          </div>
          <div className="case-study-sections">
            <section><span>01 / challenge</span><h3>Important signals were buried.</h3><p>Account teams were jumping between six tools to understand customer health. Reviews were slow, risk was found late, and every manager used a different process.</p></section>
            <section><span>02 / approach</span><h3>Design around decisions, not data.</h3><p>I worked with success leads to map the few decisions that changed an account’s trajectory, then built a focused workspace that grouped signals, history, and next actions together.</p></section>
            <section><span>03 / outcome</span><h3>One shared operating rhythm.</h3><p>The new workflow made weekly reviews faster and more consistent. Teams caught risk sooner, reduced handoff gaps, and spent more time acting instead of assembling reports.</p></section>
          </div>
        </div>
      ) : (
        <div className="window-body">
          <span className="section-kicker">projects / selected</span>
          <h2>Things I’ve shipped.</h2>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.id} data-testid={`card-project-${project.id}`}>
                <span className="project-index" style={{ color: project.color }}>{project.id}</span>
                <div className="project-copy"><h3>{project.name}</h3><p>{project.desc}</p></div>
                <span className="project-tag">{project.tag}</span>
                {project.id === '01' ? (
                  <button className="project-link" data-testid={`button-open-project-${project.id}`} onClick={() => setCaseStudyOpen(true)}>view case study <ArrowUpRight size={13} /></button>
                ) : (
                  <button className="project-link" disabled data-testid={`button-open-project-${project.id}`}>coming soon</button>
                )}
              </article>
            ))}
          </div>
          <p style={{ marginTop: 18, fontFamily: 'var(--app-font-mono)', fontSize: 10 }}>03 projects · 8 shipped systems · 0 design handoffs left behind</p>
        </div>
      )}
    </WindowFrame>
  );
}

function NotesWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  return (
    <WindowFrame {...props} id="notes" title="Notes & stack">
      <div className="window-body">
        <span className="section-kicker">/notes / toolkit</span>
        <h2>Curious by default.</h2>
        <div className="stack-layout">
          <div>
            <p>My stack follows the problem, not the other way around. I like boring infrastructure, expressive interfaces, and tools that make the next decision easier.</p>
            <div className="stack-list">
              {['TypeScript', 'React', 'Next.js', 'CSS systems', 'Node.js', 'Postgres', 'Playwright', 'Figma', 'Motion'].map((item) => <span className="stack-chip" key={item}>{item}</span>)}
            </div>
          </div>
          <div className="availability">
            <strong><span className="status-dot" style={{ display: 'inline-block', marginRight: 8 }} />available for 2025</strong>
            <p>Taking on one thoughtful product partnership from spring onward. Best fit: small teams with a real problem and high standards.</p>
          </div>
        </div>
        <p className="recent-note">→ Recent note: why good empty states feel like hospitality</p>
      </div>
    </WindowFrame>
  );
}

function ContactWindow(props: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  return (
    <WindowFrame {...props} id="contact" title="Start a conversation">
      <div className="window-body contact-copy">
        <span className="section-kicker">contact.txt</span>
        <h2>Have a hard problem?</h2>
        <p>Tell me what you’re making, where it’s stuck, and what “better” would feel like. I’ll get back to you with a considered reply, usually within a couple of days.</p>
        <a className="contact-button" href="mailto:hello@alexrivera.dev" data-testid="link-email-alex">email alex <Mail size={16} /></a>
        <p style={{ fontFamily: 'var(--app-font-mono)', fontSize: 10, marginTop: 18 }}>hello@alexrivera.dev</p>
      </div>
    </WindowFrame>
  );
}

function TerminalWindow({
  ...props
}: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'>) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cwd, setCwd] = useState('~');
  const inputRef = useRef<HTMLInputElement>(null);

  const submitCommand = (event: FormEvent) => {
    event.preventDefault();
    const normalized = command.trim().toLowerCase();
    if (!normalized) return;
    const [verb, ...args] = normalized.split(/\s+/);

    if (verb === 'exit') {
      props.onClose();
      return;
    }

    if (verb === 'cd') {
      const destination = args.join(' ');
      const folders: Record<string, string> = {
        '': '~',
        '~': '~',
        '~/': '~',
        '/home/alex': '~',
        about: '~/about',
        '~/about': '~/about',
        work: '~/work',
        '~/work': '~/work',
        notes: '~/notes',
        '~/notes': '~/notes',
        contact: '~/contact',
        '~/contact': '~/contact',
        '/': '/',
      };
      const nextDirectory = destination === '..'
        ? cwd === '/' ? '/' : '~'
        : folders[destination];
      const output = nextDirectory ? '' : `cd: no such file or directory: ${destination}`;
      if (nextDirectory) setCwd(nextDirectory);
      setHistory((current) => [...current, `› ${command}`, ...(output ? [output] : [])]);
      setCommand('');
      return;
    }

    const output = normalized === 'help'
      ? 'about   work   notes   contact   cd [folder]   exit   clear'
      : normalized === 'clear'
        ? ''
        : normalized === 'about'
          ? 'Alex Rivera — frontend engineer, product thinker, detail obsessive.'
          : normalized === 'work'
            ? 'Orbit CRM · Field Notes · Signal Kit'
            : normalized === 'notes'
              ? 'TypeScript, React, systems thinking, good questions.'
              : normalized === 'contact'
                ? 'hello@alexrivera.dev'
                : `command not found: ${normalized}. try "help"`;
    setHistory((current) => normalized === 'clear' ? [] : [...current, `› ${command}`, output]);
    setCommand('');
  };

  return (
    <WindowFrame {...props} id="terminal" title="Terminal">
      <div className="window-body terminal-body" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-line"><span className="terminal-prompt">alex@studio</span><span>:</span><span className="terminal-path">~</span><span>$</span><span className="terminal-command">whoami</span></div>
        <div className="terminal-output">alex rivera / product-minded frontend engineer{'\n'}building thoughtful interfaces and fast systems.</div>
        <div className="terminal-output terminal-hint">type “help” to explore, or use the dock below.</div>
        {history.map((line, index) => <div className={line.startsWith('›') ? 'terminal-line terminal-command' : 'terminal-output'} key={`${line}-${index}`}>{line}</div>)}
        <form className="terminal-form" onSubmit={submitCommand}>
          <span className="terminal-prompt">alex@studio:{cwd}$</span>
          <input ref={inputRef} className="terminal-input" value={command} onChange={(event) => setCommand(event.target.value)} aria-label="Terminal command" placeholder="type a command" data-testid="input-terminal-command" autoComplete="off" />
        </form>
      </div>
    </WindowFrame>
  );
}

function DesktopFolder({
  id,
  label,
  open,
  onToggle,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  style,
}: {
  id: WindowId;
  label: string;
  open: boolean;
  onToggle: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      className={`desktop-folder ${open ? 'is-open' : ''}`}
      onClick={onToggle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={style}
      aria-pressed={open}
      aria-label={`${open ? 'Focus' : 'Open'} ${label} folder`}
      data-testid={`button-folder-${id}`}
    >
      <span className="desktop-folder-icon" aria-hidden="true" />
      <span className="desktop-folder-label">{label}</span>
    </button>
  );
}

function Home() {
  const [savedDesktopState] = useState(loadDesktopState);
  const [windows, setWindows] = useState<WindowState>(initialWindows);
  const [activeWindow, setActiveWindow] = useState<WindowId>('work');
  const [clock, setClock] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dragPositions, setDragPositions] = useState<ItemPositions>(savedDesktopState.itemPositions);
  const [itemSizes, setItemSizes] = useState<ItemSizes>(savedDesktopState.itemSizes);
  const [folderPositions, setFolderPositions] = useState<FolderPositions>(savedDesktopState.folderPositions);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [iconSize, setIconSize] = useState<IconSize>(savedDesktopState.iconSize);
  const [snapToGrid, setSnapToGrid] = useState(savedDesktopState.snapToGrid);
  const [theme, setTheme] = useState<Theme>(savedDesktopState.theme);
  const [showDesktopIcons, setShowDesktopIcons] = useState(savedDesktopState.showDesktopIcons);
  const desktopAreaRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: DesktopItemId; offsetX: number; offsetY: number; moved: boolean } | null>(null);
  const resizeRef = useRef<{ id: DesktopItemId; startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  const folderDragRef = useRef<{ id: WindowId; offsetX: number; offsetY: number; moved: boolean; startLeft: number; startTop: number } | null>(null);

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const desktopState: SavedDesktopState = {
      folderPositions,
      itemPositions: dragPositions,
      itemSizes,
      iconSize,
      snapToGrid,
      theme,
      showDesktopIcons,
    };
    try {
      window.localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(desktopState));
    } catch {
      // The desktop remains usable when storage is unavailable.
    }
  }, [dragPositions, folderPositions, iconSize, itemSizes, snapToGrid, theme, showDesktopIcons]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setContextMenu(null);
      }
      if (event.metaKey || event.ctrlKey) return;
      const shortcuts: Record<string, WindowId> = { '1': 'about', '2': 'work', '3': 'notes', '4': 'contact', '`': 'terminal' };
      const id = shortcuts[event.key];
      if (id) { event.preventDefault(); openWindow(id); }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const openWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: true }));
    setActiveWindow(id);
    setMobileOpen(false);
  };
  const closeWindow = (id: WindowId) => setWindows((current) => ({ ...current, [id]: false }));
  const minimizeWindow = (id: WindowId) => setWindows((current) => ({ ...current, [id]: false }));
  const startDrag = (id: DesktopItemId, event: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    const area = desktopAreaRef.current;
    if (!area) return;
    const draggableTarget = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    const target = draggableTarget?.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();
    if (!target) return;
    const currentPosition = dragPositions[id] ?? {
      left: target.left - areaRect.left,
      top: target.top - areaRect.top,
    };

    setDragPositions((current) => ({ ...current, [id]: currentPosition }));
    dragRef.current = {
      id,
      offsetX: event.clientX - target.left,
      offsetY: event.clientY - target.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const area = desktopAreaRef.current;
    if (!drag || !area) return;
    const areaRect = area.getBoundingClientRect();
    const draggableTarget = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    const target = draggableTarget?.getBoundingClientRect();
    if (!target) return;
    const nextLeft = event.clientX - areaRect.left - drag.offsetX;
    const nextTop = event.clientY - areaRect.top - drag.offsetY;
    const maxLeft = Math.max(0, areaRect.width - target.width);
    const maxTop = Math.max(0, areaRect.height - target.height);
    const left = drag.id === 'sticky' ? Math.max(0, Math.min(maxLeft, nextLeft)) : nextLeft;
    const top = drag.id === 'sticky' ? Math.max(0, Math.min(maxTop, nextTop)) : nextTop;
    if (Math.abs(left - (dragPositions[drag.id]?.left ?? left)) > 2 || Math.abs(top - (dragPositions[drag.id]?.top ?? top)) > 2) {
      drag.moved = true;
    }
    setDragPositions((current) => ({ ...current, [drag.id]: { left, top } }));
  };
  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };
  const startResize = (id: DesktopItemId, event: ReactPointerEvent<HTMLSpanElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    const target = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    resizeRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;
    const minWidth = resize.id === 'sticky' ? 92 : 320;
    const minHeight = resize.id === 'sticky' ? 54 : 240;
    const width = Math.max(minWidth, resize.startWidth + event.clientX - resize.startX);
    const height = Math.max(minHeight, resize.startHeight + event.clientY - resize.startY);
    setItemSizes((current) => ({ ...current, [resize.id]: { width, height } }));
  };
  const endResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resizeRef.current = null;
  };
  const startFolderDrag = (id: WindowId, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    const area = desktopAreaRef.current;
    if (!area) return;
    const areaRect = area.getBoundingClientRect();
    const target = event.currentTarget.getBoundingClientRect();
    const left = target.left - areaRect.left;
    const top = target.top - areaRect.top;
    folderDragRef.current = {
      id,
      offsetX: event.clientX - target.left,
      offsetY: event.clientY - target.top,
      moved: false,
      startLeft: left,
      startTop: top,
    };
    setFolderPositions((current) => ({ ...current, [id]: current[id] ?? { left, top } }));
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveFolderDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = folderDragRef.current;
    const area = desktopAreaRef.current;
    if (!drag || !area) return;
    const areaRect = area.getBoundingClientRect();
    const target = event.currentTarget.getBoundingClientRect();
    const left = Math.max(0, Math.min(areaRect.width - target.width, event.clientX - areaRect.left - drag.offsetX));
    const top = Math.max(0, Math.min(areaRect.height - target.height, event.clientY - areaRect.top - drag.offsetY));
    if (Math.abs(left - drag.startLeft) > 3 || Math.abs(top - drag.startTop) > 3) {
      drag.moved = true;
    }
    setFolderPositions((current) => ({ ...current, [drag.id]: { left, top } }));
  };
  const endFolderDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const drag = folderDragRef.current;
    if (!drag?.moved || !snapToGrid) return;
    const area = desktopAreaRef.current;
    const position = folderPositions[drag.id];
    if (!area || !position) return;
    const target = event.currentTarget.getBoundingClientRect();
    const grid = iconSize === 'large' ? 96 : 76;
    const left = Math.max(0, Math.min(area.clientWidth - target.width, Math.round(position.left / grid) * grid));
    const top = Math.max(0, Math.min(area.clientHeight - target.height, Math.round(position.top / grid) * grid));
    setFolderPositions((current) => ({ ...current, [drag.id]: { left, top } }));
  };
  const handleFolderClick = (id: WindowId) => {
    if (folderDragRef.current?.id === id && folderDragRef.current.moved) {
      folderDragRef.current = null;
      return;
    }
    folderDragRef.current = null;
    if (windows[id]) {
      setActiveWindow(id);
      return;
    }
    openWindow(id);
  };
  const positionStyle = (id: DesktopItemId): React.CSSProperties | undefined => {
    const position = dragPositions[id];
    return position ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto' } : undefined;
  };
  const itemStyle = (id: DesktopItemId): React.CSSProperties => ({
    ...positionStyle(id),
    ...(itemSizes[id] ? { width: itemSizes[id]?.width, height: itemSizes[id]?.height } : {}),
  });
  const openDesktopContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('.window, .desktop-note, .desktop-folder')) return;
    event.preventDefault();
    setContextMenu({
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - 430)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - 270)),
    });
  };
  const autoArrangeIcons = () => {
    const area = desktopAreaRef.current;
    if (!area) return;
    const width = iconSize === 'large' ? 88 : 70;
    const row = iconSize === 'large' ? 86 : 68;
    const left = Math.max(16, area.clientWidth - width - 28);
    setFolderPositions({
      about: { left, top: 62 },
      work: { left, top: 62 + row },
      notes: { left, top: 62 + row * 2 },
    });
    setContextMenu(null);
  };
  const resetDesktop = () => {
    if (!window.confirm('Reset icon positions and desktop preferences to their original settings?')) return;
    try {
      window.localStorage.removeItem(DESKTOP_STORAGE_KEY);
    } catch {
      // State still resets for this session when storage is unavailable.
    }
    setFolderPositions(defaultDesktopState.folderPositions);
    setDragPositions(defaultDesktopState.itemPositions);
    setItemSizes(defaultDesktopState.itemSizes);
    setIconSize(defaultDesktopState.iconSize);
    setSnapToGrid(defaultDesktopState.snapToGrid);
    setTheme(defaultDesktopState.theme);
    setShowDesktopIcons(defaultDesktopState.showDesktopIcons);
    setContextMenu(null);
  };
  const windowProps = (id: WindowId) => ({
    active: activeWindow === id,
    onFocus: () => setActiveWindow(id),
    onClose: () => closeWindow(id),
    onMinimize: () => minimizeWindow(id),
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      setActiveWindow(id);
      startDrag(id, event);
    },
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onResizeStart: (event: ReactPointerEvent<HTMLSpanElement>) => startResize(id, event),
    onResizeMove: moveResize,
    onResizeEnd: endResize,
    style: itemStyle(id),
  });

  return (
    <main className={`os-shell theme-${theme} icons-${iconSize}`} onPointerDown={() => setContextMenu(null)}>
      <header className="system-bar">
        <div className="system-left">
          <Apple className="system-logo" size={14} strokeWidth={1.8} aria-hidden="true" />
          <span className="system-mark">ALEX.OS</span>
          <span className="system-separator">/</span>
          <span className="system-location">Brooklyn, NY</span>
          <span className="system-separator">/</span>
          <span className="system-location">workspace</span>
        </div>
        <div className="system-right">
          <span className="system-network">open to good problems</span>
          <span className="system-status"><span className="status-dot" />online</span>
          <Wifi className="system-network" size={14} />
          <BatteryMedium className="system-network" size={16} />
          <span data-testid="text-system-clock">{clock}</span>
          <button className="mobile-menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Open portfolio menu" data-testid="button-mobile-menu"><Menu size={17} /></button>
        </div>
      </header>

      <div className="desktop-area" ref={desktopAreaRef} onContextMenu={openDesktopContextMenu}>
        <div className="desktop-intro">
          <span className="eyebrow">personal workspace / v1.0</span>
          <h1>Thoughtful interfaces.<br /><em>Fast systems.</em></h1>
          <p>Alex Rivera is a product-minded frontend engineer making software feel clear, capable, and a little more human.</p>
          <div className="quick-actions">
            <button className="quick-button primary" onClick={() => openWindow('work')} data-testid="button-open-work">open work <ChevronRight size={13} /></button>
            <button className="quick-button" onClick={() => openWindow('contact')} data-testid="button-open-contact">say hello <Mail size={13} /></button>
          </div>
        </div>

        {showDesktopIcons && (
          <div className="desktop-folders" aria-label="Portfolio folders">
            <DesktopFolder id="about" label="about" open={windows.about} onToggle={() => handleFolderClick('about')} onPointerDown={(event) => startFolderDrag('about', event)} onPointerMove={moveFolderDrag} onPointerUp={endFolderDrag} style={folderPositions.about ? { left: folderPositions.about.left, top: folderPositions.about.top, bottom: 'auto' } : undefined} />
            <DesktopFolder id="work" label="work" open={windows.work} onToggle={() => handleFolderClick('work')} onPointerDown={(event) => startFolderDrag('work', event)} onPointerMove={moveFolderDrag} onPointerUp={endFolderDrag} style={folderPositions.work ? { left: folderPositions.work.left, top: folderPositions.work.top, bottom: 'auto' } : undefined} />
            <DesktopFolder id="notes" label="notes" open={windows.notes} onToggle={() => handleFolderClick('notes')} onPointerDown={(event) => startFolderDrag('notes', event)} onPointerMove={moveFolderDrag} onPointerUp={endFolderDrag} style={folderPositions.notes ? { left: folderPositions.notes.left, top: folderPositions.notes.top, bottom: 'auto' } : undefined} />
          </div>
        )}

        <aside
          className="desktop-note"
          data-draggable-item
          style={itemStyle('sticky')}
          onPointerDown={(event) => startDrag('sticky', event)}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          aria-label="Draggable field note"
        >
          <span className="note-label">field note / 004</span>
          <p>The best interfaces don’t ask for attention. They earn trust, one tiny response at a time.</p>
          <span className="note-signoff">— alex, 09:42</span>
          <span
            className="desktop-resize-handle"
            onPointerDown={(event) => { event.stopPropagation(); startResize('sticky', event); }}
            onPointerMove={moveResize}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            role="separator"
            aria-label="Resize field note"
            tabIndex={0}
          />
        </aside>

        {windows.work && <WorkWindow {...windowProps('work')} />}
        {windows.about && <AboutWindow {...windowProps('about')} />}
        {windows.notes && <NotesWindow {...windowProps('notes')} />}
        {windows.contact && <ContactWindow {...windowProps('contact')} />}
        {windows.terminal && <TerminalWindow {...windowProps('terminal')} />}
      </div>

      {contextMenu && (
        <div
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          role="menu"
          aria-label="Desktop options"
          data-testid="menu-desktop-context"
        >
          <div className="context-menu-row has-submenu">
            <button type="button" role="menuitem" aria-haspopup="menu"><span className="context-check" /><span>View</span><ChevronRight size={13} /></button>
            <div className="context-submenu" role="menu" aria-label="Icon size">
              <button type="button" role="menuitemradio" aria-checked={iconSize === 'large'} onClick={() => { setIconSize('large'); setContextMenu(null); }}><span className="context-check">{iconSize === 'large' && <Check size={12} />}</span><span>Large icons</span></button>
              <button type="button" role="menuitemradio" aria-checked={iconSize === 'small'} onClick={() => { setIconSize('small'); setContextMenu(null); }}><span className="context-check">{iconSize === 'small' && <Check size={12} />}</span><span>Small icons</span></button>
            </div>
          </div>
          <button type="button" className="context-menu-button" role="menuitemcheckbox" aria-checked={snapToGrid} onClick={() => setSnapToGrid((value) => !value)}><span className="context-check">{snapToGrid && <Check size={12} />}</span><span>Snap to grid</span></button>
          <button type="button" className="context-menu-button" role="menuitem" onClick={autoArrangeIcons}><span className="context-check" /><span>Auto arrange icons</span></button>
          <div className="context-menu-separator" />
          <div className="context-menu-row has-submenu">
            <button type="button" role="menuitem" aria-haspopup="menu"><span className="context-check" /><span>Theme</span><ChevronRight size={13} /></button>
            <div className="context-submenu" role="menu" aria-label="Theme">
              <button type="button" role="menuitemradio" aria-checked={theme === 'light'} onClick={() => { setTheme('light'); setContextMenu(null); }}><span className="context-check">{theme === 'light' && <Check size={12} />}</span><span>Light</span></button>
              <button type="button" role="menuitemradio" aria-checked={theme === 'dark'} onClick={() => { setTheme('dark'); setContextMenu(null); }}><span className="context-check">{theme === 'dark' && <Check size={12} />}</span><span>Dark</span></button>
            </div>
          </div>
          <div className="context-menu-separator" />
          <button type="button" className="context-menu-button" role="menuitemcheckbox" aria-checked={showDesktopIcons} onClick={() => setShowDesktopIcons((value) => !value)}><span className="context-check">{showDesktopIcons && <Check size={12} />}</span><span>Show desktop icons</span></button>
          <div className="context-menu-separator" />
          <button type="button" className="context-menu-button context-menu-danger" role="menuitem" onClick={resetDesktop}><span className="context-check" /><span>Reset desktop…</span></button>
        </div>
      )}

      <nav className="dock" aria-label="Portfolio applications">
        <button className={`dock-item ${windows.about ? 'active' : ''}`} onClick={() => openWindow('about')} aria-label="Open about" data-testid="button-dock-about"><UserRound size={20} /><span>About · 1</span></button>
        <button className={`dock-item ${windows.work ? 'active' : ''}`} onClick={() => openWindow('work')} aria-label="Open work" data-testid="button-dock-work"><FolderGit2 size={20} /><span>Work · 2</span></button>
        <button className={`dock-item ${windows.notes ? 'active' : ''}`} onClick={() => openWindow('notes')} aria-label="Open notes and stack" data-testid="button-dock-notes"><BookOpen size={20} /><span>Notes · 3</span></button>
        <button className={`dock-item ${windows.terminal ? 'active' : ''}`} onClick={() => openWindow('terminal')} aria-label="Open terminal" data-testid="button-dock-terminal"><Terminal size={20} /><span>Terminal · `</span></button>
        <button className={`dock-item ${windows.contact ? 'active' : ''}`} onClick={() => openWindow('contact')} aria-label="Open contact" data-testid="button-dock-contact"><Mail size={20} /><span>Contact · 4</span></button>
        <button className="dock-item" onClick={() => setMobileOpen((value) => !value)} aria-label="Show keyboard shortcuts" data-testid="button-dock-shortcuts"><Command size={19} /><span>Shortcuts</span></button>
      </nav>

      {mobileOpen && (
        <div className="mobile-shortcut-menu" data-testid="menu-mobile">
          <div className="section-kicker">keyboard map</div>
          <p style={{ margin: '9px 0 14px', fontSize: 12 }}>Use 1–4 to open a window. Press backtick for the terminal. Escape closes this menu.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {(['about', 'work', 'notes', 'contact'] as WindowId[]).map((id, index) => <button key={id} className="quick-button" onClick={() => openWindow(id)} data-testid={`button-menu-${id}`}><span className="shortcut-number">{index + 1}</span>{id}</button>)}
          </div>
        </div>
      )}
      <div className="desktop-hint"><MousePointer2 size={11} />click around, stay curious</div>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;