-- Quick fix for your specific agency
-- Run these queries in order:

-- 1. First, check what agencies you have and their table names
SELECT 
    id,
    agency_name,
    patients_table_name,
    staff_table_name,
    created_at
FROM agency 
ORDER BY created_at DESC;

-- 2. Check if the trigger function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'create_agency_tables_on_insert';

-- 3. If the function doesn't exist, you need to run the replace_tables_simple.sql file first
-- Then run this fix:

-- 4. Drop and recreate the trigger with correct function name
DROP TRIGGER IF EXISTS trigger_create_agency_tables ON agency;

CREATE TRIGGER trigger_create_agency_tables
  BEFORE INSERT ON agency
  FOR EACH ROW
  EXECUTE FUNCTION create_agency_tables_on_insert();

-- 5. For your existing agency (replace with your actual agency name):
-- If your agency is "ABC Healthcare Services LLC", update it like this:

UPDATE agency 
SET patients_table_name = 'patients_abc_healthcare_services_llc',
    staff_table_name = 'staff_abc_healthcare_services_llc',
    updated_at = NOW()
WHERE agency_name = 'ABC Healthcare Services LLC';

-- 6. Verify the update worked
SELECT 
    agency_name,
    patients_table_name,
    staff_table_name
FROM agency 
WHERE agency_name = 'ABC Healthcare Services LLC';

-- 7. Check if the tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('staff_abc_healthcare_services_llc', 'patients_abc_healthcare_services_llc');
