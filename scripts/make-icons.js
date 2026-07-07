// Eenmalig: genereert favicon.ico en apple-icon.png uit app/icon.svg.
// Draaien met: node scripts/make-icons.js
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default;

const APP = path.join(__dirname, "..", "app");
const SVG = path.join(APP, "icon.svg");
const NIGHT = { r: 10, g: 19, b: 34, alpha: 1 }; // var(--night) — apple-icon zonder transparantie

async function main() {
  const svg = fs.readFileSync(SVG);

  // apple-icon.png — 180x180, dekkende achtergrond
  await sharp(svg, { density: 384 })
    .resize(180, 180)
    .flatten({ background: NIGHT })
    .png()
    .toFile(path.join(APP, "apple-icon.png"));

  // favicon.ico — 16/32/48 uit dezelfde bron
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map((s) => sharp(svg, { density: 384 }).resize(s, s).png().toBuffer())
  );
  const ico = await pngToIco(buffers);
  fs.writeFileSync(path.join(APP, "favicon.ico"), ico);

  console.log("Icons gegenereerd:");
  for (const f of ["apple-icon.png", "favicon.ico"]) {
    console.log("  app/" + f, (fs.statSync(path.join(APP, f)).size / 1024).toFixed(1) + " KB");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
