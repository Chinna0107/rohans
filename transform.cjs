const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminProducts.jsx', 'utf8');

// 1. INIT_FORM
content = content.replace(
  "description: '', washingInstructions: '', tag: '',",
  "description: '', washingInstructions: '', tag: '', videoUrl: '',"
);

// 2. handleEdit
content = content.replace(
  "description: product.description, washingInstructions: product.washing_instructions || '', tag: product.tag || '', stock: product.stock ?? '', festiveSeason: product.festiveSeason || false, reviews: product.reviews || [],",
  "description: product.description, washingInstructions: product.washing_instructions || '', tag: product.tag || '', stock: product.stock ?? '', videoUrl: product.videoUrl || '', festiveSeason: product.festiveSeason || false, reviews: product.reviews || [],"
);
content = content.replace(
  "setShowForm(false);\n    setTimeout(() => inlineFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);",
  "setShowForm(true);"
);

// 3. Form fields (Add videoUrl)
content = content.replace(
  /(\{\/\* Stock \*\/\}(.|\n)*?<\/div>)/,
  `$1\n\n              {/* Video URL */}\n              <div className="form-field full-width">\n                <label>Product Video URL</label>\n                <input\n                  type="url" placeholder="e.g. https://res.cloudinary.com/.../video.mp4"\n                  value={formData.videoUrl}\n                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}\n                />\n              </div>`
);

// 4. Modal wrap
content = content.replace(
  `{showForm && (\n            <form onSubmit={handleSubmit} className="product-form">`,
  `{showForm && (\n            <div className="ac-modal-overlay form-modal-overlay">\n              <div className="ac-modal form-modal">\n                <div className="modal-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>\n                  <h2 style={{margin:0,fontSize:'1.5rem',color:'var(--gold)'}}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>\n                  <button type="button" onClick={resetForm} style={{background:'none',border:'none',color:'white',fontSize:'1.5rem',cursor:'pointer'}}>✕</button>\n                </div>\n                <form onSubmit={handleSubmit} className="product-form">`
);

content = content.replace(
  `</button>\n              </div>\n            </form>\n          )}`,
  `</button>\n              </div>\n                </form>\n              </div>\n            </div>\n          )}`
);

// 5. Replace table
const tableStart = content.indexOf('<table className="products-table">');
const tableEnd = content.indexOf('</table>') + '</table>'.length;
if (tableStart !== -1 && tableEnd !== -1 && tableEnd > tableStart) {
  const gridHtml = `
          <div className="products-grid">
            {sortedProducts.length === 0 ? (
              <div className="empty-state">
                <span>📦</span>
                <p>{products.length === 0 ? 'No products yet.' : 'No products match your filters.'}</p>
              </div>
            ) : sortedProducts.map(product => {
              const meta = getStockMeta(product);
              return (
                <div key={product.id} className="hor-product-card" onClick={() => handleEdit(product)}>
                  <div className="hor-product-image-container">
                    {product.images?.[0] || product.colors?.[0]?.images?.[0] ? (
                      <img src={product.images?.[0] || product.colors?.[0]?.images?.[0]} alt={product.name} />
                    ) : (
                      <div className="hor-no-image">No Image</div>
                    )}
                    {product.tag && (
                      <span className="hor-product-badge">{TAGS.find(t => t.value === product.tag)?.label || product.tag}</span>
                    )}
                    <div className="hor-product-actions">
                      <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(product); }}>✏️</button>
                      <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}>🗑️</button>
                    </div>
                  </div>
                  <div className="hor-product-details">
                    <div className="hor-product-header">
                      <div className="hor-product-title-wrap">
                        <h3 className="hor-product-title">{product.name}</h3>
                        <span className="hor-product-category">{product.category}</span>
                      </div>
                      <span className="hor-product-price">
                        ₹{product.price || (product.prices && Object.values(product.prices)[0]) || 0}
                      </span>
                    </div>
                    <p className="hor-product-desc">{product.description}</p>
                    <div className="hor-product-footer">
                      <div className="ac-stock-mini" onClick={(e) => e.stopPropagation()}>
                        {!meta.hasData ? <span className="stock-pill unlimited">Unlimited</span> : <span className="stock-total">Qty {meta.total}</span>}
                        {meta.hasLow && meta.total !== 0 && <span className="stock-pill low">Low</span>}
                        {meta.hasData && meta.total === 0 && <span className="stock-pill out">Out</span>}
                        {meta.hasData && meta.total > 0 && !meta.hasLow && <span className="stock-pill in">In Stock</span>}
                        <button className="ac-add-stock-btn" onClick={(e) => { e.stopPropagation(); setStockModal(product); setAddStockQty(''); }} title="Add Stock">+ Stock</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>`;
  content = content.substring(0, tableStart) + gridHtml + content.substring(tableEnd);
}

fs.writeFileSync('src/pages/AdminProducts.jsx', content);
console.log('AdminProducts.jsx transformed!');
