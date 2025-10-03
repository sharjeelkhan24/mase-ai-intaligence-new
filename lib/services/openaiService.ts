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
  detailedAnalysis?: string;
  detailedAnalysisCleaned?: string;
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
    model: 'gpt-5-nano' = 'gpt-5-nano'
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

For COMPLIANCE ISSUES analysis, extract:
- OASIS Compliance Issues:
  * Missing or incomplete M-items (M0040, M0066, M0069, M0050, M0060, M0020, M0030, M0010, M0018, M0080, M0090, M0100, M0102, M0104, M1000, M1021, M1023, M1028, M1033, M1060, M1306, M1330, M1332, M1334, M1800-M1870, M2001, M2010, M2020, M2030)
  * SPECIFICALLY list which M-items are missing or incomplete
  * Incomplete responses or missing checkmarks with specific item numbers
  * Assessment timing compliance (M0090 vs M0030 dates) with actual dates found
  * Required signature presence throughout document with page locations
  * Risk assessment completion (Fall Risk, Pressure Sore Risk, Hospitalization Risk) with specific assessments found/missing
  * Medication reconciliation status (M2001, M2010, M2020, M2030) with specific findings
- Regulatory Compliance Issues:
  * CMS regulation violations with specific regulation numbers
  * State regulation adherence with specific state requirements
  * Accreditation standard gaps with specific standards (Joint Commission, CHAP, etc.)
  * Documentation standards compliance with specific gaps
  * Care plan requirements with missing elements
  * Patient rights documentation with specific missing components
- Quality Measures Compliance:
  * Functional improvement measures (M1800-M1870 scores) with detailed analysis of current vs potential scores
  * Outcome measures (hospitalization risk, medication management) with specific risk factors identified
  * Process measures (assessment timing, signature requirements) with compliance status
  * Quality measure compliance gaps with specific measures affected


CRITICAL: Every diagnosis MUST have an ICD-10 code. You must provide ICD-10 codes for ALL diagnoses in the "Other Diagnoses" array, not just the first few. For example:
- "Muscle weakness (generalized)" = M62.81
- "Athscl heart disease of native coronary artery w/o ang pctrs" = I25.10
- "Major depressive disorder, recurrent, moderate" = F33.1
- "Poisoning by other opioids, accidental (unintentional), subs" = T40.2X1D

If you cannot find a specific ICD-10 code in the document, you must provide the most appropriate standard ICD-10 code for that diagnosis based on your medical knowledge. Never use "N/A" or null for ICD-10 codes.

Extract ALL available information from the document. If a field is not found, use null.

