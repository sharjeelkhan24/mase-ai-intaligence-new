'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Plus,
  Calendar,
  MapPin,
  Phone,
  X,
  Mail,
  Key
} from 'lucide-react';
import NurseManagerNavbar from '@/app/components/nurse-manager-dashboard/NurseManagerNavbar';
import { useStaffData } from '@/lib/hooks/useStaffData';
import { supabase } from '@/lib/supabase/client';

export default function PatientCarePage() {
  const activeTab = 'patient-care';
  const { staffData, isLoading } = useStaffData();
  
  // Patient form state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalRecordNumber: '',
    primaryNurse: '',
    admissionDate: '',
    dischargeDate: '',
    notes: '',
    password: ''
  });

  // Patients data state
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  
  // Staff nurses data state
  const [availableNurses, setAvailableNurses] = useState<any[]>([]);
  const [isLoadingNurses, setIsLoadingNurses] = useState(false);

  // Load available nurses (Staff Nurses and Nurse Managers) from database
  const loadAvailableNurses = async () => {
    if (!staffData?.agency_name) {
      console.log('Staff data or agency name not loaded yet, skipping nurses data load');
      return;
    }

    try {
      setIsLoadingNurses(true);
      console.log('🔍 Loading available nurses for agency:', staffData.agency_name);
      
      // First, get the staff table name for this agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('staff_table_name')
        .eq('agency_name', staffData.agency_name)
        .single();

      console.log('📋 Agency data query result:', { agencyData, agencyError });

      if (agencyError || !agencyData?.staff_table_name) {
        console.error('❌ Error fetching agency data or staff table name:', agencyError);
        return;
      }

      console.log('✅ Using staff table:', agencyData.staff_table_name);
      
      // First, let's check what staff members exist in the table
      const { data: allStaff, error: allStaffError } = await supabase
        .from(agencyData.staff_table_name)
        .select('id, first_name, last_name, role, email, status')
        .order('first_name');

      console.log('👥 All staff in table:', { allStaff, allStaffError });
      
      // Load staff nurses and nurse managers
      const { data, error } = await supabase
        .from(agencyData.staff_table_name)
        .select('id, first_name, last_name, role, email')
        .in('role', ['Staff Nurse', 'Nurse Manager'])
        .in('status', ['active', 'online'])
        .order('first_name');

      console.log('🏥 Nurses query result:', { data, error });
      console.log('🔍 Query details:', {
        table: agencyData.staff_table_name,
        roles: ['Staff Nurse', 'Nurse Manager'],
        status: ['active', 'online']
      });

      if (error) {
        console.error('❌ Error loading nurses data:', error);
        return;
      }

      console.log('✅ Available nurses loaded:', data);
      setAvailableNurses(data || []);
      
    } catch (error) {
      console.error('❌ Error loading nurses data:', error);
    } finally {
      setIsLoadingNurses(false);
    }
  };

  // Load patients data from database
  const loadPatientsData = async () => {
    if (!staffData?.agency_name) {
      console.log('Staff data or agency name not loaded yet, skipping patients data load');
      return;
    }

    try {
      console.log('Loading patients data for agency:', staffData.agency_name);
      
      // First, get the patients table name for this agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('patients_table_name')
        .eq('agency_name', staffData.agency_name)
        .single();

      if (agencyError || !agencyData?.patients_table_name) {
        console.error('Error fetching agency data or patients table name:', agencyError);
        return;
      }

      console.log('Using patients table:', agencyData.patients_table_name);
      
      const { data, error } = await supabase
        .from(agencyData.patients_table_name)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading patients data:', error);
        return;
      }

      console.log('Patients data loaded from database:', data);

      // Transform database data to match UI expectations
      const transformedPatients = data.map(patient => ({
        ...patient,
        firstName: patient.first_name,
        lastName: patient.last_name,
        location: `${patient.city || ''}, ${patient.state || ''}`.trim().replace(/^,|,$/, ''),
        role: 'Patient',
        department: 'Patient Care',
        shift: 'N/A',
        certifications: []
      }));

      setPatients(transformedPatients);
      console.log('Patients state updated with', transformedPatients.length, 'patients');
      
    } catch (error) {
      console.error('Error loading patients data:', error);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Load patients data and available nurses when staff data is loaded
  useEffect(() => {
    if (staffData?.agency_name && !isLoading) {
      loadPatientsData();
      loadAvailableNurses();
    }
  }, [staffData?.agency_name, isLoading]);

  // Handle patient form changes
  const handlePatientFormChange = (field: string, value: string) => {
    setPatientForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle patient form submission
  const handleSubmitPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if staff data is loaded
    if (isLoading) {
      console.error('Staff data still loading. Please wait and try again.');
      alert('Staff data is still loading. Please wait a moment and try again.');
      return;
    }
    
    if (!staffData || !staffData.agency_name) {
      console.error('No staff data available. Please try again.');
      alert('Error: Staff information not loaded. Please refresh the page and try again.');
      return;
    }
    
    try {
      // Get the patients table name for this agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('patients_table_name')
        .eq('agency_name', staffData.agency_name)
        .single();

      if (agencyError || !agencyData?.patients_table_name) {
        throw new Error(`Agency patients table not found. Please contact support.`);
      }
      
      // Prepare data for database insertion
      const insertData = {
        agency_name: staffData.agency_name,
        first_name: patientForm.firstName,
        last_name: patientForm.lastName,
        email: patientForm.email,
        phone: patientForm.phone,
        address: patientForm.address,
        city: patientForm.city,
        state: patientForm.state,
        zip_code: patientForm.zipCode,
        emergency_contact_name: patientForm.emergencyContactName,
        emergency_contact_phone: patientForm.emergencyContactPhone,
        notes: patientForm.notes,
        password_hash: btoa(patientForm.password), // Simple encoding - use bcrypt in production
        status: 'active',
        date_of_birth: patientForm.dateOfBirth,
        medical_record_number: patientForm.medicalRecordNumber || `MRN-${Date.now()}`,
        primary_physician: 'TBD',
        primary_nurse: patientForm.primaryNurse || 'TBD',
        admission_date: patientForm.admissionDate || new Date().toISOString().split('T')[0],
        discharge_date: patientForm.dischargeDate || null
      };

      console.log(`Inserting patient data into agency-specific table:`, agencyData.patients_table_name, { ...insertData, password_hash: '[REDACTED]' });

      // Insert into appropriate agency-specific Supabase table
      const { data: result, error } = await supabase
        .from(agencyData.patients_table_name)
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error adding patient: ${error.message}`);
        return;
      }

      console.log(`Patient added to database:`, result);

      // Add to local state for immediate UI update
      const newPatient = {
        ...result,
        firstName: result.first_name,
        lastName: result.last_name,
        location: `${result.city}, ${result.state}`,
        role: 'Patient',
        department: 'Patient Care',
        shift: 'N/A',
        certifications: []
      };

      setPatients(prevPatients => [...prevPatients, newPatient]);
      
      // Show success message
      alert(`Patient ${result.first_name} ${result.last_name} has been added successfully to ${staffData.agency_name}'s patients table!`);

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An unexpected error occurred. Please try again.');
      return;
    }
    
    // Reset form and close modal
    setPatientForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      medicalRecordNumber: '',
      primaryNurse: '',
      admissionDate: '',
      dischargeDate: '',
      notes: '',
      password: ''
    });
    setShowAddPatientModal(false);
  };

  const careStats = [
    { metric: 'Total Patients', value: patients.length.toString(), change: '+5', color: 'text-blue-600' },
    { metric: 'Critical Patients', value: '12', change: '+2', color: 'text-red-600' },
    { metric: 'Discharges Today', value: '8', change: '+1', color: 'text-green-600' },
    { metric: 'Average Stay', value: '4.2 days', change: '-0.3', color: 'text-purple-600' }
  ];


  const carePlans = [
    { id: 1, patient: 'John Smith', plan: 'Respiratory Care Plan', status: 'active', lastUpdated: '2024-01-15', nextReview: '2024-01-18' },
    { id: 2, patient: 'Mary Johnson', plan: 'Cardiac Monitoring Plan', status: 'active', lastUpdated: '2024-01-14', nextReview: '2024-01-17' },
    { id: 3, patient: 'Robert Davis', plan: 'Mobility and Pain Management', status: 'active', lastUpdated: '2024-01-13', nextReview: '2024-01-16' },
    { id: 4, patient: 'Lisa Wilson', plan: 'Blood Sugar Management', status: 'active', lastUpdated: '2024-01-12', nextReview: '2024-01-15' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NurseManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Patient Care</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Monitor and manage patient care</p>
            </div>
            <button 
              onClick={() => setShowAddPatientModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Patient
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {careStats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">{stat.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${stat.color}`}>{stat.change}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Patient Overview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {isLoadingPatients ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="ml-3 text-gray-500 font-[family-name:var(--font-adlam-display)]">Loading patients...</p>
                    </div>
                  ) : patients.length > 0 ? (
                    patients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-pink-600">
                                {patient.firstName[0]}{patient.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                              {patient.firstName} {patient.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              MRN: {patient.medical_record_number || 'N/A'} • {patient.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              Nurse: {patient.primary_nurse || 'TBD'} • Admitted: {patient.admission_date ? new Date(patient.admission_date).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {patient.status || 'Active'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)] mb-2">
                        No patients found
                      </h3>
                      <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)] mb-4">
                        Get started by adding your first patient.
                      </p>
                      <button 
                        onClick={() => setShowAddPatientModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto font-[family-name:var(--font-adlam-display)]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Patient</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Care Plans</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {carePlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Heart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{plan.patient}</h4>
                          <p className="text-sm text-gray-500">{plan.plan}</p>
                          <p className="text-xs text-gray-400">Last updated: {new Date(plan.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {plan.status}
                        </span>
                        <p className="text-sm text-gray-500">Next review: {new Date(plan.nextReview).toLocaleDateString()}</p>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Add New Patient
                </h2>
                <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                  Complete the form below to add a new patient to <span className="font-semibold text-blue-600">
                    {isLoading ? 'Loading...' : staffData?.agency_name || 'Unknown Agency'}
                  </span>
                </p>
                {!isLoading && (!staffData || !staffData.agency_name) && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs text-red-600 font-[family-name:var(--font-adlam-display)]">
                      ⚠️ Staff information not loaded. Please refresh the page or log in again.
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitPatient} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Personal Information Section */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                    <Heart className="w-5 h-5 mr-2 text-pink-600" />
                    Personal Information
                  </h3>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.firstName}
                    onChange={(e) => handlePatientFormChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.lastName}
                    onChange={(e) => handlePatientFormChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={patientForm.email}
                    onChange={(e) => handlePatientFormChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientForm.phone}
                    onChange={(e) => handlePatientFormChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={patientForm.dateOfBirth}
                    onChange={(e) => handlePatientFormChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  />
                </div>

                {/* Medical Record Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Medical Record Number
                  </label>
                  <input
                    type="text"
                    value={patientForm.medicalRecordNumber}
                    onChange={(e) => handlePatientFormChange('medicalRecordNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter MRN (auto-generated if empty)"
                  />
                </div>

                {/* Address Information Section */}
                <div className="lg:col-span-2 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                    <MapPin className="w-5 h-5 mr-2 text-pink-600" />
                    Address Information
                  </h3>
                </div>

                {/* Address */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={patientForm.address}
                    onChange={(e) => handlePatientFormChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter street address"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    City
                  </label>
                  <input
                    type="text"
                    value={patientForm.city}
                    onChange={(e) => handlePatientFormChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter city"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    State
                  </label>
                  <input
                    type="text"
                    value={patientForm.state}
                    onChange={(e) => handlePatientFormChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter state"
                  />
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={patientForm.zipCode}
                    onChange={(e) => handlePatientFormChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter ZIP code"
                  />
                </div>

                {/* Emergency Contact Section */}
                <div className="lg:col-span-2 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                    <Phone className="w-5 h-5 mr-2 text-pink-600" />
                    Emergency Contact (Required)
                  </h3>
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientForm.emergencyContactName}
                    onChange={(e) => handlePatientFormChange('emergencyContactName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter emergency contact name"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientForm.emergencyContactPhone}
                    onChange={(e) => handlePatientFormChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter emergency contact phone"
                  />
                </div>

                {/* Medical Information Section */}
                <div className="lg:col-span-2 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                    <Activity className="w-5 h-5 mr-2 text-pink-600" />
                    Medical Information
                  </h3>
                </div>

                {/* Primary Nurse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Primary Nurse
                  </label>
                  <select
                    value={patientForm.primaryNurse}
                    onChange={(e) => handlePatientFormChange('primaryNurse', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    disabled={isLoadingNurses}
                  >
                    <option value="">Select a nurse</option>
                    {availableNurses.map((nurse) => (
                      <option key={nurse.id} value={`${nurse.first_name} ${nurse.last_name}`}>
                        {nurse.first_name} {nurse.last_name} ({nurse.role})
                      </option>
                    ))}
                  </select>
                  {isLoadingNurses && (
                    <p className="mt-1 text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                      Loading available nurses...
                    </p>
                  )}
                  {!isLoadingNurses && availableNurses.length === 0 && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                        No nurses available. Please add staff nurses or nurse managers first.
                      </p>
                      <button
                        type="button"
                        onClick={loadAvailableNurses}
                        className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-[family-name:var(--font-adlam-display)]"
                      >
                        🔄 Retry loading nurses
                      </button>
                    </div>
                  )}
                </div>

                {/* Admission Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    value={patientForm.admissionDate}
                    onChange={(e) => handlePatientFormChange('admissionDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  />
                </div>

                {/* Discharge Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Discharge Date
                  </label>
                  <input
                    type="date"
                    value={patientForm.dischargeDate}
                    onChange={(e) => handlePatientFormChange('dischargeDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  />
                </div>

                {/* Notes */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Additional Notes
                  </label>
                  <textarea
                    value={patientForm.notes}
                    onChange={(e) => handlePatientFormChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter any additional notes or comments"
                  />
                </div>

                {/* Security Information Section */}
                <div className="lg:col-span-2 mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                    <Key className="w-5 h-5 mr-2 text-pink-600" />
                    Security Information
                  </h3>
                </div>

                {/* Password */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={patientForm.password}
                    onChange={(e) => handlePatientFormChange('password', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter a secure password for patient portal access"
                  />
                  <p className="mt-1 text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    This password will be used for patient portal login. Minimum 8 characters recommended.
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Patient</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
