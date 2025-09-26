-- Quick fix for the sanitization function
-- Run this in your Supabase SQL Editor to fix the table naming issue

CREATE OR REPLACE FUNCTION sanitize_table_name(agency_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(regexp_replace(
    trim(agency_name), '[^a-zA-Z0-9]', '_', 'g'), 
    '_+', '_', 'g'), 
    '^_|_$', '', 'g'));
END;
$$;

-- Test the function
SELECT sanitize_table_name('ABC Healthcare Services LLC');
-- Should now return: abc_healthcare_services_llc

-- If you want to recreate the tables with the correct names, you can:
-- 1. Drop the existing tables
DROP TABLE IF EXISTS patients_ealthcare_ervices CASCADE;
DROP TABLE IF EXISTS staff_ealthcare_ervices CASCADE;

-- 2. Create new tables with correct names
SELECT create_agency_patients_table('ABC Healthcare Services LLC');
SELECT create_agency_staff_table('ABC Healthcare Services LLC');

-- 3. Update the agency record with correct table names
UPDATE agency 
SET 
  patients_table_name = 'patients_abc_healthcare_services_llc',
  staff_table_name = 'staff_abc_healthcare_services_llc',
  updated_at = NOW()
WHERE agency_name = 'ABC Healthcare Services LLC';
