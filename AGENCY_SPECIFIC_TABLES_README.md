# Agency-Specific Tables Implementation

## Overview

This implementation adds the ability to automatically create dedicated tables for each agency when they register. Each agency gets their own `patients` and `staff` tables with the naming convention `patients_[agency_name]` and `staff_[agency_name]`.

## Features

- ✅ Automatic table creation when agency registers
- ✅ Sanitized table names (safe for PostgreSQL)
- ✅ Complete table schemas with indexes
- ✅ Error handling and validation
- ✅ Service layer for table management
- ✅ Database triggers for automatic creation
- ✅ Utility functions for table name generation

## Files Created/Modified

### New Files Created

1. **`app/api/create-agency-tables/route.ts`** - API endpoint for creating agency tables
2. **`lib/services/agency-table-service.ts`** - Service layer for table operations
3. **`lib/utils/agency-tables.ts`** - Utility functions for table naming
4. **`setup_agency_specific_tables.sql`** - Database setup script
5. **`create_agency_tables_function.sql`** - Basic database functions

### Modified Files

1. **`app/signup/page.tsx`** - Updated to call table creation API after agency registration

## Database Setup

### Step 1: Run the Database Setup Script

Execute the `setup_agency_specific_tables.sql` file in your Supabase SQL Editor. This will:

- Create necessary database functions
- Add columns to the agency table for storing table names
- Create triggers for automatic table creation
- Set up row-level security policies

### Step 2: Verify Setup

After running the setup script, you can test the functions:

```sql
-- Test table name sanitization
SELECT sanitize_table_name('ABC Healthcare Services LLC');
-- Result: abc_healthcare_services_llc

-- Test table name generation
SELECT generate_agency_table_names('ABC Healthcare Services LLC');
-- Result: {"sanitizedName": "abc_healthcare_services_llc", "patientsTableName": "patients_abc_healthcare_services_llc", "staffTableName": "staff_abc_healthcare_services_llc"}
```

## How It Works

### 1. Agency Registration Flow

When an agency registers through the signup form:

1. Agency data is saved to the `agency` table
2. The signup process calls `/api/create-agency-tables`
3. The API creates agency-specific tables
4. Table names are stored in the agency record

### 2. Table Creation Process

The system automatically:

1. Sanitizes the agency name for safe table naming
2. Creates `patients_[sanitized_name]` table with full schema
3. Creates `staff_[sanitized_name]` table with full schema
4. Creates all necessary indexes for performance
5. Updates the agency record with table names

### 3. Table Schemas

#### Patients Table Schema
```sql
CREATE TABLE patients_[agency_name] (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name varchar(255) NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  phone varchar(20),
  date_of_birth date NOT NULL,
  address text,
  city varchar(100),
  state varchar(50),
  zip_code varchar(10),
  emergency_contact_name varchar(100) NOT NULL,
  emergency_contact_phone varchar(20) NOT NULL,
  medical_record_number varchar(100),
  primary_physician varchar(100) DEFAULT 'TBD',
  primary_nurse varchar(100),
  admission_date date,
  discharge_date date,
  status varchar(20) DEFAULT 'active',
  notes text,
  password_hash varchar(255) NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  gender varchar(20),
  medical_conditions text,
  medications text,
  allergies text,
  profile_image text,
  last_login timestamp
);
```

#### Staff Table Schema
```sql
CREATE TABLE staff_[agency_name] (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name varchar(255) NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  phone varchar(20),
  role varchar(50) NOT NULL,
  department varchar(100),
  hire_date date,
  salary numeric(10, 2),
  address text,
  city varchar(100),
  state varchar(50),
  zip_code varchar(10),
  emergency_contact_name varchar(100),
  emergency_contact_phone varchar(20),
  license_number varchar(100),
  license_expiry date,
  certifications text,
  notes text,
  password_hash varchar(255) NOT NULL,
  status varchar(20) DEFAULT 'active',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  profile_image text
);
```

## API Usage

### Create Agency Tables

**Endpoint:** `POST /api/create-agency-tables`

**Request Body:**
```json
{
  "agencyName": "ABC Healthcare Services",
  "agencyId": "uuid-of-agency"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agency-specific tables created successfully",
  "data": {
    "agencyName": "ABC Healthcare Services",
    "patientsTableName": "patients_abc_healthcare_services",
    "staffTableName": "staff_abc_healthcare_services"
  }
}
```

## Utility Functions

### Table Name Sanitization

```typescript
import { sanitizeTableName } from '@/lib/utils/agency-tables';

const sanitized = sanitizeTableName('ABC Healthcare Services LLC');
// Result: "abc_healthcare_services_llc"
```

### Generate Table Names

```typescript
import { generateAgencyTableNames } from '@/lib/utils/agency-tables';

const tableNames = generateAgencyTableNames('ABC Healthcare Services LLC');
// Result: {
//   sanitizedName: "abc_healthcare_services_llc",
//   patientsTableName: "patients_abc_healthcare_services_llc",
//   staffTableName: "staff_abc_healthcare_services_llc"
// }
```

## Service Layer

### AgencyTableService

```typescript
import { AgencyTableService } from '@/lib/services/agency-table-service';

// Create tables for an agency
const result = await AgencyTableService.createAgencyTables(
  'ABC Healthcare Services',
  'agency-uuid'
);

// Get table information for an agency
const tableInfo = await AgencyTableService.getAgencyTableInfo('agency-uuid');
```

## Error Handling

The system includes comprehensive error handling:

- **Invalid agency names** - Validates table name generation
- **Database errors** - Catches and logs SQL execution errors
- **Duplicate tables** - Checks if tables already exist before creation
- **API failures** - Graceful degradation if table creation fails

## Security Considerations

- **SQL Injection Prevention** - Uses parameterized queries and proper escaping
- **Row Level Security** - RLS policies can be applied to agency tables
- **Access Control** - Functions require proper permissions
- **Input Validation** - All inputs are validated before processing

## Performance Optimizations

- **Indexes** - All tables include performance indexes
- **Parallel Creation** - Tables are created concurrently
- **Existence Checks** - Avoids recreating existing tables
- **Efficient Queries** - Optimized SQL for table creation

## Testing

To test the implementation:

1. **Run the database setup script**
2. **Register a new agency** through the signup form
3. **Check the database** for the new tables
4. **Verify table names** are stored in the agency record

## Troubleshooting

### Common Issues

1. **Permission Errors** - Ensure database functions have proper permissions
2. **Table Name Conflicts** - Check for duplicate sanitized names
3. **SQL Errors** - Verify the database setup script ran successfully
4. **API Failures** - Check server logs for detailed error messages

### Debugging

Enable detailed logging by checking the browser console and server logs during agency registration. The system logs all table creation steps for debugging purposes.

## Future Enhancements

Potential improvements:

- **Table Cleanup** - Add functionality to drop tables when agencies are deleted
- **Schema Versioning** - Track table schema versions for updates
- **Bulk Operations** - Support for creating multiple agency tables
- **Monitoring** - Add metrics for table creation success/failure rates
- **Backup Integration** - Include agency tables in backup procedures
