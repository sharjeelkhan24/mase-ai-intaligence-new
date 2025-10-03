import FinancialOptimizationReviewService, { FinancialOptimizationResult as FinancialOptimizationReviewResult } from './financialOptimizationReviewService';

export interface FinancialOptimizationResult {
  analysisId: string;
  fileName: string;
  analysisType: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'error';
  priority: string;
  patientId?: string;
  processingNotes?: string;
  aiModel: 'gpt-5-nano';
  processedData: any;
  results: FinancialOptimizationReviewResult;
  confidence?: number;
  processingTime: string;
  timestamp: string;
  error?: string;
}

interface ProcessingQueueItem {
  id: string;
  fileName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

class FinancialOptimizationService {
  private processingQueue: Map<string, ProcessingQueueItem> = new Map();
  private analysisResults: Map<string, FinancialOptimizationResult> = new Map();
  private financialOptReviewService: FinancialOptimizationReviewService;

  constructor() {
    this.financialOptReviewService = new FinancialOptimizationReviewService();
  }

  async analyzeFile(
    filePath: string,
    analysisType: string = 'financial-optimization',
    priority: string = 'medium',
    patientId?: string,
    processingNotes?: string,
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<FinancialOptimizationResult> {
    const analysisId = `financial_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const analysisStartTime = new Date();
    
    // Add to processing queue
    const queueItem: ProcessingQueueItem = {
      id: analysisId,
      fileName: filePath.split('/').pop() || filePath,
      status: 'queued',
      progress: 0,
      startTime: analysisStartTime
    };
    this.processingQueue.set(analysisId, queueItem);

    try {
      console.log('Financial Optimization Service: Starting analysis for:', filePath);
      console.log('Financial Optimization Service: Analysis start time:', analysisStartTime.toISOString());

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Extract text from PDF using PDF.co API
      const fileContent = await this.extractTextFromPDF(filePath);
      queueItem.progress = 30;

      // Perform financial optimization analysis
      const analysisResult = await this.financialOptReviewService.analyzeFinancialOptimization(fileContent, filePath.split('/').pop() || filePath);
      queueItem.progress = 80;

      // Calculate processing time
      const analysisEndTime = new Date();
      const processingTimeMs = analysisEndTime.getTime() - analysisStartTime.getTime();
      const processingTimeSeconds = Math.round(processingTimeMs / 1000);
      const processingTimeFormatted = processingTimeSeconds < 60 
        ? `${processingTimeSeconds}s` 
        : `${Math.floor(processingTimeSeconds / 60)}m ${processingTimeSeconds % 60}s`;

      console.log('Financial Optimization Service: Analysis completed in:', processingTimeFormatted);

      // Update queue item
      queueItem.status = 'completed';
      queueItem.progress = 100;
      queueItem.endTime = analysisEndTime;

      const result: FinancialOptimizationResult = {
        analysisId,
        fileName: filePath.split('/').pop() || filePath,
        analysisType,
        status: 'completed',
        priority,
        patientId: patientId || '',
        processingNotes: processingNotes || '',
        aiModel,
        processedData: {
          filePath,
          content: fileContent,
          size: fileContent.length
        },
        results: analysisResult,
        confidence: analysisResult.confidence,
        processingTime: processingTimeFormatted,
        timestamp: new Date().toISOString()
      };

      // Store result for retrieval
      this.analysisResults.set(analysisId, result);

      console.log('Financial Optimization Service: Analysis completed successfully');
      return result;

    } catch (error) {
      console.error('Financial Optimization Service: Analysis failed:', error);
      
      queueItem.status = 'failed';
      queueItem.progress = 100;
      queueItem.endTime = new Date();
      queueItem.error = error instanceof Error ? error.message : 'Unknown error occurred';

      const errorResult: FinancialOptimizationResult = {
        analysisId,
        fileName: filePath.split('/').pop() || filePath,
        analysisType,
        status: 'error',
        priority,
        patientId: patientId || '',
        processingNotes: processingNotes || '',
        aiModel,
        processedData: null,
        results: null as any,
        processingTime: 'Analysis failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };

      throw errorResult;
    }
  }

  async analyzeFileFromBuffer(
    buffer: Buffer,
    fileName: string,
    analysisType: string = 'financial-optimization',
    priority: string = 'medium',
    patientId?: string,
    processingNotes?: string,
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<FinancialOptimizationResult> {
    const analysisId = `financial_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      console.log('Financial Optimization Service: Starting analysis for:', fileName);
      console.log('Financial Optimization Service: Analysis start time:', analysisStartTime.toISOString());
      console.log('Financial Optimization Service: Buffer size:', buffer.length, 'bytes');

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Extract text from PDF using PDF.co API
      const content = await this.extractTextFromPDFBuffer(buffer, fileName);
      queueItem.progress = 30;

      // Perform financial optimization analysis
      const analysisResult: FinancialOptimizationReviewResult = await this.financialOptReviewService.analyzeFinancialOptimization(content, fileName);
      console.log('Financial Optimization Service: Analysis result analysisType:', analysisResult.analysisType);
      queueItem.progress = 80;

      // Calculate processing time
      const analysisEndTime = new Date();
      const processingTimeMs = analysisEndTime.getTime() - analysisStartTime.getTime();
      const processingTimeSeconds = Math.round(processingTimeMs / 1000);
      const processingTimeFormatted = processingTimeSeconds < 60 
        ? `${processingTimeSeconds}s` 
        : `${Math.floor(processingTimeSeconds / 60)}m ${processingTimeSeconds % 60}s`;

      console.log('Financial Optimization Service: Analysis completed in:', processingTimeFormatted);

      // Update queue item
      queueItem.status = 'completed';
      queueItem.progress = 100;
      queueItem.endTime = analysisEndTime;

      const result: FinancialOptimizationResult = {
        analysisId,
        fileName,
        analysisType,
        status: 'completed',
        priority,
        patientId: patientId || '',
        processingNotes: processingNotes || '',
        aiModel,
        processedData: {
          fileName,
          content,
          size: buffer.length
        },
        results: analysisResult,
        confidence: analysisResult.confidence,
        processingTime: processingTimeFormatted,
        timestamp: new Date().toISOString()
      };

      // Store result for retrieval
      this.analysisResults.set(analysisId, result);

      console.log('Financial Optimization Service: Final result analysisType:', result.analysisType);
      console.log('Financial Optimization Service: Analysis completed successfully');
      return result;

    } catch (error) {
      console.error('Financial Optimization Service: Analysis failed:', error);
      
      queueItem.status = 'failed';
      queueItem.progress = 100;
      queueItem.endTime = new Date();
      queueItem.error = error instanceof Error ? error.message : 'Unknown error occurred';

      const errorResult: FinancialOptimizationResult = {
        analysisId,
        fileName,
        analysisType,
        status: 'error',
        priority,
        patientId: patientId || '',
        processingNotes: processingNotes || '',
        aiModel,
        processedData: null,
        results: null as any,
        processingTime: 'Analysis failed',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };

      throw errorResult;
    }
  }

