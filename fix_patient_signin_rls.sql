-- =====================================================
-- FIX PATIENT SIGNIN RLS ISSUE
-- =====================================================
-- This script fixes the RLS policies on the patients table
-- to allow patient signin to work properly
-- =====================================================

-- First, let's check if RLS is enabled and what policies exist
-- (This is just for reference - the actual fix is below)

-- Disable RLS temporarily to allow patient signin
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Agency can manage their patients" ON patients;
DROP POLICY IF EXISTS "Allow all operations on patients" ON patients;

-- Re-enable RLS with a permissive policy for development
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy that allows all operations
CREATE POLICY "Allow all operations on patients" ON patients
    FOR ALL USING (true) WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE patients IS 'Patients table for Patient role (permissive RLS for development)';

-- Verify the fix by checking if we can query patients
-- This should return the count of patients in the table
SELECT COUNT(*) as patient_count FROM patients;

-- Show the current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'patients';

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'patients';
