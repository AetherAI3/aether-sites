import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const sites = ['reworxct', 'ember-and-iron'];
for (const site of sites) {
  await cp(join(root, site), join(dist, site), { recursive: true });
}
await writeFile(join(dist, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta http-equiv="refresh" content="0;url=./reworxct/"><title>Aether Sites — Reworx Concept</title></head><body><p><a href="./reworxct/">Open the Reworx concept by Aether Sites</a></p></body></html>\n`);
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(join(dist, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
console.log(`Built ${sites.map(site => `dist/${site}/`).join(', ')} and the collection entrypoint.`);
