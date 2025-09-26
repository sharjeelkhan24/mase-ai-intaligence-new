'use client';

import React from 'react';
import {
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

export default function QAQualityChecksPage() {
  const activeTab = 'quality-checks';

  const qualityStats = [
    { metric: 'Total Checks', value: '156', change: '+12', color: 'text-blue-600' },
    { metric: 'Passed', value: '142', change: '+8', color: 'text-green-600' },
    { metric: 'Failed', value: '8', change: '-2', color: 'text-red-600' },
    { metric: 'Pending', value: '6', change: '+1', color: 'text-yellow-600' }
  ];

  const qualityChecks = [
    { id: 1, check: 'Hand Hygiene Compliance', department: 'ICU', status: 'passed', score: 95, date: '2024-01-15', nurse: 'Sarah Johnson', notes: 'Excellent compliance observed' },
    { id: 2, check: 'Medication Administration', department: 'Emergency', status: 'failed', score: 78, date: '2024-01-14', nurse: 'Mike Chen', notes: 'Documentation incomplete' },
    { id: 3, check: 'Patient Safety Protocols', department: 'Medical-Surgical', status: 'passed', score: 92, date: '2024-01-13', nurse: 'Emily Rodriguez', notes: 'All protocols followed correctly' },
    { id: 4, check: 'Infection Control', department: 'ICU', status: 'pending', score: 0, date: '2024-01-16', nurse: 'David Wilson', notes: 'Scheduled for review' }
  ];

  const recentActivities = [
    { id: 1, activity: 'Quality check completed for Hand Hygiene', date: '2024-01-15', user: 'Sarah Johnson', department: 'ICU' },
    { id: 2, activity: 'Failed check identified in Medication Administration', date: '2024-01-14', user: 'Mike Chen', department: 'Emergency' },
    { id: 3, activity: 'Patient Safety Protocols review completed', date: '2024-01-13', user: 'Emily Rodriguez', department: 'Medical-Surgical' },
    { id: 4, activity: 'Infection Control check scheduled', date: '2024-01-12', user: 'David Wilson', department: 'ICU' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QANurseNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Quality Checks</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Monitor and track quality assurance checks</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              New Check
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityStats.map((stat, index) => (
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search quality checks..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Departments</option>
                  <option>ICU</option>
                  <option>Emergency</option>
                  <option>Medical-Surgical</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Status</option>
                  <option>Passed</option>
                  <option>Failed</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Quality Checks</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {qualityChecks.map((check) => (
                    <div key={check.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          check.status === 'passed' ? 'bg-green-100' :
                          check.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {check.status === 'passed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           check.status === 'failed' ? <XCircle className="w-5 h-5 text-red-600" /> :
                           <Clock className="w-5 h-5 text-yellow-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{check.check}</h4>
                          <p className="text-sm text-gray-500">{check.department} • {check.nurse} • {new Date(check.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{check.notes}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{check.score}%</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${
                              check.score >= 90 ? 'bg-green-600' :
                              check.score >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                            }`} style={{ width: `${check.score}%` }}></div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          check.status === 'passed' ? 'bg-green-100 text-green-800' :
                          check.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Activities</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{activity.activity}</h4>
                          <p className="text-sm text-gray-500">{activity.department} • By {activity.user} • {new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
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

