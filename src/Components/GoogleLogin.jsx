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
      {/* Primary: Direct OAuth redirect (bypasses COOP issues) */}
      <button
        type="button"
        onClick={() => {
          try {
            // Use direct OAuth redirect to bypass COOP issues
            const redirectUri = window.location.origin + '/auth';
            const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
              `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID || '8739533127-rvga58btf64j28njdjdq84r2kof2h4n4.apps.googleusercontent.com'}&` +
              `redirect_uri=${encodeURIComponent(redirectUri)}&` +
              `response_type=code&` +
              `scope=openid%20email%20profile&` +
              `access_type=offline&` +
              `prompt=consent&` +
              `state=${encodeURIComponent(JSON.stringify({ source: 'google_oauth' }))}`;
            
            console.log('Google OAuth URL:', googleAuthUrl);
            console.log('Redirect URI:', redirectUri);
            console.log('Current origin:', window.location.origin);
            
            // Use window.location.replace to avoid COOP issues
            window.location.replace(googleAuthUrl);
          } catch (error) {
            console.error('Google OAuth redirect failed:', error);
            alert('Unable to redirect to Google OAuth. Please try again.');
          }
        }}
        style={{
          width: '100%',
          padding: '12px 24px',
          borderRadius: '8px',
          background: '#4285f4',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.target.style.background = '#3367d6'}
        onMouseOut={(e) => e.target.style.background = '#4285f4'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
      
      {/* Alternative: Standard Google Login Button (if direct OAuth fails) */}
      <div style={{ marginTop: '12px', textAlign: 'center' }}>
        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width={400}
          locale="en"
          auto_select={false}
          cancel_on_tap_outside={true}
          ux_mode="redirect"
        />
      </div>
      
      {/* Fallback: Manual OAuth with proper redirect */}
      <div style={{ marginTop: '8px', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => {
            try {
              // Use the API service method which should have proper redirect URI
              const apiUrl = ApiService.getGoogleAuthUrl();
              console.log('Using API Google Auth URL:', apiUrl);
              window.location.href = apiUrl;
            } catch (error) {
              console.error('API Google OAuth failed:', error);
              alert('Google OAuth failed. Please try again.');
            }
          }}
          style={{
            width: '100%',
            padding: '8px 16px',
            borderRadius: '6px',
            background: '#f8f9fa',
            color: '#333',
            border: '1px solid #ddd',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Try Alternative Google Login
        </button>
      </div>
    </div>
  );
}
