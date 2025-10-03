import { NextRequest, NextResponse } from 'next/server';
import AnalysisResultsService from '@/lib/services/analysisResultsService';

const analysisResultsService = new AnalysisResultsService();

export async function POST(request: NextRequest) {
  try {
    console.log('Analysis Results API: Saving result');
    
    const body = await request.json();
    const { 
      agencyEmail, 
      analysisType, 
      result 
    } = body;

    if (!agencyEmail || !analysisType || !result) {
      return NextResponse.json(
        { error: 'Missing required fields: agencyEmail, analysisType, result' },
        { status: 400 }
      );
    }

    // Get agency by email
    const agency = await analysisResultsService.getAgencyByEmail(agencyEmail);
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    // Prepare result for database
    const dbResult = {
      agency_id: agency.id,
      analysis_id: result.analysisId,
      file_name: result.fileName,
      analysis_type: analysisType,
      status: result.status,
      priority: result.priority,
      patient_id: result.patientId,
      processing_notes: result.processingNotes,
      ai_model: result.aiModel,
      results: result.results,
      confidence: result.confidence,
      processing_time: result.processingTime
    };

    let savedResult;
    
    // Save to appropriate table based on analysis type
    switch (analysisType) {
      case 'qa-review':
        savedResult = await analysisResultsService.saveQAReviewResult(dbResult);
        break;
      case 'coding-review':
        savedResult = await analysisResultsService.saveCodingReviewResult(dbResult);
        break;
      case 'financial-optimization':
        savedResult = await analysisResultsService.saveFinancialOptimizationResult(dbResult);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    console.log('Analysis Results API: Result saved successfully');
    
    return NextResponse.json({
      success: true,
      result: savedResult,
      message: 'Analysis result saved successfully'
    });

  } catch (error) {
    console.error('Analysis Results API Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyEmail = searchParams.get('agencyEmail');
    const analysisType = searchParams.get('analysisType');
    const analysisId = searchParams.get('analysisId');

    if (!agencyEmail) {
      return NextResponse.json(
        { error: 'agencyEmail parameter is required' },
        { status: 400 }
      );
    }

    // Get agency by email
    const agency = await analysisResultsService.getAgencyByEmail(agencyEmail);
    if (!agency) {
      return NextResponse.json(
        { error: 'Agency not found' },
        { status: 404 }
      );
    }

    // Get specific result by analysis ID
    if (analysisId) {
      let result;
      
      switch (analysisType) {
        case 'qa-review':
          result = await analysisResultsService.getQAReviewResult(analysisId);
          break;
        case 'coding-review':
          result = await analysisResultsService.getCodingReviewResult(analysisId);
          break;
        case 'financial-optimization':
          result = await analysisResultsService.getFinancialOptimizationResult(analysisId);
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid analysis type' },
            { status: 400 }
          );
      }

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

    // Get all results for the agency
    const allResults = await analysisResultsService.getAllAnalysisResults(agency.id);

    return NextResponse.json({
      success: true,
      results: allResults
    });

  } catch (error) {
    console.error('Analysis Results API GET Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get('analysisId');
    const analysisType = searchParams.get('analysisType');

    if (!analysisId || !analysisType) {
      return NextResponse.json(
        { error: 'analysisId and analysisType parameters are required' },
        { status: 400 }
      );
    }

    let success;
    
    switch (analysisType) {
      case 'qa-review':
        success = await analysisResultsService.deleteQAReviewResult(analysisId);
        break;
      case 'coding-review':
        success = await analysisResultsService.deleteCodingReviewResult(analysisId);
        break;
      case 'financial-optimization':
        success = await analysisResultsService.deleteFinancialOptimizationResult(analysisId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete analysis result' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis result deleted successfully'
    });

  } catch (error) {
    console.error('Analysis Results API DELETE Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
