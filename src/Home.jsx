import React, { useLayoutEffect, useRef, Suspense, useState } from "react";

import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import SEO from "./Components/SEO";
import StructuredData, { generateOrganizationSchema, generateWebSiteSchema } from "./Components/StructuredData";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./scene";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const mainRef = useRef(null);
  const sceneWrapperRef = useRef(null);
  const sectionRefs = [useRef(null), useRef(null), useRef(null)];
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Only run complex animations on desktop
      const isMobile = window.innerWidth < 768;

      if (!isMobile && sceneWrapperRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        })
          .to(sceneWrapperRef.current, { x: "-50vw", y: "101vh", scale: 0.85, opacity: 0.8 })
          .to(sceneWrapperRef.current, { x: "0vw", y: "200vh", scale: 0.7, opacity: 0.5 })
          .to(sceneWrapperRef.current, { x: "-50vw", y: "300vh", scale: 0.5, opacity: 0.2 });
      }

      sectionRefs.forEach((ref) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 85%",
                end: "bottom 60%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="overflow-x-hidden">
      <SEO
        title="VHASS Academy - Learn Cybersecurity & Entrepreneurship from Industry Experts"
        description="VHASS Academy offers comprehensive cybersecurity training and entrepreneurship courses. Learn from industry experts and transform your career with hands-on experience in cybersecurity, ethical hacking, and business development."
        keywords="cybersecurity courses, entrepreneurship training, online courses, VHASS Academy, cybersecurity training India, learn cybersecurity, cybersecurity certification, ethical hacking course, online learning platform"
        url="https://www.vhassacademy.com/"
      />
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateWebSiteSchema()} />
      <Suspense fallback={<div className="fixed inset-0 grid place-items-center bg-black text-white">Loading...</div>}>
        <Navbar />

        {/* Intro Section */}
        <section className="relative flex flex-col md:flex-row items-center justify-start md:justify-between min-h-screen md:h-[100vh] px-4 md:px-8 pt-24 pb-8 md:py-0">
          {/* Gradient glow behind intro text */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'var(--glow-color)', opacity: 0.6 }} />
          <div className="flex flex-col justify-center w-full md:w-1/2 mb-8 md:mb-20 md:ml-20 z-10">
            <div className="relative px-4 mt-8 md:mt-0 md:pt-14 max-w-2xl">
              <div className="landing-page">
                <div className="tag-box">
                  <div className="tag">INTRODUCING</div>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold mb-1 leading-none tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>LEARN FROM</h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold mb-2 md:mb-2 leading-none tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VHASS</h1>
              <p className="mt-4 mb-8 text-lg text-gray-400 max-w-xl leading-relaxed">Empowering India's next generation of Cybersecurity and AI leaders. Discover expert-led programs, hands-on labs, and real-world skills that transform careers. Join the VHASS Academy community and step into the future of technology.</p>


              {/* CTA Buttons & Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  className="px-8 py-3.5 rounded-full font-bold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--glow-color-hover)' }}
                  onClick={() => window.location.href = '/course'}
                >
                  Explore Courses
                </button>
                <button
                  className="px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:bg-[var(--bg-card)] border"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                  onClick={() => window.location.href = '/aboutus'}
                >
                  Discover More
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Industry Experts</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-[#00e5ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Hands-on Labs</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Scene */}
          <div ref={sceneWrapperRef} className="h-[50vh] sm:h-[60vh] md:h-[100vh] w-full md:w-1/2 order-first md:order-last">
            <Canvas>
              <Scene progress={progress} />
            </Canvas>
          </div>
        </section>

        <section className="relative flex flex-col md:flex-row items-center justify-evenly py-12 md:py-16 px-4 md:px-0 md:min-h-screen md:h-[100vh]">
          <div className="bg-cyber-grid" />
          <div className="hidden md:block w-[50%]"></div>
          <div ref={sectionRefs[0]} className="w-full md:w-[50%] px-4 sm:px-8 md:px-12" style={{ color: 'var(--text-primary)' }}>
            <div className="relative backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="absolute top-6 -left-2 w-4 h-4 rounded-full animate-ping" style={{ background: 'var(--accent-primary)' }}></div>
              <div className="flex items-center mb-6 md:mb-8">
                <div className="w-8 md:w-12 h-0.5 mr-4" style={{ background: 'var(--accent-primary)' }}></div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-wider" style={{ color: 'var(--accent-primary)' }}>ABOUT US</h2>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>INTRODUCTION</h3>
              <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Cybersecurity is the practice of protecting digital systems, networks, and sensitive data from unauthorized access, breaches, and cyberattacks.
                It plays a vital role in ensuring the safety of individuals and organizations in an increasingly digital world.
                <br /><br />
                An online cybersecurity course covers key concepts like threat detection, risk management, and defense strategies.
                You'll learn how to secure systems, identify vulnerabilities, and respond to real-world cyber threats using industry-standard tools.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="relative flex flex-col md:flex-row items-center justify-evenly py-12 md:py-16 px-4 md:px-0 md:min-h-screen md:h-[100vh]">
          <div className="bg-cyber-grid" style={{ opacity: 0.5 }} />
          <div ref={sectionRefs[1]} className="w-full md:w-[50%] px-4 sm:px-8 md:px-12 order-2 md:order-1" style={{ color: 'var(--text-primary)' }}>
            <div className="relative backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl max-h-full overflow-auto" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="absolute top-6 -left-2 w-4 h-4 rounded-full animate-ping" style={{ background: 'var(--accent-secondary)' }}></div>
              <div className="flex items-center mb-6">
                <div className="w-8 md:w-10 h-0.5 mr-4" style={{ background: 'var(--accent-secondary)' }}></div>
                <h2 className="text-base sm:text-lg font-semibold tracking-wider" style={{ color: 'var(--accent-secondary)' }}>INDUSTRY-READY SKILLS</h2>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>WHY US?</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "Instructors", desc: "Certified & Experienced Instructors" },
                  { title: "Affordable", desc: "Most affordable & quality content" },
                  { title: "Recordings", desc: "Lifetime Access To Recorded Sessions" },
                  { title: "Certificate", desc: "ISO Certificate on completion." },
                  { title: "Support", desc: "Lifetime Support During & Post Training" },
                  { title: "Internship", desc: "Internship opportunity for Skilled students" },
                  { title: "Industry Oriented", desc: "Get Industry Skills" },
                  { title: "Jobs/Career", desc: "Jobs/Placement/Career assistance" }
                ].map((card, i) => (
                  <div key={i} className="p-3 sm:p-4 rounded-lg shadow-sm" style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
                    <h4 className="font-semibold text-sm sm:text-base mb-1" style={{ color: 'var(--text-primary)' }}>{card.title}</h4>
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block w-[50%] order-1 md:order-2"></div>
        </section>

        {/* Section 3 */}
        <section className="relative flex flex-col md:flex-row items-center justify-evenly py-12 md:py-16 px-4 md:px-0 md:min-h-screen md:h-[100vh]">
          <div className="hidden md:block w-[50%]"></div>
          <div ref={sectionRefs[2]} className="w-full md:w-[50%] px-4 sm:px-8 md:px-12" style={{ color: 'var(--text-primary)' }}>
            <div className="relative backdrop-blur-md rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div className="absolute top-6 -left-2 w-4 h-4 rounded-full animate-ping" style={{ background: 'var(--accent-primary)' }}></div>
              <div className="flex items-center mb-6 md:mb-8">
                <div className="w-8 md:w-12 h-0.5 mr-4" style={{ background: 'var(--accent-primary)' }}></div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-wider" style={{ color: 'var(--accent-primary)' }}>CAREER ACCELERATION</h2>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>Your Cybersecurity Journey</h3>
              <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Join our global community of cybersecurity professionals and take the next step toward a rewarding, future-proof career.
                Gain access to industry-recognized certifications, personalized career mentorship, hands-on labs, and job placement assistance
                that connects you with leading employers. We don't just teach — we guide, support, and empower you to succeed.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </Suspense>
    </main>
  );
}

export default Home;
