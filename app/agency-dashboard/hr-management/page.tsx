'use client';

import React, { useState } from 'react';
import { Users, Plus, Search, Filter, MoreHorizontal, UserCheck, UserX, Clock, Mail, Phone, MapPin } from 'lucide-react';
import AdminNavbar from '@/app/components/admin-dashboard/AdminNavbar';
import SubscriptionGuard from '@/app/components/admin-dashboard/SubscriptionGuard';

export default function HRManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Staff data - will be loaded from database
  const staff: any[] = [];

  const departments = ['all', 'Emergency', 'ICU', 'Surgery', 'Pediatrics', 'Medical/Surgical'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="w-4 h-4" />;
      case 'on-leave': return <Clock className="w-4 h-4" />;
      case 'inactive': return <UserX className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <SubscriptionGuard 
      requiredSubscription="HR Management" 
      featureName="HR Management"
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
                HR Management
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage your healthcare staff and personnel
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">0</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Active</p>
                  <p className="text-2xl font-bold text-green-600 font-[family-name:var(--font-adlam-display)]">0</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">On Leave</p>
                  <p className="text-2xl font-bold text-yellow-600 font-[family-name:var(--font-adlam-display)]">0</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Inactive</p>
                  <p className="text-2xl font-bold text-red-600 font-[family-name:var(--font-adlam-display)]">0</p>
                </div>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search staff members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-[family-name:var(--font-adlam-display)]">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Staff Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Role & Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Assignment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Certifications
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-[family-name:var(--font-adlam-display)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-3">
                                <span className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {member.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {member.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                            {member.role}
                          </div>
                          <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {member.department} Department
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)} font-[family-name:var(--font-adlam-display)]`}>
                            {getStatusIcon(member.status)}
                            <span className="capitalize">{member.status.replace('-', ' ')}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center font-[family-name:var(--font-adlam-display)]">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {member.location}
                          </div>
                          <div className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                            {member.shift}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {member.certifications.map((cert: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 font-[family-name:var(--font-adlam-display)]"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                          <Users className="w-12 h-12 text-gray-300" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                              No staff members found
                            </h3>
                            <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                              Get started by adding your first staff member.
                            </p>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
                            <Plus className="w-4 h-4" />
                            <span>Add Staff Member</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SubscriptionGuard>
  );
}
