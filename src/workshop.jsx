"use client"
import React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Components/navbar"
import Footer from "./Components/footer"
import { useAuth } from "./context/AuthContext.jsx"

export default function VHASSWorkshopsPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth")
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[var(--border-color)] border-l-[var(--accent-primary)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] font-semibold">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16 relative">
        {/* Background glow decoration */}
        <div className="absolute top-10 left-1/3 w-[500px] h-[400px] bg-[var(--glow-color)] rounded-full blur-[150px] pointer-events-none" />

        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24 py-20 md:py-28 rounded-3xl shadow-2xl relative overflow-hidden mx-4 md:mx-0 border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md">
          <div className="relative z-10 px-4">
            <h1 
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none text-[var(--text-primary)]" 
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Explore Our <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Workshops</span>
            </h1>
            <p 
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-[var(--text-secondary)]" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Hands-on practical sessions guided by cybersecurity professionals to build your skills
            </p>
          </div>
        </div>

        {/* Workshops Coming Soon - Glass Card Placeholder */}
        <div className="max-w-2xl mx-auto text-center py-16 px-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md shadow-2xl relative overflow-hidden my-12">
          {/* Decorative inner glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--glow-color)] rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-primary)] mb-6 text-3xl shadow-md">
              📅
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
              Workshops Coming Soon
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              We are crafting interactive learning experiences driven by real-world projects. Stay tuned for dates, topics, and registration details!
            </p>
            <button 
              className="px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
              style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 15px var(--glow-color)', border: 'none' }}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
