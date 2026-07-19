import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './context/CartContext'
import { UserAuthProvider } from './context/UserAuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Login from './pages/Login'
import CustomerLogin from './pages/CustomerLogin'
import UserDashboard from './pages/UserDashboard'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'
import AdminCustomers from './pages/AdminCustomers'
import AdminProducts from './pages/AdminProducts'
import AdminSliders from './pages/AdminSliders'
import AdminOrders from './pages/AdminOrders'
import AdminCoupons from './pages/AdminCoupons'
import AdminCategories from './pages/AdminCategories'
import AdminSettings from './pages/AdminSettings'
import NotFound from './pages/NotFound'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import About from './pages/About'
import Policies from './pages/Policies'
import Search from './pages/Search'
import NewArrivals from './pages/NewArrivals'
import BestSellers from './pages/BestSellers'
import TrendingProducts from './pages/TrendingProducts'
import TopBanner from './components/TopBanner'
import { FaWhatsapp } from 'react-icons/fa';

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
        <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/admin/customers" element={<PageWrapper><AdminCustomers /></PageWrapper>} />
        <Route path="/admin/products" element={<PageWrapper><AdminProducts /></PageWrapper>} />
        <Route path="/admin/orders" element={<PageWrapper><AdminOrders /></PageWrapper>} />
        <Route path="/admin/coupons" element={<PageWrapper><AdminCoupons /></PageWrapper>} />
        <Route path="/admin/sliders" element={<PageWrapper><AdminSliders /></PageWrapper>} />
        <Route path="/admin/categories" element={<PageWrapper><AdminCategories /></PageWrapper>} />
        <Route path="/admin/settings" element={<PageWrapper><AdminSettings /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/privacy-policy" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/shipping-policy" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/refund-policy" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/cancellation-policy" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper><Policies /></PageWrapper>} />
        <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
        <Route path="/new-arrivals" element={<PageWrapper><NewArrivals /></PageWrapper>} />
        <Route path="/best-sellers" element={<PageWrapper><BestSellers /></PageWrapper>} />
        <Route path="/trending" element={<PageWrapper><TrendingProducts /></PageWrapper>} />
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

import AdminHeader from './components/AdminHeader';

function AppContent() {
  const location = useLocation();
  
  // Hide customer Header and Footer on admin routes and admin login
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';
  const isAdminPanel = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <div className="sticky-header-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', display: 'flex', flexDirection: 'column' }}>
        {!isAdminRoute && <TopBanner />}
        {!isAdminRoute && <Header />}
      </div>
      {isAdminPanel && <AdminHeader />}
      <AnimatedRoutes />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <BottomNav />}
      {!isAdminRoute && (
        <a 
          href="https://wa.me/918897030909" 
          className="whatsapp-float"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaWhatsapp size={24} />
          <span className="wa-text">Discuss Customizations<br/>on WhatsApp</span>
        </a>
      )}
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
