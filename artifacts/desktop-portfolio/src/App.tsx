import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Apple, ArrowUpRight, BatteryMedium, BookOpen, ChevronRight,
  Command, Folder, FolderGit2, FolderOpen, Mail, Maximize2, Menu, Minus, MousePointer2, Terminal,
  UserRound, Wifi, X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type WindowId = 'about' | 'work' | 'notes' | 'contact' | 'terminal';
type WindowState = Record<WindowId, boolean>;

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
}: {
  id: WindowId;
  title: string;
  active: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <section
      className={`window ${id} ${active ? 'is-active' : ''}`}
      onMouseDown={onFocus}
      data-testid={`window-${id}`}
      aria-label={`${title} window`}
    >
      <header className="window-header">
        <div className="traffic-lights">
          <button className="close" onClick={onClose} aria-label={`Close ${title}`} data-testid={`button-close-${id}`}><X size={7} strokeWidth={3} /></button>
          <button className="minimize" onClick={onMinimize} aria-label={`Minimize ${title}`} data-testid={`button-minimize-${id}`}><Minus size={8} strokeWidth={3} /></button>
          <button className="maximize" onClick={onFocus} aria-label={`Focus ${title}`} data-testid={`button-focus-${id}`}><Maximize2 size={7} strokeWidth={3} /></button>
        </div>
        <div className="window-title"><strong>~/alex/</strong>{title.toLowerCase()}</div>
      </header>
      {children}
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
  return (
    <WindowFrame {...props} id="work" title="Selected work">
      <div className="window-body">
        <span className="section-kicker">projects / selected</span>
        <h2>Things I’ve shipped.</h2>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card" key={project.id} data-testid={`card-project-${project.id}`}>
              <span className="project-index" style={{ color: project.color }}>{project.id}</span>
              <div><h3>{project.name}</h3><p>{project.desc}</p></div>
              <span className="project-tag">{project.tag}</span>
              <button className="project-link" data-testid={`button-open-project-${project.id}`} onClick={() => window.alert(`${project.name} case study coming soon.`)}>view case study <ArrowUpRight size={11} /></button>
            </article>
          ))}
        </div>
        <p style={{ marginTop: 18, fontFamily: 'var(--app-font-mono)', fontSize: 10 }}>03 projects · 8 shipped systems · 0 design handoffs left behind</p>
      </div>
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
        <p style={{ marginTop: 24, color: '#e4ff5b', fontFamily: 'var(--app-font-mono)', fontSize: 11 }}>→ Recent note: why good empty states feel like hospitality</p>
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
        <a className="contact-button" href="mailto:hello@alexrivera.dev" data-testid="link-email-alex">email alex <Mail size={14} /></a>
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
  const inputRef = useRef<HTMLInputElement>(null);

  const submitCommand = (event: FormEvent) => {
    event.preventDefault();
    const normalized = command.trim().toLowerCase();
    if (!normalized) return;
    const output = normalized === 'help'
      ? 'about   work   notes   contact   clear'
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
        <div className="terminal-line"><span className="terminal-prompt">alex@studio</span><span>:</span><span style={{ color: '#86d9ee' }}>~</span><span>$</span><span className="terminal-command">whoami</span></div>
        <div className="terminal-output">alex rivera / product-minded frontend engineer{'\n'}building thoughtful interfaces and fast systems.</div>
        <div className="terminal-output" style={{ color: '#e4ff5b' }}>type “help” to explore, or use the dock below.</div>
        {history.map((line, index) => <div className={line.startsWith('›') ? 'terminal-line terminal-command' : 'terminal-output'} key={`${line}-${index}`}>{line}</div>)}
        <form className="terminal-form" onSubmit={submitCommand}>
          <span className="terminal-prompt">alex@studio:~$</span>
          <input ref={inputRef} className="terminal-input" value={command} onChange={(event) => setCommand(event.target.value)} aria-label="Terminal command" placeholder="type a command" data-testid="input-terminal-command" autoComplete="off" />
        </form>
      </div>
    </WindowFrame>
  );
}

