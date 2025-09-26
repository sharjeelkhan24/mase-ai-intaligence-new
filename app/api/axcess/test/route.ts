import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET() {
  try {
    console.log('=== TESTING PUPPETEER ===');
    
    // Test 1: Basic Puppeteer launch
    console.log('Test 1: Launching Puppeteer...');
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    console.log('✅ Puppeteer launched successfully');

    // Test 2: Create a page
    console.log('Test 2: Creating a page...');
    const page = await browser.newPage();
    console.log('✅ Page created successfully');

    // Test 3: Navigate to a simple page
    console.log('Test 3: Navigating to Google...');
    await page.goto('https://www.google.com', { timeout: 10000 });
    console.log('✅ Navigation successful');

    // Test 4: Take a screenshot
    console.log('Test 4: Taking screenshot...');
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('✅ Screenshot taken');

    // Test 5: Close browser
    console.log('Test 5: Closing browser...');
    await browser.close();
    console.log('✅ Browser closed successfully');

    return NextResponse.json({
      success: true,
      message: 'Puppeteer test completed successfully',
      tests: [
        'Puppeteer launch: ✅',
        'Page creation: ✅',
        'Navigation: ✅',
        'Screenshot: ✅',
        'Browser close: ✅'
      ]
    });

  } catch (error) {
    console.error('=== PUPPETEER TEST FAILED ===');
    console.error('Error details:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json({
      success: false,
      error: `Puppeteer test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error
    }, { status: 500 });
  }
}
