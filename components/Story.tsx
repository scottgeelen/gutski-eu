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
            alt={t.story_alt}
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
          <p className="story-conf">
            <a href="https://skipullies.com" target="_blank" rel="noopener">
              {t.conf_note}
            </a>
          </p>
        </Reveal>
      </div>

      {/* Producteigenschappen — de officiële GUTSKI-iconen (label zit al in het icoon) */}
      <Reveal className="wrap prop-grid" aria-label="Producteigenschappen">
        <div className="prop-item">
          <img src="/icons/icon-thermal.svg" alt="GUTSKI Thermal" />
          <p>{t.prop_thermal}</p>
        </div>
        <div className="prop-item">
          <img src="/icons/icon-active.svg" alt="GUTSKI Active" />
          <p>{t.prop_active}</p>
        </div>
        <div className="prop-item">
          <img src="/icons/icon-stretch.svg" alt="GUTSKI Stretch" />
          <p>{t.prop_stretch}</p>
        </div>
        <div className="prop-item">
          <img src="/icons/icon-soft.svg" alt="GUTSKI Soft" />
          <p>{t.prop_soft}</p>
        </div>
        <div className="prop-item">
          <img src="/icons/icon-fresh-anti-odor.svg" alt="GUTSKI Fresh — Anti-Odor" />
          <p>{t.prop_fresh}</p>
        </div>
      </Reveal>
    </section>
  );
}
