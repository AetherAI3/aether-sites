import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path';

const digest = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 12);
const assetReference = /(<(?:link|script)\b[^>]*?\b(?:href|src)\s*=\s*)(["'])([^"']+)\2/gi;
const external = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

function localAsset(output, page, href) {
  if (external.test(href)) return null;
  const pathname = href.split(/[?#]/, 1)[0];
  if (!/\.(css|js)$/.test(pathname)) return null;
  const path = pathname.startsWith('/') ? resolve(output, '.' + pathname) : resolve(dirname(page), pathname);
  if (!path.startsWith(resolve(output) + sep)) throw new Error('Asset escapes output: ' + href);
  return path;
}

export async function versionStaticAssets(output, directories) {
  const versions = new Map();
  let pages = 0;
  for (const directory of directories) {
    for (const name of await readdir(join(output, directory))) {
      if (!name.endsWith('.html')) continue;
      const page = join(output, directory, name);
      let html = await readFile(page, 'utf8');
      const replacements = new Map();
      for (const match of html.matchAll(assetReference)) {
        const href = match[3];
        const path = localAsset(output, page, href);
        if (!path) continue;
        if (!versions.has(path)) {
          const bytes = await readFile(path);
          const extension = extname(path);
          const versioned = join(dirname(path), basename(path, extension) + '.' + digest(bytes) + extension);
          await writeFile(versioned, bytes);
          versions.set(path, versioned);
        }
        const versioned = versions.get(path);
        replacements.set(href, href.startsWith('/') ? '/' + relative(output, versioned).split(sep).join('/') : relative(dirname(page), versioned).split(sep).join('/'));
      }
      html = html.replace(assetReference, (match, prefix, quote, href) => replacements.has(href) ? prefix + quote + replacements.get(href) + quote : match);
      await writeFile(page, html);
      // Verify the delivered HTML references files matching their content IDs.
      for (const match of html.matchAll(assetReference)) {
        const path = localAsset(output, page, match[3]);
        if (!path) continue;
        const id = basename(path).match(/\.([a-f0-9]{12})\.(?:css|js)$/)?.[1];
        if (!id || id !== digest(await readFile(path))) throw new Error('Unversioned or mismatched delivered asset: ' + match[3]);
      }
      pages++;
    }
  }
  const showcaseCSS = await readFile(versions.get(join(output, 'styles.css')), 'utf8');
  for (const selector of ['.preview-wordmark', '.project-ember', '.project-gary', '.project-harbor']) {
    if (!showcaseCSS.includes(selector)) throw new Error('Missing showcase styles: ' + selector);
  }
  console.log(`Verified ${pages} static pages with ${versions.size} content-versioned stylesheets and scripts.`);
}
