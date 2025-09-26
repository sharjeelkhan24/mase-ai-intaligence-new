'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Share2,
  Target,
  FileText,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  Heart,
  Star,
  Eye,
  ThumbsUp,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Camera,
  Edit3
} from 'lucide-react';
import MarketingSpecialistNavbar from '@/app/components/marketing-specialist-dashboard/MarketingSpecialistNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function MarketingSpecialistDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only marketing-specialist role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('marketing-specialist');

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
  const marketingMetrics = {
    contentCreated: 24,
    socialMediaPosts: 156,
    engagementRate: 8.5,
    reach: 12400,
    websiteTraffic: 3420,
    conversionRate: 6.2
  };

  const recentContent = [
    { id: 1, type: 'social', title: 'Patient Success Story - Instagram Post', status: 'published', engagement: 245, date: '2 hours ago' },
    { id: 2, type: 'blog', title: 'Healthcare Tips for Seniors', status: 'draft', engagement: 0, date: '1 day ago' },
    { id: 3, type: 'video', title: 'Facility Tour Video', status: 'published', engagement: 189, date: '2 days ago' },
    { id: 4, type: 'social', title: 'Staff Spotlight - Facebook Post', status: 'scheduled', engagement: 0, date: '3 days ago' }
  ];

  const socialMediaStats = [
    { platform: 'Facebook', followers: 5600, engagement: 7.2, posts: 45, color: 'bg-blue-500' },
    { platform: 'Instagram', followers: 3200, engagement: 12.5, posts: 38, color: 'bg-pink-500' },
    { platform: 'LinkedIn', followers: 1800, engagement: 4.8, posts: 22, color: 'bg-blue-600' },
    { platform: 'Twitter', followers: 1200, engagement: 6.1, posts: 28, color: 'bg-sky-500' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'content-creation', label: 'Content Creation', icon: Edit3 },
    { id: 'social-media', label: 'Social Media', icon: Share2 },
    { id: 'patient-outreach', label: 'Patient Outreach', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
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
              <p className="text-sm font-medium text-gray-600">Content Created</p>
              <p className="text-3xl font-bold text-gray-900">{marketingMetrics.contentCreated}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Edit3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +6 this week
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Media Reach</p>
              <p className="text-3xl font-bold text-gray-900">{marketingMetrics.reach.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Share2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +15.2% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-3xl font-bold text-gray-900">{marketingMetrics.engagementRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Above target (6%)
          </div>
        </div>
      </div>

      {/* Recent Content and Social Media Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Edit3 className="w-5 h-5 mr-2 text-blue-500" />
            Recent Content
          </h3>
          <div className="space-y-3">
            {recentContent.map((content) => (
              <div key={content.id} className={`p-3 rounded-lg border-l-4 ${
                content.status === 'published' ? 'border-green-500 bg-green-50' :
                content.status === 'draft' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{content.title}</p>
                    <p className="text-xs text-gray-500">{content.type} • {content.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{content.engagement} likes</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      content.status === 'published' ? 'bg-green-100 text-green-800' :
                      content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {content.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-purple-500" />
            Social Media Performance
          </h3>
          <div className="space-y-3">
            {socialMediaStats.map((platform, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${platform.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-900">{platform.platform}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{platform.followers.toLocaleString()}</span>
                  <span className="text-sm font-bold text-gray-900">{platform.engagement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentCreation = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Creation Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Edit3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-600">Blog Posts</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-600">Videos</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Share2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">156</p>
            <p className="text-sm text-gray-600">Social Posts</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">8</p>
            <p className="text-sm text-gray-600">Newsletters</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSocialMedia = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {socialMediaStats.map((platform, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${platform.color} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-900">{platform.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{platform.followers.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{platform.engagement}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{platform.posts}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
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

  const renderPatientOutreach = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Outreach Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Email Campaigns</span>
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">8</p>
            <p className="text-sm text-gray-500">Active campaigns</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Open Rate</span>
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">24.5%</p>
            <p className="text-sm text-gray-500">Above industry average</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Click Rate</span>
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">6.2%</p>
            <p className="text-sm text-gray-500">Above target (5%)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Website Traffic</span>
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{marketingMetrics.websiteTraffic.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Monthly visitors</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{marketingMetrics.conversionRate}%</p>
            <p className="text-sm text-gray-500">Above target (5%)</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Social Engagement</span>
              <ThumbsUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{marketingMetrics.engagementRate}%</p>
            <p className="text-sm text-gray-500">Average across platforms</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Content Performance</h4>
            <p className="text-sm text-gray-500">Content engagement and reach metrics</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Share2 className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Social Media Report</h4>
            <p className="text-sm text-gray-500">Social media performance and trends</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Campaign Analytics</h4>
            <p className="text-sm text-gray-500">Campaign performance and ROI</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Heart className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">Patient Engagement</h4>
            <p className="text-sm text-gray-500">Patient outreach and satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Specialist Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Targets</label>
            <input
              type="text"
              defaultValue="Blog Posts: 4/week, Social Posts: 2/day"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Goals</label>
            <input
              type="text"
              defaultValue="Engagement Rate: 6%, Reach: 10K/month"
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
      case 'content-creation': 
        router.push('/marketing-specialist-dashboard/content-creation');
        return null;
      case 'social-media': 
        router.push('/marketing-specialist-dashboard/social-media');
        return null;
      case 'patient-outreach': 
        router.push('/marketing-specialist-dashboard/patient-outreach');
        return null;
      case 'analytics': 
        router.push('/marketing-specialist-dashboard/analytics');
        return null;
      case 'reports': 
        router.push('/marketing-specialist-dashboard/reports');
        return null;
      case 'settings': 
        router.push('/marketing-specialist-dashboard/settings');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Marketing Specialist Navbar Component */}
      <MarketingSpecialistNavbar activeTab={activeTab} />

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
                {activeTab === 'dashboard' && 'Marketing operations overview and key metrics'}
                {activeTab === 'content-creation' && 'Content creation tools and management'}
                {activeTab === 'social-media' && 'Social media management and performance'}
                {activeTab === 'patient-outreach' && 'Patient outreach campaigns and engagement'}
                {activeTab === 'analytics' && 'Marketing analytics and performance insights'}
                {activeTab === 'reports' && 'Marketing reports and campaign analysis'}
                {activeTab === 'settings' && 'Marketing specialist preferences and configuration'}
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
