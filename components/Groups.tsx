import Image from "next/image";
import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

const PHOTOS = [
  { src: "/images/groep-skiclubs.jpg", alt: "Skiclub in GUTSKI pully's op de piste in de Alpen" },
  { src: "/images/groep-vrienden.jpg", alt: "Vriendengroep in GUTSKI pully's in de après-ski-bar" },
  { src: "/images/groep-bedrijven.jpg", alt: "Bedrijfsgroep in GUTSKI pully's tijdens de après-ski" },
];

export default function Groups({ t }: { t: Dictionary }) {
  const cards = [
    { ...PHOTOS[0], title: t.grp1_t, sub: t.grp1_s },
    { ...PHOTOS[1], title: t.grp2_t, sub: t.grp2_s },
    { ...PHOTOS[2], title: t.grp3_t, sub: t.grp3_s },
  ];
  return (
    <section id="groepen">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">{t.grp_eyebrow}</span>
          <h2>{t.grp_title}</h2>
          <p>{t.grp_sub}</p>
        </Reveal>
        <div className="groups">
          {cards.map((c, i) => (
            <Reveal className="group-card" key={c.src} delay={i * 60}>
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1020px) 46vw, 380px"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
              <div className="g-body">
                <h3>{c.title}</h3>
                <p>{c.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
