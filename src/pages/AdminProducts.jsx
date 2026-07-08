import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config';
import AdminHeader from '../components/AdminHeader';
import './AdminProducts.css';

const TAGS = [
  { value: 'bestseller',    label: '🔥 Best Seller' },
  { value: 'popular',       label: '⭐ Popular' },
  { value: 'new',           label: '🆕 New Arrival' },
  { value: 'offer',         label: '💰 Offer' },
  { value: 'trending',      label: '📈 Trending' },
  { value: 'limited',       label: '⏳ Limited Edition' },
];

const EMPTY_COLOR = { name: '', hex: '#ffffff', images: ['', '', ''], stock: {} };

const INIT_FORM = {
  name: '', category: '', gender: '', styleTags: [],
  grams: [], prices: {}, originalPrices: {},
  description: '', washingInstructions: '', tag: '',
  colors: [{ ...EMPTY_COLOR }],
  festiveSeason: false,
  reviews: [],
};

const AdminProducts = () => {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inlineEditId, setInlineEditId]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [formData, setFormData]       = useState(INIT_FORM);
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGender, setFilterGender]     = useState('');
  const [filterTag, setFilterTag]           = useState('');
  const [filterStock, setFilterStock]       = useState('all');
  const [sortBy, setSortBy]                 = useState('name-asc');
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [stockModal, setStockModal]   = useState(null);
  const [addStockQty, setAddStockQty] = useState('');
  const [stockModalColor, setStockModalColor] = useState(0);
  const [stockModalSize, setStockModalSize]   = useState('');
  const [previewId, setPreviewId]     = useState(null);
  const inlineFormRef = useRef(null);
  const navigate = useNavigate();

  const activeCategoryObj = categories.find(c => c.name === formData.category);
  const weightOptions = activeCategoryObj?.sizes || [];
  const styleOptions = activeCategoryObj?.styles || [];

  useEffect(() => { 
    verifyToken(); 
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/api/categories`);
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await axios.get(`${config.API_URL}/api/users/verify`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) fetchProducts();
      else { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
    } catch (err) {
      if (err.response?.status === 404) fetchProducts();
      else { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.API_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data.success ? res.data.products : Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const numericPrices = {}, numericOriginalPrices = {};
      Object.keys(formData.prices).forEach(k => { numericPrices[k] = Number(formData.prices[k]); });
      Object.keys(formData.originalPrices).forEach(k => { numericOriginalPrices[k] = Number(formData.originalPrices[k]); });

      const productData = {
        ...formData,
        prices: numericPrices,
        originalPrices: numericOriginalPrices,
        price: Object.values(numericPrices)[0] || 0,
        stock: formData.stock !== '' ? Number(formData.stock) : null,
        images: formData.colors[0]?.images?.filter(Boolean) || [],
      };

      if (editingProduct) {
        await axios.put(`${config.API_URL}/api/products/${editingProduct.id}`, productData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Product updated!', { autoClose: 1500 });
      } else {
        await axios.post(`${config.API_URL}/api/products`, productData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Product added!', { autoClose: 1500 });
      }
      fetchProducts(); resetForm();
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
      else toast.error('Error: ' + (err.response?.data?.message || err.message), { autoClose: 1500 });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.API_URL}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Deleted!', { autoClose: 1500 }); fetchProducts();
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
      else toast.error('Error: ' + err.message, { autoClose: 1500 });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setInlineEditId(product.id);
    setPreviewId(null);
    setFormData({
      name: product.name, category: product.category,
      gender: product.gender || '', styleTags: product.styleTags || [],
      grams: product.grams || [], prices: product.prices || {},
      originalPrices: product.originalPrices || {},
      description: product.description, washingInstructions: product.washing_instructions || '', tag: product.tag || '', stock: product.stock ?? '', festiveSeason: product.festiveSeason || false, reviews: product.reviews || [],
      colors: product.colors?.length
        ? product.colors.map(c => ({ name: c.name || '', hex: c.hex || '#ffffff', images: c.images || ['','',''], stock: c.stock || {} }))
        : [{ name: '', hex: '#ffffff', images: product.images || ['','',''], stock: {} }],
    });
    setShowForm(false);
    setTimeout(() => inlineFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const resetForm = () => { setFormData(INIT_FORM); setEditingProduct(null); setInlineEditId(null); setShowForm(false); };

  const handleAddStock = async () => {
    if (!addStockQty || Number(addStockQty) <= 0 || !stockModalSize) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${config.API_URL}/api/products/${stockModal.id || stockModal._id}/stock`,
        { colorIndex: stockModalColor, size: stockModalSize, add: Number(addStockQty) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Added ${addStockQty} units to ${stockModal.colors?.[stockModalColor]?.name || 'Color'} / ${stockModalSize}!`, { autoClose: 1500 });
      setStockModal(null); setAddStockQty(''); setStockModalSize('');
      fetchProducts();
    } catch { toast.error('Failed to update stock'); }
  };

  const handleWeightToggle = (weight) => {
    setFormData(prev => {
      const newGrams = prev.grams.includes(weight) ? prev.grams.filter(w => w !== weight) : [...prev.grams, weight];
      const newPrices = { ...prev.prices }, newOriginalPrices = { ...prev.originalPrices };
      if (!newGrams.includes(weight)) { delete newPrices[weight]; delete newOriginalPrices[weight]; }
      return { ...prev, grams: newGrams, prices: newPrices, originalPrices: newOriginalPrices };
    });
  };

  const handleReviewAdd = () => setFormData(prev => ({ ...prev, reviews: [...(prev.reviews || []), { user: '', rating: 5, comment: '', date: new Date().toISOString() }] }));
  const handleReviewRemove = (i) => setFormData(prev => ({ ...prev, reviews: (prev.reviews || []).filter((_, idx) => idx !== i) }));
  const handleReviewUpdate = (i, field, value) => setFormData(prev => ({
    ...prev,
    reviews: (prev.reviews || []).map((r, idx) => idx === i ? { ...r, [field]: value } : r)
  }));

  const addColor = () => setFormData(prev => ({ ...prev, colors: [...prev.colors, { ...EMPTY_COLOR }] }));

  const removeColor = (ci) => setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== ci) }));

  const updateColor = (ci, field, value) => setFormData(prev => ({
    ...prev,
    colors: prev.colors.map((c, i) => i === ci ? { ...c, [field]: value } : c),
  }));

  const updateColorImage = (ci, imgIdx, value) => setFormData(prev => ({
    ...prev,
    colors: prev.colors.map((c, i) => {
      if (i !== ci) return c;
      const imgs = [...c.images];
      imgs[imgIdx] = value;
      return { ...c, images: imgs };
    }),
  }));

  const handleFileUpload = async (e, ci, imgIdx) => {
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
        updateColorImage(ci, imgIdx, res.data.url);
        toast.success('Image uploaded successfully!', { autoClose: 1500 });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image.', { autoClose: 2000 });
    }
  };

  const updateColorStock = (ci, size, value) => setFormData(prev => ({
    ...prev,
    colors: prev.colors.map((c, i) =>
      i !== ci ? c : { ...c, stock: { ...c.stock, [size]: value === '' ? '' : Number(value) } }
    ),
  }));

  const calcDiscount = (orig, sale) => {
    const o = Number(orig), s = Number(sale);
    if (!o || !s || o <= s) return null;
    return Math.round(((o - s) / o) * 100);
  };

  const getMinPrice = (product) => {
    if (product?.prices && typeof product.prices === 'object') {
      const vals = Object.values(product.prices).map(Number).filter(v => !Number.isNaN(v));
      return vals.length ? Math.min(...vals) : 0;
    }
    return Number(product?.price) || 0;
  };

  const getStockMeta = (product) => {
    let total = 0;
    let hasData = false;
    let hasLow = false;
    let hasColorData = false;
    (product.colors || []).forEach(c => {
      Object.values(c.stock || {}).forEach(qty => {
        if (qty === '' || qty === null || qty === undefined) return;
        const n = Number(qty);
        if (Number.isNaN(n)) return;
        hasColorData = true;
        hasData = true;
        total += n;
        if (n <= 5) hasLow = true;
      });
    });
    if (!hasColorData) {
      const qty = product?.stock;
      if (qty !== '' && qty !== null && qty !== undefined) {
        const n = Number(qty);
        if (!Number.isNaN(n)) {
          hasData = true;
          total = n;
          if (n <= 5) hasLow = true;
        }
      }
    }
    return { total, hasData, hasLow };
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterGender('');
    setFilterTag('');
    setFilterStock('all');
    setSortBy('name-asc');
  };

  const togglePreview = (id) => {
    setPreviewId(prev => (prev === id ? null : id));
  };

  const filteredProducts = products.filter(p => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || p.name?.toLowerCase().includes(term);
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesGender = !filterGender || p.gender === filterGender;
    const matchesTag = !filterTag || p.tag === filterTag;
    const meta = getStockMeta(p);
    const matchesStock =
      filterStock === 'all'
        ? true
        : filterStock === 'low'
          ? meta.hasLow
          : filterStock === 'out'
            ? meta.hasData && meta.total === 0
            : filterStock === 'in'
              ? !meta.hasData || meta.total > 0
              : true;
    return matchesSearch && matchesCategory && matchesGender && matchesTag && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
    if (sortBy === 'price-asc') return getMinPrice(a) - getMinPrice(b);
    if (sortBy === 'price-desc') return getMinPrice(b) - getMinPrice(a);
    if (sortBy === 'stock-asc') return getStockMeta(a).total - getStockMeta(b).total;
    if (sortBy === 'stock-desc') return getStockMeta(b).total - getStockMeta(a).total;
    return 0;
  });

  const lowStockCount = products.filter(p => getStockMeta(p).hasLow).length;

  return (
    <>
      <AdminHeader />
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="admin-page">
        <div className="admin-content">

          <div className="admin-actions-bar">
            <h1 className="admin-page-title">📦 Products</h1>
            <button className="admin-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Add Product'}
            </button>
          </div>

          <div className="admin-stats">
            <div className="stat-card"><span className="stat-icon">📦</span><h3>{products.length}</h3><p>Total Products</p></div>
            <div className="stat-card"><span className="stat-icon">🏷️</span><h3>{new Set(products.map(p => p.category)).size}</h3><p>Categories</p></div>
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <h3>₹{products.reduce((sum, p) => {
                if (p.prices && typeof p.prices === 'object') return sum + Object.values(p.prices).reduce((s, pr) => s + Number(pr), 0);
                return sum + (p.price || 0);
              }, 0).toLocaleString()}</h3>
              <p>Inventory Value</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⚠️</span>
              <h3>{lowStockCount}</h3>
              <p>Low Stock Alerts</p>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="toolbar-left">
              <div className="toolbar-field search-field">
                <input
                  type="text"
                  placeholder="Search product name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔎</span>
              </div>
              <div className="toolbar-field">
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="toolbar-field">
                <select value={filterGender} onChange={e => setFilterGender(e.target.value)}>
                  <option value="">All Genders</option>
                  {['Men', 'Women', 'Children'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="toolbar-field">
                <select value={filterTag} onChange={e => setFilterTag(e.target.value)}>
                  <option value="">All Tags</option>
                  {TAGS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="toolbar-field">
                <select value={filterStock} onChange={e => setFilterStock(e.target.value)}>
                  <option value="all">All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
              <div className="toolbar-field">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="name-asc">Sort: Name (A–Z)</option>
                  <option value="name-desc">Sort: Name (Z–A)</option>
                  <option value="price-asc">Sort: Price (Low–High)</option>
                  <option value="price-desc">Sort: Price (High–Low)</option>
                  <option value="stock-asc">Sort: Stock (Low–High)</option>
                  <option value="stock-desc">Sort: Stock (High–Low)</option>
                </select>
              </div>
              {(searchTerm || filterCategory || filterGender || filterTag || filterStock !== 'all') && (
                <button type="button" className="clear-filters-btn" onClick={clearFilters}>Clear Filters</button>
              )}
            </div>
            <div className="toolbar-right">
              <button type="button" className="btn btn-secondary" onClick={async () => {
                const token = localStorage.getItem('token');
                if(!token) return;
                try {
                  toast.info('Seeding reviews...');
                  for(let p of products) {
                    if(!p.reviews || p.reviews.length === 0) {
                      const dummyReviews = [{ user: 'Anita S.', rating: 5, comment: 'Absolutely love this product! The quality is amazing.', date: new Date().toISOString() }, { user: 'Priya M.', rating: 4, comment: 'Very nice, fits perfectly.', date: new Date().toISOString() }];
                      await axios.put(`${config.API_URL}/api/products/${p.id || p._id}`, { ...p, reviews: dummyReviews }, { headers: { Authorization: `Bearer ${token}` } });
                    }
                  }
                  toast.success('Reviews seeded!'); fetchProducts();
                } catch(e) { toast.error('Failed to seed reviews.'); }
              }}>Seed Reviews</button>
              <div className="toolbar-count">
                Showing <strong>{sortedProducts.length}</strong> of <strong>{products.length}</strong>
              </div>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="product-form">

              {/* Name */}
              <div className="form-field">
                <label>Product Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              {/* Category */}
              <div className="form-field">
                <label>Category *</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value, styleTags: [], grams: [], prices: {} })} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Gender */}
              <div className="form-field">
                <label>Gender *</label>
                <div className="gender-options">
                  {['Men', 'Women', 'Children'].map(g => (
                    <label key={g} className={`gender-option ${formData.gender === g ? 'active' : ''}`}>
                      <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={() => setFormData({ ...formData, gender: g })} required />
                      <span>{g === 'Men' ? '👨' : g === 'Women' ? '👩' : '👦'}</span>{g}
                    </label>
                  ))}
                </div>
              </div>

              {/* Style Tags - multi select */}
              <div className="form-field full-width">
                <label>Style <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(select multiple)</span></label>
                {!formData.category || styleOptions.length === 0
                  ? <div className="size-hint">Select a category with styles defined first</div>
                  : (
                    <div className="style-tag-options">
                      {styleOptions.map(s => (
                        <button type="button" key={s}
                          className={`style-tag-btn ${formData.styleTags.includes(s) ? 'active' : ''}`}
                          onClick={() => {
                            if (formData.styleTags.includes(s)) {
                              setFormData({ ...formData, styleTags: formData.styleTags.filter(t => t !== s) });
                            } else {
                              setFormData({ ...formData, styleTags: [...formData.styleTags, s] });
                            }
                          }}
                        >{s}</button>
                      ))}
                    </div>
                  )
                }
              </div>

              {/* Sizes */}
              <div className="form-field">
                <label>Sizes *</label>
                {!formData.category || weightOptions.length === 0 ? <div className="size-hint">Select a category with sizes defined first</div> : (
                  <div className="custom-dropdown">
                    <div className="dropdown-header" onClick={() => setShowWeightDropdown(!showWeightDropdown)}>
                      {formData.grams.length > 0 ? formData.grams.join(', ') : `Select sizes`}
                    </div>
                    {showWeightDropdown && (
                      <div className="dropdown-list">
                        {weightOptions.map(size => (
                          <label key={size} className="dropdown-item">
                            <input type="checkbox" checked={formData.grams.includes(size)} onChange={() => handleWeightToggle(size)} />{size}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Prices */}
              <div className="form-field full-width">
                <label>Prices (₹) *</label>
                <div className="price-inputs">
                  {formData.grams.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0, fontSize: '0.88rem' }}>Select sizes first</p>}
                  {formData.grams.map(size => {
                    const disc = calcDiscount(formData.originalPrices[size], formData.prices[size]);
                    return (
                      <div key={size} className="price-input-row">
                        <span>{size}</span>
                        <div className="price-input-group">
                          <input type="number" value={formData.originalPrices[size] || ''} onChange={e => setFormData(prev => ({ ...prev, originalPrices: { ...prev.originalPrices, [size]: e.target.value } }))} placeholder="MRP" />
                          <input type="number" value={formData.prices[size] || ''} onChange={e => setFormData(prev => ({ ...prev, prices: { ...prev.prices, [size]: e.target.value } }))} placeholder="Sale Price" required />
                          {disc && <span className="discount-pill">-{disc}%</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="form-field full-width">
                <label>Description *</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
              </div>

              {/* Washing Instructions */}
              <div className="form-field full-width">
                <label>Washing Instructions</label>
                <textarea value={formData.washingInstructions} onChange={e => setFormData({ ...formData, washingInstructions: e.target.value })} placeholder="e.g., Dry clean only, Do not bleach..." />
              </div>

              {/* Festive Season */}
              <div className="form-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.festiveSeason} onChange={e => setFormData({ ...formData, festiveSeason: e.target.checked })} />
                  <label>Festive Season Collection</label>
                </label>
              </div>

              {/* Reviews Section */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Customer Reviews</h3>
                  <button type="button" className="add-btn" onClick={handleReviewAdd}>+ Add Review</button>
                </div>
                {formData.reviews && formData.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {formData.reviews.map((rev, i) => (
                      <div key={i} className="review-edit-box">
                        <div className="review-edit-row">
                          <input type="text" placeholder="Reviewer Name" value={rev.user} onChange={e => handleReviewUpdate(i, 'user', e.target.value)} required />
                          <select value={rev.rating} onChange={e => handleReviewUpdate(i, 'rating', Number(e.target.value))}>
                            <option value={5}>5 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={2}>2 Stars</option>
                            <option value={1}>1 Star</option>
                          </select>
                          <button type="button" className="del-btn" onClick={() => handleReviewRemove(i)}>✕</button>
                        </div>
                        <textarea placeholder="Review Comment" value={rev.comment} onChange={e => handleReviewUpdate(i, 'comment', e.target.value)} required rows="2" />
                      </div>
                    ))}
                  </div>
                ) : <p className="no-colors-msg">No reviews added yet.</p>}
              </div>

              {/* Style Tags */}
              <div className="form-field">
                <label>Style Tags</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[{ value: 'new', label: 'New Arrival' }, { value: 'trending', label: 'Trending' }, { value: 'bestseller', label: 'Best Seller' }].map(t => (
                    <label key={t.value} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.styleTags.includes(t.value)}
                        onChange={(e) => {
                          const updatedTags = e.target.checked
                            ? [...formData.styleTags, t.value]
                            : formData.styleTags.filter(tag => tag !== t.value);
                          setFormData({ ...formData, styleTags: updatedTags });
                        }}
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="form-field">
                <label>Stock Quantity</label>
                <input
                  type="number" min="0" placeholder="e.g. 50 (leave blank for unlimited)"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>

              {/* Colors + Images */}
              <div className="form-field full-width">
                <label>Colors & Images *</label>
                <div className="colors-section">
                  {formData.colors.map((color, ci) => (
                    <div key={ci} className="color-block">
                      <div className="color-block-header">
                        <span className="color-block-num">Color {ci + 1}</span>
                        <div className="color-name-row">
                          <input
                            type="text" placeholder="Color name (e.g. Red)"
                            value={color.name}
                            onChange={e => updateColor(ci, 'name', e.target.value)}
                            className="color-name-input"
                          />
                          <div className="color-picker-wrap">
                            <input type="color" value={color.hex} onChange={e => updateColor(ci, 'hex', e.target.value)} className="color-picker" />
                            <span className="color-hex">{color.hex}</span>
                          </div>
                        </div>
                        {formData.colors.length > 1 && (
                          <button type="button" className="remove-color-btn" onClick={() => removeColor(ci)}>✕ Remove</button>
                        )}
                      </div>
                      <div className="color-images">
                        {[0, 1, 2].map(imgIdx => (
                          <div key={imgIdx} className="image-upload-wrapper" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                            <input
                              type="url"
                              placeholder={`Image ${imgIdx + 1} URL`}
                              value={color.images[imgIdx] || ''}
                              onChange={e => updateColorImage(ci, imgIdx, e.target.value)}
                              required={imgIdx === 0}
                              style={{ flex: 1 }}
                            />
                            <label className="admin-btn" style={{ padding: '0 1rem', cursor: 'pointer', margin: 0, height: '40px' }}>
                              Upload
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, ci, imgIdx)} />
                            </label>
                          </div>
                        ))}
                      </div>
                      {/* Stock per size */}
                      {formData.grams.length > 0 && (
                        <div className="color-stock-section">
                          <span className="color-stock-label">Stock per size</span>
                          <div className="color-stock-grid">
                            {formData.grams.map(size => (
                              <div key={size} className="color-stock-row">
                                <span className="color-stock-size">{size}</span>
                                <input
                                  type="number" min="0"
                                  placeholder="qty"
                                  value={color.stock?.[size] ?? ''}
                                  onChange={e => updateColorStock(ci, size, e.target.value)}
                                  className="color-stock-input"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="button" className="add-color-btn" onClick={addColor}>+ Add Color</button>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="admin-btn cancel-btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={loading}>
                  {loading ? <><span className="spinner" />{editingProduct ? 'Updating...' : 'Adding...'}</> : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          )}

          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Tag</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <span>📦</span>
                      <p>{products.length === 0 ? 'No products yet.' : 'No products match your filters.'}</p>
                    </div>
                  </td>
                </tr>
              ) : sortedProducts.map(product => (
                <>
                  <tr key={product.id} className="product-row" onClick={() => togglePreview(product.id)}>
                    <td><img src={product.images?.[0] || product.colors?.[0]?.images?.[0]} alt={product.name} /></td>
                    <td className="product-name-cell">{product.name}</td>
                    <td><span className="category-badge">{product.category}</span></td>
                    <td>
                      <div className="price-list">
                        {product.prices && typeof product.prices === 'object'
                          ? Object.entries(product.prices).map(([size, price]) => {
                            const orig = product.originalPrices?.[size];
                            const disc = calcDiscount(orig, price);
                            return (
                              <div key={size} className="price-list-row">
                                <span className="price-size">{size}</span>
                                {orig && Number(orig) > Number(price) && <span className="price-original">₹{orig}</span>}
                                <strong className="price-sale">₹{price}</strong>
                                {disc && <span className="discount-pill">-{disc}%</span>}
                              </div>
                            );
                          })
                          : <strong className="price-sale">₹{product.price || 0}</strong>}
                      </div>
                    </td>
                    <td>
                      <div className="action-btns">
                        {(() => {
                          const meta = getStockMeta(product);
                          return (
                            <div className="ac-stock-mini">
                              {!meta.hasData ? <span className="stock-pill unlimited">Unlimited</span> : <span className="stock-total">Qty {meta.total}</span>}
                              {meta.hasLow && meta.total !== 0 && <span className="stock-pill low">Low</span>}
                              {meta.hasData && meta.total === 0 && <span className="stock-pill out">Out</span>}
                              {meta.hasData && meta.total > 0 && !meta.hasLow && <span className="stock-pill in">In Stock</span>}
                              <button
                                className="ac-add-stock-btn"
                                onClick={(e) => { e.stopPropagation(); setStockModal(product); setAddStockQty(''); }}
                                title="Add Stock"
                              >
                                + Stock
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td>{product.tag ? <span className="tag-badge">{TAGS.find(t => t.value === product.tag)?.label || product.tag}</span> : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}</td>
                    <td>
                      <div className="action-btns">
                        <button className={`edit-btn ${inlineEditId === product.id ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); inlineEditId === product.id ? resetForm() : handleEdit(product); }}>
                          {inlineEditId === product.id ? '✕ Close' : '✏️ Edit'}
                        </button>
                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                  {previewId === product.id && (
                    <tr className="product-preview-row">
                      <td colSpan="7">
                        <div className="product-preview-card">
                          <div className="preview-grid">
                            <div className="preview-section">
                              <div className="preview-label">Gender</div>
                              <div className="preview-value">
                                <span className={`gender-badge gender-${(product.gender || '').toLowerCase()}`}>
                                  {product.gender === 'Men' ? '👨' : product.gender === 'Women' ? '👩' : product.gender === 'Children' ? '👦' : '—'} {product.gender || '—'}
                                </span>
                              </div>
                            </div>
                            <div className="preview-section">
                              <div className="preview-label">Sizes</div>
                              <div className="preview-value">{Array.isArray(product.grams) ? product.grams.join(', ') : product.grams || '—'}</div>
                            </div>
                            <div className="preview-section">
                              <div className="preview-label">Style</div>
                              <div className="preview-value">
                                {product.styleTags?.length
                                  ? product.styleTags.map(s => <span key={s} className="style-badge">{s}</span>)
                                  : <span className="muted">—</span>}
                              </div>
                            </div>
                            <div className="preview-section">
                              <div className="preview-label">Colors</div>
                              <div className="preview-value">
                                <div className="color-swatches-admin">
                                  {(product.colors || []).map((c, i) => (
                                    <span key={i} className="color-swatch-admin" style={{ background: c.hex }} title={c.name} />
                                  ))}
                                  {(!product.colors || product.colors.length === 0) && <span className="muted">—</span>}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="preview-prices">
                            <div className="preview-label">Price Breakdown</div>
                            <div className="price-list">
                              {product.prices && typeof product.prices === 'object'
                                ? Object.entries(product.prices).map(([size, price]) => {
                                  const orig = product.originalPrices?.[size];
                                  const disc = calcDiscount(orig, price);
                                  return (
                                    <div key={size} className="price-list-row">
                                      <span className="price-size">{size}</span>
                                      {orig && Number(orig) > Number(price) && <span className="price-original">₹{orig}</span>}
                                      <strong className="price-sale">₹{price}</strong>
                                      {disc && <span className="discount-pill">-{disc}%</span>}
                                    </div>
                                  );
                                })
                                : <strong className="price-sale">₹{product.price || 0}</strong>}
                            </div>
                          </div>

                          <div className="preview-stock">
                            <div className="preview-label">Stock Breakdown</div>
                            <div className="ac-stock-breakdown">
                              {(product.colors || []).map((c, ci) => (
                                <div key={ci} className="ac-stock-color-row">
                                  <span className="ac-stock-color-dot" style={{ background: c.hex }} />
                                  <span className="ac-stock-color-name">{c.name || `C${ci+1}`}:</span>
                                  {Object.entries(c.stock || {}).length > 0
                                    ? Object.entries(c.stock).map(([size, qty]) => (
                                        <span key={size} className={`ac-stock-size-qty ${Number(qty) <= 5 ? 'low' : ''}`}>{size}:{qty}</span>
                                      ))
                                    : <span className="muted">∞</span>}
                                </div>
                              ))}
                              {(!product.colors || product.colors.length === 0) && <span className="muted">∞</span>}
                            </div>
                          </div>

                          <div className="preview-section">
                            <div className="preview-label">Description</div>
                            <div className="preview-value preview-desc">{product.description || '—'}</div>
                          </div>
                          
                          <div className="preview-section">
                            <div className="preview-label">Washing Instructions</div>
                            <div className="preview-value preview-desc">{product.washing_instructions || '—'}</div>
                          </div>

                          <div className="preview-section">
                            <div className="preview-label">Images</div>
                            <div className="preview-images">
                              {(product.images?.length ? product.images : product.colors?.[0]?.images || []).filter(Boolean).map((img, idx) => (
                                <img key={idx} src={img} alt={`${product.name} ${idx + 1}`} />
                              ))}
                              {(!product.images?.length && !product.colors?.[0]?.images?.length) && <span className="muted">—</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {inlineEditId === product.id && (
                    <tr key={`edit-${product.id}`} className="inline-edit-row">
                      <td colSpan="7">
                        <div ref={inlineFormRef} className="inline-edit-wrap">
                          <form onSubmit={handleSubmit} className="product-form">

                            <div className="form-field">
                              <label>Product Name *</label>
                              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>

                            <div className="form-field">
                              <label>Category *</label>
                              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value, styleTags: [], grams: [], prices: {} })} required>
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                              </select>
                            </div>

                            <div className="form-field">
                              <label>Gender *</label>
                              <div className="gender-options">
                                {['Men', 'Women', 'Children'].map(g => (
                                  <label key={g} className={`gender-option ${formData.gender === g ? 'active' : ''}`}>
                                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={() => setFormData({ ...formData, gender: g })} required />
                                    <span>{g === 'Men' ? '👨' : g === 'Women' ? '👩' : '👦'}</span>{g}
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="form-field full-width">
                              <label>Style</label>
                              {!formData.category || styleOptions.length === 0
                                ? <div className="size-hint">Select a category with styles defined first</div>
                                : (
                                  <div className="style-tag-options">
                                    {styleOptions.map(s => (
                                      <button type="button" key={s}
                                        className={`style-tag-btn ${formData.styleTags.includes(s) ? 'active' : ''}`}
                                        onClick={() => {
                                          if (formData.styleTags.includes(s)) {
                                            setFormData({ ...formData, styleTags: formData.styleTags.filter(t => t !== s) });
                                          } else {
                                            setFormData({ ...formData, styleTags: [...formData.styleTags, s] });
                                          }
                                        }}
                                      >{s}</button>
                                    ))}
                                  </div>
                                )
                              }
                            </div>

                            <div className="form-field">
                              <label>Sizes *</label>
                              {!formData.category || weightOptions.length === 0 ? <div className="size-hint">Select a category with sizes defined first</div> : (
                                <div className="custom-dropdown">
                                  <div className="dropdown-header" onClick={() => setShowWeightDropdown(!showWeightDropdown)}>
                                    {formData.grams.length > 0 ? formData.grams.join(', ') : 'Select sizes'}
                                  </div>
                                  {showWeightDropdown && (
                                    <div className="dropdown-list">
                                      {weightOptions.map(size => (
                                        <label key={size} className="dropdown-item">
                                          <input type="checkbox" checked={formData.grams.includes(size)} onChange={() => handleWeightToggle(size)} />{size}
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="form-field full-width">
                              <label>Prices (₹) *</label>
                              <div className="price-inputs">
                                {formData.grams.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0, fontSize: '0.88rem' }}>Select sizes first</p>}
                                {formData.grams.map(size => {
                                  const disc = calcDiscount(formData.originalPrices[size], formData.prices[size]);
                                  return (
                                    <div key={size} className="price-input-row">
                                      <span>{size}</span>
                                      <div className="price-input-group">
                                        <input type="number" value={formData.originalPrices[size] || ''} onChange={e => setFormData(prev => ({ ...prev, originalPrices: { ...prev.originalPrices, [size]: e.target.value } }))} placeholder="MRP" />
                                        <input type="number" value={formData.prices[size] || ''} onChange={e => setFormData(prev => ({ ...prev, prices: { ...prev.prices, [size]: e.target.value } }))} placeholder="Sale Price" required />
                                        {disc && <span className="discount-pill">-{disc}%</span>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="form-field full-width">
                              <label>Description *</label>
                              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>

                            <div className="form-field full-width">
                              <label>Washing Instructions</label>
                              <textarea value={formData.washingInstructions} onChange={e => setFormData({ ...formData, washingInstructions: e.target.value })} placeholder="e.g., Dry clean only, Do not bleach..." />
                            </div>

                            <div className="form-field">
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.festiveSeason} onChange={e => setFormData({ ...formData, festiveSeason: e.target.checked })} />
                                <label>Festive Season Collection</label>
                              </label>
                            </div>
                            
                            {/* Inline Reviews */}
                            <div className="form-section inline-reviews">
                              <div className="section-header">
                                <h3>Customer Reviews</h3>
                                <button type="button" className="add-btn" onClick={handleReviewAdd}>+ Add Review</button>
                              </div>
                              {formData.reviews && formData.reviews.length > 0 && (
                                <div className="reviews-list inline">
                                  {formData.reviews.map((rev, i) => (
                                    <div key={i} className="review-edit-box">
                                      <div className="review-edit-row">
                                        <input type="text" placeholder="Reviewer Name" value={rev.user} onChange={e => handleReviewUpdate(i, 'user', e.target.value)} required />
                                        <select value={rev.rating} onChange={e => handleReviewUpdate(i, 'rating', Number(e.target.value))}>
                                          <option value={5}>5 Stars</option>
                                          <option value={4}>4 Stars</option>
                                          <option value={3}>3 Stars</option>
                                          <option value={2}>2 Stars</option>
                                          <option value={1}>1 Star</option>
                                        </select>
                                        <button type="button" className="del-btn" onClick={() => handleReviewRemove(i)}>✕</button>
                                      </div>
                                      <textarea placeholder="Review Comment" value={rev.comment} onChange={e => handleReviewUpdate(i, 'comment', e.target.value)} required rows="2" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="form-field">
                              <label>Style Tags</label>
                              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {[{ value: 'new', label: 'New Arrival' }, { value: 'trending', label: 'Trending' }, { value: 'bestseller', label: 'Best Seller' }].map(t => (
                                  <label key={t.value} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                                    <input
                                      type="checkbox"
                                      checked={formData.styleTags.includes(t.value)}
                                      onChange={(e) => {
                                        const updatedTags = e.target.checked
                                          ? [...formData.styleTags, t.value]
                                          : formData.styleTags.filter(tag => tag !== t.value);
                                        setFormData({ ...formData, styleTags: updatedTags });
                                      }}
                                    />
                                    {t.label}
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="form-field full-width">
                              <label>Colors & Images *</label>
                              <div className="colors-section">
                                {formData.colors.map((color, ci) => (
                                  <div key={ci} className="color-block">
                                    <div className="color-block-header">
                                      <span className="color-block-num">Color {ci + 1}</span>
                                      <div className="color-name-row">
                                        <input type="text" placeholder="Color name" value={color.name} onChange={e => updateColor(ci, 'name', e.target.value)} className="color-name-input" />
                                        <div className="color-picker-wrap">
                                          <input type="color" value={color.hex} onChange={e => updateColor(ci, 'hex', e.target.value)} className="color-picker" />
                                          <span className="color-hex">{color.hex}</span>
                                        </div>
                                      </div>
                                      {formData.colors.length > 1 && (
                                        <button type="button" className="remove-color-btn" onClick={() => removeColor(ci)}>✕ Remove</button>
                                      )}
                                    </div>
                                    <div className="color-images">
                                      {[0, 1, 2].map(imgIdx => (
                                        <div key={imgIdx} className="image-upload-wrapper" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                          <input type="url" placeholder={`Image ${imgIdx + 1} URL`} value={color.images[imgIdx] || ''} onChange={e => updateColorImage(ci, imgIdx, e.target.value)} required={imgIdx === 0} style={{ flex: 1 }} />
                                          <label className="admin-btn" style={{ padding: '0 1rem', cursor: 'pointer', margin: 0, height: '40px' }}>
                                            Upload
                                            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, ci, imgIdx)} />
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    {formData.grams.length > 0 && (
                                      <div className="color-stock-section">
                                        <span className="color-stock-label">Stock per size</span>
                                        <div className="color-stock-grid">
                                          {formData.grams.map(size => (
                                            <div key={size} className="color-stock-row">
                                              <span className="color-stock-size">{size}</span>
                                              <input type="number" min="0" placeholder="qty" value={color.stock?.[size] ?? ''} onChange={e => updateColorStock(ci, size, e.target.value)} className="color-stock-input" />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                <button type="button" className="add-color-btn" onClick={addColor}>+ Add Color</button>
                              </div>
                            </div>

                            <div className="form-actions">
                              <button type="button" className="admin-btn cancel-btn" onClick={resetForm}>Cancel</button>
                              <button type="submit" className="admin-btn" disabled={loading}>
                                {loading ? <><span className="spinner" />Updating...</> : 'Update Product'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>

        </div>
      </div>
      {/* ── Add Stock Modal ── */}
      {stockModal && (
        <div className="ac-modal-overlay" onClick={() => { setStockModal(null); setAddStockQty(''); setStockModalSize(''); }}>
          <div className="ac-modal ac-stock-modal" onClick={e => e.stopPropagation()}>
            <h3>📦 Add Stock</h3>
            <p className="ac-modal-product">{stockModal.name}</p>

            {/* Color selector */}
            {stockModal.colors?.length > 0 && (
              <div className="ac-modal-section">
                <label>Select Color</label>
                <div className="ac-modal-color-btns">
                  {stockModal.colors.map((c, ci) => (
                    <button key={ci} type="button"
                      className={`ac-modal-color-btn ${stockModalColor === ci ? 'active' : ''}`}
                      onClick={() => { setStockModalColor(ci); setStockModalSize(''); }}
                    >
                      <span style={{ background: c.hex }} className="ac-modal-color-dot" />
                      {c.name || `Color ${ci + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {stockModal.grams?.length > 0 && (
              <div className="ac-modal-section">
                <label>Select Size</label>
                <div className="ac-modal-size-btns">
                  {(Array.isArray(stockModal.grams) ? stockModal.grams : [stockModal.grams]).map(size => {
                    const currentQty = stockModal.colors?.[stockModalColor]?.stock?.[size] ?? '∞';
                    return (
                      <button key={size} type="button"
                        className={`ac-modal-size-btn ${stockModalSize === size ? 'active' : ''}`}
                        onClick={() => setStockModalSize(size)}
                      >
                        <span>{size}</span>
                        <span className={`ac-modal-size-qty ${Number(currentQty) <= 5 ? 'low' : ''}`}>{currentQty}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty input */}
            <div className="ac-modal-section">
              <label>Units to Add</label>
              <div className="ac-modal-input-row">
                <input
                  type="number" min="1" placeholder="e.g. 10"
                  value={addStockQty}
                  onChange={e => setAddStockQty(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddStock()}
                  disabled={!stockModalSize}
                />
                <button className="admin-btn" onClick={handleAddStock}
                  disabled={!addStockQty || Number(addStockQty) <= 0 || !stockModalSize}>
                  Add
                </button>
              </div>
              {!stockModalSize && <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',margin:'0.4rem 0 0'}}>Select a size first</p>}
            </div>

            <button className="ac-modal-cancel" onClick={() => { setStockModal(null); setAddStockQty(''); setStockModalSize(''); }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;
