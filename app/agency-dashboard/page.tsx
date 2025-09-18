'use client';

import React, { useEffect } from 'react';
import { Users, DollarSign, BarChart3, Calendar, Bell, Search } from 'lucide-react';
import AdminNavbar from '@/app/components/admin-dashboard/AdminNavbar';
import { useAgencyAuth } from '@/lib/contexts/AgencyAuthContext';

export default function AgencyDashboard() {
  const { agency, isLoading, refreshAgencyData } = useAgencyAuth();

  // Debug and force refresh if needed
  useEffect(() => {
    console.log('Dashboard mounted - agency:', agency, 'isLoading:', isLoading);
    
    // Always check localStorage email matches current agency
    const storedEmail = localStorage.getItem('agencyEmail');
    const currentEmail = agency?.email;
    
    if (storedEmail && currentEmail && storedEmail !== currentEmail) {
      console.log('Email mismatch detected. Stored:', storedEmail, 'Current:', currentEmail);
      console.log('Refreshing agency data for correct account...');
      refreshAgencyData();
    } else if (!agency && !isLoading && storedEmail) {
      console.log('No agency data found but email stored, attempting refresh...');
      refreshAgencyData();
    }
  }, [agency, isLoading, refreshAgencyData]);

  const handleSectionChange = (section: string) => {
    // This is now handled by AdminNavbar component
    console.log('Section changed to:', section);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Navbar Component */}
      <AdminNavbar onSectionChange={handleSectionChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Agency Overview
              </h2>
              <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
                Welcome back! Here's an overview of your agency's performance.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Overview Only */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">127</p>
                <p className="text-xs text-green-600 font-[family-name:var(--font-adlam-display)]">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">1,234</p>
                <p className="text-xs text-green-600 font-[family-name:var(--font-adlam-display)]">+8% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">$45,678</p>
                <p className="text-xs text-green-600 font-[family-name:var(--font-adlam-display)]">+15% from last month</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-[family-name:var(--font-adlam-display)]">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">3</p>
                <p className="text-xs text-blue-600 font-[family-name:var(--font-adlam-display)]">HR, QA, Billing</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                    New staff member added
                  </p>
                  <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    Sarah Johnson joined as Registered Nurse
                  </p>
                </div>
                <span className="text-xs text-gray-400 font-[family-name:var(--font-adlam-display)]">2 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                    Patient assessment completed
                  </p>
                  <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    15 new patient assessments this week
                  </p>
                </div>
                <span className="text-xs text-gray-400 font-[family-name:var(--font-adlam-display)]">4 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                    Payment received
                  </p>
                  <p className="text-xs text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    $2,500 payment from Medicare
                  </p>
                </div>
                <span className="text-xs text-gray-400 font-[family-name:var(--font-adlam-display)]">1 day ago</span>
              </div>
            </div>
          </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}