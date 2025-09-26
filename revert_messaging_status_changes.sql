-- Revert Simple Messaging Status Changes
-- This script removes the columns and functions added by simple_messaging_status.sql

-- =====================================================
-- STEP 1: Remove status columns from existing tables
-- =====================================================

-- Remove status columns from patients table
ALTER TABLE public.patients_metro_health_solutions_inc 
DROP COLUMN IF EXISTS is_online,
DROP COLUMN IF EXISTS last_seen;

-- Remove status columns from staff table
ALTER TABLE public.staff_metro_health_solutions_inc 
DROP COLUMN IF EXISTS is_online,
DROP COLUMN IF EXISTS last_seen;

-- =====================================================
-- STEP 2: Drop status-related indexes
-- =====================================================

-- Drop status indexes from patients table
DROP INDEX IF EXISTS idx_patients_metro_health_solutions_inc_is_online;

-- Drop status indexes from staff table
DROP INDEX IF EXISTS idx_staff_metro_health_solutions_inc_is_online;

-- =====================================================
-- STEP 3: Drop the functions that were created
-- =====================================================

-- Drop the status management functions
DROP FUNCTION IF EXISTS set_user_online(TEXT, TEXT);
DROP FUNCTION IF EXISTS set_user_offline(TEXT, TEXT);
DROP FUNCTION IF EXISTS get_user_status_for_messaging(TEXT, TEXT);

-- =====================================================
-- STEP 4: Restore original table creation functions
-- =====================================================

-- Restore original patients table creation function
CREATE OR REPLACE FUNCTION create_agency_patients_table(agency_name_param text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_name text;
  create_sql text;
BEGIN
  table_name := 'patients_' || sanitize_table_name(agency_name_param);
  
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
  ', table_name, table_name, table_name);

  EXECUTE create_sql;

  -- Create indexes (original ones)
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON public.%I USING btree (agency_name)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON public.%I USING btree (status)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON public.%I USING btree (email)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_mrn ON public.%I USING btree (medical_record_number)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_admission_date ON public.%I USING btree (admission_date)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_primary_nurse ON public.%I USING btree (primary_nurse)', table_name, table_name);

  RETURN table_name;
END;
$$;

-- Restore original staff table creation function
CREATE OR REPLACE FUNCTION create_agency_staff_table(agency_name_param text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_name text;
  create_sql text;
BEGIN
  table_name := 'staff_' || sanitize_table_name(agency_name_param);
  
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
  ', table_name, table_name, table_name);

  EXECUTE create_sql;

  -- Create indexes (original ones)
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON public.%I USING btree (agency_name)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_role ON public.%I USING btree (role)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_department ON public.%I USING btree (department)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON public.%I USING btree (status)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON public.%I USING btree (email)', table_name, table_name);

  RETURN table_name;
END;
$$;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
SELECT 'Simple messaging status changes reverted successfully! Database is back to original state.' as status;
