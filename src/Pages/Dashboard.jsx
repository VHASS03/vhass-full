import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../Components/navbar";
import Footer from "../Components/footer";
import ApiService from "../services/api.js";
import "./Dashboard.css";

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

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fixingEnrollment, setFixingEnrollment] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || ""
  });

  // Data state
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);
  const [attemptedAutoFix, setAttemptedAutoFix] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Loading dashboard data...");
      
      // Load data in parallel for better performance
      const [coursesResponse, workshopsResponse, historyResponse] = await Promise.allSettled([
        ApiService.getUserCourses(),
        ApiService.getUserWorkshops(),
        ApiService.getEnrollmentHistory()
      ]);

      // Handle courses response
      if (coursesResponse.status === 'fulfilled') {
        const courses = coursesResponse.value.courses || [];
        setRegisteredCourses(courses);
        console.log("Courses loaded:", courses.length);

        // Auto-attempt to fix enrollments once if none are returned
        if (user && courses.length === 0 && !attemptedAutoFix) {
          try {
            console.log("No courses found. Attempting automatic enrollment fix...");
            await ApiService.fixEnrollment();
            setAttemptedAutoFix(true);
            // Reload after fix
            const afterFix = await ApiService.getUserCourses();
            setRegisteredCourses(afterFix.courses || []);
            console.log("Auto-fix completed. Courses now:", (afterFix.courses || []).length);
          } catch (e) {
            console.error("Auto-fix enrollments failed:", e);
          }
        }

        // Secondary reconciliation: compare successful transactions vs enrolled courses
        if (user) {
          try {
            const tx = await ApiService.getUserTransactions(user._id);
            const transactions = tx.transactions || tx || [];
            const successfulTxCount = (transactions || []).filter((t) => {
              const s = (t.transactionStatus || '').toUpperCase();
              return s === 'SUCCESS' || s === 'COMPLETED' || s === 'PAYMENT_SUCCESS';
            }).length;
            if (successfulTxCount > courses.length && !attemptedAutoFix) {
              console.log("Detected successful payments without enrollments. Running fixEnrollment...");
              await ApiService.fixEnrollment();
              setAttemptedAutoFix(true);
              const refreshed = await ApiService.getUserCourses();
              setRegisteredCourses(refreshed.courses || []);
            }
          } catch (e) {
            console.warn("Could not reconcile transactions:", e.message || e);
          }
        }
      } else {
        console.error("Failed to load courses:", coursesResponse.reason);
        setRegisteredCourses([]);
      }

      // Handle workshops response
      if (workshopsResponse.status === 'fulfilled') {
        setRegisteredWorkshops(workshopsResponse.value.workshops || []);
        console.log("Workshops loaded:", workshopsResponse.value.workshops?.length || 0);
      } else {
        console.error("Failed to load workshops:", workshopsResponse.reason);
        setRegisteredWorkshops([]);
      }

      // Handle history response
      if (historyResponse.status === 'fulfilled') {
        setEnrollmentHistory(historyResponse.value.history || []);
        console.log("History loaded:", historyResponse.value.history?.length || 0);
      } else {
        console.error("Failed to load history:", historyResponse.reason);
        setEnrollmentHistory([]);
      }

      // Check if all requests failed
      const allFailed = coursesResponse.status === 'rejected' && 
                       workshopsResponse.status === 'rejected' && 
                       historyResponse.status === 'rejected';
      
      if (allFailed) {
        setError("Failed to load dashboard data. Please check your connection and try again.");
      } else {
        console.log("Dashboard data loaded successfully");
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.updateProfile(profileData);
      if (response.success) {
        setSuccess("Profile updated successfully!");
        setIsEditingProfile(false);
        // Refresh user data
        window.location.reload();
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFixEnrollment = async () => {
    setFixingEnrollment(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.fixEnrollment();
      if (response.success) {
        setSuccess(`Enrollment fixed! ${response.message}`);
        // Refresh the page to show updated courses
        window.location.reload();
      } else {
        setError(response.message || "Failed to fix enrollment");
      }
    } catch (error) {
      setError(error.message || "Failed to fix enrollment");
    } finally {
      setFixingEnrollment(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-500';
      case 'in progress': return 'text-yellow-500';
      case 'upcoming': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-glow-bg" />
      <Navbar />
      
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user.name}!</h1>
            <p className="welcome-subtitle">Manage your courses, workshops, and profile</p>
          </div>
          
                     <div className="profile-card">
             <div className="profile-avatar">
               <span>{user.name?.charAt(0).toUpperCase()}</span>
             </div>
             <div className="profile-info">
               <h3>{user.name}</h3>
               <p>{user.email}</p>
               {user.phone && <p>{user.phone}</p>}
             </div>
             <div className="profile-actions">
               <button 
                 className="edit-profile-btn"
                 onClick={() => setIsEditingProfile(true)}
               >
                 Edit Profile
               </button>
               <button 
                 className="logout-btn"
                 onClick={handleLogout}
               >
                 Logout
               </button>
             </div>
           </div>
        </div>

        {/* Profile Edit Modal */}
        {isEditingProfile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button 
                  className="close-btn"
                  onClick={() => setIsEditingProfile(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="disabled-input"
                  />
                  <small>Email cannot be changed</small>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            My Courses ({registeredCourses.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "workshops" ? "active" : ""}`}
            onClick={() => setActiveTab("workshops")}
          >
            My Workshops ({registeredWorkshops.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Enrollment History
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <p>{error}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button 
                    className="retry-btn"
                    onClick={() => {
                      setRetryCount(prev => prev + 1);
                      loadDashboardData();
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Retrying...' : 'Retry'}
                  </button>
                  <button 
                    className="refresh-btn"
                    onClick={() => window.location.reload()}
                    style={{ 
                      background: 'rgba(34, 197, 94, 0.2)', 
                      color: '#86efac',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && !loading && (
            <div className="overview-grid">
              <div className="stats-card">
                <h3>Total Courses</h3>
                <div className="stat-number">{registeredCourses.length}</div>
                <p>Enrolled courses</p>
              </div>
              
              <div className="stats-card">
                <h3>Total Workshops</h3>
                <div className="stat-number">{registeredWorkshops.length}</div>
                <p>Registered workshops</p>
              </div>
              
              <div className="stats-card">
                <h3>Completed</h3>
                <div className="stat-number">
                  {enrollmentHistory.filter(item => item.status === 'completed').length}
                </div>
                <p>Finished courses</p>
              </div>
              
              <div className="stats-card">
                <h3>In Progress</h3>
                <div className="stat-number">
                  {enrollmentHistory.filter(item => item.status === 'in progress').length}
                </div>
                <p>Active learning</p>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && !loading && (
            <div className="courses-grid">
              {registeredCourses.length === 0 ? (
                <div className="empty-state">
                  <h3>No courses enrolled yet</h3>
                  <p>Start your learning journey by enrolling in our courses!</p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      className="browse-btn"
                      onClick={() => navigate("/course")}
                    >
                      Browse Courses
                    </button>
                    <button 
                      className="browse-btn"
                      onClick={handleFixEnrollment}
                      disabled={fixingEnrollment}
                      style={{ 
                        background: 'rgba(52, 211, 153, 0.12)', 
                        border: '1px solid rgba(52, 211, 153, 0.3)', 
                        color: '#34d399',
                        boxShadow: 'none',
                        opacity: fixingEnrollment ? 0.6 : 1
                      }}
                    >
                      {fixingEnrollment ? 'Fixing...' : 'Fix My Enrollments'}
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
                    Click "Fix My Enrollments" if you've paid for a course but it's not showing up
                  </p>
                </div>
              ) : (
                registeredCourses.map((course) => (
                  <div key={course._id} className="course-card">
                    <div className="course-image">
                      <img src={getImageUrl(course.image)} alt={course.title} />
                    </div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-meta">
                        <span className={`status ${getStatusColor(course.status)}`}>
                          {course.status || 'Enrolled'}
                        </span>
                        <span className="enrollment-date">
                          Enrolled: {formatDate(course.enrollmentDate)}
                        </span>
                      </div>
                      <button 
                        className="view-course-btn"
                        onClick={() => {
                          const toSlug = (title) => title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                          const slug = toSlug(course.title);
                          navigate(`/course/${slug}`);
                        }}
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Workshops Tab */}
          {activeTab === "workshops" && !loading && (
            <div className="workshops-grid">
              {registeredWorkshops.length === 0 ? (
                <div className="empty-state">
                  <h3>No workshops registered yet</h3>
                  <p>Join our interactive workshops to enhance your skills!</p>
                  <button 
                    className="browse-btn"
                    onClick={() => navigate("/workshop")}
                  >
                    Browse Workshops
                  </button>
                </div>
              ) : (
                registeredWorkshops.map((workshop) => (
                  <div key={workshop._id} className="workshop-card">
                    <div className="workshop-image">
                      <img src={getImageUrl(workshop.image)} alt={workshop.title} />
                    </div>
                    <div className="workshop-content">
                      <h3>{workshop.title}</h3>
                      <p>{workshop.description}</p>
                      <div className="workshop-meta">
                        <span className="date">
                          {formatDate(workshop.date)}
                        </span>
                        <span className="time">
                          {workshop.time}
                        </span>
                        <span className={`status ${getStatusColor(workshop.status)}`}>
                          {workshop.status || 'Registered'}
                        </span>
                      </div>
                      <button 
                        className="view-workshop-btn"
                        onClick={() => navigate(`/workshop/${workshop._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && !loading && (
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Enrollment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-history">
                        No enrollment history found
                      </td>
                    </tr>
                  ) : (
                    enrollmentHistory.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>
                          <span className={`type-badge ${item.type}`}>
                            {item.type}
                          </span>
                        </td>
                        <td>{formatDate(item.enrollmentDate)}</td>
                        <td>
                          <span className={`status-badge ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="view-btn"
                            onClick={() => navigate(`/${item.type}/${item._id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Dashboard;
