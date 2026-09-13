import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { shopDay, addDays, validateRequest, buildRequest } from '../mach-detail/js/request.js';
const now=new Date('2026-09-13T12:00:00Z');
const good={name:'Test visitor',vehicle:'2020 test vehicle',service:'standard',date:'2026-09-14',window:'morning',notes:'Interior refresh'};
test('dates follow the shop across visitor time zones and New York DST',()=>{
 assert.equal(shopDay(new Date('2026-09-14T02:00:00Z')),'2026-09-13');
 assert.equal(shopDay(new Date('2026-12-14T04:30:00Z')),'2026-12-13');
 assert.equal(shopDay(new Date('2026-03-08T07:01:00Z')),'2026-03-08');
 assert.equal(addDays('2026-03-07',2),'2026-03-09');
});
test('request date rejects closed Sunday, same day, past, invalid date and >90 days',()=>{
 for(const date of ['2026-09-20','2026-09-13','2026-09-12','2026-02-30','not-a-date',addDays(shopDay(now),91)]) assert.ok(validateRequest({...good,date},now).error,date);
 assert.ok(validateRequest({...good,date:'2026-09-19'},now).data);
});
test('only known services and arrival windows enter a request',()=>{
 for(const service of ['fake','constructor','toString'])assert.ok(validateRequest({...good,service},now).error);
 assert.ok(validateRequest({...good,window:'midnight'},now).error);
 assert.ok(validateRequest({...good,notes:'x'.repeat(601)},now).error);
 assert.ok(validateRequest({...good,name:'a\nb'},now).error);
});
test('draft preserves visitor content as plain text without claiming a reservation',()=>{
 const checked=validateRequest({...good,name:' Test visitor ',notes:'<img onerror=alert(1)> & paint'},now);
 assert.equal(checked.data.name,'Test visitor');
 const draft=buildRequest(checked.data);
 assert.ok(draft.includes('<img onerror=alert(1)> & paint'));
 assert.ok(draft.includes('Please confirm availability, pricing'));
 assert.ok(!draft.includes('confirmed appointment'));
});
test('static form is protected before JS, and no remote booking or SMS success is simulated',()=>{
 const html=readFileSync(new URL('../mach-detail/index.html',import.meta.url),'utf8');
 assert.match(html,/<form[^>]+method="post"/);
 assert.match(html,/<fieldset id="booking-fields" disabled>/);
 assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
 const script=readFileSync(new URL('../mach-detail/js/booking.js',import.meta.url),'utf8');
 assert.ok(script.indexOf("form.addEventListener('submit'")<script.indexOf('fields.disabled=false'));
 for(const phrase of ['SLOT RESERVED','SMS confirmation + 24h reminder scheduled','ledger: aether-cloud // synced','(555)'])assert.ok(!html.includes(phrase));
 assert.doesNotMatch(script,/\bfetch\s*\(|localStorage|sessionStorage|innerHTML/);
});
