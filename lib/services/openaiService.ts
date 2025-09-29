import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'placeholder-key') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('OPENAI_API_KEY environment variable is not set or is placeholder. OpenAI features will not work.');
}

export interface QAAnalysisResult {
  patientName?: string;
  patientId?: string;
  mrn?: string;
  visitType?: string;
  payor?: string;
  visitDate?: string;
  clinician?: string;
  payPeriod?: string;
  status?: string;
  riskLevel?: string;
  complianceIssues?: string[];
  recommendations?: string[];
  extractedData?: Record<string, any>;
  confidence?: number;
  analysisType: 'openai';
  timestamp: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  
  private constructor() {}
  
  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  /**
   * Analyze patient document using OpenAI
   */
  public async analyzePatientDocument(
    content: string,
    fileName: string,
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' = 'gpt-4o'
  ): Promise<QAAnalysisResult> {
    try {
      // Check if OpenAI client is available
      if (!openai) {
        throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
      }

      console.log('OpenAI Service: Starting analysis for:', fileName);
      console.log('OpenAI Service: Using model:', model);
      console.log('OpenAI Service: Content length:', content.length);

      const systemPrompt = `You are a healthcare quality assurance AI assistant specializing in analyzing patient care documents. Your task is to extract specific patient information and provide quality assurance analysis.

IMPORTANT: Look for these specific fields in the document:
- Patient Name (look for "Patient Name", "Name:", "Patient:", etc.)
- MRN (Medical Record Number - look for "MRN", "Medical Record Number", "Patient ID", etc.)
- Visit Type (look for "Visit Type", "Type of Visit", "SOC", "ROC", "Recert", etc.)
- Payor (look for "Payor", "Insurance", "Medicare", "Medicaid", "Private", etc.)
- Visit Date (look for "Visit Date", "Date of Visit", "Assessment Date", etc.)
- Clinician (look for "Clinician", "Nurse", "Therapist", "Provider", etc.)
- Pay Period (look for "Pay Period", "Episode", "30 Days", "60 Days", etc.)
- Status (look for "Status", "Ready for Billing", "Optimized", "Pending", etc.)

For ACTIVE DIAGNOSES analysis, extract:
- CRITICAL: Look specifically for the "Diagnoses Symptom Control until Comorbidities and Co-existing Conditions" section
- This section contains the primary diagnosis and all other diagnoses with their ICD-10 codes
- Look for M1021 - Primary Diagnosis with ICD-10 code and description
- Look for M1023 - Other Diagnoses with ICD-10 codes and descriptions
- Look for M1028 - Active Diagnoses - Comorbidities and Co-existing Conditions
- Primary Diagnosis format: (M1021) Primary Diagnosis Code: [ICD-10], (M1021) Primary Diagnosis: [Description]
- Other Diagnoses format: (M1023) Other Diagnosis Code: [ICD-10], (M1023) Other Diagnosis: [Description]
- Map diagnoses to appropriate clinical groups (MMTA_CARDIAC, MMTA_ENDO, NEURO_REHAB, MMTA_RESP, MS_REHAB, BEHAVE_HEALTH, etc.)
- Map diagnoses to comorbidity groups (Circulatory, Heart, Endocrine, Cerebral, Respiratory, Musculoskeletal, Neurological, Behavioral, etc.)
- Extract the actual section names/headers from the document (e.g., "M1021 - Primary Diagnosis", "M1023 - Other Diagnoses", etc.)
- If you cannot find the "Diagnoses Symptom Control until Comorbidities and Co-existing Conditions" section, look for any section containing diagnosis information, ICD-10 codes, or medical conditions

For OASIS-E CORRECTIONS analysis, extract:
- CRITICAL: Look specifically for the "FUNCTIONAL STATUS" section in the document
- This section contains functional assessment items (M1800-M1900 series) with checkmarks (✓✓) indicating current values
- ONLY identify FUNCTIONAL assessment items that have checkmarks (✓✓) and need correction
- DO NOT include diagnosis items (M1021, M1023, M1025, etc.) - these are for diagnosis coding, not functional assessment
- Look for items with checkmarks (✓✓) in the functional status section, such as:
  - M1800 Grooming: Look for checkmarked value (0, 1, 2, 3)
  - M1810 Dressing Upper Body: Look for checkmarked value (0, 1, 2, 3)
  - M1820 Dressing Lower Body: Look for checkmarked value (0, 1, 2, 3)
  - M1830 Bathing: Look for checkmarked value (0, 1, 2, 3, 4, 5, 6)
  - M1840 Toilet Transferring: Look for checkmarked value (0, 1, 2, 3, 4)
  - M1845 Toileting Hygiene: Look for checkmarked value (0, 1, 2, 3)
  - M1850 Transferring: Look for checkmarked value (0, 1, 2, 3, 4, 5)
  - M1860 Ambulation/Locomotion: Look for checkmarked value (0, 1, 2, 3, 4, 5, 6)
  - M1870 Feeding or Eating: Look for checkmarked value (0, 1, 2, 3, 4, 5)
- For each functional OASIS item with a checkmark that needs correction, provide:
  - Current value (the checkmarked value from the FUNCTIONAL STATUS section)
  - Suggested improved value (based on clinical evidence and documentation)
  - Clinical rationale for why the correction is needed
- NEVER include M1021, M1023, M1025, or any other diagnosis-related OASIS items
- Extract actual functional scores and levels from the document, not hardcoded values

For REVENUE IMPACT ANALYSIS, extract:
- Admission Source (Institutional, Community, etc.)
- Episode Timing (Early Timing, Late Timing, etc.)
- Clinical Group (MMTA_CARDIAC, MMTA_RESP, etc.)
- Comorbidity Adjustment (High Comorbidity, Low Comorbidity, etc.)
- Initial Functional Score (current functional assessment score)
- Optimized Functional Score (improved functional assessment score after corrections)
- Initial Functional Level (Low Impairment, High Impairment, etc.)
- Optimized Functional Level (improved functional level after corrections)
- Initial HIPPS Code (current HIPPS code)
- Optimized HIPPS Code (improved HIPPS code after corrections)
- Case Mix Weight (current case mix weight)
- Optimized Case Mix Weight (improved case mix weight after corrections)
- Weighted Rate (current weighted rate)
- Optimized Weighted Rate (improved weighted rate after corrections)
- Initial Revenue (current 30-day period revenue)
- Optimized Revenue (improved 30-day period revenue after corrections)
- Revenue Increase (difference between optimized and initial revenue)

CRITICAL: Every diagnosis MUST have an ICD-10 code. You must provide ICD-10 codes for ALL diagnoses in the "Other Diagnoses" array, not just the first few. For example:
- "Muscle weakness (generalized)" = M62.81
- "Athscl heart disease of native coronary artery w/o ang pctrs" = I25.10
- "Major depressive disorder, recurrent, moderate" = F33.1
- "Poisoning by other opioids, accidental (unintentional), subs" = T40.2X1D

If you cannot find a specific ICD-10 code in the document, you must provide the most appropriate standard ICD-10 code for that diagnosis based on your medical knowledge. Never use "N/A" or null for ICD-10 codes.

Extract ALL available information from the document. If a field is not found, use null.

Format your response as a JSON object with this EXACT structure:
{
  "patientName": "string or null",
  "patientId": "string or null",
  "mrn": "string or null",
  "visitType": "string or null",
  "payor": "string or null",
  "visitDate": "string or null",
  "clinician": "string or null",
  "payPeriod": "string or null",
  "status": "string or null",
  "riskLevel": "low|medium|high",
  "complianceIssues": ["array of specific issues found"],
  "recommendations": ["array of specific recommendations"],
  "extractedData": {
    "Primary Diagnosis Section": "actual section name from document (e.g., 'M1021 - Primary Diagnosis')",
    "Primary Diagnosis": "primary diagnosis description",
    "Primary Diagnosis ICD": "MANDATORY: ICD-10 code for primary diagnosis (never null or N/A)",
    "Primary Clinical Group": "clinical group for primary diagnosis",
    "Primary Comorbidity Group": "comorbidity group for primary diagnosis",
    "Other Diagnoses Section": "actual section name from document (e.g., 'M1023 - Other Diagnoses')",
    "Other Diagnoses": ["list of other diagnoses"],
    "Other Diagnosis 1 ICD": "MANDATORY: ICD-10 code for first other diagnosis (never null or N/A)",
    "Other Diagnosis 1 Clinical Group": "clinical group for first other diagnosis",
    "Other Diagnosis 1 Comorbidity Group": "comorbidity group for first other diagnosis",
    "Other Diagnosis 2 ICD": "MANDATORY: ICD-10 code for second other diagnosis (never null or N/A)",
    "Other Diagnosis 2 Clinical Group": "clinical group for second other diagnosis",
    "Other Diagnosis 2 Comorbidity Group": "comorbidity group for second other diagnosis",
    "Other Diagnosis 3 ICD": "MANDATORY: ICD-10 code for third other diagnosis (never null or N/A)",
    "Other Diagnosis 3 Clinical Group": "clinical group for third other diagnosis",
    "Other Diagnosis 3 Comorbidity Group": "comorbidity group for third other diagnosis",
    "Other Diagnosis 4 ICD": "MANDATORY: ICD-10 code for fourth other diagnosis (never null or N/A)",
    "Other Diagnosis 4 Clinical Group": "clinical group for fourth other diagnosis",
    "Other Diagnosis 4 Comorbidity Group": "comorbidity group for fourth other diagnosis",
    "OASIS Corrections": [
      {
        "oasisItem": "M1800 - Grooming",
        "currentValue": "1 - Able to groom self unaided",
        "suggestedValue": "2 - Grooming utensils must be placed within reach",
        "clinicalRationale": "Patient documentation indicates assistance needed with setup due to weakness and cognitive impairment",
        "financialImpact": "Increases functional score by 8 points, contributing to higher HIPPS code and $127 additional revenue per episode"
      }
    ],
    "RevenueImpactAnalysis": {
      "admissionSource": "Institutional",
      "episodeTiming": "Early Timing",
      "clinicalGroup": "MMTA_RESP",
      "comorbidityAdjustment": "High Comorbidity",
      "initialFunctionalScore": 24,
      "optimizedFunctionalScore": 56,
      "initialFunctionalLevel": "Low Impairment",
      "optimizedFunctionalLevel": "High Impairment",
      "initialHIPPSCode": "2HA31",
      "optimizedHIPPSCode": "2HC31",
      "caseMixWeight": 1.329,
      "optimizedCaseMixWeight": 1.5322,
      "weightedRate": 2734.22,
      "optimizedWeightedRate": 3152.27,
      "initialRevenue": 2513.45,
      "optimizedRevenue": 2897.75,
      "revenueIncrease": 384.3
    },
    "all other relevant data found": "values"
  },
  "confidence": 0.0-1.0
}

Be extremely thorough in extracting information. Look for variations in field names and formats.`;

      const userPrompt = `Please analyze this patient document and extract ALL available information:

File: ${fileName}
Content: ${content}

IMPORTANT: 
1. Extract every piece of patient information you can find
2. Look for field names in various formats (e.g., "Patient Name", "Name:", "Patient:", etc.)
3. Pay special attention to medical record numbers, visit types, dates, and status information
4. If you find information that doesn't fit the standard fields, include it in extractedData
5. Be very thorough - don't miss any details
6. CRITICAL: For diagnoses, specifically search for the "Diagnoses Symptom Control until Comorbidities and Co-existing Conditions" section - this is where all diagnosis information is located
7. Look for the exact format: (M1021) Primary Diagnosis Code: [ICD-10], (M1021) Primary Diagnosis: [Description]
8. Look for the exact format: (M1023) Other Diagnosis Code: [ICD-10], (M1023) Other Diagnosis: [Description]
9. CRITICAL: For functional corrections, specifically search for the "FUNCTIONAL STATUS" section - this contains functional assessment items (M1800-M1900 series) with checkmarks (✓✓)
10. Look for items with checkmarks (✓✓) to identify current values - these are the actual functional status values that may need correction
11. Extract actual current values from the checkmarked items in the FUNCTIONAL STATUS section, not hardcoded examples
12. If that specific section is not found, look for any section containing diagnosis information, ICD-10 codes, or medical conditions
13. Every diagnosis MUST have an ICD-10 code - if not found in the document, provide the most appropriate standard ICD-10 code based on medical knowledge

Provide a comprehensive analysis in the requested JSON format.`;

      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 8000,
      });

