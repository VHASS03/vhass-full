import express from 'express';
import passport from 'passport';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Debug middleware to log requests
router.use((req, res, next) => {
  console.log('Auth Route:', req.method, req.path);
  next();
});

// Google OAuth routes
router.get('/google',
  (req, res, next) => {
    console.log('Initiating Google OAuth...');
    next();
  },
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('🔍 Received Google OAuth callback:');
    console.log('Query params:', req.query);
    console.log('URL:', req.url);
    console.log('Headers origin:', req.headers.origin);
    console.log('Headers referer:', req.headers.referer);
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/auth?error=oauth_failed`,
    session: true
  }),
  async (req, res) => {
    try {
      console.log('Google authentication successful, setting session...');
      console.log('User data:', req.user);
      
      // Store user in session
      req.session.user = req.user;
      
      // Generate JWT token for frontend
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
          return res.redirect(`${process.env.FRONTEND_URL}/auth?error=session_error`);
        }
      
        // Redirect to frontend with token in URL fragment (more secure than query param)
        const redirectUrl = `${process.env.FRONTEND_URL}/auth?token=${token}&source=google`;
        console.log('Redirecting to:', redirectUrl);
        res.redirect(redirectUrl);
      });
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth?error=auth_failed`);
    }
  }
);

// Verify token endpoint
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    console.log('Token verified for user:', user.email);
    res.json({ 
      success: true, 
      user 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  try {
    console.log('Logging out user...');

    // ✅ Destroy the session on the server
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to logout' 
        });
      }

      // ✅ Clear the session cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'None'
      });

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});


export default router; 
