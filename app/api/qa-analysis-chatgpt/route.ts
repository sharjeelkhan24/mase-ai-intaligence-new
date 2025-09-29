import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/lib/services/openaiService';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('ChatGPT QA Analysis: Starting request');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const model = formData.get('model') as string || 'gpt-3.5-turbo';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('ChatGPT QA Analysis: File received:', file.name);
    console.log('ChatGPT QA Analysis: Model selected:', model);

    // Save uploaded file temporarily
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    console.log('ChatGPT QA Analysis: File saved to:', filePath);

    // Read file content
    const content = await readFileContent(filePath, file.name);
    console.log('ChatGPT QA Analysis: Content length:', content.length);
    console.log('ChatGPT QA Analysis: Content preview:', content.substring(0, 200));

    // Analyze with OpenAI
    console.log('ChatGPT QA Analysis: Getting OpenAI service instance...');
    const openaiService = OpenAIService.getInstance();
    
    console.log('ChatGPT QA Analysis: Starting analysis...');
    console.log('ChatGPT QA Analysis: Environment check - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    console.log('ChatGPT QA Analysis: Environment check - OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
    
    const analysisResult = await openaiService.analyzePatientDocument(
      content,
      file.name,
      model as 'gpt-3.5-turbo' | 'gpt-4'
    );

    console.log('ChatGPT QA Analysis: Analysis completed:', analysisResult);
    console.log('ChatGPT QA Analysis: Analysis result type:', typeof analysisResult);
    console.log('ChatGPT QA Analysis: Analysis result keys:', Object.keys(analysisResult || {}));

    // Clean up temporary file
    try {
      fs.unlinkSync(filePath);
      console.log('ChatGPT QA Analysis: Temporary file cleaned up');
    } catch (cleanupError) {
      console.warn('ChatGPT QA Analysis: Failed to clean up file:', cleanupError);
    }

    return NextResponse.json({
      success: true,
      result: analysisResult,
      model: 'chatgpt',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ChatGPT QA Analysis: Error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

async function readFileContent(filePath: string, fileName: string): Promise<string> {
  const fileExtension = path.extname(fileName).toLowerCase();
  
  try {
    if (fileExtension === '.pdf') {
      // Use pdf-parse to extract text from PDF
      const pdf = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(dataBuffer);
      return pdfData.text;
    } else if (fileExtension === '.txt') {
      // Read text file
      return fs.readFileSync(filePath, 'utf-8');
    } else if (fileExtension === '.docx') {
      // For DOCX files, you might need a library like 'mammoth'
      // For now, return a placeholder
      return 'DOCX file content extraction not implemented yet';
    } else {
      // Try to read as text
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
