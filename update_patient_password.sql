-- =====================================================
-- UPDATE PATIENT PASSWORD
-- =====================================================
-- This script updates a patient's password in their agency-specific table
-- The password is hashed using Base64 encoding (btoa) to match the application's format

-- =====================================================
-- STEP 1: FIND THE PATIENT'S AGENCY AND TABLE
-- =====================================================

-- First, let's see all agencies and their patient table names
-- Run this query to see available agencies:
-- SELECT agency_name, patients_table_name FROM agency WHERE patients_table_name IS NOT NULL;

-- =====================================================
-- STEP 2: UPDATE PATIENT PASSWORD
-- =====================================================

-- Replace the following values with your actual data:
-- @patient_email: The patient's email address
-- @new_password: The new password (will be Base64 encoded)
-- @agency_name: The agency name where the patient belongs

-- Example usage:
-- UPDATE patients_metro_health_solutions_inc 
-- SET password_hash = encode('newpassword123'::bytea, 'base64')
-- WHERE email = 'patient@example.com';

-- =====================================================
-- FUNCTION TO UPDATE PATIENT PASSWORD BY EMAIL
-- =====================================================

-- This function will search across all agency patient tables and update the password
CREATE OR REPLACE FUNCTION update_patient_password(
  patient_email text,
  new_password text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  agency_record RECORD;
  update_sql text;
  result_message text;
BEGIN
  -- Search through all agencies
  FOR agency_record IN 
    SELECT agency_name, patients_table_name 
    FROM agency 
    WHERE patients_table_name IS NOT NULL
  LOOP
    -- Try to update the patient in this agency's table
    update_sql := format('
      UPDATE %I 
      SET password_hash = encode(%L::bytea, ''base64''),
          updated_at = now()
      WHERE email = %L
      RETURNING id, first_name, last_name
    ', agency_record.patients_table_name, new_password, patient_email);
    
    BEGIN
      EXECUTE update_sql INTO result_message;
      
      IF result_message IS NOT NULL THEN
        RETURN format('Password updated successfully for patient %s in agency %s', 
                     result_message, agency_record.agency_name);
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        -- Continue to next agency if this one fails
        CONTINUE;
    END;
  END LOOP;
  
  RETURN format('No patient found with email %s in any agency', patient_email);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_patient_password(text, text) TO authenticated;

-- =====================================================
-- USAGE EXAMPLES
-- =====================================================

-- Example 1: Update password for a specific patient
-- SELECT update_patient_password('patient@example.com', 'newpassword123');

-- Example 2: Update password for a patient in a specific agency
-- UPDATE patients_metro_health_solutions_inc 
-- SET password_hash = encode('newpassword123'::bytea, 'base64'),
--     updated_at = now()
-- WHERE email = 'patient@example.com';

-- Example 3: Reset password to a simple default
-- SELECT update_patient_password('patient@example.com', 'password123');

-- =====================================================
-- QUICK RESET FOR TESTING
-- =====================================================

-- If you want to quickly reset a patient's password for testing:
-- Replace 'your-patient-email@example.com' with the actual patient email
-- Replace 'testpassword123' with your desired password

-- SELECT update_patient_password('your-patient-email@example.com', 'testpassword123');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- To verify the password was updated, you can check:
-- SELECT email, password_hash, updated_at 
-- FROM patients_metro_health_solutions_inc 
-- WHERE email = 'patient@example.com';

-- To decode and verify the password hash:
-- SELECT email, decode(password_hash, 'base64') as decoded_password
-- FROM patients_metro_health_solutions_inc 
-- WHERE email = 'patient@example.com';
