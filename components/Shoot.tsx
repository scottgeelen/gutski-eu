import Image from "next/image";
import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

const SHOTS = [1, 2, 3, 4, 5, 6, 7, 8]; // /public/images/shoot-1.jpg … shoot-8.jpg

export default function Shoot({ t }: { t: Dictionary }) {
  return (
    <section id="shoot" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="sec-head" >
          <span className="mono">{t.shoot_eyebrow}</span>
          <h2>{t.shoot_title}</h2>
          <p>{t.shoot_sub}</p>
        </Reveal>
      </div>
      <Reveal className="strip">
        {SHOTS.map((n) => (
          <figure key={n}>
            <Image
              src={`/images/shoot-${n}.jpg`}
              alt={`Gutski campagne Livigno ${n}`}
              fill
              sizes="(max-width: 640px) 74vw, 400px"
              style={{ objectFit: "cover" }}
              className="ld"
              loading="lazy"
            />
            <figcaption>
              LIVIGNO · {String(n).padStart(2, "0")}/{String(SHOTS.length).padStart(2, "0")}
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