  private async readFileContentFromBuffer(buffer: Buffer, fileName: string): Promise<{ content: string; fileInfo: any }> {
    try {
      // Handle different file types
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'pdf') {
        // Use PDF parsing logic similar to other services
        const pdf = require('pdf-parse');
        const pdfData = await pdf(buffer);
        return {
          content: pdfData.text,
          fileInfo: {
            type: 'pdf',
            pages: pdfData.numpages,
            info: pdfData.info
          }
        };
      } else {
        // Assume it's a text file
        const content = buffer.toString('utf-8');
        return {
          content,
          fileInfo: {
            type: 'text',
            encoding: 'utf-8'
          }
        };
      }
    } catch (error) {
      console.error('Financial Optimization Service: Error reading file content:', error);
      // Fallback to buffer as string
      return {
        content: buffer.toString('utf-8'),
        fileInfo: {
          type: 'text',
          encoding: 'utf-8',
          error: 'Failed to determine file type'
        }
      };
    }
  }

  getProcessingStatus(analysisId: string): ProcessingQueueItem | null {
    return this.processingQueue.get(analysisId) || null;
  }

  getAllProcessingItems(): ProcessingQueueItem[] {
    return Array.from(this.processingQueue.values());
  }

  removeProcessingItem(analysisId: string): boolean {
    return this.processingQueue.delete(analysisId);
  }

  getAllAnalysisResults(): FinancialOptimizationResult[] {
    return Array.from(this.analysisResults.values());
  }

  getAnalysisResult(analysisId: string): FinancialOptimizationResult | undefined {
    return this.analysisResults.get(analysisId);
  }

