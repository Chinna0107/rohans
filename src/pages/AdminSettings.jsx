import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import config from '../config';
import AdminHeader from '../components/AdminHeader';
import './AdminSettings.css';

const AdminSettings = () => {
  const [topBannerText, setTopBannerText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/settings`);
      const data = await response.json();
      if (data.success && data.settings) {
        setTopBannerText(data.settings.top_banner_text || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key: 'top_banner_text', value: topBannerText })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Settings updated successfully');
      } else {
        toast.error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-content">
        <div className="admin-header-actions">
          <h2>Site Settings</h2>
        </div>

        <div className="settings-container">
          <form className="settings-form" onSubmit={handleSave}>
            <div className="form-group">
              <label>Top Scrolling Banner Text</label>
              <input
                type="text"
                value={topBannerText}
                onChange={(e) => setTopBannerText(e.target.value)}
                placeholder="e.g. Order for above 499 to get free delivery. Leave empty to hide."
                className="form-control"
              />
              <small className="form-text">Leave this empty to hide the top banner entirely.</small>
            </div>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
