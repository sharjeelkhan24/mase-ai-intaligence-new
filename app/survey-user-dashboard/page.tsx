'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardList,
  BarChart3,
  FileText,
  TrendingUp,
  Settings,
  Bell,
  Search,
  User,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  Users,
  Star,
  PieChart,
  Activity
} from 'lucide-react';
import SurveyUserNavbar from '@/app/components/survey-user-dashboard/SurveyUserNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function SurveyUserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only survey-user role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('survey-user');

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
  const surveyMetrics = {
    totalSurveys: 18,
    activeSurveys: 8,
    responsesCollected: 1247,
    responseRate: 78.5,
    averageRating: 4.3,
    completionRate: 85.2
  };

  const recentSurveys = [
    { id: 1, title: 'Patient Satisfaction Survey', status: 'active', responses: 156, completion: 89, date: '2 days ago' },
    { id: 2, title: 'Staff Training Feedback', status: 'completed', responses: 89, completion: 95, date: '1 week ago' },
    { id: 3, title: 'Service Quality Assessment', status: 'active', responses: 234, completion: 82, date: '3 days ago' },
    { id: 4, title: 'Facility Environment Review', status: 'draft', responses: 0, completion: 0, date: '5 days ago' }
  ];

  const surveyCategories = [
    { category: 'Patient Satisfaction', count: 8, responses: 456, avgRating: 4.4, color: 'bg-blue-500' },
    { category: 'Staff Feedback', count: 5, responses: 234, avgRating: 4.2, color: 'bg-green-500' },
    { category: 'Service Quality', count: 3, responses: 189, avgRating: 4.1, color: 'bg-purple-500' },
    { category: 'Facility Assessment', count: 2, responses: 156, avgRating: 4.3, color: 'bg-orange-500' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'surveys', label: 'Surveys', icon: ClipboardList },
    { id: 'data-collection', label: 'Data Collection', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Surveys</p>
              <p className="text-3xl font-bold text-gray-900">{surveyMetrics.activeSurveys}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2 this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900">{surveyMetrics.responseRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Above target (70%)
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{surveyMetrics.averageRating}/5</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Above target (4.0)
          </div>
        </div>
      </div>

      {/* Recent Surveys and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2 text-blue-500" />
            Recent Surveys
          </h3>
          <div className="space-y-3">
            {recentSurveys.map((survey) => (
              <div key={survey.id} className={`p-3 rounded-lg border-l-4 ${
                survey.status === 'active' ? 'border-green-500 bg-green-50' :
                survey.status === 'completed' ? 'border-blue-500 bg-blue-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{survey.title}</p>
                    <p className="text-xs text-gray-500">{survey.responses} responses • {survey.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{survey.completion}%</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      survey.status === 'active' ? 'bg-green-100 text-green-800' :
                      survey.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {survey.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-500" />
            Survey Categories
          </h3>
          <div className="space-y-3">
            {surveyCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{category.category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{category.count}</span>
                  <span className="text-sm font-bold text-gray-900">{category.avgRating}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSurveys = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Survey Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSurveys.map((survey) => (
                <tr key={survey.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{survey.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      survey.status === 'active' ? 'bg-green-100 text-green-800' :
                      survey.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {survey.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.responses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.completion}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{survey.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDataCollection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Collection Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{surveyMetrics.totalSurveys}</p>
            <p className="text-sm text-gray-600">Total Surveys</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{surveyMetrics.responsesCollected.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Responses Collected</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{surveyMetrics.responseRate}%</p>
            <p className="text-sm text-gray-600">Response Rate</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{surveyMetrics.completionRate}%</p>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Survey Performance</h4>
            <p className="text-sm text-gray-500">Response rates and completion metrics</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <PieChart className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Response Analysis</h4>
            <p className="text-sm text-gray-500">Detailed response breakdown and trends</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Trend Analysis</h4>
            <p className="text-sm text-gray-500">Survey trends and performance over time</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Star className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">Satisfaction Report</h4>
            <p className="text-sm text-gray-500">Patient and staff satisfaction metrics</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Response Rate</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{surveyMetrics.responseRate}%</p>
            <p className="text-sm text-gray-500">Above target (70%)</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Average Rating</span>
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{surveyMetrics.averageRating}/5</p>
            <p className="text-sm text-gray-500">Above target (4.0)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey User Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Response Targets</label>
            <input
              type="text"
              defaultValue="Response Rate: 70%, Completion Rate: 80%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Survey Schedule</label>
            <input
              type="text"
              defaultValue="Patient Surveys: Monthly, Staff Surveys: Quarterly"
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
      case 'surveys': return renderSurveys();
      case 'data-collection': return renderDataCollection();
      case 'reports': return renderReports();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Survey User Navbar Component */}
      <SurveyUserNavbar activeTab={activeTab} />

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
                {activeTab === 'dashboard' && 'Survey operations overview and key metrics'}
                {activeTab === 'surveys' && 'Survey management and creation'}
                {activeTab === 'data-collection' && 'Data collection and response tracking'}
                {activeTab === 'reports' && 'Survey reports and analysis'}
                {activeTab === 'analytics' && 'Survey analytics and insights'}
                {activeTab === 'settings' && 'Survey user preferences and configuration'}
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
