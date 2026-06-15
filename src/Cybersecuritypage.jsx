import React from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import Navbar from './Components/navbar.jsx';
import './Cybersecuritypage.css';
import Footer from './Components/footer.jsx';
import { 
  Shield, 
  Globe, 
  Cloud, 
  ClipboardCheck, 
  Cpu, 
  Activity, 
  Terminal, 
  Target, 
  Mail, 
  Code, 
  Users, 
  Award, 
  Layers, 
  Laptop, 
  Flag, 
  ArrowRight 
} from 'lucide-react';

function CybersecurityPage() {
  const navigate = useNavigate();

  const auditServices = [
    { Icon: Shield, title: 'Network Security Audits', desc: 'Identify open ports, misconfigured firewalls, and unauthorized access points.' },
    { Icon: Globe, title: 'Web Application Testing', desc: 'Detect vulnerabilities such as SQL Injection, XSS, and authentication flaws.' },
    { Icon: Cloud, title: 'Cloud Security Review', desc: 'Assess misconfigured storage, access control issues, and cloud-native risks.' },
    { Icon: ClipboardCheck, title: 'Compliance & Risk Auditing', desc: 'Ensure alignment with standards like ISO 27001, GDPR, PCI-DSS, and HIPAA.' },
    { Icon: Cpu, title: 'AI Vulnerability Assessment', desc: 'Use of machine learning algorithms to detect complex patterns, unusual behaviors, and emerging threats.' },
    { Icon: Activity, title: 'Report & Remediation Plan', desc: 'Clear, actionable steps to fix discovered vulnerabilities.' },
  ];

  const trainingPrograms = [
    { Icon: Terminal, title: 'Ethical Hacking & Penetration Testing' },
    { Icon: Target, title: 'Incident Response & Threat Hunting' },
    { Icon: Mail, title: 'Phishing Awareness & Social Engineering' },
    { Icon: Code, title: 'Secure Coding Practices for Developers' },
    { Icon: Users, title: 'Cybersecurity for Business Leaders' },
  ];

  const benefits = [
    { Icon: Award, title: 'Industry-certified trainers (CEH, OSCP, etc.)' },
    { Icon: Layers, title: 'Custom modules for different roles (IT, HR, Management)' },
    { Icon: Laptop, title: 'Virtual, onsite, or hybrid delivery models' },
    { Icon: Flag, title: 'Live simulations, labs, and CTFs (Capture The Flag)' },
  ];

  return (
    <div className="cybersecurity-page min-h-screen font-sans">
      <Navbar />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 style={{ fontFamily: "'Outfit', sans-serif" }}>Cybersecurity Services</h1>
          <p className="hero-description" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
=======
import Navbar from './Components/navbar.jsx';
import './Cybersecuritypage.css';
import Footer from './Components/footer.jsx';
function CybersecurityPage() {
  return (
    <div className="cybersecurity-page">
      <Navbar />
      
      <main className="main-content">
        <section className="hero-section">
          <h1>Cybersecurity Services</h1>
          <p className="hero-description">
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
            Protecting your digital assets starts with proactive defense and expert awareness. 
            At Vhass Software Solutions Pvt. Ltd., we deliver advanced cybersecurity services tailored to your 
            organization's needs—whether it's identifying vulnerabilities or training your teams 
            to be your first line of defense.
          </p>
        </section>

<<<<<<< HEAD
        {/* Security Auditing Section */}
        <section className="service-section">
          <h2 style={{ fontFamily: "'Outfit', sans-serif" }}>Security Auditing</h2>
          <p className="service-tagline" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Expose weaknesses before attackers do.</p>
          <p className="service-description" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
=======
        <section className="service-section">
          <h2>Security Auditing</h2>
          <p className="service-tagline">Expose weaknesses before attackers do.</p>
          
          <p className="service-description">
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
            Our comprehensive security audits provide a detailed analysis of your digital 
            infrastructure, helping you stay compliant, resilient, and secure. We incorporate 
            AI-driven threat analysis and automated vulnerability scanning to enhance precision 
            and efficiency in identifying security gaps.
          </p>

<<<<<<< HEAD
          <h3 style={{ fontFamily: "'Outfit', sans-serif" }}>What We Offer:</h3>
          <div className="services-grid">
            {auditServices.map(({ Icon, title, desc }) => (
              <div key={title} className="service-card">
                <div className="service-card-header">
                  <div className="service-icon">
                    <Icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <h4 className="service-card-title">{title}</h4>
                </div>
                <p className="service-card-description">{desc}</p>
              </div>
            ))}
          </div>

          <div className="cta-container">
            <span className="cta-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Let us secure your infrastructure before attackers can exploit it.
            </span>
            <button 
              className="cta-button"
              onClick={() => navigate('/auth')}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Get Secured Now <ArrowRight className="cta-button-arrow ml-2 w-4 h-4 inline-block" />
            </button>
          </div>
        </section>

        {/* Cybersecurity Training Section */}
        <section className="service-section">
          <h2 style={{ fontFamily: "'Outfit', sans-serif" }}>Cybersecurity Training</h2>
          <p className="service-tagline" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Turn your team into cyber defenders.</p>
          <p className="service-description" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
=======
          <h3>What We Offer:</h3>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">🛡️</div>
                <h4 className="service-card-title">Network Security Audits</h4>
              </div>
              <p className="service-card-description">
                Identify open ports, misconfigured firewalls, and unauthorized access points.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">🌐</div>
                <h4 className="service-card-title">Web Application Testing</h4>
              </div>
              <p className="service-card-description">
                Detect vulnerabilities such as SQL Injection, XSS, and authentication flaws.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">☁️</div>
                <h4 className="service-card-title">Cloud Security Review</h4>
              </div>
              <p className="service-card-description">
                Assess misconfigured storage, access control issues, and cloud-native risks.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">📋</div>
                <h4 className="service-card-title">Compliance & Risk Auditing</h4>
              </div>
              <p className="service-card-description">
                Ensure alignment with standards like ISO 27001, GDPR, PCI-DSS, and HIPAA.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">🤖</div>
                <h4 className="service-card-title">AI-powered Vulnerability Assessment</h4>
              </div>
              <p className="service-card-description">
                Use of machine learning algorithms to detect complex patterns, unusual behaviors, and emerging threats.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">📊</div>
                <h4 className="service-card-title">Report & Remediation Plan</h4>
              </div>
              <p className="service-card-description">
                Clear, actionable steps to fix discovered vulnerabilities.
              </p>
            </div>
          </div>

          <p className="service-cta">
            Let us secure your infrastructure before attackers can exploit it.
          </p>
        </section>

        <section className="service-section">
          <h2>Cybersecurity Training</h2>
          <p className="service-tagline">Turn your team into cyber defenders.</p>
          
          <p className="service-description">
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
            Empower your employees, IT staff, and professionals with hands-on cybersecurity 
            knowledge that goes beyond theory.
          </p>

<<<<<<< HEAD
          <h3 style={{ fontFamily: "'Outfit', sans-serif" }}>Our Training Programs Include:</h3>
          <div className="training-grid">
            {trainingPrograms.map(({ Icon, title }) => (
              <div key={title} className="training-card">
                <div className="training-card-icon-wrapper">
                  <Icon className="training-icon w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div className="training-card-content">
                  <span className="training-card-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: "'Outfit', sans-serif" }}>Why Choose Us:</h3>
          <div className="benefits-grid">
            {benefits.map(({ Icon, title }) => (
              <div key={title} className="benefit-card">
                <Icon className="benefit-icon w-6 h-6 mb-4" style={{ color: 'var(--accent-primary)' }} />
                <p className="benefit-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</p>
              </div>
            ))}
          </div>

          <div className="cta-container">
            <span className="cta-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Build a cyber-aware culture within your organization.
            </span>
            <button 
              className="cta-button"
              onClick={() => navigate('/auth')}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Start Training <ArrowRight className="cta-button-arrow ml-2 w-4 h-4 inline-block" />
            </button>
          </div>
=======
          <h3>Our Training Programs Include:</h3>
          <ul className="training-list">
            <li>Ethical Hacking & Penetration Testing</li>
            <li>Incident Response & Threat Hunting</li>
            <li>Phishing Awareness & Social Engineering Defense</li>
            <li>Secure Coding Practices for Developers</li>
            <li>Cybersecurity for Business Leaders & Executives</li>
          </ul>

          <h3>Why Choose Us:</h3>
          <ul className="benefits-list">
            <li>Industry-certified trainers (CEH, OSCP, etc.)</li>
            <li>Custom modules for different roles (IT, HR, Management)</li>
            <li>Virtual, onsite, or hybrid delivery models</li>
            <li>Live simulations, labs, and CTFs (Capture The Flag)</li>
          </ul>

          <p className="service-cta">
            Build a cyber-aware culture within your organization.
          </p>
>>>>>>> 66bc4f02194a681fb8f3e0e66a5e9a641725ec5e
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CybersecurityPage;