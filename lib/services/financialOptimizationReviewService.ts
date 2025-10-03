import OpenAI from 'openai';

export interface FinancialOptimizationResult {
  analysisType?: string;
  timestamp?: string;
  confidence?: number;  
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
  serviceOptimization: {
    resourceAnalysis: {
      serviceComponents: Array<{
        serviceType: string;
        currentUtilization: string;
        optimizedUtilization: string;
        revenueImpact: string;
      }>;
      optimizationOpportunities: Array<{
        opportunity: string;
        revenueImpact: string;
        implementation: string;
      }>;
    };
    serviceBundleOptimization: string;
    resourceMaximization: string;
    timingOptimization: string;
    payerSpecificOptimization: string;
    serviceIntensityOptimization: string;
  };
  paymentSourceAnalysis: {
    currentPaymentSource: string;
    medicareOptimization: string;
    managedCareAnalysis: string;
    medicaidProgramAnalysis: string;
    privateInsuranceConsiderations: string;
    benefitsComparison: string;
  };
  financialRecommendations: {
    revenueStrategies: Array<{
      strategy: string;
      potentialIncrease: string;
      implementation: string;
      roi: string;
    }>;
    documentationImprovements: Array<{
      improvement: string;
      revenueImpact: string;
      effort: 'low' | 'medium' | 'high';
    }>;
    serviceAdditions: Array<{
      service: string;
      revenueIncrease: string;
      resourceRequired: string;
      patientEligibility: string;
    }>;
    paymentOptimization: Array<{
      optimization: string;
      currentRate: string;
      optimizedRate: string;
      annualImpact: string;
    }>;
    riskAssessment: string;
    roiCalculations: string;
  };
  caseMixAnalysis: {
    currentWeight: string;
    potentialWeight: string;
    impact: string;
    hippsClassification: {
      hippsCode: string;
      clinicalGroup: string;
      functionalLevel: string;
      admissionSource: string;
      episodeTiming: string;
      comorbidityAdjustment: string;
      medicareWeight: string;
      lupaThreshold: string;
    };
    calculation: {
      baseWeight: string;
      primaryDiagnosisWeight: string;
      secondaryDiagnosesWeight: string;
      severityAdjustments: string;
      comorbidityImpact: string;
      functionalStatusImpact: string;
      riskFactorsImpact: string;
    };
    optimization: {
      missingCodes: Array<{
        code: string;
        description: string;
        weightImpact: string;
        rationale: string;
      }>;
      severityImprovements: Array<{
        code: string;
        currentSeverity: string;
        suggestedSeverity: string;
        weightImpact: string;
        rationale: string;
      }>;
      comorbidityAdditions: Array<{
        code: string;
        description: string;
        weightImpact: string;
        rationale: string;
      }>;
    };
    recommendations: string[];
  };
  summary: {
    currentRevenuePotential: number;
    optimizedRevenuePotential: number;
    revenueIncrease: number;
    optimizationOpportunities: number;
    riskLevel: 'low' | 'medium' | 'high';
    aiConfidence: number;
  };
}

class FinancialOptimizationReviewService {
  private openai: OpenAI | null;

