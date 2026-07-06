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

// Revert index.css to white background, black text
replaceInFile('src/index.css', [
  [/--primary: #ffffff;/g, '--primary: #000000;'],
  [/--primary-light: #f0f0f0;/g, '--primary-light: #333333;'],
  [/--accent: #d4af37;/g, '--accent: #e1782d;'],
  [/--bg: #000000;/g, '--bg: #ffffff;'],
  [/--bg2: #111111;/g, '--bg2: #f9f9f9;'],
  [/--text-dark: #ffffff;/g, '--text-dark: #000000;'],
  [/--text-light: #000000;/g, '--text-light: #ffffff;'],
  [/--glass-bg: rgba\(255, 255, 255, 0.05\);/g, '--glass-bg: rgba(255, 255, 255, 0.9);'],
  [/--glass-border: rgba\(212, 175, 55, 0.3\);/g, '--glass-border: rgba(0, 0, 0, 0.08);'],
  [/--glass-shadow: 0 12px 40px rgba\(0, 0, 0, 0.5\);/g, '--glass-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);'],
  [/color-scheme: dark;/g, 'color-scheme: light;'],
]);

// Update Home.css colors and add animations
let homeCss = fs.readFileSync('src/pages/Home.css', 'utf8');

// Colors
homeCss = homeCss.replace(/color: #ffffff;/g, 'color: #000000;');
homeCss = homeCss.replace(/color: #d4af37;/g, 'color: #000000;');
homeCss = homeCss.replace(/color: rgba\(255,255,255,0.6\);/g, 'color: rgba(0,0,0,0.6);');
homeCss = homeCss.replace(/color: rgba\(255,255,255,0.7\);/g, 'color: rgba(0,0,0,0.7);');
homeCss = homeCss.replace(/color: rgba\(255,255,255,0.8\);/g, 'color: rgba(0,0,0,0.8);');
homeCss = homeCss.replace(/color: rgba\(255,255,255,0.5\);/g, 'color: rgba(0,0,0,0.5);');
homeCss = homeCss.replace(/background: #000000;/g, 'background: #ffffff;');
homeCss = homeCss.replace(/background: #0a0a0a;/g, 'background: #f4f4f4;');
homeCss = homeCss.replace(/border-color: rgba\(212,175,55/g, 'border-color: rgba(0,0,0');
homeCss = homeCss.replace(/border: 1.5px solid rgba\(212,175,55,0.4\)/g, 'border: 1.5px solid rgba(0,0,0,0.1)');

// Festival banner text should be white since it has a dark overlay
homeCss = homeCss.replace(/\.festival-content h2 \{ font-size: 3rem; margin: 0 0 1rem; color: #000000;/g, '.festival-content h2 { font-size: 3rem; margin: 0 0 1rem; color: #ffffff;');
homeCss = homeCss.replace(/\.festival-content p \{ font-size: 1.2rem; margin: 0 0 2rem; color: #000000;/g, '.festival-content p { font-size: 1.2rem; margin: 0 0 2rem; color: #ffffff;');

// Fabric overlay text should be white
homeCss = homeCss.replace(/\.fabric-overlay h3 \{ color: #000000;/g, '.fabric-overlay h3 { color: #ffffff;');
// Insta overlay text should be white
homeCss = homeCss.replace(/\.insta-overlay \{\s*position: absolute; inset: 0; background: rgba\(0,0,0,0.4\); display: flex; align-items: center; justify-content: center;\s*color: #000000;/g, '.insta-overlay {\n  position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;\n  color: #ffffff;');

// Animations - 3D Hover Effect like style-haven
const animations = `
/* Premium Hover Animations */
.product-card {
  transition-property: all;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .5s;
  transform-style: preserve-3d;
  perspective: 1000px;
}
.product-card:hover {
  transform: rotateY(-5deg) rotateX(5deg) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
.product-card-img-wrap img {
  transition-property: transform;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .7s;
}
.product-card:hover .product-card-img-wrap img {
  transform: scale(1.1);
}

.cat-card, .feature-card, .step-card, .testimonial-card, .offer-card {
  transition-property: all;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .5s;
}
.cat-card:hover, .feature-card:hover, .step-card:hover, .testimonial-card:hover, .offer-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0,0,0,0.08);
}
`;

homeCss = homeCss + animations;
fs.writeFileSync('src/pages/Home.css', homeCss);

// Fix Header and Footer text colors
replaceInFile('src/components/Header.css', [
  [/color: #ffffff;/g, 'color: #000000;'],
]);
replaceInFile('src/components/Footer.css', [
  [/color: #ffffff;/g, 'color: #000000;'],
  [/\.footer-bottom \{[\s\S]*?color: rgba\(255, 255, 255/g, match => match.replace('color: rgba(255, 255, 255', 'color: rgba(0, 0, 0')],
]);

console.log('Reverted to white theme and added animations');
