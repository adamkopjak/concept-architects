const WORDS = ["Restraint", "Material", "Light", "Proportion", "Silence", "Craft"];

function Group({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="ticker__group" {...(ariaHidden ? { "aria-hidden": "true" } : {})}>
      {WORDS.flatMap((w, i) => [
        <span key={`w-${i}`}>{w}</span>,
        <span key={`x-${i}`} aria-hidden="true">✕</span>,
      ])}
    </div>
  );
}

export default function Ticker() {
  return (
    <section className="ticker" aria-hidden="true">
      <div className="ticker__track">
        <Group />
        <Group ariaHidden />
      </div>
    </section>
  );
}
