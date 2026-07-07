import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdHome, MdGridView, MdSearch, MdPerson, MdClose } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import { useUserAuth } from '../context/UserAuthContext';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, logoutCustomer } = useUserAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef(null);
  
  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountMenu]);

  const navItems = [
    { path: '/', icon: <MdHome size={22} />, label: 'HOME' },
    { path: '/products', icon: <MdGridView size={22} />, label: 'CATEGORIES' },
    { path: '/search', icon: <MdSearch size={22} />, label: 'SEARCH' },
    { path: customer ? '/dashboard/wishlist' : '/customer-login', icon: <FaRegHeart size={20} />, label: 'WISHLIST' },
    { isAccount: true, icon: <MdPerson size={22} />, label: 'ACCOUNT' }
  ];

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (!customer) {
      navigate('/customer-login');
    } else {
      setShowAccountMenu(!showAccountMenu);
    }
  };

  const handleNavigate = (path) => {
    setShowAccountMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowAccountMenu(false);
    logoutCustomer();
    navigate('/');
  };

  return (
    <>
      {showAccountMenu && <div className="account-menu-overlay" onClick={() => setShowAccountMenu(false)}></div>}
      
      <div className={`account-bottom-sheet ${showAccountMenu ? 'active' : ''}`} ref={menuRef}>
        <div className="sheet-header">
          <h3>My Account</h3>
          <button onClick={() => setShowAccountMenu(false)} className="close-sheet-btn"><MdClose size={24} /></button>
        </div>
        <div className="sheet-menu">
          <button onClick={() => handleNavigate('/dashboard/profile')}>My Profile</button>
          <button onClick={() => handleNavigate('/dashboard/orders')}>My Orders</button>
          <button onClick={() => handleNavigate('/dashboard/wishlist')}>Wishlist</button>
          <div className="sheet-divider"></div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="bottom-nav">
        {navItems.map((item) => {
          if (item.isAccount) {
            return (
              <div 
                key={item.label} 
                className={`bottom-nav-item ${location.pathname.includes('/dashboard') ? 'active' : ''}`}
                onClick={handleAccountClick}
                style={{ cursor: 'pointer' }}
              >
                <div className="bottom-nav-icon">{item.icon}</div>
                <span className="bottom-nav-label">{item.label}</span>
              </div>
            );
          }
          return (
            <Link 
              key={item.label} 
              to={item.path} 
              className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="bottom-nav-icon">{item.icon}</div>
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;
