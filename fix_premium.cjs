const fs = require('fs');

// Add Playfair Display font to index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
if (!indexHtml.includes('Playfair Display')) {
    indexHtml = indexHtml.replace('</head>', '  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">\n  </head>');
    fs.writeFileSync('index.html', indexHtml);
}

// Update index.css to use Playfair Display for headings
let indexCss = fs.readFileSync('src/index.css', 'utf8');
indexCss = indexCss.replace(/font-family: 'Poppins', sans-serif;/g, "font-family: 'Playfair Display', serif;");
indexCss = indexCss.replace(/--accent: #d4af37;/g, '--accent: #D4AF37;\n  --accent-light: #F9F1D8;');
indexCss = indexCss.replace(/--glass-shadow: 0 8px 32px rgba\(0, 0, 0, 0.08\);/g, '--glass-shadow: 0 12px 40px rgba(0, 0, 0, 0.04);');
indexCss = indexCss.replace(/--glass-border: rgba\(0, 0, 0, 0.1\);/g, '--glass-border: rgba(212, 175, 55, 0.3);');
fs.writeFileSync('src/index.css', indexCss);

// Make Home.css look more premium
let homeCss = fs.readFileSync('src/pages/Home.css', 'utf8');
homeCss = homeCss.replace(/border-radius: 20px;/g, 'border-radius: 12px;'); // sharper corners look more premium
homeCss = homeCss.replace(/border-radius: 12px;/g, 'border-radius: 8px;');
homeCss = homeCss.replace(/border-radius: 50px;/g, 'border-radius: 4px;'); // squared buttons
// Revert button border radius to slightly rounded
homeCss = homeCss.replace(/border-radius: 4px;/g, 'border-radius: 4px; text-transform: uppercase; letter-spacing: 1px;');
// Fix specific sections
homeCss = homeCss.replace(/text-transform: uppercase; letter-spacing: 2px;/g, 'text-transform: uppercase; letter-spacing: 4px; font-weight: 400;'); // festival banner
homeCss = homeCss.replace(/box-shadow: 0 18px 45px rgba\(0,0,0,0.35\);/g, 'box-shadow: 0 20px 50px rgba(0,0,0,0.1);');

fs.writeFileSync('src/pages/Home.css', homeCss);

console.log('Premium styles applied');
