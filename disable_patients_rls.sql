-- =====================================================
-- DISABLE RLS ON PATIENTS TABLE
-- =====================================================
-- This script disables Row Level Security on the patients table
-- to match the staff table behavior
-- =====================================================

-- Disable Row Level Security on patients table
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Drop the existing RLS policy
DROP POLICY IF EXISTS "Agency can manage their patients" ON patients;

-- Add comment for documentation
COMMENT ON TABLE patients IS 'Patients table for Patient role (RLS disabled for development)';
