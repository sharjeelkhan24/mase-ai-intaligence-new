'use client';

import React from 'react';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Eye,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import MarketingSpecialistNavbar from '@/app/components/marketing-specialist-dashboard/MarketingSpecialistNavbar';

export default function ReportsPage() {
  const activeTab = 'reports';

  // Sample reports data
  const reports = [
    { id: 1, name: 'Monthly Marketing Performance', type: 'Performance Report', date: '2024-01-15', status: 'completed', size: '2.4 MB' },
    { id: 2, name: 'Social Media Analytics', type: 'Analytics Report', date: '2024-01-10', status: 'completed', size: '1.8 MB' },
    { id: 3, name: 'Email Campaign Results', type: 'Campaign Report', date: '2024-01-08', status: 'completed', size: '3.2 MB' },
    { id: 4, name: 'Website Traffic Analysis', type: 'Traffic Report', date: '2024-01-05', status: 'completed', size: '4.1 MB' },
    { id: 5, name: 'Patient Outreach Summary', type: 'Outreach Report', date: '2024-01-03', status: 'completed', size: '2.7 MB' },
    { id: 6, name: 'Q1 Marketing Overview', type: 'Quarterly Report', date: '2024-01-01', status: 'completed', size: '5.3 MB' }
  ];

  const reportTemplates = [
    { id: 1, name: 'Monthly Performance Report', description: 'Comprehensive monthly marketing performance analysis', category: 'Performance' },
    { id: 2, name: 'Campaign Effectiveness Report', description: 'Detailed analysis of marketing campaign effectiveness', category: 'Campaigns' },
    { id: 3, name: 'Social Media Insights', description: 'Social media performance and engagement insights', category: 'Social Media' },
    { id: 4, name: 'Website Analytics Report', description: 'Website traffic and conversion analysis', category: 'Analytics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Marketing Specialist Navbar Component */}
      <MarketingSpecialistNavbar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Marketing Reports
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Generate and manage marketing performance reports
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Report Filters */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Types</option>
                  <option>Performance Report</option>
                  <option>Analytics Report</option>
                  <option>Campaign Report</option>
                  <option>Traffic Report</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Dates</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-[family-name:var(--font-adlam-display)]">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Reports</h3>
                <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
              </div>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{report.name}</h4>
                        <p className="text-sm text-gray-500">{report.type} • {report.date} • {report.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Templates */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Report Templates</h3>
                <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">Create Template</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{template.name}</h4>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{template.category}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-[family-name:var(--font-adlam-display)]">
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">6</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Templates</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
