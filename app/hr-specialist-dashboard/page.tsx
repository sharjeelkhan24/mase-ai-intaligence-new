'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  FileText,
  Award,
  BookOpen,
  Shield,
  Settings,
  Bell,
  Search,
  User,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Target,
  DollarSign
} from 'lucide-react';
import HRSpecialistNavbar from '@/app/components/hr-specialist-dashboard/HRSpecialistNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function HRSpecialistDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only hr-specialist role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('hr-specialist');

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
  const hrMetrics = {
    totalStaff: 156,
    newHires: 8,
    pendingReviews: 12,
    trainingCompleted: 142,
    complianceRate: 96.8,
    openPositions: 6
  };

  const recentActivities = [
    { id: 1, type: 'onboarding', message: 'New hire: Jessica Martinez - Staff Nurse', status: 'completed', date: '2 hours ago' },
    { id: 2, type: 'training', message: 'HIPAA training completed for 15 staff members', status: 'completed', date: '4 hours ago' },
    { id: 3, type: 'review', message: 'Performance review scheduled for Mike Chen', status: 'pending', date: '1 day ago' },
    { id: 4, type: 'benefits', message: 'Benefits enrollment for new hire Sarah Johnson', status: 'in_progress', date: '2 days ago' }
  ];

  const staffRecords = [
    { id: 1, name: 'Sarah Johnson', role: 'Staff Nurse', department: 'Nursing', hireDate: '2024-01-15', status: 'active' },
    { id: 2, name: 'Mike Chen', role: 'Nurse Manager', department: 'Nursing', hireDate: '2023-08-20', status: 'active' },
    { id: 3, name: 'Emily Rodriguez', role: 'Staff Nurse', department: 'Nursing', hireDate: '2024-02-10', status: 'active' },
    { id: 4, name: 'David Wilson', role: 'HR Specialist', department: 'Human Resources', hireDate: '2023-11-05', status: 'active' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'staff-records', label: 'Staff Records', icon: Users },
    { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
    { id: 'onboarding', label: 'Onboarding', icon: BookOpen },
    { id: 'benefits', label: 'Benefits', icon: DollarSign },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900">{hrMetrics.totalStaff}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{hrMetrics.newHires} new hires this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Completed</p>
              <p className="text-3xl font-bold text-gray-900">{hrMetrics.trainingCompleted}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            {hrMetrics.complianceRate}% compliance rate
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Positions</p>
              <p className="text-3xl font-bold text-gray-900">{hrMetrics.openPositions}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <UserPlus className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {hrMetrics.pendingReviews} pending reviews
          </div>
        </div>
      </div>

      {/* Recent Activities and Staff Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className={`p-3 rounded-lg border-l-4 ${
                activity.status === 'completed' ? 'border-green-500 bg-green-50' :
                activity.status === 'pending' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-500" />
            HR Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Active Staff</span>
              </div>
              <span className="text-blue-600 font-bold">{hrMetrics.totalStaff}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Compliance Rate</span>
              </div>
              <span className="text-green-600 font-bold">{hrMetrics.complianceRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                <span className="font-medium text-gray-900">Pending Reviews</span>
              </div>
              <span className="text-orange-600 font-bold">{hrMetrics.pendingReviews}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffRecords = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffRecords.map((staff) => (
                <tr key={staff.id}>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.hireDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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

  const renderRecruitment = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <UserPlus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-600">Applications</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Calendar className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">8</p>
            <p className="text-sm text-gray-600">Interviews</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-600">Offers</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">6</p>
            <p className="text-sm text-gray-600">Open Positions</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Progress</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Jessica Martinez</span>
                <p className="text-sm text-gray-500">Staff Nurse - Day 3 of onboarding</p>
              </div>
            </div>
            <span className="text-green-600 font-bold">75%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Sarah Johnson</span>
                <p className="text-sm text-gray-500">Staff Nurse - Day 1 of onboarding</p>
              </div>
            </div>
            <span className="text-blue-600 font-bold">25%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBenefits = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits Administration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Health Insurance</span>
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">98%</p>
            <p className="text-sm text-gray-500">Enrollment rate</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Retirement Plan</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-500">Participation rate</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">PTO Balance</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">12.5</p>
            <p className="text-sm text-gray-500">Average days</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Compliance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">Background Checks</span>
            </div>
            <span className="text-green-600 font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-gray-900">Training Compliance</span>
            </div>
            <span className="text-green-600 font-bold">96.8%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium text-gray-900">Documentation</span>
            </div>
            <span className="text-blue-600 font-bold">94.2%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Specialist Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Thresholds</label>
            <input
              type="text"
              defaultValue="Training: 95%, Documentation: 90%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Onboarding Timeline</label>
            <input
              type="text"
              defaultValue="Standard: 30 days, Fast-track: 14 days"
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
      case 'staff-records': 
        router.push('/hr-specialist-dashboard/staff-records');
        return null;
      case 'recruitment': 
        router.push('/hr-specialist-dashboard/recruitment');
        return null;
      case 'onboarding': 
        router.push('/hr-specialist-dashboard/onboarding');
        return null;
      case 'benefits': 
        router.push('/hr-specialist-dashboard/benefits');
        return null;
      case 'compliance': 
        router.push('/hr-specialist-dashboard/compliance');
        return null;
      case 'settings': 
        router.push('/hr-specialist-dashboard/settings');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* HR Specialist Navbar Component */}
      <HRSpecialistNavbar activeTab={activeTab} />

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
                {activeTab === 'dashboard' && 'HR operations overview and key metrics'}
                {activeTab === 'staff-records' && 'Staff records and employee information'}
                {activeTab === 'recruitment' && 'Recruitment pipeline and hiring process'}
                {activeTab === 'onboarding' && 'New employee onboarding and orientation'}
                {activeTab === 'benefits' && 'Benefits administration and enrollment'}
                {activeTab === 'compliance' && 'HR compliance and regulatory requirements'}
                {activeTab === 'settings' && 'HR specialist preferences and configuration'}
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
