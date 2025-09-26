-- =====================================================
-- ADD PROFILE IMAGE COLUMN TO STAFF TABLE
-- =====================================================
-- This script adds a profile_image column to the staff table
-- to store profile images as base64 strings or image URLs
-- =====================================================

-- Add profile_image column to staff table
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS profile_image TEXT;

-- Add comment to document the column
COMMENT ON COLUMN staff.profile_image IS 'Profile image stored as base64 string or image URL';

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'staff' 
AND column_name = 'profile_image'
AND table_schema = 'public';

-- Show updated table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'staff' 
AND table_schema = 'public'
ORDER BY ordinal_position;
