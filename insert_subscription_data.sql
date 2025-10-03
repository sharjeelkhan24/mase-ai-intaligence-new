-- =====================================================
-- INSERT SUBSCRIPTION DATA
-- =====================================================
-- Insert the subscription data with the exact agency_id

-- Insert the 4 subscriptions
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

-- Verify the data was inserted
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

-- Test the exact query that the JavaScript uses
SELECT 
    *
FROM subscription_test_healthcare_agency
WHERE agency_id = '21878b32-7cad-4abe-ab34-47eb0680f801'
AND status IN ('active', 'trial')
ORDER BY subscription_type;
