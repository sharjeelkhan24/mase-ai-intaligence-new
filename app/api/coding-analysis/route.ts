import { NextRequest, NextResponse } from 'next/server';
import { codingAnalysisService, CodingAnalysisResult } from '@/lib/services/codingAnalysisService';
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
    const aiModel = 'gpt-5-nano';

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const results: CodingAnalysisResult[] = [];

    for (const file of files) {
      try {
        // Get file buffer directly (no filesystem operations needed)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        console.log('Processing file:', file.name, 'Size:', buffer.length, 'bytes');

        // Analyze the file directly from buffer
        const result = await codingAnalysisService.analyzeFileFromBuffer(
          buffer,
          file.name,
          analysisType || 'coding-review',
          priority || 'medium',
          patientId || undefined,
          processingNotes || undefined,
          aiModel as 'gpt-5-nano'
        );

        results.push(result);

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        
        // Create error result
        const errorResult: CodingAnalysisResult = {
          id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.name,
          analysisType: analysisType || 'coding-review',
          priority: priority || 'medium',
          patientId: patientId || undefined,
          status: 'failed',
          results: {
            patientInfo: {
              patientName: '',
              patientId: patientId || '',
              mrn: '',
              visitType: '',
              payor: '',
              visitDate: '',
              clinician: '',
              payPeriod: '',
              status: ''
            },
            primaryDiagnosisCoding: {
              currentCode: '',
              currentDescription: '',
              severityLevel: '',
              clinicalSupport: '',
              alternativeCodes: [],
              sequencingRecommendations: {
                recommendation: '',
                explanation: {
                  whatItMeans: '',
                  whyImportant: '',
                  howItAffectsCare: '',
                  implementation: ''
                }
              },
              validationStatus: 'invalid'
            },
            secondaryDiagnosesAnalysis: {
              codes: [],
              missingDiagnoses: [],
              comorbidityImpact: '',
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
              caseMixWeightImpact: {
                currentWeight: '',
                potentialWeight: '',
                impact: '',
                calculation: {
                  baseWeight: '',
                  primaryDiagnosisWeight: '',
                  secondaryDiagnosesWeight: '',
                  severityAdjustments: '',
                  comorbidityImpact: '',
                  functionalStatusImpact: '',
                  riskFactorsImpact: ''
                },
                optimization: {
                  missingCodes: [],
                  severityImprovements: [],
                  comorbidityAdditions: []
                },
                recommendations: []
              },
              complianceIssues: [],
              bestPractices: []
            },
            summary: {
              totalIssues: 0,
              criticalIssues: 0,
              recommendations: 0,
              complianceScore: 0,
              riskLevel: 'high'
            }
          },
          processingNotes: processingNotes || undefined,
          createdAt: new Date(),
          completedAt: new Date(),
          processingTime: '0s',
          fileInfo: {
            size: file.size,
            type: path.extname(file.name),
            lastModified: new Date()
          }
        };

        results.push(errorResult);
      }
    }

    return NextResponse.json({
      success: true,
      results: results,
      totalFiles: files.length,
      successfulFiles: results.filter(r => r.status === 'completed').length,
      failedFiles: results.filter(r => r.status === 'failed').length
    });

  } catch (error) {
    console.error('Coding Analysis API Error:', error);
    return NextResponse.json(
      { 
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

    if (type === 'results') {
      // Return stored analysis results
      const results = codingAnalysisService.getAllAnalysisResults();
      
      return NextResponse.json({
        success: true,
        results: results
      });
    } else {
      // Return processing queue (default behavior)
      const queue = codingAnalysisService.getProcessingQueue();
      
      return NextResponse.json({
        success: true,
        queue: queue
      });
    }

  } catch (error) {
    console.error('Coding Analysis API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
