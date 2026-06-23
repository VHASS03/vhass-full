import React, { useLayoutEffect, useRef, Suspense, useState, useEffect } from "react";
import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import SEO from "./Components/SEO";
import StructuredData, { generateOrganizationSchema, generateWebSiteSchema } from "./Components/StructuredData";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./scene";
import { useNavigate } from "react-router-dom";
import { Shield, Rocket, Award, Users, BookOpen, ArrowRight, Briefcase, GraduationCap, Target, TrendingUp, ChevronRight, Star, Zap, Globe, Code, Lock, Lightbulb, Network } from "lucide-react";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   COUNT-UP HOOK
   ═══════════════════════════════════════════ */
const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, count];
};

/* ═══════════════════════════════════════════
   STAT ITEM COMPONENT
   ═══════════════════════════════════════════ */
const StatItem = ({ number, suffix = "+", label }) => {
  const [ref, count] = useCountUp(number, 2200);
  return (
    <div ref={ref} className="text-center px-6 py-4">
      <div className="text-5xl md:text-7xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: '#FFB162' }}>
        {count}{suffix}
      </div>
      <div className="text-sm md:text-base font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#C9C1B1' }}>
        {label}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */
function Home() {
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const sceneWrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      if (!isMobile && sceneWrapperRef.current) {
        gsap.timeline({
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
            onUpdate: (self) => setProgress(self.progress),
          },
        })
          .to(sceneWrapperRef.current, { x: "-20vw", y: "100vh", scale: 0.6, opacity: 0.3 })
          .to(sceneWrapperRef.current, { x: "10vw", y: "200vh", scale: 0.4, opacity: 0.1 })
          .to(sceneWrapperRef.current, { x: "0vw", y: "300vh", scale: 0.3, opacity: 0 });
      }

      // Animate sections on scroll
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="overflow-x-hidden" style={{ background: '#0D1117' }}>
      <SEO
        title="VHASS Academy — Build Future-Proof Skills in Cybersecurity & Entrepreneurship"
        description="Learn through real-world projects, industry certifications, startup innovation programs, internships, and career acceleration pathways. Join VHASS Academy."
        keywords="cybersecurity courses, entrepreneurship training, ethical hacking, VHASS Academy, cybersecurity certification, startup incubation, career acceleration"
        url="https://www.vhassacademy.com/"
      />
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateWebSiteSchema()} />

      <Suspense fallback={
        <div className="fixed inset-0 grid place-items-center" style={{ background: '#0D1117' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-t-[#FFB162] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            <span style={{ color: '#C9C1B1', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' }}>Loading VHASS...</span>
          </div>
        </div>
      }>
        <Navbar />

        {/* ═══════════════════════════════════════════
            SECTION 1 — HERO
            ═══════════════════════════════════════════ */}
        <section className="relative min-h-[calc(100vh-72px)] flex flex-col md:flex-row items-center px-6 md:px-12 pt-8 md:pt-0">
          {/* Ambient gradient glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255, 177, 98, 0.06) 0%, transparent 60%)' }} />

          {/* Left: Content */}
          <div className="flex flex-col justify-center w-full md:w-[55%] z-10 py-8 md:py-0 md:pl-8 lg:pl-16">
            <div className="max-w-2xl">
              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold tracking-widest" style={{ background: 'rgba(255, 177, 98, 0.08)', border: '1px solid rgba(255, 177, 98, 0.15)', color: '#FFB162', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Zap className="w-3.5 h-3.5" />
                CYBERSECURITY · ENTREPRENEURSHIP · INNOVATION
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.08] tracking-tight mb-6" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>
                Build Future-Proof Skills in{' '}
                <span style={{ background: 'linear-gradient(135deg, #FFB162 0%, #e8944a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Cybersecurity
                </span>{' '}
                & Entrepreneurship
              </h1>

              {/* Subheadline */}
              <p className="text-base md:text-lg mb-10 leading-relaxed max-w-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#C9C1B1' }}>
                Learn through real-world projects, industry certifications, startup innovation programs, internships, and career acceleration pathways.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  className="btn-primary"
                  onClick={() => navigate('/course')}
                >
                  Explore Programs <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/helpdesk')}
                >
                  Book Free Consultation
                </button>
              </div>

              {/* Trust Metrics */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {[
                  { icon: Users, label: "500+ Students Trained" },
                  { icon: Award, label: "Industry Certifications" },
                  { icon: Briefcase, label: "Internship Programs" },
                  { icon: Rocket, label: "Startup Incubation" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: '#FFB162' }} />
                    <span style={{ color: '#6b7a8d' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: 3D Scene */}
          <div ref={sceneWrapperRef} className="h-[45vh] sm:h-[55vh] md:h-screen w-full md:w-[45%] order-first md:order-last">
            <Canvas>
              <Scene progress={progress} />
            </Canvas>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 2 — TRUST BAR
            ═══════════════════════════════════════════ */}
        <section className="animate-on-scroll relative py-16 md:py-20 border-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem number={500} label="Students Trained" />
              <StatItem number={50} label="Certifications Earned" />
              <StatItem number={30} label="Internships Secured" />
              <StatItem number={10} label="Startups Supported" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 3 — PROGRAMS OVERVIEW
            ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#FFB162', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What We Offer</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>
                Four Pillars of Excellence
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#C9C1B1' }}>
                A comprehensive ecosystem designed to take you from learning to launching.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Cybersecurity Academy", desc: "Master ethical hacking, penetration testing, and defense strategies through hands-on labs and industry certifications.", link: "/services", color: "#FFB162" },
                { icon: Rocket, title: "Entrepreneurship Hub", desc: "Validate ideas, build MVPs, and launch your startup with expert mentorship and incubation support.", link: "/Entrepreneur", color: "#FFC182" },
                { icon: BookOpen, title: "Courses & Workshops", desc: "Expert-led programs ranging from beginner fundamentals to advanced threat intelligence and security operations.", link: "/course", color: "#e8944a" },
                { icon: Target, title: "Career Acceleration", desc: "Internship placements, career mentorship, and job-ready skill development to fast-track your professional growth.", link: "/aboutus", color: "#FFB162" },
              ].map(({ icon: Icon, title, desc, link, color }, i) => (
                <div
                  key={title}
                  className="animate-on-scroll group relative p-8 rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2"
                  style={{ background: '#1B2433', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={() => navigate(link)}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}10 0%, transparent 70%)` }} />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-[#FFB162] transition-colors" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>{title}</h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#6b7a8d' }}>{desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: '#FFB162', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Learn More <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 4 — CAREER JOURNEY
            ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-6 animate-on-scroll" style={{ background: 'linear-gradient(180deg, rgba(22,30,42,0.5) 0%, #0D1117 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#FFB162', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Path Forward</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>
                From Learner to Leader
              </h2>
              <p className="text-base md:text-lg max-w-xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#C9C1B1' }}>
                A structured 5-step journey that transforms your potential into a career.
              </p>
            </div>

            {/* Journey Steps */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,177,98,0.2), rgba(255,177,98,0.2), transparent)' }} />

              {[
                { step: "01", icon: BookOpen, title: "Learn", desc: "Expert-led courses" },
                { step: "02", icon: Code, title: "Practice", desc: "Hands-on labs" },
                { step: "03", icon: Award, title: "Certify", desc: "Industry credentials" },
                { step: "04", icon: Briefcase, title: "Intern", desc: "Real-world experience" },
                { step: "05", icon: TrendingUp, title: "Launch Career", desc: "Job placement support" },
              ].map(({ step, icon: Icon, title, desc }, i) => (
                <div key={step} className="relative flex flex-col items-center text-center z-10 flex-1">
                  {/* Node */}
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110" style={{ background: '#1B2433', border: '2px solid rgba(255,177,98,0.2)' }}>
                    <Icon className="w-6 h-6" style={{ color: '#FFB162' }} />
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: '#FFB162', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step}</div>
                  <h4 className="text-base font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>{title}</h4>
                  <p className="text-xs" style={{ color: '#6b7a8d', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 5 — ENTREPRENEURSHIP ECOSYSTEM
            ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div className="animate-on-scroll">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#FFB162', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Startup Ecosystem</p>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>
                  From Idea to<br />
                  <span style={{ color: '#FFB162' }}>Funded Startup</span>
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#C9C1B1' }}>
                  Our entrepreneurship program is designed for aspiring founders who want to build impactful ventures in the cybersecurity and technology space.
                </p>
                <button className="btn-primary" onClick={() => navigate('/Entrepreneur')}>
                  Explore Incubation <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-on-scroll">
                {[
                  { icon: Lightbulb, title: "Idea Validation", desc: "Refine your concept with expert feedback" },
                  { icon: Users, title: "Startup Mentorship", desc: "1-on-1 guidance from industry leaders" },
                  { icon: Network, title: "Incubation", desc: "Resources, workspace, and support" },
                  { icon: TrendingUp, title: "Funding Readiness", desc: "Pitch prep and investor access" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="group p-6 rounded-xl transition-all duration-300 hover:-translate-y-1" style={{ background: '#1B2433', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Icon className="w-5 h-5 mb-4 group-hover:scale-110 transition-transform" style={{ color: '#FFB162' }} />
                    <h4 className="text-sm font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>{title}</h4>
                    <p className="text-xs leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#6b7a8d' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 6 — TESTIMONIALS
            ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-6 animate-on-scroll" style={{ background: 'linear-gradient(180deg, rgba(22,30,42,0.3) 0%, #0D1117 100%)' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#FFB162', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Success Stories</p>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>
                What Our Students Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  role: "Security Analyst, TCS",
                  quote: "VHASS transformed my understanding of cybersecurity. The hands-on labs and mentorship helped me land my dream job within 3 months of completing the course.",
                  rating: 5
                },
                {
                  name: "Arjun Reddy",
                  role: "Founder, SecureStack",
                  quote: "The entrepreneurship incubation program gave me the confidence and tools to launch my own cybersecurity startup. The mentor network is invaluable.",
                  rating: 5
                },
                {
                  name: "Sneha Patel",
                  role: "Ethical Hacker, Infosys",
                  quote: "From a complete beginner to a certified ethical hacker — VHASS made it possible with their structured curriculum and incredible instructor support.",
                  rating: 5
                },
              ].map(({ name, role, quote, rating }, i) => (
                <div
                  key={name}
                  className="group p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ background: 'rgba(27, 36, 51, 0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#FFB162' }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#C9C1B1' }}>
                    "{quote}"
                  </p>

                  {/* Author */}
                  <div>
                    <div className="text-sm font-bold" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>{name}</div>
                    <div className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#6b7a8d' }}>{role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 7 — FINAL CTA
            ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-6 relative animate-on-scroll">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 177, 98, 0.04) 0%, transparent 60%)' }} />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6" style={{ fontFamily: "'Outfit', sans-serif", color: '#EEE9DF' }}>
              Ready to Shape<br />the Future?
            </h2>
            <p className="text-base md:text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#C9C1B1' }}>
              Join 500+ professionals who chose VHASS to accelerate their cybersecurity and entrepreneurship careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary" onClick={() => navigate('/course')}>
                Explore Programs <ArrowRight className="w-4 h-4" />
              </button>
              <button className="btn-secondary" onClick={() => navigate('/helpdesk')}>
                Book Free Consultation
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </Suspense>
    </main>
  );
}

export default Home;
