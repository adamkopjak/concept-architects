"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

type Props = { projects: Project[] };

export default function WorksList({ projects }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const floaterRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
    const list = listRef.current;
    const floater = floaterRef.current;
    const img = imgRef.current;
    if (!list || !floater || !img) return;

    const rows = Array.from(list.querySelectorAll<HTMLElement>(".works__row"));

    const scrollToTarget = (row: HTMLElement) => {
      const targetId = row.dataset.target;
      if (!targetId) return;
      const target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (isTouch) {
      const handlers = rows.map((row) => {
        const fn = () => scrollToTarget(row);
        row.addEventListener("click", fn);
        return [row, fn] as const;
      });
      return () => handlers.forEach(([row, fn]) => row.removeEventListener("click", fn));
    }

    // preload previews
    const seen = new Set<string>();
    rows.forEach((row) => {
      const src = row.dataset.preview;
      if (src && !seen.has(src)) {
        seen.add(src);
        const pre = new Image();
        pre.src = src;
      }
    });

    let mx = innerWidth / 2,
      my = innerHeight / 2,
      fx = mx,
      fy = my;

    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("pointermove", onPointerMove);

    let raf = 0;
    const tick = () => {
      fx += (mx - fx) * 0.18;
      fy += (my - fy) * 0.18;
      floater.style.left = fx + "px";
      floater.style.top = fy + "px";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const enterHandlers = rows.map((row) => {
      const onEnter = (e: PointerEvent) => {
        const src = row.dataset.preview;
        if (src && !img.src.endsWith(src)) img.src = src;
        fx = e.clientX;
        fy = e.clientY;
        floater.style.left = fx + "px";
        floater.style.top = fy + "px";
        floater.classList.add("is-active");
      };
      const onLeave = () => floater.classList.remove("is-active");
      const onClick = () => {
        floater.classList.remove("is-active");
        scrollToTarget(row);
      };
      row.addEventListener("pointerenter", onEnter);
      row.addEventListener("pointerleave", onLeave);
      row.addEventListener("click", onClick);
      return [row, onEnter, onLeave, onClick] as const;
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      enterHandlers.forEach(([row, onEnter, onLeave, onClick]) => {
        row.removeEventListener("pointerenter", onEnter);
        row.removeEventListener("pointerleave", onLeave);
        row.removeEventListener("click", onClick);
      });
    };
  }, []);

  return (
    <section className="works" id="works" data-screen-label="03 Works">
      <div className="works__head">
        <div className="works__index">
          <span>—— 01</span>
          <span>Selected Works</span>
        </div>
        <h2 className="works__h">
          <span className="reveal-line"><span>Four houses,</span></span>
          <span className="reveal-line"><span>four climates,</span></span>
          <span className="reveal-line"><span>one&nbsp;sensibility.</span></span>
        </h2>
      </div>

      <ul className="works__list" id="works-list" ref={listRef}>
        {projects.map((p, i) => (
          <li key={p.slug}>
            <button
              type="button"
              className="works__row"
              data-target={`#p-${p.slug}`}
              data-preview={p.preview}
            >
              <span className="works__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="works__name">{p.name}</span>
              <span className="works__loc">{p.location}</span>
              <span className="works__year">{p.year}</span>
              <span className="works__arrow">→</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="works__floater" id="works-floater" aria-hidden="true" ref={floaterRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} alt="" decoding="async" />
      </div>
    </section>
  );
}