  /**
   * Extract text from PDF using PDF.co API
   */
  private async extractTextFromPDF(filePath: string): Promise<string> {
    console.log('Financial Optimization Service: Extracting text from PDF using PDF.co');
    
    try {
      // Read the PDF file as buffer
      const fs = require('fs').promises;
      const pdfBuffer = await fs.readFile(filePath);
      const base64PDF = pdfBuffer.toString('base64');
      
      console.log('Financial Optimization Service: PDF buffer size:', pdfBuffer.length, 'bytes');
      
      if (process.env.PDF_CO_API_KEY) {
        console.log('Financial Optimization Service: Trying PDF.co API');
        
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

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log('Financial Optimization Service: PDF.co upload result:', JSON.stringify(uploadResult, null, 2));
          
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

            if (convertResponse.ok) {
              const convertResult = await convertResponse.json();
              console.log('Financial Optimization Service: PDF.co convert result:', JSON.stringify(convertResult, null, 2));
              
              if (convertResult.url) {
                // Step 3: Download the extracted text
                console.log('Financial Optimization Service: Downloading extracted text from:', convertResult.url);
                const downloadResponse = await fetch(convertResult.url);
                
                if (downloadResponse.ok) {
                  const extractedText = await downloadResponse.text();
                  console.log('Financial Optimization Service: PDF.co text extraction successful');
                  console.log('Financial Optimization Service: Extracted text length:', extractedText.length);
                  return extractedText;
                } else {
                  console.error('Financial Optimization Service: Failed to download extracted text');
                  throw new Error('Failed to download extracted text from PDF.co');
                }
              } else {
                throw new Error('PDF.co conversion did not return download URL');
              }
            } else {
              const errorText = await convertResponse.text();
              console.error('Financial Optimization Service: PDF.co conversion failed:', convertResponse.status, errorText);
              throw new Error(`PDF.co conversion failed: ${convertResponse.status} ${errorText}`);
            }
          } else {
            throw new Error('PDF.co upload did not return URL');
          }
        } else {
          const errorText = await uploadResponse.text();
          console.error('Financial Optimization Service: PDF.co upload failed:', uploadResponse.status, errorText);
          throw new Error(`PDF.co upload failed: ${uploadResponse.status} ${errorText}`);
        }
      } else {
        console.log('Financial Optimization Service: PDF_CO_API_KEY not found, falling back to basic text extraction');
        throw new Error('PDF_CO_API_KEY not configured');
      }
    } catch (error) {
      console.error('Financial Optimization Service: PDF text extraction failed:', error);
      
      // Fallback: try to read as text (for non-PDF files or if PDF.co fails)
      try {
        const fs = require('fs').promises;
        const fileContent = await fs.readFile(filePath, 'utf8');
        console.log('Financial Optimization Service: Fallback text extraction successful, length:', fileContent.length);
        return fileContent;
      } catch (fallbackError) {
        console.error('Financial Optimization Service: Fallback text extraction also failed:', fallbackError);
        throw new Error(`Failed to extract text from file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Extract text from PDF buffer using PDF.co API
   */
  private async extractTextFromPDFBuffer(buffer: Buffer, fileName: string): Promise<string> {
    console.log('Financial Optimization Service: Extracting text from PDF buffer using PDF.co');
    
    try {
      const base64PDF = buffer.toString('base64');
      
      console.log('Financial Optimization Service: PDF buffer size:', buffer.length, 'bytes');
      
      if (process.env.PDF_CO_API_KEY) {
        console.log('Financial Optimization Service: Trying PDF.co API');
        
        // Step 1: Upload file to PDF.co
        const uploadResponse = await fetch('https://api.pdf.co/v1/file/upload/base64', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.PDF_CO_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            file: base64PDF,
            name: fileName
          })
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log('Financial Optimization Service: PDF.co upload result:', JSON.stringify(uploadResult, null, 2));
          
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

            if (convertResponse.ok) {
              const convertResult = await convertResponse.json();
              console.log('Financial Optimization Service: PDF.co convert result:', JSON.stringify(convertResult, null, 2));
              
              if (convertResult.url) {
                // Step 3: Download the extracted text
                console.log('Financial Optimization Service: Downloading extracted text from:', convertResult.url);
                const downloadResponse = await fetch(convertResult.url);
                
                if (downloadResponse.ok) {
                  const extractedText = await downloadResponse.text();
                  console.log('Financial Optimization Service: PDF.co text extraction successful');
                  console.log('Financial Optimization Service: Extracted text length:', extractedText.length);
                  return extractedText;
                } else {
                  console.error('Financial Optimization Service: Failed to download extracted text');
                  throw new Error('Failed to download extracted text from PDF.co');
                }
              } else {
                throw new Error('PDF.co conversion did not return download URL');
              }
            } else {
              const errorText = await convertResponse.text();
              console.error('Financial Optimization Service: PDF.co conversion failed:', convertResponse.status, errorText);
              throw new Error(`PDF.co conversion failed: ${convertResponse.status} ${errorText}`);
            }
          } else {
            throw new Error('PDF.co upload did not return URL');
          }
        } else {
          const errorText = await uploadResponse.text();
          console.error('Financial Optimization Service: PDF.co upload failed:', uploadResponse.status, errorText);
          throw new Error(`PDF.co upload failed: ${uploadResponse.status} ${errorText}`);
        }
      } else {
        console.log('Financial Optimization Service: PDF_CO_API_KEY not found, falling back to basic text extraction');
        throw new Error('PDF_CO_API_KEY not configured');
      }
    } catch (error) {
      console.error('Financial Optimization Service: PDF text extraction failed:', error);
      
      // Fallback: try to read buffer as text (for non-PDF files or if PDF.co fails)
      try {
        const fileContent = buffer.toString('utf8');
        console.log('Financial Optimization Service: Fallback text extraction successful, length:', fileContent.length);
        return fileContent;
      } catch (fallbackError) {
        console.error('Financial Optimization Service: Fallback text extraction also failed:', fallbackError);
        throw new Error(`Failed to extract text from buffer: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
}

export default FinancialOptimizationService;
