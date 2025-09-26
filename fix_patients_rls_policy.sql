-- =====================================================
-- FIX PATIENTS RLS POLICY
-- =====================================================
-- This script restores the permissive RLS policy for the patients table
-- to match the original add_staff_patients_tables.sql behavior
-- =====================================================

-- Ensure RLS is enabled on patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Drop the restrictive policy and create permissive policy
DROP POLICY IF EXISTS "Agency can manage their patients" ON patients;
DROP POLICY IF EXISTS "Allow all operations on patients" ON patients;

-- Create permissive policy (allows all operations)
CREATE POLICY "Allow all operations on patients" ON patients
    FOR ALL USING (true) WITH CHECK (true);

-- Add comment for documentation
COMMENT ON TABLE patients IS 'Patients table for Patient role (permissive RLS for development)';
