import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Sparkle as Apple, ArrowLeft, ArrowUpRight, BatteryMedium, ChevronRight,
  Check, FileText as StickyNote, Keyboard as Command, GitGraph as FolderGit2, Mail, Maximize2, Menu, Minus,
  Plus, Cursor as MousePointer2, Terminal, CircleUser as UserRound, Wifi, X,
} from '@keyline-icons/react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type WindowId = 'about' | 'work' | 'contact' | 'terminal';
type WindowState = Record<WindowId, boolean>;
type IconSize = 'large' | 'small';
type Theme = 'dark' | 'light';
type DesktopLauncherId = WindowId | 'stickies-app';
type FolderPositions = Partial<Record<DesktopLauncherId, { left: number; top: number }>>;
type StickyItemId = 'sticky' | `sticky-${number}`;
type DesktopLauncherDragId = `desktop-${DesktopLauncherId}`;
type DesktopItemId = WindowId | StickyItemId | DesktopLauncherDragId;
type ItemPositions = Partial<Record<DesktopItemId, { left: number; top: number }>>;
type ItemSizes = Partial<Record<DesktopItemId, { width: number; height: number }>>;
type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
type DockPosition = 'top' | 'right' | 'bottom' | 'left';

const stickyPalette = [
  { id: 'lemon', label: 'Lemon', background: 'rgba(255, 216, 77, .82)', foreground: 'dark', handle: '#8f6900' },
  { id: 'orange', label: 'Orange', background: 'rgba(255, 184, 77, .82)', foreground: 'dark', handle: '#9f5700' },
  { id: 'coral', label: 'Coral', background: 'rgba(255, 170, 163, .82)', foreground: 'dark', handle: '#9d4648' },
  { id: 'cream', label: 'Cream', background: 'rgba(255, 240, 210, .82)', foreground: 'dark', handle: '#a88655' },
  { id: 'teal', label: 'Teal', background: 'rgba(0, 100, 86, .82)', foreground: 'light', handle: '#76dccb' },
  { id: 'blue', label: 'Blue', background: 'rgba(13, 86, 179, .82)', foreground: 'light', handle: '#8ac4ff' },
  { id: 'purple', label: 'Purple', background: 'rgba(102, 72, 184, .82)', foreground: 'light', handle: '#c8b3ff' },
  { id: 'berry', label: 'Berry', background: 'rgba(169, 53, 112, .82)', foreground: 'light', handle: '#ffb2d5' },
  { id: 'forest', label: 'Forest', background: 'rgba(30, 96, 61, .82)', foreground: 'light', handle: '#91d6aa' },
  { id: 'charcoal', label: 'Charcoal', background: 'rgba(52, 59, 79, .82)', foreground: 'light', handle: '#b8c2dd' },
] as const;
type StickyColorId = typeof stickyPalette[number]['id'];
type StickyData = {
  id: StickyItemId;
  color: StickyColorId;
  text: string;
  rotation: number;
  author: 'alex' | 'user';
  createdAt: string;
};

const defaultSticky: StickyData = {
  id: 'sticky',
  color: 'lemon',
  text: 'The best interfaces don’t ask for attention. They earn trust, one tiny response at a time.',
  rotation: 3,
  author: 'alex',
  createdAt: '09:42',
};

const formatStickyTime = () => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date());
const createUserSticky = (id: StickyItemId, color: StickyColorId = defaultSticky.color, rotation = defaultSticky.rotation): StickyData => ({
  id,
  color,
  text: '',
  rotation,
  author: 'user',
  createdAt: formatStickyTime(),
});

type SavedDesktopState = {
  folderPositions: FolderPositions;
  itemPositions: ItemPositions;
  itemSizes: ItemSizes;
  iconSize: IconSize;
  snapToGrid: boolean;
  theme: Theme;
  showDesktopIcons: boolean;
  stickies: StickyData[];
  dockPosition: DockPosition;
};

const DESKTOP_STORAGE_KEY = 'alex-os.desktop.v1';
const defaultDesktopState: SavedDesktopState = {
  folderPositions: {},
  itemPositions: {},
  itemSizes: {},
  iconSize: 'large',
  snapToGrid: false,
  theme: 'light',
  showDesktopIcons: true,
  stickies: [defaultSticky],
  dockPosition: 'bottom',
};

function loadDesktopState(): SavedDesktopState {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(DESKTOP_STORAGE_KEY) ?? '{}') as Partial<SavedDesktopState> & { stickyColor?: StickyColorId };
    const folderPositions = Object.fromEntries(
      Object.entries(parsed.folderPositions ?? {}).filter((entry): entry is [string, { left: number; top: number }] => {
        const position = entry[1];
        return Boolean(position) && Number.isFinite(position.left) && Number.isFinite(position.top);
      }),
    ) as FolderPositions;
    const itemPositions = Object.fromEntries(
      Object.entries(parsed.itemPositions ?? {}).filter((entry): entry is [string, { left: number; top: number }] => {
        const position = entry[1];
        return position !== undefined && Number.isFinite(position.left) && Number.isFinite(position.top);
      }),
    ) as ItemPositions;
    const itemSizes = Object.fromEntries(
      Object.entries(parsed.itemSizes ?? {}).filter((entry): entry is [string, { width: number; height: number }] => {
        const size = entry[1];
        return size !== undefined && Number.isFinite(size.width) && size.width > 0 && Number.isFinite(size.height) && size.height > 0;
      }),
    ) as ItemSizes;
    const stickies = Array.isArray(parsed.stickies)
      ? parsed.stickies.flatMap((sticky) => (
        Boolean(sticky)
        && (sticky.id === 'sticky' || /^sticky-\d+$/.test(sticky.id))
        && stickyPalette.some((color) => color.id === sticky.color)
        && typeof sticky.text === 'string'
          ? [{
            ...sticky,
            rotation: Number.isFinite(sticky.rotation) ? sticky.rotation : 3,
            author: sticky.author === 'user' || sticky.author === 'alex' ? sticky.author : sticky.id === 'sticky' ? 'alex' : 'user',
            createdAt: typeof sticky.createdAt === 'string' && sticky.createdAt ? sticky.createdAt : sticky.id === 'sticky' ? '09:42' : 'saved',
          }]
          : []
      ))
      : [{
        ...defaultSticky,
        color: stickyPalette.some((color) => color.id === parsed.stickyColor)
          ? parsed.stickyColor as StickyColorId
          : defaultSticky.color,
      }];

    return {
      folderPositions,
      itemPositions,
      itemSizes,
      iconSize: parsed.iconSize === 'small' ? 'small' : defaultDesktopState.iconSize,
      snapToGrid: typeof parsed.snapToGrid === 'boolean' ? parsed.snapToGrid : defaultDesktopState.snapToGrid,
      theme: parsed.theme === 'light' || parsed.theme === 'dark' ? parsed.theme : defaultDesktopState.theme,
      showDesktopIcons: typeof parsed.showDesktopIcons === 'boolean' ? parsed.showDesktopIcons : defaultDesktopState.showDesktopIcons,
      stickies: Array.isArray(parsed.stickies) ? stickies : [defaultSticky],
      dockPosition: ['bottom', 'top', 'left', 'right'].includes(parsed.dockPosition as string) ? (parsed.dockPosition as DockPosition) : defaultDesktopState.dockPosition,
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
  contact: false,
  terminal: true,
};

