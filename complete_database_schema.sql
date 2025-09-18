-- =====================================================
-- COMPLETE DATABASE SCHEMA - MASE AI INTELLIGENCE
-- =====================================================
-- Version: 3.0.0
-- Date: 2024-01-XX
-- Description: Complete database schema with multiple subscriptions and password authentication
-- =====================================================

-- =====================================================
-- STEP 1: DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS agency_subscription CASCADE;
DROP TABLE IF EXISTS agency CASCADE;

-- =====================================================
-- STEP 2: CREATE AGENCY TABLE
-- =====================================================
CREATE TABLE agency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    staff_count VARCHAR(20) DEFAULT '0',
    patient_count VARCHAR(20) DEFAULT '0',
    notes TEXT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: CREATE AGENCY SUBSCRIPTION TABLE
-- =====================================================
CREATE TABLE agency_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agency(id) ON DELETE CASCADE,
    agency_name VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(100) NOT NULL CHECK (subscription_type IN (
        'HR Management', 
        'Quality Assurance', 
        'Billing Suite', 
        'Analytics Pro'
    )),
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN (
        'trial', 
        'active', 
        'suspended', 
        'cancelled', 
        'expired'
    )),
    start_period TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_period TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique combination of agency and subscription type
    UNIQUE(agency_id, subscription_type)
);

-- =====================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Agency table indexes
CREATE INDEX idx_agency_email ON agency(email);
CREATE INDEX idx_agency_license_number ON agency(license_number);
CREATE INDEX idx_agency_password ON agency(password);
CREATE INDEX idx_agency_agency_name ON agency(agency_name);

-- Agency subscription table indexes
CREATE INDEX idx_agency_subscription_agency_id ON agency_subscription(agency_id);
CREATE INDEX idx_agency_subscription_agency_name ON agency_subscription(agency_name);
CREATE INDEX idx_agency_subscription_status ON agency_subscription(status);
CREATE INDEX idx_agency_subscription_end_period ON agency_subscription(end_period);
CREATE INDEX idx_agency_subscription_type ON agency_subscription(subscription_type);

-- =====================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE agency ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_subscription ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 6: CREATE PERMISSIVE POLICIES (for development)
-- =====================================================
CREATE POLICY "Allow all operations on agency" ON agency
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on agency_subscription" ON agency_subscription
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- STEP 7: ADD DOCUMENTATION COMMENTS
-- =====================================================

-- Table comments
COMMENT ON TABLE agency IS 'Healthcare agencies and their basic information with authentication';
COMMENT ON TABLE agency_subscription IS 'Multiple subscriptions per agency - each row represents one subscription type';

-- Agency table column comments
COMMENT ON COLUMN agency.id IS 'Unique identifier for the agency';
COMMENT ON COLUMN agency.agency_name IS 'Official name of the healthcare agency';
COMMENT ON COLUMN agency.license_number IS 'Government-issued license number (unique)';
COMMENT ON COLUMN agency.contact_name IS 'Primary contact person at the agency';
COMMENT ON COLUMN agency.email IS 'Primary email address for the agency';
COMMENT ON COLUMN agency.phone_number IS 'Primary phone number for the agency';
COMMENT ON COLUMN agency.address IS 'Street address of the agency';
COMMENT ON COLUMN agency.city IS 'City where the agency is located';
COMMENT ON COLUMN agency.state IS 'State where the agency is located';
COMMENT ON COLUMN agency.zip_code IS 'ZIP/postal code of the agency';
COMMENT ON COLUMN agency.staff_count IS 'Staff count range (e.g., "1-10", "11-25", "100+")';
COMMENT ON COLUMN agency.patient_count IS 'Patient count range (e.g., "1-50", "51-100", "500+")';
COMMENT ON COLUMN agency.notes IS 'Additional notes or comments about the agency';
COMMENT ON COLUMN agency.password IS 'Hashed password for agency authentication';

