const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.jsx', 'utf8');

// Replace brand name
content = content.replace(/<span className="f-alpha">TheAlpha<\/span><span className="f-zone">Zone<\/span>/g, '<span className="f-alpha">House of </span><span className="f-zone">Ramya</span>');
content = content.replace(/TheAlphaZone/g, 'House of Ramya');

// Replace whatsapp links
content = content.replace(/918885553249/g, '918897030909');
content = content.replace(/\+91 88855 53249/g, '+91 88970 30909');

// Replace emails
content = content.replace(/thealphazone007@gmail.com/g, 'thehouseoframya@gmail.com');

// Add address in the contact section
const contactHTMLOld = `
          <a href="mailto:thehouseoframya@gmail.com" className="footer-contact-item">
            <span className="fci-icon">✉️</span>
            <div><strong>Email</strong><span>thehouseoframya@gmail.com</span></div>
          </a>
          <div className="footer-contact-item no-link">
            <span className="fci-icon">🕐</span>
            <div><strong>Hours</strong><span>Mon–Sat, 9am–8pm</span></div>
          </div>
`;
const contactHTMLNew = `
          <a href="mailto:thehouseoframya@gmail.com" className="footer-contact-item">
            <span className="fci-icon">✉️</span>
            <div><strong>Email</strong><span>thehouseoframya@gmail.com</span></div>
          </a>
          <a href="tel:+918008007884" className="footer-contact-item">
            <span className="fci-icon">📞</span>
            <div><strong>Phone</strong><span>+91 80080 07884</span></div>
          </a>
          <div className="footer-contact-item no-link">
            <span className="fci-icon">📍</span>
            <div><strong>Address</strong><span>13-6-586, P.K.Layout, Tirupati-517501</span></div>
          </div>
          <div className="footer-contact-item no-link">
            <span className="fci-icon">🕐</span>
            <div><strong>Hours</strong><span>Mon–Sat, 9am–8pm</span></div>
          </div>
`;

content = content.replace(contactHTMLOld, contactHTMLNew);
content = content.replace(contactHTMLOld, contactHTMLNew); // replace in both mobile and desktop sections

fs.writeFileSync('src/components/Footer.jsx', content);
console.log('Footer updated');
