import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext'
import { UserAuthProvider } from './context/UserAuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import CustomerLogin from './pages/CustomerLogin'
import UserDashboard from './pages/UserDashboard'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import AdminProducts from './pages/AdminProducts'
import AdminSliders from './pages/AdminSliders'
import AdminOrders from './pages/AdminOrders'
import AdminCoupons from './pages/AdminCoupons'
import AdminCategories from './pages/AdminCategories'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import About from './pages/About'
import Policies from './pages/Policies'
import './App.css'

// Clear old localStorage product cache
try { localStorage.removeItem('az_products'); localStorage.removeItem('az_products_cache'); } catch {}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/customer-login" element={<PageWrapper><CustomerLogin /></PageWrapper>} />
        <Route path="/dashboard/*" element={<PageWrapper><UserDashboard /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
        <Route path="/products/:slug" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/admin/products" element={<PageWrapper><AdminProducts /></PageWrapper>} />
        <Route path="/admin/orders" element={<PageWrapper><AdminOrders /></PageWrapper>} />
        <Route path="/admin/coupons" element={<PageWrapper><AdminCoupons /></PageWrapper>} />
        <Route path="/admin/sliders" element={<PageWrapper><AdminSliders /></PageWrapper>} />
        <Route path="/admin/categories" element={<PageWrapper><AdminCategories /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/privacy-policy" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/shipping-policy" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/refund-policy" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  
  // Hide customer Header and Footer on admin routes and admin login
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <AnimatedRoutes />
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <UserAuthProvider>
          <AppContent />
          <ToastContainer position="top-right" autoClose={2000} />
        </UserAuthProvider>
      </CartProvider>
    </Router>
  )
}

export default App
