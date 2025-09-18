'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Building, User, Mail, Lock, Phone, MapPin, Hash, ArrowRight, Eye, EyeOff, Users, Shield, CreditCard, BarChart3, Check } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export default function SignUp() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Validation states
  const [licenseNumberValid, setLicenseNumberValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [isCheckingLicense, setIsCheckingLicense] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  
  // Step 1 form state variables
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Step 3 state variables
  const [staffCount, setStaffCount] = useState('');
  const [patientCount, setPatientCount] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptHIPAA, setAcceptHIPAA] = useState(false);


  // Validation functions
  const validateLicenseNumber = (value: string) => {
    // Only allow numbers and dashes
    return /^[0-9-]*$/.test(value);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    // Allow numbers, spaces, parentheses, and dashes
    return /^[0-9\s\(\)\-]*$/.test(phone);
  };

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Calculate score
    if (requirements.length) score += 1;
    if (requirements.lowercase) score += 1;
    if (requirements.uppercase) score += 1;
    if (requirements.number) score += 1;
    if (requirements.special) score += 1;

    return { score, requirements };
  };

  const isPasswordStrong = (password: string) => {
    const { score, requirements } = getPasswordStrength(password);
    return score >= 4 && requirements.length; // At least 4 criteria met and minimum length
  };

  const getPasswordStrengthText = (password: string) => {
    const { score } = getPasswordStrength(password);
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    if (score === 4) return 'Strong';
    if (score === 5) return 'Very Strong';
    return 'Very Weak';
  };

  const getPasswordStrengthColor = (password: string) => {
    const { score } = getPasswordStrength(password);
    if (score <= 1) return 'text-red-500';
    if (score === 2) return 'text-orange-500';
    if (score === 3) return 'text-yellow-500';
    if (score === 4) return 'text-green-500';
    if (score === 5) return 'text-green-600';
    return 'text-red-500';
  };

  // Step validation functions
  const isStep1Valid = () => {
    return (
      agencyName.trim() !== '' &&
      licenseNumber.trim() !== '' &&
      contactName.trim() !== '' &&
      emailAddress.trim() !== '' &&
      validateEmail(emailAddress) &&
      phoneNumber.trim() !== '' &&
      password.trim() !== '' &&
      isPasswordStrong(password) &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      address.trim() !== '' &&
      city.trim() !== '' &&
      state.trim() !== '' &&
      zipCode.trim() !== '' &&
      licenseNumberValid !== false &&
      emailValid !== false
    );
  };

  const isStep2Valid = () => {
    return selectedPlans.length > 0;
  };

  const isStep3Valid = () => {
    return (
      staffCount.trim() !== '' &&
      patientCount.trim() !== '' &&
      acceptTerms &&
      acceptHIPAA
    );
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      default:
        return false;
    }
  };

  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validateLicenseNumber(value)) {
      setLicenseNumber(value);
      // Reset validation state when user starts typing
      setLicenseNumberValid(null);
      // Check for duplicates after a delay
      debouncedCheckLicense(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailAddress(value);
    // Reset validation state when user starts typing
    setEmailValid(null);
    // Check for duplicates after a delay
    debouncedCheckEmail(value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (validatePhoneNumber(value)) {
      setPhoneNumber(value);
    }
  };

  const togglePlanSelection = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId) 
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  const planPrices = {
    'hr-management': 199,
    'quality-assurance': 299,
    'billing-suite': 399,
    'analytics-pro': 499
  };

  const planNames = {
    'hr-management': 'HR Management',
    'quality-assurance': 'Quality Assurance',
    'billing-suite': 'Billing Suite',
    'analytics-pro': 'Analytics Pro'
  };

  const calculateTotal = () => {
    return selectedPlans.reduce((total, planId) => total + planPrices[planId as keyof typeof planPrices], 0);
  };

  // Valid dropdown values (matching the form options)
  const validStaffCounts = ['1-10', '11-25', '26-50', '51-100', '100+'];
  const validPatientCounts = ['1-50', '51-100', '101-250', '251-500', '500+'];

  // Validate and sanitize count values
  const sanitizeStaffCount = (value: string): string => {
    if (!value || value === '') return '0';
    return validStaffCounts.includes(value) ? value : '0';
  };

  const sanitizePatientCount = (value: string): string => {
    if (!value || value === '') return '0';
    return validPatientCounts.includes(value) ? value : '0';
  };

  // Real-time duplicate checking functions
  const checkLicenseNumberDuplicate = async (licenseNumber: string) => {
    if (!licenseNumber || licenseNumber.trim() === '') {
      setLicenseNumberValid(null);
      return;
    }

    setIsCheckingLicense(true);
    try {
      const { data, error } = await supabase
        .from('agency')
        .select('license_number')
        .eq('license_number', licenseNumber.trim())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found - license number is available
        setLicenseNumberValid(true);
      } else if (data) {
        // License number already exists
        setLicenseNumberValid(false);
      }
    } catch (error) {
      console.error('Error checking license number:', error);
      setLicenseNumberValid(false);
    } finally {
      setIsCheckingLicense(false);
    }
  };

  const checkEmailDuplicate = async (email: string) => {
    if (!email || email.trim() === '' || !validateEmail(email)) {
      setEmailValid(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase
        .from('agency')
        .select('email')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found - email is available
        setEmailValid(true);
      } else if (data) {
        // Email already exists
        setEmailValid(false);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailValid(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Debounced validation functions
  const debouncedCheckLicense = debounce(checkLicenseNumberDuplicate, 500);
  const debouncedCheckEmail = debounce(checkEmailDuplicate, 500);


  // Signup handler function - Direct database save without authentication
  const handleSignup = async () => {
    if (!canProceedToNextStep()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Saving agency data directly to database...');
      
      // Hash the password (simple hash for now - in production use bcrypt)
      const hashedPassword = btoa(password); // Base64 encoding - replace with proper hashing in production

      // Save agency data directly to database
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .insert([
          {
            agency_name: agencyName,
            license_number: licenseNumber,
            contact_name: contactName,
            email: emailAddress,
            phone_number: phoneNumber,
            address: address,
            city: city,
            state: state,
            zip_code: zipCode,
            staff_count: sanitizeStaffCount(staffCount),
            patient_count: sanitizePatientCount(patientCount),
            notes: specialRequirements || null,
            password: hashedPassword,
          }
        ])
        .select()
        .single();

      if (agencyError) {
        throw agencyError;
      }

      console.log('Agency data saved successfully:', agencyData);

      // Save subscription data
      if (selectedPlans.length > 0 && agencyData) {
        const subscriptionData = selectedPlans.map(planId => ({
          agency_id: agencyData.id,
          agency_name: agencyData.agency_name,
          subscription_type: planNames[planId as keyof typeof planNames],
          total_price: planPrices[planId as keyof typeof planPrices],
          status: 'trial',
          start_period: new Date().toISOString(),
          end_period: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        const { error: subscriptionError } = await supabase
          .from('agency_subscription')
          .insert(subscriptionData);

        if (subscriptionError) {
          throw subscriptionError;
        }

        console.log('Subscription data saved successfully');
      }

      // Show success and redirect
      setSuccess(true);
      setTimeout(() => {
        router.push('/signin?message=Agency registered successfully! You can now sign in.');
      }, 2000);

    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred during registration. Please try again.';
      
      if (error.message) {
        if (error.message.includes('duplicate key value')) {
          errorMessage = 'An agency with this email or license number already exists.';
        } else if (error.message.includes('relation "agency" does not exist')) {
          errorMessage = 'Database tables not found. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Agency Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Agency Information
        </h3>
        
        {/* Agency Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Agency Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="Enter agency name"
            />
          </div>
        </div>

        {/* License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            License Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={licenseNumber}
              onChange={handleLicenseNumberChange}
              className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400 ${
                licenseNumberValid === true 
                  ? 'border-green-500 focus:ring-green-500' 
                  : licenseNumberValid === false 
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter license number (numbers and dashes only)"
            />
            {/* Validation Icon */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isCheckingLicense ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              ) : licenseNumberValid === true ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : licenseNumberValid === false ? (
                <div className="h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              ) : null}
            </div>
          </div>
          {/* License Number Validation Messages */}
          {licenseNumberValid === false && (
            <p className="mt-1 text-sm text-red-600 font-[family-name:var(--font-adlam-display)]">
              This license number is already registered
            </p>
          )}
          {licenseNumberValid === true && (
            <p className="mt-1 text-sm text-green-600 font-[family-name:var(--font-adlam-display)]">
              License number is available
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Contact Information
        </h3>
        
        {/* Contact Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Contact Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="Enter contact person name"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={emailAddress}
              onChange={handleEmailChange}
              className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400 ${
                emailAddress && !validateEmail(emailAddress) 
                  ? 'border-red-500 focus:ring-red-500' 
                  : emailValid === true 
                  ? 'border-green-500 focus:ring-green-500' 
                  : emailValid === false 
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter email address"
            />
            {/* Validation Icon */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isCheckingEmail ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              ) : emailValid === true ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : emailValid === false ? (
                <div className="h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              ) : null}
            </div>
          </div>
          {emailAddress && !validateEmail(emailAddress) && (
            <p className="mt-1 text-sm text-red-600 font-[family-name:var(--font-adlam-display)]">
              Please enter a valid email address
            </p>
          )}
          {emailValid === false && validateEmail(emailAddress) && (
            <p className="mt-1 text-sm text-red-600 font-[family-name:var(--font-adlam-display)]">
              This email address is already registered
            </p>
          )}
          {emailValid === true && (
            <p className="mt-1 text-sm text-green-600 font-[family-name:var(--font-adlam-display)]">
              Email address is available
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="Enter phone number (e.g., +1 555 123 4567)"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Account Security
        </h3>
        
        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="Create password"
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
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600 font-[family-name:var(--font-adlam-display)]">Password Strength:</span>
                <span className={`text-xs font-semibold font-[family-name:var(--font-adlam-display)] ${getPasswordStrengthColor(password)}`}>
                  {getPasswordStrengthText(password)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const { requirements } = getPasswordStrength(password);
                  return (
                    <>
                      <div className={`flex items-center gap-1 text-xs ${requirements.length ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${requirements.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        8+ chars
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${requirements.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${requirements.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        a-z
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${requirements.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${requirements.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        A-Z
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${requirements.number ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${requirements.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        0-9
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${requirements.special ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${requirements.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        !@#
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Confirm Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400 ${
                confirmPassword && password !== confirmPassword 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="mt-1 text-sm text-red-600 font-[family-name:var(--font-adlam-display)]">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Address Information
        </h3>
        
        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="Enter street address"
            />
          </div>
        </div>

        {/* City, State, ZIP Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              City *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="City"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              State *
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="State"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              ZIP Code *
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="ZIP"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Free Trial Notice */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold font-[family-name:var(--font-adlam-display)] mb-3">
            <Check size={16} />
            FREE 14-DAY TRIAL
          </div>
          <h3 className="text-lg font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
            Try All Plans Risk-Free
          </h3>
          <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)]">
            Start your 14-day free trial today! No credit card required. Cancel anytime during the trial period.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* HR Management Plan */}
        <div 
          onClick={() => togglePlanSelection('hr-management')}
          className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
            selectedPlans.includes('hr-management') 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4 relative">
              <Users className={`w-12 h-12 ${selectedPlans.includes('hr-management') ? 'text-blue-600' : 'text-gray-400'}`} />
              {selectedPlans.includes('hr-management') && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
              HR Management
            </h3>
            <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)] mb-4">
              Streamline staff scheduling, payroll, and HR processes
            </p>
            <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
              $199/month
            </div>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Staff scheduling
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Competency tracking
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Performance reviews
              </li>
            </ul>
          </div>
        </div>

        {/* Quality Assurance Plan */}
        <div 
          onClick={() => togglePlanSelection('quality-assurance')}
          className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
            selectedPlans.includes('quality-assurance') 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4 relative">
              <Shield className={`w-12 h-12 ${selectedPlans.includes('quality-assurance') ? 'text-blue-600' : 'text-gray-400'}`} />
              {selectedPlans.includes('quality-assurance') && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
              Quality Assurance
            </h3>
            <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)] mb-4">
              Ensure compliance and maintain high care standards
            </p>
            <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
              $299/month
            </div>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Automated chart QA
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Compliance monitoring
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Quality score tracking
              </li>
            </ul>
          </div>
        </div>

        {/* Billing Suite Plan */}
        <div 
          onClick={() => togglePlanSelection('billing-suite')}
          className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
            selectedPlans.includes('billing-suite') 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4 relative">
              <CreditCard className={`w-12 h-12 ${selectedPlans.includes('billing-suite') ? 'text-blue-600' : 'text-gray-400'}`} />
              {selectedPlans.includes('billing-suite') && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
              Billing Suite
            </h3>
            <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)] mb-4">
              Automated billing and financial management
            </p>
            <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
              $399/month
            </div>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Automated billing
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Claims processing
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Revenue optimization
              </li>
            </ul>
          </div>
        </div>

        {/* Analytics Pro Plan */}
        <div 
          onClick={() => togglePlanSelection('analytics-pro')}
          className={`cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
            selectedPlans.includes('analytics-pro') 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4 relative">
              <BarChart3 className={`w-12 h-12 ${selectedPlans.includes('analytics-pro') ? 'text-blue-600' : 'text-gray-400'}`} />
              {selectedPlans.includes('analytics-pro') && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Check size={14} />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-2">
              Analytics Pro
            </h3>
            <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)] mb-4">
              Advanced data insights and business intelligence
            </p>
            <div className="text-2xl font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
              $499/month
            </div>
            <ul className="text-left space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Advanced reporting
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Predictive analytics
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Business intelligence
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Total Summary */}
      {selectedPlans.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
            Selected Plans Summary
          </h3>
          <div className="space-y-3">
            {selectedPlans.map((planId) => (
              <div key={planId} className="flex justify-between items-center">
                <span className="text-gray-700 font-[family-name:var(--font-adlam-display)]">
                  {planNames[planId as keyof typeof planNames]}
                </span>
                <span className="text-gray-800 font-semibold font-[family-name:var(--font-adlam-display)]">
                  ${planPrices[planId as keyof typeof planPrices]}/month
                </span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black font-[family-name:var(--font-adlam-display)]">
                  Total Monthly Cost:
                </span>
                <span className="text-2xl font-bold text-black font-[family-name:var(--font-adlam-display)]">
                  ${calculateTotal()}/month
                </span>
              </div>
            </div>
          </div>
          
          {/* Savings Badge */}
          {selectedPlans.length > 1 && (
            <div className="mt-4 text-center">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold font-[family-name:var(--font-adlam-display)]">
                🎉 Bundle Discount Available! Save 10% on multiple plans
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Agency Information Review */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4 flex items-center gap-2">
          <Building className="h-5 w-5" />
          Agency Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Agency Name:</span>
            <p className="font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)]">{agencyName || '[Not provided]'}</p>
          </div>
          <div>
            <span className="text-gray-600 font-[family-name:var(--font-adlam-display)]">License Number:</span>
            <p className="font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)]">{licenseNumber || '[Not provided]'}</p>
          </div>
          <div>
            <span className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Contact Name:</span>
            <p className="font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)]">{contactName || '[Not provided]'}</p>
          </div>
          <div>
            <span className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Email:</span>
            <p className="font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)]">{emailAddress || '[Not provided]'}</p>
          </div>
          <div>
            <span className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Phone:</span>
            <p className="font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)]">
              {phoneNumber || '[Not provided]'}
            </p>
          </div>
          <div>
            <span className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Address:</span>
            <p className="font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)]">
              {address && city && state && zipCode 
                ? `${address}, ${city}, ${state} ${zipCode}` 
                : '[Not provided]'}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Services */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4 flex items-center gap-2">
          <Check className="h-5 w-5" />
          Selected Services
        </h3>
        {selectedPlans.length > 0 ? (
          <div className="space-y-3">
            {selectedPlans.map((planId) => (
              <div key={planId} className="flex justify-between items-center bg-white rounded-lg p-3 border">
                <span className="text-gray-700 font-[family-name:var(--font-adlam-display)]">
                  {planNames[planId as keyof typeof planNames]}
                </span>
                <span className="text-gray-800 font-semibold font-[family-name:var(--font-adlam-display)]">
                  ${planPrices[planId as keyof typeof planPrices]}/month
                </span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 bg-white rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black font-[family-name:var(--font-adlam-display)]">
                  Total Monthly Cost:
                </span>
                <span className="text-2xl font-bold text-black font-[family-name:var(--font-adlam-display)]">
                  ${calculateTotal()}/month
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">No services selected</p>
        )}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Additional Information
        </h3>
        
        {/* Approximate Staff Count */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Approximate Staff Count *
          </label>
          <select 
            value={staffCount}
            onChange={(e) => setStaffCount(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black"
          >
            <option value="">Select staff count</option>
            <option value="1-10">1-10 staff</option>
            <option value="11-25">11-25 staff</option>
            <option value="26-50">26-50 staff</option>
            <option value="51-100">51-100 staff</option>
            <option value="100+">100+ staff</option>
          </select>
        </div>

        {/* Approximate Patient Count */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Approximate Patient Count *
          </label>
          <select 
            value={patientCount}
            onChange={(e) => setPatientCount(e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black"
          >
            <option value="">Select patient count</option>
            <option value="1-50">1-50 patients</option>
            <option value="51-100">51-100 patients</option>
            <option value="101-250">101-250 patients</option>
            <option value="251-500">251-500 patients</option>
            <option value="500+">500+ patients</option>
          </select>
        </div>

        {/* Special Requirements or Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Special Requirements or Notes
          </label>
          <textarea 
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            rows={4}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
            placeholder="Please describe any special requirements, notes, or additional information..."
          />
        </div>
      </div>

      {/* Legal Agreements */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Legal Agreements
        </h3>
        
        {/* Terms of Service */}
        <div className="mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 font-[family-name:var(--font-adlam-display)]">
              I accept the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </Link>
              {' '}*
            </span>
          </label>
        </div>

        {/* HIPAA Agreement */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptHIPAA}
              onChange={(e) => setAcceptHIPAA(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700 font-[family-name:var(--font-adlam-display)]">
              I acknowledge and accept the{' '}
              <Link href="/hipaa" className="text-blue-600 hover:text-blue-800 underline">
                HIPAA Business Associate Agreement
              </Link>
              {' '}*
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Home Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-8 font-[family-name:var(--font-adlam-display)]"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Sign Up Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Logo and Header */}
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
              Create Account
            </h1>
            <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
              Join MASE AI and transform your healthcare operations
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>
                1
              </div>
              <div className={`w-16 h-1 ${currentStep > 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>
                2
              </div>
              <div className={`w-16 h-1 ${currentStep > 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} font-bold text-sm`}>
                3
              </div>
            </div>
          </div>

          {/* Step Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)]">
              {currentStep === 1 && 'Step 1: Basic Information'}
              {currentStep === 2 && 'Step 2: Choose Your Plan'}
              {currentStep === 3 && 'Step 3: Review & Confirm'}
            </h2>
            <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)]">
              {currentStep === 1 && 'Please provide your agency and contact details'}
              {currentStep === 2 && 'Select one or more subscription plans that fit your needs'}
              {currentStep === 3 && 'Review your information and complete your registration'}
            </p>
          </div>

          {/* Form Content */}
          <form className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all duration-200 font-[family-name:var(--font-adlam-display)] flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNextStep()}
                  className="px-8 py-3 text-white font-bold rounded-xl transition-all duration-200 font-[family-name:var(--font-adlam-display)] flex items-center gap-2 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ 
                    backgroundImage: canProceedToNextStep() 
                      ? 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)'
                      : 'linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #96B7C6, #7AA4B6, #5E91A6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundImage = canProceedToNextStep()
                      ? 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)'
                      : 'linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)';
                  }}
                >
                  Next Step
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={!canProceedToNextStep() || isLoading}
                  className="px-8 py-3 text-white font-bold rounded-xl transition-all duration-200 font-[family-name:var(--font-adlam-display)] flex items-center gap-2 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ 
                    backgroundImage: canProceedToNextStep() && !isLoading
                      ? 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)'
                      : 'linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #96B7C6, #7AA4B6, #5E91A6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundImage = canProceedToNextStep() && !isLoading
                      ? 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)'
                      : 'linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)';
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <Check size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
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

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
                <p className="text-green-700 font-[family-name:var(--font-adlam-display)] text-sm">
                  Account created successfully! Redirecting to sign in...
                </p>
              </div>
            </div>
          )}

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}