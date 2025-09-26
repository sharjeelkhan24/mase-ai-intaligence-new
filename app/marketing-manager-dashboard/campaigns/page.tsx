'use client';

import React from 'react';
import {
  Megaphone,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Target,
  Users,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import MarketingManagerNavbar from '@/app/components/marketing-manager-dashboard/MarketingManagerNavbar';

export default function MarketingCampaignsPage() {
  const activeTab = 'campaigns';

  // Sample campaign data
  const campaignStats = [
    { metric: 'Active Campaigns', value: '8', change: '+2', color: 'text-blue-600' },
    { metric: 'Total Reach', value: '24.5K', change: '+3.2K', color: 'text-green-600' },
    { metric: 'Engagement Rate', value: '12.4%', change: '+1.8%', color: 'text-purple-600' },
    { metric: 'Conversion Rate', value: '3.2%', change: '+0.5%', color: 'text-orange-600' }
  ];

  const campaigns = [
    { id: 1, name: 'Spring Health Awareness', type: 'Digital', status: 'active', startDate: '2024-01-15', endDate: '2024-03-15', budget: '$5,000', reach: '8,500', engagement: '15.2%', conversion: '4.1%' },
    { id: 2, name: 'Patient Portal Launch', type: 'Email', status: 'active', startDate: '2024-01-10', endDate: '2024-02-10', budget: '$2,500', reach: '3,200', engagement: '8.7%', conversion: '2.3%' },
    { id: 3, name: 'Community Health Fair', type: 'Event', status: 'completed', startDate: '2023-12-01', endDate: '2023-12-15', budget: '$8,000', reach: '12,800', engagement: '22.1%', conversion: '6.8%' },
    { id: 4, name: 'Telehealth Services', type: 'Social Media', status: 'draft', startDate: '2024-02-01', endDate: '2024-04-01', budget: '$4,500', reach: '0', engagement: '0%', conversion: '0%' }
  ];

  const recentActivities = [
    { id: 1, campaign: 'Spring Health Awareness', action: 'Campaign launched', date: '2024-01-15', user: 'Lisa Chen' },
    { id: 2, campaign: 'Patient Portal Launch', action: 'Email sent to 3,200 recipients', date: '2024-01-14', user: 'Mike Chen' },
    { id: 3, campaign: 'Community Health Fair', action: 'Campaign completed successfully', date: '2024-01-12', user: 'Emily Rodriguez' },
    { id: 4, campaign: 'Telehealth Services', action: 'Campaign created', date: '2024-01-10', user: 'David Wilson' }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Marketing Campaigns
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Create and manage marketing campaigns for your healthcare agency
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Campaign Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {campaignStats.map((stat, index) => (
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

            {/* Campaigns Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Campaigns Overview</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Campaign</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Reach</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.budget}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.reach}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.engagement}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Activities</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Megaphone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{activity.campaign}</h4>
                          <p className="text-sm text-gray-500">{activity.action}</p>
                          <p className="text-xs text-gray-400">By {activity.user} • {new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Megaphone className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Create Campaign</h4>
                    <p className="text-sm text-gray-500">Launch a new marketing campaign</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">View Analytics</h4>
                    <p className="text-sm text-gray-500">Analyze campaign performance</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Target className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Set Targets</h4>
                    <p className="text-sm text-gray-500">Define campaign objectives</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
