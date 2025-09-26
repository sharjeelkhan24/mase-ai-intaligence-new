'use client';

import React from 'react';
import {
  Database,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';
import SurveyUserNavbar from '@/app/components/survey-user-dashboard/SurveyUserNavbar';

export default function SurveyDataCollectionPage() {
  const activeTab = 'data-collection';

  const dataStats = [
    { metric: 'Total Records', value: '2,847', change: '+156', color: 'text-blue-600' },
    { metric: 'New This Week', value: '89', change: '+12', color: 'text-green-600' },
    { metric: 'Pending Review', value: '23', change: '-5', color: 'text-yellow-600' },
    { metric: 'Data Quality', value: '94%', change: '+2%', color: 'text-purple-600' }
  ];

  const dataCollections = [
    { id: 1, name: 'Patient Satisfaction Data', source: 'Patient Surveys', records: 1247, lastUpdated: '2024-01-15', status: 'active', quality: '96%' },
    { id: 2, name: 'Staff Performance Data', source: 'Staff Evaluations', records: 892, lastUpdated: '2024-01-14', status: 'active', quality: '94%' },
    { id: 3, name: 'Quality Metrics Data', source: 'Quality Assessments', records: 456, lastUpdated: '2024-01-13', status: 'pending', quality: '92%' },
    { id: 4, name: 'Training Effectiveness Data', source: 'Training Surveys', records: 252, lastUpdated: '2024-01-12', status: 'active', quality: '98%' }
  ];

  const recentEntries = [
    { id: 1, collection: 'Patient Satisfaction Data', entry: 'New patient feedback received', date: '2024-01-15', user: 'System', status: 'processed' },
    { id: 2, collection: 'Staff Performance Data', entry: 'Staff evaluation completed', date: '2024-01-14', user: 'System', status: 'processed' },
    { id: 3, collection: 'Quality Metrics Data', entry: 'Quality assessment data pending review', date: '2024-01-13', user: 'System', status: 'pending' },
    { id: 4, collection: 'Training Effectiveness Data', entry: 'Training survey response added', date: '2024-01-12', user: 'System', status: 'processed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SurveyUserNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Data Collection</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage survey data collection and processing</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Data Source
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataStats.map((stat, index) => (
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
                      placeholder="Search data collections..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Sources</option>
                  <option>Patient Surveys</option>
                  <option>Staff Evaluations</option>
                  <option>Quality Assessments</option>
                  <option>Training Surveys</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Data Collections</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dataCollections.map((collection) => (
                    <div key={collection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{collection.name}</h4>
                          <p className="text-sm text-gray-500">{collection.source} • {collection.records} records</p>
                          <p className="text-sm text-gray-500">Last updated: {new Date(collection.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Quality: {collection.quality}</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: collection.quality }}></div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          collection.status === 'active' ? 'bg-green-100 text-green-800' :
                          collection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {collection.status}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Data Entries</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{entry.collection}</h4>
                          <p className="text-sm text-gray-500">{entry.entry}</p>
                          <p className="text-xs text-gray-400">By {entry.user} • {new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status}
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

