const fs = require('fs');
const path = require('path');

const homeJsxPath = path.join(__dirname, 'src', 'pages', 'Home.jsx');
const homeCssPath = path.join(__dirname, 'src', 'pages', 'Home.css');

const homeJsxContent = `
import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MdStar, MdVerified, MdLocalShipping, MdPayment, MdPhone } from 'react-icons/md';
import { FaHeart, FaRegHeart, FaInstagram } from 'react-icons/fa';
import { BiSupport } from 'react-icons/bi';
import { GiSewingMachine } from 'react-icons/gi';
import { TbNeedleThread } from 'react-icons/tb';
import { IoColorPaletteOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import useProducts from '../hooks/useProducts';
import { useUserAuth } from '../context/UserAuthContext';
import { toast } from 'react-toastify';
import './Home.css';

const CATEGORIES = [
  { name: "KURTIES", img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop', link: 'KURTIES' },
  { name: "SAREES", img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop', link: 'SAREES' },
  { name: "DRESS MATERIALS", img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop', link: 'DRESS MATERIALS' },
  { name: "CUSTOM STITCHING", img: 'https://images.unsplash.com/photo-1629731671295-e5fcdeff3c70?q=80&w=600&auto=format&fit=crop', link: 'CUSTOM STITCHING' },
  { name: "MAGGAM WORK", img: 'https://images.unsplash.com/photo-1588629532822-7772fa825420?q=80&w=600&auto=format&fit=crop', link: 'MAGGAM WORK' },
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
      onClick={() => navigate(\`/products/\${slug}-\${pid}\`)}
    >
      <div className="card-image-wrap">
        <div className="card-badges">
          {product.tag && <span className="badge new-badge">{product.tag}</span>}
          {disc && <span className="badge sale-badge">{disc}% OFF</span>}
        </div>
        <button className="wishlist-btn" onClick={handleWishlistClick}>
          {isWishlisted ? <FaHeart color="#7A2230" /> : <FaRegHeart />}
        </button>
        <img src={imgUrl} alt={product.name} />
        <div className={\`quick-add-overlay \${isHovered ? 'visible' : ''}\`}>
          <button className="quick-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(pid, product.grams?.[0] || product.grams); }}>
            Quick Add
          </button>
        </div>
      </div>
      <div className="card-content">
        <span className="brand-label">HOUSE OF RAMYA</span>
        <h3 className="product-title">{product.name}</h3>
        <div className="rating-row">
          <div className="stars">{[...Array(5)].map((_, i) => <MdStar key={i} />)}</div>
          <span className="review-count">(12)</span>
        </div>
        <div className="price-row">
          <span className="current-price">₹{currentPrice}</span>
          {origPrice > currentPrice && <span className="original-price">₹{Math.round(origPrice)}</span>}
          {disc && <span className="discount-text">({disc}% OFF)</span>}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const displayBest = products.slice(0, 4);

  return (
    <div className="luxury-home">
      
      {/* Hero Banner Section */}
      <section className="hero-banner-section">
        <div className="hero-banner-card">
          <div className="hero-banner-content">
            <span className="hero-subtitle">NEW ARRIVALS</span>
            <h1 className="hero-title">FESTIVE KURTI<br/><span className="hero-title-cursive">Collection</span></h1>
            <p className="hero-desc">Elegant styles.<br/>Timeless you.</p>
            <div className="hero-buttons">
              <button className="luxury-btn primary-btn" onClick={() => navigate('/products', { state: { category: 'KURTIES' } })}>SHOP KURTIES <span className="arrow">&gt;</span></button>
              <button className="luxury-btn secondary-btn" onClick={() => navigate('/products', { state: { category: 'SAREES' } })}>SHOP SAREES <span className="arrow">&gt;</span></button>
            </div>
          </div>
          <div className="hero-banner-image">
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop" alt="Festive Kurti" />
            <div className="premium-badge">
              <span className="star">✧</span>
              <span>PREMIUM<br/>QUALITY<br/>FABRICS</span>
              <span className="star">✧</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="home-section">
        <div className="section-title-wrapper">
          <span className="leaf-ornament left"></span>
          <h2 className="section-title">SHOP BY CATEGORY</h2>
          <span className="leaf-ornament right"></span>
        </div>
        <div className="category-scroll-container">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="cat-circle-item" onClick={() => navigate('/products', { state: { category: cat.link } })}>
              <div className="cat-img-border">
                <img src={cat.img} alt={cat.name} />
              </div>
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="home-section">
        <div className="features-grid">
          <div className="feature-item">
            <IoColorPaletteOutline className="feature-icon" />
            <span>PREMIUM<br/>FABRICS</span>
          </div>
          <div className="feature-item">
            <TbNeedleThread className="feature-icon" />
            <span>CUSTOM<br/>STITCHING</span>
          </div>
          <div className="feature-item">
            <FaHeart className="feature-icon" />
            <span>HANDCRAFTED<br/>DESIGNS</span>
          </div>
          <div className="feature-item">
            <BiSupport className="feature-icon" />
            <span>PERSONALIZED<br/>SUPPORT</span>
          </div>
        </div>
      </section>

      {/* Our Collections */}
      <section className="home-section">
        <div className="section-title-wrapper">
          <span className="leaf-ornament left"></span>
          <h2 className="section-title">OUR COLLECTIONS</h2>
          <span className="leaf-ornament right"></span>
        </div>
        <div className="collections-grid">
          <div className="collection-card" onClick={() => navigate('/products', { state: { category: 'KURTIES' } })}>
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop" alt="Festive Kurties" />
            <div className="collection-content">
              <h3>FESTIVE<br/>KURTIES</h3>
              <button className="explore-btn">EXPLORE NOW</button>
            </div>
          </div>
          <div className="collection-card" onClick={() => navigate('/products', { state: { category: 'SAREES' } })}>
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop" alt="Designer Sarees" />
            <div className="collection-content">
              <h3>DESIGNER<br/>SAREES</h3>
              <button className="explore-btn">EXPLORE NOW</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-section" style={{ marginTop: '2rem' }}>
         <div className="section-title-wrapper">
          <span className="leaf-ornament left"></span>
          <h2 className="section-title">FEATURED PRODUCTS</h2>
          <span className="leaf-ornament right"></span>
        </div>
        <div className="product-grid-4">
          {displayBest.map(product => (
            <ProductCard key={product.id || product._id} product={product} addToCart={addToCart} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* Instagram Follow */}
      <section className="home-section instagram-section">
        <div className="insta-header">
          <div className="insta-title-row">
            <FaInstagram className="insta-icon" />
            <h2>FOLLOW US @HOUSE.OF.RAMYA</h2>
          </div>
          <p>Stay inspired with our latest styles & updates</p>
        </div>
        <div className="insta-images">
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop" alt="Insta 1" />
          <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop" alt="Insta 2" />
          <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400&auto=format&fit=crop" alt="Insta 3" />
          <img src="https://images.unsplash.com/photo-1588629532822-7772fa825420?q=80&w=400&auto=format&fit=crop" alt="Insta 4" />
        </div>
      </section>

    </div>
  );
};

export default Home;
`;

