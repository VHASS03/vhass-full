import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  myProfile,
  register,
  resetPassword,
  verifyUser,
  updateProfile,
  googleLogin,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";
import { addProgress, getYourProgress, getUserCourses, getUserWorkshops, getEnrollmentHistory } from "../controllers/course.js";
import { contactMessage } from "../controllers/admin.js";
import { sendContactMail, buildTransport } from '../middlewares/sendMail.js';

const router = express.Router();

router.post("/user/register", register);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);
router.post("/user/google-login", googleLogin);
router.post("/user/logout", logoutUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/forgot", forgotPassword);
router.post("/user/reset", resetPassword);
router.post("/user/progress", isAuth, addProgress);
router.get("/user/progress", isAuth, getYourProgress);
router.put("/user/update", isAuth, updateProfile);
router.get("/user/courses", isAuth, getUserCourses);
router.get("/user/workshops", isAuth, getUserWorkshops);
router.get("/user/enrollments", isAuth, getEnrollmentHistory);

// Contact form endpoint (no auth required)
router.post("/contact", contactMessage);

// Test email endpoint (for debugging - remove in production)
router.get("/test-email", async (req, res) => {
  try {
    // Check SMTP config
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const user = (process.env.SMTP_USER || '').trim();
    const hasPass = !!process.env.SMTP_PASS;
    
    // Build transport to check what we're using
    const transport = await buildTransport();
    const transportName = transport.transporter?.name || 'unknown';
    
    const configInfo = {
      smtpHost: host,
      smtpPort: port,
      smtpUser: user ? `${user.substring(0, 3)}***` : 'MISSING',
      hasPassword: hasPass,
      transportType: transportName,
      isMockTransport: transportName === 'JSONTransport',
      nodeEnv: process.env.NODE_ENV || 'development'
    };
    
    // Try to send a test email
    let testResult = null;
    if (transportName !== 'JSONTransport') {
      try {
        await sendContactMail({
          name: 'Test User',
          email: 'test@example.com',
          message: 'This is a test email from the SMTP test endpoint.'
        });
        testResult = { success: true, message: 'Test email sent successfully' };
      } catch (emailError) {
        testResult = {
          success: false,
          error: emailError.message,
          code: emailError.code,
          command: emailError.command
        };
      }
    } else {
      testResult = {
        success: false,
        error: 'Using mock transport - emails will not be sent',
        message: 'Check SMTP credentials in config.env'
      };
    }
    
    res.json({
      success: true,
      config: configInfo,
      testResult: testResult,
      message: 'Check server logs for detailed SMTP information'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// PhonePe proxy routes to avoid CORS issues
router.post("/phonepe/initiate", isAuth, async (req, res) => {
  try {
    console.log('=== PHONEPE INITIATE REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { payload, environment } = req.body;
    if (!payload) {
      return res.status(400).json({ success: false, message: 'Missing payload' });
    }
    
    // Build base64 request and X-VERIFY on server using env salt key
    const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const payString = `${base64}/pg/v1/pay${saltKey}`;
    const crypto = await import('crypto');
    const xVerify = `${crypto.createHash('sha256').update(payString).digest('hex')}###${saltIndex}`;

    console.log('Making request to PhonePe API...');
    const env = (environment || process.env.PHONEPE_ENVIRONMENT || 'PREPROD').toUpperCase();
    // PhonePe base URLs
    // PRODUCTION: https://api.phonepe.com/apis/hermes
    // PREPROD:    https://api-preprod.phonepe.com/apis/pg-sandbox
    const baseUrl = env === 'PRODUCTION'
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    
    // Use built-in fetch (Node.js 18+)
    
    const response = await fetch(`${baseUrl}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-VERIFY': xVerify,
        ...(payload?.merchantId ? { 'X-MERCHANT-ID': payload.merchantId } : {})
      },
      body: JSON.stringify({
        request: base64
      })
    });

    console.log('PhonePe API response status:', response.status);
    let data;
    const raw = await response.text();
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = { success: false, code: String(response.status), raw: raw?.slice(0, 500) };
    }
    console.log('PhonePe API response:', data);
    res.status(response.status).json(data);
  } catch (error) {
    console.error('PhonePe proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment initiation failed',
      error: error.message 
    });
  }
});

router.post("/phonepe/status", isAuth, async (req, res) => {
  try {
    const { merchantId, merchantTransactionId, environment } = req.body;
    const env = (environment || process.env.PHONEPE_ENVIRONMENT || 'PREPROD').toUpperCase();
    const baseUrl = env === 'PRODUCTION'
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    
    // Compute X-VERIFY for status as per PhonePe docs: sha256("/pg/v1/status/{merchantId}/{merchantTxnId}" + saltKey)
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';
    const statusString = `/pg/v1/status/${merchantId}/${merchantTransactionId}${saltKey}`;
    const crypto = await import('crypto');
    const xVerify = `${crypto.createHash('sha256').update(statusString).digest('hex')}###${saltIndex}`;
    
    // Use built-in fetch (Node.js 18+)
    
    const response = await fetch(`${baseUrl}/pg/v1/status/${merchantId}/${merchantTransactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': merchantId
      }
    });

    let data;
    const raw = await response.text();
    try {
      data = JSON.parse(raw);
    } catch (e) {
      data = { success: false, code: String(response.status), raw: raw?.slice(0, 500) };
    }
    res.status(response.status).json(data);
  } catch (error) {
    console.error('PhonePe status proxy error:', error);
    res.status(500).json({ success: false, message: 'Status check failed' });
  }
});

// Test PhonePe configuration
router.get("/phonepe/test", isAuth, async (req, res) => {
  try {
    console.log('=== PHONEPE CONFIGURATION TEST ===');
    
    // Test payload
    const testPayload = {
      merchantId: 'SU2505141931362838820920',
      merchantTransactionId: 'TEST_' + Date.now(),
      amount: 100, // 1 rupee in paise
      redirectUrl: 'http://localhost:5173/payment/callback',
      redirectMode: 'REDIRECT',
      callbackUrl: 'http://localhost:5173/payment/callback',
      merchantUserId: 'TEST_USER',
      mobileNumber: '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };
    
    console.log('Test payload:', testPayload);
    
    // Generate X-VERIFY
    const base64 = btoa(JSON.stringify(testPayload));
    const saltKey = '33418406-0957-4ae0-a07a-a6383760ba05';
    const saltIndex = '1';
    const string = `${base64}/pg/v1/pay${saltKey}`;
    const crypto = await import('crypto');
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const xVerify = `${sha256}###${saltIndex}`;
    
    console.log('Generated X-VERIFY:', xVerify);
    
    res.json({
      success: true,
      message: 'PhonePe configuration test completed',
      testPayload,
      xVerify,
      base64
    });
  } catch (error) {
    console.error('PhonePe test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'PhonePe test failed',
      error: error.message 
    });
  }
});

// Test email configuration
router.post("/test-email", async (req, res) => {
  try {
    console.log('=== EMAIL CONFIGURATION TEST ===');
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'testEmail is required' 
      });
    }

    // Test environment variables
    const envCheck = {
      SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT SET', 
      SMTP_USER: process.env.SMTP_USER || 'NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'development'
    };

    console.log('Environment check:', envCheck);

    // Test contact email
    const { sendContactMail, sendContactAck } = await import('../middlewares/sendMail.js');
    
    await sendContactMail({ 
      name: 'Test User', 
      email: testEmail, 
      message: 'This is a test message from VHASS Academy email system.' 
    });
    
    await sendContactAck({ 
      name: 'Test User', 
      email: testEmail 
    });

    res.json({
      success: true,
      message: 'Test emails sent successfully',
      envCheck,
      testEmail
    });
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Email test failed',
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
