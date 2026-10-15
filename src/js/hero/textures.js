import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function finish(c, repeatX, repeatY, anisotropy) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.anisotropy = anisotropy;
  return t;
}

/** Laterite soil: the red-brown earth of an Abuja site before paving. */
export function soilTexture(anisotropy) {
  const size = 512;
  const c = canvas(size, size);
  const g = c.getContext('2d');
  g.fillStyle = '#a46a4b';
  g.fillRect(0, 0, size, size);
  const rnd = seeded(7);
  for (let i = 0; i < 26; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const r = 40 + rnd() * 110;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const tone = rnd() > 0.5 ? '186,128,94' : '128,78,54';
    grad.addColorStop(0, `rgba(${tone},0.22)`);
    grad.addColorStop(1, `rgba(${tone},0)`);
    g.fillStyle = grad;
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        g.save();
        g.translate(dx, dy);
        g.fillRect(x - r, y - r, r * 2, r * 2);
        g.restore();
      }
    }
  }
  for (let i = 0; i < 9000; i++) {
    const l = rnd();
    g.fillStyle = l > 0.5 ? `rgba(196,140,104,${0.12 + rnd() * 0.18})` : `rgba(108,64,44,${0.1 + rnd() * 0.18})`;
    g.fillRect(rnd() * size, rnd() * size, 1 + rnd() * 1.6, 1 + rnd() * 1.6);
  }
  return finish(c, 40, 40, anisotropy);
}

/** Compacted murram road in front of the plot. */
export function roadTexture(anisotropy) {
  const c = canvas(256, 256);
  const g = c.getContext('2d');
  g.fillStyle = '#b08562';
  g.fillRect(0, 0, 256, 256);
  const rnd = seeded(11);
  for (let i = 0; i < 1800; i++) {
    g.fillStyle = `rgba(${rnd() > 0.5 ? '200,160,125' : '140,100,72'},${0.18 + rnd() * 0.25})`;
    g.fillRect(rnd() * 256, rnd() * 256, rnd() * 3 + 1, rnd() * 2 + 1);
  }
  return finish(c, 14, 2, anisotropy);
}

/** Interlocking paving blocks, laid in a running bond. */
export function pavingTexture(anisotropy) {
  const c = canvas(256, 256);
  const g = c.getContext('2d');
  g.fillStyle = '#8e8a83';
  g.fillRect(0, 0, 256, 256);
  const rnd = seeded(3);
  const bw = 32;
  const bh = 16;
  for (let row = 0; row < 256 / bh; row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let col = -1; col < 256 / bw + 1; col++) {
      const shade = 150 + Math.floor(rnd() * 22);
      g.fillStyle = `rgb(${shade},${shade - 3},${shade - 9})`;
      g.fillRect(col * bw + off + 1, row * bh + 1, bw - 2, bh - 2);
    }
  }
  return finish(c, 22, 10, anisotropy);
}

/** The green site board that stands at the Darik Homes gate. */
export function signTexture(anisotropy) {
  const c = canvas(512, 256);
  const g = c.getContext('2d');
  g.fillStyle = '#f4f6f2';
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = '#00903c';
  g.fillRect(12, 12, 488, 232);
  g.fillStyle = '#ffffff';
  g.textAlign = 'center';
  g.font = '700 64px Inter, Arial, sans-serif';
  g.fillText('DARIK HOMES LTD', 256, 110);
  g.font = '600 25px Inter, Arial, sans-serif';
  g.fillText('REAL ESTATE · DESIGN · CONSTRUCTION', 256, 160);
  g.font = '500 22px Inter, Arial, sans-serif';
  g.fillText('RC 1633288', 256, 205);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = anisotropy;
  return t;
}
