-- =====================================================
-- MASE AI Intelligence Project - RLS Policy Fix
-- Version: 1.1.0
-- Created: 2025-01-18
-- Description: Fix RLS policies to allow unauthenticated inserts
-- =====================================================

-- =====================================================
-- POLICY FIX 1.0: Remove existing restrictive policies
-- =====================================================

-- Drop existing policies for agency table
DROP POLICY IF EXISTS "Users can view their own agency data" ON agency;
DROP POLICY IF EXISTS "Users can insert their own agency data" ON agency;
DROP POLICY IF EXISTS "Users can update their own agency data" ON agency;

-- Drop existing policies for agency_subscription table
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON agency_subscription;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON agency_subscription;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON agency_subscription;

-- =====================================================
-- POLICY FIX 2.0: Create new permissive policies
-- =====================================================

-- Agency table policies (allow all operations for now)
CREATE POLICY "Allow all operations on agency" ON agency
    FOR ALL USING (true) WITH CHECK (true);

-- Agency subscription table policies (allow all operations for now)
CREATE POLICY "Allow all operations on agency_subscription" ON agency_subscription
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- POLICY FIX 3.0: Alternative - Disable RLS temporarily
-- =====================================================

-- If you prefer to disable RLS completely (less secure but simpler):
-- ALTER TABLE agency DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE agency_subscription DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICY FIX 4.0: More secure approach (recommended for production)
-- =====================================================

-- If you want to keep RLS but allow specific operations:
-- CREATE POLICY "Allow public inserts on agency" ON agency
--     FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public inserts on agency_subscription" ON agency_subscription
--     FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow public selects on agency" ON agency
--     FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow public selects on agency_subscription" ON agency_subscription
--     FOR SELECT USING (true);

-- =====================================================
-- END OF VERSION 1.1.0
-- =====================================================
