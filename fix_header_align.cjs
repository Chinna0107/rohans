const fs = require('fs');

let headerCss = fs.readFileSync('src/components/Header.css', 'utf8');

// Align header container to bottom (flex-end)
headerCss = headerCss.replace(
`  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;`,
`  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem 2rem;`
);

// Add logo style
if (!headerCss.includes('.brand-logo-img')) {
  headerCss = headerCss.replace(
`.brand-logo {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: -0.5px;
}`,
`.brand-logo {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: -0.5px;
  display: flex;
  align-items: flex-end;
}
.brand-logo-img {
  height: 60px;
  object-fit: contain;
}`
  );
}

// Adjust right icons so they don't look weird when bottom aligned
// They were `align-items: center`, which is fine for the icon row itself,
// but the row is at the bottom of the container. We might want a little padding-bottom
// on the center and right sections so they align nicely with the logo.
headerCss = headerCss.replace(
`  .header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;
}`,
`.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 0.5rem; /* align with logo baseline */
}`
);

headerCss = headerCss.replace(
`.header-center {
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}`,
`.header-center {
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding-bottom: 0.5rem; /* align with logo baseline */
}`
);

fs.writeFileSync('src/components/Header.css', headerCss);
console.log('Header CSS updated');