const homeCssContent = `
/* ----------------------------------------------------
   New Luxury Home CSS
---------------------------------------------------- */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

.luxury-home {
  width: 100%;
  padding-bottom: 2rem;
  background: var(--bg);
}

.home-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Section Titles */
.section-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: 2px;
  margin: 0;
}

.leaf-ornament {
  width: 30px;
  height: 15px;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10C15 5 10 5 5 10C10 15 15 15 20 10Z' stroke='%23C8A165' stroke-width='1.5'/%3E%3Cpath d='M20 10C25 5 30 5 35 10C30 15 25 15 20 10Z' stroke='%23C8A165' stroke-width='1.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.leaf-ornament.left { transform: scaleX(-1); }

/* Buttons */
.luxury-btn {
  padding: 0.8rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn {
  background: var(--primary);
  color: #fff;
  border: 1px solid var(--primary);
}

.secondary-btn {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.primary-btn:hover { background: var(--primary-hover); }
.secondary-btn:hover { background: rgba(122, 34, 48, 0.05); }

/* Hero Banner */
.hero-banner-section {
  padding: 1rem 1rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-banner-card {
  background: var(--accent-light);
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  position: relative;
  min-height: 400px;
}

.hero-banner-content {
  flex: 1;
  padding: 3rem 2rem 3rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-subtitle {
  font-size: 0.75rem;
  letter-spacing: 2px;
  color: var(--text-dark);
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  line-height: 1.1;
  color: var(--primary);
  margin-bottom: 1rem;
}

.hero-title-cursive {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 3rem;
}

.hero-desc {
  color: var(--text-dark);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: max-content;
}

.hero-banner-image {
  flex: 1.2;
  position: relative;
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
}

.hero-banner-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.premium-badge {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: var(--primary-hover);
  color: var(--accent);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.65rem;
  letter-spacing: 1px;
  border: 1px dashed var(--accent);
  padding: 0.5rem;
}

/* Category Circles */
.category-scroll-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: none;
}
.category-scroll-container::-webkit-scrollbar { display: none; }

.cat-circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  min-width: 90px;
}

.cat-img-border {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  padding: 4px;
  background: transparent;
  border: 1px solid var(--accent);
  transition: transform 0.3s ease;
}

.cat-img-border img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.cat-circle-item h3 {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 1px;
}
.cat-circle-item:hover .cat-img-border {
  transform: scale(1.05);
  background: var(--accent-light);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem 0;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.8rem;
  position: relative;
}

.feature-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 10%;
  height: 80%;
  width: 1px;
  background: var(--border-subtle);
}

.feature-icon {
  font-size: 2rem;
  color: var(--accent);
}

.feature-item span {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Collections Grid */
.collections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.collection-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;
}

.collection-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.collection-card:hover img {
  transform: scale(1.05);
}

.collection-content {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
}

.collection-content h3 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.explore-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 0.75rem;
  letter-spacing: 1px;
  border-radius: 4px;
  width: max-content;
  cursor: pointer;
  transition: background 0.3s;
}
.explore-btn:hover { background: var(--primary-hover); }

/* Instagram Section */
.instagram-section {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.insta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.insta-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.insta-icon {
  font-size: 1.5rem;
  color: var(--text-dark);
}

.insta-title-row h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.insta-header p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.insta-images {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.insta-images img {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 4px;
}

/* Product Card adjustments */
.product-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.luxury-product-card {
  cursor: pointer;
}
.card-image-wrap {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  background: #f5f5f5;
}
.card-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.card-content .brand-label { font-size: 0.65rem; color: var(--text-muted); display: block; margin-bottom: 2px;}
.card-content .product-title { font-size: 0.95rem; margin-bottom: 2px; }
.card-content .price-row { display: flex; gap: 0.5rem; font-size: 0.95rem; font-weight: 600; }
.original-price { text-decoration: line-through; color: var(--text-muted); font-weight: 400;}
.current-price { color: var(--text-dark); }
.discount-text { color: #d32f2f; }

/* Responsive */
@media (max-width: 1024px) {
  .product-grid-4 { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .hero-banner-card { flex-direction: column; }
  .hero-banner-image { clip-path: none; height: 300px; }
  .hero-banner-content { padding: 2rem; }
  .premium-badge { bottom: 1rem; right: 1rem; width: 80px; height: 80px; font-size: 0.55rem; }
  .features-grid { grid-template-columns: 1fr 1fr; row-gap: 1.5rem; padding: 1.5rem; }
  .feature-item:nth-child(2)::after { display: none; }
  .collections-grid { grid-template-columns: 1fr; }
  .product-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 0.8rem;}
  .insta-images { grid-template-columns: repeat(2, 1fr); }
  .insta-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
}
`

fs.writeFileSync(homeJsxPath, homeJsxContent);
fs.writeFileSync(homeCssPath, homeCssContent);

console.log("Successfully updated Home.jsx and Home.css");
