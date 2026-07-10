import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MdCheckCircle, MdCancel, MdLocalShipping, MdPendingActions,
  MdPrint, MdOutlineAssignmentTurnedIn, MdClose
} from 'react-icons/md';
import { generateInvoiceHtml } from '../utils/invoiceGenerator';
import config from '../config';
import AdminHeader from '../components/AdminHeader';
import './AdminOrders.css';

const STAGES = [
  { key: 'all',        label: 'All Orders',  icon: '📋' },
  { key: 'pending',    label: 'Pending',      icon: '⏳' },
  { key: 'confirmed',  label: 'Confirmed',    icon: '✅' },
  { key: 'dispatched', label: 'Dispatched',   icon: '🚚' },
  { key: 'delivered',  label: 'Delivered',    icon: '📦' },
  { key: 'cancelled',  label: 'Cancelled',    icon: '❌' },
];

const STAGE_FLOW = ['pending', 'confirmed', 'dispatched', 'delivered'];

const STATUS_COLORS = {
  pending:    { bg: 'rgba(240,165,75,0.15)',  border: 'rgba(240,165,75,0.35)',  color: '#f0a54b' },
  confirmed:  { bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.3)',   color: '#4ade80' },
  dispatched: { bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)',   color: '#60a5fa' },
  delivered:  { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)',  color: '#a78bfa' },
  cancelled:  { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)',  color: '#f87171' },
};

