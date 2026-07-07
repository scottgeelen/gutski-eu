import Image from "next/image";
import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

const SHOTS = [1, 2, 3, 4, 5, 6, 7, 8]; // /public/images/shoot-1.jpg … shoot-8.jpg

// Beschrijvende alt-teksten per campagnefoto (FW26/27, Livigno)
const ALTS: Record<number, string> = {
  1: "Skiër in een GUTSKI skipully op de piste in Livigno",
  2: "Close-up van de geborstelde stof van een GUTSKI pully in de sneeuw",
  3: "Twee vrienden in GUTSKI pullies bij de gondel in Livigno",
  4: "Model in een GUTSKI pully tegen een besneeuwde bergwand",
  5: "Snowboarder in een GUTSKI pully tijdens de FW26/27-shoot",
  6: "Groep in bijpassende GUTSKI pullies op het bergterras",
  7: "Portret van een model met skibril in een GUTSKI pully",
  8: "Après-ski moment in GUTSKI pullies bij zonsondergang in Livigno",
};

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
              alt={ALTS[n]}
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
