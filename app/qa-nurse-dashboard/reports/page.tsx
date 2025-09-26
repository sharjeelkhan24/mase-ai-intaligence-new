'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  Filter,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';

export default function QAReportsPage() {
  const activeTab = 'reports';

  const reportStats = [
    { metric: 'Total Reports', value: '45', change: '+8', color: 'text-blue-600' },
    { metric: 'Generated This Month', value: '12', change: '+3', color: 'text-green-600' },
    { metric: 'Scheduled Reports', value: '8', change: '+2', color: 'text-purple-600' },
    { metric: 'Pending Approval', value: '3', change: '-1', color: 'text-yellow-600' }
  ];

  const reports = [
    { id: 1, title: 'Monthly Quality Metrics Report', type: 'Quality', status: 'completed', generatedDate: '2024-01-15', period: 'December 2023', department: 'All Units', size: '2.3 MB' },
    { id: 2, title: 'Compliance Audit Report', type: 'Compliance', status: 'completed', generatedDate: '2024-01-14', period: 'Q4 2023', department: 'ICU', size: '1.8 MB' },
    { id: 3, title: 'Training Completion Report', type: 'Training', status: 'pending', generatedDate: '2024-01-16', period: 'January 2024', department: 'All Units', size: '0 MB' },
    { id: 4, title: 'Incident Analysis Report', type: 'Incident', status: 'completed', generatedDate: '2024-01-12', period: 'December 2023', department: 'Emergency', size: '3.1 MB' }
  ];

  const recentActivities = [
    { id: 1, activity: 'Monthly Quality Metrics Report generated', date: '2024-01-15', user: 'Sarah Johnson', department: 'All Units' },
    { id: 2, activity: 'Compliance Audit Report completed', date: '2024-01-14', user: 'Mike Chen', department: 'ICU' },
    { id: 3, activity: 'Training Completion Report scheduled', date: '2024-01-13', user: 'Emily Rodriguez', department: 'All Units' },
    { id: 4, activity: 'Incident Analysis Report approved', date: '2024-01-12', user: 'David Wilson', department: 'Emergency' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QANurseNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Reports</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Generate and manage quality assurance reports</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Generate Report
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reportStats.map((stat, index) => (
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
                    <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Types</option>
                  <option>Quality</option>
                  <option>Compliance</option>
                  <option>Training</option>
                  <option>Incident</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Approved</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Reports</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{report.title}</h4>
                          <p className="text-sm text-gray-500">{report.type} • {report.department} • {report.period}</p>
                          <p className="text-sm text-gray-500">Generated: {new Date(report.generatedDate).toLocaleDateString()} • Size: {report.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          report.status === 'completed' ? 'bg-green-100 text-green-800' :
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="w-4 h-4" />
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
                          <BarChart3 className="w-5 h-5 text-blue-600" />
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

