// news-image-20261123 v3 — "MONDAY 23 NOVEMBER 2026" Readable Edition.
// Fresh bold vector stroke font, drawn in code. Node 22 stdlib only, no network.
// Writes one 1024x1024 PNG to /output/entry.png. Deterministic.
import * as fs from "node:fs";
import * as zlib from "node:zlib";

// ---------------------------------------------------------------- font ----
// Each glyph: [advanceUnits, "x,y x,y|x,y ..."] polylines on a grid x 0..10,
// y 0..12 cap height, descenders to 15. Written fresh in this session.
// Rendered as thick strokes (bold) with anti-aliased edges.
const G: Record<string, [number, string]> = {
A:[10,"1,12 5,0 9,12|3,8 7,8"],B:[10,"1,0 1,12 7,12 9,10 9,7 6,6|6,6 9,5 9,2 7,0 1,0"],
C:[10,"9,2 7,0 3,0 1,2 1,10 3,12 7,12 9,10"],D:[10,"1,0 1,12 7,12 9,10 9,2 7,0 1,0"],
E:[9,"9,0 1,0 1,12 9,12|1,6 7,6"],F:[9,"1,12 1,0 9,0|1,6 7,6"],
G:[10,"9,2 7,0 3,0 1,2 1,10 3,12 7,12 9,10 9,6 6,6"],H:[10,"1,0 1,12|9,0 9,12|1,6 9,6"],
I:[5,"2.5,0 2.5,12|0,0 5,0|0,12 5,12"],J:[8,"7,0 7,10 5,12 2,12 1,10"],
K:[10,"1,0 1,12|9,0 1,6 9,12"],L:[9,"1,0 1,12 9,12"],
M:[11,"1,12 1,0 5.5,8 10,0 10,12"],N:[10,"1,12 1,0 9,12 9,0"],
O:[10,"3,0 7,0 9,2 9,10 7,12 3,12 1,10 1,2 3,0"],P:[10,"1,12 1,0 8,0 9,1 9,5 8,6 1,6"],
Q:[10,"3,0 7,0 9,2 9,10 7,12 3,12 1,10 1,2 3,0|6,8 10,12"],
R:[10,"1,12 1,0 8,0 9,1 9,5 8,6 1,6|6,6 9,12"],
S:[10,"9,2 8,0 3,0 1,2 1,5 3,6 8,6 9,7 9,10 7,12 3,12 1,10"],
T:[10,"1,0 9,0|5,0 5,12"],U:[10,"1,0 1,10 3,12 7,12 9,10 9,0"],
V:[10,"1,0 5,12 9,0"],W:[11,"1,0 3,12 5.5,6 8,12 10,0"],X:[10,"1,0 9,12|9,0 1,12"],
Y:[10,"1,0 5,6 9,0|5,6 5,12"],Z:[10,"1,0 9,0 1,12 9,12"],
a:[10,"3,4 6,4 8,6 8,9 6,11 3,11 1,9 1,6 3,4|8,4 8,12"],
b:[10,"1,0 1,12|1,6 4,4 7,4 9,6 9,9 7,11 4,11 1,9"],
c:[9,"8,5 6,4 3,4 1,6 1,9 3,11 6,11 8,10"],
d:[10,"9,0 9,12|9,7 6,4 3,4 1,6 1,9 3,11 6,11 9,9"],
e:[10,"8,9 6,11 3,11 1,9 1,6 3,4 6,4 8,6 9,8 1,8"],
f:[7,"1,5 3,1 5,0 6,0 6,12|0,4 6,4"],
g:[10,"1,6 3,4 6,4 8,6 8,9 6,11 3,11 1,9|8,9 8,13 6,15 3,15 1,13"],
h:[10,"1,0 1,12|1,7 4,4 7,4 9,6 9,12"],
i:[4,"2,4 2,12|2,1 2,1"],j:[5,"3,4 3,13 1,15|3,1 3,1"],
k:[10,"1,0 1,12|8,4 1,8 9,12"],l:[4,"2,0 2,12"],
m:[11,"1,12 1,4 3,4 5,6 5,12|5,6 7,4 9,4 10,6 10,12"],
n:[10,"1,12 1,4 4,4 7,5 9,7 9,12"],
o:[10,"3,4 6,4 8,6 8,9 6,11 3,11 1,9 1,6 3,4"],
p:[10,"1,4 1,15|1,7 4,4 7,4 9,6 9,9 7,11 4,11 1,9"],
q:[10,"9,4 9,15|9,7 6,4 3,4 1,6 1,9 3,11 6,11 9,9"],
r:[7,"1,12 1,4 3,4 6,5 7,6"],
s:[9,"8,5 6,4 3,4 1,6 1,7 3,8 7,8 8,9 8,10 6,11 3,11 1,10"],
t:[6,"4,0 4,12 5,12|1,4 5,4"],
u:[10,"1,4 1,9 3,11 6,11 8,9 8,4"],
v:[10,"1,4 5,12 9,4"],w:[11,"1,4 3,12 5.5,7 8,12 10,4"],
x:[10,"1,4 9,12|9,4 1,12"],y:[10,"1,4 5,11 9,4|5,11 4,15 2,15"],
z:[9,"1,4 8,4 1,12 8,12"],
"0":[10,"3,0 7,0 9,2 9,10 7,12 3,12 1,10 1,2 3,0"],
"1":[7,"2,2 4,0 4,12|1,12 6,12"],
"2":[10,"1,2 3,0 7,0 9,2 9,5 1,12 9,12"],
"3":[10,"2,1 4,0 7,0 9,2 9,5 6,6|6,6 9,7 9,10 7,12 4,12 2,11"],
"4":[10,"7,0 7,12|1,8 9,8|7,0 2,8"],
"5":[10,"9,0 1,0 1,5 7,5 9,7 9,10 7,12 3,12 1,10"],
"6":[10,"9,2 7,0 3,0 1,2 1,9 3,12 7,12 9,10 9,7 7,5 3,5 1,7"],
"7":[10,"1,0 9,0 4,12"],
"8":[10,"3,0 7,0 9,2 9,5 7,6 3,6 1,5 1,2 3,0|7,6 9,7 9,10 7,12 3,12 1,10 1,7 3,6"],
"9":[10,"1,10 3,12 7,12 9,10 9,3 7,0 3,0 1,2 1,5 3,7 7,7 9,5"],
" ":[4,""],".":[4,"2,11 2,11"],",":[4,"2,11 2,12 1,14"],":":[4,"2,4 2,4|2,10 2,10"],
";":[4,"2,4 2,4|2,10 2,12 1,14"],"'":[4,"2,0 1,3"],"\u2019":[4,"2,0 1,3"],
'"':[7,"2,0 1,3|5,0 4,3"],"\u201c":[7,"2,0 1,3|5,0 4,3"],"\u201d":[7,"2,0 1,3|5,0 4,3"],
"-":[8,"1,6 7,6"],"\u2013":[8,"1,6 7,6"],"\u2014":[11,"0,6 10,6"],
"(":[5,"4,0 2,2 2,10 4,12"],")":[5,"1,0 3,2 3,10 1,12"],
"%":[11,"1,0 9,12|0.5,0.5 3.5,0.5 3.5,3.5 0.5,3.5 0.5,0.5|6.5,8.5 9.5,8.5 9.5,11.5 6.5,11.5 6.5,8.5"],
"$":[10,"2,2 4,0 7,0 9,2 9,4 7,6 2,6 1,8 1,10 3,12 7,12 9,10|5,-1 5,13"],
"\u00a3":[10,"9,1 3,0 2,2 2,9 3,11 9,11|0,6 6,6"],
"+":[10,"5,1 5,11|1,6 9,6"],"/":[8,"7,0 1,12"],
"?":[10,"2,2 4,0 7,0 9,2 9,4 7,6 5,6 5,8|5,11 5,11"],
"!":[4,"2,0 2,8|2,11 2,11"],
"&":[11,"8,2 6,0 3,0 1,2 1,5 4,7 9,12|9,8 7,6 4,6 2,8 2,10 4,12 7,12"],
"=":[10,"1,4 9,4|1,8 9,8"],"*":[9,"5,0 5,12|1,3 9,9|9,3 1,9"],
"\u2022":[5,"2,6 2,6"],"\u00b7":[4,"2,6 2,6"],"~":[10,"1,7 3,5 5,7 7,5 9,7"],
">":[9,"1,2 7,6 1,10"],"<":[9,"8,2 2,6 8,10"],
"[":[5,"4,0 1,0 1,12 4,12"],"]":[5,"1,0 4,0 4,12 1,12"],
"_":[10,"0,12 10,12"],"\u2026":[11,"2,11 2,11|5,11 5,11|8,11 8,11"],
"\u00d7":[9,"1,2 8,10|8,2 1,10"],"\u00b0":[6,"2,1 4,1 4,3 2,3 2,1"],
"\u2192":[10,"1,6 9,6|6,3 9,6 6,9"],
};
const XS = 0.8; // horizontal squeeze so lines fit with air
function glyph(ch: string): [number, string] { return G[ch] || G["?"]; }
function parseStrokes(s: string): number[][][] {
  if (!s) return [];
  return s.split("|").map(p => p.split(" ").map(pt => { const [a, b] = pt.split(","); return [+a, +b]; }));
}
function textWidth(s: string, size: number): number {
  const sc = size / 12; let w = 0;
  for (const ch of s) w += glyph(ch)[0] * sc * XS;
  return w;
}
function wrapText(s: string, maxW: number, size: number): string[] {
  const words = s.split(" ");
  const lines: string[] = []; let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (textWidth(t, size) <= maxW || !cur) cur = t;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------------------------------------------------------------- canvas --
const W = 1024, H = 1024;
const img = new Uint8Array(W * H * 3);
const CREAM: [number, number, number] = [250, 245, 228];
const INK: [number, number, number] = [22, 18, 14];
const RED: [number, number, number] = [166, 30, 34];
const BLUE: [number, number, number] = [29, 78, 137];
const GREY: [number, number, number] = [107, 101, 88];
function fillAll(c: [number, number, number]) {
  for (let i = 0; i < W * H; i++) { img[i * 3] = c[0]; img[i * 3 + 1] = c[1]; img[i * 3 + 2] = c[2]; }
}
function blend(x: number, y: number, c: [number, number, number], a: number) {
  if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return;
  if (a > 1) a = 1;
  const i = (y * W + x) * 3;
  img[i] = img[i] * (1 - a) + c[0] * a;
  img[i + 1] = img[i + 1] * (1 - a) + c[1] * a;
  img[i + 2] = img[i + 2] * (1 - a) + c[2] * a;
}
function rect(x: number, y: number, w: number, h: number, c: [number, number, number]) {
  const x0 = Math.max(0, Math.round(x)), y0 = Math.max(0, Math.round(y));
  const x1 = Math.min(W, Math.round(x + w)), y1 = Math.min(H, Math.round(y + h));
  for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
    const i = (yy * W + xx) * 3; img[i] = c[0]; img[i + 1] = c[1]; img[i + 2] = c[2];
  }
}
function frame(x: number, y: number, w: number, h: number, c: [number, number, number], t = 1) {
  rect(x, y, w, t, c); rect(x, y + h - t, w, t, c); rect(x, y, t, h, c); rect(x + w - t, y, t, h, c);
}
function circle(cx: number, cy: number, r: number, c: [number, number, number]) {
  const x0 = Math.floor(cx - r - 1), x1 = Math.ceil(cx + r + 1);
  const y0 = Math.floor(cy - r - 1), y1 = Math.ceil(cy + r + 1);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
    const a = Math.max(0, Math.min(1, r + 0.6 - d));
    if (a > 0) blend(x, y, c, a);
  }
}
function poly(pts: [number, number][], c: [number, number, number]) {
  // scanline fill, even-odd
  let minY = 1e9, maxY = -1e9;
  for (const [, y] of pts) { if (y < minY) minY = y; if (y > maxY) maxY = y; }
  for (let y = Math.max(0, Math.floor(minY)); y <= Math.min(H - 1, Math.ceil(maxY)); y++) {
    const ys = y + 0.5; const xs: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
      if ((y1 <= ys && y2 > ys) || (y2 <= ys && y1 > ys)) xs.push(x1 + (ys - y1) * (x2 - x1) / (y2 - y1));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.max(0, Math.ceil(xs[k])), b = Math.min(W - 1, Math.floor(xs[k + 1]));
      for (let x = a; x <= b; x++) { const i = (y * W + x) * 3; img[i] = c[0]; img[i + 1] = c[1]; img[i + 2] = c[2]; }
    }
  }
}
function distSeg(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
  let t = L2 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function thickLine(x1: number, y1: number, x2: number, y2: number, w: number, c: [number, number, number]) {
  const r = w / 2;
  const x0 = Math.floor(Math.min(x1, x2) - r - 1), x1b = Math.ceil(Math.max(x1, x2) + r + 1);
  const y0 = Math.floor(Math.min(y1, y2) - r - 1), y1b = Math.ceil(Math.max(y1, y2) + r + 1);
  for (let y = y0; y <= y1b; y++) for (let x = x0; x <= x1b; x++) {
    const d = distSeg(x + 0.5, y + 0.5, x1, y1, x2, y2);
    const a = Math.max(0, Math.min(1, r + 0.6 - d));
    if (a > 0) blend(x, y, c, a);
  }
}
function drawText(s: string, x: number, yTop: number, size: number, weight: number, c: [number, number, number]): number {
  const sc = size / 12, half = (weight / 2) * sc;
  let cx = x;
  for (const ch of s) {
    const [adv, ss] = glyph(ch);
    const strokes = parseStrokes(ss);
    const gx0 = Math.floor(cx - half - 1), gx1 = Math.ceil(cx + adv * sc * XS + half + 1);
    const gy0 = Math.floor(yTop - half - 1), gy1 = Math.ceil(yTop + 15 * sc + half + 1);
    for (let py = gy0; py <= gy1; py++) for (let px = gx0; px <= gx1; px++) {
      let d = 1e9;
      for (const st of strokes) {
        if (st.length === 1) {
          const dd = Math.hypot(px + 0.5 - (cx + st[0][0] * sc * XS), py + 0.5 - (yTop + st[0][1] * sc));
          if (dd < d) d = dd;
        } else for (let k = 0; k + 1 < st.length; k++) {
          const dd = distSeg(px + 0.5, py + 0.5, cx + st[k][0] * sc * XS, yTop + st[k][1] * sc, cx + st[k + 1][0] * sc * XS, yTop + st[k + 1][1] * sc);
          if (dd < d) d = dd;
        }
      }
      if (strokes.length) {
        const a = Math.max(0, Math.min(1, half + 0.6 - d));
        if (a > 0) blend(px, py, c, a);
      }
    }
    cx += adv * sc * XS;
  }
  return cx;
}
function drawTextC(s: string, cx: number, yTop: number, size: number, weight: number, c: [number, number, number]) {
  drawText(s, cx - textWidth(s, size) / 2, yTop, size, weight, c);
}
function drawLines(lines: string[], x: number, yTop: number, size: number, lh: number, weight: number, c: [number, number, number]) {
  lines.forEach((ln, i) => drawText(ln, x, yTop + i * lh, size, weight, c));
}
function tag(x: number, y: number, label: string, bg: [number, number, number]): number {
  const size = 10, pad = 5, w = textWidth(label, size) + pad * 2, h = 14;
  rect(x, y, w, h, bg);
  drawText(label, x + pad, y + 2, size, 2.0, [255, 255, 255]);
  return w;
}

// ------------------------------------------------------------- illustrations
type RGB = [number, number, number];
const SKY: RGB = [207, 227, 238], SEA: RGB = [127, 168, 201], DSEA: RGB = [74, 120, 165];
const GRN: RGB = [122, 154, 91], DGRN: RGB = [46, 107, 52], SAND: RGB = [232, 220, 192];
const GREY2: RGB = [150, 148, 138], DARK: RGB = [58, 56, 50], ORANGE: RGB = [224, 110, 30];
const GOLD: RGB = [214, 164, 60], WHITE: RGB = [252, 250, 244];
function skyGround(x: number, y: number, w: number, h: number, skyC: RGB, gndC: RGB, gy = 0.62) {
  rect(x, y, w, h * gy, skyC); rect(x, y + h * gy, w, h * (1 - gy), gndC);
}
function sun(x: number, y: number, w: number, h: number, r: number, c: RGB) {
  circle(x + w * 0.82, y + h * 0.24, r, c);
}
function flames(x: number, y: number, w: number, h: number, n: number) {
  for (let i = 0; i < n; i++) {
    const fx = x + w * (0.15 + 0.7 * i / Math.max(1, n - 1));
    const fh = h * (0.5 + 0.35 * ((i * 37) % 3) / 2);
    poly([[fx - w * 0.09, y + h], [fx, y + h - fh], [fx + w * 0.09, y + h]], ORANGE);
    poly([[fx - w * 0.045, y + h], [fx, y + h - fh * 0.55], [fx + w * 0.045, y + h]], GOLD);
  }
}
function smoke(x: number, y: number, w: number, h: number, n: number) {
  for (let i = 0; i < n; i++) circle(x + w * (0.2 + 0.6 * i / Math.max(1, n - 1)), y + h * (0.25 + 0.12 * (i % 2)), h * 0.16, [120, 118, 110]);
}
function buildings(x: number, y: number, w: number, h: number, n: number, c: RGB) {
  const bw = w / n;
  for (let i = 0; i < n; i++) {
    const bh = h * (0.35 + 0.25 * ((i * 53) % 4) / 3);
    rect(x + i * bw + 1, y + h - bh, bw - 2, bh, c);
    for (let wy = 0; wy < 2; wy++) for (let wx = 0; wx < 2; wx++)
      rect(x + i * bw + bw * 0.2 + wx * bw * 0.3, y + h - bh + 3 + wy * 6, 2, 2, [255, 244, 200]);
  }
}
function chartLine(x: number, y: number, w: number, h: number, up: boolean, c: RGB) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 4; i++) {
    const px = x + w * 0.08 + w * 0.84 * i / 4;
    const py = up ? y + h * 0.75 - h * 0.55 * i / 4 : y + h * 0.2 + h * 0.55 * i / 4;
    pts.push([px, py]);
  }
  for (let i = 0; i + 1 < pts.length; i++) thickLine(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 3, c);
  const e = pts[pts.length - 1];
  poly(up ? [[e[0], e[1] - 5], [e[0] + 6, e[1] + 2], [e[0], e[1] + 3]] : [[e[0], e[1] + 5], [e[0] + 6, e[1] - 2], [e[0], e[1] - 3]], c);
}
function dome(x: number, y: number, w: number, h: number, domeC: RGB, baseC: RGB) {
  // capitol-style dome + columns
  rect(x + w * 0.08, y + h * 0.62, w * 0.84, h * 0.38, baseC);
  for (let i = 0; i < 5; i++) rect(x + w * (0.14 + i * 0.16), y + h * 0.66, w * 0.05, h * 0.3, [220, 216, 200]);
  poly([[x + w * 0.5, y + h * 0.08], [x + w * 0.72, y + h * 0.42], [x + w * 0.28, y + h * 0.42]], domeC);
  rect(x + w * 0.24, y + h * 0.4, w * 0.52, h * 0.24, domeC);
  rect(x + w * 0.48, y + h * 0.02, w * 0.04, h * 0.08, domeC);
}
function scene(id: number, x: number, y: number, w: number, h: number) {
  const gy = y + h * 0.62;
  if (id === 1) { // COP31 conference hall
    skyGround(x, y, w, h, SKY, GRN); sun(x, y, w, h, h * 0.14, GOLD);
    rect(x + w * 0.12, y + h * 0.42, w * 0.76, h * 0.2, WHITE);
    poly([[x + w * 0.08, y + h * 0.44], [x + w * 0.5, y + h * 0.14], [x + w * 0.92, y + h * 0.44]], [29, 78, 137]);
    for (let i = 0; i < 6; i++) { const fx = x + w * (0.16 + i * 0.14); rect(fx, y + h * 0.5, 2, h * 0.14, DARK); rect(fx - 3, y + h * 0.44, 7, 5, [[166, 30, 34], [29, 78, 137], [46, 107, 52], [214, 164, 60], [120, 60, 120], [224, 110, 30]][i]); }
  } else if (id === 2) { // warship at sea
    rect(x, y, w, h * 0.55, SKY); rect(x, y + h * 0.55, w, h * 0.45, SEA);
    for (let i = 0; i < 3; i++) thickLine(x + w * (0.1 + i * 0.3), y + h * 0.68, x + w * (0.2 + i * 0.3), y + h * 0.68, 2, WHITE);
    poly([[x + w * 0.18, y + h * 0.62], [x + w * 0.82, y + h * 0.62], [x + w * 0.74, y + h * 0.42], [x + w * 0.26, y + h * 0.42]], [90, 92, 96]);
    rect(x + w * 0.42, y + h * 0.3, w * 0.12, h * 0.14, [70, 72, 76]);
    circle(x + w * 0.62, y + h * 0.3, h * 0.14, ORANGE); circle(x + w * 0.7, y + h * 0.22, h * 0.1, GOLD);
    for (let i = 0; i < 3; i++) { const dx = x + w * (0.2 + i * 0.28); circle(dx, y + h * 0.14, 2, DARK); thickLine(dx - 5, y + h * 0.12, dx + 5, y + h * 0.12, 1, DARK); }
  } else if (id === 3) { // Kyiv buildings + smoke
    skyGround(x, y, w, h, [226, 232, 236], [120, 118, 110]); smoke(x, y, w, h, 3);
    buildings(x, y, w, h, 4, [90, 88, 84]);
    poly([[x + w * 0.55, y + h * 0.45], [x + w * 0.62, y + h * 0.62], [x + w * 0.7, y + h * 0.45]], ORANGE);
    poly([[x + w * 0.6, y + h * 0.55], [x + w * 0.63, y + h * 0.66], [x + w * 0.66, y + h * 0.55]], GOLD);
  } else if (id === 4 || id === 12) { // capitol dome
    if (id === 4) { skyGround(x, y, w, h, SKY, GRN); }
    else { skyGround(x, y, w, h, [38, 54, 96], [60, 70, 60]); }
    dome(x, y, w, h, id === 4 ? WHITE : [232, 228, 216], id === 4 ? [232, 228, 216] : WHITE);
    if (id === 12) { rect(x, y + h * 0.86, w, h * 0.1, RED); }
    else { rect(x + w * 0.06, y + h * 0.06, w * 0.2, h * 0.1, RED); rect(x + w * 0.06, y + h * 0.16, w * 0.2, h * 0.05, WHITE); }
  } else if (id === 5) { // Tokyo falling market
    skyGround(x, y, w, h, SKY, [210, 208, 200]);
    circle(x + w * 0.78, y + h * 0.22, h * 0.16, RED);
    buildings(x, y, w, h, 4, [70, 72, 76]);
    chartLine(x, y, w, h, false, RED);
  } else if (id === 6) { // factory fire
    skyGround(x, y, w, h, [236, 214, 180], [150, 140, 120]);
    rect(x + w * 0.1, y + h * 0.45, w * 0.62, h * 0.4, [110, 106, 96]);
    poly([[x + w * 0.1, y + h * 0.45], [x + w * 0.22, y + h * 0.3], [x + w * 0.34, y + h * 0.45], [x + w * 0.46, y + h * 0.3], [x + w * 0.58, y + h * 0.45], [x + w * 0.72, y + h * 0.45]], [90, 88, 84]);
    rect(x + w * 0.76, y + h * 0.18, w * 0.07, h * 0.6, [80, 78, 72]);
    smoke(x + w * 0.6, y - h * 0.05, w * 0.4, h * 0.5, 2);
    flames(x + w * 0.1, y + h * 0.55, w * 0.6, h * 0.45, 3);
  } else if (id === 7) { // tankers ablaze
    rect(x, y, w, h * 0.5, SKY); rect(x, y + h * 0.5, w, h * 0.5, SEA);
    for (const [fx, fw] of [[0.08, 0.34], [0.56, 0.34]] as [number, number][]) {
      poly([[x + w * fx, y + h * 0.72], [x + w * (fx + fw), y + h * 0.72], [x + w * (fx + fw - 0.04), y + h * 0.58], [x + w * (fx + 0.04), y + h * 0.58]], [40, 40, 44]);
      rect(x + w * (fx + 0.1), y + h * 0.48, w * 0.08, h * 0.12, [70, 70, 74]);
      flames(x + w * fx, y + h * 0.28, w * fw, h * 0.32, 2);
    }
  } else if (id === 8) { // Korea exports up
    skyGround(x, y, w, h, SKY, [210, 208, 200]);
    buildings(x, y, w, h, 3, [70, 72, 76]);
    chartLine(x, y, w, h, true, DGRN);
    rect(x + w * 0.72, y + h * 0.18, w * 0.14, h * 0.16, DARK);
    rect(x + w * 0.75, y + h * 0.22, w * 0.08, h * 0.08, GOLD);
  } else if (id === 9) { // NATO star
    rect(x, y, w, h, [29, 78, 137]);
    const cx = x + w * 0.5, cy = y + h * 0.5, R = h * 0.42, r = h * 0.12;
    const pts: [number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 4, rr = i % 2 === 0 ? R : r;
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
    poly(pts, WHITE);
    circle(cx, cy, h * 0.07, [29, 78, 137]);
  } else if (id === 10) { // football pitch
    rect(x, y, w, h, [58, 130, 66]);
    rect(x + w * 0.06, y + h * 0.12, w * 0.88, h * 0.76, [58, 130, 66]);
    frame(x + w * 0.06, y + h * 0.12, w * 0.88, h * 0.76, WHITE, 2);
    thickLine(x + w * 0.5, y + h * 0.12, x + w * 0.5, y + h * 0.88, 2, WHITE);
    circle(x + w * 0.5, y + h * 0.5, h * 0.16, WHITE);
    circle(x + w * 0.68, y + h * 0.62, h * 0.12, WHITE);
    poly([[x + w * 0.66, y + h * 0.58], [x + w * 0.7, y + h * 0.58], [x + w * 0.68, y + h * 0.66]], DARK);
  } else if (id === 11) { // oil refinery
    skyGround(x, y, w, h, [236, 214, 180], [120, 110, 96]);
    for (let i = 0; i < 3; i++) {
      const tx = x + w * (0.12 + i * 0.28);
      rect(tx, y + h * 0.3, w * 0.1, h * 0.55, [80, 78, 72]);
      poly([[tx - w * 0.02, y + h * 0.3], [tx + w * 0.05, y + h * 0.14], [tx + w * 0.12, y + h * 0.3]], [60, 58, 54]);
    }
    flames(x + w * 0.6, y + h * 0.5, w * 0.3, h * 0.4, 2);
    smoke(x + w * 0.1, y, w * 0.5, h * 0.5, 2);
  } else if (id === 13) { // Wall Street skyline + rebound
    skyGround(x, y, w, h, SKY, [210, 208, 200]);
    buildings(x, y, w, h, 5, [52, 58, 72]);
    chartLine(x, y, w, h, true, DGRN);
  } else if (id === 14) { // Eiffel tower
    skyGround(x, y, w, h, SKY, GRN); sun(x, y, w, h, h * 0.13, GOLD);
    const bx = x + w * 0.5;
    thickLine(bx - w * 0.22, y + h * 0.95, bx, y + h * 0.05, 3, DARK);
    thickLine(bx + w * 0.22, y + h * 0.95, bx, y + h * 0.05, 3, DARK);
    thickLine(bx - w * 0.15, y + h * 0.68, bx + w * 0.15, y + h * 0.68, 3, DARK);
    thickLine(bx - w * 0.08, y + h * 0.42, bx + w * 0.08, y + h * 0.42, 3, DARK);
    rect(bx - w * 0.26, y + h * 0.92, w * 0.52, h * 0.06, DARK);
  } else if (id === 15) { // India Gate arch
    skyGround(x, y, w, h, [238, 226, 198], GRN);
    sun(x, y, w, h, h * 0.13, GOLD);
    rect(x + w * 0.28, y + h * 0.3, w * 0.44, h * 0.55, [176, 138, 92]);
    poly([[x + w * 0.42, y + h * 0.85], [x + w * 0.42, y + h * 0.55], [x + w * 0.5, y + h * 0.42], [x + w * 0.58, y + h * 0.55], [x + w * 0.58, y + h * 0.85]], SKY);
    rect(x + w * 0.24, y + h * 0.24, w * 0.52, h * 0.08, [150, 116, 72]);
    for (let i = 0; i < 3; i++) { const fx = x + w * (0.08 + i * 0.08); rect(fx, y + h * 0.55, 2, h * 0.3, DARK); rect(fx - 3, y + h * 0.48, 7, 5, [[214, 120, 40], [255, 255, 255], [46, 107, 52]][i]); }
  }
}

// ------------------------------------------------------------------ content
interface Story { n: number; place: string; head: string; body: string; src: string; tag: string; tagC: RGB; }
const LEADS: Story[] = [
  { n: 1, place: "ANTALYA, TURKEY", head: "COP31 collapses with no climate deal", body: "Talks end after record overtime. EU and 130 parties reject a text with no fossil fuels.", src: "Reuters \u00b7 CNN \u00b7 BBC", tag: "CONFIRMED", tagC: DGRN },
  { n: 2, place: "BENGHAZI, LIBYA", head: "Ukrainian sea drones sink Russian warship", body: "Zelenskyy: seven drones sank the corvette Merkury at Benghazi. Russia silent.", src: "CNN", tag: "REPORTED", tagC: BLUE },
  { n: 3, place: "KYIV REGION, UKRAINE", head: "Russian strikes kill 11 in Kyiv region", body: "A boy, 7, is pulled alive from rubble in Dymer after 14 hours. 153 drones fired.", src: "AP \u00b7 Ukrainian officials", tag: "CONFIRMED", tagC: DGRN },
];
const SMALL: Story[] = [
  { n: 4, place: "WASHINGTON", head: "Democrats clinch 258 House seats", body: "Largest House majority since 1992.", src: "AP", tag: "CONFIRMED", tagC: DGRN },
  { n: 5, place: "TOKYO", head: "Nikkei falls 5.06% as AI sell-off spreads", body: "Tokyo shut Monday; Kospi falls 3.3%.", src: "Market wires", tag: "CONFIRMED", tagC: DGRN },
  { n: 6, place: "BANTEN, INDONESIA", head: "24 dead in candy factory fire", body: "About 30 missing in Banten, Indonesia.", src: "Reuters", tag: "CONFIRMED", tagC: DGRN },
  { n: 7, place: "STRAIT OF HORMUZ", head: "Two tankers ablaze near Hormuz", body: "Tankers hit mines; Iran says drone downed.", src: "UKMTO \u00b7 Reuters", tag: "CLAIM", tagC: RED },
  { n: 8, place: "SEOUL", head: "Korea's exports more than double", body: "Nov 1-20 exports $77.4bn, up 101.5%.", src: "Korea Customs Service", tag: "CONFIRMED", tagC: DGRN },
  { n: 9, place: "WARSAW / BRUSSELS", head: "NATO meets after Russian missiles land in Poland", body: "All three objects were Russian Kh-101s.", src: "Polish prosecutors \u00b7 NATO", tag: "CONFIRMED", tagC: DGRN },
  { n: 10, place: "LIVERPOOL", head: "Liverpool thrash Man Utd 4-0", body: "Pochettino's debut: Yoro sent off early.", src: "Reuters", tag: "CONFIRMED", tagC: DGRN },
  { n: 11, place: "RUSSIA", head: "Ukraine drones hit three Russian oil sites", body: "Novoshakhtinsk and Perm refineries struck.", src: "Ukrainian General Staff", tag: "REPORTED", tagC: BLUE },
  { n: 12, place: "WASHINGTON", head: "Trump 'inclined' to resume Iran conflict", body: "If no deal is reached by New Year.", src: "FT \u00b7 Economic Times", tag: "REPORTED", tagC: BLUE },
  { n: 13, place: "NEW YORK", head: "Wall Street futures rebound after rout", body: "Nasdaq futures up 3.0% early Monday.", src: "Reuters", tag: "CONFIRMED", tagC: DGRN },
  { n: 14, place: "PARIS", head: "France's leading candidates question Ukraine aid", body: "Frontrunners query aid before spring vote.", src: "Wire reports", tag: "REPORTED", tagC: BLUE },
  { n: 15, place: "NEW DELHI", head: "Nepal PM Balen Shah welcomed by Modi", body: "Ceremonial welcome in New Delhi Monday.", src: "Wire reports", tag: "CONFIRMED", tagC: DGRN },
];
const BRIEFS: [number, string][] = [
  [16, "Atlanta: Delta delays 1,600+ flights; outage resolved Monday. (FAA)"],
  [17, "Gaza: experts call Gaza 'toxic wasteland' after assault. (Wire)"],
  [18, "Seoul: education minister Choi Kyo-jin resigns in exam scandal. (Wire)"],
  [19, "Iowa: US Army to detonate explosives despite court order. (Wire)"],
  [20, "Sinaloa: FBI most-wanted 'El Chapo Isidro' captured in Guasave. (Wire)"],
  [21, "Khartoum: drone strikes kill five children, Omdurman too. (Wire)"],
  [22, "Brasilia: Bolsonaro in intensive care, stable; no discharge date. (Wire)"],
  [23, "Nigeria: vigilantes reportedly kill Fulani; 35 dead in Wawa. (Wire)"],
  [24, "South Sudan: 21 killed in Saturday-night raid on cattle camp. (Wire)"],
  [25, "Ghana: opens voluntary buyback of up to $2.4bn of bonds. (Wire)"],
  [26, "Ecuador: alleged Los Lobos leader Sayayin arrested in south. (Wire)"],
  [27, "Odesa: schools go remote 23-27 Nov after strikes wreck grid. (Wire)"],
  [28, "Taipei: stocks swing 1,578 points in a day; TSMC ends higher. (Wire)"],
  [29, "Paris: Le Pen declines Zelenskyy invite; will meet in Paris. (Wire)"],
  [30, "Science: Lean and Mathlib confirm Riemann Hypothesis proof. (Wire)"],
  [31, "Bratislava: Slovakia rejects new 45bn-euro EU loan for Ukraine. (Wire)"],
  [32, "United Nations: Britain, France, China block Nusseibeh UN bid. (Wire)"],
  [33, "Brussels: Belgian airports shut as national strike grounds flights. (Wire)"],
  [34, "London: Titanic survivor's ring sells for \u00a3150,000. (Wire)"],
  [35, "Centurion: rain delays toss; Markram captains, S. Africa 75.00%. (Cricbuzz)"],
  [36, "Jakarta: Indonesia seizes ship carrying 405 tonnes sodium perchlorate. (Wire)"],
];
const DATECHECK = "DATE CHECK \u2014 READABLE EDITION: wires as of about 09:45 UTC, Monday 23 November 2026. Not repeated from Sunday's edition: the Sparta II Baltic ship fire, the Peru 6.8 quake, Eisenkot's mandate ceremony, Verstappen's Las Vegas pole, England's 37\u201312 rugby win, Arsenal 2\u20132 and Leeds 4\u20131 Chelsea. Left out as earlier news: Korea crossing $1tn in exports (19 Nov; Monday's news is the Nov 1\u201320 customs data). New on Monday: Wall Street futures rebound; Trump signs the Common Cents Act ending the penny; Lean and Mathlib confirm the Riemann proof (brief 30). Still to come at press time: the rest of Monday \u2014 NATO's session outcome, Wall Street's close, the Centurion toss. Played Sunday, led Monday: Liverpool 4\u20130 Man Utd.";
const FOOTER = "Every story here happened, or was first reported, on Monday 23 November 2026 (UTC), or is a weekend outcome as Monday's wires first reported it. Sources named beside each story \u2014 original drawings.";

// -------------------------------------------------------------------- page --
fillAll(CREAM);
const MX = 22, CW = 980; // margin, content width
let y = 4;

// Kicker bar
rect(MX, y, CW, 18, RED);
drawText("THE WORLD IN ONE DAY \u2014 READABLE EDITION", MX + 10, y + 3, 12, 2.1, WHITE);
const kr = "36 STORIES \u00b7 7 REGIONS \u00b7 MONDAY 23 NOVEMBER 2026";
drawText(kr, MX + CW - 10 - textWidth(kr, 12), y + 3, 12, 2.1, WHITE);
y += 22;

// Masthead
drawTextC("MONDAY 23 NOVEMBER 2026", MX + CW / 2, y + 2, 48, 2.6, INK);
y += 50;
frame(MX, y, CW, 2, INK); y += 4;

// Sub-deck
drawTextC("COP31 collapses in Antalya \u2014 Russian warship sunk off Libya \u2014 Strikes kill 11 in Kyiv region", MX + CW / 2, y, 14, 2.1, INK);
y += 16;

// Numbers strip — 6 big numbers
const NUMS: [string, string][] = [
  ["258", "Democrats' House seats"],
  ["-5.06%", "Nikkei fall, Friday"],
  ["11", "killed in Kyiv region"],
  ["24", "dead in Banten fire"],
  ["$77.4bn", "Korea Nov 1-20 exports"],
  ["+3.0%", "Nasdaq futures rebound"],
];
{
  const bw = CW / 6;
  for (let i = 0; i < 6; i++) {
    const bx = MX + i * bw;
    frame(bx, y, bw - 3, 38, INK, 1);
    drawTextC(NUMS[i][0], bx + (bw - 3) / 2, y + 1, 22, 2.4, i === 1 ? RED : INK);
    drawTextC(NUMS[i][1], bx + (bw - 3) / 2, y + 27, 10, 2.0, INK);
  }
}
y += 40;

// Timeline — 2 rows, bold
const TL1 = "00:53 UTC  Korea customs data out   \u00b7   02:22 UTC  Ukraine hits 3 Russian oil sites   \u00b7   02:29 ET  Wall St futures rebound   \u00b7   06:27 UTC  Kyiv toll reaches 11";
const TL2 = "07:28 UTC  Russia's 153-drone attack reported   \u00b7   07:48 UTC  Banten toll confirmed   \u00b7   09:45 UTC  Press time: this edition's cut-off";
drawText(TL1, MX, y, 10.5, 2.0, INK);
drawText(TL2, MX, y + 14, 10.5, 2.0, INK);
y += 28;

// Lead stories — 3 columns
{
  const colW = (CW - 24) / 3, artH = 50;
  const top = y;
  for (let i = 0; i < 3; i++) {
    const s = LEADS[i], bx = MX + i * (colW + 12);
    scene(s.n, bx, top, colW, artH);
    frame(bx, top, colW, artH, INK, 1);
    // place kicker above headline band
    drawText(s.n + ". " + s.place, bx, top + artH + 4, 10, 2.1, RED);
    const hl = wrapText(s.head, colW - 4, 22);
    drawLines(hl, bx + 2, top + artH + 16, 22, 22, 2.3, INK);
    const bl = wrapText(s.body, colW - 4, 12.5);
    drawLines(bl.slice(0, 2), bx + 2, top + artH + 16 + hl.length * 22 + 3, 12.5, 14, 1.9, INK);
    const sy = top + artH + 16 + hl.length * 22 + 3 + Math.min(2, bl.length) * 14 + 3;
    drawText(s.src, bx + 2, sy, 10, 2.0, GREY);
    const tw = textWidth(s.tag, 10) + 10;
    tag(bx + colW - tw, sy - 1, s.tag, s.tagC);
  }
  y = top + 160;
}

// Small stories — 3 columns x 4 rows
{
  const colW = (CW - 24) / 3, rowH = 91, artH = 16;
  const top = y;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const s = SMALL[r * 3 + c], bx = MX + c * (colW + 12), by = top + r * rowH;
    scene(s.n, bx, by, colW, artH);
    frame(bx, by, colW, artH, INK, 1);
    drawText(s.n + ". " + s.place, bx, by + artH + 3, 9.5, 2.1, RED);
    const hl = wrapText(s.head, colW - 4, 15);
    drawLines(hl.slice(0, 2), bx + 2, by + artH + 14, 15, 15, 2.1, INK);
    drawText(s.body, bx + 2, by + artH + 14 + Math.min(2, hl.length) * 15 + 2, 11.5, 1.9, INK);
    const sy = by + artH + 14 + Math.min(2, hl.length) * 15 + 2 + 12;
    drawText(s.src, bx + 2, sy, 9.5, 2.0, GREY);
    const tw = textWidth(s.tag, 9.5) + 10;
    tag(bx + colW - tw, sy - 1, s.tag, s.tagC);
  }
  y = top + 4 * rowH;
}

