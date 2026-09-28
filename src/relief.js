// Lumea: o hartă de relief pe hârtie. Munții sunt un arc deschis spre vest (ca un Carpat
// stilizat), curbele de nivel se desenează în shader, iar traseul roșu înaintează cu
// derularea paginii. Traseul e singurul lucru care se mișcă.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, BufferGeometry,
  BufferAttribute, Mesh, ShaderMaterial, CatmullRomCurve3, RingGeometry, CircleGeometry,
  MeshBasicMaterial, DoubleSide,
} from 'three';

/* ---------- zgomot (simplex 2D), același pe CPU pentru teren și pentru traseu ---------- */
const perm = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = 20260929;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}
const G = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
function simplex(x, y) {
  const s = (x + y) * F2, i = Math.floor(x + s), j = Math.floor(y + s);
  const t = (i + j) * G2, x0 = x - (i - t), y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
  const ii = i & 255, jj = j & 255;
  let n = 0;
  const c = (gx, gy, xx, yy) => {
    let tt = 0.5 - xx * xx - yy * yy;
    if (tt < 0) return 0;
    tt *= tt;
    return tt * tt * (gx * xx + gy * yy);
  };
  let g = G[perm[ii + perm[jj]] & 7]; n += c(g[0], g[1], x0, y0);
  g = G[perm[ii + i1 + perm[jj + j1]] & 7]; n += c(g[0], g[1], x1, y1);
  g = G[perm[ii + 1 + perm[jj + 1]] & 7]; n += c(g[0], g[1], x2, y2);
  return 70 * n;
}
function fbm(x, y, oct = 5) {
  let a = 0.5, f = 1, v = 0;
  for (let o = 0; o < oct; o++) { v += a * simplex(x * f, y * f); f *= 2.03; a *= 0.5; }
  return v;
}
function ridged(x, y) {
  let a = 0.55, f = 1, v = 0;
  for (let o = 0; o < 5; o++) { const n = 1 - Math.abs(simplex(x * f, y * f)); v += a * n * n; f *= 2.1; a *= 0.48; }
  return v;
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// arcul munților: cerc de rază R în jurul lui (0,0), deschis spre vest
const R = 22;
export function inaltime(x, z) {
  const r = Math.hypot(x, z);
  const ang = Math.atan2(-z, x) * 180 / Math.PI; // 0 = est, 90 = nord, -90 = sud
  const arc = smooth(-128, -100, ang) * (1 - smooth(96, 122, ang));
  const d = r - R + fbm(x * 0.05, z * 0.05, 2) * 5;
  const lat = Math.exp(-(d * d) / (2 * 6.2 * 6.2));
  const munte = lat * arc * (0.55 + 0.75 * ridged(x * 0.075, z * 0.075));
  const podis = smooth(R + 4, R - 8, r) * 0.9 * (0.5 + 0.5 * fbm(x * 0.09 + 3, z * 0.09, 4));
  const campie = 0.28 * fbm(x * 0.06 - 7, z * 0.06 + 2, 3);
  return Math.max(0, munte * 7.2 + podis + campie + 0.2);
}

/* ---------- traseul: București → Brașov → Sibiu → Cluj → vest, spre Europa ---------- */
const OPRIRI = [
  { nume: 'București', p: [31, 25] },
  { nume: 'Brașov', p: [13, 15.5] },
  { nume: 'Sibiu', p: [-9, 13.5] },
  { nume: 'Cluj-Napoca', p: [-13, -7] },
  { nume: 'Oradea', p: [-36, -9] },
  { nume: '→ Europa', p: [-62, -14] },
];
const PUNCTE = [
  [31, 25], [24, 22], [18, 19.5], [13, 15.5], [6, 17.5], [-2, 16], [-9, 13.5],
  [-14, 7], [-15, 0], [-13, -7], [-20, -9.5], [-28, -8], [-36, -9], [-46, -12], [-62, -14],
];

const VS_TEREN = /* glsl */`
  varying float vH;
  varying vec3 vPos;
  varying vec3 vN;
  void main() {
    vH = position.y;
    vN = normal;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vPos = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const FS_TEREN = /* glsl */`
  uniform vec3 uHartie, uCerneala, uUmbra;
  uniform vec3 uCam;
  uniform float uCeata;
  varying float vH;
  varying vec3 vPos;
  varying vec3 vN;
  float linie(float v, float pas, float gros) {
    float x = v / pas;
    float d = abs(fract(x - 0.5) - 0.5) / fwidth(x);
    return 1.0 - min(d / gros, 1.0);
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec3 n = normalize(vN);
    float lum = clamp(dot(n, normalize(vec3(-0.55, 0.75, -0.35))), 0.0, 1.0);
    vec3 c = uHartie;
    // umbrire de relief, caldă, ca pe hărțile tipărite
    c = mix(c * uUmbra, c, smoothstep(0.25, 0.9, lum));
    // tentă ușoară pe înălțime
    c = mix(c, c * vec3(0.965, 0.955, 0.93), smoothstep(1.0, 6.0, vH));
    float mic = linie(vH, 0.38, 0.9) * 0.2;
    float mare = linie(vH, 1.9, 1.35) * 0.42;
    float grila = max(linie(vPos.x, 10.0, 0.8), linie(vPos.z, 10.0, 0.8)) * 0.1;
    c = mix(c, uCerneala, max(max(mic, mare), grila));
    c += (hash(gl_FragCoord.xy) - 0.5) * 0.018;
    float dist = distance(vPos, uCam);
    c = mix(c, uHartie, smoothstep(uCeata * 0.55, uCeata, dist));
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;
const VS_RUTA = /* glsl */`
  attribute float aT;
  varying float vT;
  varying float vLat;
  attribute float aLat;
  void main() { vT = aT; vLat = aLat; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FS_RUTA = /* glsl */`
  uniform float uProgres, uLung;
  uniform vec3 uRosu, uCerneala;
  varying float vT;
  varying float vLat;
  void main() {
    float margine = 1.0 - smoothstep(0.6, 1.0, abs(vLat));
    if (vT <= uProgres) {
      gl_FragColor = vec4(uRosu, margine);
      #include <colorspace_fragment>
    } else {
      float dash = step(0.5, fract(vT * uLung / 1.3));
      float a = dash * 0.5 * (1.0 - smoothstep(0.35, 0.8, abs(vLat)));
      if (a < 0.01) discard;
      gl_FragColor = vec4(uCerneala, a);
      #include <colorspace_fragment>
    }
  }
`;

export function porneste(canvas, etichete) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (e) {
    return null;
  }
  const HARTIE = new Color('#efe9dd');
  renderer.setClearColor(HARTIE);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.5, 400);
  const mobil = () => window.innerWidth < 760;

  /* teren */
  const X0 = -120, X1 = 95, Z0 = -85, Z1 = 90;
  const nx = mobil() ? 240 : 380, nz = Math.round(nx * (Z1 - Z0) / (X1 - X0));
  const pos = new Float32Array((nx + 1) * (nz + 1) * 3);
  let k = 0;
  for (let j = 0; j <= nz; j++) {
    const z = Z0 + (Z1 - Z0) * j / nz;
    for (let i = 0; i <= nx; i++) {
      const x = X0 + (X1 - X0) * i / nx;
      pos[k++] = x; pos[k++] = inaltime(x, z); pos[k++] = z;
    }
  }
  const idx = new Uint32Array(nx * nz * 6);
  k = 0;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
    idx[k++] = a; idx[k++] = c; idx[k++] = b; idx[k++] = b; idx[k++] = c; idx[k++] = d;
  }
  const gTeren = new BufferGeometry();
  gTeren.setAttribute('position', new BufferAttribute(pos, 3));
  gTeren.setIndex(new BufferAttribute(idx, 1));
  gTeren.computeVertexNormals();
  const uTeren = {
    uHartie: { value: new Vector3(HARTIE.r, HARTIE.g, HARTIE.b) },
    uCerneala: { value: new Vector3().setFromColor(new Color('#1d2126')) },
    uUmbra: { value: new Vector3(0.74, 0.70, 0.64) },
    uCam: { value: new Vector3() },
    uCeata: { value: 120 },
  };
  const teren = new Mesh(gTeren, new ShaderMaterial({
    vertexShader: VS_TEREN, fragmentShader: FS_TEREN, uniforms: uTeren,
    extensions: { derivatives: true },
  }));
  scene.add(teren);

  /* traseul, ca panglică lipită pe teren */
  const curba = new CatmullRomCurve3(PUNCTE.map(([x, z]) => new Vector3(x, 0, z)), false, 'centripetal', 0.5);
  const N = 900;
  const lung = curba.getLength();
  const latime = 0.42;
  const rp = new Float32Array((N + 1) * 2 * 3), rt = new Float32Array((N + 1) * 2), rl = new Float32Array((N + 1) * 2);
  const puncteRuta = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = curba.getPointAt(t), tg = curba.getTangentAt(t);
    const nxp = -tg.z, nzp = tg.x, l = Math.hypot(nxp, nzp) || 1;
    for (let s = 0; s < 2; s++) {
      const sg = s === 0 ? -1 : 1;
      const x = p.x + nxp / l * latime * sg, z = p.z + nzp / l * latime * sg;
      const o = (i * 2 + s);
      rp[o * 3] = x; rp[o * 3 + 1] = inaltime(p.x, p.z) + 0.12; rp[o * 3 + 2] = z;
      rt[o] = t; rl[o] = sg;
    }
    puncteRuta.push(new Vector3(p.x, inaltime(p.x, p.z) + 0.12, p.z));
  }
  const ri = [];
  for (let i = 0; i < N; i++) { const a = i * 2; ri.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const gRuta = new BufferGeometry();
  gRuta.setAttribute('position', new BufferAttribute(rp, 3));
  gRuta.setAttribute('aT', new BufferAttribute(rt, 1));
  gRuta.setAttribute('aLat', new BufferAttribute(rl, 1));
  gRuta.setIndex(ri);
  const uRuta = {
    uProgres: { value: 0.05 },
    uLung: { value: lung },
    uRosu: { value: new Vector3().setFromColor(new Color('#b8431f')) },
    uCerneala: { value: new Vector3().setFromColor(new Color('#1d2126')) },
  };
  const ruta = new Mesh(gRuta, new ShaderMaterial({
    vertexShader: VS_RUTA, fragmentShader: FS_RUTA, uniforms: uRuta,
    transparent: true, depthTest: false, depthWrite: false, side: DoubleSide,
  }));
  ruta.renderOrder = 2;
  scene.add(ruta);

  /* opririle: cercuri de cerneală, plus eticheta HTML */
  const tOpriri = OPRIRI.map((o) => {
    // parametrul t cel mai apropiat de oprire
    let best = 0, bd = Infinity;
    for (let i = 0; i <= N; i++) {
      const q = puncteRuta[i], d = (q.x - o.p[0]) ** 2 + (q.z - o.p[1]) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    return best / N;
  });
  const matOprire = new MeshBasicMaterial({ color: '#1d2126', depthTest: false, transparent: true });
  const gOprire = new RingGeometry(0.46, 0.62, 32).rotateX(-Math.PI / 2);
  const gOprirePlin = new CircleGeometry(0.46, 32).rotateX(-Math.PI / 2);
  const matPlin = new MeshBasicMaterial({ color: '#f6f2ea', depthTest: false });
  const elEtichete = OPRIRI.map((o, i) => {
    const t = tOpriri[i], p = puncteRuta[Math.round(t * N)];
    if (!o.nume.startsWith('→')) {
      const inel = new Mesh(gOprire, matOprire); inel.position.copy(p).y += 0.05; inel.renderOrder = 3; scene.add(inel);
      const plin = new Mesh(gOprirePlin, matPlin); plin.position.copy(p).y += 0.04; plin.renderOrder = 3; scene.add(plin);
    }
    const el = document.createElement('span');
    el.className = 'eticheta-oras';
    el.textContent = o.nume;
    etichete.appendChild(el);
    return { el, p: p.clone(), t };
  });

  /* microbuzul: un punct roșu în vârful traseului, cu un puls */
  const punct = new Mesh(new CircleGeometry(0.62, 40).rotateX(-Math.PI / 2), new MeshBasicMaterial({ color: '#b8431f', depthTest: false }));
  punct.renderOrder = 5;
  const puls = new Mesh(new RingGeometry(0.7, 0.95, 48).rotateX(-Math.PI / 2), new MeshBasicMaterial({ color: '#b8431f', transparent: true, depthTest: false }));
  puls.renderOrder = 4;
  scene.add(punct, puls);

  /* camera: urmărește punctul, cu o singură netezire */
  const REDUS = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tinta = 0, curent = 0, w = 0, h = 0;
  const T0 = 0.035;
  const tmp = new Vector3(), privire = new Vector3(), vec = new Vector3();

  function marime() {
    kUltim = -1;
    w = window.innerWidth; h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = mobil() ? 50 : 38;
    incadrare(curent);
  }
  // în hero, punctul stă sus-dreapta (textul e în stânga); după hero, aproape de centru
  let kUltim = -1;
  function incadrare(p) {
    const k = smooth(0.015, 0.09, p);
    if (Math.abs(k - kUltim) < 0.001) return;
    kUltim = k;
    if (mobil()) camera.setViewOffset(w, h, -w * 0.12 * (1 - k), h * (0.36 - 0.28 * k), w, h);
    else camera.setViewOffset(w, h, -w * (0.27 - 0.2 * k), h * (0.3 - 0.24 * k), w, h);
    camera.updateProjectionMatrix();
  }
  function progresDinScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }
  tinta = progresDinScroll(); curent = tinta;

  function pozitie(p) {
    const t = T0 + (1 - T0 - 0.02) * p;
    uRuta.uProgres.value = t;
    const cap = puncteRuta[Math.min(N, Math.round(t * N))];
    punct.position.copy(cap).y += 0.1;
    puls.position.copy(punct.position);
    // camera privește puțin înaintea punctului
    const inainte = puncteRuta[Math.min(N, Math.round(Math.min(1, t + 0.05) * N))];
    privire.copy(cap).lerp(inainte, 0.5);
    privire.y = 1.2;
    const dist = mobil() ? 1.3 : 1;
    camera.position.set(privire.x + 8 * dist, 46 * dist, privire.z + 40 * dist);
    camera.lookAt(privire);
    uTeren.uCam.value.copy(camera.position);
    uTeren.uCeata.value = 150 * dist;
    return t;
  }

  function eticheteAcum(t) {
    for (const e of elEtichete) {
      vec.copy(e.p); vec.y += 0.3;
      vec.project(camera);
      const x = (vec.x * 0.5 + 0.5) * w, y = (-vec.y * 0.5 + 0.5) * h;
      const vizibil = t >= e.t - 0.004 && vec.z < 1 && x > -40 && x < w + 40 && y > 40 && y < h - 20;
      e.el.classList.toggle('vizibil', vizibil);
      e.el.style.transform = `translate3d(${Math.round(x + 12)}px, ${Math.round(y - 22)}px, 0)`;
    }
  }

  let ultim = performance.now(), activ = true, raf = 0;
  function cadru(now) {
    raf = requestAnimationFrame(cadru);
    const dt = Math.min(0.05, (now - ultim) / 1000); ultim = now;
    if (!activ) return;
    curent += (tinta - curent) * (REDUS ? 1 : 1 - Math.exp(-dt * 7));
    incadrare(curent);
    const t = pozitie(curent);
    const f = REDUS ? 0.5 : (now / 1600) % 1;
    puls.scale.setScalar(1 + f * 1.6);
    puls.material.opacity = 0.55 * (1 - f);
    eticheteAcum(t);
    renderer.render(scene, camera);
  }

  marime();
  window.addEventListener('resize', marime);
  window.addEventListener('scroll', () => { tinta = progresDinScroll(); }, { passive: true });
  new ResizeObserver(() => { tinta = progresDinScroll(); }).observe(document.body);
  document.addEventListener('visibilitychange', () => { activ = !document.hidden; ultim = performance.now(); });
  raf = requestAnimationFrame(cadru);
  return { oprire: () => cancelAnimationFrame(raf) };
}
