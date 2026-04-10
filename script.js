/* ============================================================
   JIHAD AL MAHID — PORTFOLIO SCRIPT
   Features: Navbar, Theme Toggle, Scroll Animations,
             Intersection Observer, Skill Bars, Contact Form
   ============================================================ */

'use strict';

// ── 1. DOM REFERENCES ──────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const navLinks    = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const hamburger   = document.getElementById('hamburger');
const navMobile   = document.getElementById('navMobile');
const scrollTop   = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const revealEls   = document.querySelectorAll('.reveal');
const skillFills  = document.querySelectorAll('.skill-fill');
const sections    = document.querySelectorAll('section[id]');

// ── 2. THEME TOGGLE ─────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── 3. NAVBAR — Sticky + Scroll Shadow ──────────────────────────
window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  const y = window.scrollY;

  // sticky style
  navbar.classList.toggle('scrolled', y > 60);

  // active nav link
  let current = '';
  sections.forEach(sec => {
    if (y >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  // scroll-to-top button
  scrollTop.classList.toggle('visible', y > 400);
}

// ── 4. HAMBURGER MENU ───────────────────────────────────────────
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMobile.classList.toggle('open');
});

// Close mobile menu on link click
navMobile.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
  });
});

// ── 5. SCROLL TO TOP ────────────────────────────────────────────
scrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 6. INTERSECTION OBSERVER — Reveal Animations ────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── 7. SKILL BAR ANIMATION ──────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill  = entry.target;
      const width = fill.getAttribute('data-width');
      // small delay for visual delight
      setTimeout(() => { fill.style.width = `${width}%`; }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ── 8. SMOOTH ANCHOR NAVIGATION ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId  = anchor.getAttribute('href');
    const targetEl  = document.querySelector(targetId);
    if (!targetEl) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top    = targetEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── 9. CONTACT FORM ─────────────────────────────────────────────
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const email   = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  // Basic validation
  if (!name || !email || !message) {
    shakeForm();
    return;
  }
  if (!isValidEmail(email)) {
    contactForm.email.style.borderColor = '#e85555';
    setTimeout(() => contactForm.email.style.borderColor = '', 2000);
    return;
  }

  // Simulate sending
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';
  submitBtn.querySelector('.btn-text').hidden = true;
  submitBtn.querySelector('.btn-sent').hidden = false;

  // Reset after 3s
  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    submitBtn.querySelector('.btn-text').hidden = false;
    submitBtn.querySelector('.btn-sent').hidden = true;
  }, 3000);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm() {
  contactForm.style.animation = 'none';
  contactForm.offsetHeight; // reflow
  contactForm.style.animation = 'shake 0.4s ease';
  setTimeout(() => { contactForm.style.animation = ''; }, 400);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-6px); }
    40%,80%  { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// ── 10. HERO TEXT — Typewriter Effect on Title ──────────────────
(function typewriter() {
  const el   = document.querySelector('.hero-title');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, 38);
    }
  };
  // Delay to sync with reveal animation
  setTimeout(tick, 900);
})();

// ── 11. CARD TILT on Mouse Move ─────────────────────────────────
document.querySelectorAll('.project-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const tiltX  = dy * -5;
    const tiltY  = dx *  5;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── 12. PHOTO UPLOAD ────────────────────────────────────────────
const photoUpload = document.getElementById('photoUpload');
const profileImg  = document.getElementById('profileImg');

if (photoUpload && profileImg) {
  photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      profileImg.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── 13. INIT ────────────────────────────────────────────────────
onScroll(); // run once on load
