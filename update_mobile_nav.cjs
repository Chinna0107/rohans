const fs = require('fs');
let headerCss = fs.readFileSync('src/components/Header.css', 'utf8');

// The first replace changed all instances, meaning mobile is now flex-direction: row.
// Let's fix mobile back to column.
headerCss = headerCss.replace(
`  .header-center {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    background: var(--bg);
    flex-direction: row;
    justify-content: center;
    padding: 2rem;
    box-shadow: 2px 0 20px rgba(0,0,0,0.1);
    transition: 0.3s ease;
    z-index: 1000;
  }`,
`  .header-center {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    background: var(--bg);
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    box-shadow: 2px 0 20px rgba(0,0,0,0.1);
    transition: 0.3s ease;
    z-index: 1000;
  }`
);

// Also .main-nav in mobile should be column
headerCss = headerCss.replace(
`  .main-nav {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }`,
`  .main-nav {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }`
);

// Let's also adjust the center gap for desktop to be larger, e.g., 2rem
headerCss = headerCss.replace(
`  .header-center {
  flex: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}`,
`  .header-center {
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}`
);

fs.writeFileSync('src/components/Header.css', headerCss);
console.log('Mobile nav fixed');
