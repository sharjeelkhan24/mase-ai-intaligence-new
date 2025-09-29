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
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-5-nano' = 'gpt-4o'
  ): Promise<QAAnalysisResult> {
    try {
      // Check if OpenAI client is available
      if (!openai) {
        throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
      }

      console.log('OpenAI Service: Starting analysis for:', fileName);
      console.log('OpenAI Service: Using model:', model);
      console.log('OpenAI Service: Content length:', content.length);
      
      // Check if content is too large and might need truncation
      if (content.length > 800000) { // GPT-5-nano can handle ~400K tokens = ~1.6M characters
        console.log('OpenAI Service: Content is very large, might need truncation');
        console.log('OpenAI Service: Content preview (first 2000 chars):', content.substring(0, 2000));
        console.log('OpenAI Service: Content preview (last 2000 chars):', content.substring(Math.max(0, content.length - 2000)));
      }

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
        "currentValue": "2 - Someone must assist the patient to groom self",
        "suggestedValue": "1 - Grooming utensils must be placed within reach before able to complete grooming activities",
        "clinicalRationale": "Patient shows potential for independence with proper setup and assistive devices",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1810 - Dressing Upper Body",
        "currentValue": "2 - Someone must help the patient put on upper body clothing",
        "suggestedValue": "1 - Able to dress upper body without assistance if clothing is laid out or handed to the patient",
        "clinicalRationale": "Patient demonstrates ability to dress with minimal assistance and proper setup",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1820 - Dressing Lower Body",
        "currentValue": "2 - Someone must help the patient put on undergarments, slacks, socks or nylons, and shoes",
        "suggestedValue": "1 - Able to dress lower body without assistance if clothing and shoes are laid out or handed to the patient",
        "clinicalRationale": "Patient shows potential for independence with proper setup and assistive devices",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1830 - Bathing",
        "currentValue": "3 - Able to participate in bathing self in shower or tub, but requires presence of another person throughout the bath for assistance or supervision",
        "suggestedValue": "2 - Able to bathe in shower or tub with the intermittent assistance of another person",
        "clinicalRationale": "Patient demonstrates ability to bathe with minimal supervision and safety measures",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1840 - Toilet Transferring",
        "currentValue": "1 - When reminded, assisted, or supervised by another person, able to get to and from the toilet and transfer",
        "suggestedValue": "0 - Able to get to and from the toilet and transfer independently with or without a device",
        "clinicalRationale": "Patient shows potential for independence with proper assistive devices and safety measures",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1845 - Toileting Hygiene",
        "currentValue": "2 - Someone must help the patient to maintain toileting hygiene and/or adjust clothing",
        "suggestedValue": "1 - Able to manage toileting hygiene and clothing management without assistance if supplies/implements are laid out for the patient",
        "clinicalRationale": "Patient demonstrates ability to manage hygiene with proper setup and assistive devices",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1850 - Transferring",
        "currentValue": "3 - Unable to transfer self and is unable to bear weight or pivot when transferred by another person",
        "suggestedValue": "2 - Able to bear weight and pivot during the transfer process but unable to transfer self",
        "clinicalRationale": "Patient shows potential for improved transfer ability with proper assistive devices and training",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1860 - Ambulation/Locomotion",
        "currentValue": "3 - Able to walk only with the supervision or assistance of another person at all times",
        "suggestedValue": "2 - Requires use of a two-handed device (for example, walker or crutches) to walk alone on a level surface",
        "clinicalRationale": "Patient demonstrates ability to ambulate with proper assistive devices and safety measures",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
      },
      {
        "oasisItem": "M1870 - Feeding or Eating",
        "currentValue": "1 - Able to feed self independently but requires meal set-up OR intermittent assistance or supervision from another person OR a liquid, pureed or ground meat diet",
        "suggestedValue": "0 - Able to independently feed self",
        "clinicalRationale": "Patient shows potential for complete independence with proper meal setup and assistive devices",
        "financialImpact": "Improves functional score, contributing to higher HIPPS code and additional revenue per episode"
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

      const userPrompt = `Please analyze this OASIS-E patient assessment document and extract ALL available information:

File: ${fileName}
Content: ${content}

CRITICAL INSTRUCTIONS - EXTRACT INFORMATION FROM OASIS-E DOCUMENT:

PATIENT DEMOGRAPHICS (Look for these specific fields):
1. Patient Name: Look for "(M0040) First Name", "(M0040) Last Name", or "Banks, Cleatus" format
2. MRN: Look for "MRN:", "(M0020) ID Number:", or "BANKS08222025" format
3. DOB: Look for "DOB:", "(M0066) Birth Date:", or "05/25/1966" format
4. Gender: Look for "(M0069) Gender:" or "Male/Female"
5. Address: Look for "Address Line 1:", "City:", "State:", "ZIP Code:"

VISIT INFORMATION (Look for these sections):
6. Visit Type: Look for "Start of Care", "ROC", "Recert", "Episode Timing", or "(M0100)" section
7. Visit Date: Look for "Visit Date:", "(M0030) Start of Care Date:", or "09/04/2025" format
8. Payor: Look for "(M0150) Current Payment Source", "Medicare", "Medicaid", or insurance information
9. Clinician: Look for "Electronically Signed by:", "Tiffany Petty RN", or provider names
10. Status: Look for "Ready for Billing", "Optimized", "Pending", or completion status

DIAGNOSES SECTION (CRITICAL - Look for "Diagnoses Symptom Control" section):
11. Primary Diagnosis: Look for "(M1021) Primary Diagnosis Code:" and "(M1021) Primary Diagnosis:"
12. Other Diagnoses: Look for "(M1023) Other Diagnosis Code:" and "(M1023) Other Diagnosis:"
13. ICD Codes: Extract all ICD-10 codes (e.g., "J96.01", "T40.2X1D", "F33.1", "I25.10", "M62.81")
14. Diagnosis Descriptions: Extract all diagnosis descriptions
15. Comorbidities: Look for "(M1028) Active Diagnoses - Comorbidities and Co-existing Conditions"

FUNCTIONAL STATUS (Look for "FUNCTIONAL STATUS" section):
16. ADL Items: Look for M1800-M1870 codes with checkmarked values (✓)
17. Grooming (M1800): Look for checkmarked value (0, 1, 2, 3) - Current: 2 (Someone must assist)
18. Dressing Upper (M1810): Look for checkmarked value (0, 1, 2, 3) - Current: 2 (Someone must help)
19. Dressing Lower (M1820): Look for checkmarked value (0, 1, 2, 3) - Current: 2 (Someone must help)
20. Bathing (M1830): Look for checkmarked value (0-6) - Current: 3 (Requires presence throughout)
21. Toilet Transferring (M1840): Look for checkmarked value (0-4) - Current: 1 (When reminded/assisted)
22. Toileting Hygiene (M1845): Look for checkmarked value (0-3) - Current: 2 (Someone must help)
23. Transferring (M1850): Look for checkmarked value (0-5) - Current: 3 (Unable to transfer self)
24. Ambulation (M1860): Look for checkmarked value (0-6) - Current: 3 (Able to walk only with supervision)
25. Feeding (M1870): Look for checkmarked value (0-5) - Current: 1 (Requires meal set-up/assistance)

REQUIRED CORRECTIONS & SUGGESTIONS:
26. For each functional item with a checkmarked value, provide:
    - Current value (the checkmarked value)
    - Suggested improved value (based on clinical evidence)
    - Clinical rationale for the correction
    - Revenue impact (if applicable)

VITAL SIGNS & ASSESSMENT:
24. Vital Signs: Look for "Temperature:", "Pulse Rate:", "BP:", "Respirations:", "O2 Saturation:"
25. Height/Weight: Look for "Height:", "Weight:", "BMI"
26. Risk Assessments: Look for "Fall Risk Assessment", "Pressure Sore Risk", "Hospitalization Risk"

MEDICATIONS & TREATMENTS:
27. Medications: Look for "Medications" section, drug names, dosages
28. Treatments: Look for "Special Treatments", "Respiratory Therapies", "Cancer Treatments"

EXTRACTION RULES:
- Extract EXACT values as they appear in the document
- For checkmarked items, extract the checkmarked value (✓)
- For ICD codes, extract the complete code (e.g., "J96.01")
- For dates, extract in the format shown (e.g., "09/04/2025")
- For names, extract as shown (e.g., "Banks, Cleatus")
- If a field has multiple options, extract the one that is marked/selected
- Don't return "N/A" unless the field is truly not present in the document

Provide a comprehensive analysis in the requested JSON format with all extracted information.`;

      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        ...(model === 'gpt-5-nano' ? { max_completion_tokens: 40000 } : { max_tokens: 8000, temperature: 0.1 }),
      });

      const analysisText = response.choices[0]?.message?.content || '{}';
      console.log('OpenAI Service: Raw response length:', analysisText.length);
      console.log('OpenAI Service: Raw response preview:', analysisText.substring(0, 500));
      console.log('OpenAI Service: Raw response full:', analysisText);

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
