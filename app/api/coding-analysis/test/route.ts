import { NextRequest, NextResponse } from 'next/server';
import { codingAnalysisService } from '@/lib/services/codingAnalysisService';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Coding Analysis Test API: Starting test analysis');
    
    // Read qa.txt file for testing
    const qaFilePath = path.join(process.cwd(), 'qa.txt');
    
    if (!fs.existsSync(qaFilePath)) {
      return NextResponse.json(
        { error: 'qa.txt file not found for testing' },
        { status: 404 }
      );
    }

    console.log('Coding Analysis Test API: Reading qa.txt file');
    
    // Read the file content and analyze using the coding analysis service
    const fileContent = fs.readFileSync(qaFilePath, 'utf-8');
    const buffer = Buffer.from(fileContent, 'utf-8');
    
    const result = await codingAnalysisService.analyzeFileFromBuffer(
      buffer,
      'qa.txt',
      'coding-review',
      'medium',
      undefined,
      'Test analysis using qa.txt',
      'gpt-5-nano'
    );

    console.log('Coding Analysis Test API: Analysis completed successfully');

    return NextResponse.json({
      success: true,
      results: [result]  // Wrap single result in array to match main API
    });

  } catch (error) {
    console.error('Coding Analysis Test API Error:', error);
    return NextResponse.json(
      { 
        error: 'Test analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
