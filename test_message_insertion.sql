-- Test message insertion
-- This script manually inserts a test message to verify the messaging system works

-- First, let's get some sample data
-- Get a patient ID
SELECT id, first_name, last_name, email 
FROM patients_metro_health_solutions_inc 
LIMIT 1;

-- Get a staff ID  
SELECT id, first_name, last_name, email, role
FROM staff_metro_health_solutions_inc 
LIMIT 1;

-- Insert a test message from patient to staff
-- Replace the UUIDs with actual IDs from the queries above
INSERT INTO sent_metro_health_solutions_inc (
    agency_name,
    sender_id,
    sender_type,
    recipient_id,
    recipient_type,
    subject,
    message_content,
    priority,
    status,
    sent_at
) VALUES (
    'Metro Health Solutions Inc',
    'PATIENT_ID_HERE', -- Replace with actual patient ID
    'patient',
    'STAFF_ID_HERE', -- Replace with actual staff ID
    'staff',
    'Test Message from Patient',
    'This is a test message to verify the messaging system is working correctly.',
    'medium',
    'sent',
    NOW()
);

-- Insert the same message into staff's inbox
INSERT INTO inbox_metro_health_solutions_inc (
    agency_name,
    recipient_id,
    recipient_type,
    sender_id,
    sender_type,
    subject,
    message_content,
    priority,
    status
) VALUES (
    'Metro Health Solutions Inc',
    'STAFF_ID_HERE', -- Replace with actual staff ID
    'staff',
    'PATIENT_ID_HERE', -- Replace with actual patient ID
    'patient',
    'Test Message from Patient',
    'This is a test message to verify the messaging system is working correctly.',
    'medium',
    'unread'
);

-- Check if the messages were inserted
SELECT 'sent' as table_type, COUNT(*) as count FROM sent_metro_health_solutions_inc
UNION ALL
SELECT 'inbox' as table_type, COUNT(*) as count FROM inbox_metro_health_solutions_inc;

