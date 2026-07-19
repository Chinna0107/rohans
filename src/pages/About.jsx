import './About.css';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';
import Typewriter from 'typewriter-effect';
import { MdLocationOn, MdPhone, MdEmail, MdOpenInNew } from 'react-icons/md';
import { FaInstagram, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

const STATS = [
  { end: 15,     suffix: '+',  label: 'Years of Excellence',  decimals: 0 },
  { end: 10000,  suffix: '+',  label: 'Happy Customers',      decimals: 0 },
  { end: 3,      suffix: '',   label: 'Showroom Locations',   decimals: 0 },
  { end: 500,    suffix: '+',  label: 'Styles Available',     decimals: 0 },
];

const CATEGORIES = [
  { icon: '🥻', title: 'Sarees',           desc: 'From Kanjivaram silks to lightweight cotton weaves — every occasion, every mood, every woman.' },
  { icon: '👗', title: 'Kurties & Suits',  desc: 'Casual daily wear to festive designer kurties, crafted for comfort and elegance.' },
  { icon: '🧵', title: 'Dress Materials',  desc: 'Premium unstitched fabrics — choose your fabric, bring your vision to life.' },
  { icon: '✂️', title: 'Custom Stitching', desc: 'Tailored to your exact measurements. Your style, stitched to perfection.' },
  { icon: '🪡', title: 'Maggam Work',      desc: 'Intricate hand-embroidered blouses and borders by skilled artisans.' },
  { icon: '🎉', title: 'Festive & Bridal', desc: 'Curated collections for weddings, festivals, and every celebration in between.' },
];

const BRANCHES = [
  { name: 'Manikonda',    address: 'Shop No. 12, Manikonda Main Road, Hyderabad', url: 'https://maps.app.goo.gl/jyCKgUTFSoMYjbWa8' },
  { name: 'Banjara Hills',address: 'Road No. 10, Banjara Hills, Hyderabad',       url: 'https://maps.app.goo.gl/Kpv6XZdtu6xgfLf68' },
  { name: 'Ameerpet',     address: 'SR Nagar, Ameerpet, Hyderabad',               url: 'https://maps.app.goo.gl/dQYDTuFiNmQY6chv5' },
];

const fadeUp   = (delay = 0) => ({ initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7, delay } });
const fadeLeft = (delay = 0) => ({ initial: { opacity: 0, x: -60 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7, delay } });
const fadeRight= (delay = 0) => ({ initial: { opacity: 0, x: 60  }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7, delay } });

