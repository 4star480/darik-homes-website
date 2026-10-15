import { build as esbuild } from 'esbuild';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'DARIK-HOMES-DEPLOY');
const PHOTOS = path.join(ROOT, 'source', 'photos');
const CACHE = path.join(ROOT, '.tmp', 'img-cache');
const SITE = 'https://darikhomes.com';
const WIDTHS = [480, 800, 1200, 1800];

// Pixel boxes on the original file, for photos that arrived with borders.
const CROPS = {
  'apartment-render-colour': { left: 16, top: 92, width: 644, height: 488 },
};

const imagesOnly = process.argv.includes('--images');

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/* ---------- images ---------- */

const imageMeta = new Map();

async function processImage(name) {
  if (imageMeta.has(name)) return imageMeta.get(name);
  const src = path.join(PHOTOS, `${name}.jpg`);
  if (!(await exists(src))) throw new Error(`Missing photo source/photos/${name}.jpg`);

  const base = () => {
    const s = sharp(src).rotate();
    return CROPS[name] ? s.extract(CROPS[name]) : s;
  };
  const { width: fullW, height: fullH } = await base().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const widths = WIDTHS.filter((w) => w < fullW);
  if (widths.length === 0 || fullW - widths[widths.length - 1] > 120) widths.push(fullW);

  await mkdir(CACHE, { recursive: true });
  const srcTime = (await stat(src)).mtimeMs;
  const files = [];
  for (const w of widths) {
    const file = `${name}-${w}.webp`;
    const cached = path.join(CACHE, file);
    if (!(await exists(cached)) || (await stat(cached)).mtimeMs < srcTime) {
      await base().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(cached);
    }
    await copyFile(cached, path.join(OUT, 'assets', 'img', file));
    files.push({ file, w });
  }
  const meta = { files, width: fullW, height: fullH };
  imageMeta.set(name, meta);
  return meta;
}

function pick(meta, target) {
  return meta.files.find((f) => f.w >= target) || meta.files[meta.files.length - 1];
}

async function rewriteImages(html) {
  const tags = [...html.matchAll(/<img\b([^>]*?)\ssrc="@img\/([\w-]+)"([^>]*)>/g)];
  for (const m of tags) {
    const [whole, before, name, after] = m;
    const meta = await processImage(name);
    let attrs = `${before}${after}`.replace(/\s*\/$/, '');
    const eager = /\sdata-eager\b/.test(attrs);
    attrs = attrs.replace(/\sdata-eager\b/, '');
    const srcset = meta.files.map((f) => `/assets/img/${f.file} ${f.w}w`).join(', ');
    const fallback = pick(meta, 1200);
    const loading = eager ? ' fetchpriority="high"' : ' loading="lazy"';
    const tag = `<img${attrs} src="/assets/img/${fallback.file}" srcset="${srcset}" width="${meta.width}" height="${meta.height}"${loading} decoding="async">`;
    html = html.replace(whole, tag);
  }
  for (const m of [...html.matchAll(/@zoom\/([\w-]+)/g)]) {
    const meta = await processImage(m[1]);
    html = html.replace(m[0], `/assets/img/${meta.files[meta.files.length - 1].file}`);
  }
  html = html.replace(/<button type="button" data-zoom="([^"]+)" data-caption="([^"]+)">/g, (_, src, cap) =>
    `<button type="button" data-zoom="${src}" data-caption="${cap}" aria-label="View full size: ${cap}">`);
  return html;
}

async function makeIcons() {
  const svg = await readFile(path.join(SRC, 'static', 'favicon.svg'));
  await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(path.join(OUT, 'favicon-32.png'));
  const pad = (size, inner) =>
    sharp(svg, { density: 384 })
      .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: (size - inner) >> 1,
        bottom: size - inner - ((size - inner) >> 1),
        left: (size - inner) >> 1,
        right: size - inner - ((size - inner) >> 1),
        background: '#ffffff',
      })
      .flatten({ background: '#ffffff' })
      .png();
  await pad(180, 140).toFile(path.join(OUT, 'apple-touch-icon.png'));
  await pad(192, 150).toFile(path.join(OUT, 'icon-192.png'));
  await pad(512, 400).toFile(path.join(OUT, 'icon-512.png'));

  const og = sharp(path.join(PHOTOS, 'kaura-block-complete-dusk.jpg'))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' });
  await og.jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, 'assets', 'img', 'og-darik-homes.jpg'));
}

/* ---------- pages ---------- */

const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const ORG = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'HomeAndConstructionBusiness'],
  '@id': `${SITE}/#organization`,
  name: 'DARIK HOMES LTD',
  legalName: 'Darik Homes Limited',
  slogan: 'Where dreams become reality',
  url: `${SITE}/`,
  logo: `${SITE}/icon-512.png`,
  image: `${SITE}/assets/img/og-darik-homes.jpg`,
  email: 'info@darikhomes.com',
  telephone: '+2348057857418',
  foundingDate: '2019',
  identifier: { '@type': 'PropertyValue', propertyID: 'CAC RC', value: '1633288' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plot 797, Cadastral Zone B11, after the second gate of Prince and Princess Estate',
    addressLocality: 'Kaura District',
    addressRegion: 'FCT Abuja',
    addressCountry: 'NG',
  },
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+2348057857418', contactType: 'sales', areaServed: 'NG' },
    { '@type': 'ContactPoint', telephone: '+2348063264491', contactType: 'customer service', areaServed: 'NG' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '16:00' },
  ],
  areaServed: { '@type': 'City', name: 'Abuja' },
  founder: { '@type': 'Person', name: 'Babatunde Kazeem Adeleke', jobTitle: 'Managing Director and Chief Executive Officer' },
};

