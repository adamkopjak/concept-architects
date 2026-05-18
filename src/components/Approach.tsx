const STEPS = [
  { n: "01", h: "Brief", p: "A long, slow afternoon at your existing home, or where you'd like the new one to stand. We listen more than we draw." },
  { n: "02", h: "Concept", p: "Two or three radically different propositions, built as physical models and atmosphere boards. One is chosen, not designed by committee." },
  { n: "03", h: "Resolution", p: "Full design development in-house: structure, climate, every joint detailed by the same hand that drew the concept." },
  { n: "04", h: "Site", p: "We're on site weekly. Site decisions live with the architect, not the contractor's commercial lead." },
  { n: "05", h: "Aftercare", p: "A five-year relationship: we return for the snag walk, the first winter, the second summer, the day you change the planting scheme." },
];

export default function Approach() {
  return (
    <section className="approach" id="approach" data-screen-label="10 Approach">
      <div className="works__head">
        <div className="works__index">
          <span>—— 03</span>
          <span>Approach</span>
        </div>
        <h2 className="approach__h">
          <span className="reveal-line"><span>Five conversations,</span></span>
          <span className="reveal-line"><span>then a&nbsp;house.</span></span>
        </h2>
      </div>

      <ol className="approach__steps">
        {STEPS.map((s) => (
          <li key={s.n}>
            <span className="approach__step">{s.n}</span>
            <h4>{s.h}</h4>
            <p>{s.p}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
