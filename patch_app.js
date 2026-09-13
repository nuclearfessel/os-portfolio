const fs = require('fs');
let code = fs.readFileSync('artifacts/desktop-portfolio/src/App.tsx', 'utf8');

// 1. Add DockPosition type
code = code.replace(/type ResizeDirection = [^\n]+;/, "type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';\ntype DockPosition = 'top' | 'right' | 'bottom' | 'left';");

// 2. Add dockPosition to SavedDesktopState
code = code.replace(/stickies: StickyData\[\];\n\};/, "stickies: StickyData[];\n  dockPosition: DockPosition;\n};");

// 3. Add dockPosition to defaultDesktopState
code = code.replace(/stickies: \[defaultSticky\],\n\};/, "stickies: [defaultSticky],\n  dockPosition: 'bottom',\n};");

// 4. Add dockPosition to loadDesktopState return
code = code.replace(/stickies: Array.isArray\(parsed.stickies\) \? stickies : \[defaultSticky\],\n    \};\n  \} catch \{/, "stickies: Array.isArray(parsed.stickies) ? stickies : [defaultSticky],\n      dockPosition: ['bottom', 'top', 'left', 'right'].includes(parsed.dockPosition as string) ? (parsed.dockPosition as DockPosition) : defaultDesktopState.dockPosition,\n    };\n  } catch {");

// 5. Add dockPosition state inside Home
code = code.replace(/const \[showDesktopIcons, setShowDesktopIcons\] = useState\(savedDesktopState.showDesktopIcons\);/, "const [showDesktopIcons, setShowDesktopIcons] = useState(savedDesktopState.showDesktopIcons);\n  const [dockPosition, setDockPosition] = useState<DockPosition>(savedDesktopState.dockPosition);");

// 6. Update desktop padding and dock drag refs
code = code.replace(/const desktopAreaRef = useRef<HTMLDivElement>\(null\);/, `const desktopAreaRef = useRef<HTMLDivElement>(null);
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
    event.currentTarget.releasePointerCapture(event.pointerId);
    setTimeout(() => { dockDragRef.current = null; }, 0);
  };`);

// 7. Desktop state sync
code = code.replace(/showDesktopIcons,\n      stickies,\n    \};\n    try \{/, "showDesktopIcons,\n      stickies,\n      dockPosition,\n    };\n    try {");
code = code.replace(/iconSize, itemSizes, snapToGrid, stickies, theme, showDesktopIcons\]\);/, "iconSize, itemSizes, snapToGrid, stickies, theme, showDesktopIcons, dockPosition]);");

// 8. Desktop padding application
code = code.replace(/<div className="desktop-area" ref=\{desktopAreaRef\} onContextMenu=\{openDesktopContextMenu\}>/, `<div 
        className="desktop-area" 
        ref={desktopAreaRef} 
        onContextMenu={openDesktopContextMenu}
        style={{
          paddingBottom: dockPosition === 'bottom' ? 112 : 42,
          paddingTop: dockPosition === 'top' ? 112 : 42,
          paddingLeft: dockPosition === 'left' ? 112 : 46,
          paddingRight: dockPosition === 'right' ? 112 : 46,
        }}
      >`);

// 9. Change setContextMenu target signature
code = code.replace(/const \[contextMenu, setContextMenu\] = useState<\{ x: number; y: number \} \| null>\(null\);/, "const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: 'desktop' | 'dock' } | null>(null);");

code = code.replace(/setContextMenu\(\{([^}]+)\}\);\n  \};\n  const autoArrangeIcons/g, "setContextMenu({$1, target: 'desktop' });\n  };\n  const autoArrangeIcons");
// Also update other context menu triggers if any, but the desktop right click is handled.

// 10. Update dock HTML and context menu
code = code.replace(/<nav className="dock" aria-label="Portfolio applications">/g, `<nav 
        className={\`dock dock-\${dockPosition}\`} 
        aria-label="Portfolio applications"
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
      >`);

// 11. Add dock context menu jsx
let desktopMenuRegex = /\{contextMenu && \(\n\s*<div\n\s*className="desktop-context-menu"/;
code = code.replace(desktopMenuRegex, `{contextMenu?.target === 'desktop' && (\n        <div\n          className="desktop-context-menu"`);

let dockMenuJSX = `      {contextMenu?.target === 'dock' && (
        <div
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
          role="menu"
          aria-label="Dock options"
          data-testid="menu-dock-context"
        >
          <div className="section-kicker" style={{ padding: '4px 8px 8px' }}>Position on screen</div>
          <button type="button" className="context-menu-button" role="menuitemradio" aria-checked={dockPosition === 'left'} onClick={() => { setDockPosition('left'); setContextMenu(null); }}><span className="context-check">{dockPosition === 'left' && <Check size={12} />}</span><span>Left</span></button>
          <button type="button" className="context-menu-button" role="menuitemradio" aria-checked={dockPosition === 'bottom'} onClick={() => { setDockPosition('bottom'); setContextMenu(null); }}><span className="context-check">{dockPosition === 'bottom' && <Check size={12} />}</span><span>Bottom</span></button>
          <button type="button" className="context-menu-button" role="menuitemradio" aria-checked={dockPosition === 'right'} onClick={() => { setDockPosition('right'); setContextMenu(null); }}><span className="context-check">{dockPosition === 'right' && <Check size={12} />}</span><span>Right</span></button>
          <button type="button" className="context-menu-button" role="menuitemradio" aria-checked={dockPosition === 'top'} onClick={() => { setDockPosition('top'); setContextMenu(null); }}><span className="context-check">{dockPosition === 'top' && <Check size={12} />}</span><span>Top</span></button>
        </div>
      )}

      {stickyMenu && (`;

code = code.replace(/\{stickyMenu && \(/, dockMenuJSX);

fs.writeFileSync('artifacts/desktop-portfolio/src/App.tsx', code);
console.log('patched');
