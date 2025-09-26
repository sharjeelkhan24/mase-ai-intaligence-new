-- =====================================================
-- CREATE AGENCY-SPECIFIC TABLES FUNCTION
-- =====================================================
-- This function allows the API to execute raw SQL for creating tables
-- Run this in your Supabase SQL Editor

-- Create function to execute SQL (if it doesn't exist)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- Add columns to agency table to store table names
ALTER TABLE agency 
ADD COLUMN IF NOT EXISTS patients_table_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS staff_table_name VARCHAR(100);

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_agency_patients_table_name ON agency(patients_table_name);
CREATE INDEX IF NOT EXISTS idx_agency_staff_table_name ON agency(staff_table_name);
