'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, MoreHorizontal, UserCheck, UserX, Mail, Phone, MapPin, X, Calendar, Building, FileText, Star, Key, Heart } from 'lucide-react';
import AdminNavbar from '@/app/components/admin-dashboard/AdminNavbar';
import SubscriptionGuard from '@/app/components/admin-dashboard/SubscriptionGuard';
import { useAgencyAuth } from '@/lib/contexts/AgencyAuthContext';
import { supabase } from '@/lib/supabase/client';
import { getUserStatusWithTime } from '@/lib/utils/statusUtils';

export default function HRManagement() {
  const { agency, isLoading } = useAgencyAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    hireDate: '',
    salary: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    licenseNumber: '',
    licenseExpiry: '',
    certifications: '',
    notes: '',
    password: '',
    // Patient-specific fields
    dateOfBirth: '',
    admissionDate: '',
    dischargeDate: '',
    medicalRecordNumber: '',
    primaryNurse: ''
  });

  // Staff data - will be loaded from database and updated when new staff is added
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  
  // Patients data - will be loaded from database and updated when new patients are added
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  const departments = ['all', 'Emergency', 'ICU', 'Surgery', 'Pediatrics', 'Medical/Surgical'];
  
  // Staff roles as specified by the user
  const staffRoles = [
    'Patient',
    'Staff Nurse',
    'Nurse Manager', 
    'Clinical Director',
    'HR Director',
    'HR Specialist',
    'QA Nurse',
    'QA Director',
    'Survey User',
    'Marketing Specialist',
    'Marketing Manager'
  ];

  // Role categories for conditional form fields
  const roleCategories = {
    clinical: ['Staff Nurse', 'Nurse Manager', 'Clinical Director', 'QA Nurse', 'QA Director'],
    administrative: ['HR Director', 'HR Specialist', 'Marketing Manager', 'Marketing Specialist'],
    patient: ['Patient'],
    survey: ['Survey User']
  };

  // Check if role belongs to a specific category
  const isClinicalRole = (role: string) => roleCategories.clinical.includes(role);
  const isAdministrativeRole = (role: string) => roleCategories.administrative.includes(role);
  const isPatientRole = (role: string) => roleCategories.patient.includes(role);
  const isSurveyRole = (role: string) => roleCategories.survey.includes(role);

  // Load staff data from database
  const loadStaffData = async () => {
    if (!agency?.agency_name || !agency?.staff_table_name) {
      console.log('Agency or staff table name not loaded yet, skipping staff data load');
      return;
    }

    try {
      console.log('Loading staff data for agency:', agency.agency_name, 'from table:', agency.staff_table_name);
      
      const { data, error } = await supabase
        .from(agency.staff_table_name)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading staff data:', error);
        return;
      }

      console.log('Staff data loaded from database:', data);
      if (data && data.length > 0) {
        console.log('Sample staff member data:', data[0]);
        console.log('last_login:', data[0].last_login);
        console.log('last_logout:', data[0].last_logout);
        console.log('status:', data[0].status);
      }

      // Transform database data to match UI expectations
      const transformedStaff = data.map(member => ({
        ...member,
        firstName: member.first_name,
        lastName: member.last_name,
        location: `${member.city || ''}, ${member.state || ''}`.trim().replace(/^,|,$/, ''),
        shift: 'Day Shift', // Default value since it's not in database yet
        certifications: member.certifications ? member.certifications.split(',').map((cert: string) => cert.trim()).filter((cert: string) => cert) : []
      }));

      setStaff(transformedStaff);
      console.log('Staff state updated with', transformedStaff.length, 'members');
      
    } catch (error) {
      console.error('Error loading staff data:', error);
    } finally {
      setIsLoadingStaff(false);
    }
  };

  // Load patients data from database
  const loadPatientsData = async () => {
    if (!agency?.agency_name || !agency?.patients_table_name) {
      console.log('Agency or patients table name not loaded yet, skipping patients data load');
      return;
    }

    try {
      console.log('Loading patients data for agency:', agency.agency_name, 'from table:', agency.patients_table_name);
      
      const { data, error } = await supabase
        .from(agency.patients_table_name)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading patients data:', error);
        return;
      }

      console.log('Patients data loaded from database:', data);
      if (data && data.length > 0) {
        console.log('Sample patient data:', data[0]);
        console.log('last_login:', data[0].last_login);
        console.log('last_logout:', data[0].last_logout);
        console.log('status:', data[0].status);
      }

      // Transform database data to match UI expectations
      const transformedPatients = data.map(patient => ({
        ...patient,
        firstName: patient.first_name,
        lastName: patient.last_name,
        location: `${patient.city || ''}, ${patient.state || ''}`.trim().replace(/^,|,$/, ''),
        role: 'Patient', // Set role for consistency
        department: 'Patient Care', // Set department for consistency
        shift: 'N/A', // Not applicable for patients
        certifications: [] // Not applicable for patients
      }));

      setPatients(transformedPatients);
      console.log('Patients state updated with', transformedPatients.length, 'patients');
      
    } catch (error) {
      console.error('Error loading patients data:', error);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Auto-refresh status every 2 seconds to show real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Reload fresh data from database for real-time updates
      if (agency?.agency_name && agency?.staff_table_name && agency?.patients_table_name) {
        console.log('Auto-refresh: Reloading data...');
        loadStaffData();
        loadPatientsData();
      } else {
        console.log('Auto-refresh: Agency not ready yet');
      }
    }, 2000); // Update every 2 seconds for more responsive real-time updates

    return () => clearInterval(interval);
  }, []); // Empty dependency array - agency is checked inside the effect

  // Load staff and patients data when agency is loaded
  useEffect(() => {
    if (agency?.agency_name && agency?.staff_table_name && agency?.patients_table_name && !isLoading) {
      loadStaffData();
      loadPatientsData();
    }
  }, [agency?.agency_name, agency?.staff_table_name, agency?.patients_table_name, isLoading]);

  const handleStaffFormChange = (field: string, value: string) => {
    setStaffForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Form submission started');
    console.log('Agency data:', agency);
    console.log('Is loading:', isLoading);
    console.log('Form data:', staffForm);
    
    // Check if agency is loaded
    if (isLoading) {
      console.error('Agency data still loading. Please wait and try again.');
      alert('Agency data is still loading. Please wait a moment and try again.');
      return;
    }
    
    if (!agency || !agency.agency_name) {
      console.error('No agency data available. Please try again.');
      alert('Error: Agency information not loaded. Please refresh the page and try again.');
      return;
    }
    
    try {
      // Determine which table to use based on role
      const isPatient = isPatientRole(staffForm.role);
      const tableName = isPatient ? agency.patients_table_name : agency.staff_table_name;
      
      if (!tableName) {
        throw new Error(`Agency ${isPatient ? 'patients' : 'staff'} table not found. Please contact support.`);
      }
      
      // Prepare data for database insertion
      const baseData = {
        agency_name: agency.agency_name,
        first_name: staffForm.firstName,
        last_name: staffForm.lastName,
        email: staffForm.email,
        phone: staffForm.phone,
        address: staffForm.address,
        city: staffForm.city,
        state: staffForm.state,
        zip_code: staffForm.zipCode,
        emergency_contact_name: staffForm.emergencyContactName,
        emergency_contact_phone: staffForm.emergencyContactPhone,
        notes: staffForm.notes,
        password_hash: btoa(staffForm.password), // Simple encoding - use bcrypt in production
        status: 'active'
      };

      let insertData;
      
      if (isPatient) {
        // Patient-specific data
        insertData = {
          ...baseData,
          date_of_birth: staffForm.dateOfBirth || staffForm.hireDate, // Use dateOfBirth if available, fallback to hireDate
          medical_record_number: staffForm.medicalRecordNumber || `MRN-${Date.now()}`, // Use form value or generate
          primary_physician: 'TBD', // Default value
          primary_nurse: staffForm.primaryNurse || 'TBD', // Use form value or default
          admission_date: staffForm.admissionDate || new Date().toISOString().split('T')[0], // Use form value or current date
          discharge_date: staffForm.dischargeDate || null // Use form value or null
        };
      } else {
        // Staff-specific data
        insertData = {
          ...baseData,
          role: staffForm.role,
          department: staffForm.department,
          hire_date: staffForm.hireDate,
          salary: staffForm.salary ? parseFloat(staffForm.salary) : null,
          license_number: staffForm.licenseNumber,
          license_expiry: staffForm.licenseExpiry || null,
          certifications: staffForm.certifications
        };
      }

      console.log(`Inserting ${isPatient ? 'patient' : 'staff'} data into agency-specific table:`, tableName, { ...insertData, password_hash: '[REDACTED]' });

      // Insert into appropriate agency-specific Supabase table
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        alert(`Error adding ${isPatient ? 'patient' : 'staff member'}: ${error.message}`);
        return;
      }

      console.log(`${isPatient ? 'Patient' : 'Staff member'} added to database:`, result);

      // Add to local state for immediate UI update
      if (!isPatient) {
      const newStaffMember = {
          ...result,
          firstName: result.first_name,
          lastName: result.last_name,
          location: `${result.city}, ${result.state}`,
        shift: 'Day Shift',
          certifications: result.certifications ? result.certifications.split(',').map((cert: string) => cert.trim()).filter((cert: string) => cert) : []
      };

      setStaff(prevStaff => [...prevStaff, newStaffMember]);
      } else {
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
      }
      
      // Show success message
      alert(`${isPatient ? 'Patient' : 'Staff member'} ${result.first_name} ${result.last_name} has been added successfully to ${agency.agency_name}'s ${isPatient ? 'patients' : 'staff'} table!`);

    } catch (error) {
      console.error('Error submitting data:', error);
      alert('An unexpected error occurred. Please try again.');
      return;
    }
    
    // Reset form and close modal
    setStaffForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      hireDate: '',
      salary: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      licenseNumber: '',
      licenseExpiry: '',
      certifications: '',
      notes: '',
      password: '',
      // Patient-specific fields
      dateOfBirth: '',
      admissionDate: '',
      dischargeDate: '',
      medicalRecordNumber: '',
      primaryNurse: ''
    });
    setShowAddStaffModal(false);
  };

  const getStatusColor = (member: any) => {
    const statusInfo = getUserStatusWithTime(member.status, member.last_login, member.last_logout);
    
    if (statusInfo.isOnline) {
      return 'bg-green-100 text-green-800';
    } else if (member.status === 'on-leave') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (member.status === 'inactive') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (member: any) => {
    const statusInfo = getUserStatusWithTime(member.status, member.last_login, member.last_logout);
    
    if (statusInfo.isOnline) {
      return <UserCheck className="w-4 h-4" />;
    } else if (member.status === 'on-leave') {
      return <Clock className="w-4 h-4" />;
    } else if (member.status === 'inactive') {
      return <UserX className="w-4 h-4" />;
    } else {
      return <Users className="w-4 h-4" />;
    }
  };

  const getStatusText = (member: any) => {
    const statusInfo = getUserStatusWithTime(member.status, member.last_login, member.last_logout);
    return statusInfo.status;
  };

  const getStatusTimeText = (member: any) => {
    const statusInfo = getUserStatusWithTime(member.status, member.last_login, member.last_logout);
    return statusInfo.timeText;
  };

  const filteredStaff = staff.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <SubscriptionGuard 
      requiredSubscription="HR Management" 
      featureName="HR Management"
    >
      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Navbar Component */}
        <AdminNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                HR Management
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage your healthcare staff and personnel
              </p>
            </div>
            <button 
              onClick={() => setShowAddStaffModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">{staff.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">{patients.length}</p>
                </div>
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Online Staff</p>
                  <p className="text-2xl font-bold text-green-600 font-[family-name:var(--font-adlam-display)]">{staff.filter(s => getUserStatusWithTime(s.status, s.last_login, s.last_logout).isOnline).length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Online Patients</p>
                  <p className="text-2xl font-bold text-green-600 font-[family-name:var(--font-adlam-display)]">{patients.filter(p => getUserStatusWithTime(p.status, p.last_login, p.last_logout).isOnline).length}</p>
                </div>
                <Heart className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search staff members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-[family-name:var(--font-adlam-display)]">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Staff Members
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Staff Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Role & Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Status
                    </th>
                    {/* Conditional columns based on role category */}
                    {selectedDepartment === 'all' && (
                      <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                          Professional Info
                        </th>
                      </>
                    )}
                    {selectedDepartment !== 'all' && (
                      <>
                        {selectedDepartment === 'Emergency' || selectedDepartment === 'ICU' || selectedDepartment === 'Surgery' || selectedDepartment === 'Pediatrics' || selectedDepartment === 'Medical/Surgical' ? (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                              License Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Certifications
                    </th>
                          </>
                        ) : (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                              Assignment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                              Professional Info
                            </th>
                          </>
                        )}
                      </>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {member.firstName[0]}{member.lastName[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                                {member.firstName} {member.lastName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {member.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {member.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            {member.role}
                          </div>
                          <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {member.department} Department
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member)} font-[family-name:var(--font-adlam-display)]`}>
                              {getStatusIcon(member)}
                              <span className="capitalize">{getStatusText(member)}</span>
                            </span>
                            {getStatusTimeText(member) && (
                              <span className="text-xs text-gray-500 mt-1 font-[family-name:var(--font-adlam-display)]">
                                {getStatusTimeText(member)}
                              </span>
                            )}
                          </div>
                        </td>
                        {/* Conditional columns based on role category */}
                        {selectedDepartment === 'all' && (
                          <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center font-[family-name:var(--font-adlam-display)]">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {member.location}
                          </div>
                          <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {member.shift}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {member.certifications && member.certifications.length > 0 ? (
                              member.certifications.slice(0, 3).map((cert: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 font-[family-name:var(--font-adlam-display)]"
                                >
                                  {cert}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">No certifications</span>
                            )}
                            {member.certifications && member.certifications.length > 3 && (
                              <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                                +{member.certifications.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                          </>
                        )}
                        {selectedDepartment !== 'all' && (
                          <>
                            {selectedDepartment === 'Emergency' || selectedDepartment === 'ICU' || selectedDepartment === 'Surgery' || selectedDepartment === 'Pediatrics' || selectedDepartment === 'Medical/Surgical' ? (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                                    {member.license_number || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                                    Expires: {member.license_expiry || 'N/A'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-wrap gap-1">
                                    {member.certifications && member.certifications.length > 0 ? (
                                      member.certifications.slice(0, 3).map((cert: string, index: number) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 font-[family-name:var(--font-adlam-display)]"
                                        >
                                          {cert}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">No certifications</span>
                                    )}
                                    {member.certifications && member.certifications.length > 3 && (
                                      <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                                        +{member.certifications.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 flex items-center font-[family-name:var(--font-adlam-display)]">
                                    <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                    {member.location}
                                  </div>
                                  <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                                    {member.shift}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-wrap gap-1">
                                    {member.certifications && member.certifications.length > 0 ? (
                                      member.certifications.slice(0, 3).map((cert: string, index: number) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 font-[family-name:var(--font-adlam-display)]"
                                        >
                                          {cert}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">No certifications</span>
                                    )}
                                    {member.certifications && member.certifications.length > 3 && (
                                      <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                                        +{member.certifications.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}
                          </>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : isLoadingStaff ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            Loading staff members...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Users className="w-12 h-12 text-gray-300" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                              No staff members found
                            </h3>
                            <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                              {searchTerm || selectedDepartment !== 'all' 
                                ? 'No staff match your current filters. Try adjusting your search.'
                                : 'Get started by adding your first staff member.'}
                            </p>
                          </div>
                          <button 
                            onClick={() => setShowAddStaffModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Staff Member</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Patients
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Medical Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Care Team
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {patient.firstName[0]}{patient.lastName[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {patient.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {patient.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            MRN: {patient.medical_record_number || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            DOB: {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient)} font-[family-name:var(--font-adlam-display)]`}>
                              {getStatusIcon(patient)}
                              <span className="capitalize">{getStatusText(patient)}</span>
                            </span>
                            {getStatusTimeText(patient) && (
                              <span className="text-xs text-gray-500 mt-1 font-[family-name:var(--font-adlam-display)]">
                                {getStatusTimeText(patient)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center font-[family-name:var(--font-adlam-display)]">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {patient.location}
                          </div>
                          <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {patient.admission_date ? `Admitted: ${new Date(patient.admission_date).toLocaleDateString()}` : 'Not admitted'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            {patient.primary_nurse || 'TBD'}
                          </div>
                          <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {patient.primary_physician || 'TBD'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : isLoadingPatients ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                          <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            Loading patients...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Heart className="w-12 h-12 text-gray-300" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                              No patients found
                            </h3>
                            <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                              Get started by adding your first patient.
                            </p>
                          </div>
                          <button 
                            onClick={() => setShowAddStaffModal(true)}
                            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Patient</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>

    {/* Add Staff Modal */}
    {showAddStaffModal && (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Add New Staff Member
              </h2>
              <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                Complete the form below to add a new staff member to <span className="font-semibold text-blue-600">
                  {isLoading ? 'Loading...' : agency?.agency_name || 'Unknown Agency'}
                </span>
              </p>
              {!isLoading && (!agency || !agency.agency_name) && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-600 font-[family-name:var(--font-adlam-display)]">
                    ⚠️ Agency information not loaded. Please refresh the page or log in again.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAddStaffModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmitStaff} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Personal Information Section */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
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
                  value={staffForm.firstName}
                  onChange={(e) => handleStaffFormChange('firstName', e.target.value)}
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
                  value={staffForm.lastName}
                  onChange={(e) => handleStaffFormChange('lastName', e.target.value)}
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
                  value={staffForm.email}
                  onChange={(e) => handleStaffFormChange('email', e.target.value)}
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
                  value={staffForm.phone}
                  onChange={(e) => handleStaffFormChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Employment Information Section */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Employment Information
                </h3>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Role *
                </label>
                <select
                  required
                  value={staffForm.role}
                  onChange={(e) => handleStaffFormChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                >
                  <option value="">Select a role</option>
                  {staffRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Department *
                </label>
                <select
                  required
                  value={staffForm.department}
                  onChange={(e) => handleStaffFormChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                >
                  <option value="">Select a department</option>
                  {departments.filter(dept => dept !== 'all').map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              )}

              {/* Hire Date - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    {isPatientRole(staffForm.role) ? 'Registration Date' : 'Hire Date'} *
                </label>
                <input
                  type="date"
                  required
                  value={staffForm.hireDate}
                  onChange={(e) => handleStaffFormChange('hireDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                />
              </div>
              )}

              {/* Salary - Show for staff roles only, not Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Annual Salary
                </label>
                <input
                  type="number"
                  value={staffForm.salary}
                  onChange={(e) => handleStaffFormChange('salary', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter annual salary"
                />
              </div>
              )}

              {/* Address Information Section - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Address Information
                </h3>
              </div>
              )}

              {/* Address - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Street Address
                </label>
                <input
                  type="text"
                  value={staffForm.address}
                  onChange={(e) => handleStaffFormChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter street address"
                />
              </div>
              )}

              {/* City - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  City
                </label>
                <input
                  type="text"
                  value={staffForm.city}
                  onChange={(e) => handleStaffFormChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter city"
                />
              </div>
              )}

              {/* State - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  State
                </label>
                <input
                  type="text"
                  value={staffForm.state}
                  onChange={(e) => handleStaffFormChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter state"
                />
              </div>
              )}

              {/* ZIP Code - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={staffForm.zipCode}
                  onChange={(e) => handleStaffFormChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter ZIP code"
                />
              </div>
              )}

              {/* Emergency Contact Section - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Emergency Contact
                </h3>
              </div>
              )}

              {/* Emergency Contact Name - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={staffForm.emergencyContactName}
                  onChange={(e) => handleStaffFormChange('emergencyContactName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter emergency contact name"
                />
              </div>
              )}

              {/* Emergency Contact Phone - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={staffForm.emergencyContactPhone}
                  onChange={(e) => handleStaffFormChange('emergencyContactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter emergency contact phone"
                />
              </div>
              )}

              {/* Professional Information Section - Show for Clinical roles only */}
              {isClinicalRole(staffForm.role) && (
                <>
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                  <Star className="w-5 h-5 mr-2 text-blue-600" />
                  Professional Information
                </h3>
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      License Number *
                </label>
                <input
                  type="text"
                      required
                  value={staffForm.licenseNumber}
                  onChange={(e) => handleStaffFormChange('licenseNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter license number"
                />
              </div>

              {/* License Expiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      License Expiry Date *
                </label>
                <input
                  type="date"
                      required
                  value={staffForm.licenseExpiry}
                  onChange={(e) => handleStaffFormChange('licenseExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                />
              </div>

              {/* Certifications */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Certifications
                </label>
                <textarea
                  value={staffForm.certifications}
                  onChange={(e) => handleStaffFormChange('certifications', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter certifications (separate multiple certifications with commas)"
                />
              </div>
                </>
              )}

              {/* Administrative Information Section - Show for Administrative roles only */}
              {isAdministrativeRole(staffForm.role) && (
                <>
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      Administrative Information
                    </h3>
                  </div>

                  {/* Administrative Certifications */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Professional Certifications
                    </label>
                    <textarea
                      value={staffForm.certifications}
                      onChange={(e) => handleStaffFormChange('certifications', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter professional certifications, training, or qualifications"
                    />
                  </div>
                </>
              )}

              {/* Patient Information Section - Show for Patient role only */}
              {isPatientRole(staffForm.role) && (
                <>
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                      <Heart className="w-5 h-5 mr-2 text-blue-600" />
                      Patient Information
                    </h3>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={staffForm.dateOfBirth}
                      onChange={(e) => handleStaffFormChange('dateOfBirth', e.target.value)}
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
                      value={staffForm.medicalRecordNumber}
                      onChange={(e) => handleStaffFormChange('medicalRecordNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter MRN (auto-generated if empty)"
                    />
                  </div>

                  {/* Primary Nurse */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Primary Nurse
                    </label>
                    <select
                      value={staffForm.primaryNurse}
                      onChange={(e) => handleStaffFormChange('primaryNurse', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    >
                      <option value="">Select a nurse</option>
                      {staff
                        .filter(member => 
                          (member.role === 'Staff Nurse' || member.role === 'Nurse Manager')
                        )
                        .map((nurse) => (
                          <option key={nurse.id} value={`${nurse.first_name} ${nurse.last_name}`}>
                            {nurse.first_name} {nurse.last_name} ({nurse.role})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Admission Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Admission Date
                    </label>
                    <input
                      type="date"
                      value={staffForm.admissionDate}
                      onChange={(e) => handleStaffFormChange('admissionDate', e.target.value)}
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
                      value={staffForm.dischargeDate}
                      onChange={(e) => handleStaffFormChange('dischargeDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    />
                  </div>

                  {/* Address Information Section for Patients */}
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Address Information
                    </h3>
                  </div>

                  {/* Address for Patients */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={staffForm.address}
                      onChange={(e) => handleStaffFormChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter street address"
                    />
                  </div>

                  {/* City for Patients */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      City
                    </label>
                    <input
                      type="text"
                      value={staffForm.city}
                      onChange={(e) => handleStaffFormChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter city"
                    />
                  </div>

                  {/* State for Patients */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      State
                    </label>
                    <input
                      type="text"
                      value={staffForm.state}
                      onChange={(e) => handleStaffFormChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter state"
                    />
                  </div>

                  {/* Zip Code for Patients */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={staffForm.zipCode}
                      onChange={(e) => handleStaffFormChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter ZIP code"
                    />
                  </div>

              {/* Address - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={staffForm.address}
                    onChange={(e) => handleStaffFormChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter street address"
                  />
                </div>
              )}

              {/* City - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    City
                  </label>
                  <input
                    type="text"
                    value={staffForm.city}
                    onChange={(e) => handleStaffFormChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter city"
                  />
                </div>
              )}

              {/* State - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    State
                  </label>
                  <input
                    type="text"
                    value={staffForm.state}
                    onChange={(e) => handleStaffFormChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter state"
                  />
                </div>
              )}

              {/* Zip Code - Show for all roles except Patient */}
              {!isPatientRole(staffForm.role) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={staffForm.zipCode}
                    onChange={(e) => handleStaffFormChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    placeholder="Enter ZIP code"
                  />
                </div>
              )}

                  {/* Emergency Contact Section for Patients */}
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                      <Phone className="w-5 h-5 mr-2 text-blue-600" />
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
                      value={staffForm.emergencyContactName}
                      onChange={(e) => handleStaffFormChange('emergencyContactName', e.target.value)}
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
                      value={staffForm.emergencyContactPhone}
                      onChange={(e) => handleStaffFormChange('emergencyContactPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                </>
              )}

              {/* Survey User Information Section - Show for Survey User role only */}
              {isSurveyRole(staffForm.role) && (
                <>
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Survey User Information
                    </h3>
                  </div>

                  {/* Survey Access Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Access Level
                    </label>
                    <select
                      value={staffForm.certifications}
                      onChange={(e) => handleStaffFormChange('certifications', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                    >
                      <option value="">Select access level</option>
                      <option value="Basic">Basic Survey Access</option>
                      <option value="Advanced">Advanced Survey Access</option>
                      <option value="Admin">Survey Administrator</option>
                    </select>
                  </div>

                  {/* Survey Training */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                      Training Completed
                    </label>
                    <input
                      type="text"
                      value={staffForm.notes}
                      onChange={(e) => handleStaffFormChange('notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                      placeholder="Enter completed training or certifications"
                    />
                  </div>
                </>
              )}

              {/* Notes - Show for all roles except Survey User (they have their own notes field) */}
              {!isSurveyRole(staffForm.role) && (
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Additional Notes
                </label>
                <textarea
                  value={staffForm.notes}
                  onChange={(e) => handleStaffFormChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter any additional notes or comments"
                />
              </div>
              )}

              {/* Security Information Section */}
              <div className="lg:col-span-2 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
                  <Key className="w-5 h-5 mr-2 text-blue-600" />
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
                  value={staffForm.password}
                  onChange={(e) => handleStaffFormChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)] text-black placeholder-gray-400"
                  placeholder="Enter a secure password for dashboard access"
                />
                <p className="mt-1 text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                  This password will be used for role-based dashboard login. Minimum 8 characters recommended.
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </SubscriptionGuard>
  );
}
