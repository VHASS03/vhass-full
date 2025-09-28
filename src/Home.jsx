import React, { useLayoutEffect, useRef, Suspense, useState } from "react";

import Navbar from "./Components/navbar";
import Footer from "./Components/footer";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./scene";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const mainRef = useRef(null);
  const sceneWrapperRef = useRef(null);
  const logoRef = useRef(null);
  const sectionRefs = [useRef(null), useRef(null), useRef(null)];
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Create a more dramatic scroll animation for the 3D scene
      gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3, // More responsive scrubbing
          onUpdate: (self) => setProgress(self.progress),
        },
      })
        .to(sceneWrapperRef.current, { 
          x: "-60vw", 
          y: "120vh",
          rotation: 0.2,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(sceneWrapperRef.current, { 
          x: "10vw", 
          y: "250vh",
          rotation: -0.3,
          scale: 0.9,
          duration: 0.4,
          ease: "power2.inOut"
        })
        .to(sceneWrapperRef.current, { 
          x: "-70vw", 
          y: "350vh",
          rotation: 0.4,
          scale: 1.2,
          duration: 0.3,
          ease: "power2.in"
        });

      // Add separate logo animation for more dramatic effect
      gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      })
        .to(sceneWrapperRef.current, {
          scale: 1.2,
          rotation: 0.3,
          duration: 0.5,
          ease: "power2.out"
        })
        .to(sceneWrapperRef.current, {
          scale: 0.8,
          rotation: -0.2,
          duration: 0.5,
          ease: "power2.inOut"
        })
        .to(sceneWrapperRef.current, {
          scale: 1.1,
          rotation: 0.4,
          duration: 0.5,
          ease: "power2.in"
        });

      sectionRefs.forEach((ref) => {
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
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={mainRef} className="overflow-x-hidden">
      <Suspense fallback={<div className="fixed inset-0 grid place-items-center bg-black text-white">Loading...</div>}>
        <Navbar />

        {/* Intro Section */}
        <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-[100vh] px-4 md:px-8 py-8 md:py-0">
          <div className="flex flex-col justify-center w-full lg:w-1/2 lg:ml-20 mb-8 lg:mb-20 order-2 lg:order-1">
            <div className="lg:absolute lg:top-28 lg:left-10 px-4 pt-8 lg:pt-14 text-center lg:text-left">
              <div className="landing-page">
                <div className="tag-box">
                  <div className="tag">INTRODUCING</div>
                </div>
              </div>
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>LEARN FROM</h1>
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 lg:mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>VHASS</h1>
              <p className="text-white text-base sm:text-lg md:text-xl font-normal max-w-lg mx-auto lg:mx-0" style={{ fontFamily: 'Times New Roman, serif' }}>
                VHASS Softwares is a leading ed-tech company focused on cybersecurity training, dedicated to addressing real-time problems, especially in the areas of privacy and security.
              </p>
            </div>
          </div>

          {/* 3D Scene */}
          <div ref={sceneWrapperRef} className="h-[50vh] lg:h-[100vh] w-full lg:w-1/2 order-1 lg:order-2 transform-gpu will-change-transform">
            <Canvas
              onCreated={({ gl }) => {
                // Handle WebGL context loss
                gl.domElement.addEventListener('webglcontextlost', (event) => {
                  event.preventDefault();
                  console.warn('WebGL context lost, attempting recovery...');
                });
                
                gl.domElement.addEventListener('webglcontextrestored', () => {
                  console.log('WebGL context restored');
                });
              }}
              gl={{ 
                antialias: true, 
                alpha: true,
                powerPreference: "high-performance",
                preserveDrawingBuffer: true
              }}
            >
              <Scene progress={progress} />
            </Canvas>
          </div>
        </section>

        {/* Section 1 */}
        <section className="relative flex flex-col lg:flex-row items-center justify-evenly min-h-[100vh] py-8 md:py-16 px-4 md:px-8">
          <div className="w-full lg:w-[50%] order-2 lg:order-1"></div>
          <div ref={sectionRefs[0]} className="text-white w-full lg:w-[50%] px-4 md:px-12 order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative bg-black bg-opacity-30 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white border-opacity-20 shadow-2xl">
              <div className="absolute top-6 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
              <div className="flex items-center mb-6 md:mb-8">
                <div className="w-8 md:w-12 h-0.5 bg-blue-500 mr-3 md:mr-4"></div>
                <h2 className="text-blue-400 text-lg md:text-xl font-semibold tracking-wider">ABOUT US</h2>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>INTRODUCTION</h3>
              <p className="text-base md:text-lg lg:text-xl font-light leading-relaxed">
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
        <section className="relative flex flex-col lg:flex-row items-center justify-evenly min-h-[100vh] py-8 md:py-16 px-4 md:px-8">
          <div ref={sectionRefs[1]} className="text-white w-full lg:w-[50%] px-4 md:px-12 order-1 lg:order-1 mb-8 lg:mb-0">
            <div className="relative bg-black bg-opacity-30 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white border-opacity-20 shadow-2xl max-h-full overflow-auto">
              <div className="absolute top-6 -left-2 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
              <div className="flex items-center mb-4 md:mb-6">
                <div className="w-8 md:w-10 h-0.5 bg-purple-500 mr-3 md:mr-4"></div>
                <h2 className="text-purple-400 text-base md:text-lg font-semibold tracking-wider">INDUSTRY-READY SKILLS</h2>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>WHY US?</h3>

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
                  <div key={i} className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-sm mb-1">{card.title}</h4>
                    <p className="text-xs">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[50%] order-2 lg:order-2"></div>
        </section>

        {/* Section 3 */}
        <section className="relative flex flex-col lg:flex-row items-center justify-evenly min-h-[100vh] py-8 md:py-16 px-4 md:px-8">
          <div className="w-full lg:w-[50%] order-2 lg:order-1"></div>
          <div ref={sectionRefs[2]} className="text-white w-full lg:w-[50%] px-4 md:px-12 order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative bg-black bg-opacity-30 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white border-opacity-20 shadow-2xl">
              <div className="absolute top-6 -left-2 w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
              <div className="flex items-center mb-6 md:mb-8">
                <div className="w-8 md:w-12 h-0.5 bg-emerald-500 mr-3 md:mr-4"></div>
                <h2 className="text-emerald-400 text-lg md:text-xl font-semibold tracking-wider">CAREER ACCELERATION</h2>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>Your Cybersecurity Journey</h3>
              <p className="text-base md:text-lg lg:text-xl font-light leading-relaxed">
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
