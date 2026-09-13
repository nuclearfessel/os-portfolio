const fs = require('fs');
let code = fs.readFileSync('artifacts/desktop-portfolio/src/App.tsx', 'utf8');

code = code.replace(/aria-label="Portfolio applications"/g, 'aria-label="Dock"');

fs.writeFileSync('artifacts/desktop-portfolio/src/App.tsx', code);
