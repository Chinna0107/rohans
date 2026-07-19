import { useState, useEffect } from 'react';
import config from '../config';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useCart } from '../context/CartContext';
import './UserDashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import { generateInvoiceHtml } from '../utils/invoiceGenerator';

const TABS = [
  { key: 'profile', label: 'My Profile', icon: '👤' },
  { key: 'orders',  label: 'Orders', icon: '📦' },
  { key: 'wishlist',label: 'Wishlist', icon: '❤️' },
  { key: 'addresses',label: 'Addresses', icon: '📍' },
];

const STATUS_COLORS = {
  pending: '#f0a54b', confirmed: '#4ade80', dispatched: '#60a5fa', delivered: '#a78bfa', cancelled: '#f87171',
};

const UserDashboard = () => {
  const { customer, token, loading, logoutCustomer, updateProfile, updateAddresses, toggleWishlist } = useUserAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ type: 'Home', street: '', city: '', state: '', zip: '' });

  useEffect(() => {
    // If routing from /dashboard/:tab
    const path = location.pathname.split('/');
    if (path.length === 3 && TABS.some(t => t.key === path[2])) {
      setTab(path[2]);
    }
  }, [location]);

  useEffect(() => {
    if (!loading && !customer) { navigate('/customer-login'); return; }
    if (customer) {
      setAddresses(customer.addresses || []);
      setWishlist(customer.wishlist || []);
      if (tab === 'orders') fetchOrders();
    }
  }, [tab, customer, loading]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${config.API_URL}/api/customer/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data || []);
    } catch { setOrders([]); }
    finally { setLoadingOrders(false); }
  };

  const handleLogout = () => {
    logoutCustomer();
    navigate('/');
  };

  const handleAction = async (orderId, action) => {
    const reason = prompt(`Enter reason for ${action}:`);
    if (!reason) return;
    try {
      const res = await fetch(`${config.API_URL}/api/customer/orders/${orderId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      alert(`Failed to ${action} order`);
    }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => addToCart(item));
    navigate('/checkout');
  };

  const handleDownloadInvoice = (order) => {
    const invoiceWindow = window.open("", "_blank");
    if (invoiceWindow) {
      invoiceWindow.document.open();
      invoiceWindow.document.write(generateInvoiceHtml(order));
      invoiceWindow.document.close();
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
      toast.error('Please fill out all address fields.');
      return;
    }
    const updatedAddresses = [...addresses, newAddress];
    const success = await updateAddresses(updatedAddresses);
    if (success) {
      setAddresses(updatedAddresses);
      setShowAddressForm(false);
      setNewAddress({ type: 'Home', street: '', city: '', state: '', zip: '' });
      toast.success('Address added successfully!');
    } else {
      toast.error('Failed to add address.');
    }
  };

  if (loading) return <div className="ud-page"><div className="ud-container">Loading...</div></div>;

  return (
    <div className="ud-page">
      <div className="ud-container">

        {/* Main Content */}
        <main className="ud-main">

          {/* ── My Orders ── */}
          {tab === 'orders' && (
            <div className="ud-section">
              <h2>📦 My Orders</h2>
              {loadingOrders ? (
                <div className="ud-loading">Loading...</div>
              ) : orders.length === 0 ? (
                <div className="ud-empty">
                  <p>No orders found for your account.</p>
                  <button onClick={() => navigate('/products')} className="luxury-btn">Start Shopping</button>
                </div>
              ) : (
                <div className="ud-orders-list">
                  {orders.map((o, i) => {
                    const status = o.order_status || 'pending';
                    return (
                      <div key={o.id} className="ud-order-card">
                        <div className="ud-order-top">
                          <div>
                            <span className="ud-order-num">Order #{o.id}</span>
                            <span className="ud-order-date">{new Date(o.created_at).toLocaleDateString()}</span>
                          </div>
                          <span className="ud-status-badge" style={{ color: STATUS_COLORS[status] || '#f0a54b' }}>
                            {status.toUpperCase()}
                          </span>
                        </div>
                        <div className="ud-order-items">
                          {(o.items || []).map((item, j) => (
                            <div key={j} className="ud-order-item">
                              <img src={item.image || item.images?.[0]} alt={item.name} style={{width: 50, height: 50, objectFit: 'cover'}} />
                              <div>
                                <strong>{item.name}</strong>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="ud-order-footer" style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
                          <span className="ud-order-total">Total: <strong>₹{o.final_total || o.subtotal}</strong></span>
                        </div>
                        <div className="ud-order-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                          <button onClick={() => handleDownloadInvoice(o)} className="luxury-btn-outline">Download Invoice</button>
                          <button onClick={() => handleReorder(o)} className="luxury-btn-outline">Reorder</button>
                          {status === 'pending' && <button onClick={() => handleAction(o.id, 'cancel')} className="luxury-btn-outline" style={{borderColor: 'red', color: 'red'}}>Cancel</button>}
                          {status === 'delivered' && o.return_status !== 'requested' && <button onClick={() => handleAction(o.id, 'return')} className="luxury-btn-outline">Return Request</button>}
                          {o.tracking_url && <a href={o.tracking_url} target="_blank" rel="noreferrer" className="luxury-btn-outline">Track Order</a>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <div className="ud-section profile-section">
              <div className="profile-header">
                <h2>THE ACCOUNT PROFILE</h2>
                <p>Manage your ROHANS MATCHING CENTRE credentials and preferences.</p>
              </div>
              
              <div className="ud-profile-detail">
                <div className="ud-profile-fields">
                  <div className="ud-field">
                    <label>Name</label>
                    <div className="ud-field-val">{customer?.name || 'Not provided'}</div>
                  </div>
                  <div className="ud-field">
                    <label>Email Address</label>
                    <div className="ud-field-val">{customer?.email}</div>
                  </div>
                  <div className="ud-field">
                    <label>Phone Number</label>
                    <div className="ud-field-val">{customer?.phone || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="profile-actions">
                  <button className="edit-profile-btn" onClick={() => alert('Edit Profile functionality coming soon.')}>
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Addresses ── */}
          {tab === 'addresses' && (
            <div className="ud-section profile-section">
              <div className="profile-header">
                <h2>ADDRESS BOOK</h2>
                <p>Manage your saved shipping and billing addresses.</p>
              </div>

              {!showAddressForm ? (
                <div className="ud-address-container">
                  {addresses.length === 0 ? (
                    <div className="ud-empty">
                      <p>No saved addresses yet.</p>
                      <button className="edit-profile-btn" onClick={() => setShowAddressForm(true)}>+ ADD NEW ADDRESS</button>
                    </div>
                  ) : (
                    <>
                      <div className="ud-address-grid">
                        {addresses.map((addr, idx) => (
                          <div key={idx} className="ud-address-card">
                            <div className="address-type">{addr.type || 'Home'}</div>
                            <p>{addr.street}</p>
                            <p>{addr.city}, {addr.state} {addr.zip}</p>
                          </div>
                        ))}
                      </div>
                      <div className="profile-actions">
                        <button className="edit-profile-btn" onClick={() => setShowAddressForm(true)}>
                          + Add New Address
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="ud-address-form-wrap">
                  <form className="ud-address-form" onSubmit={handleAddAddress}>
                    <div className="ud-form-row">
                      <label>Address Type</label>
                      <select value={newAddress.type} onChange={e => setNewAddress({...newAddress, type: e.target.value})}>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="ud-form-row">
                      <label>Street Address</label>
                      <input type="text" placeholder="123 Luxury Lane" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                    </div>
                    <div className="ud-form-row split">
                      <div className="ud-form-col">
                        <label>City</label>
                        <input type="text" placeholder="Mumbai" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                      </div>
                      <div className="ud-form-col">
                        <label>State</label>
                        <input type="text" placeholder="Maharashtra" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                      </div>
                    </div>
                    <div className="ud-form-row">
                      <label>ZIP / Postal Code</label>
                      <input type="text" placeholder="400001" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" className="cancel-btn" onClick={() => setShowAddressForm(false)}>Cancel</button>
                      <button type="submit" className="save-btn">Save Address</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── Wishlist ── */}
          {tab === 'wishlist' && (
            <div className="ud-section">
              <h2>❤️ My Wishlist</h2>
              {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
              ) : (
                <div className="ud-wishlist-grid">
                  {wishlist.map(product => {
                    const pid = product.id || product._id;
                    const slug = (product.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const currentPrice = product.prices?.[product.grams?.[0] || product.grams] || product.price || 0;
                    return (
                      <div key={pid} className="ud-wishlist-item" onClick={() => navigate(`/products/${slug}-${pid}`)}>
                        <img src={product.images?.[0] || product.image} alt={product.name} />
                        <div className="ud-wishlist-info">
                          <h4>{product.name}</h4>
                          <p>₹{currentPrice}</p>
                        </div>
                        <button className="ud-wishlist-remove" onClick={async (e) => {
                          e.stopPropagation();
                          const res = await toggleWishlist(product);
                          if (res.success) toast.success('Removed from wishlist');
                          else toast.error('Failed to remove');
                        }}>
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
