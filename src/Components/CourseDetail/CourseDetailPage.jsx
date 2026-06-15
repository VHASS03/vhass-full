"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Phone, Mail, MapPin, Linkedin, Youtube, Instagram, ArrowLeft, X } from "lucide-react"
import Navbar from "@/Components/navbar"
import { useAuth } from "../../context/AuthContext.jsx"
import ApiService from "../../services/api.js"
// CouponInput removed

// Helper function to construct proper image URL
const getImageUrl = (imagePath) => {
  // Handle null, undefined, or empty strings
  if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
    return "/images/circuit-board.png";
  }
  
  // If it's already a full URL (starts with http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a filename (no slashes), construct the uploads URL
  if (!imagePath.includes('/')) {
    return `/uploads/${imagePath}`;
  }
  
  // If it's a relative path starting with uploads/, return as is
  if (imagePath.startsWith('uploads/')) {
    return `/${imagePath}`;
  }
  
  // If it's already a relative path starting with /uploads/, return as is
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  
  // If it's a relative path, return as is
  return imagePath;
};

// Legacy static fallback (kept for reference); dynamic fetch will be used first
const courseData = {
  "certified-ethical-hacker-ceh": {
    id: 1,
    title: "Certified Ethical Hacker (CEH)",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 28 hours",
    price: "₹25000",
    image: "/images/circuit-board.png",
    about:
      "About the CEH Certification The Certified Ethical Hacker (CEH) certification is the most trusted ethical hacking certification and accomplishment recommended by employers globally. It is the most desired information security certification and represents one of the fastest-growing cyber credentials required by critical infrastructure and essential service providers. CEH provides you with hands-on training covering 8 of the most current security domains, 100+ tools, and the latest security vulnerabilities, exploits, and countermeasures. You'll learn to think and act like a hacker (a legally ethical one) to better defend against attacks.",
    syllabus: [
      "Module : Introduction to Ethical Hacking: Information security overview Hacking concepts and types Ethical hacking concepts and scope Information security controls Information security laws and standards",
      "Module : Footprinting and Reconnaissance: Footprinting concepts Footprinting through search engines Website footprinting Email footprinting Competitive intelligence WHOIS footprinting DNS footprinting Network footprinting Footprinting tools and countermeasures",
      "Module : Scanning Networks: Network scanning concepts Scanning techniques Host discovery Port and service discovery OS discovery (banner grabbing/OS fingerprinting) Scanning beyond IDS and firewall Drawing network diagrams Scanning tools and countermeasures",
      "Module : Enumeration: Enumeration concepts NetBIOS enumeration SNMP enumeration LDAP enumeration NTP enumeration SMTP enumeration DNS enumeration Enumeration countermeasures",
      "Module : Vulnerability Analysis: Vulnerability assessment concepts Vulnerability classification and assessment types Vulnerability assessment solutions and tools Vulnerability scoring systems Vulnerability assessment reports",
      "Module : Malware Threats: Malware concepts Types of malware (viruses, worms, Trojans, ransomware, etc.) Advanced malware techniques APT (Advanced Persistent Threats) Malware analysis and reverse engineering basics Anti-malware software and tools Malware countermeasures Real-world malware case studies",
      "Module : Hacking Web Applications: Web application architecture Web application threat landscape Common web vulnerabilities (OWASP Top 10) SQL Injection Cross-Site Scripting (XSS) Cross-Site Request Forgery (CSRF) Broken Authentication and Session Management Insecure Deserialization Security Misconfiguration Sensitive Data Exposure Components with Known Vulnerabilities Insufficient Logging and Monitoring Web app penetration testing methodology Tools for web app testing (Burp Suite, OWASP ZAP, etc.) Web security best practices Countermeasures and secure coding",
    ],
    whoShouldAttend: [
      "The CEH certification is ideal for IT / NON-IT professionals who want to specialize in security and penetration testing: Security Officers Auditors Security Professionals Site Administrators Network Administrators Anyone concerned about the integrity of network infrastructure IT professionals preparing for the CEH certification exam",
    ],
    prerequisites: [
      "While there are no formal prerequisites for the CEH exam, we recommend: Laptop Or Pc with i5 processer and 8 GB ram No Basic knowledge required Interest Towards Learning",
    ],
  },
  "awareness-of-cyber-crime-and-threats": {
    id: 2,
    title: "Awareness of Cyber Crime And Threats",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 20 hours",
    price: "₹1000",
    image: "/images/robot-desk.png",
    about:
      "This foundational course provides crucial knowledge about the growing threats in our digital world. You'll learn to recognize common cyber crimes, understand how attacks happen, and discover practical steps to protect yourself and your organization. Through real-world case studies and simple demonstrations, we make cybersecurity concepts accessible to everyone, regardless of technical background. The course covers personal and workplace security, social media risks, financial protection, and basic response strategies.",
    syllabus: [
      "Module : Understanding Cyber Crime: What is cyber crime? Common types of cyber attacks Who are cyber criminals? Real-world impact of cyber crime Global trends in digital threats",
      "Module : Phishing & Social Engineering: How phishing scams work Spotting fake emails and messages Social media manipulation Impersonation scams Protecting yourself from social engineering",
      "Module : Malware Threats: Viruses, worms, and trojans explained Ransomware - how it works How malware spreads Protecting your devices What to do if infected",
      "Module : Online Financial Safety: Banking and payment scams Credit card fraud prevention Safe online shopping Recognizing fake websites Cryptocurrency scams",
      "Module : Social Media & Privacy: Privacy settings explained Oversharing dangers Fake profiles and catfishing Location sharing risks Protecting your digital reputation",
      "Module : Workplace Security: Handling sensitive information Password best practices Safe remote work habits Reporting suspicious activity Your role in organizational security",
    ],
    whoShouldAttend: [
      "Cyber crime awareness is essential for everyone in today's digital world: Individual internet users Employees in any industry Parents and teachers Small business owners Senior citizens Students Community leaders",
    ],
    prerequisites: [
      "This course has no prerequisites: No technical knowledge required Basic computer/phone usage skills Interest in staying safe online",
    ],
  },
  "cyber-suraksha-30-day-cybersecurity-empowerment-for-small-businesses": {
    id: 3,
    title: "Cyber Suraksha – 30-Day Cybersecurity Empowerment for Small Businesses",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 45 hours",
    price: "₹8000",
    image: "/images/business-gears.png",
    about:
      "Cyber Suraksha is a 30-day practical cybersecurity training program specially designed for small businesses, startups, small-scale industries, and growing companies. The goal is to empower owners and teams to build their own in-house security systems, protect sensitive data, prevent digital threats, and create a culture of cyber responsibility across their organization. This program delivers easy-to-follow training with real tools, hands-on practice, and guidance that doesn't require any technical background. If your business uses digital devices, emails, payments, or customer data — this course is essential.",
    syllabus: [
      "Week 1: Basics & Awareness: Day 1: Why Cybersecurity Matters for Small Businesses Day 2: Understanding Common Threats (Phishing, Malware, etc.) Day 3: Business Risk Checkup Day 4: Basic Cyber Hygiene for Staff Day 5: What to Protect – People, Devices, and Data Day 6: Cyber Case Studies from Small Businesses Day 7: Weekly Review & Hands-on Tool: Cyber Checklist",
      "Week 2: Threat Prevention: Day 8: Email Safety & Phishing Detection Day 9: Password Security for Teams Day 10: Device Protection & Antivirus Setup Day 11: Ransomware – How to Avoid It Day 12: Safe Browsing & Public Wi-Fi Day 13: Using VPNs & Securing Remote Work Day 14: Weekly Review & Setup Your 'Digital Lockdown'",
      "Week 3: Business-Level Security: Day 15: Securing Customer & Payment Data Day 16: Cybersecurity for Small Teams Day 17: Access Control – Who Can Do What? Day 18: Safe Cloud Usage for Files and Emails Day 19: Mobile Device Safety & WhatsApp Scams Day 20: Create Your Company Security Policy Day 21: Weekly Review & Apply Your Policy",
      "Week 4: Recovery, Tools & Certification: Day 22: Backup & Recovery Plans Day 23: Detecting and Reporting Incidents Day 24: Employee Training Techniques Day 25: Compliance Basics (Indian & Global Laws) Day 26: Security Tools You Can Use (Free & Paid) Day 27: DIY Audit – Test Your Business Cyber Readiness Day 28: Threat Simulation & Final Quiz Day 29: One-on-One Security Consultation (Optional) Day 30: Final Certification + Security Toolkit Download",
    ],
    whoShouldAttend: [
      "Small businesses are big targets – Over 40% of cyberattacks are aimed at small businesses. Limited resources mean higher risk – Many small companies can't afford full-time IT security. One attack can shut down your operations – Data loss, fraud, or ransomware can destroy trust and revenue. You can build your own defense – With the right tools and training, even non-technical teams can build strong cybersecurity systems.",
      "Small business owners and entrepreneurs Managers and staff of small-scale industries Finance, HR, admin, and operations teams Anyone who runs or supports a digital business",
    ],
    prerequisites: [
      "No technical background is required. Participants should have basic computer or smartphone usage skills, a stable internet connection, and access to a laptop or desktop. A willingness to learn and apply practical security steps is essential.",
    ],
  },
  "zero-to-founder-entrepreneurship-edition-full-course-for-beginners": {
    id: 4,
    title: "Zero to Founder (Entrepreneurship Edition - Full Course For beginners)",
    instructor: "Instructor: VHASS SOFTWARES PRIVATE LIMITED",
    duration: "Duration: 40 hours",
    price: "₹12999",
    image: "/images/entrepreneurship.png",
    about:
      "ScaleUp Mastery: Entrepreneurship Edition is a 2-month practical course designed to guide you from idea to launch. You'll learn how to find a startup idea, validate it, build an MVP, form a team, handle branding, marketing, legal setup, and pitch like a pro — all in just 1 hour a day. Perfect for students, first-time founders, and innovators who want to build real startups with confidence.",
    syllabus: [
      "Module 1: Foundation of Entrepreneurship : Understanding what entrepreneurship truly means, the mindset it requires, types of entrepreneurs,and busting common myths. entrepreneurs, and busting common myths.",
      "Module 2: Startup Ideation Module 2: Startup Ideation& Validation: Learn how to generate impactful startup ideas, validate them with real users, and avoid common traps during the early stages.",
      "Module 3: Building the Team & MVP: Discover how to form a strong founding team, build a Minimum Viable Product (MVP), and manage early operations effectively.",
      "Module 4: Fundraising & Revenue Models : Explore various business models, plan your startup's budget, understand funding sources, and create compelling investor pitch decks",
      "Module 5: Marketing & Launching: Learn branding basics, organic and paid marketing strategies, launch planning, and how to build an engaging community",
      "Module 6: Scaling Your Startup: Dive into growth strategies, use scaling tools, build internal departments, and handle founder responsibilities with balance.",
      "Module 7: Legal, Ethics & Culture: Cover essential legal registrations, contracts, ethical startup practices, and how to nurture a strong company culture",
      "Bonus Module: Pitching, Public Speaking & Hackathons: Improve your pitch delivery, develop public speaking confidence, and win hackathons with structured strategy and presentation.",
    ],
    whoShouldAttend: [
      "Students curious about startups and innovation",
      "Aspiring entrepreneurs looking to start their first venture",
      "Techies/Developers who want to launch products",
      "Designers/Creators with ideas but no startup experience",
      "Hackathon Participants preparing to pitch and build MVPs",
      "Startup Founders seeking structure to scale their vision",
      "Marketing/Business students wanting practical entrepreneurship training",
    ],
    prerequisites: [
      "You don't need a business degree to join, but here's what helps:",
      "Curiosity to learn and solve real-world problems",
      "Willingness to brainstorm and build ideas",
      "Basic digital skills (e.g., Google Docs, forms, Canva, etc.)",
      "Openness to collaboration and teamwork",
      "A smartphone or laptop with internet access",
      "1 hour/day commitment for 8 weeks",
      "No coding required. No business plan needed. Just come with your fire to build something great.",
    ],
  },
}

