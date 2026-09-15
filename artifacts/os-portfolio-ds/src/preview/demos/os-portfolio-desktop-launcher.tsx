import { DesktopLauncher, SectionLabel } from '../../components/ui/os-portfolio';
import { CanonicalSpec } from '../md-renderer';
import { mdOsPortfolioDesktopLauncher } from '../docs-map';

export function OsPortfolioDesktopLauncherDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <SectionLabel>states / closed and open</SectionLabel>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">DesktopLauncher applies the <code className="font-mono text-[0.8em]">is-open</code> class when <code className="font-mono text-[0.8em]">open</code> is true. The consuming product styles it.</p>
          <div className="flex flex-wrap items-start gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Closed</p>
              <DesktopLauncher
                className="grid place-items-center rounded-xl border border-border bg-card p-3 text-sm shadow-sm"
                open={false}
                aria-label="Work launcher (closed)"
              >
                <span className="font-mono text-xs">Work</span>
              </DesktopLauncher>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Open (is-open applied)</p>
              <DesktopLauncher
                className="grid place-items-center rounded-xl border-2 border-primary bg-primary/10 p-3 text-sm shadow-md"
                open={true}
                aria-label="About launcher (open)"
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
            {['About', 'Work', 'Contact', 'Terminal'].map((name, i) => (
              <DesktopLauncher
                key={name}
                open={i === 0}
                className={`grid place-items-center rounded-xl border p-3 text-sm shadow-sm ${i === 0 ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
                aria-label={`${name} launcher`}
              >
                <span className={`font-mono text-[10px] ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>{name}</span>
              </DesktopLauncher>
            ))}
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdOsPortfolioDesktopLauncher} title="DesktopLauncher reference" />
    </div>
  );
}
