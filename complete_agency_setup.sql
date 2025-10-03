-- =====================================================
-- COMPLETE AGENCY SETUP - ALL TABLES AND TRIGGERS
-- =====================================================
-- This script creates the main agency table and all agency-specific tables
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. CREATE MAIN AGENCY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.agency (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agency_name character varying(255) NOT NULL,
  license_number character varying(100) NOT NULL,
  contact_name character varying(255) NOT NULL,
  email character varying(255) NOT NULL,
  phone_number character varying(20) NOT NULL,
  address text NOT NULL,
  city character varying(100) NOT NULL,
  state character varying(50) NOT NULL,
  zip_code character varying(20) NOT NULL,
  staff_count character varying(50) NULL DEFAULT '1-10'::character varying,
  patient_count character varying(50) NULL DEFAULT '1-50'::character varying,
  notes text NULL,
  password character varying(255) NOT NULL,
  patients_table_name character varying(100) NULL,
  staff_table_name character varying(100) NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  inbox_table_name character varying(100) NULL,
  sent_table_name character varying(100) NULL,
  drafts_table_name character varying(100) NULL,
  CONSTRAINT agency_pkey PRIMARY KEY (id),
  CONSTRAINT agency_email_key UNIQUE (email),
  CONSTRAINT agency_license_number_key UNIQUE (license_number)
) TABLESPACE pg_default;

-- Create indexes for agency table
CREATE INDEX IF NOT EXISTS idx_agency_email ON public.agency USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_agency_license_number ON public.agency USING btree (license_number) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_agency_patients_table_name ON public.agency USING btree (patients_table_name) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_agency_staff_table_name ON public.agency USING btree (staff_table_name) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_agency_inbox_table_name ON public.agency USING btree (inbox_table_name) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_agency_sent_table_name ON public.agency USING btree (sent_table_name) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_agency_drafts_table_name ON public.agency USING btree (drafts_table_name) TABLESPACE pg_default;

-- =====================================================
-- 2. CREATE AGENCY-SPECIFIC TABLES FUNCTION
-- =====================================================

-- Drop the trigger first, then the function, then recreate both
DROP TRIGGER IF EXISTS trigger_create_agency_tables ON agency CASCADE;
DROP FUNCTION IF EXISTS create_agency_tables_on_insert() CASCADE;

CREATE OR REPLACE FUNCTION create_agency_tables_on_insert()
RETURNS TRIGGER AS $$
DECLARE
    agency_name_clean TEXT;
    patients_table_var TEXT;
    staff_table_var TEXT;
    inbox_table_var TEXT;
    sent_table_var TEXT;
    drafts_table_var TEXT;
    -- New patient record table names
    visits_table_var TEXT;
    vitals_table_var TEXT;
    medications_table_var TEXT;
    documents_table_var TEXT;
    tasks_table_var TEXT;
    medical_history_table_var TEXT;
    enrollments_table_var TEXT;
    audit_log_table_var TEXT;
    -- Subscription table name
    subscription_table_var TEXT;
