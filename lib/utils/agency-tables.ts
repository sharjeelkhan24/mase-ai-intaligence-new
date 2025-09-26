/**
 * Agency Table Utilities
 * Utility functions for managing agency-specific tables
 */

/**
 * Sanitizes an agency name to create a valid PostgreSQL table name
 * @param agencyName - The original agency name
 * @returns A sanitized string suitable for table naming
 */
export function sanitizeTableName(agencyName: string): string {
  if (!agencyName || typeof agencyName !== 'string') {
    throw new Error('Agency name must be a non-empty string');
  }

  return agencyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 50); // Limit length to 50 characters
}

/**
 * Generates table names for an agency
 * @param agencyName - The agency name
 * @returns Object with sanitized name and table names
 */
export function generateAgencyTableNames(agencyName: string) {
  const sanitizedName = sanitizeTableName(agencyName);
  
  if (!sanitizedName) {
    throw new Error('Cannot generate valid table name from agency name');
  }

  return {
    sanitizedName,
    patientsTableName: `patients_${sanitizedName}`,
    staffTableName: `staff_${sanitizedName}`
  };
}

/**
 * Validates if a table name is valid for PostgreSQL
 * @param tableName - The table name to validate
 * @returns True if valid, false otherwise
 */
export function isValidTableName(tableName: string): boolean {
  if (!tableName || typeof tableName !== 'string') {
    return false;
  }

  // Check length
  if (tableName.length > 63) { // PostgreSQL identifier limit
    return false;
  }

  // Check if it starts with a letter or underscore
  if (!/^[a-zA-Z_]/.test(tableName)) {
    return false;
  }

  // Check if it contains only valid characters
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    return false;
  }

  return true;
}

/**
 * Creates a standardized table name prefix
 * @param tableType - Type of table (patients, staff, etc.)
 * @param agencyName - The agency name
 * @returns A standardized table name
 */
export function createTableName(tableType: 'patients' | 'staff', agencyName: string): string {
  const sanitizedName = sanitizeTableName(agencyName);
  return `${tableType}_${sanitizedName}`;
}

/**
 * Extracts agency name from a table name
 * @param tableName - The table name (e.g., "patients_abc_healthcare")
 * @returns The extracted agency name or null if invalid
 */
export function extractAgencyNameFromTable(tableName: string): string | null {
  if (!tableName || typeof tableName !== 'string') {
    return null;
  }

  const parts = tableName.split('_');
  if (parts.length < 2) {
    return null;
  }

  // Remove the first part (table type) and join the rest
  const agencyParts = parts.slice(1);
  return agencyParts.join('_');
}

/**
 * Checks if a table name follows the agency-specific naming convention
 * @param tableName - The table name to check
 * @returns True if it follows the convention, false otherwise
 */
export function isAgencyTableName(tableName: string): boolean {
  if (!tableName || typeof tableName !== 'string') {
    return false;
  }

  const validPrefixes = ['patients_', 'staff_'];
  return validPrefixes.some(prefix => tableName.startsWith(prefix));
}
