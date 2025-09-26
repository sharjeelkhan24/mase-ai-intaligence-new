'use client';

import React from 'react';
import {
  Users,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  Plus,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';
import MarketingSpecialistNavbar from '@/app/components/marketing-specialist-dashboard/MarketingSpecialistNavbar';

export default function PatientOutreachPage() {
  const activeTab = 'patient-outreach';

  // Sample outreach data
  const outreachCampaigns = [
    { id: 1, name: 'Senior Health Awareness', type: 'Email Campaign', status: 'active', recipients: 1250, openRate: 68.5, date: 'Started 1 week ago' },
    { id: 2, name: 'Medicare Enrollment', type: 'Phone Campaign', status: 'completed', recipients: 850, openRate: 45.2, date: 'Completed 2 days ago' },
    { id: 3, name: 'Wellness Check Reminder', type: 'SMS Campaign', status: 'scheduled', recipients: 2100, openRate: 0, date: 'Scheduled for tomorrow' },
    { id: 4, name: 'New Patient Welcome', type: 'Email Campaign', status: 'draft', recipients: 0, openRate: 0, date: 'Draft' }
  ];

  const outreachStats = [
    { metric: 'Total Campaigns', value: '24', change: '+12%', color: 'text-blue-600' },
    { metric: 'Active Campaigns', value: '8', change: '+2', color: 'text-green-600' },
    { metric: 'Avg. Open Rate', value: '52.3%', change: '+5.2%', color: 'text-purple-600' },
    { metric: 'Response Rate', value: '18.7%', change: '+2.1%', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Marketing Specialist Navbar Component */}
      <MarketingSpecialistNavbar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Patient Outreach
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage patient outreach campaigns and communication
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Outreach Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {outreachStats.map((stat, index) => (
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

            {/* Outreach Campaigns */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Outreach Campaigns</h3>
                <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
              </div>
              <div className="space-y-4">
                {outreachCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        {campaign.type === 'Email Campaign' && <Mail className="w-5 h-5 text-blue-600" />}
                        {campaign.type === 'Phone Campaign' && <Phone className="w-5 h-5 text-green-600" />}
                        {campaign.type === 'SMS Campaign' && <MessageSquare className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{campaign.name}</h4>
                        <p className="text-sm text-gray-500">{campaign.type} • {campaign.recipients} recipients • {campaign.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                      {campaign.openRate > 0 && (
                        <div className="text-sm text-gray-500">
                          {campaign.openRate}% open rate
                        </div>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outreach Tools */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Outreach Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                  <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Email Campaigns</h4>
                  <p className="text-sm text-gray-500">Send targeted email campaigns</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
                  <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Phone Outreach</h4>
                  <p className="text-sm text-gray-500">Schedule and track phone calls</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
                  <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">SMS Campaigns</h4>
                  <p className="text-sm text-gray-500">Send text message campaigns</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Medicare Enrollment campaign completed</p>
                    <p className="text-xs text-gray-500">2 days ago • 850 recipients</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Wellness Check Reminder scheduled</p>
                    <p className="text-xs text-gray-500">Tomorrow • 2,100 recipients</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Senior Health Awareness campaign launched</p>
                    <p className="text-xs text-gray-500">1 week ago • 1,250 recipients</p>
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
