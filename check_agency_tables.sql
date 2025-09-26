-- Check if your agency has the proper table names set
-- Run this query in your Supabase SQL editor to debug the issue

-- 1. Check all agencies and their table names
SELECT 
    id,
    agency_name,
    patients_table_name,
    staff_table_name,
    created_at,
    updated_at
FROM agency 
ORDER BY created_at DESC;

-- 2. Check if your specific agency exists
-- Replace 'ABC Healthcare Services LLC' with your actual agency name
SELECT 
    id,
    agency_name,
    patients_table_name,
    staff_table_name,
    created_at,
    updated_at
FROM agency 
WHERE agency_name = 'ABC Healthcare Services LLC';

-- 3. Check if the staff table actually exists
-- Replace 'staff_abc_healthcare_services_llc' with your actual staff table name
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'staff_%';

-- 4. If the staff_table_name is null, you can update it manually:
-- UPDATE agency 
-- SET staff_table_name = 'staff_abc_healthcare_services_llc',
--     patients_table_name = 'patients_abc_healthcare_services_llc',
--     updated_at = NOW()
-- WHERE agency_name = 'ABC Healthcare Services LLC';
