/**
 * Scrie <slug>/index.html pentru fiecare pagină din scripts/pagini.mjs, ÎNAINTE de `vite build` (și de `vite` în dev).
 * Fiecare pagină e HTML static complet: titlu, descriere, H1, text, canonical și JSON-LD sunt deja în HTML,
 * nu umplute din JS — „ce vede curl e ce vede Google” (os/capabilities/seo/01-tehnic.md).
 * Fișierele generate sunt în .gitignore: sursa unică e pagini.mjs.
 */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGINI, SITE, ORAS } from './pagini.mjs';

const RAD = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const MASINI = {
  sprinter: { href: '../mercedes-sprinter-20-locuri/', nume: 'Mercedes-Benz Sprinter', locuri: '20', foto: '../foto/sprinter-alb-900.jpg', w: 900, h: 675,
    alt: 'Microbuz Mercedes-Benz Sprinter alb, cu ușa laterală deschisă', nota: 'până la 20 de pasageri + șofer' },
  vito: { href: '../mercedes-vito-8-1/', nume: 'Mercedes-Benz Vito', locuri: '8', foto: '../foto/vito-900.jpg', w: 900, h: 675,
    alt: 'Mercedes-Benz Vito gri pentru pasageri, văzut din față', nota: '8 pasageri + șofer' },
  trafic: { href: '../renault-trafic-8-1/', nume: 'Renault Trafic', locuri: '8', foto: '../foto/trafic-alb.jpg', w: 1024, h: 768,
    alt: 'Renault Trafic alb pentru pasageri, cu geamuri pe toată lungimea', nota: '8 pasageri + șofer' }
};

function masiniHtml(p) {
  const care = p.masina === 'ambele' ? ['trafic', 'vito', 'sprinter'] : [p.masina];
  return `
      <div class="pg-masini">
${care.map((k) => {
    const m = MASINI[k];
    const link = p.slug === m.href.replace(/\.\.\/|\//g, '') ? '' : ` <a href="${m.href}">Despre ${m.nume.replace('-Benz', '')} →</a>`;
    return `        <figure class="placa pg-masina">
          <img loading="lazy" src="${m.foto}" width="${m.w}" height="${m.h}" alt="${esc(m.alt)}">
          <figcaption><span>${m.nume}</span><span class="date">${m.nota}</span></figcaption>
          ${link ? `<p class="pg-masina-link">${link.trim()}</p>` : ''}
        </figure>`;
  }).join('\n')}
      </div>`;
}

function bloc(b) {
  const corp = b.lista
    ? `<ul class="pg-lista">${b.lista.map((l) => `\n          <li>${esc(l)}</li>`).join('')}\n        </ul>`
    : `<p>${esc(b.text)}</p>`;
  return `
      <section class="pg-bloc">
        <h2 class="pg-h2">${esc(b.titlu)}</h2>
        ${corp}
      </section>`;
}

