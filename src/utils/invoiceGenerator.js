export const generateInvoiceHtml = (order) => {
  const addressObj = order.customer?.address;
  const addressStr = typeof addressObj === 'object' && addressObj !== null
    ? `${addressObj.line1 || ''}, ${addressObj.line2 || ''}, ${addressObj.city || ''} ${addressObj.state || ''} - ${addressObj.pincode || ''}`.replace(/^[,\s]+|[,\s]+$/g, '').replace(/, ,/g, ',')
    : order.customer?.address || '—';

  const orderId = order.razorpayOrderId || `HOR-${String(order.id).padStart(4, '0')}`;
  const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const itemsHtml = (order.items || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #F6EFEF; background: ${idx % 2 === 0 ? '#fff' : '#FFFAF9'}">
      <td style="padding: 12px 16px; text-align: center; color: #555;">${idx + 1}</td>
      <td style="padding: 12px 16px; color: #222; font-weight: 500;">${item.name}</td>
      <td style="padding: 12px 16px; text-align: center; color: #555;">${item.size || 'Free Size'}</td>
      <td style="padding: 12px 16px; text-align: center; color: #555;">${item.quantity || item.qty || 1}</td>
      <td style="padding: 12px 16px; text-align: right; color: #333; font-weight: 600;">₹${Number(item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${orderId}</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #fff; margin: 0; padding: 20px; color: #333; }
        .invoice-box { max-width: 900px; margin: auto; border: 1px solid rgba(225, 120, 45, 0.2); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #e1782d; padding: 30px; }
        .brand-info h1 { margin: 0; font-size: 32px; color: #e1782d; font-family: serif; }
        .brand-info p.tagline { font-size: 11px; font-weight: bold; color: #b41e1e; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
        .brand-details { font-size: 13px; color: #555; margin-top: 16px; line-height: 1.6; }
        .invoice-meta { text-align: right; }
        .invoice-meta h2 { margin: 0 0 12px 0; font-size: 26px; color: #e1782d; text-transform: uppercase; letter-spacing: 1px; }
        .invoice-meta p { margin: 4px 0; font-size: 13px; color: #444; }
        
        .body-content { padding: 30px; }
        .address-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .address-table td { width: 50%; padding: 16px; vertical-align: top; border: 1px solid #FFE4DE; border-radius: 4px; }
        .address-table .from-box { background: #FFFDFD; border-right: 1px solid #FFE4DE; }
        .address-table .to-box { background: #FFFAF9; }
        .box-title { font-size: 13px; font-weight: bold; color: #e1782d; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #FFE4DE; padding-bottom: 6px; margin: 0 0 10px 0; }
        .address-text { font-size: 13px; color: #555; line-height: 1.6; }

        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .items-table th { background: #e1782d; color: #fff; padding: 12px 16px; font-size: 13px; font-weight: 600; text-align: left; }
        .items-table th.center { text-align: center; }
        .items-table th.right { text-align: right; }
        
        .summary-table { width: 100%; border-collapse: collapse; }
        .summary-table td { padding: 8px 12px; text-align: right; font-size: 14px; color: #555; }
        .summary-table td.bold { font-weight: bold; color: #333; }
        .summary-table tr.total-row { background: #FFEBE7; border-top: 2px solid #e1782d; border-bottom: 2px solid #e1782d; }
        .summary-table tr.total-row td { padding: 16px 12px; font-size: 18px; color: #e1782d; font-weight: bold; }

        .terms-box { width: 55%; padding-right: 24px; vertical-align: top; }
        .summary-box { width: 45%; vertical-align: top; }
        
        .footer { background: #FDF6EC; border-top: 1px solid #F6EFEF; padding: 24px; text-align: center; font-size: 13px; color: #777; }
        .footer-thanks { font-family: serif; font-size: 20px; color: #e1782d; font-style: italic; font-weight: bold; margin-top: 8px; }
        
        @media print {
          body { padding: 0; }
          .invoice-box { border: none; box-shadow: none; max-width: 100%; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      </style>
    </head>
    <body onload="window.print();">
      <div class="invoice-box">
        <div class="header">
          <div class="brand-info">
            <h1>ROHANS MATCHING CENTRE</h1>
            <p class="tagline">Luxury Authentic Clothing</p>
            <div class="brand-details">
              <strong>ROHANS MATCHING CENTRE Pvt Ltd</strong><br>
              Reg No.: HOR-2026-99381<br>
              Phone: +91 7396083412 | Email: rohansmatchingcentre143@gmail.com<br>
              Website: www.houseoframya.com
            </div>
          </div>
          <div class="invoice-meta">
            <h2>Order Invoice</h2>
            <p><strong>Invoice No:</strong> #${orderId}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Payment Mode:</strong> ${order.paymentMethod === 'razorpay' ? 'Razorpay' : 'COD'}</p>
          </div>
        </div>

        <div class="body-content">
          <table class="address-table">
            <tr>
              <td class="from-box">
                <h3 class="box-title">From Address</h3>
                <div class="address-text">
                  <strong>ROHANS MATCHING CENTRE</strong><br>
                  13-6-586, P.K.Layout,<br>
                  Tirupati - 517501, Andhra Pradesh, India<br>
                  <strong>Phone:</strong> +91 7396083412
                </div>
              </td>
              <td class="to-box">
                <h3 class="box-title">Shipping Address</h3>
                <div class="address-text">
                  <strong>${order.customer?.name || 'Customer'}</strong><br>
                  ${addressStr}<br>
                  <strong>Mobile:</strong> ${order.customer?.phone || '—'}
                </div>
              </td>
            </tr>
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th class="center" style="width: 8%">S.No.</th>
                <th style="width: 44%">Item Name</th>
                <th class="center" style="width: 18%">Size</th>
                <th class="center" style="width: 12%">Quantity</th>
                <th class="right" style="width: 18%">Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td class="terms-box">
                <h3 style="font-size: 13px; font-weight: bold; color: #b41e1e; text-transform: uppercase; margin-bottom: 8px;">Terms & Conditions</h3>
                <ul style="font-size: 12px; color: #555; padding-left: 20px; line-height: 1.6; margin: 0;">
                  <li>Once we receive the order, we will start processing it.</li>
                  <li>It will take 2-4 days to dispatch the order.</li>
                  <li>We will share the tracking details through WhatsApp once shipped.</li>
                  <li>Estimated delivery time will depend on your shipping location.</li>
                </ul>
              </td>
              <td class="summary-box">
                <table class="summary-table">
                  <tr>
                    <td>Subtotal</td>
                    <td class="bold">₹${Number(order.subtotal || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Delivery Charges</td>
                    <td class="bold" style="color: #16a34a;">FREE</td>
                  </tr>
                  <tr class="total-row">
                    <td>TOTAL PAYABLE:</td>
                    <td>₹${Number(order.finalTotal || order.subtotal || 0).toLocaleString()}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <div class="footer">
          This is an electronically generated invoice and requires no physical signature.
          <div class="footer-thanks">Thank you!!</div>
        </div>
      </div>
    </body>
    </html>
  `;
};
