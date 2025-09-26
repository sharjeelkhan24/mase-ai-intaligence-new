-- =====================================================
-- CHECK AND FIX USER STATUS
-- =====================================================
-- This script will help you check and fix your user status

-- Replace 'your-email@example.com' with your actual email
-- Replace 'staff_metro_health_solutions_inc' with your actual staff table name

-- STEP 1: Check your current status
SELECT 
  email,
  first_name,
  last_name,
  status,
  last_login,
  last_logout,
  created_at,
  updated_at
FROM staff_metro_health_solutions_inc
WHERE email = 'your-email@example.com';

-- STEP 2: If your status is 'offline', fix it to 'online'
-- Uncomment the lines below and replace the email

-- UPDATE staff_metro_health_solutions_inc
-- SET status = 'online',
--     last_login = now(),
--     last_logout = null,
--     updated_at = now()
-- WHERE email = 'your-email@example.com';

-- STEP 3: Verify the fix
-- SELECT 
--   email,
--   first_name,
--   last_name,
--   status,
--   last_login,
--   last_logout
-- FROM staff_metro_health_solutions_inc
-- WHERE email = 'your-email@example.com';
