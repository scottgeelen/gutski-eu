// Eenmalig script: optimaliseert de originele campagnefoto's uit fotos-ruw/
// naar geoptimaliseerde JPEG's in public/images/.
// Draaien met: node scripts/optimize-images.js
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const SRC_DIR = path.join(
  __dirname,
  "..",
  "fotos-ruw",
  "Gutski foto's Livigno - LOW RES-20260706T181811Z-3-001",
  "Gutski foto_s Livigno - LOW RES"
);
const OUT_DIR = path.join(__dirname, "..", "public", "images");

// Bronbestand -> uitvoer. og.jpg komt uit dezelfde bron als hero.jpg.
const HERO_SRC = "hero.jpg";
const STORY_SRC = "story.jpg";
const SHOOT_SRCS = [
  "shoot-1.jpg",
  "shoot-2.jpg",
  "shoot-3.jpg",
  "shoot-4.jpg",
  "shoot-5.jpg",
  "shoot-6.jpg",
  "shoot-7.jpg",
  "shoot-8.jpg",
];

function fmtSize(bytes) {
  return (bytes / 1024).toFixed(1) + " KB";
}

async function resizeMaxWidth(srcName, outName, maxWidth, quality) {
  const src = path.join(SRC_DIR, srcName);
  const out = path.join(OUT_DIR, outName);
  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality })
    .toFile(out);
  return fs.statSync(out).size;
}

async function coverCrop(srcName, outName, width, height, quality) {
  const src = path.join(SRC_DIR, srcName);
  const out = path.join(OUT_DIR, outName);
  await sharp(src)
    .resize({ width, height, fit: "cover", position: "centre" })
    .jpeg({ quality })
    .toFile(out);
  return fs.statSync(out).size;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results = [];

  // 1. hero.jpg — max 2000px breed, kwaliteit 80
  results.push(["hero.jpg", await resizeMaxWidth(HERO_SRC, "hero.jpg", 2000, 80)]);

  // 2. story.jpg — max 1200px breed, kwaliteit 80
  results.push(["story.jpg", await resizeMaxWidth(STORY_SRC, "story.jpg", 1200, 80)]);

  // 3. shoot-1.jpg t/m shoot-8.jpg — elk max 1000px breed, kwaliteit 80
  for (let i = 0; i < SHOOT_SRCS.length; i++) {
    const outName = `shoot-${i + 1}.jpg`;
    results.push([outName, await resizeMaxWidth(SHOOT_SRCS[i], outName, 1000, 80)]);
  }

  // 4. og.jpg — exact 1200x630, cover-crop gecentreerd, kwaliteit 80 (bron = hero)
  results.push(["og.jpg", await coverCrop(HERO_SRC, "og.jpg", 1200, 630, 80)]);

  console.log("\nGegenereerde afbeeldingen in public/images/:\n");
  let allUnder500 = true;
  for (const [name, size] of results) {
    const under = size < 500 * 1024;
    if (!under) allUnder500 = false;
    console.log(`  ${name.padEnd(14)} ${fmtSize(size).padStart(10)}  ${under ? "OK" : "TE GROOT (>500KB)"}`);
  }
  console.log(
    `\n${allUnder500 ? "Alle bestanden ruim onder 500 KB." : "LET OP: niet alle bestanden onder 500 KB!"}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