      const analysisText = response.choices[0]?.message?.content || '{}';
      console.log('OpenAI Service: Raw response:', analysisText);

      let analysisResult: QAAnalysisResult;
      
      try {
        // Clean the response text to remove markdown code fences
        let cleanText = analysisText;
        
        // Remove markdown code fences if present
        if (cleanText.includes('```json')) {
          cleanText = cleanText.replace(/```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.includes('```')) {
          cleanText = cleanText.replace(/```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Clean up any remaining whitespace
        cleanText = cleanText.trim();
        
        console.log('OpenAI Service: Cleaned response text:', cleanText.substring(0, 200) + '...');
        
        // Try to parse as JSON
        const parsed = JSON.parse(cleanText);
        analysisResult = {
          ...parsed,
          analysisType: 'openai',
          timestamp: new Date().toISOString(),
        };
      } catch (parseError) {
        console.log('OpenAI Service: Failed to parse JSON, trying manual extraction');
        
        // Try to extract JSON manually using regex
        try {
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const manualJson = jsonMatch[0];
            console.log('OpenAI Service: Manual JSON extraction:', manualJson.substring(0, 200) + '...');
            const manualParsed = JSON.parse(manualJson);
            analysisResult = {
              ...manualParsed,
              analysisType: 'openai',
              timestamp: new Date().toISOString(),
            };
          } else {
            throw new Error('No JSON object found in response');
          }
        } catch (manualError) {
          console.error('OpenAI Service: Manual JSON extraction also failed:', manualError);
          throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
        }
      }

      console.log('OpenAI Service: Final analysis result:', analysisResult);
      return analysisResult;

    } catch (error) {
      console.error('OpenAI Service: Error during analysis:', error);
      
      // If API key is missing, throw error instead of returning mock data
      if (error instanceof Error && error.message.includes('API key is not configured')) {
        throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
      }

      // Throw error instead of returning fallback data
      throw error;
    }
  }


  /**
   * Test OpenAI connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      if (!openai) {
        console.error('OpenAI Service: Client not initialized - API key not configured');
        return false;
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello, this is a test.' }],
        max_tokens: 10,
      });
      
      return response.choices[0]?.message?.content !== undefined;
    } catch (error) {
      console.error('OpenAI Service: Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models
   */
  public getAvailableModels(): string[] {
    return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o'];
  }
}

export default OpenAIService;
