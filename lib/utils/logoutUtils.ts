'use client';

import { supabase } from '@/lib/supabase/client';

/**
 * Update user status to offline in the database
 * @param userType - 'staff' or 'patient'
 * @param userId - The user's ID
 * @param agencyName - The agency name (for finding the correct table)
 */
export async function updateUserStatusToOffline(
  userType: 'staff' | 'patient',
  userId: string,
  agencyName: string
): Promise<void> {
  try {
    console.log(`Updating ${userType} status to offline for user ${userId} in agency ${agencyName}`);
    
    // Get the agency data to find the correct table name
    const columnName = userType === 'staff' ? 'staff_table_name' : 'patients_table_name';
    
    // Try exact match first
    let { data: agencyData, error: agencyError } = await supabase
      .from('agency')
      .select(columnName)
      .eq('agency_name', agencyName)
      .single();

    // If exact match fails, try case-insensitive match
    if (agencyError || !agencyData) {
      console.log('Exact match failed, trying case-insensitive match...');
      const { data: agencyDataCI, error: agencyErrorCI } = await supabase
        .from('agency')
        .select(columnName)
        .ilike('agency_name', agencyName)
        .single();
      
      if (!agencyErrorCI && agencyDataCI) {
        agencyData = agencyDataCI;
        agencyError = null;
        console.log('Case-insensitive match successful');
      }
    }

    if (agencyError || !agencyData) {
      console.error(`Error finding agency ${userType} table:`, agencyError);
      console.error('Agency name:', agencyName);
      console.error('Column name:', columnName);
      
      // Try to find agency by searching through all agencies
      console.log('Trying to find agency by searching all agencies...');
      const { data: allAgencies, error: allAgenciesError } = await supabase
        .from('agency')
        .select('agency_name, staff_table_name, patients_table_name');
      
      if (!allAgenciesError && allAgencies) {
        const matchingAgency = allAgencies.find(agency => 
          agency.agency_name === agencyName || 
          agency.agency_name.toLowerCase() === agencyName.toLowerCase()
        );
        
        if (matchingAgency) {
          console.log('Found matching agency:', matchingAgency);
          agencyData = matchingAgency;
          agencyError = null;
        } else {
          console.error('No matching agency found. Available agencies:', allAgencies.map(a => a.agency_name));
          return;
        }
      } else {
        console.error('Failed to fetch all agencies:', allAgenciesError);
        return;
      }
    }

    const tableName = userType === 'staff' 
      ? agencyData.staff_table_name 
      : agencyData.patients_table_name;

    console.log('Agency data:', agencyData);
    console.log('Table name:', tableName);

    if (!tableName) {
      console.error(`No ${userType} table found for agency:`, agencyName);
      console.error('Available agency data:', agencyData);
      return;
    }

    // Update the user's status to offline and set last_logout timestamp
    // This immediately shows them as offline
    const logoutTime = new Date().toISOString();
    console.log(`Updating ${userType} logout time:`, logoutTime);
    
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ 
        status: 'offline',
        last_logout: logoutTime
      })
      .eq('id', userId);

    if (updateError) {
      console.error(`Error updating ${userType} logout time:`, updateError);
    } else {
      console.log(`${userType} logout time updated successfully to:`, logoutTime);
    }
  } catch (error) {
    console.error(`Unexpected error updating ${userType} status:`, error);
  }
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthData() {
  // Clear staff authentication data
  localStorage.removeItem('staffEmail');
  localStorage.removeItem('staffRole');
  localStorage.removeItem('staffAgency');
  localStorage.removeItem('staffData');
  
  // Clear agency authentication data
  localStorage.removeItem('agencyEmail');
  localStorage.removeItem('agencyData');
  
  // Clear patient authentication data
  localStorage.removeItem('patientData');
  localStorage.removeItem('patientEmail');
  localStorage.removeItem('patientAgency');
  
  console.log('All authentication data cleared from localStorage');
}

/**
 * Clear only staff authentication data
 */
export function clearStaffAuthData() {
  localStorage.removeItem('staffEmail');
  localStorage.removeItem('staffRole');
  localStorage.removeItem('staffAgency');
  localStorage.removeItem('staffData');
  console.log('Staff authentication data cleared from localStorage');
}

/**
 * Clear only patient authentication data
 */
export function clearPatientAuthData() {
  localStorage.removeItem('patientData');
  localStorage.removeItem('patientEmail');
  localStorage.removeItem('patientAgency');
  console.log('Patient authentication data cleared from localStorage');
}

/**
 * Enhanced logout function for staff members
 * @param staffData - Staff data from localStorage
 */
export async function logoutStaff(staffData: any): Promise<void> {
  try {
    console.log('=== LOGOUT STAFF DEBUG ===');
    console.log('logoutStaff called with data:', staffData);
    console.log('staffData.id:', staffData?.id);
    console.log('staffData.agency_name:', staffData?.agency_name);
    
    if (staffData?.id) {
      // Get agency_name from staffData or try to find it
      let agencyName = staffData.agency_name;
      
      if (!agencyName) {
        console.log('No agency_name in staffData, trying to find it...');
        // Try to get agency name from localStorage as fallback
        const storedAgency = localStorage.getItem('staffAgency');
        if (storedAgency) {
          agencyName = storedAgency;
          console.log('Using agency from localStorage:', agencyName);
        }
      }
      
      console.log('Final agency name:', agencyName);
      
      if (agencyName) {
        console.log('Calling updateUserStatusToOffline...');
        await updateUserStatusToOffline('staff', staffData.id, agencyName);
        console.log('updateUserStatusToOffline completed');
      } else {
        console.error('No agency name found for staff logout');
      }
    } else {
      console.error('No staff ID found for logout');
    }
  } catch (error) {
    console.error('Error updating staff status during logout:', error);
    // Continue with logout even if status update fails
  }
  console.log('Clearing staff auth data...');
  clearStaffAuthData();
  console.log('=== LOGOUT STAFF COMPLETE ===');
}

/**
 * Enhanced logout function for patients
 * @param patientData - Patient data from localStorage
 */
export async function logoutPatient(patientData: any): Promise<void> {
  try {
    console.log('logoutPatient called with data:', patientData);
    
    if (patientData?.id) {
      // Get agency_name from patientData or try to find it
      let agencyName = patientData.agency_name;
      
      if (!agencyName) {
        console.log('No agency_name in patientData, trying to find it...');
        // Try to get agency name from localStorage as fallback
        const storedAgency = localStorage.getItem('patientAgency');
        if (storedAgency) {
          agencyName = storedAgency;
          console.log('Using agency from localStorage:', agencyName);
        }
      }
      
      if (agencyName) {
        await updateUserStatusToOffline('patient', patientData.id, agencyName);
      } else {
        console.error('No agency name found for patient logout');
      }
    } else {
      console.error('No patient ID found for logout');
    }
  } catch (error) {
    console.error('Error updating patient status during logout:', error);
    // Continue with logout even if status update fails
  }
  clearPatientAuthData();
}
