-- Check existing analysis results tables and their structure
-- Run this script to see what tables already exist and their current state

-- Check if tables exist
SELECT 
  table_name,
  table_type,
  CASE 
    WHEN table_name IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results') 
    THEN 'Analysis Results Table'
    ELSE 'Other Table'
  END as table_category
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY table_name;

-- Check table structures
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY table_name, ordinal_position;

-- Check constraints
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY tc.table_name, tc.constraint_type;

-- Check indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY tablename, indexname;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY tablename;

-- Check triggers
SELECT 
  trigger_name,
  event_object_table as table_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
AND event_object_table IN ('qa_review_results', 'coding_review_results', 'financial_optimization_results')
ORDER BY event_object_table, trigger_name;

-- Count existing records (if any)
SELECT 
  'qa_review_results' as table_name,
  COUNT(*) as record_count
FROM public.qa_review_results
UNION ALL
SELECT 
  'coding_review_results' as table_name,
  COUNT(*) as record_count
FROM public.coding_review_results
UNION ALL
SELECT 
  'financial_optimization_results' as table_name,
  COUNT(*) as record_count
FROM public.financial_optimization_results;
