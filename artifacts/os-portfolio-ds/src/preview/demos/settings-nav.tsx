import { useState } from 'react';
import { SettingsNavSection, SettingsNavItem } from '../../components/ui/settings';
import { CanonicalSpec } from '../md-renderer';
import { mdSettingsNav } from '../docs-map';

export function SettingsNavDemo() {
  const [active, setActive] = useState<'personalization' | 'accessibility' | 'display'>('personalization');

  return (
    <div className="space-y-8">
      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
           <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Interactive · icon nav · {active} active</p>
          <div className="flex gap-4">
            <div className="w-48 rounded-lg border border-border bg-sidebar p-2">
              <SettingsNavSection label="Settings sections">
                <SettingsNavItem
                  active={active === 'personalization'}
                  aria-current={active === 'personalization' ? 'page' : undefined}
                  onClick={() => setActive('personalization')}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    </svg>
                  }
                >
                  Personalization
                </SettingsNavItem>
                <SettingsNavItem
                  active={active === 'accessibility'}
                  aria-current={active === 'accessibility' ? 'page' : undefined}
                  onClick={() => setActive('accessibility')}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="4" r="2" /><line x1="12" y1="22" x2="12" y2="12" />
                      <path d="M5 9l7 3 7-3" />
                    </svg>
                  }
                >
                  Accessibility
                </SettingsNavItem>
                <SettingsNavItem
                  active={active === 'display'}
                  aria-current={active === 'display' ? 'page' : undefined}
                  onClick={() => setActive('display')}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  }
                >
                  Display
                </SettingsNavItem>
              </SettingsNavSection>
            </div>
            <div className="flex-1 rounded-lg border border-border bg-card/40 p-4">
              <p className="text-sm font-medium">Active section: <span className="text-primary capitalize">{active}</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Content pane for the selected settings section appears here.</p>
            </div>
          </div>
        </div>

        <div>
           <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">Static states · active/inactive/icon variants</p>
          <div className="max-w-[180px] rounded-lg border border-border bg-sidebar p-2">
            <SettingsNavSection label="States reference">
               <SettingsNavItem active icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="5" />
                </svg>
               }>Active · with icon</SettingsNavItem>
              <SettingsNavItem icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="4" r="2" /><line x1="12" y1="22" x2="12" y2="12" />
                </svg>
               }>Inactive · with icon</SettingsNavItem>
               <SettingsNavItem>No icon · inactive</SettingsNavItem>
            </SettingsNavSection>
          </div>
        </div>
      </div>

      <CanonicalSpec md={mdSettingsNav} title="SettingsNav reference" />
    </div>
  );
}
