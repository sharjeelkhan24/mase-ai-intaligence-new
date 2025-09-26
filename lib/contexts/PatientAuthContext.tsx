'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

interface PatientData {
  id: string;
  agency_id: string;
  agency_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_conditions: string;
  medications: string;
  allergies: string;
  password_hash: string;
  email_verified: boolean;
  account_status: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}

interface PatientAuthContextType {
  patient: PatientData | null;
  setPatient: (patient: PatientData | null) => void;
  isLoading: boolean;
  refreshPatientData: () => Promise<void>;
  clearPatientData: () => void;
}

const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export function usePatientAuth() {
  const context = useContext(PatientAuthContext);
  if (context === undefined) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
}

interface PatientAuthProviderProps {
  children: ReactNode;
}

export function PatientAuthProvider({ children }: PatientAuthProviderProps) {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshPatientData = async () => {
    try {
      setIsLoading(true);
      const storedEmail = localStorage.getItem('patientEmail');
      const storedAgency = localStorage.getItem('patientAgency');
      
      if (!storedEmail) {
        console.log('No patient email found in localStorage');
        setPatient(null);
        return;
      }

      if (!storedAgency) {
        console.log('No patient agency found in localStorage');
        setPatient(null);
        return;
      }

      console.log('Fetching patient data for email:', storedEmail, 'from agency:', storedAgency);
      
      // First, get the agency's patients table name
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('patients_table_name')
        .eq('agency_name', storedAgency)
        .single();

      if (agencyError || !agencyData?.patients_table_name) {
        console.error('Error fetching agency data or patients table name:', agencyError);
        throw new Error('Agency patients table not found');
      }

      console.log('Using patients table:', agencyData.patients_table_name);
      
      const { data, error } = await supabase
        .from(agencyData.patients_table_name)
        .select('*')
        .eq('email', storedEmail)
        .single();

      if (error) {
        console.error('Error fetching patient data:', error);
        throw error;
      }

      if (data) {
        console.log('Patient data fetched successfully:', data);
        setPatient(data);
        localStorage.setItem('patientData', JSON.stringify(data));
      } else {
        console.log('No patient data found for email:', storedEmail);
        setPatient(null);
      }
    } catch (error) {
      console.error('Error in refreshPatientData:', error);
      setPatient(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearPatientData = () => {
    setPatient(null);
    localStorage.removeItem('patientData');
    localStorage.removeItem('patientEmail');
    localStorage.removeItem('patientAgency');
  };

  // Load patient data on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const storedPatientData = localStorage.getItem('patientData');
      const storedEmail = localStorage.getItem('patientEmail');
      
      if (storedPatientData && storedEmail) {
        try {
          const parsedData = JSON.parse(storedPatientData);
          console.log('Patient data loaded from localStorage:', parsedData);
          setPatient(parsedData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error parsing stored patient data:', error);
          // If parsing fails, try to refresh from database
          refreshPatientData();
        }
      } else if (storedEmail) {
        // If we have email but no data, fetch from database
        refreshPatientData();
      } else {
        // No stored data, redirect to signin
        console.log('No patient data found, redirecting to signin');
        setIsLoading(false);
      }
    } else {
      console.log('useEffect skipped on server side');
      setIsLoading(false);
    }
  }, []);

  const value: PatientAuthContextType = {
    patient,
    setPatient,
    isLoading,
    refreshPatientData,
    clearPatientData,
  };

  return (
    <PatientAuthContext.Provider value={value}>
      {children}
    </PatientAuthContext.Provider>
  );
}
