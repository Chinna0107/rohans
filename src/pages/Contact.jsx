import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { MdLocationOn, MdPhone, MdEmail, MdAccessTime, MdOpenInNew } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import './Contact.css';

const BRANCHES = [
  {
    name: 'Manikonda',
    address: 'Manikonda, Hyderabad',
    mapUrl: 'https://maps.app.goo.gl/jyCKgUTFSoMYjbWa8',
    hours: 'Mon – Sun: 9:00 AM – 9:00 PM',
    tag: 'Branch 01',
  },
  {
    name: 'Banjara Hills',
    address: 'Banjara Hills, Hyderabad',
    mapUrl: 'https://maps.app.goo.gl/Kpv6XZdtu6xgfLf68',
    hours: 'Mon – Sun: 9:00 AM – 9:00 PM',
    tag: 'Branch 02',
  },
  {
    name: 'Asrao Nagar',
    address: 'Asrao Nagar, Hyderabad',
    mapUrl: 'https://maps.app.goo.gl/dQYDTuFiNmQY6chv5',
    hours: 'Mon – Sun: 9:00 AM – 9:00 PM',
    tag: 'Branch 03',
  },
];

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    window.open(`https://wa.me/918885553249?text=Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`, '_blank');
    toast.success('Redirecting to WhatsApp...');
    e.target.reset();
  };

  return (
    <div className="contact-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero */}
      <motion.div
        className="contact-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="contact-hero-tag">We're Here For You</span>
        <h1>Visit Us Anytime</h1>
        <p>Three premium locations across Hyderabad — find the one nearest to you.</p>
      </motion.div>

      {/* Branches */}
      <section className="branches-section">
        <div className="branches-grid">
          {BRANCHES.map((b, i) => (
            <motion.div
              key={b.name}
              className="branch-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <div className="branch-tag">{b.tag}</div>
              <div className="branch-icon-wrap">
                <MdLocationOn />
              </div>
              <h3 className="branch-name">{b.name}</h3>
              <p className="branch-address">{b.address}</p>
              <div className="branch-hours">
                <MdAccessTime size={14} />
                <span>{b.hours}</span>
              </div>
              <a
                href={b.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="branch-map-btn"
              >
                <MdOpenInNew size={15} /> Get Directions
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Info + Form */}
      <div className="contact-container">
        <div className="contact-grid">

          {/* Info */}
          <motion.div
            className="contact-info-block"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Get in Touch</h2>
            <p className="contact-intro">Have a question about our collections, sizing, or your order? Our team is ready to help.</p>

            <div className="info-list">
              <div className="info-item">
                <span className="info-icon-wrap"><MdPhone /></span>
                <div>
                  <h3>Phone</h3>
                  <p><a href="tel:+918885553249">+91 88855 53249</a></p>
                  <p><a href="tel:+918008007884">+91 80080 07884</a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon-wrap whatsapp"><FaWhatsapp /></span>
                <div>
                  <h3>WhatsApp</h3>
                  <p><a href="https://wa.me/918897030909" target="_blank" rel="noopener noreferrer">+91 88970 30909</a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon-wrap"><MdEmail /></span>
                <div>
                  <h3>Email</h3>
                  <p><a href="mailto:thehouseoframya@gmail.com">thehouseoframya@gmail.com</a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon-wrap"><MdAccessTime /></span>
                <div>
                  <h3>Business Hours</h3>
                  <p>Monday – Sunday: 9:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="luxury-contact-form">
              <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" required rows="4" placeholder="How can we help you?" />
              </div>
              <button type="submit" className="contact-submit-btn">
                <FaWhatsapp size={18} /> Send via WhatsApp
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
