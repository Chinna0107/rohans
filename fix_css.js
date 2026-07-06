const fs = require('fs');
let css = fs.readFileSync('src/pages/Home.css', 'utf8');

// Replace dark mode colors with white/black/gold
css = css.replace(/#b41e1e/g, '#000000');
css = css.replace(/#e1782d/g, '#d4af37');
css = css.replace(/#f0a54b/g, '#e6c55c');
css = css.replace(/#1a0a0a/g, '#ffffff');
css = css.replace(/color: #fff;/g, 'color: #000000;');
css = css.replace(/color: white;/g, 'color: #ffffff;'); // button text can stay white if bg is black
css = css.replace(/rgba\(255,255,255,/g, 'rgba(0,0,0,');
// Exception: we replaced color: white; to color: #ffffff; but some might need reverting
// If bg is black gradient, text should be white.
css = css.replace(/linear-gradient\(135deg, #000000, #d4af37\)/g, 'linear-gradient(135deg, #d4af37, #000000)');

const newCss = `
/* New Sections CSS */
.festival-banner-section {
  padding: 2rem;
  max-width: 1300px;
  margin: 0 auto;
  cursor: pointer;
}
.festival-banner {
  background: url('https://images.unsplash.com/photo-1605335198889-8d1973ff669c?q=80&w=1200&auto=format&fit=crop') center/cover;
  border-radius: 20px;
  text-align: center;
  padding: 4rem 2rem;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.festival-banner::before {
  content: '';
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.5);
}
.festival-content {
  position: relative;
  z-index: 1;
}
.festival-content h2 { font-size: 3rem; margin: 0 0 1rem; color: #fff; text-transform: uppercase; letter-spacing: 2px;}
.festival-content p { font-size: 1.2rem; margin: 0 0 2rem; color: #fff;}
.festival-btn {
  background: #d4af37; color: #fff; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: bold;
  border: none; border-radius: 50px; cursor: pointer; transition: 0.3s;
}
.festival-btn:hover { background: #000; color: #d4af37; }

/* Fabric Section */
.fabric-section { padding: 4rem 2rem; max-width: 1300px; margin: 0 auto; }
.fabric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.fabric-card {
  height: 250px; border-radius: 20px; overflow: hidden; position: relative; cursor: pointer;
  background-size: cover; background-position: center; transition: transform 0.3s;
}
.fabric-card:hover { transform: translateY(-5px); }
.fabric-overlay {
  position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  display: flex; align-items: flex-end; padding: 1.5rem;
}
.fabric-overlay h3 { color: #fff; font-size: 1.5rem; margin: 0; font-weight: 700; }

/* Color Section */
.color-section { padding: 4rem 2rem; max-width: 1300px; margin: 0 auto; text-align: center; }
.color-flex { display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap; }
.color-circle-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; }
.color-circle { width: 70px; height: 70px; border-radius: 50%; transition: transform 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.color-circle-wrap:hover .color-circle { transform: scale(1.1); }
.color-circle-wrap span { font-weight: 600; font-size: 1rem; color: #000; }

/* Instagram Feed */
.instagram-section { padding: 4rem 2rem; max-width: 1300px; margin: 0 auto; text-align: center; }
.insta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.insta-item { position: relative; aspect-ratio: 1; border-radius: 12px; overflow: hidden; cursor: pointer; }
.insta-item img { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; }
.insta-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 2.5rem; opacity: 0; transition: 0.3s;
}
.insta-item:hover img { transform: scale(1.1); }
.insta-item:hover .insta-overlay { opacity: 1; }

/* Highlights Strip */
.highlights-strip {
  display: flex; justify-content: space-around; background: #000; color: #d4af37; padding: 2rem;
  margin-top: 2rem; flex-wrap: wrap; gap: 1rem;
}
.highlight-item { display: flex; align-items: center; gap: 1rem; font-size: 1.1rem; font-weight: 600; }
.highlight-icon { font-size: 2rem; }

@media (max-width: 768px) {
  .fabric-grid, .insta-grid { grid-template-columns: repeat(2, 1fr); }
  .festival-content h2 { font-size: 2rem; }
  .highlights-strip { flex-direction: column; align-items: center; gap: 1.5rem; }
}
`;

fs.writeFileSync('src/pages/Home.css', css + newCss);
console.log('CSS updated');
