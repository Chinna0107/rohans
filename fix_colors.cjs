const fs = require('fs');

function fixFile(file) {
  if (fs.existsSync(file)) {
    let css = fs.readFileSync(file, 'utf8');
    
    // In dark theme, replace any unintended black text colors with the cream color
    // But be careful around buttons which might have cream background and need black text.
    // Let's just fix the specific ones we know broke.
    css = css.replace(/color: rgba\(0,0,0,/g, 'color: rgba(255,255,212,'); // fix rgba colors
    css = css.replace(/border: 1.5px solid rgba\(0,0,0,0.4\)/g, 'border: 1.5px solid rgba(255,255,212,0.4)');
    
    fs.writeFileSync(file, css);
  }
}

fixFile('src/pages/Home.css');
fixFile('src/components/Header.css');
fixFile('src/components/Footer.css');
fixFile('src/index.css');

// specific fixes for Home.css
let homeCss = fs.readFileSync('src/pages/Home.css', 'utf8');
homeCss = homeCss.replace(/color: #000000;/g, 'color: #ffffd4;'); 
// The festival button is cream (#ffffd4), so its text should be black
homeCss = homeCss.replace(/background: #ffffd4; color: #ffffd4;/g, 'background: #ffffd4; color: #000000;');
// The active swatch has a border
homeCss = homeCss.replace(/border-color: rgba\(225,120,45,0.6\);/g, 'border-color: rgba(255,255,212,0.6);');
homeCss = homeCss.replace(/color: #ffffff;/g, 'color: #000000;'); // some buttons had color: #ffffff, let's make them black since buttons are cream
// Wait, if buttons are gradient cream/gold?
// earlier: css = css.replace(/linear-gradient\(135deg, #e1782d, #b41e1e\)/g, '...');
fs.writeFileSync('src/pages/Home.css', homeCss);

console.log('Fixed inverted colors');
