'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  Plus,
  Activity,
  Pill,
  Stethoscope,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PatientNavbar from '@/app/components/patient-dashboard/PatientNavbar';

export default function PatientHealthRecordsPage() {
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

  // Mock health records data
  const healthRecords = [
    {
      id: 1,
      type: 'Lab Results',
      title: 'Complete Blood Count (CBC)',
      date: '2024-06-28',
      doctor: 'Dr. Jane Smith',
      status: 'normal',
      description: 'Routine blood work showing normal values across all parameters',
      results: [
        { parameter: 'Hemoglobin', value: '14.2 g/dL', normal: '12.0-15.5 g/dL', status: 'normal' },
        { parameter: 'White Blood Cells', value: '7,200/μL', normal: '4,500-11,000/μL', status: 'normal' },
        { parameter: 'Platelets', value: '285,000/μL', normal: '150,000-450,000/μL', status: 'normal' }
      ]
    },
    {
      id: 2,
      type: 'Imaging',
      title: 'Chest X-Ray',
      date: '2024-06-15',
      doctor: 'Dr. Michael Johnson',
      status: 'normal',
      description: 'Routine chest X-ray showing clear lungs and normal heart size',
      results: [
        { parameter: 'Lungs', value: 'Clear', normal: 'Clear', status: 'normal' },
        { parameter: 'Heart', value: 'Normal size', normal: 'Normal', status: 'normal' },
        { parameter: 'Bones', value: 'No fractures', normal: 'Intact', status: 'normal' }
      ]
    },
    {
      id: 3,
      type: 'Vital Signs',
      title: 'Blood Pressure Reading',
      date: '2024-06-10',
      doctor: 'Nurse Emily White',
      status: 'elevated',
      description: 'Blood pressure slightly elevated, monitoring recommended',
      results: [
        { parameter: 'Systolic', value: '145 mmHg', normal: '<120 mmHg', status: 'elevated' },
        { parameter: 'Diastolic', value: '92 mmHg', normal: '<80 mmHg', status: 'elevated' },
        { parameter: 'Heart Rate', value: '78 bpm', normal: '60-100 bpm', status: 'normal' }
      ]
    },
    {
      id: 4,
      type: 'Medication',
      title: 'Current Medications',
      date: '2024-06-01',
      doctor: 'Dr. Jane Smith',
      status: 'active',
      description: 'Current medication regimen for diabetes and hypertension management',
      results: [
        { parameter: 'Metformin', value: '500mg twice daily', normal: 'As prescribed', status: 'active' },
        { parameter: 'Lisinopril', value: '10mg once daily', normal: 'As prescribed', status: 'active' },
        { parameter: 'Aspirin', value: '81mg once daily', normal: 'As prescribed', status: 'active' }
      ]
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Patient Navbar Component */}
      <PatientNavbar activeTab="health-records" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Health Records
              </h1>
              <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
                Access your medical history, test results, and health information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4" />
                <span>Request Records</span>
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
                placeholder="Search health records..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Filter className="w-4 h-4" />
              <span>Filter by Type</span>
            </button>
          </div>

          {/* Health Records List */}
          <div className="space-y-6">
            {healthRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.type === 'Lab Results' ? 'bg-blue-100 text-blue-800' :
                        record.type === 'Imaging' ? 'bg-green-100 text-green-800' :
                        record.type === 'Vital Signs' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {record.type}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'normal' ? 'bg-green-100 text-green-800' :
                        record.status === 'elevated' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {record.status === 'normal' ? 'Normal' :
                         record.status === 'elevated' ? 'Elevated' : 'Active'}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                      {record.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 font-[family-name:var(--font-adlam-display)]">
                      {record.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-adlam-display)]">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Stethoscope className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-adlam-display)]">
                          {record.doctor}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Results */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 font-[family-name:var(--font-adlam-display)]">
                    Results:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {record.results.map((result, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            {result.parameter}
                          </span>
                          {result.status === 'normal' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-[family-name:var(--font-adlam-display)]">
                            <span className="font-medium">Value:</span> {result.value}
                          </p>
                          <p className="font-[family-name:var(--font-adlam-display)]">
                            <span className="font-medium">Normal:</span> {result.normal}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 font-[family-name:var(--font-adlam-display)]">
              Health Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 font-[family-name:var(--font-adlam-display)]">
                  {healthRecords.length}
                </div>
                <div className="text-sm text-blue-800 font-[family-name:var(--font-adlam-display)]">
                  Total Records
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 font-[family-name:var(--font-adlam-display)]">
                  {healthRecords.filter(r => r.status === 'normal').length}
                </div>
                <div className="text-sm text-green-800 font-[family-name:var(--font-adlam-display)]">
                  Normal Results
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 font-[family-name:var(--font-adlam-display)]">
                  {healthRecords.filter(r => r.status === 'elevated').length}
                </div>
                <div className="text-sm text-yellow-800 font-[family-name:var(--font-adlam-display)]">
                  Need Attention
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
