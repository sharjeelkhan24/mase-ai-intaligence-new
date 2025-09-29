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
- This section contains the primary diagnosis and ALL other diagnoses with their ICD-10 codes
- IMPORTANT: Extract ALL diagnoses listed in the document, not just the first few
- Look for table format with columns: ICD 10 Code, Description, Clinical Group, Comorbidity Group
- Extract every row from the diagnosis tables
- Look for M1021 - Primary Diagnosis with ICD-10 code and description
- Look for M1023 - Other Diagnoses with ICD-10 codes and descriptions
- Look for M1028 - Active Diagnoses - Comorbidities and Co-existing Conditions
- Primary Diagnosis format: (M1021) Primary Diagnosis Code: [ICD-10], (M1021) Primary Diagnosis: [Description]
- Other Diagnoses format: (M1023) Other Diagnosis Code: [ICD-10], (M1023) Other Diagnosis: [Description]
- Map diagnoses to appropriate clinical groups (MMTA_CARDIAC, MMTA_ENDO, NEURO_REHAB, MMTA_RESP, MS_REHAB, BEHAVE_HEALTH, etc.)
- Map diagnoses to comorbidity groups (Circulatory, Heart, Endocrine, Cerebral, Respiratory, Musculoskeletal, Neurological, Behavioral, etc.)
- Extract the actual section names/headers from the document (e.g., "M1021 - Primary Diagnosis", "M1023 - Other Diagnoses", etc.)
- If you cannot find the "Diagnoses Symptom Control until Comorbidities and Co-existing Conditions" section, look for any section containing diagnosis information, ICD-10 codes, or medical conditions
- For "Not specified" diagnoses, you MUST provide the appropriate ICD-10 code based on the description
- Common ICD-10 codes for these conditions:
  - "Unilateral primary osteoarthritis, right knee" = M17.11
  - "Alzheimer's disease, unspecified" = G30.9
  - "Type 2 diabetes mellitus without complications" = E11.9
  - "Obesity, unspecified" = E66.9
  - "Heart failure, unspecified" = I50.9
  - "Dementia in other diseases classed elsewhere, unspecified" = F03.90
  - "Chronic obstructive pulmonary disease, unspecified" = J44.9
  - "Peripheral vascular disease, unspecified" = I73.9
  - "Personal history of nicotine dependence" = Z87.891
- Every diagnosis MUST have an ICD-10 code. Never use "Not specified" in the ICD column
- IMPORTANT: Always provide the appropriate ICD-10 code for each diagnosis

For OASIS-E CORRECTIONS analysis, extract:
- CRITICAL: Look directly for M1800-M1870 items throughout the document, regardless of section headers
- Search for these specific OASIS items by their codes: (M1800), (M1810), (M1820), (M1830), (M1840), (M1845), (M1850), (M1860), (M1870)
- Look for checkmarks (✓) before the selected values
- ALWAYS provide corrections for functional items found, even if they don't need improvement
- DO NOT include diagnosis items (M1021, M1023, M1025, etc.) - these are for diagnosis coding, not functional assessment
- Look for items with checkmarks (✓) in the functional status section, such as:
  - M1800 Grooming: Look for checkmarked value (0, 1, 2, 3)
  - M1810 Dressing Upper Body: Look for checkmarked value (0, 1, 2, 3)
  - M1820 Dressing Lower Body: Look for checkmarked value (0, 1, 2, 3)
  - M1830 Bathing: Look for checkmarked value (0, 1, 2, 3, 4, 5, 6)
  - M1840 Toilet Transferring: Look for checkmarked value (0, 1, 2, 3, 4)
  - M1845 Toileting Hygiene: Look for checkmarked value (0, 1, 2, 3)
  - M1850 Transferring: Look for checkmarked value (0, 1, 2, 3, 4, 5)
  - M1860 Ambulation/Locomotion: Look for checkmarked value (0, 1, 2, 3, 4, 5, 6)
  - M1870 Feeding or Eating: Look for checkmarked value (0, 1, 2, 3, 4, 5)
- IMPORTANT: Look for the checkmark symbol (✓) before the value, not (✓✓)
- Extract the ACTUAL checkmarked values from the document, not predetermined values
- Look for patterns like "✓ 1 - Description" or "✓ 2 - Description"
- If no checkmarks are found, look for selected/checked values in the functional assessment items
- For each functional OASIS item with a checkmark, provide:
  - Current value (the FULL description of the checkmarked value, not just the number)
  - Suggested improved value (the FULL description of the next better level, not just the number)
  - Clinical rationale for why the improvement is possible
  - Financial impact of the improvement
- IMPORTANT: Extract the complete descriptions for functional values, not just numbers
- For example: "2 - Someone must help the patient put on upper body clothing" not just "2"
- Suggested values should be the next better functional level (e.g., if current is 2, suggest 1 or 0)
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

