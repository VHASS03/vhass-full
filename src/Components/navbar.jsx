import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./navbar.css";
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useAuthCheck } from "../hooks/useAuthCheck.js";
import { Sun, Moon } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { logout, loading } = useAuth();
  const { user } = useAuthCheck();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

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

  const renderUserMenu = (isSidebar) => (
    <div className={`user-menu flex items-center gap-4 ${isSidebar ? 'sidebar-user-menu' : 'header-user-menu'}`}>
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-btn"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-[#2C3B4D]" />
        )}
      </button>

      {loading ? (
        <div className="text-sm">Loading...</div>
      ) : user ? (
        <div className="user-buttons">
          <button className="login" onClick={() => { navigate("/dashboard"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>Dashboard</button>
          {user.role === 'admin' && (
            <button className="login" onClick={() => { navigate("/admin"); closeMobileMenu(); }} onMouseMove={handleMouseMove} style={{ backgroundColor: 'var(--accent-primary)', color: '#000000' }}>Admin</button>
          )}
        </div>
      ) : (
        <button className="login" onClick={() => { navigate("/auth"); closeMobileMenu(); }} onMouseMove={handleMouseMove}>LOGIN</button>
      )}
    </div>
  );

  return (
    <header>
      <div className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="brand" onClick={() => navigate("/")}> 
          <img src="/VHASS.png" alt="VHASS Logo" className="logo" />
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

          <div className="sidebar-user-menu-wrapper">
            {renderUserMenu(true)}
          </div>
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className={`header-user-menu-wrapper ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            {renderUserMenu(false)}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="nav-backdrop" onClick={closeMobileMenu} />
        )}
      </div>
    </header>
  );
}

export default Navbar;
