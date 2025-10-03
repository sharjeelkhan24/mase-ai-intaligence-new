-- =====================================================
-- CHECK AND FIX AGENCY TABLE NAMES
-- =====================================================
-- This script checks the current agency data and fixes missing table names

-- First, let's see what we have
SELECT 
    id,
    agency_name,
    email,
    patients_table_name,
    staff_table_name,
    inbox_table_name,
    sent_table_name,
    drafts_table_name
FROM agency 
WHERE email = 'test@healthcare.com';

-- Check if the tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%test_healthcare_agency%'
ORDER BY table_name;

-- If the table names are NULL, let's fix them
DO $$
DECLARE
    agency_rec RECORD;
    table_name_var TEXT;
BEGIN
    -- Get the agency record
    SELECT * INTO agency_rec FROM agency WHERE email = 'test@healthcare.com';
    
    IF FOUND THEN
        -- Generate the table name
        table_name_var := lower(replace(agency_rec.agency_name, ' ', '_'));
        
        -- Update the agency record with the correct table names
        UPDATE agency 
        SET 
            patients_table_name = 'patients_' || table_name_var,
            staff_table_name = 'staff_' || table_name_var,
            inbox_table_name = 'inbox_' || table_name_var,
            sent_table_name = 'sent_' || table_name_var,
            drafts_table_name = 'drafts_' || table_name_var
        WHERE id = agency_rec.id;
        
        RAISE NOTICE 'Updated agency table names for: %', agency_rec.agency_name;
        RAISE NOTICE 'Staff table name: staff_%', table_name_var;
    ELSE
        RAISE NOTICE 'Agency not found with email: test@healthcare.com';
    END IF;
END $$;

-- Verify the update
SELECT 
    id,
    agency_name,
    email,
    patients_table_name,
    staff_table_name,
    inbox_table_name,
    sent_table_name,
    drafts_table_name
FROM agency 
WHERE email = 'test@healthcare.com';
