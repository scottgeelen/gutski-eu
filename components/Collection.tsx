import Reveal from "./Reveal";
import type { Dictionary } from "@/lib/dictionaries";

/* Echte stijlen uit "The Alpine Edit · FW 26/27" — prijzen: placeholder */
const PRODUCTS = [
  { sku: "GTS-W-PT-01", name: "Pistentiger",     price: "€ 79,95", c1: "#D9578F", c2: "#A32C63" },
  { sku: "GTS-W-CH-02", name: "Champagnehirsch", price: "€ 79,95", c1: "#2E6B4F", c2: "#1B4433" },
  { sku: "GTS-W-SM-04", name: "St. Moritz",      price: "€ 79,95", c1: "#2C5F9E", c2: "#173A66" },
  { sku: "GTS-W-AS-06", name: "Après Spritz",    price: "€ 79,95", c1: "#EDE3EA", c2: "#C9A8BE" },
];

export default function Collection({ t }: { t: Dictionary }) {
  return (
    <section id="collectie" className="slope-cut">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="mono">{t.coll_eyebrow}</span>
          <h2>{t.coll_title}</h2>
          <p>{t.coll_sub}</p>
        </Reveal>
        <div className="grid-cards">
          {PRODUCTS.map((p) => (
            <Reveal as="article" className="card" key={p.sku}>
              <div
                className="swatch"
                style={{
                  background:
                    "radial-gradient(90% 80% at 50% 0%,rgba(234,242,252,.07),transparent),linear-gradient(160deg,#101E33,#0B1626)",
                }}
              >
                <div className="pully" style={{ background: `linear-gradient(165deg,${p.c1},${p.c2})` }}>
                  <span className="zip" />
                </div>
              </div>
              <div className="card-body">
                <span className="mono">{p.sku}</span>
                <h3>{p.name}</h3>
                <div className="row">
                  <span className="price">{p.price}</span>
                  <a className="buy" href="https://skipullies.com" target="_blank" rel="noopener">
                    {t.buy} ↗
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="coll-foot">
          <a className="btn" href="https://skipullies.com" target="_blank" rel="noopener">
            {t.coll_cta} ↗
          </a>
          <p>{t.coll_note}</p>
        </Reveal>
      </div>
    </section>
  );
}
