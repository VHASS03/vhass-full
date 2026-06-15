"use client"

import React, { useState, useEffect } from "react"
<<<<<<< HEAD
import { Mail, User, Eye, EyeOff, ArrowLeft, Lock, Shield } from "lucide-react"
=======
import { Mail, User, Eye, EyeOff, ArrowLeft } from "lucide-react"
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
import { useNavigate } from "react-router-dom"

import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import { useAuth } from "./context/AuthContext.jsx";
import GoogleLogin from "./Components/GoogleLogin.jsx";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, user, loading: authLoading, checkAuthStatus } = useAuth();
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState("signup")
=======
  const [currentPage, setCurrentPage] = useState("signup") // Start with signup as shown in reference
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [forgotEmail, setForgotEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

<<<<<<< HEAD
=======
  // Redirect if user is already logged in
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

<<<<<<< HEAD
=======
  // Set login mode when accessing /login route
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
  useEffect(() => {
    if (window.location.pathname === '/login') {
      setCurrentPage("login");
    }
  }, []);

<<<<<<< HEAD
=======
  // Handle Google OAuth callback
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const source = urlParams.get('source');
<<<<<<< HEAD
    const errorParam = urlParams.get('error');

    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token && source === 'google') {
      handleGoogleOAuthSuccess(token);
    }

    const code = urlParams.get('code');
    const state = urlParams.get('state');

