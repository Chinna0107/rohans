import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    // Sending to one of the contact numbers provided
    window.open(`https://wa.me/918008007884?text=Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`, '_blank');
    toast.success('Redirecting to WhatsApp...');
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="contact-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Contact Us</h1>
        <p>We are here to assist you with your luxury shopping experience.</p>
      </motion.div>

      <div className="contact-container">
        <div className="contact-grid">

          {/* Contact Info */}
          <motion.div
            className="contact-info-block"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Get in Touch</h2>
            <p className="contact-intro">Whether you have a question about our collections, sizing, or your order, our concierge team is ready to help.</p>

            <div className="info-list">
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h3>Phone</h3>
                  <p><motion.a href="tel:+918008007884" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }} whileHover={{ scale: 1.05, color: '#000' }}>+91 8008007884</motion.a></p>
                  <p><motion.a href="https://wa.me/918897030909" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }} whileHover={{ scale: 1.05, color: '#25D366' }}>+91 8897030909 (WhatsApp)</motion.a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <h3>Email</h3>
                  <p><motion.a href="mailto:thehouseoframya@gmail.com" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }} whileHover={{ scale: 1.05, color: '#000' }}>thehouseoframya@gmail.com</motion.a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h3>Address</h3>
                  <p>13-6-586, P.K.Layout<br />Tirupati - 517501</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🕐</span>
                <div>
                  <h3>Business Hours</h3>
                  <p>Monday – Sunday: 9:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="luxury-contact-form">
              <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" required rows="4" />
              </div>
              <button type="submit" className="luxury-btn">Send Message</button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
