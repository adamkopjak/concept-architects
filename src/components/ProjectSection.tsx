"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";

type Props = { project: Project; index: number; total: number };

export default function ProjectSection({ project, index, total }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const bar = barRef.current;
    const prev = prevRef.current;
    const next = nextRef.current;
    if (!track) return;

    let dragging = false,
      startX = 0,
      startScroll = 0,
      moved = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture?.(e.pointerId);
      track.classList.add("is-grabbing");
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      track.scrollLeft = startScroll - dx;
    };
    const stop = () => {
      dragging = false;
      track.classList.remove("is-grabbing");
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onDragStart = (e: Event) => e.preventDefault();
    const onWheel = (e: WheelEvent) => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const dy = e.deltaY,
        dx = e.deltaX;
      const intent = Math.abs(dy) >= Math.abs(dx) ? dy : dx;
      if (intent === 0) return;
      const atStart = track.scrollLeft <= 0 && intent < 0;
      const atEnd = track.scrollLeft >= max - 1 && intent > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      track.scrollBy({ left: intent, behavior: "auto" });
    };

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", stop);
    track.addEventListener("pointercancel", stop);
    track.addEventListener("pointerleave", stop);
    track.addEventListener("dragstart", onDragStart);
    track.addEventListener("click", onClickCapture, true);
    track.addEventListener("wheel", onWheel, { passive: false });

    const page = () => Math.max(280, track.clientWidth * 0.8);
    const onPrev = () => track.scrollBy({ left: -page(), behavior: "smooth" });
    const onNext = () => track.scrollBy({ left: page(), behavior: "smooth" });
    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (!bar) return;
      if (max <= 0) {
        bar.style.width = "100%";
        bar.style.transform = "";
        if (prev) prev.disabled = true;
        if (next) next.disabled = true;
        return;
      }
      const pct = Math.min(1, Math.max(0, track.scrollLeft / max));
      const visible = track.clientWidth / track.scrollWidth;
      bar.style.width = visible * 100 + "%";
      const container = bar.parentElement;
      if (!container) return;
      const cw = container.clientWidth;
      const bw = bar.offsetWidth;
      bar.style.transform = `translateX(${(cw - bw) * pct}px)`;
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= max - 1;
    };
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    setTimeout(update, 80);
    window.addEventListener("load", update);
    Array.from(track.querySelectorAll("img")).forEach((img) => {
      if ((img as HTMLImageElement).complete) return;
      img.addEventListener("load", update, { once: true });
    });

    return () => {
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", stop);
      track.removeEventListener("pointercancel", stop);
      track.removeEventListener("pointerleave", stop);
      track.removeEventListener("dragstart", onDragStart);
      track.removeEventListener("click", onClickCapture, true);
      track.removeEventListener("wheel", onWheel);
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  return (
    <section
      className={`project project--${project.theme}`}
      id={`p-${project.slug}`}
      data-screen-label={`Project ${project.name}`}
    >
      <div className="project__inner">
        <div
          className={`project__title-bg${project.theme === "light" ? " project__title-bg--light" : ""}`}
          aria-hidden="true"
        >
          {project.titleBg}
        </div>

        <aside className="project__meta">
          <span className="project__tag">
            — Project {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h3
            className="project__name"
            dangerouslySetInnerHTML={{ __html: project.nameHtml ?? project.name }}
          />
          <dl className="project__data">
            <div><dt>Location</dt><dd>{project.locationFull}</dd></div>
            <div><dt>Year</dt><dd>{project.yearFull}</dd></div>
            <div><dt>Programme</dt><dd>{project.programme}</dd></div>
            <div><dt>Area</dt><dd>{project.area}</dd></div>
            <div><dt>Status</dt><dd>{project.status}</dd></div>
          </dl>
          <p className="project__body">{project.body}</p>
          <a href="#contact" className="project__link" data-cursor="link">
            <span>{project.ctaLabel}</span>
            <i>→</i>
          </a>
        </aside>

        <div className="project__strip">
          <div className="project__strip-track" ref={trackRef}>
            {project.gallery.map((shot, i) => (
              <figure key={i} className={`shot shot--${shot.layout}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shot.src} alt={shot.alt} />
              </figure>
            ))}
          </div>
          <div className="project__strip-cue">
            <button className="project__nav" ref={prevRef} aria-label="Previous image">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <button className="project__nav" ref={nextRef} aria-label="Next image">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <span>scroll · drag · swipe</span>
            <div className="project__strip-bar"><span ref={barRef}></span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