=======
    const error = urlParams.get('error');
    
    if (error) {
      setError(`Authentication failed: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (token && source === 'google') {
      handleGoogleOAuthSuccess(token);
    }
    
    // Legacy code handling (keep for compatibility)
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
    if (code && state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state));
        if (stateData.source === 'google_oauth') {
<<<<<<< HEAD
          handleGoogleOAuthCallback(code);
        }
      } catch (err) {
        console.error('Error parsing OAuth state:', err);
=======
          // Handle Google OAuth callback
          handleGoogleOAuthCallback(code);
        }
      } catch (error) {
        console.error('Error parsing OAuth state:', error);
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
      }
    }
  }, []);

  const handleGoogleOAuthSuccess = async (token) => {
    try {
      setLoading(true);
      setError('');
<<<<<<< HEAD
      localStorage.setItem('auth_token', token);
      await checkAuthStatus();
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dashboard');
    } catch (err) {
      console.error('OAuth success handling error:', err);
=======
      
      console.log('Google OAuth success, token received');
      
      // Store the token
      localStorage.setItem('auth_token', token);
      
      // Token is already stored, just refresh auth status
      await checkAuthStatus();
      
      // Clean up URL and redirect
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dashboard');
    } catch (error) {
      console.error('OAuth success handling error:', error);
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
      setError('Authentication failed. Please try again.');
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleOAuthCallback = async (code) => {
    try {
      setLoading(true);
      setError('');
<<<<<<< HEAD
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
=======
      
      // Exchange code for token via your backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
<<<<<<< HEAD
=======
          // Redirect to dashboard
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
          navigate('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
<<<<<<< HEAD
    } catch (err) {
      console.error('OAuth callback error:', err);
=======
    } catch (error) {
      console.error('OAuth callback error:', error);
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => { setIsLoaded(true) }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
=======
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
<<<<<<< HEAD
    try {
      if (currentPage === "signup") {
=======
    
    try {
      if (currentPage === "signup") {
        // Handle signup
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }
<<<<<<< HEAD
=======
        
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
        const userData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        }
<<<<<<< HEAD
=======
        
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
        const result = await register(userData)
        if (result.success) {
          alert("Registration successful! Please check your email for verification.")
          setCurrentPage("login")
        } else {
          setError(result.error || "Registration failed")
        }
      } else {
<<<<<<< HEAD
        const credentials = { email: formData.email, password: formData.password }
        const result = await login(credentials)
        if (result.success) {
          navigate("/")
=======
        // Handle login
        const credentials = {
          email: formData.email,
          password: formData.password
        }
        
        const result = await login(credentials)
        if (result.success) {
          navigate("/") // Redirect to home page after successful login
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
        } else {
          setError(result.error || "Login failed")
        }
      }
<<<<<<< HEAD
    } catch (err) {
      setError(err.message || "An error occurred")
=======
    } catch (error) {
      setError(error.message || "An error occurred")
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
<<<<<<< HEAD
    try {
      alert("Password reset email sent! Please check your email.")
      setCurrentPage("otp-verification")
    } catch (err) {
      setError(err.message || "Failed to send reset email")
=======
    
    try {
      // This would need to be implemented in the backend
      // For now, we'll simulate sending reset email
      alert("Password reset email sent! Please check your email.")
      setCurrentPage("otp-verification")
    } catch (error) {
      setError(error.message || "Failed to send reset email")
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues]
      newOtpValues[index] = value
      setOtpValues(newOtpValues)
<<<<<<< HEAD
=======

      // Auto-focus next input
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otpValues.join("")
    setLoading(true)
    setError("")
<<<<<<< HEAD
    try {
=======
    
    try {
      // This would need to be implemented in the backend
      // For now, we'll simulate OTP verification
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
      if (otpCode === "123456") {
        alert("OTP verified! You can now reset your password.")
        setCurrentPage("login")
      } else {
        setError("Invalid OTP code")
      }
<<<<<<< HEAD
    } catch (err) {
      setError(err.message || "Failed to verify OTP")
=======
    } catch (error) {
      setError(error.message || "Failed to verify OTP")
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  const toggleForm = () => {
    setCurrentPage(currentPage === "signup" ? "login" : "signup")
    setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
    setError("")
  }

  const goBack = () => {
    if (currentPage === "forgot-password") setCurrentPage("login")
    else if (currentPage === "otp-verification") setCurrentPage("forgot-password")
    setForgotEmail("")
    setOtpValues(["", "", "", "", "", ""])
    setError("")
  }

  // ─── Shared input style ───────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    padding: '12px 44px 12px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const InputField = ({ label, icon: Icon, rightSlot, ...inputProps }) => (
    <div className="space-y-1">
      <label style={labelStyle}>{label}</label>
      <div className="relative">
        <input
          {...inputProps}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--glow-color)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
        />
        {rightSlot ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        ) : Icon ? (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        ) : null}
      </div>
    </div>
  )

  const SubmitButton = ({ children, disabled }) => (
    <button
      type="submit"
      disabled={disabled}
      className="w-full py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      style={{
        background: 'var(--accent-gradient)',
        boxShadow: '0 4px 15px var(--glow-color)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '0.95rem',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.boxShadow = '0 6px 20px var(--glow-color-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 15px var(--glow-color)'; }}
    >
      {children}
    </button>
  )

  const renderMainForm = () => {
    const isLogin = currentPage === "login"
    return (
      <>
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)' }}>
            <Shield className="w-3.5 h-3.5" />
            {isLogin ? "Secure Login" : "Create Account"}
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
            {isLogin ? "Welcome" : "Get Started"}{" "}
            <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {isLogin ? "Back" : "Free"}
            </span>
            <span style={{ color: 'var(--accent-primary)' }}>.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.95rem' }}>
            {isLogin ? "New to VHASS? " : "Already a member? "}
            <button
              onClick={toggleForm}
              className="font-semibold transition-colors duration-200"
              style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}
            >
              {isLogin ? "Create Account" : "Log In"}
=======


  const toggleForm = () => {
    if (currentPage === "signup") {
      setCurrentPage("login")
    } else {
      setCurrentPage("signup")
    }
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
  }

  const goBack = () => {
    if (currentPage === "forgot-password") {
      setCurrentPage("login")
    } else if (currentPage === "otp-verification") {
      setCurrentPage("forgot-password")
    }
    setForgotEmail("")
    setOtpValues(["", "", "", "", "", ""])
  }

  const renderMainForm = () => {
    const isLogin = currentPage === "login"

    return (
      <>
        {/* Header Text with 3D effects */}
        <div className="space-y-2 text-center">
          <p className="text-gray-400 text-sm font-medium tracking-wide uppercase transform-gpu transition-all duration-300 hover:scale-102 hover:text-gray-300">
            START FOR FREE
          </p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight">
            {isLogin ? "Welcome back" : "Create new account"}
            <span className="text-[#6D38E0] animate-pulse-glow">.</span>
          </h1>
          <p className="text-gray-300 mt-4 transform-gpu transition-all duration-300 hover:text-white">
            {isLogin ? "New to Vhass? " : "Already A Member? "}
            <button
              onClick={toggleForm}
              className="text-[#6D38E0] hover:text-[#9F7BFF] font-medium transition-all duration-300 underline transform-gpu hover:scale-102 hover:-translate-y-0.5 relative group"
            >
              {isLogin ? "Create Account" : "Log In"}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#9F7BFF] transition-all duration-300 group-hover:w-full"></span>
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
            </button>
          </p>
        </div>

<<<<<<< HEAD
        {/* Error */}
        {error && (
          <div className="rounded-xl p-3 mb-5 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <InputField label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" icon={User} required />
              <InputField label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" icon={User} required />
            </div>
          )}

          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@vhassacademy.com" icon={Mail} required />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            required
            rightSlot={
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {!isLogin && (
            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              rightSlot={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          )}

          <div className="pt-2 space-y-3">
            <SubmitButton disabled={loading}>
              {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
            </SubmitButton>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            </div>

            <GoogleLogin />
          </div>

          {isLogin && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentPage("forgot-password")}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
=======
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form with enhanced 3D effects */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              {/* First Name with 3D hover */}
              <div className="space-y-2 group">
                <label className="text-gray-300 text-sm transform-gpu transition-all duration-300 group-hover:text-gray-200 group-hover:translate-x-1">
                  First name
                </label>
                <div className="relative transform-gpu transition-all duration-300">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Michal"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 input-3d-enhanced"
                    required
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-[#6D38E0] group-hover:scale-110" />
                </div>
              </div>

              {/* Last Name with 3D hover */}
              <div className="space-y-2 group">
                <label className="text-gray-300 text-sm transform-gpu transition-all duration-300 group-hover:text-gray-200 group-hover:translate-x-1">
                  Last name
                </label>
                <div className="relative transform-gpu transition-all duration-300">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Maslak"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 input-3d-enhanced"
                    required
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-[#6D38E0] group-hover:scale-110" />
                </div>
              </div>
            </div>
          )}

          {/* Email with enhanced 3D effects */}
          <div className="space-y-2 group">
            <label className="text-gray-300 text-sm transform-gpu transition-all duration-300 group-hover:text-gray-200 group-hover:translate-x-1">
              Email
            </label>
            <div className="relative transform-gpu transition-all duration-300">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={isLogin ? "your.email@vhass.co" : "michal.maslak@vhass.co"}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 input-3d-enhanced"
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-[#6D38E0] group-hover:scale-110" />
            </div>
          </div>

          {/* Password with enhanced 3D effects */}
          <div className="space-y-2 group">
            <label className="text-gray-300 text-sm transform-gpu transition-all duration-300 group-hover:text-gray-200 group-hover:translate-x-1">
              Password
            </label>
            <div className="relative transform-gpu transition-all duration-300">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 pr-12 input-3d-enhanced"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6D38E0] transition-all duration-300 hover:scale-125 transform-gpu"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2 group">
              <label className="text-gray-300 text-sm transform-gpu transition-all duration-300 group-hover:text-gray-200 group-hover:translate-x-1">
                Confirm Password
              </label>
              <div className="relative transform-gpu transition-all duration-300">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 pr-12 input-3d-enhanced"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#6D38E0] transition-all duration-300 hover:scale-125 transform-gpu"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Main Action Button - Same size as Google button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#6D38E0] to-[#9F7BFF] rounded-full text-white font-medium shadow-lg transition-all duration-300 transform-gpu hover:scale-102 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : (isLogin ? "Sign in" : "Create account")}
            </button>
          </div>

          {/* Google Login Button */}
          <div className="pt-2">
            <GoogleLogin />
          </div>

          {/* Enhanced Forgot Password Link - Functional */}
          {isLogin && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setCurrentPage("forgot-password")}
                className="inline-block px-4 py-2 text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg hover:bg-white/90 hover:border-[#6D38E0] hover:text-[#9F7BFF] transition-all duration-300 transform-gpu hover:scale-102 hover:-translate-y-1 font-medium shadow-lg hover:shadow-xl"
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>
      </>
    )
  }

  const renderForgotPassword = () => (
    <>
<<<<<<< HEAD
      <button onClick={goBack} className="flex items-center gap-2 mb-8 text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </button>

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl font-extrabold" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
          Forgot <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Password</span>
          <span style={{ color: 'var(--accent-primary)' }}>?</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Enter your email and we'll send a verification code.
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-3 mb-5 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
        <InputField label="Email Address" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@vhassacademy.com" icon={Mail} required />
        <SubmitButton>Send Verification Code</SubmitButton>
=======
      {/* Back Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 transform-gpu hover:scale-102 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </button>
      </div>

      {/* Header Text */}
      <div className="space-y-2 mb-8 text-center">
        <p className="text-gray-400 text-sm font-medium tracking-wide uppercase transform-gpu transition-all duration-300 hover:scale-102 hover:text-gray-300">
          RESET PASSWORD
        </p>
        <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight">
          Forgot password<span className="text-[#6D38E0] animate-pulse-glow">?</span>
        </h1>
        <p className="text-gray-300 mt-4">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      {/* Forgot Password Form */}
      <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
        <div className="space-y-2 group">
          <label className="text-gray-300 text-sm transform-gpu transition-all duration-300 group-hover:text-gray-200 group-hover:translate-x-1">
            Email Address
          </label>
          <div className="relative transform-gpu transition-all duration-300">
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="your.email@vhass.co"
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 input-3d-enhanced"
              required
            />
            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-[#6D38E0] group-hover:scale-110" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-[#6D38E0] to-[#9F7BFF] rounded-full text-white font-medium shadow-lg transition-all duration-300 transform-gpu hover:scale-102 hover:-translate-y-1 hover:shadow-2xl"
        >
          Send Verification Code
        </button>
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
      </form>
    </>
  )

  const renderOtpVerification = () => (
    <>
<<<<<<< HEAD
      <button onClick={goBack} className="flex items-center gap-2 mb-8 text-sm transition-colors duration-200" style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl font-extrabold" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
          Enter <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>OTP</span>
          <span style={{ color: 'var(--accent-primary)' }}>.</span>
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          We sent a 6-digit code to <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{forgotEmail}</span>
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-3 mb-5 text-sm" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div>
          <label style={labelStyle}>Verification Code</label>
          <div className="flex gap-2 justify-center mt-3">
=======
      {/* Back Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 transform-gpu hover:scale-102 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header Text */}
      <div className="space-y-2 mb-8 text-center">
        <p className="text-gray-400 text-sm font-medium tracking-wide uppercase transform-gpu transition-all duration-300 hover:scale-102 hover:text-gray-300">
          VERIFICATION
        </p>
        <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight">
          Enter OTP<span className="text-[#6D38E0] animate-pulse-glow">.</span>
        </h1>
        <p className="text-gray-300 mt-4">
          We've sent a 6-digit verification code to <span className="text-[#6D38E0] font-medium">{forgotEmail}</span>
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="text-gray-300 text-sm">Verification Code</label>
          <div className="flex space-x-3 justify-center">
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
            {otpValues.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
<<<<<<< HEAD
                className="w-12 h-12 text-center text-xl font-bold rounded-xl transition-all duration-200"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--glow-color)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
=======
                className="w-12 h-12 text-center text-xl font-bold bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 input-3d-enhanced transform-gpu"
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
                required
              />
            ))}
          </div>
        </div>

<<<<<<< HEAD
        <SubmitButton>Verify Code</SubmitButton>
=======
        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-[#6D38E0] to-[#9F7BFF] rounded-full text-white font-medium shadow-lg transition-all duration-300 transform-gpu hover:scale-102 hover:-translate-y-1 hover:shadow-2xl"
        >
          Verify Code
        </button>
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e

        <div className="text-center">
          <button
            type="button"
            onClick={() => console.log("Resend OTP")}
<<<<<<< HEAD
            className="text-sm underline transition-colors duration-200"
            style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
=======
            className="text-gray-300 hover:text-[#6D38E0] transition-all duration-300 transform-gpu hover:scale-102 underline"
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </form>
    </>
  )

<<<<<<< HEAD
  if (authLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 animate-spin mx-auto" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)' }}></div>
            <p style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading...</p>
=======
  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen overflow-hidden">
        <Navbar />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 lg:px-16">
          <div className="w-full max-w-md text-center">
            <div className="space-y-6">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p className="text-white">Loading...</p>
              </div>
            </div>
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
          </div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  if (user) return null;

  return (
    <div
      className={`min-h-screen transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Navbar />

      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: 'var(--hero-glow)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px]" style={{ background: 'var(--glow-color)' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-24">
        <div className="w-full max-w-md">
          {/* Card */}
          <div
            className="rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
            }}
          >
            {(currentPage === "signup" || currentPage === "login") && renderMainForm()}
            {currentPage === "forgot-password" && renderForgotPassword()}
            {currentPage === "otp-verification" && renderOtpVerification()}
          </div>

          {/* Bottom trust badge */}
          <div className="text-center mt-6">
            <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Secured by VHASS Academy · SSL Encrypted
            </p>
          </div>
=======
  // Don't render auth form if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div
      className={`min-h-screen overflow-hidden transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >


      {/* New Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 lg:px-16">
        <div className="w-full max-w-md text-center">
          {/* Form Container with 3D perspective */}
          <div className="space-y-6 transform-gpu transition-all duration-700 animate-slide-in-3d">
            {currentPage === "signup" || currentPage === "login" ? renderMainForm() : null}
            {currentPage === "forgot-password" ? renderForgotPassword() : null}
            {currentPage === "otp-verification" ? renderOtpVerification() : null}
          </div>
        </div>
      </div>

      {/* Bottom Right Logo with 3D hover */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="w-12 h-12 relative opacity-60 hover:opacity-100 transition-all duration-300 transform-gpu hover:scale-125 hover:rotate-12 cursor-pointer">
          <img src="/vhass-logo.png" alt="Vhass" width={48} height={48} className="object-contain drop-shadow-2xl" />
         
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
        </div>
      </div>
    </div>
  )
}
