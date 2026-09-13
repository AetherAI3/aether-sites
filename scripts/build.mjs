import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { versionStaticAssets } from './version-static-assets.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const execFileAsync = promisify(execFile);
const dist = join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const sites = ['reworxct', 'ember-and-iron', 'garys-hilltop', 'mach-detail', 'waterbury-aquarium', 'barbers-ink'];
for (const site of sites) {
  await cp(join(root, site), join(dist, site), { recursive: true });
}
await cp(join(root, 'index.html'), join(dist, 'index.html'));
await cp(join(root, 'styles.css'), join(dist, 'styles.css'));
await cp(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://aethersites.net/sitemap.xml\n');
await writeFile(join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://aethersites.net/</loc></url></urlset>\n');
await writeFile(join(dist, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n\n/reworxct/*\n  X-Robots-Tag: noindex, nofollow\n\n/ember-and-iron/*\n  X-Robots-Tag: noindex, nofollow\n\n/mach-detail/*\n  X-Robots-Tag: noindex, nofollow\n\n/garys-hilltop/*\n  X-Robots-Tag: noindex, nofollow\n\n/waterbury-aquarium/*\n  X-Robots-Tag: noindex, nofollow\n\n/barbers-ink/*\n  X-Robots-Tag: noindex, nofollow\n\n/harbor-and-hollow/*\n  X-Robots-Tag: noindex, nofollow\n');
const { stdout, stderr } = await execFileAsync(process.execPath, [
  join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
  'build', '--config', join(root, 'harbor-and-hollow', 'vite.config.ts'),
], { cwd: root, maxBuffer: 1024 * 1024 });
process.stdout.write(stdout);
process.stderr.write(stderr);
await versionStaticAssets(dist, ['.', ...sites]);
console.log(`Built ${sites.map(site => `dist/${site}/`).join(', ')}, dist/harbor-and-hollow/, and the collection entrypoint.`);
