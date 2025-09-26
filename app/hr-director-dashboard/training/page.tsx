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
import HRDirectorNavbar from '@/app/components/hr-director-dashboard/HRDirectorNavbar';

export default function TrainingPage() {
  const activeTab = 'training';

  // Sample training data
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
    { id: 4, title: 'Communication Skills', category: 'Soft Skills', duration: '1 hour', status: 'draft', enrolled: 0, completed: 0, instructor: 'Lisa Chen' }
  ];

  const recentCompletions = [
    { id: 1, employee: 'Sarah Johnson', course: 'HIPAA Compliance Training', completedDate: '2024-01-15', score: 95, certificate: 'issued' },
    { id: 2, employee: 'Mike Chen', course: 'Patient Safety Protocols', completedDate: '2024-01-14', score: 88, certificate: 'issued' },
    { id: 3, employee: 'Emily Rodriguez', course: 'Emergency Response Training', completedDate: '2024-01-13', score: 92, certificate: 'issued' },
    { id: 4, employee: 'David Wilson', course: 'HIPAA Compliance Training', completedDate: '2024-01-12', score: 90, certificate: 'pending' }
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
                Training Management
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage staff training programs and track completion
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Create Course
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Training Statistics */}
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

            {/* Training Courses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Training Courses</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trainingCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{course.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.status === 'active' ? 'bg-green-100 text-green-800' :
                            course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(course.completed / course.enrolled) * 100}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-500">{course.completed}/{course.enrolled}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
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

            {/* Recent Completions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Completions</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
                </div>
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

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Create Course</h4>
                    <p className="text-sm text-gray-500">Create a new training course</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Enroll Staff</h4>
                    <p className="text-sm text-gray-500">Enroll staff in training courses</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Award className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Issue Certificates</h4>
                    <p className="text-sm text-gray-500">Issue completion certificates</p>
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
