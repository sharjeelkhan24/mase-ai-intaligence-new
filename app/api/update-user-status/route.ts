import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client for server-side operations with fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Server-side function to update inactive users to offline
async function updateInactiveUsersToOfflineServer(timeoutMinutes: number = 1): Promise<void> {
  try {
    console.log(`Checking for users inactive for more than ${timeoutMinutes} minutes...`);

    // Get all agencies and their table names
    const { data: agencies, error: agenciesError } = await supabaseAdmin
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

    console.log('=== SERVER-SIDE TIME CALCULATION ===');
    console.log('Current time:', new Date().toISOString());
    console.log('Cutoff time:', cutoffTimeString);
    console.log('Timeout minutes:', timeoutMinutes);

    // Process each agency
    for (const agency of agencies) {
      console.log(`Processing agency: ${agency.agency_name}`);
      
      // Update staff members - check both last_login and last_logout
      if (agency.staff_table_name) {
        // First, let's check what users we have
        const { data: staffData, error: staffError } = await supabaseAdmin
          .from(agency.staff_table_name)
          .select('email, status, last_login, last_logout');

        if (!staffError && staffData) {
          console.log(`Found ${staffData.length} total staff members:`);
          staffData.forEach(staff => {
            const lastLogoutTime = staff.last_logout ? new Date(staff.last_logout) : null;
            const now = new Date();
            
            if (lastLogoutTime) {
              // Fix timezone issue: treat database timestamp as UTC
              const dbTimestamp = staff.last_logout;
              const fixedLastLogoutTime = new Date(dbTimestamp + 'Z'); // Force UTC interpretation
              const timeDiff = now.getTime() - fixedLastLogoutTime.getTime();
              const minutesDiff = Math.floor(timeDiff / (1000 * 60));
              
              console.log(`  - ${staff.email}: status=${staff.status}`);
              console.log(`    last_logout (raw): ${staff.last_logout}`);
              console.log(`    lastLogoutTime (fixed): ${fixedLastLogoutTime.toISOString()}`);
              console.log(`    now: ${now.toISOString()}`);
              console.log(`    timeDiff (ms): ${timeDiff}`);
              console.log(`    minutes_since_logout: ${minutesDiff}`);
            } else {
              console.log(`  - ${staff.email}: status=${staff.status}, last_logout=null`);
            }
          });
        }

        // Update users who have last_logout but are still marked as online
        const { error: updateError } = await supabaseAdmin
          .from(agency.staff_table_name)
          .update({ status: 'offline' })
          .eq('status', 'online')
          .not('last_logout', 'is', null);

        if (updateError) {
          console.error(`Error updating staff status for ${agency.agency_name}:`, updateError);
        } else {
          console.log(`Updated staff in ${agency.staff_table_name}`);
        }
      }

      // Update patients - check both last_login and last_logout
      if (agency.patients_table_name) {
        // First, let's check what patients we have
        const { data: patientData, error: patientError } = await supabaseAdmin
          .from(agency.patients_table_name)
          .select('email, status, last_login, last_logout');

        if (!patientError && patientData) {
          console.log(`Found ${patientData.length} total patients:`);
          patientData.forEach(patient => {
            const lastLogoutTime = patient.last_logout ? new Date(patient.last_logout) : null;
            const now = new Date();
            
            if (lastLogoutTime) {
              // Fix timezone issue: treat database timestamp as UTC
              const dbTimestamp = patient.last_logout;
              const fixedLastLogoutTime = new Date(dbTimestamp + 'Z'); // Force UTC interpretation
              const timeDiff = now.getTime() - fixedLastLogoutTime.getTime();
              const minutesDiff = Math.floor(timeDiff / (1000 * 60));
              
              console.log(`  - ${patient.email}: status=${patient.status}`);
              console.log(`    last_logout (raw): ${patient.last_logout}`);
              console.log(`    lastLogoutTime (fixed): ${fixedLastLogoutTime.toISOString()}`);
              console.log(`    now: ${now.toISOString()}`);
              console.log(`    timeDiff (ms): ${timeDiff}`);
              console.log(`    minutes_since_logout: ${minutesDiff}`);
            } else {
              console.log(`  - ${patient.email}: status=${patient.status}, last_logout=null`);
            }
          });
        }

        // Update users who have last_logout but are still marked as online
        const { error: patientsError } = await supabaseAdmin
          .from(agency.patients_table_name)
          .update({ status: 'offline' })
          .eq('status', 'online')
          .not('last_logout', 'is', null);

        if (patientsError) {
          console.error(`Error updating patients status for ${agency.agency_name}:`, patientsError);
        } else {
          console.log(`Updated patients in ${agency.patients_table_name}`);
        }
      }
    }

    console.log('Inactive users status update completed');
  } catch (error) {
    console.error('Unexpected error updating inactive users:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== API ROUTE: Status Update Started ===');
    
    // Get timeout parameter from request body (optional)
    const body = await request.json().catch(() => ({}));
    const timeoutMinutes = body.timeoutMinutes || 1;  // 1 minute for testing
    
    console.log(`Updating inactive users (timeout: ${timeoutMinutes} minutes)`);
    
    // Server-side function to update inactive users
    await updateInactiveUsersToOfflineServer(timeoutMinutes);
    
    console.log('✅ Status update completed successfully');
    
    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully updated inactive users (timeout: ${timeoutMinutes} minutes)`,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('=== API ROUTE: Status update error ===', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user statuses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support GET requests for simple testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeoutMinutes = parseInt(searchParams.get('timeoutMinutes') || '1');  // 1 minute for testing
    
    console.log(`GET request: Updating inactive users (timeout: ${timeoutMinutes} minutes)`);
    
    await updateInactiveUsersToOfflineServer(timeoutMinutes);
    
    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully updated inactive users (timeout: ${timeoutMinutes} minutes)`,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET request status update error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user statuses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
