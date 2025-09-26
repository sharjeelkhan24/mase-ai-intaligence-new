'use client';

import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Eye,
  Edit,
  Plus,
  Calendar,
  Users,
  Target,
  Award
} from 'lucide-react';
import NurseManagerNavbar from '@/app/components/nurse-manager-dashboard/NurseManagerNavbar';

export default function NurseQualityPage() {
  const activeTab = 'quality';

  const qualityStats = [
    { metric: 'Quality Score', value: '94.2%', change: '+2.1%', color: 'text-green-600' },
    { metric: 'Patient Satisfaction', value: '4.7/5', change: '+0.2', color: 'text-blue-600' },
    { metric: 'Compliance Rate', value: '98.5%', change: '+1.2%', color: 'text-purple-600' },
    { metric: 'Incident Rate', value: '0.8%', change: '-0.3%', color: 'text-orange-600' }
  ];

  const qualityMetrics = [
    { id: 1, name: 'Patient Care Quality', score: 95, target: 90, status: 'excellent', trend: 'up', lastUpdated: '2024-01-15' },
    { id: 2, name: 'Documentation Accuracy', score: 92, target: 95, status: 'good', trend: 'up', lastUpdated: '2024-01-14' },
    { id: 3, name: 'Safety Protocols', score: 98, target: 95, status: 'excellent', trend: 'stable', lastUpdated: '2024-01-13' },
    { id: 4, name: 'Staff Training Compliance', score: 89, target: 90, status: 'needs_improvement', trend: 'down', lastUpdated: '2024-01-12' }
  ];

  const recentIncidents = [
    { id: 1, type: 'Minor Safety Issue', severity: 'low', department: 'ICU', date: '2024-01-15', status: 'resolved', description: 'Slip hazard in hallway' },
    { id: 2, type: 'Documentation Error', severity: 'medium', department: 'Emergency', date: '2024-01-14', status: 'investigating', description: 'Missing patient signature' },
    { id: 3, type: 'Protocol Deviation', severity: 'medium', department: 'Medical-Surgical', date: '2024-01-12', status: 'resolved', description: 'Hand hygiene protocol not followed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NurseManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Quality Management</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Monitor and track quality performance</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Metric
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Quality Metrics</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          metric.status === 'excellent' ? 'bg-green-100' :
                          metric.status === 'good' ? 'bg-blue-100' :
                          metric.status === 'needs_improvement' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {metric.status === 'excellent' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           metric.status === 'good' ? <CheckCircle className="w-5 h-5 text-blue-600" /> :
                           metric.status === 'needs_improvement' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> :
                           <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{metric.name}</h4>
                          <p className="text-sm text-gray-500">Target: {metric.target}% • Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{metric.score}%</p>
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${metric.score}%` }}></div>
                            </div>
                            <span className={`text-sm ${
                              metric.trend === 'up' ? 'text-green-600' :
                              metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                            </span>
                          </div>
                        </div>
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Incidents</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          incident.severity === 'high' ? 'bg-red-100' :
                          incident.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {incident.severity === 'high' ? <XCircle className="w-5 h-5 text-red-600" /> :
                           incident.severity === 'medium' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> :
                           <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{incident.type}</h4>
                          <p className="text-sm text-gray-500">{incident.department} • {incident.description}</p>
                          <p className="text-xs text-gray-400">Date: {new Date(incident.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {incident.status}
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
