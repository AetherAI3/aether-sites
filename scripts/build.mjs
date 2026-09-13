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
await cp(join(root, 'index.html'), join(dist, 'index.html'));
await cp(join(root, 'styles.css'), join(dist, 'styles.css'));
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://aethersites.net/sitemap.xml\n');
await writeFile(join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://aethersites.net/</loc></url></urlset>\n');
await writeFile(join(dist, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n\n/reworxct/*\n  X-Robots-Tag: noindex, nofollow\n\n/ember-and-iron/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log(`Built ${sites.map(site => `dist/${site}/`).join(', ')} and the collection entrypoint.`);