  constructor() {
    // Initialize OpenAI client
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'placeholder-key') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn('OPENAI_API_KEY environment variable is not set or is placeholder. Financial optimization features will not work.');
      this.openai = null;
    }
  }

  async analyzeFinancialOptimization(
    content: string,
    fileName: string,
    aiModel: 'gpt-5-nano' = 'gpt-5-nano'
  ): Promise<FinancialOptimizationResult> {
    console.log('Financial Optimization Review Service: Starting analysis for:', fileName);
    console.log('Financial Optimization Review Service: Content length:', content.length);

    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please check OPENAI_API_KEY environment variable.');
    }

    try {
      const systemPrompt = this.getSystemPrompt();
      const userPrompt = this.getUserPrompt(content, fileName);

      console.log('Financial Optimization Review Service: Making OpenAI API call');
      const response = await this.openai.chat.completions.create({
        model: aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      });

      const responseText = response.choices[0].message.content;
      console.log('Financial Optimization Review Service: Received response, length:', responseText?.length || 0);
      console.log('Financial Optimization Review Service: Raw response preview:', responseText?.substring(0, 1000) + '...');

      if (!responseText) {
        throw new Error('No response received from OpenAI');
      }

      // Parse the JSON response with robust error handling
      let analysisResult: FinancialOptimizationResult;
      try {
        // For very large responses, add timeout protection
        if (responseText.length > 100000) {
          console.log('Financial Optimization Review Service: Very large response detected, using timeout protection');
          analysisResult = await this.parseJsonWithTimeout(responseText, 5000); // 5 second timeout
        } else {
        analysisResult = JSON.parse(responseText);
        }
        console.log('Financial Optimization Review Service: AI analysisType from response:', analysisResult.analysisType);
        console.log('Financial Optimization Review Service: Full AI response keys:', Object.keys(analysisResult));
        console.log('Financial Optimization Review Service: Full AI response structure:');
        console.log(JSON.stringify(analysisResult, null, 2));
      } catch (parseError) {
        console.log('Financial Optimization Review Service: JSON parse error:', parseError);
        console.log('Financial Optimization Review Service: Starting JSON cleaning...');
        
        // Try to clean the JSON response
        const cleanedJson = this.cleanJsonResponse(responseText);
        console.log('Financial Optimization Review Service: Extracted JSON section length:', cleanedJson.length);
        console.log('Financial Optimization Review Service: JSON cleaning completed');
        
        try {
        analysisResult = JSON.parse(cleanedJson);
        console.log('Financial Optimization Review Service: Parsed cleaned response analysisType:', analysisResult.analysisType);
        } catch (secondError) {
          console.log('Financial Optimization Review Service: Second parse attempt failed:', secondError);
          
          // For extremely large JSON, try progressive parsing
          if (cleanedJson.length > 20000) {
            console.log('Financial Optimization Review Service: Attempting progressive JSON extraction for very large response');
            
            try {
              analysisResult = this.progressiveJsonParse(cleanedJson);
              console.log('Financial Optimization Review Service: Progressive parsing successful');
            } catch (progressiveError) {
              console.log('Financial Optimization Review Service: Progressive parsing failed:', progressiveError);
              throw secondError; // Fall back to original error
            }
          } else {
            throw secondError;
          }
        }
      }

      // Calculate AI confidence
      const confidenceScore = this.calculateFinancialConfidence(analysisResult, responseText.length);
      
      // Force correct analysisType for financial optimization
      if (!analysisResult.analysisType || analysisResult.analysisType !== 'financial-optimization') {
        console.log('Financial Optimization Review Service: AI did not set correct analysisType, forcing to financial-optimization');
        analysisResult.analysisType = 'financial-optimization';
      }

      // Validate that AI provided confidence score
      if (typeof analysisResult.confidence === 'undefined' || analysisResult.confidence === null) {
        console.log('Financial Optimization Review Service: AI did not provide confidence, calculating fallback score');
        analysisResult.confidence = confidenceScore;
      }

      console.log(`Financial Optimization Review Service: Final analysisType: ${analysisResult.analysisType}`);
      console.log(`Financial Optimization Review Service: AI Confidence Score: ${analysisResult.confidence.toFixed(2)}`);
      console.log('Financial Optimization Review Service: Analysis completed successfully');
      
      return analysisResult;

    } catch (error) {
      console.error('Financial Optimization Review Service: Analysis failed:', error);
      throw new Error(`Financial optimization analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getSystemPrompt(): string {
    return `You are an expert financial optimization analyst specializing in healthcare reimbursement analysis for OASIS-E1 assessments and home health documentation. Your expertise includes:

1. HIPPS (Home Health Insurance Prospective Payment System) coding and optimization
2. Medicare home health payment methodology and case mix weight calculations
3. Revenue optimization for home health agencies
4. Financial impact analysis of patient documentation and coding accuracy
5. Service classification and resource utilization optimization
6. Documentation improvement strategies for enhanced reimbursement

💰 FINANCIAL OPTIMIZATION ANALYSIS REQUIREMENTS:

UNIVERSAL OASIS ASSESSMENT ANALYSIS:
- Analyze ANY type of OASIS assessment document (SOC, ROC, Follow-Up, Discharge)
- Extract comprehensive financial optimization data regardless of document version
- Apply flexible data extraction that works with various field names and formats
- Focus on document content relevance rather than specific field codes


SERVICE OPTIMIZATION:
- Review service component utilization and efficiency opportunities
- Identify service bundling strategies for improved revenue
- Analyze timing and intensity optimization potential
- Assess payer-specific optimization strategies for better reimbursement

PAYMENT SOURCE ANALYSIS:
- Extract payment source information and impact on reimbursement rates
- Analyze Medicare optimization opportunities for maximum revenue
- Review managed care and Medicaid program considerations
- Assess private insurance and commercial payer optimization strategies

CASE MIX WEIGHT OPTIMIZATION:
- Extract comprehensive Medicare Case Mix Weight data from OASIS-E1 fields
- Calculate current weight using detailed methodology: Primary diagnosis + Secondary diagnoses + Functional status + Cognitive impairment + Risk factors + Comorbidities
- Identify missing diagnosis codes from vital signs, clinical findings, and documented symptoms
- Assess severity level upgrades based on clinical evidence vs current coding
- Suggest comorbidity additions based on patient complexity
- Provide specific weight impacts with dollar revenue calculations per diagnosis/code
- Generate detailed implementation recommendations with measurable financial returns

FINANCIAL RECOMMENDATIONS:
- Generate actionable implementation guidance based on identified optimization opportunities:
  * Coding Enhancement: Specific steps for implementing identified missing diagnosis codes
  * Documentation Improvement: Clear instructions for capturing clinical evidence to support severity upgrades
  * Process Optimization: Recommendations for improving assessment consistency and coding accuracy
  * Training Priorities: Staff education focus areas for maximizing revenue capture
  * Quality Assurance: Audit and review procedures to ensure optimization gains
- Calculate measurable financial impact for each recommendation category
- Prioritize recommendations by implementation difficulty, revenue impact, and compliance risk
- Provide implementation timeline and resource requirements for each suggestion

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
  "serviceOptimization": {
    "resourceAnalysis": {
      "serviceComponents": [
        {
          "serviceType": "Nursing Services",
          "currentUtilization": "Weekly visits",
          "optimizedUtilization": "Twice weekly",
          "revenueImpact": "$200"
        }
      ],
      "optimizationOpportunities": [
        {
          "opportunity": "Enhanced wound care documentation",
          "revenueImpact": "$150",
          "implementation": "Standardize wound measurement documentation"
        }
      ]
    },
    "serviceBundleOptimization": "Current services are appropriately bundled but documentation enhancement needed",
    "resourceMaximization": "Staff utilization optimal with current visit frequency",
    "timingOptimization": "Current visit timing appropriate for wound care management",
    "payerSpecificOptimization": "Medicare Advantage optimization focused on documentation completeness",
    "serviceIntensityOptimization": "Service intensity appropriate but can be enhanced with better documentation"
  },
  "paymentSourceAnalysis": {
    "currentPaymentSource": "Medicare Advantage",
    "medicareOptimization": "Standard Medicare home health billing with enhanced documentation opportunities",
    "managedCareAnalysis": "Managed care utilization review requirements met",
    "medicaidProgramAnalysis": "Not applicable - Medicare Advantage patient",
    "privateInsuranceConsiderations": "Standard private pay considerations for supplemental services",
    "benefitsComparison": "Medicare Advantage provides comprehensive coverage for skilled home health"
  },
  "financialRecommendations": {
    "revenueStrategies": [
      {
        "strategy": "Enhanced functional status documentation",
        "potentialIncrease": "$300/episode",
        "implementation": "Train staff on detailed ADL assessment documentation",
        "roi": "20% revenue increase"
      }
    ],
    "documentationImprovements": [
      {
        "improvement": "Detailed ADL assessment documentation",
        "revenueImpact": "$300/episode",
        "effort": "medium"
      }
    ],
    "serviceAdditions": [
      {
        "service": "Enhanced wound care documentation",
        "revenueIncrease": "$150/episode",
        "resourceRequired": "Additional training time",
        "patientEligibility": "All patients with wound care needs"
      }
    ],
    "paymentOptimization": [
      {
        "optimization": "Upgrade functional status coding",
        "currentRate": "$2,650",
        "optimizedRate": "$2,950",
        "annualImpact": "$1,800"
      }
    ],
    "riskAssessment": "Low risk for documentation enhancement with appropriate training",
    "roiCalculations": "Training investment: $500; Annual return: $1,800 (260% ROI)"
  },
  "caseMixAnalysis": {
    "currentWeight": "1.438",
    "potentialWeight": "1.521",
    "impact": "+$409 per episode (+15.3% revenue increase). Current weight based on primary diagnosis severity Level 3 with comprehensive secondary diagnoses.",
    "hippsClassification": {
      "hippsCode": "1CC21",
      "clinicalGroup": "Wound Care",
      "functionalLevel": "High",
      "admissionSource": "Community",
      "episodeTiming": "Early", 
      "comorbidityAdjustment": "Single",
      "medicareWeight": "1.5600",
      "lupaThreshold": "4"
    },
    "calculation": {
      "baseWeight": "1.0000",
      "primaryDiagnosisWeight": "0.20",
      "secondaryDiagnosesWeight": "0.140",
      "severityAdjustments": "0.032",
      "comorbidityImpact": "0.028",
      "functionalStatusImpact": "0.15",
      "riskFactorsImpact": "0.02",
      "cognitiveImpact": "0.072"
    },
    "optimization": {
      "missingCodes": [
        {
          "code": "I10",
          "description": "Essential hypertension",
          "weightImpact": "+0.035",
          "rationale": "Documented elevated blood pressure readings support hypertension diagnosis code"
        },
        {
          "code": "J44.1",
          "description": "COPD with acute exacerbation",
          "weightImpact": "+0.042",
          "rationale": "Decreased oxygen saturation and increased respiratory symptoms indicate exacerbation"
        },
        {
          "code": "L03.x",
          "description": "Cellulitis",
          "weightImpact": "+0.028",
          "rationale": "Clinical findings consistent with soft tissue infection requiring additional coding"
        }
      ],
      "severityImprovements": [
        {
          "code": "E11.9",
          "currentSeverity": "02",
          "suggestedSeverity": "03",
          "weightImpact": "+0.018",
          "rationale": "Clinical evidence suggests higher severity level supported by patient condition data"
        },
        {
          "code": "I50.9",
          "currentSeverity": "01", 
          "suggestedSeverity": "02",
          "weightImpact": "+0.024",
          "rationale": "Functional assessment findings support increased severity documentation requirements"
        },
        {
          "code": "F02.84",
          "currentSeverity": "01",
          "suggestedSeverity": "02",
          "weightImpact": "+0.021",
          "rationale": "Cognitive testing results indicate higher impairment level than currently documented"
        }
      ],
      "comorbidityAdditions": [
        {
          "code": "G89.2",
          "description": "Chronic pain syndrome",
          "weightImpact": "+0.025",
          "rationale": "Documented ongoing pain management needs consistent with chronic pain syndrome"
        },
        {
          "code": "Z96.x",
          "description": "Presence of artificial joint/surgical implant",
          "weightImpact": "+0.018",
          "rationale": "History and functional limitations suggest presence of prosthetic devices"
        },
        {
          "code": "Z91.x",
          "description": "Patient's noncompliance with medical treatment",
          "weightImpact": "+0.012",
          "rationale": "Clinical documentation indicates treatment adherence challenges"
        }
      ]
    },
    "recommendations": [
      "Add hypertension coding (I10) based on documented blood pressure readings for additional revenue",
      "Implement COPD exacerbation coding (J44.1) due to respiratory compromise indicators",
      "Document skin condition coding (L03.x) for observable soft tissue changes", 
      "Upgrade diabetes severity documentation to reflect clinical severity levels",
      "Improve heart failure severity documentation to match functional limitations",
      "Enhance cognitive impairment documentation with detailed assessment findings",
      "Consider chronic pain syndrome coding based on pain management requirements",
      "Verify and document surgical/prosthetic device history for appropriate Z-codes",
      "Implement comprehensive ADL documentation training for maximum functional status weights"
    ]
  },
  "summary": {
    "currentRevenuePotential": 2671,
    "optimizedRevenuePotential": 3050,
    "revenueIncrease": 379,
    "optimizationOpportunities": 8,
    "riskLevel": "medium",
    "aiConfidence": 0.87
  },
  "confidence": 0.87,
  "analysisType": "financial-optimization",
  "timestamp": "YYYY-MM-DDTHH:MM:SS.fffZ"
}

CRITICAL: AI CONFIDENCE CALCULATION
The "confidence" field must reflect your assessment quality:
- 0.9-1.0 (90-100%): Excellent documentation, clear service classification, comprehensive financial analysis
- 0.7-0.9 (70-89%): Good documentation, most financial factors validated, minor optimization gaps
- 0.5-0.7 (50-69%): Moderate documentation, some financial analysis challenges, multiple optimization gaps
- 0.3-0.5 (30-49%): Poor documentation, significant financial optimization issues, major revenue concerns
- 0.0-0.3 (0-29%): Inadequate documentation, extensive financial problems, serious revenue optimization issues

Calculate confidence based on:
- Payment code accuracy and optimization potential
- Documentation completeness for service support
- Revenue calculation accuracy and projections
- Service utilization optimization opportunities
- Financial recommendation feasibility and ROI
- Compliance with home health billing requirements

IMPORTANT GUIDELINES:
1. Base all analysis on the actual clinical documentation provided
2. Follow current HIPPS coding and Medicare home health billing guidelines
3. Consider OASIS-E1 specific requirements for financial optimization
4. Provide specific, actionable financial recommendations with revenue impact
5. Ensure all payment calculations are accurate and achievable
6. Consider home health agency operational constraints
7. Address billing compliance requirements for Medicare reimbursement
8. Provide clear rationale for all financial suggestions, including:
  * What specific revenue opportunity the recommendation addresses
  * How it will improve agency financial performance
  * What the financial impact will be (specific dollar amounts)
  * What documentation is needed to support the optimization
  * What the implementation costs and ROI are
  * Step-by-step instructions on how to implement the recommendation
  * For payment code upgrades: Explain what each code level means, why the upgrade is justified, and revenue impact
  * For documentation improvements: Explain what documentation is needed and how it affects reimbursement
  * For service additions: Explain what services can be added, patient eligibility, and revenue impact

CRITICAL: Return ONLY valid JSON. Do not include any explanatory text, markdown formatting, or additional commentary outside the JSON structure.`;
  }

  private getUserPrompt(content: string, fileName: string): string {
    return `Financial Optimization Analysis Request

File Information:
- File Name: ${fileName}
- Content Length: ${content.length} characters
- Analysis Type: Financial optimization and revenue maximization
- Format: OASIS Assessment Document (Universal - SOC/ROC/Follow-Up/Discharge)

Please analyze this OASIS assessment document and provide comprehensive financial optimization analysis focusing on payment optimization, service utilization enhancement, and revenue maximization opportunities. This analysis should work with ANY type of OASIS assessment (SOC, ROC, Follow-Up, Discharge) and extract financial optimization data regardless of specific field codes or document version. The document contains patient assessment data, diagnoses, and clinical information that requires financial analysis for revenue maximization.

Document Content:
${content}

ANALYSIS REQUIREMENTS:

0. PATIENT INFORMATION EXTRACTION:
   Extract patient information from any available field in the OASIS document:
   - Patient Name: Look for patient identification fields (M0040, Full Name, Patient Name fields)
   - Medical Record Number (MRN): Extract from patient ID, MRN, or case number fields
   - Visit Type: Determine from document type (Start of Care/SOC, Recertification/ROC, Resumption of Care/Follow-Up, Transfer to Inpatient Facility/Discharge)
   - Payor/Insurance: Extract from payment source, insurance provider, or Medicare/Medicaid designation
   - Visit Date: Extract from assessment date, SOC date, or signature date fields
   - Clinician: Extract from nurse/therapist signature fields or provider information
   - Pay Period: Determine from certification period or billing cycle information
   - Status: Determine from assessment completion status or visit type indicator

1. PRIMARY DIAGNOSIS CODING ANALYSIS:
   - Extract and analyze the primary diagnosis (look for M1021, Primary Condition, Main Diagnosis, or Reason for Care fields)
   - Extract any existing diagnosis codes (ICD-10 codes) associated with the primary condition
   - Assess current payment classification potential based on primary diagnosis complexity
   - Identify optimization opportunities for enhanced diagnosis documentation that could increase revenue
   - Calculate potential revenue impact from improved diagnosis coding

2. SECONDARY DIAGNOSES ANALYSIS:
   - Review all documented secondary diagnoses (M1023, M1028 Active Diagnoses, or any additional condition fields)
   - Extract all secondary ICD-10 codes documented in the assessment
   - Validate contribution to complexity classification and comorbidity factors
   - Identify missing diagnoses based on clinical documentation that could increase revenue potential
   - Assess comorbidity impact on payment classification calculation

3. FUNCTIONAL STATUS FINANCIAL ANALYSIS:
   - Extract and analyze all functional assessment data (ADL scores M1800-M1870, fall risk assessments, mobility sections)
   - Look for any functional limitation documentation that affects care complexity
   - Calculate functional status component impact on payment classification
   - Identify opportunities to upgrade functional status through enhanced documentation
   - Assess revenue impact of comprehensive functional status assessment

4. SERVICE UTILIZATION ANALYSIS:
   - Analyze documented care plan, service frequency, and visit patterns
   - Extract payment source information (Medicare, Medicaid, Private Insurance, etc.)
   - Identify current service intensity level based on documented needs
   - Look for documentation supporting skilled care needs that justify higher payment levels
   - Calculate current payment classification potential based on services documented

5. REVENUE CALCULATION METHODOLOGY:
   Apply comprehensive payment methodology based on documented factors:
   - Clinical Group Classification based on primary diagnosis complexity
   - Comorbidity Level assessment based on secondary diagnoses and conditions
   - Functional Status Level based on ADL limitations and assistance needs
   - Service Intensity Level based on skilled care requirements and visit frequency
   - Calculate current revenue potential based on documented factors using Medicare home health rates ($2,500-$3,500 per episode range)
   - Calculate optimized revenue potential with enhanced documentation
   - Provide specific dollar amounts for revenue impact projections
   - Include Case Mix Weight analysis if payment data available

6. CASE MIX WEIGHT ANALYSIS:
   Calculate comprehensive Medicare Case Mix Weight impact using OASIS-E1 clinical documentation:
   
   A. MEDICARE PDGM HIPPS CLASSIFICATION:
      Determine the correct 5-digit HIPPS code classification based on OASIS documentation:
      
      HIPPS STRUCTURE: [Clinical Group][Functional Level][Admission Source][Timing][Comorbidity]
      
      CLINICAL GROUP DETERMINATION:
      - Behavioral Health (F): Mental health, dementia, cognitive impairment
      - Complex Care (D): Multiple complex conditions requiring skilled nursing
      - MMTA - Cardiac (H): Heart failure, cardiac conditions
      - MMTA - Endocrine (I): Diabetes, endocrine disorders  
      - MMTA - GI/GU (J): Gastrointestinal/Genitourinary conditions
      - MMTA - Infectious (K): Infections requiring IV therapy
      - MMTA - Other (A): Other MMTA conditions not fitting above categories
      - MMTA - Respiratory (L): COPD, respiratory conditions
      - MMTA - Surgical Aftercare (G): Post-surgical wound care
      - MS Rehab (E): Musculoskeletal rehabilitation
      - Neurological (B): Stroke, neuropathy, neurological conditions
      - Wound Care (C): Pressure ulcers, surgical wounds, stasis ulcers
      
      FUNCTIONAL LEVEL ASSESSMENT:
      Extract ADL functional scores and classify patient functional level:
      - Low (A): Independent/minimal assistance (M1800-M1870 scores mostly 0-1)
      - Medium (B): Moderate assistance (M1800-M1870 scores mostly 1-2) 
      - High (C): Substantial assistance (M1800-M1870 scores mostly 2-3+)
      
      Key ADL fields for functional assessment:
      - M1800 Grooming: Score 0-3
      - M1810 Upper Dressing: Score 0-3  
      - M1820 Lower Dressing: Score 0-3
      - M1830 Bathing: Score 0-6
      - M1840 Toilet Transfer: Score 0-4
      - M1845 Toilet Hygiene: Score 0-3
      - M1850 Transferring: Score 0-5
      - M1860 Ambulation: Score 0-6
      - M1870 Feeding: Score 0-5
      
      ADMISSION SOURCE DETERMINATION:
      - Early/Community (1): Episode Timing Early (M0100=01) + No Institutional Discharge (M1000=N/A)
      - Early/Institutional (2): Episode Timing Early (M0100=01) + Institutional Discharge (M1000=1-7)
      - Late/Community (3): Episode Timing Late (M0100=04+) + No Institutional Discharge (M1000=N/A)
      - Late/Institutional (4): Episode Timing Late (M0100=04+) + Institutional Discharge (M1000=1-7)
      
      EPISODE TIMING:
      Extract from Episode Timing field or M0100 assessment reason:
      - SOC (Start of Care): Early
      - ROC (Recertification): Late  
      
      INSTITUTIONAL DISCHARGE (M1000):
      - Within past 14 days from: NF, SNF, Acute Hospital, LTCH, IRF, Psychiatric Hospital
      - N/A: No institutional discharge = Community
      
      COMORBIDITY ADJUSTMENT:
      Count active comorbid diagnoses from M1028:
      - None (1): 0 comorbidities selected
      - Single (2): 1 comorbidity 
      - Interaction (3): 2+ comorbidities (creates interaction effect)
      
      EXTRACT COMORBIDITIES FROM M1028:
      - Peripheral Vascular Disease (PVD/PAD)
      - Diabetes Mellitus (DM)
      Count total checked items for comorbidity adjustment
      
      HIPPS EXAMPLE CALCULATION:
      Primary Diagnosis: S81.801S (Wound sequela) + Multiple ADL impairments (High functional level)
      + SOC Early timing + No institutional discharge (Community) + PVD + DM (Single comorbidity)
      = Expected HIPPS: 1CC21 (Wound-High-Early-Community-Single Comorbidity)
      
      Weight from CSV: 1CC21 = 1.5600 weight, LUPA Threshold = 4 visits
   
   MEDICARE PDGM HIPPS REFERENCE TABLE:
   Use this official CSV data to determine exact weights and LUPA thresholds for calculated HIPPS codes:
   
   FORMAT: HIPPS_CODE,Description,Timing-Admission_Source,Comorbidity_Count,Weight,LUPA_Threshold
   
   WOUND CARE CODES (C Clinical Group):
   1CC11,Wound - High,Early - Community,0,1.4977,4
   1CC21,Wound -High,Early - Community,1,1.56,4
   1CC31,Wound - High,Early - Community,2,1.7093,4
   2CC11,Wound - High,Early - Institutional,0,1.705,5
   2CC21,Wound - High,Early - Institutional,1,1.7673,4
   2CC31,Wound - High,Early - Institutional,2,1.9166,4
   3CC11,Wound - High,Late - Community,0,1.1496,3
   3CC21,Wound - High,Late - Community,1,1.2118,3
   3CC31,Wound - High,Late - Community,2,1.3611,3
   4CC11,Wound - High,Late - Institutional,0,1.6273,4
   4CC21,Wound - High,Late - Institutional,1,1.6895,4
   4CC31,Wound - High,Late - Institutional,2,1.8388,4
   
   BEHAVIORAL HEALTH CODES (F Clinical Group):
   1FA11,Behavioral Health - Low,Early - Community,0,1.1937,4
   1FA21,Behavioral Health - Low,Early - Community,1,1.2559,4
   1FA31,Behavioral Health - Low,Early - Community,2,1.4052,4
   2FA11,Behavioral Health - Low,Early - Institutional,0,1.401,5
   2FA21,Behavioral Health - Low,Early - Institutional,1,1.4632,4
   2FA31,Behavioral Health - Low,Early - Institutional,2,1.6125,4
   3FA11,Behavioral Health - Low,Late - Community,0,0.8455,2
   3FA21,Behavioral Health - Low,Late - Community,1,0.9077,2
   3FA31,Behavioral Health - Low,Late - Community,2,1.057,2
   4FA11,Behavioral Health - Low,Late - Institutional,0,1.3233,4
   4FA21,Behavioral Health - Low,Late - Institutional,1,1.3855,4
   4FA31,Behavioral Health - Low,Late - Institutional,2,1.5348,4
   
   1FB11,Behavioral Health - Medium,Early - Community,0,1.2952,4
   1FB21,Behavioral Health - Medium,Early - Community,1,1.3574,4
   1FB31,Behavioral Health - Medium,Early - Community,2,1.5067,4
   2FB11,Behavioral Health - Medium,Early - Institutional,0,1.5025,5
   2FB21,Behavioral Health - Medium,Early - Institutional,1,1.5647,4
   2FB31,Behavioral Health - Medium,Early - Institutional,2,1.714,4
   3FB11,Behavioral Health - Medium,Late - Community,0,0.9469,3
   3FB21,Behavioral Health - Medium,Late - Community,1,1.0091,3
   3FB31,Behavioral Health - Medium,Late - Community,2,1.1584,3
   4FB11,Behavioral Health - Medium,Late - Institutional,0,1.4247,4
   4FB21,Behavioral Health - Medium,Late - Institutional,1,1.4869,4
   4FB31,Behavioral Health - Medium,Late - Institutional,2,1.6362,4
   
   1FC11,Behavioral Health - High,Early - Community,0,1.5065,4
   1FC21,Behavioral Health - High,Early - Community,1,1.5687,4
   1FC31,Behavioral Health - High,Early - Community,2,1.718,4
   2FC11,Behavioral Health - High,Early - Institutional,0,1.7143,5
   2FC21,Behavioral Health - High,Early - Institutional,1,1.7765,4
   2FC31,Behavioral Health - High,Early - Institutional,2,1.9258,4
   3FC11,Behavioral Health - High,Late - Community,0,1.1582,3
   3FC21,Behavioral Health - High,Late - Community,1,1.2204,3
   3FC31,Behavioral Health - High,Late - Community,2,1.3697,3
   4FC11,Behavioral Health - High,Late - Institutional,0,1.636,4
   4FC21,Behavioral Health - High,Late - Institutional,1,1.6982,4
   4FC31,Behavioral Health - High,Late - Institutional,2,1.8475,4
   
   NEUROLOGICAL CODES (B Clinical Group):
   1BA11,Neuro - Low,Early - Community,0,1.1374,4
   1BA21,Neuro - Low,Early - Community,1,1.1996,4
   1BA31,Neuro - Low,Early - Community,2,1.3489,4
   2BA11,Neuro - Low,Early - Institutional,0,1.3447,5
   2BA21,Neuro - Low,Early - Institutional,1,1.4069,4
   2BA31,Neuro - Low,Early - Institutional,2,1.5562,4
   3BA11,Neuro - Low,Late - Community,0,0.7891,3
   3BA21,Neuro - Low,Late - Community,1,0.8513,3
   3BA31,Neuro - Low,Late - Community,2,1.0006,3
   4BA11,Neuro - Low,Late - Institutional and Disease,0,1.267,4
   4BA21,Neuro - Low,Late - Institutional,1,1.3292,4
   4BA31,Neuro - Low,Late - Institutional,2,1.4785,4
   
   1BB11,Neuro - Medium,Early - Community,0,1.2389,4
   1BB21,Neuro - Medium,Early - Community,1,1.3011,4
   1BB31,Neuro - Medium,Early - Community,2,1.4504,4
   2BB11,Neuro - Medium,Early - Institutional,0,1.4462,5
   2BB21,Neuro - Medium,Early - Institutional,1,1.5084,4
   2BB31,Neuro - Medium,Early - Institutional,2,1.6577,4
   3BB11,Neuro - Medium,Late - Community,0,0.8906,2
   3BB21,Neuro - Medium,Late - Community,1,0.9528,2
   3BB31,Neuro - Medium,Late - Community,2,1.1021,2
   4BB11,Neuro - Medium,Late - Institutional,0,1.3685,4
   4BB21,Neuro - Medium,Late - Institutional,1,1.4307,4
   4BB31,Neuro - Medium,Late - Institutional,2,1.58,4
   
   1BC11,Neuro - High,Early - Community,0,1.4502,4
   1BC21,Neuro - High,Early - Community,1,1.5124,4
   1BC31,Neuro - High,Early - Community,2,1.6617,4
   2BC11,Neuro - High,Early - Institutional,0,1.6575,5
   2BC21,Neuro - High,Early - Institutional,1,1.7197,4
   2BC31,Neuro - High,Early - Institutional,2,1.869,4
   3BC11,Neuro - High,Late - Community,0,1.1019,3
   3BC21,Neuro - High,Late - Community,1,1.1641,3
   3BC31,Neuro - High,Late - Community,2,1.3134,3
   4BC11,Neuro - High,Late - Institutional,0,1.5798,4
   4BC21,Neuro - High,Late - Institutional,1,1.642,4
   4BC31,Neuro - High,Late - Institutional,2,1.7913,4
   
   COMPLEX CARE CODES (D Clinical Group):
   1DA11,Complex - Low,Early - Community,0,0.872,2
   1DA21,Complex - Low,Early - Community,1,0.935,2
   1DA31,Complex - Low,Early - Community,2,1.084,2
   2DA11,Complex - Low,Early - Institutional,0,1.080,3
   2DA21,Complex - Low,Early - Institutional,1,1.142,3
   2DA31,Complex - Low,Early - Institutional,2,1.291,3
   3DA11,Complex - Low,Late - Community,0,0.524,2
   3DA21,Complex - Low,Late - Community,1,0.586,2
   3DA31,Complex - Low,Late - Community,2,0.736,2
   4DA11,Complex - Low,Late - Institutional,0,1.002,2
   4DA21,Complex - Low,Late - Institutional,1,1.064,2
   4DA31,Complex - Low,Late - Institutional,2,1.213,3
   1DB11,Complex - Medium,Early - Community,0,1.003,2
   1DB21,Complex - Medium,Early - Community,1,1.065,2
   1DB31,Complex - Medium,Early - Community,2,1.215,2
   2DB11,Complex - Medium,Early - Institutional,0,1.210,3
   2DB21,Complex - Medium,Early - Institutional,1,1.273,3
   2DB31,Complex - Medium,Early - Institutional,2,1.422,4
   3DB11,Complex - Medium,Late - Community,0,0.655,2
   3DB21,Complex - Medium,Late - Community,1,0.717,2
   3DB31,Complex - Medium,Late - Community,2,0.866,2
   4DB11,Complex - Medium,Late - Institutional,0,1.133,3
   4DB21,Complex - Medium,Late - Institutional,1,1.195,3
   4DB31,Complex - Medium,Late - Institutional,2,1.344,3
   1DC11,Complex - High,Early - Community,0,0.987,2
   1DC21,Complex - High,Early - Community,1,1.049,2
   1DC31,Complex - High,Early - Community,2,1.199,2
   2DC11,Complex - High,Early - Institutional,0,1.194,3
   2DC21,Complex - High,Early - Institutional,1,1.257,3
   2DC31,Complex - High,Early - Institutional,2,1.406,3
   3DC11,Complex - High,Late - Community,0,0.639,2
   3DC21,Complex - High,Late - Community,1,0.701,2
   3DC31,Complex - High,Late - Community,2,0.851,2
   4DC11,Complex - High,Late - Institutional,0,1.117,2
   4DC21,Complex - High,Late - Institutional,1,1.179,2
   4DC31,Complex - High,Late - Institutional,2,1.328,2
   
   MMTA CARDIAC CODES (H Clinical Group):
   1HA11,MMTA - Cardiac - Low,Early - Community,0,0.910,4
   1HA21,MMTA - Cardiac - Low,Early - Community,1,0.972,4
   1HA31,MMTA - Cardiac - Low,Early - Community,2,1.122,3
   2HA11,MMTA - Cardiac - Low,Early - Institutional,0,1.118,3
   2HA21,MMTA - Cardiac - Low,Early - Institutional,1,1.180,4
   2HA31,MMTA - Cardiac - Low,Early - Institutional,2,1.329,4
   3HA11,MMTA - Cardiac - Low,Late - Community,0,0.562,2
   3HA21,MMTA - Cardiac - Low,Late - Community,1,0.624,2
   3HA31,MMTA - Cardiac - Low,Late - Community,2,0.774,2
   4HA11,MMTA - Cardiac - Low,Late - Institutional,0,1.040,3
   4HA21,MMTA - Cardiac - Low,Late - Institutional,1,1.102,3
   4HA31,MMTA - Cardiac - Low,Late - Institutional,2,1.251,3
   1HB11,MMTA - Cardiac - Medium,Early - Community,0,0.997,4
   1HB21,MMTA - Cardiac - Medium,Early - Community,1,1.059,4
   1HB31,MMTA - Cardiac - Medium,Early - Community,2,1.208,4
   2HB11,MMTA - Cardiac - Medium,Early - Institutional,0,1.204,4
   2HB21,MMTA - Cardiac - Medium,Early - Institutional,1,1.266,4
   2HB31,MMTA - Cardiac - Medium,Early - Institutional,2,1.416,4
   3HB11,MMTA - Cardiac - Medium,Late - Community,0,0.649,2
   3HB21,MMTA - Cardiac - Medium,Late - Community,1,0.711,2
   3HB31,MMTA - Cardiac - Medium,Late - Community,2,0.860,2
   4HB11,MMTA - Cardiac - Medium,Late - Institutional,0,1.126,3
   4HB21,MMTA - Cardiac - Medium,Late - Institutional,1,1.188,3
   4HB31,MMTA - Cardiac - Medium,Late - Institutional,2,1.338,3
   1HC11,MMTA - Cardiac - High,Early - Community,0,1.113,4
   1HC21,MMTA - Cardiac - High,Early - Community,1,1.176,4
   1HC31,MMTA - Cardiac - High,Early - Community,2,1.325,4
   2HC11,MMTA - Cardiac - High,Early - Institutional,0,1.321,4
   2HC21,MMTA - Cardiac - High,Early - Institutional,1,1.383,4
   2HC31,MMTA - Cardiac - High,Early - Institutional,2,1.532,4
   3HC11,MMTA - Cardiac - High,Late - Community,0,0.765,2
   3HC21,MMTA - Cardiac - High,Late - Community,1,0.827,2
   3HC31,MMTA - Cardiac - High,Late - Community,2,0.977,3
   4HC11,MMTA - Cardiac - High,Late - Institutional,0,1.243,3
   4HC21,MMTA - Cardiac - High,Late - Institutional,1,1.305,3
   4HC31,MMTA - Cardiac - High,Late - Institutional,2,1.454,4
   
   WOUND CARE CODES (C Clinical Group - Additional):
   1CA11,Wound - Low,Early - Community,0,1.285,4

   MS REHAB CODES (E Clinical Group):
   1EA11,MS Rehab - Low,Early - Community,0,0.954,4
   1EA21,MS Rehab - Low,Early - Community,1,1.017,4
   1EA31,MS Rehab - Low,Early - Community,2,1.166,4
   2EA11,MS Rehab - Low,Early - Institutional,0,1.162,4
   2EA21,MS Rehab - Low,Early - Institutional,1,1.224,5
   2EA31,MS Rehab - Low,Early - Institutional,2,1.373,5
   3EA11,MS Rehab - Low,Late - Community,0,0.606,2
   3EA21,MS Rehab - Low,Late - Community,1,0.668,2
   3EA31,MS Rehab - Low,Late - Community,2,0.818,2
   4EA11,MS Rehab - Low,Late - Institutional,0,1.084,4
   4EA21,MS Rehab - Low,Late - Institutional,1,1.146,4
   4EA31,MS Rehab - Low,Late - Institutional,2,1.295,4
   1EB11,MS Rehab - Medium,Early - Community,0,1.037,5
   1EB21,MS Rehab - Medium,Early - Community,1,1.099,5
   1EB31,MS Rehab - Medium,Early - Community,2,1.249,4
   2EB11,MS Rehab - Medium,Early - Institutional,0,1.244,5
   2EB21,MS Rehab - Medium,Early - Institutional,1,1.307,5
   2EB31,MS Rehab - Medium,Early - Institutional,2,1.456,5
   3EB11,MS Rehab - Medium,Late - Community,0,0.689,2
   3EB21,MS Rehab - Medium,Late - Community,1,0.751,2
   3EB31,MS Rehab - Medium,Late - Community,2,0.900,2
   4EB11,MS Rehab - Medium,Late - Institutional,0,1.167,4
   4EB21,MS Rehab - Medium,Late - Institutional,1,1.229,4
   4EB31,MS Rehab - Medium,Late - Institutional,2,1.378,4
   1EC11,MS Rehab - High,Early - Community,0,1.177,4
   1EC21,MS Rehab - High,Early - Community,1,1.239,4
   1EC31,MS Rehab - High,Early - Community,2,1.388,4
   2EC11,MS Rehab - High,Early - Institutional,0,1.384,5
   2EC21,MS Rehab - High,Early - Institutional,1,1.446,5
   2EC31,MS Rehab - High,Early - Institutional,2,1.596,5
   3EC11,MS Rehab - High,Late - Community,0,0.829,2
   3EC21,MS Rehab - High,Late - Community,1,0.891,2
   3EC31,MS Rehab - High,Late - Community,2,1.040,3
   4EC11,MS Rehab - High,Late - Institutional,0,1.306,4
   4EC21,MS Rehab - High,Late - Institutional,1,1.369,4
   4EC31,MS Rehab - High,Late - Institutional,2,1.518,4
   
   MMTA ENDOCRINE CODES (I Clinical Group):
   1IA11,MMTA - Endocrine - Low,Early - Community,0,1.187,4
   1IA21,MMTA - Endocrine - Low,Early - Community,1,1.249,4
   1IA31,MMTA - Endocrine - Low,Early - Community,2,1.399,4
   2IA11,MMTA - Endocrine - Low,Early - Institutional,0,1.394,3
   2IA21,MMTA - Endocrine - Low,Early - Institutional,1,1.457,4
   2IA31,MMTA - Endocrine - Low,Early - Institutional,2,1.606,4
   3IA11,MMTA - Endocrine - Low,Late - Community,0,0.839,3
   3IA21,MMTA - Endocrine - Low,Late - Community,1,0.901,3
   3IA31,MMTA - Endocrine - Low,Late - Community,2,1.050,3
   4IA11,MMTA - Endocrine - Low,Late - Institutional,0,1.317,4
   4IA21,MMTA - Endocrine - Low,Late - Institutional,1,1.379,3
   4IA31,MMTA - Endocrine - Low,Late - Institutional,2,1.528,4
   1IB11,MMTA - Endocrine - Medium,Early - Community,0,1.258,4
   1IB21,MMTA - Endocrine - Medium,Early - Community,1,1.321,4
   1IB31,MMTA - Endocrine - Medium,Early - Community,2,1.470,4
   2IB11,MMTA - Endocrine - Medium,Early - Institutional,0,1.466,4
   2IB21,MMTA - Endocrine - Medium,Early - Institutional,1,1.528,4
   2IB31,MMTA - Endocrine - Medium,Early - Institutional,2,1.677,4
   3IB11,MMTA - Endocrine - Medium,Late - Community,0,0.910,3
   3IB21,MMTA - Endocrine - Medium,Late - Community,1,0.972,3
   3IB31,MMTA - Endocrine - Medium,Late - Community,2,1.122,3
   4IB11,MMTA - Endocrine - Medium,Late - Institutional,0,1.388,4
   4IB21,MMTA - Endocrine - Medium,Late - Institutional,1,1.450,4
   4IB31,MMTA - Endocrine - Medium,Late - Institutional,2,1.599,4
   1IC11,MMTA - Endocrine - High,Early - Community,0,1.328,4
   1IC21,MMTA - Endocrine - High,Early - Community,1,1.391,4
   1IC31,MMTA - Endocrine - High,Early - Community,2,1.540,4
   2IC11,MMTA - Endocrine - High,Early - Institutional,0,1.536,4
   2IC21,MMTA - Endocrine - High,Early - Institutional,1,1.598,4
   2IC31,MMTA - Endocrine - High,Early - Institutional,2,1.747,4
   3IC11,MMTA - Endocrine - High,Late - Community,0,0.980,3
   3IC21,MMTA - Endocrine - High,Late - Community,1,1.042,3
   3IC31,MMTA - Endocrine - High,Late - Community,2,1.192,3
   4IC11,MMTA - Endocrine - High,Late - Institutional,0,1.458,4
   4IC21,MMTA - Endocrine - High,Late - Institutional,1,1.520,4
   4IC31,MMTA - Endocrine - High,Late - Institutional,2,1.669,4
   
   MMTA GI/GU CODES (J Clinical Group):
   1JA11,MMTA - GI/GU - Low,Early - Community,0,0.893,2
   1JA21,MMTA - GI/GU - Low,Early - Community,1,0.955,2
   1JA31,MMTA - GI/GU - Low,Early - Community,2,1.104,2
   2JA11,MMTA - GI/GU - Low,Early - Institutional,0,1.100,3
   2JA21,MMTA - GI/GU - Low,Early - Institutional,1,1.162,3
   2JA31,MMTA - GI/GU - Low,Early - Institutional,2,1.311,3
   3JA11,MMTA - GI/GU - Low,Late - Community,0,0.544,2
   3JA21,MMTA - GI/GU - Low,Late - Community,1,0.607,2
   3JA31,MMTA - GI/GU - Low,Late - Community,2,0.756,2
   4JA11,MMTA - GI/GU - Low,Late - Institutional,0,1.022,3
   4JA21,MMTA - GI/GU - Low,Late - Institutional,1,1.084,3
   4JA31,MMTA - GI/GU - Low,Late - Institutional,2,1.234,3
   1JB11,MMTA - GI/GU - Medium,Early - Community,0,1.012,3
   1JB21,MMTA - GI/GU - Medium,Early - Community,1,1.075,3
   1JB31,MMTA - GI/GU - Medium,Early - Community,2,1.224,2
   2JB11,MMTA - GI/GU - Medium,Early - Institutional,0,1.220,3
   2JB21,MMTA - GI/GU - Medium,Early - Institutional,1,1.282,4
   2JB31,MMTA - GI/GU - Medium,Early - Institutional,2,1.431,4
   3JB11,MMTA - GI/GU - Medium,Late - Community,0,0.664,2
   3JB21,MMTA - GI/GU - Medium,Late - Community,1,0.727,2
   3JB31,MMTA - GI/GU - Medium,Late - Community,2,0.876,2
   4JB11,MMTA - GI/GU - Medium,Late - Institutional,0,1.142,3
   4JB21,MMTA - GI/GU - Medium,Late - Institutional,1,1.204,3
   4JB31,MMTA - GI/GU - Medium,Late - Institutional,2,1.354,3
   1JC11,MMTA - GI/GU - High,Early - Community,0,1.101,3
   1JC21,MMTA - GI/GU - High,Early - Community,1,1.164,3
   1JC31,MMTA - GI/GU - High,Early - Community,2,1.313,2
   2JC11,MMTA - GI/GU - High,Early - Institutional,0,1.309,4
   2JC21,MMTA - GI/GU - High,Early - Institutional,1,1.371,3
   2JC31,MMTA - GI/GU - High,Early - Institutional,2,1.520,3
   3JC11,MMTA - GI/GU - High,Late - Community,0,0.753,2
   3JC21,MMTA - GI/GU - High,Late - Community,1,0.815,2
   3JC31,MMTA - GI/GU - High,Late - Community,2,0.965,2
   4JC11,MMTA - GI/GU - High,Late - Institutional,0,1.231,3
   4JC21,MMTA - GI/GU - High,Late - Institutional,1,1.293,3
   4JC31,MMTA - GI/GU - High,Late - Institutional,2,1.442,3
   
   MMTA INFECTIOUS CODES (K Clinical Group):
   1KA11,MMTA - Infectious - Low,Early - Community,0,0.908,2
   1KA21,MMTA - Infectious - Low,Early - Community,1,0.970,2
   1KA31,MMTA - Infectious - Low,Early - Community,2,1.119,2
   2KA11,MMTA - Infectious - Low,Early - Institutional,0,1.115,3
   2KA21,MMTA - Infectious - Low,Early - Institutional,1,1.177,3
   2KA31,MMTA - Infectious - Low,Early - Institutional,2,1.327,3
   3KA11,MMTA - Infectious - Low,Late - Community,0,0.560,2
   3KA21,MMTA - Infectious - Low,Late - Community,1,0.622,2
   3KA31,MMTA - Infectious - Low,Late - Community,2,0.771,2
   4KA11,MMTA - Infectious - Low,Late - Institutional,0,1.037,3
   4KA21,MMTA - Infectious - Low,Late - Institutional,1,1.099,3
   4KA31,MMTA - Infectious - Low,Late - Institutional,2,1.249,3
   1KB11,MMTA - Infectious - Medium,Early - Community,0,1.008,3
   1KB21,MMTA - Infectious - Medium,Early - Community,1,1.070,2
   1KB31,MMTA - Infectious - Medium,Early - Community,2,1.219,2
   2KB11,MMTA - Infectious - Medium,Early - Institutional,0,1.215,3
   2KB21,MMTA - Infectious - Medium,Early - Institutional,1,1.277,3
   2KB31,MMTA - Infectious - Medium,Early - Institutional,2,1.427,3
   3KB11,MMTA - Infectious - Medium,Late - Community,0,0.660,2
   3KB21,MMTA - Infectious - Medium,Late - Community,1,0.722,2
   3KB31,MMTA - Infectious - Medium,Late - Community,2,0.871,2
   4KB11,MMTA - Infectious - Medium,Late - Institutional,0,1.137,3
   4KB21,MMTA - Infectious - Medium,Late - Institutional,1,1.200,3
   4KB31,MMTA - Infectious - Medium,Late - Institutional,2,1.349,3
   1KC11,MMTA - Infectious - High,Early - Community,0,1.138,2
   1KC21,MMTA - Infectious - High,Early - Community,1,1.201,2
   1KC31,MMTA - Infectious - High,Early - Community,2,1.350,2
   2KC11,MMTA - Infectious - High,Early - Institutional,0,1.346,3
   2KC21,MMTA - Infectious - High,Early - Institutional,1,1.408,3
   2KC31,MMTA - Infectious - High,Early - Institutional,2,1.557,3
   3KC11,MMTA - Infectious - High,Late - Community,0,0.790,2
   3KC21,MMTA - Infectious - High,Late - Community,1,0.852,2
   3KC31,MMTA - Infectious - High,Late - Community,2,1.002,2
   4KC11,MMTA - Infectious - High,Late - Institutional,0,1.268,3
   4KC21,MMTA - Infectious - High,Late - Institutional,1,1.330,3
   4KC31,MMTA - Infectious - High,Late - Institutional,2,1.479,3
   
   MMTA OTHER CODES (A Clinical Group):
   1AA11,MMTA - Other - Low,Early - Community,0,0.919,3
   1AA21,MMTA - Other - Low,Early - Community,1,0.981,3
   1AA31,MMTA - Other - Low,Early - Community,2,1.130,4
   2AA11,MMTA - Other - Low,Early - Institutional,0,1.126,3
   2AA21,MMTA - Other - Low,Early - Institutional,1,1.188,3
   2AA31,MMTA - Other - Low,Early - Institutional,2,1.338,3
   3AA11,MMTA - Other - Low,Late - Community,0,0.571,2
   3AA21,MMTA - Other - Low,Late - Community,1,0.633,2
   3AA31,MMTA - Other - Low,Late - Community,2,0.782,2
   4AA11,MMTA - Other - Low,Late - Institutional,0,1.048,3
   4AA21,MMTA - Other - Low,Late - Institutional,1,1.111,3
   4AA31,MMTA - Other - Low,Late - Institutional,2,1.260,3
   1AB11,MMTA - Other - Medium,Early - Community,0,1.009,4
   1AB21,MMTA - Other - Medium,Early - Community,1,1.071,4
   1AB31,MMTA - Other - Medium,Early - Community,2,1.220,3
   2AB11,MMTA - Other - Medium,Early - Institutional,0,1.216,4
   2AB21,MMTA - Other - Medium,Early - Institutional,1,1.278,4
   2AB31,MMTA - Other - Medium,Early - Institutional,2,1.427,4
   3AB11,MMTA - Other - Medium,Late - Community,0,0.660,2
   3AB21,MMTA - Other - Medium,Late - Community,1,0.723,2
   3AB31,MMTA - Other - Medium,Late - Community,2,0.872,2
   4AB11,MMTA - Other - Medium,Late - Institutional,0,1.138,3
   4AB21,MMTA - Other - Medium,Late - Institutional,1,1.200,3
   4AB31,MMTA - Other - Medium,Late - Institutional,2,1.350,4
   1AC11,MMTA - Other - High,Early - Community,0,1.107,4
   1AC21,MMTA - Other - High,Early - Community,1,1.170,4
   1AC31,MMTA - Other - High,Early - Community,2,1.319,3
   2AC11,MMTA - Other - High,Early - Institutional,0,1.315,4
   2AC21,MMTA - Other - High,Early - Institutional,1,1.377,4
   2AC31,MMTA - Other - High,Early - Institutional,2,1.526,4
   3AC11,MMTA - Other - High,Late - Community,0,0.759,2
   3AC21,MMTA - Other - High,Late - Community,1,0.821,2
   3AC31,MMTA - Other - High,Late - Community,2,0.971,2
   4AC11,MMTA - Other - High,Late - Institutional,0,1.237,3
   4AC21,MMTA - Other - High,Late - Institutional,1,1.299,3
   4AC31,MMTA - Other - High,Late - Institutional,2,1.448,3
   
   MMTA RESPIRATORY CODES (L Clinical Group):
   1LA11,MMTA - Respiratory - Low,Early - Community,0,0.919,3
   1LA21,MMTA - Respiratory - Low,Early - Community,1,0.981,3
   1LA31,MMTA - Respiratory - Low,Early - Community,2,1.130,3
   2LA11,MMTA - Respiratory - Low,Early - Institutional,0,1.126,3
   2LA21,MMTA - Respiratory - Low,Early - Institutional,1,1.188,3
   2LA31,MMTA - Respiratory - Low,Early - Institutional,2,1.338,4
   3LA11,MMTA - Respiratory - Low,Late - Community,0,0.571,2
   3LA21,MMTA - Respiratory - Low,Late - Community,1,0.633,2
   3LA31,MMTA - Respiratory - Low,Late - Community,2,0.782,2
   4LA11,MMTA - Respiratory - Low,Late - Institutional,0,1.048,3
   4LA21,MMTA - Respiratory - Low,Late - Institutional,1,1.111,3
   4LA31,MMTA - Respiratory - Low,Late - Institutional,2,1.260,3
   1LB11,MMTA - Respiratory - Medium,Early - Community,0,1.016,4
   1LB21,MMTA - Respiratory - Medium,Early - Community,1,1.079,3
   1LB31,MMTA - Respiratory - Medium,Early - Community,2,1.228,3
   2LB11,MMTA - Respiratory - Medium,Early - Institutional,0,1.224,4
   2LB21,MMTA - Respiratory - Medium,Early - Institutional,1,1.286,4
   2LB31,MMTA - Respiratory - Medium,Early - Institutional,2,1.435,4
   3LB11,MMTA - Respiratory - Medium,Late - Community,0,0.668,2
   3LB21,MMTA - Respiratory - Medium,Late - Community,1,0.730,2
   3LB31,MMTA - Respiratory - Medium,Late - Community,2,0.880,2
   4LB11,MMTA - Respiratory - Medium,Late - Institutional,0,1.146,3
   4LB21,MMTA - Respiratory - Medium,Late - Institutional,1,1.208,3
   4LB31,MMTA - Respiratory - Medium,Late - Institutional,2,1.357,3
   1LC11,MMTA - Respiratory - High,Early - Community,0,1.120,4
   1LC21,MMTA - Respiratory - High,Early - Community,1,1.183,3
   1LC31,MMTA - Respiratory - High,Early - Community,2,1.332,3
   2LC11,MMTA - Respiratory - High,Early - Institutional,0,1.328,4
   2LC21,MMTA - Respiratory - High,Early - Institutional,1,1.390,4
   2LC31,MMTA - Respiratory - High,Early - Institutional,2,1.539,4
   3LC11,MMTA - Respiratory - High,Late - Community,0,0.772,2
   3LC21,MMTA - Respiratory - High,Late - Community,1,0.835,2
   3LC31,MMTA - Respiratory - High,Late - Community,2,0.984,2
   4LC11,MMTA - Respiratory - High,Late - Institutional,0,1.250,3
   4LC21,MMTA - Respiratory - High,Late - Institutional,1,1.312,3
   4LC31,MMTA - Respiratory - High,Late - Institutional,2,1.462,3
   
   MMTA SURGICAL AFTERCARE CODES (G Clinical Group):
   1GA11,MMTA - Surgical Aftercare - Low,Early - Community,0,0.892,2
   1GA21,MMTA - Surgical Aftercare - Low,Early - Community,1,0.954,2
   1GA31,MMTA - Surgical Aftercare - Low,Early - Community,2,1.104,2
   2GA11,MMTA - Surgical Aftercare - Low,Early - Institutional,0,1.099,3
   2GA21,MMTA - Surgical Aftercare - Low,Early - Institutional,1,1.162,3
   2GA31,MMTA - Surgical Aftercare - Low,Early - Institutional,2,1.311,3
   3GA11,MMTA - Surgical Aftercare - Low,Late - Community,0,0.544,2
   3GA21,MMTA - Surgical Aftercare - Low,Late - Community,1,0.606,2
   3GA31,MMTA - Surgical Aftercare - Low,Late - Community,2,0.756,2
   4GA11,MMTA - Surgical Aftercare - Low,Late - Institutional,0,1.022,2
   4GA21,MMTA - Surgical Aftercare - Low,Late - Institutional,1,1.084,3
   4GA31,MMTA - Surgical Aftercare - Low,Late - Institutional,2,1.233,2
   1GB11,MMTA - Surgical Aftercare - Medium,Early - Community,0,1.010,3
   1GB21,MMTA - Surgical Aftercare - Medium,Early - Community,1,1.073,3
   1GB31,MMTA - Surgical Aftercare - Medium,Early - Community,2,1.222,3
   2GB11,MMTA - Surgical Aftercare - Medium,Early - Institutional,0,1.218,3
   2GB21,MMTA - Surgical Aftercare - Medium,Early - Institutional,1,1.280,4
   2GB31,MMTA - Surgical Aftercare - Medium,Early - Institutional,2,1.429,4
   3GB11,MMTA - Surgical Aftercare - Medium,Late - Community,0,0.662,2
   3GB21,MMTA - Surgical Aftercare - Medium,Late - Community,1,0.724,2
   3GB31,MMTA - Surgical Aftercare - Medium,Late - Community,2,0.874,2
   4GB11,MMTA - Surgical Aftercare - Medium,Late - Institutional,0,1.140,3
   4GB21,MMTA - Surgical Aftercare - Medium,Late - Institutional,1,1.202,3
   4GB31,MMTA - Surgical Aftercare - Medium,Late - Institutional,2,1.351,4
   1GC11,MMTA - Surgical Aftercare - High,Early - Community,0,1.138,3
   1GC21,MMTA - Surgical Aftercare - High,Early - Community,1,1.200,3
   1GC31,MMTA - Surgical Aftercare - High,Early - Community,2,1.349,3
   2GC11,MMTA - Surgical Aftercare - High,Early - Institutional,0,1.345,4
   2GC21,MMTA - Surgical Aftercare - High,Early - Institutional,1,1.407,4
   2GC31,MMTA - Surgical Aftercare - High,Early - Institutional,2,1.557,4
   3GC11,MMTA - Surgical Aftercare - High,Late - Community,0,0.790,2
   3GC21,MMTA - Surgical Aftercare - High,Late - Community,1,0.852,2
   3GC31,MMTA - Surgical Aftercare - High,Late - Community,2,1.001,2
   4GC11,MMTA - Surgical Aftercare - High,Late - Institutional,0,1.267,3
   4GC21,MMTA - Surgical Aftercare - High,Late - Institutional,1,1.330,3
   4GC31,MMTA - Surgical Aftercare - High,Late - Institutional,2,1.479,4
   
   WOUND CARE CODES (C Clinical Group - Complete):
   1CA11,Wound - Low,Early - Community,0,1.285,4
   1CA21,Wound - Low,Early - Community,1,1.347,4
   1CA31,Wound - Low,Early - Community,2,1.497,4
   2CA11,Wound - Low,Early - Institutional,0,1.492,4
   2CA21,Wound - Low,Early - Institutional,1,1.555,4
   2CA31,Wound - Low,Early - Institutional,2,1.704,4
   3CA11,Wound - Low,Late - Community,0,0.937,2
   3CA21,Wound - Low,Late - Community,1,0.999,3
   3CA31,Wound - Low,Late - Community,2,1.148,3
   4CA11,Wound - Low,Late - Institutional,0,1.415,3
   4CA21,Wound - Low,Late - Institutional,1,1.477,4
   4CA31,Wound - Low,Late - Institutional,2,1.626,4
   1CB11,Wound - Medium,Early - Community,0,1.380,4
   1CB21,Wound - Medium,Early - Community,1,1.443,4
   1CB31,Wound - Medium,Early - Community,2,1.592,4
   2CB11,Wound - Medium,Early - Institutional,0,1.588,4
   2CB21,Wound - Medium,Early - Institutional,1,1.650,4
   2CB31,Wound - Medium,Early - Institutional,2,1.799,4
   3CB11,Wound - Medium,Late - Community,0,1.032,3
   3CB21,Wound - Medium,Late - Community,1,1.094,3
   3CB31,Wound - Medium,Late - Community,2,1.244,3
   4CB11,Wound - Medium,Late - Institutional,0,1.510,4
   4CB21,Wound - Medium,Late - Institutional,1,1.572,4
   4CB31,Wound - Medium,Late - Institutional,2,1.721,4
   
   NEUROLOGICAL CODES (B Clinical Group - Updated):
   1BA11,Neuro - Low,Early - Community,0,1.041,4
   1BA21,Neuro - Low,Early - Community,1,1.104,4
   1BA31,Neuro - Low,Early - Community,2,1.253,3
   2BA11,Neuro - Low,Early - Institutional,0,1.249,4
   2BA21,Neuro - Low,Early - Institutional,1,1.311,4
   2BA31,Neuro - Low,Early - Institutional,2,1.460,4
   3BA11,Neuro - Low,Late - Community,0,0.693,2
   3BA21,Neuro - Low,Late - Community,1,0.755,2
   3BA31,Neuro - Low,Late - Community,2,0.905,2
   4BA11,Neuro - Low,Late - Institutional,0,1.171,3
   4BA21,Neuro - Low,Late - Institutional,1,1.233,3
   4BA31,Neuro - Low,Late - Institutional,2,1.382,3
   1BB11,Neuro - Medium,Early - Community,0,1.153,4
   1BB21,Neuro - Medium,Early - Community,1,1.215,4
   1BB31,Neuro - Medium,Early - Community,2,1.365,4
   2BB11,Neuro - Medium,Early - Institutional,0,1.360,4
   2BB21,Neuro - Medium,Early - Institutional,1,1.423,5
   2BB31,Neuro - Medium,Early - Institutional,2,1.572,5
   3BB11,Neuro - Medium,Late - Community,0,0.805,2
   3BB21,Neuro - Medium,Late - Community,1,0.867,2
   3BB31,Neuro - Medium,Late - Community,2,1.016,2
   4BB11,Neuro - Medium,Late - Institutional,0,1.283,4
   4BB21,Neuro - Medium,Late - Institutional,1,1.345,4
   4BB31,Neuro - Medium,Late - Institutional,2,1.494,4
   1BC11,Neuro - High,Early - Community,0,1.293,4
   1BC21,Neuro - High,Early - Community,1,1.355,4
   1BC31,Neuro - High,Early - Community,2,1.504,4
   2BC11,Neuro - High,Early - Institutional,0,1.500,5
   2BC21,Neuro - High,Early - Institutional,1,1.562,5
   2BC31,Neuro - High,Early - Institutional,2,1.712,4
   3BC11,Neuro - High,Late - Community,0,0.945,2
   3BC21,Neuro - High,Late - Community,1,1.007,3
   3BC31,Neuro - High,Late - Community,2,1.156,3
   4BC11,Neuro - High,Late - Institutional,0,1.422,4
   4BC21,Neuro - High,Late - Institutional,1,1.485,4
   4BC31,Neuro - High,Late - Institutional,2,1.634,4
   
   IMPORTANT: After calculating HIPPS using OASIS fields, EXACTLY match the calculated HIPPS code to this CSV table to get the correct Medicare weight and LUPA threshold for the caseMixAnalysis.hippsClassification fields.
      

      
   H. OPTIMIZATION OPPORTUNITIES IDENTIFICATION:
      Analyze documentation for missing coding opportunities:
      
      MISSING DIAGNOSIS CODES:
      - Analyze ALL clinical documentation to identify uncoded conditions that impact complexity:
        * Review vital signs, assessments, medications, and functional limitations
        * Look for documented symptoms, findings, or conditions not captured in primary diagnoses
        * Identify chronic conditions, comorbidities, and complications mentioned in clinical notes
        * Consider all body systems: cardiovascular, respiratory, neurological, musculoskeletal, integumentary, endocrine, gastrointestinal, genitourinary
        * Include medication-related conditions, fall risks, infection indicators, and functional impairments
        * Each identified condition should include appropriate ICD-10 code, description, weight impact estimation, and clinical rationale
      
      SEVERITY IMPROVEMENTS:
      - Review ALL current severity levels against documented clinical evidence:
        * Examine OASIS severity assessments (M1030-M1060 series) vs clinical documentation
        * Compare severity levels with functional performance, symptoms, and complications documented
        * Identify conditions where clinical evidence supports higher severity than currently coded
        * Include any documented complications, acute conditions, or functional impairments that justify severity increase
        * Consider medication complexity, oxygen dependency, wounds, infections, and functional limitations as severity indicators
      
      COMORBIDITY ADDITIONS:
      - Analyze ALL documented comorbidities and secondary conditions:
        * Review medication lists for chronic condition indicators (antihypertensives, diabetes medications, cardiac drugs, etc.)
        * Examine social history, patient reports, and family history for additional diagnoses
        * Identify procedural history, implantable devices, and surgical interventions
        * Look for risk factors, lifestyle conditions, and environmental factors
        * Include chronic pain conditions, mental health conditions, and quality-of-life impactors
        * Verify completeness of existing secondary diagnoses and add missing supporting conditions
      - Depression: F32.9 if mood assessment indicates depression 
      - Sleep disorders: G47.0 if insomnia/poor sleep noted 
      
      DOCUMENTATION ENHANCEMENTS:
      - Functional Assessment Precision: Enhance ADL (M1800-M1870) documentation with specific examples and quantitative measures
      - Medication Impact Documentation: Clarify how medications affect patient function, mobility, and cognition
      - Care Complexity Documentation: Detail caregiver needs, assistance levels, and supervision requirements
      - Environmental Factors: Document home safety, accessibility barriers, and factors affecting care delivery
      - Clinical Reasoning: Provide clear rationale for severity assignments and functional assessments
      - Consistency Check: Ensure documentation supports assigned severity levels and functional scores
      
      
      
   J. REVENUE IMPACT CALCULATION:
      Medicare base rate varies by location ($2,400-$3,200 per episode)
      Revenue Increase = (Optimized Weight - Current Weight) × Base Rate
      Example: (1.568 - 1.415) × $2,675 = $409 per episode

7. FINANCIAL RECOMMENDATIONS:
   - Suggest specific documentation improvements for revenue enhancement
   - Identify service additions or intensification opportunities  
   - Calculate ROI for each optimization recommendation
   - Provide implementation strategies for revenue maximization

IMPORTANT INSTRUCTIONS:
- Base all analysis on the actual clinical documentation provided in the OASIS assessment
- Apply flexible field extraction that works with any OASIS document version or format
- Follow current HIPPS coding and Medicare home health billing guidelines
- Consider universal OASIS requirements for financial optimization (SOC/ROC/Follow-Up/Discharge)
- Provide specific, actionable financial recommendations with revenue impact
- Ensure all payment calculations are accurate and achievable
- Consider home health agency operational constraints
- Address billing compliance requirements for Medicare reimbursement and other payers
- Use universal methodology that adapts to any assessment type or document structure
- Provide clear rationale for all financial suggestions, including:
  * What specific revenue opportunity the recommendation addresses
  * How it will improve agency financial performance
  * What the financial impact will be (specific dollar amounts)
  * What documentation enhancements are needed to support optimization
  * What the implementation costs and ROI calculations apply
  * Step-by-step instructions for implementing each recommendation
  * For payment optimization: Explain methodology, justification, and projected revenue impact
  * For case mix optimization: Specify weight increases and corresponding revenue gains
  * For service additions: Define patient eligibility, implementation costs, and revenue potential
- Adapt analysis approach based on document type:
  * SOC assessments: Focus on initial optimization opportunities
  * ROC assessments: Emphasize recertification optimization strategies
  * Follow-Up assessments: Identify ongoing optimization potential
  * Discharge assessments: Highlight missed opportunities for future reference

Return a comprehensive JSON analysis following the exact structure specified in the system prompt. Focus on accuracy, completeness, and optimization of the financial analysis to ensure proper reimbursement and revenue maximization for ANY type of OASIS assessment document.`;
  }

  private cleanJsonResponse(responseText: string): string {
    console.log('Financial Optimization Review Service: Starting JSON cleaning...');
    
    // Remove any text before the first { or [
    let cleanResponse = responseText.trim();
    const firstBrace = cleanResponse.indexOf('{');
    const firstBracket = cleanResponse.indexOf('[');
    
    if (firstBrace === -1 && firstBracket === -1) {
      throw new Error('No JSON structure found in response');
    }
    
    let startIndex = 0;
    if (firstBrace !== -1 && firstBracket !== -1) {
      startIndex = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
      startIndex = firstBrace;
    } else {
      startIndex = firstBracket;
    }
    
    cleanResponse = cleanResponse.substring(startIndex);
    
    // Find the end of the JSON (last } or ])
    let braceCount = 0;
    let bracketCount = 0;
    let endIndex = cleanResponse.length;
    
    for (let i = 0; i < cleanResponse.length; i++) {
      if (cleanResponse[i] === '{') braceCount++;
      else if (cleanResponse[i] === '}') braceCount--;
      else if (cleanResponse[i] === '[') bracketCount++;
      else if (cleanResponse[i] === ']') bracketCount--;
      
      if (braceCount === 0 && bracketCount === 0 && i > 0) {
        endIndex = i + 1;
        break;
      }
    }
    
    cleanResponse = cleanResponse.substring(0, endIndex);
    console.log('Financial Optimization Review Service: Extracted JSON section length:', cleanResponse.length);
    
    // Enhanced JSON fixing - more aggressive cleaning
    cleanResponse = cleanResponse
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .replace(/(\w+):/g, '"$1":') // Quote unquoted keys
      .replace(/undefined/g, 'null') // Replace undefined with null
      .replace(/NaN/g, 'null') // Replace NaN with null
      .replace(/Infinity/g, 'null') // Replace Infinity with null
      .replace(/,\s*}/g, '}') // Remove trailing commas before closing braces
      .replace(/,\s*]/g, ']') // Remove trailing commas before closing brackets
      .replace(/},/g, '}') // Remove trailing commas after closing braces
      .replace(/],/g, ']') // Remove trailing commas after closing brackets
      .replace(/(:)\s*(\w+)/g, '$1"$2"') // Quote unquoted string values
      .replace(/(")[^"]*(":)/g, '$1$2'); // Fix malformed string keys
    
    console.log('Financial Optimization Review Service: JSON cleaning completed');
    return cleanResponse;
  }

  private calculateFinancialConfidence(result: FinancialOptimizationResult, responseLength: number): number {
    let confidence = 0.5; // Base confidence
    
    try {
      // Factor 1: Financial Analysis Quality (0-0.3 points)
      const financialQuality = this.assessFinancialQuality(result);
      confidence += financialQuality;
      
      // Factor 2: Revenue Calculation Completeness (0-0.2 points)
      const revenueCompleteness = this.assessRevenueCompleteness(result);
      confidence += revenueCompleteness;
      
      // Factor 3: Optimization Strategy Quality (0-0.2 points)
      const strategyQuality = this.assessStrategyQuality(result);
      confidence += strategyQuality;
      
      // Factor 4: Response Adequacy (0-0.15 points)
      const adequacy = this.assessResponseAdequacy(result, responseLength);
      confidence += adequacy;
      
      // Bonus/Penalty for specifics
      confidence += this.getAdjustments(result);
      
    } catch (error) {
      console.log('Financial Optimization Review Service: Error calculating confidence, using baseline');
      confidence = 0.3; // Lower baseline if calculation fails
    }
    
    return Math.min(1.0, Math.max(0.0, confidence));
  }

  private assessFinancialQuality(result: FinancialOptimizationResult): number {
    let score = 0;
    
    
    return Math.min(0.3, score);
  }

  private assessRevenueCompleteness(result: FinancialOptimizationResult): number {
    let score = 0;
    
    // Check for revenue calculations
    if (result.summary.currentRevenuePotential > 0 && 
        result.summary.optimizedRevenuePotential > 0) {
      score += 0.1;
    }
    
    
    return Math.min(0.2, score);
  }

  private assessStrategyQuality(result: FinancialOptimizationResult): number {
    let score = 0;
    
    // Check for practical recommendations
    if (result.financialRecommendations.revenueStrategies.length > 0) {
      score += 0.05;
    }
    
    if (result.financialRecommendations.documentationImprovements.length > 0) {
      score += 0.05;
    }
    
    if (result.financialRecommendations.paymentOptimization.length > 0) {
      score += 0.1;
    }
    
    return Math.min(0.2, score);
  }

  private assessResponseAdequacy(result: FinancialOptimizationResult, responseLength: number): number {
    let score = 0;
    
    // Optimal range for financial analysis
    if (responseLength >= 8000 && responseLength <= 15000) {
      score += 0.15;
    } else if (responseLength >= 5000 && responseLength < 25000) {
      score += 0.1;
    } else if (responseLength >= 2000) {
      score += 0.05;
    }
    
    return Math.min(0.15, score);
  }

  private getAdjustments(result: FinancialOptimizationResult): number {
    let adjustment = 0;
    
    // Bonus for comprehensive analysis
    if (result.summary.optimizationOpportunities >= 5) {
      adjustment += 0.05;
    }
    
    // Bonus for detailed service analysis
    if (result.serviceOptimization.resourceAnalysis.serviceComponents.length >= 5) {
      adjustment += 0.05;
    }
    
    // Bonus for specific ROI calculations
    if (result.financialRecommendations.roiCalculations && 
        result.financialRecommendations.roiCalculations.length > 100) {
      adjustment += 0.05;
    }
    
    return adjustment;
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
   * Progressive JSON parsing for very large responses
   */
  private progressiveJsonParse(jsonString: string): any {
    console.log('Financial Optimization Review Service: Starting progressive JSON parsing');
    
    // Try to extract core JSON structure first
    try {
      // Find the main JSON object boundaries
      const firstBrace = jsonString.indexOf('{');
      const lastBrace = jsonString.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const coreJson = jsonString.substring(firstBrace, lastBrace + 1);
        console.log('Financial Optimization Review Service: Extracted core JSON, length:', coreJson.length);
        
        // Try to parse the core JSON
        const parsed = JSON.parse(coreJson);
        console.log('Financial Optimization Review Service: Core JSON parsing successful');
        return parsed;
      }
    } catch (coreError) {
      console.log('Financial Optimization Review Service: Core JSON parsing failed:', coreError);
    }
    
    // Fallback: try to extract any recognizable JSON structure
    const fallbackMatch = jsonString.match(/{[^}]*}/);
    if (fallbackMatch) {
      console.log('Financial Optimization Review Service: Using fallback JSON extraction');
      return JSON.parse(fallbackMatch[0]);
    }
    
    throw new Error('No valid JSON structure found for progressive parsing');
  }
}

export default FinancialOptimizationReviewService;