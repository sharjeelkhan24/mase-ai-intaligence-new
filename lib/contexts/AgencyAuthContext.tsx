'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

interface AgencyData {
  id: string;
  agency_name: string;
  license_number: string;
  contact_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  staff_count: string;
  patient_count: string;
  notes?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

interface AgencySubscription {
  id: string;
  agency_id: string;
  agency_name: string;
  subscription_type: string;
  total_price: number;
  status: string;
  start_period: string;
  end_period: string;
  created_at: string;
  updated_at: string;
}

interface AgencyAuthContextType {
  agency: AgencyData | null;
  setAgency: (agency: AgencyData | null) => void;
  subscriptions: AgencySubscription[];
  setSubscriptions: (subscriptions: AgencySubscription[]) => void;
  isLoading: boolean;
  refreshAgencyData: () => Promise<void>;
  clearAgencyData: () => void;
}

const AgencyAuthContext = createContext<AgencyAuthContextType | undefined>(undefined);

export function useAgencyAuth() {
  const context = useContext(AgencyAuthContext);
  if (context === undefined) {
    throw new Error('useAgencyAuth must be used within an AgencyAuthProvider');
  }
  return context;
}

interface AgencyAuthProviderProps {
  children: ReactNode;
}

export function AgencyAuthProvider({ children }: AgencyAuthProviderProps) {
  const [agency, setAgency] = useState<AgencyData | null>(null);
  const [subscriptions, setSubscriptions] = useState<AgencySubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const clearAgencyData = () => {
    console.log('Clearing agency data...');
    setAgency(null);
    setSubscriptions([]);
    setIsLoading(false);
  };

  const refreshAgencyData = async () => {
    try {
      console.log('RefreshAgencyData called');
      setIsLoading(true);
      
      // Get agency email from localStorage (set during signin)
      const agencyEmail = localStorage.getItem('agencyEmail');
      console.log('Agency email from localStorage:', agencyEmail);
      
      if (!agencyEmail) {
        console.log('No agency email found in localStorage');
        clearAgencyData();
        return;
      }

      console.log('Fetching agency data for email:', agencyEmail);
      
      // Fetch agency data from Supabase
      const { data: agencyData, error } = await supabase
        .from('agency')
        .select('*')
        .eq('email', agencyEmail)
        .single();

      console.log('Supabase query result:', { data: agencyData, error });

      if (error) {
        console.error('Error fetching agency data:', error);
        setAgency(null);
        setSubscriptions([]);
      } else {
        console.log('Agency data loaded successfully:', agencyData);
        setAgency(agencyData);

        // Fetch agency subscriptions
        console.log('Fetching agency subscriptions for agency ID:', agencyData.id);
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('agency_subscription')
          .select('*')
          .eq('agency_id', agencyData.id)
          .in('status', ['active', 'trial']); // Get both active and trial subscriptions

        if (subscriptionError) {
          console.error('Error fetching subscriptions:', subscriptionError);
          setSubscriptions([]);
        } else {
          console.log('Subscriptions loaded successfully:', subscriptionData);
          setSubscriptions(subscriptionData || []);
        }
      }
    } catch (error) {
      console.error('Error in refreshAgencyData:', error);
      setAgency(null);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      console.log('useEffect running on client side');
      refreshAgencyData();

      // Listen for storage changes to handle account switching
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'agencyEmail') {
          console.log('Agency email changed in localStorage, refreshing data...');
          refreshAgencyData();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } else {
      console.log('useEffect skipped on server side');
      setIsLoading(false);
    }
  }, []);

  const value = {
    agency,
    setAgency,
    subscriptions,
    setSubscriptions,
    isLoading,
    refreshAgencyData,
    clearAgencyData,
  };

  return (
    <AgencyAuthContext.Provider value={value}>
      {children}
    </AgencyAuthContext.Provider>
  );
}
