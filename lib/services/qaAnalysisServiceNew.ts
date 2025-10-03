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
  processingTime?: string;
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
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<QAAnalysisResult> {
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const analysisStartTime = new Date();
    
    // Add to processing queue
    const queueItem: ProcessingQueueItem = {
      id: analysisId,
      fileName,
      status: 'queued',
      progress: 0,
      startTime: analysisStartTime
    };
    this.processingQueue.set(analysisId, queueItem);

    try {
      console.log('QA Service: Starting analysis for:', fileName);
      console.log('QA Service: Analysis start time:', analysisStartTime.toISOString());
      console.log('QA Service: File path:', filePath);
      console.log('QA Service: File exists:', fs.existsSync(filePath));

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Read file content
      const { content, fileInfo } = await this.readFileContent(filePath, fileName);
      queueItem.progress = 30;

      // Perform single comprehensive analysis (includes patient info extraction)
      const analysisResult = await this.performAnalysis(content, analysisType, fileName, aiModel);
      queueItem.progress = 80;

      // Calculate processing time
      const analysisEndTime = new Date();
      const processingTimeMs = analysisEndTime.getTime() - analysisStartTime.getTime();
      const processingTimeSeconds = Math.round(processingTimeMs / 1000);
      const processingTimeFormatted = processingTimeSeconds < 60 
        ? `${processingTimeSeconds}s` 
        : `${Math.floor(processingTimeSeconds / 60)}m ${processingTimeSeconds % 60}s`;

      console.log('QA Service: Analysis completed in:', processingTimeFormatted);

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
        createdAt: analysisStartTime,
        completedAt: analysisEndTime,
        processingTime: processingTimeFormatted,
        patientInfo: {
          patientName: analysisResult.patientName,
          mrn: analysisResult.mrn,
          visitType: analysisResult.visitType,
          payor: analysisResult.payor,
          visitDate: analysisResult.visitDate,
          clinician: analysisResult.clinician,
          payPeriod: analysisResult.payPeriod,
          status: analysisResult.status
        },
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
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<QAAnalysisResult> {
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const analysisStartTime = new Date();
    
    // Add to processing queue
    const queueItem: ProcessingQueueItem = {
      id: analysisId,
      fileName,
      status: 'queued',
      progress: 0,
      startTime: analysisStartTime
    };
    this.processingQueue.set(analysisId, queueItem);

    try {
      console.log('QA Service: Starting analysis for:', fileName);
      console.log('QA Service: Analysis start time:', analysisStartTime.toISOString());
      console.log('QA Service: Buffer size:', buffer.length, 'bytes');

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Read file content from buffer
      const { content, fileInfo } = await this.readFileContentFromBuffer(buffer, fileName);
      queueItem.progress = 30;

      // Perform single comprehensive analysis (includes patient info extraction)
      const analysisResult = await this.performAnalysis(content, analysisType, fileName, aiModel);
      queueItem.progress = 80;

      // Calculate processing time
      const analysisEndTime = new Date();
      const processingTimeMs = analysisEndTime.getTime() - analysisStartTime.getTime();
      const processingTimeSeconds = Math.round(processingTimeMs / 1000);
      const processingTimeFormatted = processingTimeSeconds < 60 
        ? `${processingTimeSeconds}s` 
        : `${Math.floor(processingTimeSeconds / 60)}m ${processingTimeSeconds % 60}s`;

      console.log('QA Service: Analysis completed in:', processingTimeFormatted);

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
        createdAt: analysisStartTime,
        completedAt: analysisEndTime,
        processingTime: processingTimeFormatted,
        patientInfo: {
          patientName: analysisResult.patientName,
          mrn: analysisResult.mrn,
          visitType: analysisResult.visitType,
          payor: analysisResult.payor,
          visitDate: analysisResult.visitDate,
          clinician: analysisResult.clinician,
          payPeriod: analysisResult.payPeriod,
          status: analysisResult.status
        },
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
      console.log('QA Service: PDF processing requires API key configuration');
      throw new Error('PDF processing requires PDF.co API key to be configured in environment variables');
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
      
      try {
        // Try to extract text from PDF using API
        const extractedText = await this.extractPDFTextWithAPI(buffer);
        
        console.log('QA Service: PDF text extraction successful');
        console.log('QA Service: Extracted text length:', extractedText.length);
        
        // Check if the extracted text is too large
        const estimatedTokens = Math.ceil(extractedText.length / 4);
        console.log('QA Service: Estimated tokens:', estimatedTokens);
        
        if (estimatedTokens > 500000) {
          // For very large PDFs, provide a message about size limitations
          const content = `PDF Document: ${fileName}
          
File Information:
- File Size: ${buffer.length} bytes
- Extracted Text Length: ${extractedText.length} characters
- Estimated Tokens: ${estimatedTokens}
- Status: File too large for AI analysis

This PDF file is too large for AI analysis. Please try one of the following:

1. Compress the PDF file to reduce size
2. Split the PDF into smaller sections
3. Use a PDF to text converter online

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
        
            // Truncate content if too large to prevent connection errors
            let contentToSend = extractedText;
            if (extractedText.length > 100000) { // 100K characters = ~25K tokens
              console.log('QA Service: Content too large, truncating to prevent connection errors');
              contentToSend = extractedText.substring(0, 100000) + '\n\n[Content truncated due to size - showing first 100,000 characters]';
            }

            // Send extracted text to AI for analysis
            const content = `PDF Document Analysis Request

File Information:
- File Name: ${fileName}
- File Size: ${buffer.length} bytes
- Extracted Text Length: ${extractedText.length} characters
- Content Sent: ${contentToSend.length} characters
- Estimated Tokens: ${Math.ceil(contentToSend.length / 4)}
- Format: PDF (Text extracted)

Please analyze this PDF document and extract all relevant patient information, diagnoses, and quality assurance data. The PDF text content has been extracted for analysis.

PDF Text Content:
${contentToSend}

Please provide a comprehensive analysis including:
1. Patient information (name, MRN, visit type, etc.)
2. All diagnoses and ICD codes
3. Quality assurance findings
4. Compliance issues
5. Recommendations

Note: This PDF text has been extracted for accurate analysis of the document content.`;
            
            console.log('QA Service: PDF text content preview (first 1000 chars):', extractedText.substring(0, 1000));
            console.log('QA Service: PDF text content preview (last 1000 chars):', extractedText.substring(Math.max(0, extractedText.length - 1000)));
        
        console.log('QA Service: PDF text sent to AI for analysis');
        
        return {
          content,
          fileInfo: {
            fileType: 'pdf',
            pageCount: 1, // ILovePDF doesn't return page count
            fileSize: buffer.length,
            extractedText: extractedText.substring(0, 1000)
          }
        };
        
      } catch (error) {
        console.error('QA Service: PDF text extraction failed:', error);
        
        // No fallback - throw error if PDF extraction fails
        throw new Error(`PDF text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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

  private async extractPatientInfoWithAI(content: string, fileName: string, aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-5-nano' = 'gpt-5-nano'): Promise<PatientInfo> {
    try {
      console.log('QA Service: Starting AI patient info extraction for:', fileName);
      console.log('QA Service: Content length:', content.length);
      console.log('QA Service: Content preview:', content.substring(0, 200));
      
      // No fallback - only work with real extracted text
      console.log('QA Service: Processing extracted text for patient information');
      
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
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<any> {
    try {
      console.log('QA Service: Starting OpenAI analysis...');
      console.log('QA Service: Analysis type:', analysisType);
      console.log('QA Service: Content length for analysis:', content.length);
      console.log('QA Service: Environment check - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
      console.log('QA Service: Environment check - OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
      
      // Route to appropriate analysis service based on analysisType
      if (analysisType === 'coding-review') {
        console.log('QA Service: Routing to Coding Analysis Service');
        const { codingAnalysisService } = await import('./codingAnalysisService');
        // For coding review, we need to create a temporary file or handle differently
        // Since we already have the content, we'll pass it directly to the coding service
        const CodingReviewService = (await import('./codingReviewService')).default;
        const codingService = new CodingReviewService();
        const result = await codingService.analyzeCodingReview(content, fileName);
        
        // Return early with coding review result
        return {
          ...result,
          // Map coding review specific fields to common interface
          aiConfidence: result.summary?.complianceScore || 85,
          issuesFound: result.summary?.totalIssues || 0,
          riskLevel: result.summary?.riskLevel?.toUpperCase() || 'MEDIUM'
        };
      }
      
      // Default to QA Review analysis
      console.log('QA Service: Processing extracted text for quality analysis');
      
      // Use GPT-5-nano for highest token limits (200K TPM) and better PDF handling
      const modelToUse = 'gpt-5-nano';
      console.log('QA Service: Using model:', modelToUse, '(original:', aiModel, ')');
      
      const openaiService = OpenAIService.getInstance();
      console.log('QA Service: OpenAI service instance obtained');
      
      const result = await openaiService.analyzePatientDocument(content, fileName, modelToUse);
      
      console.log('QA Service: Analysis completed successfully');

      // Calculate enhanced AI confidence
      const enhancedConfidence = this.calculateEnhancedConfidence(result, content);
      
      // For QA review, use the existing mapping
      const qaResult = result as any; // Type assertion for QA review result
      return {
        // Patient information
        patientName: qaResult.patientName,
        patientId: qaResult.patientId,
        mrn: qaResult.mrn,
        visitType: qaResult.visitType,
        payor: qaResult.payor,
        visitDate: qaResult.visitDate,
        clinician: qaResult.clinician,
        payPeriod: qaResult.payPeriod,
        status: qaResult.status,
        riskLevel: qaResult.riskLevel,
        complianceIssues: qaResult.complianceIssues,
        recommendations: qaResult.recommendations,
        extractedData: qaResult.extractedData,
        detailedAnalysis: qaResult.detailedAnalysis,
        detailedAnalysisCleaned: qaResult.detailedAnalysisCleaned,
        confidence: enhancedConfidence,
        // Legacy fields for backward compatibility
        issuesFound: qaResult.complianceIssues || ['No major issues detected'],
        summary: `OpenAI Analysis of ${fileName}: ${qaResult.status} status, ${qaResult.riskLevel} risk level.`
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

  private async extractPDFTextWithAPI(buffer: Buffer): Promise<string> {
    try {
      console.log('QA Service: Starting PDF text extraction with API');
      
      // Convert buffer to base64
      const base64PDF = buffer.toString('base64');
      
      // Try PDF.co API first (more reliable)
      console.log('QA Service: Checking PDF.co API key...');
      console.log('QA Service: PDF_CO_API_KEY exists:', !!process.env.PDF_CO_API_KEY);
      console.log('QA Service: PDF_CO_API_KEY length:', process.env.PDF_CO_API_KEY?.length || 0);
      console.log('QA Service: PDF_CO_API_KEY preview:', process.env.PDF_CO_API_KEY?.substring(0, 20) + '...' || 'Not found');
      
      if (process.env.PDF_CO_API_KEY) {
        console.log('QA Service: Trying PDF.co API');
        
        // Step 1: Upload file to PDF.co
        const uploadResponse = await fetch('https://api.pdf.co/v1/file/upload/base64', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.PDF_CO_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            file: base64PDF,
            name: 'document.pdf'
          })
        });
        
        console.log('QA Service: PDF.co upload response status:', uploadResponse.status);
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log('QA Service: PDF.co upload result:', JSON.stringify(uploadResult, null, 2));
          
          if (uploadResult.url) {
            // Step 2: Convert uploaded file to text
            const convertResponse = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
              method: 'POST',
              headers: {
                'x-api-key': process.env.PDF_CO_API_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                url: uploadResult.url,
                pages: '0-', // Process all pages
                async: false // Synchronous processing
              })
            });
            
            console.log('QA Service: PDF.co convert response status:', convertResponse.status);
            
            if (convertResponse.ok) {
              const convertResult = await convertResponse.json();
              console.log('QA Service: PDF.co convert result:', JSON.stringify(convertResult, null, 2));
              
              if (convertResult.url) {
                // Step 3: Download the extracted text
                console.log('QA Service: Downloading extracted text from:', convertResult.url);
                const downloadResponse = await fetch(convertResult.url);
                
                if (downloadResponse.ok) {
                  const extractedText = await downloadResponse.text();
                  console.log('QA Service: PDF.co text extraction successful');
                  console.log('QA Service: Extracted text length:', extractedText.length);
                  return extractedText;
                } else {
                  console.error('QA Service: Failed to download extracted text');
                }
              }
            } else {
              const errorText = await convertResponse.text();
              console.error('QA Service: PDF.co convert error response:', errorText);
            }
          }
        } else {
          const errorText = await uploadResponse.text();
          console.error('QA Service: PDF.co upload error response:', errorText);
        }
        console.log('QA Service: PDF.co API failed');
      } else {
        console.log('QA Service: PDF.co API key not found, skipping API extraction');
      }
      
      throw new Error('PDF.co API not available - PDF text extraction requires API key configuration');
      
    } catch (error) {
      console.error('QA Service: PDF text extraction failed:', error);
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

  private calculateEnhancedConfidence(result: any, content: string): number {
    try {
      // 1. Data Completeness (35%)
      const dataCompleteness = this.calculateDataCompleteness(result);
      
      // 2. Analysis Quality (30%)
      const analysisQuality = this.calculateAnalysisQuality(result);
      
      // 3. Content Reliability (20%)
      const contentReliability = this.calculateContentReliability(result, content);
      
      // 4. AI Raw Confidence (15%)
      const aiRawConfidence = result.confidence || 0.5;
      
      // Calculate weighted average
      const enhancedConfidence = (
        dataCompleteness * 0.35 +
        analysisQuality * 0.30 +
        contentReliability * 0.20 +
        aiRawConfidence * 0.15
      );
      
      // Ensure confidence is between 0 and 1
      return Math.max(0, Math.min(1, enhancedConfidence));
    } catch (error) {
      console.error('QA Service: Error calculating enhanced confidence:', error);
      return result.confidence || 0.5;
    }
  }

  private calculateDataCompleteness(result: any): number {
    const requiredFields = [
      'patientName', 'mrn', 'visitType', 'payor', 'visitDate', 'clinician'
    ];
    
    const clinicalFields = [
      'complianceIssues', 'recommendations', 'extractedData'
    ];
    
    let foundFields = 0;
    let totalFields = requiredFields.length + clinicalFields.length;
    
    // Check required fields
    requiredFields.forEach(field => {
      if (result[field] && result[field] !== 'N/A' && result[field] !== 'Unknown') {
        foundFields++;
      }
    });
    
    // Check clinical fields
    clinicalFields.forEach(field => {
      if (result[field] && (
        (Array.isArray(result[field]) && result[field].length > 0) ||
        (typeof result[field] === 'object' && Object.keys(result[field]).length > 0) ||
        (typeof result[field] === 'string' && result[field].length > 0)
      )) {
        foundFields++;
      }
    });
    
    return foundFields / totalFields;
  }

  private calculateAnalysisQuality(result: any): number {
    let qualityScore = 0.5; // Base score
    
    // Check for detailed analysis
    if (result.detailedAnalysis && result.detailedAnalysis.length > 500) {
      qualityScore += 0.2;
    }
    
    // Check for compliance issues analysis
    if (result.complianceIssues && Array.isArray(result.complianceIssues) && result.complianceIssues.length > 0) {
      qualityScore += 0.15;
    }
    
    // Check for recommendations
    if (result.recommendations && Array.isArray(result.recommendations) && result.recommendations.length > 0) {
      qualityScore += 0.15;
    }
    
    // Check for extracted data completeness
    if (result.extractedData && typeof result.extractedData === 'object') {
      const extractedKeys = Object.keys(result.extractedData);
      if (extractedKeys.length >= 3) {
        qualityScore += 0.1;
      }
    }
    
    return Math.min(1, qualityScore);
  }

  private calculateContentReliability(result: any, content: string): number {
    let reliabilityScore = 0.5; // Base score
    
    // Check for medical terminology
    const medicalTerms = ['diagnosis', 'ICD-10', 'OASIS', 'M1800', 'M1810', 'clinical', 'assessment'];
    const contentLower = content.toLowerCase();
    const foundTerms = medicalTerms.filter(term => contentLower.includes(term.toLowerCase()));
    
    if (foundTerms.length >= 3) {
      reliabilityScore += 0.2;
    }
    
    // Check for OASIS compliance
    if (result.complianceIssues && Array.isArray(result.complianceIssues)) {
      const oasisIssues = result.complianceIssues.filter((issue: any) => {
        // Handle both string and object formats
        const issueText = typeof issue === 'string' ? issue : 
                         (issue.item || issue.description || issue.regulation || JSON.stringify(issue));
        return issueText && (issueText.includes('M-') || issueText.includes('OASIS'));
      });
      if (oasisIssues.length > 0) {
        reliabilityScore += 0.15;
      }
    }
    
    // Check for logical consistency (basic check)
    if (result.riskLevel && result.complianceIssues) {
      const issueCount = result.complianceIssues.length;
      const riskLevel = result.riskLevel.toLowerCase();
      
      // Basic logic: more issues should correlate with higher risk
      if ((riskLevel === 'high' && issueCount >= 3) || 
          (riskLevel === 'medium' && issueCount >= 1) ||
          (riskLevel === 'low' && issueCount <= 2)) {
        reliabilityScore += 0.15;
      }
    }
    
    return Math.min(1, reliabilityScore);
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
