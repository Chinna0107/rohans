import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => (
  <footer className="luxury-footer">
    <div className="footer-container">
      
      {/* Column 1: Brand & Social */}
      <div className="footer-col brand-col">
        <h3 className="footer-brand">House of Ramya</h3>
        <p className="brand-bio">
          Your premium destination for stunning ethnic wear, elegant sarees, custom stitching, and intricate Maggam work.
        </p>
        <div className="social-icons">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
          <a href="https://youtube.com/@aniruddayaenterprises?si=A-OvDYlC38vU8AZ_" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>

      {/* Column 2: Shop */}
      <div className="footer-col">
        <h4>Shop</h4>
        <ul>
          <li><Link to="/products">All Collections</Link></li>
          <li><Link to="/products" state={{ category: 'Sarees' }}>Premium Sarees</Link></li>
          <li><Link to="/products" state={{ category: 'Kurties' }}>Designer Kurties</Link></li>
          <li><Link to="/products" state={{ category: 'Maggam Work' }}>Maggam Work</Link></li>
          <li><Link to="/products" state={{ category: 'Custom Stitching' }}>Custom Stitching</Link></li>
        </ul>
      </div>

      {/* Column 3: Help */}
      <div className="footer-col">
        <h4>Help</h4>
        <ul>
          <li><Link to="/faq">Track Order</Link></li>
          <li><Link to="/refund-policy">Returns & Exchanges</Link></li>
          <li><Link to="/shipping-policy">Shipping Policy</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </div>

      {/* Column 4: Contact */}
      <div className="footer-col">
        <h4>Contact</h4>
        <ul className="contact-info">
          <li><strong>WhatsApp:</strong> <motion.a href="https://wa.me/918897030909" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }} whileHover={{ scale: 1.05, color: '#000' }}>+91 88970 30909</motion.a></li>
          <li><strong>Phone:</strong> <motion.a href="tel:+918008007884" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }} whileHover={{ scale: 1.05, color: '#000' }}>+91 80080 07884</motion.a></li>
          <li><strong>Email:</strong> <motion.a href="mailto:thehouseoframya@gmail.com" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }} whileHover={{ scale: 1.05, color: '#000' }}>thehouseoframya@gmail.com</motion.a></li>
          <li><strong>Address:</strong> 13-6-586, P.K.Layout,<br />Tirupati-517501</li>
        </ul>
      </div>
      
    </div>

    {/* Bottom Bar */}
    <div className="footer-bottom">
      <div className="bottom-content">
        <p>&copy; {new Date().getFullYear()} House of Ramya. All rights reserved.</p>
        <ul className="policy-links">
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms of Service</Link></li>
          <li><Link to="/privacy-policy">Cookie Policy</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
