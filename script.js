// ============================================
// flowsent.ai — Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Example email: line each margin note up with the phrase it explains ---
  const exhibit = document.getElementById('exhibit');
  const notes = document.getElementById('notes');
  const wideLayout = window.matchMedia('(min-width: 1081px)');

  const placeNotes = () => {
    let floor = 0;
    notes.querySelectorAll('.note').forEach((note) => {
      if (!wideLayout.matches) {
        note.style.top = '';
        return;
      }
      const mark = exhibit.querySelector(`.mark[data-note="${note.dataset.for}"]`);
      const top = mark.getBoundingClientRect().top - notes.getBoundingClientRect().top;
      // Never let a note overlap the one above it
      const placed = Math.max(floor, top - 2);
      note.style.top = `${placed}px`;
      floor = placed + note.offsetHeight + 16;
    });
  };

  placeNotes();
  window.addEventListener('resize', placeNotes);
  document.fonts.ready.then(placeNotes);

  // The page's one reveal: draw the research marks once the email is in view
  const reveal = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      exhibit.classList.add('is-drawn');
      reveal.disconnect();
    }
  }, { threshold: 0.35 });

  reveal.observe(exhibit);

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

  // Booking is handled by the Calendly inline embed (plain iframe in
  // index.html) — no widget.js, so script-src stays hash-pinned.
});
