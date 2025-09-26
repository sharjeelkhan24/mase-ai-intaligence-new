'use client';

import React from 'react';
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
  Phone
} from 'lucide-react';
import NurseManagerNavbar from '@/app/components/nurse-manager-dashboard/NurseManagerNavbar';

export default function PatientCarePage() {
  const activeTab = 'patient-care';

  const careStats = [
    { metric: 'Total Patients', value: '89', change: '+5', color: 'text-blue-600' },
    { metric: 'Critical Patients', value: '12', change: '+2', color: 'text-red-600' },
    { metric: 'Discharges Today', value: '8', change: '+1', color: 'text-green-600' },
    { metric: 'Average Stay', value: '4.2 days', change: '-0.3', color: 'text-purple-600' }
  ];

  const patients = [
    { id: 1, name: 'John Smith', room: '201A', condition: 'Stable', priority: 'medium', admissionDate: '2024-01-15', assignedNurse: 'Sarah Johnson', diagnosis: 'Pneumonia' },
    { id: 2, name: 'Mary Johnson', room: '305B', condition: 'Critical', priority: 'high', admissionDate: '2024-01-14', assignedNurse: 'Mike Chen', diagnosis: 'Heart Attack' },
    { id: 3, name: 'Robert Davis', room: '102C', condition: 'Improving', priority: 'low', admissionDate: '2024-01-13', assignedNurse: 'Emily Rodriguez', diagnosis: 'Broken Leg' },
    { id: 4, name: 'Lisa Wilson', room: '408A', condition: 'Stable', priority: 'medium', admissionDate: '2024-01-12', assignedNurse: 'David Wilson', diagnosis: 'Diabetes Management' }
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
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
                  {patients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{patient.name}</h4>
                          <p className="text-sm text-gray-500">Room {patient.room} • {patient.diagnosis}</p>
                          <p className="text-sm text-gray-500">Nurse: {patient.assignedNurse} • Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.condition === 'Critical' ? 'bg-red-100 text-red-800' :
                          patient.condition === 'Stable' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.condition}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.priority === 'high' ? 'bg-red-100 text-red-800' :
                          patient.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.priority}
                        </span>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
    </div>
  );
}
