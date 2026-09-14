import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const base = 'http://127.0.0.1:8090';
const server = spawn('python3', ['-m', 'http.server', '8090', '--directory', 'dist'], { stdio: 'ignore' });
let browser;
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch();
  await mkdir('artifacts/showcase', { recursive: true });
  const errors = [];
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    let posts = 0;
    let mode = 'error';
    let sent;
    await page.route('**/api/contact', async route => {
      posts++;
      sent = route.request().postDataJSON();
      const config = mode === 'success' ? { status: 200, body: JSON.stringify({ ok: true, id: 'test-saved-id' }) }
        : mode === 'missing-id' ? { status: 200, body: '{"ok":true}' }
        : mode === 'rate' ? { status: 429, body: '{"ok":false}' }
        : mode === 'offline' ? null
        : { status: 502, body: '{"ok":false}' };
      if (!config) { await route.abort(); return; }
      await route.fulfill({ ...config, contentType: 'application/json' });
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForSelector('.carousel-ready');
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.project').count(), 8);
    assert.equal(await page.locator('.project:not([aria-hidden])').count(), 1);
    assert.equal(await page.locator('.brand-name').first().textContent(), 'AETHER SITES');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'page overflow at ' + width);
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.locator('[data-carousel-step="1"]').click();
    assert.match(await page.locator('#style-count').textContent(), /2 \/ 8/);
    await page.locator('[data-carousel-step="1"]').press('End');
    assert.match(await page.locator('#style-count').textContent(), /8 \/ 8/);
    await page.locator('[data-carousel-step="1"]').press('Home');
    assert.match(await page.locator('#style-count').textContent(), /1 \/ 8/);
    for (let i = 0; i < 8; i++) {
      await page.locator('[data-carousel-index="' + i + '"]').click();
      await page.waitForTimeout(750);
      const geometry = await page.locator('.project[data-position=current]').evaluate(card => {
        const box = card.getBoundingClientRect();
        const stage = card.parentElement.getBoundingClientRect();
        const actions = card.querySelector('.project-actions').getBoundingClientRect();
        return { fits: box.bottom <= stage.bottom && box.left >= 0 && box.right <= innerWidth,
          actionsFit: actions.right <= box.right && actions.left >= box.left,
          links: [...card.querySelectorAll('a')].every(link => link.tabIndex >= 0) };
      });
      assert.ok(geometry.fits && geometry.actionsFit && geometry.links, 'card geometry at ' + width + ', slide ' + i);
    }
    assert.equal(await page.locator('.project[aria-hidden=true] a').evaluateAll(links => links.every(link => link.tabIndex === -1)), true);
    await page.locator('[data-carousel-index="4"]').click();
    await page.waitForTimeout(750);
    await page.locator('.project-carousel').screenshot({ path: 'artifacts/showcase/carousel-' + width + '.png' });
    if (width === 390) {
      const stage = page.locator('.projects');
      await stage.dispatchEvent('pointerdown', { isPrimary: true, button: 0, pointerId: 1, clientX: 250, clientY: 400 });
      await stage.dispatchEvent('pointerup', { isPrimary: true, button: 0, pointerId: 1, clientX: 120, clientY: 402 });
      assert.match(await page.locator('#style-count').textContent(), /6 \/ 8/);
      await page.waitForTimeout(500);
      await page.locator('[data-carousel-index="4"]').click();
    }
    await page.locator('.project[data-position=current] [data-select-style]').click();
    assert.equal(await page.locator('#contact-style').inputValue(), 'mach');
    await page.locator('#contact-name').fill('Test Visitor');
    await page.locator('#contact-email').fill('visitor@example.com');
    await page.locator('#contact-message').fill('We would like a site for our business.');
    const submit = page.locator('#contact-form [type=submit]');
    for (mode of ['error', 'missing-id', 'rate', 'offline']) {
      await submit.click();
      await page.waitForFunction(() => document.getElementById('contact-status').dataset.state === 'error');
      assert.equal(await page.locator('#contact-message').inputValue(), 'We would like a site for our business.');
      assert.equal(await submit.isDisabled(), false);
    }
    mode = 'success';
    await submit.click();
    await page.waitForFunction(() => document.getElementById('contact-status').dataset.state === 'success');
    assert.equal(posts, 5);
    assert.equal(sent.style, 'mach');
    assert.equal(await page.locator('#contact-message').inputValue(), '');
    await page.locator('#approach').scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    await page.locator('#approach').screenshot({ path: 'artifacts/showcase/process-' + width + '.png' });
    await page.locator('#contact').screenshot({ path: 'artifacts/showcase/contact-' + width + '.png' });
    await page.locator('.view-toggle').click();
    assert.equal(await page.locator('.project[aria-hidden=true]').count(), 0);
    assert.equal(await page.locator('.carousel-controls').isVisible(), false);
    await page.locator('.view-toggle').click();
    assert.equal(await page.locator('.project:not([aria-hidden])').count(), 1);
    await context.close();
    console.log('PASS Chromium ' + width + 'px: 8 cards, geometry, keyboard, style selection, submission failures and receipt, grid toggle.');
  }
  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const rp = await reduced.newPage();
  await rp.goto(base, { waitUntil: 'networkidle' });
  await rp.locator('#approach').scrollIntoViewIfNeeded();
  assert.equal(await rp.locator('.journey-playing').count(), 0);
  assert.equal(await rp.locator('.project[data-position=next]').isVisible(), false);
  await reduced.close();
  const fallback = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const fp = await fallback.newPage();
  await fp.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await fp.locator('.project:visible').count(), 8);
  assert.equal(await fp.locator('#contact-form').getAttribute('action'), '/api/contact');
  assert.equal(await fp.locator('#contact-form').getAttribute('method'), 'post');
  assert.equal(await fp.locator('#contact-form [type=submit]').isVisible(), true);
  await fallback.close();
  assert.deepEqual(errors, []);
  console.log('PASS reduced motion, no-JavaScript fallback, and zero browser runtime errors. Form responses mocked; no message sent.');
} finally {
  if (browser) await browser.close();
  server.kill();
}
