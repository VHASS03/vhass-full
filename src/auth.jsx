"use client"

import React, { useState, useEffect } from "react"
import { Mail, User, Eye, EyeOff, ArrowLeft, Lock, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import { useAuth } from "./context/AuthContext.jsx";
import GoogleLogin from "./Components/GoogleLogin.jsx";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, user, loading: authLoading, checkAuthStatus } = useAuth();
  const [currentPage, setCurrentPage] = useState("signup")
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

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setCurrentPage("login");
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const source = urlParams.get('source');
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

    if (code && state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state));
        if (stateData.source === 'google_oauth') {
          handleGoogleOAuthCallback(code);
        }
      } catch (err) {
        console.error('Error parsing OAuth state:', err);
      }
    }
  }, []);

  const handleGoogleOAuthSuccess = async (token) => {
    try {
      setLoading(true);
      setError('');
      localStorage.setItem('auth_token', token);
      await checkAuthStatus();
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/dashboard');
    } catch (err) {
      console.error('OAuth success handling error:', err);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          navigate('/dashboard');
        } else {
          setError('Authentication failed. Please try again.');
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setIsLoaded(true) }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (currentPage === "signup") {
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
        const credentials = { email: formData.email, password: formData.password }
        const result = await login(credentials)
        if (result.success) {
          navigate("/")
        } else {
          setError(result.error || "Login failed")
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      alert("Password reset email sent! Please check your email.")
      setCurrentPage("otp-verification")
    } catch (err) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues]
      newOtpValues[index] = value
      setOtpValues(newOtpValues)
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
      if (otpCode === "123456") {
        alert("OTP verified! You can now reset your password.")
        setCurrentPage("login")
      } else {
        setError("Invalid OTP code")
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

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
            </button>
          </p>
        </div>

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
      </form>
    </>
  )

  const renderOtpVerification = () => (
    <>
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
            {otpValues.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-bold rounded-xl transition-all duration-200"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--glow-color)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                required
              />
            ))}
          </div>
        </div>

        <SubmitButton>Verify Code</SubmitButton>

        <div className="text-center">
          <button
            type="button"
            onClick={() => console.log("Resend OTP")}
            className="text-sm underline transition-colors duration-200"
            style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </form>
    </>
  )

  if (authLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 animate-spin mx-auto" style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)' }}></div>
            <p style={{ color: 'var(--text-muted)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    </div>
  )
}
