import React, { useState } from 'react';
import Footer from './Components/footer';
import Navbar from './Components/navbar';
import { Link } from "react-router-dom";
import api from "./services/api";

const AboutUs = () => {
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar/>
      
      <div className="min-h-screen relative">
        {/* Hero Section */}
        <header
          className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, var(--bg-secondary), transparent)' }}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5"></div>
          <div className="relative max-w-6xl mx-auto text-center z-10">
            <h1 
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
            >
              About <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VHASS</span>
            </h1>
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 px-4 leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}
            >
              Empowering the digital world through cutting-edge cybersecurity education and next-generation learning models.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
              <Link to="/course">
                <button 
                  className="px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 text-sm md:text-base"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--glow-color-hover)' }}
                >
                  Explore Courses
                </button>
              </Link>
              <a href="#contact">
                <button 
                  className="px-8 py-3.5 rounded-full font-semibold transition-all text-sm md:text-base"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </header>

        {/* Mission Section */}
        <section className="py-16 md:py-24 px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="backdrop-blur-md p-8 rounded-2xl mb-8 transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
                  >
                    Our Mission
                  </h2>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}
                  >
                    To empower and protect through education — because learning is the strongest defense in an interconnected world.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { emoji: '🛡️', title: 'Security First', desc: 'Prioritizing protection in everything we do' },
                    { emoji: '💡', title: 'Innovation', desc: 'Continuously evolving our teaching methods' },
                    { emoji: '👥', title: 'Community', desc: 'Building a supportive learning network' },
                    { emoji: '🎓', title: 'Excellence', desc: 'Setting the highest standards in cybersecurity' }
                  ].map((item, i) => (
                    <div key={i} className="backdrop-blur-md p-6 rounded-xl transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <div className="text-3xl mb-3">{item.emoji}</div>
                      <h3 className="font-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>{item.title}</h3>
                      <p className="text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl rotate-3 blur-sm" style={{ background: 'linear-gradient(to right, var(--glow-color), var(--hero-glow))' }}></div>
                <div className="relative backdrop-blur-md rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h2 
                    className="text-3xl font-bold mb-6"
                    style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
                  >
                    Our Journey
                  </h2>
                  <div className="space-y-6">
                    {[
                      { color: 'var(--accent-primary)', title: 'Company Founded', desc: '2023 - Revolutionizing cybersecurity education' },
                      { color: 'var(--accent-secondary)', title: 'Learning Platform', desc: 'Developed hands-on cybersecurity training' },
                      { color: 'var(--accent-primary)', title: 'Meitey GENESIS EiR', desc: 'Selected with ₹5,00,000 grant' },
                      { color: 'var(--accent-secondary)', title: 'Global Expansion', desc: 'Building a worldwide cybersecurity movement' }
                    ].map((step, i) => (
                      <div key={i} className="flex">
                        <div className="mr-4">
                          <div className="w-3 h-3 rounded-full mt-2" style={{ background: step.color }}></div>
                          {i < 3 && <div className="w-0.5 h-full mx-auto" style={{ background: 'var(--border-color)' }}></div>}
                        </div>
                        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="py-16 md:py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
              >
                2025 Goals
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>Our ambitious targets for the coming year</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: '1000+', label: 'Ethical Hackers', desc: 'Train the next generation of cybersecurity professionals to protect digital assets worldwide.', progress: '80%', from: 'var(--accent-primary)', to: 'var(--accent-secondary)' },
                { num: '50+', label: 'Social Ventures', desc: 'Launch initiatives that create positive social impact through cybersecurity solutions.', progress: '40%', from: 'var(--accent-secondary)', to: 'var(--accent-primary)' },
                { num: 'Global', label: 'Movement', desc: 'Establish a worldwide community dedicated to creating a safer digital environment.', progress: '60%', from: 'var(--accent-primary)', to: 'var(--accent-secondary)' }
              ].map((goal, i) => (
                <div key={i} className="backdrop-blur-md rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div className="text-5xl font-extrabold mb-4" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--accent-primary)' }}>{goal.num}</div>
                    <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>{goal.label}</h3>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>
                      {goal.desc}
                    </p>
                  </div>
                  <div className="mt-8">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                      <div className="h-full rounded-full" style={{ width: goal.progress, background: `linear-gradient(to right, ${goal.from}, ${goal.to})` }}></div>
                    </div>
                    <div className="text-right text-xs mt-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>{goal.progress} progress</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-16 md:py-24 px-4 md:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
              >
                Leadership Team
              </h2>
              <p className="max-w-2xl mx-auto px-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>The visionaries driving our cybersecurity mission</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  img: '/images/hemanth.webp',
                  alt: 'Pagadala Hemanth Krishna Vardhan',
                  name: 'Pagadala Hemanth Krishna Vardhan',
                  role: 'Founder & CEO',
                  bio: 'Expert in ethical hacking and penetration testing with over a decade of experience in cybersecurity. Passionate about creating accessible security education.',
                  tags: ['Ethical Hacking', 'Penetration Testing'],
                  roleColor: 'var(--accent-primary)'
                },
                {
                  img: '/images/uday.jpg',
                  alt: 'Uday Venkat Charkanam',
                  name: 'Uday Venkat Charkanam',
                  role: 'Chief Operating Officer',
                  bio: 'Specialist in cloud security and threat intelligence with a background in enterprise security solutions. Focused on operational excellence.',
                  tags: ['Cloud Security', 'Threat Intelligence'],
                  roleColor: 'var(--accent-secondary)'
                }
              ].map((leader, i) => (
                <div key={i} className="backdrop-blur-md rounded-2xl p-8 transition-all duration-300 h-full flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div className="flex items-start mb-6">
                      <img src={leader.img} alt={leader.alt} className="rounded-xl w-16 h-16 mr-4 object-cover" style={{ border: '1px solid var(--border-color)' }} />
                      <div>
                        <h3 className="text-2xl font-bold" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>{leader.name}</h3>
                        <div className="font-medium text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: leader.roleColor }}>{leader.role}</div>
                      </div>
                    </div>
                    <p className="mb-6 leading-relaxed text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
                      {leader.bio}
                    </p>
                  </div>
                  <div className="flex gap-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {leader.tags.map((tag, j) => (
                      <div key={j} className="px-3 py-1 rounded-full text-xs" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{tag}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 relative z-10" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-3xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
              >
                Frequently Asked Questions
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-muted)' }}>Find answers to common questions about our programs</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  accentColor: 'var(--accent-primary)',
                  category: 'Courses',
                  faqs: [
                    { q: 'How long are the courses?', a: 'Our courses range from 4-week intensives to 12-week comprehensive programs.' },
                    { q: 'What prerequisites are required?', a: 'Basic computer knowledge. Some advanced courses require foundational cybersecurity concepts.' }
                  ]
                },
                {
                  accentColor: 'var(--accent-secondary)',
                  category: 'Certification',
                  faqs: [
                    { q: 'Do you provide certification?', a: 'Yes, all our courses include industry-recognized certification upon completion.' },
                    { q: 'Are certifications accredited?', a: 'Our certifications are recognized by major cybersecurity organizations and employers.' }
                  ]
                },
                {
                  accentColor: 'var(--accent-primary)',
                  category: 'Payment',
                  faqs: [
                    { q: 'What payment options do you accept?', a: 'We accept credit cards, bank transfers, and offer flexible financing options.' },
                    { q: 'Do you offer scholarships?', a: 'Yes, we have need-based scholarships and diversity initiatives.' }
                  ]
                }
              ].map((block, i) => (
                <div key={i} className="backdrop-blur-md rounded-2xl p-8 transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <h3 className="text-xl font-bold mb-6 flex items-center" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
                    <span className="mr-2" style={{ color: block.accentColor }}>●</span> {block.category}
                  </h3>
                  <div className="space-y-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {block.faqs.map((faq, j) => (
                      <div key={j} className={`pb-4 ${j < block.faqs.length - 1 ? 'border-b' : ''}`} style={{ borderColor: 'var(--border-color)' }}>
                        <h4 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>{faq.q}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer/>
      </div>
    </div>
  );
};

export default AboutUs;