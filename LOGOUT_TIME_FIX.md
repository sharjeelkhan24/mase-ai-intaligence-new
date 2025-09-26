# Fixed Logout Time Display Issue

## Problem
When users logged out, the system was showing "Offline - just now" instead of showing the actual logout time because it was using the `last_login` timestamp instead of tracking when they actually logged out.

## Root Cause
The logout logic was only setting `status = 'offline'` but not tracking the actual logout timestamp, so the system was still using the `last_login` time to determine "how long ago" they were active.

## Solution
Implemented a comprehensive logout tracking system:

### 1. **Added `last_logout` Column**
- Added `last_logout` timestamp column to all staff and patient tables
- Updated table creation functions to include this column
- Created indexes for efficient querying

### 2. **Updated Logout Logic** (`lib/utils/logoutUtils.ts`)
- Now sets both `status = 'offline'` AND `last_logout = current_timestamp`
- This provides accurate logout time tracking

### 3. **Enhanced Status Functions** (`lib/utils/statusUtils.ts`)
- `getTimeSinceLastActivity()` - Uses `last_logout` for offline users, `last_login` for others
- `getUserStatusWithTime()` - Now accepts `last_logout` parameter
- Smart time calculation based on user status

### 4. **Updated HR Dashboard** (`app/agency-dashboard/hr-management/page.tsx`)
- All status functions now pass `last_logout` parameter
- Displays accurate logout times

## How It Works Now

### Login Process:
1. User signs in → `status = 'online'`, `last_login = now()`
2. Dashboard shows: "Online - Just now"

### Logout Process:
1. User logs out → `status = 'offline'`, `last_logout = now()`
2. Dashboard shows: "Offline - Just now" (accurate logout time)

### Time Progression:
- **1 minute after logout**: "Offline - 1 minute ago"
- **5 minutes after logout**: "Offline - 5 minutes ago"
- **1 hour after logout**: "Offline - 1 hour ago"

## Visual Changes

### Before (Incorrect):
```
⚪ Offline
just now  ← (using last_login time)
```

### After (Correct):
```
⚪ Offline
2 minutes ago  ← (using last_logout time)
```

## Database Changes Required

**Run this SQL script in Supabase:**
```sql
-- File: add_last_logout_columns.sql
-- This adds last_logout column to all existing tables
```

## Status Display Logic

| User Status | Time Source | Display |
|-------------|-------------|---------|
| **Online** | `last_login` | "Online - 5 minutes ago" |
| **Logged Out** | `last_logout` | "Offline - 2 minutes ago" |
| **Timeout Offline** | `last_login` | "Offline - 2 hours ago" |
| **On Leave** | `last_login` | "On Leave - 1 hour ago" |

## Result
- **Accurate logout times**: Shows exactly when users logged out
- **Real-time updates**: Time progresses correctly after logout
- **Clear distinction**: Different time sources for different status types

The system now provides accurate, real-time logout time tracking!
