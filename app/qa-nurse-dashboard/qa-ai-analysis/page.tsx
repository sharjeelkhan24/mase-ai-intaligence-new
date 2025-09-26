'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Upload,
  X,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';

export default function QAAIAnalysisPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('file-upload');
  const [uploadType, setUploadType] = useState('qa-review');
  const [priorityLevel, setPriorityLevel] = useState('medium');
  const [patientId, setPatientId] = useState('');
  const [processingNotes, setProcessingNotes] = useState('');
  // AI Model is now fixed to GPT-4o for optimal analysis
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingQueue, setProcessingQueue] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('active-diagnoses');

  // Helper function to parse extracted data from rawResponse
  const getActualExtractedData = (extractedData: any) => {
    if (extractedData?.rawResponse) {
      try {
        // Remove markdown code fences if present
        let jsonString = extractedData.rawResponse;
        
        // Handle different markdown formats
        if (jsonString.includes('```json')) {
          jsonString = jsonString.replace(/```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonString.includes('```')) {
          jsonString = jsonString.replace(/```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Clean up any remaining whitespace
        jsonString = jsonString.trim();
        
        console.log('Attempting to parse JSON string:', jsonString.substring(0, 200) + '...');
        
        const parsed = JSON.parse(jsonString);
        console.log('Successfully parsed JSON, extractedData:', parsed.extractedData);
        return parsed.extractedData;
      } catch (e) {
        console.error('Failed to parse rawResponse:', e);
        console.error('Raw response content (first 500 chars):', extractedData.rawResponse.substring(0, 500));
        console.error('Raw response content (last 500 chars):', extractedData.rawResponse.substring(Math.max(0, extractedData.rawResponse.length - 500)));
        
        // Try to extract JSON manually if parsing fails
        try {
          const jsonMatch = extractedData.rawResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const manualJson = jsonMatch[0];
            console.log('Trying manual JSON extraction:', manualJson.substring(0, 200) + '...');
            const manualParsed = JSON.parse(manualJson);
            return manualParsed.extractedData;
          }
        } catch (manualError) {
          console.error('Manual JSON extraction also failed:', manualError);
        }
      }
    }
    return extractedData;
  };

  const tabs = [
    { id: 'file-upload', label: 'File Upload' },
    { id: 'processing-queue', label: 'Processing Queue' },
    { id: 'results-reports', label: 'Results & Reports' }
  ];

  const analysisTabs = [
    { id: 'active-diagnoses', label: 'Active Diagnoses' },
    { id: 'corrections-required', label: 'Corrections Required' },
    { id: 'revenue-impact', label: 'Revenue Impact Analysis' },
    { id: 'documentation', label: 'Documentation' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const startProcessing = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload files first');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      
      // Add files to form data
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      // Add configuration
      formData.append('analysisType', uploadType);
      formData.append('priority', priorityLevel);
      formData.append('aiModel', 'gpt-4o');
      if (patientId) formData.append('patientId', patientId);
      if (processingNotes) formData.append('processingNotes', processingNotes);

      const response = await fetch('/api/qa-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();

      if (result.success) {
        // Clear uploaded files
        setUploadedFiles([]);
        setPatientId('');
        setProcessingNotes('');
        
        // Refresh results
        await fetchResults();
        await fetchQueue();
        
        // Switch to results tab
        setActiveTab('results-reports');
        
        alert(`Successfully processed ${result.results.length} file(s)!`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error processing files: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/qa-analysis?type=results');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      if (result.success) {
        setAnalysisResults(result.results);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      // Don't set empty results, let the error propagate
      throw error;
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/qa-analysis?type=queue');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      if (result.success) {
        setProcessingQueue(result.queue);
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
      // Don't set empty queue, let the error propagate
      throw error;
    }
  };

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchResults(), fetchQueue()]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        // Don't show alerts for initial load failures, just log them
      }
    };
    
    loadData();
  }, []);

  const renderFileUpload = () => (
    <div className="space-y-6">
      {/* Upload Configuration */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Configuration</h3>
        <p className="text-sm text-gray-600 mb-6">Configure how your QA files will be processed</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Type</label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="qa-review" className="text-black">QA Review</option>
              <option value="compliance-check" className="text-black">Compliance Check</option>
              <option value="quality-audit" className="text-black">Quality Audit</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="low" className="text-black">Low</option>
              <option value="medium" className="text-black">Medium</option>
              <option value="high" className="text-black">High</option>
              <option value="urgent" className="text-black">Urgent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID (Optional)</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Processing Notes (Optional)</label>
          <textarea
            value={processingNotes}
            onChange={(e) => setProcessingNotes(e.target.value)}
            placeholder="Add any special instructions or notes for processing..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
          />
        </div>
      </div>

      {/* Upload Files */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload QA Files</h3>
        <p className="text-sm text-gray-600 mb-6">Drag and drop files or click to browse. Supports PDF, Word documents, and images.</p>
        
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">Upload QA files</p>
              <p className="text-sm text-gray-500 mt-1">Drag and drop files here, or click to select files</p>
            </div>
            
            <p className="text-xs text-gray-400">Supports: PDF, DOC, DOCX, PNG, JPG (Max 10MB each)</p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      {file.type === 'application/pdf' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          PDF Document
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {/* Analysis button appears only when PDF files are uploaded */}
            {uploadedFiles.some(file => file.type === 'application/pdf') && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={startProcessing}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 text-lg font-medium"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Start AI Analysis</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderProcessingQueue = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Processing Queue</h3>
          <button
            onClick={fetchQueue}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
        
        {processingQueue.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No files in processing queue</p>
            <p className="text-sm text-gray-400 mt-2">Upload files to see them in the processing queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {processingQueue.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{item.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {item.analysisType} • {item.priority} priority
                        {item.patientId && ` • Patient: ${item.patientId}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                    {item.progress > 0 && (
                      <span className="text-sm text-gray-500">{item.progress}%</span>
                    )}
                  </div>
                </div>
                
                {item.status === 'processing' && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {item.error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    Error: {item.error}
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-400">
                  Started: {new Date(item.startedAt).toLocaleString()}
                  {item.completedAt && (
                    <span> • Completed: {new Date(item.completedAt).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderResultsReports = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Results & Reports</h3>
          <button
            onClick={fetchResults}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
        
        {analysisResults.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No results available</p>
            <p className="text-sm text-gray-400 mt-2">Process files to see AI analysis results</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analysisResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{result.fileName}</p>
                      <p className="text-sm text-gray-500">
                        {result.analysisType} • {result.priority} priority
                        {result.patientId && ` • Patient: ${result.patientId}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'completed' ? 'bg-green-100 text-green-800' :
                      result.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                    <button
                      onClick={() => setSelectedResult(result)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                {result.status === 'completed' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Compliance Score</p>
                      <p className="text-2xl font-bold text-blue-600">{result.results.complianceScore}%</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-orange-900">Issues Found</p>
                      <p className="text-2xl font-bold text-orange-600">{result.results.issuesFound.length}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      result.results.riskLevel === 'low' ? 'bg-green-50' :
                      result.results.riskLevel === 'medium' ? 'bg-yellow-50' :
                      result.results.riskLevel === 'high' ? 'bg-orange-50' :
                      'bg-red-50'
                    }`}>
                      <p className={`text-sm font-medium ${
                        result.results.riskLevel === 'low' ? 'text-green-900' :
                        result.results.riskLevel === 'medium' ? 'text-yellow-900' :
                        result.results.riskLevel === 'high' ? 'text-orange-900' :
                        'text-red-900'
                      }`}>Risk Level</p>
                      <p className={`text-lg font-bold ${
                        result.results.riskLevel === 'low' ? 'text-green-600' :
                        result.results.riskLevel === 'medium' ? 'text-yellow-600' :
                        result.results.riskLevel === 'high' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>{result.results.riskLevel.toUpperCase()}</p>
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-400">
                  Created: {new Date(result.createdAt).toLocaleString()}
                  {result.completedAt && (
                    <span> • Completed: {new Date(result.completedAt).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* QA Nurse Navbar Component */}
      <QANurseNavbar activeTab="qa-ai-analysis" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QA File Upload & AI Processing</h1>
              <p className="text-gray-600 mt-1">Upload QA assessments for AI-powered quality assurance and optimization</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Header actions can be added here if needed in the future */}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto min-w-0">
          <div className="space-y-6 max-w-full">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-full overflow-hidden">
              {activeTab === 'file-upload' && renderFileUpload()}
              {activeTab === 'processing-queue' && renderProcessingQueue()}
              {activeTab === 'results-reports' && renderResultsReports()}
            </div>
          </div>
        </main>
      </div>
      
      {/* Results Detail Modal */}
      {selectedResult && (
        <>
          <style jsx>{`
            .modal-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .modal-scrollbar::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 4px;
            }
            .modal-scrollbar::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 4px;
            }
            .modal-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-lg max-w-7xl w-full max-h-[90vh] shadow-2xl border border-white/20 flex flex-col">
              <div className="flex flex-1 min-h-0">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto modal-scrollbar" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d1d5db #f3f4f6'
                }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Analysis Details</h3>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                    {/* Analysis Tabs */}
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex space-x-2">
                        {analysisTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveAnalysisTab(tab.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              activeAnalysisTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-700 hover:text-gray-900'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

          {/* CHART INFO Header */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">CHART INFO</h4>
            </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient Name:</span>
                        <span className="font-medium text-gray-900">
                          {selectedResult.patientInfo?.patientName || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">MRN:</span>
                        <span className="font-medium text-gray-900">
                          {selectedResult.patientInfo?.mrn || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visit Type:</span>
                        <span className="font-medium text-gray-900">
                          {selectedResult.patientInfo?.visitType || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payor:</span>
                        <span className="font-medium text-gray-900">
                          {selectedResult.patientInfo?.payor || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visit Date:</span>
                        <span className="font-medium text-gray-900">
                          {selectedResult.patientInfo?.visitDate || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clinician:</span>
                        <span className="font-medium text-gray-900">
                          {selectedResult.patientInfo?.clinician || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pay Period:</span>
                        <span className="font-medium text-gray-900">
                          {selectedResult.patientInfo?.payPeriod || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedResult.patientInfo?.status?.toLowerCase().includes('optimized') 
                            ? 'bg-green-100 text-green-800'
                            : selectedResult.patientInfo?.status?.toLowerCase().includes('pending')
                            ? 'bg-yellow-100 text-yellow-800'
                            : selectedResult.patientInfo?.status?.toLowerCase().includes('error')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedResult.patientInfo?.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedResult.status === 'completed' && (
                  <>
                        {/* Tab Content */}
                        {activeAnalysisTab === 'active-diagnoses' && (
                          <div className="space-y-6">
                    <div>
                              <h4 className="text-lg font-semibold text-blue-900 mb-4">ACTIVE DIAGNOSES</h4>
                              
                              {/* Dynamic Diagnosis Tables */}
                              <div className="space-y-6">
                                {/* Primary Diagnosis Table */}
                                {(() => {
                                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                                  return actualExtractedData?.['Primary Diagnosis'] ? (
                                  <div>
                                    <h5 className="font-semibold text-gray-900 mb-3">
                                      {actualExtractedData['Primary Diagnosis Section'] || 'Primary Diagnosis'}
                                    </h5>
                                    <div className="overflow-x-auto">
                                      <table className="w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">ICD 10 Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Clinical Group</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Comorbidity Group</th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                          <tr>
                                            <td className="px-4 py-3 text-sm text-blue-600 font-medium border-b border-gray-200">
                                              {actualExtractedData['Primary Diagnosis ICD'] || 'Not specified'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                                              {actualExtractedData['Primary Diagnosis']}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-gray-200">
                                              {actualExtractedData['Primary Clinical Group'] ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                  {actualExtractedData['Primary Clinical Group']}
                                                </span>
                                              ) : (
                                                '-'
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-gray-200">
                                              {actualExtractedData['Primary Comorbidity Group'] ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                  {actualExtractedData['Primary Comorbidity Group']}
                                                </span>
                                              ) : (
                                                '-'
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                    </div>
                                  </div>
                                  ) : null;
                                })()}
                    
                                {/* Other Diagnoses Table */}
                                {(() => {
                                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                                  return actualExtractedData?.['Other Diagnoses'] && 
                                         Array.isArray(actualExtractedData['Other Diagnoses']) &&
                                         actualExtractedData['Other Diagnoses'].length > 0 ? (
                    <div>
                                    <h5 className="font-semibold text-gray-900 mb-3">
                                      {actualExtractedData['Other Diagnoses Section'] || 'Other Diagnoses'}
                                    </h5>
                                    <div className="overflow-x-auto">
                                      <table className="w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">ICD 10 Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Description</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Clinical Group</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Comorbidity Group</th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                          {actualExtractedData['Other Diagnoses'].map((diagnosis: string, index: number) => (
                                            <tr key={index}>
                                              <td className="px-4 py-3 text-sm text-blue-600 font-medium border-b border-gray-200">
                                                {actualExtractedData[`Other Diagnosis ${index + 1} ICD`] || 'Not specified'}
                                              </td>
                                              <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                                                {diagnosis}
                                              </td>
                                              <td className="px-4 py-3 text-sm border-b border-gray-200">
                                                {actualExtractedData[`Other Diagnosis ${index + 1} Clinical Group`] ? (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {actualExtractedData[`Other Diagnosis ${index + 1} Clinical Group`]}
                                                  </span>
                                                ) : (
                                                  '-'
                                                )}
                                              </td>
                                              <td className="px-4 py-3 text-sm border-b border-gray-200">
                                                {actualExtractedData[`Other Diagnosis ${index + 1} Comorbidity Group`] ? (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {actualExtractedData[`Other Diagnosis ${index + 1} Comorbidity Group`]}
                                                  </span>
                                                ) : (
                                                  '-'
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                  ) : null;
                                })()}

                                {/* No Data Message */}
                                {(() => {
                                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                                  return !actualExtractedData?.['Primary Diagnosis'] && 
                                         (!actualExtractedData?.['Other Diagnoses'] || 
                                          !Array.isArray(actualExtractedData['Other Diagnoses']) ||
                                          actualExtractedData['Other Diagnoses'].length === 0) ? (
                                    <div className="text-center py-8 text-gray-500">
                                      No diagnosis data available in this document
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          </div>
                        )}

                        {activeAnalysisTab === 'corrections-required' && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-900 mb-4">REQUIRED CORRECTIONS & SUGGESTIONS</h4>
                              <p className="text-sm text-gray-600 mb-6">
                                Staff should review and implement these corrections to optimize the OASIS assessment for {selectedResult.results?.extractedData?.['Patient Name'] || selectedResult.patientName || 'the patient'}.
                              </p>
                              
                              {/* Corrections Cards */}
                              <div className="space-y-4">
                                {(() => {
                                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                                  return actualExtractedData?.['OASIS Corrections'] && 
                                         Array.isArray(actualExtractedData['OASIS Corrections']) &&
                                         actualExtractedData['OASIS Corrections'].length > 0 ? (
                                    actualExtractedData['OASIS Corrections'].map((correction: any, index: number) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                      {/* Correction Header */}
                                      <div className="flex items-start justify-between mb-4">
                                        <div>
                                          <h5 className="font-semibold text-gray-900 text-lg">
                                            {correction.oasisItem || 'OASIS Item'}
                                          </h5>
                                          <p className="text-sm text-gray-600 mt-1">
                                            Functional score underreported based on clinical documentation.
                                          </p>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                          HIGH PRIORITY
                                        </span>
                                      </div>

                                      {/* Value Comparison */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                          <h6 className="font-semibold text-gray-900 text-sm mb-2">Current Value:</h6>
                                          <p className="text-sm text-gray-700">
                                            {correction.currentValue || 'Current assessment value'}
                                          </p>
                                        </div>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                          <h6 className="font-semibold text-gray-900 text-sm mb-2">Suggested Value:</h6>
                                          <p className="text-sm text-gray-700">
                                            {correction.suggestedValue || 'Improved assessment value'}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Clinical Rationale */}
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <h6 className="font-semibold text-gray-900 text-sm mb-2">Clinical Rationale:</h6>
                                        <p className="text-sm text-gray-700">
                                          {correction.clinicalRationale || 'Patient documentation indicates assistance needed with daily activities. Nursing notes specifically mention functional limitations.'}
                                        </p>
                                      </div>

                                      {/* Financial Impact */}
                                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                                        <h6 className="font-semibold text-gray-900 text-sm mb-2">Financial Impact:</h6>
                                        <p className="text-sm text-gray-700">
                                          {correction.financialImpact || 'Increases functional score, contributing to higher HIPPS code and additional revenue per episode.'}
                                        </p>
                                      </div>

                                      {/* Action Buttons */}
                                      <div className="flex justify-end space-x-3">
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                          <span className="flex items-center">
                                            <X className="w-4 h-4 mr-2" />
                                            Reject
                                          </span>
                                        </button>
                                        <button className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                          <span className="flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Accept & Apply
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                  ) : (
                                    <div className="text-center py-8 text-gray-500">
                                      No corrections required for this assessment.
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        )}
                    
                        {activeAnalysisTab === 'revenue-impact' && (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Revenue Impact Analysis
                              </h4>
                              {(() => {
                                const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                                return actualExtractedData?.['RevenueImpactAnalysis'] ? (
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Metric</th>
                                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Initial Data</th>
                                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Optimized Results</th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        <tr className="bg-gray-50">
                                          <td className="px-3 py-2 text-gray-900 font-medium">Admission Source</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].admissionSource || 'N/A'}</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].admissionSource || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-3 py-2 text-gray-900 font-medium">Episode Timing</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].episodeTiming || 'N/A'}</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].episodeTiming || 'N/A'}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                          <td className="px-3 py-2 text-gray-900 font-medium">Clinical Group</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].clinicalGroup || 'N/A'}</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].clinicalGroup || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-3 py-2 text-gray-900 font-medium">Comorbidity Adj.</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].comorbidityAdjustment || 'N/A'}</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].comorbidityAdjustment || 'N/A'}</td>
                                        </tr>
                                        <tr className="bg-yellow-50">
                                          <td className="px-3 py-2 text-gray-900 font-medium">Functional Score</td>
                                          <td className="px-3 py-2 text-red-600 font-semibold">{actualExtractedData['RevenueImpactAnalysis'].initialFunctionalScore || 'N/A'}</td>
                                          <td className="px-3 py-2 text-green-600 font-semibold">{actualExtractedData['RevenueImpactAnalysis'].optimizedFunctionalScore || 'N/A'}</td>
                                        </tr>
                                        <tr className="bg-yellow-50">
                                          <td className="px-3 py-2 text-gray-900 font-medium">Functional Level</td>
                                          <td className="px-3 py-2 text-red-600 font-semibold">{actualExtractedData['RevenueImpactAnalysis'].initialFunctionalLevel || 'N/A'}</td>
                                          <td className="px-3 py-2 text-green-600 font-semibold">{actualExtractedData['RevenueImpactAnalysis'].optimizedFunctionalLevel || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-3 py-2 text-gray-900 font-medium">HIPPS Code</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].initialHIPPSCode || 'N/A'}</td>
                                          <td className="px-3 py-2 text-green-600 font-semibold">{actualExtractedData['RevenueImpactAnalysis'].optimizedHIPPSCode || 'N/A'}</td>
                                        </tr>
                                        <tr className="bg-gray-50">
                                          <td className="px-3 py-2 text-gray-900 font-medium">Case Mix Weight</td>
                                          <td className="px-3 py-2 text-gray-700">{actualExtractedData['RevenueImpactAnalysis'].caseMixWeight || 'N/A'}</td>
                                          <td className="px-3 py-2 text-green-600 font-semibold">{actualExtractedData['RevenueImpactAnalysis'].optimizedCaseMixWeight || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                          <td className="px-3 py-2 text-gray-900 font-medium">Weighted Rate</td>
                                          <td className="px-3 py-2 text-gray-700">${actualExtractedData['RevenueImpactAnalysis'].weightedRate || 'N/A'}</td>
                                          <td className="px-3 py-2 text-green-600 font-semibold">${actualExtractedData['RevenueImpactAnalysis'].optimizedWeightedRate || 'N/A'}</td>
                                        </tr>
                                        <tr className="bg-green-50">
                                          <td className="px-3 py-2 text-gray-900 font-medium">30 day Period Revenue</td>
                                          <td className="px-3 py-2 text-gray-700">${actualExtractedData['RevenueImpactAnalysis'].initialRevenue || 'N/A'}</td>
                                          <td className="px-3 py-2 text-green-600 font-semibold">${actualExtractedData['RevenueImpactAnalysis'].optimizedRevenue || 'N/A'}</td>
                                        </tr>
                                        <tr className="bg-green-50">
                                          <td className="px-3 py-2 text-gray-900 font-medium">Revenue Increase</td>
                                          <td className="px-3 py-2 text-gray-700">--</td>
                                          <td className="px-3 py-2 text-green-600 font-semibold">${actualExtractedData['RevenueImpactAnalysis'].revenueIncrease || 'N/A'}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-500">
                                    No revenue impact analysis data available for this assessment.
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                    
                        {activeAnalysisTab === 'documentation' && (
                          <div className="space-y-4">
                    <div>
                              <h4 className="font-medium text-gray-900 mb-2">Documentation Review</h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-4">
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                                    <p className="text-sm text-gray-600 bg-white p-3 rounded border">
                                      {selectedResult.results.summary}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 bg-white p-3 rounded border">
                        {selectedResult.results.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                                    <h5 className="font-medium text-gray-900 mb-2">Detailed Analysis</h5>
                                    <div className="text-sm text-gray-600 bg-white p-3 rounded border whitespace-pre-wrap">
                        {selectedResult.results.detailedAnalysis}
                      </div>
                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                  </>
                )}
                
                {selectedResult.status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Error Details</h4>
                    <p className="text-sm text-red-700">{selectedResult.results.detailedAnalysis}</p>
                  </div>
                )}
                </div>
              </div>

              {/* Right Sidebar - FILE INFORMATION */}
                <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto modal-scrollbar" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d1d5db #f3f4f6'
                }}>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">FILE INFORMATION</h4>
                </div>

                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Type:</span>
                    <span className="font-medium text-gray-900">
                      {selectedResult.fileInfo?.fileType?.toUpperCase() || 'PDF'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span className="font-medium text-gray-900">
                      {selectedResult.fileInfo?.fileSize ? 
                        `${(selectedResult.fileInfo.fileSize / 1024 / 1024).toFixed(2)} MB` : 
                        'N/A'
                      }
                    </span>
                  </div>
                  {selectedResult.fileInfo?.pageCount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium text-gray-900">
                        {selectedResult.fileInfo.pageCount} pages
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analysis Date:</span>
                    <span className="font-medium text-gray-900">
                      {selectedResult.completedAt ? new Date(selectedResult.completedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <hr className="border-gray-300 my-4" />
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">File:</span>
                    <span className="font-medium text-gray-900 text-right break-words">
                      {selectedResult.fileName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analysis Type:</span>
                    <span className="font-medium text-gray-900">
                      {selectedResult.analysisType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className="font-medium text-gray-900">
                      {selectedResult.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">
                      {selectedResult.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}