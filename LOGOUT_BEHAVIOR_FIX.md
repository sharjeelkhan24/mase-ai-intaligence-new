# Fixed Logout Behavior - Stay Online for 1 Hour After Logout

## Problem
User wanted a different logout behavior:
- When user logs out: Stay "Online" but show logout time
- After 5 minutes: Show "Online - 5 minutes ago"
- After 1 hour: Then change to "Offline"

## Solution
Updated the logout and status logic to implement this behavior:

### 1. **Updated Logout Logic** (`lib/utils/logoutUtils.ts`)
- **Before**: Set `status = 'offline'` immediately on logout
- **After**: Keep `status = 'online'` but set `last_logout = current_time`

### 2. **Enhanced Status Logic** (`lib/utils/statusUtils.ts`)
- **`isUserOnline()`**: Now considers `last_logout` for timeout calculation
- **`getUserStatusWithTime()`**: Shows "Online" with logout time until 1-hour timeout
- **`updateInactiveUsersToOffline()`**: Checks both `last_login` and `last_logout` for timeout

## New Behavior Flow

### Login Process:
1. User signs in → `status = 'online'`, `last_login = now()`
2. Dashboard shows: `🟢 Online - Just now`

### Logout Process:
1. User logs out → `status = 'online'`, `last_logout = now()`
2. Dashboard shows: `🟢 Online - Just now` (logout time)

### Time Progression After Logout:
- **1 minute**: `🟢 Online - 1 minute ago`
- **5 minutes**: `🟢 Online - 5 minutes ago`
- **30 minutes**: `🟢 Online - 30 minutes ago`
- **59 minutes**: `🟢 Online - 59 minutes ago`
- **60+ minutes**: `⚪ Offline - 1 hour ago` (automatic timeout)

## Key Changes

### Logout Function:
```typescript
// OLD: Immediate offline
.update({ status: 'offline', last_logout: now() })

// NEW: Stay online with logout time
.update({ last_logout: now() })
```

### Status Logic:
```typescript
// NEW: Check timeout based on last_logout if available
if (lastLogout) {
  const minutesDiff = (now - lastLogout) / (1000 * 60);
  return minutesDiff <= 60; // Stay online for 1 hour
}
```

### Auto-Update Function:
```typescript
// NEW: Check both timestamps for timeout
.or(`last_login.lt.${cutoffTime},last_logout.lt.${cutoffTime}`)
```

## Visual Timeline

| Time After Logout | Status Display | Database Status |
|-------------------|----------------|-----------------|
| **0 minutes** | `🟢 Online - Just now` | `status = 'online'` |
| **5 minutes** | `🟢 Online - 5 minutes ago` | `status = 'online'` |
| **30 minutes** | `🟢 Online - 30 minutes ago` | `status = 'online'` |
| **60 minutes** | `⚪ Offline - 1 hour ago` | `status = 'offline'` (auto) |

## Result
- **Immediate logout**: User stays "Online" with logout time
- **Progressive time**: Shows increasing time since logout
- **Automatic timeout**: Changes to "Offline" after 1 hour
- **Real-time updates**: Dashboard refreshes every minute

The system now provides a graceful transition from "Online" to "Offline" over a 1-hour period!
