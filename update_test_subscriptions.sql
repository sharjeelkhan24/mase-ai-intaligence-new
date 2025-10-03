-- =====================================================
-- UPDATE TEST AGENCY SUBSCRIPTIONS
-- =====================================================
-- Use this script to update subscriptions for the test agency

-- Update subscriptions for the test agency
DO $$
DECLARE
    agency_id_val uuid;
    agency_name_val varchar(255);
    subscription_table_name varchar(255);
BEGIN
    -- Get the agency data
    SELECT id, agency_name INTO agency_id_val, agency_name_val
    FROM agency 
    WHERE email = 'test@healthcare.com';
    
    -- Generate the subscription table name (same logic as in the trigger)
    subscription_table_name := 'subscription_' || lower(replace(agency_name_val, ' ', '_'));
    
    -- Delete existing subscriptions
    EXECUTE format('DELETE FROM %I WHERE agency_id = $1', subscription_table_name) USING agency_id_val;
    
    -- Insert new subscriptions
    EXECUTE format('
        INSERT INTO %I (agency_id, agency_name, subscription_type, total_price, status, start_period, end_period)
        SELECT 
            $1, 
            $2, 
            subscription_type, 
            price, 
            ''trial'',
            NOW(),
            NOW() + INTERVAL ''30 days''
        FROM (VALUES 
            (''HR Management'', 2500.00),
            (''Quality Assurance'', 2200.00),
            (''Billing Suite'', 1500.00),
            (''Analytics Pro'', 1800.00)
        ) AS subs(subscription_type, price)',
        subscription_table_name
    ) USING agency_id_val, agency_name_val;
    
    RAISE NOTICE 'Updated subscriptions in table: %', subscription_table_name;
END $$;

-- Verify the subscriptions were updated
SELECT 
  agency_name,
  subscription_type,
  status,
  total_price,
  start_period,
  end_period
FROM subscription_test_healthcare_agency
ORDER BY subscription_type;
