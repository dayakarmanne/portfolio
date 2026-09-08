/* Premium Three.js environment */
const stage = document.getElementById('threeStage');
const renderer = new THREE.WebGLRenderer({ canvas: stage, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 7);

const group = new THREE.Group();
scene.add(group);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.15, 3),
  new THREE.MeshPhysicalMaterial({
    color: 0x111318,
    metalness: 0.8,
    roughness: 0.18,
    wireframe: true,
    transparent: true,
    opacity: 0.48
  })
);
group.add(core);

const ringMat = new THREE.MeshBasicMaterial({ color: 0xb8ff3d, transparent: true, opacity: 0.23 });
[2.05, 2.5, 2.95].forEach((r, i) => {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006 + (i * 0.002), 8, 180), ringMat);
  ring.rotation.x = Math.PI * (0.22 + i * 0.21);
  ring.rotation.y = i * 0.55;
  group.add(ring);
});

const starsGeo = new THREE.BufferGeometry();
const count = 1200;
const pos = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  pos[i] = (Math.random() - 0.5) * 18;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xb8ff3d, size: 0.018, transparent: true, opacity: 0.55 }));
scene.add(stars);

const light1 = new THREE.PointLight(0xb8ff3d, 18, 9);
light1.position.set(3, 2, 3);
scene.add(light1);

const light2 = new THREE.PointLight(0x5d7cff, 12, 10);
light2.position.set(-3, -2, 2);
scene.add(light2);

let tx = 0, ty = 0, cx = 0, cy = 0;
addEventListener('pointermove', e => {
  tx = (e.clientX / innerWidth - 0.5) * 1.2;
  ty = (e.clientY / innerHeight - 0.5) * 0.8;
});

addEventListener('deviceorientation', e => {
  if (e.gamma != null) {
    tx = e.gamma / 45;
    ty = (e.beta - 45) / 60;
  }
});

function animate() {
  requestAnimationFrame(animate);
  cx += (tx - cx) * 0.035;
  cy += (ty - cy) * 0.035;
  group.rotation.y += 0.0022 + cx * 0.001;
  group.rotation.x += 0.0012 + cy * 0.001;
  core.rotation.z += 0.001;
  stars.rotation.y += 0.00025;
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
});

/* Loading experience */
addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 700);
});

/* Reveal animations */
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(e => io.observe(e));

/* 3D tilt cards */
document.querySelectorAll('.card').forEach(card => {
  card.classList.add('tilt');
  card.addEventListener('pointermove', e => {
    if (innerWidth < 800) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-6px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

/* Custom cursor */
const dot = document.querySelector('.cursorDot');
const ring = document.querySelector('.cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

addEventListener('pointermove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

(function cursor() {
  rx += (mx - rx) * 0.16;
  ry += (my - ry) * 0.16;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(cursor);
})();

document.querySelectorAll('a, button, .card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width = '52px';
    ring.style.height = '52px';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width = '34px';
    ring.style.height = '34px';
  });
});