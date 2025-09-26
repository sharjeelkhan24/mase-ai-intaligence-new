-- Create staff table for all roles except Patient
CREATE TABLE staff (
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

-- Create indexes for better performance
CREATE INDEX idx_staff_agency_name ON staff(agency_name);
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_department ON staff(department);
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_email ON staff(email);

-- Add comments for documentation
COMMENT ON TABLE staff IS 'Staff members table for all roles except Patient';
COMMENT ON COLUMN staff.agency_name IS 'Agency that added this staff member';
COMMENT ON COLUMN staff.role IS 'Staff role: Staff Nurse, Nurse Manager, Clinical Doctor, etc.';
COMMENT ON COLUMN staff.license_number IS 'Professional license number for clinical roles';
COMMENT ON COLUMN staff.certifications IS 'Comma-separated list of certifications';