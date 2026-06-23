"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { X, Plus, Edit, Trash2, Users, BookOpen, Calendar, LayoutDashboard, LogOut, ChevronRight, AlertCircle, Tag, ToggleLeft, ToggleRight, Copy } from "lucide-react"
import Navbar from "./navbar"
import { useAuth } from "../context/AuthContext.jsx"
import Footer from "./footer"

// ─── API base URL ──────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || ""

// ─── Image URL helper (prefixes API base for uploaded files) ───────────────
const getImageUrl = (imagePath) => {
  if (!imagePath || imagePath === "null" || imagePath === "undefined") {
    return "/images/circuit-board.png"
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }
  if (!imagePath.includes("/")) {
    return `${API_BASE}/uploads/${imagePath}`
  }
  if (imagePath.startsWith("uploads/")) {
    return `${API_BASE}/${imagePath}`
  }
  if (imagePath.startsWith("/uploads/")) {
    return `${API_BASE}${imagePath}`
  }
  return imagePath
}

// ─── Reusable styled components ───────────────────────────────────────────
const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`rounded-2xl border backdrop-blur-sm ${className}`}
    style={{
      backgroundColor: "var(--bg-card)",
      borderColor: "var(--border-color)",
      ...style,
    }}
  >
    {children}
  </div>
)

