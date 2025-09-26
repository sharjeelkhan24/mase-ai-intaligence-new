'use client';

import React from 'react';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  Eye,
  Edit,
  Plus,
  Users,
  Clock,
  Award
} from 'lucide-react';
import HRDirectorNavbar from '@/app/components/hr-director-dashboard/HRDirectorNavbar';

export default function CompliancePage() {
  const activeTab = 'compliance';

  const complianceStats = [
    { metric: 'Compliance Rate', value: '96%', change: '+2%', color: 'text-green-600' },
    { metric: 'Active Policies', value: '24', change: '+1', color: 'text-blue-600' },
    { metric: 'Violations', value: '3', change: '-1', color: 'text-red-600' },
    { metric: 'Training Completed', value: '94%', change: '+5%', color: 'text-purple-600' }
  ];

  const complianceItems = [
    { id: 1, title: 'HIPAA Compliance', status: 'compliant', lastReview: '2024-01-10', nextReview: '2024-04-10', violations: 0, department: 'All' },
    { id: 2, title: 'OSHA Safety Standards', status: 'compliant', lastReview: '2024-01-05', nextReview: '2024-04-05', violations: 0, department: 'All' },
    { id: 3, title: 'Medicare Billing', status: 'warning', lastReview: '2024-01-08', nextReview: '2024-04-08', violations: 1, department: 'Billing' },
    { id: 4, title: 'Staff Credentials', status: 'compliant', lastReview: '2024-01-12', nextReview: '2024-04-12', violations: 0, department: 'HR' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HRDirectorNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Compliance Management</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Monitor and manage regulatory compliance</p>
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
                  {complianceItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          item.status === 'compliant' ? 'bg-green-100' :
                          item.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {item.status === 'compliant' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           item.status === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> :
                           <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.department} • Next review: {new Date(item.nextReview).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'compliant' ? 'bg-green-100 text-green-800' :
                          item.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
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