async function loadPartials() {
  const dir = path.join(SRC, 'partials');
  const partials = {};
  for (const f of await readdir(dir)) {
    if (f.endsWith('.html')) partials[f.slice(0, -5)] = await readFile(path.join(dir, f), 'utf8');
  }
  return partials;
}

function render(template, page, partials, version) {
  let html = template;
  for (let depth = 0; depth < 5 && /\{\{>\s*[\w-]+\s*\}\}/.test(html); depth++) {
    html = html.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
      if (!(name in partials)) throw new Error(`Unknown partial ${name}`);
      return partials[name];
    });
  }
  const raw = {
    jsonld: page.jsonld ? `<script type="application/ld+json">${JSON.stringify(ORG)}</script>` : '',
    robotsMeta: page.noindex ? '<meta name="robots" content="noindex">' : '',
    extraHead: '',
  };
  const vars = { site: SITE, version, headerClass: '', ...page };
  html = html.replace(/\{\{current:([\w-]+)\}\}/g, (_, nav) => (page.nav === nav ? 'aria-current="page"' : ''));
  html = html.replace(/\{\{([\w]+)\}\}/g, (_, key) => {
    if (key in raw) return raw[key];
    if (!(key in vars)) throw new Error(`Unknown variable {{${key}}} in ${page.path}`);
    return escapeHtml(vars[key]);
  });
  return html.replace(/\s+>/g, '>').replace(/\n\s*\n+/g, '\n');
}

async function buildPages(version) {
  const partials = await loadPartials();
  const dir = path.join(SRC, 'pages');
  const pages = [];
  for (const f of (await readdir(dir)).filter((x) => x.endsWith('.html'))) {
    const source = await readFile(path.join(dir, f), 'utf8');
    const match = source.match(/^<!--@page\s*([\s\S]*?)-->\s*/);
    if (!match) throw new Error(`${f} has no @page header`);
    const page = JSON.parse(match[1]);
    let html = render(source.slice(match[0].length), page, partials, version);
    html = await rewriteImages(html);
    await writeFile(path.join(OUT, f), html);
    pages.push({ file: f, ...page });
  }
  return pages;
}

async function writeMeta(pages) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  await writeFile(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  await writeFile(
    path.join(OUT, 'site.webmanifest'),
    JSON.stringify(
      {
        name: 'DARIK HOMES LTD',
        short_name: 'Darik Homes',
        start_url: '/',
        display: 'standalone',
        background_color: '#f7f5f0',
        theme_color: '#0b2340',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2,
    ),
  );
}

async function copyStatic() {
  const dir = path.join(SRC, 'static');
  for (const f of await readdir(dir)) await copyFile(path.join(dir, f), path.join(OUT, f));
  const fonts = [
    ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin-wght-normal.woff2'],
    ['@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2', 'fraunces-latin-wght-normal.woff2'],
    ['@fontsource-variable/fraunces/files/fraunces-latin-wght-italic.woff2', 'fraunces-latin-wght-italic.woff2'],
  ];
  for (const [from, to] of fonts) {
    await copyFile(path.join(ROOT, 'node_modules', from), path.join(OUT, 'assets', 'fonts', to));
  }
}

async function bundle() {
  await esbuild({
    entryPoints: [path.join(SRC, 'js', 'site.js')],
    outdir: path.join(OUT, 'assets', 'js'),
    bundle: true,
    splitting: true,
    format: 'esm',
    target: ['es2020', 'safari14'],
    minify: true,
    chunkNames: 'chunks/[name]-[hash]',
    legalComments: 'none',
    logLevel: 'warning',
  });
  await esbuild({
    entryPoints: [path.join(SRC, 'css', 'site.css')],
    outdir: path.join(OUT, 'assets', 'css'),
    bundle: true,
    minify: true,
    target: ['safari14', 'chrome100', 'firefox100'],
    external: ['/assets/*'],
    logLevel: 'warning',
  });
}

async function main() {
  const t0 = Date.now();
  if (!imagesOnly && (await exists(OUT))) {
    for (const entry of await readdir(OUT)) await rm(path.join(OUT, entry), { recursive: true, force: true });
  }
  for (const d of ['assets/img', 'assets/js', 'assets/css', 'assets/fonts']) {
    await mkdir(path.join(OUT, d), { recursive: true });
  }
  if (imagesOnly) {
    for (const f of await readdir(PHOTOS)) if (f.endsWith('.jpg')) await processImage(f.slice(0, -4));
    console.log(`Processed ${imageMeta.size} photos`);
    return;
  }
  await bundle();
  const css = await readFile(path.join(OUT, 'assets', 'css', 'site.css'));
  const js = await readFile(path.join(OUT, 'assets', 'js', 'site.js'));
  const version = createHash('sha1').update(css).update(js).digest('hex').slice(0, 10);
  await copyStatic();
  await makeIcons();
  const pages = await buildPages(version);
  await writeMeta(pages);
  console.log(`Built ${pages.length} pages and ${imageMeta.size} photos into DARIK-HOMES-DEPLOY in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
