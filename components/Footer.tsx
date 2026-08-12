import LogoMark from "./Logo";
import StockistTrigger from "./StockistTrigger";
import { SOCIALS } from "@/lib/seo";
import { SHOP } from "@/lib/shop";
import type { Dictionary } from "@/lib/dictionaries";
import { localePath, type Locale } from "@/lib/i18n";

export default function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  const shop = SHOP[locale];
  const home = localePath(locale);
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
              RSG Brands B.V. · Geerlinglaan 12 · 6415 XE Heerlen (NL)
            </p>
          </div>
          <div>
            <h3>{t.foot_menu}</h3>
            <a href={`${home}#merk`}>{t.nav_brand}</a>
            <a href={localePath(locale, "/story")}>{t.nav_story}</a>
            <a href={`${home}#winkels`}>{t.nav_stores}</a>
          </div>
          <div>
            <h3>Shop</h3>
            <a href={shop.women} target="_blank" rel="noopener">{t.shop_women} ↗</a>
            <a href={shop.men} target="_blank" rel="noopener">{t.shop_men} ↗</a>
            <a href={shop.design} target="_blank" rel="noopener">{t.shop_design} ↗</a>
            <a href="https://skipullies.com" target="_blank" rel="noopener">skipullies.com ↗</a>
            <StockistTrigger>{t.foot_b2b}</StockistTrigger>
            <a href="mailto:info@gutski.eu">info@gutski.eu</a>
          </div>
          <div>
            <h3>{t.foot_follow}</h3>
            <a href={SOCIALS.instagram} target="_blank" rel="noopener">Instagram</a>
            <a href={SOCIALS.tiktok} target="_blank" rel="noopener">TikTok</a>
            <a href={SOCIALS.facebook} target="_blank" rel="noopener">Facebook</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 GUTSKI · RSG Brands B.V. · Heerlen</span>
          <span>
            <a href={localePath(locale, "/privacy")}>{t.foot_privacy}</a> ·{" "}
            <a href={localePath(locale, "/terms")}>{t.foot_terms}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
