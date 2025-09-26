'use client';

import React from 'react';
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import MarketingManagerNavbar from '@/app/components/marketing-manager-dashboard/MarketingManagerNavbar';

export default function PatientFeedbackPage() {
  const activeTab = 'patient-feedback';

  const feedbackStats = [
    { metric: 'Total Reviews', value: '1,247', change: '+89', color: 'text-blue-600' },
    { metric: 'Average Rating', value: '4.7/5', change: '+0.2', color: 'text-green-600' },
    { metric: 'Positive Feedback', value: '89%', change: '+3%', color: 'text-purple-600' },
    { metric: 'Response Rate', value: '94%', change: '+2%', color: 'text-orange-600' }
  ];

  const recentFeedback = [
    { id: 1, patient: 'Sarah Johnson', rating: 5, date: '2024-01-15', type: 'positive', comment: 'Excellent care and attention to detail. The staff was very professional and caring.', response: 'responded' },
    { id: 2, patient: 'Mike Chen', rating: 4, date: '2024-01-14', type: 'positive', comment: 'Good service overall, but waiting time could be improved.', response: 'pending' },
    { id: 3, patient: 'Emily Rodriguez', rating: 5, date: '2024-01-13', type: 'positive', comment: 'Outstanding experience from start to finish. Highly recommend!', response: 'responded' },
    { id: 4, patient: 'David Wilson', rating: 3, date: '2024-01-12', type: 'neutral', comment: 'Average experience. Room for improvement in communication.', response: 'investigating' },
    { id: 5, patient: 'Lisa Chen', rating: 2, date: '2024-01-11', type: 'negative', comment: 'Disappointed with the service. Long wait times and poor communication.', response: 'investigating' }
  ];

  const feedbackTrends = [
    { month: 'Jan', positive: 89, neutral: 8, negative: 3 },
    { month: 'Feb', positive: 91, neutral: 6, negative: 3 },
    { month: 'Mar', positive: 88, neutral: 9, negative: 3 },
    { month: 'Apr', positive: 92, neutral: 5, negative: 3 },
    { month: 'May', positive: 90, neutral: 7, negative: 3 },
    { month: 'Jun', positive: 89, neutral: 8, negative: 3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MarketingManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Patient Feedback</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Monitor and respond to patient feedback</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Send Survey
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {feedbackStats.map((stat, index) => (
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Ratings</option>
                  <option>5 Stars</option>
                  <option>4 Stars</option>
                  <option>3 Stars</option>
                  <option>2 Stars</option>
                  <option>1 Star</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Types</option>
                  <option>Positive</option>
                  <option>Neutral</option>
                  <option>Negative</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Feedback</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentFeedback.map((feedback) => (
                    <div key={feedback.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {feedback.patient.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{feedback.patient}</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{feedback.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">Date: {new Date(feedback.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          feedback.type === 'positive' ? 'bg-green-100 text-green-800' :
                          feedback.type === 'neutral' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {feedback.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          feedback.response === 'responded' ? 'bg-green-100 text-green-800' :
                          feedback.response === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {feedback.response}
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Feedback Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-500">Positive</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">8%</div>
                  <div className="text-sm text-gray-500">Neutral</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">3%</div>
                  <div className="text-sm text-gray-500">Negative</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
