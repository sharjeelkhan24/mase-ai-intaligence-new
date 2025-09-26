-- Debug messaging tables
-- Run this to check if the messaging tables exist and have data

-- Check if messaging tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%inbox%' 
   OR table_name LIKE '%sent%' 
   OR table_name LIKE '%drafts%'
ORDER BY table_name;

-- Check agency table for messaging table names
SELECT 
    agency_name,
    inbox_table_name,
    sent_table_name,
    drafts_table_name
FROM agency;

-- Check if there are any messages in the tables (replace with your actual table names)
-- Example for Metro Health Solutions Inc:
SELECT 'inbox' as table_type, COUNT(*) as message_count FROM inbox_metro_health_solutions_inc
UNION ALL
SELECT 'sent' as table_type, COUNT(*) as message_count FROM sent_metro_health_solutions_inc
UNION ALL
SELECT 'drafts' as table_type, COUNT(*) as message_count FROM drafts_metro_health_solutions_inc;

-- Check the structure of inbox table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'inbox_metro_health_solutions_inc'
ORDER BY ordinal_position;

-- Check the structure of sent table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'sent_metro_health_solutions_inc'
ORDER BY ordinal_position;

-- Check recent messages in inbox (if any exist)
SELECT 
    id,
    recipient_id,
    recipient_type,
    sender_id,
    sender_type,
    subject,
    status,
    created_at
FROM inbox_metro_health_solutions_inc
ORDER BY created_at DESC
LIMIT 5;

-- Check recent messages in sent (if any exist)
SELECT 
    id,
    sender_id,
    sender_type,
    recipient_id,
    recipient_type,
    subject,
    status,
    sent_at
FROM sent_metro_health_solutions_inc
ORDER BY sent_at DESC
LIMIT 5;

