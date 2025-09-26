'use client';

import React from 'react';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  Users,
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';

export default function QACompliancePage() {
  const activeTab = 'compliance';

  const complianceStats = [
    { metric: 'Compliance Rate', value: '96.8%', change: '+2.1%', color: 'text-green-600' },
    { metric: 'Active Policies', value: '18', change: '+1', color: 'text-blue-600' },
    { metric: 'Violations', value: '3', change: '-1', color: 'text-red-600' },
    { metric: 'Pending Reviews', value: '5', change: '+2', color: 'text-yellow-600' }
  ];

  const complianceItems = [
    { id: 1, policy: 'Hand Hygiene Protocol', department: 'All Units', status: 'compliant', lastCheck: '2024-01-15', nextReview: '2024-02-15', violations: 0 },
    { id: 2, policy: 'Medication Administration', department: 'ICU', status: 'non_compliant', lastCheck: '2024-01-14', nextReview: '2024-02-14', violations: 2 },
    { id: 3, policy: 'Patient Safety Standards', department: 'Emergency', status: 'compliant', lastCheck: '2024-01-13', nextReview: '2024-02-13', violations: 0 },
    { id: 4, policy: 'Infection Control', department: 'Medical-Surgical', status: 'pending', lastCheck: '2024-01-16', nextReview: '2024-02-16', violations: 0 }
  ];

  const recentViolations = [
    { id: 1, policy: 'Medication Administration', department: 'ICU', nurse: 'Mike Chen', date: '2024-01-14', severity: 'medium', description: 'Incomplete documentation' },
    { id: 2, policy: 'Hand Hygiene Protocol', department: 'Emergency', nurse: 'Sarah Johnson', date: '2024-01-12', severity: 'low', description: 'Missed hand sanitizer step' },
    { id: 3, policy: 'Patient Safety Standards', department: 'Medical-Surgical', nurse: 'Emily Rodriguez', date: '2024-01-10', severity: 'high', description: 'Safety protocol not followed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QANurseNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Compliance</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Monitor compliance with policies and standards</p>
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Compliance Overview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {complianceItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          item.status === 'compliant' ? 'bg-green-100' :
                          item.status === 'non_compliant' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {item.status === 'compliant' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           item.status === 'non_compliant' ? <XCircle className="w-5 h-5 text-red-600" /> :
                           <Clock className="w-5 h-5 text-yellow-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{item.policy}</h4>
                          <p className="text-sm text-gray-500">{item.department} • Last check: {new Date(item.lastCheck).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Next review: {new Date(item.nextReview).toLocaleDateString()} • Violations: {item.violations}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'compliant' ? 'bg-green-100 text-green-800' :
                          item.status === 'non_compliant' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status.replace('_', ' ')}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Violations</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentViolations.map((violation) => (
                    <div key={violation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          violation.severity === 'high' ? 'bg-red-100' :
                          violation.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {violation.severity === 'high' ? <XCircle className="w-5 h-5 text-red-600" /> :
                           violation.severity === 'medium' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> :
                           <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{violation.policy}</h4>
                          <p className="text-sm text-gray-500">{violation.department} • {violation.nurse} • {new Date(violation.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{violation.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          violation.severity === 'high' ? 'bg-red-100 text-red-800' :
                          violation.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {violation.severity}
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

