import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdClose } from 'react-icons/md';
import useProducts from '../hooks/useProducts';
import './Search.css';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus search input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerQuery = searchTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
      (p.tag && p.tag.toLowerCase().includes(lowerQuery))
    );
  }, [searchTerm, products]);

  const getMinPrice = (product) => {
    if (product.prices && typeof product.prices === 'object') {
      return Math.min(...Object.values(product.prices).map(Number));
    }
    return product.price || 0;
  };

  const handleProductClick = (product) => {
    const pid = product.id || product._id;
    if (!pid) return;
    navigate(`/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${pid}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to products page with search state if desired, but since we show results inline, we don't strictly have to.
      // E.g. navigate('/products', { state: { search: searchTerm } });
    }
  };

  return (
    <div className="search-page">
      <div className="search-header-container">
        <form className="search-input-wrapper" onSubmit={handleSearchSubmit}>
          {/* <MdSearch className="search-icon" /> */}
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search for products, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button type="button" className="clear-btn" onClick={() => setSearchTerm('')}>
              <MdClose />
            </button>
          )}
        </form>
      </div>

      <div className="search-content">
        {loading ? (
          <div className="search-loading">Loading products...</div>
        ) : !searchTerm.trim() ? (
          <div className="search-empty-state">
            <MdSearch size={64} style={{ color: 'var(--border-subtle)', marginBottom: '1rem' }} />
            <h3>What are you looking for?</h3>
            <p>Start typing to find luxury styles</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="search-empty-state">
            <h3>No results found</h3>
            <p>We couldn't find anything matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="search-results-grid">
            {searchResults.map(product => {
              const currentPrice = getMinPrice(product);
              const activeImages = product.images || (product.colors?.[0]?.images) || [];
              const mainImage = activeImages[0];
              
              return (
                <div key={product.id || product._id} className="search-result-card" onClick={() => handleProductClick(product)}>
                  <div className="search-result-image">
                    {mainImage ? <img src={mainImage} alt={product.name} /> : <div className="no-img">No Image</div>}
                  </div>
                  <div className="search-result-info">
                    <span className="search-result-cat">{product.category}</span>
                    <h4>{product.name}</h4>
                    <span className="search-result-price">₹{currentPrice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
