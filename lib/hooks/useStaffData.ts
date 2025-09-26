'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface StaffData {
  id: string;
  agency_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  hire_date?: string;
  salary?: number;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  license_number?: string;
  license_expiry?: string;
  certifications?: string;
  notes?: string;
  profile_image?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UseStaffDataResult {
  staffData: StaffData | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useStaffData(): UseStaffDataResult {
  const [staffData, setStaffData] = useState<StaffData | null>(() => {
    // Initialize with cached data if available (for hydration consistency)
    if (typeof window !== 'undefined') {
      try {
        const cachedData = localStorage.getItem('staffData');
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (error) {
        console.error('Error parsing cached staff data:', error);
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if we're on the client side before accessing localStorage
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      const staffEmail = localStorage.getItem('staffEmail');
      const staffAgency = localStorage.getItem('staffAgency');
      
      if (!staffEmail) {
        throw new Error('No staff email found in localStorage');
      }

      if (!staffAgency) {
        throw new Error('No staff agency found in localStorage');
      }

      console.log('Fetching staff data for email:', staffEmail, 'from agency:', staffAgency);
      
      // First, get the staff table name for this agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('staff_table_name')
        .eq('agency_name', staffAgency)
        .single();

      if (agencyError || !agencyData?.staff_table_name) {
        console.error('Error fetching agency data or staff table name:', agencyError);
        throw new Error('Agency staff table not found');
      }

      console.log('Using staff table:', agencyData.staff_table_name);
      
      const { data, error: fetchError } = await supabase
        .from(agencyData.staff_table_name)
        .select('*')
        .eq('email', staffEmail)
        .single();

      if (fetchError) {
        console.error('Error fetching staff data:', fetchError);
        throw fetchError;
      }

      if (data) {
        console.log('Staff data fetched successfully:', data);
        
        // Add agency name to staff data for navbar display
        const staffDataWithAgency = {
          ...data,
          agency_name: staffAgency
        };
        
        setStaffData(staffDataWithAgency);
        // Store the complete data in localStorage for consistency
        localStorage.setItem('staffData', JSON.stringify(staffDataWithAgency));
      } else {
        throw new Error('No staff data found for the current user');
      }
    } catch (err: any) {
      console.error('Error in fetchStaffData:', err);
      setError(err.message || 'Failed to fetch staff data');
      // Clear any cached data on error
      setStaffData(null);
      localStorage.removeItem('staffData');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchStaffData();
  };

  useEffect(() => {
    // Only fetch if we don't have cached data or if we're on the client
    if (typeof window !== 'undefined') {
      // Check if we have valid cached data
      const cachedData = localStorage.getItem('staffData');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          if (parsedData && parsedData.id) {
            // We have valid cached data, use it and don't fetch
            setStaffData(parsedData);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing cached staff data:', error);
        }
      }
      
      // No valid cached data, fetch from server
      fetchStaffData();
    } else {
      // On server side, just set loading to false
      setIsLoading(false);
    }
  }, []);

  return {
    staffData,
    isLoading,
    error,
    refreshData
  };
}
