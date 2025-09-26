'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserRole, getDashboardUrl, isAuthenticated } from '@/lib/utils/authUtils';

interface RoleValidationResult {
  isValid: boolean;
  isLoading: boolean;
  userRole: string | null;
  userInfo: any;
}

// Define role-to-dashboard mapping
const ROLE_DASHBOARD_MAP: Record<string, string[]> = {
  'agency': ['/agency-dashboard'],
  'clinical-director': ['/clinical-director-dashboard'],
  'nurse-manager': ['/nurse-manager-dashboard'],
  'staff-nurse': ['/staff-nurse-dashboard'],
  'hr-director': ['/hr-director-dashboard'],
  'hr-specialist': ['/hr-specialist-dashboard'],
  'marketing-manager': ['/marketing-manager-dashboard'],
  'marketing-specialist': ['/marketing-specialist-dashboard'],
  'qa-director': ['/qa-director-dashboard'],
  'qa-nurse': ['/qa-nurse-dashboard'],
  'survey-user': ['/survey-user-dashboard']
};

export function useRoleValidation(requiredRole: string): RoleValidationResult {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  
  // TEMPORARY: Disable role validation for testing multiple dashboards
  const DISABLE_ROLE_VALIDATION = true;

  useEffect(() => {
    const validateRole = () => {
      try {
        // TEMPORARY: Skip role validation if disabled
        if (DISABLE_ROLE_VALIDATION) {
          console.log('🚧 ROLE VALIDATION DISABLED FOR TESTING - Allowing access to any dashboard');
          
          // Still get user info for display purposes
          const staffEmail = localStorage.getItem('staffEmail');
          const staffRole = localStorage.getItem('staffRole');
          const staffAgency = localStorage.getItem('staffAgency');
          const agencyEmail = localStorage.getItem('agencyEmail');
          
          let currentUserInfo: any = null;
          let currentRole: string | null = null;
          
          if (agencyEmail) {
            currentRole = 'agency';
            currentUserInfo = {
              email: agencyEmail,
              role: 'agency',
              type: 'agency'
            };
          } else if (staffEmail && staffRole && staffAgency) {
            currentRole = staffRole.toLowerCase().replace(/\s+/g, '-');
            currentUserInfo = {
              email: staffEmail,
              role: staffRole,
              agency: staffAgency,
              type: 'staff'
            };
          }
          
          setUserRole(currentRole);
          setUserInfo(currentUserInfo);
          setIsValid(true);
          setIsLoading(false);
          return;
        }

        // Original role validation logic (when enabled)
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('No authentication info found, redirecting to signin');
          router.push('/signin');
          return;
        }

        // Get current user role
        const currentRole = getCurrentUserRole();
        
        if (!currentRole) {
          console.log('No valid role found, redirecting to signin');
          router.push('/signin');
          return;
        }

        // Get user information from localStorage
        const staffEmail = localStorage.getItem('staffEmail');
        const staffRole = localStorage.getItem('staffRole');
        const staffAgency = localStorage.getItem('staffAgency');
        const agencyEmail = localStorage.getItem('agencyEmail');

        // Determine user info based on role
        let currentUserInfo: any = null;

        if (currentRole === 'agency' && agencyEmail) {
          currentUserInfo = {
            email: agencyEmail,
            role: 'agency',
            type: 'agency'
          };
        } else if (staffEmail && staffRole && staffAgency) {
          currentUserInfo = {
            email: staffEmail,
            role: staffRole,
            agency: staffAgency,
            type: 'staff'
          };
        }

        setUserRole(currentRole);
        setUserInfo(currentUserInfo);

        // Validate role access
        if (currentRole === requiredRole) {
          setIsValid(true);
          console.log(`Role validation passed for ${currentRole} accessing ${requiredRole} dashboard`);
        } else {
          console.log(`Role validation failed: user role ${currentRole} cannot access ${requiredRole} dashboard`);
          
          // Redirect to appropriate dashboard based on user's actual role
          const correctDashboard = getDashboardUrl(currentRole);
          console.log(`Redirecting to correct dashboard: ${correctDashboard}`);
          router.push(correctDashboard);
        }
      } catch (error) {
        console.error('Error during role validation:', error);
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    validateRole();
  }, [requiredRole, router]);

  return {
    isValid,
    isLoading,
    userRole,
    userInfo
  };
}
