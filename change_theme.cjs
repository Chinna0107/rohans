const fs = require('fs');

let indexCss = fs.readFileSync('src/index.css', 'utf8');

indexCss = indexCss.replace(/--primary: #000000;/g, '--primary: #ffffd4;');
indexCss = indexCss.replace(/--primary-light: #333333;/g, '--primary-light: #e6e6bf;');
indexCss = indexCss.replace(/--accent: #D4AF37;/g, '--accent: #ffffd4;');
indexCss = indexCss.replace(/--accent-light: #F9F1D8;/g, '--accent-light: #33332a;');
indexCss = indexCss.replace(/--accent2: #b8860b;/g, '--accent2: #ffffd4;');
indexCss = indexCss.replace(/--bg: #ffffff;/g, '--bg: #000000;');
indexCss = indexCss.replace(/--bg2: #f4f4f4;/g, '--bg2: #111111;');
indexCss = indexCss.replace(/--text-dark: #000000;/g, '--text-dark: #ffffd4;');
indexCss = indexCss.replace(/--text-light: #ffffff;/g, '--text-light: #000000;');
indexCss = indexCss.replace(/--glass-bg: rgba\(255, 255, 255, 0.9\);/g, '--glass-bg: rgba(255, 255, 212, 0.05);');
indexCss = indexCss.replace(/--glass-border: rgba\(212, 175, 55, 0.3\);/g, '--glass-border: rgba(255, 255, 212, 0.2);');
indexCss = indexCss.replace(/--glass-shadow: 0 12px 40px rgba\(0, 0, 0, 0.04\);/g, '--glass-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);');
indexCss = indexCss.replace(/color-scheme: light;/g, 'color-scheme: dark;');

fs.writeFileSync('src/index.css', indexCss);

// Also need to check Home.css for hardcoded black or white backgrounds and text
let homeCss = fs.readFileSync('src/pages/Home.css', 'utf8');
homeCss = homeCss.replace(/background: #ffffff;/g, 'background: #000000;');
homeCss = homeCss.replace(/color: #000000;/g, 'color: #ffffd4;');
homeCss = homeCss.replace(/color: #000;/g, 'color: #ffffd4;');
homeCss = homeCss.replace(/#d4af37/gi, '#ffffd4'); // replace old gold with logo cream
homeCss = homeCss.replace(/#e6c55c/gi, '#ffffd4'); 
homeCss = homeCss.replace(/background: #000;/g, 'background: #0a0a0a;'); // Highlights strip
homeCss = homeCss.replace(/color: #fff;/g, 'color: #000000;'); // If it was white text, maybe it should be black on cream?
// Wait, if we change all #fff to black, it might break some things.
// For example, if a button is cream (#ffffd4), text should be black (#000).
fs.writeFileSync('src/pages/Home.css', homeCss);

console.log('Theme changed to logo theme');
