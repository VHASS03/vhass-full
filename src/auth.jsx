"use client"

import React, { useState, useEffect } from "react"
import { Mail, User, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import { useAuth } from "./context/AuthContext.jsx";
import GoogleLogin from "./Components/GoogleLogin.jsx";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, user, loading: authLoading, checkAuthStatus } = useAuth();
  const [currentPage, setCurrentPage] = useState("signup") // Start with signup as shown in reference
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

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  // Set login mode when accessing /login route
  useEffect(() => {
    if (window.location.pathname === '/login') {
      setCurrentPage("login");
    }
  }, []);

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const source = urlParams.get('source');
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
    
    if (code && state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state));
        if (stateData.source === 'google_oauth') {
          // Handle Google OAuth callback
          handleGoogleOAuthCallback(code);
        }
      } catch (error) {
        console.error('Error parsing OAuth state:', error);
      }
    }
  }, []);

  const handleGoogleOAuthSuccess = async (token) => {
    try {
      setLoading(true);
      setError('');
      
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
      
      // Exchange code for token via your backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      if (currentPage === "signup") {
        // Handle signup
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }
        
        const userData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        }
        
        const result = await register(userData)
        if (result.success) {
          alert("Registration successful! Please check your email for verification.")
          setCurrentPage("login")
        } else {
          setError(result.error || "Registration failed")
        }
      } else {
        // Handle login
        const credentials = {
          email: formData.email,
          password: formData.password
        }
        
        const result = await login(credentials)
        if (result.success) {
          navigate("/") // Redirect to home page after successful login
        } else {
          setError(result.error || "Login failed")
        }
      }
    } catch (error) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      // This would need to be implemented in the backend
      // For now, we'll simulate sending reset email
      alert("Password reset email sent! Please check your email.")
      setCurrentPage("otp-verification")
    } catch (error) {
      setError(error.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues]
      newOtpValues[index] = value
      setOtpValues(newOtpValues)

      // Auto-focus next input
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
    
    try {
      // This would need to be implemented in the backend
      // For now, we'll simulate OTP verification
      if (otpCode === "123456") {
        alert("OTP verified! You can now reset your password.")
        setCurrentPage("login")
      } else {
        setError("Invalid OTP code")
      }
    } catch (error) {
      setError(error.message || "Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }



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
            </button>
          </p>
        </div>

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
      </form>
    </>
  )

  const renderOtpVerification = () => (
    <>
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
            {otpValues.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-bold bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-900 focus:border-[#6D38E0] focus:ring-2 focus:ring-[#6D38E0]/20 transition-all duration-300 input-3d-enhanced transform-gpu"
                required
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-gradient-to-r from-[#6D38E0] to-[#9F7BFF] rounded-full text-white font-medium shadow-lg transition-all duration-300 transform-gpu hover:scale-102 hover:-translate-y-1 hover:shadow-2xl"
        >
          Verify Code
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => console.log("Resend OTP")}
            className="text-gray-300 hover:text-[#6D38E0] transition-all duration-300 transform-gpu hover:scale-102 underline"
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </form>
    </>
  )

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
          </div>
        </div>
      </div>
    );
  }

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
         
        </div>
      </div>
    </div>
  )
}
