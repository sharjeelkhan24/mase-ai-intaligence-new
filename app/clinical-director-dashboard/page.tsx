'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  Bell,
  Search,
  User,
  Heart,
  Stethoscope,
  ClipboardList,
  Award,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import ClinicalDirectorNavbar from '@/app/components/clinical-director-dashboard/ClinicalDirectorNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function ClinicalDirectorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only clinical-director role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('clinical-director');

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
  const clinicalMetrics = {
    totalPatients: 247,
    activeStaff: 89,
    qualityScore: 94.2,
    complianceRate: 98.7,
    patientSatisfaction: 4.6,
    readmissionRate: 3.2
  };

  const recentAlerts = [
    { id: 1, type: 'critical', message: 'Patient John Doe - Critical vitals detected', time: '2 min ago', priority: 'high' },
    { id: 2, type: 'warning', message: 'Staff shortage in ICU - 2 nurses needed', time: '15 min ago', priority: 'medium' },
    { id: 3, type: 'info', message: 'Quality audit completed - 98% compliance', time: '1 hour ago', priority: 'low' }
  ];

  const staffPerformance = [
    { name: 'Sarah Johnson', role: 'Nurse Manager', performance: 95, patients: 12, status: 'excellent' },
    { name: 'Mike Chen', role: 'Staff Nurse', performance: 88, patients: 8, status: 'good' },
    { name: 'Emily Rodriguez', role: 'Staff Nurse', performance: 92, patients: 10, status: 'excellent' },
    { name: 'David Wilson', role: 'Staff Nurse', performance: 85, patients: 7, status: 'good' }
  ];

  const patientOutcomes = [
    { metric: 'Recovery Rate', current: 94.2, target: 95.0, trend: 'up' },
    { metric: 'Readmission Rate', current: 3.2, target: 3.0, trend: 'down' },
    { metric: 'Patient Satisfaction', current: 4.6, target: 4.5, trend: 'up' },
    { metric: 'Compliance Rate', current: 98.7, target: 99.0, trend: 'up' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'patient-care', label: 'Patient Care', icon: Heart },
    { id: 'staff-performance', label: 'Staff Performance', icon: Users },
    { id: 'quality-metrics', label: 'Quality Metrics', icon: Award },
    { id: 'compliance', label: 'Compliance', icon: ClipboardList },
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
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{clinicalMetrics.totalPatients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +5.2% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-3xl font-bold text-gray-900">{clinicalMetrics.activeStaff}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2.1% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quality Score</p>
              <p className="text-3xl font-bold text-gray-900">{clinicalMetrics.qualityScore}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +1.8% from last month
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Patient Outcomes
          </h3>
          <div className="space-y-4">
            {patientOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{outcome.metric}</p>
                  <p className="text-xs text-gray-500">Target: {outcome.target}%</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">{outcome.current}%</span>
                  {outcome.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientCare = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Care Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">247</p>
            <p className="text-sm text-gray-600">Active Patients</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">94.2%</p>
            <p className="text-sm text-gray-600">Recovery Rate</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Stethoscope className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">4.6</p>
            <p className="text-sm text-gray-600">Satisfaction Score</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffPerformance.map((staff, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${staff.performance}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-900">{staff.performance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.patients}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      staff.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQualityMetrics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Compliance Rate</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">98.7%</p>
            <p className="text-sm text-gray-500">Above target (95%)</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Patient Satisfaction</span>
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">4.6/5</p>
            <p className="text-sm text-gray-500">Above target (4.5)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">HIPAA Compliance</span>
            </div>
            <span className="text-green-600 font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">Safety Protocols</span>
            </div>
            <span className="text-green-600 font-bold">98.5%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <span className="font-medium text-gray-900">Documentation</span>
            </div>
            <span className="text-yellow-600 font-bold">96.2%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Monthly Quality Report</h4>
            <p className="text-sm text-gray-500">Comprehensive quality metrics and outcomes</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Staff Performance Report</h4>
            <p className="text-sm text-gray-500">Individual and team performance analysis</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Director Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Thresholds</label>
            <input
              type="text"
              defaultValue="Critical: 95%, Warning: 85%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Targets</label>
            <input
              type="text"
              defaultValue="Patient Satisfaction: 4.5, Compliance: 95%"
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
      case 'patient-care': return renderPatientCare();
      case 'staff-performance': return renderStaffPerformance();
      case 'quality-metrics': return renderQualityMetrics();
      case 'compliance': return renderCompliance();
      case 'reports': return renderReports();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Clinical Director Navbar Component */}
      <ClinicalDirectorNavbar activeTab={activeTab} />

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
                {activeTab === 'dashboard' && 'Clinical operations overview and key metrics'}
                {activeTab === 'patient-care' && 'Patient care management and outcomes'}
                {activeTab === 'staff-performance' && 'Staff performance monitoring and evaluation'}
                {activeTab === 'quality-metrics' && 'Quality assurance metrics and compliance'}
                {activeTab === 'compliance' && 'Regulatory compliance and safety protocols'}
                {activeTab === 'reports' && 'Clinical reports and analytics'}
                {activeTab === 'settings' && 'Clinical director preferences and configuration'}
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
