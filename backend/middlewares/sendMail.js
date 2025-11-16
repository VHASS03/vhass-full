import { createTransport } from "nodemailer";
import { Resend } from 'resend';
import net from 'net';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test network connectivity to SMTP host
const testNetworkConnectivity = async (host, port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 5000; // 5 seconds
    
    socket.setTimeout(timeout);
    
    socket.once('connect', () => {
      socket.destroy();
      resolve({ success: true, message: `Port ${port} is reachable` });
    });
    
    socket.once('timeout', () => {
      socket.destroy();
      resolve({ success: false, message: `Connection timeout to ${host}:${port}` });
    });
    
    socket.once('error', (err) => {
      resolve({ success: false, message: `Connection error: ${err.message}`, code: err.code });
    });
    
    socket.connect(port, host);
  });
};

export const buildTransport = async () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  // Trim whitespace from credentials
  const rawUser = (process.env.SMTP_USER || process.env.Gmail || '').trim();
  const rawPass = (process.env.SMTP_PASS || process.env.Password || '').trim();
  
  // Test network connectivity first
  console.log(`🔍 Testing network connectivity to ${host}:${port}...`);
  const connectivityTest = await testNetworkConnectivity(host, port);
  console.log(`📡 Network test result:`, connectivityTest);
  
  if (!connectivityTest.success) {
    console.error(`❌ CRITICAL: Cannot reach ${host}:${port}`);
    console.error(`❌ This suggests a firewall/network issue, not an SMTP configuration problem`);
    console.error(`❌ Possible causes:`);
    console.error(`   - Your hosting provider (Render/Hostinger) blocks outbound SMTP connections`);
    console.error(`   - Hostinger SMTP server blocks connections from your server's IP`);
    console.error(`   - Firewall rules preventing SMTP access`);
    console.error(`❌ Solution: Contact your hosting provider or use an email service API instead`);
  }
  
  // Remove any trailing commas or spaces that might have been accidentally added
  const user = rawUser;
  // Handle password - remove trailing spaces/commas, but preserve special characters
  let pass = rawPass.replace(/[, ]+$/, ''); // Remove trailing commas and spaces
  
  // If password is wrapped in quotes, remove them (common in env files)
  if ((pass.startsWith('"') && pass.endsWith('"')) || (pass.startsWith("'") && pass.endsWith("'"))) {
    pass = pass.slice(1, -1);
  }

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

  // Try to create transport - if port 587 fails, try 465 as fallback
  const tryCreateTransport = async (tryPort) => {
    const secure = tryPort === 465; // SSL for port 465
    const transportConfig = { 
      host, 
      port: tryPort, 
      secure, // true for port 465 (SSL), false for port 587 (STARTTLS)
      auth: { 
        user, 
        pass 
      },
      // Increased timeouts for Hostinger (may be slower)
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 15000,     // 15 seconds
      // Add debug logging
      debug: true,
      logger: true,
      // TLS options for better compatibility
      tls: {
        rejectUnauthorized: false, // Some hosts have self-signed certs
        minVersion: 'TLSv1'
      }
    };
    
    // For port 587, we need requireTLS instead of secure
    if (tryPort === 587) {
      transportConfig.secure = false;
      transportConfig.requireTLS = false; // Let it auto-negotiate TLS
      transportConfig.ignoreTLS = false;
    }
    
    // For port 465, ensure SSL is used
    if (tryPort === 465) {
      transportConfig.secure = true;
    }
    
    console.log(`🔄 Attempting SMTP connection on port ${tryPort}...`);
    const transport = createTransport(transportConfig);
    
    // Skip verification if it times out - just create the transport and try sending
    // Some SMTP servers don't support verify but can still send emails
    try {
      const verifyPromise = transport.verify();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SMTP verify timeout')), 5000)
      );
      await Promise.race([verifyPromise, timeoutPromise]);
      console.log(`✅ SMTP connection verified successfully on port ${tryPort}`);
    } catch (verifyError) {
      // Don't fail on verify timeout - just log and continue
      // The actual send will tell us if there's a real problem
      if (verifyError.message === 'SMTP verify timeout' || verifyError.code === 'ETIMEDOUT') {
        console.warn(`⚠️ SMTP verify timed out on port ${tryPort} - skipping verify, will try sending anyway`);
      } else {
        console.warn(`⚠️ SMTP verification failed on port ${tryPort}:`, verifyError.message);
        console.warn('⚠️ Error details:', {
          code: verifyError.code,
          command: verifyError.command,
          response: verifyError.response,
          responseCode: verifyError.responseCode
        });
        console.warn('⚠️ Continuing anyway - some SMTP servers skip verify but can still send emails');
      }
    }
    
    console.log(`✅ Real email transport created (SMTP) on port ${tryPort}`);
    console.log('📧 SMTP Configuration:', {
      host,
      port: tryPort,
      secure,
      requireTLS: tryPort === 587,
      user: user ? `${user.substring(0, 3)}***` : 'missing'
    });
    return transport;
  };
  
  // Try the configured port first, with automatic fallback for Hostinger
  // For Hostinger, try both ports - start with 465 (more reliable) if configured port is 587
  const portsToTry = host.includes('hostinger') && port === 587 
    ? [465, 587]  // Try 465 FIRST (more reliable for Hostinger), then 587 as fallback
    : host.includes('hostinger') && port === 465
    ? [465, 587]  // If 465 is configured, try it first, then 587
    : [port];     // Otherwise just try the configured port
  
  let lastError = null;
  
  for (let i = 0; i < portsToTry.length; i++) {
    const tryPort = portsToTry[i];
    try {
      console.log(`📧 Attempting to create SMTP transport (attempt ${i + 1}/${portsToTry.length}) on port ${tryPort}...`);
      const transport = await tryCreateTransport(tryPort);
      // If we got here, transport was created successfully (even if verify timed out)
      return transport;
    } catch (error) {
      lastError = error;
      console.error(`❌ Failed to create email transport on port ${tryPort}:`, error.message);
      console.error('❌ Error code:', error.code);
      
      // If this is not the last port to try, continue to next port
      if (i < portsToTry.length - 1) {
        console.log(`🔄 Port ${tryPort} failed, trying next port...`);
        continue;
      }
      
      // If all ports failed, fall back to jsonTransport
      console.error('❌ All SMTP ports failed during transport creation, falling back to jsonTransport');
      console.error('❌ Error stack:', error.stack);
      return createTransport({ jsonTransport: true });
    }
  }
  
  // Should never reach here, but just in case
  console.error('❌ Unexpected error in transport creation, falling back to jsonTransport');
  return createTransport({ jsonTransport: true });
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
  
  // Try sending with current transport, retry with port 465 if timeout
  const host = process.env.SMTP_HOST || '';
  const originalPort = process.env.SMTP_PORT;
  const currentPort = Number(process.env.SMTP_PORT || 587);
  
  let lastError = null;
  
  // Try sending email - if timeout on port 587, retry with port 465
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // On retry attempt, use port 465
      if (attempt === 1 && host.includes('hostinger') && currentPort === 587) {
        console.log('🔄 Retry attempt: Switching to port 465...');
        process.env.SMTP_PORT = '465';
      }
      
      const transport = await buildTransport();
      
      // Check what transport we're using
      const transportName = transport.transporter?.name || 'unknown';
      console.log(`📧 Transport type (attempt ${attempt + 1}):`, transportName);
      
      if (transportName === 'JSONTransport') {
        const errorMsg = '❌ CRITICAL: Using mock transport (JSONTransport) - emails will NOT be sent!';
        console.error(errorMsg);
        console.error('❌ Check SMTP credentials in config.env');
        throw new Error('Email transport not configured - using mock transport');
      }
      
      console.log('📧 Attempting to send contact email:', {
        from: mailOptions.from,
        to: mailOptions.to,
        recipients: recipients,
        subject: mailOptions.subject,
        transportType: transportName
      });

      // Add timeout to prevent hanging - reduced timeout for faster retry
      const sendPromise = transport.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => {
        const timeoutError = new Error('Email send timeout after 20 seconds');
        timeoutError.code = 'ETIMEDOUT';
        setTimeout(() => reject(timeoutError), 20000);
      });
      
      const result = await Promise.race([sendPromise, timeoutPromise]);
      
      // Restore original port if we changed it
      if (attempt === 1 && originalPort) {
        process.env.SMTP_PORT = originalPort;
      }
      
      console.log('✅ Contact email sent successfully!');
      console.log('📧 Email result:', {
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response
      });
      
      return result;
    } catch (error) {
      lastError = error;
      const isTimeout = error.code === 'ETIMEDOUT' || error.message.includes('timeout');
      const shouldRetry = attempt === 0 && isTimeout && host.includes('hostinger') && currentPort === 587;
      
      console.error(`❌ Attempt ${attempt + 1} failed to send contact email`);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error command:', error.command);
      
      // Restore original port before retry or throw
      if (attempt === 1 && originalPort) {
        process.env.SMTP_PORT = originalPort;
      }
      
      if (shouldRetry) {
        console.log('🔄 Timeout detected, will retry with port 465 on next attempt...');
        continue;
      } else {
        console.error('❌ Error stack:', error.stack);
        // Don't throw here - let it fall through to Resend fallback check
        break; // Exit the loop to check for Resend fallback
      }
    }
  }
  
  // If SMTP failed due to network/firewall, try Resend API as fallback
  if (lastError && (lastError.code === 'ETIMEDOUT' || lastError.message.includes('timeout'))) {
    console.log('🔄 SMTP blocked by firewall, trying Resend API fallback...');
    try {
      return await sendViaResendAPI(mailOptions, html);
    } catch (resendError) {
      console.error('❌ Resend API also failed:', resendError.message);
      throw lastError; // Throw original SMTP error
    }
  }
  
  // If we get here, all attempts failed
  console.error('❌ CRITICAL: All attempts to send contact email failed');
  throw lastError || new Error('Failed to send email after all retry attempts');
};

