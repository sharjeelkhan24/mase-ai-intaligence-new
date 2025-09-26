'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  User,
  Shield,
  Award,
  Target,
  Activity,
  Clock,
  TrendingUp,
  BarChart3,
  Eye
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function QANurseDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only qa-nurse role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('qa-nurse');

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
    auditsCompleted: 24,
    complianceRate: 97.2,
    issuesFound: 8,
    staffTrained: 89,
    documentationScore: 96.5,
    safetyIncidents: 2
  };

  const recentAudits = [
    { id: 1, type: 'medication', title: 'Medication Administration Audit', status: 'completed', score: 98, date: '1 day ago' },
    { id: 2, type: 'safety', title: 'Patient Safety Protocol Check', status: 'in_progress', score: null, date: '2 days ago' },
    { id: 3, type: 'documentation', title: 'Chart Documentation Review', status: 'completed', score: 95, date: '3 days ago' },
    { id: 4, type: 'infection', title: 'Infection Control Assessment', status: 'pending', score: null, date: '1 week ago' }
  ];

  const qualityChecks = [
    { area: 'Medication Safety', score: 98, status: 'excellent', issues: 0, color: 'bg-green-500' },
    { area: 'Patient Documentation', score: 96, status: 'excellent', issues: 1, color: 'bg-green-500' },
    { area: 'Infection Control', score: 94, status: 'good', issues: 2, color: 'bg-blue-500' },
    { area: 'Safety Protocols', score: 97, status: 'excellent', issues: 0, color: 'bg-green-500' },
    { area: 'Staff Training', score: 92, status: 'good', issues: 3, color: 'bg-blue-500' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'quality-checks', label: 'Quality Checks', icon: ClipboardList },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'documentation', label: 'Documentation', icon: FileText },
    { id: 'training', label: 'Training', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Audits Completed</p>
              <p className="text-3xl font-bold text-gray-900">{qaMetrics.auditsCompleted}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +3 this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-3xl font-bold text-gray-900">{qaMetrics.complianceRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Above target (95%)
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issues Found</p>
              <p className="text-3xl font-bold text-gray-900">{qaMetrics.issuesFound}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Requires attention
          </div>
        </div>
      </div>

      {/* Recent Audits and Quality Checks */}
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
            Quality Areas
          </h3>
          <div className="space-y-3">
            {qualityChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${check.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{check.area}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{check.score}%</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    check.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {check.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderQualityChecks = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Check Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Medication Safety</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">98%</p>
            <p className="text-sm text-gray-500">Last check: 2 days ago</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Documentation</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">96%</p>
            <p className="text-sm text-gray-500">Last check: 1 day ago</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Infection Control</span>
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">94%</p>
            <p className="text-sm text-gray-500">Last check: 3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Monitoring</h3>
        <div className="space-y-4">
          {qualityChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full ${check.color} mr-3`}></div>
                <span className="font-medium text-gray-900">{check.area}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${check.color}`} style={{ width: `${check.score}%` }}></div>
                </div>
                <span className="text-lg font-bold text-gray-900">{check.score}%</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  check.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentation Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Chart Accuracy</span>
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">96.5%</p>
            <p className="text-sm text-gray-500">Above target (95%)</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Timeliness</span>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">98.2%</p>
            <p className="text-sm text-gray-500">Above target (95%)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Training Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">HIPAA Training</span>
                <p className="text-sm text-gray-500">89/89 staff completed</p>
              </div>
            </div>
            <span className="text-green-600 font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Safety Protocols</span>
                <p className="text-sm text-gray-500">85/89 staff completed</p>
              </div>
            </div>
            <span className="text-blue-600 font-bold">95%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Quality Standards</span>
                <p className="text-sm text-gray-500">82/89 staff completed</p>
              </div>
            </div>
            <span className="text-yellow-600 font-bold">92%</span>
          </div>
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
            <h4 className="font-medium text-gray-900">Quality Audit Report</h4>
            <p className="text-sm text-gray-500">Comprehensive quality assessment results</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Compliance Metrics</h4>
            <p className="text-sm text-gray-500">Compliance trends and performance</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Shield className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Safety Report</h4>
            <p className="text-sm text-gray-500">Safety incidents and prevention</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Users className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">Training Report</h4>
            <p className="text-sm text-gray-500">Staff training progress and compliance</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">QA Nurse Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Thresholds</label>
            <input
              type="text"
              defaultValue="Compliance: 95%, Documentation: 95%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Audit Schedule</label>
            <input
              type="text"
              defaultValue="Weekly: Safety, Monthly: Documentation"
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
      case 'quality-checks': 
        router.push('/qa-nurse-dashboard/quality-checks');
        return null;
      case 'compliance': 
        router.push('/qa-nurse-dashboard/compliance');
        return null;
      case 'documentation': 
        router.push('/qa-nurse-dashboard/documentation');
        return null;
      case 'training': 
        router.push('/qa-nurse-dashboard/training');
        return null;
      case 'reports': 
        router.push('/qa-nurse-dashboard/reports');
        return null;
      case 'settings': 
        router.push('/qa-nurse-dashboard/settings');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* QA Nurse Navbar Component */}
      <QANurseNavbar activeTab={activeTab} />

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
                {activeTab === 'quality-checks' && 'Quality check schedule and results'}
                {activeTab === 'compliance' && 'Compliance monitoring and tracking'}
                {activeTab === 'documentation' && 'Documentation review and accuracy'}
                {activeTab === 'training' && 'Staff training status and progress'}
                {activeTab === 'reports' && 'QA reports and analytics'}
                {activeTab === 'settings' && 'QA nurse preferences and configuration'}
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
