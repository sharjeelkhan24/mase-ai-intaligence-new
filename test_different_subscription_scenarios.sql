-- Test different subscription scenarios
-- Run these one at a time to test different navigation configurations

-- SCENARIO 1: Only HR Management
-- Clear existing subscriptions first
DELETE FROM agency_subscription 
WHERE agency_id IN (SELECT id FROM agency WHERE email = 'your-agency-email@domain.com');

-- Add only HR Management
INSERT INTO agency_subscription (
  agency_id, agency_name, subscription_type, total_price, status, 
  start_period, end_period, created_at, updated_at
)
SELECT 
  a.id, a.agency_name, 'HR Management', 2500.00, 'active',
  '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', NOW(), NOW()
FROM agency a WHERE a.email = 'your-agency-email@domain.com';

-- Expected AdminNavbar: Overview, HR Management, Settings only
-- Expected Hidden: Quality Assurance, Billing Suite, Analytics Pro

-----------------------------------------------------------

-- SCENARIO 2: HR Management + Analytics Pro
-- Clear existing subscriptions first
DELETE FROM agency_subscription 
WHERE agency_id IN (SELECT id FROM agency WHERE email = 'your-agency-email@domain.com');

-- Add HR Management and Analytics Pro
INSERT INTO agency_subscription (
  agency_id, agency_name, subscription_type, total_price, status, 
  start_period, end_period, created_at, updated_at
)
SELECT 
  a.id, a.agency_name, subscription_type, price, 'active',
  '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', NOW(), NOW()
FROM agency a 
CROSS JOIN (
  VALUES 
    ('HR Management', 2500.00),
    ('Analytics Pro', 1800.00)
) AS subs(subscription_type, price)
WHERE a.email = 'your-agency-email@domain.com';

-- Expected AdminNavbar: Overview, HR Management, Analytics Pro, Settings
-- Expected Hidden: Quality Assurance, Billing Suite

-----------------------------------------------------------

-- SCENARIO 3: All subscriptions (full access)
-- Clear existing subscriptions first
DELETE FROM agency_subscription 
WHERE agency_id IN (SELECT id FROM agency WHERE email = 'your-agency-email@domain.com');

-- Add all subscriptions
INSERT INTO agency_subscription (
  agency_id, agency_name, subscription_type, total_price, status, 
  start_period, end_period, created_at, updated_at
)
SELECT 
  a.id, a.agency_name, subscription_type, price, 'active',
  '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', NOW(), NOW()
FROM agency a 
CROSS JOIN (
  VALUES 
    ('HR Management', 2500.00),
    ('Quality Assurance', 2200.00),
    ('Billing Suite', 1500.00),
    ('Analytics Pro', 1800.00)
) AS subs(subscription_type, price)
WHERE a.email = 'your-agency-email@domain.com';

-- Expected AdminNavbar: Overview, HR Management, Quality Assurance, Billing Suite, Analytics Pro, Settings
-- Expected Hidden: None

-----------------------------------------------------------

-- SCENARIO 4: No subscriptions (minimal access)
-- Clear existing subscriptions
DELETE FROM agency_subscription 
WHERE agency_id IN (SELECT id FROM agency WHERE email = 'your-agency-email@domain.com');

-- Expected AdminNavbar: Overview, Settings only
-- Expected Hidden: All feature-specific pages

-----------------------------------------------------------

-- Check current subscriptions
SELECT 
  a.agency_name,
  a.email,
  COALESCE(s.subscription_type, 'No subscriptions') as subscription_type,
  COALESCE(s.status, 'N/A') as status
FROM agency a
LEFT JOIN agency_subscription s ON a.id = s.agency_id
WHERE a.email = 'your-agency-email@domain.com'
ORDER BY s.subscription_type;
