import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Linkedin, Youtube, Instagram, ArrowRight } from "lucide-react";
import "./footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer-section">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-12">

          {/* Column 1: Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <img src="/VHASS.png" alt="VHASS" className="w-8 h-8" />
              <span className="text-xl font-bold" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>VHASS</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
              Empowering the next generation of cybersecurity professionals and tech entrepreneurs through premium education and incubation.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/vhass-softwares-private-limited/" aria-label="LinkedIn" className="social-btn" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@Vhass-d6g" aria-label="YouTube" className="social-btn" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/vhass_academy_official/" aria-label="Instagram" className="social-btn" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>
              Company
            </h4>
            <ul className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/aboutus" className="footer-link">About Us</Link></li>
              <li><Link to="/helpdesk" className="footer-link">Contact</Link></li>
              <li><Link to="/policies" className="footer-link">Policies</Link></li>
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>
              Programs
            </h4>
            <ul className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
              <li><Link to="/course" className="footer-link">Courses</Link></li>
              <li><Link to="/workshop" className="footer-link">Workshops</Link></li>
              <li><Link to="/services" className="footer-link">Cybersecurity</Link></li>
              <li><Link to="/Entrepreneur" className="footer-link">Entrepreneurship</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>
              Stay Updated
            </h4>
            <p className="text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
              Get the latest on courses, workshops, and cybersecurity insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-newsletter-input"
                required
              />
              <button type="submit" className="footer-newsletter-btn">
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
            © 2026 VHASS Softwares® Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
            <Link to="/policies" className="footer-link">Terms</Link>
            <Link to="/policies" className="footer-link">Privacy</Link>
            <Link to="/policies" className="footer-link">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;