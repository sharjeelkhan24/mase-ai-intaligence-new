-- =====================================================
-- UPDATE AGENCY TABLE NAMES
-- =====================================================
-- This script updates the agency record with the correct table names

-- Update the agency record with the correct table names
UPDATE agency 
SET 
    patients_table_name = 'patients_test_healthcare_agency',
    staff_table_name = 'staff_test_healthcare_agency',
    inbox_table_name = 'inbox_test_healthcare_agency',
    sent_table_name = 'sent_test_healthcare_agency',
    drafts_table_name = 'drafts_test_healthcare_agency'
WHERE email = 'test@healthcare.com';

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

-- Also verify the staff table exists and is accessible
SELECT COUNT(*) as staff_count FROM staff_test_healthcare_agency;
