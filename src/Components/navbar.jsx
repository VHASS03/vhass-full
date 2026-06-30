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
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Scroll listener for transparent → solid transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderUserMenu = (isSidebar) => (
    <div className={`user-menu flex items-center gap-3 ${isSidebar ? 'sidebar-user-menu' : 'header-user-menu'}`}>
      {loading ? (
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>
      ) : user ? (
        <div className="user-buttons">
          <button className="login" onClick={() => { navigate("/dashboard"); closeMobileMenu(); }}>Dashboard</button>
          {user.role === 'admin' && (
            <button className="cta-primary" onClick={() => { navigate("/admin"); closeMobileMenu(); }}>Admin</button>
          )}
        </div>
      ) : (
        <div className="user-buttons">
          <button className="login" onClick={() => { navigate("/auth"); closeMobileMenu(); }}>Log In</button>
        </div>
      )}
    </div>
  );

  return (
    <header className={isScrolled ? 'nav-solid' : 'nav-transparent'}>
      <div className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="brand" onClick={() => navigate("/")}>
          <img src="/VHASS.png" alt="VHASS Logo" className="logo" />
          <h1 className="brand-text">VHASS</h1>
        </div>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li><button className="nav-libtn" onClick={() => { navigate("/"); closeMobileMenu(); }}>Home</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/course"); closeMobileMenu(); }}>Courses</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/workshop"); closeMobileMenu(); }}>Workshops</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/services"); closeMobileMenu(); }}>Cybersecurity</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/Entrepreneur"); closeMobileMenu(); }}>Entrepreneurship</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/aboutus"); closeMobileMenu(); }}>About</button></li>
            <li><button className="nav-libtn" onClick={() => { navigate("/helpdesk"); closeMobileMenu(); }}>Contact</button></li>
          </ul>

          <div className="sidebar-user-menu-wrapper">
            {renderUserMenu(true)}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className={`header-user-menu-wrapper ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            {renderUserMenu(false)}
          </div>

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
