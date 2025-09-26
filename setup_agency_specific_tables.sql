-- =====================================================
-- AGENCY-SPECIFIC TABLES SETUP
-- =====================================================
-- This file sets up the database functions and schema updates needed
-- for creating agency-specific tables dynamically
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: CREATE NECESSARY FUNCTIONS
-- =====================================================

-- Function to execute raw SQL (for table creation)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION table_exists(text) TO authenticated;

-- =====================================================
-- STEP 2: UPDATE AGENCY TABLE SCHEMA
-- =====================================================

-- Add columns to store table names
ALTER TABLE agency 
ADD COLUMN IF NOT EXISTS patients_table_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS staff_table_name VARCHAR(100);

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_agency_patients_table_name ON agency(patients_table_name);
CREATE INDEX IF NOT EXISTS idx_agency_staff_table_name ON agency(staff_table_name);

-- =====================================================
-- STEP 3: CREATE HELPER FUNCTIONS FOR TABLE MANAGEMENT
-- =====================================================

-- Function to create agency patients table
CREATE OR REPLACE FUNCTION create_agency_patients_table(
  agency_name_param text,
  table_name_param text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  create_sql text;
  index_sql text;
BEGIN
  -- Create table SQL
  create_sql := format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id uuid not null default gen_random_uuid(),
      agency_name character varying(255) not null,
      first_name character varying(100) not null,
      last_name character varying(100) not null,
      email character varying(255) not null,
      phone character varying(20) null,
      date_of_birth date not null,
      address text null,
      city character varying(100) null,
      state character varying(50) null,
      zip_code character varying(10) null,
      emergency_contact_name character varying(100) not null,
      emergency_contact_phone character varying(20) not null,
      medical_record_number character varying(100) null,
      primary_physician character varying(100) null default ''TBD''::character varying,
      primary_nurse character varying(100) null,
      admission_date date null,
      discharge_date date null,
      status character varying(20) null default ''active''::character varying,
      notes text null,
      password_hash character varying(255) not null,
      created_at timestamp without time zone null default now(),
      updated_at timestamp without time zone null default now(),
      gender character varying(20) null,
      medical_conditions text null,
      medications text null,
      allergies text null,
      profile_image text null,
      last_login timestamp without time zone null,
      constraint %I_pkey primary key (id),
      constraint %I_email_key unique (email)
    ) TABLESPACE pg_default;
  ', table_name_param, table_name_param, table_name_param);

  -- Execute table creation
  EXECUTE create_sql;

  -- Create indexes SQL
  index_sql := format('
    CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON public.%I USING btree (agency_name) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_status ON public.%I USING btree (status) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_email ON public.%I USING btree (email) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_mrn ON public.%I USING btree (medical_record_number) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_admission_date ON public.%I USING btree (admission_date) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_primary_nurse ON public.%I USING btree (primary_nurse) TABLESPACE pg_default;
  ', table_name_param, table_name_param, table_name_param, table_name_param, 
     table_name_param, table_name_param, table_name_param, table_name_param,
     table_name_param, table_name_param, table_name_param, table_name_param);

  -- Execute index creation
  EXECUTE index_sql;

  RETURN table_name_param;
END;
$$;

