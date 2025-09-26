'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  Award,
  ClipboardList,
  Target,
  Activity,
  Users,
  Clock,
  XCircle
} from 'lucide-react';
import QADirectorNavbar from '@/app/components/qa-director-dashboard/QADirectorNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function QADirectorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only qa-director role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('qa-director');

  // Show loading screen while role validation is in progress
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 font-[family-name:var(--font-adlam-display)]">
            Validating access permissions...
          </p>
        </div>
      </div>
    );
  }

  // If role validation failed, the hook will handle redirect
  if (!isValid || !userInfo) {
    return null;
  }

  // Sample data
  const qaMetrics = {
    overallCompliance: 98.7,
    auditScore: 96.2,
    incidentRate: 2.1,
    staffTraining: 94.5,
    patientSafety: 99.1,
    documentationScore: 97.8
  };

  const recentAudits = [
    { id: 1, type: 'compliance', title: 'HIPAA Compliance Audit', status: 'completed', score: 98, date: '2 days ago' },
    { id: 2, type: 'safety', title: 'Patient Safety Protocol Review', status: 'in_progress', score: null, date: '1 week ago' },
    { id: 3, type: 'quality', title: 'Clinical Quality Assessment', status: 'completed', score: 96, date: '2 weeks ago' },
    { id: 4, type: 'training', title: 'Staff Training Compliance', status: 'pending', score: null, date: '3 weeks ago' }
  ];

  const complianceAreas = [
    { area: 'HIPAA Compliance', score: 100, status: 'excellent', color: 'bg-green-500' },
    { area: 'Safety Protocols', score: 98, status: 'excellent', color: 'bg-green-500' },
    { area: 'Documentation', score: 97, status: 'good', color: 'bg-blue-500' },
    { area: 'Staff Training', score: 94, status: 'good', color: 'bg-blue-500' },
    { area: 'Patient Care', score: 96, status: 'excellent', color: 'bg-green-500' },
    { area: 'Infection Control', score: 99, status: 'excellent', color: 'bg-green-500' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'quality-metrics', label: 'Quality Metrics', icon: Award },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'audits', label: 'Audits', icon: ClipboardList },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'staff-training', label: 'Staff Training', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
              <p className="text-3xl font-bold text-gray-900">{qaMetrics.overallCompliance}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Above target (95%)
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audit Score</p>
              <p className="text-3xl font-bold text-gray-900">{qaMetrics.auditScore}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Excellent performance
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Incident Rate</p>
              <p className="text-3xl font-bold text-gray-900">{qaMetrics.incidentRate}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Below target (1.5%)
          </div>
        </div>
      </div>

      {/* Recent Audits and Compliance Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
            Recent Audits
          </h3>
          <div className="space-y-3">
            {recentAudits.map((audit) => (
              <div key={audit.id} className={`p-3 rounded-lg border-l-4 ${
                audit.status === 'completed' ? 'border-green-500 bg-green-50' :
                audit.status === 'in_progress' ? 'border-blue-500 bg-blue-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{audit.title}</p>
                    <p className="text-xs text-gray-500">{audit.date}</p>
                  </div>
                  {audit.score && (
                    <span className="text-sm font-bold text-gray-900">{audit.score}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-500" />
            Compliance Areas
          </h3>
          <div className="space-y-3">
            {complianceAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${area.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{area.area}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{area.score}%</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    area.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {area.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQualityMetrics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Patient Safety</span>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{qaMetrics.patientSafety}%</p>
            <p className="text-sm text-gray-500">Above target (98%)</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Documentation</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{qaMetrics.documentationScore}%</p>
            <p className="text-sm text-gray-500">Above target (95%)</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Staff Training</span>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{qaMetrics.staffTraining}%</p>
            <p className="text-sm text-gray-500">Above target (90%)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Dashboard</h3>
        <div className="space-y-4">
          {complianceAreas.map((area, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${area.color} mr-3`}></div>
                <span className="font-medium text-gray-900">{area.area}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${area.color}`} style={{ width: `${area.score}%` }}></div>
                </div>
                <span className="text-lg font-bold text-gray-900">{area.score}%</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  area.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {area.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAudits = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAudits.map((audit) => (
                <tr key={audit.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      audit.type === 'compliance' ? 'bg-blue-100 text-blue-800' :
                      audit.type === 'safety' ? 'bg-green-100 text-green-800' :
                      audit.type === 'quality' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {audit.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{audit.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                      audit.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {audit.score ? `${audit.score}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audit.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">QA Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Compliance Report</h4>
            <p className="text-sm text-gray-500">Overall compliance metrics and trends</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Quality Metrics</h4>
            <p className="text-sm text-gray-500">Quality performance and benchmarks</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Shield className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Safety Report</h4>
            <p className="text-sm text-gray-500">Patient safety and incident analysis</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Users className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">Training Report</h4>
            <p className="text-sm text-gray-500">Staff training compliance and progress</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffTraining = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Compliance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">HIPAA Training</span>
                <p className="text-sm text-gray-500">156/156 staff completed</p>
              </div>
            </div>
            <span className="text-green-600 font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Safety Protocols</span>
                <p className="text-sm text-gray-500">152/156 staff completed</p>
              </div>
            </div>
            <span className="text-green-600 font-bold">97%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Quality Standards</span>
                <p className="text-sm text-gray-500">148/156 staff completed</p>
              </div>
            </div>
            <span className="text-blue-600 font-bold">95%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">QA Director Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Thresholds</label>
            <input
              type="text"
              defaultValue="Target: 95%, Warning: 90%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Targets</label>
            <input
              type="text"
              defaultValue="Patient Safety: 98%, Documentation: 95%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'quality-metrics': 
        router.push('/qa-director-dashboard/quality-metrics');
        return null;
      case 'compliance': 
        router.push('/qa-director-dashboard/compliance');
        return null;
      case 'audits': 
        router.push('/qa-director-dashboard/audits');
        return null;
      case 'reports': 
        router.push('/qa-director-dashboard/reports');
        return null;
      case 'staff-training': 
        router.push('/qa-director-dashboard/staff-training');
        return null;
      case 'settings': 
        router.push('/qa-director-dashboard/settings');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* QA Director Navbar Component */}
      <QADirectorNavbar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === 'dashboard' && 'Quality assurance overview and key metrics'}
                {activeTab === 'quality-metrics' && 'Quality performance metrics and benchmarks'}
                {activeTab === 'compliance' && 'Compliance monitoring and regulatory requirements'}
                {activeTab === 'audits' && 'Audit management and quality assessments'}
                {activeTab === 'reports' && 'QA reports and analytics'}
                {activeTab === 'staff-training' && 'Staff training compliance and progress'}
                {activeTab === 'settings' && 'QA director preferences and configuration'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
