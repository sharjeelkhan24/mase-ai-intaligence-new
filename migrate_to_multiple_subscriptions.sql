-- =====================================================
-- MIGRATION SCRIPT: Single to Multiple Subscriptions
-- =====================================================
-- Version: 2.0.0
-- Date: 2024-01-XX
-- Description: Migrate existing agency_subscription table to support multiple subscriptions
-- =====================================================

-- STEP 1: Backup existing data (optional but recommended)
-- CREATE TABLE agency_subscription_backup AS SELECT * FROM agency_subscription;

-- STEP 2: Drop existing table (if it exists)
DROP TABLE IF EXISTS agency_subscription CASCADE;

-- STEP 3: Create new table with multiple subscription support
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

-- STEP 4: Create indexes for performance
CREATE INDEX idx_agency_subscription_agency_id ON agency_subscription(agency_id);
CREATE INDEX idx_agency_subscription_agency_name ON agency_subscription(agency_name);
CREATE INDEX idx_agency_subscription_status ON agency_subscription(status);
CREATE INDEX idx_agency_subscription_end_period ON agency_subscription(end_period);
CREATE INDEX idx_agency_subscription_type ON agency_subscription(subscription_type);

-- STEP 5: Enable Row Level Security (if needed)
ALTER TABLE agency_subscription ENABLE ROW LEVEL SECURITY;

-- STEP 6: Create permissive policies (for development)
CREATE POLICY "Allow all operations on agency_subscription" ON agency_subscription
    FOR ALL USING (true) WITH CHECK (true);

-- STEP 7: Add comments for documentation
COMMENT ON TABLE agency_subscription IS 'Multiple subscriptions per agency - each row represents one subscription type';
COMMENT ON COLUMN agency_subscription.agency_name IS 'Name of the agency (denormalized for easier querying and display)';
COMMENT ON COLUMN agency_subscription.subscription_type IS 'Type of subscription (HR Management, Quality Assurance, etc.)';
COMMENT ON COLUMN agency_subscription.agency_id IS 'Foreign key reference to the agency';
COMMENT ON COLUMN agency_subscription.total_price IS 'Total price for this specific subscription';
COMMENT ON COLUMN agency_subscription.status IS 'Current status of the subscription';

-- =====================================================
-- EXAMPLE: How to insert multiple subscriptions for one agency
-- =====================================================
-- 
-- INSERT INTO agency_subscription (agency_id, agency_name, subscription_type, total_price, status) VALUES
-- ('your-agency-uuid-here', 'ABC Healthcare', 'HR Management', 299.99, 'active'),
-- ('your-agency-uuid-here', 'ABC Healthcare', 'Quality Assurance', 199.99, 'active'),
-- ('your-agency-uuid-here', 'ABC Healthcare', 'Billing Suite', 399.99, 'trial');
-- 
-- This will create 3 separate subscription records for the same agency.
-- =====================================================
