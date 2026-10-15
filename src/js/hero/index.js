import {
  ACESFilmicToneMapping,
  BackSide,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  MathUtils,
  Mesh,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createSite } from './building.js';
import { noteOffset, resolve, TOTAL } from './timeline.js';

const PALETTES = [
  { top: '#0a1b33', horizon: '#2f5f93', sun: '#9db8ff', sunI: 0.35, hemiSky: '#3b5f8e', hemiGround: '#1b1612', hemiI: 0.55, env: 0.18, sunAz: -150, sunEl: 25, exposure: 0.95, lamp: '#ffd59a', lampOn: 0.0 },
  { top: '#2f74c4', horizon: '#c4dcef', sun: '#fff0d8', sunI: 2.5, hemiSky: '#cfe3f4', hemiGround: '#6b4a36', hemiI: 0.75, env: 0.35, sunAz: -55, sunEl: 34, exposure: 1.0, lamp: '#3b3a36', lampOn: 0 },
  { top: '#2a7cd2', horizon: '#d9eaf6', sun: '#ffffff', sunI: 2.9, hemiSky: '#dbeaf6', hemiGround: '#6e4b36', hemiI: 0.8, env: 0.4, sunAz: -25, sunEl: 58, exposure: 1.0, lamp: '#3b3a36', lampOn: 0 },
  { top: '#223e6c', horizon: '#f3a25c', sun: '#ffae6b', sunI: 2.2, hemiSky: '#f1b78f', hemiGround: '#3a281d', hemiI: 0.6, env: 0.3, sunAz: 62, sunEl: 7, exposure: 1.05, lamp: '#ffd59a', lampOn: 1 },
].map((p) => ({
  ...p,
  top: new Color(p.top),
  horizon: new Color(p.horizon),
  sun: new Color(p.sun),
  hemiSky: new Color(p.hemiSky),
  hemiGround: new Color(p.hemiGround),
  lamp: new Color(p.lamp),
}));