CRITICAL: Return ONLY valid JSON without any comments, explanations, or additional text. Do not include "//" comments or any text outside the JSON object.

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
            "Other Diagnoses": ["list of ALL other diagnoses found in the document"],
            "Other Diagnoses Details": [
              {
                "diagnosis": "diagnosis description",
                "icdCode": "MANDATORY: ICD-10 code (never null or N/A)",
                "clinicalGroup": "clinical group",
                "comorbidityGroup": "comorbidity group"
              }
            ],
    "OASIS Corrections": [
      {
        "oasisItem": "M1800 - Grooming",
        "currentValue": "2 - Someone must assist the patient to groom self",
        "suggestedValue": "1 - Grooming utensils must be placed within reach before able to complete grooming activities",
        "clinicalRationale": "Patient shows potential for independence with proper setup and assistive devices",
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
1. Patient Name: Look for "(M0040) First Name", "(M0040) Last Name", or "Last, First" format
2. MRN: Look for "MRN:", "(M0020) ID Number:", or patient ID format
3. DOB: Look for "DOB:", "(M0066) Birth Date:", or date format
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
13. ICD Codes: Extract ALL ICD-10 codes from the diagnosis tables, not just the first few
14. Diagnosis Descriptions: Extract ALL diagnosis descriptions from the tables
15. Comorbidities: Look for "(M1028) Active Diagnoses - Comorbidities and Co-existing Conditions"
16. IMPORTANT: Extract EVERY row from the diagnosis tables, including "Not specified" diagnoses
17. For "Not specified" diagnoses, extract ICD-10 codes from descriptions if they appear in parentheses
18. Example: "Alzheimer's disease, unspecified (G30.9)" → ICD: "G30.9", Description: "Alzheimer's disease, unspecified"

FUNCTIONAL STATUS (Look directly for M1800-M1870 items throughout the document):
18. Search for these specific OASIS codes: (M1800), (M1810), (M1820), (M1830), (M1840), (M1845), (M1850), (M1860), (M1870)
19. Look for checkmarks (✓) before the selected values
20. Grooming (M1800): Look for checkmarked value (0, 1, 2, 3)
21. Dressing Upper (M1810): Look for checkmarked value (0, 1, 2, 3)
22. Dressing Lower (M1820): Look for checkmarked value (0, 1, 2, 3)
23. Bathing (M1830): Look for checkmarked value (0-6)
24. Toilet Transferring (M1840): Look for checkmarked value (0-4)
25. Toileting Hygiene (M1845): Look for checkmarked value (0-3)
26. Transferring (M1850): Look for checkmarked value (0-5)
27. Ambulation (M1860): Look for checkmarked value (0-6)
28. Feeding (M1870): Look for checkmarked value (0-5)
29. IMPORTANT: Look for the checkmark symbol (✓) before the value
30. Look for patterns like "✓ 1 - Description" or "✓ 2 - Description"
31. ALWAYS provide corrections for functional items found, even if they don't need improvement
32. Example patterns to look for:
    - "(M1800) Grooming: ... ✓ 1 - Grooming utensils must be placed within reach before able to complete grooming activities."
    - "(M1810) Current Ability to Dress Upper Body ... ✓ 2 - Someone must help the patient put on upper body clothing."
    - "(M1830) Bathing: ... ✓ 3 - Able to participate in bathing self in shower or tub, but requires presence of another person throughout the bath for assistance or supervision."
    - "(M1840) Toilet Transferring: ... ✓ 1 - When reminded, assisted, or supervised by another person, able to get to and from the toilet and transfer."
    - "(M1845) Toileting Hygiene: ... ✓ 2 - Someone must help the patient to maintain toileting hygiene and/or adjust clothing."
    - "(M1850) Transferring: ... ✓ 1 - Able to transfer with minimal human assistance or with use of an assistive device."
    - "(M1860) Ambulation/Locomotion: ... ✓ 2 - Requires use of a two-handed device (for example, walker or crutches) to walk alone on a level surface."
    - "(M1870) Feeding or Eating: ... ✓ 1 - Able to feed self independently but requires:(a)meal set-up OR (b)intermittent assistance or supervision from another person OR (c)a liquid, pureed or ground meat diet."

REQUIRED CORRECTIONS & SUGGESTIONS:
29. For each functional item with a checkmarked value, provide:
    - Current value (the FULL description of the checkmarked value, not just the number)
    - Suggested improved value (the FULL description of the next better level, not just the number)
    - Clinical rationale for why the improvement is possible
    - Financial impact of the improvement
30. IMPORTANT: Extract complete descriptions for functional values
31. Example: "2 - Someone must help the patient put on upper body clothing" not just "2"
32. Suggested values should be the next better functional level (e.g., if current is 2, suggest 1 or 0)
33. NEVER say "No corrections required" - always provide corrections for functional items found
34. CRITICAL: If you find ANY M1800-M1870 items with checkmarks, you MUST include them in the OASIS Corrections array
35. The OASIS Corrections array should NEVER be empty if functional items are found in the document
36. IMPORTANT: Functional status items are often located in the middle or end of OASIS documents
37. Look for patterns like "(M1800) Grooming:" followed by options with checkmarks
38. Search the ENTIRE document content for these functional assessment items

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
- For names, extract as shown (e.g., "Last, First")
- If a field has multiple options, extract the one that is marked/selected
- Don't return "N/A" unless the field is truly not present in the document

Provide a comprehensive analysis in the requested JSON format with all extracted information.

IMPORTANT: Return ONLY the JSON object. Do not include any comments, explanations, or additional text. The response must be valid JSON that can be parsed directly.`;

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
        
        // Clean up any remaining whitespace and comments
        cleanText = cleanText.trim();
        
        // Remove any comments that might be in the JSON
        cleanText = cleanText.replace(/\/\/.*$/gm, ''); // Remove // comments
        cleanText = cleanText.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove /* */ comments
        
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
            let manualJson = jsonMatch[0];
            
            // Clean up comments in manual extraction
            manualJson = manualJson.replace(/\/\/.*$/gm, ''); // Remove // comments
            manualJson = manualJson.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove /* */ comments
            
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
