'use client';

import React from 'react';
import {
  GraduationCap,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Calendar,
  Users,
  FileText,
  Award
} from 'lucide-react';
import HRSpecialistNavbar from '@/app/components/hr-specialist-dashboard/HRSpecialistNavbar';

export default function HROnboardingPage() {
  const activeTab = 'onboarding';

  const onboardingStats = [
    { metric: 'New Hires', value: '12', change: '+3', color: 'text-blue-600' },
    { metric: 'Completed', value: '8', change: '+2', color: 'text-green-600' },
    { metric: 'In Progress', value: '4', change: '+1', color: 'text-yellow-600' },
    { metric: 'Pending', value: '0', change: '0', color: 'text-gray-600' }
  ];

  const onboardingProcesses = [
    { id: 1, employee: 'Jennifer Martinez', role: 'Staff Nurse', startDate: '2024-01-15', status: 'in_progress', progress: 75, nextStep: 'Final Documentation' },
    { id: 2, employee: 'Robert Kim', role: 'Nurse Manager', startDate: '2024-01-10', status: 'completed', progress: 100, nextStep: 'Completed' },
    { id: 3, employee: 'Amanda Davis', role: 'HR Specialist', startDate: '2024-01-08', status: 'completed', progress: 100, nextStep: 'Completed' },
    { id: 4, employee: 'Michael Brown', role: 'Marketing Coordinator', startDate: '2024-01-05', status: 'in_progress', progress: 50, nextStep: 'Training Completion' }
  ];

  const onboardingSteps = [
    { id: 1, step: 'Welcome & Orientation', status: 'completed', employee: 'Jennifer Martinez', date: '2024-01-15' },
    { id: 2, step: 'Documentation Review', status: 'completed', employee: 'Jennifer Martinez', date: '2024-01-16' },
    { id: 3, step: 'Training Program', status: 'in_progress', employee: 'Jennifer Martinez', date: '2024-01-17' },
    { id: 4, step: 'Final Documentation', status: 'pending', employee: 'Jennifer Martinez', date: '2024-01-18' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HRSpecialistNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Onboarding</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage new employee onboarding processes</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Start Onboarding
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {onboardingStats.map((stat, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Onboarding Processes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {onboardingProcesses.map((process) => (
                    <div key={process.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {process.employee.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{process.employee}</h4>
                          <p className="text-sm text-gray-500">{process.role} • Started: {new Date(process.startDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Next: {process.nextStep}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{process.progress}%</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${process.progress}%` }}></div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          process.status === 'completed' ? 'bg-green-100 text-green-800' :
                          process.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {process.status.replace('_', ' ')}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Onboarding Steps</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {onboardingSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          step.status === 'completed' ? 'bg-green-100' :
                          step.status === 'in_progress' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          {step.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           step.status === 'in_progress' ? <Clock className="w-5 h-5 text-yellow-600" /> :
                           <AlertCircle className="w-5 h-5 text-gray-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{step.step}</h4>
                          <p className="text-sm text-gray-500">{step.employee} • {new Date(step.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        step.status === 'completed' ? 'bg-green-100 text-green-800' :
                        step.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status.replace('_', ' ')}
                      </span>
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
