'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

interface StaffAuthContextType {
  staff: StaffData | null;
  isLoading: boolean;
  refreshStaffData: () => Promise<void>;
  clearStaffData: () => void;
}

const StaffAuthContext = createContext<StaffAuthContextType | undefined>(undefined);

interface StaffAuthProviderProps {
  children: ReactNode;
}

export function StaffAuthProvider({ children }: StaffAuthProviderProps) {
  const [staff, setStaff] = useState<StaffData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStaffData = async () => {
    try {
      setIsLoading(true);
      const storedEmail = localStorage.getItem('staffEmail');
      const storedAgency = localStorage.getItem('staffAgency');
      
      if (!storedEmail) {
        console.log('No staff email found in localStorage');
        setStaff(null);
        return;
      }

      if (!storedAgency) {
        console.log('No staff agency found in localStorage');
        setStaff(null);
        return;
      }

      console.log('Fetching staff data for email:', storedEmail, 'from agency:', storedAgency);
      
      // First, get the agency's staff table name
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('agency_name, staff_table_name')
        .eq('agency_name', storedAgency)
        .single();

      console.log('Agency query result:', { agencyData, agencyError });

      if (agencyError) {
        console.error('Error fetching agency data:', agencyError);
        console.error('Agency name being searched:', storedAgency);
        
        // Try to find the agency with a different approach
        const { data: allAgencies, error: allAgenciesError } = await supabase
          .from('agency')
          .select('agency_name, staff_table_name')
          .not('staff_table_name', 'is', null);
        
        console.log('All agencies with staff tables:', allAgencies);
        
        if (allAgenciesError) {
          throw new Error(`Agency lookup failed: ${agencyError.message}`);
        }
        
        throw new Error(`Agency '${storedAgency}' not found. Available agencies: ${allAgencies?.map(a => a.agency_name).join(', ')}`);
      }

      if (!agencyData?.staff_table_name) {
        console.error('Agency found but no staff table name:', agencyData);
        throw new Error(`Agency '${storedAgency}' found but staff_table_name is null`);
      }

      console.log('Using staff table:', agencyData.staff_table_name);
      
      const { data, error } = await supabase
        .from(agencyData.staff_table_name)
        .select('*')
        .eq('email', storedEmail)
        .single();

      if (error) {
        console.error('Error fetching staff data:', error);
        throw error;
      }

      if (data) {
        console.log('Staff data fetched successfully:', data);
        setStaff(data);
        localStorage.setItem('staffData', JSON.stringify(data));
      } else {
        console.log('No staff data found for email:', storedEmail);
        setStaff(null);
      }
    } catch (error) {
      console.error('Error in refreshStaffData:', error);
      setStaff(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearStaffData = () => {
    setStaff(null);
    localStorage.removeItem('staffData');
    localStorage.removeItem('staffEmail');
    localStorage.removeItem('staffRole');
    localStorage.removeItem('staffAgency');
  };

  // Load staff data on mount
  useEffect(() => {
    refreshStaffData();
  }, []);

  const value = {
    staff,
    isLoading,
    refreshStaffData,
    clearStaffData
  };

  return (
    <StaffAuthContext.Provider value={value}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (context === undefined) {
    throw new Error('useStaffAuth must be used within a StaffAuthProvider');
  }
  return context;
}
