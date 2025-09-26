-- =====================================================
-- ADD LAST_LOGIN COLUMN TO STAFF TABLES
-- =====================================================
-- This script adds the last_login column to all existing staff tables
-- and updates the staff table creation function to include this column

-- =====================================================
-- STEP 1: ADD LAST_LOGIN COLUMN TO ALL EXISTING STAFF TABLES
-- =====================================================

-- Function to add last_login column to all staff tables
CREATE OR REPLACE FUNCTION add_last_login_to_staff_tables()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_record RECORD;
  alter_sql text;
BEGIN
  -- Get all staff tables
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'staff_%'
  LOOP
    -- Add last_login column if it doesn't exist
    alter_sql := format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS last_login timestamp without time zone null;', table_record.table_name);
    EXECUTE alter_sql;
    
    -- Create index for last_login if it doesn't exist
    alter_sql := format('CREATE INDEX IF NOT EXISTS idx_%I_last_login ON public.%I USING btree (last_login) TABLESPACE pg_default;', table_record.table_name, table_record.table_name);
    EXECUTE alter_sql;
    
    RAISE NOTICE 'Updated table: %', table_record.table_name;
  END LOOP;
END;
$$;

-- Execute the function to update all existing staff tables
SELECT add_last_login_to_staff_tables();

-- =====================================================
-- STEP 2: UPDATE STAFF TABLE CREATION FUNCTION
-- =====================================================

-- Update the create_agency_staff_table function to include last_login column
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
  -- Create table SQL with last_login column
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
      last_login timestamp without time zone null,
      constraint %I_pkey primary key (id),
      constraint %I_email_key unique (email)
    ) TABLESPACE pg_default;
  ', table_name_param, table_name_param, table_name_param);

  -- Execute table creation
  EXECUTE create_sql;

  -- Create indexes SQL including last_login index
  index_sql := format('
    CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON public.%I USING btree (agency_name) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_role ON public.%I USING btree (role) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_department ON public.%I USING btree (department) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_status ON public.%I USING btree (status) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_email ON public.%I USING btree (email) TABLESPACE pg_default;
    CREATE INDEX IF NOT EXISTS idx_%I_last_login ON public.%I USING btree (last_login) TABLESPACE pg_default;
  ', table_name_param, table_name_param, table_name_param, table_name_param,
     table_name_param, table_name_param, table_name_param, table_name_param,
     table_name_param, table_name_param, table_name_param, table_name_param);

  -- Execute index creation
  EXECUTE index_sql;

  RETURN table_name_param;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION add_last_login_to_staff_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION create_agency_staff_table(text, text) TO authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- All staff tables now have the last_login column and the function has been updated
-- for future table creation. The last_login column will track when staff members
-- last logged into their respective dashboards.
