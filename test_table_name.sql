-- =====================================================
-- TEST TABLE NAME GENERATION
-- =====================================================
-- Let's verify the exact table name that should be used

-- 1. Check the agency name and generate the table name
SELECT 
  agency_name,
  lower(replace(agency_name, ' ', '_')) as cleaned_name,
  'subscription_' || lower(replace(agency_name, ' ', '_')) as expected_table_name
FROM agency 
WHERE email = 'test@healthcare.com';

-- 2. Check if the table exists with that exact name
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'subscription_test_healthcare_agency';

-- 3. Test the exact query that should work
SELECT 
  s.*
FROM subscription_test_healthcare_agency s
WHERE s.agency_id = '21878b32-7cad-4abe-ab34-47eb0680f801'
AND s.status IN ('active', 'trial')
ORDER BY s.subscription_type;

-- 4. Also test with the agency name
SELECT 
  s.*
FROM subscription_test_healthcare_agency s
WHERE s.agency_name = 'Test Healthcare Agency'
AND s.status IN ('active', 'trial')
ORDER BY s.subscription_type;
