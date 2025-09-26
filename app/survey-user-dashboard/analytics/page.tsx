'use client';

import React from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Download,
  Calendar,
  Filter,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import SurveyUserNavbar from '@/app/components/survey-user-dashboard/SurveyUserNavbar';

export default function SurveyAnalyticsPage() {
  const activeTab = 'analytics';

  const analyticsStats = [
    { metric: 'Response Rate', value: '87%', change: '+5%', color: 'text-green-600' },
    { metric: 'Average Score', value: '4.2/5', change: '+0.3', color: 'text-blue-600' },
    { metric: 'Total Responses', value: '1,247', change: '+89', color: 'text-purple-600' },
    { metric: 'Completion Time', value: '3.2 min', change: '-0.5', color: 'text-orange-600' }
  ];

  const analyticsCharts = [
    { id: 1, title: 'Patient Satisfaction Trends', type: 'Line Chart', data: 'Monthly satisfaction scores over time', lastUpdated: '2024-01-15', status: 'active' },
    { id: 2, title: 'Response Distribution', type: 'Pie Chart', data: 'Breakdown of responses by category', lastUpdated: '2024-01-14', status: 'active' },
    { id: 3, title: 'Staff Performance Metrics', type: 'Bar Chart', data: 'Performance scores by department', lastUpdated: '2024-01-13', status: 'active' },
    { id: 4, title: 'Quality Score Analysis', type: 'Line Chart', data: 'Quality metrics over time', lastUpdated: '2024-01-12', status: 'pending' }
  ];

  const recentInsights = [
    { id: 1, insight: 'Patient satisfaction increased by 12% this month', date: '2024-01-15', chart: 'Patient Satisfaction Trends', impact: 'positive' },
    { id: 2, insight: 'Response rate improved in ICU department', date: '2024-01-14', chart: 'Response Distribution', impact: 'positive' },
    { id: 3, insight: 'Staff performance metrics show consistent improvement', date: '2024-01-13', chart: 'Staff Performance Metrics', impact: 'positive' },
    { id: 4, insight: 'Quality scores need attention in Emergency department', date: '2024-01-12', chart: 'Quality Score Analysis', impact: 'negative' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SurveyUserNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Analytics</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Analyze survey data and generate insights</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Create Analysis
            </button>
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Analytics Charts</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analyticsCharts.map((chart) => (
                    <div key={chart.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          {chart.type === 'Line Chart' ? <LineChart className="w-5 h-5 text-blue-600" /> :
                           chart.type === 'Pie Chart' ? <PieChart className="w-5 h-5 text-green-600" /> :
                           <BarChart3 className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{chart.title}</h4>
                          <p className="text-sm text-gray-500">{chart.type} • {chart.data}</p>
                          <p className="text-sm text-gray-500">Last updated: {new Date(chart.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          chart.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {chart.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Insights</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentInsights.map((insight) => (
                    <div key={insight.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          insight.impact === 'positive' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {insight.impact === 'positive' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                           <AlertCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{insight.insight}</h4>
                          <p className="text-sm text-gray-500">{insight.chart} • {new Date(insight.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          insight.impact === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {insight.impact}
                        </span>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
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