// Fallback email sending via Resend API (works when SMTP is blocked)
const sendViaResendAPI = async (mailOptions, html) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured. SMTP is blocked and no API fallback available.');
  }
  
  const resend = new Resend(resendApiKey);
  
  // Send to each recipient separately (Resend API format)
  const recipients = mailOptions.to.split(',').map(email => email.trim());
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const emailData = {
        from: mailOptions.from || 'info@vhassacademy.com',
        to: recipient,
        subject: mailOptions.subject,
        html: html,
        replyTo: mailOptions.replyTo,
      };
      
      // Add attachments if present (Resend API format - expects base64 string)
      if (mailOptions.attachments && mailOptions.attachments.length > 0) {
        emailData.attachments = mailOptions.attachments.map(att => {
          // Convert buffer to base64 if needed
          const contentBase64 = typeof att.content === 'string' 
            ? att.content 
            : Buffer.isBuffer(att.content) 
              ? att.content.toString('base64')
              : Buffer.from(att.content).toString('base64');
          
          return {
            filename: att.filename,
            content: contentBase64
          };
        });
      }
      
      const result = await resend.emails.send(emailData);
      
      console.log(`✅ Email sent via Resend API to ${recipient}:`, result);
      results.push({ recipient, success: true, result });
    } catch (error) {
      console.error(`❌ Failed to send via Resend API to ${recipient}:`, error.message);
      results.push({ recipient, success: false, error: error.message });
    }
  }
  
  // Return success if at least one email was sent
  const successCount = results.filter(r => r.success).length;
  if (successCount > 0) {
    return { 
      messageId: `resend-${Date.now()}`,
      accepted: results.filter(r => r.success).map(r => r.recipient),
      rejected: results.filter(r => !r.success).map(r => r.recipient),
      response: 'Sent via Resend API (SMTP blocked)'
    };
  }
  
  throw new Error('All Resend API sends failed');
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
        <p>📞 +91 89853 20226</p>
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
    
    // If SMTP failed due to network/firewall, try Resend API as fallback
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.log('🔄 SMTP blocked by firewall, trying Resend API fallback for acknowledgement...');
      try {
        return await sendViaResendAPI(mailOptions, html);
      } catch (resendError) {
        console.error('❌ Resend API also failed for acknowledgement:', resendError.message);
        throw error; // Throw original SMTP error
      }
    }
    
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
    
    // If SMTP failed due to network/firewall, try Resend API as fallback
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.log('🔄 SMTP blocked by firewall, trying Resend API fallback for admin email...');
      try {
        // Resend API: Send to primary email, then send BCC emails separately
        const mailOptions = {
          from: fromAddress(),
          to: primaryEmail,
          subject,
          html,
        };
        const result = await sendViaResendAPI(mailOptions, html);
        
        // Send BCC emails separately via Resend
        for (const bccEmail of bccEmails) {
          try {
            await sendViaResendAPI({ ...mailOptions, to: bccEmail }, html);
          } catch (bccError) {
            console.error(`⚠️ Failed to send BCC to ${bccEmail}:`, bccError.message);
          }
        }
        
        return result;
      } catch (resendError) {
        console.error('❌ Resend API also failed for admin email:', resendError.message);
        throw error; // Throw original SMTP error
      }
    }
    
    throw error;
  }
};

