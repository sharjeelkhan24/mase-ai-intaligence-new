-- Clean up inbox messages where patient is the recipient
-- This will remove any messages that shouldn't be in the patient's inbox

-- First, let's see what messages exist where the patient is the recipient
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

-- Delete messages where the patient is the recipient (these shouldn't exist)
-- Only run this if you see messages above that shouldn't be there
DELETE FROM inbox_metro_health_solutions_inc
WHERE recipient_id = 'a45737a0-6962-4ea6-9d13-32d4874afc99'  -- Patient ID from console logs
AND recipient_type = 'patient';

-- Verify the cleanup
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

-- Check what messages should be in the inbox (where staff are recipients)
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
WHERE recipient_type = 'staff'
ORDER BY created_at DESC;
