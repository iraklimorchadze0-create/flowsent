// ============================================
// flowsent.ai — Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll-triggered fade-in animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

  // --- Navbar scroll effect ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const setMenu = (open) => {
    mobileMenu.classList.toggle('active', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  hamburger.addEventListener('click', () => {
    setMenu(!mobileMenu.classList.contains('active'));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      setMenu(false);
      hamburger.focus();
    }
  });

  // Reset menu state when the viewport grows past the mobile breakpoint
  window.matchMedia('(min-width: 769px)').addEventListener('change', (m) => {
    if (m.matches) setMenu(false);
  });

  // In-page anchor scrolling is native: CSS scroll-behavior handles smoothness
  // (with a prefers-reduced-motion override) and fragment navigation moves
  // keyboard focus correctly — no JS needed.

  // --- Form submission (Netlify Forms) ---
  // The form posts to Netlify's built-in form handling on this same origin.
  // Submissions appear in the Netlify dashboard under Forms → strategy-call.
  const form = document.getElementById('bookForm');
  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = 'form-status form-status--' + type;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    showStatus('Sending…', 'success');

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!res.ok) throw new Error('Request failed with status ' + res.status);
      showStatus("Thank you — we'll get back to you within one business day.", 'success');
      form.reset();
    } catch (err) {
      showStatus('Something went wrong sending your request. Please try again, or email hello@flowsent.ai directly.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
});
