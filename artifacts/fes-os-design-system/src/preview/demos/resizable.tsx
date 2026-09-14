import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../components/ui/resizable';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdStructureFamily } from '../docs-map';

const specMd = extractSection(mdStructureFamily, 'ResizablePanelGroup');

export function ResizableDemo() {
  return (
    <div className="space-y-8">
      <div className="h-64 max-w-2xl overflow-hidden rounded-xl border bg-card">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="flex h-full items-center justify-center bg-muted/40 text-sm">
              Navigation
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65}>
                <div className="flex h-full items-center justify-center text-sm">Canvas</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35}>
                <div className="flex h-full items-center justify-center bg-muted/40 text-sm">
                  Console
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
