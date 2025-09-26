'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  MessageSquare, 
  Settings, 
  Bell, 
  CheckCircle, 
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Activity,
  Heart,
  Thermometer,
  Clipboard,
  FileText,
  Send,
  Search,
  Filter,
  Plus,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StaffNurseNavbar from '@/app/components/staff-nurse-dashboard/StaffNurseNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';
import { useStaffData } from '@/lib/hooks/useStaffData';

export default function StaffNurseDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const router = useRouter();
  
  // Use role validation hook to ensure only staff-nurse role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('staff-nurse');
  
  // Fetch detailed staff data for the logged-in user
  const { staffData, isLoading: staffLoading, error: staffError } = useStaffData();

  // Show loading screen while role validation or staff data is loading
  if (isLoading || staffLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 font-[family-name:var(--font-adlam-display)]">
            {isLoading ? 'Validating access permissions...' : 'Loading your data...'}
          </p>
        </div>
      </div>
    );
  }

  // If role validation failed, the hook will handle redirect
  if (!isValid || !userInfo) {
    return null;
  }

  // Show error if staff data failed to load
  if (staffError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <p className="text-lg text-gray-600 font-[family-name:var(--font-adlam-display)]">
            Error loading your data: {staffError}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Dynamic data based on logged-in user
  const nurseProfile = {
    name: staffData?.first_name && staffData?.last_name 
      ? `${staffData.first_name} ${staffData.last_name}`
      : staffData?.email 
        ? staffData.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
        : 'Loading...',
    id: 'RN-001',
    department: staffData?.department || 'ICU',
    shift: 'Day Shift',
    email: staffData?.email || 'Loading...',
    phone: staffData?.phone || '(555) 345-6789',
    avatar: staffData?.first_name && staffData?.last_name 
      ? `${staffData.first_name.charAt(0)}${staffData.last_name.charAt(0)}`.toUpperCase()
      : staffData?.email 
        ? staffData.email.substring(0, 2).toUpperCase() 
        : 'LD'
  };

  const todaySchedule = [
    { time: '07:00', activity: 'Shift Start & Handoff', location: 'ICU Station A', priority: 'high' },
    { time: '08:00', activity: 'Patient Rounds', location: 'Rooms 101-105', priority: 'high' },
    { time: '09:30', activity: 'Medication Administration', location: 'Multiple Rooms', priority: 'high' },
    { time: '11:00', activity: 'Documentation Review', location: 'Nurses Station', priority: 'medium' },
    { time: '12:00', activity: 'Lunch Break', location: 'Staff Lounge', priority: 'low' },
    { time: '13:00', activity: 'Patient Assessment', location: 'Room 103', priority: 'high' },
    { time: '14:30', activity: 'Family Conference', location: 'Conference Room B', priority: 'medium' },
    { time: '15:00', activity: 'Shift Handoff Prep', location: 'ICU Station A', priority: 'high' }
  ];

  const assignedPatients = [
    {
      id: 'P001',
      name: 'Robert Johnson',
      age: 67,
      room: '101A',
      condition: 'Post-operative care',
      priority: 'high',
      vitals: { temp: '98.6°F', bp: '120/80', hr: '75 bpm', o2: '98%' },
      lastUpdated: '10 min ago',
      alerts: ['Pain management due', 'Vital signs check']
    },
    {
      id: 'P002',
      name: 'Maria Garcia',
      age: 54,
      room: '102B',
      condition: 'Cardiac monitoring',
      priority: 'medium',
      vitals: { temp: '99.1°F', bp: '130/85', hr: '82 bpm', o2: '97%' },
      lastUpdated: '25 min ago',
      alerts: ['Medication due in 30 min']
    },
    {
      id: 'P003',
      name: 'David Chen',
      age: 43,
      room: '103A',
      condition: 'Recovery',
      priority: 'low',
      vitals: { temp: '98.4°F', bp: '118/75', hr: '70 bpm', o2: '99%' },
      lastUpdated: '1 hour ago',
      alerts: []
    }
  ];

  const messages = [
    {
      id: 1,
      from: 'Dr. Martinez',
      subject: 'Patient 101A - Medication Update',
      time: '2 hours ago',
      unread: true,
      content: 'Please update pain medication schedule for Robert Johnson. New orders attached.'
    },
    {
      id: 2,
      from: 'Charge Nurse Sarah',
      subject: 'Shift Coverage Request',
      time: '4 hours ago',
      unread: true,
      content: 'Can you cover an extra hour today? We have a call-out.'
    },
    {
      id: 3,
      from: 'HR Department',
      subject: 'Training Reminder',
      time: '1 day ago',
      unread: false,
      content: 'Reminder: CPR certification renewal due next month.'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderSchedule = () => (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center font-[family-name:var(--font-adlam-display)]">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Today's Schedule - {new Date().toLocaleDateString()}
          </h3>
          <span className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
            Day Shift (7:00 AM - 7:00 PM)
          </span>
        </div>
        
        <div className="space-y-3">
          {todaySchedule.map((item, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-16 text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">
                {item.time}
              </div>
              <div className="flex-1 ml-4">
                <div className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  {item.activity}
                </div>
                <div className="text-sm text-gray-500 flex items-center font-[family-name:var(--font-adlam-display)]">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)} font-[family-name:var(--font-adlam-display)]`}>
                {item.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Week View */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          This Week
        </h3>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2 font-[family-name:var(--font-adlam-display)]">{day}</div>
              <div className={`p-2 rounded-lg text-sm ${index === 2 ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-600'} font-[family-name:var(--font-adlam-display)]`}>
                {index < 5 ? 'Day Shift' : index === 5 ? 'Night Shift' : 'Off'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Assigned Patients</p>
              <p className="text-2xl font-bold text-blue-600 font-[family-name:var(--font-adlam-display)]">{assignedPatients.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">High Priority</p>
              <p className="text-2xl font-bold text-red-600 font-[family-name:var(--font-adlam-display)]">
                {assignedPatients.filter(p => p.priority === 'high').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Active Alerts</p>
              <p className="text-2xl font-bold text-orange-600 font-[family-name:var(--font-adlam-display)]">
                {assignedPatients.reduce((total, p) => total + p.alerts.length, 0)}
              </p>
            </div>
            <Bell className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
            My Patients
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {assignedPatients.map((patient) => (
            <div key={patient.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                        {patient.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-[family-name:var(--font-adlam-display)]">Age: {patient.age}</span>
                        <span className="font-[family-name:var(--font-adlam-display)]">Room: {patient.room}</span>
                        <span className="font-[family-name:var(--font-adlam-display)]">ID: {patient.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                        Condition: {patient.condition}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {patient.alerts.map((alert, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 font-[family-name:var(--font-adlam-display)]">
                            <Bell className="w-3 h-3 mr-1" />
                            {alert}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">Vital Signs</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <Thermometer className="w-3 h-3 text-gray-400" />
                          <span className="font-[family-name:var(--font-adlam-display)]">{patient.vitals.temp}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3 text-red-400" />
                          <span className="font-[family-name:var(--font-adlam-display)]">{patient.vitals.hr}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span className="font-[family-name:var(--font-adlam-display)]">{patient.vitals.bp}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-400 font-[family-name:var(--font-adlam-display)]">O₂:</span>
                          <span className="font-[family-name:var(--font-adlam-display)]">{patient.vitals.o2}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority)} font-[family-name:var(--font-adlam-display)]`}>
                    {patient.priority} priority
                  </span>
                  <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    Updated {patient.lastUpdated}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium font-[family-name:var(--font-adlam-display)]">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSelfEvaluation = () => (
    <div className="space-y-6">
      {/* Evaluation Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Self-Evaluation Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 font-[family-name:var(--font-adlam-display)]">4.2</div>
            <div className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Overall Rating</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 font-[family-name:var(--font-adlam-display)]">8</div>
            <div className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Completed Evaluations</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 font-[family-name:var(--font-adlam-display)]">2</div>
            <div className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Pending Reviews</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 font-[family-name:var(--font-adlam-display)]">12</div>
            <div className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Skills Assessed</div>
          </div>
        </div>
      </div>

      {/* Current Evaluation */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
            Monthly Self-Assessment
          </h3>
          <span className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">Due: Dec 31, 2024</span>
        </div>

        <div className="space-y-6">
          {[
            { category: 'Patient Care', score: 4, description: 'Quality of patient interactions and care delivery' },
            { category: 'Clinical Skills', score: 5, description: 'Technical nursing competencies and procedures' },
            { category: 'Communication', score: 4, description: 'Team collaboration and patient communication' },
            { category: 'Documentation', score: 3, description: 'Accuracy and timeliness of medical records' },
            { category: 'Professional Development', score: 4, description: 'Continuing education and skill improvement' }
          ].map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{item.category}</h4>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= item.score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                    {item.score}/5
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
            Save Progress
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-[family-name:var(--font-adlam-display)]">
            Submit Evaluation
          </button>
        </div>
      </div>

      {/* Goal Setting */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Professional Goals
        </h3>
        <div className="space-y-3">
          {[
            { goal: 'Complete ACLS certification renewal', progress: 80, dueDate: 'Jan 15, 2024' },
            { goal: 'Improve medication administration time', progress: 60, dueDate: 'Ongoing' },
            { goal: 'Mentor new nursing staff', progress: 40, dueDate: 'Mar 1, 2024' }
          ].map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{item.goal}</span>
                <span className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">Due: {item.dueDate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                {item.progress}% complete
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      {/* Message Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Unread Messages</p>
              <p className="text-2xl font-bold text-blue-600 font-[family-name:var(--font-adlam-display)]">
                {messages.filter(m => m.unread).length}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">{messages.length}</p>
            </div>
            <Mail className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <button 
            onClick={() => setShowMessageModal(true)}
            className="w-full h-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="font-medium font-[family-name:var(--font-adlam-display)]">New Message</span>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
            Messages
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {messages.map((message) => (
            <div key={message.id} className={`p-6 hover:bg-gray-50 cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${message.unread ? 'text-gray-900' : 'text-gray-700'} font-[family-name:var(--font-adlam-display)]`}>
                        {message.from}
                      </h4>
                      <p className={`text-sm ${message.unread ? 'font-medium text-gray-900' : 'text-gray-600'} font-[family-name:var(--font-adlam-display)]`}>
                        {message.subject}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-11 font-[family-name:var(--font-adlam-display)]">
                    {message.content}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">{message.time}</span>
                  {message.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={nurseProfile.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Employee ID
            </label>
            <input
              type="text"
              defaultValue={nurseProfile.id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Email
            </label>
            <input
              type="email"
              defaultValue={nurseProfile.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Phone
            </label>
            <input
              type="tel"
              defaultValue={nurseProfile.phone}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
            Save Changes
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]">
            Cancel
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center font-[family-name:var(--font-adlam-display)]">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Email Notifications</h4>
              <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Receive email alerts for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">SMS Alerts</h4>
              <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Get text messages for urgent notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Dark Mode</h4>
              <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Switch to dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Security
        </h3>
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Change Password</h4>
                <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Update your login password</p>
              </div>
              <Edit3 className="w-5 h-5 text-gray-400" />
            </div>
          </button>
          
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Add an extra layer of security</p>
              </div>
              <span className="text-sm text-green-600 font-medium font-[family-name:var(--font-adlam-display)]">Enabled</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assigned Patients</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Staff Nurse Navbar Component */}
      <StaffNurseNavbar activeTab={activeTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header - Same pattern as admin dashboard */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Staff Nurse Dashboard
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Welcome to your nursing dashboard
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                {assignedPatients.reduce((total, p) => total + p.alerts.length, 0) > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                )}
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'schedule' && (() => { router.push('/staff-nurse-dashboard/schedule'); return null; })()}
          {activeTab === 'patients' && (() => { router.push('/staff-nurse-dashboard/patients'); return null; })()}
          {activeTab === 'self-evaluation' && (() => { router.push('/staff-nurse-dashboard/self-evaluation'); return null; })()}
          {activeTab === 'messages' && (() => { router.push('/staff-nurse-dashboard/messages'); return null; })()}
          {activeTab === 'settings' && (() => { router.push('/staff-nurse-dashboard/settings'); return null; })()}
        </main>
      </div>

      {/* New Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                New Message
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    To
                  </label>
                  <select
                    defaultValue=""
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                  >
                    <option value="">Select recipient...</option>
                    <option value="charge-nurse">Charge Nurse</option>
                    <option value="doctor">Dr. Martinez</option>
                    <option value="hr">HR Department</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Message
                  </label>
                  <textarea
                    defaultValue=""
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                    placeholder="Type your message here..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
