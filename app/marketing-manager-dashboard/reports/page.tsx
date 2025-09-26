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
import MarketingManagerNavbar from '@/app/components/marketing-manager-dashboard/MarketingManagerNavbar';

export default function MarketingReportsPage() {
  const activeTab = 'reports';

  const reports = [
    { id: 1, name: 'Monthly Marketing Summary', type: 'Marketing Report', date: '2024-01-15', status: 'completed', size: '2.4 MB' },
    { id: 2, name: 'Campaign Performance Analysis', type: 'Campaign Report', date: '2024-01-10', status: 'completed', size: '1.8 MB' },
    { id: 3, name: 'Patient Feedback Analysis', type: 'Feedback Report', date: '2024-01-08', status: 'completed', size: '3.2 MB' },
    { id: 4, name: 'Brand Performance Review', type: 'Brand Report', date: '2024-01-05', status: 'completed', size: '4.1 MB' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MarketingManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Marketing Reports</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Generate and manage marketing reports</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Generate Report
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
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
                  <option>Marketing Report</option>
                  <option>Campaign Report</option>
                  <option>Feedback Report</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Reports</h3>
              </div>
              <div className="p-6">
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
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
