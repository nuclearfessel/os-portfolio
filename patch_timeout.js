const fs = require('fs');
let code = fs.readFileSync('artifacts/desktop-portfolio/src/App.tsx', 'utf8');

code = code.replace(
  /setTimeout\(\(\) => \{ dockDragRef\.current = null; \}, 0\);/,
  "setTimeout(() => { dockDragRef.current = null; }, 50);"
);

fs.writeFileSync('artifacts/desktop-portfolio/src/App.tsx', code);
