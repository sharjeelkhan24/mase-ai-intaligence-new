'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  BookOpen,
  Shield,
  FileText,
  Settings,
  Bell,
  Search,
  User,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import HRDirectorNavbar from '@/app/components/hr-director-dashboard/HRDirectorNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function HRDirectorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only hr-director role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('hr-director');

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
    newHires: 12,
    turnoverRate: 8.2,
    trainingCompletion: 94.5,
    satisfactionScore: 4.3,
    openPositions: 8
  };

  const recentActivities = [
    { id: 1, type: 'hire', message: 'New hire: Sarah Johnson - Staff Nurse', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'training', message: 'Training completed: 15 staff members - HIPAA Compliance', time: '4 hours ago', status: 'completed' },
    { id: 3, type: 'review', message: 'Performance review due: Mike Chen - Nurse Manager', time: '1 day ago', status: 'pending' },
    { id: 4, type: 'resignation', message: 'Resignation notice: Emily Rodriguez - 2 weeks notice', time: '2 days ago', status: 'action_required' }
  ];

  const staffByDepartment = [
    { department: 'Nursing', count: 89, percentage: 57.1, color: 'bg-blue-500' },
    { department: 'Administration', count: 23, percentage: 14.7, color: 'bg-green-500' },
    { department: 'Quality Assurance', count: 18, percentage: 11.5, color: 'bg-purple-500' },
    { department: 'Human Resources', count: 12, percentage: 7.7, color: 'bg-orange-500' },
    { department: 'Marketing', count: 8, percentage: 5.1, color: 'bg-pink-500' },
    { department: 'Other', count: 6, percentage: 3.9, color: 'bg-gray-500' }
  ];

  const recruitmentPipeline = [
    { position: 'Staff Nurse', applicants: 24, interviews: 8, offers: 3, status: 'active' },
    { position: 'Nurse Manager', applicants: 12, interviews: 4, offers: 1, status: 'active' },
    { position: 'HR Specialist', applicants: 18, interviews: 6, offers: 2, status: 'active' },
    { position: 'QA Nurse', applicants: 8, interviews: 3, offers: 1, status: 'pending' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'staff-management', label: 'Staff Management', icon: Users },
    { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'training', label: 'Training', icon: BookOpen },
    { id: 'compliance', label: 'Compliance', icon: Shield },
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
              <p className="text-sm font-medium text-gray-600">Turnover Rate</p>
              <p className="text-3xl font-bold text-gray-900">{hrMetrics.turnoverRate}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            Above target (5%)
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Training Completion</p>
              <p className="text-3xl font-bold text-gray-900">{hrMetrics.trainingCompletion}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Above target (90%)
          </div>
        </div>
      </div>

      {/* Recent Activities and Staff Distribution */}
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
                'border-red-500 bg-red-50'
              }`}>
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-500" />
            Staff by Department
          </h3>
          <div className="space-y-3">
            {staffByDepartment.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${dept.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{dept.count}</span>
                  <span className="text-sm font-bold text-gray-900">{dept.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffManagement = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{hrMetrics.totalStaff}</p>
            <p className="text-sm text-gray-600">Total Staff</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <UserPlus className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{hrMetrics.newHires}</p>
            <p className="text-sm text-gray-600">New Hires</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{hrMetrics.turnoverRate}%</p>
            <p className="text-sm text-gray-600">Turnover Rate</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{hrMetrics.openPositions}</p>
            <p className="text-sm text-gray-600">Open Positions</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecruitment = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Pipeline</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interviews</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recruitmentPipeline.map((position, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{position.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position.applicants}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position.interviews}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position.offers}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      position.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {position.status}
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

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Average Rating</span>
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">4.3/5</p>
            <p className="text-sm text-gray-500">Above target (4.0)</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Reviews Completed</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">89%</p>
            <p className="text-sm text-gray-500">Target: 95%</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Goal Achievement</span>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">92%</p>
            <p className="text-sm text-gray-500">Above target (90%)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Programs</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">HIPAA Compliance Training</span>
                <p className="text-sm text-gray-500">156/156 staff completed</p>
              </div>
            </div>
            <span className="text-green-600 font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Safety Protocols</span>
                <p className="text-sm text-gray-500">142/156 staff completed</p>
              </div>
            </div>
            <span className="text-blue-600 font-bold">91%</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <span className="font-medium text-gray-900">Customer Service</span>
                <p className="text-sm text-gray-500">128/156 staff completed</p>
              </div>
            </div>
            <span className="text-yellow-600 font-bold">82%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Shield className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">License Verification</span>
              </div>
              <span className="text-green-600 font-bold">100%</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-gray-900">Performance Reviews</span>
              </div>
              <span className="text-blue-600 font-bold">89%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="font-medium text-gray-900">Documentation</span>
              </div>
              <span className="text-yellow-600 font-bold">94%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Monthly HR Report</h4>
            <p className="text-sm text-gray-500">Staff metrics, turnover, and recruitment</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Performance Analytics</h4>
            <p className="text-sm text-gray-500">Staff performance and goal tracking</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <PieChart className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Training Report</h4>
            <p className="text-sm text-gray-500">Training completion and compliance</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <DollarSign className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">Compensation Report</h4>
            <p className="text-sm text-gray-500">Salary analysis and benefits</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Director Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Turnover Threshold</label>
            <input
              type="text"
              defaultValue="Target: 5%, Warning: 8%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Performance Targets</label>
            <input
              type="text"
              defaultValue="Average Rating: 4.0, Reviews: 95%"
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
      case 'staff-management': 
        router.push('/hr-director-dashboard/staff-management');
        return null;
      case 'recruitment': 
        router.push('/hr-director-dashboard/recruitment');
        return null;
      case 'performance': 
        router.push('/hr-director-dashboard/performance');
        return null;
      case 'training': 
        router.push('/hr-director-dashboard/training');
        return null;
      case 'compliance': 
        router.push('/hr-director-dashboard/compliance');
        return null;
      case 'reports': 
        router.push('/hr-director-dashboard/reports');
        return null;
      case 'settings': 
        router.push('/hr-director-dashboard/settings');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* HR Director Navbar Component */}
      <HRDirectorNavbar activeTab={activeTab} />

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
                {activeTab === 'staff-management' && 'Staff management and workforce analytics'}
                {activeTab === 'recruitment' && 'Recruitment pipeline and hiring process'}
                {activeTab === 'performance' && 'Staff performance monitoring and evaluation'}
                {activeTab === 'training' && 'Training programs and compliance tracking'}
                {activeTab === 'compliance' && 'HR compliance and regulatory requirements'}
                {activeTab === 'reports' && 'HR reports and analytics'}
                {activeTab === 'settings' && 'HR director preferences and configuration'}
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
