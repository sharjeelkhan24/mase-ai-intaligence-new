'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PatientNavbar from '@/app/components/patient-dashboard/PatientNavbar';

export default function PatientAppointmentsPage() {
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch complete patient data from database
  const fetchPatientData = async (patientEmail: string) => {
    try {
      console.log('Fetching patient data for email:', patientEmail);
      
      const { data, error } = await supabase
        .from('patients')
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

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      date: '2024-07-20',
      time: '10:00 AM',
      doctor: 'Dr. Emily White',
      specialty: 'Cardiology',
      location: 'Cardiology Clinic, Room 201',
      status: 'upcoming',
      type: 'Follow-up',
      notes: 'Annual heart check-up'
    },
    {
      id: 2,
      date: '2024-08-05',
      time: '2:30 PM',
      doctor: 'Dr. Michael Johnson',
      specialty: 'Lab Test',
      location: 'Laboratory, Floor 2',
      status: 'upcoming',
      type: 'Lab Test',
      notes: 'Fasting required - no food 12 hours before'
    },
    {
      id: 3,
      date: '2024-06-15',
      time: '9:00 AM',
      doctor: 'Dr. Sarah Davis',
      specialty: 'General Medicine',
      location: 'Main Clinic, Room 105',
      status: 'completed',
      type: 'Annual Check-up',
      notes: 'Routine health examination'
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Patient Navbar Component */}
      <PatientNavbar activeTab="appointments" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Appointments
              </h1>
              <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
                Manage your upcoming and past appointments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4" />
                <span>Schedule Appointment</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Filters */}
          <div className="mb-6 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {appointment.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </div>
                      <span className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                        {appointment.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      {appointment.doctor}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 font-[family-name:var(--font-adlam-display)]">
                      {appointment.specialty}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-adlam-display)]">
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-adlam-display)]">
                          {appointment.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-adlam-display)]">
                          {appointment.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-adlam-display)]">
                          (555) 123-4567
                        </span>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 font-[family-name:var(--font-adlam-display)]">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    {appointment.status === 'upcoming' && (
                      <>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-[family-name:var(--font-adlam-display)]">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-[family-name:var(--font-adlam-display)]">
                          Cancel
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-[family-name:var(--font-adlam-display)]">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
