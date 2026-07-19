import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import useProducts from '../hooks/useProducts';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Products.css';

const calcDiscount = (orig, sale) => {
  const o = Number(orig), s = Number(sale);
  if (!o || !s || o <= s) return null;
  return Math.round(((o - s) / o) * 100);
};

const TrendingProducts = () => {
  const { products, loading } = useProducts();
  const { customer, toggleWishlist } = useUserAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState({});

  const filtered = useMemo(() => {
    const tagged = products.filter(p => p.styleTags?.includes('trending'));
    return tagged.length > 0 ? tagged : products.slice(8, 20);
  }, [products]);

  return (
    <div className="products-page">
      <div className="collection-page-header">
        <button className="collection-back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size={20} /> Back
        </button>
        <h1>Trending Now</h1>
        <p>What everyone is wearing right now</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-circle" /><div className="spinner-circle" /><div className="spinner-circle" />
          </div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products-container">
          <div className="products-list collection-grid">
            {filtered.map(product => {
              const pid = product.id || product._id;
              const colors = product.colors?.length ? product.colors : null;
              const activeColorIdx = selectedColors[pid] ?? 0;
              const activeImages = (colors?.[activeColorIdx]?.images?.filter(Boolean)?.length
                ? colors[activeColorIdx].images.filter(Boolean)
                : product.images) || [];
              const defaultWeight = Array.isArray(product.grams) ? product.grams[0] : product.grams;
              const currentPrice = product.prices?.[defaultWeight] || product.price || 0;
              const origPrice = product.originalPrices?.[defaultWeight];
              const disc = calcDiscount(origPrice, currentPrice);
              const isWishlisted = customer?.wishlist?.some(item => String(item.id) === String(pid));

              const handleWishlist = async (e) => {
                e.stopPropagation();
                if (!customer) { toast.info('Please log in to save to your wishlist.'); return; }
                const res = await toggleWishlist(product);
                toast[res.success ? 'success' : 'error'](res.success ? (res.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist') : 'Failed to update wishlist');
              };

              return (
                <div key={pid} className="product-item"
                  onClick={() => navigate(`/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${pid}`)}>
                  <div className="product-image-container">
                    {product.tag && <span className={`product-badge ${product.tag}`}>{product.tag}</span>}
                    {disc && <span className="product-disc-badge">-{disc}%</span>}
                    <button className="wishlist-btn-products" onClick={handleWishlist}>
                      {isWishlisted ? <FaHeart color="#FF4747" /> : <FaRegHeart />}
                    </button>
                    <img src={activeImages[0]} alt={product.name} onError={e => { e.target.style.display = 'none'; }} />
                    <div className="quick-view-overlay"><button className="quick-view-btn">View Details</button></div>
                  </div>
                  <div className="product-info">
                    <span className="product-cat-label">{product.category}</span>
                    <h3>{product.name}</h3>
                    {colors && colors.length > 1 && (
                      <div className="product-color-swatches" onClick={e => e.stopPropagation()}>
                        {colors.map((c, ci) => (
                          <button key={ci} className={`color-swatch-btn ${activeColorIdx === ci ? 'active' : ''}`}
                            style={{ background: c.hex }} title={c.name}
                            onClick={() => setSelectedColors({ ...selectedColors, [pid]: ci })} />
                        ))}
                      </div>
                    )}
                    <div className="price-section">
                      {origPrice && Number(origPrice) > Number(currentPrice) && <span className="original-price">₹{origPrice}</span>}
                      <span className="price">₹{currentPrice}</span>
                      {disc && <span className="discount-badge">-{disc}%</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingProducts;
