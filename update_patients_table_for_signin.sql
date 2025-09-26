-- =====================================================
-- UPDATE PATIENTS TABLE FOR SIGNIN COMPATIBILITY
-- =====================================================
-- This script adds missing columns to the patients table
-- that the patient signin code expects
-- =====================================================

-- Add missing columns to patients table
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS medical_conditions TEXT,
ADD COLUMN IF NOT EXISTS medications TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Update existing records to have active status
UPDATE patients SET account_status = 'active' WHERE account_status IS NULL;

-- Create index on account_status for better performance
CREATE INDEX IF NOT EXISTS idx_patients_account_status ON patients(account_status);

-- Add comments for the new columns
COMMENT ON COLUMN patients.account_status IS 'Account status: active, inactive, suspended';
COMMENT ON COLUMN patients.gender IS 'Patient gender: Male, Female, Other, Prefer not to say';
COMMENT ON COLUMN patients.medical_conditions IS 'Current medical conditions';
COMMENT ON COLUMN patients.medications IS 'Current medications';
COMMENT ON COLUMN patients.allergies IS 'Known allergies';
COMMENT ON COLUMN patients.profile_image IS 'Base64 encoded profile image or image URL';
COMMENT ON COLUMN patients.last_login IS 'Last login timestamp';

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'patients'
ORDER BY ordinal_position;
