import CodingReviewService, { CodingReviewResult } from './codingReviewService';
import * as fs from 'fs';
import * as path from 'path';

export interface ProcessingQueueItem {
  id: string;
  fileName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

export interface CodingAnalysisResult {
  id: string;
  fileName: string;
  analysisType: string;
  priority: string;
  patientId?: string;
  status: 'completed' | 'failed';
  results: CodingReviewResult;
  processingNotes?: string;
  createdAt: Date;
  completedAt: Date;
  processingTime: string;
  fileInfo: {
    size: number;
    type: string;
    lastModified: Date;
  };
}

class CodingAnalysisService {
  private processingQueue: Map<string, ProcessingQueueItem> = new Map();
  private analysisResults: Map<string, CodingAnalysisResult> = new Map();
  private codingReviewService: CodingReviewService;

  constructor() {
    this.codingReviewService = new CodingReviewService();
  }

  async analyzeFile(
    filePath: string,
    analysisType: string = 'coding-review',
    priority: string = 'medium',
    patientId?: string,
    processingNotes?: string,
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<CodingAnalysisResult> {
    const analysisId = `coding_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const analysisStartTime = new Date();
    
    // Add to processing queue
    const queueItem: ProcessingQueueItem = {
      id: analysisId,
      fileName: path.basename(filePath),
      status: 'queued',
      progress: 0,
      startTime: analysisStartTime
    };
    this.processingQueue.set(analysisId, queueItem);

    try {
      console.log('Coding Analysis Service: Starting analysis for:', filePath);
      console.log('Coding Analysis Service: Analysis start time:', analysisStartTime.toISOString());

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Read file content
      const content = fs.readFileSync(filePath, 'utf-8');
      queueItem.progress = 30;

      // Perform coding review analysis
      const analysisResult = await this.codingReviewService.analyzeCodingReview(content, path.basename(filePath));
      queueItem.progress = 80;

      // Calculate processing time
      const analysisEndTime = new Date();
      const processingTimeMs = analysisEndTime.getTime() - analysisStartTime.getTime();
      const processingTimeSeconds = Math.round(processingTimeMs / 1000);
      const processingTimeFormatted = processingTimeSeconds < 60 
        ? `${processingTimeSeconds}s` 
        : `${Math.floor(processingTimeSeconds / 60)}m ${processingTimeSeconds % 60}s`;

      console.log('Coding Analysis Service: Analysis completed in:', processingTimeFormatted);

      // Update queue item
      queueItem.status = 'completed';
      queueItem.progress = 100;
      queueItem.endTime = analysisEndTime;

      // Get file info
      const stats = fs.statSync(filePath);

      // Create final result
      const result: CodingAnalysisResult = {
        id: analysisId,
        fileName: path.basename(filePath),
        analysisType,
        priority,
        patientId,
        status: 'completed',
        results: analysisResult,
        processingNotes,
        createdAt: analysisStartTime,
        completedAt: analysisEndTime,
        processingTime: processingTimeFormatted,
        fileInfo: {
          size: stats.size,
          type: path.extname(filePath),
          lastModified: stats.mtime
        }
      };

      // Store result
      this.analysisResults.set(analysisId, result);

      console.log('Coding Analysis Service: Analysis completed successfully');
      return result;

    } catch (error) {
      console.error('Coding Analysis Service: Analysis failed:', error);
      
      // Update queue item with error
      queueItem.status = 'failed';
      queueItem.error = error instanceof Error ? error.message : 'Unknown error';
      queueItem.endTime = new Date();

      throw error;
    }
  }

  async analyzeFileFromBuffer(
    buffer: Buffer,
    fileName: string,
    analysisType: string = 'coding-review',
    priority: string = 'medium',
    patientId?: string,
    processingNotes?: string,
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<CodingAnalysisResult> {
    const analysisId = `coding_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      console.log('Coding Analysis Service: Starting analysis for:', fileName);
      console.log('Coding Analysis Service: Analysis start time:', analysisStartTime.toISOString());
      console.log('Coding Analysis Service: Buffer size:', buffer.length, 'bytes');

      // Update status to processing
      queueItem.status = 'processing';
      queueItem.progress = 10;

      // Read file content from buffer
      const { content, fileInfo } = await this.readFileContentFromBuffer(buffer, fileName);
      queueItem.progress = 30;

      // Perform coding review analysis
      const analysisResult = await this.codingReviewService.analyzeCodingReview(content, fileName);
      queueItem.progress = 80;

      // Calculate processing time
      const analysisEndTime = new Date();
      const processingTimeMs = analysisEndTime.getTime() - analysisStartTime.getTime();
      const processingTimeSeconds = Math.round(processingTimeMs / 1000);
      const processingTimeFormatted = processingTimeSeconds < 60 
        ? `${processingTimeSeconds}s` 
        : `${Math.floor(processingTimeSeconds / 60)}m ${processingTimeSeconds % 60}s`;

      console.log('Coding Analysis Service: Analysis completed in:', processingTimeFormatted);

      // Update queue item
      queueItem.status = 'completed';
      queueItem.progress = 100;
      queueItem.endTime = analysisEndTime;

      // Create final result
      const result: CodingAnalysisResult = {
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
        fileInfo
      };

      // Store result
      this.analysisResults.set(analysisId, result);

      console.log('Coding Analysis Service: Analysis completed successfully');
      return result;

    } catch (error) {
      console.error('Coding Analysis Service: Analysis failed:', error);
      
      // Update queue item with error
      queueItem.status = 'failed';
      queueItem.error = error instanceof Error ? error.message : 'Unknown error';
      queueItem.endTime = new Date();

      throw error;
    }
  }