-- Function to create agency staff table
CREATE OR REPLACE FUNCTION create_agency_staff_table(
  agency_name_param text,
  table_name_param text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  create_sql text;
  index_sql text;
BEGIN
  -- Create table SQL
  create_sql := format('
    CREATE TABLE IF NOT EXISTS public.%I (
      id uuid not null default gen_random_uuid(),
      agency_name character varying(255) not null,
      first_name character varying(100) not null,
      last_name character varying(100) not null,
      email character varying(255) not null,
      phone character varying(20) null,
      role character varying(50) not null,
      department character varying(100) null,
      hire_date date null,
      salary numeric(10, 2) null,
      address text null,
      city character varying(100) null,
      state character varying(50) null,
      zip_code character varying(10) null,
      emergency_contact_name character varying(100) null,
      emergency_contact_phone character varying(20) null,
      license_number character varying(100) null,
      license_expiry date null,
      certifications text null,
      notes text null,
      password_hash character varying(255) not null,
      status character varying(20) null default ''active''::character varying,
      created_at timestamp without time zone null default now(),
      updated_at timestamp without time zone null default now(),
      profile_image text null,
      constraint %I_pkey primary key (id),
      constraint %I_email_key unique (email)
    ) TABLESPACE pg_default;
  ', table_name_param, table_name_param, table_name_param);

  -- Execute table creation
  EXECUTE create_sql;

  -- Create indexes SQL
  index_sql := format('
    CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON public.%I USING btree (agency_name) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_role ON public.%I USING btree (role) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_department ON public.%I USING btree (department) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_status ON public.%I USING btree (status) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_email ON public.%I USING btree (email) TABLESPACE pg_default;
  ', table_name_param, table_name_param, table_name_param, table_name_param,
     table_name_param, table_name_param, table_name_param, table_name_param,
     table_name_param, table_name_param);

  -- Execute index creation
  EXECUTE index_sql;

  RETURN table_name_param;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_agency_patients_table(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_agency_staff_table(text, text) TO authenticated;

-- =====================================================
-- STEP 4: CREATE ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on agency table if not already enabled
ALTER TABLE agency ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Agencies can view their own data" ON agency;
DROP POLICY IF EXISTS "Agencies can insert their own data" ON agency;
DROP POLICY IF EXISTS "Agencies can update their own data" ON agency;

-- Create policy for agency table (basic example - adjust as needed)
CREATE POLICY "Agencies can view their own data" ON agency
  FOR SELECT USING (true); -- Adjust this based on your authentication needs

CREATE POLICY "Agencies can insert their own data" ON agency
  FOR INSERT WITH CHECK (true); -- Adjust this based on your authentication needs

CREATE POLICY "Agencies can update their own data" ON agency
  FOR UPDATE USING (true); -- Adjust this based on your authentication needs

-- =====================================================
-- STEP 5: CREATE UTILITY FUNCTIONS FOR TABLE NAME GENERATION
-- =====================================================

-- Function to sanitize agency name for table naming
CREATE OR REPLACE FUNCTION sanitize_table_name(agency_name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(regexp_replace(
    trim(agency_name), '[^a-z0-9]', '_', 'g'), 
    '_+', '_', 'g'), 
    '^_|_$', '', 'g'));
END;
$$;

-- Function to generate table names for an agency
CREATE OR REPLACE FUNCTION generate_agency_table_names(agency_name text)
RETURNS json
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  sanitized_name text;
BEGIN
  sanitized_name := sanitize_table_name(agency_name);
  
  RETURN json_build_object(
    'sanitizedName', sanitized_name,
    'patientsTableName', 'patients_' || sanitized_name,
    'staffTableName', 'staff_' || sanitized_name
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION sanitize_table_name(text) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_agency_table_names(text) TO authenticated;

-- =====================================================
-- STEP 6: CREATE TRIGGER FOR AUTOMATIC TABLE CREATION
-- =====================================================

-- Function to automatically create tables when agency is created
CREATE OR REPLACE FUNCTION create_agency_tables_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_names json;
  patients_table_name text;
  staff_table_name text;
BEGIN
  -- Generate table names
  table_names := generate_agency_table_names(NEW.agency_name);
  patients_table_name := table_names->>'patientsTableName';
  staff_table_name := table_names->>'staffTableName';
  
  -- Create tables
  PERFORM create_agency_patients_table(NEW.agency_name, patients_table_name);
  PERFORM create_agency_staff_table(NEW.agency_name, staff_table_name);
  
  -- Update the agency record with table names
  NEW.patients_table_name := patients_table_name;
  NEW.staff_table_name := staff_table_name;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic table creation
DROP TRIGGER IF EXISTS trigger_create_agency_tables ON agency;
CREATE TRIGGER trigger_create_agency_tables
  BEFORE INSERT ON agency
  FOR EACH ROW
  EXECUTE FUNCTION create_agency_tables_on_insert();

-- =====================================================
-- STEP 7: VERIFICATION QUERIES
-- =====================================================

-- Test the functions
-- SELECT sanitize_table_name('ABC Healthcare Services LLC');
-- SELECT generate_agency_table_names('ABC Healthcare Services LLC');

-- Check if tables exist
-- SELECT table_exists('patients_abc_healthcare_services_llc');
-- SELECT table_exists('staff_abc_healthcare_services_llc');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- This setup is now complete! When a new agency is created:
-- 1. The trigger will automatically create agency-specific tables
-- 2. The agency record will be updated with the table names
-- 3. All necessary indexes and constraints will be created
-- 4. The API can use these functions for table management
