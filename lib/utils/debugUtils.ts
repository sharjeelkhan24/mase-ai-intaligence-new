'use client';

import { supabase } from '@/lib/supabase/client';

/**
 * Debug utility to help troubleshoot agency lookup issues
 * @param agencyName - The agency name to search for
 */
export async function debugAgencyLookup(agencyName: string): Promise<void> {
  console.log('=== DEBUG: Agency Lookup ===');
  console.log('Searching for agency:', agencyName);
  
  try {
    // Get all agencies
    const { data: allAgencies, error: allAgenciesError } = await supabase
      .from('agency')
      .select('agency_name, staff_table_name, patients_table_name');
    
    if (allAgenciesError) {
      console.error('Error fetching all agencies:', allAgenciesError);
      return;
    }
    
    console.log('All agencies:', allAgencies);
    
    // Try exact match
    const exactMatch = allAgencies?.find(agency => agency.agency_name === agencyName);
    console.log('Exact match:', exactMatch);
    
    // Try case-insensitive match
    const caseInsensitiveMatch = allAgencies?.find(agency => 
      agency.agency_name.toLowerCase() === agencyName.toLowerCase()
    );
    console.log('Case-insensitive match:', caseInsensitiveMatch);
    
    // Try partial match
    const partialMatch = allAgencies?.find(agency => 
      agency.agency_name.toLowerCase().includes(agencyName.toLowerCase()) ||
      agencyName.toLowerCase().includes(agency.agency_name.toLowerCase())
    );
    console.log('Partial match:', partialMatch);
    
    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Debug error:', error);
  }
}

/**
 * Test function to verify agency table structure
 */
export async function testAgencyTableStructure(): Promise<void> {
  console.log('=== DEBUG: Agency Table Structure ===');
  
  try {
    const { data, error } = await supabase
      .from('agency')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error fetching agency data:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Agency table structure:', Object.keys(data[0]));
      console.log('Sample agency data:', data[0]);
    } else {
      console.log('No agencies found in database');
    }
    
    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Debug error:', error);
  }
}