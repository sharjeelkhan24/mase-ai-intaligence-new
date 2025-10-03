import { NextRequest, NextResponse } from 'next/server';
import FinancialOptimizationService from '@/lib/services/financialOptimizationService';

const financialOptService = new FinancialOptimizationService();

export async function POST(request: NextRequest) {
  try {
    console.log('Financial Optimization API: Processing request');
    
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const analysisType = formData.get('analysisType') as string || 'financial-optimization';
    const priority = formData.get('priority') as string || 'medium';
    const patientId = formData.get('patientId') as string || '';
    const processingNotes = formData.get('processingNotes') as string || '';
    const aiModel: 'gpt-5-nano' = 'gpt-5-nano';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    console.log('Financial Optimization API: Processing', files.length, 'files');
    console.log('Financial Optimization API: Analysis type:', analysisType);
    console.log('Financial Optimization API: Priority:', priority);
    console.log('Financial Optimization API: Patient ID:', patientId);

    // Process the first file (assuming single file upload for now)
    const file = files[0];
    const buffer = Buffer.from(await file.arrayBuffer());

    console.log('Financial Optimization API: Starting analysis for file:', file.name);
    
    const result = await financialOptService.analyzeFileFromBuffer(
      buffer,
      file.name,
      analysisType,
      priority,
      patientId,
      processingNotes,
      aiModel
    );

    console.log('Financial Optimization API: Analysis completed successfully');
    console.log('Financial Optimization API: Processing time:', result.processingTime);

    // Wrap result in expected format to match test API
    const apiResult = {
      success: true,
      results: [result], // Wrap single result in array to match other APIs
      message: 'Financial optimization analysis completed successfully'
    };

    return NextResponse.json(apiResult);

  } catch (error) {
    console.error('Financial Optimization API Error:', error);
    
    // Create fallback error result
    const errorResult = {
      analysisId: `financial_analysis_error_${Date.now()}`,
      fileName: 'unknown',
      analysisType: 'financial-optimization',
      status: 'error',
      priority: 'medium',
      processedData: null,
      results: {
        revenueImpactAnalysis: {
          currentPaymentCode: '',
          optimizedPaymentCode: '',
          serviceClassification: {
            primaryService: '',
            serviceIntensity: '',
            complexityLevel: '',
            resourceUtilization: '',
            totalServiceValue: ''
          },
          documentationOptimization: '',
          billingAccuracyAnalysis: '',
          codingOpportunities: '',
          episodeRevenueCalculation: '',
          revenueProjection: ''
        },
        serviceOptimization: {
          resourceAnalysis: {
            serviceComponents: [],
            optimizationOpportunities: []
          },
          serviceBundleOptimization: '',
          resourceMaximization: '',
          timingOptimization: '',
          payerSpecificOptimization: '',
          serviceIntensityOptimization: ''
        },
        paymentSourceAnalysis: {
          currentPaymentSource: '',
          medicareOptimization: '',
          managedCareAnalysis: '',
          medicaidProgramAnalysis: '',
          privateInsuranceConsiderations: '',
          benefitsComparison: ''
        },
        financialRecommendations: {
          revenueStrategies: [],
          documentationImprovements: [],
          serviceAdditions: [],
          paymentOptimization: [],
          riskAssessment: '',
          roiCalculations: ''
        },
        summary: {
          currentRevenuePotential: 0,
          optimizedRevenuePotential: 0,
          revenueIncrease: 0,
          optimizationOpportunities: 0,
          riskLevel: 'low',
          aiConfidence: 0
        }
      },
      confidence: 0.1,
      processingTime: 'Error occurred',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    // Wrap error result in expected format
    const apiErrorResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      results: [],
      fallbackResult: errorResult
    };

    return NextResponse.json(apiErrorResult, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'queue') {
      const queue = financialOptService.getAllProcessingItems();
      return NextResponse.json({
        success: true,
        queue
      });
    }

    if (type === 'results') {
      const results = financialOptService.getAllAnalysisResults();
      return NextResponse.json({
        success: true,
        results
      });
    }

    const resultId = searchParams.get('id');
    if (resultId) {
      const result = financialOptService.getAnalysisResult(resultId);
      if (!result) {
        return NextResponse.json(
          { error: 'Analysis result not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        result
      });
    }

    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Financial Optimization API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
