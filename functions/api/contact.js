// Same-origin Pages endpoint for Aether's existing public contact service.
// No provider credentials in the browser, no new inbox, and no invented receipt.
const CONTACT_URL = 'https://cjjcdwrnpzwlvradbros.supabase.co/functions/v1/contact-submit';
const MAX_BYTES = 16384;
const STYLES = {
  reworx: 'Reworx', ember: 'Ember & Iron', harbor: 'Harbor & Hollow',
  gary: 'Gary’s Hilltop', mach: 'Mach Detail', barbers: 'Barber’s Ink',
  waterbury: 'Waterbury Aquarium', empanadas: 'Empanada’s',
  custom: 'Something completely new', '': 'Help me choose',
};
const MESSAGES = {
  saved: 'Thank you. Your inquiry is saved. We’ll reply by email to discuss your site.',
  invalid: 'Please check your name, email, and project details, then try again.',
  unavailable: 'We couldn’t confirm that your inquiry was saved. Please try again or email aetherai@aethersystems.net.',
  limited: 'Today’s inquiry limit has been reached. Please email aetherai@aethersystems.net.',
};
function reply(request, status, data) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  if (request.headers.get('accept')?.includes('text/html')) {
    const message = status === 200 ? MESSAGES.saved : status === 429 ? MESSAGES.limited : status < 500 ? MESSAGES.invalid : MESSAGES.unavailable;
    return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Aether Sites — Inquiry</title><body style="margin:0;background:#101110;color:#eeeae2;font:18px/1.7 system-ui;padding:10vh 8vw;max-width:680px"><h1>Aether Sites</h1><p>' + message + '</p><p><a style="color:#c9fd61" href="/#contact">Back to Aether Sites</a></p><p><a style="color:#c9fd61" href="mailto:aetherai@aethersystems.net">Email Aether</a></p></body></html>', { status, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
  }
  return new Response(JSON.stringify(data), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
}
async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new Error('too_large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new Error('too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
export async function handleContact(request, fetcher = fetch) {
  if (request.method !== 'POST') return reply(request, 405, { ok: false, error: 'method_not_allowed' });
  const origin = request.headers.get('origin');
  if (origin !== new URL(request.url).origin) return reply(request, 403, { ok: false, error: 'origin' });
  const type = request.headers.get('content-type')?.split(';')[0].trim();
  if (!['application/json', 'application/x-www-form-urlencoded'].includes(type)) return reply(request, 415, { ok: false, error: 'content_type' });
  let body;
  try {
    const raw = await readBody(request);
    body = type === 'application/json' ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw));
  } catch (error) { return reply(request, error.message === 'too_large' ? 413 : 400, { ok: false, error: 'invalid_body' }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(request, 422, { ok: false, error: 'invalid_fields' });
  const value = key => typeof body[key] === 'string' ? body[key].trim() : '';
  const name = value('name'), email = value('email'), company = value('company'), message = value('message'), style = value('style');
  if (value('website')) return reply(request, 422, { ok: false, error: 'invalid_fields' });
  if (!name || name.length > 120 || email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || company.length > 160 || message.length < 10 || message.length > 3000 || !Object.hasOwn(STYLES, style)) {
    return reply(request, 422, { ok: false, error: 'invalid_fields' });
  }
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json', Origin: origin };
  // Cloudflare sets this at the edge. Never trust the incoming X-Forwarded-For.
  const clientIP = request.headers.get('CF-Connecting-IP');
  if (clientIP) headers['X-Forwarded-For'] = clientIP;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const upstream = await fetcher(CONTACT_URL, {
      method: 'POST', headers, redirect: 'error', signal: controller.signal,
      body: JSON.stringify({
        intent: 'sales', product: 'site_wide', name, email, company: company || null,
        message: 'Aether Sites website inquiry\nStyle: ' + STYLES[style] + '\n\n' + message,
        source_path: 'https://aethersites.net/', source_cta: 'aether_sites_contact', honeypot: '',
      }),
    });
    const data = await upstream.json().catch(() => null);
    if (upstream.status === 429) return reply(request, 429, { ok: false, error: 'rate_limited' });
    if (!upstream.ok || data?.ok !== true || typeof data.id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(data.id)) {
      return reply(request, 502, { ok: false, error: 'submission_unconfirmed' });
    }
    return reply(request, 200, { ok: true, id: data.id });
  } catch { return reply(request, 502, { ok: false, error: 'submission_unconfirmed' }); }
  finally { clearTimeout(timer); }
}
export const onRequest = ({ request }) => handleContact(request);
