-- =====================================================
-- ADD STAFF AND PATIENTS TABLES TO EXISTING DATABASE
-- =====================================================
-- This script adds the staff and patients tables to your existing database
-- Run this if you already have agency and agency_subscription tables
-- =====================================================

-- =====================================================
-- CREATE STAFF TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name VARCHAR(255) NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    
    -- Employment Information
    role VARCHAR(50) NOT NULL, -- Staff Nurse, Nurse Manager, Clinical Doctor, etc.
    department VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10,2),
    
    -- Address Information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    
    -- Professional Information (for clinical roles)
    license_number VARCHAR(100),
    license_expiry DATE,
    certifications TEXT,
    
    -- Additional Information
    notes TEXT,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, on-leave, inactive
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CREATE PATIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_name VARCHAR(255) NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE NOT NULL,
    
    -- Address Information
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    
    -- Emergency Contact (Required for patients)
    emergency_contact_name VARCHAR(100) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    
    -- Patient Information
    medical_record_number VARCHAR(100),
    primary_physician VARCHAR(100),
    primary_nurse VARCHAR(100),
    admission_date DATE,
    discharge_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, discharged, deceased
    
    -- Additional Information
    notes TEXT,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Staff table indexes
CREATE INDEX IF NOT EXISTS idx_staff_agency_name ON staff(agency_name);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);

-- Patients table indexes
CREATE INDEX IF NOT EXISTS idx_patients_agency_name ON patients(agency_name);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(medical_record_number);
CREATE INDEX IF NOT EXISTS idx_patients_admission_date ON patients(admission_date);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE PERMISSIVE POLICIES (for development)
-- =====================================================
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Allow all operations on staff" ON staff;
CREATE POLICY "Allow all operations on staff" ON staff
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on patients" ON patients;
CREATE POLICY "Allow all operations on patients" ON patients
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- ADD DOCUMENTATION COMMENTS
-- =====================================================

-- Staff table comments
COMMENT ON TABLE staff IS 'Staff members table for all roles except Patient';
COMMENT ON COLUMN staff.agency_name IS 'Agency that added this staff member';
COMMENT ON COLUMN staff.role IS 'Staff role: Staff Nurse, Nurse Manager, Clinical Doctor, etc.';
COMMENT ON COLUMN staff.license_number IS 'Professional license number for clinical roles';
COMMENT ON COLUMN staff.certifications IS 'Comma-separated list of certifications';

-- Patients table comments
COMMENT ON TABLE patients IS 'Patients table for Patient role';
COMMENT ON COLUMN patients.agency_name IS 'Agency that added this patient';
COMMENT ON COLUMN patients.medical_record_number IS 'Unique medical record number';
COMMENT ON COLUMN patients.primary_physician IS 'Assigned primary physician';
COMMENT ON COLUMN patients.primary_nurse IS 'Assigned primary nurse';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created successfully
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_name IN ('staff', 'patients')
ORDER BY table_name;

-- Check table structures (run these separately in psql if needed)
-- \d staff;
-- \d patients;
