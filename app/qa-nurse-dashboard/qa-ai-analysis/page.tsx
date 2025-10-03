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
  AlertTriangle,
  Download,
  Printer
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';
import CodingReviewTabs from './components/CodingReviewTabs';
import QAReviewTabs from './components/QAReviewTabs';
import FinancialOptimizationTabs from './components/FinancialOptimizationTabs';

export default function QAAIAnalysisPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('file-upload');
  const [uploadType, setUploadType] = useState('qa-review');
  const [priorityLevel, setPriorityLevel] = useState('medium');
  const [patientId, setPatientId] = useState('');
  const [processingNotes, setProcessingNotes] = useState('');
  // AI Model is now fixed to GPT-5-nano for ultra-efficient analysis with highest token limits
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingQueue, setProcessingQueue] = useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('active-diagnoses');

  // Reset activeAnalysisTab when switching analysis types
  React.useEffect(() => {
    if (selectedResult?.analysisType) {
      if (selectedResult.analysisType === 'financial-optimization') {
        setActiveAnalysisTab('case-mix-analysis');
      } else if (selectedResult.analysisType === 'coding-review') {
        setActiveAnalysisTab('primary-diagnosis');
      } else if (selectedResult.analysisType === 'qa-review') {
        setActiveAnalysisTab('active-diagnoses');
      }
    }
  }, [selectedResult?.analysisType]);

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

  // Helper function to get metrics based on analysis type
  const getAnalysisMetrics = (result: any) => {
    if (result.analysisType === 'coding-review') {
      // Coding review structure
      return {
        confidence: result.results?.confidence || 0,
        issuesFound: result.results?.summary?.totalIssues || 0,
        riskLevel: result.results?.summary?.riskLevel || 'medium',
        processingTime: result.processingTime || 'N/A'
      };
    } else if (result.analysisType === 'financial-optimization') {
      // Financial optimization structure
      return {
        confidence: result.results?.confidence || result.confidence || 0,
        issuesFound: result.results?.summary?.optimizationOpportunities || 0,
        riskLevel: result.results?.summary?.riskLevel || 'medium',
        processingTime: result.processingTime || 'N/A'
      };
    } else {
      // QA review structure
      return {
        confidence: result.results?.confidence || 0,
        issuesFound: result.results?.issuesFound?.length || 0,
        riskLevel: result.results?.riskLevel || 'medium',
        processingTime: result.processingTime || 'N/A'
      };
    }
  };

  const handleDownloadCodingReport = async (result: any) => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Helper functions
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      
      // Check if we need a new page
      const lineHeight = fontSize * 0.4;
      const totalHeight = lines.length * lineHeight + 2;
      
      if (yPosition + totalHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(lines, margin, yPosition);
      yPosition += totalHeight;
    };

    const addSectionHeader = (title: string) => {
      yPosition += 10;
      // Check if we need a new page for section header
      if (yPosition + 20 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      addText(title, 14, true);
      yPosition += 5;
    };

    const addSubsection = (title: string) => {
      yPosition += 5;
      // Check if we need a new page for subsection
      if (yPosition + 15 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      addText(title, 12, true);
      yPosition += 2;
    };

    // Header
    addText('CODING REVIEW REPORT', 16, true);
    addText(`Generated on: ${new Date().toLocaleDateString()}`, 10);
    yPosition += 10;

    // Patient Information
    addSectionHeader('PATIENT INFORMATION');
    const patientInfo = result.results?.patientInfo || {};
    const patientName = patientInfo.patientName || 'N/A';
    const mrn = patientInfo.mrn || 'N/A';
    const visitType = patientInfo.visitType || 'N/A';
    const payor = patientInfo.payor || 'N/A';
    const visitDate = patientInfo.visitDate || 'N/A';
    const clinician = patientInfo.clinician || 'N/A';
    const payPeriod = patientInfo.payPeriod || 'N/A';
    const status = patientInfo.status || 'N/A';

    addText(`Patient Name: ${patientName}`, 12);
    addText(`MRN: ${mrn}`, 12);
    addText(`Visit Type: ${visitType}`, 12);
    addText(`Payor: ${payor}`, 12);
    addText(`Visit Date: ${visitDate}`, 12);
    addText(`Clinician: ${clinician}`, 12);
    addText(`Pay Period: ${payPeriod}`, 12);
    addText(`Status: ${status}`, 12);

    // Primary Diagnosis Coding
    if (result.results?.primaryDiagnosisCoding) {
      addSectionHeader('PRIMARY DIAGNOSIS CODING');
      const primary = result.results.primaryDiagnosisCoding;
      
      addSubsection('Primary Diagnosis');
      addText(`ICD-10 Code: ${primary.currentCode || primary.icd10Code || primary.code || 'N/A'}`, 12);
      addText(`Description: ${primary.currentDescription || primary.description || primary.diagnosis || 'N/A'}`, 12);
      addText(`Severity Level: ${primary.severityLevel || 'N/A'}`, 12);
      addText(`Clinical Support: ${primary.clinicalSupport || 'N/A'}`, 12);
      
      if (primary.accuracy) {
        addSubsection('Accuracy Assessment');
        addText(`Accuracy: ${primary.accuracy}`, 12);
      }
      
      if (primary.completeness) {
        addSubsection('Completeness Assessment');
        addText(`Completeness: ${primary.completeness}`, 12);
      }
      
      if (primary.optimization) {
        addSubsection('Optimization Assessment');
        addText(`Optimization: ${primary.optimization}`, 12);
      }
      
      if (primary.severity) {
        addSubsection('Severity Assessment');
        addText(`Severity: ${primary.severity}`, 12);
      }
      
      if (primary.clinicalDocumentationSupport) {
        addSubsection('Clinical Documentation Support');
        addText(`${primary.clinicalDocumentationSupport}`, 12);
      }
      
      if (primary.alternativeCodes?.length > 0) {
        addSubsection('Alternative Codes');
        primary.alternativeCodes.forEach((code: any, index: number) => {
          addText(`${index + 1}. ${code.code || 'N/A'}: ${code.description || 'N/A'}`, 12);
          if (code.rationale) {
            addText(`   Rationale: ${code.rationale}`, 10);
          }
        });
      }
      
      if (primary.sequencingRecommendations) {
        addSubsection('Sequencing Recommendations');
        if (typeof primary.sequencingRecommendations === 'object' && primary.sequencingRecommendations.recommendation) {
          addText(`${primary.sequencingRecommendations.recommendation}`, 12);
          if (primary.sequencingRecommendations.explanation) {
            const explanation = primary.sequencingRecommendations.explanation;
            if (typeof explanation === 'object') {
              addText(`What it means: ${explanation.whatItMeans || 'N/A'}`, 10);
              addText(`Why important: ${explanation.whyImportant || 'N/A'}`, 10);
              addText(`How it affects care: ${explanation.howItAffectsCare || 'N/A'}`, 10);
              addText(`Implementation: ${explanation.implementation || 'N/A'}`, 10);
            } else {
              addText(`Explanation: ${explanation}`, 10);
            }
          }
        } else {
          addText(`${primary.sequencingRecommendations}`, 12);
        }
      }
    } else if (result.results?.extractedData?.['Primary Diagnosis']) {
      // Fallback to extracted data if primaryDiagnosisCoding is not available
      addSectionHeader('PRIMARY DIAGNOSIS CODING');
      addSubsection('Primary Diagnosis');
      addText(`ICD-10 Code: ${result.results.extractedData['Primary Diagnosis ICD'] || 'N/A'}`, 12);
      addText(`Description: ${result.results.extractedData['Primary Diagnosis'] || 'N/A'}`, 12);
      addText(`Clinical Group: ${result.results.extractedData['Primary Diagnosis Clinical Group'] || 'N/A'}`, 12);
      addText(`Comorbidity Group: ${result.results.extractedData['Primary Diagnosis Comorbidity Group'] || 'N/A'}`, 12);
    }

    // Secondary Diagnoses Analysis
    if (result.results?.secondaryDiagnosesAnalysis?.length > 0) {
      addSectionHeader('SECONDARY DIAGNOSES ANALYSIS');
      result.results.secondaryDiagnosesAnalysis.forEach((diagnosis: any, index: number) => {
        addSubsection(`Secondary Diagnosis ${index + 1}`);
        addText(`ICD-10 Code: ${diagnosis.icd10Code || 'N/A'}`, 12);
        addText(`Description: ${diagnosis.description || 'N/A'}`, 12);
        addText(`Clinical Group: ${diagnosis.clinicalGroup || 'N/A'}`, 12);
        addText(`Comorbidity Group: ${diagnosis.comorbidityGroup || 'N/A'}`, 12);
        
        if (diagnosis.severityValidation) {
          addText(`Severity Validation: ${diagnosis.severityValidation}`, 12);
        }
        
        if (diagnosis.missingDiagnoses?.length > 0) {
          addText('Missing Diagnoses:', 12);
          diagnosis.missingDiagnoses.forEach((missing: any, idx: number) => {
            addText(`  ${idx + 1}. ${missing.code || 'N/A'}: ${missing.description || 'N/A'}`, 10);
          });
        }
        
        if (diagnosis.comorbidityImpact) {
          addText(`Comorbidity Impact: ${diagnosis.comorbidityImpact}`, 12);
        }
        
        if (diagnosis.specificityRecommendations) {
          addText(`Specificity Recommendations: ${diagnosis.specificityRecommendations}`, 12);
        }
      });
    }

    // Coding Corrections
    if (result.results?.codingCorrections?.length > 0) {
      addSectionHeader('CODING CORRECTIONS');
      result.results.codingCorrections.forEach((correction: any, index: number) => {
        addSubsection(`Correction ${index + 1}`);
        addText(`Issue: ${correction.issue || 'N/A'}`, 12);
        addText(`Current Code: ${correction.currentCode || 'N/A'}`, 12);
        addText(`Suggested Code: ${correction.suggestedCode || 'N/A'}`, 12);
        addText(`Rationale: ${correction.rationale || 'N/A'}`, 12);
        addText(`Priority: ${correction.priority || 'N/A'}`, 12);
      });
    }

    // Coding Recommendations
    if (result.results?.codingRecommendations) {
      addSectionHeader('CODING RECOMMENDATIONS');
      const recommendations = result.results.codingRecommendations;
      
      if (recommendations.additionalCodes?.length > 0) {
        addSubsection('Additional Codes');
        recommendations.additionalCodes.forEach((code: any, index: number) => {
          addText(`${index + 1}. ${code.code || 'N/A'}: ${code.description || 'N/A'}`, 12);
          if (code.rationale) {
            addText(`   Rationale: ${code.rationale}`, 10);
          }
        });
      }
      
      if (recommendations.documentationRequirements?.length > 0) {
        addSubsection('Documentation Requirements');
        recommendations.documentationRequirements.forEach((req: any, index: number) => {
          addText(`${index + 1}. ${req.requirement || 'N/A'}`, 12);
          if (req.description) {
            addText(`   Description: ${req.description}`, 10);
          }
        });
      }
      
      if (recommendations.caseMixWeightImpact) {
        addSubsection('Case Mix Weight Impact');
        const caseMix = recommendations.caseMixWeightImpact;
        addText(`Current Weight: ${caseMix.currentWeight || 'N/A'}`, 12);
        addText(`Potential Weight: ${caseMix.potentialWeight || 'N/A'}`, 12);
        addText(`Impact: ${caseMix.impact || 'N/A'}`, 12);
        
        if (caseMix.calculation) {
          addText('Calculation Details:', 12);
          if (caseMix.calculation.baseWeight) {
            addText(`  Base Weight: ${caseMix.calculation.baseWeight}`, 10);
          }
          if (caseMix.calculation.primaryDiagnosisWeight) {
            addText(`  Primary Diagnosis Weight: ${caseMix.calculation.primaryDiagnosisWeight}`, 10);
          }
          if (caseMix.calculation.secondaryDiagnosesWeight) {
            addText(`  Secondary Diagnoses Weight: ${caseMix.calculation.secondaryDiagnosesWeight}`, 10);
          }
        }
        
        if (caseMix.optimization?.length > 0) {
          addText('Optimization Opportunities:', 12);
          caseMix.optimization.forEach((opt: any, index: number) => {
            addText(`  ${index + 1}. ${opt.opportunity || 'N/A'}`, 10);
            if (opt.weightImpact) {
              addText(`     Weight Impact: ${opt.weightImpact}`, 10);
            }
          });
        }
      }
      
      if (recommendations.complianceIssues?.length > 0) {
        addSubsection('Compliance Issues');
        recommendations.complianceIssues.forEach((issue: any, index: number) => {
          addText(`${index + 1}. ${issue.issue || 'N/A'}`, 12);
          if (issue.description) {
            addText(`   Description: ${issue.description}`, 10);
          }
          if (issue.recommendation) {
            addText(`   Recommendation: ${issue.recommendation}`, 10);
          }
        });
      }
      
      if (recommendations.bestPractices?.length > 0) {
        addSubsection('Best Practices');
        recommendations.bestPractices.forEach((practice: any, index: number) => {
          addText(`${index + 1}. ${practice.practice || 'N/A'}`, 12);
          if (practice.explanation) {
            if (typeof practice.explanation === 'object') {
              addText(`   What it means: ${practice.explanation.whatItMeans || 'N/A'}`, 10);
              addText(`   Why important: ${practice.explanation.whyImportant || 'N/A'}`, 10);
              addText(`   How it affects care: ${practice.explanation.howItAffectsCare || 'N/A'}`, 10);
              addText(`   Implementation: ${practice.explanation.implementation || 'N/A'}`, 10);
            } else {
              addText(`   Explanation: ${practice.explanation}`, 10);
            }
          }
        });
      }
    }

    // Save the PDF
    const fileName = `coding-review-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const handleDownloadQAReport = async (result: any) => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = '#000000') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color);
      
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      
      // Check if we need a new page
      const lineHeight = fontSize * 0.4;
      const totalHeight = lines.length * lineHeight + 5;
      
      if (yPosition + totalHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(lines, margin, yPosition);
      yPosition += totalHeight;
    };

    // Helper function to add section header
    const addSectionHeader = (title: string) => {
      yPosition += 10;
      // Check if we need a new page for section header
      if (yPosition + 20 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      addText(title, 16, true, '#1f2937');
      yPosition += 5;
    };

    // Helper function to add subsection
    const addSubsection = (title: string) => {
      yPosition += 5;
      // Check if we need a new page for subsection
      if (yPosition + 15 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      addText(title, 14, true, '#374151');
      yPosition += 2;
    };

    // Header
    addText('QA REVIEW REPORT', 20, true, '#1f2937');
    addText(`Generated on: ${new Date().toLocaleDateString()}`, 10, false, '#6b7280');
    yPosition += 10;

    // Patient Information - Get from analysis results
    addSectionHeader('PATIENT INFORMATION');
    
    // Extract patient information from the analysis results
    const patientName = result.results?.patientName || 'N/A';
    const mrn = result.results?.mrn || 'N/A';
    const visitType = result.results?.visitType || 'N/A';
    const payor = result.results?.payor || 'N/A';
    const visitDate = result.results?.visitDate || 'N/A';
    const clinician = result.results?.clinician || 'N/A';
    const payPeriod = result.results?.payPeriod || 'N/A';
    const status = result.results?.status || 'N/A';
    
    addText(`Patient Name: ${patientName}`, 12);
    addText(`MRN: ${mrn}`, 12);
    addText(`Visit Type: ${visitType}`, 12);
    addText(`Payor: ${payor}`, 12);
    addText(`Visit Date: ${visitDate}`, 12);
    addText(`Clinician: ${clinician}`, 12);
    addText(`Pay Period: ${payPeriod}`, 12);
    addText(`Status: ${status}`, 12);

    // Active Diagnoses
    addSectionHeader('ACTIVE DIAGNOSES');
    
    // Primary Diagnosis
    if (result.results?.extractedData?.['Primary Diagnosis']) {
      addSubsection('Primary Diagnosis');
      const primary = result.results.extractedData['Primary Diagnosis'];
      addText(`ICD-10 Code: ${result.results.extractedData['Primary Diagnosis ICD'] || 'N/A'}`, 12);
      addText(`Description: ${primary || 'N/A'}`, 12);
      addText(`Clinical Group: ${result.results.extractedData['Primary Clinical Group'] || 'N/A'}`, 12);
      addText(`Comorbidity Group: ${result.results.extractedData['Primary Comorbidity Group'] || 'N/A'}`, 12);
    }

    // Other Diagnoses
    if (result.results?.extractedData?.['Other Diagnoses']?.length > 0) {
      addSubsection('Secondary Diagnoses');
      result.results.extractedData['Other Diagnoses'].forEach((diagnosis: any, index: number) => {
        addText(`${index + 1}. ${diagnosis}`, 12);
      });
    } else if (result.results?.extractedData?.['Other Diagnoses Details']?.length > 0) {
      addSubsection('Secondary Diagnoses');
      result.results.extractedData['Other Diagnoses Details'].forEach((diagnosis: any, index: number) => {
        addText(`${index + 1}. ${diagnosis.icd10Code || 'N/A'} - ${diagnosis.description || 'N/A'}`, 12);
        addText(`   Clinical Group: ${diagnosis.clinicalGroup || 'N/A'}`, 10);
        addText(`   Comorbidity Group: ${diagnosis.comorbidityGroup || 'N/A'}`, 10);
      });
    }

    // Corrections Required
    if (result.results?.extractedData?.['OASIS Corrections']?.length > 0) {
      addSectionHeader('CORRECTIONS REQUIRED');
      result.results.extractedData['OASIS Corrections'].forEach((correction: any, index: number) => {
        // Map index to OASIS item names
        const oasisItems = [
          'M1800 - Grooming',
          'M1810 - Dressing Upper Body', 
          'M1820 - Dressing Lower Body',
          'M1830 - Bathing',
          'M1840 - Toilet Transferring',
          'M1845 - Toileting Hygiene',
          'M1850 - Transferring',
          'M1860 - Ambulation/Locomotion',
          'M1870 - Feeding or Eating'
        ];
        
        const itemName = correction.item || oasisItems[index] || `OASIS Item ${index + 1}`;
        addSubsection(itemName);
        addText(`Current Value: ${correction.currentValue || 'N/A'}`, 12);
        addText(`Suggested Value: ${correction.suggestedValue || 'N/A'}`, 12);
        addText(`Clinical Rationale: ${correction.rationale || correction.clinicalRationale || correction.explanation || 'N/A'}`, 12);
        yPosition += 5; // Add space between corrections
      });
    }

    // Compliance Issues
    if (result.results?.extractedData?.ComplianceIssues) {
      addSectionHeader('COMPLIANCE ISSUES');
      const complianceIssues = result.results.extractedData.ComplianceIssues;
      
      // OASIS Issues
      if (complianceIssues.oasisIssues?.length > 0) {
        addSubsection('OASIS Compliance Issues');
        complianceIssues.oasisIssues.forEach((issue: any, index: number) => {
          addText(`${index + 1}. ${issue.item || 'N/A'}: ${issue.description || 'N/A'}`, 12);
          if (issue.action) {
            addText(`   Action: ${issue.action}`, 10);
          }
          if (issue.details) {
            addText(`   Details: ${issue.details}`, 10);
          }
        });
      }
      
      // Regulatory Issues
      if (complianceIssues.regulatoryIssues?.length > 0) {
        addSubsection('Regulatory Compliance Issues');
        complianceIssues.regulatoryIssues.forEach((issue: any, index: number) => {
          addText(`${index + 1}. ${issue.regulation || 'N/A'}: ${issue.description || 'N/A'}`, 12);
          if (issue.priority) {
            addText(`   Priority: ${issue.priority}`, 10);
          }
          if (issue.impact) {
            addText(`   Impact: ${issue.impact}`, 10);
          }
        });
      }
      
      // Quality Measures
      if (complianceIssues.qualityMeasures?.length > 0) {
        addSubsection('Quality Measures Issues');
        complianceIssues.qualityMeasures.forEach((issue: any, index: number) => {
          addText(`${index + 1}. ${issue.measure || 'N/A'}: ${issue.description || 'N/A'}`, 12);
          if (issue.status) {
            addText(`   Status: ${issue.status}`, 10);
          }
          if (issue.analysis) {
            addText(`   Analysis: ${issue.analysis}`, 10);
          }
          if (issue.recommendations) {
            addText(`   Recommendations: ${issue.recommendations}`, 10);
          }
        });
      }
    } else if (result.results?.complianceIssues?.length > 0) {
      addSectionHeader('COMPLIANCE ISSUES');
      result.results.complianceIssues.forEach((issue: any, index: number) => {
        addText(`${index + 1}. ${issue}`, 12);
      });
    }

    // Documentation
    if (result.results?.documentation?.length > 0) {
      addSectionHeader('DOCUMENTATION');
      result.results.documentation.forEach((doc: any, index: number) => {
        addSubsection(`Documentation ${index + 1}`);
        addText(`Type: ${doc.type || 'N/A'}`, 12);
        addText(`Status: ${doc.status || 'N/A'}`, 12);
        addText(`Description: ${doc.description || 'N/A'}`, 12);
        if (doc.notes) {
          addText(`Notes: ${doc.notes}`, 12);
        }
        if (doc.recommendations) {
          addText(`Recommendations: ${doc.recommendations}`, 12);
        }
      });
    }

    // Save the PDF
    const fileName = `QA_Review_Report_${patientName?.replace(/\s+/g, '_') || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const tabs = [
    { id: 'file-upload', label: 'File Upload' },
    { id: 'processing-queue', label: 'Processing Queue' },
    { id: 'results-reports', label: 'Results & Reports' }
  ];

  // Get analysis tabs based on analysis type
  const getAnalysisTabs = (analysisType?: string) => {
    const type = analysisType || uploadType;
    if (type === 'coding-review') {
      return [
        { id: 'primary-diagnosis', label: 'Primary Diagnosis Coding' },
        { id: 'secondary-diagnoses', label: 'Secondary Diagnoses Analysis' },
        { id: 'coding-corrections', label: 'Coding Corrections' },
        { id: 'coding-recommendations', label: 'Coding Recommendations' }
      ];
    } else if (type === 'financial-optimization') {
      return [
        { id: 'case-mix-analysis', label: 'Case Mix Weight Analysis' },
        { id: 'service-optimization', label: 'Service Optimization' },
        { id: 'payment-source-analysis', label: 'Payment Source Analysis' },
        { id: 'financial-recommendations', label: 'Financial Recommendations' }
      ];
    } else {
      return [
    { id: 'active-diagnoses', label: 'Active Diagnoses' },
    { id: 'corrections-required', label: 'Corrections Required' },
        { id: 'compliance-issues', label: 'Compliance Issues' },
    { id: 'documentation', label: 'Documentation' }
  ];
    }
  };

  const analysisTabs = getAnalysisTabs();

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
      formData.append('aiModel', 'gpt-5-nano');
      if (patientId) formData.append('patientId', patientId);
      if (processingNotes) formData.append('processingNotes', processingNotes);

      // Route to appropriate API based on analysis type
      let apiEndpoint = '/api/qa-analysis'; // Default fallback
      if (uploadType === 'coding-review') {
        apiEndpoint = '/api/coding-analysis';
      } else if (uploadType === 'financial-optimization') {
        apiEndpoint = '/api/financial-optimization';
      }
      
      const response = await fetch(apiEndpoint, {
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
        
        // Refresh results from appropriate service
        await fetchResults();
        
        await fetchQueue();
        
        // Switch to results tab
        setActiveTab('results-reports');
        
        alert(`Successfully processed ${result.results.length} file(s)!`);
      } else {
        alert(`Error: ${result.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error processing files: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestAnalysis = async () => {
    setIsProcessing(true);

    try {
      // Route to appropriate test API based on analysis type
      let testApiEndpoint = '/api/qa-analysis/test'; // Default fallback
      if (uploadType === 'coding-review') {
        testApiEndpoint = '/api/coding-analysis/test';
      } else if (uploadType === 'financial-optimization') {
        testApiEndpoint = '/api/financial-optimization/test';
      }
      
      // Create a test request with qa.txt content
      const response = await fetch(testApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisType: uploadType,
          priority: priorityLevel,
          aiModel: 'gpt-5-nano',
          patientId: patientId || 'TEST_PATIENT',
          processingNotes: processingNotes || 'Test analysis using qa.txt file',
        }),
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
        // Use the result directly from the API response
        setAnalysisResults(result.results);
        
        // Switch to results tab
        setActiveTab('results-reports');
        
        alert('Test analysis completed successfully!');
      } else {
        alert(`Error: ${result.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error in test analysis:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error in test analysis: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchResults = async () => {
    try {
      // Fetch results from QA, Coding, and Financial Optimization analysis services
      const [qaResponse, codingResponse, financialResponse] = await Promise.all([
        fetch('/api/qa-analysis?type=results'),
        fetch('/api/coding-analysis?type=results'),
        fetch('/api/financial-optimization?type=results')
      ]);

      const allResults: any[] = [];

      // Process QA results
      if (qaResponse.ok) {
        const qaResult = await qaResponse.json();
        if (qaResult.success && qaResult.results) {
          allResults.push(...qaResult.results);
        }
      }

      // Process Coding results
      if (codingResponse.ok) {
        const codingResult = await codingResponse.json();
        if (codingResult.success && codingResult.results) {
          allResults.push(...codingResult.results);
        }
      }

      // Process Financial Optimization results
      if (financialResponse.ok) {
        const financialResult = await financialResponse.json();
        if (financialResult.success && financialResult.results) {
          allResults.push(...financialResult.results);
        }
      }

      // Sort by creation date (newest first)
      allResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setAnalysisResults(allResults);
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
              onChange={(e) => {
                setUploadType(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="qa-review" className="text-black">QA Review</option>
              <option value="coding-review" className="text-black">Coding Review</option>
              <option value="financial-optimization" className="text-black">Financial Optimization</option>
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
            
            {/* Analysis buttons */}
            <div className="flex justify-end pt-4 space-x-3">
              {/* Test Button - Always visible */}
              <button
                onClick={handleTestAnalysis}
                disabled={isProcessing}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 text-lg font-medium"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Test with qa.txt</span>
                  </>
                )}
              </button>
            
            {/* Analysis button appears only when PDF files are uploaded */}
            {uploadedFiles.some(file => file.type === 'application/pdf') && (
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
            )}
            </div>
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
        
        {!Array.isArray(analysisResults) || analysisResults.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No results available</p>
            <p className="text-sm text-gray-400 mt-2">Process files to see AI analysis results</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analysisResults.map((result, index) => (
              <div key={result.analysisId || `result-${index}`} className="border border-gray-200 rounded-lg p-4">
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
                      onClick={() => {
                        setSelectedResult(result);
                        // Set default tab based on analysis type
                        if (result.analysisType === 'coding-review') {
                          setActiveAnalysisTab('primary-diagnosis');
                        } else {
                          setActiveAnalysisTab('active-diagnoses');
                        }
                      }}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                {result.status === 'completed' && (() => {
                  const metrics = getAnalysisMetrics(result);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-900">AI Confidence</p>
                        <p className="text-2xl font-bold text-purple-600">{Math.round((metrics.confidence || 0) * 100)}%</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-orange-900">Issues Found</p>
                        <p className="text-2xl font-bold text-orange-600">{metrics.issuesFound}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${
                        metrics.riskLevel === 'low' ? 'bg-green-50' :
                        metrics.riskLevel === 'medium' ? 'bg-yellow-50' :
                        metrics.riskLevel === 'high' ? 'bg-orange-50' :
                      'bg-red-50'
                    }`}>
                      <p className={`text-sm font-medium ${
                          metrics.riskLevel === 'low' ? 'text-green-900' :
                          metrics.riskLevel === 'medium' ? 'text-yellow-900' :
                          metrics.riskLevel === 'high' ? 'text-orange-900' :
                        'text-red-900'
                      }`}>Risk Level</p>
                      <p className={`text-lg font-bold ${
                          metrics.riskLevel === 'low' ? 'text-green-600' :
                          metrics.riskLevel === 'medium' ? 'text-yellow-600' :
                          metrics.riskLevel === 'high' ? 'text-orange-600' :
                        'text-red-600'
                        }`}>{metrics.riskLevel.toUpperCase()}</p>
                    </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Process Time</p>
                        <p className="text-2xl font-bold text-blue-600">{metrics.processingTime}</p>
                  </div>
                </div>
                  );
                })()}
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Analysis Details</h3>
                      <p className="text-sm text-gray-500">Comprehensive AI-powered quality assurance review</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                    {/* Analysis Tabs */}
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex space-x-2">
                        {getAnalysisTabs(selectedResult.analysisType).map((tab) => (
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
                    {(() => {
                      // Handle different analysis types
                      if (selectedResult.analysisType === 'coding-review') {
                        // For coding review, extract patient info from results
                        const patientInfo = selectedResult.results?.patientInfo;
                        const patientName = patientInfo?.patientName || 'N/A';
                        const mrn = patientInfo?.mrn || 'N/A';
                        const visitType = patientInfo?.visitType || 'N/A';
                        const payor = patientInfo?.payor || 'N/A';
                        const visitDate = patientInfo?.visitDate || 'N/A';
                        const clinician = patientInfo?.clinician || 'N/A';
                        const payPeriod = patientInfo?.payPeriod || 'N/A';
                        const status = patientInfo?.status || 'N/A';
                        
                        return (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Patient Name:</span>
                                <span className="font-medium text-gray-900">{patientName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">MRN:</span>
                                <span className="font-medium text-gray-900">{mrn}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Visit Type:</span>
                                <span className="font-medium text-gray-900">{visitType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payor:</span>
                                <span className="font-medium text-gray-900">{payor}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Visit Date:</span>
                                <span className="font-medium text-gray-900">{visitDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Clinician:</span>
                                <span className="font-medium text-gray-900">{clinician}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Pay Period:</span>
                                <span className="font-medium text-gray-900">{payPeriod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  status?.toLowerCase().includes('optimized') 
                                    ? 'bg-green-100 text-green-800'
                                    : status?.toLowerCase().includes('pending')
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : status?.toLowerCase().includes('error')
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {status}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      } else if (selectedResult.analysisType === 'financial-optimization') {
                        // For financial optimization, extract patient info from results
                        const patientInfo = selectedResult.results?.patientInfo;
                        const patientName = patientInfo?.patientName || 'N/A';
                        const mrn = patientInfo?.mrn || 'N/A';
                        const visitType = patientInfo?.visitType || 'N/A';
                        const payor = patientInfo?.payor || 'N/A';
                        const visitDate = patientInfo?.visitDate || 'N/A';
                        const clinician = patientInfo?.clinician || 'N/A';
                        const payPeriod = patientInfo?.payPeriod || 'N/A';
                        const status = patientInfo?.status || 'N/A';
                        
                        return (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Patient Name:</span>
                                <span className="font-medium text-gray-900">{patientName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">MRN:</span>
                                <span className="font-medium text-gray-900">{mrn}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Visit Type:</span>
                                <span className="font-medium text-gray-900">{visitType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Payor:</span>
                                <span className="font-medium text-gray-900">{payor}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Visit Date:</span>
                                <span className="font-medium text-gray-900">{visitDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Clinician:</span>
                                <span className="font-medium text-gray-900">{clinician}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Pay Period:</span>
                                <span className="font-medium text-gray-900">{payPeriod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  status?.toLowerCase().includes('optimized') 
                                    ? 'bg-green-100 text-green-800'
                                    : status?.toLowerCase().includes('pending')
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : status?.toLowerCase().includes('error')
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {status}
                                </span>
                              </div>
                            </div>
                          </>
                        );
                      } else {
                        // For QA review, use existing logic
                        const actualExtractedData = getActualExtractedData(selectedResult.results?.extractedData);
                        
                        // Get patient info from the correct location
                        const patientName = actualExtractedData?.patientName || selectedResult.results?.patientName;
                        const mrn = actualExtractedData?.mrn || selectedResult.results?.mrn;
                        const visitType = actualExtractedData?.visitType || selectedResult.results?.visitType;
                        const payor = actualExtractedData?.payor || selectedResult.results?.payor;
                        const visitDate = actualExtractedData?.visitDate || selectedResult.results?.visitDate;
                        const clinician = actualExtractedData?.clinician || selectedResult.results?.clinician;
                        const payPeriod = actualExtractedData?.payPeriod || selectedResult.results?.payPeriod;
                        const status = actualExtractedData?.status || selectedResult.results?.status;
                      
                      return (
                        <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient Name:</span>
                        <span className="font-medium text-gray-900">
                                {patientName || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">MRN:</span>
                        <span className="font-medium text-gray-900">
                                {mrn || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visit Type:</span>
                        <span className="font-medium text-gray-900">
                                {visitType || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payor:</span>
                        <span className="font-medium text-gray-900">
                                {payor || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visit Date:</span>
                        <span className="font-medium text-gray-900">
                                {visitDate || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clinician:</span>
                        <span className="font-medium text-gray-900">
                                {clinician || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pay Period:</span>
                        <span className="font-medium text-gray-900">
                                {payPeriod || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                status?.toLowerCase().includes('optimized') 
                            ? 'bg-green-100 text-green-800'
                                  : status?.toLowerCase().includes('pending')
                            ? 'bg-yellow-100 text-yellow-800'
                                  : status?.toLowerCase().includes('error')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                                {status || 'N/A'}
                        </span>
                      </div>
                    </div>
                        </>
                      );
                      }
                    })()}
                  </div>
                </div>
                
                {selectedResult.status === 'completed' && (
                  <>
                        

                        {/* QA Review Tabs - Show for QA Review analysis type */}
                        {selectedResult.analysisType === 'qa-review' && (
                          <QAReviewTabs
                            selectedResult={selectedResult}
                            activeAnalysisTab={activeAnalysisTab}
                            setActiveAnalysisTab={setActiveAnalysisTab}
                            getActualExtractedData={getActualExtractedData}
                          />
                        )}

                        {/* Coding Review Tabs - Show for Coding Review analysis type */}
                        {selectedResult.analysisType === 'coding-review' && (
                          <CodingReviewTabs
                            selectedResult={selectedResult}
                            activeAnalysisTab={activeAnalysisTab}
                            setActiveAnalysisTab={setActiveAnalysisTab}
                            getActualExtractedData={getActualExtractedData}
                          />
                        )}

                        {/* Financial Optimization Tabs - Show for Financial Optimization analysis type */}
                        {selectedResult.analysisType === 'financial-optimization' && (
                          <FinancialOptimizationTabs
                            selectedResult={selectedResult}
                            activeAnalysisTab={activeAnalysisTab}
                            setActiveAnalysisTab={setActiveAnalysisTab}
                            getActualExtractedData={getActualExtractedData}
                          />
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
                scrollbarColor: 'rgb(156 163 175) transparent'
              }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 text-gray-600 mr-2" />
                  FILE INFORMATION
                </h3>

                {/* File Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">File Type</label>
                    <p className="text-sm text-gray-900">{selectedResult.fileName?.split('.').pop()?.toUpperCase() || 'PDF'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">File Size</label>
                    <p className="text-sm text-gray-900">N/A</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Analysis Date</label>
                    <p className="text-sm text-gray-900">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                {/* Analysis Details */}
                $<div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">File</label>
                    <p className="text-sm text-gray-900">{selectedResult.fileName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Analysis Type</label>
                    <p className="text-sm text-gray-900">{selectedResult.analysisType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <p className="text-sm text-gray-900">{selectedResult.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedResult.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedResult.status === 'processing' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {selectedResult.status}
                    </span>
                    </div>
                  </div>
                </div>

                {/* Download PDF Button - For QA Review and Coding Review */}
                {(selectedResult.analysisType === 'qa-review' || selectedResult.analysisType === 'coding-review') && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => selectedResult.analysisType === 'qa-review' 
                        ? handleDownloadQAReport(selectedResult)
                        : handleDownloadCodingReport(selectedResult)
                      }
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Report</span>
                    </button>
                  </div>
                )}
              </div>
              {/* End flex-1 modal container */}
            </div>
            {/* End modal container bg-white/95 */}
          </div>
          {/* End modal backdrop */}
        </div>
        {/* End conditional modal */}
        </>
      )}
    {/* End main wrapper div */}
    </div>
  );
}
