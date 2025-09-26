-- Add read_at column to sent table to track when recipient reads the message
ALTER TABLE public.sent_metro_health_solutions_inc 
ADD COLUMN IF NOT EXISTS read_at timestamp without time zone null;

-- Create index for read_at column for better query performance
CREATE INDEX IF NOT EXISTS idx_sent_metro_health_solutions_inc_read_at 
ON public.sent_metro_health_solutions_inc USING btree (read_at) TABLESPACE pg_default;

-- Update existing records to set delivered_at to sent_at for already sent messages
UPDATE public.sent_metro_health_solutions_inc 
SET delivered_at = sent_at 
WHERE delivered_at IS NULL AND sent_at IS NOT NULL;

-- Also update any new messages to have delivered_at set when they are sent
-- This will be handled in the application code when sending messages
