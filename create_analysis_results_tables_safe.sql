-- Safe table creation script - handles existing tables
-- This script will either create tables if they don't exist, or skip if they do

-- Drop existing tables if they exist (use with caution)
-- Uncomment the lines below if you want to recreate the tables from scratch
-- DROP TABLE IF EXISTS public.financial_optimization_results CASCADE;
-- DROP TABLE IF EXISTS public.coding_review_results CASCADE;
-- DROP TABLE IF EXISTS public.qa_review_results CASCADE;

-- Create tables with IF NOT EXISTS to avoid errors
CREATE TABLE IF NOT EXISTS public.qa_review_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  analysis_id character varying(255) NOT NULL,
  file_name character varying(255) NOT NULL,
  analysis_type character varying(50) NOT NULL DEFAULT 'qa-review',
  status character varying(20) NOT NULL DEFAULT 'completed',
  priority character varying(20) NOT NULL DEFAULT 'medium',
  patient_id character varying(100),
  processing_notes text,
  ai_model character varying(50) NOT NULL DEFAULT 'gpt-5-nano',
  
  -- Analysis Results (JSON)
  results jsonb NOT NULL,
  
  -- Metrics
  confidence numeric(3,2) DEFAULT 0.0,
  processing_time character varying(50),
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Constraints
  CONSTRAINT qa_review_results_pkey PRIMARY KEY (id),
  CONSTRAINT qa_review_results_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agency(id) ON DELETE CASCADE,
  CONSTRAINT qa_review_results_analysis_id_key UNIQUE (analysis_id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.coding_review_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  analysis_id character varying(255) NOT NULL,
  file_name character varying(255) NOT NULL,
  analysis_type character varying(50) NOT NULL DEFAULT 'coding-review',
  status character varying(20) NOT NULL DEFAULT 'completed',
  priority character varying(20) NOT NULL DEFAULT 'medium',
  patient_id character varying(100),
  processing_notes text,
  ai_model character varying(50) NOT NULL DEFAULT 'gpt-5-nano',
  
  -- Analysis Results (JSON)
  results jsonb NOT NULL,
  
  -- Metrics
  confidence numeric(3,2) DEFAULT 0.0,
  processing_time character varying(50),
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Constraints
  CONSTRAINT coding_review_results_pkey PRIMARY KEY (id),
  CONSTRAINT coding_review_results_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agency(id) ON DELETE CASCADE,
  CONSTRAINT coding_review_results_analysis_id_key UNIQUE (analysis_id)
) TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.financial_optimization_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL,
  analysis_id character varying(255) NOT NULL,
  file_name character varying(255) NOT NULL,
  analysis_type character varying(50) NOT NULL DEFAULT 'financial-optimization',
  status character varying(20) NOT NULL DEFAULT 'completed',
  priority character varying(20) NOT NULL DEFAULT 'medium',
  patient_id character varying(100),
  processing_notes text,
  ai_model character varying(50) NOT NULL DEFAULT 'gpt-5-nano',
  
  -- Analysis Results (JSON)
  results jsonb NOT NULL,
  
  -- Metrics
  confidence numeric(3,2) DEFAULT 0.0,
  processing_time character varying(50),
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Constraints
  CONSTRAINT financial_optimization_results_pkey PRIMARY KEY (id),
  CONSTRAINT financial_optimization_results_agency_id_fkey FOREIGN KEY (agency_id) REFERENCES public.agency(id) ON DELETE CASCADE,
  CONSTRAINT financial_optimization_results_analysis_id_key UNIQUE (analysis_id)
) TABLESPACE pg_default;

-- Create indexes for better performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_qa_review_results_agency_id ON public.qa_review_results USING btree (agency_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_qa_review_results_analysis_type ON public.qa_review_results USING btree (analysis_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_qa_review_results_status ON public.qa_review_results USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_qa_review_results_created_at ON public.qa_review_results USING btree (created_at DESC) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_coding_review_results_agency_id ON public.coding_review_results USING btree (agency_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_coding_review_results_analysis_type ON public.coding_review_results USING btree (analysis_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_coding_review_results_status ON public.coding_review_results USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_coding_review_results_created_at ON public.coding_review_results USING btree (created_at DESC) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_financial_optimization_results_agency_id ON public.financial_optimization_results USING btree (agency_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_financial_optimization_results_analysis_type ON public.financial_optimization_results USING btree (analysis_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_financial_optimization_results_status ON public.financial_optimization_results USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_financial_optimization_results_created_at ON public.financial_optimization_results USING btree (created_at DESC) TABLESPACE pg_default;

-- Create GIN indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_qa_review_results_jsonb ON public.qa_review_results USING gin (results) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_coding_review_results_jsonb ON public.coding_review_results USING gin (results) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_financial_optimization_results_jsonb ON public.financial_optimization_results USING gin (results) TABLESPACE pg_default;

-- RLS is disabled - all agencies can access all analysis results
-- No Row Level Security restrictions applied

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamp (IF NOT EXISTS)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_qa_review_results_updated_at') THEN
        CREATE TRIGGER update_qa_review_results_updated_at BEFORE UPDATE ON public.qa_review_results
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_coding_review_results_updated_at') THEN
        CREATE TRIGGER update_coding_review_results_updated_at BEFORE UPDATE ON public.coding_review_results
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_financial_optimization_results_updated_at') THEN
        CREATE TRIGGER update_financial_optimization_results_updated_at BEFORE UPDATE ON public.financial_optimization_results
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE public.qa_review_results IS 'Stores QA Review analysis results for each agency';
COMMENT ON TABLE public.coding_review_results IS 'Stores Coding Review analysis results for each agency';
COMMENT ON TABLE public.financial_optimization_results IS 'Stores Financial Optimization analysis results for each agency';

COMMENT ON COLUMN public.qa_review_results.results IS 'JSONB field containing the complete analysis results';
COMMENT ON COLUMN public.coding_review_results.results IS 'JSONB field containing the complete analysis results';
COMMENT ON COLUMN public.financial_optimization_results.results IS 'JSONB field containing the complete analysis results';

-- Success message
SELECT 'Analysis results tables created/verified successfully!' as status;
