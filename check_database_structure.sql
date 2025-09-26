-- =====================================================
-- CHECK CURRENT DATABASE STRUCTURE
-- =====================================================
-- Run this to see what tables already exist in your database
-- =====================================================

-- List all tables in the database
SELECT 
    table_name, 
    table_type,
    table_schema
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if staff table exists and its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'staff' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if patients table exists and its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'patients' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check existing indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('staff', 'patients')
ORDER BY tablename, indexname;
