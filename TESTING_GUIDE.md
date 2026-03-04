# Quick Start Guide - Testing the Membership Flow

## 🚀 Setup Instructions

### 1. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- For NEW databases, use the CREATE TABLE statement from SUPABASE_SETUP.md

-- For EXISTING databases, run this migration:
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS membership_type TEXT CHECK (membership_type IN ('associate', 'honourary', 'regular')),
ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'pending_biodata' CHECK (membership_status IN ('pending_biodata', 'pending_verification', 'verified', 'pending_payment', 'active', 'inactive')),
ADD COLUMN IF NOT EXISTS membership_details JSONB,
ADD COLUMN IF NOT EXISTS membership_selected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS biodata_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS biodata_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verified_by UUID,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

-- Add foreign key for verified_by
ALTER TABLE profiles
ADD CONSTRAINT fk_verified_by
FOREIGN KEY (verified_by)
REFERENCES auth.users(id);
```

### 2. Start the Application

```bash
npm run dev
```

---

## 🧪 Testing the Complete Flow

### Test as a New User

#### Step 1: Sign Up

1. Navigate to `http://localhost:3000/auth/signup`
2. Fill in:
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Full Name: `John Doe`
3. Click "Sign Up"
4. **Expected:** Redirect to membership selection page

#### Step 2: Select Membership Type

**URL:** `/auth/select-membership`

Choose one membership type and fill out the form:

**Option A: Regular Member**

- Student ID: `STU123456`
- Year Group: `Third Year`
- Major: `Computer Science`
- Expected Graduation: `2026`
- Phone: `+1234567890`

**Option B: Associate Member**

- Organization: `Tech Corp`
- Position: `Software Engineer`
- Relationship: `Industry Partner`
- Contact Phone: `+1234567890`

**Option C: Honourary Member**

- Graduation Year: `2020`
- Achievements: `Founded student tech club`
- Current Occupation: `Senior Developer`
- Alumni ID: `ALM2020123` (optional)

5. Submit the form
6. **Expected:** Redirect to `/profile?biodata=true`

#### Step 3: Complete Biodata

**URL:** `/profile?biodata=true`

1. Fill out profile information:
   - Full Name: (pre-filled)
   - Bio: `Passionate about technology and community`
   - Year Group: Select appropriate year
   - Phone: Your phone number
   - Major: Your major/field

2. Click "Save Profile"
3. **Expected:**
   - Success message appears
   - Redirect to `/verification-pending`

#### Step 4: Verification Pending

**URL:** `/verification-pending`

You should see:

- ✅ Sign Up Complete
- ✅ Membership Type Selected
- ✅ Biodata Submitted
- ⏳ Admin Verification (pending)
- 🔒 Payment (locked)
- 🔒 Membership Activation (locked)

**Note:** Now you need admin approval to proceed.

---

### Test as Admin

#### Open Admin Panel

1. Navigate to `http://localhost:3000/admin/verify-members`
2. You should see the pending application

#### Verify the Application

1. Review the application details
2. Click "✓ Approve" button
3. **Expected:**
   - Success message
   - Application status changes to "Verified"

---

### Return to User Flow

#### Step 5: Payment

1. Go back to `/verification-pending`
2. Click "Check Status" button
3. **Expected:** Auto-redirect to `/payment`

**Payment Form:**

1. Cardholder Name: `John Doe` (pre-filled)
2. Card Number: `4242 4242 4242 4242` (for demo)
3. Expiry: `12/28`
4. CVC: `123`
5. Billing Address: `123 Main St, City, State 12345`
6. Check "Accept Terms"
7. Click "Pay $100.00" (or $50.00 for Associate)

8. **Expected:**
   - "Processing Payment..." message
   - Success message
   - Redirect to dashboard

#### Step 6: Access Dashboard

**URL:** `/dashboard`

You should now see:

- Welcome message with your name
- Membership card showing "Active" status
- Full access to all features
- Upload files
- Edit profile

---

## 🔍 Testing Different Scenarios

