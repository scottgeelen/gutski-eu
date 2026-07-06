import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

export default function CtaBanner({ t }: { t: Dictionary }) {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="cta-banner">
          <div>
            <h2>{t.cta_title}</h2>
            <p>{t.cta_sub}</p>
          </div>
          <a className="btn" href="https://skipullies.com" target="_blank" rel="noopener">
            {t.cta_btn} ↗
          </a>
        </Reveal>
      </div>
    </section>
  );
}
