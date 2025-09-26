-- Fix the trigger function name mismatch
-- Your trigger is calling the wrong function name

-- Step 1: Drop the existing trigger
DROP TRIGGER IF EXISTS trigger_create_agency_tables ON agency;

-- Step 2: Create the correct trigger with the right function name
CREATE TRIGGER trigger_create_agency_tables
  BEFORE INSERT ON agency
  FOR EACH ROW
  EXECUTE FUNCTION create_agency_tables_on_insert();

-- Step 3: Check if the function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'create_agency_tables_on_insert';

-- Step 4: If the function doesn't exist, you need to run the replace_tables_simple.sql file
-- The function should be created by that script

-- Step 5: Test by checking existing agencies
SELECT 
    id,
    agency_name,
    patients_table_name,
    staff_table_name,
    created_at
FROM agency 
ORDER BY created_at DESC;

-- Step 6: If your existing agency doesn't have table names, update them manually:
-- Replace 'ABC Healthcare Services LLC' with your actual agency name
-- Replace the table names with your actual sanitized table names

-- UPDATE agency 
-- SET patients_table_name = 'patients_abc_healthcare_services_llc',
--     staff_table_name = 'staff_abc_healthcare_services_llc',
--     updated_at = NOW()
-- WHERE agency_name = 'ABC Healthcare Services LLC';

-- Step 7: Check if the tables actually exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE 'staff_%' OR table_name LIKE 'patients_%')
ORDER BY table_name;
