import LogoMark from "./Logo";
import type { Dictionary } from "@/lib/dictionaries";

export default function Footer({ t }: { t: Dictionary }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a className="logo" href="#top" style={{ display: "inline-flex", marginBottom: 16 }} aria-label="GUTSKI">
              <LogoMark />
              <span className="logo-word">GUT<span>SKI</span></span>
            </a>
            <p>{t.foot_about}</p>
            <p className="mono" style={{ color: "var(--powder)", marginTop: 16, fontSize: ".68rem" }}>
              RSG Brands B.V. · Wiebachstraat 77A · 6466 NG Kerkrade (NL)
            </p>
          </div>
          <div>
            <h4>{t.foot_menu}</h4>
            <a href="#merk">{t.nav_brand}</a>
            <a href="#collectie">{t.nav_coll}</a>
            <a href="#configurator">{t.nav_conf}</a>
            <a href="#winkels">{t.nav_stores}</a>
          </div>
          <div>
            <h4>Shop</h4>
            <a href="https://skipullies.com" target="_blank" rel="noopener">skipullies.com ↗</a>
            <a href="mailto:b2b@gutski.eu">{t.foot_b2b}</a>
            <a href="mailto:info@gutski.eu">info@gutski.eu</a>
          </div>
          <div>
            <h4>{t.foot_follow}</h4>
            <a href="#" rel="noopener">Instagram</a>
            <a href="#" rel="noopener">TikTok</a>
            <a href="#" rel="noopener">Facebook</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 GUTSKI · RSG Brands B.V. · Kerkrade</span>
          <span><a href="#">{t.foot_privacy}</a> · <a href="#">{t.foot_terms}</a></span>
        </div>
      </div>
    </footer>
  );
}
