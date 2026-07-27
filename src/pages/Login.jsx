import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiKey } from 'react-icons/fi';
import logo from '../assets/logo.jpeg';
import config from '../config';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${config.API_URL}/api/users/login`, { email, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      } else {
        toast.error(response.data.message || 'Login failed');
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="login-card">
        {/* Left panel */}
        <div className="login-left">
          <div className="login-left-content">
            <img src={logo} alt="ROHANS MATCHING CENTRE" className="login-logo" />
            <h1><span className="l-alpha">Rohans</span> <span className="l-zone" style={{ fontSize: '1.2rem', display: 'block', marginTop: '0.2rem' }}>Matching Centre</span></h1>
            <p>Your exclusive destination for premium sarees, elegant kurtas, and luxury ethnic wear.</p>
            <div className="login-features">
              <div className="lf-item"><span>🥻</span> Premium Sarees</div>
              <div className="lf-item"><span>👕</span> Trendy Apparel</div>
              <div className="lf-item"><span>🚚</span> Fast Delivery</div>
              <div className="lf-item"><span>✅</span> Quality Assured</div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right">
          <div className="login-form-wrap">
            <div className="login-header">
              <h2>Admin Login</h2>
              <p>Sign in to manage your store</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field-group">
                <label>Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rohans.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label>Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <><span className="spinner" /> Signing in...</>
                ) : (
                  <><FiKey /> Sign In</>
                )}
              </button>
            </form>

            <div className="login-footer">
              <span>ROHANS MATCHING CENTRE Admin Panel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
