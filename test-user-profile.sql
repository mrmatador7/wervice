-- Check current user's profile and permissions
-- Replace 'your-user-id-here' with your actual Supabase user ID

SELECT
    id,
    first_name,
    last_name,
    email,
    user_type,
    user_status,
    onboarded,
    created_at
FROM profiles
WHERE id = 'your-user-id-here';

-- Or find your user by email
-- SELECT * FROM profiles WHERE email = 'your-email@example.com';

-- Check all user types in the system
SELECT user_type, COUNT(*) as count
FROM profiles
GROUP BY user_type;

-- Check if your user exists in auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email = 'your-email@example.com';
