import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from '../components/AdminHeader';
import config from '../config';
import './AdminProducts.css';
import './AdminSliders.css';

const toSlug = (name, id) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id;

const AdminSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', desktop: '', mobile: '', heading: '', desc: '', tag: '', order: 1, productId: '' });
  const navigate = useNavigate();

  useEffect(() => { verifyToken(); }, [navigate]);

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await axios.get(`${config.API_URL}/api/users/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) { fetchSliders(); fetchProducts(); }
      else { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
    } catch (error) {
      if (error.response?.status === 404) { fetchSliders(); fetchProducts(); }
      else { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/products`);
      setProducts(res.data.success ? res.data.products : []);
    } catch {}
  };

  const fetchSliders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.API_URL}/api/sliders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSliders(res.data.success ? res.data.sliders : Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      if (error.response?.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const linkedProduct = products.find(p => String(p.id) === String(formData.productId));
      const sliderData = {
        title: formData.title,
        imageUrl: formData.desktop,
        desktop: formData.desktop,
        mobile: formData.mobile,
        heading: formData.heading,
        desc: formData.desc,
        tag: formData.tag,
        order: Number(formData.order),
        productId: formData.productId || null,
        productSlug: linkedProduct ? toSlug(linkedProduct.name, linkedProduct.id) : null,
        productName: linkedProduct ? linkedProduct.name.trim() : null,
      };
      if (editingSlider) {
        await axios.put(`${config.API_URL}/api/sliders/${editingSlider.id}`, sliderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Slider updated!', { autoClose: 1500 });
      } else {
        await axios.post(`${config.API_URL}/api/sliders`, sliderData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Slider added!', { autoClose: 1500 });
      }
      fetchSliders();
      resetForm();
    } catch (error) {
      if (error.response?.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
      else toast.error('Error saving slider: ' + (error.response?.data?.message || error.message));
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slider?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.API_URL}/api/sliders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Slider deleted!', { autoClose: 1500 });
      fetchSliders();
    } catch (error) {
      if (error.response?.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
      else toast.error('Error deleting slider: ' + error.message);
    }
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({ title: slider.title, desktop: slider.desktop || slider.imageUrl || '', mobile: slider.mobile || '', heading: slider.heading || '', desc: slider.desc || '', tag: slider.tag || '', order: slider.order, productId: slider.productId ? String(slider.productId) : '' });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', desktop: '', mobile: '', heading: '', desc: '', tag: '', order: 1, productId: '' });
    setEditingSlider(null);
    setShowForm(false);
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem('token');
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      const res = await axios.post(`${config.API_URL}/api/upload`, uploadData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.url) {
        setFormData(prev => ({ ...prev, [field]: res.data.url }));
        toast.success('Image uploaded successfully!', { autoClose: 1500 });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image.', { autoClose: 2000 });
    }
  };

  return (
    <>

      <ToastContainer position="top-right" autoClose={1500} />
      <div className="admin-page">
        <div className="admin-content">

          <div className="admin-actions-bar">
            <h1 className="admin-page-title">🖼️ Sliders</h1>
            <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Add Slider'}
            </button>
          </div>

          <div className="admin-stats" style={{ gridTemplateColumns: '1fr' }}>
            <div className="stat-card">
              <span className="stat-icon">🖼️</span>
              <h3>{sliders.length}</h3>
              <p>Total Sliders</p>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="slider-form">
              <div className="form-field">
                <label>Slider Title *</label>
                <input type="text" value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Summer Collection" required />
              </div>
              <div className="form-field">
                <label>Desktop Image URL *</label>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <input type="url" value={formData.desktop}
                    onChange={e => setFormData({ ...formData, desktop: e.target.value })}
                    placeholder="https://..." required style={{ flex: 1 }} />
                  <label className="admin-btn" style={{ padding: '0 1rem', cursor: 'pointer', margin: 0, height: '40px' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'desktop')} />
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label>Mobile Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <input type="url" value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="https://... (optional)" style={{ flex: 1 }} />
                  <label className="admin-btn" style={{ padding: '0 1rem', cursor: 'pointer', margin: 0, height: '40px' }}>
                    Upload
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'mobile')} />
                  </label>
                </div>
              </div>
              <div className="form-field">
                <label>Heading</label>
                <input type="text" value={formData.heading}
                  onChange={e => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="e.g. Welcome to ROHANS MATCHING CENTRE" />
              </div>
              <div className="form-field">
                <label>Description</label>
                <input type="text" value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="e.g. Fashion that defines you" />
              </div>
              <div className="form-field">
                <label>Tag</label>
                <input type="text" value={formData.tag}
                  onChange={e => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g. New Collection" />
              </div>
              <div className="form-field">
                <label>Display Order *</label>
                <input type="number" value={formData.order}
                  onChange={e => setFormData({ ...formData, order: e.target.value })}
                  min="1" required />
              </div>
              <div className="form-field">
                <label>Link to Product <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400,textTransform:'none'}}>( optional )</span></label>
                <select value={formData.productId} onChange={e => setFormData({ ...formData, productId: e.target.value })}>
                  <option value="">— No product link —</option>
                  {products.map(p => (
                    <option key={p.id} value={String(p.id)}>{p.name.trim()} ({p.category})</option>
                  ))}
                </select>
              </div>
              <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
                <button type="button" className="admin-btn cancel-btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={loading}>
                  {loading ? <><span className="spinner" /> Saving...</> : (editingSlider ? '✓ Update Slider' : '+ Add Slider')}
                </button>
              </div>
            </form>
          )}

          <div className="sliders-grid">
            {sliders.length === 0 ? (
              <div className="slider-empty">
                <span>🖼️</span>
                <p>No sliders yet. Add your first slider!</p>
              </div>
            ) : sliders.map(slider => (
              <div key={slider.id} className="slider-card">
                <div className="slider-img-wrap">
                  <img src={slider.desktop || slider.imageUrl} alt={slider.title} />
                  <span className="slider-order-badge">#{slider.order}</span>
                </div>
                <div className="slider-info">
                  <h3>{slider.title}</h3>
                  {slider.heading && <p className="slider-heading-preview">{slider.heading}</p>}
                  {slider.tag && <span className="slider-tag-preview">{slider.tag}</span>}
                  {slider.productName && <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.78rem',margin:'0.3rem 0 0'}}>🔗 {slider.productName}</p>}
                  <p>Order: {slider.order}</p>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => handleEdit(slider)}>✏️ Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(slider.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminSliders;
