'use client';

import React from 'react';
import {
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Plus,
  BarChart3
} from 'lucide-react';
import MarketingSpecialistNavbar from '@/app/components/marketing-specialist-dashboard/MarketingSpecialistNavbar';

export default function SocialMediaPage() {
  const activeTab = 'social-media';

  // Sample social media data
  const socialMediaStats = [
    { platform: 'Facebook', followers: 5600, engagement: 7.2, posts: 45, color: 'bg-blue-500', icon: Facebook },
    { platform: 'Instagram', followers: 3200, engagement: 12.5, posts: 38, color: 'bg-pink-500', icon: Instagram },
    { platform: 'LinkedIn', followers: 1800, engagement: 4.8, posts: 22, color: 'bg-blue-600', icon: Linkedin },
    { platform: 'Twitter', followers: 950, engagement: 6.1, posts: 15, color: 'bg-blue-400', icon: Twitter }
  ];

  const recentPosts = [
    { id: 1, platform: 'Facebook', content: 'Patient Success Story - John\'s Recovery Journey', status: 'published', engagement: 245, date: '2 hours ago' },
    { id: 2, platform: 'Instagram', content: 'Behind the scenes at our facility', status: 'published', engagement: 189, date: '1 day ago' },
    { id: 3, platform: 'LinkedIn', content: 'Healthcare Tips for Seniors', status: 'published', engagement: 67, date: '2 days ago' },
    { id: 4, platform: 'Twitter', content: 'New staff member introduction', status: 'scheduled', engagement: 0, date: 'Tomorrow' }
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
                Social Media Management
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage your social media presence and track engagement
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Create Post
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Social Media Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialMediaStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.platform} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{stat.followers.toLocaleString()}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 font-[family-name:var(--font-adlam-display)]">{stat.platform}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Engagement</span>
                        <span className="font-medium">{stat.engagement}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Posts</span>
                        <span className="font-medium">{stat.posts}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Posts */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Posts</h3>
                <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
              </div>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        {post.platform === 'Facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                        {post.platform === 'Instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                        {post.platform === 'LinkedIn' && <Linkedin className="w-5 h-5 text-blue-700" />}
                        {post.platform === 'Twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{post.content}</h4>
                        <p className="text-sm text-gray-500">{post.platform} • {post.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                      {post.engagement > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {post.engagement}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Analytics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Engagement Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Total Reach</h4>
                  <p className="text-2xl font-bold text-blue-600">12,400</p>
                  <p className="text-sm text-gray-500">+15% from last month</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Total Engagement</h4>
                  <p className="text-2xl font-bold text-green-600">1,245</p>
                  <p className="text-sm text-gray-500">+8% from last month</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Avg. Engagement Rate</h4>
                  <p className="text-2xl font-bold text-purple-600">8.5%</p>
                  <p className="text-sm text-gray-500">+2% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
