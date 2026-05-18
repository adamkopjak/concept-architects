export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__rule"></div>
      <div className="foot__row">
        <span>© Concept Architects, 2008 — 2026.</span>
        <span>Designed in-house. Built with restraint.</span>
        <a href="#top" data-cursor="link">Back to top ↑</a>
      </div>
      <div className="foot__wordmark" aria-hidden="true">
        <span>CONCEPT</span>
        <span>ARCHITECTS</span>
      </div>
    </footer>
  );
}
