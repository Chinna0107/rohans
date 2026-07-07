import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdStar, MdVerified, MdLocalShipping, MdPayment, MdPhone, MdOutlineAssignmentReturn } from 'react-icons/md';
import { FaHeart, FaRegHeart, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import CountUp from 'react-countup';
import useProducts from '../hooks/useProducts';
import { useUserAuth } from '../context/UserAuthContext';
import { toast } from 'react-toastify';
import './Home.css';

const CATEGORIES = [
  { name: "KURTIES", img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop', link: 'KURTIES' },
  { name: "SAREES", img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop', link: 'SAREES' },
  { name: "DRESS MATERIALS", img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop', link: 'DRESS MATERIALS' },
  { name: "CUSTOM STITCHING", img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc89EVoxCnoFRZYB97giFTjIQEtRRfVSyXjMPt1w4YSA&s=10', link: 'CUSTOM STITCHING' },
  { name: "MAGGAM WORK", img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsQGk5k3Oy4-uWWk1AEr_BXAlPvGlLaolJ6v2NIbCcSg&s=10', link: 'MAGGAM WORK' },
];

const ProductCard = ({ product, addToCart, navigate }) => {
  const { customer, toggleWishlist } = useUserAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  const pid = product.id || product._id;
  const imgUrl = product.images?.[0] || product.image;
  const currentPrice = product.prices?.[product.grams?.[0] || product.grams] || product.price || 0;
  const origPrice = product.originalPrices?.[product.grams?.[0] || product.grams] || currentPrice * 1.5;
  
  const calcDisc = (o, c) => Math.round(((o - c) / o) * 100);
  const disc = origPrice > currentPrice ? calcDisc(origPrice, currentPrice) : null;
  const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const isWishlisted = customer?.wishlist?.some(item => String(item.id) === String(pid));

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!customer) {
      toast.info('Please log in to save to your wishlist.');
      return;
    }
    const res = await toggleWishlist(product);
    if (res.success) {
      toast.success(res.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    } else {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div 
      className="luxury-product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/products/${slug}-${pid}`)}
    >
      <div className="card-image-wrap">
        <div className="card-badges">
          {product.tag && <span className="badge new-badge">{product.tag}</span>}
          {disc && <span className="badge sale-badge">{disc}% OFF</span>}
        </div>
        
        <button className="wishlist-btn" onClick={handleWishlistClick}>
          {isWishlisted ? <FaHeart color="#FF4747" /> : <FaRegHeart />}
        </button>

        <img src={imgUrl} alt={product.name} />
        
        <div className={`quick-add-overlay ${isHovered ? 'visible' : ''}`}>
          <button className="quick-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(pid, product.grams?.[0] || product.grams); }}>
            Quick Add
          </button>
        </div>
      </div>

      <div className="card-content">
        <span className="brand-label">HOUSE OF RAMYA</span>
        <h3 className="product-title">{product.name}</h3>
        
        <div className="rating-row">
          <div className="stars">
            {[...Array(5)].map((_, i) => <MdStar key={i} />)}
          </div>
          <span className="review-count">(12)</span>
        </div>

        <div className="price-row">
          <span className="current-price">₹{currentPrice}</span>
          {origPrice > currentPrice && <span className="original-price">₹{Math.round(origPrice)}</span>}
          {disc && <span className="discount-text">({disc}% OFF)</span>}
        </div>
        
        <div className="color-swatches">
          <span className="swatch" style={{ background: '#000000' }}></span>
          <span className="swatch" style={{ background: '#f5f5dc' }}></span>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/api/sliders`);
        if (res.data.success) {
          setSliders(res.data.sliders);
        }
      } catch (err) {
        console.error("Failed to fetch sliders", err);
      }
    };
    fetchSliders();
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

  const newArrivals = products.filter(p => p.styleTags?.includes('new')).slice(0, 4);
  const bestSellers = products.filter(p => p.styleTags?.includes('bestseller')).slice(0, 4);
  const trending = products.filter(p => p.styleTags?.includes('trending')).slice(0, 4);
  
  // Fallbacks if no products are tagged yet, to keep the layout looking good
  const displayNew = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);
  const displayBest = bestSellers.length > 0 ? bestSellers : products.slice(4, 8);
  const displayTrending = trending.length > 0 ? trending : products.slice(8, 12);
  const displayFestive = products.filter(p => p.festiveSeason).slice(0, 4);

  return (
    <div className="luxury-home">
      
      {/* Hero Section */}
      {sliders.length > 0 ? (
        <section className="luxury-slider-hero">
          <Slider {...sliderSettings}>
            {sliders.map((slider) => (
              <div key={slider.id} className="hero-slide">
                <picture>
                  <source media="(max-width: 768px)" srcSet={slider.mobile || slider.imageUrl} />
                  <img src={slider.desktop || slider.imageUrl} alt={slider.title || 'Banner'} className="hero-slide-bg" />
                </picture>
                <div className="hero-slide-overlay"></div>
                <div className="hero-content compact-hero">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {slider.heading || slider.title || 'Exclusive Collection'}
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {slider.desc || slider.description || 'Discover our premium range of elegant styles tailored just for you.'}
                  </motion.p>
                  <motion.button 
                    className="luxury-btn solid-maroon-btn small-btn" 
                    onClick={() => navigate(slider.productSlug ? `/products/${slider.productSlug}` : '/products')}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Shop Now
                  </motion.button>
                </div>
              </div>
            ))}
          </Slider>
        </section>
      ) : (
        <section className="luxury-slider-hero">
          <div className="hero-slide fallback-slide">
            <picture>
              <source media="(max-width: 768px)" srcSet="/images/house-of-ramya-banner-mobile.png" />
              <img src="/images/house-of-ramya-banner.png" alt="House of Ramya Banner" className="hero-slide-bg" />
            </picture>
          </div>
        </section>
      )}

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
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="cat-item-circle" onClick={() => navigate('/products', { state: { category: cat.link } })}>
              <div className="cat-img-wrapper">
                <img src={cat.img} alt={cat.name} />
              </div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </motion.section>

      {/* New Arrivals */}
      <motion.section 
        className="luxury-section" style={{ background: 'var(--bg-off)' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">New Arrivals</h2>
        <div className="product-grid-4">
          {displayNew.map(product => (
            <ProductCard key={product.id || product._id} product={product} addToCart={addToCart} navigate={navigate} />
          ))}
        </div>
      </motion.section>

      {/* Best Sellers */}
      <motion.section 
        className="luxury-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">Best Sellers</h2>
        <div className="product-grid-4">
          {displayBest.map(product => (
            <ProductCard key={product.id || product._id} product={product} addToCart={addToCart} navigate={navigate} />
          ))}
        </div>
      </motion.section>

      {/* Trending Products */}
      <motion.section 
        className="luxury-section" style={{ background: 'var(--bg-off)' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">Trending Products</h2>
        <div className="product-grid-4">
          {displayTrending.map(product => (
            <ProductCard key={product.id || product._id} product={product} addToCart={addToCart} navigate={navigate} />
          ))}
        </div>
      </motion.section>
      
      {/* Festival Collection */}
      <motion.section 
        className="luxury-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-heading">Festive Season Collection</h2>
        {displayFestive.length > 0 ? (
          <div className="product-grid-4">
            {displayFestive.map(product => (
              <ProductCard key={product.id || product._id} product={product} addToCart={addToCart} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="festival-banner" onClick={() => navigate('/products')}>
            <div className="festival-content">
              <h2>The Festival Collection</h2>
              <p>Celebrate in style with our curated festive edit.</p>
              <button className="luxury-btn">Shop Collection</button>
            </div>
          </div>
        )}
      </motion.section>

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
              { name: 'Rahul M.', text: '"House of Ramya has the best sandals! Super comfortable and stylish."' },
              { name: 'Priya S.', text: '"Ordered tshirts and track pants — amazing quality and fast delivery."' },
              { name: 'Arjun K.', text: '"Best shoes at this price range. Will definitely order again!"' },
              { name: 'Rahul M.', text: '"House of Ramya has the best sandals! Super comfortable and stylish."' },
              { name: 'Priya S.', text: '"Ordered tshirts and track pants — amazing quality and fast delivery."' },
              { name: 'Arjun K.', text: '"Best shoes at this price range. Will definitely order again!"' },
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
        <div className="insta-grid-4">
          {[
            { id: 1, url: 'https://www.instagram.com/reel/placeholder1/' },
            { id: 2, url: 'https://www.instagram.com/reel/placeholder2/' },
            { id: 3, url: 'https://www.instagram.com/reel/placeholder3/' },
            { id: 4, url: 'https://www.instagram.com/reel/placeholder4/' }
          ].map(item => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="insta-luxury-item">
              <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop&sig=${item.id}`} alt="Instagram reel" />
              <div className="insta-overlay-luxury"><FaInstagram /></div>
            </a>
          ))}
        </div>
      </motion.section>

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
