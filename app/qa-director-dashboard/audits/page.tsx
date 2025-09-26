'use client';

import React from 'react';
import {
  Search,
  FileText,
  Calendar,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Target,
  Award
} from 'lucide-react';
import QADirectorNavbar from '@/app/components/qa-director-dashboard/QADirectorNavbar';

export default function QAAuditsPage() {
  const activeTab = 'audits';

  const auditStats = [
    { metric: 'Total Audits', value: '24', change: '+3', color: 'text-blue-600' },
    { metric: 'Completed', value: '18', change: '+2', color: 'text-green-600' },
    { metric: 'In Progress', value: '4', change: '+1', color: 'text-yellow-600' },
    { metric: 'Scheduled', value: '2', change: '0', color: 'text-purple-600' }
  ];

  const audits = [
    { id: 1, name: 'HIPAA Compliance Audit', type: 'Compliance', status: 'completed', date: '2024-01-15', auditor: 'Dr. Sarah Wilson', findings: 2, severity: 'low' },
    { id: 2, name: 'Patient Safety Audit', type: 'Safety', status: 'in_progress', date: '2024-01-20', auditor: 'Mike Chen', findings: 0, severity: 'none' },
    { id: 3, name: 'Documentation Review', type: 'Quality', status: 'completed', date: '2024-01-10', auditor: 'Emily Rodriguez', findings: 5, severity: 'medium' },
    { id: 4, name: 'Equipment Maintenance Audit', type: 'Maintenance', status: 'scheduled', date: '2024-01-25', auditor: 'David Wilson', findings: 0, severity: 'none' },
    { id: 5, name: 'Staff Training Compliance', type: 'Training', status: 'completed', date: '2024-01-08', auditor: 'Lisa Chen', findings: 1, severity: 'low' }
  ];

  const recentFindings = [
    { id: 1, audit: 'HIPAA Compliance Audit', finding: 'Minor documentation gap', severity: 'low', status: 'resolved', date: '2024-01-15' },
    { id: 2, audit: 'Documentation Review', finding: 'Incomplete patient records', severity: 'medium', status: 'investigating', date: '2024-01-10' },
    { id: 3, audit: 'Staff Training Compliance', finding: 'Training records missing', severity: 'low', status: 'resolved', date: '2024-01-08' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QADirectorNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Quality Audits</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage and track quality audits</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Schedule Audit
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {auditStats.map((stat, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Audit Schedule</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {audits.map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          audit.status === 'completed' ? 'bg-green-100' :
                          audit.status === 'in_progress' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          {audit.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                           audit.status === 'in_progress' ? <Clock className="w-5 h-5 text-yellow-600" /> :
                           <Calendar className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{audit.name}</h4>
                          <p className="text-sm text-gray-500">{audit.type} • Auditor: {audit.auditor}</p>
                          <p className="text-sm text-gray-500">Date: {new Date(audit.date).toLocaleDateString()} • Findings: {audit.findings}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                          audit.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {audit.status.replace('_', ' ')}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Findings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentFindings.map((finding) => (
                    <div key={finding.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          finding.severity === 'high' ? 'bg-red-100' :
                          finding.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {finding.severity === 'high' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                           finding.severity === 'medium' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> :
                           <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{finding.finding}</h4>
                          <p className="text-sm text-gray-500">{finding.audit} • Date: {new Date(finding.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          finding.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          finding.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {finding.status}
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
