import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// Shared in-memory product list — no localStorage, no size limits
let _products = [];
export const setProductsList = (list) => { _products = list; };
const findProduct = (id) => _products.find(p => String(p.id) === String(id));

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  const cacheProducts = (list) => setProductsList(list);

  const addToCart = (productId, weight, color = null) => {
    const token = localStorage.getItem('az_token');
    if (!token) {
      toast.error('Please login to add items to your cart.');
      navigate('/customer-login', { state: { from: window.location.pathname } });
      return;
    }
    const colorKey = color ? `${color.name || color.hex}` : '';
    const cartKey = `${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`;
    const safeColor = color ? { name: color.name || '', hex: color.hex || '' } : null;
    const product = findProduct(productId);
    const colorObj = color ? product?.colors?.find(c => c.name === color.name || c.hex === color.hex) : null;
    const stock = colorObj?.stock?.[weight];
    const maxQty = stock !== undefined ? Number(stock) : Infinity;
    setCart(prev => {
      const current = prev[cartKey]?.quantity || 0;
      if (current >= maxQty) return prev;
      return { ...prev, [cartKey]: { productId, weight, color: safeColor, quantity: current + 1 } };
    });
  };

  const updateQuantity = (productId, weight, change, color = null) => {
    const colorKey = color ? `${color.name || color.hex}` : '';
    const cartKey = `${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`;
    setCart(prev => {
      const current = prev[cartKey];
      if (!current) return prev;
      const newQty = current.quantity + change;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[cartKey];
        return next;
      }
      return { ...prev, [cartKey]: { ...current, quantity: newQty } };
    });
  };

  const clearCart = () => setCart({});

  const getCartCount = () => Object.values(cart).reduce((s, i) => s + i.quantity, 0);

  const isInCart = (productId, weight, color = null) => {
    const colorKey = color ? `${color.name || color.hex}` : '';
    return !!cart[`${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`];
  };

  const getCartQuantity = (productId, weight, color = null) => {
    const colorKey = color ? `${color.name || color.hex}` : '';
    return cart[`${productId}-${weight}${colorKey ? `-${colorKey}` : ''}`]?.quantity || 0;
  };

  // Keep productsCache for Checkout backward compat
  const productsCache = _products;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getCartCount, isInCart, getCartQuantity, productsCache, cacheProducts }}>
      {children}
    </CartContext.Provider>
  );
};
