-- =====================================================
-- CHECK SUBSCRIPTION DATA STRUCTURE
-- =====================================================
-- Let's verify the subscription data and agency_id relationships

-- 1. Check the agency data
SELECT 
  id as agency_id,
  agency_name,
  email
FROM agency 
WHERE email = 'test@healthcare.com';

-- 2. Check the subscription data
SELECT 
  id,
  agency_id,
  agency_name,
  subscription_type,
  status,
  total_price
FROM subscription_test_healthcare_agency
ORDER BY subscription_type;

-- 3. Check if agency_id matches between agency and subscription tables
SELECT 
  a.id as agency_id_from_agency_table,
  s.agency_id as agency_id_from_subscription_table,
  a.agency_name as agency_name_from_agency,
  s.agency_name as agency_name_from_subscription,
  s.subscription_type,
  s.status
FROM agency a
LEFT JOIN subscription_test_healthcare_agency s ON a.id = s.agency_id
WHERE a.email = 'test@healthcare.com'
ORDER BY s.subscription_type;

-- 4. Test the exact query that the JavaScript is using
SELECT 
  s.*
FROM subscription_test_healthcare_agency s
WHERE s.agency_id = (SELECT id FROM agency WHERE email = 'test@healthcare.com')
AND s.status IN ('active', 'trial')
ORDER BY s.subscription_type;
