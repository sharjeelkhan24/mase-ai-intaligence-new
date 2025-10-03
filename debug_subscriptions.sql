-- =====================================================
-- DEBUG SUBSCRIPTIONS
-- =====================================================
-- Use this script to debug subscription loading issues

-- 1. Check if the agency exists
SELECT 
  id,
  agency_name,
  email,
  created_at
FROM agency 
WHERE email = 'test@healthcare.com';

-- 2. Check if the subscription table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'subscription_test_healthcare_agency';

-- 3. Check the subscription data
SELECT 
  id,
  agency_id,
  agency_name,
  subscription_type,
  total_price,
  status,
  start_period,
  end_period,
  created_at
FROM subscription_test_healthcare_agency
ORDER BY subscription_type;

-- 4. Check the exact table name generation logic
SELECT 
  agency_name,
  lower(replace(agency_name, ' ', '_')) as cleaned_name,
  'subscription_' || lower(replace(agency_name, ' ', '_')) as table_name
FROM agency 
WHERE email = 'test@healthcare.com';

-- 5. Test the exact query that the context uses
SELECT 
  s.*
FROM subscription_test_healthcare_agency s
JOIN agency a ON s.agency_id = a.id
WHERE a.email = 'test@healthcare.com'
AND s.status IN ('active', 'trial')
ORDER BY s.subscription_type;


