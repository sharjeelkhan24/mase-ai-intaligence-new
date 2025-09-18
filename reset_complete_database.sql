-- COMPLETE DATABASE RESET AND SETUP
-- Run this in your Supabase SQL Editor to start fresh
-- WARNING: This will delete ALL existing data

-- ==================================================
-- STEP 1: DROP ALL EXISTING TABLES (CLEAN SLATE)
-- ==================================================

-- Drop tables in correct order (subscriptions first due to foreign key)
DROP TABLE IF EXISTS agency_subscription CASCADE;
DROP TABLE IF EXISTS agency CASCADE;

-- ==================================================
-- STEP 2: CREATE AGENCY TABLE
-- ==================================================

CREATE TABLE agency (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  staff_count VARCHAR(50) DEFAULT '1-10',
  patient_count VARCHAR(50) DEFAULT '1-50',
  notes TEXT,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================
-- STEP 3: CREATE AGENCY SUBSCRIPTION TABLE
-- ==================================================

CREATE TABLE agency_subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agency(id) ON DELETE CASCADE,
  agency_name VARCHAR(255) NOT NULL,
  subscription_type VARCHAR(100) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  start_period TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_period TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_agency_subscription UNIQUE(agency_id, subscription_type),
  CONSTRAINT valid_subscription_type CHECK (
    subscription_type IN (
      'HR Management', 
      'Quality Assurance', 
      'Billing Suite', 
      'Analytics Pro'
    )
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('active', 'inactive', 'trial', 'expired', 'cancelled')
  )
);

-- ==================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- ==================================================

-- Agency table indexes
CREATE INDEX idx_agency_email ON agency(email);
CREATE INDEX idx_agency_license_number ON agency(license_number);
CREATE INDEX idx_agency_created_at ON agency(created_at);

-- Agency subscription table indexes
CREATE INDEX idx_agency_subscription_agency_id ON agency_subscription(agency_id);
CREATE INDEX idx_agency_subscription_agency_name ON agency_subscription(agency_name);
CREATE INDEX idx_agency_subscription_status ON agency_subscription(status);
CREATE INDEX idx_agency_subscription_subscription_type ON agency_subscription(subscription_type);
CREATE INDEX idx_agency_subscription_end_period ON agency_subscription(end_period);

-- ==================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY (RLS)
-- ==================================================

-- Enable RLS on both tables
ALTER TABLE agency ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_subscription ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all operations for now)
-- You can make these more restrictive later based on your auth requirements

-- Agency table policies
CREATE POLICY "Allow all access to agency" ON agency
  FOR ALL USING (true) WITH CHECK (true);

-- Agency subscription table policies
CREATE POLICY "Allow all access to agency_subscription" ON agency_subscription
  FOR ALL USING (true) WITH CHECK (true);

-- ==================================================
-- STEP 6: ADD TABLE COMMENTS FOR DOCUMENTATION
-- ==================================================

-- Agency table comments
COMMENT ON TABLE agency IS 'Healthcare agencies using the MASE AI platform';
COMMENT ON COLUMN agency.id IS 'Unique identifier for the agency';
COMMENT ON COLUMN agency.agency_name IS 'Official name of the healthcare agency';
COMMENT ON COLUMN agency.license_number IS 'Government issued license number (unique)';
COMMENT ON COLUMN agency.contact_name IS 'Primary contact person name';
COMMENT ON COLUMN agency.email IS 'Primary email address for the agency (unique)';
COMMENT ON COLUMN agency.phone_number IS 'Primary phone number';
COMMENT ON COLUMN agency.address IS 'Street address of the agency';
COMMENT ON COLUMN agency.city IS 'City where agency is located';
COMMENT ON COLUMN agency.state IS 'State/province where agency is located';
COMMENT ON COLUMN agency.zip_code IS 'Postal/ZIP code';
COMMENT ON COLUMN agency.staff_count IS 'Number of staff members (range: 1-10, 11-50, 51-100, 100+)';
COMMENT ON COLUMN agency.patient_count IS 'Number of patients served (range: 1-50, 51-200, 201-500, 500+)';
COMMENT ON COLUMN agency.notes IS 'Additional notes about the agency';
COMMENT ON COLUMN agency.password IS 'Hashed password for agency authentication';

-- Agency subscription table comments
COMMENT ON TABLE agency_subscription IS 'Subscription services for each agency';
COMMENT ON COLUMN agency_subscription.id IS 'Unique identifier for the subscription';
COMMENT ON COLUMN agency_subscription.agency_id IS 'Reference to the agency table';
COMMENT ON COLUMN agency_subscription.agency_name IS 'Agency name (denormalized for easier querying)';
COMMENT ON COLUMN agency_subscription.subscription_type IS 'Type of subscription service';
COMMENT ON COLUMN agency_subscription.total_price IS 'Total price for this subscription';
COMMENT ON COLUMN agency_subscription.status IS 'Current status of the subscription';
COMMENT ON COLUMN agency_subscription.start_period IS 'When the subscription period started';
COMMENT ON COLUMN agency_subscription.end_period IS 'When the subscription period ends';

