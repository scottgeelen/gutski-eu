// Eenmalig: genereert PWA-icons (192/512 + maskable) uit app/icon.svg.
// Draaien met: node scripts/make-pwa-icons.js
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const APP = path.join(__dirname, "..");
const SVG = path.join(APP, "app", "icon.svg");
const PUB = path.join(APP, "public");
const NIGHT = { r: 10, g: 19, b: 34, alpha: 1 };

async function main() {
  const svg = fs.readFileSync(SVG);

  for (const s of [192, 512]) {
    await sharp(svg, { density: 512 }).resize(s, s).png().toFile(path.join(PUB, `icon-${s}.png`));
  }

  // Maskable: navy vierkant met het icoon op ~80% (veilige zone).
  const inner = Math.round(512 * 0.8);
  const icon = await sharp(svg, { density: 512 }).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: NIGHT } })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toFile(path.join(PUB, "icon-512-maskable.png"));

  console.log("PWA-icons gegenereerd in public/:");
  for (const f of ["icon-192.png", "icon-512.png", "icon-512-maskable.png"]) {
    console.log("  " + f, (fs.statSync(path.join(PUB, f)).size / 1024).toFixed(1) + " KB");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
