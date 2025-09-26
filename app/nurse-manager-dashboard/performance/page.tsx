'use client';

import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Eye,
  Edit,
  Plus,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import NurseManagerNavbar from '@/app/components/nurse-manager-dashboard/NurseManagerNavbar';

export default function NursePerformancePage() {
  const activeTab = 'performance';

  const performanceStats = [
    { metric: 'Average Rating', value: '4.3', change: '+0.2', color: 'text-green-600' },
    { metric: 'Reviews Completed', value: '89', change: '+12', color: 'text-blue-600' },
    { metric: 'Goals Achieved', value: '76%', change: '+8%', color: 'text-purple-600' },
    { metric: 'Training Completed', value: '94%', change: '+5%', color: 'text-orange-600' }
  ];

  const performanceReviews = [
    { id: 1, nurse: 'Sarah Johnson', rating: 4.5, status: 'completed', reviewDate: '2024-01-15', goals: 8, achieved: 7 },
    { id: 2, nurse: 'Mike Chen', rating: 4.2, status: 'completed', reviewDate: '2024-01-12', goals: 6, achieved: 5 },
    { id: 3, nurse: 'Emily Rodriguez', rating: 4.7, status: 'completed', reviewDate: '2024-01-10', goals: 7, achieved: 7 },
    { id: 4, nurse: 'David Wilson', rating: 4.1, status: 'pending', reviewDate: '2024-01-20', goals: 5, achieved: 0 }
  ];

  const topPerformers = [
    { id: 1, name: 'Emily Rodriguez', rating: 4.7, achievements: 7, department: 'ICU' },
    { id: 2, name: 'Sarah Johnson', rating: 4.5, achievements: 7, department: 'Emergency' },
    { id: 3, name: 'Mike Chen', rating: 4.2, achievements: 5, department: 'Medical-Surgical' },
    { id: 4, name: 'David Wilson', rating: 4.1, achievements: 6, department: 'ICU' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NurseManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Performance Management</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Track and manage nursing staff performance</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Schedule Review
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceStats.map((stat, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Performance Reviews</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {performanceReviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {review.nurse.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{review.nurse}</h4>
                          <p className="text-sm text-gray-500">Goals: {review.achieved}/{review.goals} • Review: {new Date(review.reviewDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{review.rating}</p>
                          <div className="flex">
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
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          review.status === 'completed' ? 'bg-green-100 text-green-800' :
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {review.status}
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
                          <p className="text-sm text-gray-500">{performer.department} • {performer.achievements} goals achieved</p>
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
          </div>
        </main>
      </div>
    </div>
  );
}
