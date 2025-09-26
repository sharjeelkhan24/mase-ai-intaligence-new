-- Remove status tracking columns if they exist
-- This script safely removes columns only if they exist

-- Function to safely drop columns
CREATE OR REPLACE FUNCTION safe_drop_column(table_name text, column_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = safe_drop_column.table_name 
    AND column_name = safe_drop_column.column_name
  ) THEN
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS %I', table_name, column_name);
    RAISE NOTICE 'Dropped column % from table %', column_name, table_name;
  ELSE
    RAISE NOTICE 'Column % does not exist in table %', column_name, table_name;
  END IF;
END;
$$;

-- Remove status tracking columns from all agency-specific tables
DO $$
DECLARE
  table_record RECORD;
BEGIN
  -- Loop through all patients tables
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'patients_%'
  LOOP
    PERFORM safe_drop_column(table_record.table_name, 'status');
    PERFORM safe_drop_column(table_record.table_name, 'last_offline');
    PERFORM safe_drop_column(table_record.table_name, 'last_activity');
    PERFORM safe_drop_column(table_record.table_name, 'heartbeat');
    PERFORM safe_drop_column(table_record.table_name, 'online_status');
  END LOOP;
  
  -- Loop through all staff tables
  FOR table_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'staff_%'
  LOOP
    PERFORM safe_drop_column(table_record.table_name, 'status');
    PERFORM safe_drop_column(table_record.table_name, 'last_offline');
    PERFORM safe_drop_column(table_record.table_name, 'last_activity');
    PERFORM safe_drop_column(table_record.table_name, 'heartbeat');
    PERFORM safe_drop_column(table_record.table_name, 'online_status');
  END LOOP;
END;
$$;

-- Clean up the function
DROP FUNCTION IF EXISTS safe_drop_column(text, text);

