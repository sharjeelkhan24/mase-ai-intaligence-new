-- =====================================================
-- MANUALLY SET NURSE MANAGER STATUS TO OFFLINE
-- =====================================================
-- This script will manually set staff members to offline status
-- Run this if the logout isn't working properly

-- =====================================================
-- STEP 1: FIND YOUR NURSE MANAGER
-- =====================================================
-- First, find your nurse manager's details:

-- SELECT 
--   email,
--   first_name,
--   last_name,
--   role,
--   status,
--   last_login,
--   updated_at
-- FROM staff_metro_health_solutions_inc 
-- WHERE role = 'Nurse Manager';

-- =====================================================
-- STEP 2: SET NURSE MANAGER TO OFFLINE
-- =====================================================
-- Replace 'your-nurse-manager-email@example.com' with the actual email:

-- UPDATE staff_metro_health_solutions_inc 
-- SET status = 'offline',
--     updated_at = now()
-- WHERE email = 'your-nurse-manager-email@example.com'
-- AND role = 'Nurse Manager';

-- =====================================================
-- STEP 3: SET ALL STAFF TO OFFLINE (if needed)
-- =====================================================
-- If you want to set all staff to offline:

-- UPDATE staff_metro_health_solutions_inc 
-- SET status = 'offline',
--     updated_at = now()
-- WHERE status = 'online';

-- =====================================================
-- STEP 4: SET ALL PATIENTS TO OFFLINE (if needed)
-- =====================================================
-- If you want to set all patients to offline:

-- UPDATE patients_metro_health_solutions_inc 
-- SET status = 'offline',
--     updated_at = now()
-- WHERE status = 'online';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check current status of all staff:
-- SELECT 
--   email,
--   first_name,
--   last_name,
--   role,
--   status,
--   last_login,
--   updated_at
-- FROM staff_metro_health_solutions_inc 
-- ORDER BY updated_at DESC;

-- Check current status of all patients:
-- SELECT 
--   email,
--   first_name,
--   last_name,
--   status,
--   last_login,
--   updated_at
-- FROM patients_metro_health_solutions_inc 
-- ORDER BY updated_at DESC;
