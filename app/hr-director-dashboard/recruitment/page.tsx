'use client';

import React from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import HRDirectorNavbar from '@/app/components/hr-director-dashboard/HRDirectorNavbar';

export default function RecruitmentPage() {
  const activeTab = 'recruitment';

  // Sample recruitment data
  const jobPostings = [
    { id: 1, title: 'Staff Nurse - ICU', department: 'Nursing', location: 'Main Facility', status: 'active', applicants: 24, postedDate: '2024-01-10', type: 'Full-time' },
    { id: 2, title: 'Nurse Manager', department: 'Nursing', location: 'Branch Office', status: 'active', applicants: 8, postedDate: '2024-01-08', type: 'Full-time' },
    { id: 3, title: 'HR Specialist', department: 'Human Resources', location: 'Main Facility', status: 'closed', applicants: 15, postedDate: '2023-12-20', type: 'Full-time' },
    { id: 4, title: 'Marketing Coordinator', department: 'Marketing', location: 'Main Facility', status: 'active', applicants: 12, postedDate: '2024-01-05', type: 'Part-time' }
  ];

  const recentApplicants = [
    { id: 1, name: 'Jennifer Martinez', position: 'Staff Nurse - ICU', status: 'interview_scheduled', appliedDate: '2024-01-15', experience: '3 years', phone: '+1 (555) 111-2222', email: 'j.martinez@email.com' },
    { id: 2, name: 'Robert Kim', position: 'Nurse Manager', status: 'under_review', appliedDate: '2024-01-14', experience: '8 years', phone: '+1 (555) 222-3333', email: 'r.kim@email.com' },
    { id: 3, name: 'Amanda Davis', position: 'HR Specialist', status: 'hired', appliedDate: '2024-01-12', experience: '5 years', phone: '+1 (555) 333-4444', email: 'a.davis@email.com' },
    { id: 4, name: 'Michael Brown', position: 'Marketing Coordinator', status: 'rejected', appliedDate: '2024-01-11', experience: '2 years', phone: '+1 (555) 444-5555', email: 'm.brown@email.com' }
  ];

  const recruitmentStats = [
    { metric: 'Active Postings', value: '8', change: '+2', color: 'text-blue-600' },
    { metric: 'Total Applicants', value: '156', change: '+24', color: 'text-green-600' },
    { metric: 'Interviews Scheduled', value: '12', change: '+3', color: 'text-purple-600' },
    { metric: 'Hired This Month', value: '5', change: '+1', color: 'text-orange-600' }
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
                Recruitment
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage job postings, applicants, and recruitment processes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Post New Job
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Recruitment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recruitmentStats.map((stat, index) => (
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

            {/* Job Postings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Job Postings</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Applicants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Posted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobPostings.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.type}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-[family-name:var(--font-adlam-display)]">{job.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            job.status === 'active' ? 'bg-green-100 text-green-800' :
                            job.status === 'closed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.applicants}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(job.postedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Applicants */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Applicants</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentApplicants.map((applicant) => (
                    <div key={applicant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {applicant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{applicant.name}</h4>
                          <p className="text-sm text-gray-500">{applicant.position} • {applicant.experience} experience</p>
                          <p className="text-xs text-gray-400">Applied: {new Date(applicant.appliedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          applicant.status === 'hired' ? 'bg-green-100 text-green-800' :
                          applicant.status === 'interview_scheduled' ? 'bg-blue-100 text-blue-800' :
                          applicant.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {applicant.status.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="w-4 h-4" />
                          </button>
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
                  <UserPlus className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Create Job Posting</h4>
                    <p className="text-sm text-gray-500">Post a new job opening</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Schedule Interview</h4>
                    <p className="text-sm text-gray-500">Schedule candidate interviews</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Review Applications</h4>
                    <p className="text-sm text-gray-500">Review pending applications</p>
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
