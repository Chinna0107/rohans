const fs = require('fs');

function replaceInFile(file, replacements) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [regex, replacement] of replacements) {
      content = content.replace(regex, replacement);
    }
    fs.writeFileSync(file, content);
  }
}

// Global variables in index.css
replaceInFile('src/index.css', [
  [/--primary: #ffffd4;/g, '--primary: #ffffff;'],
  [/--primary-light: #e6e6bf;/g, '--primary-light: #f0f0f0;'],
  [/--accent: #ffffd4;/g, '--accent: #d4af37;'],
  [/--accent-light: #33332a;/g, '--accent-light: #f9f1d8;'],
  [/--accent2: #ffffd4;/g, '--accent2: #b8860b;'],
  [/--text-dark: #ffffd4;/g, '--text-dark: #ffffff;'],
  [/--glass-bg: rgba\(255, 255, 212, 0.05\);/g, '--glass-bg: rgba(255, 255, 255, 0.05);'],
  [/--glass-border: rgba\(255, 255, 212, 0.2\);/g, '--glass-border: rgba(212, 175, 55, 0.3);'],
]);

// Home.css specific fixes
// We want text to be white generally, and accents (like borders, hover, specific icons) to be gold.
// Currently, everything might be #ffffd4 cream. Let's make most text #ffffff and specific highlights #d4af37.
replaceInFile('src/pages/Home.css', [
  [/color: #ffffd4;/g, 'color: #ffffff;'],
  [/border-color: rgba\(255,255,212/g, 'border-color: rgba(212,175,55'],
  [/background: #ffffd4;/g, 'background: #d4af37;'], // buttons
  [/color: rgba\(255,255,212,/g, 'color: rgba(255,255,255,'],
  [/border: 1.5px solid rgba\(255,255,212,0.4\)/g, 'border: 1.5px solid rgba(212,175,55,0.4)'],
  // Make icons gold instead of white if they had a specific class, but let's see:
  // .stat-icon { font-size: 2rem; color: #ffffff; } -> want gold
  [/\.stat-icon \{ font-size: 2rem; color: #ffffff;/g, '.stat-icon { font-size: 2rem; color: #d4af37;'],
  [/\.cat-arrow \{\n  font-size: 1.2rem;\n  color: #ffffff;/g, '.cat-arrow {\n  font-size: 1.2rem;\n  color: #d4af37;'],
  [/\.feature-icon \{ font-size: 2.5rem; color: #ffffff;/g, '.feature-icon { font-size: 2.5rem; color: #d4af37;'],
  [/\.price \{ font-size: 1.15rem; font-weight: 800; color: #ffffff;/g, '.price { font-size: 1.15rem; font-weight: 800; color: #d4af37;'],
  [/\.t-stars \{ display: flex; gap: 0.2rem; margin-bottom: 1rem; color: #ffffff;/g, '.t-stars { display: flex; gap: 0.2rem; margin-bottom: 1rem; color: #d4af37;'],
  [/\.step-icon \{ font-size: 2.2rem; color: #ffffff;/g, '.step-icon { font-size: 2.2rem; color: #d4af37;'],
  [/\.cat-react-icon \{[\s\S]*?color: #ffffff;/g, match => match.replace('color: #ffffff;', 'color: #d4af37;')],
  [/\.mob-cat-react-icon \{[\s\S]*?color: #ffffff;/g, match => match.replace('color: #ffffff;', 'color: #d4af37;')],
  [/\.mob-cat-card \.mob-cat-arrow \{\n  font-size: 0.75rem;\n  color: #ffffff;/g, '.mob-cat-card .mob-cat-arrow {\n  font-size: 0.75rem;\n  color: #d4af37;'],
]);

// Header and Footer
replaceInFile('src/components/Header.css', [
  [/color: #ffffd4;/g, 'color: #ffffff;'],
  [/color: #ffffd4/g, 'color: #ffffff'],
  [/border-color: #ffffd4/g, 'border-color: #d4af37'],
]);

replaceInFile('src/components/Footer.css', [
  [/color: #ffffd4;/g, 'color: #ffffff;'],
  [/color: #ffffd4/g, 'color: #ffffff'],
  [/border-color: #ffffd4/g, 'border-color: #d4af37'],
  // Replace SVG colors or icon container backgrounds to gold if needed, but white is fine for text
]);

console.log('Applied black/white/gold theme');
