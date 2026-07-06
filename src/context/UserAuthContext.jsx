import { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';

const UserAuthContext = createContext();

export const useUserAuth = () => useContext(UserAuthContext);

export const UserAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    try { return JSON.parse(localStorage.getItem('az_customer') || 'null'); }
    catch { return null; }
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('az_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify session
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await fetch(`${config.API_URL}/api/customer/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCustomer(data);
            localStorage.setItem('az_customer', JSON.stringify(data));
          } else {
            logoutCustomer();
          }
        } catch (error) {
          console.error('Session verification failed', error);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const loginCustomer = (userData, authToken) => {
    localStorage.setItem('az_customer', JSON.stringify(userData));
    localStorage.setItem('az_token', authToken);
    setCustomer(userData);
    setToken(authToken);
  };

  const logoutCustomer = () => {
    localStorage.removeItem('az_customer');
    localStorage.removeItem('az_token');
    setCustomer(null);
    setToken(null);
  };

  const updateProfile = async (updates) => {
    try {
      const res = await fetch(`${config.API_URL}/api/customer/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        setCustomer(data);
        localStorage.setItem('az_customer', JSON.stringify(data));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateAddresses = async (addresses) => {
    try {
      const res = await fetch(`${config.API_URL}/api/customer/addresses`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ addresses })
      });
      if (res.ok) {
        const updatedAddresses = await res.json();
        const updatedCustomer = { ...customer, addresses: updatedAddresses };
        setCustomer(updatedCustomer);
        localStorage.setItem('az_customer', JSON.stringify(updatedCustomer));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <UserAuthContext.Provider value={{ customer, token, loading, loginCustomer, logoutCustomer, updateProfile, updateAddresses }}>
      {children}
    </UserAuthContext.Provider>
  );
};
