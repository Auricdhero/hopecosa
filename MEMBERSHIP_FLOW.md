# Membership Flow Documentation

## Complete Membership Registration & Activation Flow

This document outlines the complete user journey from signup to active membership with payment integration.

---

## 📋 Flow Overview

```
1. Sign Up
   ↓
2. Select Membership Type (Associate, Honourary, or Regular)
   ↓
3. Complete Biodata/Profile
   ↓
4. Wait for Admin Verification
   ↓
5. Payment via Stripe (after verification)
   ↓
6. Membership Activated
```

---

## 🔄 Detailed Flow Steps

### Step 1: Sign Up

**Page:** `/auth/signup`

- User creates account with email and password
- Profile entry is created with basic information
- **Status:** New user profile created
- **Redirect:** Automatically to Step 2

### Step 2: Select Membership Type

**Page:** `/auth/select-membership`
**Status:** `pending_biodata`

User chooses one of three membership types:

#### **Associate Member**

Required fields:

- Organization/Institution
- Position/Title
- Relationship to Association
- Contact Phone

#### **Honourary Member**

Required fields:

- Graduation Year
- Notable Achievements/Contributions
- Current Occupation
- Alumni ID (optional)

#### **Regular Member**

Required fields:

- Student ID
- Year Group
- Major/Program
- Expected Graduation Year
- Phone Number

**Redirect:** To Step 3 (Profile/Biodata completion)

### Step 3: Complete Biodata

**Page:** `/profile?biodata=true`
**Status:** Changes from `pending_biodata` to `pending_verification`

User fills out personal information:

- Full Name
- Bio
- Year Group
- Phone
- Major
- Additional profile details

After submission:

- `biodata_completed` flag set to `true`
- `biodata_completed_at` timestamp recorded
- Status updated to `pending_verification`

**Redirect:** To Step 4 (Verification Pending page)

### Step 4: Wait for Verification

**Page:** `/verification-pending`
**Status:** `pending_verification`

User sees:

- Progress indicator showing completed steps
- Current status: "Waiting for admin approval"
- Information about what happens next
- Options to check status or edit profile

**Admin Action Required:** Admin must approve the application via `/admin/verify-members`

When admin approves:

- Status changes to `verified`
- `verified_at` timestamp recorded
- `verified_by` admin ID recorded
- User can now proceed to payment

**Redirect:** Automatic to Step 5 when verified (user checks status)

### Step 5: Payment

**Page:** `/payment`
**Status:** `verified` or `pending_payment`

#### Membership Fees

- **Associate Member:** $50.00
- **Honourary Member:** $0.00 (Free)
- **Regular Member:** $100.00

#### Payment Interface

User enters:

- Cardholder Name
- Card Number
- Expiry Date
- CVC
- Billing Address
- Accept Terms & Conditions

#### Payment Processing

- Integrates with Stripe payment gateway
- For demo: Use card `4242 4242 4242 4242`
- Real implementation requires Stripe API keys

On successful payment:

- Status changes to `active`
- `payment_status` set to `paid`
- `payment_amount` recorded
- `payment_date` timestamp recorded
- `stripe_payment_intent_id` stored

**Redirect:** To Dashboard (Step 6)

### Step 6: Active Membership

**Page:** `/dashboard`
**Status:** `active`

User now has full access to:

- Dashboard
- Profile management
- File uploads
- All member features

---

## 🔐 Membership Status States

| Status                 | Description                                           | User Can Access                    |
| ---------------------- | ----------------------------------------------------- | ---------------------------------- |
| `pending_biodata`      | Membership type selected, awaiting profile completion | Select Membership, Profile         |
| `pending_verification` | Biodata submitted, awaiting admin approval            | Verification Pending page, Profile |
| `verified`             | Approved by admin, awaiting payment                   | Payment page, Verification page    |
| `pending_payment`      | Same as verified (alternative naming)                 | Payment page                       |
| `active`               | Payment completed, full membership                    | All features                       |
| `inactive`             | Rejected or suspended                                 | Limited access                     |

---

## 🛡️ Middleware Protection

### `auth.ts`

- Ensures user is logged in
- Redirects to `/auth/login` if not authenticated

### `membership.ts`

- Checks membership completion status
- Enforces the flow sequence
- Redirects users to appropriate step based on status

**Flow enforcement:**

```javascript
No membership type → /auth/select-membership
pending_biodata → /profile?biodata=true
pending_verification → /verification-pending
verified/pending_payment → /payment
active → Full access
```

---

## 👨‍💼 Admin Verification System

### Admin Page

**Path:** `/admin/verify-members`

Features:

- View all membership applications
- Filter by status (Pending, Verified, Active, All)
- See applicant details and membership-specific information
- Approve or reject applications
- Track verification history

### Approval Process

1. Admin reviews application details
2. Clicks "Approve" button
3. System updates:
   - Status: `pending_verification` → `verified`
   - Records verification timestamp
   - Records admin ID who approved