function WindowFrame({
  id,
  title,
  active,
  maximized,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
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
  maximized: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onResizeStart: (event: ReactPointerEvent<HTMLSpanElement>, direction: ResizeDirection) => void;
  onResizeMove: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  onResizeEnd: (event: ReactPointerEvent<HTMLSpanElement>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <section
      className={`window ${id} ${active ? 'is-active' : ''} ${maximized ? 'is-maximized' : ''}`}
      onMouseDown={onFocus}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      data-draggable-item
      style={style}
      data-testid={`window-${id}`}
      aria-label={`${title} window`}
    >
      <header className="window-header" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <span className="window-header-spacer" aria-hidden="true" />
        <div className="window-title"><strong>~/alex/</strong>{title.toLowerCase()}</div>
        <div className="traffic-lights" onPointerDown={(event) => event.stopPropagation()}>
          <button className="minimize" onClick={onMinimize} aria-label={`Minimize ${title}`} title="Minimize" data-testid={`button-minimize-${id}`}><Minus size={10} strokeWidth={2.6} /><span className="window-control-tooltip">Minimize</span></button>
          <button className="maximize" onClick={onMaximize} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}`} title={maximized ? 'Restore' : 'Maximize'} data-testid={`button-maximize-${id}`}><Maximize2 size={9} strokeWidth={2.4} /><span className="window-control-tooltip">{maximized ? 'Restore' : 'Maximize'}</span></button>
          <button className="close" onClick={onClose} aria-label={`Close ${title}`} title="Close" data-testid={`button-close-${id}`}><X size={9} strokeWidth={2.6} /><span className="window-control-tooltip">Close</span></button>
        </div>
      </header>
      {children}
      {!maximized && (['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as ResizeDirection[]).map((direction) => (
        <span
          key={direction}
          className={`window-resize-handle window-resize-${direction}`}
          onPointerDown={(event) => { event.stopPropagation(); onResizeStart(event, direction); }}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
          onPointerCancel={onResizeEnd}
          role="separator"
          aria-label={`Resize ${title} window from ${direction}`}
        />
      ))}
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

type ShellNode = { type: 'directory' } | { type: 'file'; content: string };
type ShellEntry = { id: number; cwd: string; command: string; output?: string; error?: boolean };

const shellFiles: Record<string, ShellNode> = {
  '/': { type: 'directory' },
  '/home': { type: 'directory' },
  '/home/alex': { type: 'directory' },
  '/home/alex/README.md': { type: 'file', content: 'Alex Rivera\nProduct-minded frontend engineer building thoughtful interfaces and fast systems.\n\nTry: ls, cd work, cat README.md, open work' },
  '/home/alex/about': { type: 'directory' },
  '/home/alex/about/bio.txt': { type: 'file', content: 'Frontend engineer, product thinker, and detail obsessive. I turn complex systems into clear, capable interfaces.' },
  '/home/alex/about/skills.txt': { type: 'file', content: 'TypeScript  React  CSS systems  Node.js  Postgres  Figma  Playwright' },
  '/home/alex/work': { type: 'directory' },
  '/home/alex/work/orbit-crm.md': { type: 'file', content: 'Orbit CRM\nA calmer command center for customer teams managing complex accounts.\nProduct design + frontend engineering · 2024' },
  '/home/alex/work/field-notes.md': { type: 'file', content: 'Field Notes\nOffline-first field research software for teams who work beyond the signal.\nSystems · 2023' },
  '/home/alex/work/signal-kit.md': { type: 'file', content: 'Signal Kit\nA living component library that turns product intent into shipped interface.\nDesign engineering · 2023' },
  '/home/alex/contact': { type: 'directory' },
  '/home/alex/contact/contact.txt': { type: 'file', content: 'Email: hello@alexrivera.dev\nStatus: Open to thoughtful product partnerships.' },
};

const shellCommands = ['help', 'ls', 'pwd', 'cd', 'cat', 'open', 'close', 'theme', 'history', 'whoami', 'date', 'echo', 'clear', 'exit'];
const shellExamples = ['ls', 'cd work', 'cat orbit-crm.md', 'open work', 'theme light', 'history', 'clear'];

function normalizeShellPath(cwd: string, target = '~') {
  const home = '/home/alex';
  const expanded = target.startsWith('~') ? `${home}${target.slice(1)}` : target;
  const source = expanded.startsWith('/') ? expanded : `${cwd}/${expanded}`;
  const parts: string[] = [];
  for (const part of source.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return `/${parts.join('/')}` || '/';
}

function displayShellPath(path: string) {
  if (path === '/home/alex') return '~';
  if (path.startsWith('/home/alex/')) return `~${path.slice('/home/alex'.length)}`;
  return path;
}

function listShellDirectory(path: string) {
  const prefix = path === '/' ? '/' : `${path}/`;
  return Object.keys(shellFiles)
    .filter((candidate) => candidate.startsWith(prefix) && candidate !== path)
    .map((candidate) => candidate.slice(prefix.length).split('/')[0])
    .filter((name, index, names) => name && names.indexOf(name) === index)
    .sort();
}

function TerminalWindow({
  onOpenWindow,
  onCloseWindow,
  onSetTheme,
  openWindows,
  currentTheme,
  ...props
}: Omit<React.ComponentProps<typeof WindowFrame>, 'children' | 'title' | 'id'> & {
  onOpenWindow: (id: WindowId) => void;
  onCloseWindow: (id: WindowId) => void;
  onSetTheme: (theme: Theme) => void;
  openWindows: WindowState;
  currentTheme: Theme;
}) {
  const [command, setCommand] = useState('');
  const [entries, setEntries] = useState<ShellEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [cwd, setCwd] = useState('/home/alex');
  const [previousCwd, setPreviousCwd] = useState('/home/alex');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const nextEntryId = useRef(1);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [entries, cwd]);

  const appendEntry = (raw: string, output?: string, error = false, entryCwd = cwd) => {
    setEntries((current) => [...current, { id: nextEntryId.current++, cwd: entryCwd, command: raw, output, error }]);
  };

  const insertCommand = (example: string) => {
    setCommand(example);
    setHistoryIndex(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const completeCommand = () => {
    const trimmedStart = command.replace(/^\s+/, '');
    const parts = trimmedStart.split(/\s+/);
    if (parts.length === 1 && !trimmedStart.endsWith(' ')) {
      const matches = shellCommands.filter((item) => item.startsWith(parts[0].toLowerCase()));
      if (matches.length === 1) setCommand(`${matches[0]} `);
      return;
    }
    const token = parts.at(-1) ?? '';
    const slash = token.lastIndexOf('/');
    const parentToken = slash >= 0 ? token.slice(0, slash + 1) : '';
    const fragment = slash >= 0 ? token.slice(slash + 1) : token;
    const parentPath = normalizeShellPath(cwd, parentToken || '.');
    const matches = listShellDirectory(parentPath).filter((name) => name.startsWith(fragment));
    if (matches.length !== 1) return;
    const completedPath = normalizeShellPath(parentPath, matches[0]);
    const suffix = shellFiles[completedPath]?.type === 'directory' ? '/' : '';
    parts[parts.length - 1] = `${parentToken}${matches[0]}${suffix}`;
    setCommand(parts.join(' '));
  };

  const submitCommand = (event: FormEvent) => {
    event.preventDefault();
    const raw = command.trim();
    if (!raw) return;
    const [rawVerb, ...rawArgs] = raw.split(/\s+/);
    const verb = rawVerb.toLowerCase();
    const args = rawArgs.join(' ');
    const entryCwd = cwd;
    const nextHistory = [...commandHistory, raw];
    setCommandHistory(nextHistory);
    setHistoryIndex(null);
    setCommand('');

    if (verb === 'exit') {
      props.onClose();
      return;
    }
    if (verb === 'clear') {
      setEntries([]);
      return;
    }
    if (verb === 'help') {
      appendEntry(raw, 'Filesystem\n  ls [path]       list files\n  pwd             print current directory\n  cd [path]       change directory (cd - returns)\n  cat <file>      read a file\n\nSite controls\n  open <name>     open about, work, contact, or terminal\n  close <name>    close a window (or: close all)\n  theme <mode>    switch light or dark theme\n\nShell\n  history         show command history\n  whoami          identify the current user\n  date            show local date and time\n  echo <text>     print text\n  clear           clear terminal output\n  exit            close the terminal\n\nUse ↑/↓ for history and Tab to complete commands or paths.');
      return;
    }
    if (verb === 'pwd') {
      appendEntry(raw, cwd);
      return;
    }
    if (verb === 'ls') {
      const path = normalizeShellPath(cwd, args || '.');
      const node = shellFiles[path];
      if (!node) appendEntry(raw, `ls: cannot access '${args || '.'}': No such file or directory`, true);
      else if (node.type !== 'directory') appendEntry(raw, path.split('/').pop());
      else appendEntry(raw, listShellDirectory(path).map((name) => shellFiles[normalizeShellPath(path, name)]?.type === 'directory' ? `${name}/` : name).join('   ') || '(empty)');
      return;
    }
    if (verb === 'cd') {
      const target = args === '-' ? previousCwd : normalizeShellPath(cwd, args || '~');
      const node = shellFiles[target];
      if (!node) appendEntry(raw, `cd: ${args || '~'}: No such file or directory`, true);
      else if (node.type !== 'directory') appendEntry(raw, `cd: ${args}: Not a directory`, true);
      else if (target === cwd) appendEntry(raw, `Already in ${displayShellPath(target)}.`);
      else {
        appendEntry(raw, args === '-' ? displayShellPath(target) : undefined, false, entryCwd);
        setPreviousCwd(cwd);
        setCwd(target);
      }
      return;
    }
    if (verb === 'cat') {
      if (!args) {
        appendEntry(raw, 'cat: missing file operand', true);
        return;
      }
      const path = normalizeShellPath(cwd, args);
      const node = shellFiles[path];
      if (!node) appendEntry(raw, `cat: ${args}: No such file or directory`, true);
      else if (node.type === 'directory') appendEntry(raw, `cat: ${args}: Is a directory`, true);
      else appendEntry(raw, node.content);
      return;
    }
    if (verb === 'open' || verb === 'close') {
      const target = rawArgs[0]?.toLowerCase();
      const validWindows: WindowId[] = ['about', 'work', 'contact', 'terminal'];
      if (verb === 'close' && target === 'all') {
        const openPortfolioWindows = (['about', 'work', 'contact'] as WindowId[]).filter((id) => openWindows[id]);
        if (!openPortfolioWindows.length) appendEntry(raw, 'All portfolio windows are already closed.');
        else {
          openPortfolioWindows.forEach(onCloseWindow);
          appendEntry(raw, 'Closed all portfolio windows.');
        }
      } else if (!validWindows.includes(target as WindowId)) {
        appendEntry(raw, `${verb}: expected about, work, contact, terminal${verb === 'close' ? ', or all' : ''}`, true);
      } else if (verb === 'open' && openWindows[target as WindowId]) {
        appendEntry(raw, `${target} is already open.`);
      } else if (verb === 'close' && !openWindows[target as WindowId]) {
        appendEntry(raw, `${target} is already closed.`);
      } else {
        if (verb === 'open') onOpenWindow(target as WindowId);
        else if (target === 'terminal') props.onClose();
        else onCloseWindow(target as WindowId);
        appendEntry(raw, `${verb === 'open' ? 'Opened' : 'Closed'} ${target}.`);
      }
      return;
    }
    if (verb === 'theme') {
      const mode = rawArgs[0]?.toLowerCase();
      if (mode !== 'light' && mode !== 'dark') appendEntry(raw, 'theme: expected light or dark', true);
      else if (mode === currentTheme) appendEntry(raw, `${mode} theme is already active.`);
      else {
        onSetTheme(mode);
        appendEntry(raw, `Theme changed to ${mode}.`);
      }
      return;
    }
    if (verb === 'history') {
      appendEntry(raw, nextHistory.map((item, index) => `${String(index + 1).padStart(3, ' ')}  ${item}`).join('\n'));
      return;
    }
    if (verb === 'whoami') {
      appendEntry(raw, 'alex');
      return;
    }
    if (verb === 'date') {
      appendEntry(raw, new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(new Date()));
      return;
    }
    if (verb === 'echo') {
      appendEntry(raw, rawArgs.join(' '));
      return;
    }
    appendEntry(raw, `${rawVerb}: command not found. Type 'help' for available commands.`, true);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      completeCommand();
      return;
    }
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    if (!commandHistory.length) return;
    if (event.key === 'ArrowUp') {
      const nextIndex = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex]);
    } else {
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <WindowFrame {...props} id="terminal" title="Terminal">
      <div ref={bodyRef} className="window-body terminal-body" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-line"><span className="terminal-prompt">alex@studio:~$</span><span className="terminal-command">whoami</span></div>
        <div className="terminal-output">alex rivera / product-minded frontend engineer{'\n'}building thoughtful interfaces and fast systems.</div>
        <div className="terminal-output terminal-hint">type “help” to explore. use ↑/↓ for history and Tab to complete.</div>
        {entries.map((entry) => (
          <div className="terminal-entry" key={entry.id}>
            <div className="terminal-line"><span className="terminal-prompt">alex@studio:{displayShellPath(entry.cwd)}$</span><span className="terminal-command">{entry.command}</span></div>
            {entry.output && <div className={`terminal-output ${entry.error ? 'terminal-error' : ''}`} onPointerDown={(event) => event.stopPropagation()}>{entry.output}</div>}
            {entry.command.toLowerCase() === 'help' && (
              <div className="terminal-examples" aria-label="Example terminal commands">
                <span>click to paste:</span>
                {shellExamples.map((example) => <button type="button" key={example} onClick={() => insertCommand(example)}>{example}</button>)}
              </div>
            )}
          </div>
        ))}
        <form className="terminal-form" onSubmit={submitCommand}>
          <span className="terminal-prompt">alex@studio:{displayShellPath(cwd)}$</span>
          <input ref={inputRef} className="terminal-input" value={command} onChange={(event) => { setCommand(event.target.value); setHistoryIndex(null); }} onKeyDown={handleInputKeyDown} aria-label="Terminal command" placeholder="type a command" data-testid="input-terminal-command" autoComplete="off" spellCheck={false} />
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
  appIcon,
}: {
  id: DesktopLauncherId;
  label: string;
  open: boolean;
  onToggle: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  appIcon?: ReactNode;
}) {
  return (
    <button
      className={`desktop-folder desktop-launcher-${id} ${appIcon ? 'desktop-app' : ''} ${open ? 'is-open' : ''}`}
      onDoubleClick={onToggle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDragStart={(event) => event.preventDefault()}
      style={style}
      aria-pressed={open}
      aria-label={`Double-click to ${open ? 'focus' : 'open'} ${label} ${appIcon ? 'application' : 'folder'}`}
      title={`Double-click to ${open ? 'focus' : 'open'} ${label}`}
      data-draggable-item
      data-testid={`button-folder-${id}`}
    >
      {appIcon
        ? <span className="desktop-app-icon" aria-hidden="true">{appIcon}</span>
        : <span className="desktop-folder-icon" aria-hidden="true" />}
      <span className="desktop-folder-label">{label}</span>
      <span className="desktop-icon-tooltip" aria-hidden="true">Double-click to {open ? 'focus' : 'open'} {label}</span>
    </button>
  );
}

function Home() {
  const [savedDesktopState] = useState(loadDesktopState);
  const [windows, setWindows] = useState<WindowState>(initialWindows);
  const [activeWindow, setActiveWindow] = useState<WindowId>('work');
  const [clock, setClock] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(true);
  const [stickyOnTop, setStickyOnTop] = useState(false);
  const [maximizedWindows, setMaximizedWindows] = useState<Partial<Record<WindowId, boolean>>>({});
  const [activeStickyId, setActiveStickyId] = useState<StickyItemId>('sticky');
  const [stickies, setStickies] = useState<StickyData[]>(savedDesktopState.stickies);
  const [dragPositions, setDragPositions] = useState<ItemPositions>(savedDesktopState.itemPositions);
  const [itemSizes, setItemSizes] = useState<ItemSizes>(savedDesktopState.itemSizes);
  const [folderPositions, setFolderPositions] = useState<FolderPositions>(savedDesktopState.folderPositions);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: 'desktop' | 'dock' } | null>(null);
  const [stickyMenu, setStickyMenu] = useState<{ x: number; y: number; id: StickyItemId } | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [iconSize, setIconSize] = useState<IconSize>(savedDesktopState.iconSize);
  const [snapToGrid, setSnapToGrid] = useState(savedDesktopState.snapToGrid);
  const [theme, setTheme] = useState<Theme>(savedDesktopState.theme);
  const [showDesktopIcons, setShowDesktopIcons] = useState(savedDesktopState.showDesktopIcons);
  const [dockPosition, setDockPosition] = useState<DockPosition>(savedDesktopState.dockPosition);
  const desktopAreaRef = useRef<HTMLDivElement>(null);
  const dockDragRef = useRef<{ active: boolean; startX: number; startY: number; moved: boolean } | null>(null);

  const startDockDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || window.matchMedia('(max-width: 760px)').matches) return;
    dockDragRef.current = { active: true, startX: event.clientX, startY: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDockDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!dockDragRef.current?.active) return;
    const { startX, startY } = dockDragRef.current;
    if (Math.abs(event.clientX - startX) > 10 || Math.abs(event.clientY - startY) > 10) {
      dockDragRef.current.moved = true;
      const distTop = event.clientY;
      const distBottom = window.innerHeight - event.clientY;
      const distLeft = event.clientX;
      const distRight = window.innerWidth - event.clientX;
      const min = Math.min(distTop, distBottom, distLeft, distRight);
      let newPos: DockPosition = dockPosition;
      if (min === distTop) newPos = 'top';
      else if (min === distBottom) newPos = 'bottom';
      else if (min === distLeft) newPos = 'left';
      else if (min === distRight) newPos = 'right';
      if (newPos !== dockPosition) setDockPosition(newPos);
    }
  };
  const endDockDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!dockDragRef.current?.active) return;
    dockDragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setTimeout(() => { dockDragRef.current = null; }, 50);
  };
  const dragRef = useRef<{ id: DesktopItemId; offsetX: number; offsetY: number; moved: boolean; currentLeft: number; currentTop: number } | null>(null);
  const resizeRef = useRef<{
    id: DesktopItemId;
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);
  const rotateRef = useRef<{ id: StickyItemId; centerX: number; centerY: number; pointerAngle: number; rotation: number } | null>(null);
  const lastDesktopDragRef = useRef<{ id: DesktopLauncherDragId; endedAt: number } | null>(null);

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
      stickies,
      dockPosition,
    };
    try {
      window.localStorage.setItem(DESKTOP_STORAGE_KEY, JSON.stringify(desktopState));
    } catch {
      // The desktop remains usable when storage is unavailable.
    }
  }, [dragPositions, folderPositions, iconSize, itemSizes, snapToGrid, stickies, theme, showDesktopIcons, dockPosition]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setContextMenu(null);
        setStickyMenu(null);
      }
      if (event.metaKey || event.ctrlKey) return;
      const shortcuts: Record<string, WindowId> = { '1': 'about', '2': 'work', '3': 'contact', '`': 'terminal' };
      const id = shortcuts[event.key];
      if (id) { event.preventDefault(); openWindow(id); }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  });

  const openWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: true }));
    setActiveWindow(id);
    setStickyOnTop(false);
    setMobileOpen(false);
  };
  const closeWindow = (id: WindowId) => {
    const area = desktopAreaRef.current;
    const windowElement = area?.querySelector<HTMLElement>(`[data-testid="window-${id}"]`);
    if (area && windowElement && !window.matchMedia('(max-width: 760px)').matches) {
      const areaRect = area.getBoundingClientRect();
      const windowRect = windowElement.getBoundingClientRect();
      setDragPositions((current) => ({
        ...current,
        [id]: {
          left: Math.round((areaRect.width - windowRect.width) / 2),
          top: Math.round((areaRect.height - windowRect.height) / 2),
        },
      }));
    }
    setWindows((current) => ({ ...current, [id]: false }));
  };
  const minimizeWindow = (id: WindowId) => setWindows((current) => ({ ...current, [id]: false }));
  const handleStickyDock = () => {
    if (!stickies.length) {
      setStickies([createUserSticky('sticky')]);
      setActiveStickyId('sticky');
      setStickyVisible(true);
      setStickyOnTop(true);
      setMobileOpen(false);
      return;
    }
    if (stickyVisible && stickyOnTop) {
      setStickyVisible(false);
      setStickyOnTop(false);
      return;
    }
    setStickyVisible(true);
    setStickyOnTop(true);
    setMobileOpen(false);
  };
  const openStickies = () => {
    if (!stickies.length) {
      setStickies([createUserSticky('sticky')]);
      setActiveStickyId('sticky');
    }
    setStickyVisible(true);
    setStickyOnTop(true);
    setMobileOpen(false);
  };
  const startDrag = (id: DesktopItemId, event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || window.matchMedia('(max-width: 760px)').matches) return;
    const area = desktopAreaRef.current;
    if (!area) return;
    const draggableTarget = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    if (!draggableTarget) return;
    const target = draggableTarget.getBoundingClientRect();
    const areaRect = area.getBoundingClientRect();
    const currentPosition = dragPositions[id] ?? {
      left: draggableTarget.offsetLeft,
      top: draggableTarget.offsetTop,
    };

    setDragPositions((current) => ({ ...current, [id]: currentPosition }));
    dragRef.current = {
      id,
      offsetX: event.clientX - areaRect.left - currentPosition.left,
      offsetY: event.clientY - areaRect.top - currentPosition.top,
      moved: false,
      currentLeft: currentPosition.left,
      currentTop: currentPosition.top,
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
    const padRight = dockPosition === 'right' ? 70 : 0;
    const padBottom = dockPosition === 'bottom' ? 70 : 0;
    const padLeft = dockPosition === 'left' ? 70 : 0;
    const padTop = dockPosition === 'top' ? 70 : 0;
    const maxLeft = Math.max(0, areaRect.width - target.width - padRight);
    const maxTop = Math.max(0, areaRect.height - target.height - padBottom);
    const minLeft = padLeft;
    const minTop = padTop;
    const staysOnDesktop = drag.id.startsWith('sticky') || draggableTarget?.classList.contains('desktop-folder');
    const left = staysOnDesktop ? Math.max(minLeft, Math.min(maxLeft, nextLeft)) : nextLeft;
    const top = staysOnDesktop ? Math.max(minTop, Math.min(maxTop, nextTop)) : nextTop;
    if (Math.abs(left - (dragPositions[drag.id]?.left ?? left)) > 2 || Math.abs(top - (dragPositions[drag.id]?.top ?? top)) > 2) {
      drag.moved = true;
    }
    drag.currentLeft = left;
    drag.currentTop = top;
    setDragPositions((current) => ({ ...current, [drag.id]: { left, top } }));
  };
  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
  };
  const endDesktopLauncherDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag?.moved) {
      lastDesktopDragRef.current = { id: drag.id as DesktopLauncherDragId, endedAt: performance.now() };
      if (snapToGrid) {
        const area = desktopAreaRef.current;
        const target = event.currentTarget.getBoundingClientRect();
        if (area) {
          const grid = iconSize === 'large' ? 96 : 76;
          const minLeft = dockPosition === 'left' ? 70 : 0;
          const minTop = dockPosition === 'top' ? 70 : 0;
          const maxLeft = area.clientWidth - target.width - (dockPosition === 'right' ? 70 : 0);
          const maxTop = area.clientHeight - target.height - (dockPosition === 'bottom' ? 70 : 0);
          const left = Math.max(minLeft, Math.min(maxLeft, Math.round(drag.currentLeft / grid) * grid));
          const top = Math.max(minTop, Math.min(maxTop, Math.round(drag.currentTop / grid) * grid));
          setDragPositions((current) => ({ ...current, [drag.id]: { left, top } }));
        }
      }
    }
    endDrag(event);
  };
  const startResize = (id: DesktopItemId, event: ReactPointerEvent<HTMLSpanElement>, direction: ResizeDirection = 'se') => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    const target = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    const area = desktopAreaRef.current;
    if (!target || !area) return;
    const startLeft = dragPositions[id]?.left ?? target.offsetLeft;
    const startTop = dragPositions[id]?.top ?? target.offsetTop;
    setDragPositions((current) => ({ ...current, [id]: { left: startLeft, top: startTop } }));
    resizeRef.current = {
      id,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: target.offsetWidth,
      startHeight: target.offsetHeight,
      startLeft,
      startTop,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;
    const isSticky = resize.id.startsWith('sticky');
    const minWidth = isSticky ? 140 : 320;
    const minHeight = isSticky ? 100 : 240;
    const deltaX = event.clientX - resize.startX;
    const deltaY = event.clientY - resize.startY;
    const growsEast = resize.direction.includes('e');
    const growsWest = resize.direction.includes('w');
    const growsSouth = resize.direction.includes('s');
    const growsNorth = resize.direction.includes('n');
    const width = Math.max(minWidth, resize.startWidth + (growsEast ? deltaX : growsWest ? -deltaX : 0));
    const height = Math.max(minHeight, resize.startHeight + (growsSouth ? deltaY : growsNorth ? -deltaY : 0));
    const left = growsWest ? resize.startLeft + resize.startWidth - width : resize.startLeft;
    const top = growsNorth ? resize.startTop + resize.startHeight - height : resize.startTop;
    setItemSizes((current) => ({ ...current, [resize.id]: { width, height } }));
    setDragPositions((current) => ({ ...current, [resize.id]: { left, top } }));
  };
  const endResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resizeRef.current = null;
  };
  const startRotate = (id: StickyItemId, rotation: number, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    const target = event.currentTarget.closest('[data-draggable-item]') as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rotateRef.current = {
      id,
      centerX,
      centerY,
      pointerAngle: Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI,
      rotation,
    };
    setActiveStickyId(id);
    setStickyOnTop(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.stopPropagation();
  };
  const moveRotate = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rotate = rotateRef.current;
    if (!rotate) return;
    const pointerAngle = Math.atan2(event.clientY - rotate.centerY, event.clientX - rotate.centerX) * 180 / Math.PI;
    let delta = pointerAngle - rotate.pointerAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const rawRotation = rotate.rotation + delta;
    const rotation = event.shiftKey ? Math.round(rawRotation / 15) * 15 : Math.round(rawRotation * 10) / 10;
    setStickies((current) => current.map((sticky) => sticky.id === rotate.id ? { ...sticky, rotation } : sticky));
  };
  const endRotate = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    rotateRef.current = null;
  };
  const rotateWithKeyboard = (id: StickyItemId, event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Home' || event.key === '0') {
      event.preventDefault();
      event.stopPropagation();
      setActiveStickyId(id);
      setStickyOnTop(true);
      setStickies((current) => current.map((sticky) => sticky.id === id ? { ...sticky, rotation: 0 } : sticky));
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : -1;
    const increment = event.shiftKey ? 15 : 1;
    setActiveStickyId(id);
    setStickyOnTop(true);
    setStickies((current) => current.map((sticky) => sticky.id === id ? { ...sticky, rotation: Math.round((sticky.rotation + direction * increment) * 10) / 10 } : sticky));
  };
  const handleDesktopWindowOpen = (id: WindowId) => {
    const recentDrag = lastDesktopDragRef.current;
    if (recentDrag?.id === `desktop-${id}` && performance.now() - recentDrag.endedAt < 500) {
      return;
    }
    if (windows[id]) {
      setActiveWindow(id);
      return;
    }
    openWindow(id);
  };
  const handleDesktopStickiesOpen = () => {
    const recentDrag = lastDesktopDragRef.current;
    if (recentDrag?.id === 'desktop-stickies-app' && performance.now() - recentDrag.endedAt < 500) {
      return;
    }
    openStickies();
  };
  const positionStyle = (id: DesktopItemId): React.CSSProperties | undefined => {
    const position = dragPositions[id];
    return position ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto' } : undefined;
  };
  const itemStyle = (id: DesktopItemId): React.CSSProperties => ({
    ...positionStyle(id),
    ...(itemSizes[id] ? { width: itemSizes[id]?.width, height: itemSizes[id]?.height } : {}),
  });
  const launcherStyle = (id: DesktopLauncherId): React.CSSProperties | undefined => {
    const position = dragPositions[`desktop-${id}`] ?? folderPositions[id];
    return position ? { left: position.left, top: position.top, right: 'auto', bottom: 'auto' } : undefined;
  };
  const stickyStyle = (sticky: StickyData) => {
    const selectedColor = stickyPalette.find((color) => color.id === sticky.color) ?? stickyPalette[0];
    const usesLightText = selectedColor.foreground === 'light';
    return {
      ...itemStyle(sticky.id),
      zIndex: stickyOnTop && activeStickyId === sticky.id ? 11 : 3,
      '--sticky-bg': selectedColor.background,
      '--sticky-text': usesLightText ? '#ffffff' : '#1d2430',
      '--sticky-muted': usesLightText ? '#edf1f5' : '#37414d',
      '--sticky-accent': usesLightText ? '#ffffff' : '#1d2430',
      '--sticky-border': usesLightText ? 'rgba(255, 255, 255, .28)' : 'rgba(29, 36, 48, .25)',
      '--sticky-handle': selectedColor.handle,
      '--sticky-rotation': `${sticky.rotation}deg`,
    } as React.CSSProperties;
  };
  const addSticky = (sourceId: StickyItemId) => {
    const source = stickies.find((sticky) => sticky.id === sourceId) ?? stickies[0] ?? defaultSticky;
    const numericIds = stickies.map((sticky) => sticky.id === 'sticky' ? 0 : Number(sticky.id.slice(7))).filter(Number.isFinite);
    const id = `sticky-${Math.max(0, ...numericIds) + 1}` as StickyItemId;
    const area = desktopAreaRef.current;
    const sourcePosition = dragPositions[sourceId];
    const width = itemSizes[sourceId]?.width ?? 214;
    const height = itemSizes[sourceId]?.height ?? 132;
    const offset = 28 + (stickies.length % 4) * 12;
    const left = Math.max(12, Math.min((area?.clientWidth ?? 900) - width - 12, (sourcePosition?.left ?? (area?.clientWidth ?? 900) * .58) + offset));
    const top = Math.max(18, Math.min((area?.clientHeight ?? 650) - height - 18, (sourcePosition?.top ?? 95) + offset));
    const rotations = [-2, 1, -3, 2, -.8];
    setStickies((current) => [...current, createUserSticky(id, source.color, rotations[(numericIds.length - 1) % rotations.length])]);
    setDragPositions((current) => ({ ...current, [id]: { left, top } }));
    setItemSizes((current) => ({ ...current, [id]: { width, height } }));
    setActiveStickyId(id);
    setStickyVisible(true);
    setStickyOnTop(true);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLTextAreaElement>(`[data-testid="sticky-${id}"] .sticky-text`)?.focus();
    });
  };
  const deleteSticky = (id: StickyItemId) => {
    const remaining = stickies.filter((sticky) => sticky.id !== id);
    setStickies(remaining);
    setActiveStickyId((activeId) => activeId === id ? (remaining[0]?.id ?? 'sticky') : activeId);
    if (!remaining.length) {
      setStickyVisible(false);
      setStickyOnTop(false);
    }
    setDragPositions((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setItemSizes((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setStickyMenu(null);
  };
  const resetStickyRotation = (id: StickyItemId) => {
    setStickies((current) => current.map((sticky) => sticky.id === id ? { ...sticky, rotation: 0 } : sticky));
    setActiveStickyId(id);
    setStickyOnTop(true);
    setStickyMenu(null);
  };
  const openDesktopContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('.window, .desktop-note, .desktop-folder')) return;
    event.preventDefault();
    setStickyMenu(null);
    setContextMenu({
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - 430)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - 270)),
      target: 'desktop'
    });
  };
  const autoArrangeIcons = () => {
    const area = desktopAreaRef.current;
    if (!area) return;
    const width = iconSize === 'large' ? 88 : 70;
    const row = iconSize === 'large' ? 86 : 68;
    const left = Math.max(dockPosition === 'left' ? 100 : 16, area.clientWidth - width - (dockPosition === 'right' ? 94 : 28));
    const startTop = dockPosition === 'top' ? 132 : 62;
    setFolderPositions({});
    setDragPositions((current) => ({
      ...current,
      'desktop-about': { left, top: startTop },
      'desktop-work': { left, top: startTop + row },
      'desktop-terminal': { left, top: startTop + row * 2 },
      'desktop-contact': { left, top: startTop + row * 3 },
      'desktop-stickies-app': { left, top: startTop + row * 4 },
    }));
    setContextMenu(null);
  };
  const resetDesktop = () => {
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
    setStickies(defaultDesktopState.stickies);
    setDockPosition(defaultDesktopState.dockPosition);
    setActiveStickyId('sticky');
    setContextMenu(null);
    setStickyMenu(null);
    setResetDialogOpen(false);
  };
  const windowProps = (id: WindowId) => ({
    active: activeWindow === id,
    maximized: Boolean(maximizedWindows[id]),
    onFocus: () => {
      setActiveWindow(id);
      setStickyOnTop(false);
    },
    onClose: () => closeWindow(id),
    onMinimize: () => minimizeWindow(id),
    onMaximize: () => {
      setActiveWindow(id);
      setStickyOnTop(false);
      setMaximizedWindows((current) => ({ ...current, [id]: !current[id] }));
    },
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      setActiveWindow(id);
      setStickyOnTop(false);
      if (!maximizedWindows[id]) startDrag(id, event);
    },
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onResizeStart: (event: ReactPointerEvent<HTMLSpanElement>, direction: ResizeDirection) => {
      if (!maximizedWindows[id]) startResize(id, event, direction);
    },
    onResizeMove: moveResize,
    onResizeEnd: endResize,
    style: maximizedWindows[id]
      ? {
        left: dockPosition === 'left' ? 82 : 12,
        top: dockPosition === 'top' ? 82 : 12,
        right: dockPosition === 'right' ? 82 : 12,
        bottom: dockPosition === 'bottom' ? 82 : 12,
        width: 'auto',
        height: 'auto',
      }
      : itemStyle(id),
  });

  return (
    <main
      className={`os-shell theme-${theme} icons-${iconSize}`}
      onPointerDown={() => { setContextMenu(null); setStickyMenu(null); }}
      onContextMenu={(event) => event.preventDefault()}
    >
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

      <div
        className={`desktop-area dock-space-${dockPosition}`}
        ref={desktopAreaRef}
        onContextMenu={openDesktopContextMenu}
      >
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
          <div className="desktop-folders" aria-label="Desktop applications and folders">
            <DesktopFolder id="about" label="about" open={windows.about} onToggle={() => handleDesktopWindowOpen('about')} onPointerDown={(event) => startDrag('desktop-about', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('about')} />
            <DesktopFolder id="work" label="work" open={windows.work} onToggle={() => handleDesktopWindowOpen('work')} onPointerDown={(event) => startDrag('desktop-work', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('work')} />
            <DesktopFolder id="terminal" label="terminal" open={windows.terminal} onToggle={() => handleDesktopWindowOpen('terminal')} onPointerDown={(event) => startDrag('desktop-terminal', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('terminal')} appIcon={<Terminal size={31} strokeWidth={1.7} />} />
            <DesktopFolder id="contact" label="Email Alex" open={windows.contact} onToggle={() => handleDesktopWindowOpen('contact')} onPointerDown={(event) => startDrag('desktop-contact', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('contact')} appIcon={<Mail size={30} strokeWidth={1.7} />} />
            <DesktopFolder id="stickies-app" label="stickies" open={stickyVisible && stickyOnTop} onToggle={handleDesktopStickiesOpen} onPointerDown={(event) => startDrag('desktop-stickies-app', event)} onPointerMove={moveDrag} onPointerUp={endDesktopLauncherDrag} style={launcherStyle('stickies-app')} appIcon={<StickyNote size={30} strokeWidth={1.7} />} />
          </div>
        )}

        {stickyVisible && stickies.map((sticky, index) => (
          <aside
            key={sticky.id}
            className="desktop-note"
            data-draggable-item
            data-testid={`sticky-${sticky.id}`}
            style={stickyStyle(sticky)}
            onPointerDown={(event) => { setActiveStickyId(sticky.id); setStickyOnTop(true); startDrag(sticky.id, event); }}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveStickyId(sticky.id);
              setStickyOnTop(true);
              setContextMenu(null);
              setStickyMenu({
                id: sticky.id,
                x: Math.max(8, Math.min(event.clientX, window.innerWidth - 224)),
                y: Math.max(8, Math.min(event.clientY, window.innerHeight - 304)),
              });
            }}
            aria-label={`Draggable sticky note ${index + 1}`}
          >
            <div className="desktop-note-surface">
              <span className="note-label">field note / {String(index + 4).padStart(3, '0')}</span>
              <button
                type="button"
                className="sticky-add-button"
                aria-label="Add sticky note"
                data-testid={`button-add-${sticky.id}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => { event.stopPropagation(); addSticky(sticky.id); }}
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
              </button>
              <textarea
                className="sticky-text"
                value={sticky.text}
                onChange={(event) => setStickies((current) => current.map((item) => item.id === sticky.id ? { ...item, text: event.target.value } : item))}
                onPointerDown={(event) => { event.stopPropagation(); setActiveStickyId(sticky.id); setStickyOnTop(true); }}
                aria-label={`Sticky note ${index + 1} text`}
                placeholder="Write a note…"
              />
              <span className="note-signoff">— {sticky.author}, {sticky.createdAt}</span>
            </div>
            {(['top-left', 'top-right', 'bottom-left'] as const).map((corner, cornerIndex) => (
              <button
                type="button"
                key={corner}
                className={`sticky-rotate-handle sticky-rotate-${corner}`}
                aria-label={`Rotate sticky note ${index + 1} from ${corner.replace('-', ' ')}, currently ${Math.round(sticky.rotation)} degrees. Press Home or 0 to reset`}
                aria-keyshortcuts="Home 0"
                data-testid={`button-rotate-${sticky.id}-${corner}`}
                tabIndex={cornerIndex === 1 ? 0 : -1}
                onPointerDown={(event) => startRotate(sticky.id, sticky.rotation, event)}
                onPointerMove={moveRotate}
                onPointerUp={endRotate}
                onPointerCancel={endRotate}
                onKeyDown={(event) => rotateWithKeyboard(sticky.id, event)}
              />
            ))}
            <span
              className="desktop-resize-handle"
              onPointerDown={(event) => { event.stopPropagation(); startResize(sticky.id, event); }}
              onPointerMove={moveResize}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              role="separator"
              aria-label={`Resize sticky note ${index + 1}`}
              tabIndex={0}
            />
          </aside>
        ))}

        {windows.work && <WorkWindow {...windowProps('work')} />}
        {windows.about && <AboutWindow {...windowProps('about')} />}
        {windows.contact && <ContactWindow {...windowProps('contact')} />}
        {windows.terminal && <TerminalWindow {...windowProps('terminal')} onOpenWindow={openWindow} onCloseWindow={closeWindow} onSetTheme={setTheme} openWindows={windows} currentTheme={theme} />}
      </div>

      {contextMenu?.target === 'desktop' && (
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
          <button
            type="button"
            className="context-menu-button context-menu-danger"
            role="menuitem"
            onClick={() => {
              setContextMenu(null);
              setResetDialogOpen(true);
            }}
          >
            <span className="context-check" />
            <span>Reset desktop…</span>
          </button>
        </div>
      )}

      {contextMenu?.target === 'dock' && (
        <div
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          role="menu"
          aria-label="Dock options"
          data-testid="menu-dock-context"
        >
          <div className="sticky-color-menu-title dock-menu-title">Dock position</div>
          {(['top', 'right', 'bottom', 'left'] as DockPosition[]).map((position) => (
            <button
              type="button"
              key={position}
              className="context-menu-button"
              role="menuitemradio"
              aria-checked={dockPosition === position}
              onClick={() => { setDockPosition(position); setContextMenu(null); }}
            >
              <span className="context-check">{dockPosition === position && <Check size={12} />}</span>
              <span>{position[0].toUpperCase() + position.slice(1)}</span>
            </button>
          ))}
        </div>
      )}

      {stickyMenu && (
        <div
          className="desktop-context-menu sticky-color-menu"
          style={{ left: stickyMenu.x, top: stickyMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          role="menu"
          aria-label="Sticky options"
          data-testid="menu-sticky-colors"
        >
          <div className="sticky-color-menu-title">Sticky color</div>
          <div className="sticky-color-grid">
            {stickyPalette.map((color) => (
              <button
                type="button"
                key={color.id}
                className="sticky-color-option"
                style={{ background: color.background, color: color.foreground === 'light' ? '#ffffff' : '#1d2430' }}
                role="menuitemradio"
                aria-checked={stickies.find((sticky) => sticky.id === stickyMenu.id)?.color === color.id}
                aria-label={color.label}
                title={color.label}
                onClick={() => {
                  setStickies((current) => current.map((sticky) => sticky.id === stickyMenu.id ? { ...sticky, color: color.id } : sticky));
                  setStickyMenu(null);
                }}
              >
                {stickies.find((sticky) => sticky.id === stickyMenu.id)?.color === color.id && <Check size={14} />}
              </button>
            ))}
          </div>
          <div className="sticky-color-name">
            {stickyPalette.find((color) => color.id === stickies.find((sticky) => sticky.id === stickyMenu.id)?.color)?.label ?? 'Lemon'}
          </div>
          <div className="context-menu-separator" />
          <button
            type="button"
            className="context-menu-button"
            role="menuitem"
            onClick={() => resetStickyRotation(stickyMenu.id)}
            data-testid="button-reset-sticky-rotation"
          >
            <span className="context-check" aria-hidden="true">0°</span>
            <span>Reset rotation</span>
          </button>
          <div className="context-menu-separator" />
          <button
            type="button"
            className="context-menu-button context-menu-danger"
            role="menuitem"
            onClick={() => deleteSticky(stickyMenu.id)}
            data-testid="button-delete-sticky"
          >
            <X size={14} aria-hidden="true" />
            <span>Delete this sticky</span>
          </button>
        </div>
      )}

      {resetDialogOpen && (
        <div className="reset-dialog-backdrop">
          <section
            className="reset-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-dialog-title"
            aria-describedby="reset-dialog-description"
            data-testid="dialog-reset-desktop"
          >
            <span className="reset-dialog-eyebrow">desktop settings</span>
            <h2 id="reset-dialog-title">Reset desktop?</h2>
            <p id="reset-dialog-description">Icon positions, window layouts, stickies, and desktop preferences will return to their original settings.</p>
            <div className="reset-dialog-actions">
              <button type="button" autoFocus onClick={() => setResetDialogOpen(false)} data-testid="button-cancel-reset">Cancel</button>
              <button type="button" className="reset-dialog-confirm" onClick={resetDesktop} data-testid="button-confirm-reset">Reset desktop</button>
            </div>
          </section>
        </div>
      )}

      <nav
        className={`dock dock-${dockPosition}`}
        aria-label="Application dock. Drag to a screen edge or right-click to choose its position."
        title="Drag to reposition dock"
        onPointerDown={startDockDrag}
        onPointerMove={moveDockDrag}
        onPointerUp={endDockDrag}
        onPointerCancel={endDockDrag}
        onClickCapture={(e) => {
          if (dockDragRef.current?.moved) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setContextMenu({
            x: Math.max(8, Math.min(event.clientX, window.innerWidth - 220)),
            y: Math.max(8, Math.min(event.clientY, window.innerHeight - 250)),
            target: 'dock'
          });
        }}
      >
        <button className={`dock-item ${windows.about ? 'active' : ''}`} onClick={() => openWindow('about')} aria-label="Open about" data-testid="button-dock-about"><UserRound size={20} /><span>About · 1</span></button>
        <button className={`dock-item ${windows.work ? 'active' : ''}`} onClick={() => openWindow('work')} aria-label="Open work" data-testid="button-dock-work"><FolderGit2 size={20} /><span>Work · 2</span></button>
        <button className={`dock-item ${windows.terminal ? 'active' : ''}`} onClick={() => openWindow('terminal')} aria-label="Open terminal" data-testid="button-dock-terminal"><Terminal size={20} /><span>Terminal · `</span></button>
        <button className={`dock-item ${windows.contact ? 'active' : ''}`} onClick={() => openWindow('contact')} aria-label="Open contact" data-testid="button-dock-contact"><Mail size={20} /><span>Contact · 3</span></button>
        <button className={`dock-item ${stickyVisible ? 'active' : ''}`} onClick={handleStickyDock} aria-label={stickyVisible && stickyOnTop ? 'Minimize Stickies' : 'Open or focus Stickies'} data-testid="button-dock-stickies"><StickyNote size={20} /><span>Stickies</span></button>
        <button className="dock-item" onClick={() => setMobileOpen((value) => !value)} aria-label="Show keyboard shortcuts" data-testid="button-dock-shortcuts"><Command size={19} /><span>Shortcuts</span></button>
      </nav>

      {mobileOpen && (
        <div className="mobile-shortcut-menu" data-testid="menu-mobile">
          <div className="section-kicker">keyboard map</div>
          <p style={{ margin: '9px 0 14px', fontSize: 12 }}>Use 1–3 to open a window. Press backtick for the terminal. Escape closes this menu.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {(['about', 'work', 'contact'] as WindowId[]).map((id, index) => <button key={id} className="quick-button" onClick={() => openWindow(id)} data-testid={`button-menu-${id}`}><span className="shortcut-number">{index + 1}</span>{id}</button>)}
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