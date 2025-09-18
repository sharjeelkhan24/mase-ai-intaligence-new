'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Building, Stethoscope, Users, Heart, Shield, CheckCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function SignIn() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
    setError(null);
  };

  // Handle sign-in for agencies
  const handleAgencySignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check if agency exists in database
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('*')
        .eq('email', email)
        .single();

      if (agencyError || !agencyData) {
        setError('Invalid email or password. Make sure you are using an agency account.');
        return;
      }

      // Verify the password
      const hashedPassword = btoa(password); // Base64 encoding - same as signup
      
      if (agencyData.password !== hashedPassword) {
        setError('Invalid email or password');
        return;
      }

      console.log('Agency authenticated successfully:', agencyData.agency_name);
      console.log('Storing agency email in localStorage:', email);
      
      // Clear any previous agency data first
      localStorage.removeItem('agencyEmail');
      
      // Store new agency email in localStorage for context
      localStorage.setItem('agencyEmail', email);
      
      // Verify it was stored
      console.log('Stored email verification:', localStorage.getItem('agencyEmail'));
      
      // Force a page reload to clear any cached context data
      console.log('Redirecting to dashboard and forcing refresh...');
      
      // Use replace instead of push to prevent back navigation issues
      router.replace('/agency-dashboard');
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign-in for staff
  const handleStaffSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check if this email exists in agency table (wrong tab)
      const { data: agencyData } = await supabase
        .from('agency')
        .select('email')
        .eq('email', email)
        .single();

      if (agencyData) {
        setError('This is an agency account. Please use the Agency tab to sign in.');
        return;
      }

      // For now, staff sign-in is not implemented
      setError('Staff sign-in is not yet implemented. Please contact your administrator.');
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign-in for doctors
  const handleDoctorSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Check if this email exists in agency table (wrong tab)
      const { data: agencyData } = await supabase
        .from('agency')
        .select('email')
        .eq('email', email)
        .single();

      if (agencyData) {
        setError('This is an agency account. Please use the Agency tab to sign in.');
        return;
      }

      // For now, doctor sign-in is not implemented
      setError('Doctor sign-in is not yet implemented. Please contact your administrator.');
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'staff':
        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-6">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
                Staff Access
              </h2>
              <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)]">
                Healthcare staff, nurses, and providers
              </p>
            </div>
            
            <form onSubmit={handleStaffSignIn} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-sm text-gray-900 placeholder-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Sign In as Staff
                  </>
                )}
              </button>
            </form>
          </div>
        );
      
      case 'agency':
        return (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 mb-6">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <Building className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
                Agency Access
              </h2>
              <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)]">
                Healthcare agencies and administrators
              </p>
            </div>
            
            <form onSubmit={handleAgencySignIn} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agency@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-sm text-gray-900 placeholder-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Building size={16} />
                    Sign In as Agency
                  </>
                )}
              </button>
            </form>
          </div>
        );
      
      case 'doctor':
        return (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 mb-6">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-3">
                <Stethoscope className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
                Doctor Access
              </h2>
              <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)]">
                Physicians and medical professionals
              </p>
            </div>
            
            <form onSubmit={handleDoctorSignIn} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-sm text-gray-900 placeholder-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Stethoscope size={16} />
                    Sign In as Doctor
                  </>
                )}
              </button>
            </form>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-8 font-[family-name:var(--font-adlam-display)]"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Sign In Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <Image 
                  src="/images/signin/logo2.png" 
                  alt="MASE AI Shield" 
                  width={128}
                  height={64}
                  className="w-32 h-16 object-contain"
                />
            </div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-adlam-display)] mb-2 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)' }}>
              MASE AI Login
            </h1>
            <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
              Access your healthcare intelligence platform
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="bg-gray-100 rounded-2xl p-1 flex mb-6">
            <button 
              onClick={() => handleTabChange('staff')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'staff' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={16} />
              Staff
            </button>
            <button 
              onClick={() => handleTabChange('agency')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'agency' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building size={16} />
              Agency
            </button>
            <button 
              onClick={() => handleTabChange('doctor')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2 transition-all duration-200 ${
                activeTab === 'doctor' 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Stethoscope size={16} />
              Doctor
            </button>
          </div>

          {/* Dynamic Form Content */}
          {renderForm()}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 font-[family-name:var(--font-adlam-display)] text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Additional Access Options */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2 border border-gray-200">
              <Heart size={16} />
              Patient Portal
            </button>
            <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200 font-[family-name:var(--font-adlam-display)] flex items-center justify-center gap-2 border border-gray-200">
              <Shield size={16} />
              Admin Access
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <Link href="/forgot-password" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-[family-name:var(--font-adlam-display)] justify-center">
              <Lock size={16} />
              Forgot Password?
            </Link>
            <p className="text-gray-500 text-sm font-[family-name:var(--font-adlam-display)]">
              Need help with your account?
            </p>
            <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)]">
              Contact Support: (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}