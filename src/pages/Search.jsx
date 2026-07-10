import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdSearch, MdClose, MdHistory, MdTrendingUp, MdArrowForward } from 'react-icons/md';
import useProducts from '../hooks/useProducts';
import './Search.css';

const POPULAR_SEARCHES = ['Sarees', 'Kurties', 'Maggam Work', 'Lehenga', 'Silk'];

const Search = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.query || '');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  });
  
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus search input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const saveSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term.trim(), ...recentSearches.filter(t => t.toLowerCase() !== term.trim().toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSuggestionClick = (term) => {
    setSearchTerm(term);
    saveSearch(term);
  };

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    
    return products.filter(p => {
      const searchableText = `${p.name} ${p.category} ${p.description || ''} ${p.tag || ''}`.toLowerCase();
      // Smart search: every word in the search term must exist in the searchable text
      return terms.every(term => searchableText.includes(term));
    });
  }, [searchTerm, products]);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerQuery = searchTerm.toLowerCase();
    
    // Extract all unique categories and tags
    const allTagsAndCats = Array.from(new Set([
      ...products.map(p => p.category),
      ...products.map(p => p.tag)
    ])).filter(Boolean);
    
    return allTagsAndCats
      .filter(t => t.toLowerCase().includes(lowerQuery) && t.toLowerCase() !== lowerQuery)
      .slice(0, 5);
  }, [searchTerm, products]);

  const getMinPrice = (product) => {
    if (product.prices && typeof product.prices === 'object') {
      return Math.min(...Object.values(product.prices).map(Number));
    }
    return product.price || 0;
  };

  const handleProductClick = (product) => {
    saveSearch(searchTerm || product.name);
    const pid = product.id || product._id;
    if (!pid) return;
    navigate(`/products/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${pid}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearch(searchTerm);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header-container">
        <form className="search-input-wrapper" onSubmit={handleSearchSubmit}>
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
          <div className="search-suggestions-container">
            {recentSearches.length > 0 && (
              <div className="search-section">
                <div className="section-header">
                  <h3><MdHistory /> Recent Searches</h3>
                  <button type="button" className="clear-text-btn" onClick={clearRecent}>Clear</button>
                </div>
                <div className="chip-list">
                  {recentSearches.map((term, i) => (
                    <button key={i} className="search-chip" onClick={() => handleSuggestionClick(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="search-section">
              <div className="section-header">
                <h3><MdTrendingUp /> Popular Searches</h3>
              </div>
              <div className="chip-list">
                {POPULAR_SEARCHES.map((term, i) => (
                  <button key={i} className="search-chip popular-chip" onClick={() => handleSuggestionClick(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="search-results-container">
            {suggestions.length > 0 && (
              <div className="auto-suggestions-list">
                <p className="suggestions-label">Suggestions</p>
                {suggestions.map((s, i) => (
                  <button key={i} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>
                    <MdSearch className="suggestion-icon" />
                    <span>{s}</span>
                    <MdArrowForward className="suggestion-arrow" />
                  </button>
                ))}
              </div>
            )}

            {searchResults.length === 0 ? (
              <div className="search-empty-state">
                <h3>No results found</h3>
                <p>We couldn't find anything matching "{searchTerm}"</p>
              </div>
            ) : (
              <>
                <p className="results-count">{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchTerm}"</p>
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
