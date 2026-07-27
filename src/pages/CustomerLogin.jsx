import { useState } from 'react';
import config from '../config';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.jpeg';
import './CustomerLogin.css';

const CustomerLogin = () => {
  const [mode, setMode] = useState('otp'); // 'otp', 'password', 'signup', 'forgot'
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter otp/new password
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginCustomer } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectUrl = location.state?.from || '/';

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${config.API_URL}/api/auth/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) setStep(2);
      else setError(data.error);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${config.API_URL}/api/auth/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp })
      });
      const data = await res.json();
      if (res.ok) {
        loginCustomer(data.user, data.token);
        navigate(redirectUrl);
      } else setError(data.error);
    } catch (err) {
      setError('Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${config.API_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        loginCustomer(data.user, data.token);
        navigate(redirectUrl);
      } else setError(data.error);
    } catch (err) {
      setError('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSignupOtp = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${config.API_URL}/api/auth/send-signup-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, phone: formData.phone })
      });
      const data = await res.json();
      if (res.ok) setStep(2);
      else setError(data.error);
    } catch (err) {
      setError('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${config.API_URL}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password, otp: formData.otp })
      });
      const data = await res.json();
      if (res.ok) {
        loginCustomer(data.user, data.token);
        navigate(redirectUrl);
      } else setError(data.error);
    } catch (err) {
      setError('Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${config.API_URL}/api/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, newPassword: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        setMode('password');
        setStep(1);
        alert('Password reset successful! Please login.');
      } else setError(data.error);
    } catch (err) {
      setError('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const res = await fetch(`${config.API_URL}/api/auth/google`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userInfo.email, name: userInfo.name, googleId: userInfo.sub })
        });
        const data = await res.json();
        if (res.ok) {
          loginCustomer(data.user, data.token);
          navigate(redirectUrl);
        } else setError(data.error);
      } catch (err) {
        setError('Google login failed.');
      }
    },
    onError: () => setError('Google login failed.')
  });

  return (
    <div className="auth-page-centered">
      <motion.div 
        className="auth-cards-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left Card - Branding */}
        <div className="auth-left-card">
          <div className="auth-brand-content">
            <img src={logo} alt="ROHANS MATCHING CENTRE" className="auth-logo-img" />
            <h1><span className="l-alpha">Rohans</span> <span className="l-zone" style={{ fontSize: '1.2rem', display: 'block', marginTop: '0.2rem' }}>Matching Centre</span></h1>
            <p>Your premium luxury fashion destination.</p>
          </div>
        </div>

        {/* Right Card - Form */}
        <div className="auth-right-card">
          <AnimatePresence mode="wait">
            <motion.div 
              key={mode + step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="auth-form-inner"
            >
        <h2 className="auth-title">
          {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Welcome Back'}
        </h2>
        <p className="auth-subtitle">
          {mode === 'signup' ? 'Join ROHANS MATCHING CENTRE for exclusive benefits.' : mode === 'forgot' ? 'Enter your email to receive a reset code.' : 'Sign in to access your luxury shopping experience.'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-tabs">
          {mode !== 'signup' && (
            <>
              <button className={mode === 'otp' ? 'active' : ''} onClick={() => { setMode('otp'); setStep(1); }}>OTP Login</button>
              <button className={mode === 'password' ? 'active' : ''} onClick={() => setMode('password')}>Password</button>
            </>
          )}
        </div>

        {mode === 'otp' && (
          <form className="auth-form" onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInput} required disabled={step === 2} />
            </div>
            {step === 2 && (
              <div className="input-group">
                <label>Enter OTP sent to email</label>
                <input type="text" name="otp" value={formData.otp} onChange={handleInput} required />
              </div>
            )}
            <button type="submit" className="luxury-btn auth-submit" disabled={loading}>
              {loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Verify & Login'}
            </button>
            {step === 2 && <button type="button" className="auth-link" onClick={() => setStep(1)}>Use a different email</button>}
          </form>
        )}

        {mode === 'password' && (
          <form className="auth-form" onSubmit={handlePasswordLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInput} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInput} required />
            </div>
            <button type="button" className="auth-link forgot-btn" onClick={() => { setMode('forgot'); setStep(1); }}>Forgot Password?</button>
            <button type="submit" className="luxury-btn auth-submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form className="auth-form" onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInput} required disabled={step === 2} />
            </div>
            {step === 2 && (
              <>
                <div className="input-group">
                  <label>Enter OTP sent to email</label>
                  <input type="text" name="otp" value={formData.otp} onChange={handleInput} required />
                </div>
                <div className="input-group">
                  <label>New Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInput} required />
                </div>
              </>
            )}
            <button type="submit" className="luxury-btn auth-submit" disabled={loading}>
              {loading ? 'Processing...' : step === 1 ? 'Send Reset OTP' : 'Reset Password'}
            </button>
            <button type="button" className="auth-link" style={{ textAlign: 'center' }} onClick={() => setMode('password')}>Back to Login</button>
          </form>
        )}

        {mode === 'signup' && (
          <form className="auth-form" onSubmit={step === 1 ? handleSendSignupOtp : handleSignup}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInput} required disabled={step === 2} />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInput} required disabled={step === 2} />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInput} required disabled={step === 2} />
            </div>
            {step === 2 && (
              <>
                <div className="input-group">
                  <label>Enter OTP sent to email</label>
                  <input type="text" name="otp" value={formData.otp} onChange={handleInput} required />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInput} required />
                </div>
              </>
            )}
            <button type="submit" className="luxury-btn auth-submit" disabled={loading}>
              {loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Create Account'}
            </button>
            {step === 2 && <button type="button" className="auth-link" style={{ textAlign: 'center', width: '100%' }} onClick={() => setStep(1)}>Back</button>}
          </form>
        )}

        <div className="auth-divider"><span>OR</span></div>
        <button className="google-btn" onClick={() => googleLogin()}>
          <FcGoogle size={20} /> Continue with Google
        </button>

        <div className="auth-footer-toggle">
          {mode === 'signup' ? (
            <p>Already have an account? <span onClick={() => { setMode('otp'); setStep(1); }}>Log In</span></p>
          ) : (
            <p>Don't have an account? <span onClick={() => setMode('signup')}>Sign Up</span></p>
          )}
        </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLogin;