function jsonld(p, url) {
  const firma = {
    '@type': 'LocalBusiness', '@id': SITE + '/#firma', name: 'Roby Tours', url: SITE + '/',
    telephone: '+40724436295', email: 'contact@inchiriere-microbuze.ro', areaServed: 'RO',
    ...(ORAS ? { address: { '@type': 'PostalAddress', addressLocality: ORAS, addressCountry: 'RO' } } : {})
  };
  return [
    { '@context': 'https://schema.org', '@type': 'Service', name: p.h1, serviceType: 'Închiriere microbuz cu șofer',
      description: p.descriere, url, provider: firma, areaServed: { '@type': 'Country', name: 'România' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Acasă', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: p.eticheta.split(' · ').pop(), item: url }] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.intrebari.map((i) => ({
      '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })) }
  ];
}

const meniu = `
      <a href="../#flota">Flota</a>
      <a href="../#trasee">Servicii</a>
      <a href="../#cum">Cum lucrăm</a>`;

function pagina(p) {
  const url = `${SITE}/${p.slug}/`;
  const altele = PAGINI.filter((x) => x.slug !== p.slug);
  return `<!doctype html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(p.titlu)}</title>
  <meta name="description" content="${esc(p.descriere)}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#efe9dd">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ro_RO">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(p.titlu)}">
  <meta property="og:description" content="${esc(p.descriere)}">
  <meta property="og:image" content="${SITE}/foto/sprintere-albe-900.jpg">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
${jsonld(p, url).map((j) => `  <script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body class="pg" data-scop="${esc(p.scop)}">
  <a class="skip" href="#continut">Sari la conținut</a>

  <header class="antet" id="antet">
    <a class="marca" href="../" aria-label="Roby Tours, prima pagină">
      <span class="marca-nume">Roby Tours</span>
      <span class="marca-sub">microbuze cu șofer</span>
    </a>
    <nav class="nav" aria-label="Principal">${meniu}
    </nav>
    <div class="antet-actiuni">
      <a class="antet-tel js-tel" href="tel:+40724436295"><span class="js-tel-label">0724 436 295</span></a>
      <a class="buton buton-mic" href="#oferta">Cere ofertă</a>
      <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="meniu" aria-label="Deschide meniul">
        <span></span><span></span>
      </button>
    </div>
  </header>

  <div class="meniu" id="meniu" hidden>
    <nav class="meniu-nav" aria-label="Meniu mobil">${meniu}
      <a href="#oferta">Cere ofertă</a>
    </nav>
    <div class="meniu-contact">
      <a class="buton buton-plin js-tel" href="tel:+40724436295">Sună · <span class="js-tel-label">0724 436 295</span></a>
      <a class="buton buton-contur js-wa" href="https://wa.me/40724436295">Scrie pe WhatsApp</a>
      <p class="meniu-nota">Răspundem zilnic, inclusiv în weekend.</p>
    </div>
  </div>

  <main id="continut" class="pg-main">
    <nav class="pg-fir date" aria-label="Unde sunteți"><a href="../">Acasă</a> <span aria-hidden="true">/</span> ${esc(p.eticheta.split(' · ').pop())}</nav>

    <header class="pg-cap">
      <p class="eticheta">${esc(p.eticheta)}</p>
      <h1 class="pg-h1">${esc(p.h1)}</h1>
      <p class="pg-lead">${esc(p.lead)}</p>
      <div class="hero-cta">
        <a class="buton buton-plin js-wa" href="https://wa.me/40724436295">Cere ofertă pe WhatsApp</a>
        <a class="buton buton-contur js-tel" href="tel:+40724436295">Sună · <span class="js-tel-label">0724 436 295</span></a>
      </div>
      <p class="hero-nota">Preț fix, spus înainte de plecare.</p>
    </header>

    <div class="pg-corp">
      <div class="pg-text">${p.blocuri.map(bloc).join('')}

      <section class="pg-bloc pg-faq">
        <h2 class="pg-h2">Întrebări frecvente</h2>
${p.intrebari.map((i) => `        <details>
          <summary>${esc(i.q)}</summary>
          <p>${esc(i.a)}</p>
        </details>`).join('\n')}
      </section>
      </div>
${masiniHtml(p)}
    </div>

    <section class="pg-oferta" id="oferta" aria-labelledby="oferta-titlu">
      <h2 id="oferta-titlu" class="titlu-2">Cereți oferta.</h2>
      <p>Spuneți-ne de unde plecați, unde mergeți, când și câți sunteți. Răspundem cu mașina potrivită și prețul.</p>
      <div class="hero-cta">
        <a class="buton buton-plin js-wa" href="https://wa.me/40724436295">Scrie pe WhatsApp</a>
        <a class="buton buton-contur js-tel" href="tel:+40724436295">Sună · <span class="js-tel-label">0724 436 295</span></a>
      </div>
      <p class="oferta-mic">Telefon și WhatsApp · zilnic, inclusiv în weekend · sau <a href="../#oferta">formularul complet</a></p>
    </section>

    <section class="pg-altele" aria-labelledby="altele-titlu">
      <p class="eticheta" id="altele-titlu">Ce mai facem</p>
      <ul class="rute">
${altele.map((x) => `        <li><a class="ruta" href="../${x.slug}/">
          <span class="ruta-nume">${esc(x.h1)}</span>
          <span class="ruta-desc">${esc(x.lead.split('. ')[0].replace(/\.$/, ''))}.</span>
          <span class="ruta-sageata" aria-hidden="true">→</span></a></li>`).join('\n')}
      </ul>
    </section>
  </main>

  <footer class="subsol">
    <p class="subsol-marca">Roby Tours</p>
    <div class="subsol-grila">
      <div>
        <p>Închiriere microbuze cu șofer. Mercedes Sprinter, Mercedes Vito și Renault Trafic, prin România și în Europa.</p>
      </div>
      <div>
        <a class="js-tel" href="tel:+40724436295"><span class="js-tel-label">0724 436 295</span></a>
        <a class="js-wa" href="https://wa.me/40724436295">WhatsApp</a>
        <a class="js-mail" href="mailto:contact@inchiriere-microbuze.ro">contact@inchiriere-microbuze.ro</a>
      </div>
      <div>
${PAGINI.map((x) => `        <a href="../${x.slug}/">${esc(x.eticheta.split(' · ').pop())}</a>`).join('\n')}
      </div>
    </div>
    <p class="copy">© <span id="an">2026</span> Roby Tours</p>
  </footer>

  <div class="bara-mobil" id="bara-mobil">
    <a class="js-tel" href="tel:+40724436295">Sună</a>
    <a class="js-wa" href="https://wa.me/40724436295">WhatsApp</a>
  </div>

  <script type="module" src="../src/pagina.js"></script>
</body>
</html>
`;
}

// verificări care opresc build-ul dacă o pagină încalcă regulile din seo/01-tehnic.md
const slugs = new Set();
for (const p of PAGINI) {
  if (slugs.has(p.slug)) throw new Error('slug duplicat: ' + p.slug);
  slugs.add(p.slug);
  if (p.titlu.length > 62) throw new Error(`titlu prea lung (${p.titlu.length}): ${p.titlu}`);
  if (p.descriere.length < 70 || p.descriere.length > 160) throw new Error(`descriere ${p.descriere.length} caractere: ${p.slug}`);
  const dir = join(RAD, p.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), pagina(p));
}

// .gitignore ține pasul cu lista de pagini
const gi = join(RAD, '.gitignore');
let txt = ''; try { txt = readFileSync(gi, 'utf8'); } catch {}
const marcaj = '# pagini generate de scripts/genereaza.mjs';
const bloc0 = [marcaj, ...PAGINI.map((p) => `/${p.slug}/`), '# sfârșit pagini generate'].join('\n');
txt = txt.includes(marcaj) ? txt.replace(/# pagini generate[\s\S]*?# sfârșit pagini generate/, bloc0) : (txt.trimEnd() + '\n\n' + bloc0 + '\n').trimStart();
writeFileSync(gi, txt);

console.log(`genereaza: ${PAGINI.length} pagini (${PAGINI.map((p) => p.slug).join(', ')})`);
