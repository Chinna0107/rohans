import { useLocation, Link } from 'react-router-dom';
import './Policies.css';

const POLICIES = {
  '/privacy-policy': {
    title: '🔒 Privacy Policy',
    lastUpdated: 'January 2026',
    sections: [
      {
        heading: 'Information We Collect',
        content: 'When you place an order or contact us, we collect your name, phone number, email address, and delivery address. We do not collect payment card details — all payments are processed securely via Razorpay or WhatsApp.',
      },
      {
        heading: 'How We Use Your Information',
        content: 'Your information is used solely to process and deliver your orders, send order confirmations, and respond to your queries. We do not sell, rent, or share your personal data with third parties for marketing purposes.',
      },
      {
        heading: 'Data Security',
        content: 'We take reasonable measures to protect your personal information. All data transmitted through our website is encrypted. However, no method of transmission over the internet is 100% secure.',
      },
      {
        heading: 'Cookies',
        content: 'Our website may use cookies to improve your browsing experience. These cookies do not store any personally identifiable information. You can disable cookies in your browser settings at any time.',
      },
      {
        heading: 'Third-Party Services',
        content: 'We use Razorpay for payment processing and WhatsApp for order communication. These services have their own privacy policies, and we encourage you to review them.',
      },
      {
        heading: 'Contact Us',
        content: 'If you have any questions about this Privacy Policy, please contact us at support@houseoframya.com or call +91 8885553249.',
      },
    ],
  },
  '/shipping-policy': {
    title: '🚚 Shipping Policy',
    lastUpdated: 'January 2026',
    sections: [
      {
        heading: 'Delivery Areas',
        content: 'We are delivering our products across all over India . For deliveries outside our standard zone, please contact us directly via WhatsApp or phone to confirm availability.',
      },
      {
        heading: 'Delivery Time',
        content: 'Orders are typically delivered within 2–3 business days from the date of confirmation. Orders placed on Sundays or public holidays will be processed the next business day.',
      },
      {
        heading: 'Delivery Charges',
        content: 'We offer FREE delivery on all orders within our standard delivery zone. For orders outside the zone, a nominal delivery charge may apply and will be communicated before confirmation.',
      },
      {
        heading: 'Order Confirmation',
        content: 'After placing your order via WhatsApp or our website, our team will call you to confirm the order details, delivery address, and estimated delivery time.',
      },
      {
        heading: 'Tracking Your Order',
        content: 'Currently, we do not offer real-time order tracking. However, you can always reach us on WhatsApp at +91 8885553249 for a status update on your order.',
      },
      {
        heading: 'Failed Delivery',
        content: 'If a delivery attempt fails due to an incorrect address or unavailability, we will contact you to reschedule. After two failed attempts, the order may be cancelled.',
      },
    ],
  },
  '/refund-policy': {
    title: '↩️ Refund & Return Policy',
    lastUpdated: 'January 2026',
    sections: [
       
      

      {
        heading: 'Return Eligibility',
        content: 'We accept returns within 7 days of delivery for items that are defective, damaged, or incorrect. Items must be unused, unwashed, and in their original packaging with all tags intact. Disclaimers: We do not accept returns for change of mind, fit issues, or if the item has been used, washed, or altered. And our live video are required for all returns. Please contact us on WhatsApp at +91 8885553249 to schedule a live video inspection of the item before initiating a return.',
      },
      {
        heading: 'Non-Returnable Items',
        content: 'Items that have been used, washed, or altered cannot be returned. Sale or discounted items are also non-returnable unless they arrive damaged or defective.',
      },
      {
        heading: 'Exchange Policy',
        content: 'We offer size exchanges within 7 days of delivery, subject to stock availability. To initiate an exchange, contact us via WhatsApp at +91 8885553249 with your order details and reason.',
      },
      {
        heading: 'Refund Process',
        content: 'Once your return is received and inspected, we will notify you of the approval or rejection. Approved refunds will be processed within 5–7 business days to your original payment method.',
      },
      {
        heading: 'Damaged or Wrong Items',
        content: 'If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with photos. We will arrange a replacement or full refund at no additional cost.',
      },
      {
        heading: 'How to Initiate a Return',
        content: 'Contact us on WhatsApp at +91 8885553249 or email support@houseoframya.com with your order number, item details, and reason for return. Our team will guide you through the process.',
      },
    ],
  },
  '/terms': {
    title: '📋 Terms & Conditions',
    lastUpdated: 'April 2026',
    sections: [
      {
        heading: 'Acceptance of Terms',
        content: 'By accessing or using the House of Ramya website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.',
      },
      {
        heading: 'Products & Pricing',
        content: 'All product descriptions, images, and prices are as accurate as possible. We reserve the right to modify prices, discontinue products, or correct errors at any time without prior notice.',
      },
      {
        heading: 'Order Placement',
        content: 'Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. An order is confirmed only after our team contacts you for verification.',
      },
      {
        heading: 'Payment',
        content: 'We accept payments via Razorpay (UPI, cards, net banking) and cash on delivery. All prices are in Indian Rupees (INR) and inclusive of applicable taxes.',
      },
      {
        heading: 'Intellectual Property',
        content: 'All content on this website — including logos, images, text, and design — is the property of House of Ramya and may not be reproduced or used without written permission.',
      },
      {
        heading: 'Limitation of Liability',
        content: 'House of Ramya shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our liability is limited to the value of the order placed.',
      },
      {
        heading: 'Governing Law',
        content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Sangareddy, Telangana.',
      },
      {
        heading: 'Changes to Terms',
        content: 'We reserve the right to update these Terms & Conditions at any time. Continued use of our services after changes constitutes acceptance of the revised terms.',
      },
    ],
  },
};

const NAV_LINKS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/shipping-policy', label: 'Shipping Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

const Policies = () => {
  const { pathname } = useLocation();
  const policy = POLICIES[pathname];

  if (!policy) return null;

  return (
    <div className="policy-page">
      <div className="policy-container">

        {/* Sidebar nav */}
        <aside className="policy-nav glass">
          <h4>Policies</h4>
          <ul>
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={pathname === l.to ? 'active' : ''}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <div className="policy-content glass">
          <h1>{policy.title}</h1>
          <p className="policy-updated">Last updated: {policy.lastUpdated}</p>
          <div className="policy-sections">
            {policy.sections.map((s, i) => (
              <div key={i} className="policy-section">
                <h2>{s.heading}</h2>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Policies;
