import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'DARIK-HOMES-DEPLOY');
const problems = [];
const fileExists = (p) => stat(p).then(() => true, () => false);

const pages = (await readdir(OUT)).filter((f) => f.endsWith('.html'));
for (const page of pages) {
  const html = await readFile(path.join(OUT, page), 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(m[0])) problems.push(`${page}: <img> without alt: ${m[0].slice(0, 90)}`);
    if (/\ssrc="/.test(m[0]) && !/\swidth="\d+"/.test(m[0])) problems.push(`${page}: <img> without width: ${m[0].slice(0, 90)}`);
  }
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const [p, hash] = ref.split('#');
    if (!p) {
      if (hash && !ids.has(hash)) problems.push(`${page}: missing anchor #${hash}`);
      continue;
    }
    const clean = p.split('?')[0];
    const target = path.join(OUT, clean === '/' ? 'index.html' : clean);
    if (!(await fileExists(target))) problems.push(`${page}: broken link ${ref}`);
    if (hash && clean.endsWith('.html')) {
      const other = await readFile(target, 'utf8').catch(() => '');
      if (!other.includes(`id="${hash}"`)) problems.push(`${page}: ${clean} has no #${hash}`);
    }
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(' ')[0];
      if (!(await fileExists(path.join(OUT, url)))) problems.push(`${page}: missing srcset file ${url}`);
    }
  }
  for (const m of html.matchAll(/data-zoom="([^"]+)"/g)) {
    if (!(await fileExists(path.join(OUT, m[1])))) problems.push(`${page}: missing zoom file ${m[1]}`);
  }
  if (/\{\{|@img\/|@zoom\//.test(html)) problems.push(`${page}: unrendered template token`);
  if ((html.match(/<h1\b/g) || []).length !== 1) problems.push(`${page}: expected exactly one <h1>`);
  if (/\u2014/.test(html)) problems.push(`${page}: contains an em dash`);
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`Checked ${pages.length} pages: links, anchors, images and alt text are fine.`);
