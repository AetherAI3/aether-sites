import test from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../functions/api/contact.js';

const payload = { name: 'Test visitor', email: 'visitor@example.com', company: 'Example studio', style: 'mach', message: 'Please help us build a website.', website: '' };
const request = (body = payload, headers = {}, method = 'POST') => new Request('https://aethersites.net/api/contact', {
  method, headers: { Origin: 'https://aethersites.net', 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
  ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
});
const saved = () => Promise.resolve(Response.json({ ok: true, id: 'saved-inquiry-id' }));
const never = () => { throw new Error('Invalid requests must not contact the service'); };

test('forwards the selected style to the existing contact service and requires a receipt', async () => {
  let calls = 0;
  const result = await handleContact(request(payload, { 'CF-Connecting-IP': '203.0.113.7', 'X-Forwarded-For': 'spoofed' }), async (url, options) => {
    calls++;
    assert.equal(url, 'https://cjjcdwrnpzwlvradbros.supabase.co/functions/v1/contact-submit');
    assert.equal(options.headers.Origin, 'https://aethersites.net');
    assert.equal(options.headers['X-Forwarded-For'], '203.0.113.7');
    const body = JSON.parse(options.body);
    assert.equal(body.intent, 'sales');
    assert.equal(body.product, 'site_wide');
    assert.match(body.message, /Style: Mach Detail/);
    assert.match(body.message, /Please help us build a website/);
    assert.equal(body.source_cta, 'aether_sites_contact');
    return saved();
  });
  assert.equal(calls, 1);
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true, id: 'saved-inquiry-id' });
  assert.equal(result.headers.get('cache-control'), 'no-store');
});

test('rejects incomplete, oversized, invalid, and bot submissions without forwarding', async () => {
  for (const body of [null, [], {}, { ...payload, name: ' ' }, { ...payload, email: 'invalid' }, { ...payload, message: 'short' }, { ...payload, style: 'unknown' }, { ...payload, website: 'filled' }, { ...payload, name: 'x'.repeat(121) }, { ...payload, message: 'x'.repeat(3001) }]) {
    assert.equal((await handleContact(request(body), never)).status, 422);
  }
  assert.equal((await handleContact(request({ ...payload, message: 'x'.repeat(17000) }), never)).status, 413);
  assert.equal((await handleContact(request(payload, { Origin: 'https://other.example' }), never)).status, 403);
  assert.equal((await handleContact(request(payload, { Origin: '' }), never)).status, 403);
  assert.equal((await handleContact(request(payload, { 'Content-Type': 'text/plain' }), never)).status, 415);
  assert.equal((await handleContact(request(payload, {}, 'GET'), never)).status, 405);
});

test('does not accept HTML, a missing ID, false success, or upstream failure as a saved inquiry', async () => {
  for (const response of [new Response('<html>fallback</html>'), Response.json({ ok: true }), Response.json({ ok: false, id: 'id' }), Response.json({ ok: true, id: 'id' }, { status: 500 })]) {
    const result = await handleContact(request(), async () => response);
    assert.equal(result.status, 502);
    assert.equal((await result.json()).ok, false);
  }
  const network = await handleContact(request(), async () => { throw new Error('offline'); });
  assert.equal(network.status, 502);
  assert.equal((await handleContact(request(), async () => Response.json({ ok: false }, { status: 429 }))).status, 429);
});

test('native HTML form posts work and never reflect personal information in the response', async () => {
  const req = new Request('https://aethersites.net/api/contact', {
    method: 'POST', headers: { Origin: 'https://aethersites.net', 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/html' },
    body: new URLSearchParams(payload),
  });
  const result = await handleContact(req, saved);
  assert.equal(result.status, 200);
  assert.match(result.headers.get('content-type'), /text\/html/);
  const html = await result.text();
  assert.match(html, /Your inquiry is saved/);
  assert.ok(!html.includes(payload.email));
  assert.match(html, /href="\/#contact"/);
});

test('does not forward a caller-supplied X-Forwarded-For without the edge header', async () => {
  await handleContact(request(payload, { 'X-Forwarded-For': 'spoofed' }), async (_url, options) => {
    assert.equal(options.headers['X-Forwarded-For'], undefined);
    return saved();
  });
});
