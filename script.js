'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveLinkOnScroll();
  initScrollReveal();
  initContactForm();
  initCopyEmail();
  setFooterYear();
});

// Navbar gets a solid background once the page is scrolled
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile hamburger menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// Highlights the nav link for whichever section is currently in view
function initActiveLinkOnScroll() {
  const sections = document.querySelectorAll('main section[id], header.hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Fades sections/cards in as they enter the viewport
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  items.forEach((el) => observer.observe(el));
}


//for future use
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      status.dataset.state = 'error';
      return;
    }

    status.textContent = `Thanks, ${name}! Your message looks good`;
    status.dataset.state = 'success';
    form.reset();
  }); 
} 



// Copies the email address to the clipboard, with a mailto fallback
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmail');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email || copyBtn.textContent.trim();

    try {
      await navigator.clipboard.writeText(email);
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1800);
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  });
} 

// Keeps the footer year current
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
