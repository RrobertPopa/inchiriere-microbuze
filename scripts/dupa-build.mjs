/**
 * După `vite build`: scrie dist/sitemap.xml și dist/robots.txt din lista de pagini.
 * Adresele sunt absolute și cu slash la final, exact ca în canonical (os/capabilities/seo/01-tehnic.md).
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGINI, SITE } from './pagini.mjs';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const azi = new Date().toISOString().slice(0, 10);
const adrese = ['', ...PAGINI.map((p) => p.slug + '/')];

for (const a of adrese) {
  if (!existsSync(join(DIST, a, 'index.html'))) throw new Error('lipsește din build: /' + a);
}

writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${adrese.map((a) => `  <url><loc>${SITE}/${a}</loc><lastmod>${azi}</lastmod></url>`).join('\n')}
</urlset>
`);

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

console.log(`dupa-build: sitemap.xml cu ${adrese.length} adrese + robots.txt`);
