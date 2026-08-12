import { readFile } from "fs/promises";
import { join } from "path";
import { ImageResponse } from "next/og";
import type { Locale } from "./i18n";

const NIGHT = "#0A1322";
const SLOPE = "#0F1D31";
const ICE = "#EAF2FC";
const GLACIER = "#5FB2FF";
const POWDER = "#9DBBDA";

export const OG_SIZE = { width: 1200, height: 630 };

export const TAGLINE: Record<Locale, string> = {
  nl: "Skipullies uit Limburg voor de Alpen",
  de: "Skipullover aus Limburg für die Alpen",
  en: "Ski pullovers from Limburg for the Alps",
};

// Het merkfont (Syne ExtraBold) éénmalig laden en cachen — echte glyphs,
// geen systeemfont-fallback.
let fontPromise: Promise<Buffer> | null = null;
function syneFont() {
  if (!fontPromise) {
    fontPromise = readFile(join(process.cwd(), "lib", "Syne-ExtraBold.ttf"));
  }
  return fontPromise;
}

/** OG-image in de huisstijl: donkere nacht-achtergrond, glacier-accent, GUTSKI-
 *  wordmark in Syne + tagline per locale. Met `heading` (story-variant) staat de
 *  kop groot en de wordmark klein als eyebrow. */
export async function ogImage({ locale, heading }: { locale: Locale; heading?: string }) {
  const fontData = await syneFont();

  const wordmark = (fontSize: number) => (
    <div style={{ display: "flex", fontSize, letterSpacing: -2, lineHeight: 1, color: ICE }}>
      GUT<span style={{ color: GLACIER }}>SKI</span>
    </div>
  );

  const content = heading ? (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {wordmark(44)}
      <div style={{ display: "flex", fontSize: 88, color: ICE, lineHeight: 1.05, marginTop: 30, maxWidth: 960 }}>
        {heading}
      </div>
      <div style={{ display: "flex", width: 96, height: 8, backgroundColor: GLACIER, borderRadius: 4, marginTop: 34 }} />
      <div style={{ display: "flex", fontSize: 34, color: POWDER, marginTop: 26 }}>{TAGLINE[locale]}</div>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {wordmark(150)}
      <div style={{ display: "flex", width: 110, height: 8, backgroundColor: GLACIER, borderRadius: 4, marginTop: 40 }} />
      <div style={{ display: "flex", fontSize: 44, color: ICE, marginTop: 30, maxWidth: 900 }}>{TAGLINE[locale]}</div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          backgroundColor: NIGHT,
          backgroundImage: `radial-gradient(1000px 700px at 82% 12%, rgba(95,178,255,0.20), rgba(10,19,34,0) 60%), linear-gradient(160deg, ${NIGHT}, ${SLOPE})`,
          fontFamily: "Syne",
          position: "relative",
        }}
      >
        {content}
        <div
          style={{
            position: "absolute",
            bottom: 54,
            right: 90,
            display: "flex",
            fontSize: 30,
            color: POWDER,
            letterSpacing: 1,
          }}
        >
          gutski.eu
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Syne", data: fontData, weight: 800, style: "normal" }] }
  );
}
