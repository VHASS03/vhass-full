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
      <Navbar />

      <div className="min-h-screen relative">
        {/* Hero Section */}
        <section
          className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden"
        >
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
        </section>

        {/* Mission Section */}
        <section className="py-16  px-4 md:px-6 relative z-10">
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
                2026 Goals
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
                  tags: [],
                  roleColor: 'var(--accent-primary)'
                },
                {
                  img: '/images/uday.jpg',
                  alt: 'Uday Venkat Charkanam',
                  name: 'Uday Venkat Charkanam',
                  role: 'Co-Founder & COO',
                  bio: 'Cybersecurity professional with over a decade of experience in ethical hacking and penetration testing, dedicated to making security education accessible and practical for all.',
                  tags: [],
                  roleColor: 'var(--accent-secondary)'
                }
              ].map((leader, i) => (
                <div key={i} className="backdrop-blur-md rounded-2xl p-8 transition-all duration-300 h-full flex flex-col justify-between" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div className="flex items-center gap-6 mb-6">
                      <div
                        className="w-36 h-36 rounded-xl overflow-hidden flex-shrink-0"
                        style={{
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <img
                          src={leader.img}
                          alt={leader.alt}
                          className={`w-full h-full transition-all duration-300 ${i === 0
                            ? 'object-cover scale-150 object-[50%_15%]'
                            : 'object-cover object-[50%_20%]'
                            }`}
                        />
                      </div>

                      <div className="flex-1">
                        <h3
                          className="text-2xl font-bold"
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            color: 'var(--text-primary)',
                          }}
                        >
                          {leader.name}
                        </h3>

                        <div
                          className="font-medium text-sm"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            color: leader.roleColor,
                          }}
                        >
                          {leader.role}
                        </div>
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


        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;