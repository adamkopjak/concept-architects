export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto" data-screen-label="02 Manifesto">
      <div className="manifesto__index">
        <span>—— 00</span>
        <span>Manifesto</span>
      </div>
      <h2 className="manifesto__text">
        <span className="reveal-line"><span>We design buildings the way</span></span>
        <span className="reveal-line"><span>a watchmaker designs a movement —</span></span>
        <span className="reveal-line"><span><em>every</em> element resolved,</span></span>
        <span className="reveal-line"><span>nothing decorative, nothing left</span></span>
        <span className="reveal-line"><span>to a&nbsp;detail&nbsp;drawing.</span></span>
      </h2>
      <div className="manifesto__signoff">
        <div>
          <p className="manifesto__small">
            Practice based in Bratislava, with built projects across Slovakia, the UAE and South-East Asia.
          </p>
        </div>
        <div className="manifesto__sig">
          <svg viewBox="0 0 200 60" aria-hidden="true">
            <path d="M10 40 Q 30 5, 55 35 T 100 35 Q 130 50, 150 20 T 195 30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span>Ing. arch. Peter Kopjak, founding architect</span>
        </div>
      </div>
    </section>
  );
}
