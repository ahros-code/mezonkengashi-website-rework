// Splits the supplied horizontal lockup into the assets the site needs.
// Bounding boxes measured in a browser: lockup 383.9,1303.7 2394.2x554.6
//                                        mark   383.9,1303.7  614.4x554.6
const fs = require("fs");
const path = require("path");

const SRC = "references/logo horizontal svg.svg";
const OUT = "public/brand";
fs.mkdirSync(OUT, { recursive: true });

const src = fs.readFileSync(SRC, "utf8");
const body = src.slice(src.indexOf("<g>"), src.lastIndexOf("</svg>")).trim();
const mark = body.slice(0, body.indexOf("</g>") + 4);

const NAVY = "#003A64";
const AMBER = "#F8B700";

const LOCKUP_BOX = "376 1296 2410 570"; // artwork + 8u padding
const MARK_BOX = "341 1231 700 700"; // mark centred in a square

function svg(viewBox, inner, primary, accent, extra = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
  <style>.st0{fill:${primary}}.st1{fill:${accent}}</style>
${extra}${inner}
</svg>
`;
}

const files = {
  // full lockup for light grounds
  "mezon-logo.svg": svg(LOCKUP_BOX, body, NAVY, AMBER),
  // full monochrome, kept for single-colour print
  "mezon-logo-mono.svg": svg(LOCKUP_BOX, body, "#FFFFFF", "#FFFFFF"),
  // dark-ground brand version: the navy parts go white and the amber stays
  // amber, so both brand colours survive on the navy navbar and footer
  "mezon-logo-dark.svg": svg(LOCKUP_BOX, body, "#FFFFFF", AMBER),
  // mark alone, square
  "mezon-mark.svg": svg(MARK_BOX, mark, NAVY, AMBER),
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content);
  console.log(name.padEnd(24), content.length, "bytes");
}

// Favicon: transparent ground so it sits on whatever chrome the browser uses.
// The navy strokes flip to white in a dark tab strip.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_BOX}">
  <style>
    .st0 { fill: ${NAVY} }
    .st1 { fill: ${AMBER} }
    @media (prefers-color-scheme: dark) { .st0 { fill: #FFFFFF } }
  </style>
${mark}
</svg>
`;
fs.writeFileSync("src/app/icon.svg", icon);
console.log("src/app/icon.svg".padEnd(24), icon.length, "bytes");

/* --- stacked (primary) lockup, rebuilt as vector from the same paths ---
   mark     383.9,1303.7  614.4x554.6
   wordmark 1101.2,1347.4 1676.9x467.2                                    */
const word = body.slice(body.indexOf("</g>") + 4).trim();
const GAP = 90;
const CX = 1676.9 / 2; // the wordmark is the wider element

const stacked = (primary, accent) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 1692.9 1127.8">
  <style>.st0{fill:${primary}}.st1{fill:${accent}}</style>
  <g transform="translate(${(CX - (383.9 + 614.4 / 2)).toFixed(2)} ${(-1303.7).toFixed(2)})">${mark}</g>
  <g transform="translate(${(-1101.2).toFixed(2)} ${(-1347.4 + 554.6 + GAP).toFixed(2)})">${word}</g>
</svg>
`;

fs.writeFileSync(path.join(OUT, "mezon-logo-stacked.svg"), stacked(NAVY, AMBER));
fs.writeFileSync(path.join(OUT, "mezon-logo-stacked-mono.svg"), stacked("#FFFFFF", "#FFFFFF"));
console.log("mezon-logo-stacked.svg     written");
