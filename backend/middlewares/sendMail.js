import { createTransport } from "nodemailer";



export const buildTransport = async () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  // Trim whitespace from credentials
  const rawUser = (process.env.SMTP_USER || process.env.Gmail || '').trim();
  const rawPass = (process.env.SMTP_PASS || process.env.Password || '').trim();
  
  // Remove any trailing commas or spaces that might have been accidentally added
  const user = rawUser;
  const pass = rawPass.replace(/[, ]+$/, ''); // Remove trailing commas and spaces

  console.log('📧 Building email transport:', {
    host,
    port,
    hasUser: !!user,
    hasPass: !!pass,
    userLength: user ? user.length : 0,
    passLength: pass ? pass.length : 0,
    user: user ? `${user.substring(0, 3)}***` : 'missing',
    passPreview: pass ? `${pass.substring(0, 2)}***${pass.substring(pass.length - 1)}` : 'missing',
    nodeEnv: process.env.NODE_ENV || 'development',
    rawPassLength: rawPass ? rawPass.length : 0
  });

  const looksPlaceholder = (val) => !val || /your-.*password|your-email|example\.com/i.test(String(val));
  const devMode = (process.env.NODE_ENV || 'development') !== 'production';
  
  if (devMode && (looksPlaceholder(user) || looksPlaceholder(pass))) {
    console.warn("⚠️ Using mock email transport (jsonTransport) due to missing/placeholder SMTP creds in dev mode.");
    return createTransport({ jsonTransport: true });
  }

  if (!user || !pass) {
    console.error("❌ Email credentials missing. Using jsonTransport.");
    console.error("❌ SMTP_USER:", user ? 'SET' : 'MISSING');
    console.error("❌ SMTP_PASS:", pass ? 'SET' : 'MISSING');
    return createTransport({ jsonTransport: true });
  }

  const secure = port === 465;
  try {
    const transport = createTransport({ 
      host, 
      port, 
      secure, 
      auth: { user, pass },
      // Reduced connection timeouts to prevent hanging
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,   // 5 seconds
      socketTimeout: 10000,     // 10 seconds
      // Add debug logging
      debug: true,
      logger: true
    });
    
    // Verify connection with timeout (non-blocking - don't wait too long)
    // Some SMTP servers don't support verify but can still send emails
    try {
      const verifyPromise = transport.verify();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SMTP verify timeout')), 5000)
      );
      await Promise.race([verifyPromise, timeoutPromise]);
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      if (verifyError.message === 'SMTP verify timeout') {
        console.warn('⚠️ SMTP verify timed out after 5s - continuing anyway (some servers skip verify)');
      } else {
        console.warn('⚠️ SMTP verification failed:', verifyError.message);
        console.warn('⚠️ Continuing anyway - some SMTP servers skip verify but can still send emails');
      }
    }
    
    console.log('✅ Real email transport created (SMTP)');
    return transport;
  } catch (error) {
    console.error('❌ Failed to create email transport:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Falling back to jsonTransport');
    return createTransport({ jsonTransport: true });
  }
};

const fromAddress = () => (process.env.SMTP_USER || process.env.Gmail || "no-reply@vhassacademy.com");

const sendMail = async (email, subject, data) => {
  console.log("Setting up email transport");
  const transport = await buildTransport();

  console.log("Email transport configured");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color: #7b68ee; /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>
`;

  try {
    console.log("Sending email to:", email);
    await transport.sendMail({
      from: fromAddress(),
      to: email,
      subject,
      html,
    });
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;

export const sendForgotMail = async (subject, data) => {
  const transport = await buildTransport();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
    }
    p {
      color: #666666;
    }
    .button {
      display: inline-block;
      padding: 15px 25px;
      margin: 20px 0;
      background-color: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      color: #999999;
      text-align: center;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Hello,</p>
    <p>You have requested to reset your password. Please click the button below to reset your password.</p>
    <a href="${process.env.FRONTEND_URL}/reset-password/${data.token}" class="button">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <div class="footer">
      <p>Thank you,<br>Your Website Team</p>
      <p><a href="https://vhass.in">vhass.in</a></p>
    </div>
  </div>
</body>
</html>
`;
  
  await transport.sendMail({
    from: fromAddress(),
    to: data.email,
    subject,
    html,
  });
};