const About = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="about-page">

      {/* ── Hero with parallax ── */}
      <section className="about-hero" ref={heroRef}>
        <motion.div className="about-hero-bg" style={{ y: heroY }} />
        <div className="about-hero-overlay" />
        <motion.div className="about-hero-content" style={{ opacity: heroOpacity }}
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.9 }}>
          <motion.span className="about-hero-tag"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            Est. 2008 · Hyderabad
          </motion.span>

          <h1>
            <Typewriter options={{
              strings: ['Rohans Matching Centre', 'Your Fashion Destination', 'Every Style. Every Occasion.'],
              autoStart: true, loop: true, delay: 60, deleteSpeed: 30,
              wrapperClassName: 'about-typewriter', cursorClassName: 'about-typewriter-cursor',
            }} />
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
            Your one-stop destination for every fashion, every occasion, every you.
          </motion.p>
          <motion.button className="about-hero-btn" onClick={() => navigate('/products')}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(233,30,140,0.4)' }} whileTap={{ scale: 0.97 }}>
            Explore Collections
          </motion.button>
        </motion.div>
      </section>

      {/* ── Stats Bar with CountUp ── */}
      <section className="about-stats-bar">
        {STATS.map((s, i) => (
          <motion.div key={i} className="about-stat"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}>
            <span className="about-stat-num">
              <CountUp end={s.end} suffix={s.suffix} duration={2.5} decimals={s.decimals}
                separator="," enableScrollSpy scrollSpyOnce />
            </span>
            <span className="about-stat-label">{s.label}</span>
          </motion.div>
        ))}
      </section>

      {/* ── Who We Are ── */}
      <section className="about-section about-who">
        <div className="about-who-grid">
          <motion.div className="about-who-img" {...fadeLeft(0)}>
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop" alt="Showroom" />
            <motion.div className="about-who-img-badge"
              initial={{ scale: 0, rotate: -20 }} whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}>
              <img src={logo} alt="Logo" />
            </motion.div>
          </motion.div>
          <motion.div className="about-who-text" {...fadeRight(0.15)}>
            <span className="about-section-tag">Who We Are</span>
            <h2>More Than a Store.<br />A Fashion Destination.</h2>
            <p><strong>Rohans Matching Centre</strong> was founded with one simple belief — every woman deserves to look and feel her best, without compromise. What started as a small boutique in Hyderabad has grown into a beloved fashion destination with three thriving showrooms across the city.</p>
            <p>We are a <strong>matching centre</strong> in the truest sense — we match you with the perfect saree, the right fabric, the ideal blouse design, and the most fitting stitch. Whether you walk in for a casual kurti or a bridal ensemble, we ensure every piece is a perfect match for your personality and occasion.</p>
            <p>From everyday cotton sarees to grand silk Kanjivarams, from readymade kurties to fully custom-stitched outfits with intricate Maggam work — everything is under one roof, curated with love and expertise.</p>
          </motion.div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="about-section about-categories-section">
        <motion.span className="about-section-tag centered" {...fadeUp(0)}>What We Offer</motion.span>
        <motion.h2 className="about-section-heading" {...fadeUp(0.1)}>Everything Fashion, All in One Place</motion.h2>
        <motion.p className="about-section-sub" {...fadeUp(0.2)}>From the fabric to the final stitch — we have it all.</motion.p>
        <div className="about-categories-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={i} className="about-cat-card"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, type: 'spring', stiffness: 120 }}
              whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(233,30,140,0.12)', borderColor: '#e91e8c' }}
              onClick={() => navigate('/products')}>
              <motion.span className="about-cat-icon"
                whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}>{cat.icon}</motion.span>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              <span className="about-cat-link">Shop Now →</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Our Promise ── */}
      <section className="about-section about-promise-section">
        <div className="about-promise-inner">
          <motion.span className="about-section-tag centered" {...fadeUp(0)}>Our Promise</motion.span>
          <motion.h2 className="about-section-heading" style={{ color: '#fff' }} {...fadeUp(0.1)}>
            Crafted with Care.<br />Delivered with Pride.
          </motion.h2>
          <div className="about-promise-grid">
            {[
              { icon: '✨', title: 'Premium Quality',  desc: 'Every fabric, every thread is chosen for its quality. We never compromise on what touches your skin.' },
              { icon: '🎨', title: 'Perfect Matching', desc: 'Our expert staff help you match sarees, blouses, borders, and accessories — a complete look, every time.' },
              { icon: '✂️', title: 'Master Tailoring', desc: 'Our in-house tailors bring decades of experience to every stitch, ensuring a flawless fit.' },
              { icon: '💛', title: 'Personal Touch',   desc: 'We treat every customer like family. Your satisfaction is not a goal — it is our standard.' },
            ].map((p, i) => (
              <motion.div key={i} className="about-promise-card"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ scale: 1.04, borderColor: 'rgba(233,30,140,0.5)', background: 'rgba(233,30,140,0.07)' }}>
                <motion.span className="about-promise-icon"
                  whileInView={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.4, duration: 0.6 }}>{p.icon}</motion.span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder Note ── */}
      <section className="about-section about-founder-section">
        <div className="about-founder-grid">
          <motion.div className="about-founder-img-wrap" {...fadeLeft(0)}>
            <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=700&auto=format&fit=crop" alt="Founder" />
            <motion.div className="about-founder-img-shine"
              animate={{ x: ['−100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }} />
          </motion.div>
          <motion.div className="about-founder-text" {...fadeRight(0.15)}>
            <span className="about-section-tag">A Note from the Founder</span>
            <h2>Built on Passion,<br />Driven by You.</h2>
            <motion.blockquote initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7 }}>
              "I started Rohans Matching Centre because I wanted every woman in Hyderabad to have access to beautiful, quality fashion — without having to travel far or spend a fortune. A matching centre is not just a shop; it is a place where your vision comes to life. You bring your dream, we make it real."
            </motion.blockquote>
            <motion.blockquote initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.7 }}>
              "Over the years, watching our customers walk out with confidence — in a saree we helped them pick, a blouse we stitched, a look we put together — that is what drives us every single day. This is not just our business. It is our passion."
            </motion.blockquote>
            <motion.p className="about-founder-sig"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
              — Rohan, Founder
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Showrooms ── */}
      <section className="about-section about-branches-section">
        <motion.span className="about-section-tag centered" {...fadeUp(0)}>Visit Us</motion.span>
        <motion.h2 className="about-section-heading" {...fadeUp(0.1)}>Our Showrooms</motion.h2>
        <motion.p className="about-section-sub" {...fadeUp(0.2)}>Three locations across Hyderabad — always close to you.</motion.p>
        <div className="about-branches-grid">
          {BRANCHES.map((b, i) => (
            <motion.a key={i} href={b.url} target="_blank" rel="noopener noreferrer" className="about-branch-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(233,30,140,0.12)', borderColor: '#e91e8c' }}>
              <div className="about-branch-num">0{i + 1}</div>
              <div className="about-branch-info">
                <h3>{b.name}</h3>
                <p><MdLocationOn /> {b.address}</p>
              </div>
              <MdOpenInNew className="about-branch-ext" />
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── Contact Strip ── */}
      <motion.section className="about-contact-strip"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <div className="about-contact-inner">

          <div className="about-contact-heading">
            <span>Get in Touch</span>
            <h2>We'd Love to Hear From You</h2>
          </div>

          <div className="about-contact-cards">
            {/* WhatsApp */}
            <motion.a href="https://wa.me/918897030909" target="_blank" rel="noopener noreferrer"
              className="about-contact-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0, duration: 0.6 }}
              whileHover={{ y: -6 }}>
              <motion.div className="about-contact-icon-wrap" whileHover={{ rotate: 10, scale: 1.15 }}>
                <MdPhone />
              </motion.div>
              <div className="about-contact-card-body">
                <span className="about-contact-card-label">Call / WhatsApp</span>
                <span className="about-contact-card-value">+91 88970 30909</span>
                <span className="about-contact-card-hint">Tap to open WhatsApp</span>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a href="mailto:thehouseoframya@gmail.com"
              className="about-contact-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12, duration: 0.6 }}
              whileHover={{ y: -6 }}>
              <motion.div className="about-contact-icon-wrap" whileHover={{ rotate: -10, scale: 1.15 }}>
                <MdEmail />
              </motion.div>
              <div className="about-contact-card-body">
                <span className="about-contact-card-label">Email Us</span>
                <span className="about-contact-card-value">thehouseoframya@gmail.com</span>
                <span className="about-contact-card-hint">We reply within 24 hours</span>
              </div>
            </motion.a>

            {/* Social */}
            <motion.div className="about-contact-card"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.24, duration: 0.6 }}>
              <motion.div className="about-contact-icon-wrap" whileHover={{ rotate: 10, scale: 1.15 }}>
                <FaInstagram />
              </motion.div>
              <div className="about-contact-card-body">
                <span className="about-contact-card-label">Follow Us</span>
                <span className="about-contact-card-value">@rohansmatchingcentre</span>
                <span className="about-contact-card-hint">Stay updated on new arrivals</span>
              </div>
            </motion.div>
          </div>

          {/* Social Icons Row */}
          <div className="about-contact-social">
            <span className="about-contact-social-label">Connect with us on social media</span>
            <div className="about-social-links">
              {[
                { icon: <FaInstagram />, href: 'https://instagram.com', label: 'Instagram' },
                { icon: <FaFacebookF />, href: 'https://facebook.com', label: 'Facebook' },
                { icon: <FaYoutube />,   href: 'https://youtube.com',   label: 'YouTube' },
              ].map((s, i) => (
                <motion.a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 200 }}>
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </motion.section>

    </div>
  );
};

export default About;
