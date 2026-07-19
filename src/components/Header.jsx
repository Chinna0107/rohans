import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import { LuUser, LuPackage, LuHeart, LuMapPin, LuLogOut, LuChevronDown } from 'react-icons/lu';
import logo from '../assets/logo.jpeg';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const { customer, logoutCustomer } = useUserAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCartClick = (e) => {
    e.preventDefault();
    navigate('/checkout');
    setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search', { state: { query: searchQuery.trim() } });
      setIsMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Mobile Menu Toggle (Left) */}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
          <span className={isMenuOpen ? 'open' : ''} />
          <span className={isMenuOpen ? 'open' : ''} />
          <span className={isMenuOpen ? 'open' : ''} />
        </button>
        
        {/* Left: Brand Logo */}
        <div className="header-left">
          <Link to="/" className="brand-logo">
            <div className="brand-logo-circle">
              <img src={logo} alt="ROHANS MATCHING CENTRE" className="brand-logo-img" />
            </div>
            <div className="brand-text">
              <span className="brand-title">
                <span className="brand-title-main">ROHANS</span>
                <span className="brand-title-accent">MATCHING CENTRE</span>
              </span>
              <span className="brand-subtitle">QUALITY MEETS STYLE, EVERY DAY</span>
            </div>

          </Link>
        </div>

        {/* Center: Navigation & Search */}
        <div className={`header-center ${isMenuOpen ? 'active' : ''}`}>
          <nav className="main-nav">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </nav>
          
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for products, brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </form>
        </div>

        {/* Right: Icons */}
        <div className="header-right">
          {/* User Icon */}
          {customer ? (
            <div className="avatar-dropdown hide-on-mobile" ref={dropdownRef}>
              <button 
                className={`icon-link user-avatar-wrapper ${isUserDropdownOpen ? 'active' : ''}`} 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} 
                title="Profile"
              >
                <div className="user-avatar-circle">
                  <LuUser size={18} />
                </div>
                <LuChevronDown size={14} className="user-dropdown-arrow" />
              </button>
              
              {isUserDropdownOpen && (
                <div className="user-dropdown-menu show">
                  <div className="dropdown-header">
                    <p>Welcome,</p>
                    <h4>{customer.name || customer.email.split('@')[0]}</h4>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/dashboard/profile" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                    <LuUser size={18} /> My Profile
                  </Link>
                  <Link to="/dashboard/orders" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                    <LuPackage size={18} /> Orders
                  </Link>
                  <Link to="/dashboard/wishlist" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                    <LuHeart size={18} /> Wishlist
                  </Link>
                  <Link to="/dashboard/addresses" className="dropdown-item" onClick={() => setIsUserDropdownOpen(false)}>
                    <LuMapPin size={18} /> Addresses
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item logout-btn" onClick={() => {
                    logoutCustomer();
                    navigate('/');
                    setIsMenuOpen(false);
                    setIsUserDropdownOpen(false);
                  }} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <LuLogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/customer-login" className="icon-link hide-on-mobile" title="Login">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}

          {/* Wishlist Icon */}
          <Link to={customer ? "/dashboard/wishlist" : "/customer-login"} className="icon-link cart-link hide-on-mobile" title="Wishlist" onClick={() => setIsMenuOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {customer?.wishlist?.length > 0 && <span className="cart-badge">{customer.wishlist.length}</span>}
          </Link>

          {/* Mobile Search Icon */}
          <a href="#" className="icon-link search-link hide-on-desktop" onClick={(e) => { e.preventDefault(); navigate('/search'); setIsMenuOpen(false); }} title="Search">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>

          {/* Bag Icon */}
          <a href="#" className="icon-link cart-link" onClick={handleCartClick} title="Bag">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;
