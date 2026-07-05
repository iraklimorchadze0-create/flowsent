// ============================================
// flowsent.ai — Interactions & Animations
// ============================================

// Set your form endpoint here (e.g. Formspree/Web3Forms/your own API:
// 'https://formspree.io/f/yourFormId'). Until one is set, submissions fall
// back to opening a prefilled email to hello@flowsent.ai so no lead is lost.
const FORM_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Scroll-triggered fade-in animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section-header, .book__wrapper').forEach((el) => {
    el.classList.add('fade-up');
  });
  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

  // --- Navbar scroll effect ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
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

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --- Form submission ---
  const form = document.getElementById('bookForm');
  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');

  const showStatus = (message, type) => {
    status.textContent = message;
    status.className = 'form-status form-status--' + type;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    if (!FORM_ENDPOINT) {
      // No endpoint configured — hand the lead off via a prefilled email draft.
      const body = [
        'Name: ' + data.name,
        'Email: ' + data.email,
        'Company: ' + (data.company || '—'),
        'Interested in: ' + data.service,
        '',
        data.message || ''
      ].join('\n');
      window.location.href = 'mailto:hello@flowsent.ai'
        + '?subject=' + encodeURIComponent('Strategy call request — ' + data.name)
        + '&body=' + encodeURIComponent(body);
      showStatus("Opening your email app — send the draft and we'll be in touch.", 'success');
      return;
    }

    submitBtn.disabled = true;
    showStatus('Sending…', 'success');

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Request failed with status ' + res.status);
      showStatus("Thank you! We'll be in touch within one business day.", 'success');
      form.reset();
    } catch (err) {
      showStatus('Something went wrong sending your request. Please try again, or email hello@flowsent.ai directly.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
});
