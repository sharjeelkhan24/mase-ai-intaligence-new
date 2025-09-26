'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Shield, User, Lock, Mail, Phone, Calendar, MapPin, FileText, Building, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function PatientSignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    medications: '',
    allergies: '',
    agency: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [agencies, setAgencies] = useState<Array<{id: string, agency_name: string}>>([]);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Fetch agencies from database
  const fetchAgencies = async () => {
    try {
      setIsLoadingAgencies(true);
      const { data, error } = await supabase
        .from('agency')
        .select('id, agency_name')
        .order('agency_name', { ascending: true });

      if (error) {
        console.error('Error fetching agencies:', error);
        setAgencies([]);
      } else {
        console.log('Agencies fetched successfully:', data);
        setAgencies(data || []);
      }
    } catch (error) {
      console.error('Error in fetchAgencies:', error);
      setAgencies([]);
    } finally {
      setIsLoadingAgencies(false);
    }
  };

  // Load agencies on component mount
  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match. Please try again.');
        setIsLoading(false);
        return;
      }

      // Validate terms agreement
      if (!formData.agreeToTerms) {
        alert('Please agree to the Terms of Service and Privacy Policy.');
        setIsLoading(false);
        return;
      }

      // Find the selected agency
      const selectedAgency = agencies.find(agency => agency.id === formData.agency);
      if (!selectedAgency) {
        alert('Please select a healthcare agency.');
        setIsLoading(false);
        return;
      }

      // Prepare patient data for database insertion
      const patientData = {
        agency_id: formData.agency,
        agency_name: selectedAgency.agency_name,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        emergency_contact_name: formData.emergencyContact,
        emergency_contact_phone: formData.emergencyPhone,
        medical_conditions: formData.medicalConditions,
        medications: formData.medications,
        allergies: formData.allergies,
        password_hash: btoa(formData.password), // TODO: Replace with proper bcrypt hashing
        email_verified: false,
        account_status: 'active'
      };

      console.log('Submitting patient data:', patientData);

      // Insert patient data into Supabase
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) {
        console.error('Error creating patient account:', error);
        alert(`Error creating account: ${error.message}`);
        setIsLoading(false);
        return;
      }

      console.log('Patient account created successfully:', data);

      // Show success message
      alert('Account created successfully! You can now sign in with your credentials.');

      // Redirect to patient signin page
      window.location.href = '/patient-signin';

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Personal Information
        </h3>
        
        {/* Healthcare Agency Field */}
        <div className="mb-4">
          <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Healthcare Agency *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="agency"
              name="agency"
              required
              value={formData.agency}
              onChange={handleInputChange}
              disabled={isLoadingAgencies}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {isLoadingAgencies ? 'Loading agencies...' : 'Select your healthcare agency'}
              </option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.agency_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              First Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                placeholder="First name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Last Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                placeholder="Last name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Contact Information
        </h3>
        
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Email Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
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

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Date of Birth *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleInputChange}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black"
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Address Information Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Address Information
        </h3>
        
        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Street Address *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="address"
              name="address"
              type="text"
              required
              value={formData.address}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="123 Main Street"
            />
          </div>
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              City *
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="City"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              State *
            </label>
            <input
              id="state"
              name="state"
              type="text"
              required
              value={formData.state}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="State"
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              ZIP Code *
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              required
              value={formData.zipCode}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Emergency Contact
        </h3>
        
        {/* Emergency Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Emergency Contact Name *
            </label>
            <input
              id="emergencyContact"
              name="emergencyContact"
              type="text"
              required
              value={formData.emergencyContact}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="Emergency contact name"
            />
          </div>
          <div>
            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Emergency Contact Phone *
            </label>
            <input
              id="emergencyPhone"
              name="emergencyPhone"
              type="tel"
              required
              value={formData.emergencyPhone}
              onChange={handleInputChange}
              className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="(555) 987-6543"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Medical Information Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Medical Information
        </h3>
        
        {/* Medical Conditions */}
        <div className="mb-4">
          <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Medical Conditions (Optional)
          </label>
          <textarea
            id="medicalConditions"
            name="medicalConditions"
            rows={3}
            value={formData.medicalConditions}
            onChange={handleInputChange}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
            placeholder="List any medical conditions you have..."
          />
        </div>

        {/* Medications */}
        <div className="mb-4">
          <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Current Medications (Optional)
          </label>
          <textarea
            id="medications"
            name="medications"
            rows={3}
            value={formData.medications}
            onChange={handleInputChange}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
            placeholder="List any medications you are currently taking..."
          />
        </div>

        {/* Allergies */}
        <div>
          <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Allergies (Optional)
          </label>
          <textarea
            id="allergies"
            name="allergies"
            rows={3}
            value={formData.allergies}
            onChange={handleInputChange}
            className="block w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
            placeholder="List any allergies you have..."
          />
        </div>
      </div>

      {/* Account Security Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Account Security
        </h3>
        
        {/* Password */}
        <div className="mb-4">
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
              placeholder="Create a password"
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

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Confirm Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
              placeholder="Confirm your password"
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
        </div>
      </div>

      {/* Legal Agreements Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-adlam-display)] mb-4">
          Legal Agreements
        </h3>
        
        {/* Terms Agreement */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="text-gray-700 font-[family-name:var(--font-adlam-display)]">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
              {' '}*
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Sign Up Form */}
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
              Create Account
            </h1>
            <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
              Join our patient portal to manage your health
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
              {currentStep === 2 && 'Step 2: Address & Contact'}
              {currentStep === 3 && 'Step 3: Medical Information & Security'}
            </h2>
            <p className="text-gray-600 text-sm font-[family-name:var(--font-adlam-display)]">
              {currentStep === 1 && 'Please provide your agency and contact details'}
              {currentStep === 2 && 'Enter your address and emergency contact information'}
              {currentStep === 3 && 'Complete your medical information and account security'}
            </p>
          </div>

          {/* Form Content */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all duration-200 font-[family-name:var(--font-adlam-display)] flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>
              )}
              
              <div className="flex-1" />
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 text-white font-bold rounded-xl transition-all duration-200 font-[family-name:var(--font-adlam-display)] flex items-center gap-2 hover:shadow-lg hover:scale-105"
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #96B7C6, #7AA4B6, #5E91A6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)';
                  }}
                >
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.agreeToTerms}
                  className="px-8 py-3 text-white font-bold rounded-xl transition-all duration-200 font-[family-name:var(--font-adlam-display)] flex items-center gap-2 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ 
                    backgroundImage: (isLoading || !formData.agreeToTerms) 
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
                    e.currentTarget.style.backgroundImage = (isLoading || !formData.agreeToTerms) 
                      ? 'linear-gradient(to right, #D1D5DB, #9CA3AF, #6B7280)'
                      : 'linear-gradient(to right, #A7C8D7, #8BB5C7, #6FA2B7)';
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
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
              Already have an account?{' '}
              <Link
                href="/patient-signin"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
