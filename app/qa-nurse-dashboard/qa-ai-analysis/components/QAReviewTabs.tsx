'use client';

import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Brain, Download, Printer } from 'lucide-react';

interface QAReviewTabsProps {
  selectedResult: any;
  activeAnalysisTab: string;
  setActiveAnalysisTab: (tab: string) => void;
  getActualExtractedData: (extractedData: any) => any;
}

export default function QAReviewTabs({ selectedResult, activeAnalysisTab, setActiveAnalysisTab, getActualExtractedData }: QAReviewTabsProps) {
  const analysisTabs = [
    { id: 'active-diagnoses', label: 'Active Diagnoses' },
    { id: 'corrections-required', label: 'Corrections Required' },
    { id: 'compliance-issues', label: 'Compliance Issues' },
    { id: 'documentation', label: 'Documentation' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      {selectedResult.status === 'completed' && (
        <>
          {/* Active Diagnoses Tab */}
          {activeAnalysisTab === 'active-diagnoses' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                    Active Diagnoses
                  </h4>
                  <div className="text-sm text-gray-500">
                    AI-Powered Diagnosis Analysis
                  </div>
                </div>
                
                {/* Diagnosis Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {(() => {
                    const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                    const primaryCount = actualExtractedData?.['Primary Diagnosis'] ? 1 : 0;
                    const otherCount = actualExtractedData?.['Other Diagnoses Details']?.length || 0;
                    const comorbidityCount = actualExtractedData?.['Comorbidities']?.length || 0;
                    
                    return (
                      <>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-600">Primary Diagnosis</p>
                              <p className="text-2xl font-bold text-blue-900">{primaryCount}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-600">Secondary Diagnoses</p>
                              <p className="text-2xl font-bold text-green-900">{otherCount}</p>
                            </div>
                            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-600">Comorbidities</p>
                              <p className="text-2xl font-bold text-purple-900">{comorbidityCount}</p>
                            </div>
                            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 text-purple-600" />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Primary Diagnosis Card */}
                {(() => {
                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                  return actualExtractedData?.['Primary Diagnosis'] ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                        <h5 className="text-lg font-semibold text-white flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          Primary Diagnosis
                        </h5>
                      </div>
                      <div className="p-6">
                        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ICD-10 Code</label>
                              <p className="mt-1 font-mono text-sm font-semibold text-gray-900">{actualExtractedData['Primary Diagnosis ICD'] || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
                              <p className="mt-1 text-sm text-gray-900">{actualExtractedData['Primary Diagnosis'] || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clinical Group</label>
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {actualExtractedData['Primary Clinical Group'] || 'N/A'}
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Comorbidity Group</label>
                              <div className="mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {actualExtractedData['Primary Comorbidity Group'] || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Secondary Diagnoses Cards */}
                {(() => {
                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                  return actualExtractedData?.['Other Diagnoses Details'] && 
                         Array.isArray(actualExtractedData['Other Diagnoses Details']) &&
                         actualExtractedData['Other Diagnoses Details'].length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
                      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                        <h5 className="text-lg font-semibold text-white flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Secondary Diagnoses ({actualExtractedData['Other Diagnoses Details'].length})
                        </h5>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {actualExtractedData['Other Diagnoses Details'].map((diagnosis: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">ICD-10 Code</label>
                                  <p className="mt-1 font-mono text-sm font-semibold text-gray-900">{diagnosis.icdCode || 'N/A'}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
                                  <p className="mt-1 text-sm text-gray-900">{diagnosis.diagnosis || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Clinical Group</label>
                                  <div className="mt-1">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {diagnosis.clinicalGroup || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Comorbidity Group</label>
                                  <div className="mt-1">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      {diagnosis.comorbidityGroup || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Comorbidities Card */}
                {(() => {
                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                  return actualExtractedData?.['Comorbidities'] && 
                         Array.isArray(actualExtractedData['Comorbidities']) &&
                         actualExtractedData['Comorbidities'].length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                        <h5 className="text-lg font-semibold text-white flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Comorbidities & Co-existing Conditions ({actualExtractedData['Comorbidities'].length})
                        </h5>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {actualExtractedData['Comorbidities'].map((comorbidity: string, index: number) => (
                            <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                                <span className="text-sm text-purple-900 font-medium">{comorbidity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* No Data Message */}
                {(() => {
                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                  return !actualExtractedData?.['Primary Diagnosis'] && 
                         (!actualExtractedData?.['Other Diagnoses Details'] || 
                          !Array.isArray(actualExtractedData['Other Diagnoses Details']) ||
                          actualExtractedData['Other Diagnoses Details'].length === 0) &&
                         (!actualExtractedData?.['Comorbidities'] || 
                          !Array.isArray(actualExtractedData['Comorbidities']) ||
                          actualExtractedData['Comorbidities'].length === 0) ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Diagnosis Data Available</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        The AI was unable to extract diagnosis information from this document. 
                        Please ensure the document contains clear diagnosis sections.
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}

          {/* Corrections Required Tab */}
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
                              {correction.oasisItem}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">OASIS Item Correction</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Correction Required
                          </span>
                        </div>

                        {/* Current vs Suggested Values */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h6 className="font-medium text-gray-900 mb-2">Current Value</h6>
                            <p className="text-sm text-gray-700">{correction.currentValue}</p>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h6 className="font-medium text-green-900 mb-2">Suggested Value</h6>
                            <p className="text-sm text-green-700">{correction.suggestedValue}</p>
                          </div>
                        </div>

                        {/* Clinical Rationale */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h6 className="font-medium text-blue-900 mb-2">Clinical Rationale</h6>
                          <p className="text-sm text-blue-700">{correction.clinicalRationale}</p>
                        </div>
                      </div>
                      ))
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-500">No corrections required at this time</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Compliance Issues Tab */}
          {activeAnalysisTab === 'compliance-issues' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-gray-900 flex items-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                    Compliance Issues
                  </h4>
                  <div className="text-sm text-gray-500">
                    AI-Powered Compliance Analysis
                  </div>
                </div>
                
                {/* Compliance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {(() => {
                    const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                    const directIssuesCount = selectedResult.results?.complianceIssues?.length || 0;
                    const directRegulatoryCount = actualExtractedData?.regulatoryIssues?.length || 0;
                    const directQualityCount = actualExtractedData?.qualityMeasures?.length || 0;
                    const oasisCount = actualExtractedData?.['ComplianceIssues']?.oasisIssues?.length || 0;
                    const regulatoryCount = actualExtractedData?.['ComplianceIssues']?.regulatoryIssues?.length || 0;
                    const qualityCount = actualExtractedData?.['ComplianceIssues']?.qualityMeasures?.length || 0;
                    
                    return (
                      <>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-600">Compliance Issues</p>
                              <p className="text-2xl font-bold text-orange-900">{oasisCount}</p>
                            </div>
                            <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                              <FileText className="w-4 h-4 text-orange-600" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-red-600">Regulatory Issues</p>
                              <p className="text-2xl font-bold text-red-900">{directRegulatoryCount + regulatoryCount}</p>
                            </div>
                            <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-600">Quality Measures</p>
                              <p className="text-2xl font-bold text-green-900">{directQualityCount + qualityCount}</p>
                            </div>
                            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>


                {/* Direct Regulatory Issues from extractedData */}
                {(() => {
                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                  const regulatoryIssues = actualExtractedData?.regulatoryIssues;
                  return regulatoryIssues?.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                        <h5 className="text-lg font-semibold text-white flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Regulatory Issues ({regulatoryIssues.length})
                        </h5>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {regulatoryIssues.map((issue: string, index: number) => (
                            <div key={index} className="border border-red-200 rounded-lg p-4 hover:bg-red-50 transition-colors">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 leading-relaxed">{issue}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Direct Quality Measures from extractedData */}
                {(() => {
                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                  const qualityMeasures = actualExtractedData?.qualityMeasures;
                  return qualityMeasures?.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                        <h5 className="text-lg font-semibold text-white flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Quality Measures ({qualityMeasures.length})
                        </h5>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {qualityMeasures.map((measure: any, index: number) => (
                            <div key={index} className="border border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <h6 className="font-semibold text-gray-900 text-base">{measure.measure}</h6>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  measure.status === 'Compliant' 
                                    ? 'bg-green-100 text-green-800'
                                    : measure.status === 'Non-Compliant'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {measure.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{measure.description}</p>
                              {measure.details && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Details</label>
                                  <p className="mt-1 text-sm text-gray-700">{measure.details}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {(() => {
                  const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                  return actualExtractedData?.['ComplianceIssues'] ? (
                    <div className="space-y-6">
                      {/* OASIS Compliance */}
                      {actualExtractedData['ComplianceIssues'].oasisIssues?.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                          <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                            <h5 className="text-lg font-semibold text-white flex items-center">
                              <FileText className="w-5 h-5 mr-2" />
                              OASIS Compliance Issues ({actualExtractedData['ComplianceIssues'].oasisIssues.length})
                            </h5>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              {actualExtractedData['ComplianceIssues'].oasisIssues.map((issue: any, index: number) => (
                                <div key={index} className="border border-orange-200 rounded-lg p-4 hover:bg-orange-50 transition-colors">
                                  <div className="flex items-start justify-between mb-3">
                                    <h6 className="font-semibold text-gray-900 text-base">{issue.item}</h6>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      issue.severity === 'High' 
                                        ? 'bg-red-100 text-red-800'
                                        : issue.severity === 'Medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {issue.severity}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                                  <div className="space-y-3">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Details</label>
                                      <p className="mt-1 text-sm text-gray-700">{issue.details}</p>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                      <label className="text-xs font-medium text-orange-600 uppercase tracking-wide">Required Action</label>
                                      <p className="mt-1 text-sm text-orange-800">{issue.action}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Regulatory Compliance */}
                      {actualExtractedData['ComplianceIssues'].regulatoryIssues?.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                            <h5 className="text-lg font-semibold text-white flex items-center">
                              <AlertTriangle className="w-5 h-5 mr-2" />
                              Regulatory Compliance Issues ({actualExtractedData['ComplianceIssues'].regulatoryIssues.length})
                            </h5>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              {actualExtractedData['ComplianceIssues'].regulatoryIssues.map((issue: any, index: number) => (
                                <div key={index} className="border border-red-200 rounded-lg p-4 hover:bg-red-50 transition-colors">
                                  <div className="flex items-start justify-between mb-3">
                                    <h6 className="font-semibold text-gray-900 text-base">{issue.regulation}</h6>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      issue.priority === 'High' 
                                        ? 'bg-red-100 text-red-800'
                                        : issue.priority === 'Medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {issue.priority}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                                  <div className="space-y-3">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Details</label>
                                      <p className="mt-1 text-sm text-gray-700">{issue.details}</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                      <label className="text-xs font-medium text-red-600 uppercase tracking-wide">Impact</label>
                                      <p className="mt-1 text-sm text-red-800">{issue.impact}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quality Measures */}
                      {actualExtractedData['ComplianceIssues'].qualityMeasures?.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                            <h5 className="text-lg font-semibold text-white flex items-center">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Quality Measures ({actualExtractedData['ComplianceIssues'].qualityMeasures.length})
                            </h5>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              {actualExtractedData['ComplianceIssues'].qualityMeasures.map((measure: any, index: number) => (
                                <div key={index} className="border border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
                                  <div className="flex items-start justify-between mb-3">
                                    <h6 className="font-semibold text-gray-900 text-base">{measure.measure}</h6>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      measure.status === 'Compliant' 
                                        ? 'bg-green-100 text-green-800'
                                        : measure.status === 'Non-Compliant'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {measure.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-3">{measure.description}</p>
                                  <div className="space-y-3">
                                    {measure.details && (
                                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Details</label>
                                        <p className="mt-1 text-sm text-gray-700">{measure.details}</p>
                                      </div>
                                    )}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                      <label className="text-xs font-medium text-green-600 uppercase tracking-wide">Analysis</label>
                                      <p className="mt-1 text-sm text-green-800">{measure.analysis}</p>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Recommendations</label>
                                      <p className="mt-1 text-sm text-blue-800">{measure.recommendations}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Compliance Issues Found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        This assessment appears to meet all compliance requirements. Continue monitoring for ongoing compliance.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Documentation Tab */}
          {activeAnalysisTab === 'documentation' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Documentation Review
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-600" />
                        Summary
                      </h5>
                      <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedResult.results.summary}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Recommendations
                      </h5>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
                        <ul className="space-y-2">
                          {selectedResult.results.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                              <CheckCircle className="w-3 h-3 text-green-600 mt-1 flex-shrink-0" />
                              <span className="leading-relaxed">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-blue-600" />
                        Detailed Analysis Report
                      </h5>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        {/* Report Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h6 className="text-white font-semibold text-lg">Quality Assurance Analysis Report</h6>
                              <p className="text-blue-100 text-sm">AI-Powered Document Review</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right text-blue-100">
                                <p className="text-sm">Generated: {new Date().toLocaleDateString()}</p>
                                <p className="text-sm">Model: GPT-5-nano</p>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => window.print()}
                                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                  title="Print Report"
                                >
                                  <Printer className="w-4 h-4 text-white" />
                                </button>
                                <button 
                                  onClick={() => {
                                    const reportContent = selectedResult.results.detailedAnalysis;
                                    const blob = new Blob([reportContent], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `QA-Analysis-Report-${new Date().toISOString().split('T')[0]}.txt`;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                  }}
                                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                  title="Download Report"
                                >
                                  <Download className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Report Content - Only Detailed Analysis */}
                        <div className="p-10 bg-white">
                          <div className="max-w-none">
                            {/* Detailed Analysis Only */}
                            <div className="bg-white border border-gray-200 rounded-lg p-10 shadow-sm">
                              <div className="prose prose-lg max-w-none">
                                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base font-sans">
                                  {(() => {
                                    // Get the actual extracted data
                                    const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                                    
                                    // Try to get the cleaned analysis from the extracted data first
                                    const cleanedAnalysis = actualExtractedData?.detailedAnalysisCleaned || 
                                                           actualExtractedData?.detailedAnalysis ||
                                                           selectedResult.results.detailedAnalysisCleaned || 
                                                           selectedResult.results.detailedAnalysis;
                                    
                                    if (!cleanedAnalysis) return 'No detailed analysis available.';
                                    
                                    // Process the text to make the main header bold and larger
                                    const processedText = cleanedAnalysis
                                      // First, convert escaped newlines to actual newlines
                                      .replace(/\\n/g, '\n')
                                      .replace(
                                        /^COMPREHENSIVE QUALITY ASSURANCE ANALYSIS REPORT/gm,
                                        '<span class="text-2xl font-bold text-gray-900 block mb-4 text-center">COMPREHENSIVE QUALITY ASSURANCE ANALYSIS REPORT</span>'
                                      )
                                      .replace(
                                        /^EXECUTIVE SUMMARY:/gm,
                                        '<span class="text-xl font-semibold text-gray-900 block mt-6 mb-3">EXECUTIVE SUMMARY:</span>'
                                      )
                                      .replace(
                                        /^CLINICAL DIAGNOSIS SUMMARY:/gm,
                                        '<span class="text-xl font-semibold text-gray-900 block mt-6 mb-3">CLINICAL DIAGNOSIS SUMMARY:</span>'
                                      )
                                      .replace(
                                        /^FUNCTIONAL STATUS:/gm,
                                        '<span class="text-xl font-semibold text-gray-900 block mt-6 mb-3">FUNCTIONAL STATUS:</span>'
                                      )
                                      .replace(
                                        /^RISK AND PROGNOSIS:/gm,
                                        '<span class="text-xl font-semibold text-gray-900 block mt-6 mb-3">RISK AND PROGNOSIS:</span>'
                                      )
                                      .replace(
                                        /^PLAN OF CARE AND RECOMMENDATIONS:/gm,
                                        '<span class="text-xl font-semibold text-gray-900 block mt-6 mb-3">PLAN OF CARE AND RECOMMENDATIONS:</span>'
                                      )
                                      .replace(
                                        /^CLINICAL OBSERVATIONS:/gm,
                                        '<span class="text-xl font-semibold text-gray-900 block mt-6 mb-3">CLINICAL OBSERVATIONS:</span>'
                                      )
                                      .replace(
                                        /^CONCLUSION:/gm,
                                        '<span class="text-xl font-semibold text-gray-900 block mt-6 mb-3">CONCLUSION:</span>'
                                      );
                                    
                                    return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Report Footer */}
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span>Confidence: {Math.round((selectedResult.results.confidence || 0.75) * 100)}%</span>
                              <span>•</span>
                              <span>Analysis Type: {selectedResult.results.analysisType || 'QA Review'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Brain className="w-3 h-3" />
                              <span>MASE AI Intelligence</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
