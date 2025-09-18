-- Add profile_image column to agency table
-- Run this in your Supabase SQL Editor

-- Add the profile_image column to the agency table
ALTER TABLE agency
ADD COLUMN profile_image TEXT;

-- Add comment for documentation
COMMENT ON COLUMN agency.profile_image IS 'URL to the agency profile image for display in the admin dashboard';

-- Create an index for faster lookups (optional, since we'll mainly query by id)
-- CREATE INDEX idx_agency_profile_image ON agency(profile_image) WHERE profile_image IS NOT NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'agency'
AND column_name = 'profile_image';

-- Show current agency table structure
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'agency'
ORDER BY ordinal_position;
