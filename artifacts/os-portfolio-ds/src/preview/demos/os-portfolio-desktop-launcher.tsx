import { useState } from 'react';
import { DesktopLauncher, SectionLabel } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioDesktopLauncher } from '../docs-map';

export function OsPortfolioDesktopLauncherDemo() {
  const [openLauncher, setOpenLauncher] = useState('About');

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <SectionLabel>states / closed and open</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">DesktopLauncher applies the <code className="font-mono text-[0.8em]">is-open</code> class when <code className="font-mono text-[0.8em]">open</code> is true. The consuming product styles it.</p>
          <div className="flex flex-wrap items-start gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Work · {openLauncher === 'Work' ? 'open · active' : 'closed · idle'}
              </p>
              <DesktopLauncher
                className="grid place-items-center rounded-xl border border-border bg-card p-3 text-sm shadow-sm"
                open={openLauncher === 'Work'}
                onClick={() => setOpenLauncher('Work')}
                aria-label={`Work launcher (${openLauncher === 'Work' ? 'open' : 'closed'})`}
              >
                <span className="font-mono text-xs">Work</span>
              </DesktopLauncher>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                About · {openLauncher === 'About' ? 'open · active' : 'closed · idle'}
              </p>
              <DesktopLauncher
                className="grid place-items-center rounded-xl border-2 border-primary bg-primary/10 p-3 text-sm shadow-md"
                open={openLauncher === 'About'}
                onClick={() => setOpenLauncher('About')}
                aria-label={`About launcher (${openLauncher === 'About' ? 'open' : 'closed'})`}
              >
                <span className="font-mono text-xs text-primary">About</span>
              </DesktopLauncher>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>desktop grid arrangement</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">Multiple launchers arranged in a desktop grid.</p>
          <div className="grid max-w-sm grid-cols-4 gap-2">
            {['About', 'Work', 'Contact', 'Terminal'].map((name) => (
              <div key={name} className="space-y-1 text-center">
                <DesktopLauncher
                  open={openLauncher === name}
                  onClick={() => setOpenLauncher(name)}
                  className={`grid place-items-center rounded-xl border p-3 text-sm shadow-sm ${openLauncher === name ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
                  aria-label={`${name} launcher (${openLauncher === name ? 'open' : 'closed'})`}
                >
                  <span className={`font-mono text-[10px] ${openLauncher === name ? 'text-primary' : 'text-muted-foreground'}`}>{name}</span>
                </DesktopLauncher>
                <p className="text-[10px] text-muted-foreground">
                  {openLauncher === name ? 'open · active' : 'closed · idle'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdOsPortfolioDesktopLauncher} title="DesktopLauncher reference" />
    </div>
  );
}
