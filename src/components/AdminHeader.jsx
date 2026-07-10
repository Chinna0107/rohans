import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <img src={logo} alt="House of Ramya" className="admin-logo" />
        <div className="admin-brand">
          <div className="admin-brand-title">
            <div className="house-of-stack">
              <span className="ab-house">HOUSE</span>
              <span className="ab-of">OF</span>
            </div>
            <span className="ab-ramya">RAMYA</span>
          </div>
          <span className="ab-tag">ADMIN</span>
        </div>
      </div>

      <nav className="admin-nav">
        <button
          className={`admin-nav-btn ${isActive('/admin') || isActive('/admin/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/admin')}
        >
          📊 Dashboard
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/customers') ? 'active' : ''}`}
          onClick={() => navigate('/admin/customers')}
        >
          👥 Customers
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/products') ? 'active' : ''}`}
          onClick={() => navigate('/admin/products')}
        >
          📦 Products
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/orders') ? 'active' : ''}`}
          onClick={() => navigate('/admin/orders')}
        >
          🧾 Orders
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/coupons') ? 'active' : ''}`}
          onClick={() => navigate('/admin/coupons')}
        >
          🏷️ Coupons
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/categories') ? 'active' : ''}`}
          onClick={() => navigate('/admin/categories')}
        >
          🗂️ Categories
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/sliders') ? 'active' : ''}`}
          onClick={() => navigate('/admin/sliders')}
        >
          🖼️ Sliders
        </button>
        <button
          className={`admin-nav-btn ${isActive('/admin/settings') ? 'active' : ''}`}
          onClick={() => navigate('/admin/settings')}
        >
          ⚙️ Settings
        </button>
        <button className="admin-nav-btn" onClick={() => navigate('/')}>
          🏪 View Store
        </button>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-pill">
          <span className="admin-user-dot" />
          <span>{user.email || 'Admin'}</span>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminHeader;