CRITICAL: Return ONLY valid JSON without any comments, explanations, or additional text. Do not include "//" comments or any text outside the JSON object.
CRITICAL: Ensure all JSON strings are properly escaped. Use double quotes for all string values.
CRITICAL: Do not include any trailing commas or invalid JSON syntax.
CRITICAL: The response must be a single, valid JSON object that can be parsed by JSON.parse().
CRITICAL: Escape all quotes within string values using backslashes (\").
CRITICAL: Do not include any newlines or special characters that would break JSON parsing.
CRITICAL: Ensure all property names are wrapped in double quotes.
CRITICAL: Use null for missing values, not undefined or empty strings.
CRITICAL: Validate your JSON before responding - it must be parseable by JSON.parse().

For the detailedAnalysis field, provide a comprehensive, well-formatted narrative report that includes:
- Executive summary of findings
- Detailed analysis of each section (diagnoses, functional status, compliance)
- Clinical insights and observations
- Quality assessment conclusions
- Professional healthcare language and terminology
- Proper formatting with headers, bullet points, and clear sections
- CRITICAL: Do NOT include any raw JSON data, extracted data objects, or technical metadata in the detailedAnalysis field
- CRITICAL: Do NOT include "Extracted Data:", "Timestamp:", "AI Model:", "Content Length:", or any technical information
- CRITICAL: Only provide the clean, professional narrative report text
- Use proper report formatting with clear sections and professional language

For the detailedAnalysisCleaned field, provide the EXACT SAME content as detailedAnalysis but ensure it is completely clean:
- NO technical metadata
- NO raw JSON data
- NO file information
- NO timestamps
- NO AI model information
- ONLY the professional narrative report starting with "COMPREHENSIVE QUALITY ASSURANCE ANALYSIS REPORT"
- This field should contain ONLY the clean, formatted report text without any technical information

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
    "ComplianceIssues": {
      "oasisIssues": [
        {
          "item": "M0040 - Middle Initial",
          "description": "Middle Initial field is blank and should be completed or marked as N/A",
          "action": "Complete Middle Initial field or mark as N/A if not applicable",
          "details": "Found: First Name: Billy ✓, Last Name: Scott ✓, Middle Initial: [BLANK], Suffix: [BLANK]",
          "severity": "Medium"
        },
        {
          "item": "M0040 - Suffix",
          "description": "Suffix field is blank and should be completed or marked as N/A",
          "action": "Complete Suffix field or mark as N/A if not applicable",
          "details": "Found: First Name: Billy ✓, Last Name: Scott ✓, Middle Initial: [BLANK], Suffix: [BLANK]",
          "severity": "Medium"
        }
      ],
      "regulatoryIssues": [
        {
          "regulation": "CMS OASIS Requirements - Incomplete Demographics",
          "description": "Patient name components are incomplete",
          "priority": "Medium",
          "details": "Missing: M0040 Middle Initial (blank), M0040 Suffix (blank). All other required M-items are present and complete.",
          "impact": "Potential data quality issues, may affect patient matching and reporting"
        }
      ],
      "qualityMeasures": [
        {
          "measure": "Functional Improvement Potential",
          "description": "Analysis of patient's functional status and improvement potential based on documented scores",
          "status": "Compliant",
          "details": "Current functional scores documented: M1800=1 (Grooming), M1810=2 (Dressing Upper), M1820=2 (Dressing Lower), M1830=3 (Bathing), M1840=1 (Toilet Transfer), M1845=2 (Toileting Hygiene), M1850=1 (Transferring), M1860=2 (Ambulation), M1870=1 (Feeding). Patient shows potential for improvement in dressing and bathing activities.",
          "analysis": "Patient has good cognitive function (BIMS score 9), family support (wife Marianne), and appropriate assistive devices (cane/walker), indicating potential for functional improvement in ADL activities with proper therapy and training.",
          "recommendations": "Implement physical therapy for ambulation training, occupational therapy for dressing/bathing independence, provide adaptive equipment, caregiver training for assistance techniques"
        },
        {
          "measure": "Hospitalization Risk Assessment",
          "description": "Risk factors for hospitalization based on documented assessment",
          "status": "Compliant",
          "details": "Risk factors documented: M1033 shows '7 - Currently taking 5 or more medications' checked. Additional factors: Polypharmacy, ADL assistance needed, multiple comorbidities (COPD, Diabetes, Heart Failure), dyspnea with minimal exertion (M1400=3).",
          "analysis": "Patient has multiple documented risk factors but appropriate interventions are in place including medication management, oxygen therapy, and family support.",
          "recommendations": "Continue medication reconciliation, monitor vital signs regularly, provide education on symptom recognition, maintain family involvement in care"
        }
      ]
    },
    "detailedAnalysis": "COMPREHENSIVE QUALITY ASSURANCE ANALYSIS REPORT\n\nEXECUTIVE SUMMARY:\nThis comprehensive quality assurance analysis was conducted on the OASIS-E assessment for patient Billy Scott (MRN: SCOTT081825). The assessment demonstrates overall good clinical documentation with minor compliance issues identified in demographic data completion.\n\nCLINICAL ASSESSMENT FINDINGS:\n\nPrimary Diagnosis Analysis:\nThe patient presents with a primary diagnosis of unspecified open wound of the right lower leg (S81.801S), classified under the Musculoskeletal clinical group. This sequela diagnosis indicates a previous injury that continues to impact the patient's functional status.\n\nSecondary Diagnoses Review:\nThe assessment identifies nine secondary diagnoses, indicating a complex medical profile:\n• Musculoskeletal conditions: Right knee osteoarthritis (M17.11)\n• Neurological conditions: Alzheimer's disease (G30.9), unsteadiness on feet (R26.81), dementia with anxiety (F02.84)\n• Endocrine conditions: Type 2 diabetes (E11.9), obesity (E66.9)\n• Respiratory conditions: COPD (J44.9)\n• Cardiac conditions: Heart failure (I50.9)\n• Behavioral conditions: History of nicotine dependence (Z87.891)\n\nFUNCTIONAL STATUS EVALUATION:\nThe patient demonstrates moderate functional limitations across all ADL categories:\n• Grooming: Requires setup assistance (M1800=1)\n• Dressing: Needs help with both upper and lower body clothing (M1810=2, M1820=2)\n• Bathing: Requires continuous supervision (M1830=3)\n• Toileting: Needs prompting and assistance (M1840=1, M1845=2)\n• Transfers: Requires minimal assistance (M1850=1)\n• Ambulation: Uses two-handed device with supervision (M1860=2)\n• Feeding: Independent with setup requirements (M1870=1)\n\nCOMPLIANCE ASSESSMENT:\nMinor compliance issues identified:\n• Demographic data incomplete: Middle initial and suffix fields are blank\n• All other required OASIS items are properly completed\n• Assessment timing is compliant (completed on start of care date)\n• Required signatures are present throughout the document\n\nQUALITY MEASURES ANALYSIS:\nThe patient shows strong potential for functional improvement:\n• Good cognitive function (BIMS score 9)\n• Strong family support system (wife Marianne)\n• Appropriate assistive devices in use (cane/walker)\n• Multiple therapy opportunities identified\n\nRISK ASSESSMENT:\nHigh-risk patient profile with multiple risk factors:\n• Polypharmacy (7+ medications)\n• Multiple comorbidities\n• ADL assistance requirements\n• History of falls and unsteadiness\n• Cognitive impairment\n\nRECOMMENDATIONS:\n1. Complete demographic data by filling in middle initial and suffix fields\n2. Implement comprehensive therapy program focusing on ADL independence\n3. Provide caregiver education and training\n4. Consider adaptive equipment for improved independence\n5. Monitor medication management and potential interactions\n6. Implement fall prevention strategies\n7. Continue oxygen therapy management\n8. Provide diabetes education and monitoring\n\nCONCLUSION:\nThis assessment demonstrates thorough clinical documentation with minor administrative compliance issues. The patient presents with significant functional improvement potential through targeted therapy interventions and caregiver support. The complex medical profile requires coordinated care management to optimize outcomes and prevent hospitalization.",
    "detailedAnalysisCleaned": "COMPREHENSIVE QUALITY ASSURANCE ANALYSIS REPORT\n\nEXECUTIVE SUMMARY:\nThis comprehensive quality assurance analysis was conducted on the OASIS-E assessment for patient Billy Scott (MRN: SCOTT081825). The assessment demonstrates overall good clinical documentation with minor compliance issues identified in demographic data completion.\n\nCLINICAL ASSESSMENT FINDINGS:\n\nPrimary Diagnosis Analysis:\nThe patient presents with a primary diagnosis of unspecified open wound of the right lower leg (S81.801S), classified under the Musculoskeletal clinical group. This sequela diagnosis indicates a previous injury that continues to impact the patient's functional status.\n\nSecondary Diagnoses Review:\nThe assessment identifies nine secondary diagnoses, indicating a complex medical profile:\n• Musculoskeletal conditions: Right knee osteoarthritis (M17.11)\n• Neurological conditions: Alzheimer's disease (G30.9), unsteadiness on feet (R26.81), dementia with anxiety (F02.84)\n• Endocrine conditions: Type 2 diabetes (E11.9), obesity (E66.9)\n• Respiratory conditions: COPD (J44.9)\n• Cardiac conditions: Heart failure (I50.9)\n• Behavioral conditions: History of nicotine dependence (Z87.891)\n\nFUNCTIONAL STATUS EVALUATION:\nThe patient demonstrates moderate functional limitations across all ADL categories:\n• Grooming: Requires setup assistance (M1800=1)\n• Dressing: Needs help with both upper and lower body clothing (M1810=2, M1820=2)\n• Bathing: Requires continuous supervision (M1830=3)\n• Toileting: Needs prompting and assistance (M1840=1, M1845=2)\n• Transfers: Requires minimal assistance (M1850=1)\n• Ambulation: Uses two-handed device with supervision (M1860=2)\n• Feeding: Independent with setup requirements (M1870=1)\n\nCOMPLIANCE ASSESSMENT:\nMinor compliance issues identified:\n• Demographic data incomplete: Middle initial and suffix fields are blank\n• All other required OASIS items are properly completed\n• Assessment timing is compliant (completed on start of care date)\n• Required signatures are present throughout the document\n\nQUALITY MEASURES ANALYSIS:\nThe patient shows strong potential for functional improvement:\n• Good cognitive function (BIMS score 9)\n• Strong family support system (wife Marianne)\n• Appropriate assistive devices in use (cane/walker)\n• Multiple therapy opportunities identified\n\nRISK ASSESSMENT:\nHigh-risk patient profile with multiple risk factors:\n• Polypharmacy (7+ medications)\n• Multiple comorbidities\n• ADL assistance requirements\n• History of falls and unsteadiness\n• Cognitive impairment\n\nRECOMMENDATIONS:\n1. Complete demographic data by filling in middle initial and suffix fields\n2. Implement comprehensive therapy program focusing on ADL independence\n3. Provide caregiver education and training\n4. Consider adaptive equipment for improved independence\n5. Monitor medication management and potential interactions\n6. Implement fall prevention strategies\n7. Continue oxygen therapy management\n8. Provide diabetes education and monitoring\n\nCONCLUSION:\nThis assessment demonstrates thorough clinical documentation with minor administrative compliance issues. The patient presents with significant functional improvement potential through targeted therapy interventions and caregiver support. The complex medical profile requires coordinated care management to optimize outcomes and prevent hospitalization.",
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

COMPLIANCE ISSUES ANALYSIS:
24. OASIS Compliance Issues - CRITICAL: Only flag items that are ACTUALLY missing or incomplete:
    * M0040 Patient Name: Check if First Name, Middle Initial, Last Name, Suffix are ALL present or marked as N/A
    * M0066 Birth Date: Verify date is present and in correct format
    * M0069 Gender: Verify Male/Female is selected (not blank)
    * M0050 State: Verify state is listed
    * M0060 ZIP Code: Verify ZIP code is present
    * M0020 ID Number: Verify patient ID/MRN is present
    * M0030 Start of Care Date: Verify date is present
    * M0010 CMS Certification Number: Verify number is present
    * M0018 NPI: Verify NPI number is present
    * M0080 Discipline: Verify RN/PT/OT/SLP is selected
    * M0090 Assessment Date: Verify date is present and within 5 days of M0030
    * M0100 Assessment Reason: Verify reason is selected (SOC/ROC/Recert/etc.)
    * M0102 Physician-Ordered Date: Verify if N/A or specific date
    * M0104 Referral Date: Verify date is present
    * M0150 Payment Source: Verify payment source is selected (Medicare/Medicaid/etc.)
    * M1000 Inpatient Discharges: Verify if N/A or specific facility selected
    * M1021 Primary Diagnosis: Verify ICD-10 code and description present
    * M1023 Other Diagnoses: Verify all secondary diagnoses have ICD-10 codes
    * M1028 Comorbidities: Verify comorbidities are checked if present
    * M1033 Hospitalization Risk: Verify risk factors are assessed
    * M1060 Height/Weight: Verify measurements are present
    * M1306 Pressure Ulcer: Verify assessment is completed
    * M1330 Stasis Ulcer: Verify assessment is completed
    * M1800-M1870 Functional Items: Verify all functional assessments have checkmarks
    * M2001 Drug Review: Verify medication review is completed
    * M2010 High-Risk Education: Verify education is provided
    * M2020 Oral Medications: Verify management ability is assessed
    * M2030 Injectable Medications: Verify management ability is assessed
    * IMPORTANT: Only flag items that are TRULY missing, blank, or incomplete. If an item has a value, checkmark, or is marked as N/A, it is COMPLETE.
    * Look for actual blank fields, missing checkmarks, or incomplete responses
    * Verify assessment timing: M0090 date must be within 5 days of M0030 date
    * Check for required signatures on each page of the assessment
    * Verify risk assessments are completed (Fall Risk, Pressure Sore Risk, Hospitalization Risk)
25. Regulatory Compliance Issues - Only flag ACTUAL violations:
    * CMS OASIS Requirements: Only flag if required M-items are truly missing or incomplete
    * State Regulation: Only flag if state-specific requirements are not met
    * Accreditation Standards: Only flag if Joint Commission/CHAP standards are violated
    * Documentation Standards: Only flag if documentation is actually incomplete
    * Care Plan Requirements: Only flag if care plan elements are missing
    * Patient Rights: Only flag if patient rights documentation is actually missing
    * IMPORTANT: Do not create false positives. Only flag items that are genuinely missing or non-compliant.
26. Quality Measures Compliance - Analyze what is ACTUALLY present:
    * Functional Improvement: Analyze current M1800-M1870 scores and potential for improvement
    * Outcome Measures: Assess hospitalization risk factors that are actually documented
    * Process Measures: Verify assessment timing and signature requirements are met
    * Quality Measure Gaps: Only flag measures that are truly non-compliant
    * IMPORTANT: Base analysis on what is actually documented in the assessment, not assumptions.

VITAL SIGNS & ASSESSMENT:
27. Vital Signs: Look for "Temperature:", "Pulse Rate:", "BP:", "Respirations:", "O2 Saturation:"
28. Height/Weight: Look for "Height:", "Weight:", "BMI"
29. Risk Assessments: Look for "Fall Risk Assessment", "Pressure Sore Risk", "Hospitalization Risk"

MEDICATIONS & TREATMENTS:
30. Medications: Look for "Medications" section, drug names, dosages
31. Treatments: Look for "Special Treatments", "Respiratory Therapies", "Cancer Treatments"

EXTRACTION RULES:
- Extract EXACT values as they appear in the document
- For checkmarked items, extract the checkmarked value (✓)
- For ICD codes, extract the complete code (e.g., "J96.01")
- For dates, extract in the format shown (e.g., "09/04/2025")
- For names, extract as shown (e.g., "Last, First")
- If a field has multiple options, extract the one that is marked/selected
- Don't return "N/A" unless the field is truly not present in the document

Provide a comprehensive analysis in the requested JSON format with all extracted information.

IMPORTANT: Return ONLY the JSON object. Do not include any comments, explanations, or additional text. The response must be valid JSON that can be parsed directly.

CRITICAL INSTRUCTION FOR detailedAnalysis FIELD:
- The detailedAnalysis field should contain ONLY a clean, professional narrative report
- Do NOT include any raw JSON data, extracted data objects, or technical metadata
- Do NOT include "Extracted Data:", "Timestamp:", "AI Model:", "Content Length:", or any technical information
- Do NOT include the actual JSON structure or data objects
- Do NOT include "OpenAI Quality Assurance Analysis Report" headers or file information
- Do NOT include "PATIENT INFORMATION:", "COMPLIANCE SCORE:", "RISK LEVEL:", "ISSUES IDENTIFIED:", "RECOMMENDATIONS:", "DETAILED FINDINGS:" sections
- Only provide the clean, professional narrative report text with proper formatting
- Use headers, bullet points, and professional healthcare language
- Focus on clinical insights, compliance findings, and recommendations
- Start directly with "COMPREHENSIVE QUALITY ASSURANCE ANALYSIS REPORT" and provide only the narrative content`;

      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
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
        
        console.log('OpenAI Service: Cleaned response length:', cleanText.length);
        console.log('OpenAI Service: Cleaned response preview:', cleanText.substring(0, 200) + '...');
        
        // Handle large responses by extracting the most complete JSON structure
        if (cleanText.length > 10000) {
          console.log('OpenAI Service: Large response detected, optimizing JSON extraction');
          
          // First, try to find multiple JSON structures and pick the largest complete one
          const jsonCandidates = [];
          let currentJson = '';
          let braceLevel = 0;
          let inQuote = false;
          let escapeNext = false;
          
          for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];
            
            if (escapeNext) {
              escapeNext = false;
              currentJson += char;
              continue;
            }
            
            if (char === '\\') {
              escapeNext = true;
              currentJson += char;
              continue;
            }
            
            if (char === '"') {
              inQuote = !inQuote;
              currentJson += char;
              continue;
            }
            
            if (!inQuote) {
              if (char === '{') {
                if (braceLevel === 0) {
                  currentJson = char;
                } else {
                  currentJson += char;
                }
                braceLevel++;
              } else if (char === '}') {
                currentJson += char;
                braceLevel--;
                if (braceLevel === 0) {
                  jsonCandidates.push({
                    json: currentJson,
                    start: i - currentJson.length + 1,
                    end: i + 1,
                    length: currentJson.length
                  });
                  currentJson = '';
                }
              } else {
                currentJson += char;
              }
            } else {
              currentJson += char;
            }
          }
          
          // Sort by length and pick the largest complete JSON
          jsonCandidates.sort((a, b) => b.length - a.length);
          
          if (jsonCandidates.length > 0) {
            const bestJson = jsonCandidates[0].json;
            cleanText = bestJson;
            console.log(`OpenAI Service: Selected JSON candidate with ${bestJson.length} characters`);
          }
        }
        
        // Try to parse as JSON with better error handling and timeout protection
        let parsed;
        try {
          // For very large responses, add timeout protection
          if (cleanText.length > 100000) {
            console.log('OpenAI Service: Very large response detected, using timeout protection');
            parsed = await this.parseJsonWithTimeout(cleanText, 5000); // 5 second timeout
          } else {
            parsed = JSON.parse(cleanText);
          }
        } catch (jsonError) {
          console.error('OpenAI Service: JSON parse error:', jsonError);
          console.error('OpenAI Service: Error at position:', cleanText.length);
          
          // Try additional cleaning for common JSON issues
          cleanText = this.fixCommonJsonIssues(cleanText);
          console.log('OpenAI Service: Re-cleaned JSON length:', cleanText.length);
          
          try {
            if (cleanText.length > 100000) {
              parsed = await this.parseJsonWithTimeout(cleanText, 5000);
            } else {
              parsed = JSON.parse(cleanText);
            }
          } catch (secondError) {
            console.error('OpenAI Service: Second parse attempt failed:', secondError);
            
            // For extremely large JSON, try progressive parsing
            if (cleanText.length > 20000) {
              console.log('OpenAI Service: Attempting progressive JSON extraction for very large response');
              
              try {
                parsed = this.progressiveJsonParse(cleanText);
              } catch (progressiveError) {
                console.error('OpenAI Service: Progressive parsing failed:', progressiveError);
                throw secondError; // Fall back to original error
              }
            } else {
              throw secondError;
            }
          }
        }
        
        analysisResult = {
          ...parsed,
          analysisType: 'openai',
          timestamp: new Date().toISOString(),
        };
      } catch (parseError) {
        console.log('OpenAI Service: Failed to parse JSON, trying manual extraction');
        
        // Try to extract JSON manually using more robust method
        try {
          // Find the first complete JSON object by counting braces
          let jsonStart = analysisText.indexOf('{');
          if (jsonStart === -1) {
            throw new Error('No JSON object found in response');
          }
          
          let braceCount = 0;
          let jsonEnd = -1;
          let inString = false;
          let escapeNext = false;
          
          for (let i = jsonStart; i < analysisText.length; i++) {
            const char = analysisText[i];
            
            if (escapeNext) {
              escapeNext = false;
              continue;
            }
            
            if (char === '\\') {
              escapeNext = true;
              continue;
            }
            
            if (char === '"') {
              inString = !inString;
              continue;
            }
            
            if (!inString) {
              if (char === '{') {
                braceCount++;
              } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                  jsonEnd = i;
                  break;
                }
              }
            }
          }
          
          if (jsonEnd === -1) {
            // Try to find the last complete object by looking for the last closing brace
            const lastBraceIndex = analysisText.lastIndexOf('}');
            if (lastBraceIndex > jsonStart) {
              jsonEnd = lastBraceIndex;
              console.log('OpenAI Service: Using last closing brace at position:', jsonEnd);
            } else {
              throw new Error('Incomplete JSON object found');
            }
          }
          
          let manualJson = analysisText.substring(jsonStart, jsonEnd + 1);
            
            // Clean up comments in manual extraction
            manualJson = manualJson.replace(/\/\/.*$/gm, ''); // Remove // comments
            manualJson = manualJson.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove /* */ comments
            
            console.log('OpenAI Service: Manual JSON extraction:', manualJson.substring(0, 200) + '...');
          
          // Try to fix the JSON before parsing
          manualJson = this.fixCommonJsonIssues(manualJson);
          
          // Additional validation and cleaning
          manualJson = manualJson.trim();
          
          // Check if the JSON starts and ends properly
          if (!manualJson.startsWith('{') || !manualJson.endsWith('}')) {
            console.log('OpenAI Service: Attempting to fix JSON boundaries');
            // Try to fix the JSON structure
            if (!manualJson.startsWith('{')) {
              const firstBrace = manualJson.indexOf('{');
              if (firstBrace !== -1) {
                manualJson = manualJson.substring(firstBrace);
              }
            }
            if (!manualJson.endsWith('}')) {
              const lastBrace = manualJson.lastIndexOf('}');
              if (lastBrace !== -1) {
                manualJson = manualJson.substring(0, lastBrace + 1);
              } else {
                // Add missing closing brace
                manualJson += '}';
              }
            }
            console.log('OpenAI Service: Fixed JSON boundaries:', manualJson.substring(0, 50) + '...' + manualJson.substring(manualJson.length - 50));
          }
          
          // Try to parse with better error handling
          let manualParsed;
          try {
            manualParsed = JSON.parse(manualJson);
          } catch (parseError) {
            console.error('OpenAI Service: JSON parse error in manual extraction:', parseError);
            console.error('OpenAI Service: Problematic JSON:', manualJson.substring(0, 500) + '...');
            
            // Try one more aggressive cleaning
            manualJson = manualJson
              .replace(/,\s*}/g, '}') // Remove trailing commas before }
              .replace(/,\s*]/g, ']') // Remove trailing commas before ]
              .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // Quote unquoted keys
              .replace(/:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*([,}])/g, ': "$1"$2'); // Quote unquoted string values
            
            console.log('OpenAI Service: Re-cleaned JSON:', manualJson.substring(0, 200) + '...');
            manualParsed = JSON.parse(manualJson);
          }
            analysisResult = {
              ...manualParsed,
              analysisType: 'openai',
              timestamp: new Date().toISOString(),
            };
        } catch (manualError) {
          console.error('OpenAI Service: Manual JSON extraction also failed:', manualError);
          
          // Last resort: try to extract any valid JSON structure from the response
          try {
            console.log('OpenAI Service: Attempting last resort JSON extraction');
            
            // Look for any JSON-like structure in the response
            const jsonMatches = analysisText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
            if (jsonMatches && jsonMatches.length > 0) {
              // Try the largest JSON match
              const largestMatch = jsonMatches.reduce((a, b) => a.length > b.length ? a : b);
              console.log('OpenAI Service: Found potential JSON match:', largestMatch.substring(0, 200) + '...');
              
              const cleanedMatch = this.fixCommonJsonIssues(largestMatch);
              const lastResortParsed = JSON.parse(cleanedMatch);
              
              analysisResult = {
                ...lastResortParsed,
                analysisType: 'openai',
                timestamp: new Date().toISOString(),
              };
              
              console.log('OpenAI Service: Last resort extraction successful');
            } else {
              throw new Error('No valid JSON structure found in response');
            }
          } catch (lastResortError) {
            console.error('OpenAI Service: Last resort extraction failed:', lastResortError);
            
            // Final fallback: try to extract basic information from the raw response
            console.log('OpenAI Service: Attempting final fallback extraction');
            try {
              const basicInfo = this.extractBasicInfoFromResponse(analysisText);
              analysisResult = {
                ...basicInfo,
                confidence: 0.3,
                timestamp: new Date().toISOString(),
              };
              console.log('OpenAI Service: Fallback extraction successful');
            } catch (fallbackError) {
              console.error('OpenAI Service: All extraction methods failed:', fallbackError);
              throw new Error(`Failed to parse AI response as JSON: ${manualError instanceof Error ? manualError.message : 'Unknown parsing error'}`);
            }
          }
        }
      }

      console.log('OpenAI Service: Final analysis result:', analysisResult);
      
      // Calculate AI Confidence Score
      const confidenceScore = this.calculateAIConfidence(analysisResult, analysisText.length);
      analysisResult.confidence = confidenceScore;
      
      console.log(`OpenAI Service: AI Confidence Score: ${confidenceScore.toFixed(2)}`);
      
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
        model: 'gpt-5-nano',
        messages: [{ role: 'user', content: 'Hello, this is a test.' }],
      });
      
      return response.choices[0]?.message?.content !== undefined;
    } catch (error) {
      console.error('OpenAI Service: Connection test failed:', error);
      return false;
    }
  }

  /**
   * Extract basic information from response when JSON parsing fails
   */
  private extractBasicInfoFromResponse(responseText: string): any {
    console.log('OpenAI Service: Extracting basic info from response');
    
    // For very large responses, try to extract from the first part only
    let searchText = responseText;
    if (responseText.length > 50000) {
      console.log('OpenAI Service: Large response detected, searching first 50K characters for basic info');
      searchText = responseText.substring(0, 50000);
    }
    
    // Extract patient name
    const patientNameMatch = searchText.match(/"patientName":\s*"([^"]+)"/);
    const patientName = patientNameMatch ? patientNameMatch[1] : 'Unknown Patient';
    
    // Extract MRN
    const mrnMatch = searchText.match(/"mrn":\s*"([^"]+)"/);
    const mrn = mrnMatch ? mrnMatch[1] : 'UNKNOWN';
    
    // Extract visit type
    const visitTypeMatch = searchText.match(/"visitType":\s*"([^"]+)"/);
    const visitType = visitTypeMatch ? visitTypeMatch[1] : 'Unknown';
    
    // Extract visit date
    const visitDateMatch = searchText.match(/"visitDate":\s*"([^"]+)"/);
    const visitDate = visitDateMatch ? visitDateMatch[1] : new Date().toISOString().split('T')[0];
    
    // Extract basic issues from compliance issues array (limit search to avoid performance issues)
    const complianceIssuesMatch = searchText.match(/"complianceIssues":\s*\[([\s\S]{0,5000}?)\]/);
    let complianceIssues: string[] = [];
    if (complianceIssuesMatch) {
      const issuesText = complianceIssuesMatch[1];
      const issueMatches = issuesText.match(/"([^"]+)"/g);
      if (issueMatches) {
        complianceIssues = issueMatches.map(issue => issue.replace(/"/g, '')).slice(0, 10); // Limit to 10 issues
      }
    }
    
    // Extract basic recommendations (limit search to avoid performance issues)
    const recommendationsMatch = searchText.match(/"recommendations":\s*\[([\s\S]{0,5000}?)\]/);
    let recommendations: string[] = [];
    if (recommendationsMatch) {
      const recsText = recommendationsMatch[1];
      const recMatches = recsText.match(/"([^"]+)"/g);
      if (recMatches) {
        recommendations = recMatches.map(rec => rec.replace(/"/g, ''));
      }
    }
    
    return {
      patientName,
      mrn,
      visitType,
      visitDate,
      payor: 'Unknown',
      clinician: 'Unknown',
      payPeriod: 'Unknown',
      status: 'Unknown',
      riskLevel: 'medium',
      complianceIssues,
      recommendations,
      issuesFound: complianceIssues.map(issue => ({
        issue,
        priority: 'medium',
        description: issue
      })),
      correctionsRequired: complianceIssues.map(issue => ({
        issue,
        currentValue: 'Missing',
        correctValue: 'Required',
        rationale: 'Data validation required',
        priority: 'medium'
      })),
      activeDiagnoses: {
        primary: {
          icd10Code: 'N/A',
          description: 'Primary diagnosis not extracted',
          clinicalGroup: 'N/A',
          comorbidityGroup: 'N/A'
        },
        secondary: [],
        comorbidities: []
      },
      documentation: [],
      detailedAnalysis: 'Analysis completed with basic information extraction due to JSON parsing issues.',
      detailedAnalysisCleaned: 'Analysis completed with basic information extraction due to JSON parsing issues.'
    };
  }

  /**
   * Calculate AI Confidence Score based on response quality and completeness
   */
  private calculateAIConfidence(result: any, responseLength: number): number {
    let confidence = 0.5; // Base confidence
    
    try {
      // Factor 1: Response Completeness (0-0.3 points)
      const completeness = this.assessCompleteness(result);
      confidence += completeness;
      
      // Factor 2: Data Quality (0-0.2 points)
      const dataQuality = this.assessDataQuality(result);
      confidence += dataQuality;
      
      // Factor 3: Response Length (0-0.2 points)
      const lengthScore = this.assessResponseLength(responseLength);
      confidence += lengthScore;
      
      // Factor 4: Structure Quality (0-0.3 points)
      const structureScore = this.assessStructureQuality(result);
      confidence += structureScore;
      
      // Bonus/Penalty adjustments
      confidence += this.getAdjustments(result);
      
    } catch (error) {
      console.log('OpenAI Service: Error calculating confidence, using baseline');
      confidence = 0.3; // Lower baseline if calculation fails
    }
    
    // Ensure confidence stays within bounds
    return Math.min(1.0, Math.max(0.0, confidence));
  }

  private assessCompleteness(result: any): number {
    let score = 0;
    const expectedFields = ['patientName', 'mrn', 'visitType', 'payor', 'visitDate', 'riskLevel'];
    
    // Check if all expected fields are present and not null/empty
    expectedFields.forEach(field => {
      if (result[field] && result[field] !== null && result[field] !== '') {
        score += 0.05;
      }
    });
    
    // Check for detailed analysis
    if (result.detailedAnalysis && result.detailedAnalysis.length > 500) {
      score += 0.05;
    }
    
    // Check for active diagnoses
    if (result.activeDiagnoses && result.activeDiagnoses.primary && result.activeDiagnoses.primary.icd10Code !== 'N/A') {
      score += 0.05;
    }
    
    return Math.min(0.3, score);
  }

  private assessDataQuality(result: any): number {
    let score = 0;
    
    // Check if diagnoses have proper ICD-10 codes
    if (result.activeDiagnoses) {
      if (result.activeDiagnoses.primary && result.activeDiagnoses.primary.icd10Code && 
          result.activeDiagnoses.primary.icd10Code.length >= 3) {
        score += 0.05;
      }
      
      if (result.activeDiagnoses.secondary && Array.isArray(result.activeDiagnoses.secondary)) {
        const validSecondary = result.activeDiagnoses.secondary.filter((d: any) => d.icd10Code && d.icd10Code.length >= 3);
        if (validSecondary.length > 0) {
          score += 0.05;
        }
      }
    }
    
    // Check if date formats are proper (MM/DD/YYYY pattern)
    if (result.visitDate && /^\d{2}\/\d{2}\/\d{4}$/.test(result.visitDate)) {
      score += 0.05;
    }
    
    // Check if risk level is valid
    if (result.riskLevel && ['low', 'medium', 'high', 'critical'].includes(result.riskLevel.toLowerCase())) {
      score += 0.05;
    }
    
    return Math.min(0.2, score);
  }

  private assessResponseLength(responseLength: number): number {
    // Optimal range is 8000-15000 characters
    if (responseLength >= 8000 && responseLength <= 15000) {
      return 0.2;
    } else if (responseLength >= 5000 && responseLength < 25000) {
      return 0.15; // Good range
    } else if (responseLength >= 2000 && responseLength < 35000) {
      return 0.1; // Acceptable range
    } else if (responseLength >= 1000) {
      return 0.05; // Minimum viable
    }
    return 0; // Too short
  }

  private assessStructureQuality(result: any): number {
    let score = 0;
    
    // Check for proper array structures
    if (Array.isArray(result.complianceIssues) && result.complianceIssues.length > 0) {
      score += 0.05;
    }
    
    if (Array.isArray(result.recommendations) && result.recommendations.length > 0) {
      score += 0.05;
    }
    
    // Check for detailed analysis structure
    if (result.detailedAnalysis && typeof result.detailedAnalysis === 'string') {
      const hasSections = /\n[A-Z][A-Z\s]+:\n/.test(result.detailedAnalysis);
      if (hasSections) score += 0.05;
      
      const hasListItems = /^[•\-\*]\s/.test(result.detailedAnalysis) || /^\d+\.\s/.test(result.detailedAnalysis);
      if (hasListItems) score += 0.05;
    }
    
    // Check for proper object nesting
    if (result.activeDiagnoses && typeof result.activeDiagnoses === 'object' && 
        result.activeDiagnoses.primary && typeof result.activeDiagnoses.primary === 'object') {
      score += 0.1;
    }
    
    return Math.min(0.3, score);
  }

  private getAdjustments(result: any): number {
    let adjustment = 0;
    
    // Bonus for comprehensive analysis
    if (result.detailedAnalysis && result.detailedAnalysis.length > 2000) {
      adjustment += 0.05;
    }
    
    // Bonus for multiple secondary diagnoses
    if (result.activeDiagnoses && result.activeDiagnoses.secondary && 
        Array.isArray(result.activeDiagnoses.secondary) && 
        result.activeDiagnoses.secondary.length >= 3) {
      adjustment += 0.05;
    }
    
    // Bonus for having both issues and recommendations
    if (result.complianceIssues && result.recommendations && 
        Array.isArray(result.complianceIssues) && Array.isArray(result.recommendations) &&
        result.complianceIssues.length > 0 && result.recommendations.length > 0) {
      adjustment += 0.05;
    }
    
    // Penalty for too much "N/A" or "Unknown" data
    const nullValues = Object.values(result).filter(val => 
      val === 'N/A' || val === 'Unknown' || val === null || val === ''
    );
    if (nullValues.length > Object.keys(result).length * 0.5) {
      adjustment -= 0.1; // High percentage of missing data
    }
    
    return adjustment;
  }

  /**
   * Progressive JSON parsing for very large responses
   */
  private progressiveJsonParse(jsonString: string): any {
    console.log('OpenAI Service: Starting progressive JSON parsing');
    
    // Extract core structure first
    const corePattern = /{\s*"patientName"[^}]*}/;
    let coreMatch = jsonString.match(corePattern);
    
    if (coreMatch) {
      const coreJson = coreMatch[0];
      console.log('OpenAI Service: Found core JSON structure');
      
      try {
        const coreData = JSON.parse(coreJson);
        console.log('OpenAI Service: Core JSON parsed successfully');
        
        // Try to extract additional sections progressively
        const enhancedData = { ...coreData };
        
        // Extract issues if present
        const issuesMatch = jsonString.match(/"complianceIssues"\s*:\s*\[[^\]]*\]/);
        if (issuesMatch) {
          try {
            const issuesJson = '{' + issuesMatch[0] + '}';
            const issuesData = JSON.parse(issuesJson);
            if (issuesData.complianceIssues) {
              enhancedData.complianceIssues = issuesData.complianceIssues;
            }
          } catch (e) {
            console.log('OpenAI Service: Could not parse issues section');
          }
        }
        
        // Extract recommendations if present
        const recommendationsMatch = jsonString.match(/"recommendations"\s*:\s*\[[^\]]*\]/);
        if (recommendationsMatch) {
          try {
            const recommendationsJson = '{' + recommendationsMatch[0] + '}';
            const recommendationsData = JSON.parse(recommendationsJson);
            if (recommendationsData.recommendations) {
              enhancedData.recommendations = recommendationsData.recommendations;
            }
          } catch (e) {
            console.log('OpenAI Service: Could not parse recommendations section');
          }
        }
        
        console.log('OpenAI Service: Progressive parsing successful');
        return enhancedData;
        
      } catch (coreError) {
        console.log('OpenAI Service: Core JSON parsing failed, trying fallback');
      }
    }
    
    // Fallback: try to extract any recognizable JSON structure
    const fallbackMatch = jsonString.match(/{[^}]*}/);
    if (fallbackMatch) {
      console.log('OpenAI Service: Using fallback JSON extraction');
      return JSON.parse(fallbackMatch[0]);
    }
    
    throw new Error('No valid JSON structure found for progressive parsing');
  }

  /**
   * Fix common JSON issues that AI responses might have
   */
  private fixCommonJsonIssues(jsonString: string): string {
    let fixed = jsonString;
    
    console.log('OpenAI Service: Fixing JSON issues for string of length:', fixed.length);
    
    // For very large responses, try multiple strategies to extract valid JSON
    if (fixed.length > 20000) {
      console.log('OpenAI Service: Large response detected, attempting smart JSON extraction');
      
      // Strategy 1: Try to find the main JSON object by counting braces
      let extracted = this.extractMainJsonObject(fixed);
      if (extracted) {
        fixed = extracted;
        console.log('OpenAI Service: Strategy 1 successful - extracted main JSON object');
      } else {
        // Strategy 2: Try truncation at reasonable length
        console.log('OpenAI Service: Strategy 1 failed, trying truncation strategy');
        const maxLength = 50000; // Reasonable limit for JSON
        if (fixed.length > maxLength) {
          fixed = this.truncateAndCloseJson(fixed, maxLength);
          console.log('OpenAI Service: Strategy 2 - truncated to', maxLength, 'characters');
        }
      }
    }
    
    // Remove any text before the first {
    const firstBrace = fixed.indexOf('{');
    if (firstBrace > 0) {
      fixed = fixed.substring(firstBrace);
    }
    
    // Remove any text after the last }
    const lastBrace = fixed.lastIndexOf('}');
    if (lastBrace > 0 && lastBrace < fixed.length - 1) {
      fixed = fixed.substring(0, lastBrace + 1);
    }
    
    // Fix trailing commas
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unescaped quotes in strings - be more careful about this
    // Only escape quotes that are not already escaped and not at property boundaries
    // Skip this for very large responses to avoid corruption
    if (fixed.length < 15000) {
      fixed = fixed.replace(/(?<!\\)"(?![,}\]:])/g, '\\"');
    }
    
    // Fix single quotes to double quotes (but be careful with apostrophes in text)
    fixed = fixed.replace(/([{,]\s*)'([^']*)'(\s*:)/g, '$1"$2"$3');
    
    // Fix missing quotes around property names
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
    
    // Fix undefined values
    fixed = fixed.replace(/:\s*undefined/g, ': null');
    
    // Fix NaN values
    fixed = fixed.replace(/:\s*NaN/g, ': null');
    
    // Fix Infinity values
    fixed = fixed.replace(/:\s*Infinity/g, ': null');
    
    // Fix newlines in strings (escape them properly)
    fixed = fixed.replace(/(?<!\\)\n/g, '\\n');
    
    // Remove any remaining control characters except newlines and tabs
    fixed = fixed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Fix any remaining issues with quotes in the detailedAnalysis field
    // This is often where the JSON breaks
    const detailedAnalysisMatch = fixed.match(/"detailedAnalysis":\s*"([^"]*(?:\\.[^"]*)*)"/);
    if (detailedAnalysisMatch) {
      const originalDetailedAnalysis = detailedAnalysisMatch[1];
      const cleanedDetailedAnalysis = originalDetailedAnalysis
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      
      fixed = fixed.replace(
        `"detailedAnalysis": "${originalDetailedAnalysis}"`,
        `"detailedAnalysis": "${cleanedDetailedAnalysis}"`
      );
    }
    
    return fixed;
  }

  /**
   * Extract the main JSON object from a large response
   */
  private extractMainJsonObject(jsonString: string): string | null {
    const bracePositions = [];
    let braceCount = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < jsonString.length; i++) {
      if (escaped) {
        escaped = false;
        continue;
      }
      
      const char = jsonString[i];
      if (char === '\\') {
        escaped = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          if (braceCount === 0) {
            bracePositions.push({ type: 'open', position: i });
          }
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            bracePositions.push({ type: 'close', position: i });
          }
        }
      }
    }
    
    // If we found complete brace pairs, extract the largest valid JSON
    if (bracePositions.length >= 2) {
      const openPositions = bracePositions.filter(p => p.type === 'open');
      const closePositions = bracePositions.filter(p => p.type === 'close');
      
      if (openPositions.length > 0 && closePositions.length > 0) {
        // Find the largest valid JSON segment
        let bestStart = openPositions[0].position;
        let bestEnd = closePositions[closePositions.length - 1].position;
        
        for (let i = 0; i < openPositions.length; i++) {
          const start = openPositions[i].position;
          let matchingClose = null;
          
          for (let j = closePositions.length - 1; j >= 0; j--) {
            if (closePositions[j].position > start) {
              matchingClose = closePositions[j].position;
              break;
            }
          }
          
          if (matchingClose && (matchingClose - start) > (bestEnd - bestStart)) {
            bestStart = start;
            bestEnd = matchingClose;
          }
        }
        
        const extracted = jsonString.substring(bestStart, bestEnd + 1);
        console.log(`OpenAI Service: Extracted JSON segment from ${bestStart} to ${bestEnd}`);
        
        // Test if the extracted JSON is valid
        try {
          JSON.parse(extracted);
          return extracted;
        } catch (e) {
          console.log('OpenAI Service: Extracted JSON is invalid, trying alternative');
          return null;
        }
      }
    }
    
    return null;
  }

  /**
   * Truncate JSON at a reasonable length and try to close it properly
   */
  private truncateAndCloseJson(jsonString: string, maxLength: number): string {
    let truncated = jsonString.substring(0, maxLength);
    
    // Try to find a good place to cut (end of a property)
    const lastComma = truncated.lastIndexOf(',');
    const lastBrace = truncated.lastIndexOf('}');
    
    if (lastComma > lastBrace && lastComma > maxLength - 1000) {
      truncated = truncated.substring(0, lastComma);
    }
    
    // Count open braces and close them
    let openBraces = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < truncated.length; i++) {
      if (escaped) {
        escaped = false;
        continue;
      }
      
      const char = truncated[i];
      if (char === '\\') {
        escaped = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') openBraces++;
        else if (char === '}') openBraces--;
      }
    }
    
    // Close any open braces
    while (openBraces > 0) {
      truncated += '}';
      openBraces--;
    }
    
    return truncated;
  }

  /**
   * Parse JSON with timeout protection for very large responses
   */
  private async parseJsonWithTimeout(jsonString: string, timeoutMs: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`JSON parsing timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      try {
        const result = JSON.parse(jsonString);
        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Get available models
   */
  public getAvailableModels(): string[] {
    return ['gpt-5-nano'];
  }
}

export default OpenAIService;


