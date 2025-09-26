'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Calendar,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  Search,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Pill,
  Activity,
  TrendingUp,
  BarChart3,
  Star,
  Phone,
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import { usePatientAuth } from '@/lib/contexts/PatientAuthContext';
import PatientNavbar from '@/app/components/patient-dashboard/PatientNavbar';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { patient, isLoading } = usePatientAuth();
  const router = useRouter();

  // Handle redirect to signin if no patient data
  useEffect(() => {
    if (!isLoading && !patient) {
      router.push('/patient-signin');
    }
  }, [isLoading, patient, router]);

  // Show loading screen while patient data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 font-[family-name:var(--font-adlam-display)]">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show redirecting message if no patient data
  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 font-[family-name:var(--font-adlam-display)]">
            Redirecting to signin...
          </p>
        </div>
      </div>
    );
  }

  // Dynamic patient info based on logged-in user
  const patientInfo = {
    name: `${patient.first_name} ${patient.last_name}`,
    id: patient.medical_record_number || patient.agency_name,
    age: patient.date_of_birth ? Math.floor((new Date().getTime() - new Date(patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0,
    condition: patient.medical_conditions || 'Patient Care',
    primaryNurse: patient.primary_nurse || 'Care Team',
    doctor: patient.primary_physician || 'Primary Physician',
    admissionDate: patient.admission_date || new Date().toISOString().split('T')[0],
    room: 'Patient Portal' // Default room
  };

  const upcomingAppointments = [
    { id: 1, type: 'Check-up', provider: 'Dr. Martinez', date: '2024-01-25', time: '10:00 AM', status: 'confirmed' },
    { id: 2, type: 'Blood Test', provider: 'Lab Services', date: '2024-01-28', time: '8:00 AM', status: 'scheduled' },
    { id: 3, type: 'Nurse Visit', provider: 'Sarah Johnson', date: '2024-01-30', time: '2:00 PM', status: 'pending' }
  ];

  const careTeam = [
    { id: 1, name: 'Dr. Martinez', role: 'Primary Doctor', specialty: 'Internal Medicine', contact: 'ext. 1234' },
    { id: 2, name: 'Sarah Johnson', role: 'Primary Nurse', specialty: 'Diabetes Care', contact: 'ext. 5678' },
    { id: 3, name: 'Mike Chen', role: 'Physical Therapist', specialty: 'Rehabilitation', contact: 'ext. 9012' },
    { id: 4, name: 'Emily Rodriguez', role: 'Dietitian', specialty: 'Nutrition', contact: 'ext. 3456' }
  ];

  const healthRecords = [
    { id: 1, type: 'Blood Pressure', value: '120/80', unit: 'mmHg', date: '2024-01-20', status: 'normal' },
    { id: 2, type: 'Blood Sugar', value: '95', unit: 'mg/dL', date: '2024-01-20', status: 'normal' },
    { id: 3, type: 'Weight', value: '175', unit: 'lbs', date: '2024-01-19', status: 'stable' },
    { id: 4, type: 'Temperature', value: '98.6', unit: '°F', date: '2024-01-20', status: 'normal' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'care-team', label: 'Care Team', icon: Users },
    { id: 'health-records', label: 'Health Records', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Patient Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{patientInfo.age}</p>
            <p className="text-sm text-gray-600">Years Old</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{patientInfo.room}</p>
            <p className="text-sm text-gray-600">Room Number</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">10</p>
            <p className="text-sm text-gray-600">Days in Care</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Stethoscope className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">Stable</p>
            <p className="text-sm text-gray-600">Condition</p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments and Health Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className={`p-3 rounded-lg border-l-4 ${
                appointment.status === 'confirmed' ? 'border-green-500 bg-green-50' :
                appointment.status === 'scheduled' ? 'border-blue-500 bg-blue-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appointment.type}</p>
                    <p className="text-xs text-gray-500">{appointment.provider} • {appointment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{appointment.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Health Summary
          </h3>
          <div className="space-y-3">
            {healthRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    record.status === 'normal' ? 'bg-green-500' :
                    record.status === 'stable' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  } mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{record.type}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{record.value} {record.unit}</p>
                  <p className="text-xs text-gray-500">{record.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.provider}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCareTeam = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Care Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careTeam.map((member) => (
            <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600"><span className="font-medium">Specialty:</span> {member.specialty}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Contact:</span> {member.contact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHealthRecords = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Records</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recent Vitals</h4>
            {healthRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    record.status === 'normal' ? 'bg-green-500' :
                    record.status === 'stable' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  } mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{record.type}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{record.value} {record.unit}</p>
                  <p className="text-xs text-gray-500">{record.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Medications</h4>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Pill className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Metformin</span>
                </div>
                <p className="text-sm text-gray-600">500mg twice daily</p>
                <p className="text-xs text-gray-500">Next dose: 8:00 AM</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Pill className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">Lisinopril</span>
                </div>
                <p className="text-sm text-gray-600">10mg once daily</p>
                <p className="text-xs text-gray-500">Next dose: 9:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Dr. Martinez</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-600">Your blood test results look good. Continue with your current medication regimen.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Sarah Johnson</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <p className="text-sm text-gray-600">Reminder: Your next appointment is scheduled for tomorrow at 10:00 AM.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">4.8/5</p>
            <p className="text-sm text-gray-600">Overall Rating</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">95%</p>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">4.9/5</p>
            <p className="text-sm text-gray-600">Care Team Rating</p>
          </div>
        </div>
      </div>
    </div>
  );


     const renderContent = () => {
       switch (activeTab) {
         case 'dashboard': return renderDashboard();
         case 'appointments': 
           router.push('/patient-dashboard/appointments');
           return null;
         case 'care-team': 
           router.push('/patient-dashboard/care-team');
           return null;
         case 'health-records': 
           router.push('/patient-dashboard/health-records');
           return null;
         case 'messages': 
           router.push('/patient-dashboard/messages');
           return null;
         case 'feedback': 
           router.push('/patient-dashboard/feedback');
           return null;
         case 'settings': 
           router.push('/patient-dashboard/settings');
           return null;
         default: return renderDashboard();
       }
     };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Patient Navbar Component */}
      <PatientNavbar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'dashboard' && 'Your health overview and recent activity'}
                {activeTab === 'appointments' && 'Upcoming appointments and schedule'}
                {activeTab === 'care-team' && 'Your healthcare team and providers'}
                {activeTab === 'health-records' && 'Your medical records and health data'}
                {activeTab === 'messages' && 'Messages from your care team'}
                {activeTab === 'feedback' && 'Share your experience and feedback'}
                {activeTab === 'settings' && 'Account settings and preferences'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
