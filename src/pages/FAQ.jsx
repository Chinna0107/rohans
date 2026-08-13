import { useState } from 'react';
import './FAQ.css';

const faqs = [
  { question: 'What categories does ROHANS MATCHING CENTER offer?', answer: 'ROHANS MATCHING CENTER offers premium sandals, shoes, flip flops, tshirts, and track pants — all carefully curated for style and comfort.' },
  { question: 'What are your delivery hours?', answer: 'We deliver Monday to Sunday, 9:00 AM to 9:00 PM. Orders placed after hours will be processed the next morning.' },
  { question: 'Do you offer home delivery?', answer: 'Yes! We offer fast home delivery across our service areas. Place your order online or contact us directly.' },
  { question: 'How can I place an order?', answer: 'Browse our products, add to cart, and checkout via WhatsApp. You can also call us at +91 9100009907.' },
  { question: 'What payment methods do you accept?', answer: 'We accept cash on delivery, UPI, credit/debit cards, and online bank transfers.' },
  // { question: 'What is your return/exchange policy?', answer: 'We offer easy exchanges within 7 days of delivery for size or defect issues. Contact us via WhatsApp to initiate.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-subtitle">Everything you need to know about ROHANS MATCHING CENTER</p>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item glass">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`faq-question ${openIndex === i ? 'active' : ''}`}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openIndex === i ? '−' : '+'}</span>
              </button>
              {openIndex === i && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
