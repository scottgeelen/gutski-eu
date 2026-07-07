import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

const ICONS = [
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8m-4-4v4M5 4h14a1 1 0 0 1 1 1v5a8 8 0 0 1-16 0V5a1 1 0 0 1 1-1Z"/></svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
];

export default function Groups({ t }: { t: Dictionary }) {
  const cards = [
    [t.grp1_t, t.grp1_s],
    [t.grp2_t, t.grp2_s],
    [t.grp3_t, t.grp3_s],
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
          {cards.map(([title, sub], i) => (
            <Reveal className="group-card" key={title} delay={i * 60}>
              <div className="ic">{ICONS[i]}</div>
              <h3>{title}</h3>
              <p>{sub}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
