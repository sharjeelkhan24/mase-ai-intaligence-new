'use client';

import { supabase } from '@/lib/supabase/client';

/**
 * Automatically set users to offline if they haven't been active for a specified time
 * This function should be called periodically (e.g., every 5-10 minutes)
 * @param timeoutMinutes - Minutes after which a user should be considered offline (default: 60)
 */
export async function updateInactiveUsersToOffline(timeoutMinutes: number = 1): Promise<void> {  // 1 minute for testing
  try {
    console.log(`Checking for users inactive for more than ${timeoutMinutes} minutes...`);

    // Get all agencies and their table names
    const { data: agencies, error: agenciesError } = await supabase
      .from('agency')
      .select('agency_name, staff_table_name, patients_table_name')
      .not('staff_table_name', 'is', null)
      .not('patients_table_name', 'is', null);

    if (agenciesError || !agencies) {
      console.error('Error fetching agencies:', agenciesError);
      return;
    }

    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - timeoutMinutes);
    const cutoffTimeString = cutoffTime.toISOString();

    // Process each agency
    for (const agency of agencies) {
      // Update staff members - check both last_login and last_logout
      if (agency.staff_table_name) {
        const { error: staffError } = await supabase
          .from(agency.staff_table_name)
          .update({ status: 'offline' })
          .eq('status', 'online')
          .or(`last_login.lt.${cutoffTimeString},last_logout.lt.${cutoffTimeString}`);

        if (staffError) {
          console.error(`Error updating staff status for ${agency.agency_name}:`, staffError);
        }
      }

      // Update patients - check both last_login and last_logout
      if (agency.patients_table_name) {
        const { error: patientsError } = await supabase
          .from(agency.patients_table_name)
          .update({ status: 'offline' })
          .eq('status', 'online')
          .or(`last_login.lt.${cutoffTimeString},last_logout.lt.${cutoffTimeString}`);

        if (patientsError) {
          console.error(`Error updating patients status for ${agency.agency_name}:`, patientsError);
        }
      }
    }

    console.log('Inactive users status update completed');
  } catch (error) {
    console.error('Unexpected error updating inactive users:', error);
  }
}

/**
 * Set up automatic status updates using setInterval
 * Call this function once when the application starts
 * @param intervalMinutes - How often to check for inactive users (default: 5 minutes)
 * @param timeoutMinutes - Minutes after which a user should be considered offline (default: 30)
 */
export function startAutomaticStatusUpdates(
  intervalMinutes: number = 5,
  timeoutMinutes: number = 30
): () => void {
  console.log(`Starting automatic status updates every ${intervalMinutes} minutes`);
  
  const intervalId = setInterval(() => {
    updateInactiveUsersToOffline(timeoutMinutes);
  }, intervalMinutes * 60 * 1000); // Convert minutes to milliseconds

  // Return cleanup function
  return () => {
    console.log('Stopping automatic status updates');
    clearInterval(intervalId);
  };
}

/**
 * Check if a user should be considered online based on their status and last activity
 * @param status - User's current status
 * @param lastLogin - Last login timestamp
 * @param lastLogout - Last logout timestamp (optional)
 * @param timeoutMinutes - Minutes after which a user should be considered offline (default: 60)
 * @returns true if user should be considered online
 */
