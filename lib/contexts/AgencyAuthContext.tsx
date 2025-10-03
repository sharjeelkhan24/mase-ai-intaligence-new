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
  patients_table_name?: string;
  staff_table_name?: string;
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
    setAgency(null);
    setSubscriptions([]);
    setIsLoading(false);
  };

  const refreshAgencyData = async () => {
    try {
      setIsLoading(true);
      
      // Get agency email from localStorage (set during signin)
      const agencyEmail = localStorage.getItem('agencyEmail');
      
      if (!agencyEmail) {
        clearAgencyData();
        return;
      }
      
      // Fetch agency data from Supabase
      const { data: agencyData, error } = await supabase
        .from('agency')
        .select('*')
        .eq('email', agencyEmail)
        .single();

      if (error) {
        setAgency(null);
        setSubscriptions([]);
      } else {
        setAgency(agencyData);

        // Fetch agency subscriptions from agency-specific subscription table
        const agencyNameClean = agencyData.agency_name.toLowerCase().replace(/\s+/g, '_');
        const subscriptionTableName = `subscription_${agencyNameClean}`;
        
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from(subscriptionTableName)
          .select('*')
          .eq('agency_id', agencyData.id)
          .in('status', ['active', 'trial']);

        if (subscriptionError) {
          setSubscriptions([]);
        } else {
          setSubscriptions(subscriptionData || []);
        }
      }
    } catch (error) {
      setAgency(null);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      refreshAgencyData();

      // Listen for storage changes to handle account switching
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'agencyEmail') {
          refreshAgencyData();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    } else {
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
