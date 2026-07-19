import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminHeader from '../components/AdminHeader';
import { LuUsers, LuShoppingBag, LuTrendingUp, LuSearch, LuX, LuMessageCircle } from 'react-icons/lu';
import config from '../config';
import './AdminCustomers.css';

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCustomersData();
  }, [navigate]);

  const fetchCustomersData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orders = res.data.success ? res.data.orders : Array.isArray(res.data) ? res.data : [];
      
      // Aggregate Customers
      const customerMap = new Map();
      orders.forEach(order => {
        // Skip orders with no customer info
        if (!order.customer || (!order.customer.phone && !order.customer.email)) return;
        
        const key = order.customer.phone || order.customer.email;
        const total = Number(order.finalTotal || order.subtotal || 0);
        const isValidOrder = order.orderStatus !== 'cancelled';

        if (customerMap.has(key)) {
          const existing = customerMap.get(key);
          existing.totalOrders += 1;
          if (isValidOrder) {
            existing.totalSpent += total;
          }
          if (order.orderDate && new Date(order.orderDate) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = order.orderDate;
          }
        } else {
          customerMap.set(key, {
            id: key,
            name: order.customer.name || 'Unknown',
            phone: order.customer.phone || '',
            email: order.customer.email || '',
            totalOrders: 1,
            totalSpent: isValidOrder ? total : 0,
            lastOrderDate: order.orderDate || new Date().toISOString()
          });
        }
      });

      const aggregatedCustomers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomers(aggregatedCustomers);

    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to load customer data');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  const notifyWhatsApp = (customer) => {
    if (!customer.phone) {
      toast.error('No phone number available for this customer.');
      return;
    }
    const cleanedPhone = customer.phone.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hi ${customer.name}! 🙏 Thank you for being a valued customer at ROHANS MATCHING CENTRE.`);
    window.open(`https://wa.me/${cleanedPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="admin-page">
      <AdminHeader />
      <div className="admin-content">
        
        <div className="acust-header-section">
          <h1 className="admin-page-title">Customers</h1>
          <div className="acust-quick-stats">
            <div className="acust-stat-pill">
              <LuUsers size={16} className="text-primary" />
              <span className="val">{customers.length}</span>
              <span className="lbl">Total</span>
            </div>
            <div className="acust-stat-pill">
              <LuShoppingBag size={16} className="text-blue" />
              <span className="val">{totalOrders}</span>
              <span className="lbl">Orders</span>
            </div>
            <div className="acust-stat-pill">
              <LuTrendingUp size={16} className="text-green" />
              <span className="val">₹{totalRevenue.toLocaleString()}</span>
              <span className="lbl">Revenue</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="acust-search-wrapper">
          <LuSearch className="search-icon-left" size={18} />
          <input
            type="text"
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="acust-search-input"
          />
          {search && (
            <button onClick={() => setSearch("")} className="search-clear-btn">
              <LuX size={18} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="acust-loading">
            <span className="acust-spinner" />
            <p>Aggregating Customer Data...</p>
          </div>
        ) : (
          <div className="acust-table-card">
            {filteredCustomers.length === 0 ? (
              <p className="acust-empty-msg">
                {search ? `No customers found for "${search}"` : "No customers yet."}
              </p>
            ) : (
              <div className="acust-table-wrap">
                <table className="products-table acust-table">
                  <thead>
                    <tr>
                      <th>Customer Info</th>
                      <th>Contact</th>
                      <th>Total Orders</th>
                      <th>Total Spent</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(customer => (
                      <tr key={customer.id}>
                        <td>
                          <div className="acust-customer">
                            <div className="acust-avatar">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="acust-name-group">
                              <span className="acust-name">{customer.name}</span>
                              <span className="acust-since">Last Order: {new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="acust-contact-group">
                            <span className="acust-phone">{customer.phone || '—'}</span>
                            <span className="acust-email">{customer.email || '—'}</span>
                          </div>
                        </td>
                        <td className="acust-orders-count">{customer.totalOrders}</td>
                        <td className="acust-total-spent">₹{customer.totalSpent.toLocaleString()}</td>
                        <td>
                          <button 
                            className="acust-wa-btn" 
                            onClick={() => notifyWhatsApp(customer)}
                            title="Message on WhatsApp"
                            disabled={!customer.phone}
                          >
                            <LuMessageCircle size={15} />
                            <span>WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
