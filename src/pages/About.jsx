import './About.css';
import { motion } from 'framer-motion';
import bgImage from '../assets/boutique_hero_bg.png'; // High-end boutique interior

const About = () => (
  <div className="about-page">
    {/* Editorial Hero */}
    <motion.div 
      className="about-hero" style={{ backgroundImage: `url(${bgImage})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="about-hero-overlay"></div>
      <motion.div 
        className="about-hero-content"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1>House of Ramya</h1>
        <p>Elevating the Everyday. Crafted for the Discerning.</p>
      </motion.div>
    </motion.div>

    <div className="about-container">
      {/* The Brand Manifesto */}
      <motion.section 
        className="about-story-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-heading">The Art of Quiet Luxury</h2>
        <div className="story-content">
          <p>
            At <strong>House of Ramya</strong>, we believe that true elegance is not loud; it is felt. It resides in the 
            weight of premium fabrics against the skin, the precision of a flawless stitch, and the quiet confidence 
            that accompanies impeccable design.
          </p>
          <p>
            Born from a desire to bridge the gap between high-end aesthetics and everyday wearability, we meticulously curate 
            collections that seamlessly transition through your life. From the tactile luxury of our premium footwear to the 
            tailored comfort of our casual essentials, every piece is a testament to uncompromising craftsmanship.
          </p>
          <p>
            Your wardrobe essentials deserve a premium touch. Welcome to accessible luxury, redefined.
          </p>
        </div>
      </motion.section>

      {/* Founder Section */}
      <motion.section 
        className="about-founder-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="founder-grid">
  <div className="founder-image-placeholder">
    <a href="/images/founder.jpg" target="_blank" rel="noopener noreferrer">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKcpjB3UqL4COHHIGYiscM7lHTs87aVNKHCuiU7xLINA&s=10"
        alt="Founder Ramya"
        className="founder-image"
      />
    </a>
  </div>

  <div className="founder-letter">
    <h2 className="section-heading-small">A Note from the Founder</h2>
    <p className="founder-quote">
      "I started House of Ramya because I grew tired of compromising. I wanted the sophistication of a heritage luxury brand, but with the approachable comfort required for real life. Fashion should never feel restrictive—it should empower you, effortlessly."
    </p>
    <p className="founder-quote">
      "Every sandal, every garment we create is born from an obsession with quality. My promise to you is simple: we will never overlook the details, because you deserve to experience quiet elegance in everything you wear."
    </p>
    <p className="founder-signature">— Ramya</p>
  </div>
</div>
      </motion.section>

      {/* Luxury Features / Pillars */}
      <section className="about-features-section">
        <h2 className="section-heading">Our Core Pillars</h2>
        <div className="features-grid">
          {[
            { icon: '✨', title: 'Premium Curation', desc: 'Each piece is meticulously selected to reflect an ethos of superior quality and enduring, quiet style.' },
            { icon: '🧵', title: 'Exceptional Comfort', desc: 'Crafted with tactile, premium materials designed to move gracefully with you, offering effortless, all-day ease.' },
            { icon: '🚚', title: 'White-Glove Delivery', desc: 'From our atelier to your hands, experience secure, expedited, and pristine presentation at your doorstep.' },
            { icon: '🤝', title: 'Concierge Team', desc: 'Our dedicated specialists place you first, ensuring a seamless and deeply personalized shopping experience.' },
          ].map((f, i) => (
            <motion.div 
              key={i} 
              className="luxury-feature-card flip-container"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <div className="flipper">
                <div className="front">
                  <span className="feature-icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                </div>
                <div className="back">
                  <p>{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default About;
