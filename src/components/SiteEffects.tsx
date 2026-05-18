"use client";

import { useEffect } from "react";

export default function SiteEffects() {
  useEffect(() => {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    // ---- Parallax
    let parallaxOff: (() => void) | null = null;
    if (!reduceMotion) {
      const items = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]")).map(
        (el) => ({ el, amt: parseFloat(el.dataset.parallax || "0.1") })
      );
      const onScroll = () => {
        const vh = innerHeight;
        for (const it of items) {
          const r = it.el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) continue;
          const center = r.top + r.height / 2 - vh / 2;
          const t = clamp(center / vh, -1, 1);
          it.el.style.transform = `translate3d(0, ${(-t * it.amt * 100).toFixed(2)}px, 0)`;
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
      parallaxOff = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    // ---- Reveal sections
    const revealIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revealIo.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll(".manifesto__text, .works__h, .approach__h, .studio__h, .contact__h")
      .forEach((el) => revealIo.observe(el));

    // ---- Counters
    const counterIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const end = parseInt(el.dataset.count || "0", 10);
          const dur = 1400;
          const t0 = performance.now();
          const tick = (t: number) => {
            const k = clamp((t - t0) / dur, 0, 1);
            const eased = 1 - Math.pow(1 - k, 3);
            const v = Math.floor(eased * end);
            el.textContent = String(v).padStart(String(end).length, "0");
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterIo.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => counterIo.observe(el));

    // ---- Ticker pause on hover
    const tickerTrack = document.querySelector<HTMLElement>(".ticker__track");
    const onTickerEnter = () => {
      if (tickerTrack) tickerTrack.style.animationPlayState = "paused";
    };
    const onTickerLeave = () => {
      if (tickerTrack) tickerTrack.style.animationPlayState = "running";
    };
    tickerTrack?.addEventListener("mouseenter", onTickerEnter);
    tickerTrack?.addEventListener("mouseleave", onTickerLeave);

    // ---- Anchor smooth scroll
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href^=\"#\"]");
      if (!a) return;
      const id = a.getAttribute("href") || "";
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);

    return () => {
      parallaxOff?.();
      revealIo.disconnect();
      counterIo.disconnect();
      tickerTrack?.removeEventListener("mouseenter", onTickerEnter);
      tickerTrack?.removeEventListener("mouseleave", onTickerLeave);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
