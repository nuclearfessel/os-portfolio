const fs = require('fs');
let code = fs.readFileSync('artifacts/desktop-portfolio/src/index.css', 'utf8');

code = code.replace(
  /\.dock\.dock-bottom \.dock-item span, .*\n.*/,
  ".dock.dock-bottom .dock-item span, .dock.dock-top .dock-item span, .dock.dock-left .dock-item span, .dock.dock-right .dock-item span { bottom: 53px; top: auto; left: 50%; right: auto; transform: translateX(-50%); }\n  .dock.dock-bottom .dock-item.active::after, .dock.dock-top .dock-item.active::after, .dock.dock-left .dock-item.active::after, .dock.dock-right .dock-item.active::after { bottom: -5px; top: auto; left: 50%; right: auto; transform: translateX(-50%); }"
);

fs.writeFileSync('artifacts/desktop-portfolio/src/index.css', code);
console.log('patched');
