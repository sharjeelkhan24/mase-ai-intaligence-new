'use client';

import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Users, DollarSign, Clock, Target, Calendar, Download, Filter } from 'lucide-react';
import AdminNavbar from '@/app/components/admin-dashboard/AdminNavbar';
import SubscriptionGuard from '@/app/components/admin-dashboard/SubscriptionGuard';

export default function AnalyticsPro() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Sample analytics data
  const kpiMetrics = [
    {
      title: 'Revenue Growth',
      value: '+24.8%',
      subValue: '$145,230',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Staff Utilization',
      value: '87.2%',
      subValue: '124/142 active',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg. Assignment Duration',
      value: '14.5 days',
      subValue: '-2.3 days',
      trend: 'down',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Client Satisfaction',
      value: '4.8/5.0',
      subValue: '+0.3 from last month',
      trend: 'up',
      icon: Target,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  // Sample department performance data
  const departmentData = [
    { name: 'Emergency', revenue: 45230, staffCount: 34, utilization: 92, satisfaction: 4.9 },
    { name: 'ICU', revenue: 38750, staffCount: 28, utilization: 89, satisfaction: 4.7 },
    { name: 'Surgery', revenue: 32150, staffCount: 22, utilization: 85, satisfaction: 4.8 },
    { name: 'Pediatrics', revenue: 28900, staffCount: 18, utilization: 91, satisfaction: 4.9 },
    { name: 'Medical/Surgical', revenue: 25640, staffCount: 24, utilization: 78, satisfaction: 4.6 }
  ];

  // Sample trending data
  const trendsData = [
    { period: 'Jan', revenue: 98500, assignments: 145, satisfaction: 4.5 },
    { period: 'Feb', revenue: 112300, assignments: 162, satisfaction: 4.6 },
    { period: 'Mar', revenue: 125800, assignments: 178, satisfaction: 4.7 },
    { period: 'Apr', revenue: 118600, assignments: 156, satisfaction: 4.8 },
    { period: 'May', revenue: 145230, assignments: 189, satisfaction: 4.8 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-green-600';
    if (utilization >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <SubscriptionGuard 
      requiredSubscription="Analytics Pro" 
      featureName="Analytics Pro"
    >
      <div className="min-h-screen bg-gray-50 flex">
        {/* Admin Navbar Component */}
        <AdminNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Analytics Pro
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Advanced insights and performance analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
                <option value="year">Last 12 months</option>
              </select>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {kpiMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className={`${metric.bgColor} p-6 rounded-lg border border-gray-200`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700 font-[family-name:var(--font-adlam-display)]">
                      {metric.title}
                    </h3>
                    <IconComponent className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div className="space-y-2">
                    <p className={`text-2xl font-bold ${metric.color} font-[family-name:var(--font-adlam-display)]`}>
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                      {metric.subValue}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Trends Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Revenue Trends
                </h3>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                >
                  <option value="revenue">Revenue</option>
                  <option value="assignments">Assignments</option>
                  <option value="satisfaction">Satisfaction</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">Revenue Trends Chart</p>
                  <p className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">
                    {selectedMetric === 'revenue' && 'Revenue data visualization'}
                    {selectedMetric === 'assignments' && 'Assignment count visualization'}
                    {selectedMetric === 'satisfaction' && 'Satisfaction score visualization'}
                  </p>
                </div>
              </div>
            </div>

            {/* Department Performance */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Department Performance
                </h3>
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">Department Performance Chart</p>
                  <p className="text-sm text-gray-400 font-[family-name:var(--font-adlam-display)]">Pie chart visualization would go here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Department Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Department Statistics
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {dept.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {dept.staffCount} staff
                          </span>
                          <span className={`text-xs font-medium ${getUtilizationColor(dept.utilization)} font-[family-name:var(--font-adlam-display)]`}>
                            {dept.utilization}% utilization
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                          {formatCurrency(dept.revenue)}
                        </p>
                        <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                          {dept.satisfaction}★ rating
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  Monthly Trends
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                        Assignments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trendsData.map((trend, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            {trend.period}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            {formatCurrency(trend.revenue)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            {trend.assignments}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">
                              {trend.satisfaction}
                            </span>
                            <span className="text-yellow-400 ml-1">★</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Performance Insights & Recommendations
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <h4 className="text-sm font-semibold text-green-800 font-[family-name:var(--font-adlam-display)]">
                      Strong Performance
                    </h4>
                  </div>
                  <p className="text-sm text-green-700 font-[family-name:var(--font-adlam-display)]">
                    Emergency department showing 92% utilization with highest client satisfaction (4.9/5).
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-3">
                    <Target className="w-5 h-5 text-yellow-600 mr-2" />
                    <h4 className="text-sm font-semibold text-yellow-800 font-[family-name:var(--font-adlam-display)]">
                      Optimization Opportunity
                    </h4>
                  </div>
                  <p className="text-sm text-yellow-700 font-[family-name:var(--font-adlam-display)]">
                    Medical/Surgical department has lower utilization (78%). Consider staff reallocation.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-3">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-sm font-semibold text-blue-800 font-[family-name:var(--font-adlam-display)]">
                      Revenue Growth
                    </h4>
                  </div>
                  <p className="text-sm text-blue-700 font-[family-name:var(--font-adlam-display)]">
                    24.8% revenue growth this month. Focus on maintaining emergency and ICU departments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SubscriptionGuard>
  );
}
