'use client';

import React from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  Download,
  Calendar,
  Users,
  Target,
  Award
} from 'lucide-react';
import MarketingManagerNavbar from '@/app/components/marketing-manager-dashboard/MarketingManagerNavbar';

export default function MarketingAnalyticsPage() {
  const activeTab = 'analytics';

  const analyticsStats = [
    { metric: 'Total Reach', value: '24.5K', change: '+3.2K', color: 'text-blue-600' },
    { metric: 'Engagement Rate', value: '12.4%', change: '+1.8%', color: 'text-green-600' },
    { metric: 'Conversion Rate', value: '3.2%', change: '+0.5%', color: 'text-purple-600' },
    { metric: 'ROI', value: '285%', change: '+15%', color: 'text-orange-600' }
  ];

  const campaignPerformance = [
    { name: 'Spring Health Awareness', reach: 8500, engagement: 15.2, conversion: 4.1, roi: 320 },
    { name: 'Patient Portal Launch', reach: 3200, engagement: 8.7, conversion: 2.3, roi: 180 },
    { name: 'Community Health Fair', reach: 12800, engagement: 22.1, conversion: 6.8, roi: 450 },
    { name: 'Telehealth Services', reach: 0, engagement: 0, conversion: 0, roi: 0 }
  ];

  const audienceInsights = [
    { segment: 'Age 25-34', percentage: 35, engagement: 14.2 },
    { segment: 'Age 35-44', percentage: 28, engagement: 12.8 },
    { segment: 'Age 45-54', percentage: 22, engagement: 10.5 },
    { segment: 'Age 55+', percentage: 15, engagement: 8.9 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MarketingManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Marketing Analytics</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Analyze marketing performance and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Download className="w-4 h-4 inline mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsStats.map((stat, index) => (
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Campaign Performance</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {campaignPerformance.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{campaign.name}</h4>
                          <p className="text-sm text-gray-500">Reach: {campaign.reach.toLocaleString()} • Engagement: {campaign.engagement}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Conversion: {campaign.conversion}%</p>
                          <p className="text-sm text-gray-500">ROI: {campaign.roi}%</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Audience Insights</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {audienceInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{insight.segment}</h4>
                        <span className="text-sm font-medium text-gray-500">{insight.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${insight.percentage}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-500">Engagement: {insight.engagement}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
