'use client';

import React from 'react';
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Calendar,
  Users,
  FileText,
  Award
} from 'lucide-react';
import HRSpecialistNavbar from '@/app/components/hr-specialist-dashboard/HRSpecialistNavbar';

export default function HRCompliancePage() {
  const activeTab = 'compliance';

  const complianceStats = [
    { metric: 'Compliance Rate', value: '98.5%', change: '+1.2%', color: 'text-green-600' },
    { metric: 'Active Policies', value: '24', change: '+2', color: 'text-blue-600' },
    { metric: 'Pending Reviews', value: '3', change: '-1', color: 'text-yellow-600' },
    { metric: 'Violations', value: '0', change: '0', color: 'text-red-600' }
  ];

  const compliancePolicies = [
    { id: 1, name: 'Employee Handbook', type: 'Policy', status: 'active', lastReview: '2024-01-10', nextReview: '2024-07-10', compliance: '100%' },
    { id: 2, name: 'Safety Protocols', type: 'Safety', status: 'active', lastReview: '2024-01-08', nextReview: '2024-04-08', compliance: '98%' },
    { id: 3, name: 'Anti-Discrimination Policy', type: 'Legal', status: 'active', lastReview: '2024-01-05', nextReview: '2024-07-05', compliance: '100%' },
    { id: 4, name: 'Data Privacy Policy', type: 'Privacy', status: 'pending_review', lastReview: '2023-12-15', nextReview: '2024-01-15', compliance: '95%' }
  ];

  const complianceChecks = [
    { id: 1, check: 'Background Check Compliance', status: 'completed', date: '2024-01-15', employee: 'Sarah Johnson', result: 'Passed' },
    { id: 2, check: 'Training Certification', status: 'completed', date: '2024-01-14', employee: 'Mike Chen', result: 'Passed' },
    { id: 3, check: 'License Verification', status: 'pending', date: '2024-01-16', employee: 'Emily Rodriguez', result: 'Pending' },
    { id: 4, check: 'Drug Screening', status: 'completed', date: '2024-01-13', employee: 'David Wilson', result: 'Passed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HRSpecialistNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Compliance</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage HR compliance and policies</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Policy
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {complianceStats.map((stat, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Compliance Policies</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {compliancePolicies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          policy.status === 'active' ? 'bg-green-100' :
                          policy.status === 'pending_review' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {policy.status === 'active' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           policy.status === 'pending_review' ? <Clock className="w-5 h-5 text-yellow-600" /> :
                           <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{policy.name}</h4>
                          <p className="text-sm text-gray-500">{policy.type} • Compliance: {policy.compliance}</p>
                          <p className="text-sm text-gray-500">Last review: {new Date(policy.lastReview).toLocaleDateString()} • Next: {new Date(policy.nextReview).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          policy.status === 'active' ? 'bg-green-100 text-green-800' :
                          policy.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {policy.status.replace('_', ' ')}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Compliance Checks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {complianceChecks.map((check) => (
                    <div key={check.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          check.status === 'completed' ? 'bg-green-100' :
                          check.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {check.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           check.status === 'pending' ? <Clock className="w-5 h-5 text-yellow-600" /> :
                           <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{check.check}</h4>
                          <p className="text-sm text-gray-500">{check.employee} • {new Date(check.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Result: {check.result}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          check.status === 'completed' ? 'bg-green-100 text-green-800' :
                          check.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {check.status}
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
          </div>
        </main>
      </div>
    </div>
  );
}
