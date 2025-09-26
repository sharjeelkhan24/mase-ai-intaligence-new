'use client';

import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Shield, User, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function PatientSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        alert('Please enter both email and password.');
        setIsLoading(false);
        return;
      }

      console.log('Attempting to sign in patient:', formData.email);

      // Search across all agency-specific patient tables
      // First, get all agencies and their patient table names
      const { data: agencies, error: agenciesError } = await supabase
        .from('agency')
        .select('agency_name, patients_table_name')
        .not('patients_table_name', 'is', null);

      if (agenciesError || !agencies || agencies.length === 0) {
        alert('No agency patient tables found. Please contact support.');
        setIsLoading(false);
        return;
      }

      let patientData = null;
      let foundAgency = null;

      // Search through each agency's patient table
      for (const agency of agencies) {
        if (!agency.patients_table_name) continue;
        
        const { data: patientResult, error: patientError } = await supabase
          .from(agency.patients_table_name)
          .select('*')
          .eq('email', formData.email)
          .single();

        console.log(`Searching in ${agency.patients_table_name} for ${formData.email}:`, { patientResult, patientError });

        if (!patientError && patientResult) {
          patientData = patientResult;
          foundAgency = agency.agency_name;
          break;
        }
      }

      if (!patientData || !foundAgency) {
        alert('Invalid email or password. Please check your credentials and try again.');
        setIsLoading(false);
        return;
      }

      console.log('Patient found:', patientData);
      console.log('Patient agency:', foundAgency);

      // Verify password (using btoa for now, TODO: implement proper bcrypt comparison)
      const hashedPassword = btoa(formData.password);
      console.log('Password verification:', {
        inputPassword: formData.password,
        hashedInputPassword: hashedPassword,
        storedPasswordHash: patientData.password_hash,
        passwordsMatch: patientData.password_hash === hashedPassword
      });
      
      if (patientData.password_hash !== hashedPassword) {
        alert('Invalid email or password. Please check your credentials and try again.');
        setIsLoading(false);
        return;
      }

      console.log('Password verified successfully');

      // Update last login timestamp in the correct agency-specific table
      const { data: agencyData } = await supabase
        .from('agency')
        .select('patients_table_name')
        .eq('agency_name', foundAgency)
        .single();

      if (agencyData?.patients_table_name) {
        const { error: updateError } = await supabase
          .from(agencyData.patients_table_name)
          .update({ 
            status: 'online',
            last_login: new Date().toISOString(),
            last_logout: null  // Clear logout time when logging in
          })
          .eq('id', patientData.id);

        if (updateError) {
          console.error('Error updating patient login status:', updateError);
          // Don't fail the login, just log the error
        } else {
          console.log('Patient status updated to online');
        }
      }

      // Store complete patient data in localStorage for session management
      localStorage.setItem('patientData', JSON.stringify({
        id: patientData.id,
        email: patientData.email,
        first_name: patientData.first_name,
        last_name: patientData.last_name,
        phone: patientData.phone,
        date_of_birth: patientData.date_of_birth,
        gender: patientData.gender,
        address: patientData.address,
        city: patientData.city,
        state: patientData.state,
        zip_code: patientData.zip_code,
        emergency_contact_name: patientData.emergency_contact_name,
        emergency_contact_phone: patientData.emergency_contact_phone,
        medical_conditions: patientData.medical_conditions,
        medications: patientData.medications,
        allergies: patientData.allergies,
        agency_name: patientData.agency_name,
        profile_image: patientData.profile_image,
        signedInAt: new Date().toISOString()
      }));

      // Store essential data for authentication context
      localStorage.setItem('patientEmail', formData.email);
      localStorage.setItem('patientAgency', foundAgency);
      localStorage.setItem('patientRole', 'Patient');

      console.log('Patient signed in successfully');

      // Show success message
      alert(`Welcome back, ${patientData.first_name}! You have been signed in successfully.`);

      // Redirect to patient dashboard
      window.location.href = '/patient-dashboard';

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Sign In Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src="/images/signin/logo2.png" 
                alt="MASE AI Logo" 
                width={128}
                height={64}
                className="w-32 h-16 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-adlam-display)] mb-2 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)' }}>
              Welcome Back
            </h1>
            <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Sign in to your patient portal</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-[family-name:var(--font-adlam-display)]">
                  Remember me
                </label>
              </div>
              <Link
                href="/patient-forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium font-[family-name:var(--font-adlam-display)]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-xl text-white font-[family-name:var(--font-adlam-display)] hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              style={{ 
                backgroundImage: isLoading 
                  ? 'linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)'
                  : 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #96B7C6, #7AA4B6, #5E91A6)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = isLoading 
                  ? 'linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)'
                  : 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)';
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </button>
          </form>


          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
              Don't have an account?{' '}
              <Link
                href="/patient-signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
