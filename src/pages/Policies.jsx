import { useLocation, Link } from 'react-router-dom';
import './Policies.css';

const POLICIES = {
  '/privacy-policy': {
    title: '🔒 Privacy Policy',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        content: 'We collect personal information that you voluntarily provide to us when registering on the website, expressing an interest in obtaining information about us or our products, or otherwise contacting us. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect may include the following: Names, Phone Numbers, Email Addresses, Mailing Addresses, Billing Addresses, and Contact Preferences. We do not process sensitive information or payment card details directly; all payments are processed securely via our payment partners (e.g., Razorpay).',
      },
      {
        heading: '2. How We Use Your Information',
        content: 'We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive to: Facilitate account creation and logon process, Fulfill and manage your orders, Deliver and facilitate delivery of services to the user, Respond to user inquiries/offer support to users, and Send you marketing and promotional communications (if you have opted in).',
      },
      {
        heading: '3. Will Your Information Be Shared With Anyone?',
        content: 'We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., shipping partners like Delhivery, payment processors like Razorpay, and communication tools like WhatsApp). We do not sell, rent, or trade any of your information with third parties for their promotional purposes.',
      },
      {
        heading: '4. Cookies and Tracking Technologies',
        content: 'We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice. These cookies do not store any personally identifiable information.',
      },
      {
        heading: '5. Data Retention and Security',
        content: 'We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.',
      },
      {
        heading: '6. Grievance Officer and Contact Us',
        content: 'In accordance with the Information Technology Act 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below. If you have any questions or comments about this notice, you may email us at thehouseoframya@gmail.com, call us at +91 8008007884, or contact us by post at: ROHANS MATCHING CENTRE, 13-6-586, P.K.Layout, Tirupati-517501, Andhra Pradesh, India.',
      },
    ],
  },
  '/shipping-policy': {
    title: '🚚 Shipping Policy',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. Shipping Areas and Partners',
        content: 'ROHANS MATCHING CENTRE delivers products across India using reliable courier partners. For deliveries to remote locations or outside our standard delivery zones, please contact us directly via WhatsApp or phone to confirm service availability before placing an order.',
      },
      {
        heading: '2. Processing and Dispatch Time',
        content: 'All orders are processed within 24 to 48 hours (excluding Sundays and public holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. In case of custom stitching or Maggam work orders, processing time may take an additional 3-5 business days depending on the complexity of the customization.',
      },
      {
        heading: '3. Delivery Timeframes',
        content: 'Standard delivery within India typically takes 3 to 7 business days from the date of dispatch, depending on your location. Metro cities usually receive orders within 2-4 days, while tier-2 and tier-3 cities may take up to 7 days. Please note that these are estimated timeframes and actual delivery times may vary due to unforeseen circumstances like weather conditions or strikes.',
      },
      {
        heading: '4. Shipping Charges',
        content: 'We offer FREE standard shipping on all prepaid orders across India. For Cash on Delivery (COD) orders, a nominal handling fee may apply, which will be clearly displayed at checkout. Any additional shipping charges for remote areas will be communicated to you before order confirmation.',
      },
      {
        heading: '5. Tracking Your Order',
        content: 'Once your order has dispatched, you will receive a tracking number and a link to track your shipment. If you have placed an order via WhatsApp, our team will manually provide you with the tracking details and regular updates regarding your shipment.',
      },
      {
        heading: '6. Failed Delivery Attempts',
        content: 'Our courier partners will make up to two delivery attempts. If a delivery fails due to an incorrect address, unavailability of the recipient, or refusal to accept the package, the parcel will be returned to us. In such cases, any refund issued will be subject to a deduction of the return shipping costs.',
      },
    ],
  },
  '/refund-policy': {
    title: '↩️ Refund & Return Policy',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. Return Eligibility',
        content: 'We have a strict 7-day return policy, which means you have 7 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase. Custom-stitched items and customized Maggam work products are strictly non-returnable and non-refundable.',
      },
      {
        heading: '2. Mandatory Unboxing Video',
        content: 'To claim a return, exchange, or refund for damaged, missing, or incorrect items, a clear, uncut, and unedited unboxing video of the parcel is mandatory. The video must show the parcel being opened from its original sealed state. Without a valid unboxing video, we will not be able to process any claims for damages or missing items.',
      },
      {
        heading: '3. Non-Returnable Exceptions',
        content: 'Certain types of items cannot be returned, including custom products (such as special orders or personalized stitching). We also do not accept returns on sale items, clearance items, or gift cards. Returns are not accepted for issues related to minor color variations (due to screen resolution differences) or change of mind.',
      },
      {
        heading: '4. Exchange Policy',
        content: 'We only replace items if they are defective, damaged, or if the wrong size was shipped. If you need to exchange an item for a different size, please contact us within 3 days of delivery. Exchanges are subject to product availability. If the desired size is unavailable, a store credit or refund will be issued.',
      },
      {
        heading: '5. Refund Processing',
        content: 'Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed and a credit will automatically be applied to your original method of payment within 5 to 7 business days. Please remember it can take some time for your bank or credit card company to process and post the refund.',
      },
      {
        heading: '6. How to Initiate a Return',
        content: 'To start a return, you can contact us at thehouseoframya@gmail.com or WhatsApp us at +91 8008007884. Please include your order number, reason for return, and the mandatory unboxing video/photos. If your return is accepted, we will send you a return shipping label, as well as instructions on how and where to send your package.',
      },
    ],
  },
  '/cancellation-policy': {
    title: '🚫 Cancellation Policy',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. Cancellation by Customer (Before Dispatch)',
        content: 'You can cancel your order at any time before it has been processed and dispatched from our warehouse (typically within 24 hours of order placement). To request a cancellation, please contact us immediately on WhatsApp at +91 8008007884 or email thehouseoframya@gmail.com with your Order ID. If the order has not been shipped, we will cancel it and initiate a full refund.',
      },
      {
        heading: '2. Cancellation by Customer (After Dispatch)',
        content: 'Once an order has been dispatched and handed over to our courier partner, it cannot be cancelled. If you no longer wish to receive the product, you must refuse the delivery at your doorstep. Once the package is returned to us, we will process your refund, deducting the standard two-way shipping charges incurred by us.',
      },
      {
        heading: '3. Custom Orders Cancellation',
        content: 'Orders that include custom stitching, tailoring, or personalized Maggam work cannot be cancelled once the customization process has begun. If you wish to cancel a custom order, you must do so within 12 hours of placing the order.',
      },
      {
        heading: '4. Cancellation Refunds',
        content: 'For successfully cancelled prepaid orders, the refund will be initiated immediately upon confirmation of the cancellation. The refund amount will be credited back to your original payment method (bank account, credit/debit card, or UPI) within 5 to 7 business days, depending on your bank’s processing time.',
      },
      {
        heading: '5. Cancellation by ROHANS MATCHING CENTRE',
        content: 'We reserve the right to refuse or cancel any order for any reason at our sole discretion. Situations that may result in your order being cancelled include limitations on quantities available for purchase, inaccuracies or errors in product or pricing information, or problems identified by our credit and fraud avoidance department. If your prepaid order is cancelled by us, a full refund will be issued within 5-7 business days.',
      },
    ],
  },
  '/terms': {
    title: '📋 Terms & Conditions',
    lastUpdated: 'July 2026',
    sections: [
      {
        heading: '1. Introduction and Acceptance',
        content: 'Welcome to ROHANS MATCHING CENTRE. These Terms and Conditions outline the rules and regulations for the use of ROHANS MATCHING CENTRE’s Website, located at houseoframya.com and houseoframya.in. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use ROHANS MATCHING CENTRE if you do not agree to take all of the terms and conditions stated on this page.',
      },
      {
        heading: '2. Products, Accuracy, and Pricing',
        content: 'We make every effort to display as accurately as possible the colors, images, and details of our products. However, we cannot guarantee that your computer monitor\'s display of any color will be completely accurate. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information. Prices for our products are subject to change without notice.',
      },
      {
        heading: '3. Payments and Billing',
        content: 'We provide secure payment gateways including Razorpay (which supports UPI, Credit/Debit cards, Net Banking, and Wallets) and Cash on Delivery (COD). By providing your payment information, you represent and warrant that the information is accurate, that you are authorized to use the payment method provided, and that you will notify us of changes to the payment information.',
      },
      {
        heading: '4. Intellectual Property Rights',
        content: 'Unless otherwise stated, ROHANS MATCHING CENTRE and/or its licensors own the intellectual property rights for all material on ROHANS MATCHING CENTRE. All intellectual property rights are reserved. You may access this from ROHANS MATCHING CENTRE for your own personal use subjected to restrictions set in these terms and conditions. You must not republish, sell, rent, reproduce, duplicate, or copy material from ROHANS MATCHING CENTRE.',
      },
      {
        heading: '5. User Comments and Feedback',
        content: 'Certain parts of this website offer the opportunity for users to post and exchange opinions and information. ROHANS MATCHING CENTRE reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive, or causes breach of these Terms and Conditions.',
      },
      {
        heading: '6. Limitation of Liability and Indemnification',
        content: 'In no event shall ROHANS MATCHING CENTRE, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website. You hereby indemnify to the fullest extent ROHANS MATCHING CENTRE from and against any and/or all liabilities, costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any of the provisions of these Terms.',
      },
      {
        heading: '7. Governing Law and Jurisdiction',
        content: 'These Terms will be governed by and interpreted in accordance with the laws of the State of Telangana, India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Sangareddy, Telangana, India.',
      },
    ],
  },
};

const NAV_LINKS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/shipping-policy', label: 'Shipping Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
  { to: '/cancellation-policy', label: 'Cancellation Policy' },
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
