-- =====================================================
-- CHECK IF LAST_LOGOUT COLUMN EXISTS
-- =====================================================
-- This script checks if the last_logout column exists in your tables

-- Check staff tables
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name LIKE 'staff_%'
AND column_name = 'last_logout'
ORDER BY table_name;

-- Check patient tables  
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name LIKE 'patients_%'
AND column_name = 'last_logout'
ORDER BY table_name;

-- If no results above, the last_logout column doesn't exist yet
-- You need to run: add_last_logout_columns.sql
