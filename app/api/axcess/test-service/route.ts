import { NextRequest, NextResponse } from 'next/server';
import { axcessService } from '@/lib/services/axcessService';

export async function GET() {
  try {
    console.log('=== TESTING AXCESS SERVICE ===');
    
    // Test the Axcess service
    console.log('Calling axcessService.test()...');
    const result = await axcessService.test();
    console.log('axcessService.test() result:', result);

    return NextResponse.json({
      success: true,
      message: 'Axcess service test completed successfully',
      result: result
    });

  } catch (error) {
    console.error('=== AXCESS SERVICE TEST FAILED ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json({
      success: false,
      error: `Axcess service test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    }, { status: 500 });
  }
}