const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz - cameraPosition);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const SKY_FRAG = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uSun;
uniform vec3 uSunDir;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = clamp(d.y, -1.0, 1.0);
  float up = pow(smoothstep(0.0, 0.4, h), 0.7);
  vec3 col = mix(uHorizon, uTop, up);
  col = mix(col, uHorizon * 0.82, clamp(-h * 4.0, 0.0, 1.0));
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  col += uSun * (pow(s, 900.0) * 1.6 + pow(s, 12.0) * 0.28);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  // three.js mixes an sRGB-encoded fog colour in after tone mapping, so the
  // horizon must meet that exact value or a seam shows where the ground ends.
  vec3 fogOut = sRGBTransferOETF(vec4(uHorizon, 1.0)).rgb;
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogOut, 1.0 - smoothstep(0.0, 0.1, abs(h)));
}`;

function deviceTier() {
  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const small = Math.min(window.screen.width, window.screen.height) < 500;
  if (mem <= 2 || cores <= 2) return 'low';
  if (small || mem <= 4 || cores <= 4) return 'mid';
  return 'high';
}

export function mountHero(section) {
  const canvas = section.querySelector('.build__canvas');
  const sticky = section.querySelector('.build__sticky');
  const intro = section.querySelector('.build__intro');
  const reality = section.querySelector('.build__reality');
  const credit = section.querySelector('.build__credit');
  const notes = [...section.querySelectorAll('.note')];
  const pins = [...section.querySelectorAll('.pin')];
  const leader = section.querySelector('.build__leader line');
  const rail = section.querySelector('.rail');
  const railItems = [...section.querySelectorAll('.rail__item')];
  const meter = section.querySelector('.build__meter span');

  const tier = deviceTier();
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: tier !== 'low', powerPreference: 'high-performance', alpha: false });
  } catch {
    return null;
  }
  const shadows = tier !== 'low';
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = PCFSoftShadowMap;
  let maxDpr = tier === 'high' ? 2 : tier === 'mid' ? 1.5 : 1;
  let dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const site = createSite({ anisotropy: Math.min(8, renderer.capabilities.getMaxAnisotropy()), shadows });
  scene.add(site.root);

  const skyMat = new ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    uniforms: { uTop: { value: new Color() }, uHorizon: { value: new Color() }, uSun: { value: new Color() }, uSunDir: { value: new Vector3() } },
    side: BackSide,
    depthWrite: false,
    fog: false,
  });
  const sky = new Mesh(new SphereGeometry(800, 32, 16), skyMat);
  sky.renderOrder = -1;
  sky.frustumCulled = false;
  scene.add(sky);

  scene.fog = new Fog(new Color(), 95, 420);
  const hemi = new HemisphereLight();
  scene.add(hemi);
  const sun = new DirectionalLight();
  sun.castShadow = shadows;
  sun.shadow.mapSize.set(tier === 'high' ? 2048 : 1024, tier === 'high' ? 2048 : 1024);
  const sc = sun.shadow.camera;
  sc.left = -42;
  sc.right = 42;
  sc.top = 42;
  sc.bottom = -42;
  sc.near = 10;
  sc.far = 260;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  const camera = new PerspectiveCamera(35, 1, 0.5, 2000);
  const target = new Vector3();

  const tmp = {
    top: new Color(),
    horizon: new Color(),
    sun: new Color(),
    hemiSky: new Color(),
    hemiGround: new Color(),
    lamp: new Color(),
  };

  function palette(tod) {
    const i = Math.min(PALETTES.length - 2, Math.floor(tod));
    const t = MathUtils.clamp(tod - i, 0, 1);
    const a = PALETTES[i];
    const b = PALETTES[i + 1];
    for (const k of Object.keys(tmp)) tmp[k].copy(a[k]).lerp(b[k], t);
    const mix = (k) => a[k] + (b[k] - a[k]) * t;
    return { ...tmp, sunI: mix('sunI'), hemiI: mix('hemiI'), env: mix('env'), sunAz: mix('sunAz'), sunEl: mix('sunEl'), exposure: mix('exposure'), lampOn: mix('lampOn') };
  }

  let width = 0;
  let height = 0;
  let stableVh = window.innerHeight;
  let portrait = false;

  function layout() {
    const w = sticky.clientWidth;
    const h = sticky.clientHeight;
    const vh = window.innerHeight;
    if (Math.abs(vh - stableVh) > 140 || w !== width) stableVh = vh;
    width = w;
    height = h;
    portrait = h > w * 1.05;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    section.style.height = `${Math.round((TOTAL + 1) * stableVh)}px`;
    needs = true;
  }

  function applyCamera(pose, shift) {
    const aspect = width / Math.max(1, height);
    const narrow = MathUtils.clamp(1.6 / aspect, 1, 3.4);
    const fov = 35 + (portrait ? 13 : 0);
    const distScale = portrait ? Math.pow(narrow, 0.62) * 0.92 : Math.pow(narrow, 0.5);
    const dist = pose.dist * distScale;
    const az = MathUtils.degToRad(pose.az);
    const el = MathUtils.degToRad(pose.el);
    target.set(0, pose.ty + (portrait ? 3.2 : 0), pose.tz);
    camera.position.set(target.x + Math.sin(az) * Math.cos(el) * dist, target.y + Math.sin(el) * dist, target.z + Math.cos(az) * Math.cos(el) * dist);
    if (camera.position.y < 1.4) camera.position.y = 1.4;
    camera.fov = fov;
    if (Math.abs(shift) > 0.0005) {
      if (portrait) camera.setViewOffset(width, height, 0, shift * height, width, height);
      else camera.setViewOffset(width, height, shift * width, 0, width, height);
    } else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  }

  function applyLight(tod) {
    const p = palette(tod);
    skyMat.uniforms.uTop.value.copy(p.top);
    skyMat.uniforms.uHorizon.value.copy(p.horizon);
    skyMat.uniforms.uSun.value.copy(p.sun);
    scene.fog.color.copy(p.horizon);
    hemi.color.copy(p.hemiSky);
    hemi.groundColor.copy(p.hemiGround);
    hemi.intensity = p.hemiI;
    sun.color.copy(p.sun);
    sun.intensity = p.sunI;
    const az = MathUtils.degToRad(p.sunAz);
    const el = MathUtils.degToRad(p.sunEl);
    const dir = new Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    skyMat.uniforms.uSunDir.value.copy(dir);
    sun.position.copy(dir).multiplyScalar(140);
    sun.target.position.set(0, 0, 0);
    scene.environmentIntensity = p.env;
    renderer.toneMappingExposure = p.exposure;
    site.lampMaterial.color.copy(tmp.lamp.copy(PALETTES[1].lamp).lerp(PALETTES[3].lamp, p.lampOn));
  }

  const anchorKeys = ['plot', 'foundation', 'frame', 'walls', 'finish', 'site'];
  const projected = new Vector3();

  function placePins(state) {
    let lead = null;
    pins.forEach((pin, i) => {
      const v = state.notes[i] || 0;
      if (v <= 0.001) {
        pin.style.opacity = '0';
        return;
      }
      projected.copy(site.anchors[anchorKeys[i]]).project(camera);
      const onScreen = projected.z < 1 && Math.abs(projected.x) < 1.05 && Math.abs(projected.y) < 1.05;
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      pin.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      pin.style.opacity = onScreen ? String(v) : '0';
      if (onScreen && v > 0.05) lead = { x, y, v, note: notes[i] };
    });
    if (!leader) return;
    if (!lead) {
      leader.style.opacity = '0';
      return;
    }
    const r = lead.note.querySelector('.note__card').getBoundingClientRect();
    const s = sticky.getBoundingClientRect();
    const left = r.left - s.left;
    const top = r.top - s.top;
    let ex;
    let ey;
    if (portrait) {
      ex = Math.min(Math.max(lead.x, left + 24), left + r.width - 24);
      ey = top;
    } else {
      ex = lead.x < left ? left : left + r.width;
      ey = Math.min(Math.max(lead.y, top + 24), top + r.height - 24);
    }
    leader.setAttribute('x1', lead.x.toFixed(1));
    leader.setAttribute('y1', lead.y.toFixed(1));
    leader.setAttribute('x2', ex.toFixed(1));
    leader.setAttribute('y2', ey.toFixed(1));
    leader.style.opacity = String(lead.v * 0.85);
  }

  function updateDom(state) {
    notes.forEach((n, i) => {
      const v = state.notes[i] || 0;
      n.style.setProperty('--p', v.toFixed(3));
      n.classList.toggle('is-active', v > 0.5);
      n.setAttribute('aria-hidden', v > 0.5 ? 'false' : 'true');
    });
    const t = state.intro;
    sticky.style.setProperty('--t', t.toFixed(3));
    intro.style.visibility = t >= 1 ? 'hidden' : 'visible';
    const r = state.reveal;
    reality.style.setProperty('--r', r.toFixed(3));
    credit.dataset.mode = r > 0.5 ? 'photo' : 'model';
    const done = state.stage.map((s) => s);
    railItems.forEach((item, i) => {
      item.style.setProperty('--fill', done[i].toFixed(3));
      const active = done[i] > 0 && (i === done.length - 1 || done[i + 1] === 0);
      item.classList.toggle('is-current', active && state.reveal < 1);
      item.classList.toggle('is-done', done[i] >= 1);
    });
    if (meter) meter.style.transform = `scaleX(${state.progress.toFixed(4)})`;
    if (rail) rail.style.setProperty('--rail', (Math.min(1, state.intro * 2) * (1 - state.reveal)).toFixed(3));
  }

  // Moves the model out from under whichever card is showing.
  function framingShift(state) {
    let s = 0;
    for (let i = 0; i < notes.length - 1; i++) {
      const v = state.notes[i] || 0;
      if (v <= 0) continue;
      if (portrait) s += v * 0.14;
      // The stage rail always sits on the right, so only right cards shift the model.
      else if (notes[i].dataset.side === 'right') s += v * 0.15;
    }
    return s;
  }

  let target01 = 0;
  let current = 0;
  let needs = true;
  let running = false;
  let inView = true;
  let last = performance.now();
  let frames = 0;
  let slow = 0;

  function readScroll() {
    const top = section.getBoundingClientRect().top;
    target01 = MathUtils.clamp(-top / stableVh, 0, TOTAL);
  }

  function frame(now) {
    running = false;
    if (!inView) return;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const k = 1 - Math.exp(-dt * 9);
    const delta = target01 - current;
    current = Math.abs(delta) < 0.0004 ? target01 : current + delta * k;
    const state = resolve(current);
    site.apply(state.stage);
    applyLight(state.pose.tod);
    applyCamera(state.pose, framingShift(state));
    const t0 = performance.now();
    renderer.render(scene, camera);
    const cost = performance.now() - t0;
    placePins(state);
    updateDom(state);
    if (!section.classList.contains('is-ready')) section.classList.add('is-ready');
    adapt(cost, dt);
    needs = false;
    if (current !== target01) kick();
  }

  function adapt(cost, dt) {
    frames++;
    if (frames < 8) return;
    if (dt > 0.034 || cost > 22) slow++;
    else slow = Math.max(0, slow - 1);
    if (slow > 12) {
      slow = 0;
      if (dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        maxDpr = dpr;
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
      } else if (renderer.shadowMap.enabled) {
        renderer.shadowMap.enabled = false;
        sun.castShadow = false;
        scene.traverse((o) => {
          if (o.material) o.material.needsUpdate = true;
        });
      }
    }
  }

  function kick() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  const onScroll = () => {
    readScroll();
    kick();
  };
  const onResize = () => {
    layout();
    readScroll();
    kick();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  const viewObserver = new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting;
      if (inView) {
        last = performance.now();
        kick();
      }
    },
    { rootMargin: '200px 0px' },
  );
  viewObserver.observe(section);

  railItems.forEach((item, i) => {
    item.querySelector('button')?.addEventListener('click', () => scrollToNote(i));
  });

  function scrollToNote(i) {
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + noteOffset(i) * stableVh, behavior: 'smooth' });
  }

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    inView = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    viewObserver.disconnect();
    section.dispatchEvent(new CustomEvent('hero:failed'));
  });

  layout();
  readScroll();
  current = target01;
  kick();

  return {
    seek(fraction) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + MathUtils.clamp(fraction, 0, 1) * TOTAL * stableVh, behavior: 'instant' });
      readScroll();
      current = target01;
      kick();
    },
    scrollToNote,
    get tier() {
      return tier;
    },
  };
}
