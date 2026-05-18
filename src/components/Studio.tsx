export default function Studio() {
  return (
    <section className="studio" id="studio" data-screen-label="08 Studio">
      <div className="studio__head">
        <div className="works__index">
          <span>—— 02</span>
          <span>Studio</span>
        </div>
        <h2 className="studio__h">
          <span className="reveal-line"><span>A small studio</span></span>
          <span className="reveal-line"><span>with a&nbsp;long&nbsp;memory.</span></span>
        </h2>
      </div>

      <div className="studio__grid">
        <figure className="studio__portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/founder.jpg"
            alt="Ing. arch. Peter Kopjak, founding architect"
            data-parallax="0.08"
          />
          <figcaption>
            <span>Ing. arch. Peter Kopjak</span>
            <span>Founding architect</span>
          </figcaption>
        </figure>
        <div className="studio__copy">
          <p className="studio__lead">
            Founded in 2008, Concept Architects has remained deliberately compact — never more than twelve people, never more than seven live projects.
          </p>
          <p>
            Every commission is led personally by Peter from first sketch to handover key. We don&apos;t subcontract design, we don&apos;t repeat plans, and we don&apos;t take on more than we can resolve at full fidelity.
          </p>
          <p>
            Our clients come to us because they have already seen the other studios. They stay because the conversation is honest, the drawings are accurate, and the buildings — when they&apos;re finally inhabited — feel inevitable.
          </p>
          <ul className="studio__bullets">
            <li><span>—</span>Independently owned, debt-free, employee-led.</li>
            <li><span>—</span>Bilingual practice: Slovak / English, working in EN-US drawings.</li>
            <li><span>—</span>Network of trusted contractors across CEE, the Gulf and SE Asia.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
