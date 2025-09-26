import { NextRequest, NextResponse } from 'next/server';
import { qaAnalysisServiceNew, QAAnalysisResult } from '@/lib/services/qaAnalysisServiceNew';
import * as fs from 'fs';
import * as path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const analysisType = formData.get('analysisType') as string;
    const priority = formData.get('priority') as string;
    const patientId = formData.get('patientId') as string;
    const processingNotes = formData.get('processingNotes') as string;
    const aiModel = (formData.get('aiModel') as string) || 'gpt-3.5-turbo';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const results: QAAnalysisResult[] = [];

    for (const file of files) {
      try {
        // Create temporary file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Always use the uploaded file
        const filePath = path.join(uploadsDir, file.name);
        console.log('Saving uploaded file to:', filePath);
        
        // Write the uploaded file
        await writeFile(filePath, buffer);

        // Analyze the file
        const result = await qaAnalysisServiceNew.analyzeFile(
          filePath,
          file.name,
          analysisType || 'qa-review',
          priority || 'medium',
          patientId || undefined,
          processingNotes || undefined,
          aiModel as 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o'
        );

        results.push(result);

        // Clean up temporary file
        fs.unlinkSync(filePath);

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        
        // Create error result
        const errorResult: QAAnalysisResult = {
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.name,
          analysisType: analysisType || 'qa-review',
          priority: priority || 'medium',
          patientId: patientId || undefined,
          status: 'error',
          results: {
            complianceScore: 0,
            issuesFound: [`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`],
            recommendations: ['Please check file format and try again'],
            riskLevel: 'high',
            summary: 'File processing failed',
            detailedAnalysis: error instanceof Error ? error.message : 'Unknown error occurred'
          },
          processingNotes,
          createdAt: new Date(),
          completedAt: new Date()
        };

        results.push(errorResult);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Successfully processed ${results.length} file(s)`
    });

  } catch (error) {
    console.error('Error in QA analysis API:', error);
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'queue') {
      const queue = qaAnalysisServiceNew.getProcessingQueue();
      return NextResponse.json({
        success: true,
        queue
      });
    }

    if (type === 'results') {
      const results = qaAnalysisServiceNew.getAllAnalysisResults();
      return NextResponse.json({
        success: true,
        results
      });
    }

    const resultId = searchParams.get('id');
    if (resultId) {
      const result = qaAnalysisServiceNew.getAnalysisResult(resultId);
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

    // Return all results by default
    const results = qaAnalysisServiceNew.getAllAnalysisResults();
    const queue = qaAnalysisServiceNew.getProcessingQueue();

    return NextResponse.json({
      success: true,
      results,
      queue
    });

  } catch (error) {
    console.error('Error in QA analysis GET API:', error);
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

