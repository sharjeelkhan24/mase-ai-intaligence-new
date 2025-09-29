import { HfInference } from '@huggingface/inference';

export interface PatientInfo {
  patientName?: string;
  mrn?: string;
  visitType?: string;
  payor?: string;
  visitDate?: string;
  clinician?: string;
  payPeriod?: string;
  status?: string;
}

class AIPatientInfoService {
  private hf: HfInference;

  constructor() {
    // Initialize Hugging Face Inference
    const token = process.env.HUGGINGFACE_API_TOKEN;
    console.log('AI Service: Hugging Face token available:', !!token);
    console.log('AI Service: Token starts with:', token ? token.substring(0, 10) + '...' : 'No token');
    
    if (!token) {
      throw new Error('HUGGINGFACE_API_TOKEN environment variable is not set');
    }
    
    this.hf = new HfInference(token);
  }

  async extractPatientInfo(content: string, fileName: string): Promise<PatientInfo> {
    try {
      console.log('AI Service: Starting patient info extraction for:', fileName);
      console.log('AI Service: Content length:', content.length);
      console.log('AI Service: Content preview:', content.substring(0, 500));
      
      const patientInfo: PatientInfo = {};
      
      // Extract patient name from OASIS form structure
      // Look for patterns like "Last, First" or "First Name: First" + "Last Name: Last"
      const nameMatch = content.match(/([A-Z][a-z]+,\s*[A-Z][a-z]+)/);
      if (nameMatch) {
        patientInfo.patientName = nameMatch[1].trim().toUpperCase();
      } else {
        // Try alternative patterns from OASIS form
        const firstNameMatch = content.match(/First Name:\s*([A-Za-z]+)/i);
        const lastNameMatch = content.match(/Last Name:\s*([A-Za-z]+)/i);
        if (firstNameMatch && lastNameMatch) {
          patientInfo.patientName = `${lastNameMatch[1].trim()}, ${firstNameMatch[1].trim()}`.toUpperCase();
        } else {
          // Try the header pattern: "Last, FirstDOB: MM/DD/YYYYMRN: PATIENTID"
          const headerMatch = content.match(/([A-Z][a-z]+,\s*[A-Z][a-z]+)DOB:/);
          if (headerMatch) {
            patientInfo.patientName = headerMatch[1].trim().toUpperCase();
          }
        }
      }
      
      // Extract MRN from OASIS form
      const mrnMatch = content.match(/ID Number:\s*([A-Za-z0-9]+)/i) || 
                      content.match(/MRN:\s*([A-Za-z0-9]+)/i) ||
                      content.match(/Medical Record Number:\s*([A-Za-z0-9]+)/i) ||
                      content.match(/MRN:\s*([A-Za-z0-9]+)/i);
      if (mrnMatch) {
        patientInfo.mrn = mrnMatch[1].trim();
      }
      
      // Extract visit type from OASIS form
      const visitTypeMatch = content.match(/Start of Care/i) ? 'SOC' :
                            content.match(/Resumption of Care/i) ? 'ROC' :
                            content.match(/Recertification/i) ? 'RECERT' :
                            content.match(/Discharge/i) ? 'DISCHARGE' : null;
      if (visitTypeMatch) {
        patientInfo.visitType = visitTypeMatch;
      }
      
      // Extract payor from OASIS form
      const payorMatch = content.match(/Medicare \(traditional fee-for-service\)/i) ? 'MEDICARE' :
                        content.match(/Medicare \(HMO\/managed care\/Advantage plan\)/i) ? 'MEDICARE HMO' :
                        content.match(/Medicaid \(traditional fee-for-service\)/i) ? 'MEDICAID' :
                        content.match(/Medicaid \(HMO\/Managed Care\)/i) ? 'MEDICAID HMO' :
                        content.match(/Private insurance/i) ? 'PRIVATE' :
                        content.match(/Self-pay/i) ? 'SELF-PAY' : null;
      if (payorMatch) {
        patientInfo.payor = payorMatch;
      }
      
      // Extract visit date from OASIS form
      const visitDateMatch = content.match(/Visit Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i) ||
                            content.match(/Start of Care Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i) ||
                            content.match(/Date Assessment Completed:\s*(\d{1,2}\/\d{1,2}\/\d{4})/i) ||
                            content.match(/Visit Date:(\d{1,2}\/\d{1,2}\/\d{4})/i);
      if (visitDateMatch) {
        patientInfo.visitDate = visitDateMatch[1].trim();
      }
      
      // Extract clinician from OASIS form
      const clinicianMatch = content.match(/Electronically Signed by:\s*([A-Za-z\s]+)/i) ||
                            content.match(/Physician Name:\s*([A-Za-z\s,]+)/i) ||
                            content.match(/RN:\s*([A-Za-z\s]+)/i) ||
                            content.match(/Electronically Signed by:\s*([A-Za-z\s]+)RN/i);
      if (clinicianMatch) {
        patientInfo.clinician = clinicianMatch[1].trim();
      }
      
      // Extract pay period from OASIS form
      const payPeriodMatch = content.match(/Certification Period:\s*(\d{1,2}\/\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{1,2}\/\d{4})/i);
      if (payPeriodMatch) {
        patientInfo.payPeriod = payPeriodMatch[1].trim();
      }
      
      // Extract status from OASIS form
      const statusMatch = content.match(/Start of care - further visits planned/i) ? 'ACTIVE' :
                         content.match(/Discharge from agency/i) ? 'DISCHARGED' :
                         content.match(/Death at home/i) ? 'DECEASED' :
                         content.match(/Transferred to an inpatient facility/i) ? 'TRANSFERRED' : 'ACTIVE';
      if (statusMatch) {
        patientInfo.status = statusMatch;
      }
      
      console.log('AI Service: Extracted patient info:', patientInfo);
      return patientInfo;

    } catch (error) {
      console.error('Error in AI patient info extraction:', error);
      console.error('Error details:', error);
      // Return empty patient info if AI fails
      return {};
    }
  }


  private validateAndCleanPatientInfo(patientInfo: any): PatientInfo {
    const cleaned: PatientInfo = {};
    
    // Clean and validate each field
    if (patientInfo.patientName && typeof patientInfo.patientName === 'string') {
      cleaned.patientName = patientInfo.patientName.trim().toUpperCase();
    }
    
    if (patientInfo.mrn && typeof patientInfo.mrn === 'string') {
      cleaned.mrn = patientInfo.mrn.trim();
    }
    
    if (patientInfo.visitType && typeof patientInfo.visitType === 'string') {
      cleaned.visitType = patientInfo.visitType.trim().toUpperCase();
    }
    
    if (patientInfo.payor && typeof patientInfo.payor === 'string') {
      cleaned.payor = patientInfo.payor.trim().toUpperCase();
    }
    
    if (patientInfo.visitDate && typeof patientInfo.visitDate === 'string') {
      cleaned.visitDate = patientInfo.visitDate.trim();
    }
    
    if (patientInfo.clinician && typeof patientInfo.clinician === 'string') {
      cleaned.clinician = patientInfo.clinician.trim();
    }
    
    if (patientInfo.payPeriod && typeof patientInfo.payPeriod === 'string') {
      cleaned.payPeriod = patientInfo.payPeriod.trim();
    }
    
    if (patientInfo.status && typeof patientInfo.status === 'string') {
      cleaned.status = patientInfo.status.trim();
    }
    
    return cleaned;
  }
}

// Export singleton instance
export const aiPatientInfoService = new AIPatientInfoService();
