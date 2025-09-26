'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Target,
  FileText,
  Settings,
  Bell,
  Search,
  User,
  Heart,
  Star,
  Share2,
  Eye,
  ThumbsUp,
  Calendar,
  DollarSign,
  PieChart
} from 'lucide-react';
import MarketingManagerNavbar from '@/app/components/marketing-manager-dashboard/MarketingManagerNavbar';
import { useRoleValidation } from '@/lib/hooks/useRoleValidation';

export default function MarketingManagerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  
  // Use role validation hook to ensure only marketing-manager role can access this dashboard
  const { isValid, isLoading, userInfo } = useRoleValidation('marketing-manager');

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
    totalCampaigns: 12,
    activeCampaigns: 8,
    patientSatisfaction: 4.6,
    socialMediaReach: 15600,
    websiteTraffic: 8940,
    conversionRate: 12.5
  };

  const recentCampaigns = [
    { id: 1, name: 'Summer Health Awareness', type: 'social', status: 'active', reach: 5600, engagement: 8.2, budget: 2500 },
    { id: 2, name: 'Patient Testimonial Series', type: 'content', status: 'completed', reach: 3200, engagement: 12.5, budget: 1800 },
    { id: 3, name: 'Community Health Fair', type: 'event', status: 'planning', reach: 0, engagement: 0, budget: 5000 },
    { id: 4, name: 'Healthcare Blog Series', type: 'content', status: 'active', reach: 2800, engagement: 6.8, budget: 1200 }
  ];

  const patientFeedback = [
    { id: 1, rating: 5, comment: 'Excellent care and professional staff', source: 'Google Reviews', date: '2 days ago' },
    { id: 2, rating: 4, comment: 'Very satisfied with the service quality', source: 'Facebook', date: '3 days ago' },
    { id: 3, rating: 5, comment: 'Outstanding patient care and attention', source: 'Website', date: '1 week ago' },
    { id: 4, rating: 4, comment: 'Great experience, highly recommend', source: 'Yelp', date: '1 week ago' }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'patient-feedback', label: 'Patient Feedback', icon: Heart },
    { id: 'brand-management', label: 'Brand Management', icon: Star },
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
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{marketingMetrics.activeCampaigns}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2 from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patient Satisfaction</p>
              <p className="text-3xl font-bold text-gray-900">{marketingMetrics.patientSatisfaction}/5</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Above target (4.5)
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Media Reach</p>
              <p className="text-3xl font-bold text-gray-900">{marketingMetrics.socialMediaReach.toLocaleString()}</p>
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
      </div>

      {/* Recent Campaigns and Patient Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Recent Campaigns
          </h3>
          <div className="space-y-3">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className={`p-3 rounded-lg border-l-4 ${
                campaign.status === 'active' ? 'border-green-500 bg-green-50' :
                campaign.status === 'completed' ? 'border-blue-500 bg-blue-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-xs text-gray-500">{campaign.type} • {campaign.reach.toLocaleString()} reach</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Patient Feedback
          </h3>
          <div className="space-y-3">
            {patientFeedback.map((feedback) => (
              <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{feedback.source}</span>
                </div>
                <p className="text-sm text-gray-900 mb-1">{feedback.comment}</p>
                <p className="text-xs text-gray-500">{feedback.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.type === 'social' ? 'bg-blue-100 text-blue-800' :
                      campaign.type === 'content' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {campaign.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.reach.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.engagement}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${campaign.budget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPatientFeedback = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Satisfaction Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">4.6/5</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <ThumbsUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">89%</p>
            <p className="text-sm text-gray-600">Positive Reviews</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">156</p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">+12%</p>
            <p className="text-sm text-gray-600">Growth Rate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandManagement = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Brand Awareness</span>
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">78%</p>
            <p className="text-sm text-gray-500">Above target (70%)</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Brand Loyalty</span>
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">85%</p>
            <p className="text-sm text-gray-500">Above target (80%)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-sm text-gray-500">Above target (10%)</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Social Engagement</span>
              <Share2 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">8.5%</p>
            <p className="text-sm text-gray-500">Average engagement</p>
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
            <h4 className="font-medium text-gray-900">Campaign Performance</h4>
            <p className="text-sm text-gray-500">Campaign metrics and ROI analysis</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <Heart className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Patient Satisfaction</h4>
            <p className="text-sm text-gray-500">Patient feedback and satisfaction trends</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Brand Analytics</h4>
            <p className="text-sm text-gray-500">Brand awareness and loyalty metrics</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <DollarSign className="w-8 h-8 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-900">ROI Report</h4>
            <p className="text-sm text-gray-500">Marketing spend and return analysis</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Manager Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Targets</label>
            <input
              type="text"
              defaultValue="Engagement: 8%, Conversion: 10%"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Goals</label>
            <input
              type="text"
              defaultValue="Awareness: 70%, Satisfaction: 4.5"
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
      case 'campaigns': 
        router.push('/marketing-manager-dashboard/campaigns');
        return null;
      case 'patient-feedback': 
        router.push('/marketing-manager-dashboard/patient-feedback');
        return null;
      case 'brand-management': 
        router.push('/marketing-manager-dashboard/brand-management');
        return null;
      case 'analytics': 
        router.push('/marketing-manager-dashboard/analytics');
        return null;
      case 'reports': 
        router.push('/marketing-manager-dashboard/reports');
        return null;
      case 'settings': 
        router.push('/marketing-manager-dashboard/settings');
        return null;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Marketing Manager Navbar Component */}
      <MarketingManagerNavbar activeTab={activeTab} />

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
                {activeTab === 'campaigns' && 'Campaign management and performance tracking'}
                {activeTab === 'patient-feedback' && 'Patient satisfaction and feedback analysis'}
                {activeTab === 'brand-management' && 'Brand performance and awareness metrics'}
                {activeTab === 'analytics' && 'Marketing analytics and performance insights'}
                {activeTab === 'reports' && 'Marketing reports and ROI analysis'}
                {activeTab === 'settings' && 'Marketing manager preferences and configuration'}
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
