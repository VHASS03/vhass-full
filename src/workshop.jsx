"use client"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "./Components/navbar"
import Footer from "./Components/footer"
import { useAuth } from "./context/AuthContext.jsx"
import ApiService from "./services/api.js"

// Helper to resolve image URL (same pattern used in Dashboard & WorkshopDetail)
const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === "null" || imagePath === "undefined") {
    return "/images/circuit-board.png";
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (!imagePath.includes("/")) {
    return `/uploads/${imagePath}`;
  }
  if (imagePath.startsWith("uploads/")) {
    return `/${imagePath}`;
  }
  return imagePath;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function VHASSWorkshopsPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth")
    }
  }, [user, authLoading, navigate])

  // Fetch all workshops from API
  useEffect(() => {
    if (!user) return;
    const fetchWorkshops = async () => {
      try {
        setLoading(true)
        const data = await ApiService.getAllWorkshops()
        setWorkshops(data.workshops || [])
      } catch (err) {
        console.error("Failed to fetch workshops:", err)
        setError("Unable to load workshops. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchWorkshops()
  }, [user])

  if (authLoading) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[var(--border-color)] border-l-[var(--accent-primary)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)] font-semibold">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="min-h-screen font-sans bg-[var(--bg-primary)] text-[var(--text-primary)]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Navbar />

      <main className="container mx-auto px-4 py-12 md:py-16 relative">
        {/* Background glow */}
        <div className="absolute top-10 left-1/3 w-[500px] h-[400px] bg-[var(--glow-color)] rounded-full blur-[150px] pointer-events-none" />

        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20 py-20 md:py-28 rounded-3xl shadow-2xl relative overflow-hidden mx-4 md:mx-0 border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md">
          <div className="relative z-10 px-4">
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none text-[var(--text-primary)]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Explore Our{" "}
              <span
                style={{
                  background: "var(--accent-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Workshops
              </span>
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-[var(--text-secondary)]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Hands-on practical sessions guided by cybersecurity professionals to build your skills
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-[var(--border-color)] border-l-[var(--accent-primary)] rounded-full animate-spin"></div>
            <p className="text-[var(--text-secondary)] font-semibold text-lg">Loading workshops...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="max-w-xl mx-auto text-center py-16 px-8 rounded-3xl border border-red-500/30 bg-red-500/10 shadow-xl my-12">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              className="px-6 py-2.5 rounded-full font-bold text-white transition-all hover:scale-[1.02]"
              style={{ background: "var(--accent-gradient)" }}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Workshops grid */}
        {!loading && !error && workshops.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {workshops.map((workshop) => (
              <WorkshopCard
                key={workshop._id}
                workshop={workshop}
                navigate={navigate}
              />
            ))}
          </div>
        )}

        {/* Coming Soon — only if no workshops in DB */}
        {!loading && !error && workshops.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16 px-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md shadow-2xl relative overflow-hidden my-12">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--glow-color)] rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-primary)] mb-6 text-3xl shadow-md">
                📅
              </div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-4"
                style={{ fontFamily: "'Outfit', sans-serif", color: "var(--text-primary)" }}
              >
                Workshops Coming Soon
              </h2>
              <p
                className="text-[var(--text-secondary)] text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                We are crafting interactive learning experiences driven by real-world projects. Stay tuned for dates, topics, and registration details!
              </p>
              <button
                className="px-8 py-3.5 rounded-full font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
                style={{ background: "var(--accent-gradient)", boxShadow: "0 4px 15px var(--glow-color)", border: "none" }}
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function WorkshopCard({ workshop, navigate }) {
  const isUpcoming = workshop.date && new Date(workshop.date) > new Date();

  return (
    <div
      className="group relative flex flex-col rounded-3xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-[var(--accent-primary)]"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/workshop/${workshop._id}`)}
    >
      {/* Badge */}
      {isUpcoming && (
        <span
          className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold tracking-wide text-white"
          style={{ background: "var(--accent-gradient)" }}
        >
          Upcoming
        </span>
      )}

      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden bg-[var(--bg-secondary)]">
        <img
          src={getImageUrl(workshop.image)}
          alt={workshop.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/images/circuit-board.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Category badge */}
        {workshop.category && (
          <span className="self-start px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
            {workshop.category}
          </span>
        )}

        <h2
          className="text-xl font-bold leading-snug text-[var(--text-primary)] line-clamp-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {workshop.title}
        </h2>

        <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-3">
          {workshop.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mt-auto pt-3 border-t border-[var(--border-color)]">
          {workshop.date && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              📅 <span>{formatDate(workshop.date)}</span>
            </span>
          )}
          {workshop.time && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              🕐 <span>{workshop.time}</span>
            </span>
          )}
          {workshop.duration && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              ⏱ <span>{workshop.duration}h</span>
            </span>
          )}
          {workshop.location && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              📍 <span>{workshop.location}</span>
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4">
          <span
            className="text-2xl font-extrabold"
            style={{
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ₹{workshop.price}
          </span>
          <button
            className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-[1.04] active:scale-[0.97] shadow"
            style={{ background: "var(--accent-gradient)", border: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/workshop/${workshop._id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