BEGIN
    -- Clean the agency name for table naming
    agency_name_clean := lower(replace(NEW.agency_name, ' ', '_'));
    
    -- Generate table names
    patients_table_var := 'patients_' || agency_name_clean;
    staff_table_var := 'staff_' || agency_name_clean;
    inbox_table_var := 'inbox_' || agency_name_clean;
    sent_table_var := 'sent_' || agency_name_clean;
    drafts_table_var := 'drafts_' || agency_name_clean;
    -- New patient record table names
    visits_table_var := 'patient_visits_' || agency_name_clean;
    vitals_table_var := 'patient_vitals_' || agency_name_clean;
    medications_table_var := 'patient_medications_' || agency_name_clean;
    documents_table_var := 'patient_documents_' || agency_name_clean;
    tasks_table_var := 'patient_tasks_' || agency_name_clean;
    medical_history_table_var := 'patient_medical_history_' || agency_name_clean;
    enrollments_table_var := 'patient_enrollments_' || agency_name_clean;
    audit_log_table_var := 'patient_audit_log_' || agency_name_clean;
    -- Subscription table name
    subscription_table_var := 'subscription_' || agency_name_clean;
    
    -- Update the agency record with table names
    UPDATE agency 
    SET 
        patients_table_name = patients_table_var,
        staff_table_name = staff_table_var,
        inbox_table_name = inbox_table_var,
        sent_table_name = sent_table_var,
        drafts_table_name = drafts_table_var
    WHERE id = NEW.id;
    
    -- Create the agency-specific subscription table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_id uuid REFERENCES agency(id) ON DELETE CASCADE,
            agency_name varchar(255) NOT NULL,
            subscription_type varchar(50) NOT NULL CHECK (
                subscription_type IN (
                    ''HR Management'', 
                    ''Quality Assurance'', 
                    ''Billing Suite'', 
                    ''Analytics Pro''
                )
            ),
            total_price numeric(10,2) NOT NULL,
            status varchar(20) DEFAULT ''trial'' CHECK (status IN (''trial'', ''active'', ''expired'', ''cancelled'')),
            start_period timestamp with time zone NOT NULL,
            end_period timestamp with time zone NOT NULL,
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now(),
            CONSTRAINT unique_agency_subscription UNIQUE(agency_id, subscription_type)
        )', subscription_table_var);
    
    -- Create patients table (existing)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_name varchar(255) NOT NULL,
            first_name varchar(100) NOT NULL,
            last_name varchar(100) NOT NULL,
            email varchar(255) NOT NULL UNIQUE,
            phone varchar(20),
            date_of_birth date NOT NULL,
            gender varchar(20),
            address text,
            city varchar(100),
            state varchar(50),
            zip_code varchar(10),
            emergency_contact_name varchar(100) NOT NULL,
            emergency_contact_phone varchar(20) NOT NULL,
            medical_record_number varchar(100),
            primary_physician varchar(100) DEFAULT ''TBD'',
            primary_nurse varchar(100),
            admission_date date,
            discharge_date date,
            status varchar(20) DEFAULT ''active'',
            notes text,
            password_hash varchar(255) NOT NULL,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            last_login timestamp,
            -- New fields for comprehensive patient records
            visit_type varchar(50),
            reason_for_visit text,
            acuity_risk_level varchar(20),
            pcp_name varchar(100),
            pcp_contact varchar(50),
            insurance_provider varchar(100),
            insurance_number varchar(50),
            emergency_contact_relationship varchar(50),
            preferred_language varchar(50),
            communication_preferences text,
            mobility_status varchar(50),
            cognitive_status varchar(50),
            last_updated_by varchar(100),
            last_updated_at timestamp DEFAULT now()
        )', patients_table_var);
    
    -- Create staff table (existing)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_name varchar(255) NOT NULL,
            first_name varchar(100) NOT NULL,
            last_name varchar(100) NOT NULL,
            email varchar(255) NOT NULL UNIQUE,
            phone varchar(20),
            role varchar(50) NOT NULL,
            department varchar(100),
            hire_date date,
            salary numeric(10,2),
            address text,
            city varchar(100),
            state varchar(50),
            zip_code varchar(10),
            emergency_contact_name varchar(100),
            emergency_contact_phone varchar(20),
            license_number varchar(100),
            license_expiry date,
            certifications text,
            notes text,
            password_hash varchar(255) NOT NULL,
            status varchar(20) DEFAULT ''active'',
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now(),
            profile_image text,
            last_login timestamp,
            last_logout timestamp
        )', staff_table_var);
    
    -- Create messaging tables (existing)
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_name varchar(255) NOT NULL,
            sender_id uuid NOT NULL,
            sender_name varchar(100) NOT NULL,
            sender_role varchar(50) NOT NULL,
            recipient_id uuid,
            recipient_name varchar(100),
            recipient_role varchar(50),
            subject varchar(255),
            message text NOT NULL,
            is_read boolean DEFAULT false,
            read_at timestamp,
            created_at timestamp DEFAULT now()
        )', inbox_table_var);
    
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_name varchar(255) NOT NULL,
            sender_id uuid NOT NULL,
            sender_name varchar(100) NOT NULL,
            sender_role varchar(50) NOT NULL,
            recipient_id uuid,
            recipient_name varchar(100),
            recipient_role varchar(50),
            subject varchar(255),
            message text NOT NULL,
            sent_at timestamp DEFAULT now()
        )', sent_table_var);
    
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            agency_name varchar(255) NOT NULL,
            sender_id uuid NOT NULL,
            sender_name varchar(100) NOT NULL,
            sender_role varchar(50) NOT NULL,
            recipient_id uuid,
            recipient_name varchar(100),
            recipient_role varchar(50),
            subject varchar(255),
            message text NOT NULL,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now()
        )', drafts_table_var);
    
    -- =====================================================
    -- NEW PATIENT RECORD TABLES
    -- =====================================================
    
    -- Create patient visits table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            visit_date timestamp NOT NULL,
            visit_type varchar(50) NOT NULL,
            reason_for_visit text,
            scheduled_time timestamp,
            actual_start_time timestamp,
            actual_end_time timestamp,
            provider_id uuid,
            provider_name varchar(100),
            visit_status varchar(20) DEFAULT ''scheduled'',
            discharge_date timestamp,
            discharge_status varchar(50),
            notes text,
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now()
        )', visits_table_var, patients_table_var);
    
    -- Create patient vitals table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            visit_id uuid REFERENCES %I(id) ON DELETE SET NULL,
            recorded_at timestamp NOT NULL,
            recorded_by uuid,
            
            -- Vital Signs
            blood_pressure_systolic integer,
            blood_pressure_diastolic integer,
            heart_rate integer,
            temperature decimal(4,1),
            respiratory_rate integer,
            oxygen_saturation decimal(5,2),
            blood_glucose decimal(5,2),
            weight decimal(5,2),
            height decimal(5,2),
            bmi decimal(4,1),
            
            -- Additional Measurements
            pain_level integer CHECK (pain_level >= 0 AND pain_level <= 10),
            alertness_level varchar(50),
            mobility_assessment varchar(100),
            
            notes text,
            created_at timestamp DEFAULT now()
        )', vitals_table_var, patients_table_var, visits_table_var);
    
    -- Create patient medications table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            visit_id uuid REFERENCES %I(id) ON DELETE SET NULL,
            
            -- Medication Details
            medication_name varchar(200) NOT NULL,
            generic_name varchar(200),
            dosage varchar(100),
            frequency varchar(100),
            route varchar(50),
            strength varchar(50),
            quantity integer,
            refills_remaining integer DEFAULT 0,
            
            -- Prescription Info
            prescribed_by uuid,
            prescribed_date timestamp,
            start_date date,
            end_date date,
            is_active boolean DEFAULT true,
            is_prn boolean DEFAULT false,
            
            -- Instructions
            instructions text,
            side_effects text,
            contraindications text,
            
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now()
        )', medications_table_var, patients_table_var, visits_table_var);
    
    -- Create patient documents table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            visit_id uuid REFERENCES %I(id) ON DELETE SET NULL,
            
            -- Document Info
            document_name varchar(200) NOT NULL,
            document_type varchar(100),
            file_path text,
            file_size integer,
            mime_type varchar(100),
            
            -- Metadata
            uploaded_by uuid,
            uploaded_at timestamp DEFAULT now(),
            document_date date,
            is_confidential boolean DEFAULT false,
            requires_signature boolean DEFAULT false,
            signed_at timestamp,
            signed_by varchar(100),
            
            -- Content
            content text,
            tags text[],
            notes text
        )', documents_table_var, patients_table_var, visits_table_var);
    
    -- Create patient tasks table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            visit_id uuid REFERENCES %I(id) ON DELETE SET NULL,
            
            -- Task Details
            task_title varchar(200) NOT NULL,
            task_description text,
            task_type varchar(100),
            priority varchar(20) DEFAULT ''medium'',
            
            -- Scheduling
            assigned_to uuid,
            assigned_by uuid,
            due_date timestamp,
            completed_at timestamp,
            is_completed boolean DEFAULT false,
            
            -- Status
            status varchar(50) DEFAULT ''open'',
            completion_notes text,
            
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now()
        )', tasks_table_var, patients_table_var, visits_table_var);
    
    -- Create patient medical history table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            
            -- History Categories
            history_type varchar(100) NOT NULL,
            category varchar(100),
            
            -- Details
            condition_name varchar(200),
            description text,
            severity varchar(50),
            onset_date date,
            resolution_date date,
            is_active boolean DEFAULT true,
            
            -- Documentation
            diagnosed_by varchar(100),
            diagnosis_date date,
            icd10_code varchar(20),
            notes text,
            
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now()
        )', medical_history_table_var, patients_table_var);
    
    -- Create patient enrollments table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            
            -- Program Details
            program_name varchar(200) NOT NULL,
            program_type varchar(100),
            enrollment_date date NOT NULL,
            end_date date,
            status varchar(50) DEFAULT ''active'',
            
            -- Program Info
            program_description text,
            goals text,
            progress_notes text,
            coordinator_id uuid,
            
            created_at timestamp DEFAULT now(),
            updated_at timestamp DEFAULT now()
        )', enrollments_table_var, patients_table_var);
    
    -- Create patient audit log table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            patient_id uuid REFERENCES %I(id) ON DELETE CASCADE,
            
            -- Action Details
            action_type varchar(100) NOT NULL,
            table_name varchar(100),
            record_id uuid,
            
            -- User Info
            user_id uuid,
            user_name varchar(100),
            user_role varchar(50),
            
            -- Changes
            old_values jsonb,
            new_values jsonb,
            changes_summary text,
            
            -- Metadata
            ip_address inet,
            user_agent text,
            timestamp timestamp DEFAULT now()
        )', audit_log_table_var, patients_table_var);
    
    -- =====================================================
    -- CREATE INDEXES FOR PERFORMANCE
    -- =====================================================
    
    -- Patients table indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON %I(agency_name)', patients_table_var, patients_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON %I(email)', patients_table_var, patients_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I(status)', patients_table_var, patients_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_created_at ON %I(created_at)', patients_table_var, patients_table_var);
    
    -- Subscription table indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_id ON %I(agency_id)', subscription_table_var, subscription_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I(status)', subscription_table_var, subscription_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_start_period ON %I(start_period)', subscription_table_var, subscription_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_end_period ON %I(end_period)', subscription_table_var, subscription_table_var);
    
    -- Staff table indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_agency_name ON %I(agency_name)', staff_table_var, staff_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_email ON %I(email)', staff_table_var, staff_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_role ON %I(role)', staff_table_var, staff_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I(status)', staff_table_var, staff_table_var);
    
    -- Messaging table indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_recipient_id ON %I(recipient_id)', inbox_table_var, inbox_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sender_id ON %I(sender_id)', sent_table_var, sent_table_var);
    
    -- Patient record table indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', visits_table_var, visits_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_visit_date ON %I(visit_date)', visits_table_var, visits_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I(visit_status)', visits_table_var, visits_table_var);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', vitals_table_var, vitals_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_recorded_at ON %I(recorded_at)', vitals_table_var, vitals_table_var);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', medications_table_var, medications_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_is_active ON %I(is_active)', medications_table_var, medications_table_var);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', documents_table_var, documents_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_document_type ON %I(document_type)', documents_table_var, documents_table_var);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', tasks_table_var, tasks_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I(status)', tasks_table_var, tasks_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_due_date ON %I(due_date)', tasks_table_var, tasks_table_var);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', medical_history_table_var, medical_history_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_history_type ON %I(history_type)', medical_history_table_var, medical_history_table_var);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', enrollments_table_var, enrollments_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I(status)', enrollments_table_var, enrollments_table_var);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON %I(patient_id)', audit_log_table_var, audit_log_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_user_id ON %I(user_id)', audit_log_table_var, audit_log_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_timestamp ON %I(timestamp)', audit_log_table_var, audit_log_table_var);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_action_type ON %I(action_type)', audit_log_table_var, audit_log_table_var);
    
    -- =====================================================
    -- ENABLE ROW LEVEL SECURITY (RLS)
    -- =====================================================
    
    -- Enable RLS on all tables
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', patients_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', staff_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', inbox_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', sent_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', drafts_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', subscription_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', visits_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', vitals_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', medications_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', documents_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tasks_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', medical_history_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', enrollments_table_var);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', audit_log_table_var);
    
    -- Create RLS policies (basic agency-based access)
    EXECUTE format('CREATE POLICY "Agency can manage their patients" ON %I FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage their staff" ON %I FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', staff_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage their messages" ON %I FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', inbox_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage their messages" ON %I FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', sent_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage their messages" ON %I FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', drafts_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage their subscriptions" ON %I FOR ALL USING (agency_name = current_setting(''app.current_agency'', true))', subscription_table_var);
    
    -- Patient record RLS policies
    EXECUTE format('CREATE POLICY "Agency can manage patient visits" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', visits_table_var, patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage patient vitals" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', vitals_table_var, patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage patient medications" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', medications_table_var, patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage patient documents" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', documents_table_var, patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage patient tasks" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', tasks_table_var, patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage patient history" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', medical_history_table_var, patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can manage patient enrollments" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', enrollments_table_var, patients_table_var);
    EXECUTE format('CREATE POLICY "Agency can view audit logs" ON %I FOR ALL USING (patient_id IN (SELECT id FROM %I WHERE agency_name = current_setting(''app.current_agency'', true)))', audit_log_table_var, patients_table_var);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. CREATE THE TRIGGER
-- =====================================================

CREATE TRIGGER trigger_create_agency_tables 
    BEFORE INSERT ON agency 
    FOR EACH ROW 
    EXECUTE FUNCTION create_agency_tables_on_insert();

-- =====================================================
-- 4. GRANT PERMISSIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION create_agency_tables_on_insert() TO authenticated;
GRANT EXECUTE ON FUNCTION create_agency_tables_on_insert() TO service_role;

-- =====================================================
-- 5. TEST THE SETUP
-- =====================================================

-- Uncomment the lines below to test the setup with a sample agency

INSERT INTO agency (
  agency_name, license_number, contact_name, email, phone_number,
  address, city, state, zip_code, password
) VALUES (
  'Test Healthcare Agency', 'TEST123', 'John Doe', 'test@healthcare.com',
  '555-0123', '123 Test St', 'Test City', 'TS', '12345', 'dGVzdHBhc3N3b3Jk'
);

-- Add subscriptions for the test agency (needed for AdminNavbar)
-- Note: The subscription table will be created automatically by the trigger
-- We need to insert into the dynamically created table
DO $$
DECLARE
    agency_id_val uuid;
    agency_name_val varchar(255);
    subscription_table_name varchar(255);
BEGIN
    -- Get the agency data
    SELECT id, agency_name INTO agency_id_val, agency_name_val
    FROM agency 
    WHERE email = 'test@healthcare.com';
    
    -- Generate the subscription table name (same logic as in the trigger)
    subscription_table_name := 'subscription_' || lower(replace(agency_name_val, ' ', '_'));
    
    -- Insert subscriptions into the agency-specific table
    EXECUTE format('
        INSERT INTO %I (agency_id, agency_name, subscription_type, total_price, status, start_period, end_period)
        SELECT 
            $1, 
            $2, 
            subscription_type, 
            price, 
            ''trial'',
            NOW(),
            NOW() + INTERVAL ''30 days''
        FROM (VALUES 
            (''HR Management'', 2500.00),
            (''Quality Assurance'', 2200.00),
            (''Billing Suite'', 1500.00),
            (''Analytics Pro'', 1800.00)
        ) AS subs(subscription_type, price)',
        subscription_table_name
    ) USING agency_id_val, agency_name_val;
    
    RAISE NOTICE 'Inserted subscriptions into table: %', subscription_table_name;
END $$;

-- Check that all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%test_healthcare_agency%'
ORDER BY table_name;

-- Check that subscriptions were created (using dynamic table name)
DO $$
DECLARE
    subscription_table_name varchar(255);
BEGIN
    -- Generate the subscription table name
    subscription_table_name := 'subscription_test_healthcare_agency';
    
    -- Check subscriptions
    EXECUTE format('
        SELECT 
            agency_name,
            subscription_type,
            status,
            total_price
        FROM %I
        ORDER BY subscription_type',
        subscription_table_name
    );
END $$;

