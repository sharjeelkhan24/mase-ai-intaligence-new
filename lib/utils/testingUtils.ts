'use client';

/**
 * Testing utilities for switching between different user roles
 * Only use these for development/testing purposes
 */

// Sample user data for testing
const TEST_USERS = {
  'nurse-manager': {
    email: 'nurse.manager@test.com',
    role: 'Nurse Manager',
    agency: 'Test Agency',
    first_name: 'Sarah',
    last_name: 'Johnson'
  },
  'staff-nurse': {
    email: 'staff.nurse@test.com',
    role: 'Staff Nurse',
    agency: 'Test Agency',
    first_name: 'Mike',
    last_name: 'Chen'
  },
  'clinical-director': {
    email: 'clinical.director@test.com',
    role: 'Clinical Director',
    agency: 'Test Agency',
    first_name: 'Dr. Emily',
    last_name: 'Rodriguez'
  },
  'agency': {
    email: 'agency@test.com',
    role: 'agency',
    agency: 'Test Healthcare Agency'
  }
};

/**
 * Switch to a test user role
 */
export function switchToTestUser(role: keyof typeof TEST_USERS) {
  // Clear all existing data
  localStorage.removeItem('staffEmail');
  localStorage.removeItem('staffRole');
  localStorage.removeItem('staffAgency');
  localStorage.removeItem('staffData');
  localStorage.removeItem('agencyEmail');
  localStorage.removeItem('agencyData');
  
  const user = TEST_USERS[role];
  
  if (role === 'agency') {
    localStorage.setItem('agencyEmail', user.email);
  } else {
    localStorage.setItem('staffEmail', user.email);
    localStorage.setItem('staffRole', user.role);
    localStorage.setItem('staffAgency', user.agency);
  }
  
  console.log(`🔄 Switched to test user: ${user.role} (${user.email})`);
  
  // Reload the page to apply changes
  window.location.reload();
}

/**
 * Get current test user info
 */
export function getCurrentTestUser() {
  const staffEmail = localStorage.getItem('staffEmail');
  const staffRole = localStorage.getItem('staffRole');
  const agencyEmail = localStorage.getItem('agencyEmail');
  
  if (agencyEmail) {
    return TEST_USERS.agency;
  }
  
  if (staffEmail && staffRole) {
    return Object.values(TEST_USERS).find(user => 
      user.email === staffEmail && user.role === staffRole
    );
  }
  
  return null;
}

/**
 * List all available test users
 */
export function listTestUsers() {
  console.log('📋 Available test users:');
  Object.entries(TEST_USERS).forEach(([key, user]) => {
    console.log(`  ${key}: ${user.role} (${user.email})`);
  });
}

/**
 * Quick access functions for each role
 */
export const testUsers = {
  nurseManager: () => switchToTestUser('nurse-manager'),
  staffNurse: () => switchToTestUser('staff-nurse'),
  clinicalDirector: () => switchToTestUser('clinical-director'),
  agency: () => switchToTestUser('agency')
};
