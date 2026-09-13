const fs = require('fs');
let code = fs.readFileSync('artifacts/desktop-portfolio/src/App.tsx', 'utf8');

code = code.replace(
  /const left = Math\.max\(16, area\.clientWidth - width - 28\);/,
  "const left = Math.max(dockPosition === 'left' ? 100 : 16, area.clientWidth - width - (dockPosition === 'right' ? 94 : 28));\n    const startTop = dockPosition === 'top' ? 132 : 62;"
);

code = code.replace(
  /'desktop-about': \{ left, top: 62 \},/,
  "'desktop-about': { left, top: startTop },"
);
code = code.replace(
  /'desktop-work': \{ left, top: 62 \+ row \},/,
  "'desktop-work': { left, top: startTop + row },"
);
code = code.replace(
  /'desktop-terminal': \{ left, top: 62 \+ row \* 2 \},/,
  "'desktop-terminal': { left, top: startTop + row * 2 },"
);
code = code.replace(
  /'desktop-contact': \{ left, top: 62 \+ row \* 3 \},/,
  "'desktop-contact': { left, top: startTop + row * 3 },"
);
code = code.replace(
  /'desktop-stickies-app': \{ left, top: 62 \+ row \* 4 \},/,
  "'desktop-stickies-app': { left, top: startTop + row * 4 },"
);

fs.writeFileSync('artifacts/desktop-portfolio/src/App.tsx', code);
console.log('patched');
