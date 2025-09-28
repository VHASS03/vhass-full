import React from 'react';
import { GoogleLogin as GoogleLoginButton } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api.js';

export default function GoogleLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode the JWT token to get user info
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      
      // Extract user information from Google response
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub,
        email_verified: decoded.email_verified
      };

      // Call the login function from AuthContext
      await login(userData);
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error);
    
    // Check if it's a FedCM error
    if (error?.error === 'popup_closed_by_user' || error?.error === 'access_denied') {
      console.log('FedCM disabled, trying alternative OAuth flow...');
      // Try the manual OAuth flow
      try {
        const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
          `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID || '8739533127-rvga58btf64j28njdjdq84r2kof2h4n4.apps.googleusercontent.com'}&` +
          `redirect_uri=${encodeURIComponent(window.location.origin + '/auth')}&` +
          `response_type=code&` +
          `scope=openid%20email%20profile&` +
          `access_type=offline&` +
          `prompt=consent`;
        
        window.location.href = googleAuthUrl;
        return;
      } catch (fallbackError) {
        console.error('Fallback OAuth also failed:', fallbackError);
      }
    }
    
    alert('Google login failed. Please try the alternative login methods below.');
  };

  return (
    <div className="google-login-container">
      {/* Primary: Standard Google Login Button */}
      <GoogleLoginButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="filled_black"
        size="large"
        text="continue_with"
        shape="rectangular"
        width={400}
        locale="en"
        auto_select={false}
        cancel_on_tap_outside={true}
        ux_mode="popup"
        popup_type="window"
      />
      
      {/* Fallback 1: Manual OAuth flow */}
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => {
            try {
              // Use a more direct OAuth approach
              const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
                `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID || '8739533127-rvga58btf64j28njdjdq84r2kof2h4n4.apps.googleusercontent.com'}&` +
                `redirect_uri=${encodeURIComponent(window.location.origin + '/auth')}&` +
                `response_type=code&` +
                `scope=openid%20email%20profile&` +
                `access_type=offline&` +
                `prompt=consent`;
              
              window.location.href = googleAuthUrl;
            } catch (error) {
              console.error('Google OAuth redirect failed:', error);
              alert('Unable to redirect to Google OAuth. Please try again.');
            }
          }}
          style={{
            border: '1px solid #e5e7eb',
            padding: '10px 16px',
            borderRadius: 8,
            background: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '8px'
          }}
        >
          Continue with Google (OAuth)
        </button>
      </div>
      
      {/* Fallback 2: API-based OAuth */}
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => {
            try {
              window.location.href = ApiService.getGoogleAuthUrl();
            } catch (error) {
              console.error('Google OAuth redirect failed:', error);
              alert('Unable to redirect to Google OAuth. Please try again.');
            }
          }}
          style={{
            border: '1px solid #e5e7eb',
            padding: '10px 16px',
            borderRadius: 8,
            background: '#f8f9fa',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Continue with Google (API)
        </button>
      </div>
    </div>
  );
}
