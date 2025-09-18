import React from 'react';
import Navbar from './components/landing/Navbar';
import Footer from './components/landing/Footer';
import Image from 'next/image';
import { ArrowRight, Play, Building2, Users, BarChart3, Check, Shield, DollarSign, UserCheck, Stethoscope, Monitor, UserCog, HelpCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative w-full">
      <div 
        id="home"
        className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/landing/background.png')"
        }}
      >
        <Navbar />
        {/* Main Container - positioned based on background.png grid */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full px-6 md:px-12 lg:px-20 py-8 lg:py-0">
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 lg:gap-16 h-full items-start lg:items-center">
            {/* Left Section */}
            <div className="space-y-4 lg:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black font-[family-name:var(--font-adlam-display)] leading-tight">
                The Future of<br />Healthcare Staffing
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-black font-[family-name:var(--font-albert-sans)] pl-3 lg:pl-6 leading-relaxed">
                Revolutionize your healthcare operations with our AI-powered neural network that optimizes staffing, automates workflows, and delivers unprecedented insights into patient care management.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4 pl-3 lg:pl-6">
                <a 
                  href="/signin"
                  className="px-10 sm:px-12 lg:px-16 py-2 sm:py-2.5 lg:py-3 rounded-full font-bold text-white hover:opacity-90 transition-colors duration-200 shadow-lg font-[family-name:var(--font-adlam-display)] text-sm sm:text-base flex items-center justify-center gap-2 whitespace-nowrap"
                  style={{ backgroundColor: '#A7C8D7' }}
                >
                  Start Agency Trial
                  <ArrowRight size={16} className="sm:size-4 lg:size-5 flex-shrink-0" />
                </a>
                <button 
                  className="border-2 px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full font-bold transition-all duration-200 font-[family-name:var(--font-adlam-display)] hover:!text-white hover:bg-[#A7C8D7] text-sm sm:text-base flex items-center gap-2"
                  style={{ 
                    borderColor: '#A7C8D7', 
                    color: '#A7C8D7'
                  }}
                >
                  <Play size={16} className="sm:size-4 lg:size-5" fill="currentColor" />
                  Watch Demo
                </button>
              </div>
            </div>
            
            {/* Right Section */}
            <div className="flex items-center lg:items-end justify-center lg:justify-end h-64 lg:h-full relative">
              <Image 
                src="/images/landing/nurse.png" 
                alt="Healthcare Professional" 
                width={400}
                height={600}
                className="h-full lg:h-7/10 w-auto object-contain object-bottom lg:mr-8"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* White Background Section */}
      <div id="features" className="bg-gradient-to-br from-gray-50 to-white min-h-[800px] w-full py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="mb-10"></div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#A7C8D7] font-[family-name:var(--font-adlam-display)] mb-6 leading-tight">
              Choose Your Access Level
            </h2>
            <p className="text-gray-600 text-lg sm:text-xl font-[family-name:var(--font-albert-sans)] max-w-4xl mx-auto leading-relaxed">
            Tailored dashboards and features for every role in your healthcare organization
            </p>
          </div>
          
          {/* Service Squares Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Service Square 1 */}
            <div className="rounded-xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100" style={{ backgroundColor: '#A7C8D7' }}>
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={32} className="text-white flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-adlam-display)]">
                    Agency Portal
                  </h3>
                  <p className="text-white/90 font-[family-name:var(--font-albert-sans)] text-xs">
                    Complete healthcare management suite for agencies and facilities
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Multi-facility management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Advanced analytics & reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Subscription service management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Staff & patient oversight</span>
                </div>
              </div>
              <button className="w-full bg-white text-gray-800 py-2 px-4 rounded-full font-medium font-[family-name:var(--font-albert-sans)] text-sm hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
            
            {/* Service Square 2 */}
            <div className="rounded-xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100" style={{ backgroundColor: '#A7C8D7' }}>
              <div className="flex items-center gap-3 mb-4">
                <UserCheck size={32} className="text-white flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-adlam-display)]">
                    Staff Dashboard
                  </h3>
                  <p className="text-white/90 font-[family-name:var(--font-albert-sans)] text-xs">
                    Comprehensive tools for nurses, therapists, and healthcare staff
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Patient care management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Documentation & charting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Schedule & task management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Quality assurance tools</span>
                </div>
              </div>
              <button className="w-full bg-white text-gray-800 py-2 px-4 rounded-full font-medium font-[family-name:var(--font-albert-sans)] text-sm hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
            
            {/* Service Square 3 */}
            <div className="rounded-xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100" style={{ backgroundColor: '#A7C8D7' }}>
              <div className="flex items-center gap-3 mb-4">
                <Monitor size={32} className="text-white flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-adlam-display)]">
                    Patient Portal
                  </h3>
                  <p className="text-white/90 font-[family-name:var(--font-albert-sans)] text-xs">
                    Secure access to your healthcare information and services
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Medical records access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Appointment scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Care plan tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Communication tools</span>
                </div>
              </div>
              <button className="w-full bg-white text-gray-800 py-2 px-4 rounded-full font-medium font-[family-name:var(--font-albert-sans)] text-sm hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
            
            {/* Service Square 4 */}
            <div className="rounded-xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100" style={{ backgroundColor: '#A7C8D7' }}>
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope size={32} className="text-white flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-adlam-display)]">
                    Doctor Dashboard
                  </h3>
                  <p className="text-white/90 font-[family-name:var(--font-albert-sans)] text-xs">
                    Advanced clinical tools and patient management for physicians
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Multi-facility management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Advanced analytics & reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Subscription service management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Staff & patient oversight</span>
                </div>
              </div>
              <button className="w-full bg-white text-gray-800 py-2 px-4 rounded-full font-medium font-[family-name:var(--font-albert-sans)] text-sm hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
            
            {/* Service Square 5 */}
            <div className="rounded-xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100" style={{ backgroundColor: '#A7C8D7' }}>
              <div className="flex items-center gap-3 mb-4">
                <UserCog size={32} className="text-white flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-adlam-display)]">
                    Super Admin
                  </h3>
                  <p className="text-white/90 font-[family-name:var(--font-albert-sans)] text-xs">
                    System-wide control and subscription management
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Patient care management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Documentation & charting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Schedule & task management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Quality assurance tools</span>
                </div>
              </div>
              <button className="w-full bg-white text-gray-800 py-2 px-4 rounded-full font-medium font-[family-name:var(--font-albert-sans)] text-sm hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
            
            {/* Service Square 6 */}
            <div className="rounded-xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100" style={{ backgroundColor: '#A7C8D7' }}>
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle size={32} className="text-white flex-shrink-0" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-adlam-display)]">
                    Quick Access
                  </h3>
                  <p className="text-white/90 font-[family-name:var(--font-albert-sans)] text-xs">
                    Not sure which role? Let us help you find the right access
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Role identification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Guided setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Support assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-white" />
                  <span className="text-white/90 text-sm font-[family-name:var(--font-albert-sans)]">Demo access</span>
                </div>
              </div>
              <button className="w-full bg-white text-gray-800 py-2 px-4 rounded-full font-medium font-[family-name:var(--font-albert-sans)] text-sm hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div id="pricing" className="min-h-[900px] w-full py-20 relative overflow-hidden" style={{ backgroundColor: '#A7C8D7' }}>
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="mb-10"></div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-[family-name:var(--font-adlam-display)] mb-6 leading-tight">
              Choose Your Plan
            </h2>
            <p className="text-white/90 text-lg sm:text-xl font-[family-name:var(--font-albert-sans)] max-w-4xl mx-auto leading-relaxed">
              Unlock the power of AI-driven healthcare management with our comprehensive suite of specialized solutions
            </p>
          </div>

          {/* Subscription Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-4">
            {/* HR Management Plan */}
            <div className="group relative bg-white rounded-2xl p-10 hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                    <Users size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-[family-name:var(--font-adlam-display)]">
                    HR Management
                  </h3>
                  <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
                    $199<span className="text-base text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 text-xs font-[family-name:var(--font-albert-sans)] leading-relaxed">
                    Staff scheduling, competency tracking, and performance management
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Staff scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Competency tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Performance reviews</span>
                  </div>
                </div>
                <button className="w-full py-3 px-4 rounded-full font-bold transition-all duration-300 font-[family-name:var(--font-adlam-display)] hover:shadow-lg hover:scale-105 bg-white border-2 text-[#A7C8D7] hover:bg-[#A7C8D7] hover:text-white" style={{ borderColor: '#A7C8D7' }}>
                  Free Trial
                </button>
              </div>
            </div>

            {/* Quality Assurance Plan */}
            <div className="group relative bg-white rounded-2xl p-10 hover:shadow-2xl hover:scale-110 transition-all duration-500 border-2 backdrop-blur-sm transform scale-105" style={{ borderColor: '#A7C8D7' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl opacity-70"></div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center gap-2 text-[#A7C8D7] text-sm font-bold px-6 py-2 rounded-full font-[family-name:var(--font-albert-sans)] shadow-lg bg-white border-2" style={{ borderColor: '#A7C8D7' }}>
                  <span>⭐</span>
                  <span>Popular</span>
                </div>
              </div>
              <div className="relative z-10 pt-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                    <Shield size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Quality Assurance
                  </h3>
                  <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
                    $299<span className="text-base text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 text-xs font-[family-name:var(--font-albert-sans)] leading-relaxed">
                    AI-powered chart reviews, compliance monitoring, and quality metrics
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Automated chart QA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Compliance monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Quality score tracking</span>
                  </div>
                </div>
                <button className="w-full py-3 px-4 rounded-full font-bold text-white transition-all duration-300 font-[family-name:var(--font-adlam-display)] hover:shadow-lg hover:scale-105 shadow-md" style={{ backgroundColor: '#A7C8D7' }}>
                  Free Trial
                </button>
              </div>
            </div>

            {/* Billing Suite Plan */}
            <div className="group relative bg-white rounded-2xl p-10 hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Billing Suite
                  </h3>
                  <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
                    $399<span className="text-base text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 text-xs font-[family-name:var(--font-albert-sans)] leading-relaxed">
                    Automated billing, claims processing, and revenue optimization
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Automated billing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Claims processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Revenue optimization</span>
                  </div>
                </div>
                <button className="w-full py-3 px-4 rounded-full font-bold transition-all duration-300 font-[family-name:var(--font-adlam-display)] hover:shadow-lg hover:scale-105 border-2 text-[#A7C8D7] hover:bg-[#A7C8D7] hover:text-white" style={{ borderColor: '#A7C8D7' }}>
                  Free Trial
                </button>
              </div>
            </div>

            {/* Analytics Pro Plan */}
            <div className="group relative bg-white rounded-2xl p-10 hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-50"></div>
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Analytics Pro
                  </h3>
                  <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
                    $499<span className="text-base text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 text-xs font-[family-name:var(--font-albert-sans)] leading-relaxed">
                    Advanced reporting, predictive analytics, and business intelligence
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Advanced reporting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Predictive analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A7C8D7' }}>
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm font-[family-name:var(--font-albert-sans)]">Business intelligence</span>
                  </div>
                </div>
                <button className="w-full py-3 px-4 rounded-full font-bold transition-all duration-300 font-[family-name:var(--font-adlam-display)] hover:shadow-lg hover:scale-105 border-2 text-[#A7C8D7] hover:bg-[#A7C8D7] hover:text-white" style={{ borderColor: '#A7C8D7' }}>
                  Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Section with background2.png */}
      <div 
        className="relative w-full h-[70vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/landing/background2.png')"
        }}
      >
        {/* Main Container */}
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Section (50%) */}
          <div className="lg:col-span-6 flex items-end justify-end pt-6 px-6 lg:pt-12 lg:px-12">
            <div className="w-full h-full flex items-end justify-end">
              <Image
                src="/images/landing/nurse2.png"
                alt="Healthcare Professional"
                width={400}
                height={600}
                className="max-h-[60vh] w-auto object-contain object-bottom"
              />
            </div>
          </div>

          {/* Right Section (50%) */}
          <div className="lg:col-span-6 flex flex-col justify-center items-start p-6 lg:p-12 pl-0 lg:pl-0">
            <div className="space-y-4 lg:space-y-6 text-center -ml-6 lg:-ml-12">
              {/* Header */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black font-[family-name:var(--font-adlam-display)] leading-tight">
              Transform Your <br />Healthcare Operations
              </h1>
              
              {/* Subheading */}
              <p className="text-sm sm:text-base lg:text-lg text-black font-[family-name:var(--font-albert-sans)] leading-relaxed max-w-2xl mx-auto">
              Join thousands of healthcare organizations already using our AI-powered platform to optimize their workforce and improve patient outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
