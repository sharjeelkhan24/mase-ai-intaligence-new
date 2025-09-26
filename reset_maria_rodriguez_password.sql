-- =====================================================
-- RESET PASSWORD FOR MARIA RODRIGUEZ
-- =====================================================
-- Patient: maria.rodriguez@email.com
-- Table: patients_metro_health_solutions_inc

-- =====================================================
-- OPTION 1: Reset to "password123"
-- =====================================================
UPDATE patients_metro_health_solutions_inc 
SET password_hash = encode('password123'::bytea, 'base64'),
    updated_at = now()
WHERE email = 'maria.rodriguez@email.com';

-- =====================================================
-- OPTION 2: Reset to "test123"
-- =====================================================
-- UPDATE patients_metro_health_solutions_inc 
-- SET password_hash = encode('test123'::bytea, 'base64'),
--     updated_at = now()
-- WHERE email = 'maria.rodriguez@email.com';

-- =====================================================
-- OPTION 3: Reset to "123456"
-- =====================================================
-- UPDATE patients_metro_health_solutions_inc 
-- SET password_hash = encode('123456'::bytea, 'base64'),
--     updated_at = now()
-- WHERE email = 'maria.rodriguez@email.com';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if the password was updated successfully:
SELECT email, password_hash, updated_at, first_name, last_name
FROM patients_metro_health_solutions_inc 
WHERE email = 'maria.rodriguez@email.com';

-- Decode the password to verify it's correct:
SELECT email, decode(password_hash, 'base64') as decoded_password, first_name, last_name
FROM patients_metro_health_solutions_inc 
WHERE email = 'maria.rodriguez@email.com';

-- =====================================================
-- LOGIN CREDENTIALS AFTER RESET
-- =====================================================
-- Email: maria.rodriguez@email.com
-- Password: password123
-- (or whatever password you chose from the options above)