  private async readFileContentFromBuffer(buffer: Buffer, fileName: string): Promise<{ content: string; fileInfo: any }> {
    try {
      console.log('Coding Analysis Service: Reading content from buffer for:', fileName);
      console.log('Coding Analysis Service: Buffer size:', buffer.length, 'bytes');
      
      const fileExtension = path.extname(fileName).toLowerCase();
      
      if (fileExtension === '.pdf') {
        console.log('Coding Analysis Service: PDF buffer size:', buffer.length);
        
        try {
          // Try to extract text from PDF using API
          const extractedText = await this.extractPDFTextWithAPI(buffer);
          
          console.log('Coding Analysis Service: PDF text extraction successful');
          console.log('Coding Analysis Service: Extracted text length:', extractedText.length);
          
          // Check if the extracted text is too large
          const estimatedTokens = Math.ceil(extractedText.length / 4);
          console.log('Coding Analysis Service: Estimated tokens:', estimatedTokens);
          
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
            console.log('Coding Analysis Service: Content too large, truncating to prevent connection errors');
            contentToSend = extractedText.substring(0, 100000) + '\n\n[Content truncated due to size - showing first 100,000 characters]';
          }

          // Send extracted text to AI for analysis
          const content = `Coding Review Analysis Request

File Information:
- File Name: ${fileName}
- File Size: ${buffer.length} bytes
- Extracted Text Length: ${extractedText.length} characters
- Content Sent: ${contentToSend.length} characters
- Estimated Tokens: ${Math.ceil(contentToSend.length / 4)}
- Format: PDF (Text extracted)

Please analyze this PDF document and provide a comprehensive coding review focusing on ICD-10 code accuracy, completeness, and optimization. The PDF text content has been extracted for analysis.

PDF Text Content:
${contentToSend}

Please provide a comprehensive analysis including:
1. Primary diagnosis coding validation and optimization
2. Secondary diagnoses analysis and completeness
3. Coding corrections and improvements
4. Coding recommendations and best practices

Note: This PDF text has been extracted for accurate analysis of the document content.`;
          
          console.log('Coding Analysis Service: PDF text content preview (first 1000 chars):', extractedText.substring(0, 1000));
          console.log('Coding Analysis Service: PDF text content preview (last 1000 chars):', extractedText.substring(Math.max(0, extractedText.length - 1000)));
        
          console.log('Coding Analysis Service: PDF text sent to AI for analysis');
          
          return {
            content,
            fileInfo: {
              fileType: 'pdf',
              pageCount: 1, // PDF.co doesn't return page count
              fileSize: buffer.length,
              extractedText: extractedText.substring(0, 1000)
            }
          };
          
        } catch (error) {
          console.error('Coding Analysis Service: PDF text extraction failed:', error);
          
          // No fallback - throw error if PDF extraction fails
          throw new Error(`PDF text extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else if (fileExtension === '.txt') {
        let content = buffer.toString('utf-8');
        
        // No content truncation - send full document to AI
        console.log(`Coding Analysis Service: Full text content length: ${content.length} chars`);
        
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
    } catch (error) {
      console.error('Coding Analysis Service: Error reading file content:', error);
      throw error;
    }
  }

  private async extractPDFTextWithAPI(buffer: Buffer): Promise<string> {
    try {
      console.log('Coding Analysis Service: Starting PDF text extraction with API');
      
      // Convert buffer to base64
      const base64PDF = buffer.toString('base64');
      
      // Try PDF.co API first (more reliable)
      console.log('Coding Analysis Service: Checking PDF.co API key...');
      console.log('Coding Analysis Service: PDF_CO_API_KEY exists:', !!process.env.PDF_CO_API_KEY);
      console.log('Coding Analysis Service: PDF_CO_API_KEY length:', process.env.PDF_CO_API_KEY?.length || 0);
      console.log('Coding Analysis Service: PDF_CO_API_KEY preview:', process.env.PDF_CO_API_KEY?.substring(0, 20) + '...' || 'Not found');
      
      if (process.env.PDF_CO_API_KEY) {
        console.log('Coding Analysis Service: Trying PDF.co API');
        
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
        
        console.log('Coding Analysis Service: PDF.co upload response status:', uploadResponse.status);
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log('Coding Analysis Service: PDF.co upload result:', JSON.stringify(uploadResult, null, 2));
          
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
            
            console.log('Coding Analysis Service: PDF.co convert response status:', convertResponse.status);
            
            if (convertResponse.ok) {
              const convertResult = await convertResponse.json();
              console.log('Coding Analysis Service: PDF.co convert result:', JSON.stringify(convertResult, null, 2));
              
              if (convertResult.url) {
                // Step 3: Download the extracted text
                console.log('Coding Analysis Service: Downloading extracted text from:', convertResult.url);
                const downloadResponse = await fetch(convertResult.url);
                
                if (downloadResponse.ok) {
                  const extractedText = await downloadResponse.text();
                  console.log('Coding Analysis Service: PDF.co text extraction successful');
                  console.log('Coding Analysis Service: Extracted text length:', extractedText.length);
                  return extractedText;
                } else {
                  console.error('Coding Analysis Service: Failed to download extracted text');
                }
              }
            } else {
              const errorText = await convertResponse.text();
              console.error('Coding Analysis Service: PDF.co convert error response:', errorText);
            }
          }
        } else {
          const errorText = await uploadResponse.text();
          console.error('Coding Analysis Service: PDF.co upload error response:', errorText);
        }
        console.log('Coding Analysis Service: PDF.co API failed');
      } else {
        console.log('Coding Analysis Service: PDF.co API key not found, skipping API extraction');
      }
      
      throw new Error('PDF.co API not available - PDF text extraction requires API key configuration');
      
    } catch (error) {
      console.error('Coding Analysis Service: PDF text extraction failed:', error);
      throw error;
    }
  }

  // Queue management methods
  getProcessingQueue(): ProcessingQueueItem[] {
    return Array.from(this.processingQueue.values());
  }

  getQueueItem(id: string): ProcessingQueueItem | undefined {
    return this.processingQueue.get(id);
  }

  removeQueueItem(id: string): boolean {
    return this.processingQueue.delete(id);
  }

  clearQueue(): void {
    this.processingQueue.clear();
  }

  getAllAnalysisResults(): CodingAnalysisResult[] {
    return Array.from(this.analysisResults.values());
  }

  getAnalysisResult(id: string): CodingAnalysisResult | undefined {
    return this.analysisResults.get(id);
  }
}

// Export singleton instance
export const codingAnalysisService = new CodingAnalysisService();
export default codingAnalysisService;