const PAY_COLORS = {
  paid:    { color: '#4ade80' },
  pending: { color: '#f0a54b' },
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data.success ? res.data.orders : Array.isArray(res.data) ? res.data : [];
      setOrders(list.sort((a, b) => b.id - a.id));
    } catch (err) {
      if (err.response?.status === 401) { navigate('/login'); return; }
      toast.error('Failed to fetch orders');
    } finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${config.API_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.map(o => o._id === orderId || o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.id === orderId)) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally { setUpdatingId(null); }
  };

  const filteredOrders = orders.filter(o => {
    const matchStage = activeStage === 'all' || (o.orderStatus || 'pending') === activeStage;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q) ||
      o.customer?.email?.toLowerCase().includes(q) ||
      (o._id || o.id)?.toString().includes(q);
    return matchStage && matchSearch;
  });

  const countByStage = (key) => key === 'all' ? orders.length : orders.filter(o => (o.orderStatus || 'pending') === key).length;

  const totalRevenue = orders.reduce((s, o) => s + (Number(o.finalTotal || o.subtotal) || 0), 0);
  const paidRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + (Number(o.finalTotal || o.subtotal) || 0), 0);

  const getNextStatus = (current) => {
    const idx = STAGE_FLOW.indexOf(current || 'pending');
    return idx < STAGE_FLOW.length - 1 ? STAGE_FLOW[idx + 1] : null;
  };

  const formatDate = (order) => {
    const date = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }) : '—';
    let time = order.orderTime || '';
    if (time) {
      const parts = time.split(':');
      if (parts.length >= 2) {
        const h = parseInt(parts[0], 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        time = `${String(h12).padStart(2, '0')}:${parts[1]} ${ampm}`;
      }
    }
    return time ? `${date}, ${time}` : date;
  };

  return (
    <>

      <ToastContainer position="top-right" autoClose={2000} />
      <div className="admin-page">
        <div className="admin-content">

          {/* Top Bar */}
          <div className="admin-actions-bar">
            <h1 className="admin-page-title">🧾 Orders</h1>
            <button className="admin-btn" onClick={fetchOrders}>↻ Refresh</button>
          </div>

          {/* Stats */}
          <div className="ao-stats">
            <div className="ao-stat-card">
              <span>🧾</span>
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
            <div className="ao-stat-card">
              <span>⏳</span>
              <h3>{countByStage('pending')}</h3>
              <p>Pending</p>
            </div>
            <div className="ao-stat-card">
              <span>🚚</span>
              <h3>{countByStage('dispatched')}</h3>
              <p>Dispatched</p>
            </div>
            <div className="ao-stat-card">
              <span>📦</span>
              <h3>{countByStage('delivered')}</h3>
              <p>Delivered</p>
            </div>
            <div className="ao-stat-card revenue">
              <span>💰</span>
              <h3>₹{totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
            <div className="ao-stat-card revenue">
              <span>✅</span>
              <h3>₹{paidRevenue.toLocaleString()}</h3>
              <p>Paid Revenue</p>
            </div>
          </div>

          {/* Search */}
          <div className="ao-search-wrap">
            <span className="ao-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, phone, email or order ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="ao-search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>

          {/* Stage Tabs */}
          <div className="ao-stage-tabs">
            {STAGES.map(s => (
              <button
                key={s.key}
                className={`ao-stage-tab ${activeStage === s.key ? 'active' : ''}`}
                onClick={() => setActiveStage(s.key)}
              >
                {s.icon} {s.label}
                <span className="ao-tab-count">{countByStage(s.key)}</span>
              </button>
            ))}
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="ao-loading">
              <div className="ao-spinner" />
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <span>🧾</span>
              <p>{search ? 'No orders match your search.' : 'No orders in this stage yet.'}</p>
            </div>
          ) : (
            <div className="ao-table-wrap">
              <table className="ao-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => {
                    const status = order.orderStatus || 'pending';
                    const sc = STATUS_COLORS[status] || STATUS_COLORS.pending;
                    const pc = PAY_COLORS[order.paymentStatus] || PAY_COLORS.pending;
                    const nextStatus = getNextStatus(status);
                    const orderId = order._id || order.id;
                    return (
                      <tr key={orderId} onClick={() => setSelectedOrder(order)} className="ao-row">
                        <td className="ao-id">#{String(idx + 1).padStart(3, '0')}</td>
                        <td>
                          <div className="ao-customer">
                            <div className="ao-avatar">{order.customer?.name?.[0]?.toUpperCase() || '?'}</div>
                            <div>
                              <strong>{order.customer?.name || '—'}</strong>
                              <span>{order.customer?.phone || '—'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ao-items-preview">
                            {(order.items || []).slice(0, 2).map((item, i) => (
                              <img key={i} src={item.image} alt={item.name} title={item.name} />
                            ))}
                            {(order.items || []).length > 2 && (
                              <span className="ao-more-items">+{order.items.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="ao-total">₹{Number(order.finalTotal || order.subtotal || 0).toLocaleString()}</td>
                        <td>
                          <span className="ao-pay-badge" style={{ color: pc.color }}>
                            {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                          </span>
                          <span className="ao-pay-method">{order.paymentMethod === 'razorpay' ? 'Razorpay' : 'WhatsApp'}</span>
                        </td>
                        <td>
                          <span className="ao-status-badge" style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                            {STATUS_COLORS[status] && STAGES.find(s => s.key === status)?.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td className="ao-date">{formatDate(order)}</td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="ao-action-btns">
                            <select
                              className="ao-status-select"
                              value={status}
                              onChange={(e) => updateStatus(orderId, e.target.value)}
                              disabled={updatingId === orderId}
                            >
                              <option value="pending" disabled>Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {updatingId === orderId && <span className="ao-spinner-mini" />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div className="ao-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="ao-modal" onClick={e => e.stopPropagation()}>
            <button className="ao-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>

            <div className="ao-modal-header">
              <div>
                <h2>Order Details</h2>
                <span className="ao-modal-date">{formatDate(selectedOrder)}</span>
              </div>
              <button 
                className="ao-print-btn" 
                onClick={() => {
                  const invoiceWindow = window.open("", "_blank");
                  if (invoiceWindow) {
                    invoiceWindow.document.open();
                    invoiceWindow.document.write(generateInvoiceHtml(selectedOrder));
                    invoiceWindow.document.close();
                  }
                }} 
                title="Print Order"
              >🖨️ Print Invoice</button>
            </div>

            {/* Status Pipeline */}
            <div className="ao-pipeline">
              {STAGE_FLOW.map((s, i) => {
                const current = selectedOrder.orderStatus || 'pending';
                const currentIdx = STAGE_FLOW.indexOf(current);
                const isDone = i < currentIdx;
                const isActive = i === currentIdx;
                const sc = STATUS_COLORS[s];
                return (
                  <div key={s} className={`ao-pipe-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                    <button
                      className="ao-pipe-btn"
                      style={isActive ? { background: sc.bg, border: `1.5px solid ${sc.border}`, color: sc.color } : {}}
                      onClick={() => updateStatus(selectedOrder._id || selectedOrder.id, s)}
                      disabled={updatingId === (selectedOrder._id || selectedOrder.id)}
                    >
                      {STAGES.find(st => st.key === s)?.icon} {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                    {i < STAGE_FLOW.length - 1 && <div className={`ao-pipe-line ${isDone ? 'done' : ''}`} />}
                  </div>
                );
              })}
            </div>

            <div className="ao-modal-grid">
              {/* Customer */}
              <div className="ao-modal-section">
                <h4>👤 Customer</h4>
                <p><span>Name</span><strong>{selectedOrder.customer?.name}</strong></p>
                <p><span>Phone</span><strong>{selectedOrder.customer?.phone}</strong></p>
                <p><span>Email</span><strong>{selectedOrder.customer?.email}</strong></p>
                <p><span>Address</span><strong>{
                  typeof selectedOrder.customer?.address === 'object' && selectedOrder.customer?.address !== null
                    ? Object.values(selectedOrder.customer.address).filter(Boolean).join(', ')
                    : selectedOrder.customer?.address || '—'
                }</strong></p>
              </div>

              {/* Payment */}
              <div className="ao-modal-section">
                <h4>💳 Payment</h4>
                <p><span>Method</span><strong>{selectedOrder.paymentMethod === 'razorpay' ? 'Razorpay' : 'WhatsApp / COD'}</strong></p>
                <p><span>Status</span>
                  <strong style={{ color: PAY_COLORS[selectedOrder.paymentStatus]?.color || '#f0a54b' }}>
                    {selectedOrder.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                  </strong>
                </p>
                {selectedOrder.razorpayPaymentId && (
                  <p><span>Payment ID</span><strong className="ao-txn-id">{selectedOrder.razorpayPaymentId}</strong></p>
                )}
                {selectedOrder.razorpayOrderId && (
                  <p><span>Order ID</span><strong className="ao-txn-id">{selectedOrder.razorpayOrderId}</strong></p>
                )}
                <p><span>Date</span><strong>{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }) : '—'}</strong></p>
                <p><span>Time</span><strong>{selectedOrder.orderTime || '—'}</strong></p>
              </div>
            </div>

            {/* Items */}
            <div className="ao-modal-items">
              <h4>🛍️ Items</h4>
              {(selectedOrder.items || []).map((item, i) => (
                <div key={i} className="ao-modal-item">
                  <img src={item.image} alt={item.name} />
                  <div className="ao-modal-item-info">
                    <strong>{item.name}</strong>
                    <span>{item.category} · Size: {item.size}</span>
                  </div>
                  <div className="ao-modal-item-right">
                    <span>×{item.quantity || item.qty || 1}</span>
                    <strong>₹{item.total || item.price * (item.quantity || item.qty || 1)}</strong>
                  </div>
                </div>
              ))}
              <div className="ao-modal-totals">
                {selectedOrder.totalSavings > 0 && (
                  <div className="ao-modal-row savings"><span>🎉 Product Savings</span><span>−₹{selectedOrder.totalSavings}</span></div>
                )}
                {selectedOrder.couponDiscount > 0 && (
                  <div className="ao-modal-row savings"><span>🏷️ Coupon ({selectedOrder.couponCode})</span><span>−₹{selectedOrder.couponDiscount}</span></div>
                )}
                <div className="ao-modal-row"><span>Subtotal</span><span>₹{Number(selectedOrder.subtotal || 0).toLocaleString()}</span></div>
                <div className="ao-modal-row"><span>Delivery</span><span className="co-free">FREE</span></div>
                <div className="ao-modal-total"><span>Total Paid</span><span>₹{Number(selectedOrder.finalTotal || selectedOrder.subtotal || 0).toLocaleString()}</span></div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrders;
