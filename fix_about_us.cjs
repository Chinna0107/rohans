const fs = require('fs');
let css = fs.readFileSync('src/components/Header.css', 'utf8');

if (!css.includes('white-space: nowrap;')) {
  css = css.replace(
`.main-nav a {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}`,
`.main-nav a {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  white-space: nowrap;
}`
  );
  fs.writeFileSync('src/components/Header.css', css);
  console.log('Fixed About Us wrapping');
} else {
  console.log('Already fixed');
}
