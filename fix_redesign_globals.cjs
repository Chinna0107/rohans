const fs = require('fs');

// Update index.html for fonts
let indexHtml = fs.readFileSync('index.html', 'utf8');
if (!indexHtml.includes('family=Inter:wght@400;500;600;700')) {
    indexHtml = indexHtml.replace('</head>', '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n  </head>');
    fs.writeFileSync('index.html', indexHtml);
}

// Update index.css
const cssContent = `
:root {
  --primary: #000000;
  --primary-light: #333333;
  --accent: #FF4747; /* Coral/Red */
  --accent-light: #FFEBEB;
  --bg: #ffffff;
  --bg-off: #f8f8f8;
  --text-dark: #1a1a1a;
  --text-light: #ffffff;
  --text-muted: #737373;
  --border-subtle: #e5e5e5;
  
  --font-serif: 'Playfair Display', serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  
  --shadow-subtle: 0 4px 20px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 12px 30px rgba(0, 0, 0, 0.08);
}

body {
  margin: 0;
  padding: 0;
  min-width: 320px;
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--bg);
  color: var(--text-dark);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
  transition: color 0.3s ease;
}

button {
  font-family: var(--font-sans);
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.luxury-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 2rem;
  background: var(--primary);
  color: var(--text-light);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.luxury-btn:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}
`;
fs.writeFileSync('src/index.css', cssContent);

console.log('Global CSS updated');
