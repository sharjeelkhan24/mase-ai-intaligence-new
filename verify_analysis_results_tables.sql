-- Migration script for Analysis Results Tables
-- Run this script in your Supabase SQL editor or via psql

-- Step 1: Create the analysis results tables
-- (Run the create_analysis_results_tables.sql file first)

-- Step 2: Verify tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results');

-- Step 3: Verify indexes were created
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY tablename, indexname;

-- Step 4: Verify RLS is disabled (no policies should exist)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results');
-- Expected result: No rows returned (RLS is disabled)

-- Step 5: Test data insertion (optional - remove after testing)
-- INSERT INTO public.qa_review_results (
--   agency_id,
--   analysis_id,
--   file_name,
--   analysis_type,
--   status,
--   priority,
--   ai_model,
--   results
-- ) VALUES (
--   (SELECT id FROM public.agency LIMIT 1), -- Replace with actual agency ID
--   'test_analysis_001',
--   'test_file.pdf',
--   'qa-review',
--   'completed',
--   'medium',
--   'gpt-5-nano',
--   '{"test": "data"}'::jsonb
-- );

-- Step 6: Verify the test data (uncomment if you ran the test insertion)
-- SELECT * FROM public.qa_review_results WHERE analysis_id = 'test_analysis_001';

-- Step 7: Clean up test data (uncomment if you ran the test insertion)
-- DELETE FROM public.qa_review_results WHERE analysis_id = 'test_analysis_001';

-- Step 8: Check table sizes and statistics
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY tablename, attname;
