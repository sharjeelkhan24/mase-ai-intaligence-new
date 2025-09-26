import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { agencyName, agencyId } = await request.json();

    if (!agencyName || !agencyId) {
      return NextResponse.json(
        { error: 'Agency name and ID are required' },
        { status: 400 }
      );
    }

    console.log(`Creating tables for agency: ${agencyName} (ID: ${agencyId})`);

    // Use the database functions to create tables
    const { data: patientsTableName, error: patientsError } = await supabaseAdmin.rpc('create_agency_patients_table', {
      agency_name_param: agencyName
    });

    if (patientsError) {
      throw new Error(`Failed to create patients table: ${patientsError.message}`);
    }

    const { data: staffTableName, error: staffError } = await supabaseAdmin.rpc('create_agency_staff_table', {
      agency_name_param: agencyName
    });

    if (staffError) {
      throw new Error(`Failed to create staff table: ${staffError.message}`);
    }

    // Update agency record with table names
    const { error: updateError } = await supabaseAdmin
      .from('agency')
      .update({
        patients_table_name: patientsTableName,
        staff_table_name: staffTableName,
        updated_at: new Date().toISOString()
      })
      .eq('id', agencyId);

    if (updateError) {
      console.error('Failed to update agency with table names:', updateError);
      // Don't fail the request since tables were created successfully
    }

    return NextResponse.json({
      success: true,
      message: 'Agency-specific tables created successfully',
      data: {
        agencyName,
        patientsTableName,
        staffTableName
      }
    });

  } catch (error: any) {
    console.error('Error creating agency tables:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create agency tables',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
