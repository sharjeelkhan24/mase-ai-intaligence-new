-- SAFE FIX: Only add missing functions and fix existing agency
-- This will NOT delete any existing data

-- Step 1: Create the missing functions (safe - won't affect existing data)

-- Function to sanitize agency name
CREATE OR REPLACE FUNCTION sanitize_table_name(agency_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(regexp_replace(
    trim(agency_name), '[^a-zA-Z0-9]', '_', 'g'), 
    '_+', '_', 'g'), 
    '^_|_$', '', 'g'));
END;
$$;

-- Function to create agency patients table
CREATE OR REPLACE FUNCTION create_agency_patients_table(agency_name_param text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    table_name text;
    sanitized_name text;
BEGIN
    -- Sanitize the agency name
    sanitized_name := sanitize_table_name(agency_name_param);
    table_name := 'patients_' || sanitized_name;
    
    -- Create the patients table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_name text NOT NULL,
            first_name text NOT NULL,
            last_name text NOT NULL,
            email text UNIQUE NOT NULL,
            phone text,
            date_of_birth date,
            gender text,
            address text,
            city text,
            state text,
            zip_code text,
            emergency_contact_name text,
            emergency_contact_phone text,
            medical_conditions text,
            medications text,
            allergies text,
            primary_nurse text,
            primary_physician text,
            admission_date date,
            medical_record_number text,
            profile_image text,
            password_hash text NOT NULL,
            status text DEFAULT ''active'',
            last_login timestamp with time zone,
            created_at timestamp with time zone DEFAULT NOW(),
            updated_at timestamp with time zone DEFAULT NOW()
        )', table_name);
    
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    -- Create RLS policy
    EXECUTE format('
        CREATE POLICY "Agency can manage their patients" ON %I
        FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', table_name);
    
    RETURN table_name;
END;
$$;

-- Function to create agency staff table
CREATE OR REPLACE FUNCTION create_agency_staff_table(agency_name_param text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    table_name text;
    sanitized_name text;
BEGIN
    -- Sanitize the agency name
    sanitized_name := sanitize_table_name(agency_name_param);
    table_name := 'staff_' || sanitized_name;
    
    -- Create the staff table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_name text NOT NULL,
            first_name text NOT NULL,
            last_name text NOT NULL,
            email text UNIQUE NOT NULL,
            phone text,
            role text NOT NULL,
            department text,
            hire_date date,
            salary numeric(10,2),
            address text,
            city text,
            state text,
            zip_code text,
            emergency_contact_name text,
            emergency_contact_phone text,
            license_number text,
            license_expiry date,
            certifications text,
            notes text,
            profile_image text,
            password_hash text NOT NULL,
            status text DEFAULT ''active'',
            last_login timestamp with time zone,
            created_at timestamp with time zone DEFAULT NOW(),
            updated_at timestamp with time zone DEFAULT NOW()
        )', table_name);
    
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    -- Create RLS policy
    EXECUTE format('
        CREATE POLICY "Agency can manage their staff" ON %I
        FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', table_name);
    
    RETURN table_name;
END;
$$;

-- Function for trigger (creates tables when new agency is inserted)
CREATE OR REPLACE FUNCTION create_agency_tables_on_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    patients_table text;
    staff_table text;
BEGIN
    -- Create patients table
    SELECT create_agency_patients_table(NEW.agency_name) INTO patients_table;
    
    -- Create staff table  
    SELECT create_agency_staff_table(NEW.agency_name) INTO staff_table;
    
    -- Update the agency record with table names
    NEW.patients_table_name := patients_table;
    NEW.staff_table_name := staff_table;
    
    RETURN NEW;
END;
$$;

-- Step 2: Fix the trigger (safe - won't affect existing data)
DROP TRIGGER IF EXISTS trigger_create_agency_tables ON agency;

CREATE TRIGGER trigger_create_agency_tables
  BEFORE INSERT ON agency
  FOR EACH ROW
  EXECUTE FUNCTION create_agency_tables_on_insert();

-- Step 3: Check what agencies you have
SELECT 
    id,
    agency_name,
    patients_table_name,
    staff_table_name,
    created_at
FROM agency 
ORDER BY created_at DESC;

-- Step 4: For your existing agency, manually create the tables and update the record
-- Replace 'ABC Healthcare Services LLC' with your actual agency name

-- First, create the tables for your existing agency
SELECT create_agency_patients_table('ABC Healthcare Services LLC');
SELECT create_agency_staff_table('ABC Healthcare Services LLC');

-- Then update your agency record with the table names
UPDATE agency 
SET patients_table_name = 'patients_abc_healthcare_services_llc',
    staff_table_name = 'staff_abc_healthcare_services_llc',
    updated_at = NOW()
WHERE agency_name = 'ABC Healthcare Services LLC';

-- Step 5: Verify everything worked
SELECT 
    agency_name,
    patients_table_name,
    staff_table_name
FROM agency 
WHERE agency_name = 'ABC Healthcare Services LLC';

-- Check if the tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('staff_abc_healthcare_services_llc', 'patients_abc_healthcare_services_llc');