function DesktopFolder({
  label,
  meta,
  open,
  onToggle,
}: {
  label: string;
  meta: string;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = open ? FolderOpen : Folder;

  return (
    <button
      className={`desktop-folder ${open ? 'is-open' : ''}`}
      onClick={onToggle}
      aria-pressed={open}
      aria-label={`${open ? 'Close' : 'Open'} ${label} folder`}
      data-testid={`button-folder-${label.toLowerCase()}`}
    >
      <span className="desktop-folder-icon"><Icon size={29} strokeWidth={1.5} /></span>
      <span className="desktop-folder-label">{label}</span>
      <span className="desktop-folder-meta">{open ? 'open · click to close' : meta}</span>
    </button>
  );
}

function Home() {
  const [windows, setWindows] = useState<WindowState>(initialWindows);
  const [activeWindow, setActiveWindow] = useState<WindowId>('work');
  const [clock, setClock] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
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
  const toggleFolder = (id: WindowId) => {
    if (windows[id]) {
      closeWindow(id);
    } else {
      openWindow(id);
    }
  };
  const windowProps = (id: WindowId) => ({
    active: activeWindow === id,
    onFocus: () => setActiveWindow(id),
    onClose: () => closeWindow(id),
    onMinimize: () => minimizeWindow(id),
  });

  return (
    <main className="os-shell">
      <header className="system-bar">
        <div className="system-left">
          <Apple size={14} strokeWidth={1.8} color="#e4ff5b" aria-hidden="true" />
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

      <div className="desktop-area">
        <div className="desktop-intro">
          <span className="eyebrow">personal workspace / v1.0</span>
          <h1>Thoughtful interfaces.<br /><em>Fast systems.</em></h1>
          <p>Alex Rivera is a product-minded frontend engineer making software feel clear, capable, and a little more human.</p>
          <div className="quick-actions">
            <button className="quick-button primary" onClick={() => openWindow('work')} data-testid="button-open-work">open work <ChevronRight size={13} /></button>
            <button className="quick-button" onClick={() => openWindow('contact')} data-testid="button-open-contact">say hello <Mail size={13} /></button>
          </div>
        </div>

        <div className="desktop-folders" aria-label="Portfolio folders">
          <DesktopFolder label="about" meta="readme.md" open={windows.about} onToggle={() => toggleFolder('about')} />
          <DesktopFolder label="work" meta="03 projects" open={windows.work} onToggle={() => toggleFolder('work')} />
          <DesktopFolder label="notes" meta="toolkit + thoughts" open={windows.notes} onToggle={() => toggleFolder('notes')} />
        </div>

        <aside className="desktop-note">
          <span className="note-label">field note / 004</span>
          <p>The best interfaces don’t ask for attention. They earn trust, one tiny response at a time.</p>
          <span style={{ color: '#707691', font: '10px var(--app-font-mono)' }}>— alex, 09:42</span>
        </aside>

        {windows.work && <WorkWindow {...windowProps('work')} />}
        {windows.about && <AboutWindow {...windowProps('about')} />}
        {windows.notes && <NotesWindow {...windowProps('notes')} />}
        {windows.contact && <ContactWindow {...windowProps('contact')} />}
        {windows.terminal && <TerminalWindow {...windowProps('terminal')} />}
      </div>

      <nav className="dock" aria-label="Portfolio applications">
        <button className={`dock-item ${windows.about ? 'active' : ''}`} onClick={() => openWindow('about')} aria-label="Open about" data-testid="button-dock-about"><UserRound size={20} /><span>About · 1</span></button>
        <button className={`dock-item ${windows.work ? 'active' : ''}`} onClick={() => openWindow('work')} aria-label="Open work" data-testid="button-dock-work"><FolderGit2 size={20} /><span>Work · 2</span></button>
        <button className={`dock-item ${windows.notes ? 'active' : ''}`} onClick={() => openWindow('notes')} aria-label="Open notes and stack" data-testid="button-dock-notes"><BookOpen size={20} /><span>Notes · 3</span></button>
        <button className={`dock-item ${windows.terminal ? 'active' : ''}`} onClick={() => openWindow('terminal')} aria-label="Open terminal" data-testid="button-dock-terminal"><Terminal size={20} /><span>Terminal · `</span></button>
        <button className={`dock-item ${windows.contact ? 'active' : ''}`} onClick={() => openWindow('contact')} aria-label="Open contact" data-testid="button-dock-contact"><Mail size={20} /><span>Contact · 4</span></button>
        <button className="dock-item" onClick={() => setMobileOpen((value) => !value)} aria-label="Show keyboard shortcuts" data-testid="button-dock-shortcuts"><Command size={19} /><span>Shortcuts</span></button>
      </nav>

      {mobileOpen && (
        <div style={{ position: 'fixed', zIndex: 50, inset: '50px 14px auto', padding: 16, border: '1px solid rgba(228,255,91,.35)', borderRadius: 8, background: '#1d2038', boxShadow: '0 18px 50px rgba(0,0,0,.4)' }} data-testid="menu-mobile">
          <div className="section-kicker">keyboard map</div>
          <p style={{ margin: '9px 0 14px', fontSize: 12 }}>Use 1–4 to open a window. Press backtick for the terminal. Escape closes this menu.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {(['about', 'work', 'notes', 'contact'] as WindowId[]).map((id, index) => <button key={id} className="quick-button" onClick={() => openWindow(id)} data-testid={`button-menu-${id}`}><span style={{ fontFamily: 'var(--app-font-mono)', color: '#e4ff5b', marginRight: 8 }}>{index + 1}</span>{id}</button>)}
          </div>
        </div>
      )}
      <div style={{ position: 'fixed', bottom: 8, left: 18, color: '#4f546c', font: '10px var(--app-font-mono)', zIndex: 2 }}><MousePointer2 size={11} style={{ verticalAlign: 'middle', marginRight: 5 }} />click around, stay curious</div>
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