'use client';

import React from 'react';
import {
  ClipboardList,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import SurveyUserNavbar from '@/app/components/survey-user-dashboard/SurveyUserNavbar';

export default function SurveySurveysPage() {
  const activeTab = 'surveys';

  const surveyStats = [
    { metric: 'Total Surveys', value: '24', change: '+3', color: 'text-blue-600' },
    { metric: 'Active Surveys', value: '18', change: '+2', color: 'text-green-600' },
    { metric: 'Responses', value: '1,247', change: '+89', color: 'text-purple-600' },
    { metric: 'Completion Rate', value: '87%', change: '+5%', color: 'text-orange-600' }
  ];

  const surveys = [
    { id: 1, title: 'Patient Satisfaction Survey', type: 'Patient Feedback', status: 'active', responses: 156, target: 200, createdDate: '2024-01-10', endDate: '2024-02-10' },
    { id: 2, title: 'Staff Performance Evaluation', type: 'Staff Assessment', status: 'active', responses: 89, target: 120, createdDate: '2024-01-08', endDate: '2024-01-25' },
    { id: 3, title: 'Quality of Care Assessment', type: 'Quality Metrics', status: 'completed', responses: 234, target: 200, createdDate: '2023-12-15', endDate: '2024-01-15' },
    { id: 4, title: 'Training Effectiveness Survey', type: 'Training Evaluation', status: 'draft', responses: 0, target: 50, createdDate: '2024-01-12', endDate: '2024-02-12' }
  ];

  const recentActivities = [
    { id: 1, activity: 'Patient Satisfaction Survey responses increased', date: '2024-01-15', user: 'System', survey: 'Patient Satisfaction Survey' },
    { id: 2, activity: 'Staff Performance Evaluation completed', date: '2024-01-14', user: 'System', survey: 'Staff Performance Evaluation' },
    { id: 3, activity: 'Quality of Care Assessment published', date: '2024-01-13', user: 'System', survey: 'Quality of Care Assessment' },
    { id: 4, activity: 'Training Effectiveness Survey created', date: '2024-01-12', user: 'System', survey: 'Training Effectiveness Survey' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SurveyUserNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Surveys</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage and monitor survey campaigns</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Create Survey
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {surveyStats.map((stat, index) => (
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
                      placeholder="Search surveys..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Types</option>
                  <option>Patient Feedback</option>
                  <option>Staff Assessment</option>
                  <option>Quality Metrics</option>
                  <option>Training Evaluation</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Survey Campaigns</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div key={survey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <ClipboardList className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{survey.title}</h4>
                          <p className="text-sm text-gray-500">{survey.type} • Created: {new Date(survey.createdDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">End Date: {new Date(survey.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{survey.responses}/{survey.target}</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(survey.responses / survey.target) * 100}%` }}></div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          survey.status === 'active' ? 'bg-green-100 text-green-800' :
                          survey.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {survey.status}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Activities</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{activity.activity}</h4>
                          <p className="text-sm text-gray-500">{activity.survey} • By {activity.user} • {new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
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

