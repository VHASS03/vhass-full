import React from 'react';
import Navbar from './navbar';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui2/button';
import { useNavigate } from 'react-router-dom';

export default function Policies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 hover:opacity-80"
          style={{ color: "#FFFFF0", backgroundColor: "rgba(255, 255, 255, 0.1)", border: "1px solid #B88AFF" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#FFFFF0" }}>
            VHASS SOFTWARES PRIVATE LIMITED
          </h1>
          <p className="text-xl" style={{ color: "#B88AFF" }}>
            Terms, Refund, and Privacy Policies
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Terms & Conditions */}
          <section className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
            <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "#FFFFF0", borderColor: "#B88AFF" }}>
              Terms & Conditions
            </h2>
            
            <div className="space-y-6" style={{ color: "#B88AFF" }}>
              <p className="text-lg leading-relaxed">
                These Terms and Conditions ("Terms") constitute a legally binding agreement between you and
                <strong className="text-white"> VHASS SOFTWARES PRIVATE LIMITED</strong> ("VHASS", "we", "us", or "our"), 
                a company registered under the Companies Act, 2013. By accessing or using our website, mobile application, 
                or services, you agree to be bound by these Terms.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFF0" }}>1. Use of Our Services</h3>
                  <p className="text-lg leading-relaxed">
                    You must be at least 18 years old to use our platform. You agree to provide accurate, current, 
                    and complete information and to use our services lawfully and ethically.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFF0" }}>2. Intellectual Property</h3>
                  <p className="text-lg leading-relaxed">
                    All logos, content, code, software, and course materials are proprietary to VHASS. Unauthorized use, 
                    reproduction, recording, or distribution of any course or part of our services is strictly prohibited 
                    and will be considered a legal offense. Recording or uploading our course content on any platform, 
                    in any form, is a punishable offense under applicable law.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: "#FFFFF0" }}>3. User Conduct</h3>
                  <p className="text-lg leading-relaxed">
                    You agree not to misuse our platform, attempt to hack systems, or engage in illegal activity 
                    while using our services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Policy */}
          <section className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
            <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "#FFFFF0", borderColor: "#B88AFF" }}>
              Refund Policy
            </h2>
            
            <div className="space-y-6" style={{ color: "#B88AFF" }}>
              <p className="text-lg leading-relaxed">
                At VHASS SOFTWARES PRIVATE LIMITED, we maintain a strict no-refund policy due to the nature 
                of digital content and services.
              </p>

              <ul className="space-y-3 text-lg leading-relaxed">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span><strong className="text-white">No refunds will be issued under any circumstances</strong> once a course or service has been purchased.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Courses cannot be returned, exchanged, or transferred.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Recording or unauthorized distribution of course content is strictly prohibited and will be legally prosecuted.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="p-8 rounded-2xl shadow-xl" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
            <h2 className="text-3xl font-bold mb-6 pb-4 border-b-4" style={{ color: "#FFFFF0", borderColor: "#B88AFF" }}>
              Privacy Policy
            </h2>
            
            <div className="space-y-6" style={{ color: "#B88AFF" }}>
              <p className="text-lg leading-relaxed">
                This Privacy Policy describes how VHASS SOFTWARES PRIVATE LIMITED collects, uses, and protects user data.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFFFF0" }}>Information We Collect</h3>
                  <ul className="space-y-2 text-lg leading-relaxed">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong className="text-white">Personal Data:</strong> Name, email address, contact number, location (if consented).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span><strong className="text-white">Technical Data:</strong> IP address, device info, browser type, access times.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFFFF0" }}>How We Use Your Information</h3>
                  <ul className="space-y-2 text-lg leading-relaxed">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>To deliver and maintain services.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>For customer support and security.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>To send transactional or promotional updates (only with consent).</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFFFF0" }}>Data Security</h3>
                  <p className="text-lg leading-relaxed">
                    We use AES encryption and SSL certificates to secure your data. Regular audits and access control are enforced.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFFFF0" }}>Data Sharing</h3>
                  <p className="text-lg leading-relaxed">
                    We <strong className="text-white">do not sell or rent</strong> your personal data. We may share data with 
                    trusted partners strictly for service delivery under NDAs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "#FFFFF0" }}>Your Rights</h3>
                  <p className="text-lg leading-relaxed">
                    You may request data access, correction, or deletion anytime by writing to{' '}
                    <a 
                      href="mailto:info@vhassacademy.com" 
                      className="text-purple-400 hover:text-white underline"
                      style={{ color: "#B88AFF" }}
                    >
                      info@vhassacademy.com
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="p-8 rounded-2xl shadow-xl text-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "2px solid #B88AFF" }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#FFFFF0" }}>
              Contact Us
            </h2>
            <p className="text-lg" style={{ color: "#B88AFF" }}>
              For any questions regarding these policies, please contact us at{' '}
              <a 
                href="mailto:info@vhassacademy.com" 
                className="text-purple-400 hover:text-white underline"
                style={{ color: "#B88AFF" }}
              >
                info@vhassacademy.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
