-- =====================================================
-- CREATE AGENCY NAME FUNCTION
-- =====================================================
-- This function sets the agency name in the session for RLS policies
-- =====================================================

-- Create function to set agency name in session
CREATE OR REPLACE FUNCTION set_agency_name(agency_name TEXT)
RETURNS VOID AS $$
BEGIN
    -- Set the agency name in the session
    PERFORM set_config('app.current_agency_name', agency_name, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION set_agency_name(TEXT) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION set_agency_name(TEXT) IS 'Sets the agency name in the session for RLS policies';
