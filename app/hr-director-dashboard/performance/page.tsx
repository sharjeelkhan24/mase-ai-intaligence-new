'use client';

import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Calendar,
  Eye,
  Edit,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import HRDirectorNavbar from '@/app/components/hr-director-dashboard/HRDirectorNavbar';

export default function PerformancePage() {
  const activeTab = 'performance';

  // Sample performance data
  const performanceMetrics = [
    { metric: 'Average Rating', value: '4.3', change: '+0.2', color: 'text-green-600' },
    { metric: 'Reviews Completed', value: '89', change: '+12', color: 'text-blue-600' },
    { metric: 'Goals Achieved', value: '76%', change: '+8%', color: 'text-purple-600' },
    { metric: 'Training Completed', value: '94%', change: '+5%', color: 'text-orange-600' }
  ];

  const performanceReviews = [
    { id: 1, employee: 'Sarah Johnson', role: 'Staff Nurse', rating: 4.5, status: 'completed', reviewDate: '2024-01-15', reviewer: 'Mike Chen', goals: 8, achieved: 7 },
    { id: 2, employee: 'Emily Rodriguez', role: 'Staff Nurse', rating: 4.2, status: 'completed', reviewDate: '2024-01-12', reviewer: 'Mike Chen', goals: 6, achieved: 5 },
    { id: 3, employee: 'David Wilson', role: 'HR Specialist', rating: 4.7, status: 'completed', reviewDate: '2024-01-10', reviewer: 'Jennifer Martinez', goals: 7, achieved: 7 },
    { id: 4, employee: 'Lisa Chen', role: 'Marketing Manager', rating: 4.1, status: 'pending', reviewDate: '2024-01-20', reviewer: 'Jennifer Martinez', goals: 5, achieved: 0 }
  ];

  const topPerformers = [
    { id: 1, name: 'David Wilson', role: 'HR Specialist', rating: 4.7, achievements: 7, department: 'Human Resources' },
    { id: 2, name: 'Sarah Johnson', role: 'Staff Nurse', rating: 4.5, achievements: 7, department: 'Nursing' },
    { id: 3, name: 'Emily Rodriguez', role: 'Staff Nurse', rating: 4.2, achievements: 5, department: 'Nursing' },
    { id: 4, name: 'Mike Chen', role: 'Nurse Manager', rating: 4.0, achievements: 6, department: 'Nursing' }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Performance Management
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Track and manage staff performance reviews and goals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Schedule Review
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">{metric.metric}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${metric.color}`}>{metric.change}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Performance Reviews</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Goals</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Review Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {performanceReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {review.employee.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{review.employee}</div>
                              <div className="text-sm text-gray-500">Reviewed by: {review.reviewer}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">{review.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                            <div className="ml-2 flex">
                              {[...Array(5)].map((_, i) => (
                                <Award
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            review.status === 'completed' ? 'bg-green-100 text-green-800' :
                            review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {review.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.achieved}/{review.goals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Top Performers</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topPerformers.map((performer) => (
                    <div key={performer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-blue-600">
                              {performer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{performer.name}</h4>
                          <p className="text-sm text-gray-500">{performer.role} • {performer.department}</p>
                          <p className="text-sm text-gray-500">{performer.achievements} goals achieved</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900 mr-2">{performer.rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Award
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(performer.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
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
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Schedule Review</h4>
                    <p className="text-sm text-gray-500">Schedule a performance review</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Target className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Set Goals</h4>
                    <p className="text-sm text-gray-500">Set performance goals for staff</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Award className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Recognize Performance</h4>
                    <p className="text-sm text-gray-500">Recognize outstanding performance</p>
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