-- ==================================================
-- STEP 7: INSERT SAMPLE TEST DATA (OPTIONAL)
-- ==================================================

-- Sample Agency 1: HR Management + Analytics Pro
INSERT INTO agency (
  agency_name, license_number, contact_name, email, phone_number,
  address, city, state, zip_code, staff_count, patient_count,
  password, notes
) VALUES (
  'Metro Healthcare Solutions',
  'MHS-2024-001',
  'John Smith',
  'john.smith@metrohealthcare.com',
  '(555) 123-4567',
  '123 Medical Center Blvd',
  'Healthcare City',
  'CA',
  '90210',
  '11-50',
  '51-200',
  'cGFzc3dvcmQxMjM=', -- Base64 encoded 'password123'
  'Specializes in emergency and ICU staffing'
);

-- Sample Agency 2: All Subscriptions
INSERT INTO agency (
  agency_name, license_number, contact_name, email, phone_number,
  address, city, state, zip_code, staff_count, patient_count,
  password, notes
) VALUES (
  'Elite Nursing Agency',
  'ENA-2024-002',
  'Sarah Johnson',
  'sarah.johnson@elitenursing.com',
  '(555) 987-6543',
  '456 Nursing Way',
  'Medtown',
  'NY',
  '10001',
  '51-100',
  '201-500',
  'bXlwYXNzd29yZA==', -- Base64 encoded 'mypassword'
  'Full-service healthcare staffing agency'
);

-- Sample Agency 3: Only Quality Assurance
INSERT INTO agency (
  agency_name, license_number, contact_name, email, phone_number,
  address, city, state, zip_code, staff_count, patient_count,
  password, notes
) VALUES (
  'Quality First Healthcare',
  'QFH-2024-003',
  'Michael Davis',
  'michael.davis@qualityfirst.com',
  '(555) 456-7890',
  '789 Quality Street',
  'Excellence City',
  'TX',
  '73301',
  '1-10',
  '1-50',
  'cXVhbGl0eXBhc3M=', -- Base64 encoded 'qualitypass'
  'Focus on quality assurance and compliance'
);

-- Add subscriptions for Agency 1 (HR Management + Analytics Pro)
INSERT INTO agency_subscription (agency_id, agency_name, subscription_type, total_price, status)
SELECT 
  id, agency_name, subscription_type, price, 'active'
FROM agency,
LATERAL (VALUES 
  ('HR Management', 2500.00),
  ('Analytics Pro', 1800.00)
) AS subs(subscription_type, price)
WHERE email = 'john.smith@metrohealthcare.com';

-- Add subscriptions for Agency 2 (All Subscriptions)
INSERT INTO agency_subscription (agency_id, agency_name, subscription_type, total_price, status)
SELECT 
  id, agency_name, subscription_type, price, 'active'
FROM agency,
LATERAL (VALUES 
  ('HR Management', 2500.00),
  ('Quality Assurance', 2200.00),
  ('Billing Suite', 1500.00),
  ('Analytics Pro', 1800.00)
) AS subs(subscription_type, price)
WHERE email = 'sarah.johnson@elitenursing.com';

-- Add subscriptions for Agency 3 (Only Quality Assurance)
INSERT INTO agency_subscription (agency_id, agency_name, subscription_type, total_price, status)
SELECT 
  id, agency_name, subscription_type, price, 'active'
FROM agency,
LATERAL (VALUES 
  ('Quality Assurance', 2200.00)
) AS subs(subscription_type, price)
WHERE email = 'michael.davis@qualityfirst.com';

-- ==================================================
-- STEP 8: VERIFICATION QUERIES
-- ==================================================

-- Check agencies
SELECT 
  agency_name,
  contact_name,
  email,
  staff_count,
  patient_count
FROM agency 
ORDER BY created_at;

-- Check subscriptions
SELECT 
  a.agency_name,
  a.email,
  s.subscription_type,
  s.status,
  s.total_price
FROM agency a
JOIN agency_subscription s ON a.id = s.agency_id
ORDER BY a.agency_name, s.subscription_type;

-- Count subscriptions per agency
SELECT 
  a.agency_name,
  COUNT(s.subscription_type) as subscription_count,
  STRING_AGG(s.subscription_type, ', ' ORDER BY s.subscription_type) as subscriptions
FROM agency a
LEFT JOIN agency_subscription s ON a.id = s.agency_id AND s.status = 'active'
GROUP BY a.id, a.agency_name
ORDER BY a.agency_name;

-- ==================================================
-- COMPLETION MESSAGE
-- ==================================================

SELECT 'Database reset complete! You can now test with the sample accounts or create new ones.' AS message;
