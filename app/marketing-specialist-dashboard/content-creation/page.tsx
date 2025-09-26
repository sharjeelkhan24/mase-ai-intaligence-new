'use client';

import React from 'react';
import {
  PenTool,
  Camera,
  FileText,
  Video,
  Image,
  Edit3,
  Plus,
  Calendar,
  Eye,
  ThumbsUp,
  Share2,
  Download,
  Upload
} from 'lucide-react';
import MarketingSpecialistNavbar from '@/app/components/marketing-specialist-dashboard/MarketingSpecialistNavbar';

export default function ContentCreationPage() {
  const activeTab = 'content-creation';

  // Sample content data
  const contentTypes = [
    { id: 1, type: 'Blog Post', title: 'Healthcare Tips for Seniors', status: 'draft', date: '2 days ago', views: 0 },
    { id: 2, type: 'Social Media', title: 'Patient Success Story - Instagram', status: 'published', date: '1 day ago', views: 245 },
    { id: 3, type: 'Video', title: 'Facility Tour Video', status: 'published', date: '3 days ago', views: 189 },
    { id: 4, type: 'Infographic', title: 'Health Screening Guidelines', status: 'draft', date: '1 week ago', views: 0 },
    { id: 5, type: 'Blog Post', title: 'Understanding Medicare Benefits', status: 'published', date: '1 week ago', views: 156 },
    { id: 6, type: 'Social Media', title: 'Staff Spotlight - Facebook', status: 'scheduled', date: 'Tomorrow', views: 0 }
  ];

  const contentTemplates = [
    { id: 1, name: 'Patient Success Story', type: 'Blog Post', description: 'Template for patient testimonials and success stories' },
    { id: 2, name: 'Health Tips Post', type: 'Social Media', description: 'Template for health and wellness tips' },
    { id: 3, name: 'Facility Update', type: 'Blog Post', description: 'Template for facility news and updates' },
    { id: 4, name: 'Staff Introduction', type: 'Social Media', description: 'Template for introducing new staff members' }
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
                Content Creation
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Create and manage marketing content for your healthcare agency
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Plus className="w-4 h-4 inline mr-2" />
                Create New Content
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Content Creation Tools */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">Content Creation Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors">
                  <PenTool className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Blog Post</h4>
                  <p className="text-sm text-gray-500">Write articles and blog posts</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 cursor-pointer transition-colors">
                  <Share2 className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Social Media</h4>
                  <p className="text-sm text-gray-500">Create social media posts</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors">
                  <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Video Content</h4>
                  <p className="text-sm text-gray-500">Create video content</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors">
                  <Image className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">Graphics</h4>
                  <p className="text-sm text-gray-500">Design graphics and images</p>
                </div>
              </div>
            </div>

            {/* Recent Content */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Recent Content</h3>
                <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">View All</button>
              </div>
              <div className="space-y-4">
                {contentTypes.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        {content.type === 'Blog Post' && <FileText className="w-5 h-5 text-blue-600" />}
                        {content.type === 'Social Media' && <Share2 className="w-5 h-5 text-pink-600" />}
                        {content.type === 'Video' && <Video className="w-5 h-5 text-purple-600" />}
                        {content.type === 'Infographic' && <Image className="w-5 h-5 text-green-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{content.title}</h4>
                        <p className="text-sm text-gray-500">{content.type} • {content.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        content.status === 'published' ? 'bg-green-100 text-green-800' :
                        content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {content.status}
                      </span>
                      {content.views > 0 && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {content.views}
                        </div>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Templates */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Content Templates</h3>
                <button className="text-blue-600 hover:text-blue-700 font-[family-name:var(--font-adlam-display)]">Create Template</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTemplates.map((template) => (
                  <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{template.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{template.type}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-[family-name:var(--font-adlam-display)]">
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
