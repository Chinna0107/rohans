import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  MdStar, MdStarHalf, MdLocalShipping, MdVerified,
  MdArrowBack, MdShare, MdFavorite, MdFavoriteBorder,
  MdZoomIn, MdCheckCircle, MdSwapHoriz
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import useProducts from '../hooks/useProducts';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';
import { useUserAuth } from '../context/UserAuthContext';
import sizeGuideImg from '../assets/Sizes.jpeg';
import './ProductDetail.css';

const TAG_LABELS = {
  bestseller: '🔥 Best Seller', popular: '⭐ Popular',
  new: '🆕 New Arrival', offer: '💰 Offer',
  trending: '📈 Trending', limited: '⏳ Limited Edition',
};

const toSlug = (name, id) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id}`;

const calcDiscount = (orig, sale) => {
  const o = Number(orig), s = Number(sale);
  if (!o || !s || o <= s) return null;
  return Math.round(((o - s) / o) * 100);
};

const APPAREL_ORDER = ['S', 'M', 'L', 'XL', 'XXL'];
const APPAREL_ORDER_MAP = new Map(APPAREL_ORDER.map((s, i) => [s, i]));
const SHOES_CATEGORIES = new Set(['Shoes', 'Sandals', 'Flip Flops', 'Slides']);
const APPAREL_CATEGORIES = new Set(['T-Shirts', 'T Shirts', 'Tshirts', 'Track Pants']);

const normalizeApparelSize = (size) => {
  if (size == null) return '';
  const s = String(size).trim().toUpperCase().replace(/\s+/g, '');
  if (s === 'XS' || s === 'XSMALL') return 'S';
  if (s === 'XXS') return 'S';
  if (s === 'XXXL' || s === '3XL') return 'XXL';
  if (s === '2XL') return 'XXL';
  if (s === 'X-L' || s === 'X L') return 'XL';
  return s;
};

const numericSizeValue = (size) => {
  const m = String(size).match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : NaN;
};

const sortSizesByCategory = (category, sizes) => {
  if (!Array.isArray(sizes)) return [];
  if (SHOES_CATEGORIES.has(category)) {
    return [...sizes].sort((a, b) => {
      const na = numericSizeValue(a);
      const nb = numericSizeValue(b);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      if (Number.isFinite(na)) return -1;
      if (Number.isFinite(nb)) return 1;
      return String(a).localeCompare(String(b));
    });
  }
  if (APPAREL_CATEGORIES.has(category)) {
    return [...sizes].sort((a, b) => {
      const na = normalizeApparelSize(a);
      const nb = normalizeApparelSize(b);
      const ia = APPAREL_ORDER_MAP.has(na) ? APPAREL_ORDER_MAP.get(na) : 999;
      const ib = APPAREL_ORDER_MAP.has(nb) ? APPAREL_ORDER_MAP.get(nb) : 999;
      if (ia !== ib) return ia - ib;
      return String(a).localeCompare(String(b));
    });
  }
  return sizes;
};

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const id = slug?.split('-').pop();

  const { products: allProducts, loading } = useProducts();
  const { customer, toggleWishlist } = useUserAuth();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [wishlisted, setWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('desc');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const imgRef = useRef(null);

  const { addToCart, updateQuantity, isInCart, getCartQuantity } = useCart();

  useEffect(() => {
    if (!allProducts.length) return;
    const found = allProducts.find(p => String(p.id) === String(id));
    if (found) {
      setProduct(found);
      const rawSizes = Array.isArray(found.grams) ? found.grams : [found.grams].filter(Boolean);
      const sortedSizes = sortSizesByCategory(found.category, rawSizes);
      setSelectedSize(sortedSizes[0] || '');
      setActiveColorIdx(0);
      setActiveImg(0);
      setTab('desc');
    }
  }, [allProducts, id]);

  useEffect(() => {
    if (product && customer) {
      const userWishlist = customer.wishlist || [];
      setWishlisted(userWishlist.some(item => String(item.id) === String(product.id)));
    } else {
      setWishlisted(false);
    }
  }, [product, customer]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const handleWishlist = async () => {
    if (!customer) {
      toast.info('Please log in to save to your wishlist.');
      return;
    }
    
    // Optimistic update
    setWishlisted(w => !w);
    
    const res = await toggleWishlist(product);
    if (res.success) {
      toast.success(res.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist');
      setWishlisted(res.isWishlisted);
    } else {
      setWishlisted(w => !w); // Revert
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch (err) { /* ignore */ }
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (loading) return (
    <div className="pd-loader"><div className="pd-ring" /></div>
  );

  if (!product) return (
    <div className="pd-notfound">
      <span>😕</span><p>Product not found.</p>
      <button onClick={() => navigate('/products')}>← Back to Shop</button>
    </div>
  );

  const sizesRaw = Array.isArray(product.grams) ? product.grams : [product.grams].filter(Boolean);
  const sizes = sortSizesByCategory(product.category, sizesRaw);
  const salePrice = product.prices?.[selectedSize] || product.price || 0;
  const origPrice = product.originalPrices?.[selectedSize];
  const discount = calcDiscount(origPrice, salePrice);
  const colors  = product.colors?.length ? product.colors : null;
  const activeColor = colors?.[activeColorIdx] ? { name: colors[activeColorIdx].name || '', hex: colors[activeColorIdx].hex || '' } : null;
  const images  = (colors?.[activeColorIdx]?.images?.filter(Boolean) || product.images || []).filter(Boolean);
  const savings = discount && origPrice ? Number(origPrice) - Number(salePrice) : null;

  // stock helpers
  const getStock = (colorIdx, size) => {
    const c = product.colors?.[colorIdx];
    if (!c) return Infinity; // no color = no stock tracking
    if (!c.stock) return Infinity;
    const s = c.stock[size];
    return s === undefined ? Infinity : Number(s);
  };
  const activeStock = getStock(activeColorIdx, selectedSize);
  const inCartQty   = getCartQuantity(product.id, selectedSize, activeColor);
  const canAddMore  = activeStock === Infinity || inCartQty < activeStock;

  const related = allProducts
    .filter(p => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  const reviews = product.reviews || [];
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewCount).toFixed(1) : 0;

  return (
    <>
    <div className="pd-page">
      <div className="pd-container">

        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span className="pd-bc-sep">›</span>
          <span onClick={() => navigate('/products')}>Shop</span>
          <span className="pd-bc-sep">›</span>
          <span onClick={() => navigate(`/products?cat=${product.category}`)}>{product.category}</span>
          <span className="pd-bc-sep">›</span>
          <span className="pd-bc-active">{product.name}</span>
        </nav>

        <div className="pd-grid">

          {/* ── Left: Images ── */}
          <div className="pd-images">
            {/* Thumbnails vertical */}
            <div className="pd-thumbs-col">
              {images.map((img, i) => (
                <div
                  key={i}
                  className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`view ${i + 1}`} />
                </div>
              ))}
            </div>

            {/* Main image */}
            <div className="pd-main-wrap">
              {/* Floating Actions */}
              <div className="pd-top-actions">
                <button className="pd-back-btn" onClick={() => navigate('/products')}>
                  <MdArrowBack /> Back
                </button>
                <div className="pd-action-btns">
                  <button className={`pd-icon-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={handleWishlist} title="Wishlist">
                    {wishlisted ? <MdFavorite /> : <MdFavoriteBorder />}
                  </button>
                  <button className="pd-icon-btn" onClick={handleShare} title="Share">
                    {copied ? <MdCheckCircle style={{ color: '#4ade80' }} /> : <MdShare />}
                  </button>
                </div>
              </div>

              {product.tag && <span className="pd-tag-badge">{TAG_LABELS[product.tag] || product.tag}</span>}
              {discount && <span className="pd-discount-badge">-{discount}%</span>}
              <div
                className={`pd-main-img ${zoomed ? 'zoomed' : ''}`}
                ref={imgRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                style={zoomed ? { '--zx': `${zoomPos.x}%`, '--zy': `${zoomPos.y}%` } : {}}
              >
                <img src={images[activeImg]} alt={product.name} />
                {!zoomed && <span className="pd-zoom-hint"><MdZoomIn /> Hover to zoom</span>}
              </div>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button className="pd-img-prev" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}>‹</button>
                  <button className="pd-img-next" onClick={() => setActiveImg(i => (i + 1) % images.length)}>›</button>
                </>
              )}
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className="pd-info">
            <h1 className="pd-name">{product.name}</h1>
            
            {reviewCount > 0 && (
              <div className="pd-rating-row" style={{ marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                <div className="pd-stars">
                  {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                </div>
                <span className="pd-rating-val">{avgRating}</span>
                <span className="pd-rating-count">({reviewCount} reviews)</span>
                <a href="#reviews" className="pd-read-reviews" style={{ fontSize: '0.85rem', color: '#e1782d', textDecoration: 'underline' }}>Read reviews</a>
              </div>
            )}

            {/* Color Swatches */}
            {colors && colors.length > 1 && (
              <div className="pd-colors">
                <span className="pd-color-label">Color: <strong>{activeColor?.name || ''}</strong></span>
                <div className="pd-color-swatches">
                  {colors.map((c, ci) => (
                    <button
                      key={ci}
                      className={`pd-color-swatch ${activeColorIdx === ci ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      title={c.name}
                      onClick={() => { setActiveColorIdx(ci); setActiveImg(0); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="pd-rating-row">
              <div className="pd-stars">
                <MdStar /><MdStar /><MdStar /><MdStar /><MdStarHalf />
              </div>
              <span className="pd-rating-val">4.5</span>
              <span className="pd-rating-count">(24 reviews)</span>
              {activeStock === 0
                ? <span className="pd-out-of-stock">✕ Out of Stock</span>
                : activeStock <= 5 && activeStock !== Infinity
                  ? <span className="pd-low-stock">⚠️ Only {activeStock} left!</span>
                  : <span className="pd-in-stock">✓ In Stock</span>
              }
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <div className="pd-price-row">
                <span className="pd-sale-price">₹{salePrice}</span>
                {origPrice && Number(origPrice) > Number(salePrice) && (
                  <span className="pd-orig-price">₹{origPrice}</span>
                )}
                {discount && <span className="pd-disc-pill">-{discount}% OFF</span>}
              </div>
              {savings && (
                <p className="pd-savings">🎉 You save ₹{savings} on this order!</p>
              )}
            </div>

            {/* Size */}
            <div className="pd-size-section">
              <div className="pd-size-header">
                <span className="pd-size-label">
                  Select Size
                  {['Sandals', 'Shoes', 'Flip Flops'].includes(product.category) && <em> (UK)</em>}
                </span>
                <span className="pd-size-guide" onClick={() => setShowSizeGuide(true)}><MdSwapHoriz /> Size Guide</span>
              </div>
              <div className="pd-sizes">
                {sizes.map(size => {
                  const sp = product.prices?.[size] || product.price || 0;
                  const op = product.originalPrices?.[size];
                  const d = calcDiscount(op, sp);
                  const stock = getStock(activeColorIdx, size);
                  const outOfStock = stock === 0;
                  return (
                    <button
                      key={size}
                      className={`pd-size-btn ${selectedSize === size ? 'active' : ''} ${outOfStock ? 'out-of-stock' : ''}`}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      title={outOfStock ? 'Out of stock' : ''}
                    >
                      <span className="pd-size-val">{size}</span>
                      <span className="pd-size-price">₹{sp}</span>
                      {d && !outOfStock && <span className="pd-size-disc">-{d}%</span>}
                      {outOfStock && <span className="pd-size-oos">Out</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cart Actions */}
            <div className="pd-cart-row">
              {activeStock === 0 ? (
                <button className="pd-add-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  ✕ Out of Stock
                </button>
              ) : !isInCart(product.id, selectedSize, activeColor) ? (
                <button className="pd-add-btn" onClick={() => addToCart(product.id, selectedSize, activeColor)}>
                  🛍️ Add to Bag
                </button>
              ) : (
                <div className="pd-qty-control">
                  <button onClick={() => updateQuantity(product.id, selectedSize, -1, activeColor)}>−</button>
                  <span>{getCartQuantity(product.id, selectedSize, activeColor)}</span>
                  <button
                    onClick={() => updateQuantity(product.id, selectedSize, 1, activeColor)}
                    disabled={!canAddMore}
                    title={!canAddMore ? 'Max stock reached' : ''}
                  >+</button>
                </div>
              )}
              <button className="pd-buy-btn" onClick={() => navigate('/checkout')} disabled={activeStock === 0}>
                ⚡ Buy Now
              </button>
            </div>
            
            <button 
              className="pd-whatsapp-customization-btn" 
              onClick={() => window.open(`https://wa.me/918897030909?text=Hi, I would like to discuss customizations for ${product.name}`, '_blank')}
            >
              <FaWhatsapp style={{ fontSize: '1.2rem' }} /> Discuss customizations on WhatsApp here
            </button>

            {/* Delivery info strip */}
            <div className="pd-delivery-strip">
              <div className="pd-del-item">
                <MdLocalShipping />
                <div><strong>Free Delivery</strong><span>On orders above ₹500</span></div>
              </div>
              <div className="pd-del-item">
                <MdVerified />
                <div><strong>100% Genuine</strong><span>Quality assured</span></div>
              </div>
              <div className="pd-del-item">
                <span className="pd-del-icon">↩️</span>
                <div><strong>Easy Returns</strong><span>7-day exchange</span></div>
              </div>
            </div>

            {/* Tabs */}
            <div className="pd-tabs">
              <button className={`pd-tab ${tab === 'desc' ? 'active' : ''}`} onClick={() => setTab('desc')}>Description</button>
              <button className={`pd-tab ${tab === 'details' ? 'active' : ''}`} onClick={() => setTab('details')}>Details</button>
              <button className={`pd-tab ${tab === 'washing' ? 'active' : ''}`} onClick={() => setTab('washing')}>🧺 Washing Instructions</button>
            </div>
            <div className="pd-tab-content">
              {tab === 'desc' && (
                <p className="pd-desc">{product.description || 'No description available.'}</p>
              )}
              {tab === 'details' && (
                <div className="pd-details-table">
                  <div className="pd-detail-row"><span>Category</span><span>{product.category}</span></div>
                  {product.gender && <div className="pd-detail-row"><span>Gender</span><span>{product.gender}</span></div>}
                  {colors && <div className="pd-detail-row"><span>Colors</span><span>{colors.map(c => c.name).filter(Boolean).join(', ') || colors.length + ' colors'}</span></div>}
                  {product.styleTags?.length > 0 && <div className="pd-detail-row"><span>Style</span><span>{product.styleTags.join(', ')}</span></div>}
                  <div className="pd-detail-row"><span>Available Sizes</span><span>{sizes.join(', ')}</span></div>
                  <div className="pd-detail-row"><span>Tag</span><span>{TAG_LABELS[product.tag] || '—'}</span></div>
                  <div className="pd-detail-row"><span>SKU</span><span>AZ-{String(product.id).padStart(4, '0')}</span></div>
                </div>
              )}
              {tab === 'washing' && (
                <div className="pd-washing-instructions">
                  {product.washing_instructions ? (
                    <p className="pd-desc">{product.washing_instructions}</p>
                  ) : (
                    <p className="pd-desc" style={{ opacity: 0.6 }}>No washing instructions provided for this item.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <section id="reviews" className="pd-reviews-section">
          <h2 className="pd-related-title">Customer <span>Reviews</span></h2>
          {reviews.length > 0 ? (
            <div className="pd-reviews-grid">
              {reviews.map((r, i) => (
                <div key={i} className="pd-review-card">
                  <div className="pd-rev-header">
                    <div className="pd-rev-user">
                      <div className="pd-rev-avatar">{r.user ? r.user.charAt(0).toUpperCase() : 'U'}</div>
                      <div>
                        <h4>{r.user}</h4>
                        <span className="pd-rev-date">{new Date(r.date || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="pd-rev-stars">
                      {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
                    </div>
                  </div>
                  <p className="pd-rev-text">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="pd-no-reviews">No reviews yet.</p>
          )}
        </section>

        {/* Customer Reviews */}
        <section id="reviews" className="pd-reviews-section">
          <h2 className="pd-related-title">Customer <span>Reviews</span></h2>
          {reviews.length > 0 ? (
            <div className="pd-reviews-grid">
              {reviews.map((r, i) => (
                <div key={i} className="pd-review-card">
                  <div className="pd-rev-header">
                    <div className="pd-rev-user">
                      <div className="pd-rev-avatar">{r.user ? r.user.charAt(0).toUpperCase() : 'U'}</div>
                      <div>
                        <h4>{r.user}</h4>
                        <span className="pd-rev-date">{new Date(r.date || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="pd-rev-stars">
                      {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
                    </div>
                  </div>
                  <p className="pd-rev-text">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="pd-no-reviews">No reviews yet.</p>
          )}
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2 className="pd-related-title">More from <span>{product.category}</span></h2>
            <div className="pd-related-grid">
              {related.map(p => {
                const defSize = Array.isArray(p.grams) ? p.grams[0] : p.grams;
                const rPrice = p.prices?.[defSize] || p.price || 0;
                const rOrig = p.originalPrices?.[defSize];
                const rDisc = calcDiscount(rOrig, rPrice);
                return (
                  <div key={p.id} className="pd-related-card" onClick={() => { navigate(`/products/${toSlug(p.name, p.id)}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <div className="pd-rel-img-wrap">
                      {rDisc && <span className="pd-rel-disc">-{rDisc}%</span>}
                      <img src={p.images[0]} alt={p.name} />
                    </div>
                    <div className="pd-rel-info">
                      <h4>{p.name}</h4>
                      <div className="pd-rel-price">
                        {rOrig && Number(rOrig) > Number(rPrice) && <span className="pd-rel-orig">₹{rOrig}</span>}
                        <span className="pd-rel-sale">₹{rPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>

      {/* ── Size Guide Modal ── */}
      {showSizeGuide && (
        <div className="sg-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="sg-modal" onClick={e => e.stopPropagation()}>
            <button className="sg-close" onClick={() => setShowSizeGuide(false)}>✕</button>
            <h2 className="sg-title">📏 Size Guide — {product.category}</h2>

            <div className="sg-image-wrap" style={{ padding: '1rem', textAlign: 'center' }}>
              <img src={sizeGuideImg} alt="Size Guide" style={{ width: '100%', maxWidth: '600px', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
            </div>

            <div className="sg-tip-box">
              💡 <strong>Pro Tip:</strong> If you're between sizes, we recommend sizing up for a more comfortable fit.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
