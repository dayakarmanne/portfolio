const menuToggle = document.querySelector('#menuToggle');
const nav = document.querySelector('#nav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const progress = document.querySelector('#progress');

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const id = entry.target.id;
      if (id) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal, main section[id]').forEach(el => observer.observe(el));

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
document.querySelector('#year').textContent = new Date().getFullYear();

// Subtle pointer tilt for the decorative hero card; disabled for touch/reduced-motion.
const visual = document.querySelector('.hero-visual');
const core = document.querySelector('.core-card');
if (window.matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches) {
  visual.addEventListener('pointermove', e => {
    const rect = visual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    core.style.transform = `translate(calc(-50% + ${x * 12}px), calc(-48% + ${y * 10}px)) rotateY(${-10 + x * 8}deg) rotateX(${4 - y * 7}deg)`;
  });
  visual.addEventListener('pointerleave', () => {
    core.style.transform = 'translate(-50%,-48%) rotateY(-10deg) rotateX(4deg)';
  });
}
