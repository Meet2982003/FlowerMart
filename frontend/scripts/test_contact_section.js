const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 960 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });

  // 1. Scroll directly to #contact
  await page.evaluate(() => {
    const el = document.querySelector('#contact');
    el?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/contact_section_initial.png'
  });
  console.log('Captured contact_section_initial.png');

  // 2. Scroll a bit more to trigger GSAP flower rotation & parallax
  await page.evaluate(() => {
    window.scrollBy({ top: 350, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/contact_section_scrolled.png'
  });
  console.log('Captured contact_section_scrolled.png');

  // 3. Test clicking a different flower theme (e.g. Blush Peony)
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.theme-pill'));
    const peonyBtn = buttons.find(b => b.textContent.includes('Blush Peony'));
    peonyBtn?.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({
    path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/contact_section_peony_theme.png'
  });
  console.log('Captured contact_section_peony_theme.png');

  // 4. Test clicking the hero flower to trigger the 360 spin animation
  await page.evaluate(() => {
    const flower = document.querySelector('.contact-hero-flower');
    flower?.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({
    path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/contact_flower_spin.png'
  });
  console.log('Captured contact_flower_spin.png');

  // 5. Test filling the form and submitting
  await page.evaluate(() => {
    const nameInput = document.querySelector('#contact-name');
    const emailInput = document.querySelector('#contact-email');
    const phoneInput = document.querySelector('#contact-phone');
    const messageInput = document.querySelector('#contact-message');

    if (nameInput) nameInput.value = 'Ananya Sharma';
    if (emailInput) emailInput.value = 'ananya@example.com';
    if (phoneInput) phoneInput.value = '+91 98250 99999';
    if (messageInput) messageInput.value = 'Looking for grand entrance mandap decor with orange dahlias and marigolds.';

    nameInput?.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput?.dispatchEvent(new Event('input', { bubbles: true }));
    phoneInput?.dispatchEvent(new Event('input', { bubbles: true }));
    messageInput?.dispatchEvent(new Event('input', { bubbles: true }));

    const form = document.querySelector('.contact-actual-form');
    form?.requestSubmit();
  });

  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: '/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/contact_form_success.png'
  });
  console.log('Captured contact_form_success.png');

  await browser.close();
  console.log('All tests completed successfully!');
})();
