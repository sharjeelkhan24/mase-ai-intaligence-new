-- Update existing agency to add messaging tables
-- This script updates your existing agency and creates the missing messaging tables

-- First, let's see what agencies exist
SELECT agency_name, patients_table_name, staff_table_name, inbox_table_name, sent_table_name, drafts_table_name 
FROM agency;

-- Update the existing agency with messaging table names
UPDATE agency 
SET 
    inbox_table_name = 'inbox_' || lower(replace(agency_name, ' ', '_')),
    sent_table_name = 'sent_' || lower(replace(agency_name, ' ', '_')),
    drafts_table_name = 'drafts_' || lower(replace(agency_name, ' ', '_'))
WHERE inbox_table_name IS NULL;

-- Verify the update
SELECT agency_name, patients_table_name, staff_table_name, inbox_table_name, sent_table_name, drafts_table_name 
FROM agency;

-- Now create the messaging tables for existing agencies
DO $$
DECLARE
    agency_record RECORD;
    inbox_table_name TEXT;
    sent_table_name TEXT;
    drafts_table_name TEXT;
BEGIN
    -- Loop through all agencies that have NULL messaging table names
    FOR agency_record IN 
        SELECT a.agency_name, a.inbox_table_name, a.sent_table_name, a.drafts_table_name
        FROM agency a
        WHERE a.inbox_table_name IS NOT NULL
    LOOP
        inbox_table_name := agency_record.inbox_table_name;
        sent_table_name := agency_record.sent_table_name;
        drafts_table_name := agency_record.drafts_table_name;
        
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
        
        -- Create indexes for inbox table
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_recipient ON %I USING btree (recipient_id, recipient_type)', inbox_table_name, inbox_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sender ON %I USING btree (sender_id, sender_type)', inbox_table_name, inbox_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', inbox_table_name, inbox_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_created_at ON %I USING btree (created_at)', inbox_table_name, inbox_table_name);
        
        -- Create indexes for sent table
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sender ON %I USING btree (sender_id, sender_type)', sent_table_name, sent_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_recipient ON %I USING btree (recipient_id, recipient_type)', sent_table_name, sent_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', sent_table_name, sent_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sent_at ON %I USING btree (sent_at)', sent_table_name, sent_table_name);
        
        -- Create indexes for drafts table
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_sender ON %I USING btree (sender_id, sender_type)', drafts_table_name, drafts_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_status ON %I USING btree (status)', drafts_table_name, drafts_table_name);
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_last_saved_at ON %I USING btree (last_saved_at)', drafts_table_name, drafts_table_name);
        
        RAISE NOTICE 'Created messaging tables for agency: %', agency_record.agency_name;
    END LOOP;
END $$;

-- Verify the tables were created
SELECT 
    agency_name,
    inbox_table_name,
    sent_table_name,
    drafts_table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = inbox_table_name) 
        THEN 'EXISTS' ELSE 'MISSING' END as inbox_table_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = sent_table_name) 
        THEN 'EXISTS' ELSE 'MISSING' END as sent_table_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = drafts_table_name) 
        THEN 'EXISTS' ELSE 'MISSING' END as drafts_table_status
FROM agency;

-- Show table structure for verification
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name LIKE '%inbox%' OR table_name LIKE '%sent%' OR table_name LIKE '%drafts%'
ORDER BY table_name;

COMMENT ON TABLE agency IS 'Agency table that automatically creates 5 tables: patients, staff, inbox, sent, drafts';
COMMENT ON COLUMN agency.inbox_table_name IS 'Name of the inbox messages table for this agency';
COMMENT ON COLUMN agency.sent_table_name IS 'Name of the sent messages table for this agency';
COMMENT ON COLUMN agency.drafts_table_name IS 'Name of the drafts messages table for this agency';
