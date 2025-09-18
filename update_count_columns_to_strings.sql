-- =====================================================
-- UPDATE COUNT COLUMNS TO STRINGS
-- =====================================================
-- Version: 2.3.0
-- Date: 2024-01-XX
-- Description: Change staff_count and patient_count from INTEGER to VARCHAR to store ranges
-- =====================================================

-- STEP 1: Add new VARCHAR columns
ALTER TABLE agency 
ADD COLUMN staff_count_new VARCHAR(20),
ADD COLUMN patient_count_new VARCHAR(20);

-- STEP 2: Convert existing integer values to string ranges (matching dropdown options)
UPDATE agency 
SET 
    staff_count_new = CASE 
        WHEN staff_count = 0 OR staff_count IS NULL THEN '0'
        WHEN staff_count BETWEEN 1 AND 10 THEN '1-10'
        WHEN staff_count BETWEEN 11 AND 25 THEN '11-25'
        WHEN staff_count BETWEEN 26 AND 50 THEN '26-50'
        WHEN staff_count BETWEEN 51 AND 100 THEN '51-100'
        WHEN staff_count > 100 THEN '100+'
        ELSE '1-10' -- Default fallback
    END,
    patient_count_new = CASE 
        WHEN patient_count = 0 OR patient_count IS NULL THEN '0'
        WHEN patient_count BETWEEN 1 AND 50 THEN '1-50'
        WHEN patient_count BETWEEN 51 AND 100 THEN '51-100'
        WHEN patient_count BETWEEN 101 AND 250 THEN '101-250'
        WHEN patient_count BETWEEN 251 AND 500 THEN '251-500'
        WHEN patient_count > 500 THEN '500+'
        ELSE '1-50' -- Default fallback
    END;

-- STEP 3: Drop old columns
ALTER TABLE agency 
DROP COLUMN staff_count,
DROP COLUMN patient_count;

-- STEP 4: Rename new columns
ALTER TABLE agency 
RENAME COLUMN staff_count_new TO staff_count;
ALTER TABLE agency 
RENAME COLUMN patient_count_new TO patient_count;

-- STEP 5: Set default values
ALTER TABLE agency 
ALTER COLUMN staff_count SET DEFAULT '0';
ALTER TABLE agency 
ALTER COLUMN patient_count SET DEFAULT '0';

-- STEP 6: Update comments
COMMENT ON COLUMN agency.staff_count IS 'Staff count range (e.g., "1-10", "11-25", "100+")';
COMMENT ON COLUMN agency.patient_count IS 'Patient count range (e.g., "1-50", "51-100", "500+")';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check the updated data
-- SELECT agency_name, staff_count, patient_count FROM agency;

-- =====================================================
-- EXAMPLE OF WHAT THE DATA WILL LOOK LIKE
-- =====================================================
-- 
-- Before (INTEGER):
-- agency_name | staff_count | patient_count
-- ABC Health  | 6          | 26
-- XYZ Medical | 18         | 76
-- 
-- After (VARCHAR):
-- agency_name | staff_count | patient_count
-- ABC Health  | 1-10       | 1-50
-- XYZ Medical | 11-25      | 51-100
-- 
-- =====================================================
