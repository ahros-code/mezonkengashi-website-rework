/**
 * Builds the square council portraits in public/img/council from two sources:
 * the client's reference shots in references/council, and the cut-outs
 * already published on mezonkengashi.uz.
 *
 * The sources disagree about everything that matters visually — one is a
 * bookshelf, most are white or grey studio, and seven arrive already cut to a
 * circle — so each portrait gets the same treatment: a head-and-shoulders
 * square, a gentle edge falloff so ten photographers read as one set, and a
 * slight desaturation. Re-run with `node scripts/gen-portraits.cjs`.
 */
const sharp = require("sharp");
const path = require("path");

const REF = path.join(__dirname, "..", "references", "council");
const DL = "C:/Users/HP/AppData/Local/Temp/portraits";
const OUT = path.join(__dirname, "..", "public", "img", "council");
const SIZE = 720;

/**
 * Multiplied over the photo: neutral across the subject, then a soft cool
 * falloff into the corners. It evens out a white backdrop against a grey one
 * without reading as an effect.
 */
const falloff = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
     <defs>
       <radialGradient id="v" cx="50%" cy="42%" r="75%">
         <stop offset="0%" stop-color="#ffffff"/>
         <stop offset="55%" stop-color="#ffffff"/>
         <stop offset="100%" stop-color="#aebdca"/>
       </radialGradient>
     </defs>
     <rect width="${SIZE}" height="${SIZE}" fill="url(#v)"/>
   </svg>`
);

// Reference shots: hand-picked squares framing head and shoulders.
const crops = [
  { id: "saydaraliev", file: `${REF}/1.jpg`, left: 330, top: 150, size: 580 },
  { id: "rozaliyev", file: `${REF}/2.jpg`, left: 298, top: 40, size: 620 },
  { id: "qurbonov", file: `${REF}/3.jpg`, left: 0, top: 0, size: 900 },
  { id: "akramov", file: `${REF}/4.jpg`, left: 30, top: 20, size: 511 },
];

// Portraits the client already publishes, cut out on a transparent circle.
const circles = [
  // Shot on location, not in a studio: a closer framing keeps the bookshelf
  // from competing with the face.
  { id: "sultonxojaev", file: `${DL}/Alisher-Sultonxo'jaev.png`, zoom: 1.2 },
  { id: "razzoqov", file: `${DL}/Yahyo-Razzoqov.png` },
  { id: "qosimov", file: `${DL}/Mirjalol.png` },
  { id: "umarxodjayev", file: `${DL}/Murod.png` },
  { id: "usmanov", file: `${DL}/Jamshid-Usmanov.png` },
  { id: "rajabov", file: `${DL}/Nodir-Rajabov.png` },
  { id: "husanov", file: `${DL}/Shohruh-Husanov.png` },
];

const write = (pipe, id) =>
  pipe
    .modulate({ saturation: 0.9 })
    .composite([{ input: falloff, blend: "multiply" }])
    .webp({ quality: 86 })
    .toFile(path.join(OUT, `${id}.webp`))
    .then((r) => console.log(id, r.size + "B"));

/**
 * A circle cut-out has nothing in its corners. Every pixel outside the disc
 * takes the colour found just inside the rim along the same angle, averaged
 * over a small arc — the backdrop simply carries on outward, so a grey studio
 * stays grey and a black one black. A light blur softens the streaks, and the
 * disc's own pixels are kept untouched inside the rim.
 */
async function squareFromCircle(file, zoom) {
  const { data, info } = await sharp(file)
    .trim({ threshold: 1 })
    .resize(SIZE, SIZE, { fit: "cover" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const c = W / 2;
  // Sample well inside the rim: cut-outs carry a shadow or hairline at the edge.
  const r0 = c * 0.9;
  const out = Buffer.from(data);
  const at = (x, y, ch) => data[(Math.round(y) * W + Math.round(x)) * 4 + ch];

  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - c;
      const dy = y - c;
      if (Math.hypot(dx, dy) <= r0) continue;
      const a = Math.atan2(dy, dx);
      const rgb = [0, 0, 0];
      let n = 0;
      for (let k = -4; k <= 4; k++) {
        const t = a + k * 0.02;
        for (const r of [r0 - 2, r0 - 6]) {
          const sx = c + r * Math.cos(t);
          const sy = c + r * Math.sin(t);
          for (let ch = 0; ch < 3; ch++) rgb[ch] += at(sx, sy, ch);
          n++;
        }
      }
      const i = (y * W + x) * 4;
      for (let ch = 0; ch < 3; ch++) out[i + ch] = rgb[ch] / n;
      out[i + 3] = 255;
    }
  }

  const raw = { raw: { width: W, height: W, channels: 4 } };
  const fill = await sharp(out, raw).blur(10).png().toBuffer();
  // The untouched centre, feathered into the smoothed field over a few pixels.
  const mask = Buffer.from(
    `<svg width="${W}" height="${W}"><defs><radialGradient id="m" cx="50%" cy="50%" r="50%">
       <stop offset="${(0.84).toFixed(2)}" stop-color="#fff" stop-opacity="1"/>
       <stop offset="${(0.9).toFixed(2)}" stop-color="#fff" stop-opacity="0"/>
     </radialGradient></defs><rect width="${W}" height="${W}" fill="url(#m)"/></svg>`
  );
  const centre = await sharp(out, raw).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  const whole = await sharp(fill).composite([{ input: centre }]).flatten().png().toBuffer();

  // Zoom in a touch and keep the crop high so the head has headroom but the
  // circle's cut edge across the shoulders stays out of frame.
  const full = Math.round(SIZE * zoom);
  return sharp(whole)
    .resize(full, full)
    .extract({
      left: Math.round((full - SIZE) / 2),
      top: Math.round((full - SIZE) * 0.25),
      width: SIZE,
      height: SIZE,
    });
}

(async () => {
  for (const c of crops) {
    await write(
      sharp(c.file)
        .extract({ left: c.left, top: c.top, width: c.size, height: c.size })
        .resize(SIZE, SIZE),
      c.id
    );
  }
  for (const c of circles) {
    await write(await squareFromCircle(c.file, c.zoom ?? 1.12), c.id);
  }
})();
