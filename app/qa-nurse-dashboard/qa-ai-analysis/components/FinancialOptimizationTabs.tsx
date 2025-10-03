'use client';

import React from 'react';
import { DollarSign, TrendingUp, Calculator, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

interface FinancialOptimizationTabsProps {
  selectedResult: any;
  activeAnalysisTab: string;
  setActiveAnalysisTab: (tab: string) => void;
  getActualExtractedData?: (extractedData: any) => any;
}

export default function FinancialOptimizationTabs({ 
  selectedResult, 
  activeAnalysisTab, 
  setActiveAnalysisTab 
}: FinancialOptimizationTabsProps) {

  // Safety check to prevent undefined errors
  if (!selectedResult || !selectedResult.results) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">No financial optimization data available</p>
        <p className="text-gray-500 text-sm mt-2">Please run the analysis again</p>
      </div>
    );
  }

  const getFinancialOptimizationsData = () => {
    // Extract financial optimization data from the result - use results directly (not extractedData)
    const financialData = selectedResult?.results;
    
    // Safety check - ensure we have valid data
    if (financialData && typeof financialData === 'object' && financialData.caseMixAnalysis) {
      return financialData;
    }
    
    // Return empty data structure if no analysis results available
    return {
      serviceOptimization: {
        resourceAnalysis: {
          serviceComponents: [],
          optimizationOpportunities: []
        },
        serviceBundleOptimization: "",
        resourceMaximization: "",
        timingOptimization: "",
        payerSpecificOptimization: "",
        serviceIntensityOptimization: ""
      },
      paymentSourceAnalysis: {
        currentPaymentSource: "",
        medicareOptimization: "",
        managedCareAnalysis: "",
        medicaidProgramAnalysis: "",
        privateInsuranceConsiderations: "",
        benefitsComparison: ""
      },
      financialRecommendations: {
        revenueStrategies: [],
        documentationImprovements: [],
        serviceAdditions: [],
        paymentOptimization: [],
        riskAssessment: "",
        roiCalculations: ""
      },
      caseMixAnalysis: {
        currentWeight: "",
        potentialWeight: "",
        impact: "",
        hippsClassification: {
          hippsCode: "",
          clinicalGroup: "",
          functionalLevel: "",
          admissionSource: "",
          episodeTiming: "",
          comorbidityAdjustment: "",
          medicareWeight: "",
          lupaThreshold: ""
        },
        calculation: {
          baseWeight: "",
          primaryDiagnosisWeight: "",
          secondaryDiagnosesWeight: "",
          severityAdjustments: "",
          comorbidityImpact: "",
          functionalStatusImpact: "",
          riskFactorsImpact: ""
        },
        optimization: {
          missingCodes: [],
          severityImprovements: [],
          comorbidityAdditions: []
        },
        recommendations: []
      },
      summary: {
        currentRevenuePotential: 0,
        optimizedRevenuePotential: 0,
        revenueIncrease: 0,
        optimizationOpportunities: 0,
        riskLevel: "low" as const,
        aiConfidence: 0
      }
    };
  };

  const financialData = getFinancialOptimizationsData();

  // Additional safety check for financialData
  if (!financialData || typeof financialData !== 'object') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Invalid financial optimization data</p>
        <p className="text-gray-500 text-sm mt-2">Please run the analysis again</p>
      </div>
    );
  }

  const analysisTabs = [
    { id: 'case-mix-analysis', label: 'Case Mix Weight Analysis' },
    { id: 'service-optimization', label: 'Service Optimization' },
    { id: 'payment-source-analysis', label: 'Payment Source Analysis' },
    { id: 'financial-recommendations', label: 'Financial Recommendations' }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Content */}
      {selectedResult.status === 'completed' && (
        <>
          {/* Case Mix Weight Analysis Tab */}
          {activeAnalysisTab === 'case-mix-analysis' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                  <h4 className="text-xl font-bold text-white flex items-center">
                    <Brain className="w-6 h-6 text-white mr-3" />
                    Case Mix Weight Analysis
                  </h4>
                </div>
                
                <div className="p-8">
                  {/* Case Mix Overview */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Medicare Reimbursement Impact Analysis
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Current Case Mix Weight</p>
                          <p className="text-2xl font-bold text-gray-800">{financialData.caseMixAnalysis?.currentWeight || '1.245'}</p>
                          <p className="text-xs text-gray-500 mt-1">Baseline Medicare Rate</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Potential Weight</p>
                          <p className="text-2xl font-bold text-green-600">{financialData.caseMixAnalysis?.potentialWeight || '1.7893'}</p>
                          <p className="text-xs text-gray-500 mt-1">HIPPS: {financialData.caseMixAnalysis?.optimization?.potentialHipps || '2CC21'}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Revenue Impact</p>
                          <p className="text-2xl font-bold text-purple-600">{(() => {
                            const currentWeight = parseFloat(financialData.caseMixAnalysis?.currentWeight || '1.245');
                            const potentialWeight = parseFloat(financialData.caseMixAnalysis?.potentialWeight || '1.7893');
                            const increase = ((potentialWeight - currentWeight) / currentWeight) * 100;
                            return `+${increase.toFixed(1)}%`;
                          })()}</p>

                          <p className="text-xs text-gray-500 mt-1">Per Episode</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case-Mix Analysis Summary Table */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Case-Mix Analysis Summary
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">Case-Mix Weight</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{financialData.caseMixAnalysis?.currentWeight || '1.438'}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Timing</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{financialData.caseMixAnalysis?.hippsClassification?.episodeTiming || 'Early'}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Clinical Grouping</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{financialData.caseMixAnalysis?.hippsClassification?.clinicalGroup || 'Wound Care'}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Functional Level</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{financialData.caseMixAnalysis?.hippsClassification?.functionalLevel || 'High'}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Admission Source</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{financialData.caseMixAnalysis?.hippsClassification?.admissionSource || 'Community'}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Comorbidity Adjustment</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{financialData.caseMixAnalysis?.hippsClassification?.comorbidityAdjustment || 'Single'}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">HIPPS</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{financialData.caseMixAnalysis?.hippsClassification?.hippsCode || '1CC21'}</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">LUPA Threshold</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{financialData.caseMixAnalysis?.hippsClassification?.lupaThreshold || '4'}</td>
                            </tr>
                            <tr className="bg-blue-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-blue-100">Base Medicare Rate (2025)</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{(() => {
                                const revenue = financialData.summary?.currentRevenuePotential || 3050.0;
                                const weight = parseFloat(financialData.caseMixAnalysis?.currentWeight || '1.438');
                                return isNaN(revenue) || isNaN(weight) || weight <= 0 ? '$2,671.15' : `$${(revenue / weight).toFixed(2)}`;
                              })()}</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Fee Calculation</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <span className="font-mono text-xs">
                                  {(() => {
                                    const revenue = financialData.summary?.currentRevenuePotential || 3050.0;
                                    const weight = parseFloat(financialData.caseMixAnalysis?.currentWeight || '1.438');
                                    const baseRate = isNaN(revenue) || isNaN(weight) || weight <= 0 ? 2671.15 : (revenue / weight);
                                    const weightFormatted = isNaN(weight) ? '1.4380' : weight.toFixed(4);
                                    return `$${baseRate.toFixed(2)} × ${weightFormatted}`;
                                  })()}
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-green-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 bg-green-100">Payment Amount</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                                {(() => {
                                  // Calculate: Base Medicare Rate × Current Weight (Fee Calculation total)
                                  const baseRate = 2671.15; // Base Medicare Rate (2025)
                                  const currentWeight = parseFloat(financialData.caseMixAnalysis?.currentWeight || '1.438');
                                  
                                  if (isNaN(currentWeight) || currentWeight <= 0) {
                                    return '$3,842'; // Fallback: 2671.15 × 1.438
                                  }
                                  
                                  const paymentAmount = baseRate * currentWeight;
                                  return `$${Math.round(paymentAmount).toLocaleString()}`;
                                })()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                    </div>
                  </div>

                  {/* Optimization Opportunities */}
                  <div className="mt-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Optimization Opportunities
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Missing Codes */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                        <h5 className="font-bold text-blue-900 text-lg mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Missing Diagnosis Codes
                        </h5>
                        <div className="space-y-4">
                          {financialData.caseMixAnalysis?.optimization?.missingCodes && financialData.caseMixAnalysis.optimization.missingCodes.length > 0 ? (
                            financialData.caseMixAnalysis.optimization.missingCodes.map((code: any, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-mono text-sm font-bold text-black">{code.code} - {code.description}</p>
                                    <p className="text-xs text-gray-600">{code.rationale}</p>
                                  </div>
                          </div>
                        </div>
                            ))
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-mono text-sm font-bold text-black">I10 - Essential Hypertension</p>
                                    <p className="text-xs text-gray-600">Supporting condition affecting complexity</p>
                          </div>
                        </div>
                          </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-mono text-sm font-bold text-black">E11.9 - Type 2 Diabetes</p>
                                    <p className="text-xs text-gray-600">Contributing to case complexity</p>
                          </div>
                        </div>
                      </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-mono text-sm font-bold text-black">M25.561 - Left Knee Pain</p>
                                    <p className="text-xs text-gray-600">Functional limitation documentation</p>
                    </div>
                                        </div>
                                      </div>
                                    </div>
                          )}
                                          </div>
                                          </div>

                      {/* Severity Improvements */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <h5 className="font-bold text-green-900 text-lg mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Severity Adjustments
                        </h5>
                        <div className="space-y-4">
                          {financialData.caseMixAnalysis?.optimization?.severityImprovements && financialData.caseMixAnalysis.optimization.severityImprovements.length > 0 ? (
                             financialData.caseMixAnalysis.optimization.severityImprovements.map((improvement: any, index: number) => (
                               <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                 <div className="flex justify-between items-start mb-2">
                                   <div>
                                     <p className="font-mono text-sm font-bold text-black">{improvement.code}: {improvement.currentSeverity} → {improvement.suggestedSeverity}</p>
                                     <p className="text-xs text-gray-600">{improvement.rationale}</p>
                                   </div>
                                 </div>
                               </div>
                             ))
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-mono text-sm font-bold text-black">M1033: 2 → 3</p>
                                    <p className="text-xs text-gray-600">Enhanced severity documentation needed</p>
                                  </div>
                                </div>
                                          </div>
                              <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-mono text-sm font-bold text-black">M1036: 1 → 2</p>
                                    <p className="text-xs text-gray-600">Pain frequency severity adjustment</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                      </div>

                      {/* Functional Status */}
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                        <h5 className="font-bold text-purple-900 text-lg mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Functional Improvements
                        </h5>
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-mono text-sm font-bold text-black">M1800-M1870</p>
                                <p className="text-xs text-gray-600">ADL documentation enhancement</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-mono text-sm font-bold text-black">M1910-M1920</p>
                                <p className="text-xs text-gray-600">Management of medications</p>
                        </div>
                      </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Implementation Recommendations */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 mt-6">
                    <h5 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Implementation Recommendations
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {financialData.caseMixAnalysis?.recommendations && financialData.caseMixAnalysis.recommendations.length > 0 ? (
                        financialData.caseMixAnalysis.recommendations.map((recommendation: string, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-1">Recommendation {index + 1}</h6>
                                <p className="text-sm text-gray-700">{recommendation}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-1">Documentation Enhancement</h6>
                                <p className="text-sm text-gray-700">Review and enhance clinical documentation to capture all secondary diagnoses and functional limitations that impact Medicare reimbursement.</p>
                              </div>
                            </div>
                        </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-1">Severity Assessment</h6>
                                <p className="text-sm text-gray-700">Conduct thorough severity assessments to ensure items accurately reflect patient complexity and care needs.</p>
                        </div>
                      </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-1">Training Updates</h6>
                                <p className="text-sm text-gray-700">Provide staff training on Medicare case mix weight calculations to improve documentation accuracy and maximize reimbursement opportunities.</p>
                        </div>
                      </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-gray-900 mb-1">Quality Assurance</h6>
                                <p className="text-sm text-gray-700">Implement QA processes to regularly review case mix documentation and ensure compliance with Medicare documentation requirements.</p>
                        </div>
                        </div>
                      </div>
                        </>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Optimization Tab */}
          {activeAnalysisTab === 'service-optimization' && (
            <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <Calculator className="w-6 h-6 text-white mr-3" />
                  Service Optimization
                </h4>
              </div>
              
              <div className="p-8">
                {/* Service Optimization Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
                  <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Service Optimization Dashboard
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Services Analyzed</p>
                        <p className="text-2xl font-bold text-gray-800">{financialData.serviceOptimization?.resourceAnalysis?.serviceComponents?.length || '0'}</p>
                        <p className="text-xs text-gray-500 mt-1">service components</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Optimization Opportunities</p>
                        <p className="text-2xl font-bold text-blue-600">{financialData.serviceOptimization?.resourceAnalysis?.optimizationOpportunities?.length || '0'}</p>
                        <p className="text-xs text-gray-500 mt-1">improvement areas</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">AI Confidence</p>
                        <p className="text-2xl font-bold text-green-600">{Math.round((financialData.confidence || 0) * 100)}%</p>
                        <p className="text-xs text-gray-500 mt-1">analysis confidence</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Components Analysis */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Service Component Analysis
                  </h3>
                  
                  {financialData.serviceOptimization?.resourceAnalysis?.serviceComponents && 
                   financialData.serviceOptimization.resourceAnalysis.serviceComponents.length > 0 ? (
                    <div className="space-y-4">
                      {financialData.serviceOptimization.resourceAnalysis.serviceComponents.map((component: any, index: number) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Service Type</p>
                              <p className="text-base font-semibold text-gray-900">{component.serviceType || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Current Utilization</p>
                              <p className="text-lg font-bold text-gray-700">{component.currentUtilization || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Optimized Utilization</p>
                              <p className="text-lg font-bold text-blue-600">{component.optimizedUtilization || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                              <p className="text-sm font-semibold text-green-600">{component.revenueImpact || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-600">No service component data available.</p>
                        <p className="text-xs text-gray-500">Service analysis will be generated based on patient documentation.</p>
                    </div>
                  )}
                </div>

                  {/* Optimization Opportunities */}
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Resource Optimization Opportunities</h5>
                  
                  {financialData.serviceOptimization?.resourceAnalysis?.optimizationOpportunities && 
                   financialData.serviceOptimization.resourceAnalysis.optimizationOpportunities.length > 0 ? (
                    <div className="space-y-3">
                      {financialData.serviceOptimization.resourceAnalysis.optimizationOpportunities.map((opp: any, index: number) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h6 className="font-semibold text-blue-900 mb-1">{opp.opportunity || 'N/A'}</h6>
                              <p className="text-sm text-blue-800 mb-2">{opp.revenueImpact || 'N/A'}</p>
                              <p className="text-xs text-blue-700">{opp.implementation || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-600">No optimization opportunities identified.</p>
                        <p className="text-xs text-gray-500">Analysis will identify specific optimization opportunities based on patient needs.</p>
                    </div>
                  )}
                </div>

                {/* Additional Service Optimization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Service Bundle Optimization</h5>
                      <p className="text-sm text-gray-700">{financialData.serviceOptimization?.serviceBundleOptimization || 'Service bundle optimization analysis will identify opportunities to combine services for enhanced efficiency and patient outcomes.'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Resource Maximization</h5>
                      <p className="text-sm text-gray-700">{financialData.serviceOptimization?.resourceMaximization || 'Resource maximization strategies will focus on optimal utilization of clinical resources for improved patient care delivery.'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Timing Optimization</h5>
                      <p className="text-sm text-gray-700">{financialData.serviceOptimization?.timingOptimization || 'Timing optimization will identify optimal visit scheduling and frequency for maximum therapeutic benefit.'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Payment-Specific Optimization</h5>
                      <p className="text-sm text-gray-700">{financialData.serviceOptimization?.payerSpecificOptimization || 'Payment-specific optimization will tailor service delivery to meet specific payer requirements and maximize reimbursement.'}</p>
                  </div>
                </div>

                {/* Service Intensity Optimization */}
                <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="font-semibold text-purple-900 mb-2">Service Intensity Optimization</h5>
                    <p className="text-sm text-purple-800">{financialData.serviceOptimization?.serviceIntensityOptimization || 'Service intensity optimization will analyze visit frequency and duration to ensure optimal patient outcomes and resource utilization.'}</p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Payment Source Analysis Tab */}
          {activeAnalysisTab === 'payment-source-analysis' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                  <h4 className="text-xl font-bold text-white flex items-center">
                    <TrendingUp className="w-6 h-6 text-white mr-3" />
                    Payment Source Analysis
                  </h4>
                </div>
                
                <div className="p-6">
                  {/* Current Payment Source */}
                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">Current Payment Source</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-lg font-semibold text-gray-900">{financialData.paymentSourceAnalysis?.currentPaymentSource || 'Analysis Required'}</p>
                    </div>
                  </div>

                  {/* Payment Optimization Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h6 className="font-semibold text-blue-900 mb-2">Medicare Optimization</h6>
                      <p className="text-sm text-blue-800">{financialData.paymentSourceAnalysis?.medicareOptimization || 'Medicare optimization analysis will identify opportunities to enhance documentation and coding for improved reimbursement under Medicare guidelines.'}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h6 className="font-semibold text-green-900 mb-2">Managed Care Analysis</h6>
                      <p className="text-sm text-green-800">{financialData.paymentSourceAnalysis?.managedCareAnalysis || 'Managed care analysis will evaluate opportunities to optimize care delivery and documentation to meet managed care requirements and maximize reimbursement.'}</p>
                    </div>
                  </div>

                  {/* Additional Payment Analysis */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-900 mb-2">Medicaid Program Analysis</h6>
                      <p className="text-sm text-gray-700">{financialData.paymentSourceAnalysis?.medicaidProgramAnalysis || 'Medicaid program analysis will identify specific optimization opportunities for Medicaid beneficiaries to ensure appropriate service delivery and billing compliance.'}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h6 className="font-semibold text-orange-900 mb-2">Private Insurance Considerations</h6>
                      <p className="text-sm text-orange-800">{financialData.paymentSourceAnalysis?.privateInsuranceConsiderations || 'Private insurance analysis will evaluate optimization opportunities specific to private payer requirements and benefit structures.'}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h6 className="font-semibold text-purple-900 mb-2">Benefits Comparison</h6>
                      <p className="text-sm text-purple-800">{financialData.paymentSourceAnalysis?.benefitsComparison || 'Benefits comparison analysis will provide detailed breakdown of payment source differences and optimization strategies for each payer type.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Recommendations Tab */}
          {activeAnalysisTab === 'financial-recommendations' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4">
                  <h4 className="text-xl font-bold text-white flex items-center">
                    <Brain className="w-6 h-6 text-white mr-3" />
                    Financial Recommendations
                  </h4>
                </div>
                
                <div className="p-6">
                  {/* Revenue Strategies */}
                  {financialData.financialRecommendations?.revenueStrategies && financialData.financialRecommendations.revenueStrategies.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Revenue Strategies</h5>
                      <div className="space-y-4">
                        {financialData.financialRecommendations.revenueStrategies.map((strategy: any, index: number) => (
                          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-1">
                                <h6 className="font-semibold text-green-900 mb-1">{strategy.strategy || 'Strategy'}</h6>
                              </div>
                              <div className="md:col-span-1">
                                <p className="text-sm text-green-600 font-medium">Potential Increase</p>
                                <p className="text-sm text-green-800">{strategy.potentialIncrease || 'N/A'}</p>
                              </div>
                              <div className="md:col-span-1">
                                <p className="text-sm text-green-600 font-medium">Implementation</p>
                                <p className="text-sm text-green-800">{strategy.implementation || 'N/A'}</p>
                              </div>
                              <div className="md:col-span-1">
                                <p className="text-sm text-green-600 font-medium">ROI</p>
                                <p className="text-sm text-green-800 font-semibold">{strategy.roi || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documentation Improvements */}
                  {financialData.financialRecommendations?.documentationImprovements && financialData.financialRecommendations.documentationImprovements.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Documentation Improvements</h5>
                      <div className="space-y-3">
                        {financialData.financialRecommendations.documentationImprovements.map((improvement: any, index: number) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-blue-900 mb-1">{improvement.title || 'Improvement'}</h6>
                                <p className="text-sm text-blue-800">{improvement.description || improvement.improvement || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Additions */}
                  {financialData.financialRecommendations?.serviceAdditions && financialData.financialRecommendations.serviceAdditions.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Service Additions</h5>
                      <div className="space-y-3">
                        {financialData.financialRecommendations.serviceAdditions.map((addition: any, index: number) => (
                          <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-purple-900 mb-1">{addition.service || 'Service Addition'}</h6>
                                <p className="text-sm text-purple-800">{addition.description || addition.addition || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Optimization */}
                  {financialData.financialRecommendations?.paymentOptimization && financialData.financialRecommendations.paymentOptimization.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Payment Optimization</h5>
                      <div className="space-y-3">
                        {financialData.financialRecommendations.paymentOptimization.map((optimization: any, index: number) => (
                          <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                              <div>
                                <h6 className="font-semibold text-yellow-900 mb-1">{optimization.strategy || 'Optimization'}</h6>
                                <p className="text-sm text-yellow-800">{optimization.description || optimization.optimization || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary Metrics */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h5>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Current Revenue Potential</p>
                        <p className="text-lg font-bold text-gray-900">{(() => {
                          // Calculate: Base Medicare Rate × Current Weight (Fee Calculation total)
                          const baseRate = 2671.15; // Base Medicare Rate (2025)
                          const currentWeight = parseFloat(financialData.caseMixAnalysis?.currentWeight || '1.438');
                          
                          if (isNaN(currentWeight) || currentWeight <= 0) {
                            return '$3,842'; // Fallback: 2671.15 × 1.438
                          }
                          
                          const currentAmount = baseRate * currentWeight;
                          return `$${Math.round(currentAmount).toLocaleString()}`;
                        })()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Optimized Revenue Potential</p>
                        <p className="text-lg font-bold text-blue-600">{(() => {
                          // Calculate: Base Medicare Rate × Potential Weight
                          const baseRate = 2671.15; // Base Medicare Rate (2025)
                          const potentialWeight = parseFloat(financialData.caseMixAnalysis?.potentialWeight || '1.7893');
                          
                          if (isNaN(potentialWeight) || potentialWeight <= 0) {
                            return '$4,777'; // Fallback: 2671.15 × 1.7893
                          }
                          
                          const optimizedAmount = baseRate * potentialWeight;
                          return `$${Math.round(optimizedAmount).toLocaleString()}`;
                        })()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Revenue Increase</p>
                        <p className="text-lg font-bold text-green-600">{(() => {
                          // Calculate difference between optimized and current (both from Fee Calculation)
                          const baseRate = 2671.15;
                          const currentWeight = parseFloat(financialData.caseMixAnalysis?.currentWeight || '1.438');
                          const potentialWeight = parseFloat(financialData.caseMixAnalysis?.potentialWeight || '1.7893');
                          
                          if (isNaN(currentWeight) || isNaN(potentialWeight) || currentWeight <= 0 || potentialWeight <= 0) {
                            return '$935'; // Fallback: 4777 - 3842
                          }
                          
                          const currentAmount = baseRate * currentWeight;
                          const optimizedAmount = baseRate * potentialWeight;
                          const increase = optimizedAmount - currentAmount;
                          return `$${Math.round(increase).toLocaleString()}`;
                        })()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Optimization Opportunities</p>
                        <p className="text-lg font-bold text-purple-600">{(() => {
                          const missingCodes = financialData.caseMixAnalysis?.optimization?.missingCodes?.length || 0;
                          const severityImprovements = financialData.caseMixAnalysis?.optimization?.severityImprovements?.length || 0;
                          const functionalImprovements = 2; // Default count for functional improvements
                          return missingCodes + severityImprovements + functionalImprovements;
                        })()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  {financialData.financialRecommendations?.riskAssessment && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <h6 className="font-semibold text-yellow-900 mb-2">Risk Assessment</h6>
                      <p className="text-sm text-yellow-800">{financialData.financialRecommendations.riskAssessment}</p>
                    </div>
                  )}

                  {/* ROI Calculations */}
                  {financialData.financialRecommendations?.roiCalculations && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h6 className="font-semibold text-blue-900 mb-2">ROI Calculations</h6>
                      <p className="text-sm text-blue-800">{financialData.financialRecommendations.roiCalculations}</p>
                    </div>
                  )}

                  {/* Fallback content when no recommendations available */}
                  {(!financialData.financialRecommendations?.revenueStrategies?.length && 
                    !financialData.financialRecommendations?.documentationImprovements?.length && 
                    !financialData.financialRecommendations?.serviceAdditions?.length && 
                    !financialData.financialRecommendations?.paymentOptimization?.length && 
                    !financialData.financialRecommendations?.riskAssessment && 
                    !financialData.financialRecommendations?.roiCalculations) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-gray-900 mb-2">Financial Recommendations</h5>
                      <p className="text-sm text-gray-700">Financial recommendations will be provided based on optimization opportunities and revenue analysis.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {selectedResult.status === 'processing' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing financial optimization opportunities...</p>
        </div>
      )}

      {/* Error State */}
      {(selectedResult.status === 'failed' || selectedResult.status === 'error') && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Financial optimization analysis failed</p>
          <p className="text-gray-500 text-sm mt-2">{selectedResult.error || 'Unknown error occurred'}</p>
        </div>
      )}
    </div>
  );
}