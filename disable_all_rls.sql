-- =====================================================
-- DISABLE RLS ON ALL AGENCY TABLES
-- =====================================================
-- This will disable RLS on all agency-specific tables for testing

-- Disable RLS on all agency-specific tables
ALTER TABLE subscription_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE sent_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE drafts_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_visits_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_vitals_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medications_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_documents_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_tasks_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_history_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_enrollments_test_healthcare_agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_audit_log_test_healthcare_agency DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on the main agency table
ALTER TABLE agency DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename LIKE '%test_healthcare_agency%'
   OR tablename = 'agency'
ORDER BY tablename;

-- Test the subscription query
SELECT 
    agency_name,
    subscription_type,
    status,
    total_price
FROM subscription_test_healthcare_agency
WHERE agency_id = '21878b32-7cad-4abe-ab34-47eb0680f801'
AND status IN ('active', 'trial')
ORDER BY subscription_type;
