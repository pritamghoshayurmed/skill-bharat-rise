# Job Posting Flow - Test Guide

## Issues Fixed

### 1. Registration Authentication
- **Problem**: Registration page was not actually creating user accounts
- **Fix**: Updated `src/pages/Register.tsx` to call the Supabase authentication service
- **Status**: ✅ FIXED

### 2. Database RLS Policies
- **Problem**: Conflicting Row Level Security policies preventing company users from posting jobs
- **Fix**: Created `fix-database-policies.sql` to resolve policy conflicts
- **Status**: ⚠️ NEEDS MANUAL APPLICATION

### 3. Jobs Page Display
- **Problem**: Jobs page was showing hardcoded sample data instead of real database jobs
- **Fix**: Updated `src/pages/Jobs.tsx` to use `useJobs` hook and display actual jobs
- **Status**: ✅ FIXED

## Testing Steps

### Step 1: Apply Database Fix
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the contents of `fix-database-policies.sql`
4. Verify no errors occur

### Step 2: Test Company Registration
1. Navigate to http://localhost:8081/auth
2. Click "Sign Up" tab
3. Fill in the form:
   - Full Name: "Test Company"
   - Email: "company@test.com"
   - Password: "password123"
   - User Type: "Company"
4. Click "Create Account"
5. Check email for verification link
6. Click verification link

### Step 3: Test Company Login
1. Navigate to http://localhost:8081/auth
2. Click "Login" tab
3. Enter credentials:
   - Email: "company@test.com"
   - Password: "password123"
4. Click "Sign In"
5. Should redirect to `/company-dashboard`

### Step 4: Test Job Posting
1. On company dashboard, go to "Jobs" tab
2. Fill in job posting form:
   - Job Title: "Software Developer"
   - Company Name: "Test Tech Corp"
   - Location: "Mumbai, India"
   - Job Type: "Full-time"
   - Salary Range: "₹8-12 LPA"
   - Skills: "React, Node.js, JavaScript"
   - Requirements: "Bachelor's degree, 2+ years experience"
   - Description: "Join our team as a software developer..."
3. Click "Post Job"
4. Should see success message
5. Job should appear in "Your Job Postings" section

### Step 5: Test Job Display for Users
1. Navigate to http://localhost:8081/jobs
2. Should see the posted job in the jobs list
3. Test search functionality
4. Test filter functionality

## Expected Results

### After Successful Testing:
- ✅ Company users can register and verify accounts
- ✅ Company users can log in and access company dashboard
- ✅ Company users can post jobs successfully
- ✅ Posted jobs appear in the public jobs listing
- ✅ Users can search and filter jobs
- ✅ Job applications can be submitted (if implemented)

## Troubleshooting

### If Job Posting Fails:
1. Check browser console for errors
2. Verify RLS policies were applied correctly
3. Ensure user profile has `user_type = 'company'`
4. Check Supabase logs for permission errors

### If Jobs Don't Display:
1. Check if jobs exist in database
2. Verify `is_active = true` for jobs
3. Check browser console for API errors
4. Ensure `useJobs` hook is working correctly

## Database Schema Verification

Ensure these tables exist with correct structure:
- `profiles` table with `user_type` column
- `jobs` table with all required columns
- Proper RLS policies applied

## Next Steps

After successful testing:
1. Create more comprehensive job application flow
2. Add job editing/deletion functionality
3. Implement job application management
4. Add email notifications for new applications
5. Create admin panel for job moderation
