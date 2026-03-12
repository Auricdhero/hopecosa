# Database CHECK Constraint Troubleshooting

## Error Message

```
new row for relation "profiles" violates check constraint "profiles_membership_status_check"
```

## What This Means

Your Supabase database's `profiles` table has a CHECK constraint that's rejecting the data being inserted. This could be because:

1. The constraint in your actual database differs from the code
2. The constraint wasn't properly created during setup
3. The constraint was modified after initial creation

## Steps to Fix

### 1. Verify Your Database Schema

Run the SQL queries in `VERIFY_DATABASE_SCHEMA.sql` in your Supabase SQL Editor:

- Go to Supabase Dashboard → SQL Editor
- Copy and paste the contents of `VERIFY_DATABASE_SCHEMA.sql`
- Run the queries one by one

This will show you:

- If the `profiles` table exists
- All columns and their types
- All CHECK constraints and their definitions

### 2. Check Console Logs

When you try to sign up or select a membership, open your browser's Developer Console (F12):

- Look for logs that say "Profile data to insert:" or "Creating profile with data:"
- Check what values are being sent: `membership_status` and `payment_status`
- Look for detailed error messages with error codes

### 3. Fix the Constraints (If Needed)

If the constraints don't match what's expected, uncomment and run the fix section in `VERIFY_DATABASE_SCHEMA.sql`:

```sql
-- Drop old constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_membership_status_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_payment_status_check;

-- Recreate correct constraints
ALTER TABLE profiles
ADD CONSTRAINT profiles_membership_status_check
CHECK (membership_status IN ('pending_biodata', 'pending_verification', 'verified', 'pending_payment', 'active', 'inactive'));

ALTER TABLE profiles
ADD CONSTRAINT profiles_payment_status_check
CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded'));
```

### 4. Expected Values

The code always inserts these values when creating a new profile:

- `membership_status`: `"pending_biodata"` ✅ (valid)
- `payment_status`: `"unpaid"` ✅ (valid)
- `email`: User's email or empty string
- `id`: User's UUID from auth

## Valid Values Reference

### membership_status (Required)

- `pending_biodata` - Initial state after signup
- `pending_verification` - Biodata submitted, awaiting admin review
- `verified` - Admin approved, ready for payment
- `pending_payment` - Verification complete, payment in progress
- `active` - Payment complete, full access
- `inactive` - Membership deactivated

### payment_status (Required)

- `unpaid` - No payment made yet
- `paid` - Payment successful
- `failed` - Payment attempted but failed
- `refunded` - Payment was refunded

## Still Having Issues?

Check the browser console for the detailed error output. The enhanced logging will show:

- Exact data being inserted
- Error code from Supabase
- Full error details in JSON format

This information will help identify if there's a typo, encoding issue, or database configuration problem.
