'use client';

import React from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Save,
  Edit,
  X
} from 'lucide-react';
import MarketingManagerNavbar from '@/app/components/marketing-manager-dashboard/MarketingManagerNavbar';

export default function MarketingManagerSettingsPage() {
  const activeTab = 'settings';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MarketingManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Settings</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage your Marketing Manager preferences</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Profile Settings</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Lisa Chen"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">Email</label>
                  <input
                    type="email"
                    defaultValue="lisa.chen@elitenursing.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">Department</label>
                  <input
                    type="text"
                    defaultValue="Marketing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 font-[family-name:var(--font-adlam-display)]">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Campaign Alerts</h4>
                    <p className="text-sm text-gray-500">Get notified about campaign updates and performance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]">
                Cancel
              </button>
              <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
