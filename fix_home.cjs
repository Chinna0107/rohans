const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// Replace brand name
content = content.replace(/TheAlphaZone/g, 'House of Ramya');

// Replace whatsapp link
content = content.replace(/918885553249/g, '918897030909');

// Replace call link
content = content.replace(/\+918885553249/g, '+918008007884');

// We also should update any text references to House of Ramya instead of TheAlphaZone.
// The regex above will cover most.

fs.writeFileSync('src/pages/Home.jsx', content);
console.log('Home updated');
