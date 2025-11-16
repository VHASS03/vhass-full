import React from "react";
import "./footer.css";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import {
  AiFillLinkedin, 
  AiFillYoutube, 
  AiFillInstagram 
} from "react-icons/ai";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <h1 className="footer-logo-text">VHASS</h1>
              <p className="footer-description">
                Empowering the digital world with cutting-edge cybersecurity education and solutions.
              </p>
              
              <div className="footer-social">
                <h5>Follow Us</h5>
                <div className="social-links">
                  <a href="https://www.linkedin.com/company/vhass-softwares-private-limited/" aria-label="LinkedIn">
                    <AiFillLinkedin size={20} />
                  </a>
                  <a href="https://www.youtube.com/@Vhass-d6g" aria-label="YouTube">
                    <AiFillYoutube size={20} />
                  </a>
                  <a href="https://www.instagram.com/vhass_official" aria-label="Instagram">
                    <AiFillInstagram size={20} />
                  </a>
                </div>
              </div>

              <p className="footer-copyright">
                © 2025 VHASS Software® Pvt. Ltd. All rights reserved.
              </p>
            </div>

            <div className="footer-links-grid">
              <div className="footer-links-section">
                <h4 className="footer-title">Quick Links</h4>
                <div className="footer-links-table">
                  <div className="footer-links-row">
                    <Link to="/" className="footer-link-cell">Home</Link>
                    <Link to="/course" className="footer-link-cell">Ethical Hacking</Link>
                    <Link to="/contact" className="footer-link-cell">Contact Us</Link>
                  </div>
                  <div className="footer-links-row">
                    <Link to="/course" className="footer-link-cell">Course</Link>
                    <Link to="/course" className="footer-link-cell">Bounty Hunting</Link>
                    <div className="footer-link-cell">
                      9-1-70, Brilliant's School Area,
                    </div>
                  </div>
                  <div className="footer-links-row">
                    <Link to="/workshop" className="footer-link-cell">Workshop</Link>
                    <Link to="/course" className="footer-link-cell">Awareness of Cyber Crime</Link>
                    <div className="footer-link-cell">
                      Ibrahimpatnam Krishna-521456,
                    </div>
                  </div>
                  <div className="footer-links-row">
                    <Link to="/entrepreneur" className="footer-link-cell">Entrepreneur</Link>
                    <Link to="/course" className="footer-link-cell">Cyber Security for Teenagers</Link>
                    <div className="footer-link-cell">
                      Andhra Pradesh
                    </div>
                  </div>
                  <div className="footer-links-row">
                    <Link to="/about" className="footer-link-cell">About Us</Link>
                    <Link to="/course" className="footer-link-cell">Entrepreneurship for Beginners</Link>
                    <div className="footer-link-cell contact-info">
                      <div className="contact-item">
                        <FaPhone className="contact-icon" />
                        +91 89853 20226
                      </div>
                      <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        info@vhassacademy.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-legal-links">
              <Link to="/policies">Terms and Conditions</Link>
              <span>|</span>
              <Link to="/policies">Refund Policy</Link>
              <span>|</span>
              <Link to="/policies">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;