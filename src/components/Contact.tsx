export default function Contact() {
  return (
    <section className="contact" id="contact" data-screen-label="11 Contact">
      <div className="contact__inner">
        <p className="contact__pre">— Let&apos;s begin a conversation</p>
        <h2 className="contact__h">
          <a href="mailto:studio@conceptarchitects.com" data-cursor="cta" className="contact__mail">
            <span className="reveal-line"><span>studio@</span></span>
            <span className="reveal-line"><span>conceptarchitects</span></span>
            <span className="reveal-line"><span>.com&nbsp;<i>→</i></span></span>
          </a>
        </h2>

        <div className="contact__grid">
          <div>
            <h5>Bratislava — Atelier</h5>
            <p>Smetanova 7<br />811 03 Bratislava<br />Slovakia</p>
            <p><a href="tel:+421900000000">+421 (0) 900 000 000</a></p>
          </div>
          <div>
            <h5>Dubai — Liaison</h5>
            <p>DIFC Gate Village<br />Building 4, Level 7<br />UAE</p>
            <p><a href="tel:+97140000000">+971 4 000 0000</a></p>
          </div>
          <div>
            <h5>Press &amp; speaking</h5>
            <p><a href="mailto:press@conceptarchitects.com">press@conceptarchitects.com</a></p>
            <p>Monograph available on request.</p>
          </div>
          <div>
            <h5>Currently</h5>
            <p>Reviewing commissions for Spring &apos;27 onward.</p>
            <p>We accept one new residence per quarter.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