// World map
{
  const top = y + 2;
  drawText("THE WORLD IN ONE PICTURE \u2014 36 STORIES, 7 REGIONS", MX, top, 12, 2.1, INK);
  drawText("Red pin = lead story  \u00b7  Blue pin = small story  \u00b7  Dot = brief", MX + CW - textWidth("Red pin = lead story  \u00b7  Blue pin = small story  \u00b7  Dot = brief", 10), top + 1, 10, 2.0, GREY);
  const my = top + 13, mh = 40, mw = CW;
  rect(MX, my, mw, mh, [220, 233, 242]);
  frame(MX, my, mw, mh, INK, 1);
  const px = (lon: number) => MX + (lon + 180) / 360 * mw;
  const py = (lat: number) => my + (75 - lat) / 150 * mh;
  const cont = (pts: [number, number][]) => poly(pts.map(([lo, la]) => [px(lo), py(la)] as [number, number]), [168, 176, 122]);
  cont([[-168, 66], [-140, 70], [-125, 71], [-110, 68], [-95, 80], [-85, 66], [-70, 62], [-55, 52], [-65, 45], [-75, 35], [-80, 25], [-85, 20], [-95, 18], [-105, 22], [-115, 28], [-125, 40], [-140, 60], [-165, 60]]);
  cont([[-80, 10], [-75, 0], [-70, -10], [-60, -25], [-50, -35], [-40, -20], [-35, -8], [-50, 0], [-60, 8], [-75, 12]]);
  cont([[-17, 15], [-10, 30], [0, 35], [10, 37], [20, 32], [30, 31], [35, 28], [40, 15], [48, 11], [51, 10], [43, 0], [40, -10], [35, -20], [30, -30], [20, -35], [15, -25], [12, -10], [8, 4], [-5, 5], [-15, 10]]);
  cont([[-10, 36], [-5, 43], [0, 48], [5, 55], [10, 57], [18, 56], [25, 60], [30, 60], [28, 55], [20, 50], [15, 45], [10, 44], [3, 42], [-2, 37], [-10, 36]]);
  cont([[30, 60], [40, 68], [60, 70], [80, 72], [100, 77], [120, 73], [140, 72], [160, 70], [170, 66], [160, 60], [140, 45], [130, 40], [127, 35], [122, 30], [110, 20], [105, 10], [100, 8], [95, 15], [90, 22], [80, 15], [75, 8], [70, 20], [60, 25], [55, 26], [50, 30], [45, 30], [40, 36], [30, 42]]);
  cont([[113, -22], [125, -15], [135, -12], [142, -11], [150, -20], [153, -27], [150, -37], [140, -38], [130, -32], [120, -34]]);
  const pins: [number, number, number, number, number][] = [
    // n, lon, lat, dx, dy
    [1, 30, 36, -8, 0], [2, 20, 32, 0, 8], [3, 30, 50, 12, 6],
    [4, -77, 39, 0, 0], [5, 139, 35, 0, 0], [6, 106, -6, 0, 0],
    [7, 56, 26, 0, 6], [8, 127, 37, 0, 0], [9, 21, 52, -14, 0],
    [10, -3, 53, -2, -2], [11, 56, 58, 0, -6], [12, -77, 39, 20, 2],
    [13, -74, 40, 24, 12], [14, 2, 48, 0, 10], [15, 77, 28, 0, 0],
  ];
  const dots: [number, number][] = [[-84, 33], [34, 31], [-99, 19], [-95, 42], [32, 15], [32, -26], [15, -23], [-70, -12], [19, 52], [28, 41], [-0.1, 51], [28, -26], [121, 25], [103, 1]];
  for (const [lo, la] of dots) circle(px(lo), py(la), 2.5, INK);
  for (const [n, lo, la, dx, dy] of pins) {
    const cx = px(lo) + dx, cy = py(la) + dy;
    if (dx || dy) thickLine(px(lo), py(la), cx, cy, 1, INK);
    circle(cx, cy, 7, n <= 3 ? RED : BLUE);
    const ns = String(n);
    drawText(ns, cx - textWidth(ns, 9) / 2, cy - 4.5, 9, 2.2, WHITE);
  }
  y = my + mh + 4;
}

