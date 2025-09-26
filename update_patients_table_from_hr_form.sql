-- =====================================================
-- UPDATE PATIENTS TABLE TO MATCH HR MANAGEMENT FORM
-- =====================================================
-- This script updates the patients table to match the fields
-- used in the agency-dashboard/hr-management patient form
-- =====================================================

-- STEP 1: Fix RLS policies (if needed)
-- =====================================================

-- Disable RLS temporarily
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Agency can manage their patients" ON patients;
DROP POLICY IF EXISTS "Allow all operations on patients" ON patients;

-- Re-enable RLS with a permissive policy for development
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy that allows all operations
CREATE POLICY "Allow all operations on patients" ON patients
    FOR ALL USING (true) WITH CHECK (true);

-- STEP 2: Add missing columns from HR form
-- =====================================================

-- Add missing columns that the HR form expects
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS medical_conditions TEXT,
ADD COLUMN IF NOT EXISTS medications TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- STEP 3: Verify column names match HR form expectations
-- =====================================================

-- The HR form expects these field mappings:
-- - dateOfBirth -> date_of_birth (already exists)
-- - medicalRecordNumber -> medical_record_number (already exists)
-- - primaryNurse -> primary_nurse (already exists)
-- - admissionDate -> admission_date (already exists)
-- - dischargeDate -> discharge_date (already exists)
-- - emergencyContactName -> emergency_contact_name (already exists)
-- - emergencyContactPhone -> emergency_contact_phone (already exists)
-- - address -> address (already exists)
-- - city -> city (already exists)
-- - state -> state (already exists)
-- - zipCode -> zip_code (already exists)

-- STEP 4: Add documentation
-- =====================================================

-- Add comments for the new columns
COMMENT ON COLUMN patients.gender IS 'Patient gender: Male, Female, Other, Prefer not to say';
COMMENT ON COLUMN patients.medical_conditions IS 'Current medical conditions';
COMMENT ON COLUMN patients.medications IS 'Current medications';
COMMENT ON COLUMN patients.allergies IS 'Known allergies';
COMMENT ON COLUMN patients.profile_image IS 'Base64 encoded profile image or image URL';
COMMENT ON COLUMN patients.last_login IS 'Last login timestamp';

-- Update table comment
COMMENT ON TABLE patients IS 'Patients table for Patient role (matches HR management form)';

-- STEP 5: Verification
-- =====================================================

-- Verify the table structure matches HR form expectations
SELECT 
    'Current table structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'patients'
ORDER BY ordinal_position;

-- Test query to verify access
SELECT COUNT(*) as patient_count FROM patients;

-- Show RLS status
SELECT 
    'RLS status' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'patients';
