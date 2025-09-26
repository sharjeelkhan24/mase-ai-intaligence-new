-- Create messaging tables for each agency
-- This script modifies the agency trigger to create 5 tables instead of 2

-- First, let's see the current trigger function
-- SELECT prosrc FROM pg_proc WHERE proname = 'create_agency_tables_on_insert';

-- Drop the trigger first, then the function
DROP TRIGGER IF EXISTS trigger_create_agency_tables ON agency;
DROP FUNCTION IF EXISTS create_agency_tables_on_insert();

CREATE OR REPLACE FUNCTION create_agency_tables_on_insert()
RETURNS TRIGGER AS $$
DECLARE
    agency_name_clean TEXT;
    patients_table_name TEXT;
    staff_table_name TEXT;
    inbox_table_name TEXT;
    sent_table_name TEXT;
    drafts_table_name TEXT;
BEGIN
    -- Clean the agency name for table naming
    agency_name_clean := lower(replace(NEW.agency_name, ' ', '_'));
    
    -- Generate table names
    patients_table_name := 'patients_' || agency_name_clean;
    staff_table_name := 'staff_' || agency_name_clean;
    inbox_table_name := 'inbox_' || agency_name_clean;
    sent_table_name := 'sent_' || agency_name_clean;
    drafts_table_name := 'drafts_' || agency_name_clean;
    
    -- Update the agency record with table names
    UPDATE agency 
    SET 
        patients_table_name = patients_table_name,
        staff_table_name = staff_table_name,
        inbox_table_name = inbox_table_name,
        sent_table_name = sent_table_name,
        drafts_table_name = drafts_table_name
    WHERE id = NEW.id;
    
    -- Create patients table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            agency_name character varying(255) NOT NULL,
            first_name character varying(100) NOT NULL,
            last_name character varying(100) NOT NULL,
            email character varying(255) NOT NULL,
            phone character varying(20),
            date_of_birth date NOT NULL,
            address text,
            city character varying(100),
            state character varying(50),
            zip_code character varying(10),
            emergency_contact_name character varying(100) NOT NULL,
            emergency_contact_phone character varying(20) NOT NULL,
            medical_record_number character varying(100),
            primary_physician character varying(100) DEFAULT ''TBD'',
            primary_nurse character varying(100),
            admission_date date,
            discharge_date date,
            status character varying(20) DEFAULT ''active'',
            notes text,
            password_hash character varying(255) NOT NULL,
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now(),
            gender character varying(20),
            medical_conditions text,
            medications text,
            allergies text,
            profile_image text,
            last_login timestamp without time zone,
            last_logout timestamp without time zone,
            CONSTRAINT %I_pkey PRIMARY KEY (id),
            CONSTRAINT %I_email_key UNIQUE (email)
        )', patients_table_name, patients_table_name || '_pkey', patients_table_name || '_email_key');
    
    -- Create staff table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            agency_name character varying(255) NOT NULL,
            first_name character varying(100) NOT NULL,
            last_name character varying(100) NOT NULL,
            email character varying(255) NOT NULL,
            phone character varying(20),
            role character varying(50) NOT NULL,
            department character varying(100),
            hire_date date,
            salary numeric(10, 2),
            address text,
            city character varying(100),
            state character varying(50),
            zip_code character varying(10),
            emergency_contact_name character varying(100),
            emergency_contact_phone character varying(20),
            license_number character varying(100),
            license_expiry date,
            certifications text,
            notes text,
            password_hash character varying(255) NOT NULL,
            status character varying(20) DEFAULT ''active'',
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now(),
            profile_image text,
            last_login timestamp without time zone,
            last_logout timestamp without time zone,
            CONSTRAINT %I_pkey PRIMARY KEY (id),
            CONSTRAINT %I_email_key UNIQUE (email)
        )', staff_table_name, staff_table_name || '_pkey', staff_table_name || '_email_key');
    
    -- Create inbox table (messages received)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            agency_name character varying(255) NOT NULL,
            recipient_id uuid NOT NULL,
            recipient_type character varying(20) NOT NULL, -- ''staff'' or ''patient''
            sender_id uuid NOT NULL,
            sender_type character varying(20) NOT NULL, -- ''staff'' or ''patient''
            subject character varying(255) NOT NULL,
            message_content text NOT NULL,
            priority character varying(20) DEFAULT ''medium'', -- ''low'', ''medium'', ''high''
            status character varying(20) DEFAULT ''unread'', -- ''unread'', ''read'', ''archived''
            read_at timestamp without time zone,
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now(),
            CONSTRAINT %I_pkey PRIMARY KEY (id)
        )', inbox_table_name, inbox_table_name || '_pkey');
    
    -- Create sent table (messages sent)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            agency_name character varying(255) NOT NULL,
            sender_id uuid NOT NULL,
            sender_type character varying(20) NOT NULL, -- ''staff'' or ''patient''
            recipient_id uuid NOT NULL,
            recipient_type character varying(20) NOT NULL, -- ''staff'' or ''patient''
            subject character varying(255) NOT NULL,
            message_content text NOT NULL,
            priority character varying(20) DEFAULT ''medium'', -- ''low'', ''medium'', ''high''
            status character varying(20) DEFAULT ''sent'', -- ''sent'', ''delivered'', ''failed''
            sent_at timestamp without time zone DEFAULT now(),
            delivered_at timestamp without time zone,
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now(),
            CONSTRAINT %I_pkey PRIMARY KEY (id)
        )', sent_table_name, sent_table_name || '_pkey');
    
    -- Create drafts table (unfinished messages)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid NOT NULL DEFAULT gen_random_uuid(),
            agency_name character varying(255) NOT NULL,
            sender_id uuid NOT NULL,
            sender_type character varying(20) NOT NULL, -- ''staff'' or ''patient''
            recipient_id uuid,
            recipient_type character varying(20), -- ''staff'' or ''patient''
            subject character varying(255),
            message_content text,
            priority character varying(20) DEFAULT ''medium'', -- ''low'', ''medium'', ''high''
            status character varying(20) DEFAULT ''draft'', -- ''draft'', ''saved''
            last_saved_at timestamp without time zone DEFAULT now(),
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now(),
            CONSTRAINT %I_pkey PRIMARY KEY (id)
        )', drafts_table_name, drafts_table_name || '_pkey');
    
    -- Create indexes for better performance
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON %I USING btree (agency_name)', patients_table_name, patients_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', patients_table_name, patients_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON %I USING btree (email)', patients_table_name, patients_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_last_logout ON %I USING btree (last_logout)', patients_table_name, patients_table_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON %I USING btree (agency_name)', staff_table_name, staff_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_role ON %I USING btree (role)', staff_table_name, staff_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_department ON %I USING btree (department)', staff_table_name, staff_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', staff_table_name, staff_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON %I USING btree (email)', staff_table_name, staff_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_last_login ON %I USING btree (last_login)', staff_table_name, staff_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_last_logout ON %I USING btree (last_logout)', staff_table_name, staff_table_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_recipient ON %I USING btree (recipient_id, recipient_type)', inbox_table_name, inbox_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sender ON %I USING btree (sender_id, sender_type)', inbox_table_name, inbox_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', inbox_table_name, inbox_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_created_at ON %I USING btree (created_at)', inbox_table_name, inbox_table_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sender ON %I USING btree (sender_id, sender_type)', sent_table_name, sent_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_recipient ON %I USING btree (recipient_id, recipient_type)', sent_table_name, sent_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', sent_table_name, sent_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sent_at ON %I USING btree (sent_at)', sent_table_name, sent_table_name);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sender ON %I USING btree (sender_id, sender_type)', drafts_table_name, drafts_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', drafts_table_name, drafts_table_name);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_last_saved_at ON %I USING btree (last_saved_at)', drafts_table_name, drafts_table_name);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update the agency table to include the new table name columns
ALTER TABLE agency 
ADD COLUMN IF NOT EXISTS inbox_table_name character varying(100),
ADD COLUMN IF NOT EXISTS sent_table_name character varying(100),
ADD COLUMN IF NOT EXISTS drafts_table_name character varying(100);

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_agency_inbox_table_name ON agency USING btree (inbox_table_name);
CREATE INDEX IF NOT EXISTS idx_agency_sent_table_name ON agency USING btree (sent_table_name);
CREATE INDEX IF NOT EXISTS idx_agency_drafts_table_name ON agency USING btree (drafts_table_name);

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_create_agency_tables ON agency;
CREATE TRIGGER trigger_create_agency_tables
    BEFORE INSERT ON agency
    FOR EACH ROW
    EXECUTE FUNCTION create_agency_tables_on_insert();

-- For existing agencies, you can run this to create the missing tables:
-- UPDATE agency SET 
--     inbox_table_name = 'inbox_' || lower(replace(agency_name, ' ', '_')),
--     sent_table_name = 'sent_' || lower(replace(agency_name, ' ', '_')),
--     drafts_table_name = 'drafts_' || lower(replace(agency_name, ' ', '_'))
-- WHERE inbox_table_name IS NULL;

COMMENT ON TABLE agency IS 'Agency table that automatically creates 5 tables: patients, staff, inbox, sent, drafts';
COMMENT ON COLUMN agency.inbox_table_name IS 'Name of the inbox messages table for this agency';
COMMENT ON COLUMN agency.sent_table_name IS 'Name of the sent messages table for this agency';
COMMENT ON COLUMN agency.drafts_table_name IS 'Name of the drafts messages table for this agency';
