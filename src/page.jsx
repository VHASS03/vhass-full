"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./Components/ui/card"
import { Input } from "./Components/ui/input"
import { Label } from "./Components/ui/label"
import Navbar from "./Components/navbar"
import Footer from "./Components/footer"
import ApiService from "./services/api.js"
import { useAuth } from "./context/AuthContext.jsx"

const API_BASE = import.meta.env.VITE_API_URL || ""

// Helper function to construct proper image URL
const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
    return "/images/circuit-board.png";
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (!imagePath.includes('/')) {
    return `${API_BASE}/uploads/${imagePath}`;
  }
  if (imagePath.startsWith('uploads/')) {
    return `${API_BASE}/${imagePath}`;
  }
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE}${imagePath}`;
  }
  return imagePath;
};

export default function VHASSCoursesPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [showViewDetails, setShowViewDetails] = useState({})
  const [courses, setCourses] = useState([])
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth")
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return

    const fetchCourses = async () => {
      try {
        const data = await ApiService.getAllCourses();
        const normalized = (data.courses || []).map((c) => ({
          _id: c._id,
          title: c.title,
          instructor: c.createdBy ? `Instructor- ${c.createdBy}` : 'Instructor- VHASS SOFTWARES PRIVATE LIMITED',
          duration: c.duration ? `Duration- ${c.duration} Hours` : 'Duration- N/A',
          price: `₹${Number(c.price || c.discountedPrice || c.originalPrice || 0)}`,
          image: c.image || "/images/circuit-board.png",
        }))

        setCourses(normalized)
        setTimeout(() => {
          const viewDetailsState = {}
          normalized.forEach((course) => {
            viewDetailsState[course._id] = true
          })
          setShowViewDetails(viewDetailsState)
        }, 500)
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      }
    }
    fetchCourses()
  }, [user])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    alert("Enrollment form submitted! Proceeding to payment...")
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
        <div className="absolute top-10 left-1/4 w-[500px] h-[400px] bg-[var(--glow-color)] rounded-full blur-[150px] pointer-events-none" />

        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20 py-20 md:py-28 rounded-3xl shadow-2xl relative overflow-hidden mx-4 md:mx-0 border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-md">
          <div className="relative z-10 px-4">
            <h1 
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none text-[var(--text-primary)]" 
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Explore Our <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Courses</span>
            </h1>
            <p 
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-[var(--text-secondary)]" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Learn from industry experts and gain hands-on experience with our comprehensive cybersecurity courses
            </p>
            <div className="mt-8">
              <div
                className="inline-block px-8 py-3 rounded-full text-base md:text-lg font-semibold border border-[var(--border-color)] text-[var(--accent-primary)]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-card-hover)' }}
              >
                🚀 Transform Your Career Today
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto px-4">
          {courses.map((course, index) => (
            <Card
              key={course._id || index}
              className="group hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_var(--glow-color-hover)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] overflow-hidden rounded-2xl bg-[var(--bg-card)] backdrop-blur-md flex flex-col justify-between"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(course.image)}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/images/circuit-board.png"
                  }}
                />
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--accent-primary)]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Popular
                </div>
              </div>

              <CardHeader className="pb-2 pt-6">
                <CardTitle 
                  className="text-xl font-bold leading-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors" 
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-2 flex-grow flex flex-col justify-end">
                <div className="space-y-2 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {course.instructor}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {course.duration}
                  </p>
                  <p 
                    className="text-3xl font-extrabold mt-3" 
                    style={{ fontFamily: "'Outfit', sans-serif", background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                  >
                    {course.price}
                  </p>
                </div>

                {showViewDetails[course._id || index] && (
                  <Button
                    onClick={() => {
                      const slug = course.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "")
                      navigate(`/course/${slug}`)
                    }}
                    className="w-full text-white font-semibold py-3.5 rounded-full transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", border: 'none', background: 'var(--accent-gradient)', boxShadow: '0 4px 15px var(--glow-color)' }}
                  >
                    View Course Details
                  </Button>
                )}

                {showEnrollmentForm === (course._id || index) && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ background: 'rgba(13, 17, 23, 0.75)' }}>
                    <div className="border rounded-2xl p-8 w-full max-w-md shadow-2xl relative backdrop-blur-md" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          Enrollment Form
                        </h3>
                        <button
                          onClick={() => setShowEnrollmentForm(null)}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl font-bold transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-2 border rounded-lg px-4 py-3 w-full text-base transition-colors focus:outline-none"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-2 border rounded-lg px-4 py-3 w-full text-base transition-colors focus:outline-none"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile" className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Mobile Number
                          </Label>
                          <Input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="mt-2 border rounded-lg px-4 py-3 w-full text-base transition-colors focus:outline-none"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            placeholder="Enter your mobile number"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full text-white py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:scale-[1.01]"
                          style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 15px var(--glow-color-hover)', border: 'none' }}
                        >
                          Proceed to Pay 💳
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="text-center mt-20 px-4">
          <div className="inline-block px-8 md:px-16 py-12 md:py-16 rounded-3xl shadow-xl mx-4 border backdrop-blur-md max-w-4xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 
              className="text-2xl md:text-4xl font-extrabold mb-4 text-[var(--text-primary)]" 
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Ready to Start Your Journey?
            </h2>
            <p 
              className="text-base md:text-lg mb-8 text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Join thousands of students who have transformed their careers with VHASS
            </p>
            <Button
              className="px-8 py-3.5 text-base md:text-lg font-bold rounded-full text-white transition-all duration-300 hover:scale-[1.02]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", border: 'none', background: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--glow-color)' }}
              onClick={() => navigate('/auth')}
            >
              Get Started Today 🎯
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
