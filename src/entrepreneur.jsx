import Footer from "./Components/footer"
import React from "react"
import { useNavigate } from "react-router-dom"  
import Navbar from "./Components/navbar"

export default function EntrepreneurshipPage() {
  const navigate = useNavigate();
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
          
          <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
            <h1 
              className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
            >
              Entrepreneurship <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Program</span>
            </h1>
            <p 
              className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}
            >
              Turn your innovative ideas into a successful venture. Our comprehensive incubation program is designed specifically for aspiring cybersecurity professionals.
            </p>
            <button 
              onClick={() => navigate('/course')} 
              className="px-8 py-3.5 rounded-full font-semibold text-white transform hover:-translate-y-0.5 transition-all duration-300"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--glow-color-hover)' }}
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative max-w-5xl mx-auto py-10">
              {/* Central Glowing Line */}
              <div className="absolute hidden md:block left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 opacity-30" style={{ background: 'linear-gradient(to bottom, transparent, var(--accent-primary), var(--accent-secondary), transparent)' }}></div>
              
              {[
                {
                  title: 'Idea Incubation',
                  desc: 'Get expert assistance to refine your business idea and develop a viable product or service.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  title: 'Business Training',
                  desc: 'Gain essential business skills including marketing, finance, and operations specifically for industry ventures.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )
                },
                {
                  title: 'Mentorship',
                  desc: 'Connect with successful entrepreneurs and industry experts for personalized, focused guidance.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )
                },
                {
                  title: 'Investor Network',
                  desc: 'Access a network of active investors interested in funding promising tech and security startups.',
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((feature, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={feature.title} className={`relative flex flex-col md:flex-row items-center mb-16 md:mb-24 group w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    
                    {/* Content Side */}
                    <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} text-center mb-8 md:mb-0`}>
                      <h4 className="text-2xl md:text-3xl font-bold mb-4 transition-all duration-300 group-hover:scale-105 inline-block" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>{feature.title}</h4>
                      <p className="text-base md:text-lg leading-relaxed transition-colors duration-300 group-hover:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>{feature.desc}</p>
                    </div>
                    
                    {/* Central Node */}
                    <div className="relative md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center mb-8 md:mb-0">
                      {/* Connecting Hover Glow */}
                      <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'var(--accent-gradient)' }}></div>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110" style={{ background: 'var(--bg-primary)', border: '2px solid var(--accent-primary)' }}>
                         <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-12" style={{ background: 'var(--accent-gradient)' }}>
                           {feature.icon}
                         </div>
                      </div>
                    </div>
                    
                    {/* Empty Spacer Side */}
                    <div className="hidden md:block w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Program Structure */}
        <section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 
              className="text-3xl md:text-5xl font-bold text-center mb-16"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
            >
              Program Structure
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 opacity-30" style={{ background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))' }}></div>

              {/* Module 1 */}
              <div className="relative flex flex-col md:flex-row items-center mb-12">
                <div className="flex-1 w-full md:pr-8 md:text-right">
                  <div className="backdrop-blur-md p-6 rounded-2xl transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--accent-primary)' }}>Module 1: Foundation</h3>
                    <ul className="space-y-1 text-sm md:inline-block md:text-right" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
                      <li>Business fundamentals for tech startups</li>
                      <li>Market research & problem validation</li>
                      <li>Developing your unique value proposition</li>
                    </ul>
                  </div>
                </div>
                <div className="my-4 md:my-0 w-8 h-8 rounded-full z-10 flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent-primary)', border: '4px solid var(--bg-primary)', boxShadow: '0 0 15px var(--glow-color-hover)' }}>1</div>
                <div className="flex-1 w-full md:pl-8"></div>
              </div>

              {/* Module 2 */}
              <div className="relative flex flex-col md:flex-row items-center mb-12">
                <div className="flex-1 w-full md:pr-8 order-last md:order-first"></div>
                <div className="my-4 md:my-0 w-8 h-8 rounded-full z-10 flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent-secondary)', border: '4px solid var(--bg-primary)', boxShadow: '0 0 15px var(--glow-color)' }}>2</div>
                <div className="flex-1 w-full md:pl-8">
                  <div className="backdrop-blur-md p-6 rounded-2xl transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--accent-secondary)' }}>Module 2: Product Development</h3>
                    <ul className="space-y-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
                      <li>Product & service prototyping strategy</li>
                      <li>MVP building and validation testing</li>
                      <li>Intellectual property & patent protection</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Module 3 */}
              <div className="relative flex flex-col md:flex-row items-center mb-12">
                <div className="flex-1 w-full md:pr-8 md:text-right">
                  <div className="backdrop-blur-md p-6 rounded-2xl transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--accent-primary)' }}>Module 3: Growth & Operations</h3>
                    <ul className="space-y-1 text-sm md:inline-block md:text-right" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
                      <li>Marketing & B2B sales for security services</li>
                      <li>Financial modeling and startup funding</li>
                      <li>Building your operations, team & culture</li>
                    </ul>
                  </div>
                </div>
                <div className="my-4 md:my-0 w-8 h-8 rounded-full z-10 flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent-primary)', border: '4px solid var(--bg-primary)', boxShadow: '0 0 15px var(--glow-color-hover)' }}>3</div>
                <div className="flex-1 w-full md:pl-8"></div>
              </div>

              {/* Module 4 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="flex-1 w-full md:pr-8 order-last md:order-first"></div>
                <div className="my-4 md:my-0 w-8 h-8 rounded-full z-10 flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent-secondary)', border: '4px solid var(--bg-primary)', boxShadow: '0 0 15px var(--glow-color)' }}>4</div>
                <div className="flex-1 w-full md:pl-8">
                  <div className="backdrop-blur-md p-6 rounded-2xl transition-all duration-300" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--accent-secondary)' }}>Module 4: Launch & Beyond</h3>
                    <ul className="space-y-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}>
                      <li>Preparing investor pitch decks & pitches</li>
                      <li>Legal formation and compliance setup</li>
                      <li>Incubator graduation and Demo Day</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20" style={{ background: 'linear-gradient(to top, var(--bg-secondary), transparent)' }}>
          <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}
            >
              Ready to Launch Your Venture?
            </h2>
            <p 
              className="mb-8 max-w-lg mx-auto"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'var(--text-secondary)' }}
            >
              Applications for our next cohort are now open. Limited incubation spots available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/course')} 
                className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--accent-gradient)', boxShadow: '0 4px 15px var(--glow-color)' }}
              >
                Apply Now
              </button>
              <button 
                onClick={() => navigate('/aboutus')}
                className="px-8 py-3 rounded-full font-semibold transition-all duration-300"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", border: '1px solid var(--border-color-hover)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}