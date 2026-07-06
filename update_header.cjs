const fs = require('fs');

let headerJsx = fs.readFileSync('src/components/Header.jsx', 'utf8');

const navOld = `<nav className="main-nav">
            <Link to="/products" state={{ category: 'Men' }} onClick={() => setIsMenuOpen(false)}>Men</Link>
            <Link to="/products" state={{ category: 'Women' }} onClick={() => setIsMenuOpen(false)}>Women</Link>
            <Link to="/products" state={{ category: 'Accessories' }} onClick={() => setIsMenuOpen(false)}>Accessories</Link>
          </nav>`;

const navNew = `<nav className="main-nav">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>`;

headerJsx = headerJsx.replace(navOld, navNew);

fs.writeFileSync('src/components/Header.jsx', headerJsx);

let headerCss = fs.readFileSync('src/components/Header.css', 'utf8');

// Change .header-center to flex-direction: row so nav and search are side-by-side
headerCss = headerCss.replace(/flex-direction: column;/g, 'flex-direction: row;');

fs.writeFileSync('src/components/Header.css', headerCss);

console.log('Header updated');
