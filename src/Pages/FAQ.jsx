"use client"
import React from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Mail, Phone } from "lucide-react"
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import "../App.css"


export default function HelpDeskPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const faqs = [
    {
      id: 1,
      question: "What courses do you offer?",
      answer:
        "We offer comprehensive cybersecurity courses including Ethical Hacking, Bounty Hunting, Cyber Crime Awareness, and Cyber Security for Beginners.",
      category: "Courses",
    },
    {
      id: 2,
      question: "How long are the courses?",
      answer:
        "Course duration varies from 4 weeks to 12 weeks depending on the complexity and depth of the subject matter.",
      category: "Courses",
    },
    {
      id: 3,
      question: "Do you provide certification?",
      answer: "Yes, we provide industry-recognized certifications upon successful completion of our courses.",
      category: "Certification",
    },
    {
      id: 4,
      question: "What are the payment options?",
      answer: "We accept various payment methods including UPI, credit/debit cards, net banking, and wallets via PhonePe.",
      category: "Payment",
    },
  ]

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus("")
    setSending(true)
    try {
      await api.sendContactMessage(formData)
      setStatus("Message sent successfully.")
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      setStatus(err?.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === "All" || faq.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Header Section */}
        <div
          className="text-center mb-12 py-20 rounded-3xl relative overflow-hidden mx-4 md:mx-0"
          style={{
            background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full blur-[120px]" style={{ background: 'var(--hero-glow)' }} />
          </div>
          <div className="relative z-10 px-4">
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
            >
              Frequently Asked <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Questions</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
              Find answers to common questions about our courses, workshops, and cybersecurity training programs.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10 px-4">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 rounded-full text-base shadow-lg focus:outline-none"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 px-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {["All", "Courses", "Certification", "Payment"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm"
              style={
                activeFilter === filter
                  ? { background: 'var(--accent-gradient)', color: '#fff', boxShadow: '0 4px 15px var(--glow-color-hover)' }
                  : { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }
              }
            >
              {filter}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto mb-20 px-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="backdrop-blur-md rounded-2xl mb-4 overflow-hidden transition-all duration-300"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center transition-colors"
                  style={{ background: 'transparent' }}
                >
                  <span className="font-bold pr-4" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>{faq.question}</span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${expandedFAQ === faq.id ? "rotate-180" : ""}`}
                    style={{ color: expandedFAQ === faq.id ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-5 pt-1" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              No matching questions found.
            </div>
          )}
        </div>

        {/* Contact & Message Section */}
        <div className="max-w-5xl mx-auto px-4 mb-20">
          <div
            className="backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-500"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch">

              {/* Left Side: Contact Info */}
              <div className="md:col-span-5 flex flex-col justify-between pr-0 md:pr-8" style={{ borderRight: '0' }}>
                <div className="hidden md:block" style={{ borderRight: '1px solid var(--border-color)', position: 'absolute', height: '0%' }}></div>
                <div>
                  <h3 className="text-3xl font-extrabold mb-4 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>Still have questions?</h3>
                  <p className="mb-8 leading-relaxed text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
                    If you couldn't find the answer to your question, please don't hesitate to contact our support team directly. We are here to help you secure your digital journey.
                  </p>
                </div>
                <div className="space-y-4 mb-6 md:mb-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <div className="flex items-center gap-4 group">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}
                    >
                      <Mail className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email Us</p>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>info@vhassacademy.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}
                    >
                      <Phone className="w-5 h-5" style={{ color: 'var(--accent-secondary)' }} />
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Call Us</p>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>+91 89853 20226</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Message Form */}
              <div className="md:col-span-7">
                <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none transition-all"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none transition-all"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your question"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none transition-all resize-none"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      required
                    />
                  </div>
                  {status && (
                    <div className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>{status}</div>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 font-bold rounded-full transition-all duration-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent-gradient)', color: '#fff', boxShadow: '0 4px 15px var(--glow-color)' }}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
