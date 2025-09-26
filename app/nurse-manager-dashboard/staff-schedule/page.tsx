'use client';

import React from 'react';
import {
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  Filter,
  Search
} from 'lucide-react';
import NurseManagerNavbar from '@/app/components/nurse-manager-dashboard/NurseManagerNavbar';

export default function StaffSchedulePage() {
  const activeTab = 'staff-schedule';

  const scheduleStats = [
    { metric: 'Total Shifts', value: '156', change: '+12', color: 'text-blue-600' },
    { metric: 'Covered Shifts', value: '152', change: '+8', color: 'text-green-600' },
    { metric: 'Open Shifts', value: '4', change: '-2', color: 'text-red-600' },
    { metric: 'Overtime Hours', value: '24', change: '+3', color: 'text-orange-600' }
  ];

  const shifts = [
    { id: 1, nurse: 'Sarah Johnson', date: '2024-01-20', shift: 'Day (7AM-7PM)', unit: 'ICU', status: 'scheduled', patientLoad: 4, notes: 'Regular shift' },
    { id: 2, nurse: 'Mike Chen', date: '2024-01-20', shift: 'Night (7PM-7AM)', unit: 'Emergency', status: 'scheduled', patientLoad: 6, notes: 'Regular shift' },
    { id: 3, nurse: 'Emily Rodriguez', date: '2024-01-21', shift: 'Day (7AM-7PM)', unit: 'Medical-Surgical', status: 'open', patientLoad: 0, notes: 'Needs coverage' },
    { id: 4, nurse: 'David Wilson', date: '2024-01-21', shift: 'Evening (3PM-11PM)', unit: 'ICU', status: 'scheduled', patientLoad: 3, notes: 'Regular shift' },
    { id: 5, nurse: 'Lisa Chen', date: '2024-01-22', shift: 'Day (7AM-7PM)', unit: 'Emergency', status: 'scheduled', patientLoad: 5, notes: 'Regular shift' }
  ];

  const recentChanges = [
    { id: 1, change: 'Shift added for Sarah Johnson', date: '2024-01-15', user: 'Mike Chen' },
    { id: 2, change: 'Shift coverage needed for Emily Rodriguez', date: '2024-01-14', user: 'System' },
    { id: 3, change: 'Overtime approved for David Wilson', date: '2024-01-13', user: 'HR Director' },
    { id: 4, change: 'Shift swap between Lisa Chen and Sarah Johnson', date: '2024-01-12', user: 'Lisa Chen' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NurseManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Staff Schedule</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage nursing staff schedules and shifts</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Shift
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scheduleStats.map((stat, index) => (
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
                      placeholder="Search shifts..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    />
                  </div>
                </div>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Units</option>
                  <option>ICU</option>
                  <option>Emergency</option>
                  <option>Medical-Surgical</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-[family-name:var(--font-adlam-display)]">
                  <option>All Shifts</option>
                  <option>Day</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Schedule Overview</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Nurse</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Shift</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Patient Load</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shifts.map((shift) => (
                      <tr key={shift.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {shift.nurse.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{shift.nurse}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(shift.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.shift}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.unit}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            shift.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            shift.status === 'open' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {shift.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.patientLoad}</td>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Changes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentChanges.map((change) => (
                    <div key={change.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{change.change}</h4>
                          <p className="text-sm text-gray-500">By {change.user} • {new Date(change.date).toLocaleDateString()}</p>
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