// Briefs — 2 columns, one short line each
{
  drawText("BRIEFS 16\u201336 \u2014 THE REST OF THE DAY", MX, y, 11, 2.1, RED);
  y += 14;
  const colW = (CW - 20) / 2;
  for (let i = 0; i < BRIEFS.length; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const bx = MX + col * (colW + 20), by = y + row * 12.5;
    const [n, t] = BRIEFS[i];
    drawText(String(n) + ".", bx, by, 11.5, 2.1, RED);
    drawText(t, bx + textWidth(String(n) + ". ", 11.5), by, 11.5, 1.9, INK);
  }
  y += 11 * 12.5 + 3;
}

// DATE CHECK box
{
  const top = y;
  const inner = CW - 24;
  const lines = wrapText(DATECHECK, inner, 11);
  const bh = 14 + lines.length * 13 + 6;
  frame(MX, top, CW, bh, RED, 2);
  rect(MX + 2, top + 2, CW - 4, 13, [250, 230, 220]);
  drawText("DATE CHECK \u2014 READABLE EDITION", MX + 10, top + 3, 11, 2.1, RED);
  drawLines(lines, MX + 12, top + 18, 11, 13, 1.9, INK);
  y = top + bh + 3;
  console.error("DATECHECK lines=" + lines.length);
}

// Footer
{
  const fl = wrapText(FOOTER, CW, 10);
  drawLines(fl, MX + (CW - Math.max(...fl.map(l => textWidth(l, 10)))) / 2, y, 10, 11, 1.9, INK);
  y += fl.length * 11;
}
console.error("PAGE END y=" + y.toFixed(1) + " (limit 1024)");

// -------------------------------------------------------------------- png ---
function crc32(buf: Buffer): number {
  let t = (crc32 as unknown as { t?: number[] }).t;
  if (!t) { t = ((crc32 as unknown as { t: number[] }).t = []); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
const raw = Buffer.alloc(H * (1 + W * 3));
for (let yy = 0; yy < H; yy++) { raw[yy * (1 + W * 3)] = 0; Buffer.from(img.buffer).copy(raw, yy * (1 + W * 3) + 1, yy * W * 3, (yy + 1) * W * 3); }
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0)),
]);
fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync("/output/entry.png", png);
console.error("wrote /output/entry.png bytes=" + png.length);