export const sendContactMail = async (data) => {
  console.log('📧 sendContactMail called with data:', { 
    name: data?.name, 
    email: data?.email, 
    hasMessage: !!data?.message 
  });
  
  const transport = await buildTransport();
  
  // Check what transport we're using
  const transportName = transport.transporter?.name || 'unknown';
  console.log('📧 Transport type:', transportName);
  
  if (transportName === 'JSONTransport') {
    const errorMsg = '❌ CRITICAL: Using mock transport (JSONTransport) - emails will NOT be sent!';
    console.error(errorMsg);
    console.error('❌ Check SMTP credentials in config.env');
    throw new Error('Email transport not configured - using mock transport');
  }

  const { name, email, message } = data || {};

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New contact message</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f6f6; margin: 0; padding: 0; }
    .container { background-color: #ffffff; padding: 20px; margin: 20px auto; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); max-width: 640px; }
    h1 { color: #5a2d82; font-size: 20px; }
    p { color: #333; line-height: 1.6; }
    .meta { color: #666; font-size: 14px; }
    .msg { white-space: pre-wrap; background:#faf7ff; border-left: 4px solid #5a2d82; padding: 12px; border-radius: 6px; }
  </style>
  </head>
  <body>
    <div class="container">
      <h1>New contact message from vhass.in</h1>
      <p class="meta"><strong>Name:</strong> ${name || "-"}</p>
      <p class="meta"><strong>Email:</strong> ${email || "-"}</p>
      <p class="meta"><strong>Received:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Message:</strong></p>
      <div class="msg">${(message || "").replace(/</g, "&lt;")}</div>
    </div>
  </body>
</html>`;

  // Send to multiple recipients to ensure delivery
  const recipients = [
    "info@vhassacademy.com",
    "vhass0310@gmail.com"  // Add backup recipient
  ];
  
  const mailOptions = {
    from: fromAddress(),
    to: recipients.join(', '), // Send to multiple recipients
    subject: `New contact message from ${name || email || "Website"}`,
    replyTo: email,
    html,
  };
  
  console.log('📧 Attempting to send contact email:', {
    from: mailOptions.from,
    to: mailOptions.to,
    recipients: recipients,
    subject: mailOptions.subject,
    transportType: transportName
  });

  try {
    // Add timeout to prevent hanging
    const sendPromise = transport.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
    );
    
    const result = await Promise.race([sendPromise, timeoutPromise]);
    
    console.log('✅ Contact email sent successfully!');
    console.log('📧 Email result:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response
    });
    
    return result;
  } catch (error) {
    console.error('❌ CRITICAL: Failed to send contact email');
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error command:', error.command);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
};

// Send acknowledgement email back to the sender of the contact form
export const sendContactAck = async (data) => {
  const { name, email } = data || {};
  if (!email) {
    console.log('⚠️ sendContactAck: No email provided, skipping');
    return; // nothing to do
  }

  console.log('📧 sendContactAck called for:', email);
  
  const transport = await buildTransport();
  
  // Check what transport we're using
  const transportName = transport.transporter?.name || 'unknown';
  console.log('📧 Acknowledgement transport type:', transportName);
  
  if (transportName === 'JSONTransport') {
    console.error('❌ CRITICAL: Using mock transport for acknowledgement - email will NOT be sent!');
    throw new Error('Email transport not configured - using mock transport');
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your message</title>
  <style>
    body{font-family:Arial, sans-serif;background:#f6f6f6;margin:0;padding:0}
    .container{background:#ffffff;max-width:640px;margin:20px auto;padding:24px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.08)}
    h1{color:#5a2d82;font-size:22px;margin:0 0 12px}
    p{color:#333;line-height:1.6;margin:0 0 12px}
    .footer{margin-top:20px;color:#777;text-align:center;font-size:13px}
  </style>
  </head>
  <body>
    <div class="container">
      <h1>Thanks${name ? `, ${name}` : ''} — we received your message</h1>
      <p>Our team at VHASS Academy has received your inquiry. We typically reply within 24–48 hours.</p>
      <p>If you didn't submit this request, please ignore this email.</p>
      <div class="footer">
        <p>✉️ info@vhassacademy.com</p>
        <p>📞 +91 8985380266</p>
      </div>
    </div>
  </body>
</html>`;

  const mailOptions = {
    from: fromAddress(),
    to: email,
    subject: "We received your message — VHASS Academy",
    html,
  };
  
  console.log('📧 Attempting to send acknowledgement email:', {
    from: mailOptions.from,
    to: mailOptions.to,
    transportType: transportName
  });

  try {
    // Add timeout to prevent hanging
    const sendPromise = transport.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
    );
    
    const result = await Promise.race([sendPromise, timeoutPromise]);
    
    console.log('✅ Acknowledgement email sent successfully!');
    console.log('📧 Email result:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    });
    
    return result;
  } catch (error) {
    console.error('❌ CRITICAL: Failed to send acknowledgement email');
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    throw error;
  }
};

export const sendTransactMailAdmin = async (subject, data) => {
  console.log('📧 sendTransactMailAdmin called:', { subject });
  
  // Validate email data
  if (!data) {
    console.error('❌ Email data missing:', data);
    throw new Error('Email data is missing');
  }
  
  const transport = await buildTransport();
  
  // Check if using mock transport - log warning but don't throw error
  // Real SMTP transports have transporter.name === 'SMTP' or 'SMTPPool' or 'SMTPS'
  // JSONTransport has transporter.name === 'JSONTransport'
  const transportName = transport.transporter?.name || '';
  const isMockTransport = transportName === 'JSONTransport';
  
  if (isMockTransport) {
    console.warn('⚠️ WARNING: Using mock email transport (jsonTransport). Emails will NOT be sent! Please check SMTP credentials in environment variables.');
    console.warn('⚠️ Transport name:', transportName);
    console.warn('⚠️ SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 3)}***` : 'MISSING',
      hasPass: !!process.env.SMTP_PASS,
      nodeEnv: process.env.NODE_ENV
    });
    // Don't throw - let it try to send anyway (will fail gracefully)
  } else {
    console.log('✅ Using real SMTP transport:', transportName);
  }

  const primaryEmail = "vhass0310@gmail.com";
  const bccEmails = ["info@vhassacademy.com", "kandregulanuraj@gmail.com"];

  // Format amount
  const formattedAmount = data.amount ? `₹${Number(data.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
  const formattedTime = data.time ? new Date(data.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New purchase</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      padding: 30px;
      margin: 0 auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
      margin-top: 0;
    }
    .bill-section {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .bill-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .bill-row:last-child {
      border-bottom: none;
    }
    .bill-label {
      font-weight: bold;
      color: #333333;
    }
    .bill-value {
      color: #666666;
    }
    .amount-highlight {
      font-size: 24px;
      font-weight: bold;
      color: #5a2d82;
    }
    .footer {
      margin-top: 30px;
      color: #999999;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${subject}</h1>
    <div class="bill-section">
      <div class="bill-row">
        <span class="bill-label">Customer Name:</span>
        <span class="bill-value">${data.name || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Email:</span>
        <span class="bill-value">${data.email || 'N/A'}</span>
      </div>
      ${data.phone ? `<div class="bill-row">
        <span class="bill-label">Phone:</span>
        <span class="bill-value">${data.phone}</span>
      </div>` : ''}
      <div class="bill-row">
        <span class="bill-label">Item Purchased:</span>
        <span class="bill-value">${data.course || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Order ID:</span>
        <span class="bill-value">${data.orderId || data.txnid || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Transaction ID:</span>
        <span class="bill-value">${data.txnid || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Payment Method:</span>
        <span class="bill-value">${data.paymentMethod || 'PhonePe'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Payment Status:</span>
        <span class="bill-value" style="color: #28a745; font-weight: bold;">${data.stat || 'SUCCESS'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Date & Time:</span>
        <span class="bill-value">${formattedTime}</span>
      </div>
      <div class="bill-row" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #5a2d82;">
        <span class="bill-label" style="font-size: 18px;">Amount Paid:</span>
        <span class="amount-highlight">${formattedAmount}</span>
      </div>
    </div>
    <div class="footer">
      <p>Thank you,<br>Your Website Team</p>
      <p><a href="https://vhass.in">vhass.in</a></p>
    </div>
  </div>
</body>
</html>
`;

  console.log('📧 Preparing to send admin email');
  console.log('📧 To:', primaryEmail);
  console.log('📧 BCC:', bccEmails);
  console.log('📧 Subject:', subject);
  
  try {
    const result = await transport.sendMail({
      from: fromAddress(),
      to: primaryEmail,
      bcc: bccEmails,
      subject,
      html,
    });
    console.log('✅ Admin email sent successfully');
    console.log('📧 Email result:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    });
    return result;
  } catch (error) {
    console.error('❌ CRITICAL: Error sending admin email');
    console.error('❌ Email error message:', error.message);
    console.error('❌ Email error code:', error.code);
    console.error('❌ Email error command:', error.command);
    console.error('❌ Email error stack:', error.stack);
    throw error;
  }
};

export const sendTransactMailUser = async (subject, data) => {
  console.log('📧 sendTransactMailUser called:', { subject, userEmail: data.email });
  
  // Validate email data
  if (!data || !data.email) {
    console.error('❌ Email data missing or invalid:', data);
    throw new Error('Email data is missing or invalid');
  }
  
  const transport = await buildTransport();
  console.log('📧 Email transport built, checking credentials...');
  
  // Check if using mock transport - log warning but don't throw error
  // Real SMTP transports have transporter.name === 'SMTP' or 'SMTPPool' or 'SMTPS'
  // JSONTransport has transporter.name === 'JSONTransport'
  const transportName = transport.transporter?.name || '';
  const isMockTransport = transportName === 'JSONTransport';
  
  if (isMockTransport) {
    console.warn('⚠️ WARNING: Using mock email transport (jsonTransport). Emails will NOT be sent! Please check SMTP credentials in environment variables.');
    console.warn('⚠️ Transport name:', transportName);
    console.warn('⚠️ SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 3)}***` : 'MISSING',
      hasPass: !!process.env.SMTP_PASS,
      nodeEnv: process.env.NODE_ENV
    });
    // Don't throw - let it try to send anyway (will fail gracefully)
  } else {
    console.log('✅ Using real SMTP transport:', transportName);
  }

  // Format amount
  const formattedAmount = data.amount ? `₹${Number(data.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A';
  const formattedTime = data.time ? new Date(data.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      padding: 30px;
      margin: 0 auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
      margin-top: 0;
    }
    .success-message {
      background-color: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #28a745;
    }
    .bill-section {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .bill-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .bill-row:last-child {
      border-bottom: none;
    }
    .bill-label {
      font-weight: bold;
      color: #333333;
    }
    .bill-value {
      color: #666666;
    }
    .amount-highlight {
      font-size: 24px;
      font-weight: bold;
      color: #5a2d82;
    }
    .footer {
      margin-top: 30px;
      color: #999999;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${subject}</h1>
    <div class="success-message">
      <strong>✅ Payment Successful!</strong> Your purchase has been confirmed. Please find your bill details below.
    </div>
    <div class="bill-section">
      <div class="bill-row">
        <span class="bill-label">Name:</span>
        <span class="bill-value">${data.name || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Item Purchased:</span>
        <span class="bill-value">${data.course || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Order ID:</span>
        <span class="bill-value">${data.orderId || data.txnid || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Transaction ID:</span>
        <span class="bill-value">${data.txnid || 'N/A'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Payment Method:</span>
        <span class="bill-value">${data.paymentMethod || 'PhonePe'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Payment Status:</span>
        <span class="bill-value" style="color: #28a745; font-weight: bold;">${data.stat || 'SUCCESS'}</span>
      </div>
      <div class="bill-row">
        <span class="bill-label">Date & Time:</span>
        <span class="bill-value">${formattedTime}</span>
      </div>
      <div class="bill-row" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #5a2d82;">
        <span class="bill-label" style="font-size: 18px;">Amount Paid:</span>
        <span class="amount-highlight">${formattedAmount}</span>
      </div>
    </div>
    <div class="footer">
      <p>Thank you for your purchase!<br><strong>Vhass Academy</strong></p>
      <p>✉️ info@vhassacademy.com</p>
      <p>📞 +91 8985320226</p>
      <p><a href="https://vhass.in">vhass.in</a></p>
    </div>
  </div>
</body>
</html>
`;

  console.log('📧 Preparing to send email to user:', data.email);
  console.log('📧 Email subject:', subject);
  console.log('📧 From address:', fromAddress());
  console.log('📧 SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    hasPass: !!process.env.SMTP_PASS
  });
  
  try {
    const mailOptions = {
      from: fromAddress(),
      to: data.email,
      subject,
      html,
    };
    
    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html?.length || 0
    });
    
    const result = await transport.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', data.email);
    console.log('📧 Email result:', {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response
    });
    return result;
  } catch (error) {
    console.error('❌ CRITICAL: Error sending email to user:', data.email);
    console.error('❌ Email error message:', error.message);
    console.error('❌ Email error code:', error.code);
    console.error('❌ Email error command:', error.command);
    console.error('❌ Email error stack:', error.stack);
    console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Re-throw the error so calling code knows email failed
    throw error;
  }
};
