'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Calendar,
  Heart,
  Award,
  MessageSquare,
  Settings,
  Bell,
  Search,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileText,
  Stethoscope,
  Activity
} from 'lucide-react';
import NurseManagerNavbar from '@/app/components/nurse-manager-dashboard/NurseManagerNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';
import { useStaffData } from '@/lib/hooks/useStaffData';

export default function NurseManagerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only nurse-manager role can access this dashboard
  const { isValid, isLoading: roleLoading, userInfo } = useRoleValidation('nurse-manager');
  
  // Fetch detailed staff data for the logged-in user
  const { staffData, isLoading: staffLoading, error: staffError } = useStaffData();

  // Show loading screen while role validation or staff data is loading
  if (roleLoading || staffLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 font-[family-name:var(--font-adlam-display)]">
            {roleLoading ? 'Validating access permissions...' : 'Loading your data...'}
          </p>
        </div>
      </div>
    );
  }

  // If role validation failed, the hook will handle redirect
  if (!isValid || !userInfo) {
    return null;
  }

  // Show error if staff data failed to load
  if (staffError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <p className="text-lg text-gray-600 font-[family-name:var(--font-adlam-display)]">
            Error loading your data: {staffError}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Dynamic data based on logged-in user
  const managerMetrics = {
    totalStaff: 24,
    activeShifts: 18,
    patientLoad: 89,
    qualityScore: 94.2,
    staffSatisfaction: 4.3,
    overtimeHours: 12
  };

  // Get user's full name from staff data
  const getUserDisplayName = () => {
    if (staffData?.first_name && staffData?.last_name) {
      return `${staffData.first_name} ${staffData.last_name}`;
    }
    if (staffData?.email) {
      return staffData.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Nurse Manager';
  };

  const userDisplayName = getUserDisplayName();

  const staffSchedule = [
    { id: 1, name: 'Sarah Johnson', role: 'Staff Nurse', shift: 'Day (7AM-7PM)', status: 'active', patients: 6 },
    { id: 2, name: 'Mike Chen', role: 'Staff Nurse', shift: 'Night (7PM-7AM)', status: 'active', patients: 5 },
    { id: 3, name: 'Emily Rodriguez', role: 'Staff Nurse', shift: 'Day (7AM-7PM)', status: 'active', patients: 7 },
    { id: 4, name: 'David Wilson', role: 'Staff Nurse', shift: 'Evening (3PM-11PM)', status: 'break', patients: 4 }
  ];

  const recentAlerts = [
    { id: 1, type: 'staffing', message: 'ICU needs 2 additional nurses for night shift', priority: 'high', time: '30 min ago' },
    { id: 2, type: 'patient', message: 'Patient in Room 204 requires immediate attention', priority: 'medium', time: '1 hour ago' },
    { id: 3, type: 'quality', message: 'Medication error reported - investigation needed', priority: 'high', time: '2 hours ago' },
    { id: 4, type: 'schedule', message: '3 staff members called in sick for tomorrow', priority: 'medium', time: '3 hours ago' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'staff-schedule', label: 'Staff Schedule', icon: Calendar },
    { id: 'patient-care', label: 'Patient Care', icon: Heart },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'quality', label: 'Quality', icon: CheckCircle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
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
              <p className="text-3xl font-bold text-gray-900">{managerMetrics.totalStaff}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2 new hires this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Shifts</p>
              <p className="text-3xl font-bold text-gray-900">{managerMetrics.activeShifts}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            All shifts covered
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quality Score</p>
              <p className="text-3xl font-bold text-gray-900">{managerMetrics.qualityScore}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Above target (90%)
          </div>
        </div>
      </div>

      {/* Staff Schedule and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Current Staff Schedule
          </h3>
          <div className="space-y-3">
            {staffSchedule.map((staff) => (
              <div key={staff.id} className={`p-3 rounded-lg border-l-4 ${
                staff.status === 'active' ? 'border-green-500 bg-green-50' :
                staff.status === 'break' ? 'border-yellow-500 bg-yellow-50' :
                'border-gray-500 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                    <p className="text-xs text-gray-500">{staff.role} • {staff.shift}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{staff.patients} patients</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' :
                      staff.status === 'break' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );

  const renderStaffSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">18</p>
            <p className="text-sm text-gray-600">Active Shifts</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">24</p>
            <p className="text-sm text-gray-600">Total Staff</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">12h</p>
            <p className="text-sm text-gray-600">Overtime Hours</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPatientCare = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Care Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{managerMetrics.patientLoad}</p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">94.2%</p>
            <p className="text-sm text-gray-600">Care Quality</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Stethoscope className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">4.3/5</p>
            <p className="text-sm text-gray-600">Staff Satisfaction</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">2.1%</p>
            <p className="text-sm text-gray-600">Incident Rate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
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
              {staffSchedule.map((staff) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-sm text-gray-900">92%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.patients}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' :
                      staff.status === 'break' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
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

  const renderQuality = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Overall Quality</span>
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">94.2%</p>
            <p className="text-sm text-gray-500">Above target (90%)</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Patient Satisfaction</span>
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">4.3/5</p>
            <p className="text-sm text-gray-500">Above target (4.0)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Messages</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Staff Meeting Reminder</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-600">Weekly staff meeting tomorrow at 2 PM in Conference Room A</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">New Protocol Update</span>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <p className="text-sm text-gray-600">Updated medication administration protocol effective immediately</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nurse Manager Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Targets</label>
            <input
              type="text"
              defaultValue="Quality Score: 90%, Patient Satisfaction: 4.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staffing Thresholds</label>
            <input
              type="text"
              defaultValue="Min Staff: 18, Max Overtime: 20h/week"
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
      case 'staff-schedule': 
        router.push('/nurse-manager-dashboard/staff-schedule');
        return null;
      case 'patient-care': 
        router.push('/nurse-manager-dashboard/patient-care');
        return null;
      case 'performance': 
        router.push('/nurse-manager-dashboard/performance');
        return null;
      case 'quality': 
        router.push('/nurse-manager-dashboard/quality');
        return null;
      case 'messages': 
        router.push('/nurse-manager-dashboard/messages');
        return null;
      case 'settings': 
        router.push('/nurse-manager-dashboard/settings');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Nurse Manager Navbar Component */}
      <NurseManagerNavbar activeTab={activeTab} />

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
                {activeTab === 'dashboard' && `Welcome back, ${userDisplayName}! Nursing operations overview and key metrics`}
                {activeTab === 'staff-schedule' && 'Staff scheduling and shift management'}
                {activeTab === 'patient-care' && 'Patient care coordination and monitoring'}
                {activeTab === 'performance' && 'Staff performance evaluation and tracking'}
                {activeTab === 'quality' && 'Quality metrics and patient outcomes'}
                {activeTab === 'messages' && 'Team communication and announcements'}
                {activeTab === 'settings' && 'Nurse manager preferences and configuration'}
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
