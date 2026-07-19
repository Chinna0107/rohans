import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa';
import { MdLocationOn, MdOpenInNew } from 'react-icons/md';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpeg';
import './Footer.css';

const BRANCHES = [
  { name: 'Manikonda', url: 'https://maps.app.goo.gl/jyCKgUTFSoMYjbWa8' },
  { name: 'Banjara Hills', url: 'https://maps.app.goo.gl/Kpv6XZdtu6xgfLf68' },
  { name: 'Asrao Nagar', url: 'https://maps.app.goo.gl/dQYDTuFiNmQY6chv5' },
];

const Footer = () => (
  <footer className="luxury-footer">
    <div className="footer-container">
      
      {/* Column 1: Brand & Social */}
      <div className="footer-col brand-col">
        <div className="footer-brand-wrap">
          <img src={logo} alt="ROHANS MATCHING CENTRE" className="footer-logo" />
          <h3 className="footer-brand">
            <span>ROHANS</span><br />
            <span className="footer-brand-accent">MATCHING CENTRE</span>
          </h3>
        </div>
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

      {/* Column 3: Locations */}
      <div className="footer-col">
        <h4>Our Locations</h4>
        <ul className="footer-branches">
          {BRANCHES.map((b) => (
            <li key={b.name}>
              <a href={b.url} target="_blank" rel="noopener noreferrer" className="footer-branch-link">
                <MdLocationOn className="footer-branch-icon" />
                <span>{b.name}</span>
                <MdOpenInNew className="footer-branch-ext" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 4: Help */}
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
        <p>&copy; {new Date().getFullYear()} Rohans Matching Centre. All rights reserved.</p>
        <ul className="policy-links">
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms">Terms & Conditions</Link></li>
          <li><Link to="/refund-policy">Refund Policy</Link></li>
          <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
          <li><Link to="/shipping-policy">Shipping Policy</Link></li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
