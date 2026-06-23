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

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 flex flex-col justify-between">
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
                  href="https://www.instagram.com/vhass_academy_official/"
                  aria-label="Instagram"
                  className="social-btn"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="md:col-span-1">
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
          <div className="md:col-span-1">
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



        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-1 py-4 " >
          <p className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
            © 2026 VHASS Softwares® Pvt. Ltd. All rights reserved.
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