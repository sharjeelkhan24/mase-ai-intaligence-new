-- =====================================================
-- MASE AI Intelligence Project - Database Schema
-- Version: 1.0.0
-- Created: 2025-01-18
-- Description: Agency and Agency Subscription Tables
-- =====================================================

-- =====================================================
-- TABLE 1.0: Agency Table
-- =====================================================
CREATE TABLE agency (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    staff_count INTEGER DEFAULT 0,
    patient_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE 2.0: Agency Subscription Table
-- =====================================================
CREATE TABLE agency_subscription (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agency_id UUID REFERENCES agency(id) ON DELETE CASCADE,
    subscription VARCHAR(50) NOT NULL CHECK (subscription IN ('HR Management', 'Quality Assurance', 'Billing Suite', 'Analytics Pro')),
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'cancelled', 'expired')),
    start_period TIMESTAMP WITH TIME ZONE NOT NULL,
    end_period TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES 3.0: Performance Indexes
-- =====================================================
CREATE INDEX idx_agency_email ON agency(email);
CREATE INDEX idx_agency_license_number ON agency(license_number);
CREATE INDEX idx_agency_subscription_agency_id ON agency_subscription(agency_id);
CREATE INDEX idx_agency_subscription_status ON agency_subscription(status);
CREATE INDEX idx_agency_subscription_end_period ON agency_subscription(end_period);

-- =====================================================
-- COMMENTS 4.0: Documentation Comments
-- =====================================================
COMMENT ON TABLE agency IS 'Stores agency information and details';
COMMENT ON TABLE agency_subscription IS 'Stores subscription information for each agency';

COMMENT ON COLUMN agency.license_number IS 'Unique license number for the agency';
COMMENT ON COLUMN agency.email IS 'Primary contact email for the agency';
COMMENT ON COLUMN agency_subscription.subscription IS 'Type of subscription: HR Management, Quality Assurance, Billing Suite, or Analytics Pro';
COMMENT ON COLUMN agency_subscription.status IS 'Current status of the subscription: trial, active, suspended, cancelled, or expired';

-- =====================================================
-- END OF VERSION 1.0.0
-- Next version should increment to 1.1.0 for minor changes
-- or 2.0.0 for major changes
-- =====================================================
