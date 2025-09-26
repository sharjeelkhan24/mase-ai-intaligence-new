'use client';

import React from 'react';
import {
  GraduationCap,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';

export default function QATrainingPage() {
  const activeTab = 'training';

  const trainingStats = [
    { metric: 'Total Programs', value: '24', change: '+3', color: 'text-blue-600' },
    { metric: 'Active Learners', value: '89', change: '+12', color: 'text-green-600' },
    { metric: 'Completed This Month', value: '45', change: '+8', color: 'text-purple-600' },
    { metric: 'Overdue', value: '6', change: '-2', color: 'text-red-600' }
  ];

  const trainingPrograms = [
    { id: 1, title: 'Quality Assurance Fundamentals', type: 'Mandatory', status: 'active', learners: 24, completion: '85%', duration: '2 hours', department: 'All Units' },
    { id: 2, title: 'Patient Safety Protocols', type: 'Mandatory', status: 'active', learners: 18, completion: '92%', duration: '1.5 hours', department: 'ICU' },
    { id: 3, title: 'Infection Control Best Practices', type: 'Optional', status: 'active', learners: 12, completion: '78%', duration: '1 hour', department: 'All Units' },
    { id: 4, title: 'Documentation Standards', type: 'Mandatory', status: 'pending', learners: 0, completion: '0%', duration: '1.5 hours', department: 'Emergency' }
  ];

  const recentCompletions = [
    { id: 1, learner: 'Sarah Johnson', program: 'Quality Assurance Fundamentals', completedDate: '2024-01-15', score: '95%', department: 'ICU' },
    { id: 2, learner: 'Mike Chen', program: 'Patient Safety Protocols', completedDate: '2024-01-14', score: '88%', department: 'Emergency' },
    { id: 3, learner: 'Emily Rodriguez', program: 'Infection Control Best Practices', completedDate: '2024-01-13', score: '92%', department: 'Medical-Surgical' },
    { id: 4, learner: 'David Wilson', program: 'Quality Assurance Fundamentals', completedDate: '2024-01-12', score: '90%', department: 'ICU' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QANurseNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Training</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage quality assurance training programs</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              New Program
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainingStats.map((stat, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Training Programs</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {trainingPrograms.map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{program.title}</h4>
                          <p className="text-sm text-gray-500">{program.type} • {program.department} • {program.duration}</p>
                          <p className="text-sm text-gray-500">{program.learners} learners • {program.completion} completion rate</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{program.completion}</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: program.completion }}></div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          program.status === 'active' ? 'bg-green-100 text-green-800' :
                          program.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {program.status}
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Completions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCompletions.map((completion) => (
                    <div key={completion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {completion.learner.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{completion.learner}</h4>
                          <p className="text-sm text-gray-500">{completion.program}</p>
                          <p className="text-xs text-gray-400">{completion.department} • Completed: {new Date(completion.completedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{completion.score}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Award
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(parseInt(completion.score) / 20) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
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
          </div>
        </main>
      </div>
    </div>
  );
}

