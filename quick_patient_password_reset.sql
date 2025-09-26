-- =====================================================
-- QUICK PATIENT PASSWORD RESET
-- =====================================================
-- Simple script to reset a patient's password immediately

-- STEP 1: Find your agency's patient table name
-- Run this query to see all agencies and their patient tables:
SELECT agency_name, patients_table_name 
FROM agency 
WHERE patients_table_name IS NOT NULL;

-- STEP 2: Update the password for your patient
-- Replace the table name and email with your actual values:

-- Example for Metro Health Solutions Inc:
UPDATE patients_metro_health_solutions_inc 
SET password_hash = encode('password123'::bytea, 'base64'),
    updated_at = now()
WHERE email = 'your-patient-email@example.com';

-- =====================================================
-- COMMON PASSWORD RESETS
-- =====================================================

-- Reset to common test passwords (choose one):

-- Password: "password123"
UPDATE patients_metro_health_solutions_inc 
SET password_hash = encode('password123'::bytea, 'base64'),
    updated_at = now()
WHERE email = 'your-patient-email@example.com';

-- Password: "test123"
UPDATE patients_metro_health_solutions_inc 
SET password_hash = encode('test123'::bytea, 'base64'),
    updated_at = now()
WHERE email = 'your-patient-email@example.com';

-- Password: "123456"
UPDATE patients_metro_health_solutions_inc 
SET password_hash = encode('123456'::bytea, 'base64'),
    updated_at = now()
WHERE email = 'your-patient-email@example.com';

-- =====================================================
-- VERIFICATION
-- =====================================================

-- To check if the password was updated:
SELECT email, password_hash, updated_at 
FROM patients_metro_health_solutions_inc 
WHERE email = 'your-patient-email@example.com';

-- To see the decoded password (for verification):
SELECT email, decode(password_hash, 'base64') as decoded_password
FROM patients_metro_health_solutions_inc 
WHERE email = 'your-patient-email@example.com';
