import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import AdminHeader from '../components/AdminHeader';
import './AdminCoupons.css';

const INIT_FORM = {
  code: '', type: 'percent', discount: '', minOrder: '',
  maxUses: '', expiresAt: '', description: '',
};

const AdminCoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState(null);
  const [formData, setFormData]       = useState(INIT_FORM);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.API_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data.coupons || res.data || []);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else toast.error('Failed to fetch coupons');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        discount: Number(formData.discount),
        min_order: formData.minOrder ? Number(formData.minOrder) : 0,
        max_uses: formData.maxUses ? Number(formData.maxUses) : null,
        expires_at: formData.expiresAt || null,
        description: formData.description.trim(),
      };
      if (editing) {
        await axios.put(`${config.API_URL}/api/coupons/${editing._id || editing.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Coupon updated!');
      } else {
        await axios.post(`${config.API_URL}/api/coupons`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Coupon created!');
      }
      fetchCoupons(); resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally { setSaving(false); }
  };

  const handleEdit = (coupon) => {
    setEditing(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      minOrder: coupon.min_order || '',
      maxUses: coupon.max_uses || '',
      expiresAt: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      description: coupon.description || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.API_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Coupon deleted!');
      fetchCoupons();
    } catch { toast.error('Failed to delete coupon'); }
  };

  const handleToggle = async (coupon) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${config.API_URL}/api/coupons/${coupon._id || coupon.id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCoupons();
    } catch { toast.error('Failed to toggle coupon'); }
  };

  const resetForm = () => { setFormData(INIT_FORM); setEditing(null); setShowForm(false); };

  const isExpired = (date) => date && new Date(date) < new Date();

  const usagePercent = (coupon) => {
    if (!coupon.max_uses) return null;
    return Math.round(((coupon.uses || 0) / coupon.max_uses) * 100);
  };

  return (
    <>

      <ToastContainer position="top-right" autoClose={2000} />
      <div className="admin-page">
        <div className="admin-content">

          {/* Top Bar */}
          <div className="admin-actions-bar">
            <h1 className="admin-page-title">🏷️ Coupons</h1>
            <button className="admin-btn" onClick={() => { resetForm(); setShowForm(!showForm); }}>
              {showForm ? '✕ Cancel' : '+ New Coupon'}
            </button>
          </div>

          {/* Stats */}
          <div className="ac-stats">
            <div className="stat-card">
              <span className="stat-icon">🏷️</span>
              <h3>{coupons.length}</h3>
              <p>Total Coupons</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <h3>{coupons.filter(c => c.active !== false && !isExpired(c.expires_at)).length}</h3>
              <p>Active</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <h3>{coupons.reduce((s, c) => s + (c.uses || 0), 0)}</h3>
              <p>Total Uses</p>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="ac-form product-form">
              <div className="form-field">
                <label>Coupon Code *</label>
                <input
                  type="text" placeholder="e.g. SAVE10"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required disabled={!!editing}
                  style={{ letterSpacing: '2px', fontWeight: 700 }}
                />
                {editing && <span className="ac-field-note">Code cannot be changed after creation</span>}
              </div>

              <div className="form-field">
                <label>Discount Type *</label>
                <div className="gender-options">
                  {[{ v: 'percent', l: '% Percentage' }, { v: 'flat', l: '₹ Flat Amount' }].map(t => (
                    <label key={t.v} className={`gender-option ${formData.type === t.v ? 'active' : ''}`}>
                      <input type="radio" name="type" value={t.v} checked={formData.type === t.v} onChange={() => setFormData({ ...formData, type: t.v })} />
                      {t.l}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>{formData.type === 'percent' ? 'Discount (%) *' : 'Discount Amount (₹) *'}</label>
                <input
                  type="number" min="1" max={formData.type === 'percent' ? 100 : undefined}
                  placeholder={formData.type === 'percent' ? 'e.g. 10' : 'e.g. 100'}
                  value={formData.discount}
                  onChange={e => setFormData({ ...formData, discount: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Min Order Amount (₹)</label>
                <input type="number" min="0" placeholder="e.g. 500 (optional)"
                  value={formData.minOrder} onChange={e => setFormData({ ...formData, minOrder: e.target.value })} />
              </div>

              <div className="form-field">
                <label>Max Uses</label>
                <input type="number" min="1" placeholder="e.g. 100 (leave blank for unlimited)"
                  value={formData.maxUses} onChange={e => setFormData({ ...formData, maxUses: e.target.value })} />
              </div>

              <div className="form-field">
                <label>Expiry Date</label>
                <input type="date" value={formData.expiresAt}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, expiresAt: e.target.value })} />
              </div>

              <div className="form-field full-width">
                <label>Description</label>
                <input type="text" placeholder="e.g. 10% off on orders above ₹500"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="form-actions">
                <button type="button" className="admin-btn cancel-btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>
                  {saving ? <><span className="spinner" />{editing ? 'Updating...' : 'Creating...'}</> : editing ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          )}

          {/* Coupons Table */}
          {loading ? (
            <div className="ac-loading">
              <div className="ao-spinner" /><p>Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="empty-state"><span>🏷️</span><p>No coupons yet. Create your first one!</p></div>
          ) : (
            <div className="ac-table-wrap">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Code</th><th>Type</th><th>Discount</th><th>Min Order</th>
                    <th>Usage</th><th>Expiry</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(coupon => {
                    const expired = isExpired(coupon.expires_at);
                    const active  = coupon.active !== false && !expired;
                    const pct     = usagePercent(coupon);
                    return (
                      <tr key={coupon._id || coupon.id}>
                        <td>
                          <div className="ac-code-cell">
                            <span className="ac-code">{coupon.code}</span>
                            {coupon.description && <span className="ac-desc">{coupon.description}</span>}
                          </div>
                        </td>
                        <td>
                          <span className={`ac-type-badge ${coupon.type}`}>
                            {coupon.type === 'percent' ? '%' : '₹'} {coupon.type}
                          </span>
                        </td>
                        <td className="ac-discount-val">
                          {coupon.type === 'percent' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                        </td>
                        <td>{coupon.min_order ? `₹${coupon.min_order}` : <span className="ac-none">—</span>}</td>
                        <td>
                          <div className="ac-usage">
                            <span>{coupon.uses || 0}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}</span>
                            {pct !== null && (
                              <div className="ac-usage-bar">
                                <div className="ac-usage-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {coupon.expires_at
                            ? <span className={expired ? 'ac-expired' : 'ac-expiry'}>{new Date(coupon.expires_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            : <span className="ac-none">Never</span>}
                        </td>
                        <td>
                          <button
                            className={`ac-toggle-btn ${active ? 'active' : 'inactive'}`}
                            onClick={() => handleToggle(coupon)}
                            disabled={expired}
                            title={expired ? 'Expired' : active ? 'Click to disable' : 'Click to enable'}
                          >
                            {expired ? '⏰ Expired' : active ? '✅ Active' : '⏸ Inactive'}
                          </button>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="edit-btn" onClick={() => handleEdit(coupon)}>✏️ Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(coupon._id || coupon.id)}>🗑️ Delete</button>
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
    </>
  );
};

export default AdminCoupons;
