import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminHeader from '../components/AdminHeader';
import { LuShoppingBag, LuUsers, LuTrendingUp, LuMessageCircle, LuPackage, LuClock } from 'react-icons/lu';
import config from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/orders`, { headers }),
        axios.get(`${config.API_URL}/api/products`, { headers })
      ]);

      const fetchedOrders = ordersRes.data.success ? ordersRes.data.orders : Array.isArray(ordersRes.data) ? ordersRes.data : [];
      setOrders(fetchedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate) || b.id - a.id));

      const fetchedProducts = productsRes.data.success ? productsRes.data.products : Array.isArray(productsRes.data) ? productsRes.data : [];
      setProductsCount(fetchedProducts.length);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const notifyWhatsApp = (order) => {
    const phone = order.customer?.phone || '';
    if (!phone) {
      toast.error('No phone number provided for this customer');
      return;
    }
    // Clean phone string
    const cleanedPhone = phone.replace(/\D/g, ''); 
    const items = (order.items || []).map(i => `${i.quantity}x ${i.productName || 'Item'}`).join(", ");
    const msg = encodeURIComponent(`Hi ${order.customer?.name || "Customer"}! 🙏 Your House of Ramya order #${order._id || order.id} (${items}) is being prepared and will be delivered soon. Thank you for shopping with us! 🛍️`);
    window.open(`https://wa.me/${cleanedPhone}?text=${msg}`, "_blank");
  };

  // Derived Stats
  const validOrders = orders.filter(o => o.orderStatus !== 'cancelled');
  const revenue = validOrders.reduce((sum, o) => sum + Number(o.finalTotal || o.subtotal || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
  
  // Calculate unique customers from orders based on phone/email
  const uniqueCustomers = new Set();
  orders.forEach(o => {
    if (o.customer?.phone) uniqueCustomers.add(o.customer.phone);
    else if (o.customer?.email) uniqueCustomers.add(o.customer.email);
  });
  const customersCount = uniqueCustomers.size;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: <LuShoppingBag size={24} />, type: "orders" },
    { label: "Total Revenue", value: `₹${revenue.toLocaleString()}`, icon: <LuTrendingUp size={24} />, type: "revenue" },
    { label: "Customers", value: customersCount, icon: <LuUsers size={24} />, type: "customers" },
    { label: "Pending Orders", value: pendingOrders, icon: <LuClock size={24} />, type: "pending" },
    { label: "Products", value: productsCount, icon: <LuPackage size={24} />, type: "products" },
  ];

  return (
    <div className="admin-page">
      <AdminHeader />
      <div className="admin-content">
        <h1 className="admin-page-title">Admin Dashboard</h1>

        {loading ? (
          <div className="ad-loading">
            <span className="ad-spinner" />
            <p>Loading Dashboard Data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="ad-stats-grid">
              {stats.map((s, i) => (
                <div key={s.label} className={`ad-stat-card ${s.type}`} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="ad-stat-icon">{s.icon}</div>
                  <div className="ad-stat-info">
                    <h3>{s.value}</h3>
                    <p>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Table */}
            <div className="ad-recent-orders-card">
              <h2 className="ad-card-title">Recent Orders</h2>
              {orders.length === 0 ? (
                <p className="ad-empty-msg">No orders yet.</p>
              ) : (
                <div className="ad-table-wrap">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Notify</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 8).map((order) => {
                        const status = order.orderStatus || 'pending';
                        const id = order._id || order.id;
                        return (
                          <tr key={id}>
                            <td className="ad-order-id">#{id.toString().slice(-6)}</td>
                            <td>
                              <div className="ad-customer">
                                <span className="ad-customer-name">{order.customer?.name || "—"}</span>
                                <span className="ad-customer-contact">{order.customer?.phone || order.customer?.email || ""}</span>
                              </div>
                            </td>
                            <td className="ad-order-total">₹{Number(order.finalTotal || order.subtotal || 0).toLocaleString()}</td>
                            <td>
                              <span className={`ad-status-badge ${status}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="ad-wa-btn" 
                                onClick={() => notifyWhatsApp(order)}
                                title="Notify via WhatsApp"
                              >
                                <LuMessageCircle size={16} />
                                <span>WhatsApp</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
