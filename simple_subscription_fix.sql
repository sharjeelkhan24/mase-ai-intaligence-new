-- =====================================================
-- SIMPLE SUBSCRIPTION FIX
-- =====================================================
-- This will create and populate the subscription table correctly

-- 1. Drop and recreate the subscription table to ensure it's correct
DROP TABLE IF EXISTS subscription_test_healthcare_agency CASCADE;

-- 2. Create the subscription table with the exact structure needed
CREATE TABLE subscription_test_healthcare_agency (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id uuid NOT NULL,
    agency_name varchar(255) NOT NULL,
    subscription_type varchar(50) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    status varchar(20) DEFAULT 'trial',
    start_period timestamp with time zone NOT NULL,
    end_period timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Insert the subscriptions with the correct agency_id
INSERT INTO subscription_test_healthcare_agency (
    agency_id, agency_name, subscription_type, total_price, status,
    start_period, end_period
) VALUES 
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'HR Management', 2500.00, 'trial', NOW(), NOW() + INTERVAL '30 days'),
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'Quality Assurance', 2200.00, 'trial', NOW(), NOW() + INTERVAL '30 days'),
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'Billing Suite', 1500.00, 'trial', NOW(), NOW() + INTERVAL '30 days'),
    ('21878b32-7cad-4abe-ab34-47eb0680f801', 'Test Healthcare Agency', 'Analytics Pro', 1800.00, 'trial', NOW(), NOW() + INTERVAL '30 days');

-- 4. Verify the data
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