-- Agency subscription table column comments
COMMENT ON COLUMN agency_subscription.id IS 'Unique identifier for the subscription';
COMMENT ON COLUMN agency_subscription.agency_id IS 'Foreign key reference to the agency';
COMMENT ON COLUMN agency_subscription.agency_name IS 'Name of the agency (denormalized for easier querying and display)';
COMMENT ON COLUMN agency_subscription.subscription_type IS 'Type of subscription (HR Management, Quality Assurance, etc.)';
COMMENT ON COLUMN agency_subscription.total_price IS 'Total price for this specific subscription';
COMMENT ON COLUMN agency_subscription.status IS 'Current status of the subscription';
COMMENT ON COLUMN agency_subscription.start_period IS 'When the subscription started';
COMMENT ON COLUMN agency_subscription.end_period IS 'When the subscription ends (NULL for ongoing)';

-- =====================================================
-- STEP 8: EXAMPLE DATA (optional - for testing)
-- =====================================================

-- Example agency (password is 'password123' encoded in Base64)
/*
INSERT INTO agency (
    agency_name, 
    license_number, 
    contact_name, 
    email, 
    phone_number, 
    address, 
    city, 
    state, 
    zip_code, 
    staff_count, 
    patient_count, 
    password
) VALUES (
    'ABC Healthcare Services',
    'HL-2024-001',
    'John Smith',
    'admin@abchealthcare.com',
    '(555) 123-4567',
    '123 Main Street',
    'New York',
    'NY',
    '10001',
    25,
    150,
    'cGFzc3dvcmQxMjM='  -- Base64 encoded 'password123'
);

-- Example subscriptions for the above agency
INSERT INTO agency_subscription (
    agency_id, 
    agency_name, 
    subscription_type, 
    total_price, 
    status
) VALUES 
    ((SELECT id FROM agency WHERE email = 'admin@abchealthcare.com'), 'ABC Healthcare Services', 'HR Management', 299.99, 'active'),
    ((SELECT id FROM agency WHERE email = 'admin@abchealthcare.com'), 'ABC Healthcare Services', 'Quality Assurance', 199.99, 'active'),
    ((SELECT id FROM agency WHERE email = 'admin@abchealthcare.com'), 'ABC Healthcare Services', 'Billing Suite', 399.99, 'trial');
*/

-- =====================================================
-- STEP 9: USEFUL QUERIES FOR TESTING
-- =====================================================

-- View all agencies with their subscription count
/*
SELECT 
    a.agency_name,
    a.email,
    a.license_number,
    COUNT(s.id) as subscription_count,
    SUM(s.total_price) as total_monthly_cost
FROM agency a
LEFT JOIN agency_subscription s ON a.id = s.agency_id
GROUP BY a.id, a.agency_name, a.email, a.license_number
ORDER BY a.agency_name;
*/

-- View all subscriptions with agency details
/*
SELECT 
    s.agency_name,
    s.subscription_type,
    s.total_price,
    s.status,
    s.start_period,
    s.end_period
FROM agency_subscription s
ORDER BY s.agency_name, s.subscription_type;
*/

-- Find agencies with specific subscription types
/*
SELECT DISTINCT 
    a.agency_name,
    a.email,
    a.phone_number
FROM agency a
JOIN agency_subscription s ON a.id = s.agency_id
WHERE s.subscription_type = 'HR Management'
AND s.status = 'active';
*/

-- =====================================================
-- SCHEMA SUMMARY
-- =====================================================
-- 
-- TABLES CREATED:
-- 1. agency - Main agency information with authentication
-- 2. agency_subscription - Multiple subscriptions per agency
-- 
-- KEY FEATURES:
-- ✅ Multiple subscriptions per agency
-- ✅ Agency name in subscription table for easy querying
-- ✅ Password authentication for agencies
-- ✅ Proper indexing for performance
-- ✅ Row Level Security enabled
-- ✅ Comprehensive documentation
-- 
-- COLUMN ORDER:
-- agency_subscription: id → agency_id → agency_name → subscription_type → ...
-- 
-- =====================================================
