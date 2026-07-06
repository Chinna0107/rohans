const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/TheAlphaZone/gi, 'House of Ramya');
fs.writeFileSync('index.html', indexHtml);

console.log('App updated');
