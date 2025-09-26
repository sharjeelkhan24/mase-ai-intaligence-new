-- Check what messages are in the inbox table
-- This will help us see if there are messages where the patient is the recipient

-- Check all messages in inbox table
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
ORDER BY created_at DESC;

-- Check if there are any messages where the patient is the recipient
-- Replace 'PATIENT_ID_HERE' with the actual patient ID from the console logs
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
WHERE recipient_id = 'a45737a0-6962-4ea6-9d13-32d4874afc99'  -- Patient ID from console logs
ORDER BY created_at DESC;

-- Check if there are any messages where the patient is the sender (these shouldn't be in inbox)
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
WHERE sender_id = 'a45737a0-6962-4ea6-9d13-32d4874afc99'  -- Patient ID from console logs
ORDER BY created_at DESC;

-- Count messages by recipient type
SELECT 
    recipient_type,
    COUNT(*) as message_count
FROM inbox_metro_health_solutions_inc
GROUP BY recipient_type;
