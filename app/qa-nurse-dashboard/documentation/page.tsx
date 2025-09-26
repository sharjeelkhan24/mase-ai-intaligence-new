'use client';

import React from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  Users,
  Download,
  Upload
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';

export default function QADocumentationPage() {
  const activeTab = 'documentation';

  const documentationStats = [
    { metric: 'Total Documents', value: '89', change: '+5', color: 'text-blue-600' },
    { metric: 'Updated This Month', value: '12', change: '+3', color: 'text-green-600' },
    { metric: 'Pending Review', value: '4', change: '-1', color: 'text-yellow-600' },
    { metric: 'Overdue', value: '2', change: '-1', color: 'text-red-600' }
  ];

  const documents = [
    { id: 1, title: 'Quality Assurance Manual', type: 'Policy', status: 'current', lastUpdated: '2024-01-15', nextReview: '2024-07-15', department: 'All Units', version: 'v2.1' },
    { id: 2, title: 'Patient Safety Protocols', type: 'Protocol', status: 'current', lastUpdated: '2024-01-10', nextReview: '2024-04-10', department: 'ICU', version: 'v1.8' },
    { id: 3, title: 'Infection Control Guidelines', type: 'Guideline', status: 'pending_review', lastUpdated: '2023-12-20', nextReview: '2024-01-20', department: 'All Units', version: 'v1.5' },
    { id: 4, title: 'Medication Administration Standards', type: 'Standard', status: 'overdue', lastUpdated: '2023-11-15', nextReview: '2024-01-15', department: 'Emergency', version: 'v1.2' }
  ];

  const recentUpdates = [
    { id: 1, document: 'Quality Assurance Manual', update: 'Updated section 3.2 - Quality Metrics', date: '2024-01-15', user: 'Sarah Johnson', department: 'All Units' },
    { id: 2, document: 'Patient Safety Protocols', update: 'Added new safety checklist', date: '2024-01-10', user: 'Mike Chen', department: 'ICU' },
    { id: 3, document: 'Infection Control Guidelines', update: 'Revised hand hygiene procedures', date: '2023-12-20', user: 'Emily Rodriguez', department: 'All Units' },
    { id: 4, document: 'Medication Administration Standards', update: 'Updated documentation requirements', date: '2023-11-15', user: 'David Wilson', department: 'Emergency' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QANurseNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Documentation</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage quality assurance documentation</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              New Document
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {documentationStats.map((stat, index) => (
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
                      placeholder="Search documents..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Types</option>
                  <option>Policy</option>
                  <option>Protocol</option>
                  <option>Guideline</option>
                  <option>Standard</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Status</option>
                  <option>Current</option>
                  <option>Pending Review</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Documents</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{doc.title}</h4>
                          <p className="text-sm text-gray-500">{doc.type} • {doc.department} • Version {doc.version}</p>
                          <p className="text-sm text-gray-500">Last updated: {new Date(doc.lastUpdated).toLocaleDateString()} • Next review: {new Date(doc.nextReview).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          doc.status === 'current' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {doc.status.replace('_', ' ')}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Updates</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentUpdates.map((update) => (
                    <div key={update.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{update.document}</h4>
                          <p className="text-sm text-gray-500">{update.update}</p>
                          <p className="text-xs text-gray-400">{update.department} • By {update.user} • {new Date(update.date).toLocaleDateString()}</p>
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

