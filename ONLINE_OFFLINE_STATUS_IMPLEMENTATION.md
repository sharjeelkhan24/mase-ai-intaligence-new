# Online/Offline Status Implementation Summary

## Overview
I've successfully implemented online/offline status tracking for staff and patients in the agency dashboard HR management system. Instead of showing the default "active" status, the admin can now see if users are currently online or offline based on their login activity.

## Changes Made

### 1. Database Schema Updates
- **File**: `add_last_login_to_staff_tables.sql`
- **Purpose**: Adds `last_login` column to all existing staff tables and updates the table creation function
- **Action Required**: Run this SQL script in your Supabase SQL Editor

### 2. Signin Logic Updates
- **File**: `app/signin/page.tsx`
- **Changes**: 
  - Staff signin now sets status to "online" and updates `last_login` timestamp
  - Added error handling for status updates

- **File**: `app/patient-signin/page.tsx`
- **Changes**:
  - Patient signin now sets status to "online" and updates `last_login` timestamp
  - Added error handling for status updates

### 3. Logout Logic Updates
- **File**: `lib/utils/logoutUtils.ts` (NEW)
- **Purpose**: Centralized logout utilities that update database status to "offline"
- **Functions**:
  - `updateUserStatusToOffline()` - Updates user status in database
  - `logoutStaff()` - Enhanced staff logout with database update
  - `logoutPatient()` - Enhanced patient logout with database update
  - `clearAuthData()` - Clears all authentication data

- **Updated Components**:
  - `app/components/staff-nurse-dashboard/StaffNurseNavbar.tsx`
  - `app/components/patient-dashboard/PatientNavbar.tsx`
  - Other navbar components can be updated similarly

### 4. HR Management Dashboard Updates
- **File**: `app/agency-dashboard/hr-management/page.tsx`
- **Changes**:
  - Updated status display logic to show "Online"/"Offline" instead of "Active"
  - Modified stats cards to show online staff/patients count
  - Added intelligent status determination based on login activity

### 5. Status Management Utilities
- **File**: `lib/utils/statusUtils.ts` (NEW)
- **Purpose**: Centralized status management utilities
- **Functions**:
  - `isUserOnline()` - Determines if user should be considered online
  - `updateInactiveUsersToOffline()` - Automatically sets inactive users to offline
  - `startAutomaticStatusUpdates()` - Sets up periodic status updates

### 6. API Endpoint for Status Updates
- **File**: `app/api/update-user-status/route.ts` (NEW)
- **Purpose**: API endpoint to manually trigger status updates
- **Usage**: Can be called by cron jobs or scheduled tasks
- **Endpoints**:
  - `POST /api/update-user-status` - Update inactive users to offline
  - `GET /api/update-user-status?timeoutMinutes=30` - Same functionality via GET

## How It Works

### Status Logic
1. **Online**: User has status "online" OR has logged in within the last 30 minutes
2. **Offline**: User has status "offline" OR hasn't logged in within the last 30 minutes
3. **On Leave**: User has status "on-leave" (special case)
4. **Inactive**: User has status "inactive" (special case)

### Login Process
1. User signs in with email/password
2. System verifies credentials
3. System updates user status to "online" and `last_login` timestamp
4. User is redirected to their dashboard

### Logout Process
1. User clicks logout button
2. System updates user status to "offline" in database
3. System clears authentication data from localStorage
4. User is redirected to signin page

### Automatic Status Updates
- Users are automatically set to "offline" if they haven't been active for 30+ minutes
- This can be triggered manually via the API endpoint or set up as a scheduled task

## Visual Changes in HR Dashboard

### Status Badges
- **Green "Online"**: User is currently active
- **Gray "Offline"**: User is not currently active
- **Yellow "On Leave"**: User is on leave (unchanged)
- **Red "Inactive"**: User is inactive (unchanged)

### Stats Cards
- **Total Staff**: Shows total number of staff members
- **Total Patients**: Shows total number of patients
- **Online Staff**: Shows number of currently online staff
- **Online Patients**: Shows number of currently online patients

## Next Steps

1. **Run the SQL script**: Execute `add_last_login_to_staff_tables.sql` in Supabase SQL Editor
2. **Test the functionality**: 
   - Sign in as staff/patient and verify status shows "Online"
   - Logout and verify status shows "Offline"
   - Check HR dashboard to see online/offline counts
3. **Set up automatic updates** (optional):
   - Use the API endpoint `/api/update-user-status` with a cron job
   - Or call `startAutomaticStatusUpdates()` in your app initialization

## Files Modified/Created

### Modified Files
- `app/signin/page.tsx`
- `app/patient-signin/page.tsx`
- `app/components/staff-nurse-dashboard/StaffNurseNavbar.tsx`
- `app/components/patient-dashboard/PatientNavbar.tsx`
- `app/agency-dashboard/hr-management/page.tsx`

### New Files
- `add_last_login_to_staff_tables.sql`
- `lib/utils/logoutUtils.ts`
- `lib/utils/statusUtils.ts`
- `app/api/update-user-status/route.ts`

The implementation is complete and ready for testing!
