const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');
if(app.includes('TheAlphaZone')) {
  app = app.replace(/TheAlphaZone/g, 'House of Ramya');
  fs.writeFileSync('src/App.jsx', app);
}
