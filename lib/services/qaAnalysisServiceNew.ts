import { PatientInfo } from './aiPatientInfoService';
import { OpenAIService, QAAnalysisResult as OpenAIAnalysisResult } from './openaiService';
import * as fs from 'fs';
import * as path from 'path';

export interface QAAnalysisResult {
  id: string;
  fileName: string;
  analysisType: string;
  priority: string;
  patientId?: string;
  status: 'processing' | 'completed' | 'error';
  results: {
    complianceScore: number;
    issuesFound: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    summary: string;
    detailedAnalysis: string;
    extractedData?: any; // Add extractedData to the results
  };
  processingNotes?: string;
  createdAt: Date;
  completedAt?: Date;
  patientInfo?: PatientInfo;
  fileInfo?: {
    fileType: string;
    pageCount?: number;
    fileSize: number;
    extractedText?: string;
  };
}

interface ProcessingQueueItem {
  id: string;
  fileName: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

class QAAnalysisServiceNew {
  private processingQueue: Map<string, ProcessingQueueItem> = new Map();
  private analysisResults: Map<string, QAAnalysisResult> = new Map();

  async analyzeFile(
    filePath: string,
    fileName: string,
    analysisType: string,
    priority: string,
    patientId?: string,
    processingNotes?: string,
    aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' = 'gpt-4o'
  ): Promise<QAAnalysisResult> {
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add to processing queue
    const queueItem: ProcessingQueueItem = {
      id: analysisId,
      fileName,
      status: 'queued',
      progress: 0,
      startTime: new Date()
    };
    this.processingQueue.set(analysisId, queueItem);

    try {
      console.log('QA Service: Starting analysis for:', fileName);
      console.log('QA Service: File path:', filePath);
      console.log('QA Service: File exists:', fs.existsSync(filePath));

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Read file content
      const { content, fileInfo } = await this.readFileContent(filePath, fileName);
      queueItem.progress = 30;

      // Extract patient info with AI
      const patientInfo = await this.extractPatientInfoWithAI(content, fileName, aiModel);
      queueItem.progress = 50;

      // Perform analysis
      const analysisResult = await this.performAnalysis(content, analysisType, fileName, aiModel);
      queueItem.progress = 80;

      // Create final result
      const result: QAAnalysisResult = {
        id: analysisId,
        fileName,
        analysisType,
        priority,
        patientId,
        status: 'completed',
        results: analysisResult,
        processingNotes,
        createdAt: new Date(),
        completedAt: new Date(),
        patientInfo,
        fileInfo
      };

      // Store result
      this.analysisResults.set(analysisId, result);

      // Update queue
      queueItem.status = 'completed';
      queueItem.progress = 100;
      queueItem.endTime = new Date();

      console.log('QA Service: Analysis completed successfully');
      return result;

    } catch (error) {
      console.error('QA Service: Analysis failed:', error);
      
      // Update queue with error
      queueItem.status = 'error';
      queueItem.error = error instanceof Error ? error.message : 'Unknown error';
      queueItem.endTime = new Date();

      // Create error result
      const errorResult: QAAnalysisResult = {
        id: analysisId,
        fileName,
        analysisType,
        priority,
        patientId,
        status: 'error',
        results: {
          complianceScore: 0,
          issuesFound: ['Analysis failed'],
          recommendations: ['Manual review required'],
          riskLevel: 'high',
          summary: `Analysis failed for ${fileName}`,
          detailedAnalysis: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
        processingNotes,
        createdAt: new Date(),
        completedAt: new Date()
      };

      this.analysisResults.set(analysisId, errorResult);
      throw error;
    }
  }

  async analyzeFileFromBuffer(
    buffer: Buffer,
    fileName: string,
    analysisType: string,
    priority: string,
    patientId?: string,
    processingNotes?: string,
    aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' = 'gpt-4o'
  ): Promise<QAAnalysisResult> {
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add to processing queue
    const queueItem: ProcessingQueueItem = {
      id: analysisId,
      fileName,
      status: 'queued',
      progress: 0,
      startTime: new Date()
    };
    this.processingQueue.set(analysisId, queueItem);

    try {
      console.log('QA Service: Starting analysis for:', fileName);
      console.log('QA Service: Buffer size:', buffer.length, 'bytes');

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Read file content from buffer
      const { content, fileInfo } = await this.readFileContentFromBuffer(buffer, fileName);
      queueItem.progress = 30;

      // Extract patient info with AI
      const patientInfo = await this.extractPatientInfoWithAI(content, fileName, aiModel);
      queueItem.progress = 50;

      // Perform analysis
      const analysisResult = await this.performAnalysis(content, analysisType, fileName, aiModel);
      queueItem.progress = 80;

      // Create final result
      const result: QAAnalysisResult = {
        id: analysisId,
        fileName,
        analysisType,
        priority,
        patientId,
        status: 'completed',
        results: analysisResult,
        processingNotes,
        createdAt: new Date(),
        completedAt: new Date(),
        patientInfo,
        fileInfo
      };

      // Store result
      this.analysisResults.set(analysisId, result);

      // Update queue
      queueItem.status = 'completed';
      queueItem.progress = 100;
      queueItem.endTime = new Date();

      console.log('QA Service: Analysis completed successfully for:', fileName);
      return result;

    } catch (error) {
      console.error('QA Service: Analysis failed for:', fileName, error);
      
      // Update queue with error
      queueItem.status = 'error';
      queueItem.error = error instanceof Error ? error.message : 'Unknown error';
      queueItem.endTime = new Date();

      // Create error result
      const errorResult: QAAnalysisResult = {
        id: analysisId,
        fileName,
        analysisType,
        priority,
        patientId,
        status: 'error',
        results: {
          complianceScore: 0,
          issuesFound: ['Analysis failed'],
          recommendations: ['Manual review required'],
          riskLevel: 'high',
          summary: `Analysis failed for ${fileName}`,
          detailedAnalysis: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
        processingNotes,
        createdAt: new Date(),
        completedAt: new Date()
      };

      this.analysisResults.set(analysisId, errorResult);
      throw error;
    }
  }

  private async readFileContent(filePath: string, fileName: string): Promise<{ content: string; fileInfo?: any }> {
    console.log('QA Service: Reading file:', filePath);
    console.log('QA Service: File exists:', fs.existsSync(filePath));
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileExtension = path.extname(fileName).toLowerCase();
    const fileStats = fs.statSync(filePath);
    
    console.log('QA Service: File extension:', fileExtension);
    console.log('QA Service: File size:', fileStats.size);

    if (fileExtension === '.pdf') {
      console.log('QA Service: PDF processing not available in serverless environment');
      const content = `PDF Document: ${fileName} - PDF text extraction not available in serverless environment. Please convert to text format (.txt) for analysis.`;
      
      return {
        content,
        fileInfo: {
          fileType: 'pdf',
          pageCount: 1,
          fileSize: fileStats.size,
          extractedText: content.substring(0, 1000)
        }
      };
    } else if (fileExtension === '.txt') {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // No content truncation - send full document to AI
      console.log(`QA Service: Full text content length: ${content.length} chars`);
      
      console.log(`QA Service: Final text content length: ${content.length} chars`);
      
      return {
        content,
        fileInfo: {
          fileType: 'text',
          fileSize: fileStats.size
        }
      };
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  }

  private async readFileContentFromBuffer(buffer: Buffer, fileName: string): Promise<{ content: string; fileInfo?: any }> {
    console.log('QA Service: Reading file from buffer:', fileName);
    console.log('QA Service: Buffer size:', buffer.length, 'bytes');
    
    const fileExtension = path.extname(fileName).toLowerCase();
    
    if (fileExtension === '.pdf') {
      console.log('QA Service: PDF buffer size:', buffer.length);
      
      // PDF parsing is not available in serverless environments
      // Provide clear instructions for users to convert PDF to text
      const content = `PDF Document: ${fileName}
      
File Information:
- File Size: ${buffer.length} bytes
- Status: PDF text extraction not available in serverless environment

IMPORTANT: PDF text extraction is currently not available in our serverless deployment environment. However, you can still get full AI analysis by following these simple steps:

QUICK SOLUTION (2 minutes):
1. Open your PDF file in any PDF viewer (Adobe Reader, Chrome, etc.)
2. Select all text (Ctrl+A / Cmd+A)
3. Copy the text (Ctrl+C / Cmd+C)
4. Create a new text file (.txt) and paste the content
5. Upload the .txt file for full AI analysis

ALTERNATIVE SOLUTIONS:
- Use online PDF to text converters (PDF24, SmallPDF, etc.)
- Use built-in PDF text extraction tools
- Contact support for bulk PDF processing

BENEFITS OF TEXT FORMAT:
- Faster processing
- More reliable analysis
- Better AI accuracy
- No file size limitations

The AI analysis will work perfectly once you provide the text content. This is a temporary limitation while we implement a more robust PDF parsing solution for serverless environments.`;
      
      console.log('QA Service: PDF processing skipped, providing user instructions');
      console.log('QA Service: Content preview:', content.substring(0, 200));
      
      return {
        content,
        fileInfo: {
          fileType: 'pdf',
          pageCount: 1,
          fileSize: buffer.length,
          extractedText: content.substring(0, 1000)
        }
      };
    } else if (fileExtension === '.txt') {
      let content = buffer.toString('utf-8');
      
      // No content truncation - send full document to AI
      console.log(`QA Service: Full text content length: ${content.length} chars`);
      
      return {
        content,
        fileInfo: {
          fileType: 'txt',
          fileSize: buffer.length,
          extractedText: content.substring(0, 1000)
        }
      };
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  }

  private async extractPatientInfoWithAI(content: string, fileName: string, aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' = 'gpt-4o'): Promise<PatientInfo> {
    try {
      console.log('QA Service: Starting AI patient info extraction for:', fileName);
      console.log('QA Service: Content length:', content.length);
      console.log('QA Service: Content preview:', content.substring(0, 200));
      
      // Check if this is placeholder content (PDF parsing not available)
      if (content.includes('PDF text extraction not available') || content.includes('PDF parsing not available') || content.includes('PDF parsing failed') || content.includes('PDF parsing temporarily disabled')) {
        console.log('QA Service: Detected placeholder content, returning default patient info');
        return {
          patientName: 'Not available - PDF parsing not available',
          mrn: 'Not available - PDF parsing not available',
          visitType: 'Not available - PDF parsing not available',
          payor: 'Not available - PDF parsing not available',
          visitDate: 'Not available - PDF parsing not available',
          clinician: 'Not available - PDF parsing not available',
          payPeriod: 'Not available - PDF parsing not available',
          status: 'PDF_PARSING_NOT_AVAILABLE'
        };
      }
      
      const openaiService = OpenAIService.getInstance();
      const result = await openaiService.analyzePatientDocument(content, fileName, aiModel);
      
      const patientInfo: PatientInfo = {
        patientName: result.patientName || '',
        mrn: result.mrn || result.patientId || '',
        visitType: result.visitType || '',
        payor: result.payor || '',
        visitDate: result.visitDate || '',
        clinician: result.clinician || '',
        payPeriod: result.payPeriod || '',
        status: result.status || 'UNKNOWN'
      };
      
      console.log('QA Service: OpenAI extraction result:', patientInfo);
      return patientInfo;
    } catch (error) {
      console.error('QA Service: Error using AI for patient info extraction:', error);
      throw error;
    }
  }


  private async performAnalysis(
    content: string,
    analysisType: string,
    fileName: string,
    aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' = 'gpt-4o'
  ): Promise<QAAnalysisResult['results']> {
    try {
      console.log('QA Service: Starting OpenAI analysis...');
      console.log('QA Service: Content length for analysis:', content.length);
      console.log('QA Service: Environment check - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
      console.log('QA Service: Environment check - OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
      
      // Check if this is placeholder content (PDF parsing not available)
      if (content.includes('PDF text extraction not available') || content.includes('PDF parsing not available') || content.includes('PDF parsing failed') || content.includes('PDF parsing temporarily disabled')) {
        console.log('QA Service: Detected placeholder content, returning default analysis');
        return {
          complianceScore: 0,
          issuesFound: ['PDF parsing not available in serverless environment'],
          recommendations: ['Please convert PDF to text format (.txt) for analysis'],
          riskLevel: 'medium',
          summary: `PDF Analysis Not Available: ${fileName} - PDF parsing not available in serverless environment.`,
          detailedAnalysis: `
          PDF Analysis Report - Serverless Environment Limitation
          ======================================================
          
          File: ${fileName}
          Analysis Type: ${analysisType}
          Date: ${new Date().toLocaleDateString()}
          Status: PDF parsing not available
          
          LIMITATION:
          PDF text extraction is currently not available in our serverless deployment environment.
          This is a temporary limitation while we implement a more robust PDF parsing solution.
          
          QUICK SOLUTION:
          1. Open your PDF file in any PDF viewer (Adobe Reader, Chrome, etc.)
          2. Select all text (Ctrl+A / Cmd+A)
          3. Copy the text (Ctrl+C / Cmd+C)
          4. Create a new text file (.txt) and paste the content
          5. Upload the .txt file for full AI analysis
          
          RECOMMENDATION:
          Please convert your PDF file to text format (.txt) and upload again for full AI analysis.
          The AI analysis will work perfectly once you provide the text content.
          
          File Size: ${content.match(/\d+ bytes/)?.[0] || 'Unknown'}
          `
        };
      }
      
      // Use GPT-4o for better analysis quality
      const modelToUse = aiModel;
      console.log('QA Service: Using model:', modelToUse, '(original:', aiModel, ')');
      
      const openaiService = OpenAIService.getInstance();
      console.log('QA Service: OpenAI service instance obtained');
      
      const result = await openaiService.analyzePatientDocument(content, fileName, modelToUse);
      console.log('QA Service: OpenAI analysis completed successfully');

      return {
        complianceScore: result.confidence ? Math.round(result.confidence * 100) : 85,
        issuesFound: result.complianceIssues || ['No major issues detected'],
        recommendations: result.recommendations || ['Continue current care plan'],
        riskLevel: this.mapRiskLevel(result.riskLevel),
        summary: `OpenAI Analysis of ${fileName}: ${result.status} status, ${result.riskLevel} risk level.`,
        detailedAnalysis: `
        OpenAI Quality Assurance Analysis Report
        ========================================
        
        File: ${fileName}
        Analysis Type: ${analysisType}
        Date: ${new Date().toLocaleDateString()}
        AI Model: ${modelToUse}${modelToUse !== aiModel ? ` (auto-selected due to content size, original: ${aiModel})` : ''}
        
        PATIENT INFORMATION:
        - Name: ${result.patientName || 'Not identified'}
        - MRN: ${result.mrn || result.patientId || 'Not identified'}
        - Visit Type: ${result.visitType || 'Not identified'}
        - Payor: ${result.payor || 'Not identified'}
        - Visit Date: ${result.visitDate || 'Not identified'}
        - Clinician: ${result.clinician || 'Not identified'}
        - Pay Period: ${result.payPeriod || 'Not identified'}
        - Status: ${result.status || 'Unknown'}
        
        COMPLIANCE SCORE: ${result.confidence ? Math.round(result.confidence * 100) : 85}%
        RISK LEVEL: ${result.riskLevel?.toUpperCase() || 'MEDIUM'}
        
        ISSUES IDENTIFIED:
        ${result.complianceIssues?.map((issue, index) => `${index + 1}. ${issue}`).join('\n') || '1. No major issues detected'}
        
        RECOMMENDATIONS:
        ${result.recommendations?.map((rec, index) => `${index + 1}. ${rec}`).join('\n') || '1. Continue current care plan'}
        
        DETAILED FINDINGS:
        - AI Model: ${modelToUse}${modelToUse !== aiModel ? ` (auto-selected due to content size, original: ${aiModel})` : ''}
        - Analysis Confidence: ${result.confidence ? Math.round(result.confidence * 100) : 85}%
        - Content Length: ${content.length} characters
        - Extracted Data: ${JSON.stringify(result.extractedData, null, 2)}
        - Timestamp: ${result.timestamp}
        `,
        extractedData: result.extractedData // Store extractedData separately
      };
    } catch (error) {
      console.error('QA Service: OpenAI analysis failed:', error);
      console.error('QA Service: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        environment: {
          hasApiKey: !!process.env.OPENAI_API_KEY,
          apiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
          nodeEnv: process.env.NODE_ENV
        }
      });
      throw error;
    }
  }

  private mapRiskLevel(riskLevel?: string): 'low' | 'medium' | 'high' | 'critical' {
    if (!riskLevel) return 'medium';

    const level = riskLevel.toLowerCase();
    if (level === 'low') return 'low';
    if (level === 'medium') return 'medium';
    if (level === 'high') return 'high';
    if (level === 'critical') return 'critical';

    if (level.includes('low')) return 'low';
    if (level.includes('high') || level.includes('critical')) return 'high';
    return 'medium';
  }

  getProcessingQueue(): ProcessingQueueItem[] {
    return Array.from(this.processingQueue.values());
  }

  getAllAnalysisResults(): QAAnalysisResult[] {
    return Array.from(this.analysisResults.values());
  }

  getAnalysisResult(id: string): QAAnalysisResult | undefined {
    return this.analysisResults.get(id);
  }
}

export const qaAnalysisServiceNew = new QAAnalysisServiceNew();
