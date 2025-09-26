-- =====================================================
-- DEBUG MARIA RODRIGUEZ'S ACCOUNT
-- =====================================================
-- Check Maria's current account status and password

-- Check Maria's current data:
SELECT 
  email,
  first_name,
  last_name,
  status,
  password_hash,
  decode(password_hash, 'base64') as decoded_password,
  created_at,
  updated_at,
  last_login
FROM patients_metro_health_solutions_inc 
WHERE email = 'maria.rodriguez@email.com';

-- =====================================================
-- RESET MARIA'S STATUS TO ACTIVE (if needed)
-- =====================================================
-- If Maria's status is not 'active', update it:

-- UPDATE patients_metro_health_solutions_inc 
-- SET status = 'active',
--     updated_at = now()
-- WHERE email = 'maria.rodriguez@email.com';

-- =====================================================
-- RESET MARIA'S PASSWORD (if needed)
-- =====================================================
-- If the password is wrong, reset it:

-- UPDATE patients_metro_health_solutions_inc 
-- SET password_hash = encode('password123'::bytea, 'base64'),
--     updated_at = now()
-- WHERE email = 'maria.rodriguez@email.com';

-- =====================================================
-- COMPLETE RESET (status + password)
-- =====================================================
-- Reset both status and password:

-- UPDATE patients_metro_health_solutions_inc 
-- SET status = 'active',
--     password_hash = encode('password123'::bytea, 'base64'),
--     updated_at = now()
-- WHERE email = 'maria.rodriguez@email.com';
