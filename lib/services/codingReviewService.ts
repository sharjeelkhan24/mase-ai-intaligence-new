import OpenAI from 'openai';

export interface CodingReviewResult {
  confidence?: number;
  analysisType?: string;
  timestamp?: string;
  patientInfo: {
    patientName: string;
    patientId: string;
    mrn: string;
    visitType: string;
    payor: string;
    visitDate: string;
    clinician: string;
    payPeriod: string;
    status: string;
  };
  primaryDiagnosisCoding: {
    currentCode: string;
    currentDescription: string;
    severityLevel: string;
    clinicalSupport: string;
    alternativeCodes: Array<{
      code: string;
      description: string;
      rationale: string;
    }>;
    sequencingRecommendations: {
      recommendation: string;
      explanation: {
        whatItMeans: string;
        whyImportant: string;
        howItAffectsCare: string;
        implementation: string;
      };
    };
    validationStatus: 'valid' | 'needs_review' | 'invalid';
  };
  secondaryDiagnosesAnalysis: {
    codes: Array<{
      code: string;
      description: string;
      severityLevel: string;
      validation: string;
      specificityRecommendations: string;
      comorbidityImpact: string;
    }>;
    missingDiagnoses: Array<{
      suggestedCode: string;
      description: string;
      rationale: string;
      documentationNeeded: string;
    }>;
    comorbidityImpact: string;
    totalSecondaryCodes: number;
  };
  codingCorrections: {
    incorrectCodes: Array<{
      currentCode: string;
      suggestedCode: string;
      reason: string;
      documentationNeeded: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    missingCodes: Array<{
      suggestedCode: string;
      description: string;
      rationale: string;
      documentationNeeded: string;
    }>;
    severityAdjustments: Array<{
      code: string;
      currentSeverity: string;
      suggestedSeverity: string;
      rationale: string;
      explanation: {
        whatItMeans: string;
        whyImportant: string;
        howItAffectsCare: string;
        implementation: string;
      };
    }>;
    sequencingImprovements: Array<{
      currentSequence: string[];
      suggestedSequence: string[];
      rationale: string;
      explanation: {
        whatItMeans: string;
        whyImportant: string;
        howItAffectsCare: string;
        implementation: string;
      };
    }>;
  };
  codingRecommendations: {
    additionalCodes: Array<{
      code: string;
      description: string;
      rationale: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    documentationRequirements: Array<{
      requirement: string;
      purpose: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    complianceIssues: Array<{
      issue: string;
      severity: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
    bestPractices: Array<{
      practice: string;
      explanation: {
        whatItMeans: string;
        whyImportant: string;
        howItAffectsCare: string;
        implementation: string;
      };
    }>;
  };
  summary: {
    totalIssues: number;
    criticalIssues: number;
    recommendations: number;
    complianceScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    aiConfidence?: number;
  };
}

class CodingReviewService {
  private openai: OpenAI | null;

  constructor() {
    // Initialize OpenAI client
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'placeholder-key') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn('OPENAI_API_KEY environment variable is not set or is placeholder. Coding review features will not work.');
      this.openai = null;
    }
  }

  async analyzeCodingReview(
    content: string,
    fileName: string,
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<CodingReviewResult> {
    console.log('Coding Review Service: Starting analysis for:', fileName);
    console.log('Coding Review Service: Content length:', content.length);

    const systemPrompt = `You are a medical coding specialist analyzing OASIS-E1 assessments for ICD-10 code accuracy, completeness, and optimization. Your expertise includes:

1. ICD-10-CM coding guidelines and conventions
2. OASIS-E1 assessment requirements
3. Case mix weight calculations
4. Coding compliance and documentation standards
5. Clinical documentation improvement (CDI) principles

ANALYSIS REQUIREMENTS:

PRIMARY DIAGNOSIS CODING:
- Validate current primary diagnosis code accuracy
- Assess severity level appropriateness (01, 02, 03)
- Evaluate clinical documentation support
- Suggest alternative codes if applicable
- Provide sequencing recommendations

SECONDARY DIAGNOSES ANALYSIS:
- Review all secondary diagnosis codes for accuracy
- Validate severity levels for each code
- Identify missing diagnoses based on documentation
- Assess comorbidity impact on case mix
- Recommend code specificity improvements

CODING CORRECTIONS:
- Identify incorrect or inappropriate codes
- Find missing codes based on clinical documentation
- Suggest severity level adjustments
- Recommend sequencing improvements
- Identify required clinical documentation

CODING RECOMMENDATIONS:
- Suggest additional codes to consider
- List documentation requirements for coding
- Identify coding compliance issues
- Provide best practices for diagnosis coding

RESPONSE FORMAT:
Return a comprehensive JSON analysis with the following structure:

{
  "patientInfo": {
    "patientName": "Patient's full name",
    "patientId": "Patient ID",
    "mrn": "Medical Record Number",
    "visitType": "Type of visit (e.g., Start of Care, Recertification)",
    "payor": "Insurance/Payor information",
    "visitDate": "Date of visit (MM/DD/YYYY)",
    "clinician": "Treating clinician name",
    "payPeriod": "Payment period",
    "status": "Visit status"
  },
  "primaryDiagnosisCoding": {
    "currentCode": "S81.801S",
    "currentDescription": "Unspecified open wound, right lower leg, sequela",
    "severityLevel": "03",
    "clinicalSupport": "Assessment of clinical documentation support",
    "alternativeCodes": [
      {
        "code": "S81.801A",
        "description": "Unspecified open wound, right lower leg, initial encounter",
        "rationale": "Reason for alternative code suggestion"
      }
    ],
    "sequencingRecommendations": {
      "recommendation": "The primary diagnosis is appropriately sequenced as the main reason for home health care",
      "explanation": {
        "whatItMeans": "The order of diagnosis codes affects how Medicare calculates payment and how healthcare providers prioritize care",
        "whyImportant": "Proper sequencing ensures the most critical conditions are listed first and can increase reimbursement",
        "howItAffectsCare": "Correct sequencing helps healthcare providers focus on the most important conditions first",
        "implementation": "Reorder the diagnosis codes in the system to reflect the new sequence and update care plans accordingly"
      }
    },
    "validationStatus": "valid|needs_review|invalid"
  },
  "secondaryDiagnosesAnalysis": {
    "codes": [
      {
        "code": "M17.11",
        "description": "Unilateral primary osteoarthritis, right knee",
        "severityLevel": "03",
        "validation": "Validation assessment",
        "specificityRecommendations": "Recommendations for code specificity",
        "comorbidityImpact": "Impact on case mix weight"
      }
    ],
    "missingDiagnoses": [
      {
        "suggestedCode": "I10",
        "description": "Essential hypertension",
        "rationale": "Reason for suggesting this code",
        "documentationNeeded": "Required documentation"
      }
    ],
    "comorbidityImpact": "Overall comorbidity impact assessment",
    "totalSecondaryCodes": 9
  },
  "codingCorrections": {
    "incorrectCodes": [
      {
        "currentCode": "E11.9",
        "suggestedCode": "E11.65",
        "reason": "Reason for correction",
        "documentationNeeded": "Required documentation",
        "severity": "medium"
      }
    ],
    "missingCodes": [
      {
        "suggestedCode": "Z87.891",
        "description": "Personal history of nicotine dependence",
        "rationale": "Reason for suggesting this code",
        "documentationNeeded": "Required documentation"
      }
    ],
    "severityAdjustments": [
      {
        "code": "I50.9",
        "currentSeverity": "01",
        "suggestedSeverity": "02",
        "rationale": "Documentation suggests more frequent symptoms",
        "explanation": {
          "whatItMeans": "The severity level should be increased from 01 (mild) to 02 (moderate) based on the patient's documented symptoms and condition",
          "whyImportant": "Accurate severity levels ensure appropriate care planning and can affect Medicare reimbursement rates",
          "howItAffectsCare": "Higher severity levels may require more intensive monitoring and care interventions",
          "implementation": "Update the severity level in the coding system and ensure documentation supports the new level"
        }
      }
    ],
    "sequencingImprovements": [
      {
        "currentSequence": ["S81.801S", "M17.11", "G30.9"],
        "suggestedSequence": ["S81.801S", "G30.9", "M17.11"],
        "rationale": "Alzheimer's disease has a greater impact on care needs",
        "explanation": {
          "whatItMeans": "The order of diagnosis codes should be changed to prioritize conditions that have the greatest impact on patient care and safety",
          "whyImportant": "Proper sequencing ensures healthcare providers focus on the most critical conditions first and can affect Medicare payment calculations",
          "howItAffectsCare": "Alzheimer's disease requires more comprehensive care planning and safety considerations than osteoarthritis",
          "implementation": "Reorder the diagnosis codes in the system to reflect the new sequence and update care plans accordingly"
        }
      }
    ]
  },
  "codingRecommendations": {
    "additionalCodes": [
      {
        "code": "Z51.11",
        "description": "Encounter for antineoplastic chemotherapy",
        "rationale": "Reason for suggesting this code",
        "priority": "medium"
      }
    ],
    "documentationRequirements": [
      {
        "requirement": "Specific documentation needed",
        "purpose": "Purpose of documentation",
        "priority": "high"
      }
    ],
    "complianceIssues": [
      {
        "issue": "Compliance issue description",
        "severity": "medium",
        "recommendation": "Recommendation to address issue"
      }
    ],
    "bestPractices": [
      {
        "practice": "Ensure all diagnoses are supported by clinical documentation",
        "explanation": {
          "whatItMeans": "Every diagnosis code must have corresponding evidence in the patient's medical record",
          "whyImportant": "Medicare requires documentation to support all coded conditions to prevent payment denials and ensure compliance",
          "howItAffectsCare": "Proper documentation ensures patients receive appropriate care and agencies receive fair reimbursement",
          "implementation": "Review medical records before coding, document specific symptoms and test results, and ensure all conditions are properly supported"
        }
      },
      {
        "practice": "Regularly update coding to reflect changes in patient's condition",
        "explanation": {
          "whatItMeans": "Update diagnosis codes as the patient's health status changes during their care episode",
          "whyImportant": "Accurate coding ensures appropriate care and reimbursement throughout the patient's treatment",
          "howItAffectsCare": "Ensures patients receive care appropriate to their current condition and prevents under-coding or over-coding",
          "implementation": "Review and update coding at each assessment, document changes, and ensure codes reflect current patient status"
        }
      }
    ]
  },
  "summary": {
    "totalIssues": 5,
    "criticalIssues": 1,
    "recommendations": 8,
    "complianceScore": 85,
    "riskLevel": "medium"
  },
  "confidence": 0.0-1.0,
  "analysisType": "coding-review",
  "timestamp": "YYYY-MM-DDTHH:MM:SS.fffZ"
}

CRITICAL: AI CONFIDENCE CALCULATION
The "confidence" field must reflect your assessment quality:
- 0.9-1.0 (90-100%): Excellent documentation, clear diagnoses, comprehensive coding validation
- 0.7-0.9 (70-89%): Good documentation, most codes validated, minor gaps identified
- 0.5-0.7 (50-69%): Moderate documentation, some validation challenges, multiple coding gaps
- 0.3-0.5 (30-49%): Poor documentation, significant coding issues, major compliance concerns
- 0.0-0.3 (0-29%): Inadequate documentation, extensive coding problems, serious compliance issues

Calculate confidence based on:
- Code accuracy and validity (ICD-10 compliance)
- Documentation completeness for diagnosis support
- Severity level appropriateness
- Sequencing alignment with clinical presentation
- Case mix weight optimization opportunities
- Compliance with OASIS-E1 requirements

IMPORTANT GUIDELINES:
1. Base all analysis on the actual clinical documentation provided
2. Follow current ICD-10-CM coding guidelines
3. Consider OASIS-E1 specific requirements
4. Provide specific, actionable recommendations
5. Ensure all codes are valid and current
6. Consider case mix weight implications
7. Address coding compliance requirements
8. Provide clear rationale for all suggestions
9. Ensure all JSON strings are properly escaped. Use double quotes for all string values. Do not include any trailing commas or invalid JSON syntax.
10. Focus on accuracy, completeness, and optimization of the coding to ensure proper reimbursement and compliance.

CRITICAL: Return ONLY valid JSON. Do not include any explanatory text, markdown formatting, or additional commentary outside the JSON structure.`;

    const userPrompt = `Coding Review Analysis Request

File Information:
- File Name: ${fileName}
- Content Length: ${content.length} characters
- Analysis Type: Data extraction accuracy
- Format: OASIS-E1 Assessment Document

Please analyze this OASIS-E1 assessment document and provide a comprehensive coding review focusing on ICD-10 code accuracy, completeness, and optimization. The document contains patient assessment data, diagnoses, and clinical information that requires coding analysis.

Document Content:
${content}

ANALYSIS REQUIREMENTS:

0. PATIENT INFORMATION EXTRACTION:
   - Extract patient name from M0040 (First Name, Last Name, Middle Initial, Suffix)
   - Extract MRN from patient identification section
   - Extract visit type from M0030 (SOC Date) and document type
   - Extract payor information from insurance/payment section
   - Extract visit date from M0030 (SOC Date) or M0090 (Date Assessment Completed)
   - Extract clinician name from signature section
   - Extract pay period from payment information
   - Extract status from visit type and assessment completion

1. PRIMARY DIAGNOSIS CODING:
   - Extract and validate the primary diagnosis code (M1021) - This is the main reason the patient needs home health care, like "diabetes" or "heart failure"
   - Assess severity level appropriateness (01, 02, 03) - Check if the severity level matches how sick the patient actually is (01=mild, 02=moderate, 03=severe)
   - Evaluate clinical documentation support - Make sure the medical record actually supports this diagnosis
   - Suggest alternative codes if applicable - Find more specific codes that better describe the patient's condition
   - Provide sequencing recommendations - Ensure the most important diagnosis is listed first

2. SECONDARY DIAGNOSES ANALYSIS:
   - Review all secondary diagnosis codes (M1023) - These are other health problems the patient has, like "high blood pressure" or "arthritis"
   - Validate severity levels for each code - Check if each condition's severity level is accurate (01=mild, 02=moderate, 03=severe)
   - Identify missing diagnoses based on clinical documentation - Find health problems mentioned in the notes but not coded
   - Assess comorbidity impact on case mix weight - See how these conditions affect how much Medicare pays for care
   - Recommend code specificity improvements - Suggest more detailed codes that better describe each condition

3. CODING CORRECTIONS:
   - Identify incorrect or inappropriate codes - Find diagnosis codes that don't match what's in the patient's medical record
   - Find missing codes based on clinical documentation - Discover health problems mentioned in notes but not coded
   - Suggest severity level adjustments - Recommend changing severity levels to better match the patient's actual condition
   - Recommend sequencing improvements - Suggest reordering diagnoses to put the most important ones first
   - Identify required clinical documentation - Point out what medical information is needed to support the codes

4. CODING RECOMMENDATIONS:
   - Suggest additional codes to consider - Recommend other diagnosis codes that could be added based on the patient's conditions
   - List documentation requirements for coding - Explain what medical information needs to be documented to support the codes

   - Identify coding compliance issues - Find problems that could cause Medicare to deny payment
   - Provide best practices for diagnosis coding - Share tips for accurate and complete coding

5. COMORBIDITY ANALYSIS:
   - Review M1028 Active Diagnoses section - Check the list of ongoing health problems that affect the patient's care
   - Validate comorbidity documentation - Make sure all ongoing health problems are properly documented
   - Assess impact on case mix weight - See how these ongoing conditions affect Medicare payment amounts
   - Identify missing comorbidity codes - Find ongoing health problems that should be coded but aren't

6. CLINICAL DOCUMENTATION REVIEW:
   - Assess clinical support for all coded conditions - Check if the medical record actually supports each diagnosis code
   - Identify documentation gaps - Find missing information that should be documented to support the codes
   - Recommend documentation improvements - Suggest what needs to be added to the medical record
   - Ensure coding compliance

IMPORTANT INSTRUCTIONS:
- Base all analysis on the actual clinical documentation provided - Only use information that's actually written in the patient's medical record
- Follow current ICD-10-CM coding guidelines - Use the official rules for medical diagnosis coding
- Consider OASIS-E1 specific requirements - Follow the special rules for home health assessment forms
- Provide specific, actionable recommendations - Give clear, step-by-step instructions that can be followed
- Ensure all codes are valid and current - Make sure all diagnosis codes are real and up-to-date
- Consider case mix weight implications - Think about how coding affects Medicare payment amounts
- Address coding compliance requirements - Make sure coding follows Medicare rules to avoid payment denials
- Provide clear rationale for all suggestions - Explain why each recommendation is being made, including:
  * What specific problem the recommendation solves
  * How it will improve patient care or documentation
  * What the financial impact will be (if applicable)
  * What documentation is needed to support the change
  * What the risks are if the recommendation is not followed
  * Step-by-step instructions on how to implement the recommendation
  * For sequencing improvements: Explain what each diagnosis code means, why the order matters, and how it affects patient care and reimbursement
  * For severity level changes: Explain what each severity level means (01=mild, 02=moderate, 03=severe) and why the change is needed
  * For missing codes: Explain what the condition is, how it affects the patient, and why it should be coded
  * For case mix weight: Explain what case mix weight means, how it's calculated, and why it matters for Medicare payments
  * For clinical documentation support: Explain what specific evidence in the medical record supports the diagnosis, what symptoms or findings are documented, and how this evidence justifies the coding
  * For sequencing recommendations: Explain why the current order is appropriate or needs to be changed, what the impact of the sequencing is on patient care and reimbursement, and how the sequencing follows Medicare guidelines
  * For best practices: Explain what each best practice means, why it's important for accurate coding, how it affects patient care and reimbursement, and provide specific examples of how to implement it

Return a comprehensive JSON analysis following the exact structure specified in the system prompt. Focus on accuracy, completeness, and optimization of the coding to ensure proper reimbursement and compliance.`;

    try {
      // Check if OpenAI client is available
      if (!this.openai) {
        throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
      }

      const response = await this.openai.chat.completions.create({
        model: aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      });

      const responseText = response.choices[0]?.message?.content || '';
      console.log('Coding Review Service: Raw response length:', responseText.length);
      console.log('Coding Review Service: Raw response preview:', responseText.substring(0, 500) + '...');

      // Parse the JSON response
      let analysisResult: CodingReviewResult;
      
      // First, try to clean the response to remove markdown formatting
      const cleanResponse = this.cleanJsonResponse(responseText);
      
      try {
        analysisResult = JSON.parse(cleanResponse);
      } catch (jsonError) {
        console.error('Coding Review Service: JSON parse error after cleaning:', jsonError);
        console.error('Coding Review Service: Problematic JSON snippet:', cleanResponse.substring(Math.max(0, 9891-200), 9891+200));
        
        // Try progressive extraction and recovery
        analysisResult = this.extractPartialJSON(responseText);
        
        if (!analysisResult) {
          console.error('Coding Review Service: All JSON recovery attempts failed - creating fallback response');
          analysisResult = this.createCodingFallbackResult(responseText);
        }
      }


      // Validate that AI provided confidence score
      if (typeof analysisResult.confidence === 'undefined' || analysisResult.confidence === null) {
        console.log('Coding Review Service: AI did not provide confidence, calculating fallback score');
        const fallbackConfidence = this.calculateCodingConfidence(analysisResult, responseText.length);
        analysisResult.confidence = fallbackConfidence;
      }

      // Ensure analysisType and timestamp are set
      if (!analysisResult.analysisType) {
        analysisResult.analysisType = 'coding-review';
      }
      if (!analysisResult.timestamp) {
        analysisResult.timestamp = new Date().toISOString();
      }

      // Add confidence to summary for backward compatibility
      if (analysisResult.summary) {
        analysisResult.summary.aiConfidence = analysisResult.confidence;
      }
      
      console.log(`Coding Review Service: AI Confidence Score: ${analysisResult.confidence.toFixed(2)}`);
      console.log('Coding Review Service: Analysis completed successfully');
      return analysisResult;

    } catch (error) {
      console.error('Coding Review Service: Analysis failed:', error);
      throw new Error(`Coding review analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private cleanJsonResponse(response: string): string {
    console.log('Coding Review Service: Cleaning JSON response...');
    console.log('Coding Review Service: Original response length:', response.length);
    
    // First, try to extract clean JSON from the response
    let cleanResponse = this.extractJSONPortion(response);
    
    // Remove any markdown formatting carefully
    cleanResponse = cleanResponse
      .replace(/```json\s*/g, '') 
      .replace(/```\s*/g, '') 
      .trim();
    
    // Fix only essential JSON issues without corrupting
    cleanResponse = this.fixJSONSyntax(cleanResponse);
    
    console.log('Coding Review Service: Cleaned response length:', cleanResponse.length);
    console.log('Coding Review Service: Cleaned response preview:', cleanResponse.substring(0, 500) + '...');
    
    return cleanResponse;
  }

  private extractJSONPortion(response: string): string {
    // Find the first complete JSON object
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;
    let start = -1;
    
    for (let i = 0; i < response.length; i++) {
      const char = response[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\' && inString) {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' && !inString) {
        inString = true;
        continue;
      } else if (char === '"' && inString && !escapeNext) {
        inString = false;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          if (braceCount === 0) start = i;
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0 && start !== -1) {
            // Found complete JSON object
            return response.substring(start, i + 1);
          }
        }
      }
    }
    
    // If no complete object found, return original
    return response;
  }

  private fixJSONSyntax(jsonString: string): string {
    let fixed = jsonString;
    
    try {
      // Test if it's already valid
      JSON.parse(fixed);
      return fixed;
    } catch (e) {
      console.log('Coding Review Service: JSON needs fixing, attempting repairs...');
    }
    
    // Fix only specific issues that won't corrupt the JSON
    
    // 1. Remove trailing commas
    fixed = fixed.replace(/,\s*([}\]])/g, '$1');
    
    // 2. Fix unquoted keys (carefully)
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

    // 3. Replace invalid values
    fixed = fixed.replace(/\bundefined\b/g, '"undefined"');
    fixed = fixed.replace(/\bNaN\b/g, '"NaN"');
    fixed = fixed.replace(/\bInfinity\b/g, '"Infinity"');
    
    // 4. Escape problematic characters in strings (but preserve JSON structure)
    const escaped = this.escapeJSONStrings(fixed);
    
    return escaped;
  }

  private escapeJSONStrings(jsonString: string): string {
    // This method carefully escapes characters inside JSON string values
    // without breaking the JSON structure
    
    let result = jsonString;
    let i = 0;
    let inString = false;
    let escapeNext = false;
    
    while (i < result.length) {
      const char = result[i];
      
      if (escapeNext) {
        escapeNext = false;
        i++;
        continue;
      }
      
      if (char === '\\' && inString) {
        escapeNext = true;
        i++;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        i++;
        continue;
      }
      
      if (inString) {
        // We're inside a string, escape problematic characters
        if (char === '\n') {
          result = result.substring(0, i) + '\\n' + result.substring(i + 1);
          i += 2;
        } else if (char === '\r') {
          result = result.substring(0, i) + '\\r' + result.substring(i + 1);
          i += 2;
        } else if (char === '\t') {
          result = result.substring(0, i) + '\\t' + result.substring(i + 1);
          i += 2;
        } else if (char >= '\x00' && char <= '\x1F') {
          // Control characters - remove them
          result = result.substring(0, i) + result.substring(i + 1);
        } else {
          i++;
        }
      } else {
        i++;
      }
    }
    
    return result;
  }

  private extractPartialJSON(responseText: string): any {
    console.log('Coding Review Service: Attempting progressive JSON reconstruction...');
    
    try {
      // Try to extract core components one by one
      const result: any = {};
      
      // Extract patient info
      const patientMatch = responseText.match(/"patientInfo"\s*:\s*{([\s\S]*?)}/);
      if (patientMatch) {
        try {
          const patientJson = '{"patientInfo": {' + patientMatch[1] + '}}';
          const cleaned = this.fixJSONSyntax(patientJson);
          const parsed = JSON.parse(cleaned);
          result.patientInfo = parsed.patientInfo || {
            patientName: 'Unknown Patient',
            mrn: 'Unknown',
            visitType: 'Unknown',
            payor: 'Unknown',
            visitDate: 'Unknown',
            clinician: 'Unknown',
            payPeriod: 'Unknown',
            status: 'Unknown'
          };
        } catch (e) {
          result.patientInfo = {
            patientName: 'Unknown Patient',
            mrn: 'Unknown',
            visitType: 'Unknown',
            payor: 'Unknown',
            visitDate: 'Unknown',
            clinician: 'Unknown',
            payPeriod: 'Unknown',
            status: 'Unknown'
          };
        }
      }
      
      // Extract primary diagnosis (simplified)
      const primaryMatch = responseText.match(/"primaryDiagnosisCoding"\s*:\s*{[\s\S]*?"currentCode"\s*:\s*"([^"]*)"[\s\S]*?}/);
      if (primaryMatch) {
        result.primaryDiagnosisCoding = {
          currentCode: primaryMatch[1],
          currentDescription: 'Analysis partially recovered',
          severityLevel: 'Unknown',
          clinicalSupport: 'Partial data extraction - JSON parsing failed at position 9891',
          alternativeCodes: [],
          sequencingRecommendations: {
            recommendation: 'Manual review recommended due to parsing issues',
            explanation: {
              whatItMeans: 'Analysis incomplete',
              whyImportant: 'Data integrity issue occurred',
              howItAffectsCare: 'Requires manual verification',
              implementation: 'Review original document manually'
            }
          }
        };
      }
      
      // Try to extract summary metrics
      const totalIssuesMatch = responseText.match(/"totalIssues"\s*:\s*(\d+)/);
      const criticalIssuesMatch = responseText.match(/"criticalIssues"\s*:\s*(\d+)/);
      const riskLevelMatch = responseText.match(/"riskLevel"\s*:\s*"([^"]*)"/);
      
      result.summary = {
        totalIssues: totalIssuesMatch ? parseInt(totalIssuesMatch[1]) : 0,
        criticalIssues: criticalIssuesMatch ? parseInt(criticalIssuesMatch[1]) : 0,
        recommendations: 0,
        complianceScore: 75, // Default moderate score
        riskLevel: riskLevelMatch ? riskLevelMatch[1] : 'medium'
      };
      
      // Add empty sections for completeness
      result.secondaryDiagnosesAnalysis = { codes: [] };
      result.codingCorrections = { incorrectCodes: [], missingCodes: [], severityAdjustments: [] };
      result.codingRecommendations = { 
        additionalCodes: [], 
        bestPractices: [],
      };
      
      // Add confidence score to progressive result
      result.confidence = 0.6; // Moderate confidence for partial recovery
      result.analysisType = 'coding-review-progressive';
      result.timestamp = new Date().toISOString();
      
      console.log('Coding Review Service: Progressive reconstruction completed');
      return result;
      
    } catch (error) {
      console.error('Coding Review Service: Progressive reconstruction failed:', error);
      return null;
    }
  }

  private createCodingFallbackResult(responseText: string): any {
    console.log('Coding Review Service: Creating fallback response due to JSON parsing failure');
    
    return {
      patientInfo: {
        patientName: 'Data Extraction Failed',
        patientId: 'UNKNOWN',
        mrn: 'UNKNOWN',
        visitType: 'Unknown',
        payor: 'Unknown',
        visitDate: 'Unknown',
        clinician: 'Unknown',
        payPeriod: 'Unknown',
        status: 'Analysis Failed'
      },
      primaryDiagnosisCoding: {
        currentCode: 'UNKNOWN',
        currentDescription: 'JSON parsing failed - manual review required',
        severityLevel: 'Unknown',
        clinicalSupport: 'Automatic analysis failed due to malformed JSON response from AI model.',
        alternativeCodes: [],
        sequencingRecommendations: {
          recommendation: 'Manual review recommended due to parsing issues',
          explanation: {
            whatItMeans: 'AI response contained malformed JSON',
            whyImportant: 'Automated analysis could not proceed',
            howItAffectsCare: 'Requires manual verification of all coding',
            implementation: 'Use manual coding review process'
          }
        }
      },
      secondaryDiagnosesAnalysis: {
        codes: []
      },
      codingCorrections: {
        incorrectCodes: [],
        missingCodes: [],
        severityAdjustments: []
      },
      codingRecommendations: {
        additionalCodes: [],
        bestPractices: [],
      },
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        recommendations: 0,
        complianceScore: 0,
        riskLevel: 'medium' as const
      },
      confidence: 0.1, // Low confidence for fallback responses
      analysisType: 'coding-review-fallback',
      timestamp: new Date().toISOString()
    };
  }

  private extractJsonFromResponse(response: string): string | null {
    console.log('Coding Review Service: Attempting manual JSON extraction...');
    
    // Find the first occurrence of { and last occurrence of }
    const firstBrace = response.indexOf('{');
    const lastBrace = response.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
      console.error('Coding Review Service: No valid JSON boundaries found');
      return null;
    }
    
    // Extract the JSON portion
    let jsonCandidate = response.substring(firstBrace, lastBrace + 1);
    
    // Validate that it starts and ends with braces
    if (!jsonCandidate.startsWith('{') || !jsonCandidate.endsWith('}')) {
      console.error('Coding Review Service: Invalid JSON boundaries');
      return null;
    }
    
    // Try to clean the extracted JSON
    jsonCandidate = this.cleanJsonResponse(jsonCandidate);
    
    // Validate JSON structure by counting braces
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < jsonCandidate.length; i++) {
      const char = jsonCandidate[i];
      
      if (escapeNext) {
        escapeNext = false;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        continue;
      }
      
      if (char === '"' && !escapeNext) {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }
      }
    }
    
    if (braceCount !== 0) {
      console.error('Coding Review Service: Unbalanced braces in extracted JSON');
      return null;
    }
    
    console.log('Coding Review Service: Manual JSON extraction successful');
    return jsonCandidate;
  }

  // Helper method to calculate coding confidence score
  calculateCodingConfidence(result: CodingReviewResult, responseLength: number = 0): number {
    let confidence = 0.5; // Base confidence
    
    try {
      // Factor 1: Coding Quality Assessment (0-0.3 points)
      const codingQuality = this.assessCodingQuality(result);
      confidence += codingQuality;
      
      // Factor 2: Data Completeness (0-0.2 points)
      const completeness = this.assessCodingCompleteness(result);
      confidence += completeness;
      
      // Factor 3: Structural Quality (0-0.2 points)
      const structure = this.assessCodingStructure(result);
      confidence += structure;
      
      // Factor 4: Response Adequacy (0-0.2 points)
      const adequacy = this.assessCodingAdequacy(result, responseLength);
      confidence += adequacy;
      
      // Bonus/Penalty for specifics
      confidence += this.getCodingAdjustments(result);
      
    } catch (error) {
      console.log('Coding Review Service: Error calculating confidence, using baseline');
      confidence = 0.3; // Lower baseline if calculation fails
    }
    
    return Math.min(1.0, Math.max(0.0, confidence));
  }

  private assessCodingQuality(result: CodingReviewResult): number {
    let score = 0;
    
    // Check required fields present and not null/empty (QA Review style)
    const expectedFields = ['patientName', 'mrn', 'visitType', 'payor'];
    const patientFieldsValid = expectedFields.every(field => 
      result.patientInfo && 
      result.patientInfo[field as keyof typeof result.patientInfo] && 
      result.patientInfo[field as keyof typeof result.patientInfo] !== ''
    );
    if (patientFieldsValid) {
      score += 0.1; // Bonus for all patient fields present
    }
    
    // Check if primary diagnosis analysis is present
    if (result.primaryDiagnosisCoding && result.primaryDiagnosisCoding.currentCode && result.primaryDiagnosisCoding.currentCode !== '') {
      score += 0.05;
      
      // Validate code format (ICD-10 should be like S81.801S)
      if (/^[A-Z]\d{2}\.\d{4}[A-Z]?$/.test(result.primaryDiagnosisCoding.currentCode)) {
        score += 0.05;
      }
      
      // Check for clinical support assessment
      if (result.primaryDiagnosisCoding.clinicalSupport && result.primaryDiagnosisCoding.clinicalSupport.length > 50) {
        score += 0.05;
      }
      
      // Check severity level validity (QA Review style validation)
      if (result.primaryDiagnosisCoding.severityLevel && 
          ['1', '2', '3', '4', '5'].includes(result.primaryDiagnosisCoding.severityLevel)) {
        score += 0.05;
      }
    }
    
    // Check secondary diagnoses analysis
    if (result.secondaryDiagnosesAnalysis && result.secondaryDiagnosesAnalysis.codes && Array.isArray(result.secondaryDiagnosesAnalysis.codes)) {
      score += 0.05;
      
      // Validate that secondary codes have proper format
      const validCodes = result.secondaryDiagnosesAnalysis.codes.filter(code => 
        code.code && /^[A-Z]\d{2}\.\d{4}[A-Z]?$/.test(code.code)
      );
      if (validCodes.length > 0) score += 0.05;
    }
    
    
    return Math.min(0.3, score);
  }

  private assessCodingCompleteness(result: CodingReviewResult): number {
    let score = 0;
    
    // Essential sections present
    const requiredSections = ['patientInfo', 'primaryDiagnosisCoding', 'secondaryDiagnosesAnalysis', 'codingCorrections', 'codingRecommendations'];
    requiredSections.forEach(section => {
      if (result[section as keyof CodingReviewResult]) {
        score += 0.02;
      }
    });
    
    // Patient info completeness
    if (result.patientInfo) {
      const patientFields: (keyof typeof result.patientInfo)[] = ['patientName', 'mrn', 'visitType', 'payor'];
      let completedFields = 0;
      patientFields.forEach(field => {
        if (result.patientInfo![field] && result.patientInfo![field] !== '') {
          completedFields++;
        }
      });
      score += (completedFields / patientFields.length) * 0.05; // Up to 0.05 points
    }
    
    // Summary completeness
    if (result.summary && typeof result.summary === 'object') {
      const summaryFields: (keyof typeof result.summary)[] = ['totalIssues', 'criticalIssues', 'recommendations', 'complianceScore', 'riskLevel'];
      let completedSummaryFields = 0;
      summaryFields.forEach(field => {
        if (result.summary[field] !== undefined && result.summary[field] !== null) {
          completedSummaryFields++;
        }
      });
      score += (completedSummaryFields / summaryFields.length) * 0.05; // Up to 0.05 points
    }
    
    return Math.min(0.2, score);
  }

  private assessCodingStructure(result: CodingReviewResult): number {
    let score = 0;
    
    // Array structures
    if (Array.isArray(result.codingCorrections?.incorrectCodes)) score += 0.02;
    if (Array.isArray(result.codingCorrections?.missingCodes)) score += 0.02;
    if (Array.isArray(result.codingCorrections?.severityAdjustments)) score += 0.02;
    if (Array.isArray(result.codingRecommendations?.additionalCodes)) score += 0.02;
    if (Array.isArray(result.codingRecommendations?.bestPractices)) score += 0.02;
    
    
    // Nested explanations (shows depth of analysis)
    if (result.primaryDiagnosisCoding?.sequencingRecommendations?.explanation) {
      score += 0.05; // Shows structured explanation
    }
    
    return Math.min(0.2, score);
  }

  private assessCodingAdequacy(result: CodingReviewResult, responseLength: number): number {
    let score = 0;
    
    // Response length assessment (QA Review optimized ranges)
    if (responseLength >= 8000 && responseLength <= 15000) {
      score += 0.1; // Optimal range for coding analysis (QA Review style)
    } else if (responseLength >= 5000 && responseLength < 25000) {
      score += 0.08; // Good range
    } else if (responseLength >= 2000 && responseLength < 35000) {
      score += 0.05; // Acceptable range
    } else if (responseLength >= 1000) {
      score += 0.03; // Minimum viable
    }
    
    // Adequacy of corrections provided
    const correctionsCount = (result.codingCorrections?.incorrectCodes?.length || 0) + 
                           (result.codingCorrections?.missingCodes?.length || 0) +
                           (result.codingCorrections?.severityAdjustments?.length || 0);
    if (correctionsCount >= 3) score += 0.05;
    else if (correctionsCount >= 1) score += 0.03;
    
    // Adequacy of recommendations
    const recommendationsCount = (result.codingRecommendations?.additionalCodes?.length || 0) +
                               (result.codingRecommendations?.bestPractices?.length || 0);
    if (recommendationsCount >= 2) score += 0.05;
    else if (recommendationsCount >= 1) score += 0.03;
    
    return Math.min(0.2, score);
  }

  private getCodingAdjustments(result: CodingReviewResult): number {
    let adjustment = 0;
    
    
    // Bonus for detailed explanations
    let explanationCount = 0;
    if (result.primaryDiagnosisCoding?.sequencingRecommendations?.explanation) explanationCount++;
    if (result.codingCorrections?.severityAdjustments?.some(adj => adj.explanation)) explanationCount++;
    if (result.codingRecommendations?.bestPractices?.some(bp => bp.explanation)) explanationCount++;
    
    if (explanationCount >= 2) adjustment += 0.05;
    
    // Bonus for multiple secondary diagnoses (QA Review style)
    if (result.secondaryDiagnosesAnalysis?.codes && 
        Array.isArray(result.secondaryDiagnosesAnalysis.codes) && 
        result.secondaryDiagnosesAnalysis.codes.length >= 3) {
      adjustment += 0.05;
    }
    
    // Bonus for both corrections and recommendations (QA Review style)
    if (result.codingCorrections && result.codingRecommendations && 
        ((result.codingCorrections.incorrectCodes?.length || 0) + 
         (result.codingCorrections.missingCodes?.length || 0) > 0) &&
        (result.codingRecommendations.additionalCodes?.length || 0) > 0) {
      adjustment += 0.05;
    }
    
    // Penalty for too much "N/A" or "Unknown" data (QA Review style)
    const nullValues = Object.values(result).filter(val => 
      val === 'N/A' || val === 'Unknown' || val === null || val === ''
    );
    if (nullValues.length > Object.keys(result).length * 0.5) {
      adjustment -= 0.1; // High percentage of missing data
    }
    
    return adjustment;
  }
}

export default CodingReviewService;
