-- =====================================================
-- DISABLE RLS ON ALL TABLES
-- =====================================================
-- This will disable RLS on all tables so you can access them without authentication

-- Disable RLS on the main agency table
ALTER TABLE agency DISABLE ROW LEVEL SECURITY;

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

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename LIKE '%test_healthcare_agency%'
   OR tablename = 'agency'
ORDER BY tablename;
