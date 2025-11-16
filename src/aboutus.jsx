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
    <div>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      {/* Hero Section */}
      <header className="relative py-12 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">VHASS</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6 md:mb-10 px-4">
            Empowering the digital world through cutting-edge cybersecurity education
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
  <Link to="/course">
    <button className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20 text-sm md:text-base">
      Explore Courses
    </button>
  </Link>
  <a href="#contact">
    <button className="px-6 md:px-8 py-2 md:py-3 bg-gray-800 rounded-full font-semibold hover:bg-gray-700 transition-all border border-gray-700 text-sm md:text-base">
      Contact Us
    </button>
  </a>
</div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-1 mb-8 w-fit">
                <div className="bg-gray-900 p-5 rounded-xl">
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    To empower and protect through education — because learning is the strongest defense in a connected world.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                  <div className="text-blue-400 text-3xl mb-3">🔒</div>
                  <h3 className="font-bold mb-2">Security First</h3>
                  <p className="text-sm text-gray-400">Prioritizing protection in everything we do</p>
                </div>
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                  <div className="text-purple-400 text-3xl mb-3">💡</div>
                  <h3 className="font-bold mb-2">Innovation</h3>
                  <p className="text-sm text-gray-400">Continuously evolving our teaching methods</p>
                </div>
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                  <div className="text-green-400 text-3xl mb-3">👥</div>
                  <h3 className="font-bold mb-2">Community</h3>
                  <p className="text-sm text-gray-400">Building a supportive learning network</p>
                </div>
                <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                  <div className="text-yellow-400 text-3xl mb-3">🎓</div>
                  <h3 className="font-bold mb-2">Excellence</h3>
                  <p className="text-sm text-gray-400">Setting the highest standards in cybersecurity</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl rotate-3 blur-sm"></div>
              <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800">
                <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="mr-4">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                      <div className="w-0.5 h-full bg-gray-700 mx-auto"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Company Founded</h3>
                      <p className="text-gray-400">2023 - Revolutionizing cybersecurity education</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-4">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mt-2"></div>
                      <div className="w-0.5 h-full bg-gray-700 mx-auto"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Learning Platform</h3>
                      <p className="text-gray-400">Developed hands-on cybersecurity training</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-4">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                      <div className="w-0.5 h-full bg-gray-700 mx-auto"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">MeitY GENESIS EiR</h3>
                      <p className="text-gray-400">Selected with ₹5,00,000 grant</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="mr-4">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mt-2"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Global Expansion</h3>
                      <p className="text-gray-400">Building a worldwide cybersecurity movement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">2025 Goals</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Our ambitious targets for the coming year</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-1">
              <div className="bg-gray-900 h-full rounded-2xl p-8 flex flex-col">
                <div className="text-5xl mb-4 text-blue-400">1000+</div>
                <h3 className="text-xl font-bold mb-3">Ethical Hackers</h3>
                <p className="text-gray-400 flex-grow">
                  Train the next generation of cybersecurity professionals to protect digital assets worldwide.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-4/5"></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-2">80% progress</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-1">
              <div className="bg-gray-900 h-full rounded-2xl p-8 flex flex-col">
                <div className="text-5xl mb-4 text-purple-400">50+</div>
                <h3 className="text-xl font-bold mb-3">Social Ventures</h3>
                <p className="text-gray-400 flex-grow">
                  Launch initiatives that create positive social impact through cybersecurity solutions.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-2/5"></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-2">40% progress</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-2xl p-1">
              <div className="bg-gray-900 h-full rounded-2xl p-8 flex flex-col">
                <div className="text-5xl mb-4 text-indigo-400">Global</div>
                <h3 className="text-xl font-bold mb-3">Cybersecurity Movement</h3>
                <p className="text-gray-400 flex-grow">
                  Establish a worldwide community dedicated to creating a safer digital environment.
                </p>
                <div className="mt-6">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-3/5"></div>
                  </div>
                  <div className="text-right text-sm text-gray-400 mt-2">60% progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Leadership Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto px-4">The visionaries driving our cybersecurity mission</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-1">
              <div className="bg-gray-900 rounded-2xl p-8 h-full flex flex-col">
                <div className="flex items-start mb-6">
                  <img src="/images/hemanth.webp" alt="Pagadala Hemanth Krishna Vardhan" className="rounded-xl w-16 h-16 mr-4 object-cover" />
                  <div>
                    <h3 className="text-2xl font-bold">Pagadala Hemanth Krishna Vardhan</h3>
                    <div className="text-blue-400 font-medium">Founder & CEO</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 flex-grow">
                  Expert in ethical hacking and penetration testing with over a decade of experience in cybersecurity. Passionate about creating accessible security education.
                </p>
                <div className="flex gap-3">
                  <div className="px-3 py-1 bg-gray-800 rounded-full text-sm">Ethical Hacking</div>
                  <div className="px-3 py-1 bg-gray-800 rounded-full text-sm">Penetration Testing</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-1">
              <div className="bg-gray-900 rounded-2xl p-8 h-full flex flex-col">
                <div className="flex items-start mb-6">
                  <img src="/images/uday.jpg" alt="Uday Venkat Charkanam" className="rounded-xl w-16 h-16 mr-4 object-cover" />
                  <div>
                    <h3 className="text-2xl font-bold">Uday Venkat Charkanam</h3>
                    <div className="text-purple-400 font-medium">Chief Operating Officer</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 flex-grow">
                  Specialist in cloud security and threat intelligence with a background in enterprise security solutions. Focused on operational excellence.
                </p>
                <div className="flex gap-3">
                  <div className="px-3 py-1 bg-gray-800 rounded-full text-sm">Cloud Security</div>
                  <div className="px-3 py-1 bg-gray-800 rounded-full text-sm">Threat Intelligence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Cybersecurity Revolution</h2>
          <p className="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">
            Ready to make a difference in the digital world? Explore our courses and become part of the solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/course">
         
 
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30">
              Browse Courses
            </button>
          </Link>
            <button className="px-8 py-4 bg-gray-900 rounded-xl font-bold hover:bg-gray-800 transition-all border border-gray-700">
              Request Information
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Find answers to common questions about our programs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="text-blue-400 mr-2">●</span> Courses
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-700">
                  <h4 className="font-medium mb-2">How long are the courses?</h4>
                  <p className="text-gray-400 text-sm">Our courses range from 4-week intensives to 12-week comprehensive programs.</p>
                </div>
                <div className="pb-4 border-b border-gray-700">
                  <h4 className="font-medium mb-2">What prerequisites are required?</h4>
                  <p className="text-gray-400 text-sm">Basic computer knowledge. Some advanced courses require foundational cybersecurity concepts.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="text-purple-400 mr-2">●</span> Certification
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-700">
                  <h4 className="font-medium mb-2">Do you provide certification?</h4>
                  <p className="text-gray-400 text-sm">Yes, all our courses include industry-recognized certification upon completion.</p>
                </div>
                <div className="pb-4 border-b border-gray-700">
                  <h4 className="font-medium mb-2">Are certifications accredited?</h4>
                  <p className="text-gray-400 text-sm">Our certifications are recognized by major cybersecurity organizations and employers.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <span className="text-blue-400 mr-2">●</span> Payment
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-700">
                  <h4 className="font-medium mb-2">What payment options do you accept?</h4>
                  <p className="text-gray-400 text-sm">We accept credit cards, bank transfers, and offer financing options.</p>
                </div>
                <div className="pb-4 border-b border-gray-700">
                  <h4 className="font-medium mb-2">Do you offer scholarships?</h4>
                  <p className="text-gray-400 text-sm">Yes, we have need-based scholarships and diversity initiatives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Contact our support team for personalized assistance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-1">
              <div className="bg-gray-900 rounded-2xl p-8 h-full">
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-blue-400 mr-4">✉️</div>
                    <div>
                      <h4 className="font-bold">Email</h4>
                      <p className="text-gray-400">info@vhassacademy.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-purple-400 mr-4">📞</div>
                    <div>
                      <h4 className="font-bold">Phone</h4>
                      <p className="text-gray-400">+91 89853 20226</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-400 mr-4">🏢</div>
                    <div>
                      <h4 className="font-bold">Location</h4>
                      <p className="text-gray-400">9-1-70, Brilliant's School Area,<br/>Ibrahimpatnam Krishna-521456,<br/>Andhra Pradesh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-1">
              <div className="bg-gray-900 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setStatus("");
                    setSending(true);
                    try {
                      await api.sendContactMessage(contact);
                      setStatus("Message sent successfully.");
                      setContact({ name: "", email: "", message: "" });
                    } catch (err) {
                      setStatus(err?.message || "Failed to send message");
                    } finally {
                      setSending(false);
                    }
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      name="name"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      name="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      type="email"
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      value={contact.message}
                      onChange={(e) => setContact({ ...contact, message: e.target.value })}
                      rows="4"
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  {status && (
                    <div className="text-sm text-gray-300">{status}</div>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

     <Footer    />
    </div>
    </div>
  );
};

export default AboutUs;