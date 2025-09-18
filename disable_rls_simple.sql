-- =====================================================
-- MASE AI Intelligence Project - Disable RLS
-- Version: 1.1.1
-- Created: 2025-01-18
-- Description: Simple script to disable RLS for development
-- =====================================================

-- Disable Row Level Security on both tables
ALTER TABLE agency DISABLE ROW LEVEL SECURITY;
ALTER TABLE agency_subscription DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('agency', 'agency_subscription');

-- =====================================================
-- END OF VERSION 1.1.1
-- =====================================================
