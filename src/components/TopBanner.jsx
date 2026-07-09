import { useState, useEffect } from 'react';
import config from '../config';
import './TopBanner.css';

const TopBanner = () => {
  const [bannerText, setBannerText] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/settings`);
        const data = await response.json();
        if (data.success && data.settings && data.settings.top_banner_text) {
          setBannerText(data.settings.top_banner_text);
          document.documentElement.style.setProperty('--banner-height', '34px');
        } else {
          setBannerText('');
          document.documentElement.style.setProperty('--banner-height', '0px');
        }
      } catch (error) {
        console.error('Error fetching banner setting:', error);
        document.documentElement.style.setProperty('--banner-height', '0px');
      }
    };
    fetchSettings();
    
    return () => {
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, []);

  if (!bannerText) {
    return null;
  }

  return (
    <div className="top-banner">
      <div className="top-banner-content">
        <span>{bannerText}</span>
      </div>
    </div>
  );
};

export default TopBanner;
