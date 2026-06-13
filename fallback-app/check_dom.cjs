const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser to inspect DOM...');
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('http://localhost:8080/quick-links/', { waitUntil: 'networkidle0' });
    
    // Wait for React to mount
    console.log('Page loaded. Searching for Lumos toggle...');
    
    // Click Lumos button
    const toggled = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.trim() === 'Lumos' || b.textContent.trim() === 'Nox');
      if (btn) {
        if (btn.textContent.trim() === 'Lumos') {
          btn.click();
          return 'Clicked Lumos (switched to Light Mode)';
        }
        return 'Already in Light Mode (Nox visible)';
      }
      return 'Toggle button not found';
    });

    console.log(toggled);

    // Wait for CSS transitions
    await new Promise(r => setTimeout(r, 1000));

    console.log('Scanning computed styles for yellow colors...');
    const yellowElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const yellows = [];
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bg = style.backgroundColor;
        const border = style.borderColor;
        const shadow = style.boxShadow;
        
        // Target exact yellow RGBs or close variations of yellow
        const hasYellow = (str) => str.includes('rgb(212, 168, 67)') || 
                                   str.includes('rgb(245, 214, 123)') || 
                                   str.includes('rgba(212, 168, 67') || 
                                   str.includes('rgba(245, 214, 123');

        if (hasYellow(color) || hasYellow(bg) || hasYellow(border) || hasYellow(shadow)) {
          let reason = '';
          if (hasYellow(color)) reason += 'color ';
          if (hasYellow(bg)) reason += 'bg ';
          if (hasYellow(border)) reason += 'border ';
          if (hasYellow(shadow)) reason += 'shadow ';
          yellows.push(`Tag: ${el.tagName}, Class: ${el.className}, Reason: ${reason}`);
        }
      });
      return [...new Set(yellows)]; // unique
    });

    if (yellowElements.length > 0) {
      console.log('Found yellow elements:');
      yellowElements.forEach(el => console.log(' - ' + el));
    } else {
      console.log('No yellow elements found in the DOM computed styles!');
    }

    await browser.close();
  } catch (err) {
    console.error('Error inspecting DOM:', err.message);
  }
})();
