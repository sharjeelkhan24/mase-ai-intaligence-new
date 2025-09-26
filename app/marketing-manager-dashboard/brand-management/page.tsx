'use client';

import React from 'react';
import {
  Palette,
  Image,
  FileText,
  Eye,
  Edit,
  Plus,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import MarketingManagerNavbar from '@/app/components/marketing-manager-dashboard/MarketingManagerNavbar';

export default function BrandManagementPage() {
  const activeTab = 'brand-management';

  const brandAssets = [
    { id: 1, name: 'Logo - Primary', type: 'Logo', status: 'approved', lastUpdated: '2024-01-15', size: '2.4 MB', format: 'PNG' },
    { id: 2, name: 'Logo - Secondary', type: 'Logo', status: 'approved', lastUpdated: '2024-01-14', size: '1.8 MB', format: 'SVG' },
    { id: 3, name: 'Brand Guidelines', type: 'Document', status: 'draft', lastUpdated: '2024-01-12', size: '5.2 MB', format: 'PDF' },
    { id: 4, name: 'Color Palette', type: 'Design', status: 'approved', lastUpdated: '2024-01-10', size: '0.5 MB', format: 'PDF' },
    { id: 5, name: 'Typography Guide', type: 'Design', status: 'review', lastUpdated: '2024-01-08', size: '1.2 MB', format: 'PDF' }
  ];

  const brandGuidelines = [
    { id: 1, section: 'Logo Usage', status: 'approved', lastReview: '2024-01-15', nextReview: '2024-04-15' },
    { id: 2, section: 'Color Standards', status: 'approved', lastReview: '2024-01-14', nextReview: '2024-04-14' },
    { id: 3, section: 'Typography', status: 'review', lastReview: '2024-01-12', nextReview: '2024-04-12' },
    { id: 4, section: 'Tone of Voice', status: 'draft', lastReview: '2024-01-10', nextReview: '2024-04-10' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MarketingManagerNavbar activeTab={activeTab} />
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">Brand Management</h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">Manage brand assets and guidelines</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
              <Plus className="w-4 h-4 inline mr-2" />
              Upload Asset
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Brand Assets</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {brandAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          {asset.type === 'Logo' ? <Image className="w-5 h-5 text-blue-600" /> :
                           asset.type === 'Document' ? <FileText className="w-5 h-5 text-green-600" /> :
                           <Palette className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{asset.name}</h4>
                          <p className="text-sm text-gray-500">{asset.type} • {asset.format} • {asset.size}</p>
                          <p className="text-xs text-gray-400">Last updated: {new Date(asset.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          asset.status === 'approved' ? 'bg-green-100 text-green-800' :
                          asset.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {asset.status}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">Brand Guidelines</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {brandGuidelines.map((guideline) => (
                    <div key={guideline.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">{guideline.section}</h4>
                          <p className="text-sm text-gray-500">Last review: {new Date(guideline.lastReview).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">Next review: {new Date(guideline.nextReview).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          guideline.status === 'approved' ? 'bg-green-100 text-green-800' :
                          guideline.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {guideline.status}
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
          </div>
        </main>
      </div>
    </div>
  );
}
