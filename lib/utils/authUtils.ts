'use client';

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
 * Clear only agency authentication data
 */
export function clearAgencyAuthData() {
  localStorage.removeItem('agencyEmail');
  localStorage.removeItem('agencyData');
  
  console.log('Agency authentication data cleared from localStorage');
}

/**
 * Get current user role from localStorage
 */
export function getCurrentUserRole(): string | null {
  const staffRole = localStorage.getItem('staffRole');
  const agencyEmail = localStorage.getItem('agencyEmail');
  
  if (agencyEmail) {
    return 'agency';
  }
  
  if (staffRole) {
    return staffRole.toLowerCase().replace(/\s+/g, '-');
  }
  
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const staffEmail = localStorage.getItem('staffEmail');
  const agencyEmail = localStorage.getItem('agencyEmail');
  
  return !!(staffEmail || agencyEmail);
}

/**
 * Get the correct dashboard URL for a given role
 */
export function getDashboardUrl(role: string): string {
  const roleMap: Record<string, string> = {
    'agency': '/agency-dashboard',
    'clinical-director': '/clinical-director-dashboard',
    'nurse-manager': '/nurse-manager-dashboard',
    'staff-nurse': '/staff-nurse-dashboard',
    'hr-director': '/hr-director-dashboard',
    'hr-specialist': '/hr-specialist-dashboard',
    'marketing-manager': '/marketing-manager-dashboard',
    'marketing-specialist': '/marketing-specialist-dashboard',
    'qa-director': '/qa-director-dashboard',
    'qa-nurse': '/qa-nurse-dashboard',
    'survey-user': '/survey-user-dashboard'
  };
  
  return roleMap[role] || '/signin';
}
