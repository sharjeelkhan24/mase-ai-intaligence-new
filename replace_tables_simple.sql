-- =====================================================
-- SIMPLE AGENCY-SPECIFIC TABLES SETUP
-- =====================================================
-- This replaces your old tables and sets up agency-specific functionality
-- Run this in your Supabase SQL Editor

-- =====================================================
-- STEP 1: DROP OLD TABLES AND CREATE NEW STRUCTURE
-- =====================================================

-- Drop existing tables
DROP TABLE IF EXISTS agency_subscription CASCADE;
DROP TABLE IF EXISTS agency CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

-- =====================================================
-- STEP 2: CREATE UPDATED AGENCY TABLE
-- =====================================================

CREATE TABLE agency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    staff_count VARCHAR(50) DEFAULT '1-10',
    patient_count VARCHAR(50) DEFAULT '1-50',
    notes TEXT,
    password VARCHAR(255) NOT NULL,
    patients_table_name VARCHAR(100),
    staff_table_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: CREATE AGENCY SUBSCRIPTION TABLE
-- =====================================================

CREATE TABLE agency_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID REFERENCES agency(id) ON DELETE CASCADE,
    agency_name VARCHAR(255) NOT NULL,
    subscription_type VARCHAR(50) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'trial',
    start_period TIMESTAMP WITH TIME ZONE NOT NULL,
    end_period TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 4: CREATE FUNCTIONS FOR TABLE CREATION
-- =====================================================

-- Function to execute SQL
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;

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

-- Function to create patients table for agency
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

  -- Create indexes
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON public.%I USING btree (agency_name)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON public.%I USING btree (status)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON public.%I USING btree (email)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_mrn ON public.%I USING btree (medical_record_number)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_admission_date ON public.%I USING btree (admission_date)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_primary_nurse ON public.%I USING btree (primary_nurse)', table_name, table_name);

  RETURN table_name;
END;
$$;

-- Function to create staff table for agency
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

  -- Create indexes
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON public.%I USING btree (agency_name)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_role ON public.%I USING btree (role)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_department ON public.%I USING btree (department)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON public.%I USING btree (status)', table_name, table_name);
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON public.%I USING btree (email)', table_name, table_name);

  RETURN table_name;
END;
$$;

-- =====================================================
-- STEP 5: CREATE TRIGGER FOR AUTOMATIC TABLE CREATION
-- =====================================================

-- Function to create tables when agency is inserted
CREATE OR REPLACE FUNCTION create_agency_tables_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  patients_table_name text;
  staff_table_name text;
BEGIN
  -- Create tables
  patients_table_name := create_agency_patients_table(NEW.agency_name);
  staff_table_name := create_agency_staff_table(NEW.agency_name);
  
  -- Update the agency record with table names
  NEW.patients_table_name := patients_table_name;
  NEW.staff_table_name := staff_table_name;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER trigger_create_agency_tables
  BEFORE INSERT ON agency
  FOR EACH ROW
  EXECUTE FUNCTION create_agency_tables_on_insert();

-- =====================================================
-- STEP 6: GRANT PERMISSIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION sanitize_table_name(text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_agency_patients_table(text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_agency_staff_table(text) TO authenticated;

-- =====================================================
-- STEP 7: CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_agency_email ON agency(email);
CREATE INDEX IF NOT EXISTS idx_agency_license_number ON agency(license_number);
CREATE INDEX IF NOT EXISTS idx_agency_patients_table_name ON agency(patients_table_name);
CREATE INDEX IF NOT EXISTS idx_agency_staff_table_name ON agency(staff_table_name);
CREATE INDEX IF NOT EXISTS idx_agency_subscription_agency_id ON agency_subscription(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_subscription_status ON agency_subscription(status);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Setup complete! Now when you create an agency:
-- 1. The trigger will automatically create patients_[agency_name] and staff_[agency_name] tables
-- 2. The agency record will be updated with the table names
-- 3. All necessary indexes will be created
-- 4. You can test by inserting into the agency table or using the signup form
