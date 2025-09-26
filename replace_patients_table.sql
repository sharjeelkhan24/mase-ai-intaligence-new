-- Drop and recreate patients table
DROP TABLE IF EXISTS patients CASCADE;

-- Create patients table for Patient role
CREATE TABLE patients (
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
    primary_physician VARCHAR(100) DEFAULT 'TBD',
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

-- Create indexes for better performance
CREATE INDEX idx_patients_agency_name ON patients(agency_name);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_mrn ON patients(medical_record_number);
CREATE INDEX idx_patients_admission_date ON patients(admission_date);
CREATE INDEX idx_patients_primary_nurse ON patients(primary_nurse);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create restrictive RLS policy for patients
DROP POLICY IF EXISTS "Allow all operations on patients" ON patients;
CREATE POLICY "Agency can manage their patients" ON patients
    FOR ALL USING (agency_name = current_setting('app.current_agency_name', true))
    WITH CHECK (agency_name = current_setting('app.current_agency_name', true));

-- Add comments for documentation
COMMENT ON TABLE patients IS 'Patients table for Patient role';
COMMENT ON COLUMN patients.agency_name IS 'Agency that added this patient';
COMMENT ON COLUMN patients.medical_record_number IS 'Unique medical record number';
COMMENT ON COLUMN patients.primary_physician IS 'Assigned primary physician (defaults to TBD)';
COMMENT ON COLUMN patients.primary_nurse IS 'Assigned primary nurse from staff table';
COMMENT ON COLUMN patients.admission_date IS 'Date patient was admitted to care';
COMMENT ON COLUMN patients.discharge_date IS 'Date patient was discharged (null if still active)';
