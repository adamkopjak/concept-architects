"use client";

import { useEffect, useRef, useState } from "react";

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (y < 100) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("scroll-locked", open);
  }, [open]);

  const closeDrawer = () => setOpen(false);

  return (
    <>
      <header className={`nav${hidden ? " is-hidden" : ""}`} id="nav">
        <a href="#top" className="nav__brand" data-cursor="brand" aria-label="Concept Architects — home">
          <span className="nav__logo" aria-hidden="true" />
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#works" data-cursor="link"><span>01</span>Works</a>
          <a href="#studio" data-cursor="link"><span>02</span>Studio</a>
          <a href="#approach" data-cursor="link"><span>03</span>Approach</a>
          <a href="#contact" data-cursor="link"><span>04</span>Contact</a>
        </nav>
        <a href="#contact" className="nav__cta" data-cursor="cta">
          <span className="nav__cta-dot"></span>
          <span className="nav__cta-text">Commission</span>
        </a>
        <button
          className={`nav__burger${open ? " is-open" : ""}`}
          id="burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
        </button>
      </header>

      <div className={`drawer${open ? " is-open" : ""}`} id="drawer" aria-hidden={!open}>
        <nav className="drawer__nav" onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "A") closeDrawer();
        }}>
          <a href="#works"><span>01</span>Works</a>
          <a href="#studio"><span>02</span>Studio</a>
          <a href="#approach"><span>03</span>Approach</a>
          <a href="#contact"><span>04</span>Contact</a>
        </nav>
        <div className="drawer__foot">
          <p>Štúdio · Bratislava — Dubai — Phuket</p>
          <p><a href="mailto:studio@conceptarchitects.com">studio@conceptarchitects.com</a></p>
        </div>
      </div>
    </>
  );
}
