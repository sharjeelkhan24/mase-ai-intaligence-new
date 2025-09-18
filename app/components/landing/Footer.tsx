import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer 
      className="w-full py-20"
      style={{ backgroundColor: '#0C6086' }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Shield Image at Top Center */}
        <div className="flex justify-center mb-16 -mt-36 relative z-50">
          <Image
            src="/images/landing/shield.png"
            alt="MASE AI Shield"
            width={128}
            height={128}
            className="w-32 h-32 object-contain"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/landing/logo.png"
                alt="MASE AI Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
              <div>
                <div className="text-white font-bold text-xl font-[family-name:var(--font-adlam-display)]">
                  MASE AI
                </div>
                <div className="text-white/80 text-sm font-[family-name:var(--font-albert-sans)]">
                  Neural Healthcare Hub
                </div>
              </div>
            </div>
            <p className="text-white/70 text-sm font-[family-name:var(--font-albert-sans)] leading-relaxed">
              Revolutionizing healthcare operations with AI-powered solutions for better patient outcomes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg font-[family-name:var(--font-adlam-display)]">
              Quick Links
            </h3>
            <div className="space-y-2">
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                About Us
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Features
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Services
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Pricing
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg font-[family-name:var(--font-adlam-display)]">
              Support
            </h3>
            <div className="space-y-2">
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Help Center
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Documentation
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Contact Us
              </a>
              <a href="#" className="block text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg font-[family-name:var(--font-adlam-display)]">
              Contact
            </h3>
            <div className="space-y-2">
              <p className="text-white/70 text-sm font-[family-name:var(--font-albert-sans)]">
                support@maseai.com
              </p>
              <p className="text-white/70 text-sm font-[family-name:var(--font-albert-sans)]">
                1-800-MASE-AI
              </p>
              <p className="text-white/70 text-sm font-[family-name:var(--font-albert-sans)]">
                Available 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-sm font-[family-name:var(--font-albert-sans)]">
              © 2024 MASE AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Terms of Service
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm font-[family-name:var(--font-albert-sans)]">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