// Helper function to generate course slug from title
const generateCourseSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Generate PDF invoice
const generateInvoicePDF = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Company details
      const companyName = 'VHASS Academy';
      const companyAddress = '9-1-70, Brilliant\'s School Area\nIbrahimpatnam Krishna-521456\nAndhra Pradesh, India';
      const companyEmail = 'info@vhassacademy.com';
      const companyPhone = '+91 89853 20226';
      const companyWebsite = 'www.vhassacademy.com';
      
      // Invoice details
      const invoiceNumber = data.orderId || data.txnid || `INV-${Date.now()}`;
      const invoiceDate = data.time ? new Date(data.time).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : new Date().toLocaleDateString('en-IN');
      
      // Header
      doc.fontSize(24).fillColor('#5a2d82').text(companyName, 50, 50, { align: 'left' });
      doc.fontSize(10).fillColor('#666666').text('INVOICE', 450, 50, { align: 'right' });
      
      // Company address
      doc.fontSize(9).fillColor('#333333').text(companyAddress, 50, 90, { align: 'left' });
      doc.text(`Email: ${companyEmail}`, 50, 140);
      doc.text(`Phone: ${companyPhone}`, 50, 155);
      doc.text(`Website: ${companyWebsite}`, 50, 170);
      
      // Invoice number and date
      doc.fontSize(9).fillColor('#333333')
        .text(`Invoice #: ${invoiceNumber}`, 400, 90, { align: 'right' })
        .text(`Date: ${invoiceDate}`, 400, 105, { align: 'right' });
      
      // Bill to section
      doc.fontSize(12).fillColor('#5a2d82').text('Bill To:', 50, 200);
      doc.fontSize(10).fillColor('#333333')
        .text(data.name || 'Customer', 50, 220)
        .text(data.email || '', 50, 235);
      if (data.phone && data.phone !== 'Not provided') {
        doc.text(data.phone, 50, 250);
      }
      
      // Line separator
      doc.moveTo(50, 280).lineTo(550, 280).strokeColor('#e0e0e0').lineWidth(1).stroke();
      
      // Item details
      doc.fontSize(12).fillColor('#5a2d82').text('Item Details', 50, 300);
      doc.moveTo(50, 320).lineTo(550, 320).strokeColor('#5a2d82').lineWidth(2).stroke();
      
      // Table headers
      doc.fontSize(10).fillColor('#333333')
        .text('Description', 50, 340)
        .text('Quantity', 400, 340)
        .text('Amount', 480, 340);
      
      doc.moveTo(50, 360).lineTo(550, 360).strokeColor('#e0e0e0').lineWidth(1).stroke();
      
      // Item row
      doc.fontSize(10).fillColor('#333333')
        .text(data.course || 'Course/Workshop', 50, 375, { width: 340 })
        .text('1', 400, 375)
        .text(`₹${Number(data.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 480, 375);
      
      doc.moveTo(50, 400).lineTo(550, 400).strokeColor('#e0e0e0').lineWidth(1).stroke();
      
      // Payment details
      doc.fontSize(10).fillColor('#666666')
        .text(`Transaction ID: ${data.txnid || 'N/A'}`, 50, 420)
        .text(`Payment Method: ${data.paymentMethod || 'PhonePe'}`, 50, 435)
        .text(`Payment Status: ${data.stat || 'SUCCESS'}`, 50, 450);
      
      // Total section
      const totalY = 480;
      doc.moveTo(50, totalY).lineTo(550, totalY).strokeColor('#5a2d82').lineWidth(2).stroke();
      
      doc.fontSize(14).fillColor('#5a2d82')
        .text('Total Amount:', 350, totalY + 10)
        .fontSize(16)
        .text(`₹${Number(data.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 480, totalY + 10);
      
      // Footer
      doc.fontSize(8).fillColor('#999999')
        .text('Thank you for your purchase!', 50, 600, { align: 'center' })
        .text('This is a computer-generated invoice and does not require a signature.', 50, 615, { align: 'center' })
        .text(`For any queries, contact us at ${companyEmail} or ${companyPhone}`, 50, 630, { align: 'center' });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
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
  
  // Generate course slug and URL
  const courseSlug = generateCourseSlug(data.course);
  const frontendUrl = process.env.FRONTEND_URL || 'https://www.vhassacademy.com';
  const courseUrl = courseSlug ? `${frontendUrl}/course/${courseSlug}` : `${frontendUrl}/course`;
  
  // Generate PDF invoice
  let pdfBuffer = null;
  try {
    pdfBuffer = await generateInvoicePDF(data);
    console.log('✅ PDF invoice generated successfully');
  } catch (pdfError) {
    console.error('❌ Failed to generate PDF invoice:', pdfError.message);
    // Continue without PDF if generation fails
  }

  // Get logo URL
  const logoUrl = `${frontendUrl}/VHASS.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .logo-section {
      padding: 30px 40px;
      text-align: center;
      border-bottom: 1px solid #e5e5e5;
      background-color: #ffffff;
    }
    .logo {
      max-width: 180px;
      height: auto;
      display: inline-block;
    }
    .main-content {
      padding: 0;
      background-color: #ffffff;
    }
    .header-section {
      padding: 40px 40px 30px;
      text-align: left;
    }
    .header-section h1 {
      font-size: 32px;
      font-weight: 600;
      color: #1c1c1c;
      margin-bottom: 12px;
      line-height: 1.2;
    }
    .header-section p {
      font-size: 16px;
      color: #666666;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .cta-button-primary {
      display: inline-block;
      background-color: #1c1c1c;
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 16px;
      margin-top: 10px;
      transition: background-color 0.2s;
    }
    .cta-button-primary:hover {
      background-color: #333333;
    }
    .invoice-box {
      background-color: #f8f8f8;
      margin: 0 40px 40px;
      padding: 30px;
      border-radius: 4px;
    }
    .invoice-title {
      font-size: 18px;
      font-weight: 600;
      color: #1c1c1c;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e5e5;
    }
    .transaction-info {
      margin-bottom: 24px;
    }
    .transaction-info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .transaction-info-label {
      color: #666666;
    }
    .transaction-info-value {
      color: #1c1c1c;
      font-weight: 500;
    }
    .course-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    .course-table th {
      text-align: left;
      padding: 12px 0;
      font-size: 13px;
      font-weight: 600;
      color: #666666;
      border-bottom: 1px solid #e5e5e5;
    }
    .course-table td {
      padding: 12px 0;
      font-size: 14px;
      color: #1c1c1c;
      border-bottom: 1px solid #e5e5e5;
    }
    .course-table th:last-child,
    .course-table td:last-child {
      text-align: right;
    }
    .course-name {
      font-weight: 500;
      color: #1c1c1c;
    }
    .price-cell {
      font-weight: 500;
    }
    .summary-section {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .summary-label {
      color: #666666;
    }
    .summary-value {
      color: #1c1c1c;
      font-weight: 500;
    }
    .total-row {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 2px solid #1c1c1c;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .total-label {
      font-size: 18px;
      font-weight: 600;
      color: #1c1c1c;
    }
    .total-amount {
      font-size: 24px;
      font-weight: 700;
      color: #1c1c1c;
    }
    .purchased-by {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e5e5;
    }
    .purchased-by-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      color: #666666;
    }
    .help-section {
      padding: 0 40px 40px;
      text-align: left;
    }
    .help-section p {
      font-size: 14px;
      color: #666666;
      margin-bottom: 8px;
    }
    .help-section a {
      color: #1c1c1c;
      text-decoration: underline;
    }
    .pdf-notice {
      background-color: #e8f4f8;
      border-left: 4px solid #0066cc;
      padding: 16px 20px;
      margin: 0 40px 30px;
      border-radius: 4px;
      font-size: 14px;
      color: #004085;
    }
    .pdf-notice strong {
      font-weight: 600;
    }
    .footer {
      background-color: #1c1c1c;
      color: #ffffff;
      padding: 40px;
      text-align: center;
      font-size: 12px;
    }
    .footer-links {
      margin-bottom: 20px;
    }
    .footer-links a {
      color: #ffffff;
      text-decoration: none;
      margin: 0 10px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    .footer-text {
      color: #999999;
      line-height: 1.6;
      margin-top: 20px;
    }
    .footer-address {
      color: #999999;
      margin-top: 16px;
      font-size: 11px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      .logo-section,
      .header-section,
      .invoice-box,
      .help-section,
      .footer {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .header-section h1 {
        font-size: 26px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="logo-section">
      <img src="${logoUrl}" alt="VHASS Academy" class="logo" />
    </div>
    
    <div class="main-content">
      <div class="header-section">
        <h1>Your order's been processed</h1>
        <p>You're all set to start learning. Ready to jump in?</p>
        <a href="${courseUrl}" class="cta-button-primary">Start learning</a>
      </div>
      
      ${pdfBuffer ? `
      <div class="pdf-notice">
        <strong>📄 Invoice Attached:</strong> A detailed PDF invoice has been attached to this email for your records.
      </div>
      ` : ''}
      
      <div class="invoice-box">
        <div class="invoice-title">Transaction Information</div>
        
        <div class="transaction-info">
          <div class="transaction-info-row">
            <span class="transaction-info-label">Transaction date:</span>
            <span class="transaction-info-value">${formattedTime.split(',')[0]}</span>
          </div>
          <div class="transaction-info-row">
            <span class="transaction-info-label">Transaction number:</span>
            <span class="transaction-info-value">${data.txnid || data.orderId || 'N/A'}</span>
          </div>
        </div>
        
        <table class="course-table">
          <thead>
            <tr>
              <th>Course name</th>
              <th style="text-align: right;">Your price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="course-name">${data.course || 'Course/Workshop'}</td>
              <td class="price-cell" style="text-align: right;">${formattedAmount}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="summary-section">
          <div class="summary-row">
            <span class="summary-label">Subtotal:</span>
            <span class="summary-value">${formattedAmount}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Tax:</span>
            <span class="summary-value">₹0.00</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Credits:</span>
            <span class="summary-value">₹0.00</span>
          </div>
          <div class="total-row">
            <span class="total-label">Total:</span>
            <span class="total-amount">${formattedAmount}</span>
          </div>
        </div>
        
        <div class="purchased-by">
          <div class="purchased-by-row">
            <span>Purchased by:</span>
            <span>${data.name || 'Customer'}</span>
          </div>
          <div class="purchased-by-row">
            <span>Payment method:</span>
            <span>${(data.paymentMethod || 'PhonePe').toLowerCase()}</span>
          </div>
          <div class="purchased-by-row">
            <span>Sold by:</span>
            <span>VHASS Academy</span>
          </div>
          <div class="purchased-by-row" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e5e5;">
            <span style="font-size: 12px; color: #999999;">9-1-70, Brilliant's School Area,<br>Ibrahimpatnam Krishna-521456,<br>Andhra Pradesh, India</span>
          </div>
        </div>
      </div>
      
      <div class="help-section">
        <p><strong>Need help?</strong> Visit our <a href="${frontendUrl}/contact">Help Center</a> for support.</p>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-links">
        <a href="${frontendUrl}">About us</a>
        <span style="color: #666;">|</span>
        <a href="${frontendUrl}/contact">Support</a>
        <span style="color: #666;">|</span>
        <a href="${frontendUrl}/policies">Privacy terms</a>
      </div>
      <div class="footer-text">
        You are receiving this email because you signed up on VHASS Academy with this email address.
      </div>
      <div class="footer-address">
        VHASS Academy<br>
        9-1-70, Brilliant's School Area<br>
        Ibrahimpatnam Krishna-521456<br>
        Andhra Pradesh, India
      </div>
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
    
    // Attach PDF invoice if generated
    if (pdfBuffer) {
      mailOptions.attachments = [{
        filename: `Invoice-${data.orderId || data.txnid || Date.now()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }];
      console.log('📎 PDF invoice attached to email');
    }
    
    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html?.length || 0,
      hasAttachment: !!pdfBuffer
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
    
    // If SMTP failed due to network/firewall, try Resend API as fallback
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.log('🔄 SMTP blocked by firewall, trying Resend API fallback for user email...');
      try {
        const mailOptions = {
          from: fromAddress(),
          to: data.email,
          subject,
          html,
        };
        
        // For Resend API, attach PDF as base64
        if (pdfBuffer) {
          mailOptions.attachments = [{
            filename: `Invoice-${data.orderId || data.txnid || Date.now()}.pdf`,
            content: pdfBuffer.toString('base64'),
            type: 'application/pdf',
            disposition: 'attachment'
          }];
        }
        
        return await sendViaResendAPI(mailOptions, html);
      } catch (resendError) {
        console.error('❌ Resend API also failed for user email:', resendError.message);
        throw error; // Throw original SMTP error
      }
    }
    
    // Re-throw the error so calling code knows email failed
    throw error;
  }
};

// Test SMTP connection and credentials
export const testSMTPConnection = async () => {
  try {
    console.log('🧪 Testing SMTP connection...');
    const transport = await buildTransport();
    
    // Check transport type
    const transportName = transport.transporter?.name || 'unknown';
    console.log('📧 Transport type:', transportName);
    
    if (transportName === 'JSONTransport') {
      return {
        success: false,
        error: 'Using mock transport (JSONTransport) - SMTP credentials not configured properly',
        transportType: transportName,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 3)}***` : 'MISSING',
          hasPass: !!process.env.SMTP_PASS,
          nodeEnv: process.env.NODE_ENV
        }
      };
    }
    
    // Try to verify connection
    try {
      await transport.verify();
      console.log('✅ SMTP connection verified successfully');
      return {
        success: true,
        message: 'SMTP connection verified successfully',
        transportType: transportName,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          fromAddress: fromAddress()
        }
      };
    } catch (verifyError) {
      console.warn('⚠️ SMTP verification failed:', verifyError.message);
      // Some servers don't support verify but can still send emails
      return {
        success: true,
        warning: 'SMTP verify failed but transport created (some servers skip verify)',
        error: verifyError.message,
        transportType: transportName,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          fromAddress: fromAddress()
        }
      };
    }
  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
};
