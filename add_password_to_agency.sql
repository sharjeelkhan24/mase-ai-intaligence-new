-- =====================================================
-- ADD PASSWORD FIELD TO AGENCY TABLE
-- =====================================================
-- Version: 2.2.0
-- Date: 2024-01-XX
-- Description: Add password field to agency table for authentication
-- =====================================================

-- STEP 1: Add password column to agency table
ALTER TABLE agency 
ADD COLUMN password VARCHAR(255);

-- STEP 2: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_agency_password ON agency(password);

-- STEP 3: Add comment for documentation
COMMENT ON COLUMN agency.password IS 'Hashed password for agency authentication';

-- =====================================================
-- NOTE: In production, you should hash passwords before storing them
-- =====================================================
-- 
-- Example of how to hash passwords in your application:
-- 
-- import bcrypt from 'bcryptjs';
-- 
-- // When creating a new agency:
-- const hashedPassword = await bcrypt.hash(password, 10);
-- 
-- // When verifying password during sign-in:
-- const isValidPassword = await bcrypt.compare(password, agencyData.password);
-- 
-- =====================================================
