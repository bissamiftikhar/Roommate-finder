-- Test: Create a notification for admin
-- First, get the admin ID
SELECT admin_id, admin_email FROM admin LIMIT 1;

-- Insert a test notification (replace 'ADMIN_ID_HERE' with actual admin_id from above)
-- INSERT INTO notification (student_id, type, content, is_read)
-- VALUES ('ADMIN_ID_HERE', 'system', 'TEST: This is a test notification for admin', false);

-- Check if notification was created
-- SELECT * FROM notification WHERE student_id = 'ADMIN_ID_HERE' ORDER BY created_at DESC LIMIT 5;
