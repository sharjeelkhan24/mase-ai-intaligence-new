# Testing Mode: 1-Minute Timeout for Quick Testing

## Changes Made for Testing

### 1. **Status Functions** (`lib/utils/statusUtils.ts`)
- `isUserOnline()`: Changed default timeout from 60 to 1 minute
- `getUserStatusWithTime()`: Changed default timeout from 60 to 1 minute  
- `updateInactiveUsersToOffline()`: Changed default timeout from 60 to 1 minute

### 2. **API Route** (`app/api/update-user-status/route.ts`)
- POST handler: Changed default timeout from 60 to 1 minute
- GET handler: Changed default timeout from 60 to 1 minute

## New Testing Timeline

| Time After Logout | Status Display | Description |
|-------------------|----------------|-------------|
| **0 seconds** | `🟢 Online - Just now` | User just logged out |
| **30 seconds** | `🟢 Online - Just now` | Still within grace period |
| **1 minute** | `⚪ Offline - 1 minute ago` | Auto-changed to offline |

## Testing Steps

1. **Login** → Should show: `🟢 Online` (clean, no time)
2. **Logout** → Should show: `🟢 Online - Just now`
3. **Wait 1 minute** → Should show: `⚪ Offline - 1 minute ago`

## To Revert Back to Production

Change all timeout values back to `60` minutes:

```typescript
// In lib/utils/statusUtils.ts
timeoutMinutes: number = 60

// In app/api/update-user-status/route.ts  
const timeoutMinutes = body.timeoutMinutes || 60;
const timeoutMinutes = parseInt(searchParams.get('timeoutMinutes') || '60');
```

## Result
Now you can test the logout behavior in just 1 minute instead of waiting 1 hour!
