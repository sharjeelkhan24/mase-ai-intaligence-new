'use client';

import React from 'react';
import {
  Users,
  Heart,
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  Search,
  Filter
} from 'lucide-react';
import StaffNurseNavbar from '@/app/components/staff-nurse-dashboard/StaffNurseNavbar';

export default function StaffNursePatientsPage() {
  // Sample patient data
  const assignedPatients = [
    {
      id: 'P001',
      name: 'John Smith',
      age: 65,
      room: '101A',
      condition: 'Post-surgical recovery',
      priority: 'high',
      vitals: {
        temperature: 98.6,
        bloodPressure: '120/80',
        heartRate: 72,
        oxygen: 98
      },
      medications: ['Morphine 5mg', 'Antibiotics'],
      lastChecked: '2 hours ago',
      alerts: ['Pain level 7/10', 'Medication due']
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      age: 42,
      room: '102B',
      condition: 'Diabetes management',
      priority: 'medium',
      vitals: {
        temperature: 97.8,
        bloodPressure: '110/70',
        heartRate: 68,
        oxygen: 99
      },
      medications: ['Insulin', 'Metformin'],
      lastChecked: '1 hour ago',
      alerts: ['Blood sugar check needed']
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      age: 78,
      room: '103A',
      condition: 'Cardiac monitoring',
      priority: 'high',
      vitals: {
        temperature: 99.2,
        bloodPressure: '140/90',
        heartRate: 85,
        oxygen: 95
      },
      medications: ['Cardiac medications', 'Blood thinners'],
      lastChecked: '30 minutes ago',
      alerts: ['Blood pressure elevated', 'Heart rate irregular']
    }
  ];

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

  const getVitalStatus = (vital: string, value: any) => {
    switch (vital) {
      case 'temperature':
        return value > 99.5 ? 'text-red-600' : value < 97.0 ? 'text-blue-600' : 'text-green-600';
      case 'bloodPressure':
        const [systolic] = value.split('/');
        return parseInt(systolic) > 140 ? 'text-red-600' : parseInt(systolic) < 90 ? 'text-blue-600' : 'text-green-600';
      case 'heartRate':
        return value > 100 ? 'text-red-600' : value < 60 ? 'text-blue-600' : 'text-green-600';
      case 'oxygen':
        return value < 95 ? 'text-red-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Staff Nurse Navbar Component */}
      <StaffNurseNavbar activeTab="patients" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Patient Care
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Monitor and care for your assigned patients
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
                  placeholder="Search patients..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Patient Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{assignedPatients.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assignedPatients.filter(p => p.priority === 'high').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Medications Due</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assignedPatients.reduce((total, p) => total + p.alerts.filter(a => a.includes('Medication')).length, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Stable</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assignedPatients.filter(p => p.priority === 'low').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {assignedPatients.map((patient) => (
                <div key={patient.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    {/* Patient Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.age} years • Room {patient.room}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(patient.priority)}`}>
                        {patient.priority.toUpperCase()}
                      </span>
                    </div>

                    {/* Condition */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Condition</p>
                      <p className="text-sm font-medium text-gray-900">{patient.condition}</p>
                    </div>

                    {/* Vitals */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Vital Signs</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium ${getVitalStatus('temperature', patient.vitals.temperature)}`}>
                            {patient.vitals.temperature}°F
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium ${getVitalStatus('bloodPressure', patient.vitals.bloodPressure)}`}>
                            {patient.vitals.bloodPressure}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium ${getVitalStatus('heartRate', patient.vitals.heartRate)}`}>
                            {patient.vitals.heartRate} bpm
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm font-medium ${getVitalStatus('oxygen', patient.vitals.oxygen)}`}>
                            {patient.vitals.oxygen}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medications */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current Medications</p>
                      <div className="space-y-1">
                        {patient.medications.map((med, index) => (
                          <div key={index} className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                            {med}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alerts */}
                    {patient.alerts.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Alerts</p>
                        <div className="space-y-1">
                          {patient.alerts.map((alert, index) => (
                            <div key={index} className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{alert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Last Checked */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Last checked: {patient.lastChecked}</span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
