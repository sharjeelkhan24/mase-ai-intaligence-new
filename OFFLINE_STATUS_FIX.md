# Fixed Offline Status Display Issue

## Problem
When users logged out, their status was set to "offline" but the dashboard still showed "Offline - just now" because the `last_login` timestamp was recent.

## Root Cause
The status logic was showing time information for all statuses, including explicitly offline users.

## Solution
Updated the `getUserStatusWithTime()` function to handle different status types appropriately:

### Status Display Logic:
1. **Explicitly Offline** (`status = 'offline'`):
   - Shows: "Offline" (no time text)
   - This happens when user logs out

2. **Online** (`status = 'online'` or recent activity):
   - Shows: "Online - X minutes ago"
   - Shows time since last login

3. **On Leave** (`status = 'on-leave'`):
   - Shows: "On Leave - X hours ago"
   - Shows time since last login

4. **Inactive** (`status = 'inactive'`):
   - Shows: "Inactive - X days ago"
   - Shows time since last login

5. **Timeout Offline** (no recent activity):
   - Shows: "Offline - X hours ago"
   - Shows time since last login

## Visual Changes

### Before (Incorrect):
```
⚪ Offline
just now
```

### After (Correct):
```
⚪ Offline
(no time text)
```

### For Online Users:
```
🟢 Online
5 minutes ago
```

### For Timeout Offline:
```
⚪ Offline
2 hours ago
```

## Key Changes

1. **Status Logic**: Explicitly offline users show no time text
2. **UI Update**: Conditional rendering of time text
3. **Clear Distinction**: Different behavior for logout vs timeout

## Result
- **Logged out users**: Show "Offline" (clean, no time)
- **Online users**: Show "Online - X minutes ago"
- **Timeout users**: Show "Offline - X hours ago"

The status display now correctly distinguishes between logged out users and users who went offline due to timeout!
