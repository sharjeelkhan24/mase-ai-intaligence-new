'use client';

import React from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Eye,
  ThumbsUp,
  Share2,
  Users,
  Calendar,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import MarketingSpecialistNavbar from '@/app/components/marketing-specialist-dashboard/MarketingSpecialistNavbar';

export default function AnalyticsPage() {
  const activeTab = 'analytics';

  // Sample analytics data
  const analyticsMetrics = [
    { metric: 'Website Traffic', value: '3,420', change: '+15.2%', trend: 'up', color: 'text-blue-600' },
    { metric: 'Conversion Rate', value: '6.2%', change: '+2.1%', trend: 'up', color: 'text-green-600' },
    { metric: 'Social Engagement', value: '1,245', change: '+8.5%', trend: 'up', color: 'text-purple-600' },
    { metric: 'Email Open Rate', value: '52.3%', change: '-1.2%', trend: 'down', color: 'text-orange-600' }
  ];

  const topContent = [
    { id: 1, title: 'Healthcare Tips for Seniors', type: 'Blog Post', views: 1245, engagement: 89, date: '1 week ago' },
    { id: 2, title: 'Patient Success Story - Instagram', type: 'Social Media', views: 892, engagement: 156, date: '3 days ago' },
    { id: 3, title: 'Facility Tour Video', type: 'Video', views: 756, engagement: 67, date: '1 week ago' },
    { id: 4, title: 'Medicare Benefits Guide', type: 'Blog Post', views: 634, engagement: 45, date: '2 weeks ago' }
  ];

  const trafficSources = [
    { source: 'Organic Search', percentage: 45, visitors: 1539, color: 'bg-blue-500' },
    { source: 'Social Media', percentage: 28, visitors: 958, color: 'bg-green-500' },
    { source: 'Direct', percentage: 15, visitors: 513, color: 'bg-purple-500' },
    { source: 'Email', percentage: 12, visitors: 410, color: 'bg-orange-500' }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Marketing Analytics
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Track and analyze your marketing performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsMetrics.map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">{metric.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        {metric.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <p className={`text-sm font-medium ${metric.color}`}>{metric.change}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Traffic Sources */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Traffic Sources</h3>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${source.color}`}></div>
                      <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{source.source}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${source.color}`} style={{ width: `${source.percentage}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-500 w-16 text-right">{source.percentage}%</span>
                      <span className="text-sm font-medium text-gray-900 w-20 text-right">{source.visitors}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Content */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Top Performing Content</h3>
                <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
              </div>
              <div className="space-y-4">
                {topContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        {content.type === 'Blog Post' && <BarChart3 className="w-5 h-5 text-blue-600" />}
                        {content.type === 'Social Media' && <Share2 className="w-5 h-5 text-pink-600" />}
                        {content.type === 'Video' && <TrendingUp className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{content.title}</h4>
                        <p className="text-sm text-gray-500">{content.type} • {content.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Views</p>
                        <p className="font-semibold text-gray-900">{content.views}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Engagement</p>
                        <p className="font-semibold text-gray-900">{content.engagement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Engagement Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Total Views</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">12,400</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Total Likes</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">1,245</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Share2 className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Total Shares</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">567</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Campaign Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Email Campaigns</span>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">52.3%</p>
                      <p className="text-sm text-gray-500">Open Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Social Media</span>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">8.5%</p>
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Website</span>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">6.2%</p>
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
