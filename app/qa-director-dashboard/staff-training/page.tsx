'use client';

import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Calendar,
  Award,
  Target
} from 'lucide-react';
import QADirectorNavbar from '@/app/components/qa-director-dashboard/QADirectorNavbar';

export default function QAStaffTrainingPage() {
  const activeTab = 'staff-training';

  const trainingStats = [
    { metric: 'Total Courses', value: '24', change: '+3', color: 'text-blue-600' },
    { metric: 'Active Learners', value: '89', change: '+12', color: 'text-green-600' },
    { metric: 'Completion Rate', value: '94%', change: '+5%', color: 'text-purple-600' },
    { metric: 'Certifications', value: '156', change: '+23', color: 'text-orange-600' }
  ];

  const trainingCourses = [
    { id: 1, title: 'HIPAA Compliance Training', category: 'Compliance', duration: '2 hours', status: 'active', enrolled: 45, completed: 42, instructor: 'Dr. Sarah Wilson' },
    { id: 2, title: 'Patient Safety Protocols', category: 'Safety', duration: '1.5 hours', status: 'active', enrolled: 38, completed: 35, instructor: 'Mike Chen' },
    { id: 3, title: 'Emergency Response Training', category: 'Emergency', duration: '3 hours', status: 'active', enrolled: 52, completed: 48, instructor: 'Emily Rodriguez' },
    { id: 4, title: 'Quality Assurance Standards', category: 'Quality', duration: '2.5 hours', status: 'draft', enrolled: 0, completed: 0, instructor: 'Lisa Chen' }
  ];

  const recentCompletions = [
    { id: 1, employee: 'Sarah Johnson', course: 'HIPAA Compliance Training', completedDate: '2024-01-15', score: 95, certificate: 'issued' },
    { id: 2, employee: 'Mike Chen', course: 'Patient Safety Protocols', completedDate: '2024-01-14', score: 88, certificate: 'issued' },
    { id: 3, employee: 'Emily Rodriguez', course: 'Emergency Response Training', completedDate: '2024-01-13', score: 92, certificate: 'issued' },
    { id: 4, employee: 'David Wilson', course: 'HIPAA Compliance Training', completedDate: '2024-01-12', score: 90, certificate: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <QADirectorNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Staff Training</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage staff training programs and compliance</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Create Course
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
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Training Courses</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {trainingCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.category} • {course.duration} • Instructor: {course.instructor}</p>
                          <p className="text-sm text-gray-500">Progress: {course.completed}/{course.enrolled}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          course.status === 'active' ? 'bg-green-100 text-green-800' :
                          course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {course.status}
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
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{completion.employee}</h4>
                          <p className="text-sm text-gray-500">{completion.course}</p>
                          <p className="text-xs text-gray-400">Completed: {new Date(completion.completedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Score: {completion.score}%</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            completion.certificate === 'issued' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {completion.certificate}
                          </span>
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
