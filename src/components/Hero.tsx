import Clock from "./Clock";

export default function Hero() {
  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="hero__media">
        <div className="hero__shutter" aria-hidden="true"></div>
        <img
          src="/assets/img/smetanova-05.jpg"
          alt="Smetanova Residence at dusk, Bratislava"
          className="hero__img"
          data-parallax="0.18"
        />
        <div className="hero__vignette"></div>
      </div>

      <div className="hero__copy">
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-dot"></span>
          <span>Independent practice · est. 2008</span>
        </div>
        <h1 className="hero__title">
          <span className="line"><span className="line__in">Architecture</span></span>
          <span className="line"><span className="line__in">that lives</span></span>
          <span className="line italic"><span className="line__in">quietly,</span></span>
          <span className="line"><span className="line__in">at a&nbsp;higher pitch.</span></span>
        </h1>
        <p className="hero__sub">
          Concept Architects designs private residences, ateliers and resort retreats for clients who measure luxury in light, material and silence — not square metres.
        </p>
      </div>

      <aside className="hero__meta">
        <div className="hero__meta-row"><span>N 48°08&apos;42&quot;</span><span>E 17°06&apos;17&quot;</span></div>
        <div className="hero__meta-row"><span>Currently</span><Clock /></div>
        <div className="hero__meta-row"><span>Now booking</span><span>Spring &apos;27</span></div>
      </aside>

      <a href="#manifesto" className="hero__scroll" data-cursor="link" aria-label="Scroll to explore">
        <span className="hero__scroll-label">Scroll</span>
        <span className="hero__scroll-line"></span>
      </a>

      <div className="hero__index">
        <span>01</span> / <span>04</span>
      </div>
    </section>
  );
}
