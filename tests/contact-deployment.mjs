// Verify deployed routing and the public service with invalid input only.
// An empty object fails name validation before a row or notification is created.
import assert from 'node:assert/strict';

const repo = process.env.GITHUB_REPOSITORY;
const sha = process.env.TARGET_SHA;
assert.match(repo || '', /^[\w.-]+\/[\w.-]+$/);
assert.match(sha || '', /^[a-f0-9]{40}$/);
let preview;
for (let attempt = 0; attempt < 8; attempt++) {
  const response = await fetch('https://api.github.com/repos/' + repo + '/commits/' + sha + '/check-runs', {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Aether-Sites-deployment-check' },
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200, 'Cannot read deployment status');
  const data = await response.json();
  const pages = data.check_runs.find(check => check.name === 'Cloudflare Pages' && check.head_sha === sha);
  if (pages?.status === 'completed') {
    assert.equal(pages.conclusion, 'success', 'Cloudflare deployment failed');
    preview = pages.output?.summary?.match(/https:\/\/[a-z0-9-]+\.aether-sites\.pages\.dev/)?.[0];
    break;
  }
  await new Promise(resolve => setTimeout(resolve, 10000));
}
assert.ok(preview, 'No successful Cloudflare preview for this commit');
const home = await fetch(preview, { signal: AbortSignal.timeout(15000) });
assert.equal(home.status, 200);
assert.match(await home.text(), /id="contact-form"/, 'Deployed homepage is missing the contact form');
const method = await fetch(preview + '/api/contact', { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
assert.equal(method.status, 405, 'Contact route must reach the Pages Function');
const local = await fetch(preview + '/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Origin: preview },
  body: '{}', signal: AbortSignal.timeout(15000),
});
assert.equal(local.status, 422, 'Deployed form validation is not active');
assert.equal((await local.json()).ok, false);
const upstream = await fetch('https://cjjcdwrnpzwlvradbros.supabase.co/functions/v1/contact-submit', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://aethersites.net' },
  body: '{}', signal: AbortSignal.timeout(15000),
});
assert.equal(upstream.status, 422, 'Existing Aether contact service is unavailable or requires unexpected authentication');
const rejection = await upstream.json();
assert.equal(rejection.ok, false);
assert.equal(rejection.error, 'name');
console.log('PASS exact-commit deployed homepage and contact route: GET 405, empty POST 422.');
console.log('PASS existing Aether contact service: empty POST rejected at name validation (422). No inquiry or notification created.');
console.log('Verified preview: ' + preview);
