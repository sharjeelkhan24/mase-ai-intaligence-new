'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Bell
} from 'lucide-react';
import StaffNurseNavbar from '@/app/components/staff-nurse-dashboard/StaffNurseNavbar';

export default function StaffNurseSchedulePage() {
  // Sample schedule data
  const todaySchedule = [
    { 
      time: '07:00', 
      activity: 'Shift Start & Handoff', 
      location: 'ICU Station A', 
      priority: 'high',
      duration: '30 min',
      status: 'completed'
    },
    { 
      time: '08:00', 
      activity: 'Patient Rounds', 
      location: 'Rooms 101-105', 
      priority: 'high',
      duration: '1 hour',
      status: 'in-progress'
    },
    { 
      time: '09:30', 
      activity: 'Medication Administration', 
      location: 'Multiple Rooms', 
      priority: 'high',
      duration: '45 min',
      status: 'upcoming'
    },
    { 
      time: '10:30', 
      activity: 'Break', 
      location: 'Staff Lounge', 
      priority: 'low',
      duration: '15 min',
      status: 'upcoming'
    },
    { 
      time: '11:00', 
      activity: 'Documentation', 
      location: 'Nursing Station', 
      priority: 'medium',
      duration: '1 hour',
      status: 'upcoming'
    },
    { 
      time: '12:00', 
      activity: 'Lunch Break', 
      location: 'Cafeteria', 
      priority: 'low',
      duration: '30 min',
      status: 'upcoming'
    },
    { 
      time: '13:00', 
      activity: 'Patient Care', 
      location: 'Rooms 101-105', 
      priority: 'high',
      duration: '2 hours',
      status: 'upcoming'
    },
    { 
      time: '15:00', 
      activity: 'Shift Handoff', 
      location: 'ICU Station A', 
      priority: 'high',
      duration: '30 min',
      status: 'upcoming'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'upcoming':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      case 'upcoming':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Staff Nurse Navbar Component */}
      <StaffNurseNavbar activeTab="schedule" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Schedule Management
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage your daily schedule and assignments
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search schedule..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Schedule Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900">6</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Today's Schedule - {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {todaySchedule.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${getStatusColor(item.status)} transition-all duration-200 hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(item.status)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                                {item.time}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                                {item.priority.toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-base font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                              {item.activity}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{item.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-medium capitalize ${
                            item.status === 'completed' ? 'text-green-600' :
                            item.status === 'in-progress' ? 'text-blue-600' :
                            'text-gray-500'
                          }`}>
                            {item.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
