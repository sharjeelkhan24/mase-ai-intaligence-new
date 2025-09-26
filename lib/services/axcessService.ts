import puppeteer, { Browser, Page } from 'puppeteer';

export interface AxcessCredentials {
  email: string;
  password: string;
}

export class AxcessService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async test(): Promise<boolean> {
    console.log('=== AXCESS SERVICE TEST ===');
    console.log('AxcessService.test() method called');
    return true;
  }

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
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
    }
  }

  async login(credentials: AxcessCredentials): Promise<boolean> {
    try {
      console.log('=== STARTING AXCESS LOGIN PROCESS ===');
      console.log('Email:', credentials.email);
      console.log('Password length:', credentials.password.length);
      console.log('AxcessService.login() method called successfully');
      
      // Test Puppeteer first
      console.log('Step 0: Testing Puppeteer...');
      try {
        const testBrowser = await puppeteer.launch({ headless: true });
        console.log('✅ Puppeteer launched successfully');
        await testBrowser.close();
        console.log('✅ Puppeteer test completed');
      } catch (error) {
        console.error('❌ Puppeteer failed:', error);
        throw new Error(`Puppeteer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      console.log('Step 1: Initializing browser...');
      await this.initialize();
      
      if (!this.browser) {
        console.error('❌ Browser initialization failed');
        throw new Error('Browser not initialized');
      }
      console.log('✅ Browser initialized successfully');

      console.log('Step 2: Creating new page...');
      this.page = await this.browser.newPage();
      console.log('✅ New page created');
      
      // Set user agent to avoid detection
      console.log('Step 3: Setting user agent...');
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      console.log('✅ User agent set');
      
      // Navigate to Axcess login page
      console.log('Step 4: Navigating to Axcess login page...');
      console.log('URL: https://identity.axxessweb.com/login');
      await this.page.goto('https://identity.axxessweb.com/login', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      const currentUrl = await this.page.url();
      console.log('✅ Page loaded successfully');
      console.log('Current URL:', currentUrl);
      
      // Wait a bit for any dynamic content to load
      console.log('Step 5: Waiting for dynamic content to load...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Wait completed');
      
      // Take a screenshot for debugging
      console.log('Step 6: Taking screenshot for debugging...');
      await this.page.screenshot({ path: 'axcess-login-page.png' });
      console.log('✅ Screenshot saved as axcess-login-page.png');

      // Wait for login form to load
      console.log('Step 7: Waiting for login form to load...');
      try {
        await this.page.waitForSelector('input[type="email"], input[name="email"], #email, input[type="text"], input[name="username"]', { timeout: 10000 });
        console.log('✅ Login form detected');
      } catch (error) {
        console.error('❌ Failed to find login form:', error);
        throw new Error('Login form not found');
      }
      
      // Get all available input fields for debugging
      console.log('Step 8: Analyzing available input fields...');
      const allInputs = await this.page.$$eval('input', inputs => inputs.map(i => ({ 
        type: i.type, 
        name: i.name, 
        id: i.id, 
        placeholder: i.placeholder,
        className: i.className
      })));
      console.log('📋 Available input fields:', JSON.stringify(allInputs, null, 2));
      
      // Fill in email only (first step of login)
      console.log('Step 9: Looking for email input field...');
      const emailSelectors = [
        'input[type="email"]',
        'input[name="email"]', 
        'input[name="username"]',
        '#email',
        '#username',
        'input[type="text"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="username" i]',
        'input[placeholder*="Email" i]',
        'input[placeholder*="Username" i]',
        'input[placeholder*="Domain" i]'
      ];
      
      console.log('🔍 Trying email selectors:', emailSelectors);
      let emailFilled = false;
      for (const selector of emailSelectors) {
        try {
          console.log(`  Trying selector: ${selector}`);
          const emailInput = await this.page.$(selector);
          if (emailInput) {
            console.log(`✅ Found email input with selector: ${selector}`);
            // Clear the field first
            console.log('  Clearing field...');
            await emailInput.click({ clickCount: 3 });
            console.log('  Typing email...');
            await emailInput.type(credentials.email);
            emailFilled = true;
            console.log('✅ Email filled successfully');
            break;
          } else {
            console.log(`  ❌ No element found for selector: ${selector}`);
          }
        } catch (e) {
          console.log(`  ❌ Error with selector ${selector}:`, e);
          continue;
        }
      }
      
      if (!emailFilled) {
        console.error('❌ Could not find email input field');
        console.log('Available inputs:', allInputs);
        throw new Error('Could not find email input field');
      }
      
      // Wait a bit before clicking login
      console.log('Step 10: Waiting before clicking login button...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Wait completed');
      
      // Click login button - try multiple selectors
        console.log('Step 11: Looking for login button...');
        const loginButtonSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          '.login-button',
          '#login-button',
          '[data-testid="login-button"]',
          '.btn-primary',
          '.btn-login',
          '.btn-submit',
          'input[value*="Sign In" i]',
          'input[value*="Login" i]',
          'input[value*="Secure Login" i]',
          'input[value*="secure login" i]'
        ];
      
      console.log('🔍 Trying login button selectors:', loginButtonSelectors);
      let loginClicked = false;
      for (const selector of loginButtonSelectors) {
        try {
          console.log(`  Trying selector: ${selector}`);
          const loginButton = await this.page.$(selector);
          if (loginButton) {
            console.log(`✅ Found login button with selector: ${selector}`);
            console.log('  Clicking login button...');
            await loginButton.click();
            loginClicked = true;
            console.log('✅ Login button clicked successfully');
            break;
          } else {
            console.log(`  ❌ No element found for selector: ${selector}`);
          }
        } catch (e) {
          console.log(`  ❌ Error with selector ${selector}:`, e);
          continue;
        }
      }
      
      if (!loginClicked) {
        // Try to find any button that might be the login button
        console.log('Step 12: Trying to find login button by text content...');
        const buttons = await this.page.$$('button, input[type="submit"]');
        console.log(`Found ${buttons.length} buttons on page`);
        
        for (let i = 0; i < buttons.length; i++) {
          const button = buttons[i];
          const text = await button.evaluate(el => el.textContent?.toLowerCase() || el.value?.toLowerCase() || '');
          console.log(`  Button ${i + 1}: "${text}"`);
          if (text.includes('secure login') || text.includes('sign in') || text.includes('login') || text.includes('log in') || text.includes('submit')) {
            console.log(`✅ Found login button with text: "${text}"`);
            console.log('  Clicking button...');
            await button.click();
            loginClicked = true;
            console.log('✅ Login button clicked successfully');
            break;
          }
        }
      }
      
      if (!loginClicked) {
        console.error('❌ Could not find login button');
        const availableButtons = await this.page.$$eval('button, input[type="submit"]', buttons => buttons.map(b => ({ text: b.textContent, value: b.value, type: b.type })));
        console.log('Available buttons:', JSON.stringify(availableButtons, null, 2));
        throw new Error('Could not find login button');
      }
      
      // Wait for navigation after login
      console.log('Step 13: Waiting for navigation after login...');
      try {
        await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        console.log('✅ Navigation completed');
      } catch (e) {
        console.log('⚠️ Navigation timeout, checking current page...');
      }
      
      const finalUrl = await this.page.url();
      console.log('📍 Final URL after login:', finalUrl);
      
      // Check for error messages on the page
      console.log('Step 14: Checking for error messages...');
      const errorMessages = await this.page.evaluate(() => {
        const errorSelectors = [
          '.error',
          '.alert-danger',
          '.alert-error',
          '.login-error',
          '.validation-error',
          '[class*="error"]',
          '[class*="alert"]'
        ];
        
        const errors: string[] = [];
        for (const selector of errorSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el.textContent && el.textContent.trim()) {
              errors.push(el.textContent.trim());
            }
          });
        }
        
        return errors;
      });
      
      if (errorMessages.length > 0) {
        console.error('❌ Error messages found on page:', errorMessages);
        return false;
      } else {
        console.log('✅ No error messages found');
      }
      
      // Check if we're on the password page (second step of login)
      console.log('Step 15: Checking if we are on password page...');
      const isOnPasswordPage = await this.page.evaluate(() => {
        return document.body.innerText.includes('Password') || 
               document.querySelector('input[type="password"]') !== null;
      });
      
      if (isOnPasswordPage) {
        console.log('✅ Detected password page, proceeding to fill password...');
        // Fill in password on the second step
        const passwordSelectors = [
          'input[type="password"]',
          'input[name="password"]',
          '#password'
        ];
        
        let passwordFilled = false;
        for (const selector of passwordSelectors) {
          try {
            const passwordInput = await this.page.$(selector);
            if (passwordInput) {
              console.log(`Found password input with selector: ${selector}`);
              await passwordInput.click({ clickCount: 3 });
              await passwordInput.type(credentials.password);
              passwordFilled = true;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!passwordFilled) {
          console.log('Could not find password input field on password page');
          return false;
        }
        
        // Click the login button on password page
        const passwordPageButtonSelectors = [
          'button[type="submit"]',
          'input[type="submit"]',
          '.btn-primary',
          '.btn-login',
          '.btn-submit'
        ];
        
        let passwordPageButtonClicked = false;
        for (const selector of passwordPageButtonSelectors) {
          try {
            const button = await this.page.$(selector);
            if (button) {
              console.log(`Found password page button with selector: ${selector}`);
              await button.click();
              passwordPageButtonClicked = true;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!passwordPageButtonClicked) {
          // Try to find any button that might be the login button
          const buttons = await this.page.$$('button, input[type="submit"]');
          for (const button of buttons) {
            const text = await button.evaluate(el => el.textContent?.toLowerCase() || el.value?.toLowerCase() || '');
            if (text.includes('secure login') || text.includes('login') || text.includes('sign in') || text.includes('continue') || text.includes('submit')) {
              console.log(`Found password page button with text: ${text}`);
              await button.click();
              passwordPageButtonClicked = true;
              break;
            }
          }
        }
        
        if (!passwordPageButtonClicked) {
          console.log('Could not find password page login button');
          return false;
        }
        
        // Wait for navigation after password submission
        console.log('Waiting for navigation after password submission...');
        try {
          await this.page.waitForNavigation({ timeout: 15000 });
          console.log('✅ Password page navigation successful');
        } catch (navError) {
          console.log('Password page navigation timeout, checking current page...');
          const currentUrl = this.page.url();
          console.log('Current URL after password submission:', currentUrl);
        }
        
        // Check for Cancel/OK buttons after secure login
        console.log('Step 16: Looking for Cancel/OK buttons...');
        
        // Wait longer for the Aurelia app to process the login and show the dialog
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check if we're in the 'success' stage
        const isInSuccessStage = await this.page.evaluate(() => {
          // Look for success indicators in the page
          const hasSuccessText = document.body.innerText.includes('success') || 
                                document.body.innerText.includes('Success') ||
                                document.body.innerText.includes('SUCCESS');
          
          // Check for any success-related elements
          const successElements = document.querySelectorAll('[class*="success"], [id*="success"], [data-stage="success"]');
          
          console.log('Success stage check - Has success text:', hasSuccessText);
          console.log('Success stage check - Success elements found:', successElements.length);
          
          // Log all text content to see what's actually on the page
          const allText = document.body.innerText;
          console.log('Success stage check - Page contains "Login":', allText.toLowerCase().includes('login'));
          console.log('Success stage check - Page contains "Successful":', allText.toLowerCase().includes('successful'));
          console.log('Success stage check - Page contains "OK":', allText.toLowerCase().includes('ok'));
          console.log('Success stage check - Page contains "Cancel":', allText.toLowerCase().includes('cancel'));
          console.log('Success stage check - Page contains "This system":', allText.toLowerCase().includes('this system'));
          console.log('Success stage check - Page contains "authorized":', allText.toLowerCase().includes('authorized'));
          
          // Log page title and URL
          console.log('Success stage check - Page title:', document.title);
          console.log('Success stage check - Current URL:', window.location.href);
          
          return hasSuccessText || successElements.length > 0;
        });
        
        console.log('Is in success stage:', isInSuccessStage);
        
        // Try multiple times to find the dialog as it might take time to appear
        let foundButtons: any[] = [];
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts && foundButtons.length === 0) {
          attempts++;
          console.log(`Attempt ${attempts}/${maxAttempts} to find Cancel/OK buttons...`);
          
          // Wait a bit between attempts
          if (attempts > 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          // Look for any buttons with OK, Cancel, or similar text
          foundButtons = await this.page.evaluate(() => {
          const allButtons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a, div[role="button"], span[role="button"]'));
          const okCancelButtons = allButtons.filter(button => {
            const text = button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '';
            return text.includes('ok') || 
                   text.includes('cancel') || 
                   text.includes('continue') || 
                   text.includes('proceed') || 
                   text.includes('accept') || 
                   text.includes('confirm') || 
                   text.includes('yes') || 
                   text.includes('no') || 
                   text.includes('submit') || 
                   text.includes('next') || 
                   text.includes('finish') || 
                   text.includes('done') || 
                   text.includes('close') || 
                   text.includes('dismiss') || 
                   text.includes('acknowledge') || 
                   text.includes('understand') || 
                   text.includes('agree') || 
                   text.includes('disagree');
          });
          
          console.log('Total buttons found:', allButtons.length);
          console.log('OK/Cancel/Similar buttons found:', okCancelButtons.length);
          
          // Log all buttons for debugging
          allButtons.forEach((button, index) => {
            const text = button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '';
            console.log(`Button ${index + 1}: "${text}"`);
          });
          
          return okCancelButtons.map(button => ({
            text: button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '',
            tagName: button.tagName,
            type: button.getAttribute('type') || 'button'
          }));
        });
        
        console.log(`Attempt ${attempts} - Found OK/Cancel buttons:`, foundButtons);
        
        if (foundButtons.length > 0) {
          console.log('✅ Found OK/Cancel buttons, breaking out of retry loop');
          break;
        }
      }
      
      console.log('Final result - Found OK/Cancel buttons:', foundButtons);
        
        if (foundButtons.length > 0) {
          console.log('✅ Found OK/Cancel buttons, looking for OK button...');
          
          // Find and click the OK button (or similar positive action)
          const okButton = await this.page.evaluate(() => {
            const allButtons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a, div[role="button"], span[role="button"]'));
            for (const button of allButtons) {
              const text = button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '';
              if ((text.includes('ok') || 
                   text.includes('continue') || 
                   text.includes('proceed') || 
                   text.includes('accept') || 
                   text.includes('confirm') || 
                   text.includes('yes') || 
                   text.includes('submit') || 
                   text.includes('next') || 
                   text.includes('finish') || 
                   text.includes('done') || 
                   text.includes('acknowledge') || 
                   text.includes('understand') || 
                   text.includes('agree')) && 
                  !text.includes('cancel') && 
                  !text.includes('no') && 
                  !text.includes('disagree')) {
                return button;
              }
            }
            return null;
          });
          
          if (okButton) {
            console.log('Found OK button, clicking it...');
            await this.page.evaluate(button => (button as HTMLElement).click(), okButton);
            console.log('✅ OK button clicked successfully');
            
            // Wait for navigation
            console.log('Waiting for navigation after OK button...');
            try {
              await this.page.waitForNavigation({ timeout: 15000 });
              console.log('✅ Navigation after OK button successful');
            } catch (navError) {
              console.log('Navigation timeout after OK button');
            }
          } else {
            console.log('❌ OK button not found');
          }
        } else {
          console.log('No OK/Cancel buttons found, checking iframes...');
          
          // Check iframes for OK/Cancel buttons
          const iframes = await this.page.$$('iframe');
          console.log(`Found ${iframes.length} iframes, checking for OK/Cancel buttons...`);
          
          for (let i = 0; i < iframes.length; i++) {
            try {
              const frame = iframes[i];
              const frameContent = await frame.contentFrame();
              if (frameContent) {
                console.log(`Checking iframe ${i + 1} for OK/Cancel buttons...`);
                
                const iframeButtons = await frameContent.evaluate((iframeIndex) => {
                  const allButtons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a, div[role="button"], span[role="button"]'));
                  const okCancelButtons = allButtons.filter(button => {
                    const text = button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '';
                    return text.includes('ok') || 
                           text.includes('cancel') || 
                           text.includes('continue') || 
                           text.includes('proceed') || 
                           text.includes('accept') || 
                           text.includes('confirm') || 
                           text.includes('yes') || 
                           text.includes('no') || 
                           text.includes('submit') || 
                           text.includes('next') || 
                           text.includes('finish') || 
                           text.includes('done') || 
                           text.includes('close') || 
                           text.includes('dismiss') || 
                           text.includes('acknowledge') || 
                           text.includes('understand') || 
                           text.includes('agree') || 
                           text.includes('disagree');
                  });
                  
                  console.log(`Iframe ${iframeIndex + 1} - Total buttons:`, allButtons.length);
                  console.log(`Iframe ${iframeIndex + 1} - OK/Cancel buttons:`, okCancelButtons.length);
                  
                  allButtons.forEach((button, index) => {
                    const text = button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '';
                    console.log(`Iframe ${iframeIndex + 1} Button ${index + 1}: "${text}"`);
                  });
                  
                  return okCancelButtons.map(button => ({
                    text: button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '',
                    tagName: button.tagName,
                    type: button.getAttribute('type') || 'button'
                  }));
                }, i);
                
                console.log(`Iframe ${i + 1} OK/Cancel buttons:`, iframeButtons);
                
                if (iframeButtons.length > 0) {
                  console.log(`✅ Found OK/Cancel buttons in iframe ${i + 1}!`);
                  
                  // Click OK button in iframe
                  const okButton = await frameContent.evaluate(() => {
                    const allButtons = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a, div[role="button"], span[role="button"]'));
                    for (const button of allButtons) {
                      const text = button.textContent?.toLowerCase() || button.getAttribute('value')?.toLowerCase() || '';
                      if ((text.includes('ok') || 
                           text.includes('continue') || 
                           text.includes('proceed') || 
                           text.includes('accept') || 
                           text.includes('confirm') || 
                           text.includes('yes') || 
                           text.includes('submit') || 
                           text.includes('next') || 
                           text.includes('finish') || 
                           text.includes('done') || 
                           text.includes('acknowledge') || 
                           text.includes('understand') || 
                           text.includes('agree')) && 
                          !text.includes('cancel') && 
                          !text.includes('no') && 
                          !text.includes('disagree')) {
                        return button;
                      }
                    }
                    return null;
                  });
                  
                  if (okButton) {
                    console.log('Found OK button in iframe, clicking it...');
                    await frameContent.evaluate(button => (button as HTMLElement).click(), okButton);
                    console.log('✅ OK button clicked in iframe');
                    
                    // Wait for navigation
                    try {
                      await this.page.waitForNavigation({ timeout: 15000 });
                      console.log('✅ Navigation after iframe OK button successful');
                    } catch (navError) {
                      console.log('Navigation timeout after iframe OK button');
                    }
                  }
                  break;
                }
              }
            } catch (error) {
              console.log(`Error checking iframe ${i + 1}:`, error);
            }
          }
        }
        
        // Final wait for any remaining navigation
        console.log('Step 17: Final wait for page to stabilize...');
        try {
          await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        } catch (e) {
          console.log('Password page navigation timeout, checking current page...');
        }
      }
      
      // Check for the "Login Successful" message and OK button
      const hasLoginSuccessMessage = await this.page.evaluate(() => {
        return document.body.innerText.includes('Login Successful') ||
               document.body.innerText.includes('This system and all its components') ||
               document.body.innerText.includes('authorized business use only');
      });
      
      if (hasLoginSuccessMessage) {
        console.log('Found login success message, looking for OK button...');
        
        // Look for OK button
        const okButtonSelectors = [
          'button:contains("OK")',
          'input[value="OK"]',
          'button:contains("Continue")',
          'button:contains("Proceed")'
        ];
        
        let okButtonClicked = false;
        for (const selector of okButtonSelectors) {
          try {
            const button = await this.page.$(selector);
            if (button) {
              console.log(`Found OK button with selector: ${selector}`);
              await button.click();
              okButtonClicked = true;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!okButtonClicked) {
          // Try to find any button that might be the OK button
          const buttons = await this.page.$$('button, input[type="submit"]');
          for (const button of buttons) {
            const text = await button.evaluate(el => el.textContent?.toLowerCase() || el.value?.toLowerCase() || '');
            if (text.includes('ok') || text.includes('continue') || text.includes('proceed')) {
              console.log(`Found OK button with text: ${text}`);
              await button.click();
              okButtonClicked = true;
              break;
            }
          }
        }
        
        if (okButtonClicked) {
          // Wait for final navigation
          console.log('Waiting for final navigation after OK button...');
          try {
            await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
          } catch (e) {
            console.log('Final navigation timeout, checking current page...');
          }
        }
      }
      
      const finalFinalUrl = await this.page.url();
      console.log('Final URL after complete login process:', finalFinalUrl);
      
      // Check if login was successful by looking for dashboard elements or redirect
      const isLoggedIn = await this.page.evaluate(() => {
        const currentUrl = window.location.href;
        const isNotOnLoginPage = !currentUrl.includes('login') && !currentUrl.includes('identity.axxessweb.com');
        const hasDashboardElements = !!(document.querySelector('.dashboard') || 
                                       document.querySelector('.main-content') || 
                                       document.querySelector('[data-testid="dashboard"]')) ||
                                   document.body.innerText.includes('Dashboard') ||
                                   document.body.innerText.includes('Welcome') ||
                                   document.body.innerText.includes('Home');
        
        return isNotOnLoginPage || hasDashboardElements;
      });

      console.log('=== FINAL RESULT ===');
      console.log('Login successful:', isLoggedIn);
      if (isLoggedIn) {
        console.log('🎉 AXCESS LOGIN COMPLETED SUCCESSFULLY! 🎉');
      } else {
        console.log('❌ AXCESS LOGIN FAILED ❌');
      }
      return isLoggedIn;
    } catch (error) {
      console.error('=== LOGIN PROCESS FAILED ===');
      console.error('❌ Error details:', error);
      console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return false;
    }
  }


  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

}

// Singleton instance
export const axcessService = new AxcessService();
