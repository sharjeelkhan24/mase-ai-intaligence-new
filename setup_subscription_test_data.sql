-- Setup test subscription data for testing subscription-based navigation
-- Run this in your Supabase SQL Editor

-- First, let's check what agencies exist
-- SELECT id, agency_name, email FROM agency;

-- Example 1: Agency with HR Management and Analytics Pro only
-- Replace 'your-agency-email@domain.com' with your actual agency email
INSERT INTO agency_subscription (
  agency_id,
  agency_name,
  subscription_type,
  total_price,
  status,
  start_period,
  end_period,
  created_at,
  updated_at
)
SELECT 
  a.id,
  a.agency_name,
  'HR Management',
  2500.00,
  'active',
  '2024-01-01T00:00:00Z',
  '2024-12-31T23:59:59Z',
  NOW(),
  NOW()
FROM agency a 
WHERE a.email = 'your-agency-email@domain.com'; -- REPLACE WITH YOUR EMAIL

INSERT INTO agency_subscription (
  agency_id,
  agency_name,
  subscription_type,
  total_price,
  status,
  start_period,
  end_period,
  created_at,
  updated_at
)
SELECT 
  a.id,
  a.agency_name,
  'Analytics Pro',
  1800.00,
  'active',
  '2024-01-01T00:00:00Z',
  '2024-12-31T23:59:59Z',
  NOW(),
  NOW()
FROM agency a 
WHERE a.email = 'your-agency-email@domain.com'; -- REPLACE WITH YOUR EMAIL

-- Example 2: If you want to test with ALL subscriptions
-- Uncomment the following if you want to test with all features available:

/*
INSERT INTO agency_subscription (
  agency_id,
  agency_name,
  subscription_type,
  total_price,
  status,
  start_period,
  end_period,
  created_at,
  updated_at
)
SELECT 
  a.id,
  a.agency_name,
  sub_type.name,
  sub_type.price,
  'active',
  '2024-01-01T00:00:00Z',
  '2024-12-31T23:59:59Z',
  NOW(),
  NOW()
FROM agency a 
CROSS JOIN (
  VALUES 
    ('Quality Assurance', 2200.00),
    ('Billing Suite', 1500.00)
) AS sub_type(name, price)
WHERE a.email = 'your-agency-email@domain.com'; -- REPLACE WITH YOUR EMAIL
*/

-- Check the results
SELECT 
  a.agency_name,
  a.email,
  s.subscription_type,
  s.status,
  s.total_price
FROM agency a
JOIN agency_subscription s ON a.id = s.agency_id
WHERE a.email = 'your-agency-email@domain.com' -- REPLACE WITH YOUR EMAIL
ORDER BY s.subscription_type;

-- To remove all subscriptions and start fresh (if needed):
-- DELETE FROM agency_subscription WHERE agency_id IN (
--   SELECT id FROM agency WHERE email = 'your-agency-email@domain.com'
-- );
