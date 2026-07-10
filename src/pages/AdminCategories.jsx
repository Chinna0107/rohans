import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import AdminHeader from '../components/AdminHeader';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [styles, setStyles] = useState('');
  const [sizes, setSizes] = useState('');
  const [isMeters, setIsMeters] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/categories`);
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return toast.error('Name is required');
    
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const parsedStyles = styles.split(',').map(s => s.trim()).filter(Boolean);
      const parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);

      const res = await axios.post(
        `${config.API_URL}/api/categories`,
        { name, description, styles: parsedStyles, sizes: parsedSizes, is_meters: isMeters },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Category created successfully');
        setName('');
        setDescription('');
        setStyles('');
        setSizes('');
        setIsMeters(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    const token = localStorage.getItem('token');
    
    try {
      const res = await axios.delete(`${config.API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Category deleted');
        fetchCategories();
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  return (
    <div className="admin-page category-page">

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="admin-content">
        <div className="admin-actions-bar">
          <h2 className="admin-page-title">Manage Categories</h2>
        </div>

        <div className="cat-layout">
          {/* Create Form */}
          <div className="cat-form-card">
            <h3>Add New Category</h3>
            <form onSubmit={handleCreate} className="cat-form">
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Accessories"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  placeholder="Short description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Styles (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Silk, Cotton"
                  value={styles}
                  onChange={(e) => setStyles(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Sizes (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L, Free Size"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                />
              </div>
              <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isMeters"
                  checked={isMeters}
                  onChange={(e) => setIsMeters(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="isMeters" style={{ margin: 0, cursor: 'pointer' }}>Sold by Meters</label>
              </div>
              <button type="submit" className="admin-btn submit-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Create Category'}
              </button>
            </form>
          </div>

          {/* List Categories */}
          <div className="cat-list-card">
            <h3>Existing Categories ({categories.length})</h3>
            {categories.length === 0 ? (
              <p className="no-data">No categories found.</p>
            ) : (
              <div className="cat-grid">
                {categories.map((cat) => (
                  <div key={cat.id} className="cat-item">
                    <div className="cat-info">
                      <h4>{cat.name}</h4>
                      {cat.description && <p>{cat.description}</p>}
                      <div className="cat-meta" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                        {cat.styles && cat.styles.length > 0 && <div><strong>Styles:</strong> {cat.styles.join(', ')}</div>}
                        {cat.sizes && cat.sizes.length > 0 && <div><strong>Sizes:</strong> {cat.sizes.join(', ')}</div>}
                        {cat.is_meters && <div><span style={{ color: '#2ecc71' }}>✓</span> Sold by Meters</div>}
                      </div>
                    </div>
                    <button className="del-btn" onClick={() => handleDelete(cat.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
