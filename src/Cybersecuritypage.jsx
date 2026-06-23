import React from 'react';
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
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div
          className="text-center mb-12 py-20 rounded-3xl relative overflow-hidden mx-4 md:mx-0"
          style={{
            background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] rounded-full blur-[120px]" style={{ background: 'var(--hero-glow)' }} />
          </div>
          <div className="relative z-10 px-4">
            <h1 
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
            >
              Cybersecurity <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Services</span>
            </h1>
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}
            >
              Protecting your digital assets starts with proactive defense and expert awareness. 
              At Vhass Software Solutions Pvt. Ltd., we deliver advanced cybersecurity services tailored to your 
              organization's needs.
            </p>
          </div>
        </div>

        {/* Security Auditing Section */}
        <section className="py-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>Security Auditing</h2>
          <p className="text-center text-lg mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--accent-primary)' }}>Expose weaknesses before attackers do.</p>
          <p className="max-w-4xl mx-auto text-center text-lg leading-relaxed mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
            Our comprehensive security audits provide a detailed analysis of your digital 
            infrastructure, helping you stay compliant, resilient, and secure. We incorporate 
            AI-driven threat analysis and automated vulnerability scanning to enhance precision 
            and efficiency in identifying security gaps.
          </p>

          <h3 className="text-3xl font-extrabold mb-20 text-center tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>What We Offer</h3>
          <div className="relative max-w-5xl mx-auto py-10">
            {/* Central Glowing Line */}
            <div className="absolute hidden md:block left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 opacity-30" style={{ background: 'linear-gradient(to bottom, transparent, var(--accent-primary), var(--accent-secondary), transparent)' }}></div>
            
            {auditServices.map(({ Icon, title, desc }, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={title} className={`relative flex flex-col md:flex-row items-center mb-16 md:mb-24 group w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Content Side */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} text-center mb-8 md:mb-0`}>
                    <h4 className="text-2xl md:text-3xl font-bold mb-4 transition-all duration-300 group-hover:scale-105 inline-block" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>{title}</h4>
                    <p className="text-base md:text-lg leading-relaxed transition-colors duration-300 group-hover:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                  
                  {/* Central Node */}
                  <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center mb-8 md:mb-0">
                    {/* Connecting Hover Glow */}
                    <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'var(--accent-gradient)' }}></div>
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110" style={{ background: 'var(--bg-primary)', border: '2px solid var(--accent-primary)' }}>
                       <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-12" style={{ background: 'var(--accent-gradient)' }}>
                         <Icon className="w-6 h-6 text-white" />
                       </div>
                    </div>
                  </div>
                  
                  {/* Empty Spacer Side */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
              Let us secure your infrastructure before attackers can exploit it.
            </p>
            <button 
              className="px-8 py-3.5 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 inline-flex items-center"
              onClick={() => navigate('/auth')}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--glow-color-hover)' }}
            >
              Get Secured Now <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Cybersecurity Training Section */}
        <section className="py-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>Cybersecurity Training</h2>
          <p className="text-center text-lg mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--accent-primary)' }}>Turn your team into cyber defenders.</p>
          <p className="max-w-4xl mx-auto text-center text-lg leading-relaxed mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
            Empower your employees, IT staff, and professionals with hands-on cybersecurity 
            knowledge that goes beyond theory.
          </p>

          <h3 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>Our Training Programs Include:</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mb-16">
            {trainingPrograms.map(({ Icon, title }) => (
              <div key={title} className="flex items-center gap-3 backdrop-blur-md px-6 py-4 rounded-full transition-all duration-300 hover:scale-105" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card-hover)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span className="text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-primary)' }}>{title}</span>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>Why Choose Us:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {benefits.map(({ Icon, title }) => (
              <div key={title} className="backdrop-blur-md p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <Icon className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--accent-primary)' }} />
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>{title}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
              Build a cyber-aware culture within your organization.
            </p>
            <button 
              className="px-8 py-3.5 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 inline-flex items-center"
              onClick={() => navigate('/auth')}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--glow-color-hover)' }}
            >
              Start Training <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CybersecurityPage;