-- =====================================================
-- FIX AGENCY TABLES
-- =====================================================
-- This script will fix the missing table names and create the subscription table

-- 1. First, let's check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%test_healthcare_agency%'
ORDER BY table_name;

-- 2. Update the agency record with the correct table names
UPDATE agency 
SET 
    patients_table_name = 'patients_test_healthcare_agency',
    staff_table_name = 'staff_test_healthcare_agency',
    inbox_table_name = 'inbox_test_healthcare_agency',
    sent_table_name = 'sent_test_healthcare_agency',
    drafts_table_name = 'drafts_test_healthcare_agency'
WHERE email = 'test@healthcare.com';

-- 3. Create the subscription table manually (since the trigger might not have run)
CREATE TABLE IF NOT EXISTS subscription_test_healthcare_agency (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id uuid REFERENCES agency(id) ON DELETE CASCADE,
    agency_name varchar(255) NOT NULL,
    subscription_type varchar(50) NOT NULL CHECK (
        subscription_type IN (
            'HR Management', 
            'Quality Assurance', 
            'Billing Suite', 
            'Analytics Pro'
        )
    ),
    total_price numeric(10,2) NOT NULL,
    status varchar(20) DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'expired', 'cancelled')),
    start_period timestamp with time zone NOT NULL,
    end_period timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT unique_agency_subscription UNIQUE(agency_id, subscription_type)
);

-- 4. Insert the subscriptions
INSERT INTO subscription_test_healthcare_agency (
    agency_id, agency_name, subscription_type, total_price, status,
    start_period, end_period
) 
SELECT 
    a.id, 
    a.agency_name, 
    subscription_type, 
    price, 
    'trial',
    NOW(),
    NOW() + INTERVAL '30 days'
FROM agency a
CROSS JOIN (
    VALUES 
        ('HR Management', 2500.00),
        ('Quality Assurance', 2200.00),
        ('Billing Suite', 1500.00),
        ('Analytics Pro', 1800.00)
) AS subs(subscription_type, price)
WHERE a.email = 'test@healthcare.com'
ON CONFLICT (agency_id, subscription_type) DO UPDATE SET
    status = EXCLUDED.status,
    start_period = EXCLUDED.start_period,
    end_period = EXCLUDED.end_period,
    updated_at = NOW();

-- 5. Verify the fix
SELECT 
    agency_name,
    patients_table_name,
    staff_table_name,
    inbox_table_name,
    sent_table_name,
    drafts_table_name
FROM agency 
WHERE email = 'test@healthcare.com';

-- 6. Verify the subscriptions
SELECT 
    agency_name,
    subscription_type,
    status,
    total_price
FROM subscription_test_healthcare_agency
ORDER BY subscription_type;
