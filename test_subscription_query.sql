-- =====================================================
-- TEST SUBSCRIPTION QUERY
-- =====================================================
-- Test the exact query that the JavaScript is using

-- 1. Check if there's any data in the table
SELECT COUNT(*) as total_subscriptions FROM subscription_test_healthcare_agency;

-- 2. Check all data in the table
SELECT 
    id,
    agency_id,
    agency_name,
    subscription_type,
    total_price,
    status,
    start_period,
    end_period
FROM subscription_test_healthcare_agency
ORDER BY subscription_type;

-- 3. Test the exact query from JavaScript
SELECT 
    *
FROM subscription_test_healthcare_agency
WHERE agency_id = '21878b32-7cad-4abe-ab34-47eb0680f801'
AND status IN ('active', 'trial')
ORDER BY subscription_type;

-- 4. Test with just the agency_id
SELECT 
    *
FROM subscription_test_healthcare_agency
WHERE agency_id = '21878b32-7cad-4abe-ab34-47eb0680f801'
ORDER BY subscription_type;

-- 5. Test with just the status
SELECT 
    *
FROM subscription_test_healthcare_agency
WHERE status IN ('active', 'trial')
ORDER BY subscription_type;

-- 6. Check the agency table to make sure the ID matches
SELECT 
    id,
    agency_name,
    email
FROM agency 
WHERE email = 'test@healthcare.com';
