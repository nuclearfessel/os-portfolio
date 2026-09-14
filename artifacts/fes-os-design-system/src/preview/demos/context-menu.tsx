import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../../components/ui/context-menu';
import { CanonicalSpec, extractSection } from '../md-renderer';
import { mdNavigationFamily } from '../docs-map';

const specMd = extractSection(mdNavigationFamily, 'ContextMenu');

export function ContextMenuDemo() {
  const [favorite, setFavorite] = useState(true);
  const [location, setLocation] = useState('drafts');

  return (
    <div className="space-y-8">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 max-w-lg items-center justify-center rounded-xl border border-dashed bg-card text-sm text-muted-foreground">
          Right-click this area
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuLabel>Document</ContextMenuLabel>
          <ContextMenuItem>
            Rename <ContextMenuShortcut>F2</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>Duplicate</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={favorite}
            onCheckedChange={(checked) => setFavorite(checked === true)}
          >
            Favorite
          </ContextMenuCheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuRadioGroup value={location} onValueChange={setLocation}>
                <ContextMenuRadioItem value="drafts">Drafts</ContextMenuRadioItem>
                <ContextMenuRadioItem value="archive">Archive</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
      <CanonicalSpec md={specMd} />
    </div>
  );
}
