"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;
    document.body.classList.add("has-cursor");

    const cur = cursorRef.current!;
    const dot = cur.querySelector(".cursor__dot") as HTMLElement;
    const ring = cur.querySelector(".cursor__ring") as HTMLElement;
    const label = labelRef.current!;

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let dx = mx, dy = my, rx = mx, ry = my;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const tick = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      label.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: Event) => {
      const t = (e.target as Element).closest("[data-cursor], a, button");
      if (!t) return;
      cur.classList.add("is-hover");
      const kind = (t as HTMLElement).dataset?.cursor;
      if (kind === "cta") {
        cur.classList.add("is-cta");
        label.textContent = "Get in touch";
      }
      if (kind === "link") label.textContent = "";
      if (kind === "drag") {
        cur.classList.add("is-drag");
        label.textContent = "Drag";
      }
    };
    const onOut = (e: Event) => {
      const t = (e.target as Element).closest("[data-cursor], a, button");
      if (!t) return;
      cur.classList.remove("is-hover", "is-cta", "is-drag");
      label.textContent = "";
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={cursorRef} aria-hidden="true">
      <div className="cursor__dot"></div>
      <div className="cursor__ring"></div>
      <div className="cursor__label" ref={labelRef}></div>
    </div>
  );
}
