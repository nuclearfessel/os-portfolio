const fs = require('fs');
let code = fs.readFileSync('artifacts/desktop-portfolio/src/App.tsx', 'utf8');

code = code.replace(
  /const maxLeft = Math\.max\(0, areaRect\.width - target\.width\);\n\s*const maxTop = Math\.max\(0, areaRect\.height - target\.height\);/,
  "const padRight = dockPosition === 'right' ? 70 : 0;\n    const padBottom = dockPosition === 'bottom' ? 70 : 0;\n    const padLeft = dockPosition === 'left' ? 70 : 0;\n    const padTop = dockPosition === 'top' ? 70 : 0;\n    const maxLeft = Math.max(0, areaRect.width - target.width - padRight);\n    const maxTop = Math.max(0, areaRect.height - target.height - padBottom);\n    const minLeft = padLeft;\n    const minTop = padTop;"
);

code = code.replace(
  /const left = staysOnDesktop \? Math\.max\(0, Math\.min\(maxLeft, nextLeft\)\) : nextLeft;\n\s*const top = staysOnDesktop \? Math\.max\(0, Math\.min\(maxTop, nextTop\)\) : nextTop;/,
  "const left = staysOnDesktop ? Math.max(minLeft, Math.min(maxLeft, nextLeft)) : nextLeft;\n    const top = staysOnDesktop ? Math.max(minTop, Math.min(maxTop, nextTop)) : nextTop;"
);

fs.writeFileSync('artifacts/desktop-portfolio/src/App.tsx', code);
console.log('patched moveDrag');
