'use client';

import React from 'react';
import {
  Gift,
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

export default function HRBenefitsPage() {
  const activeTab = 'benefits';

  const benefitsStats = [
    { metric: 'Total Benefits', value: '12', change: '+2', color: 'text-blue-600' },
    { metric: 'Active Enrollments', value: '156', change: '+8', color: 'text-green-600' },
    { metric: 'Pending Approvals', value: '4', change: '-1', color: 'text-yellow-600' },
    { metric: 'Coverage Rate', value: '94%', change: '+2%', color: 'text-purple-600' }
  ];

  const benefits = [
    { id: 1, name: 'Health Insurance', type: 'Medical', status: 'active', enrollments: 156, coverage: '94%', cost: '$450/month' },
    { id: 2, name: 'Dental Insurance', type: 'Dental', status: 'active', enrollments: 142, coverage: '89%', cost: '$85/month' },
    { id: 3, name: 'Vision Insurance', type: 'Vision', status: 'active', enrollments: 128, coverage: '80%', cost: '$45/month' },
    { id: 4, name: 'Retirement Plan', type: 'Retirement', status: 'active', enrollments: 134, coverage: '84%', cost: '$200/month' },
    { id: 5, name: 'Life Insurance', type: 'Life', status: 'active', enrollments: 148, coverage: '93%', cost: '$25/month' }
  ];

  const recentEnrollments = [
    { id: 1, employee: 'Sarah Johnson', benefit: 'Health Insurance', status: 'enrolled', date: '2024-01-15', effectiveDate: '2024-02-01' },
    { id: 2, employee: 'Mike Chen', benefit: 'Dental Insurance', status: 'pending', date: '2024-01-14', effectiveDate: '2024-02-01' },
    { id: 3, employee: 'Emily Rodriguez', benefit: 'Vision Insurance', status: 'enrolled', date: '2024-01-13', effectiveDate: '2024-02-01' },
    { id: 4, employee: 'David Wilson', benefit: 'Retirement Plan', status: 'enrolled', date: '2024-01-12', effectiveDate: '2024-02-01' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HRSpecialistNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Benefits</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage employee benefits and enrollments</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Benefit
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefitsStats.map((stat, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Benefits Overview</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Gift className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{benefit.name}</h4>
                          <p className="text-sm text-gray-500">{benefit.type} • {benefit.enrollments} enrollments • {benefit.coverage} coverage</p>
                          <p className="text-sm text-gray-500">Cost: {benefit.cost}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          benefit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {benefit.status}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Enrollments</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {enrollment.employee.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{enrollment.employee}</h4>
                          <p className="text-sm text-gray-500">{enrollment.benefit}</p>
                          <p className="text-xs text-gray-400">Enrolled: {new Date(enrollment.date).toLocaleDateString()} • Effective: {new Date(enrollment.effectiveDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          enrollment.status === 'enrolled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {enrollment.status}
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
