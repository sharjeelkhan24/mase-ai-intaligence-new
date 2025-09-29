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
      
      // Convert PDF buffer to base64 for AI analysis
      const base64Content = buffer.toString('base64');
      
      // Check if the content is too large (estimate ~4 chars per token)
      const estimatedTokens = Math.ceil(base64Content.length / 4);
      console.log('QA Service: Estimated tokens:', estimatedTokens);
      
      if (estimatedTokens > 500000) {
        // For very large PDFs, provide a message about size limitations
        const content = `PDF Document: ${fileName}
        
File Information:
- File Size: ${buffer.length} bytes
- Estimated Tokens: ${estimatedTokens}
- Status: File too large for direct AI analysis

This PDF file is too large for direct AI analysis. Please try one of the following:

1. Compress the PDF file to reduce size
2. Extract text content and upload as .txt file
3. Split the PDF into smaller sections
4. Use a PDF to text converter online

For files under 500MB, the AI can analyze the PDF directly.`;
        
        return {
          content,
          fileInfo: {
            fileType: 'pdf',
            pageCount: 1,
            fileSize: buffer.length,
            extractedText: `PDF too large for analysis (${estimatedTokens} estimated tokens)`
          }
        };
      }
      
      // Send full PDF content to GPT-5-nano for complete analysis
      const content = `PDF Document Analysis Request

File Information:
- File Name: ${fileName}
- File Size: ${buffer.length} bytes
- Estimated Tokens: ${estimatedTokens}
- Format: PDF (Base64 encoded)

Please analyze this PDF document and extract all relevant patient information, diagnoses, and quality assurance data. The PDF content has been provided in base64 format for direct analysis.

Base64 PDF Content:
${base64Content}

Please provide a comprehensive analysis including:
1. Patient information (name, MRN, visit type, etc.)
2. All diagnoses and ICD codes
3. Quality assurance findings
4. Compliance issues
5. Recommendations

Note: This PDF is being analyzed directly without text extraction, allowing for more accurate analysis of the original document format.`;
      
      console.log('QA Service: PDF sent directly to AI for analysis');
      console.log('QA Service: Base64 content length:', base64Content.length);
      
      return {
        content,
        fileInfo: {
          fileType: 'pdf',
          pageCount: 1,
          fileSize: buffer.length,
          extractedText: `PDF sent directly to AI for analysis (${buffer.length} bytes)`
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
      
      // Check if this is a "too large" PDF message
      if (content.includes('File too large for direct AI analysis')) {
        console.log('QA Service: Detected large PDF, returning default patient info');
        return {
          patientName: 'Not available - PDF too large',
          mrn: 'Not available - PDF too large',
          visitType: 'Not available - PDF too large',
          payor: 'Not available - PDF too large',
          visitDate: 'Not available - PDF too large',
          clinician: 'Not available - PDF too large',
          payPeriod: 'Not available - PDF too large',
          status: 'PDF_TOO_LARGE'
        };
      }
      
      const openaiService = OpenAIService.getInstance();
      const result = await openaiService.analyzePatientDocument(content, fileName, 'gpt-5-nano');
      
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
      
      // Check if this is a "too large" PDF message
      if (content.includes('File too large for direct AI analysis')) {
        console.log('QA Service: Detected large PDF, returning default analysis');
        return {
          complianceScore: 0,
          issuesFound: ['PDF file too large for AI analysis'],
          recommendations: ['Please compress the PDF or extract text content'],
          riskLevel: 'medium',
          summary: `PDF Analysis Not Available: ${fileName} - File too large for direct AI analysis.`,
          detailedAnalysis: `
          PDF Analysis Report - File Size Limitation
          ==========================================
          
          File: ${fileName}
          Analysis Type: ${analysisType}
          Date: ${new Date().toLocaleDateString()}
          Status: File too large for analysis
          
          LIMITATION:
          This PDF file exceeds the token limit for direct AI analysis.
          The file is too large to process in a single request.
          
          RECOMMENDATIONS:
          1. Compress the PDF file to reduce size
          2. Extract text content and upload as .txt file
          3. Split the PDF into smaller sections
          4. Use a PDF to text converter online
          
          File Size: ${content.match(/\d+ bytes/)?.[0] || 'Unknown'}
          Estimated Tokens: ${content.match(/\d+ estimated tokens/)?.[0] || 'Unknown'}
          `
        };
      }
      
      // Use GPT-5-nano for highest token limits (200K TPM) and better PDF handling
      const modelToUse = 'gpt-5-nano';
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
        AI Model: ${modelToUse}
        
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
        - AI Model: ${modelToUse}
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
