import { NextRequest, NextResponse } from 'next/server';
import { qaAnalysisServiceNew } from '@/lib/services/qaAnalysisServiceNew';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisType, priority, patientId, processingNotes, aiModel } = body;

    // Read the qa.txt file
    const qaFilePath = path.join(process.cwd(), 'qa.txt');
    
    if (!fs.existsSync(qaFilePath)) {
      return NextResponse.json(
        { error: 'qa.txt file not found' },
        { status: 404 }
      );
    }

    console.log('Test analysis: Processing qa.txt file');

    // Read the file and analyze using buffer method (same as start analysis)
    const fileBuffer = fs.readFileSync(qaFilePath);
    const result = await qaAnalysisServiceNew.analyzeFileFromBuffer(
      fileBuffer,
      'qa.txt',
      analysisType || 'qa-review',
      priority || 'medium',
      patientId || 'TEST_PATIENT',
      processingNotes || 'Test analysis using qa.txt file',
      aiModel as 'gpt-5-nano' || 'gpt-5-nano'
    );

    return NextResponse.json({
      success: true,
      results: [result],
      message: 'Test analysis completed successfully using qa.txt'
    });

  } catch (error) {
    console.error('Error in test QA analysis API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

