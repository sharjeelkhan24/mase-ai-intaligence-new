# Patient Form Analysis - HR Management vs Current Table

## HR Management Form Fields (Patient Role)

### Basic Information
- **firstName** → `first_name` ✅ (exists)
- **lastName** → `last_name` ✅ (exists)
- **email** → `email` ✅ (exists)
- **phone** → `phone` ✅ (exists)
- **password** → `password_hash` ✅ (exists)

### Patient-Specific Information
- **dateOfBirth** → `date_of_birth` ✅ (exists)
- **medicalRecordNumber** → `medical_record_number` ✅ (exists)
- **primaryNurse** → `primary_nurse` ✅ (exists)
- **admissionDate** → `admission_date` ✅ (exists)
- **dischargeDate** → `discharge_date` ✅ (exists)

### Address Information
- **address** → `address` ✅ (exists)
- **city** → `city` ✅ (exists)
- **state** → `state` ✅ (exists)
- **zipCode** → `zip_code` ✅ (exists)

### Emergency Contact (Required for Patients)
- **emergencyContactName** → `emergency_contact_name` ✅ (exists)
- **emergencyContactPhone** → `emergency_contact_phone` ✅ (exists)

### Additional Fields (Not in HR Form but needed for signin/settings)
- **gender** → `gender` ❌ (needs to be added)
- **medical_conditions** → `medical_conditions` ❌ (needs to be added)
- **medications** → `medications` ❌ (needs to be added)
- **allergies** → `allergies` ❌ (needs to be added)
- **profile_image** → `profile_image` ❌ (needs to be added)
- **last_login** → `last_login` ❌ (needs to be added)

## Current Table Structure
```
agency_name, first_name, last_name, email, phone, date_of_birth, 
address, city, state, zip_code, emergency_contact_name, 
emergency_contact_phone, medical_record_number, primary_physician, 
password_hash, created_at, updated_at, notes, primary_nurse, 
admission_date, discharge_date, status
```

## Missing Columns for Full Functionality
1. `gender` - Patient gender
2. `medical_conditions` - Current medical conditions
3. `medications` - Current medications
4. `allergies` - Known allergies
5. `profile_image` - Profile image storage
6. `last_login` - Last login timestamp

## RLS Issue
The main issue is that RLS (Row Level Security) is blocking patient queries. The fix includes:
1. Disabling restrictive RLS policies
2. Creating permissive policies for development
3. Adding the missing columns

## Solution
Run the `update_patients_table_from_hr_form.sql` script to:
1. Fix RLS policies
2. Add missing columns
3. Ensure compatibility with both HR form and patient signin/settings
