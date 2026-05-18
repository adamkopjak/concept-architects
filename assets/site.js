/* =========================================================
   CONCEPT ARCHITECTS — site interactivity
   Vanilla, no deps. Mounts on DOMContentLoaded.
   ========================================================= */

(() => {
  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====== LOADER ====== */
  function initLoader() {
    const loader = $('#loader');
    const bar = loader.querySelector('.loader__bar span');
    const pct = loader.querySelector('[data-pct]');
    let p = 0;
    const tick = () => {
      // Ease towards 95 while waiting, snap to 100 on load
      const target = document.readyState === 'complete' ? 100 : 90;
      p = lerp(p, target, 0.04);
      if (target === 100 && p > 99.4) p = 100;
      bar.style.width = p + '%';
      pct.textContent = String(Math.floor(p)).padStart(2, '0');
      if (p < 100) requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          loader.classList.add('is-done');
          document.body.classList.add('is-loaded');
          startHero();
        }, 250);
      }
    };
    requestAnimationFrame(tick);
    window.addEventListener('load', () => { /* readyState now complete */ });
  }

  function startHero() {
    // hero animations are CSS-driven and start on first paint. Nothing to do.
  }

  /* ====== CUSTOM CURSOR ====== */
  function initCursor() {
    if (isTouch) return;
    document.body.classList.add('has-cursor');
    const cur = $('.cursor');
    const dot = cur.querySelector('.cursor__dot');
    const ring = cur.querySelector('.cursor__ring');
    const label = cur.querySelector('.cursor__label');

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my;

    window.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
    });

    const raf = () => {
      dx = lerp(dx, mx, 0.55);
      dy = lerp(dy, my, 0.55);
      rx = lerp(rx, mx, 0.18);
      ry = lerp(ry, my, 0.18);
      dot.style.transform  = `translate3d(${dx}px, ${dy}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      label.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // hover affordances
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], a, button');
      if (!t) return;
      cur.classList.add('is-hover');
      const kind = t.dataset?.cursor;
      if (kind === 'cta')  { cur.classList.add('is-cta');  label.textContent = 'Get in touch'; }
      if (kind === 'link') { label.textContent = ''; }
      if (kind === 'drag') { cur.classList.add('is-drag'); label.textContent = 'Drag'; }
    });
    document.addEventListener('pointerout', e => {
      const t = e.target.closest('[data-cursor], a, button');
      if (!t) return;
      cur.classList.remove('is-hover', 'is-cta', 'is-drag');
      label.textContent = '';
    });
  }

  /* ====== NAV: hide on scroll down ====== */
  function initNav() {
    const nav = $('#nav');
    let last = 0, hidden = false;
    addEventListener('scroll', () => {
      const y = scrollY;
      const dy = y - last;
      if (y < 100) { nav.classList.remove('is-hidden'); hidden = false; }
      else if (dy > 6 && !hidden) { nav.classList.add('is-hidden'); hidden = true; }
      else if (dy < -6 && hidden) { nav.classList.remove('is-hidden'); hidden = false; }
      last = y;
    }, { passive: true });

    const burger = $('#burger');
    const drawer = $('#drawer');
    if (burger) {
      burger.addEventListener('click', () => {
        const open = drawer.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open);
        document.body.classList.toggle('scroll-locked', open);
      });
      drawer.addEventListener('click', e => {
        if (e.target.matches('a')) {
          drawer.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('scroll-locked');
        }
      });
    }
  }

  /* ====== HERO CLOCK ====== */
  function initClock() {
    const el = document.querySelector('[data-clock]');
    if (!el) return;
    const tz = 'Europe/Bratislava';
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false
    });
    const upd = () => { el.textContent = fmt.format(new Date()) + ' BTS'; };
    upd();
    setInterval(upd, 30 * 1000);
  }

  /* ====== PARALLAX (scroll-tied) ====== */
  function initParallax() {
    if (reduceMotion) return;
    const items = $$('[data-parallax]').map(el => ({
      el,
      amt: parseFloat(el.dataset.parallax) || 0.1
    }));
    const onScroll = () => {
      const vh = innerHeight;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        // -1 .. 1 across viewport
        const center = (r.top + r.height/2) - vh/2;
        const t = clamp(center / vh, -1, 1);
        it.el.style.transform = `translate3d(0, ${(-t * it.amt * 100).toFixed(2)}px, 0)`;
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  /* ====== REVEAL SECTIONS ====== */
  function initReveals() {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    // Anything with reveal-line direct children, or pre-marked
    $$('.manifesto__text, .works__h, .approach__h, .studio__h, .contact__h').forEach(el => io.observe(el));
  }

  /* ====== WORKS LIST: floating preview ====== */
  function initWorksHover() {
    if (isTouch) {
      $$('#works-list .works__row').forEach(row => {
        row.addEventListener('click', () => {
          const target = $(row.dataset.target);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      return;
    }

    const floater = $('#works-floater');
    const img = floater.querySelector('img');
    let mx = innerWidth / 2, my = innerHeight / 2, fx = mx, fy = my;

    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });

    const raf = () => {
      fx = lerp(fx, mx, 0.18);
      fy = lerp(fy, my, 0.18);
      floater.style.left = fx + 'px';
      floater.style.top  = fy + 'px';
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // preload previews so the image is ready the first time it's needed
    const seen = new Set();
    $$('#works-list .works__row').forEach(row => {
      const src = row.dataset.preview;
      if (!seen.has(src)) {
        seen.add(src);
        const pre = new Image();
        pre.src = src;
      }
    });

    $$('#works-list .works__row').forEach(row => {
      row.addEventListener('pointerenter', e => {
        const src = row.dataset.preview;
        if (!img.src.endsWith(src)) img.src = src;
        // snap to cursor so floater appears at the pointer (not 0,0)
        fx = e.clientX; fy = e.clientY;
        floater.style.left = fx + 'px';
        floater.style.top  = fy + 'px';
        floater.classList.add('is-active');
      });
      row.addEventListener('pointerleave', () => {
        floater.classList.remove('is-active');
      });
      row.addEventListener('click', () => {
        const target = $(row.dataset.target);
        if (target) {
          floater.classList.remove('is-active');
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ====== PROJECT IMAGE STRIPS ======
     Native horizontal scrolling + drag + wheel-to-horizontal +
     prev/next paging. No vertical-scroll hijacking — the strip is
     its own little control. */
  function initStrips() {
    $$('.project').forEach(section => {
      const track = section.querySelector('[data-strip-track]');
      const strip = section.querySelector('[data-strip]');
      const bar   = section.querySelector('[data-strip-bar]');
      const prev  = section.querySelector('[data-strip-prev]');
      const next  = section.querySelector('[data-strip-next]');
      if (!track) return;

      // drag-to-scroll (mouse + pen). Touch uses native swipe.
      let dragging = false, startX = 0, startScroll = 0, moved = 0;
      track.addEventListener('pointerdown', e => {
        if (e.pointerType === 'touch') return;
        dragging = true; moved = 0;
        startX = e.clientX;
        startScroll = track.scrollLeft;
        track.setPointerCapture?.(e.pointerId);
        track.classList.add('is-grabbing');
      });
      track.addEventListener('pointermove', e => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        track.scrollLeft = startScroll - dx;
      });
      const stop = () => { dragging = false; track.classList.remove('is-grabbing'); };
      track.addEventListener('pointerup', stop);
      track.addEventListener('pointercancel', stop);
      track.addEventListener('pointerleave', stop);
      track.addEventListener('dragstart', e => e.preventDefault());
      track.addEventListener('click', e => {
        if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
      }, true);

      // vertical wheel → horizontal scroll within the strip, but only
      // when there is still room to scroll horizontally. At the edges
      // we release back to page-scroll so the user doesn't get stuck.
      track.addEventListener('wheel', e => {
        const max = track.scrollWidth - track.clientWidth;
        if (max <= 0) return;
        const dy = e.deltaY, dx = e.deltaX;
        const intent = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
        if (intent === 0) return;
        const atStart = track.scrollLeft <= 0 && intent < 0;
        const atEnd   = track.scrollLeft >= max - 1 && intent > 0;
        if (atStart || atEnd) return;
        e.preventDefault();
        track.scrollBy({ left: intent, behavior: 'auto' });
      }, { passive: false });

      // prev/next buttons paginate by ~80% of the visible strip
      const page = () => Math.max(280, track.clientWidth * 0.8);
      prev?.addEventListener('click', () => track.scrollBy({ left: -page(), behavior: 'smooth' }));
      next?.addEventListener('click', () => track.scrollBy({ left:  page(), behavior: 'smooth' }));

      // progress bar + disabled state
      const upd = () => {
        const max = track.scrollWidth - track.clientWidth;
        if (!bar) return;
        if (max <= 0) { bar.style.width = '100%'; bar.style.transform = ''; if (prev) prev.disabled = true; if (next) next.disabled = true; return; }
        const pct = clamp(track.scrollLeft / max, 0, 1);
        const visible = track.clientWidth / track.scrollWidth;
        bar.style.width = (visible * 100) + '%';
        const container = bar.parentElement;
        const cw = container.clientWidth;
        const bw = bar.offsetWidth;
        bar.style.transform = `translateX(${(cw - bw) * pct}px)`;
        if (prev) prev.disabled = track.scrollLeft <= 1;
        if (next) next.disabled = track.scrollLeft >= max - 1;
      };
      track.addEventListener('scroll', upd, { passive: true });
      addEventListener('resize', upd);
      setTimeout(upd, 80);
      window.addEventListener('load', upd);
      // remeasure once images load
      $$('img', track).forEach(img => {
        if (img.complete) return;
        img.addEventListener('load', upd, { once: true });
      });
    });
  }

  /* ====== ANIMATED COUNTERS ====== */
  function initCounters() {
    const els = $$('[data-count]');
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target;
        const end = parseInt(el.dataset.count, 10);
        const dur = 1400;
        const t0 = performance.now();
        const tick = (t) => {
          const k = clamp((t - t0) / dur, 0, 1);
          const eased = 1 - Math.pow(1 - k, 3);
          const v = Math.floor(eased * end);
          el.textContent = String(v).padStart(String(end).length, '0');
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      }
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  /* ====== TICKER PAUSE ON HOVER (subtle) ====== */
  function initTicker() {
    const track = $('.ticker__track');
    if (!track) return;
    let paused = false;
    track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }

  /* ====== ANCHOR SMOOTH SCROLL OFFSET ====== */
  function initAnchors() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + scrollY - 0; // nav uses mix-blend, so no offset needed
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  }

  /* ====== BOOT ====== */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNav();
    initClock();
    initParallax();
    initReveals();
    initWorksHover();
    initStrips();
    initCounters();
    initTicker();
    initAnchors();
  });

})();