const Btn = ({ children, onClick, type = "button", disabled = false, variant = "primary", className = "", style = {} }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm"
  const variants = {
    primary: { background: "var(--accent-gradient)", color: "#fff", border: "none" },
    secondary: { backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-color)" },
    danger: { backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" },
    outline: { backgroundColor: "transparent", color: "var(--accent-primary)", border: "1px solid var(--accent-primary)" },
    ghost: { backgroundColor: "transparent", color: "var(--text-secondary)", border: "none" },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
      style={{ ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{label}</label>
    {children}
  </div>
)

const Input = ({ value, onChange, type = "text", placeholder = "", required = false, id, accept, disabled = false }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    accept={accept}
    disabled={disabled}
    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2"
    style={{
      backgroundColor: "var(--bg-secondary)",
      border: "1px solid var(--border-color)",
      color: "var(--text-primary)",
      focusRingColor: "var(--accent-primary)",
    }}
  />
)

const Textarea = ({ value, onChange, rows = 4, placeholder = "", required = false, id }) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    rows={rows}
    placeholder={placeholder}
    required={required}
    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 resize-vertical focus:ring-2"
    style={{
      backgroundColor: "var(--bg-secondary)",
      border: "1px solid var(--border-color)",
      color: "var(--text-primary)",
    }}
  />
)

const Select = ({ value, onChange, children, required = false }) => (
  <select
    value={value}
    onChange={onChange}
    required={required}
    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
    style={{
      backgroundColor: "var(--bg-secondary)",
      border: "1px solid var(--border-color)",
      color: "var(--text-primary)",
    }}
  >
    {children}
  </select>
)

// ─── Modal wrapper ─────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide = false }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-8 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
    <div
      className={`w-full ${wide ? "max-w-3xl" : "max-w-md"} rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 0 60px var(--glow-color)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
        <button onClick={onClose} className="p-2 rounded-xl transition-colors hover:opacity-70" style={{ color: "var(--text-muted)" }}>
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
)

// ─── Array field editor ────────────────────────────────────────────────────
const ArrayEditor = ({ label, items, onChange, placeholder }) => {
  const add = () => onChange([...items, ""])
  const update = (i, v) => onChange(items.map((x, idx) => idx === i ? v : x))
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={e => update(i, e.target.value)}
              placeholder={placeholder || `Item ${i + 1}`}
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
            />
            <button type="button" onClick={() => remove(i)} className="p-2 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171" }}>
              <X size={16} />
            </button>
          </div>
        ))}
        <Btn type="button" variant="secondary" onClick={add} className="w-full">
          <Plus size={16} /> Add Item
        </Btn>
      </div>
    </Field>
  )
}

// ─── Toast notification ─────────────────────────────────────────────────────
const Toast = ({ msg, type = "success", onClose }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl max-w-sm" style={{
    backgroundColor: type === "success" ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)",
    border: `1px solid ${type === "success" ? "rgba(52,211,153,0.4)" : "rgba(239,68,68,0.4)"}`,
    backdropFilter: "blur(12px)",
  }}>
    <AlertCircle size={18} style={{ color: type === "success" ? "#34d399" : "#f87171" }} />
    <p className="text-sm font-medium flex-1" style={{ color: type === "success" ? "#34d399" : "#f87171" }}>{msg}</p>
    <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={14} /></button>
  </div>
)

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [activeTab, setActiveTab] = useState("dashboard")
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [workshops, setWorkshops] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // Modal visibility
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [showAddWorkshop, setShowAddWorkshop] = useState(false)
  const [showAddCoupon, setShowAddCoupon] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  // ── Form state ────────────────────────────────────────────────────────────
  const emptyUser = { name: "", email: "", phone: "", role: "user" }
  const emptyCourse = {
    title: "", instructor: "VHASS SOFTWARES PRIVATE LIMITED",
    duration: "", price: "", originalPrice: "", about: "", category: "Cybersecurity",
    syllabus: [""], whoShouldAttend: [""], prerequisites: [""],
  }
  const emptyWorkshop = {
    title: "", instructor: "VHASS SOFTWARES PRIVATE LIMITED",
    duration: "", price: "", about: "", category: "Cybersecurity",
    date: "", time: "10:00", location: "Online",
    syllabus: [""], whoShouldAttend: [""], prerequisites: [""],
  }
  const emptyCoupon = {
    code: "", description: "", discountType: "percentage", discountValue: "",
    maxDiscount: "", minimumAmount: "", applicableTo: "all", applicableItem: "",
    maxUses: "", validFrom: "", validUntil: "", isActive: true,
  }

  const [userForm, setUserForm] = useState(emptyUser)
  const [courseForm, setCourseForm] = useState(emptyCourse)
  const [workshopForm, setWorkshopForm] = useState(emptyWorkshop)
  const [couponForm, setCouponForm] = useState(emptyCoupon)
  const [courseImage, setCourseImage] = useState(null)
  const [workshopImage, setWorkshopImage] = useState(null)

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
      return
    }
    loadData()
  }, [user, navigate])

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  // ── Data loading ───────────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true)
    const token = localStorage.getItem("auth_token")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    try {
      const [usersRes, coursesRes, workshopsRes, enrollmentsRes] = await Promise.allSettled([
        fetch(`${API_BASE}/api/admin/users`, { credentials: "include", headers }),
        fetch(`${API_BASE}/api/admin/courses`, { credentials: "include", headers }),
        fetch(`${API_BASE}/api/admin/workshops`, { credentials: "include", headers }),
        fetch(`${API_BASE}/api/admin/enrollments`, { credentials: "include", headers }),
      ])

      if (usersRes.status === "fulfilled" && usersRes.value.ok) {
        const d = await usersRes.value.json(); setUsers(d.users || [])
      }
      if (coursesRes.status === "fulfilled" && coursesRes.value.ok) {
        const d = await coursesRes.value.json(); setCourses(d.courses || [])
      }
      if (workshopsRes.status === "fulfilled" && workshopsRes.value.ok) {
        const d = await workshopsRes.value.json(); setWorkshops(d.workshops || [])
      }
      if (enrollmentsRes.status === "fulfilled" && enrollmentsRes.value.ok) {
        const d = await enrollmentsRes.value.json(); setEnrollments(d.transactions || [])
      }
      // Load coupons
      const couponsRes = await fetch(`${API_BASE}/api/coupon/admin`, { credentials: "include", headers })
      if (couponsRes.ok) {
        const d = await couponsRes.json(); setCoupons(d.coupons || [])
      }
    } catch (err) {
      console.error("Error loading admin data:", err)
    } finally {
      setLoading(false)
    }
  }

  // ── Cancel / reset ─────────────────────────────────────────────────────────
  const handleCancel = () => {
    setShowAddCourse(false)
    setShowAddWorkshop(false)
    setShowAddUser(false)
    setShowAddCoupon(false)
    setIsEditing(false)
    setEditingItem(null)
    setCourseForm(emptyCourse)
    setWorkshopForm(emptyWorkshop)
    setUserForm(emptyUser)
    setCouponForm(emptyCoupon)
    setCourseImage(null)
    setWorkshopImage(null)
  }

  // ── User handlers ──────────────────────────────────────────────────────────
  const handleAddUser = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("auth_token")
    try {
      const res = await fetch(`${API_BASE}/api/admin/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        credentials: "include",
        body: JSON.stringify(userForm),
      })
      if (res.ok) {
        handleCancel(); loadData(); showToast("User added successfully!")
      } else {
        const d = await res.json(); showToast(d.message || "Failed to add user", "error")
      }
    } catch { showToast("Error adding user", "error") }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return
    const token = localStorage.getItem("auth_token")
    try {
      const res = await fetch(`${API_BASE}/api/admin/user/${id}`, {
        method: "DELETE", credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) { loadData(); showToast("User deleted") }
      else showToast("Failed to delete user", "error")
    } catch { showToast("Error deleting user", "error") }
  }

  // ── Course handlers ────────────────────────────────────────────────────────
  const handleEditCourse = (course) => {
    setEditingItem({ type: "course", data: course })
    setCourseForm({
      title: course.title || "",
      instructor: course.createdBy || "VHASS SOFTWARES PRIVATE LIMITED",
      duration: course.duration || "",
      price: course.price || course.discountedPrice || "",
      originalPrice: course.originalPrice || "",
      about: course.description || course.about || "",
      category: course.category || "Cybersecurity",
      syllabus: course.syllabus?.length ? course.syllabus : [""],
      whoShouldAttend: course.whoShouldAttend?.length ? course.whoShouldAttend : [""],
      prerequisites: course.prerequisites?.length ? course.prerequisites : [""],
    })
    setCourseImage(null)
    setIsEditing(true)
    setShowAddCourse(true)
  }

  const handleAddCourse = async (e) => {
    e.preventDefault()
    if (!courseForm.title.trim() || !courseForm.about.trim()) {
      showToast("Title and description are required", "error"); return
    }
    const formData = new FormData()
    formData.append("title", courseForm.title.trim())
    formData.append("description", courseForm.about.trim())
    formData.append("createdBy", courseForm.instructor.trim())
    formData.append("duration", courseForm.duration || "0")
    formData.append("price", courseForm.price || "0")
    formData.append("originalPrice", courseForm.originalPrice || courseForm.price || "0")
    formData.append("discountedPrice", courseForm.price || "0")
    formData.append("category", courseForm.category || "Cybersecurity")
    formData.append("syllabus", JSON.stringify(courseForm.syllabus.filter(Boolean)))
    formData.append("whoShouldAttend", JSON.stringify(courseForm.whoShouldAttend.filter(Boolean)))
    formData.append("prerequisites", JSON.stringify(courseForm.prerequisites.filter(Boolean)))
    if (courseImage) formData.append("image", courseImage)

    const token = localStorage.getItem("auth_token")
    const url = isEditing ? `${API_BASE}/api/admin/course/${editingItem.data._id}` : `${API_BASE}/api/admin/course`
    const method = isEditing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method, credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      const d = await res.json()
      if (res.ok) {
        handleCancel(); loadData()
        showToast(isEditing ? "Course updated!" : "Course created!")
      } else {
        showToast(d.message || "Failed to save course", "error")
      }
    } catch { showToast("Error saving course", "error") }
  }

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return
    const token = localStorage.getItem("auth_token")
    try {
      const res = await fetch(`${API_BASE}/api/admin/course/${id}`, {
        method: "DELETE", credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) { loadData(); showToast("Course deleted") }
      else showToast("Failed to delete course", "error")
    } catch { showToast("Error deleting course", "error") }
  }

  // ── Workshop handlers ──────────────────────────────────────────────────────
  const handleEditWorkshop = (ws) => {
    setEditingItem({ type: "workshop", data: ws })
    setWorkshopForm({
      title: ws.title || "",
      instructor: ws.createdBy || "VHASS SOFTWARES PRIVATE LIMITED",
      duration: ws.duration || "",
      price: ws.price || "",
      about: ws.description || ws.about || "",
      category: ws.category || "Cybersecurity",
      date: ws.date ? new Date(ws.date).toISOString().slice(0, 10) : "",
      time: ws.time || "10:00",
      location: ws.location || "Online",
      syllabus: ws.syllabus?.length ? ws.syllabus : [""],
      whoShouldAttend: ws.whoShouldAttend?.length ? ws.whoShouldAttend : [""],
      prerequisites: ws.prerequisites?.length ? ws.prerequisites : [""],
    })
    setWorkshopImage(null)
    setIsEditing(true)
    setShowAddWorkshop(true)
  }

  const handleAddWorkshop = async (e) => {
    e.preventDefault()
    if (!workshopForm.title.trim() || !workshopForm.about.trim()) {
      showToast("Title and description are required", "error"); return
    }

    const formData = new FormData()
    formData.append("title", workshopForm.title.trim())
    formData.append("description", workshopForm.about.trim())
    formData.append("createdBy", workshopForm.instructor.trim())
    formData.append("duration", workshopForm.duration || "0")
    formData.append("price", workshopForm.price || "0")
    formData.append("category", workshopForm.category || "Cybersecurity")
    formData.append("date", workshopForm.date || new Date().toISOString())
    formData.append("time", workshopForm.time || "10:00")
    formData.append("location", workshopForm.location || "Online")
    formData.append("syllabus", JSON.stringify(workshopForm.syllabus.filter(Boolean)))
    formData.append("whoShouldAttend", JSON.stringify(workshopForm.whoShouldAttend.filter(Boolean)))
    formData.append("prerequisites", JSON.stringify(workshopForm.prerequisites.filter(Boolean)))
    if (workshopImage) {
      formData.append("image", workshopImage)
    } else if (!isEditing) {
      // provide a placeholder URL so the backend image field is satisfied
      formData.append("poster", "/images/circuit-board.png")
    }

    const token = localStorage.getItem("auth_token")
    const url = isEditing ? `${API_BASE}/api/admin/workshop/${editingItem.data._id}` : `${API_BASE}/api/admin/workshop`
    const method = isEditing ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method, credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      const d = await res.json()
      if (res.ok) {
        handleCancel(); loadData()
        showToast(isEditing ? "Workshop updated!" : "Workshop created!")
      } else {
        showToast(d.message || "Failed to save workshop", "error")
      }
    } catch { showToast("Error saving workshop", "error") }
  }

  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm("Delete this workshop?")) return
    const token = localStorage.getItem("auth_token")
    try {
      const res = await fetch(`${API_BASE}/api/admin/workshop/${id}`, {
        method: "DELETE", credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) { loadData(); showToast("Workshop deleted") }
      else showToast("Failed to delete workshop", "error")
    } catch { showToast("Error deleting workshop", "error") }
  }

  // ── Coupon handlers ────────────────────────────────────────────────────────
  const handleAddCoupon = async (e) => {
    e.preventDefault()
    if (!couponForm.code.trim() || !couponForm.discountValue) {
      showToast("Code and discount value are required", "error"); return
    }
    const token = localStorage.getItem("auth_token")
    const payload = {
      code: couponForm.code.trim().toUpperCase(),
      description: couponForm.description,
      discountType: couponForm.discountType,
      discountValue: Number(couponForm.discountValue),
      maxDiscount: couponForm.maxDiscount ? Number(couponForm.maxDiscount) : null,
      minimumAmount: couponForm.minimumAmount ? Number(couponForm.minimumAmount) : 0,
      applicableTo: couponForm.applicableTo,
      applicableItem: couponForm.applicableItem || null,
      maxUses: couponForm.maxUses ? Number(couponForm.maxUses) : null,
      validFrom: couponForm.validFrom || undefined,
      validUntil: couponForm.validUntil || undefined,
      isActive: couponForm.isActive,
    }
    try {
      const url = isEditing ? `${API_BASE}/api/coupon/admin/${editingItem.data._id}` : `${API_BASE}/api/coupon/admin`
      const method = isEditing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(payload),
      })
      const d = await res.json()
      if (res.ok) {
        handleCancel(); loadData()
        showToast(isEditing ? "Coupon updated!" : "Coupon created!")
      } else {
        showToast(d.message || "Failed to save coupon", "error")
      }
    } catch { showToast("Error saving coupon", "error") }
  }

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return
    const token = localStorage.getItem("auth_token")
    try {
      const res = await fetch(`${API_BASE}/api/coupon/admin/${id}`, {
        method: "DELETE", credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) { loadData(); showToast("Coupon deleted") }
      else showToast("Failed to delete coupon", "error")
    } catch { showToast("Error deleting coupon", "error") }
  }

  const handleToggleCoupon = async (id) => {
    const token = localStorage.getItem("auth_token")
    try {
      const res = await fetch(`${API_BASE}/api/coupon/admin/${id}/toggle`, {
        method: "PATCH", credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) { loadData(); showToast("Coupon status updated") }
      else showToast("Failed to toggle coupon", "error")
    } catch { showToast("Error toggling coupon", "error") }
  }

  const handleEditCoupon = (coupon) => {
    setEditingItem({ type: "coupon", data: coupon })
    setCouponForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || "",
      minimumAmount: coupon.minimumAmount || "",
      applicableTo: coupon.applicableTo,
      applicableItem: coupon.applicableItem || "",
      maxUses: coupon.maxUses || "",
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 10) : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 10) : "",
      isActive: coupon.isActive,
    })
    setIsEditing(true)
    setShowAddCoupon(true)
  }

  const handleLogout = async () => { await logout(); navigate("/") }

  if (!user || user.role !== "admin") return null

  const tabs = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: `Users (${users.length})`, icon: Users },
    { id: "courses", label: `Courses (${courses.length})`, icon: BookOpen },
    { id: "workshops", label: `Workshops (${workshops.length})`, icon: Calendar },
    { id: "enrollments", label: `Enrollments (${enrollments.length})`, icon: ChevronRight },
    { id: "coupons", label: `Coupons (${coupons.length})`, icon: Tag },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "var(--glow-color)", filter: "blur(120px)", opacity: 0.5 }} />

      <main className="relative container mx-auto px-4 py-10 max-w-7xl">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--text-primary)" }}>
              Admin{" "}
              <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Dashboard
              </span>
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Manage users, courses and workshops</p>
          </div>
          <Btn variant="danger" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Btn>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={
                activeTab === id
                  ? { background: "var(--accent-gradient)", color: "#fff", boxShadow: "0 4px 12px var(--glow-color)" }
                  : { backgroundColor: "transparent", color: "var(--text-secondary)" }
              }
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Loading ─────────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 rounded-full border-4 animate-spin" style={{ borderColor: "var(--border-color)", borderTopColor: "var(--accent-primary)" }} />
          </div>
        )}

        {!loading && (
          <>
            {/* ── Overview Tab ─────────────────────────────────────────────────── */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                {/* Stats row */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: "Total Users", value: users.length, icon: Users, color: "#60a5fa" },
                    { label: "Total Courses", value: courses.length, icon: BookOpen, color: "var(--accent-primary)" },
                    { label: "Total Workshops", value: workshops.length, icon: Calendar, color: "#a78bfa" },
                    { label: "Enrollments", value: enrollments.length, icon: ChevronRight, color: "#34d399" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="p-6 hover:scale-[1.02] transition-transform duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                          <Icon size={20} style={{ color }} />
                        </div>
                      </div>
                      <div className="text-4xl font-extrabold" style={{ fontFamily: "'Outfit', sans-serif", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{value}</div>
                    </Card>
                  ))}
                </div>

                {/* Recent workshops */}
                {workshops.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Recent Workshops</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {workshops.slice(0, 3).map(ws => (
                        <Card key={ws._id} className="overflow-hidden">
                          <img src={getImageUrl(ws.image)} alt={ws.title} className="w-full h-36 object-cover"
                            onError={e => { e.target.src = "/images/circuit-board.png" }} />
                          <div className="p-4">
                            <h3 className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{ws.title}</h3>
                            <p className="text-xs mt-1" style={{ color: "var(--accent-primary)" }}>₹{ws.price}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Users Tab ──────────────────────────────────────────────────────── */}
            {activeTab === "users" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Manage Users</h2>
                  <Btn variant="primary" onClick={() => setShowAddUser(true)}>
                    <Plus size={16} /> Add User
                  </Btn>
                </div>
                <div className="space-y-3">
                  {users.length === 0 && <Card className="p-8 text-center"><p style={{ color: "var(--text-muted)" }}>No users found</p></Card>}
                  {users.map(u => (
                    <Card key={u._id} className="p-5">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center gap-4 truncate">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                            style={{ background: "var(--accent-gradient)" }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{u.name}</p>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: u.role === "admin" ? "rgba(255,177,98,0.15)" : "var(--bg-secondary)", color: u.role === "admin" ? "var(--accent-primary)" : "var(--text-muted)", border: "1px solid var(--border-color)" }}>
                            {u.role}
                          </span>
                          <Btn variant="danger" onClick={() => handleDeleteUser(u._id)} className="p-2">
                            <Trash2 size={15} />
                          </Btn>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── Courses Tab ────────────────────────────────────────────────────── */}
            {activeTab === "courses" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Manage Courses</h2>
                  <Btn variant="primary" onClick={() => { setIsEditing(false); setEditingItem(null); setCourseForm(emptyCourse); setShowAddCourse(true) }}>
                    <Plus size={16} /> Add Course
                  </Btn>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {courses.length === 0 && <Card className="p-8 text-center col-span-3"><p style={{ color: "var(--text-muted)" }}>No courses yet</p></Card>}
                  {courses.map(course => (
                    <Card key={course._id} className="overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-200">
                      <div className="relative h-44 overflow-hidden bg-[var(--bg-secondary)]">
                        <img src={getImageUrl(course.image)} alt={course.title} className="w-full h-full object-cover"
                          onError={e => { e.target.src = "/images/circuit-board.png" }} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 60%)" }} />
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "var(--accent-gradient)" }}>
                          ₹{course.price}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold mb-1 leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>{course.title}</h3>
                        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{course.createdBy}</p>
                        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{course.duration}h · {course.enrollmentCount || 0} enrolled</p>
                        <div className="flex gap-2 mt-auto">
                          <Btn variant="secondary" className="flex-1" onClick={() => handleEditCourse(course)}>
                            <Edit size={14} /> Edit
                          </Btn>
                          <Btn variant="danger" onClick={() => handleDeleteCourse(course._id)}>
                            <Trash2 size={14} />
                          </Btn>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── Workshops Tab ───────────────────────────────────────────────────── */}
            {activeTab === "workshops" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Manage Workshops</h2>
                  <Btn variant="primary" onClick={() => { setIsEditing(false); setEditingItem(null); setWorkshopForm(emptyWorkshop); setShowAddWorkshop(true) }}>
                    <Plus size={16} /> Add Workshop
                  </Btn>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {workshops.length === 0 && <Card className="p-8 text-center col-span-3"><p style={{ color: "var(--text-muted)" }}>No workshops yet</p></Card>}
                  {workshops.map(ws => (
                    <Card key={ws._id} className="overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-200">
                      <div className="relative h-44 overflow-hidden bg-[var(--bg-secondary)]">
                        <img src={getImageUrl(ws.image)} alt={ws.title} className="w-full h-full object-cover"
                          onError={e => { e.target.src = "/images/circuit-board.png" }} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 60%)" }} />
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "var(--accent-gradient)" }}>
                          ₹{ws.price}
                        </span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold mb-1 leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>{ws.title}</h3>
                        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{ws.createdBy}</p>
                        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                          📅 {ws.date ? new Date(ws.date).toLocaleDateString("en-IN") : "TBA"} · {ws.time || ""}
                        </p>
                        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>📍 {ws.location || "Online"}</p>
                        <div className="flex gap-2 mt-auto">
                          <Btn variant="secondary" className="flex-1" onClick={() => handleEditWorkshop(ws)}>
                            <Edit size={14} /> Edit
                          </Btn>
                          <Btn variant="danger" onClick={() => handleDeleteWorkshop(ws._id)}>
                            <Trash2 size={14} />
                          </Btn>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── Enrollments Tab ────────────────────────────────────────────────── */}
            {activeTab === "enrollments" && (
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Enrollments</h2>
                {enrollments.length === 0 ? (
                  <Card className="p-8 text-center"><p style={{ color: "var(--text-muted)" }}>No enrollments found</p></Card>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((enr) => (
                      <Card key={enr._id} className="p-4">
                        <div className="grid sm:grid-cols-4 gap-4 items-center">
                          <div>
                            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{enr.user?.name || "User"}</p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{enr.user?.email}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{enr.course?.title || enr.workshop?.title || "—"}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                              {enr.course ? "Course" : enr.workshop ? "Workshop" : "Unknown"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: "var(--accent-primary)" }}>₹{enr.amount || 0}</p>
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{
                              backgroundColor: enr.status === "COMPLETED" || enr.status === "SUCCESS" ? "rgba(52,211,153,0.15)" : "rgba(255,177,98,0.12)",
                              color: enr.status === "COMPLETED" || enr.status === "SUCCESS" ? "#34d399" : "var(--accent-primary)"
                            }}>
                              {enr.status}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {enr.enrollmentDate ? new Date(enr.enrollmentDate).toLocaleDateString("en-IN") : "—"}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Coupons Tab ─────────────────────────────────────────────────────── */}
            {activeTab === "coupons" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Coupon Codes</h2>
                  <Btn variant="primary" onClick={() => { setIsEditing(false); setEditingItem(null); setCouponForm(emptyCoupon); setShowAddCoupon(true) }}>
                    <Plus size={16} /> Create Coupon
                  </Btn>
                </div>

                {coupons.length === 0 ? (
                  <Card className="p-10 text-center">
                    <Tag size={32} className="mx-auto mb-3 opacity-30" style={{ color: "var(--accent-primary)" }} />
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No coupon codes created yet</p>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.map(coupon => (
                      <Card key={coupon._id} className={`p-5 transition-all duration-200 ${!coupon.isActive ? "opacity-50" : ""}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold tracking-widest" style={{ fontFamily: "'Outfit', monospace", background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                              {coupon.code}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ coupon.isActive ? "" : "" }`}
                            style={{
                              backgroundColor: coupon.isActive ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.12)",
                              color: coupon.isActive ? "#34d399" : "#f87171",
                            }}>
                            {coupon.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {coupon.description && (
                          <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>{coupon.description}</p>
                        )}

                        <div className="space-y-1.5 mb-4">
                          <div className="flex justify-between text-xs">
                            <span style={{ color: "var(--text-muted)" }}>Discount</span>
                            <span className="font-bold" style={{ color: "var(--accent-primary)" }}>
                              {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                              {coupon.maxDiscount ? ` (max ₹${coupon.maxDiscount})` : ""}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span style={{ color: "var(--text-muted)" }}>Applies to</span>
                            <span className="capitalize" style={{ color: "var(--text-secondary)" }}>
                              {coupon.applicableTo.replace("_", " ")}
                              {coupon.applicableTo === "specific_course" && ` (${courses.find(c => c._id === coupon.applicableItem)?.title || "Unknown"})`}
                              {coupon.applicableTo === "specific_workshop" && ` (${workshops.find(w => w._id === coupon.applicableItem)?.title || "Unknown"})`}
                            </span>
                          </div>
                          {coupon.minimumAmount > 0 && (
                            <div className="flex justify-between text-xs">
                              <span style={{ color: "var(--text-muted)" }}>Min. amount</span>
                              <span style={{ color: "var(--text-secondary)" }}>₹{coupon.minimumAmount}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <span style={{ color: "var(--text-muted)" }}>Uses</span>
                            <span style={{ color: "var(--text-secondary)" }}>
                              {coupon.usedCount} / {coupon.maxUses ?? "∞"}
                            </span>
                          </div>
                          {coupon.validUntil && (
                            <div className="flex justify-between text-xs">
                              <span style={{ color: "var(--text-muted)" }}>Expires</span>
                              <span style={{ color: new Date(coupon.validUntil) < new Date() ? "#f87171" : "var(--text-secondary)" }}>
                                {new Date(coupon.validUntil).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 mt-auto">
                          <Btn variant="secondary" className="flex-1 text-xs" onClick={() => handleToggleCoupon(coupon._id)}>
                            {coupon.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            {coupon.isActive ? "Deactivate" : "Activate"}
                          </Btn>
                          <Btn variant="secondary" className="px-2" onClick={() => handleEditCoupon(coupon)}>
                            <Edit size={13} />
                          </Btn>
                          <Btn variant="danger" className="px-2" onClick={() => handleDeleteCoupon(coupon._id)}>
                            <Trash2 size={13} />
                          </Btn>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Add User Modal ────────────────────────────────────────────────────── */}
      {showAddUser && (
        <Modal title="Add New User" onClose={handleCancel}>
          <form onSubmit={handleAddUser} className="space-y-4">
            <Field label="Full Name">
              <Input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="John Doe" required />
            </Field>
            <Field label="Email">
              <Input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="john@example.com" required />
            </Field>
            <Field label="Phone">
              <Input type="tel" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} placeholder="+91 9999999999" />
            </Field>
            <Field label="Role">
              <Select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </Field>
            <div className="flex gap-3 pt-2">
              <Btn type="submit" variant="primary" className="flex-1">Add User</Btn>
              <Btn type="button" variant="outline" onClick={handleCancel}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add / Edit Course Modal ───────────────────────────────────────────── */}
      {showAddCourse && (
        <Modal title={isEditing ? "Edit Course" : "Add New Course"} onClose={handleCancel} wide>
          <form onSubmit={handleAddCourse} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Course Title *">
                <Input value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} placeholder="e.g. Ethical Hacking Masterclass" required />
              </Field>
              <Field label="Category">
                <Select value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}>
                  <option>Cybersecurity</option>
                  <option>Programming</option>
                  <option>Networking</option>
                  <option>Cloud</option>
                  <option>General</option>
                </Select>
              </Field>
              <Field label="Instructor">
                <Input value={courseForm.instructor} onChange={e => setCourseForm({ ...courseForm, instructor: e.target.value })} placeholder="Instructor name" required />
              </Field>
              <Field label="Duration (hours)">
                <Input type="number" value={courseForm.duration} onChange={e => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="e.g. 20" />
              </Field>
              <Field label="Original Price (₹)">
                <Input type="number" value={courseForm.originalPrice} onChange={e => setCourseForm({ ...courseForm, originalPrice: e.target.value })} placeholder="e.g. 5000" />
              </Field>
              <Field label="Discounted Price (₹)">
                <Input type="number" value={courseForm.price} onChange={e => setCourseForm({ ...courseForm, price: e.target.value })} placeholder="e.g. 2999" />
              </Field>
              <Field label={`Course Image${isEditing ? " (leave blank to keep existing)" : ""}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setCourseImage(e.target.files[0])}
                  className="w-full text-sm rounded-xl px-3 py-2 cursor-pointer"
                  style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
                />
                {courseImage && <p className="text-xs mt-1" style={{ color: "var(--accent-primary)" }}>📎 {courseImage.name}</p>}
              </Field>
            </div>
            <Field label="Description *">
              <Textarea value={courseForm.about} onChange={e => setCourseForm({ ...courseForm, about: e.target.value })} placeholder="Describe the course..." required />
            </Field>
            <ArrayEditor label="Syllabus" items={courseForm.syllabus} onChange={v => setCourseForm({ ...courseForm, syllabus: v })} placeholder="e.g. Introduction to Kali Linux" />
            <ArrayEditor label="Who Should Attend" items={courseForm.whoShouldAttend} onChange={v => setCourseForm({ ...courseForm, whoShouldAttend: v })} placeholder="e.g. Beginners in IT" />
            <ArrayEditor label="Prerequisites" items={courseForm.prerequisites} onChange={v => setCourseForm({ ...courseForm, prerequisites: v })} placeholder="e.g. Basic networking knowledge" />
            <div className="flex gap-3 pt-2">
              <Btn type="submit" variant="primary" className="flex-1">{isEditing ? "Update Course" : "Create Course"}</Btn>
              <Btn type="button" variant="outline" onClick={handleCancel}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add / Edit Workshop Modal ─────────────────────────────────────────── */}
      {showAddWorkshop && (
        <Modal title={isEditing ? "Edit Workshop" : "Add New Workshop"} onClose={handleCancel} wide>
          <form onSubmit={handleAddWorkshop} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Workshop Title *">
                <Input value={workshopForm.title} onChange={e => setWorkshopForm({ ...workshopForm, title: e.target.value })} placeholder="e.g. Penetration Testing Bootcamp" required />
              </Field>
              <Field label="Category">
                <Select value={workshopForm.category} onChange={e => setWorkshopForm({ ...workshopForm, category: e.target.value })}>
                  <option>Cybersecurity</option>
                  <option>Programming</option>
                  <option>Networking</option>
                  <option>Cloud</option>
                  <option>General</option>
                </Select>
              </Field>
              <Field label="Instructor">
                <Input value={workshopForm.instructor} onChange={e => setWorkshopForm({ ...workshopForm, instructor: e.target.value })} placeholder="Instructor name" required />
              </Field>
              <Field label="Duration (hours)">
                <Input type="number" value={workshopForm.duration} onChange={e => setWorkshopForm({ ...workshopForm, duration: e.target.value })} placeholder="e.g. 8" />
              </Field>
              <Field label="Price (₹)">
                <Input type="number" value={workshopForm.price} onChange={e => setWorkshopForm({ ...workshopForm, price: e.target.value })} placeholder="e.g. 999" />
              </Field>
              <Field label="Date">
                <Input type="date" value={workshopForm.date} onChange={e => setWorkshopForm({ ...workshopForm, date: e.target.value })} />
              </Field>
              <Field label="Time">
                <Input type="time" value={workshopForm.time} onChange={e => setWorkshopForm({ ...workshopForm, time: e.target.value })} />
              </Field>
              <Field label="Location">
                <Input value={workshopForm.location} onChange={e => setWorkshopForm({ ...workshopForm, location: e.target.value })} placeholder="Online / City" />
              </Field>
              <Field label={`Workshop Image${isEditing ? " (leave blank to keep existing)" : " (optional)"}` }>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setWorkshopImage(e.target.files[0])}
                  className="w-full text-sm rounded-xl px-3 py-2 cursor-pointer"
                  style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
                />
                {workshopImage && <p className="text-xs mt-1" style={{ color: "var(--accent-primary)" }}>📎 {workshopImage.name}</p>}
              </Field>
            </div>
            <Field label="Description *">
              <Textarea value={workshopForm.about} onChange={e => setWorkshopForm({ ...workshopForm, about: e.target.value })} placeholder="Describe the workshop..." required />
            </Field>
            <ArrayEditor label="Syllabus" items={workshopForm.syllabus} onChange={v => setWorkshopForm({ ...workshopForm, syllabus: v })} placeholder="e.g. Introduction to OWASP Top 10" />
            <ArrayEditor label="Who Should Attend" items={workshopForm.whoShouldAttend} onChange={v => setWorkshopForm({ ...workshopForm, whoShouldAttend: v })} placeholder="e.g. Security enthusiasts" />
            <ArrayEditor label="Prerequisites" items={workshopForm.prerequisites} onChange={v => setWorkshopForm({ ...workshopForm, prerequisites: v })} placeholder="e.g. Basic Linux knowledge" />
            <div className="flex gap-3 pt-2">
              <Btn type="submit" variant="primary" className="flex-1">{isEditing ? "Update Workshop" : "Create Workshop"}</Btn>
              <Btn type="button" variant="outline" onClick={handleCancel}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add / Edit Coupon Modal ───────────────────────────────────────────── */}
      {showAddCoupon && (
        <Modal title={isEditing ? "Edit Coupon" : "Create Coupon Code"} onClose={handleCancel} wide>
          <form onSubmit={handleAddCoupon} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Coupon Code *">
                <input
                  value={couponForm.code}
                  onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VHASS50"
                  disabled={isEditing}
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-bold tracking-widest outline-none"
                  style={{ backgroundColor: isEditing ? "var(--bg-primary)" : "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--accent-primary)", cursor: isEditing ? "not-allowed" : "auto" }}
                  required
                />
              </Field>
              <Field label="Applies To">
                <Select value={couponForm.applicableTo} onChange={e => setCouponForm({ ...couponForm, applicableTo: e.target.value })}>
                  <option value="all">All (Courses &amp; Workshops)</option>
                  <option value="courses">Courses Only</option>
                  <option value="workshops">Workshops Only</option>
                  <option value="specific_course">Specific Course</option>
                  <option value="specific_workshop">Specific Workshop</option>
                </Select>
              </Field>
              {(couponForm.applicableTo === "specific_course" || couponForm.applicableTo === "specific_workshop") && (
                <Field label={couponForm.applicableTo === "specific_course" ? "Select Course *" : "Select Workshop *"}>
                  <Select value={couponForm.applicableItem} onChange={e => setCouponForm({ ...couponForm, applicableItem: e.target.value })} required>
                    <option value="">-- Select --</option>
                    {couponForm.applicableTo === "specific_course" && courses.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                    {couponForm.applicableTo === "specific_workshop" && workshops.map(w => (
                      <option key={w._id} value={w._id}>{w.title}</option>
                    ))}
                  </Select>
                </Field>
              )}
              <Field label="Discount Type *">
                <Select value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </Select>
              </Field>
              <Field label={couponForm.discountType === "percentage" ? "Discount Value (%) *" : "Discount Amount (₹) *"}>
                <Input type="number" value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })} placeholder={couponForm.discountType === "percentage" ? "e.g. 20" : "e.g. 500"} required />
              </Field>
              {couponForm.discountType === "percentage" && (
                <Field label="Max Discount Cap (₹) — optional">
                  <Input type="number" value={couponForm.maxDiscount} onChange={e => setCouponForm({ ...couponForm, maxDiscount: e.target.value })} placeholder="e.g. 1000" />
                </Field>
              )}
              <Field label="Minimum Order Amount (₹)">
                <Input type="number" value={couponForm.minimumAmount} onChange={e => setCouponForm({ ...couponForm, minimumAmount: e.target.value })} placeholder="e.g. 500 (0 = no minimum)" />
              </Field>
              <Field label="Max Uses (leave blank = unlimited)">
                <Input type="number" value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: e.target.value })} placeholder="e.g. 100" />
              </Field>
              <Field label="Valid From">
                <Input type="date" value={couponForm.validFrom} onChange={e => setCouponForm({ ...couponForm, validFrom: e.target.value })} />
              </Field>
              <Field label="Valid Until (leave blank = no expiry)">
                <Input type="date" value={couponForm.validUntil} onChange={e => setCouponForm({ ...couponForm, validUntil: e.target.value })} />
              </Field>
              <Field label="Status">
                <Select value={couponForm.isActive ? "true" : "false"} onChange={e => setCouponForm({ ...couponForm, isActive: e.target.value === "true" })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Select>
              </Field>
            </div>
            <Field label="Description (shown to users)">
              <Textarea value={couponForm.description} onChange={e => setCouponForm({ ...couponForm, description: e.target.value })} placeholder="e.g. Special launch discount - 20% off all courses" rows={2} />
            </Field>
            <div className="flex gap-3 pt-2">
              <Btn type="submit" variant="primary" className="flex-1">{isEditing ? "Update Coupon" : "Create Coupon"}</Btn>
              <Btn type="button" variant="outline" onClick={handleCancel}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}


      <Footer />
    </div>
  )
}
