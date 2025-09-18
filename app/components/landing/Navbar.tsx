import React from 'react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav 
      className="fixed top-4 left-4 right-4 z-50 px-6 py-2 shadow-lg rounded-3xl"
      style={{ backgroundColor: '#A7C8D7' }}
    >
      <div className="w-full flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          {/* Logo Image */}
          <Image 
            src="/images/landing/logo.png" 
            alt="MASE AI Logo" 
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
          />
          <div className="flex flex-col">
            <div className="text-white font-bold text-2xl font-[family-name:var(--font-adlam-display)]">
              MASE AI
            </div>
            <div className="text-white text-sm opacity-80 font-[family-name:var(--font-adlam-display)]">
              Neural Healthcare Hub
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-16">
          <a 
            href="#home" 
            className="text-white hover:text-gray-200 transition-colors duration-200 font-medium font-[family-name:var(--font-adlam-display)] text-lg scroll-smooth"
          >
            Home
          </a>
          <a 
            href="#features" 
            className="text-white hover:text-gray-200 transition-colors duration-200 font-medium font-[family-name:var(--font-adlam-display)] text-lg scroll-smooth"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className="text-white hover:text-gray-200 transition-colors duration-200 font-medium font-[family-name:var(--font-adlam-display)] text-lg scroll-smooth"
          >
            Pricing
          </a>
          
          {/* Get Started Button */}
          <a 
            href="/signin"
            className="bg-white text-gray-800 px-12 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-sm font-[family-name:var(--font-adlam-display)] inline-block text-center"
          >
            Get Started!
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button className="text-white hover:text-gray-200 focus:outline-none">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
