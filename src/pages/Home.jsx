import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { MdStar, MdVerified, MdLocalShipping, MdPayment, MdPhone, MdOutlineAssignmentReturn } from 'react-icons/md';
import { FaHeart, FaRegHeart, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import useProducts from '../hooks/useProducts';
import { useUserAuth } from '../context/UserAuthContext';
import { toast } from 'react-toastify';
import './Home.css';

import video1 from '../videos/video1.MP4';
import video2 from '../videos/video2.MP4';
import video3 from '../videos/video3.MP4';
import video4 from '../videos/video4.MP4';
import video5 from '../videos/video5.MP4';

const COLLECTION_BANNERS = [
  {
    label: 'New Arrivals',
    sub: 'Fresh styles, just landed',
    path: '/new-arrivals',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
  },
  {
    label: 'Best Sellers',
    sub: 'Our most loved pieces',
    path: '/best-sellers',
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
  },
  {
    label: 'Trending Now',
    sub: 'What everyone is wearing',
    path: '/trending',
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=900&auto=format&fit=crop',
  },
];



const FestiveCard = ({ product, navigate }) => {
  const { customer, toggleWishlist } = useUserAuth();
  const pid = product.id || product._id;
  const images = product.images || [];
  const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
  const currentPrice = product.prices?.[defaultWeight] || product.price || 0;
  const origPrice = product.originalPrices?.[defaultWeight];
  const disc = origPrice && Number(origPrice) > Number(currentPrice)
    ? Math.round(((Number(origPrice) - Number(currentPrice)) / Number(origPrice)) * 100)
    : null;
  const isWishlisted = customer?.wishlist?.some(item => String(item.id) === String(pid));
  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!customer) { toast.info('Please log in to save to your wishlist.'); return; }
    const res = await toggleWishlist(product);
    toast[res.success ? 'success' : 'error'](res.success ? (res.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist') : 'Failed to update wishlist');
  };

  return (
    <div className="festive-product-card" onClick={() => navigate(`/products/${slug}-${pid}`)}>
      <div className="festive-card-img">
        {disc && <span className="festive-disc-badge">-{disc}%</span>}
        <button className="festive-wishlist-btn" onClick={handleWishlist}>
          {isWishlisted ? <FaHeart color="#e91e8c" /> : <FaRegHeart color="#999" />}
        </button>
        <img src={images[0]} alt={product.name} onError={e => { e.target.style.display = 'none'; }} />
      </div>
      <div className="festive-card-info">
        <span className="festive-card-cat">{product.category}</span>
        <h4 className="festive-card-name">{product.name}</h4>
        <div className="festive-card-price">
          {origPrice && Number(origPrice) > Number(currentPrice) && <span className="festive-orig">₹{origPrice}</span>}
          <span className="festive-price">₹{currentPrice}</span>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { user } = useUserAuth();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchSlidersAndCategories = async () => {
      try {
        const [slidersRes, categoriesRes] = await Promise.all([
          axios.get(`${config.API_URL}/api/sliders`),
          axios.get(`${config.API_URL}/api/categories`)
        ]);
        if (slidersRes.data.success) {
          setSliders(slidersRes.data.sliders);
        }
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchSlidersAndCategories();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    pauseOnHover: false
  };

  return (
    <div className="luxury-home">
      
      {/* Hero Section - Rohan's Matching Centre Banner */}
      <section className="rmc-hero-section">
        <div className="rmc-hero-inner">
          <img
            src="/images/rohans-matching-centre-banner.png"
            alt="Rohan's Matching Centre - Sarees, Blouses, Men's Collection"
            className="rmc-hero-img"
          />
          <div className="rmc-hero-overlay">
            <motion.div
              className="rmc-hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                className="rmc-hero-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                ✦ Your One-Stop Fashion Destination ✦
              </motion.p>
              <motion.h1
                className="rmc-hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                ROHAN'S MATCHING CENTRE
              </motion.h1>
              <motion.div
                className="rmc-category-chips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {['Sarees', 'Blouses', "Men's Wear", 'Dress Materials', 'Kurties', 'Custom Stitching'].map(cat => (
                  <span key={cat} className="rmc-chip" onClick={() => navigate('/products', { state: { category: cat.toUpperCase() } })}>{cat}</span>
                ))}
              </motion.div>
              <motion.div
                className="rmc-hero-cta-row"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <button className="rmc-btn-primary" onClick={() => navigate('/products')}>
                  Shop Now
                </button>
                <button className="rmc-btn-outline" onClick={() => navigate('/products', { state: { category: 'SAREES' } })}>
                  Explore Sarees
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Marquee Strip */}
      <div className="mobile-marquee-strip">
        <div className="mobile-marquee-track">
          {['Free Shipping ₹499+', 'New Arrivals', 'Premium Quality', 'Best Sellers', '7-Day Returns', 'Trending Now', 'Free Shipping ₹499+', 'New Arrivals', 'Premium Quality', 'Best Sellers', '7-Day Returns', 'Trending Now'].map((t, i) => (
            <span key={i}>{t} <span className="marquee-dot">✦</span></span>
          ))}
        </div>
      </div>

      {/* Weave of the Month */}
      <motion.section
        className="weave-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="weave-label">Weave of the Month</div>
        <h2 className="weave-title">The Royal Mangalgiri Pattu</h2>

        <div className="weave-images">
          <motion.div
            className="weave-img-card"
            whileHover={{ scale: 1.04, y: -8, boxShadow: '0 24px 60px rgba(106,44,58,0.18)' }}
            transition={{ duration: 0.35 }}
          >
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop"
              alt="Golden Saree Weave"
            />
            <div className="weave-img-label">Golden Saree Weave</div>
          </motion.div>

          <motion.div
            className="weave-img-card"
            whileHover={{ scale: 1.04, y: -8, boxShadow: '0 24px 60px rgba(106,44,58,0.18)' }}
            transition={{ duration: 0.35 }}
          >
            <img
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
              alt="Colorful Saree Weave"
            />
            <div className="weave-img-label">Colorful Saree Weave</div>
          </motion.div>
        </div>

        <div className="weave-content">
          <h3 className="weave-sub">Tradition in Every Weave: the Mangalagiri Pattu Legacy</h3>
          <p className="weave-desc">
            Celebrated for Its Timeless Elegance, Our Featured Mangalagiri Pattu Is Handwoven By Skilled Artisans
            Using the Finest Cotton and Silk Yarns, Adorned with Its Signature Zari Borders and Distinctive
            Nizam-inspired Craftsmanship. Every Saree Is A Testament to Generations of Weaving Heritage, Taking
            Days of Meticulous Handcrafting to Bring Its Understated Beauty to Life.
          </p>
          <motion.button
            className="luxury-btn solid-maroon-btn weave-btn"
            onClick={() => navigate('/products', { state: { category: 'SAREES' } })}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Shop Featured Sarees
          </motion.button>
        </div>
      </motion.section>

      {/* Category Grid */}
      <motion.section 
        className="luxury-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">Shop by Category</h2>
        <div className="category-row-scroll">
          {categories.map(cat => (
            <div key={cat.id || cat.name} className="cat-item-circle" onClick={() => navigate('/products', { state: { category: cat.name } })}>
              <div className="cat-img-wrapper">
                <img src={cat.image_url || 'https://via.placeholder.com/600x600?text=' + encodeURIComponent(cat.name)} alt={cat.name} />
              </div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Collections Banner Row */}
      <motion.section
        className="luxury-section collections-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">Our Collections</h2>
        <div className="collection-banners-row">
          {COLLECTION_BANNERS.map((banner, i) => (
            <motion.div
              key={banner.path}
              className="collection-banner-card"
              onClick={() => navigate(banner.path)}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <img src={banner.img} alt={banner.label} />
              <div className="collection-banner-overlay">
                <span className="collection-banner-sub">{banner.sub}</span>
                <h3 className="collection-banner-title">{banner.label}</h3>
                <span className="collection-banner-cta">Shop Now →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
      
      {/* Festival Collection */}
      {(() => {
        const festive = products.filter(p => p.festiveSeason);
        const display = festive.length > 0 ? festive : products.slice(0, 8);
        return display.length > 0 ? (
          <motion.section
            className="luxury-section festive-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="festive-header">
              <span className="festive-label">✦ Limited Edition</span>
              <h2 className="section-heading" style={{ marginBottom: 0 }}>Festive Collection</h2>
              <p className="festive-sub">Celebrate in style with our curated festive edit</p>
            </div>
            <div className="festive-products-grid">
              {display.slice(0, 8).map(p => (
                <FestiveCard key={p.id || p._id} product={p} navigate={navigate} />
              ))}
            </div>
            <div className="festive-footer-cta">
              <button className="luxury-btn solid-maroon-btn" onClick={() => navigate('/products')}>View All</button>
            </div>
          </motion.section>
        ) : null;
      })()}

      {/* Customer Reviews */}
      <motion.section 
        className="luxury-section" style={{ background: 'var(--bg-off)' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">Customer Reviews</h2>
        <div className="marquee-wrapper">
          <div className="testimonials-marquee">
            {[
              { name: 'Anjali R.', text: 'The Maggam work on my blouse was incredibly detailed and perfect. Truly exquisite craftsmanship!' },
              { name: 'Priya S.', text: 'I ordered a premium saree for a wedding, and the fabric quality is simply outstanding.' },
              { name: 'Divya K.', text: 'The custom stitching for my kurti fit flawlessly. ROHANS MATCHING CENTRE never disappoints!' },
              { name: 'Anjali R.', text: 'The Maggam work on my blouse was incredibly detailed and perfect. Truly exquisite craftsmanship!' },
              { name: 'Priya S.', text: 'I ordered a premium saree for a wedding, and the fabric quality is simply outstanding.' },
              { name: 'Divya K.', text: 'The custom stitching for my kurti fit flawlessly. ROHANS MATCHING CENTRE never disappoints!' },
            ].map((t, i) => (
              <div key={i} className="luxury-review-card">
                <div className="stars">{[...Array(5)].map((_, j) => <MdStar key={j} />)}</div>
                <p>"{t.text}"</p>
                <h4>{t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Instagram Feed */}
      <motion.section 
        className="luxury-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading"><FaInstagram style={{ marginRight: '0.5rem', transform: 'translateY(2px)' }} /> Instagram Feed</h2>
        <div className="insta-grid-5">
          {[
            { id: 1, url: '#', src: video1 },
            { id: 2, url: '#', src: video2 },
            { id: 3, url: '#', src: video3 },
            { id: 4, url: '#', src: video4 },
            { id: 5, url: '#', src: video5 }
          ].map(item => (
            <div 
              key={item.id} 
              className="insta-luxury-item"
              onClick={() => setSelectedVideo(item.src)}
            >
              <video 
                src={item.src} 
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="insta-overlay-luxury"><FaInstagram /></div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="video-modal-overlay" 
          onClick={() => setSelectedVideo(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
        >
          <div 
            className="video-modal-content" 
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '90%', maxWidth: '500px', borderRadius: '10px', overflow: 'hidden' }}
          >
            <button 
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'absolute', top: '10px', right: '10px', 
                background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', 
                borderRadius: '50%', width: '30px', height: '30px', 
                cursor: 'pointer', zIndex: 10
              }}
            >
              ✕
            </button>
            <video 
              src={selectedVideo} 
              autoPlay 
              controls
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="luxury-section stats-section">
        <div className="stats-grid">
          <motion.div className="stat-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="stat-number"><CountUp end={10000} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />+</h3>
            <p className="stat-label">Happy Customers</p>
          </motion.div>
          <motion.div className="stat-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="stat-number"><CountUp end={500} duration={2.5} separator="," enableScrollSpy scrollSpyOnce />+</h3>
            <p className="stat-label">Premium Products</p>
          </motion.div>
          <motion.div className="stat-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <h3 className="stat-number"><CountUp end={4.9} decimals={1} duration={2.5} enableScrollSpy scrollSpyOnce />/5</h3>
            <p className="stat-label">Average Rating</p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="luxury-section" style={{ background: 'var(--bg-off)' }}>
        <h2 className="section-heading">Why Choose Us</h2>
        <div className="features-grid-4">
          {[
            { icon: <MdVerified />, title: 'Premium Quality' },
            { icon: <MdLocalShipping />, title: 'Fast Delivery' },
            { icon: <MdPayment />, title: 'Secure Payments' },
            { icon: <MdPhone />, title: '24/7 Support' },
          ].map((f, i) => (
            <motion.div 
              key={i} 
              className="luxury-feature-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10, scale: 1.05, boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <motion.div className="feature-icon" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>{f.icon}</motion.div>
              <h3>{f.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shipping/Return Highlights */}
      <section className="luxury-highlights">
        <div className="highlight-item">
          <MdLocalShipping className="highlight-icon" />
          <span>Free Shipping above ₹499</span>
        </div>
        <div className="highlight-item">
          <MdOutlineAssignmentReturn className="highlight-icon" />
          <span>7 Days Easy Returns</span>
        </div>
        <div className="highlight-item">
          <MdVerified className="highlight-icon" />
          <span>100% Authentic</span>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
