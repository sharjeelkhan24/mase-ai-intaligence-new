-- =====================================================
-- TEST PATIENT TABLE STRUCTURE
-- =====================================================
-- This script tests the patients table structure and access
-- =====================================================

-- Test 1: Check if patients table exists and is accessible
SELECT 
    'Table exists' as test,
    COUNT(*) as result
FROM information_schema.tables 
WHERE table_name = 'patients';

-- Test 2: Check table structure
SELECT 
    'Table structure' as test,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'patients'
ORDER BY ordinal_position;

-- Test 3: Check RLS status
SELECT 
    'RLS status' as test,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'patients';

-- Test 4: Check RLS policies
SELECT 
    'RLS policies' as test,
    policyname,
    permissive,
    cmd as command,
    qual as using_clause,
    with_check
FROM pg_policies 
WHERE tablename = 'patients';

-- Test 5: Try to query patients (this will fail if RLS is blocking)
SELECT 
    'Patient count' as test,
    COUNT(*) as result
FROM patients;

-- Test 6: Try to query a specific patient (if any exist)
SELECT 
    'Sample patient' as test,
    id,
    email,
    first_name,
    last_name,
    account_status
FROM patients 
LIMIT 1;
