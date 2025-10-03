-- =====================================================
-- DISABLE RLS FOR TESTING
-- =====================================================
-- This will disable RLS on the subscription table so you can access it without authentication

-- Disable RLS on the subscription table
ALTER TABLE subscription_test_healthcare_agency DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'subscription_test_healthcare_agency';

-- Insert the subscription data
INSERT INTO subscription_test_healthcare_agency (
    agency_id, 
    agency_name, 
    subscription_type, 
    total_price, 
    status,
    start_period, 
    end_period
) VALUES 
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'HR Management', 2500.00, 'trial', NOW(), NOW() + INTERVAL '30 days'),
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'Quality Assurance', 2200.00, 'trial', NOW(), NOW() + INTERVAL '30 days'),
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'Billing Suite', 1500.00, 'trial', NOW(), NOW() + INTERVAL '30 days'),
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'Analytics Pro', 1800.00, 'trial', NOW(), NOW() + INTERVAL '30 days')
ON CONFLICT (agency_id, subscription_type) DO UPDATE SET
    status = EXCLUDED.status,
    start_period = EXCLUDED.start_period,
    end_period = EXCLUDED.end_period,
    updated_at = NOW();

-- Test the query
SELECT 
    *
FROM subscription_test_healthcare_agency
WHERE agency_id = '21878b32-7cad-4abe-ab34-47eb0680f801'
AND status IN ('active', 'trial')
ORDER BY subscription_type;
