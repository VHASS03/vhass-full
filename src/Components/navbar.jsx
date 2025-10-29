import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./navbar.css";
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthCheck } from "../hooks/useAuthCheck.js";

function Navbar() {
  const navigate = useNavigate();
  const { logout, loading } = useAuth();
  const { user } = useAuthCheck();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    button.style.setProperty("--x", `${x}%`);
    button.style.setProperty("--y", `${y}%`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  return (
    <header>
      <div className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="brand" onClick={() => navigate("/")}>
          <img src="VHASS.png" alt="VHASS Logo" className="logo" />
          <h1 className="brand-text">VHASS</h1>
        </div>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li><button className="nav-libtn" onClick={() => { navigate("/"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Home</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/course"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Courses</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/workshop"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Workshop</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/Entrepreneur"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Entrepreneur</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/Services"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Services</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/aboutus"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>About Us</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/helpdesk"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Help Desk</button></li>
            
          </ul>
        </nav>

        <div className="user-menu">
          {loading ? (
            <div style={{ color: 'white', fontSize: '14px' }}>Loading...</div>
          ) : user ? (
            <div className="user-buttons">
              <button className="login" onClick={() => { navigate("/dashboard"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Dashboard</button>
              {user.role === 'admin' && (
                <button className="login" onClick={() => { navigate("/admin"); closeMobileMenu(); }} onMouseMove={handleMouseMove} style={{ backgroundColor: '#B88AFF', color: '#000000' }}>Admin</button>
              )}
            
            </div>
          ) : (
            <button className="login" onClick={() => { navigate("/auth"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>LOGIN</button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {isMobileMenuOpen && (
          <div className="nav-backdrop" onClick={closeMobileMenu} />
        )}
      </div>
    </header>
  );
}

export default Navbar;
