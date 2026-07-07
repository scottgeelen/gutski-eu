import Reveal from "./Reveal";
import ParallaxImage from "./ParallaxImage";
import type { Dictionary } from "@/lib/dictionaries";

export default function Story({ t }: { t: Dictionary }) {
  return (
    <section id="merk">
      <div className="wrap story">
        <Reveal className="story-visual">
          <ParallaxImage
            src="/images/story.jpg"
            alt="Model in een donkergroene GUTSKI skipully tijdens de FW26/27-fotoshoot in de bergen bij Livigno"
            sizes="(max-width: 1020px) 92vw, 560px"
          />
          <div className="tag">
            <span className="mono">{t.story_tag_label}</span>
            <b>{t.story_tag_text}</b>
          </div>
        </Reveal>
        <Reveal className="story-copy">
          <span className="mono">{t.story_eyebrow}</span>
          <h2>{t.story_title}</h2>
          <p>{t.story_p1}</p>
          <p>{t.story_p2}</p>
          <p className="tagline">{t.tagline}</p>
          <div className="story-points">
            {[
              [t.usp1_t, t.usp1_s],
              [t.usp2_t, t.usp2_s],
              [t.usp3_t, t.usp3_s],
            ].map(([title, sub]) => (
              <div key={title}>
                <span className="dot" />
                <div>
                  <b>{title}</b>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="usps" aria-label="Performance">
            {["Thermal", "Active", "Stretch", "Soft", "Fresh"].map((u) => (
              <span key={u}>{u}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
