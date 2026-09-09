/**
 * Builds the council portraits in public/img/council from two sources:
 * the client's reference shots in references/council, and the cut-outs
 * already published on mezonkengashi.uz.
 *
 * The sources disagree about everything that matters visually — one is a
 * bookshelf, one is a black studio, most are white studio — so each portrait
 * gets the same treatment: a tight head-and-shoulders crop, a soft radial
 * fade that dissolves the background into the dark card instead of cutting a
 * hard disc out of it, and a slight desaturation so ten photographers read as
 * one set. Re-run with `node scripts/gen-portraits.cjs`.
 */
const sharp = require("sharp");
const path = require("path");

const REF = path.join(__dirname, "..", "references", "council");
const DL = "C:/Users/HP/AppData/Local/Temp/portraits";
const OUT = path.join(__dirname, "..", "public", "img", "council");
const SIZE = 640;

/**
 * Multiplied over the photo: neutral across the face, then falling to the
 * card's own navy at the rim. This is what makes a white studio backdrop, a
 * black one and a bookshelf read as the same set — whatever the photographer
 * put behind the subject is dark navy by the time it reaches the edge.
 */
const vignette = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
     <defs>
       <radialGradient id="v" cx="50%" cy="45%" r="52%">
         <stop offset="0%" stop-color="#ffffff"/>
         <stop offset="52%" stop-color="#ffffff"/>
         <stop offset="74%" stop-color="#9fb4c4"/>
         <stop offset="100%" stop-color="#12384f"/>
       </radialGradient>
     </defs>
     <rect width="${SIZE}" height="${SIZE}" fill="url(#v)"/>
   </svg>`
);

/** Hard disc, with a hairline of softness so the edge is not aliased. */
const disc = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}">
     <defs>
       <radialGradient id="d" cx="50%" cy="50%" r="50%">
         <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
         <stop offset="97%" stop-color="#fff" stop-opacity="1"/>
         <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
       </radialGradient>
     </defs>
     <rect width="${SIZE}" height="${SIZE}" fill="url(#d)"/>
   </svg>`
);

// Reference shots: hand-picked squares framing head and shoulders.
const crops = [
  { id: "saydaraliev", file: `${REF}/1.jpg`, left: 330, top: 170, size: 560 },
  { id: "rozaliyev", file: `${REF}/2.jpg`, left: 298, top: 55, size: 620 },
  { id: "qurbonov", file: `${REF}/3.jpg`, left: 0, top: 0, size: 900 },
  { id: "akramov", file: `${REF}/4.jpg`, left: 40, top: 30, size: 500 },
];

// Portraits the client already publishes, cut out on a transparent circle.
const trims = [
  // The only shot on location rather than in a studio; it needs a closer
  // framing to keep the bookshelf from competing with the face.
  { id: "sultonxojaev", file: `${DL}/Alisher-Sultonxo'jaev.png`, zoom: 1.22, topBias: 0 },
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
    .composite([
      { input: vignette, blend: "multiply" },
      { input: disc, blend: "dest-in" },
    ])
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(path.join(OUT, `${id}.webp`))
    .then((r) => console.log(id, r.size + "B"));

(async () => {
  for (const c of crops) {
    await write(
      sharp(c.file)
        .extract({ left: c.left, top: c.top, width: c.size, height: c.size })
        .resize(SIZE, SIZE),
      c.id
    );
  }
  for (const t of trims) {
    // The published cut-outs sit on a transparent square; trim to the disc,
    // then zoom past it so the head fills the same share of the frame as the
    // reference crops do, keeping the crop a little above centre for headroom.
    const zoom = t.zoom ?? 1.18;
    const topBias = t.topBias ?? 0.36;
    const full = Math.round(SIZE * zoom);
    await write(
      sharp(t.file)
        .trim({ threshold: 1 })
        .resize(full, full, { fit: "cover" })
        .extract({
          left: Math.round((full - SIZE) / 2),
          top: Math.round((full - SIZE) * topBias),
          width: SIZE,
          height: SIZE,
        }),
      t.id
    );
  }
})();
