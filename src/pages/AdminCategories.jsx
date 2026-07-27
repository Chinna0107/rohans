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
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      toast.info('Uploading image...', { autoClose: false, toastId: 'catImageUpload' });
      const res = await axios.post(`${config.API_URL}/api/upload`, uploadData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      if (res.data.success || res.data.url) {
        setImageUrl(res.data.imageUrl || res.data.url);
        toast.dismiss('catImageUpload');
        toast.success('Image uploaded successfully!', { autoClose: 1500 });
      }
    } catch (err) {
      toast.dismiss('catImageUpload');
      toast.error('Failed to upload image.', { autoClose: 2000 });
    }
  };

  const handleEdit = (cat) => {
    setEditCategoryId(cat.id);
    setName(cat.name || '');
    setDescription(cat.description || '');
    setStyles(cat.styles ? cat.styles.join(', ') : '');
    setSizes(cat.sizes ? cat.sizes.join(', ') : '');
    setIsMeters(cat.is_meters || false);
    setImageUrl(cat.image_url || '');
  };

  const resetForm = () => {
    setEditCategoryId(null);
    setName('');
    setDescription('');
    setStyles('');
    setSizes('');
    setIsMeters(false);
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error('Name is required');
    
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const parsedStyles = styles.split(',').map(s => s.trim()).filter(Boolean);
      const parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);

      let res;
      const payload = { name, description, styles: parsedStyles, sizes: parsedSizes, is_meters: isMeters, image_url: imageUrl };

      if (editCategoryId) {
        res = await axios.put(`${config.API_URL}/api/categories/${editCategoryId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        res = await axios.post(`${config.API_URL}/api/categories`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      
      if (res.data.success) {
        toast.success(editCategoryId ? 'Category updated successfully' : 'Category created successfully');
        resetForm();
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving category');
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
          {/* Create/Edit Form */}
          <div className="cat-form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{editCategoryId ? 'Edit Category' : 'Add New Category'}</h3>
              {editCategoryId && (
                <button type="button" onClick={resetForm} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="cat-form">
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
              <div className="form-group">
                <label>Category Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label className="admin-btn" style={{ cursor: 'pointer', padding: '0.5rem 1rem', background: '#000', color: '#fff', borderRadius: '4px' }}>
                    Upload Image
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                  </label>
                  {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />}
                </div>
              </div>
              <button type="submit" className="admin-btn submit-btn" disabled={loading}>
                {loading ? <span className="spinner" /> : (editCategoryId ? 'Update Category' : 'Create Category')}
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
                  <div key={cat.id} className="cat-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div className="cat-info" style={{ display: 'flex', gap: '1rem' }}>
                      {cat.image_url && <img src={cat.image_url} alt={cat.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0' }}>{cat.name}</h4>
                        {cat.description && <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{cat.description}</p>}
                        <div className="cat-meta" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                          {cat.styles && cat.styles.length > 0 && <div><strong>Styles:</strong> {cat.styles.join(', ')}</div>}
                          {cat.sizes && cat.sizes.length > 0 && <div><strong>Sizes:</strong> {cat.sizes.join(', ')}</div>}
                          {cat.is_meters && <div><span style={{ color: '#2ecc71' }}>✓</span> Sold by Meters</div>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="edit-btn" onClick={() => handleEdit(cat)} style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px', background: '#f0f0f0', cursor: 'pointer' }}>
                        ✏️ Edit
                      </button>
                      <button className="del-btn" onClick={() => handleDelete(cat.id)}>
                        Delete
                      </button>
                    </div>
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
