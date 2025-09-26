import { NextRequest, NextResponse } from 'next/server';
import { axcessService } from '@/lib/services/axcessService';

export async function POST(request: NextRequest) {
  try {
    console.log('=== API ROUTE: Axcess Authentication Started ===');
    
    const { email, password } = await request.json();
    console.log('Received credentials - Email:', email, 'Password length:', password?.length);

    if (!email || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('✅ Credentials received, starting Axcess authentication...');
    
    // Attempt to login to Axcess
    console.log('Calling axcessService.login()...');
    let loginSuccess = false;
    try {
      loginSuccess = await axcessService.login({ email, password });
      console.log('axcessService.login() completed, result:', loginSuccess);
    } catch (serviceError) {
      console.error('❌ axcessService.login() threw an error:', serviceError);
      throw serviceError;
    }

    if (loginSuccess) {
      console.log('🎉 API ROUTE: Authentication successful');
      return NextResponse.json(
        { 
          success: true, 
          message: 'Successfully authenticated with Axcess' 
        },
        { status: 200 }
      );
    } else {
      console.log('❌ API ROUTE: Authentication failed - invalid credentials or login process failed');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid credentials or login failed. Please check your email and password.' 
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('=== API ROUTE: Authentication error ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Authentication service error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}
