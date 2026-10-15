import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'DARIK-HOMES-DEPLOY');
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(urlPath) {
  let p = path.join(ROOT, decodeURIComponent(urlPath));
  if (!p.startsWith(ROOT)) return null;
  try {
    if ((await stat(p)).isDirectory()) p = path.join(p, 'index.html');
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

createServer((req, res) => {
  handle(req, res).catch((err) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(String(err.message || err));
  });
}).listen(PORT, () => {
  console.log(`Darik Homes preview: http://localhost:${PORT}/`);
});

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST') {
    res.writeHead(303, { Location: '/thank-you.html' });
    return res.end();
  }
  const file = await resolveFile(url.pathname);
  if (!file) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    return res.end(await readFile(path.join(ROOT, '404.html')));
  }
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  res.end(await readFile(file));
}