export default function CourseDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.phone || "",
  })
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [finalAmount, setFinalAmount] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await ApiService.getAllCourses();
        const list = data.courses || []
        const toSlug = (title) => title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        const match = list.find((c) => toSlug(c.title) === slug)
        if (match) {
          setCourse({
            _id: match._id,
            title: match.title,
            instructor: match.createdBy ? `Instructor: ${match.createdBy}` : 'Instructor: VHASS SOFTWARES PRIVATE LIMITED',
            duration: match.duration ? `Duration: ${match.duration} hours` : 'Duration: N/A',
            price: `₹${Number(match.price || match.discountedPrice || match.originalPrice || 0)}`,
            image: match.image || '/images/circuit-board.png',
            about: match.description || 'Course description will be updated soon.',
            syllabus: Array.isArray(match.syllabus) ? match.syllabus : [],
            whoShouldAttend: Array.isArray(match.whoShouldAttend) ? match.whoShouldAttend : [],
            prerequisites: Array.isArray(match.prerequisites) ? match.prerequisites : [],
          })
          // If user is logged in, check if already enrolled
          if (user) {
            try {
              const my = await ApiService.getUserCourses();
              const myCourses = my.courses || []
              const enrolled = myCourses.some((c) => c._id === match._id)
              setIsEnrolled(enrolled)
            } catch (e) {
              console.error('Failed to check user courses:', e)
            }
          }
        } else {
          // Fallback to legacy static data by slug
          setCourse(courseData[slug] || null)
        }
      } catch (e) {
        console.error('Failed to load course details:', e)
        setCourse(courseData[slug] || null)
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center" style={{ color: "#FFFFF0" }}>
          Loading course...
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#FFFFF0" }}>
            Course not found
          </h1>
          <Button
            onClick={() => navigate("/course")}
            style={{ backgroundColor: "#B88AFF", color: "#FFFFF0" }}
          >
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const handleEnrollClick = () => {
    if (!user) {
      alert("Please login to enroll in this course!")
      navigate("/auth")
      return
    }
    setShowEnrollmentModal(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsProcessingPayment(true)
    
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'https://api.vhassacademy.com';
      const resp = await fetch(`${apiBase}/api/course/${course._id || course.id}/phonepe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error('PhonePe API error:', resp.status, errorText);
        throw new Error(`Payment API error: ${resp.status} - ${errorText}`);
      }

      const data = await resp.json();
      console.log('PhonePe response:', data);
      
      if (data.checkoutPageUrl) {
        window.location.href = data.checkoutPageUrl;
      } else {
        throw new Error('Failed to get checkout URL from response');
      }
    } catch (error) {
      console.error("PhonePe payment error:", error)
      const errorMessage = error.message || "An error occurred while initiating payment. Please try again."
      alert(`Payment Error: ${errorMessage}`)
      setIsProcessingPayment(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Coupon handlers removed

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/course")}
          variant="ghost"
          className="mb-6 hover:opacity-80"
          style={{ color: "var(--text-primary)", backgroundColor: "var(--bg-card)", border: "1px solid var(--accent-primary)" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Course Hero Section */}
        <div className="text-center mb-12 py-16 rounded-3xl shadow-2xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
            {course.title}
          </h1>
          <div className="max-w-4xl mx-auto mb-8">
            <img
              src={getImageUrl(course.image)}
              alt={course.title}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
            />
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-lg">
            <span style={{ color: "var(--accent-primary)" }}>{course.instructor}</span>
            <span style={{ color: "var(--accent-primary)" }}>{course.duration}</span>
            <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              {course.price}
            </span>
          </div>
        </div>

        {/* About This Course */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--accent-primary)", backdropFilter: "blur(10px)" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "var(--text-primary)", borderColor: "var(--accent-primary)" }}>
            About This Course
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {course.about}
          </p>
        </section>

        {/* Syllabus */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--accent-primary)", backdropFilter: "blur(10px)" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "var(--text-primary)", borderColor: "var(--accent-primary)" }}>
            Course Syllabus
          </h2>
          <div className="space-y-4">
            {course.syllabus.map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "var(--border-color)" }}>
                <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Who Should Attend */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--accent-primary)", backdropFilter: "blur(10px)" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "var(--text-primary)", borderColor: "var(--accent-primary)" }}>
            Who Should Attend
          </h2>
          <div className="space-y-4">
            {course.whoShouldAttend.map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "var(--border-color)" }}>
                <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Prerequisites */}
        <section className="mb-12 p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--accent-primary)", backdropFilter: "blur(10px)" }}>
          <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "var(--text-primary)", borderColor: "var(--accent-primary)" }}>
            Prerequisites
          </h2>
          <div className="space-y-4">
            {course.prerequisites.map((item, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: "var(--border-color)" }}>
                <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Enrollment Button */}
        <div className="text-center">
          {isEnrolled ? (
            <Button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 text-xl"
              style={{ backgroundColor: "#10b981", color: "#ffffff" }}
            >
              Enrolled already — Go to Dashboard
            </Button>
          ) : (
            <Button
              onClick={handleEnrollClick}
              className="px-8 py-4 text-xl"
              style={{ background: "var(--accent-gradient)", color: "white" }}
              disabled={!user}
            >
              {user ? `Enroll in Course - ${course.price}` : "Login to Enroll"}
            </Button>
          )}
        </div>
      </main>

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl p-8 max-w-md w-full border-2 border-[var(--accent-primary)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Enroll in Course
              </h2>
              <button
                onClick={() => setShowEnrollmentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--accent-primary)", color: "var(--text-primary)" }}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--accent-primary)", color: "var(--text-primary)" }}
                />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-lg" style={{ color: "var(--text-secondary)" }}>
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="mt-2"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--accent-primary)", color: "var(--text-primary)" }}
                />
              </div>
              
              <div className="bg-[var(--border-color)] p-4 rounded-lg">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <strong>Course:</strong> {course.title}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <strong>Price:</strong> {course.price}
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isProcessingPayment}
                  style={{ background: "var(--accent-gradient)", color: "white" }}
                >
                  {isProcessingPayment ? "Processing Payment..." : `Pay ${finalAmount ? `₹${finalAmount}` : course.price}`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEnrollmentModal(false)}
                  disabled={isProcessingPayment}
                  style={{ borderColor: "var(--accent-primary)", color: "var(--accent-primary)" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

