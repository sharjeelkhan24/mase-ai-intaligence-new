-- =====================================================
-- TEST AND FIX NURSE MANAGER STATUS
-- =====================================================
-- This script will help test and fix the nurse manager status issue

-- =====================================================
-- STEP 1: CHECK CURRENT STATUS
-- =====================================================
-- Check the current status of your nurse manager:

SELECT 
  email,
  first_name,
  last_name,
  role,
  status,
  last_login,
  updated_at
FROM staff_metro_health_solutions_inc 
WHERE role = 'Nurse Manager'
ORDER BY updated_at DESC;

-- =====================================================
-- STEP 2: MANUALLY SET TO OFFLINE
-- =====================================================
-- If the status is still 'online', manually set it to 'offline':

UPDATE staff_metro_health_solutions_inc 
SET status = 'offline',
    updated_at = now()
WHERE role = 'Nurse Manager'
AND status = 'online';

-- =====================================================
-- STEP 3: VERIFY THE CHANGE
-- =====================================================
-- Check that the status was updated:

SELECT 
  email,
  first_name,
  last_name,
  role,
  status,
  last_login,
  updated_at
FROM staff_metro_health_solutions_inc 
WHERE role = 'Nurse Manager';

-- =====================================================
-- STEP 4: TEST LOGIN/LOGOUT CYCLE
-- =====================================================
-- After setting to offline, try this cycle:
-- 1. Login as nurse manager
-- 2. Check HR dashboard - should show "Online"
-- 3. Logout from nurse manager dashboard
-- 4. Check HR dashboard - should show "Offline"

-- =====================================================
-- STEP 5: RESET ALL STAFF STATUS (if needed)
-- =====================================================
-- If you want to reset all staff to offline status:

-- UPDATE staff_metro_health_solutions_inc 
-- SET status = 'offline',
--     updated_at = now()
-- WHERE status IN ('online', 'active');

-- =====================================================
-- DEBUGGING QUERIES
-- =====================================================

-- Check all staff with their status:
SELECT 
  email,
  first_name,
  last_name,
  role,
  status,
  last_login,
  updated_at,
  CASE 
    WHEN status = 'online' THEN 'Should be Online'
    WHEN status = 'offline' THEN 'Should be Offline'
    WHEN status = 'active' AND last_login IS NOT NULL 
         AND last_login > (now() - interval '30 minutes') THEN 'Should be Online (recent login)'
    ELSE 'Should be Offline'
  END as expected_status
FROM staff_metro_health_solutions_inc 
ORDER BY updated_at DESC;
