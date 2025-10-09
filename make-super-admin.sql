-- Make a user a super_admin
-- Replace 'your-email@example.com' with your actual email

UPDATE profiles
SET user_type = 'super_admin',
    updated_at = NOW()
WHERE email = 'your-email@example.com';

-- Verify the update
SELECT id, email, user_type, updated_at
FROM profiles
WHERE email = 'your-email@example.com';

-- Alternative: Update by user ID if you know it
-- UPDATE profiles SET user_type = 'super_admin' WHERE id = 'user-uuid-here';
