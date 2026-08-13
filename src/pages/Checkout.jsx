import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import axios from 'axios';
import { MdArrowBack, MdLocalShipping, MdVerified, MdLock, MdDelete, MdCheckCircle } from 'react-icons/md';
import config from '../config';
import './Checkout.css';

const STEPS = ['Confirm Bag', 'Your Details', 'Payment'];

const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const Checkout = () => {
  const { cart, updateQuantity, clearCart, productsCache, cacheProducts } = useCart();
  const { customer, token: customerToken } = useUserAuth();
  const navigate = useNavigate();
  const [allProducts, setAllProducts]   = useState(productsCache);
  const [step, setStep]                 = useState(0);
  const [formData, setFormData]         = useState({ name: '', phone: '', email: '', address: '' });
  const [placing, setPlacing]           = useState(false);
  const [orderDone, setOrderDone]       = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [locating, setLocating]         = useState(false);

  // Auto-fill from logged-in customer profile
  useEffect(() => {
    if (customer) {
      const savedAddress = Array.isArray(customer.addresses) && customer.addresses.length > 0
        ? customer.addresses[0]
        : '';
      setFormData(prev => ({
        name:    prev.name    || customer.name  || '',
        phone:   prev.phone   || customer.phone || '',
        email:   prev.email   || customer.email || '',
        address: prev.address || (typeof savedAddress === 'object' 
          ? [savedAddress.line1, savedAddress.city, savedAddress.state, savedAddress.pincode].filter(Boolean).join(', ')
          : savedAddress) || '',
      }));
    }
  }, [customer]);

  const getLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const a = data.address || {};
          const parts = [
            a.house_number,
            a.road || a.pedestrian || a.footway,
            a.neighbourhood || a.suburb,
            a.city || a.town || a.village || a.county,
            a.state,
            a.postcode,
          ].filter(Boolean);
          setFormData(prev => ({ ...prev, address: parts.join(', ') }));
        } catch {
          alert('Could not fetch address. Please enter manually.');
        } finally { setLocating(false); }
      },
      () => { alert('Location access denied. Please enter address manually.'); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Coupon
  const [couponCode, setCouponCode]     = useState('');
  const [couponInput, setCouponInput]   = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponType, setCouponType]     = useState(''); // 'percent' | 'flat'
  const [couponMsg, setCouponMsg]       = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    axios.get(`${config.API_URL}/api/products`)
      .then(res => {
        const list = res.data.success ? res.data.products : Array.isArray(res.data) ? res.data : [];
        if (list.length) { setAllProducts(list); cacheProducts(list); }
      }).catch(() => {});
  }, []);

  const cartItems = Object.values(cart).map(item => {
    const product = allProducts.find(p => String(p.id) === String(item.productId));
    if (!product) return null;
    const price = product.prices?.[item.weight] || product.price || 0;
    const orig  = product.originalPrices?.[item.weight];
    // resolve color image
    const colorImages = item.color
      ? product.colors?.find(c => c.name === item.color.name || c.hex === item.color.hex)?.images
      : null;
    const displayImage = colorImages?.[0] || product.images?.[0] || '';
    return { ...product, quantity: item.quantity, selectedWeight: item.weight, selectedPrice: price, origPrice: orig, selectedColor: item.color, displayImage };
  }).filter(Boolean);

  const subtotal     = cartItems.reduce((s, i) => s + i.selectedPrice * i.quantity, 0);
  const totalSavings = cartItems.reduce((s, i) => {
    const o = Number(i.origPrice), p = Number(i.selectedPrice);
    return o > p ? s + (o - p) * i.quantity : s;
  }, 0);

  // Coupon discount amount
  const couponAmount = couponDiscount > 0
    ? couponType === 'percent' ? Math.max(1, Math.floor(subtotal * couponDiscount / 100)) : Math.min(couponDiscount, subtotal)
    : 0;
  const finalTotal = Math.max(subtotal - couponAmount, 0);

  const isDetailsValid = formData.name && formData.phone && formData.email && formData.address;

  // ── Apply Coupon ──
  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true); setCouponMsg('');
    try {
      const res = await axios.post(`${config.API_URL}/api/coupons/validate`, {
        code: couponInput.trim().toUpperCase(),
        subtotal,
        phone: formData.phone || '',
      });
      if (res.data.valid) {
        const disc = res.data.discount;
        const type = res.data.type;
        const amount = type === 'percent'
          ? Math.max(1, Math.floor(subtotal * disc / 100))
          : Math.min(disc, subtotal);
        setCouponCode(couponInput.trim().toUpperCase());
        setCouponDiscount(disc);
        setCouponType(type);
        setCouponMsg(`✅ Coupon applied! You save ₹${amount}`);
      } else {
        setCouponMsg(`❌ ${res.data.message || 'Invalid coupon'}`);
        setCouponDiscount(0); setCouponCode('');
      }
    } catch {
      setCouponMsg('❌ Failed to validate coupon. Try again.');
      setCouponDiscount(0); setCouponCode('');
    } finally { setCouponLoading(false); }
  };

  const removeCoupon = () => {
    setCouponCode(''); setCouponInput(''); setCouponDiscount(0); setCouponType(''); setCouponMsg('');
  };

  // ── Build order payload ──
  const buildOrderPayload = (paymentInfo = {}) => {
    return {
      customer: { name: formData.name, phone: formData.phone, email: formData.email, address: formData.address },
      items: cartItems.map(i => ({
        productId: i.id, name: i.name, category: i.category,
        size: i.selectedWeight,
        color: i.selectedColor || null,
        quantity: i.quantity, price: i.selectedPrice,
        total: i.selectedPrice * i.quantity,
        image: i.displayImage,
      })),
      subtotal,
      couponCode: couponCode || null,
      couponDiscount: couponAmount,
      totalSavings,
      finalTotal,
      paymentMethod: paymentInfo.method || 'razorpay',
      paymentStatus: paymentInfo.status || 'pending',
      razorpayPaymentId: paymentInfo.razorpayPaymentId || null,
      razorpayOrderId:   paymentInfo.razorpayOrderId   || null,
      razorpaySignature: paymentInfo.razorpaySignature  || null,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    };
  };

  const saveOrder = async (payload) => {
    try {
      const res = await axios.post(`${config.API_URL}/api/orders`, payload);
      // Decrease stock per color+size for each ordered item
      await Promise.allSettled(
        payload.items.map(item =>
          axios.patch(`${config.API_URL}/api/products/${item.productId}/stock`, {
            colorName: item.color?.name || null,
            colorHex: item.color?.hex || null,
            size: item.size,
            decrease: item.quantity,
          })
        )
      );
      // Record coupon usage
      if (payload.couponCode && payload.customer.phone) {
        await axios.post(`${config.API_URL}/api/coupons/use`, {
          code: payload.couponCode,
          phone: payload.customer.phone,
          orderId: res.data.orderId,
        });
      }
    } catch { /* silent */ }
  };

  // ── Razorpay ──
  const handleRazorpay = async () => {
    setPlacing(true);
    const ok = await loadRazorpay();
    if (!ok) { alert('Failed to load Razorpay.'); setPlacing(false); return; }
    try {
      const { data } = await axios.post(`${config.API_URL}/api/orders/razorpay/create`, { amount: finalTotal });
      if (!data.success) throw new Error('Order creation failed');
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: 'INR',
        name: 'ROHANS MATCHING CENTER',
        description: `Order of ${cartItems.length} item(s)`,
        order_id: data.order.id,
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        notes: { address: formData.address },
        theme: { color: '#e1782d' },
        handler: async (response) => {
          const verify = await axios.post(`${config.API_URL}/api/orders/razorpay/verify`, {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          });
          if (!verify.data.verified) { alert('Payment verification failed!'); setPlacing(false); return; }
          const payload = buildOrderPayload({ method: 'razorpay', status: 'paid', razorpayPaymentId: response.razorpay_payment_id, razorpayOrderId: response.razorpay_order_id, razorpaySignature: response.razorpay_signature });
          await saveOrder(payload);
          setOrderDetails({ ...payload, items: cartItems });
          clearCart(); setOrderDone(true); setPlacing(false);
        },
        modal: { ondismiss: () => setPlacing(false) },
      };
      new window.Razorpay(options).open();
    } catch { alert('Error initiating payment.'); setPlacing(false); }
  };

  // ── Mini Summary (reused in steps 1 & 2) ──
  const MiniSummary = () => (
    <div className="co-mini-summary glass">
      <h3>Order Summary</h3>
      <div className="co-mini-items">
        {cartItems.map((item, i) => (
          <div key={i} className="co-mini-item">
            <img src={item.displayImage} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <span>
                {item.selectedWeight}
                {item.selectedColor && <span className="co-mini-color" style={{ background: item.selectedColor.hex }} title={item.selectedColor.name} />}
                × {item.quantity}
              </span>
            </div>
            <strong>₹{item.selectedPrice * item.quantity}</strong>
          </div>
        ))}
      </div>
      <div className="co-mini-total">
        {totalSavings > 0 && <div className="co-sum-row savings"><span>🎉 Savings</span><span>−₹{totalSavings}</span></div>}
        {couponAmount > 0 && <div className="co-sum-row savings"><span>🏷️ Coupon ({couponCode})</span><span>−₹{couponAmount}</span></div>}
        <div className="co-sum-row"><span>Delivery</span><span className="co-free">FREE</span></div>
        <div className="co-sum-total"><span>Total</span><span>₹{finalTotal}</span></div>
      </div>
    </div>
  );

  // ── Success ──
  if (orderDone && orderDetails) return (
    <div className="co-success-page">
      <div className="co-success-container">
        <div className="co-success-header">
          <div className="co-success-icon-wrap"><MdCheckCircle className="co-success-icon" /></div>
          <h1>Order Placed Successfully! 🎉</h1>
          <p className="co-success-sub">Thank you, <strong>{orderDetails.customer.name}</strong>! Your order has been received.</p>
          {orderDetails.razorpayPaymentId && <div className="co-success-txn"><span>Payment ID:</span> <strong>{orderDetails.razorpayPaymentId}</strong></div>}
        </div>
        <div className="co-success-grid">
          <div className="co-success-items glass">
            <h3>🛍️ Your Items</h3>
            <div className="co-success-item-list">
              {orderDetails.items.map((item, i) => (
                <div key={i} className="co-success-item">
                  <img src={item.displayImage || item.image} alt={item.name} />
                  <div className="co-success-item-info">
                    <p>{item.name}</p>
                    <span>
                      {item.selectedWeight || item.size}
                      {item.selectedColor && <span className="co-mini-color" style={{ background: item.selectedColor.hex }} title={item.selectedColor.name} />}
                      × {item.quantity}
                    </span>
                  </div>
                  <strong>₹{item.selectedPrice * item.quantity}</strong>
                </div>
              ))}
            </div>
            <div className="co-success-totals">
              {orderDetails.totalSavings > 0 && <div className="co-success-row savings"><span>🎉 You Saved</span><span>−₹{orderDetails.totalSavings}</span></div>}
              {orderDetails.couponDiscount > 0 && <div className="co-success-row savings"><span>🏷️ Coupon ({orderDetails.couponCode})</span><span>−₹{orderDetails.couponDiscount}</span></div>}
              <div className="co-success-row"><span>Delivery</span><span className="co-free">FREE</span></div>
              <div className="co-success-total-row"><span>Total Paid</span><span>₹{orderDetails.finalTotal}</span></div>
            </div>
          </div>
          <div className="co-success-right">
            <div className="co-success-delivery glass">
              <h3>📍 Delivery Details</h3>
              <p><span>Name</span><strong>{orderDetails.customer.name}</strong></p>
              <p><span>Phone</span><strong>{orderDetails.customer.phone}</strong></p>
              <p><span>Email</span><strong>{orderDetails.customer.email}</strong></p>
              <p><span>Address</span><strong>{orderDetails.customer.address}</strong></p>
            </div>
            <div className="co-success-payment glass">
              <h3>💳 Payment Info</h3>
              <p><span>Method</span><strong>Online (Razorpay)</strong></p>
              <p><span>Status</span><strong className={orderDetails.paymentStatus === 'paid' ? 'co-paid' : 'co-pending'}>{orderDetails.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</strong></p>
            </div>
            <div className="co-success-msg glass">
              <p>🚚 Delivered within <strong>2–3 business days</strong>.</p>
              <p>📞 We'll call <strong>{orderDetails.customer.phone}</strong> to confirm.</p>
            </div>
            <button className="co-success-shop-btn" onClick={() => navigate('/products')}>Continue Shopping →</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Empty Cart ──
  if (cartItems.length === 0 && allProducts.length > 0) return (
    <div className="co-empty">
      <span>🛍️</span><h2>Your bag is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <button onClick={() => navigate('/products')}>← Continue Shopping</button>
    </div>
  );

  return (
    <div className="co-page">
      <div className="co-container">

        <nav className="co-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span><span>›</span>
          <span onClick={() => navigate('/products')}>Shop</span><span>›</span>
          <span className="co-bc-active">Checkout</span>
        </nav>

        {/* Stepper */}
        <div className="co-stepper">
          {STEPS.map((label, i) => (
            <div key={i} className={`co-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="co-step-circle">{i < step ? <MdCheckCircle /> : <span>{i + 1}</span>}</div>
              <span className="co-step-label">{label}</span>
              {i < STEPS.length - 1 && <div className={`co-step-line ${i < step ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        {/* ── Step 0: Confirm Cart ── */}
        {step === 0 && (
          <div className="co-step-content">
            <div className="co-items">
              {cartItems.map((item, idx) => {
                const disc = item.origPrice && Number(item.origPrice) > Number(item.selectedPrice)
                  ? Math.round(((Number(item.origPrice) - Number(item.selectedPrice)) / Number(item.origPrice)) * 100) : null;
                return (
                  <div key={idx} className="co-item glass">
                    <div className="co-item-img">
                      <img src={item.displayImage} alt={item.name} />
                      {disc && <span className="co-item-disc">-{disc}%</span>}
                    </div>
                    <div className="co-item-info">
                      <span className="co-item-cat">{item.category}</span>
                      <h3>{item.name}</h3>
                      <span className="co-item-size">
                        Size: {item.selectedWeight}
                        {item.selectedColor && (
                          <span className="co-item-color-dot" style={{ background: item.selectedColor.hex }} title={item.selectedColor.name} />
                        )}
                        {item.selectedColor?.name && <span className="co-item-color-name">{item.selectedColor.name}</span>}
                      </span>
                      <div className="co-item-price-row">
                        {item.origPrice && Number(item.origPrice) > Number(item.selectedPrice) && <span className="co-item-orig">₹{item.origPrice}</span>}
                        <span className="co-item-price">₹{item.selectedPrice}</span>
                      </div>
                    </div>
                    <div className="co-item-right">
                      <div className="co-qty">
                        <button onClick={() => updateQuantity(item.id, item.selectedWeight, -1, item.selectedColor)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedWeight, 1, item.selectedColor)}>+</button>
                      </div>
                      <span className="co-item-total">₹{item.selectedPrice * item.quantity}</span>
                      <button className="co-remove" onClick={() => updateQuantity(item.id, item.selectedWeight, -item.quantity, item.selectedColor)} title="Remove"><MdDelete /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="co-coupon glass">
              <h4>🏷️ Have a coupon?</h4>
              {couponCode ? (
                <div className="co-coupon-applied">
                  <span>✅ <strong>{couponCode}</strong> applied — saving ₹{couponAmount}</span>
                  <button className="co-coupon-remove" onClick={removeCoupon}>Remove</button>
                </div>
              ) : (
                <div className="co-coupon-row">
                  <input
                    type="text" placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponMsg(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                  />
                  <button className="co-coupon-btn" onClick={applyCoupon} disabled={couponLoading || !couponInput.trim()}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponMsg && <p className={`co-coupon-msg ${couponMsg.startsWith('✅') ? 'success' : 'error'}`}>{couponMsg}</p>}
            </div>

            <div className="co-summary-bar glass">
              <div className="co-summary-info">
                <span>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</span>
                {totalSavings > 0 && <span className="co-saving-pill">🎉 Saving ₹{totalSavings}</span>}
                {couponAmount > 0 && <span className="co-saving-pill">🏷️ −₹{couponAmount}</span>}
                <span className="co-sum-total-inline">Total: <strong>₹{finalTotal}</strong></span>
              </div>
              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => navigate('/products')}><MdArrowBack /> Back to Shop</button>
                <button className="co-next-btn" onClick={() => setStep(1)} disabled={cartItems.length === 0}>Proceed to Details →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 1: Delivery Details ── */}
        {step === 1 && (
          <div className="co-step-content co-details-grid">
            <div className="co-form-card glass">
              <h2>Delivery Details</h2>
              {customer && (
                <div style={{ fontSize: '0.8rem', color: '#16a34a', background: 'rgba(22,163,74,0.07)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: '8px', padding: '0.5rem 0.85rem', marginBottom: '1rem' }}>
                  ✓ Auto-filled from your profile. You can edit below.
                </div>
              )}
              <div className="co-form">
                {[
                  { key: 'name',    label: 'Full Name',       type: 'text',  icon: '👤', placeholder: 'Enter your name' },
                  { key: 'phone',   label: 'Phone Number',    type: 'tel',   icon: '📞', placeholder: '+91 XXXXX XXXXX' },
                  { key: 'email',   label: 'Email Address',   type: 'email', icon: '✉️', placeholder: 'you@example.com' },
                ].map(f => (
                  <div key={f.key} className="co-field">
                    <label>{f.label}</label>
                    <div className="co-input-wrap">
                      <span className="co-input-icon">{f.icon}</span>
                      <input type={f.type} placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                    </div>
                  </div>
                ))}
                <div className="co-field">
                  <label>
                    Delivery Address
                    <button type="button" className="co-locate-btn" onClick={getLocation} disabled={locating}>
                      {locating ? <><span className="co-spinner" /> Locating...</> : '📍 Use My Location'}
                    </button>
                  </label>
                  {/* Saved Addresses Selector */}
                  {customer && Array.isArray(customer.addresses) && customer.addresses.length > 0 && (
                    <div style={{ marginBottom: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>Saved Addresses:</span>
                      {customer.addresses.map((addr, idx) => {
                        const addrStr = typeof addr === 'object'
                          ? [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')
                          : addr;
                        return (
                          <button key={idx} type="button"
                            onClick={() => setFormData({ ...formData, address: addrStr })}
                            style={{
                              textAlign: 'left', background: formData.address === addrStr ? '#111' : 'rgba(0,0,0,0.04)',
                              border: `1px solid ${formData.address === addrStr ? '#111' : 'rgba(0,0,0,0.12)'}`,
                              color: formData.address === addrStr ? '#fff' : '#333',
                              borderRadius: '10px', padding: '0.5rem 0.8rem',
                              fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit',
                              transition: 'all 0.2s ease',
                            }}>
                            📍 {addrStr}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="co-input-wrap">
                    <span className="co-input-icon" style={{ top: '0.9rem' }}>📍</span>
                    <textarea placeholder="House no, Street, City, Pincode" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={3} />
                  </div>
                </div>
              </div>
              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => setStep(0)}><MdArrowBack /> Back</button>
                <button className="co-next-btn" onClick={() => setStep(2)} disabled={!isDetailsValid}>Proceed to Payment →</button>
              </div>
            </div>
            <MiniSummary />
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <div className="co-step-content co-details-grid">
            <div className="co-form-card glass">
              <h2>Payment</h2>
              <div className="co-pay-methods">
                <div className="co-pay-option selected">
                  <div className="co-pay-radio" />
                  <div className="co-pay-info"><strong>💳 Pay Online</strong><span>UPI, Cards, Net Banking via Razorpay</span></div>
                  <div className="co-pay-badges"><span>UPI</span><span>Visa</span><span>MC</span><span>Net Banking</span></div>
                </div>
              </div>
              <div className="co-recap glass">
                <p><span>👤</span> {formData.name}</p>
                <p><span>📞</span> {formData.phone}</p>
                <p><span>✉️</span> {formData.email}</p>
                <p><span>📍</span> {formData.address}</p>
              </div>
              <div className="co-step-actions">
                <button className="co-back-btn" onClick={() => setStep(1)}><MdArrowBack /> Back</button>
                <button className="co-place-btn" onClick={handleRazorpay} disabled={placing}>
                  {placing ? <><span className="co-spinner" /> Processing...</> : `💳 Pay ₹${finalTotal}`}
                </button>
              </div>
              <p className="co-secure-note"><MdLock /> Secured & encrypted checkout</p>
            </div>
            <MiniSummary />
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
