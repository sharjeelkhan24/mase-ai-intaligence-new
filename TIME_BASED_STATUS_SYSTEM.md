# Time-Based Status System Implementation

## Overview
I've implemented a comprehensive time-based status system that shows how long ago users were online and automatically sets them to offline after 1 hour of inactivity.

## Key Features

### 1. **Time-Based Status Logic**
- **Online**: Users logged in within the last 60 minutes
- **Offline**: Users logged out or inactive for more than 60 minutes
- **Time Display**: Shows "X minutes ago", "X hours ago", etc.

### 2. **Enhanced Status Functions** (`lib/utils/statusUtils.ts`)
- `isUserOnline()` - Checks if user is online (60-minute timeout)
- `getTimeSinceLastLogin()` - Returns human-readable time duration
- `getUserStatusWithTime()` - Returns status with time information

### 3. **Updated HR Dashboard** (`app/agency-dashboard/hr-management/page.tsx`)
- **Status Display**: Shows both status and time information
- **Real-time Updates**: Auto-refreshes every minute
- **Enhanced Stats**: Accurate online/offline counts

### 4. **Automatic Status Updates**
- **API Endpoint**: `/api/update-user-status` (60-minute timeout)
- **Periodic Updates**: Can be called by cron jobs
- **Database Updates**: Automatically sets inactive users to offline

## Visual Changes

### Status Display Format
```
┌─────────────────┐
│ 🟢 Online       │
│ 10 minutes ago  │
└─────────────────┘

┌─────────────────┐
│ ⚪ Offline      │
│ 2 hours ago     │
└─────────────────┘
```

### Time Format Examples
- "Just now" - Less than 1 minute
- "5 minutes ago" - 1-59 minutes
- "2 hours ago" - 1-23 hours
- "3 days ago" - 24+ hours
- "Never logged in" - No last_login

## How It Works

### 1. **Login Process**
- User signs in → Status set to "online"
- `last_login` timestamp updated
- Dashboard shows "Online" with "Just now"

### 2. **Active Session**
- Dashboard shows "Online" with time since login
- Updates every minute: "5 minutes ago", "10 minutes ago", etc.

### 3. **Logout Process**
- User logs out → Status set to "offline"
- Dashboard shows "Offline" with logout time

### 4. **Automatic Timeout**
- After 60 minutes of inactivity → Status set to "offline"
- Dashboard shows "Offline" with last activity time

## Configuration

### Timeout Settings
- **Default Timeout**: 60 minutes
- **API Endpoint**: Can specify custom timeout
- **Auto-refresh**: Every 60 seconds

### API Usage
```bash
# Update inactive users (60-minute timeout)
POST /api/update-user-status

# Custom timeout (30 minutes)
POST /api/update-user-status
{"timeoutMinutes": 30}

# GET request
GET /api/update-user-status?timeoutMinutes=45
```

## Benefits

1. **Real-time Visibility**: Admins can see exactly when users were last active
2. **Automatic Management**: No manual intervention needed
3. **Accurate Status**: Based on actual login activity, not just database status
4. **User-friendly Display**: Clear, readable time information
5. **Flexible Configuration**: Customizable timeout periods

## Testing

1. **Login as staff/patient** → Should show "Online - Just now"
2. **Wait a few minutes** → Should show "Online - X minutes ago"
3. **Logout** → Should show "Offline - X minutes ago"
4. **Wait 60+ minutes** → Should automatically show "Offline"

The system now provides comprehensive time-based status tracking with automatic offline detection after 1 hour of inactivity!