export function isUserOnline(
  status: string,
  lastLogin: string | null,
  lastLogout: string | null = null,
  timeoutMinutes: number = 1  // 1 minute for testing
): boolean {
  // If explicitly set to offline, they're offline
  if (status === 'offline') return false;
  
  // If explicitly on-leave or inactive, they're offline
  if (status === 'on-leave' || status === 'inactive') return false;
  
  // If explicitly online, check timeout based on last activity
  if (status === 'online') {
    // If user has last_logout, use that for timeout calculation
    if (lastLogout) {
      // Fix timezone issue: treat database timestamp as UTC
      const fixedLastLogoutTime = new Date(lastLogout + 'Z');
      const now = new Date();
      const timeDiff = now.getTime() - fixedLastLogoutTime.getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      return minutesDiff <= timeoutMinutes;
    }
    
    // Otherwise use last_login
    if (!lastLogin) return false;
    const lastLoginTime = new Date(lastLogin);
    const now = new Date();
    const timeDiff = now.getTime() - lastLoginTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    return minutesDiff <= timeoutMinutes;
  }
  
  // Default case - check last_login
  if (!lastLogin) return false;
  const lastLoginTime = new Date(lastLogin);
  const now = new Date();
  const timeDiff = now.getTime() - lastLoginTime.getTime();
  const minutesDiff = timeDiff / (1000 * 60);
  
  return minutesDiff <= timeoutMinutes;
}

/**
 * Get the time duration since last logout in a human-readable format
 * @param lastLogout - Last logout timestamp
 * @returns Human-readable time duration string
 */
export function getTimeSinceLastLogout(lastLogout: string | null): string {
  // If no last_logout, show no time text
  if (!lastLogout) {
    return '';
  }
  
  // Fix timezone issue: treat database timestamp as UTC
  const fixedLastLogoutTime = new Date(lastLogout + 'Z');
  const now = new Date();
  const timeDiff = now.getTime() - fixedLastLogoutTime.getTime();
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));
  
  console.log('Time calculation:', {
    lastLogout,
    lastLogoutTime: fixedLastLogoutTime.toISOString(),
    now: now.toISOString(),
    timeDiffMs: timeDiff,
    minutesDiff
  });
  
  if (minutesDiff < 1) return 'Just now';
  if (minutesDiff < 60) return `${minutesDiff} minute${minutesDiff === 1 ? '' : 's'} ago`;
  
  const hoursDiff = Math.floor(minutesDiff / 60);
  if (hoursDiff < 24) return `${hoursDiff} hour${hoursDiff === 1 ? '' : 's'} ago`;
  
  const daysDiff = Math.floor(hoursDiff / 24);
  return `${daysDiff} day${daysDiff === 1 ? '' : 's'} ago`;
}

/**
 * Get the user's status with time information
 * @param status - User's current status
 * @param lastLogin - Last login timestamp
 * @param lastLogout - Last logout timestamp (optional)
 * @param timeoutMinutes - Minutes after which a user should be considered offline (default: 60)
 * @returns Object with status and time information
 */
export function getUserStatusWithTime(
  status: string,
  lastLogin: string | null,
  lastLogout: string | null = null,
  timeoutMinutes: number = 1  // 1 minute for testing
): { status: string; timeText: string; isOnline: boolean } {
  console.log('getUserStatusWithTime called with:', { status, lastLogin, lastLogout, timeoutMinutes });
  
  const isOnline = isUserOnline(status, lastLogin, lastLogout, timeoutMinutes);
  
  console.log('Status calculation:', { isOnline });
  
  // If explicitly offline, show time since logout
  if (status === 'offline') {
    return {
      status: 'Offline',
      timeText: getTimeSinceLastLogout(lastLogout),
      isOnline: false
    };
  }
  
  // If explicitly on-leave, show time since logout
  if (status === 'on-leave') {
    return {
      status: 'On Leave',
      timeText: getTimeSinceLastLogout(lastLogout),
      isOnline: false
    };
  }
  
  // If explicitly inactive, show time since logout
  if (status === 'inactive') {
    return {
      status: 'Inactive',
      timeText: getTimeSinceLastLogout(lastLogout),
      isOnline: false
    };
  }
  
  // For online users (truly active users)
  if (isOnline) {
    return {
      status: 'Online',
      timeText: '', // No time text for truly online users
      isOnline: true
    };
  } else {
    // User is offline due to timeout, show time since logout
    return {
      status: 'Offline',
      timeText: getTimeSinceLastLogout(lastLogout),
      isOnline: false
    };
  }
}
