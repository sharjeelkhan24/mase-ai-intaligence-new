'use client';

import React from 'react';
import {FileText, CheckCircle, AlertTriangle, Brain, Download, Printer} from 'lucide-react';

interface CodingReviewTabsProps {
  selectedResult: any;
  activeAnalysisTab: string;
  setActiveAnalysisTab: (tab: string) => void;
  getActualExtractedData?: (extractedData: any) => any;
}

export default function CodingReviewTabs({ selectedResult, activeAnalysisTab, setActiveAnalysisTab, getActualExtractedData }: CodingReviewTabsProps) {

  const getCodingReviewData = () => {
    // Extract coding review data from the result - use results directly (not extractedData)
    const codingData = selectedResult.results;
    if (codingData?.primaryDiagnosisCoding) {
      return codingData;
    }
    
    // Return empty data structure if no analysis results available
    return {
      primaryDiagnosisCoding: {
        currentCode: "",
        currentDescription: "",
        severityLevel: "",
        clinicalSupport: "",
        alternativeCodes: [],
        sequencingRecommendations: "",
        validationStatus: "needs_review" as const
      },
      secondaryDiagnosesAnalysis: {
        codes: [],
        missingDiagnoses: [],
        comorbidityImpact: "",
        totalSecondaryCodes: 0
      },
      codingCorrections: {
        incorrectCodes: [],
        missingCodes: [],
        severityAdjustments: [],
        sequencingImprovements: []
      },
      codingRecommendations: {
        additionalCodes: [],
        documentationRequirements: [],
        complianceIssues: [],
        bestPractices: []
      },
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        recommendations: 0,
        complianceScore: 0,
        riskLevel: "low" as const
      }
    };
  };

  const codingData = getCodingReviewData();

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      {selectedResult.status === 'completed' && (
        <>
          {/* Primary Diagnosis Coding Tab */}
          {activeAnalysisTab === 'primary-diagnosis' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-blue-900">PRIMARY DIAGNOSIS CODING</h4>
                  {codingData.summary?.aiConfidence && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      codingData.summary.aiConfidence >= 0.8 
                        ? 'bg-green-100 text-green-800' 
                        : codingData.summary.aiConfidence >= 0.6 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <Brain className="w-3 h-3 mr-1" />
                      AI Confidence: {(codingData.summary.aiConfidence * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
                
                {codingData.primaryDiagnosisCoding ? (
                  <div className="space-y-4">
                    {/* Current Primary Diagnosis */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        Current Primary Diagnosis
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">ICD-10 Code</p>
                          <p className="font-mono text-lg font-semibold text-gray-900">
                            {codingData.primaryDiagnosisCoding.currentCode}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Severity Level</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {codingData.primaryDiagnosisCoding.severityLevel}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="text-gray-900">{codingData.primaryDiagnosisCoding.currentDescription}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Validation Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          codingData.primaryDiagnosisCoding.validationStatus === 'valid' 
                            ? 'bg-green-100 text-green-800'
                            : codingData.primaryDiagnosisCoding.validationStatus === 'needs_review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {codingData.primaryDiagnosisCoding.validationStatus}
                        </span>
                      </div>
                    </div>

                    {/* Clinical Support */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w left:text-green-600 mr-2" />
                        Clinical Documentation Support
                      </h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 mb-3">{codingData.primaryDiagnosisCoding.clinicalSupport}</p>
<script>
                            The medical record contains specific evidence that supports the diagnosis code. Medicare requires documentation to support all coded conditions to prevent payment denials. Proper documentation ensures patients receive appropriate care and agencies receive fair reimbursement.
</script>
                      </div>
                    </div>

                    {/* Alternative Codes */}
                    {codingData.primaryDiagnosisCoding.alternativeCodes?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                          Alternative Code Suggestions
                        </h5>
                        <div className="space-y-3">
                          {codingData.primaryDiagnosisCoding.alternativeCodes.map((alt: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-mono font-semibold text-gray-900">{alt.code}</p>
                                  <p className="text-gray-700">{alt.description}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{alt.rationale}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sequencing Recommendations */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Brain className="w-4 h-4 text-purple-600 mr-2" />
                        Sequencing Recommendations
                      </h5>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 mb-3">
                          {typeof codingData.primaryDiagnosisCoding.sequencingRecommendations === 'string' 
                            ? codingData.primaryDiagnosisCoding.sequencingRecommendations 
                            : codingData.primaryDiagnosisCoding.sequencingRecommendations.recommendation}
                        </p>
                        {typeof codingData.primaryDiagnosisCoding.sequencingRecommendations === 'object' && 
                         codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation && (
                          <div className="text-sm text-gray-600 space-y-3">
                            {codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.whatItMeans && (
                              <div className="flex items-start space-x-2">
                                <span className="text-black mt-1">•</span>
                                <span className="leading-relaxed">{codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.whatItMeans}</span>
                              </div>
                            )}
                            {codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.whyImportant && (
                              <div className="flex items-start space-x-2">
                                <span className="text-black mt-1">•</span>
                                <span className="leading-relaxed">{codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.whyImportant}</span>
                              </div>
                            )}
                            {codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.howItAffectsCare && (
                              <div className="flex items-start space-x-2">
                                <span className="text-black mt-1">•</span>
                                <span className="leading-relaxed">{codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.howItAffectsCare}</span>
                              </div>
                            )}
                            {codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.implementation && (
                              <div className="flex items-start space-x-2">
                                <span className="text-black mt-1">•</span>
                                <span className="leading-relaxed">{codingData.primaryDiagnosisCoding.sequencingRecommendations.explanation.implementation}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">No primary diagnosis coding data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Secondary Diagnoses Analysis Tab */}
          {activeAnalysisTab === 'secondary-diagnoses' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-4">SECONDARY DIAGNOSES ANALYSIS</h4>
                
                {codingData?.secondaryDiagnosesAnalysis ? (
                  <div className="space-y-4">
                    {/* Secondary Diagnoses Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        Secondary Diagnosis Codes ({codingData.secondaryDiagnosesAnalysis.totalSecondaryCodes || 0})
                      </h5>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">ICD-10 Code</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Description</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Severity</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200">Validation</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {codingData.secondaryDiagnosesAnalysis.codes?.map((code: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm font-mono text-gray-900">{code.code}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{code.description}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{code.severityLevel}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{code.validation}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Missing Diagnoses */}
                    {codingData.secondaryDiagnosesAnalysis.missingDiagnoses?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                          Missing Diagnoses
                        </h5>
                        <div className="space-y-3">
                          {codingData.secondaryDiagnosesAnalysis.missingDiagnoses.map((missing: any, index: number) => (
                            <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-mono font-semibold text-gray-900">{missing.suggestedCode}</p>
                                  <p className="text-gray-700">{missing.description}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{missing.rationale}</p>
                              <p className="text-sm text-orange-600 mt-1">Documentation needed: {missing.documentationNeeded}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Comorbidity Impact */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Brain className="w-4 h-4 text-purple-600 mr-2" />
                        Comorbidity Impact Assessment
                      </h5>
                      <p className="text-gray-700">{codingData.secondaryDiagnosesAnalysis.comorbidityImpact}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">No secondary diagnoses analysis data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Coding Corrections Tab */}
          {activeAnalysisTab === 'coding-corrections' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-4">CODING CORRECTIONS</h4>
                
                {codingData?.codingCorrections ? (
                  <div className="space-y-4">
                    {/* Incorrect Codes */}
                    {codingData.codingCorrections.incorrectCodes?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                          Incorrect Codes
                        </h5>
                        <div className="space-y-3">
                          {codingData.codingCorrections.incorrectCodes.map((correction: any, index: number) => (
                            <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-mono font-semibold text-gray-900">
                                    {correction.currentCode} → {correction.suggestedCode}
                                  </p>
                                  <p className="text-gray-700">{correction.reason}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  correction.severity === 'high' 
                                    ? 'bg-red-100 text-red-800'
                                    : correction.severity === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {correction.severity}
                                </span>
                              </div>
                              <p className="text-sm text-red-600 mt-2">Documentation needed: {correction.documentationNeeded}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Codes */}
                    {codingData.codingCorrections.missingCodes?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                          Missing Codes
                        </h5>
                        <div className="space-y-3">
                          {codingData.codingCorrections.missingCodes.map((missing: any, index: number) => (
                            <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-mono font-semibold text-gray-900">{missing.suggestedCode}</p>
                                  <p className="text-gray-700">{missing.description}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{missing.rationale}</p>
                              <p className="text-sm text-orange-600 mt-1">Documentation needed: {missing.documentationNeeded}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Severity Adjustments */}
                    {codingData.codingCorrections.severityAdjustments?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                          Severity Level Adjustments
                        </h5>
                        <div className="space-y-4">
                          {codingData.codingCorrections.severityAdjustments.map((adjustment: any, index: number) => (
                            <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="font-mono font-semibold text-gray-900">
                                    {adjustment.code}: {adjustment.currentSeverity} → {adjustment.suggestedSeverity}
                                  </p>
                                  <p className="text-gray-700">{adjustment.rationale}</p>
                                </div>
                              </div>
                              {adjustment.explanation && (
                                <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                                  <p>
                                    {adjustment.explanation.whatItMeans} {adjustment.explanation.whyImportant} {adjustment.explanation.howItAffectsCare} {adjustment.explanation.implementation}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sequencing Improvements */}
                    {codingData.codingCorrections.sequencingImprovements?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Brain className="w-4 h-4 text-purple-600 mr-2" />
                          Sequencing Improvements
                        </h5>
                        <div className="space-y-4">
                          {codingData.codingCorrections.sequencingImprovements.map((improvement: any, index: number) => (
                            <div key={index} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <p className="font-semibold text-gray-900">Current Sequence</p>
                                  <p className="font-mono text-sm text-gray-600 mb-2">
                                    {improvement.currentSequence.join(' → ')}
                                  </p>
                                  <p className="font-semibold text-gray-900">Suggested Sequence</p>
                                  <p className="font-mono text-sm text-gray-600 mb-2">
                                    p{improvement.suggestedSequence.join(' → ')}
                                  </p>
                                  <p className="text-gray-700">{improvement.rationale}</p>
                                </div>
                              </div>
                              {improvement.explanation && (
                                <div className="bg-white rounded-lg p-3 text-sm text-gray-600">
                                  <p>
                                    {improvement.explanation.whatItMeans} {improvement.explanation.whyImportant} {improvement.explanation.howItAffectsCare} {improvement.explanation.implementation}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">No coding corrections data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Coding Recommendations Tab */}
          {activeAnalysisTab === 'coding-recommendations' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-900 mb-4">CODING RECOMMENDATIONS</h4>
                
                {codingData?.codingRecommendations ? (
                  <div className="space-y-4">
                    {/* Additional Codes */}
                    {codingData.codingRecommendations.additionalCodes?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Additional Codes to Consider
                        </h5>
                        <div className="space-y-3">
                          {codingData.codingRecommendations.additionalCodes.map((code: any, index: number) => (
                            <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-mono font-semibold text-gray-900">{code.code}</p>
                                  <p className="text-gray-700">{code.description}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  code.priority === 'high' 
                                    ? 'bg-red-100 text-red-800'
                                    : code.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {code.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">{code.rationale}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documentation Requirements */}
                    {codingData.codingRecommendations.documentationRequirements?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <FileText className="w-4 h-4 text-blue-600 mr-2" />
                          Documentation Requirements
                        </h5>
                        <div className="space-y-3">
                          {codingData.codingRecommendations.documentationRequirements.map((req: any, index: number) => (
                            <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{req.requirement}</p>
                                  <p className="text-gray-700">{req.purpose}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  req.priority === 'high' 
                                    ? 'bg-red-100 text-red-800'
                                    : req.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {req.priority}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Case Mix Weight Analysis moved to Financial Optimization section */}

                    {/* Compliance Issues */}
                    {codingData.codingRecommendations.complianceIssues?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                          Compliance Issues
                        </h5>
                        <div className="space-y-3">
                          {codingData.codingRecommendations.complianceIssues.map((issue: any, index: number) => (
                            <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-semibold text-gray-900">{issue.issue}</p>
                                  <p className="text-gray-700">{issue.recommendation}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  issue.severity === 'high' 
                                    ? 'bg-red-100 text-red-800'
                                    : issue.severity === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {issue.severity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Best Practices */}
                    {codingData.codingRecommendations.bestPractices?.length > 0 && (
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Brain className="w-4 h-4 text-purple-600 mr-2" />
                          Best Practices
                        </h5>
                        <div className="space-y-4">
                          {codingData.codingRecommendations.bestPractices.map((practice: any, index: number) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start space-x-2 mb-2">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                <span className="font-medium text-gray-900">
                                  {typeof practice === 'string' ? practice : practice.practice}
                                </span>
                              </div>
                              {typeof practice === 'object' && practice.explanation && (
                                <div className="ml-6 text-sm text-gray-600 space-y-3">
                                  {practice.explanation.whatItMeans && (
                                    <div className="flex items-start space-x-2">
                                      <span className="text-black mt-1">•</span>
                                      <span className="leading-relaxed">{practice.explanation.whatItMeans}</span>
                                    </div>
                                  )}
                                  {practice.explanation.whyImportant && (
                                    <div className="flex items-start space-x-2">
                                      <span className="text-black mt-1">•</span>
                                      <span className="leading-relaxed">{practice.explanation.whyImportant}</span>
                                    </div>
                                  )}
                                  {practice.explanation.howItAffectsCare && (
                                    <div className="flex items-start space-x-2">
                                      <span className="text-black mt-1">•</span>
                                      <span className="leading-relaxed">{practice.explanation.howItAffectsCare}</span>
                                    </div>
                                  )}
                                  {practice.explanation.implementation && (
                                    <div className="flex items-start space-x-2">
                                      <span className="text-black mt-1">•</span>
                                      <span className="leading-relaxed">{practice.explanation.implementation}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">No coding recommendations data available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {selectedResult.status === 'processing' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing coding patterns...</p>
        </div>
      )}

      {/* Error State */}
      {(selectedResult.status === 'failed' || selectedResult.status === 'error') && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Coding analysis failed</p>
          <p className="text-gray-500 text-sm mt-2">{selectedResult.error || 'Unknown error occurred'}</p>
        </div>
      )}
    </div>
  );
}