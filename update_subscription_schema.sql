-- =====================================================
-- UPDATE SUBSCRIPTION SCHEMA FOR MULTIPLE SUBSCRIPTIONS
-- =====================================================
-- Version: 2.0.0
-- Date: 2024-01-XX
-- Description: Update agency_subscription table to handle multiple subscriptions per agency
-- =====================================================

-- TABLE 1.0: Agency Table (unchanged)
CREATE TABLE IF NOT EXISTS agency (
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
    staff_count INTEGER DEFAULT 0,
    patient_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE 2.0: Agency Subscription Table (updated for multiple subscriptions)
CREATE TABLE IF NOT EXISTS agency_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES agency(id) ON DELETE CASCADE,
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

-- INDEXES 3.0: Performance Indexes
CREATE INDEX IF NOT EXISTS idx_agency_email ON agency(email);
CREATE INDEX IF NOT EXISTS idx_agency_license_number ON agency(license_number);
CREATE INDEX IF NOT EXISTS idx_agency_subscription_agency_id ON agency_subscription(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_subscription_status ON agency_subscription(status);
CREATE INDEX IF NOT EXISTS idx_agency_subscription_end_period ON agency_subscription(end_period);
CREATE INDEX IF NOT EXISTS idx_agency_subscription_type ON agency_subscription(subscription_type);

-- COMMENTS 4.0: Documentation Comments
COMMENT ON TABLE agency IS 'Healthcare agencies and their basic information';
COMMENT ON TABLE agency_subscription IS 'Multiple subscriptions per agency - each row represents one subscription type';

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
COMMENT ON COLUMN agency.staff_count IS 'Total number of staff members';
COMMENT ON COLUMN agency.patient_count IS 'Total number of patients served';
COMMENT ON COLUMN agency.notes IS 'Additional notes or comments about the agency';

COMMENT ON COLUMN agency_subscription.id IS 'Unique identifier for the subscription';
COMMENT ON COLUMN agency_subscription.agency_id IS 'Foreign key reference to the agency';
COMMENT ON COLUMN agency_subscription.subscription_type IS 'Type of subscription (HR Management, Quality Assurance, etc.)';
COMMENT ON COLUMN agency_subscription.total_price IS 'Total price for this specific subscription';
COMMENT ON COLUMN agency_subscription.status IS 'Current status of the subscription';
COMMENT ON COLUMN agency_subscription.start_period IS 'When the subscription started';
COMMENT ON COLUMN agency_subscription.end_period IS 'When the subscription ends (NULL for ongoing)';

-- =====================================================
-- EXAMPLE USAGE:
-- =====================================================
-- An agency can now have multiple subscriptions:
-- 
-- INSERT INTO agency_subscription (agency_id, subscription_type, total_price, status) VALUES
-- ('agency-uuid-1', 'HR Management', 299.99, 'active'),
-- ('agency-uuid-1', 'Quality Assurance', 199.99, 'active'),
-- ('agency-uuid-1', 'Billing Suite', 399.99, 'trial');
-- 
-- This allows agencies to have multiple services simultaneously.
-- =====================================================
