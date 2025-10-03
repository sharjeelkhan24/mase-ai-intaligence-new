import { createClient } from '@supabase/supabase-js';

export interface AnalysisResult {
  id?: string;
  agency_id: string;
  analysis_id: string;
  file_name: string;
  analysis_type: 'qa-review' | 'coding-review' | 'financial-optimization';
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'error';
  priority: string;
  patient_id?: string;
  processing_notes?: string;
  ai_model: string;
  results: any; // JSONB data
  confidence?: number;
  processing_time?: string;
  created_at?: string;
  updated_at?: string;
}

class AnalysisResultsService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // QA Review Results
  async saveQAReviewResult(result: AnalysisResult): Promise<AnalysisResult> {
    const { data, error } = await this.supabase
      .from('qa_review_results')
      .insert([result])
      .select()
      .single();

    if (error) {
      console.error('Error saving QA review result:', error);
      throw error;
    }

    return data;
  }

  async getQAReviewResults(agencyId: string): Promise<AnalysisResult[]> {
    const { data, error } = await this.supabase
      .from('qa_review_results')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching QA review results:', error);
      throw error;
    }

    return data || [];
  }

  async getQAReviewResult(analysisId: string): Promise<AnalysisResult | null> {
    const { data, error } = await this.supabase
      .from('qa_review_results')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (error) {
      console.error('Error fetching QA review result:', error);
      return null;
    }

    return data;
  }

  // Coding Review Results
  async saveCodingReviewResult(result: AnalysisResult): Promise<AnalysisResult> {
    const { data, error } = await this.supabase
      .from('coding_review_results')
      .insert([result])
      .select()
      .single();

    if (error) {
      console.error('Error saving coding review result:', error);
      throw error;
    }

    return data;
  }

  async getCodingReviewResults(agencyId: string): Promise<AnalysisResult[]> {
    const { data, error } = await this.supabase
      .from('coding_review_results')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coding review results:', error);
      throw error;
    }

    return data || [];
  }

  async getCodingReviewResult(analysisId: string): Promise<AnalysisResult | null> {
    const { data, error } = await this.supabase
      .from('coding_review_results')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (error) {
      console.error('Error fetching coding review result:', error);
      return null;
    }

    return data;
  }

  // Financial Optimization Results
  async saveFinancialOptimizationResult(result: AnalysisResult): Promise<AnalysisResult> {
    const { data, error } = await this.supabase
      .from('financial_optimization_results')
      .insert([result])
      .select()
      .single();

    if (error) {
      console.error('Error saving financial optimization result:', error);
      throw error;
    }

    return data;
  }

  async getFinancialOptimizationResults(agencyId: string): Promise<AnalysisResult[]> {
    const { data, error } = await this.supabase
      .from('financial_optimization_results')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching financial optimization results:', error);
      throw error;
    }

    return data || [];
  }

  async getFinancialOptimizationResult(analysisId: string): Promise<AnalysisResult | null> {
    const { data, error } = await this.supabase
      .from('financial_optimization_results')
      .select('*')
      .eq('analysis_id', analysisId)
      .single();

    if (error) {
      console.error('Error fetching financial optimization result:', error);
      return null;
    }

    return data;
  }

  // Get all results for an agency (combined)
  async getAllAnalysisResults(agencyId: string): Promise<AnalysisResult[]> {
    try {
      const [qaResults, codingResults, financialResults] = await Promise.all([
        this.getQAReviewResults(agencyId),
        this.getCodingReviewResults(agencyId),
        this.getFinancialOptimizationResults(agencyId)
      ]);

      // Combine all results and sort by created_at
      const allResults = [...qaResults, ...codingResults, ...financialResults];
      return allResults.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    } catch (error) {
      console.error('Error fetching all analysis results:', error);
      throw error;
    }
  }

  // Delete results (cleanup)
  async deleteQAReviewResult(analysisId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('qa_review_results')
      .delete()
      .eq('analysis_id', analysisId);

    if (error) {
      console.error('Error deleting QA review result:', error);
      return false;
    }

    return true;
  }

  async deleteCodingReviewResult(analysisId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('coding_review_results')
      .delete()
      .eq('analysis_id', analysisId);

    if (error) {
      console.error('Error deleting coding review result:', error);
      return false;
    }

    return true;
  }

  async deleteFinancialOptimizationResult(analysisId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('financial_optimization_results')
      .delete()
      .eq('analysis_id', analysisId);

    if (error) {
      console.error('Error deleting financial optimization result:', error);
      return false;
    }

    return true;
  }

  // Get agency by email (helper method)
  async getAgencyByEmail(email: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('agency')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching agency by email:', error);
      return null;
    }

    return data;
  }
}

export default AnalysisResultsService;
