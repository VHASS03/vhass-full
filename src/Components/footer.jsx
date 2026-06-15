import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  Linkedin,
  Youtube,
  Instagram,
  Star,
  Send,
  ArrowRight
} from "lucide-react";
import api from "../services/api";
import "./footer.css";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setSending(true);
    try {
      await api.sendContactMessage(formData);
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus(err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="footer-section text-white relative overflow-hidden">
      {/* Background Decorative Large Text */}
      <div className="footer-bg-text-wrapper select-none pointer-events-none absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
        <div className="footer-bg-text font-black text-center text-[13vw] tracking-wider leading-none footer-watermark-text">
          VHASS
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 mb-16">

          {/* Column 1: Brand Info */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VHASS</span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Empowering the digital world with cutting-edge cybersecurity education and incubation solutions.
              </p>

              {/* Trust Rating Block */}

            </div>

            {/* Social Links */}
            <div className="social-links-container" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Follow us on</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/vhass-softwares-private-limited/"
                  aria-label="LinkedIn"
                  className="social-btn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@Vhass-d6g"
                  aria-label="YouTube"
                  className="social-btn"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/vhass_official"
                  aria-label="Instagram"
                  className="social-btn"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Company
            </h4>
            <ul className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/aboutus" className="footer-link">About Us</Link></li>
              <li><Link to="/services" className="footer-link">Services</Link></li>
              <li><Link to="/entrepreneur" className="footer-link">Incubation</Link></li>
              <li><Link to="/helpdesk" className="footer-link">Help Desk</Link></li>
            </ul>
          </div>

          {/* Column 3: Programs */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Programs
            </h4>
            <ul className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
              <li><Link to="/course" className="footer-link">Ethical Hacking</Link></li>
              <li><Link to="/course" className="footer-link">Bounty Hunting</Link></li>
              <li><Link to="/course" className="footer-link">Cyber Awareness</Link></li>
              <li><Link to="/course" className="footer-link">Beginner Courses</Link></li>
              <li><Link to="/workshop" className="footer-link">Workshops</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact us form */}
          <div className="md:col-span-5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Contact us
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className="footer-input"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="footer-input"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message"
                  rows={3}
                  className="footer-input footer-textarea"
                  required
                />
              </div>
              {status && (
                <p className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>{status}</p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="footer-submit-btn shadow-[0_4px_15px_rgba(168,85,247,0.2)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.4)]"
              >
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>

        </div>

        {/* Separator line */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
            © 2026 VHASS Software® Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
            <Link to="/policies" className="footer-link">Terms and Conditions</Link>
            <Link to="/policies" className="footer-link">Refund Policy</Link>
            <Link to="/policies" className="footer-link">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;