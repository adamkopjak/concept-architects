"use client";

import { useEffect, useRef, useState } from "react";

export default function Loader() {
  const [done, setDone] = useState(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let p = 0;
    let raf = 0;
    const tick = () => {
      const target = document.readyState === "complete" ? 100 : 90;
      p = p + (target - p) * 0.04;
      if (target === 100 && p > 99.4) p = 100;
      if (barRef.current) barRef.current.style.width = p + "%";
      if (pctRef.current) pctRef.current.textContent = String(Math.floor(p)).padStart(2, "0");
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          document.body.classList.add("is-loaded");
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`loader${done ? " is-done" : ""}`} id="loader" aria-hidden="true">
      <div className="loader__bar">
        <span ref={barRef}></span>
      </div>
      <div className="loader__mark">
        <span className="loader__a">A</span>
        <span className="loader__name">CONCEPT&nbsp;ARCHITECTS</span>
      </div>
      <div className="loader__pct">
        <span ref={pctRef}>00</span>
      </div>
    </div>
  );
}
