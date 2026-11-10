// Cursor ke saath colorful light move karne wala code
const root = document.documentElement;

// target = mouse ki asli position, x/y = glow ki smooth position
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight * 0.3;
let x = targetX;
let y = targetY;

// mouse ya touch move hone par target update karo
window.addEventListener('pointermove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

// glow ko target ki taraf dheere dheere le jao (smooth effect)
function animate() {
  x += (targetX - x) * 0.12;
  y += (targetY - y) * 0.12;
  root.style.setProperty('--x', x + 'px');
  root.style.setProperty('--y', y + 'px');
  requestAnimationFrame(animate);
}

// agar user ne "reduce motion" on kiya hai to glow ek jagah rahega
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  root.style.setProperty('--x', x + 'px');
  root.style.setProperty('--y', y + 'px');
} else {
  animate();
}

// footer me saal apne aap update ho
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Typing effect: letter likhe, fir mit jaye, fir agla word =====
const typedEl = document.getElementById('typed');
const words = ['Web Developer', 'Python Developer', 'Ethical Hacker'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const word = words[wordIndex];
  typedEl.textContent = word.slice(0, charIndex);

  let delay = deleting ? 50 : 100; // likhne me 100ms, mitane me 50ms

  if (!deleting && charIndex === word.length) {
    delay = 1500;      // poora word likhne ke baad ruko
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;  // mit gaya, ab agla word
    wordIndex = (wordIndex + 1) % words.length;
    delay = 400;
  } else {
    charIndex += deleting ? -1 : 1;
  }

  setTimeout(typeLoop, delay);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typedEl.textContent = 'Web and Python Developer';
} else {
  typeLoop();
}

// ===== Percentage bars: screen par aate hi fill ho aur number ginte jaye =====
const fills = document.querySelectorAll('.bar-fill');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fillBar(fill) {
  const percent = Number(fill.dataset.percent);
  const label = fill.closest('.bar-item').querySelector('.bar-pct');
  fill.style.width = percent + '%';

  // 85% ya zyada ho to star dikhao
  const star = fill.closest('.bar-item').querySelector('.star');
  if (star) star.hidden = percent < 85;

  if (reduceMotion) {
    label.textContent = percent + '%';
    return;
  }

  // number 0 se percent tak ginta hai
  let current = 0;
  const step = Math.max(1, Math.round(percent / 60));
  const counter = setInterval(() => {
    current = Math.min(percent, current + step);
    label.textContent = current + '%';
    if (current >= percent) clearInterval(counter);
  }, 22);
}

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      fillBar(entry.target);
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

fills.forEach((fill) => barObserver.observe(fill));

// ===== Right-click alert =====


const rcDialog = document.getElementById("rc-dialog");

// Show popup
function showRcAlert() {
  if (!rcDialog.open) {
    rcDialog.showModal();
  }
}

// Close popup buttons
rcDialog.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    rcDialog.close();
  });
});

// Right click detection
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  showRcAlert();
}, true);

// Developer tools shortcut detection
document.addEventListener("keydown", function (e) {

  const key = e.key.toLowerCase();
  const ctrl = e.ctrlKey;
  const shift = e.shiftKey;
  const alt = e.altKey;
  const meta = e.metaKey;

  let detected = false;

  // F12
  if (key === "f12") {
    detected = true;
  }

  // Windows / Linux shortcuts
  if (ctrl && shift &&
    ["i", "j", "c", "k", "e"].includes(key)) {
    detected = true;
  }

  // View source
  if (ctrl && key === "u") {
    detected = true;
  }

  // Mac shortcuts
  if (meta && alt &&
    ["i", "j", "c"].includes(key)) {
    detected = true;
  }

  // Mac view source
  if (meta && alt && key === "u") {
    detected = true;
  }

  if (detected) {
    e.preventDefault();
    e.stopImmediatePropagation();
    showRcAlert();
  }

}, true);



// ===== Contact form (Formspree se email aata hai) =====
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formStatus.className = 'form-note';

  // jab tak YOUR_FORM_ID nahi badli, form connected nahi hai
  if (contactForm.action.includes('YOUR_FORM_ID')) {
    formStatus.textContent = 'Form abhi connected nahi hai. index.html me YOUR_FORM_ID badlo.';
    formStatus.classList.add('err');
    return;
  }

  const button = contactForm.querySelector('.send-btn');
  button.disabled = true;
  formStatus.textContent = 'Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (response.ok) {
      contactForm.reset();
      formStatus.textContent = 'Message bhej diya gaya. Thank you!';
      formStatus.classList.add('ok');
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    formStatus.textContent = 'Message nahi ja paya. Thodi der baad dobara try karo.';
    formStatus.classList.add('err');
  } finally {
    button.disabled = false;
  }
});
