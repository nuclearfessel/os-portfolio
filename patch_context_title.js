const fs = require('fs');
let code = fs.readFileSync('artifacts/desktop-portfolio/src/App.tsx', 'utf8');

code = code.replace(
  /<div className="section-kicker" style=\{\{ padding: '4px 8px 8px' \}\}>Position on screen<\/div>/,
  '<div className="sticky-color-menu-title" style={{ paddingLeft: 6, paddingTop: 4 }}>Dock Position</div>'
);

fs.writeFileSync('artifacts/desktop-portfolio/src/App.tsx', code);
console.log('patched');
