// ============================================
// flowsent.ai — Interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect ---
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu (home page only) ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
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
  }

  // --- Pre-call page: the booked time ---
  // Calendly's redirect can pass the booking in the URL ("Pass event details" in the
  // event's confirmation settings). Shown in the visitor's own time zone; skipped if absent.
  const booked = document.getElementById('bookedTime');
  if (booked) {
    const start = new Date(new URLSearchParams(location.search).get('event_start_time') || '');
    if (!Number.isNaN(start.getTime())) {
      const locale = navigator.language.startsWith('en') ? undefined : 'en-US';
      const when = new Intl.DateTimeFormat(locale, {
        weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit',
      }).format(start);
      booked.textContent = `Booked for ${when}, your time.`;
      booked.hidden = false;
      document.querySelectorAll('[data-booked-time]').forEach((el) => { el.textContent = when; });
    }
  }

  // --- Pre-call page: one player for the six quick answers ---
  // Each question button carries its video's embed URL in data-video. Until a video
  // exists the attribute is empty and the player shows the "being recorded" note.
  const answers = document.querySelector('.answers');
  if (answers) {
    const player = answers.querySelector('.answers__player');
    const items = answers.querySelectorAll('.answers__item');
    const pending = player.innerHTML;

    const show = (item) => {
      items.forEach((i) => {
        if (i === item) i.setAttribute('aria-current', 'true');
        else i.removeAttribute('aria-current');
      });
      const question = item.querySelector('.answers__q').textContent;
      if (item.dataset.video) {
        const frame = document.createElement('iframe');
        frame.src = item.dataset.video;
        frame.title = question;
        frame.allow = 'autoplay; fullscreen';
        frame.allowFullscreen = true;
        player.replaceChildren(frame);
      } else {
        player.innerHTML = pending;
        player.querySelector('.vsl__title').textContent = question;
      }
      // On a phone the list sits below the player, so bring the player back into view
      if (player.getBoundingClientRect().top < 0) player.scrollIntoView();
    };

    items.forEach((item) => item.addEventListener('click', () => show(item)));
  }

  // In-page anchor scrolling is native: CSS scroll-behavior handles smoothness
  // (with a prefers-reduced-motion override) and fragment navigation moves
  // keyboard focus correctly — no JS needed.

  // Booking is handled by the Calendly inline embed (plain iframe in
  // index.html) — no widget.js, so script-src stays 'self'.
});
