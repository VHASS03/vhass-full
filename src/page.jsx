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

// Helper function to construct proper image URL
const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
    return "/images/circuit-board.png";
  }
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (!imagePath.includes('/')) {
    return `/uploads/${imagePath}`;
  }
  if (imagePath.startsWith('uploads/')) {
    return `/${imagePath}`;
  }
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
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
          <div className="w-10 h-10 border-4 border-white/10 border-l-[#c084fc] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20 py-20 md:py-28 rounded-3xl shadow-2xl relative overflow-hidden mx-4 md:mx-0 border border-white/5 bg-gradient-to-b from-[var(--bg-primary)] via-purple-950/15 to-transparent">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 px-4">
            <h1 
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none" 
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Explore Our <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">Courses</span>
            </h1>
            <p 
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-300" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Learn from industry experts and gain hands-on experience with our comprehensive cybersecurity courses
            </p>
            <div className="mt-8">
              <div
                className="inline-block px-8 py-3 rounded-full text-base md:text-lg font-semibold bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
              className="group hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] border border-white/10 overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-md flex flex-col justify-between"
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
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-purple-600/20 border border-purple-500/30 text-purple-300"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Popular
                </div>
              </div>

              <CardHeader className="pb-2 pt-6">
                <CardTitle 
                  className="text-xl font-bold leading-tight text-white group-hover:text-purple-300 transition-colors" 
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {course.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-2 flex-grow flex flex-col justify-end">
                <div className="space-y-2 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <p className="text-sm text-gray-400">
                    {course.instructor}
                  </p>
                  <p className="text-sm text-gray-400">
                    {course.duration}
                  </p>
                  <p 
                    className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 mt-3" 
                    style={{ fontFamily: "'Outfit', sans-serif" }}
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
                    className="w-full text-white font-semibold py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-md"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", border: 'none' }}
                  >
                    View Course Details
                  </Button>
                )}

                {showEnrollmentForm === (course._id || index) && (
                  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0b0b0f] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          Enrollment Form
                        </h3>
                        <button
                          onClick={() => setShowEnrollmentForm(null)}
                          className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-semibold text-gray-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-2 border border-white/10 rounded-lg px-4 py-3 w-full bg-white/[0.03] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-2 border border-white/10 rounded-lg px-4 py-3 w-full bg-white/[0.03] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile" className="text-sm font-semibold text-gray-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Mobile Number
                          </Label>
                          <Input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            className="mt-2 border border-white/10 rounded-lg px-4 py-3 w-full bg-white/[0.03] text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/20 text-base"
                            placeholder="Enter your mobile number"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full text-white py-4 rounded-full font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg"
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
          <div className="inline-block px-8 md:px-16 py-12 md:py-16 rounded-3xl shadow-xl mx-4 border border-white/5 bg-gradient-to-r from-purple-950/10 to-indigo-950/10 backdrop-blur-md max-w-4xl">
            <h2 
              className="text-2xl md:text-4xl font-extrabold mb-4 text-white" 
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Ready to Start Your Journey?
            </h2>
            <p 
              className="text-base md:text-lg mb-8 text-gray-300 max-w-xl mx-auto leading-relaxed" 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Join thousands of students who have transformed their careers with VHASS
            </p>
            <Button
              className="px-8 py-3.5 text-base md:text-lg font-bold rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(168,85,247,0.3)] transition-all duration-300"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", border: 'none' }}
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