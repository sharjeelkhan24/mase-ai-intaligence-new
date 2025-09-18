-- =====================================================
-- ADD AGENCY NAME TO SUBSCRIPTION TABLE
-- =====================================================
-- Version: 2.1.0
-- Date: 2024-01-XX
-- Description: Add agency_name column to agency_subscription table for better readability
-- =====================================================

-- STEP 1: Add agency_name column to existing table
ALTER TABLE agency_subscription 
ADD COLUMN agency_name VARCHAR(255);

-- STEP 2: Update existing records with agency names
UPDATE agency_subscription 
SET agency_name = agency.agency_name
FROM agency 
WHERE agency_subscription.agency_id = agency.id;

-- STEP 3: Make agency_name NOT NULL after populating existing data
ALTER TABLE agency_subscription 
ALTER COLUMN agency_name SET NOT NULL;

-- STEP 4: Add index for better performance when querying by agency name
CREATE INDEX IF NOT EXISTS idx_agency_subscription_agency_name ON agency_subscription(agency_name);

-- STEP 5: Add comment for documentation
COMMENT ON COLUMN agency_subscription.agency_name IS 'Name of the agency (denormalized for easier querying and display)';

-- =====================================================
-- ALTERNATIVE: If you want to recreate the table completely
-- =====================================================
-- Uncomment the following if you prefer to recreate the table:

/*
-- Drop existing table
DROP TABLE IF EXISTS agency_subscription CASCADE;

-- Create new table with agency_name included
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

-- Create indexes
CREATE INDEX idx_agency_subscription_agency_id ON agency_subscription(agency_id);
CREATE INDEX idx_agency_subscription_agency_name ON agency_subscription(agency_name);
CREATE INDEX idx_agency_subscription_status ON agency_subscription(status);
CREATE INDEX idx_agency_subscription_end_period ON agency_subscription(end_period);
CREATE INDEX idx_agency_subscription_type ON agency_subscription(subscription_type);

-- Enable RLS
ALTER TABLE agency_subscription ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow all operations on agency_subscription" ON agency_subscription
    FOR ALL USING (true) WITH CHECK (true);

-- Add comments
COMMENT ON TABLE agency_subscription IS 'Multiple subscriptions per agency - each row represents one subscription type';
COMMENT ON COLUMN agency_subscription.agency_name IS 'Name of the agency (denormalized for easier querying and display)';
COMMENT ON COLUMN agency_subscription.subscription_type IS 'Type of subscription (HR Management, Quality Assurance, etc.)';
*/

-- =====================================================
-- EXAMPLE: How the data will look after migration
-- =====================================================
-- 
-- SELECT * FROM agency_subscription;
-- 
-- Result:
-- id | agency_id | agency_name | subscription_type | total_price | status
-- ---|-----------|-------------|-------------------|-------------|-------
-- 1  | 123      | ABC Healthcare | HR Management   | 299.99     | active
-- 2  | 123      | ABC Healthcare | Quality Assurance| 199.99    | active
-- 3  | 456      | XYZ Medical   | Billing Suite   | 399.99     | trial
-- 
-- Now you can easily see which agency has which subscriptions!
-- =====================================================
