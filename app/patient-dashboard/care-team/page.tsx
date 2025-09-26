'use client';

import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Award,
  GraduationCap
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PatientNavbar from '@/app/components/patient-dashboard/PatientNavbar';

export default function PatientCareTeamPage() {
  const [patientData, setPatientData] = useState<any>(null);
  const [primaryNurse, setPrimaryNurse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch complete patient data from database
  const fetchPatientData = async (patientEmail: string) => {
    try {
      console.log('Fetching patient data for email:', patientEmail);
      
      // Get patient agency from localStorage
      const patientAgency = localStorage.getItem('patientAgency');
      if (!patientAgency) {
        throw new Error('No patient agency found in localStorage');
      }

      // Get the patients table name for this agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('patients_table_name')
        .eq('agency_name', patientAgency)
        .single();

      if (agencyError || !agencyData?.patients_table_name) {
        console.error('Error fetching agency data or patients table name:', agencyError);
        throw new Error('Agency patients table not found');
      }

      console.log('Using patients table:', agencyData.patients_table_name);
      
      const { data, error } = await supabase
        .from(agencyData.patients_table_name)
        .select('*')
        .eq('email', patientEmail)
        .single();

      if (error) {
        console.error('Error fetching patient data:', error);
        throw error;
      }

      if (data) {
        console.log('Patient data fetched successfully:', data);
        setPatientData(data);
        localStorage.setItem('patientData', JSON.stringify(data));
        
        // Fetch primary nurse data if primary_nurse is set
        if (data.primary_nurse) {
          console.log('Patient has primary_nurse set to:', data.primary_nurse);
          await fetchPrimaryNurse(data.primary_nurse);
        } else {
          console.log('Patient has no primary_nurse set');
        }
      } else {
        console.log('No patient data found for email:', patientEmail);
        throw new Error('Patient not found');
      }
    } catch (error) {
      console.error('Error in fetchPatientData:', error);
      alert('Error loading patient data. Please try signing in again.');
      window.location.href = '/patient-signin';
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch primary nurse data from agency-specific staff table
  const fetchPrimaryNurse = async (nurseName: string) => {
    try {
      console.log('Fetching primary nurse data for:', nurseName);
      
      // Get patient agency from localStorage
      const patientAgency = localStorage.getItem('patientAgency');
      if (!patientAgency) {
        console.log('No patient agency found, cannot fetch nurse data');
        return;
      }

      // Get the staff table name for this agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('staff_table_name')
        .eq('agency_name', patientAgency)
        .single();

      if (agencyError || !agencyData?.staff_table_name) {
        console.error('Error fetching agency data or staff table name:', agencyError);
        return;
      }

      console.log('Using staff table:', agencyData.staff_table_name);
      
      // First try to find by exact name match
      let { data, error } = await supabase
        .from(agencyData.staff_table_name)
        .select('*')
        .eq('role', 'Staff Nurse')
        .ilike('first_name', `%${nurseName}%`);

      // If no exact match, try last name
      if (!data || data.length === 0) {
        const { data: lastNameData, error: lastNameError } = await supabase
          .from(agencyData.staff_table_name)
          .select('*')
          .eq('role', 'Staff Nurse')
          .ilike('last_name', `%${nurseName}%`);
        
        data = lastNameData;
        error = lastNameError;
      }

      // If still no match, try full name (first_name + last_name)
      if (!data || data.length === 0) {
        const { data: fullNameData, error: fullNameError } = await supabase
          .from(agencyData.staff_table_name)
          .select('*')
          .eq('role', 'Staff Nurse')
          .ilike('first_name', `%${nurseName.split(' ')[0]}%`)
          .ilike('last_name', `%${nurseName.split(' ')[1] || ''}%`);
        
        data = fullNameData;
        error = fullNameError;
      }

      if (error) {
        console.error('Error fetching primary nurse data:', error);
        console.log('Primary nurse not found, will show default care team');
        return;
      }

      if (data && data.length > 0) {
        console.log('Primary nurse data fetched successfully:', data[0]);
        setPrimaryNurse(data[0]);
      } else {
        console.log('No primary nurse found for:', nurseName);
      }
    } catch (error) {
      console.error('Error in fetchPrimaryNurse:', error);
      // Don't throw error, just log it
    }
  };

  // Load patient data from localStorage and fetch complete data from database
  useEffect(() => {
    const storedPatientData = localStorage.getItem('patientData');
    if (storedPatientData) {
      try {
        const parsedData = JSON.parse(storedPatientData);
        console.log('Patient data loaded from localStorage:', parsedData);
        
        if (parsedData.email) {
          fetchPatientData(parsedData.email);
        } else {
          console.error('No email found in stored patient data');
          window.location.href = '/patient-signin';
        }
      } catch (error) {
        console.error('Error parsing patient data:', error);
        window.location.href = '/patient-signin';
      }
    } else {
      console.log('No patient data found, redirecting to signin');
      window.location.href = '/patient-signin';
    }
  }, []);

  // Build care team data with real primary nurse if available
  const buildCareTeam = () => {
    const careTeam = [];
    
    // Add primary nurse if found
    if (primaryNurse) {
      careTeam.push({
        id: primaryNurse.id,
        name: `${primaryNurse.first_name} ${primaryNurse.last_name}`,
        role: 'Primary Nurse',
        specialty: primaryNurse.department || 'Patient Care',
        email: primaryNurse.email,
        phone: primaryNurse.phone || 'Not provided',
        location: primaryNurse.address ? `${primaryNurse.city}, ${primaryNurse.state}` : 'Main Clinic',
        experience: primaryNurse.hire_date ? `${new Date().getFullYear() - new Date(primaryNurse.hire_date).getFullYear()} years` : 'Experienced',
        education: 'Registered Nurse',
        certifications: primaryNurse.certifications ? primaryNurse.certifications.split(',').map(cert => cert.trim()) : ['RN License'],
        availability: 'Mon-Fri 8:00 AM - 5:00 PM',
        rating: 4.8,
        avatar: `${primaryNurse.first_name.charAt(0)}${primaryNurse.last_name.charAt(0)}`,
        profileImage: primaryNurse.profile_image
      });
    }
    
    // Add primary physician only if it's not TBD
    if (patientData?.primary_physician && patientData.primary_physician.toLowerCase() !== 'tbd') {
      careTeam.push({
        id: 'physician-1',
        name: patientData.primary_physician,
        role: 'Primary Physician',
        specialty: 'Internal Medicine',
        email: 'physician@elitenursing.com',
        phone: '(555) 123-4567',
        location: 'Main Clinic, Room 105',
        experience: '15 years',
        education: 'MD, Medical School',
        certifications: ['Board Certified Internal Medicine'],
        availability: 'Mon-Fri 8:00 AM - 5:00 PM',
        rating: 4.9,
        avatar: 'DR'
      });
    }
    
    return careTeam;
  };

  const careTeam = buildCareTeam();


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Patient Navbar Component */}
      <PatientNavbar activeTab="care-team" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Your Care Team
              </h1>
              <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
                Meet the healthcare professionals dedicated to your care
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {isLoading ? (
            /* Loading State */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loading skeleton cards */}
                {[1, 2].map((index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      {/* Avatar skeleton */}
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      
                      {/* Content skeleton */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="h-5 bg-gray-200 rounded w-32"></div>
                          <div className="h-4 bg-gray-200 rounded w-8"></div>
                        </div>
                        
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                        
                        {/* Contact info skeleton */}
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        
                        {/* Experience skeleton */}
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        
                        {/* Certifications skeleton */}
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="flex space-x-2">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          </div>
                        </div>
                        
                        {/* Buttons skeleton */}
                        <div className="flex space-x-2 pt-2">
                          <div className="h-8 bg-gray-200 rounded w-full"></div>
                          <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Loading message */}
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-gray-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="font-[family-name:var(--font-adlam-display)]">
                    Loading your care team...
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Care Team Content */
            <div>
              {/* Care Team Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {careTeam.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-lg font-semibold">
                        {member.avatar}
                      </span>
                    )}
                  </div>
                  
                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                        {member.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                          {member.rating}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-blue-600 font-medium mb-1 font-[family-name:var(--font-adlam-display)]">
                      {member.role}
                    </p>
                    
                    <p className="text-gray-600 mb-4 font-[family-name:var(--font-adlam-display)]">
                      {member.specialty}
                    </p>
                    
                    {/* Contact Information */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-[family-name:var(--font-adlam-display)]">
                          {member.email}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm font-[family-name:var(--font-adlam-display)]">
                          {member.phone}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-[family-name:var(--font-adlam-display)]">
                          {member.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-[family-name:var(--font-adlam-display)]">
                          {member.availability}
                        </span>
                      </div>
                    </div>
                    
                    {/* Experience & Education */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-[family-name:var(--font-adlam-display)]">
                          {member.experience} experience
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm font-[family-name:var(--font-adlam-display)]">
                          {member.education}
                        </span>
                      </div>
                    </div>
                    
                    {/* Certifications */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                        Certifications:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-[family-name:var(--font-adlam-display)]"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-[family-name:var(--font-adlam-display)]">
                        Send Message
                      </button>
                      <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-[family-name:var(--font-adlam-display)]">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
              </div>
              
              {/* Emergency Contact Section */}
              <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4 font-[family-name:var(--font-adlam-display)]">
                  Emergency Contact
                </h3>
                <p className="text-red-800 mb-4 font-[family-name:var(--font-adlam-display)]">
                  For medical emergencies, call 911 or contact your primary care physician immediately.
                </p>
                <div className="flex items-center space-x-4">
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                    Call 911
                  </button>
                  <button className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-[family-name:var(--font-adlam-display)]">
                    Contact Primary Care
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