4. User receives notification (implementation pending)
5. User can now proceed to payment

### Rejection

- Sets status to `inactive`
- User cannot proceed with membership
- May need to reapply

---

## 💳 Payment Integration

### Current Implementation (Demo)

- Mock payment interface
- Test card: `4242 4242 4242 4242`
- Simulates Stripe payment flow

### Production Implementation Required

#### Backend Setup

1. Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

2. Add environment variables

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
```

3. Create API endpoints:
   - `POST /api/create-payment-intent` - Create payment intent
   - `POST /api/confirm-payment` - Confirm payment success
   - `POST /api/webhook` - Handle Stripe webhooks

#### Frontend Updates

1. Import Stripe Elements
2. Replace mock payment form with Stripe Elements
3. Handle 3D Secure authentication
4. Process payment confirmations

---

## 🗄️ Database Schema Updates

### New Fields Added to `profiles` Table

```sql
membership_type TEXT -- 'associate', 'honourary', 'regular'
membership_status TEXT DEFAULT 'pending_biodata'
  -- States: pending_biodata, pending_verification, verified, pending_payment, active, inactive
membership_details JSONB -- Stores membership-specific form data
membership_selected_at TIMESTAMPTZ

biodata_completed BOOLEAN DEFAULT FALSE
biodata_completed_at TIMESTAMPTZ

verified_at TIMESTAMPTZ
verified_by UUID -- References admin who verified

payment_status TEXT DEFAULT 'unpaid' -- 'unpaid', 'paid', 'failed', 'refunded'
payment_amount DECIMAL(10, 2)
payment_date TIMESTAMPTZ
stripe_customer_id TEXT
stripe_payment_intent_id TEXT
```

### Migration SQL

For existing databases, run:

```sql
ALTER TABLE profiles
ADD COLUMN membership_type TEXT CHECK (membership_type IN ('associate', 'honourary', 'regular')),
ADD COLUMN membership_status TEXT DEFAULT 'pending_biodata' CHECK (membership_status IN ('pending_biodata', 'pending_verification', 'verified', 'pending_payment', 'active', 'inactive')),
ADD COLUMN membership_details JSONB,
ADD COLUMN membership_selected_at TIMESTAMPTZ,
ADD COLUMN biodata_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN biodata_completed_at TIMESTAMPTZ,
ADD COLUMN verified_at TIMESTAMPTZ,
ADD COLUMN verified_by UUID REFERENCES auth.users(id),
ADD COLUMN payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded')),
ADD COLUMN payment_amount DECIMAL(10, 2),
ADD COLUMN payment_date TIMESTAMPTZ,
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_payment_intent_id TEXT;
```

---

## 📱 User Experience Features

### Progress Tracking

- Visual progress indicators on verification pending page
- Status badges throughout the application
- Clear messaging about next steps

### Navigation Guards

- Users cannot skip steps
- Automatic redirection to correct step
- Prevents accessing features before completion

### Status Checking

- "Check Status" button on verification page
- Real-time status updates
- Email notifications (to be implemented)

---

## 🚀 Getting Started

### 1. Update Database

Run the migration SQL in your Supabase SQL editor (see SUPABASE_SETUP.md)

### 2. Test the Flow

1. Sign up a new user
2. Select a membership type
3. Complete biodata
4. Use admin panel to verify
5. Test payment with demo card
6. Verify dashboard access

### 3. Configure Stripe (Production)

1. Create Stripe account
2. Get API keys
3. Implement backend endpoints
4. Update payment page
5. Configure webhooks

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

- Signup conversion rate
- Membership type distribution
- Verification approval time
- Payment completion rate
- Drop-off points in the flow

### Admin Dashboard Suggestions

- Pending applications count
- Average verification time
- Payment success rate
- Active member count by type

---

## 🔮 Future Enhancements

1. **Email Notifications**
   - Application submitted
   - Verification approved/rejected
   - Payment received
   - Membership activated

2. **Automated Verification**
   - Auto-verify certain membership types
   - Integration with student database
   - Document upload for verification

3. **Recurring Payments**
   - Annual membership renewals
   - Subscription management
   - Auto-renewal options

4. **Member Portal**
   - Downloadable membership card
   - Member benefits dashboard
   - Event registration

5. **Analytics Dashboard**
   - Application metrics
   - Revenue tracking
   - Member engagement stats

---

## ❓ Troubleshooting

### User stuck at verification

- Check if profile has `pending_verification` status
- Ensure admin has access to verify-members page
- Verify database permissions

### Payment not processing

- Check Stripe configuration
- Verify API keys are correct
- Check browser console for errors
- Ensure webhook endpoints are configured

### Middleware loop

- Check middleware order in page definitions
- Verify status transitions are correct
- Clear browser cache and cookies

---

## 📞 Support

For issues or questions:

1. Check error logs in Supabase
2. Review middleware logic
3. Verify database schema matches documentation
4. Test with fresh user account

---

**Last Updated:** March 4, 2026
**Version:** 1.0.0