### Scenario 1: User Tries to Skip Steps

1. After signup, try to access `/dashboard` directly
2. **Expected:** Redirect to appropriate incomplete step

### Scenario 2: User Edits Profile During Verification

1. While in pending_verification status
2. Click "Edit Profile" from `/verification-pending`
3. Make changes and save
4. **Expected:** Changes saved, still in verification status

### Scenario 3: Payment Failure

1. Use a card number other than `4242 4242 4242 4242`
2. **Expected:** Error message: "Payment failed. Please use card 4242..."

### Scenario 4: Rejection

1. Admin clicks "✗ Reject" button
2. **Expected:** Status changes to Inactive
3. User cannot proceed with membership

---

## 🎯 Key URLs for Testing

| Page                 | URL                       | Status Required      |
| -------------------- | ------------------------- | -------------------- |
| Signup               | `/auth/signup`            | None (public)        |
| Login                | `/auth/login`             | None (public)        |
| Select Membership    | `/auth/select-membership` | Authenticated        |
| Complete Biodata     | `/profile?biodata=true`   | pending_biodata      |
| Verification Pending | `/verification-pending`   | pending_verification |
| Payment              | `/payment`                | verified             |
| Dashboard            | `/dashboard`              | active               |
| Profile              | `/profile`                | active               |
| Admin Verify         | `/admin/verify-members`   | authenticated        |

---

## 📊 Checking Database Status

Run this query in Supabase to check user status:

```sql
SELECT
  email,
  full_name,
  membership_type,
  membership_status,
  biodata_completed,
  payment_status,
  payment_amount,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🐛 Troubleshooting

### Issue: Stuck in a loop

**Solution:** Clear browser cookies and localStorage, or open in incognito

### Issue: Middleware not redirecting

**Solution:** Check browser console for errors, verify middleware files exist

### Issue: Admin page shows no applications

**Solution:**

- Ensure you've completed biodata submission
- Check database for `membership_type` not null
- Verify `biodata_completed` is true

### Issue: Payment page doesn't load

**Solution:**

- Check that status is "verified" in database
- Clear build cache: `npm run build`
- Restart dev server

---

## ✅ Success Indicators

### User Created Successfully

- Profile exists in `profiles` table
- `membership_type` is set
- `membership_status` is `pending_biodata`

### Biodata Completed

- `biodata_completed` = true
- `biodata_completed_at` timestamp exists
- `membership_status` = `pending_verification`

### Verification Approved

- `membership_status` = `verified`
- `verified_at` timestamp exists
- `verified_by` contains admin user ID

### Payment Completed

- `membership_status` = `active`
- `payment_status` = `paid`
- `payment_amount` matches membership fee
- `payment_date` timestamp exists

### Full Access Granted

- User can access `/dashboard`
- User can access `/uploads`
- User can edit `/profile`
- All features available

---

## 🔄 Resetting Test User

To test the flow again with the same account:

```sql
-- Reset a user to start of flow
UPDATE profiles
SET
  membership_type = NULL,
  membership_status = NULL,
  membership_details = NULL,
  biodata_completed = FALSE,
  biodata_completed_at = NULL,
  verified_at = NULL,
  verified_by = NULL,
  payment_status = 'unpaid',
  payment_amount = NULL,
  payment_date = NULL
WHERE email = 'test@example.com';
```

---

## 📈 Next Steps

After successful testing:

1. **Production Stripe Setup**
   - Create Stripe account
   - Get API keys
   - Implement real payment processing
   - Set up webhooks

2. **Email Notifications**
   - Set up email service (SendGrid, etc.)
   - Create email templates
   - Send at each status change

3. **Admin Dashboard**
   - Add analytics
   - Create reporting features
   - Implement bulk actions

4. **Documentation**
   - User guide
   - Admin manual
   - API documentation

---

**Happy Testing!** 🎉

For detailed flow documentation, see [MEMBERSHIP_FLOW.md](MEMBERSHIP_FLOW.md)
