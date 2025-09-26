'use client';

import React from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, FileText, Calendar, TrendingUp, Star, Clock, Eye } from 'lucide-react';
import AdminNavbar from '@/app/components/admin-dashboard/AdminNavbar';
import SubscriptionGuard from '@/app/components/admin-dashboard/SubscriptionGuard';

export default function QualityAssurance() {

  // Sample quality metrics data
  const qualityMetrics = [
    {
      id: 1,
      metric: 'Patient Satisfaction',
      score: 4.8,
      target: 4.5,
      status: 'excellent',
      trend: '+0.3',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      metric: 'Incident Rate',
      score: 2.1,
      target: 3.0,
      status: 'good',
      trend: '-0.5',
      lastUpdated: '2024-01-14'
    },
    {
      id: 3,
      metric: 'Compliance Score',
      score: 95.2,
      target: 90.0,
      status: 'excellent',
      trend: '+2.1',
      lastUpdated: '2024-01-15'
    },
    {
      id: 4,
      metric: 'Documentation Quality',
      score: 87.5,
      target: 85.0,
      status: 'good',
      trend: '+1.2',
      lastUpdated: '2024-01-13'
    }
  ];

  // Sample audits data
  const recentAudits = [
    {
      id: 1,
      facility: 'City General Hospital',
      type: 'Routine Inspection',
      date: '2024-01-10',
      auditor: 'Sarah Martinez',
      status: 'completed',
      score: 92,
      findings: 3,
      priority: 'low'
    },
    {
      id: 2,
      facility: 'Metro Medical Center',
      type: 'Compliance Review',
      date: '2024-01-08',
      auditor: 'David Chen',
      status: 'in-progress',
      score: null,
      findings: null,
      priority: 'medium'
    },
    {
      id: 3,
      facility: 'Regional Hospital',
      type: 'Quality Assessment',
      date: '2024-01-05',
      auditor: 'Emily Johnson',
      status: 'completed',
      score: 88,
      findings: 5,
      priority: 'high'
    },
    {
      id: 4,
      facility: 'Children\'s Hospital',
      type: 'Safety Inspection',
      date: '2024-01-03',
      auditor: 'Michael Rodriguez',
      status: 'completed',
      score: 95,
      findings: 1,
      priority: 'low'
    }
  ];

  const getScoreColor = (score: number, target: number) => {
    const percentage = (score / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SubscriptionGuard 
      requiredSubscription="Quality Assurance" 
      featureName="Quality Assurance"
    >
      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Navbar Component */}
        <AdminNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Quality Assurance
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Monitor and maintain healthcare quality standards
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
                <Shield className="w-4 h-4" />
                <span>New Audit</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Quality Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {qualityMetrics.map((metric) => (
              <div key={metric.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">
                    {metric.metric}
                  </h3>
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getScoreColor(metric.score, metric.target)} font-[family-name:var(--font-adlam-display)]`}>
                      {metric.metric.includes('Rate') ? `${metric.score}%` : 
                       metric.metric.includes('Score') ? `${metric.score}%` : 
                       metric.score}
                    </span>
                    <span className={`text-sm font-medium ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} font-[family-name:var(--font-adlam-display)]`}>
                      {metric.trend}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-[family-name:var(--font-adlam-display)]">
                      Target: {metric.metric.includes('Rate') ? `${metric.target}%` : 
                              metric.metric.includes('Score') ? `${metric.target}%` : 
                              metric.target}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    } font-[family-name:var(--font-adlam-display)]`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quality Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Quality Score Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Quality Trends
                </h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">Quality Trends Chart</p>
                  <p className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">Chart visualization would go here</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-[family-name:var(--font-adlam-display)]">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Active Audits</span>
                  <span className="text-lg font-semibold text-blue-600 font-[family-name:var(--font-adlam-display)]">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Completed This Month</span>
                  <span className="text-lg font-semibold text-green-600 font-[family-name:var(--font-adlam-display)]">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Pending Actions</span>
                  <span className="text-lg font-semibold text-yellow-600 font-[family-name:var(--font-adlam-display)]">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">Critical Issues</span>
                  <span className="text-lg font-semibold text-red-600 font-[family-name:var(--font-adlam-display)]">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Audits Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Recent Audits
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium font-[family-name:var(--font-adlam-display)]">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Facility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Audit Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Auditor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAudits.map((audit) => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {audit.facility}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {audit.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center font-[family-name:var(--font-adlam-display)]">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(audit.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {audit.auditor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)} font-[family-name:var(--font-adlam-display)]`}>
                          {audit.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {audit.status === 'in-progress' && <Clock className="w-3 h-3 mr-1" />}
                          <span className="capitalize">{audit.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {audit.score ? (
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${audit.score >= 90 ? 'text-green-600' : audit.score >= 80 ? 'text-yellow-600' : 'text-red-600'} font-[family-name:var(--font-adlam-display)]`}>
                              {audit.score}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(audit.priority)} font-[family-name:var(--font-adlam-display)]`}>
                          {audit.priority === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          <span className="capitalize">{audit.priority}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SubscriptionGuard>
  );
}
