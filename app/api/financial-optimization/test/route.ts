import { NextRequest, NextResponse } from 'next/server';
import FinancialOptimizationService from '@/lib/services/financialOptimizationService';
import * as fs from 'fs';
import * as path from 'path';

const financialOptService = new FinancialOptimizationService();

export async function POST(request: NextRequest) {
  try {
    console.log('Financial Optimization Test API: Processing request');
    
    const body = await request.json();
    const { analysisType, priority, aiModel, patientId, processingNotes } = body;
    
    // Load qa.txt file for testing
    const qaFilePath = path.join(process.cwd(), 'qa.txt');
    
    if (!fs.existsSync(qaFilePath)) {
      return NextResponse.json({
        success: false,
        error: 'qa.txt file not found for testing'
      }, { status: 404 });
    }

    const qaContent = fs.readFileSync(qaFilePath, 'utf-8');
    
    console.log('Financial Optimization Test API: Running test analysis');
    console.log('Financial Optimization Test API: Analysis type:', analysisType);
    console.log('Financial Optimization Test API: Content length:', qaContent.length);

    // Create a temporary buffer from the qa.txt content
    const buffer = Buffer.from(qaContent, 'utf-8');

    const result = await financialOptService.analyzeFileFromBuffer(
      buffer,
      'qa.txt',
      analysisType,
      priority,
      patientId,
      processingNotes,
      aiModel
    );

    console.log('Financial Optimization Test API: Analysis completed successfully');
    console.log('Financial Optimization Test API: Processing time:', result.processingTime);

    // Debug log the final result analysisType
    console.log('Financial Optimization Test API: Final result analysisType being sent:', result.analysisType);

    // Wrap result in expected test API format
    const testResult = {
      success: true,
      results: [result], // Wrap single result in array to match other APIs
      message: 'Financial optimization test analysis completed successfully'
    };

    return NextResponse.json(testResult);

  } catch (error) {
    console.error('Financial Optimization Test API Error:', error);
    
    // Create fallback error result
    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      results: [],
      fallbackResult: {
        analysisId: `financial_test_error_${Date.now()}`,
        fileName: 'qa.txt',
        analysisType: 'financial-optimization',
        status: 'error',
        priority: 'medium',
        patientId: 'TEST_PATIENT',
        processingNotes: 'Test analysis using qa.txt file',
        aiModel: 'gpt-5-nano',
        processedData: null,
        results: {
          revenueImpactAnalysis: {
            currentPaymentCode: 'Error occurred',
            optimizedPaymentCode: 'Error occurred',
            serviceClassification: {
              primaryService: 'Error',
              serviceIntensity: 'Error',
              complexityLevel: 'Error',
              resourceUtilization: 'Error',
              totalServiceValue: 'Error'
            },
            documentationOptimization: 'Error occurred during analysis',
            billingAccuracyAnalysis: 'Error occurred during analysis',
            codingOpportunities: 'Error occurred during analysis',
            episodeRevenueCalculation: 'Error occurred during analysis',
            revenueProjection: 'Error occurred during analysis'
          },
          serviceOptimization: {
            resourceAnalysis: {
              serviceComponents: [],
              optimizationOpportunities: []
            },
            serviceBundleOptimization: 'Error occurred during analysis',
            resourceMaximization: 'Error occurred during analysis',
            timingOptimization: 'Error occurred during analysis',
            payerSpecificOptimization: 'Error occurred during analysis',
            serviceIntensityOptimization: 'Error occurred during analysis'
          },
          paymentSourceAnalysis: {
            currentPaymentSource: 'Error occurred',
            medicareOptimization: 'Error occurred during analysis',
            managedCareAnalysis: 'Error occurred during analysis',
            medicaidProgramAnalysis: 'Error occurred during analysis',
            privateInsuranceConsiderations: 'Error occurred during analysis',
            benefitsComparison: 'Error occurred during analysis'
          },
          financialRecommendations: {
            revenueStrategies: [],
            documentationImprovements: [],
            serviceAdditions: [],
            paymentOptimization: [],
            riskAssessment: 'Error occurred during analysis',
            roiCalculations: 'Error occurred during analysis'
          },
          summary: {
            currentRevenuePotential: 0,
            optimizedRevenuePotential: 0,
            revenueIncrease: 0,
            optimizationOpportunities: 0,
            riskLevel: 'high',
            aiConfidence: 0
          }
        },
        confidence: 0.1,
        processingTime: 'Test analysis failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    };

    return NextResponse.json(errorResult, { status: 500 });
  }
}
