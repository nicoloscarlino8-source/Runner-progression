/* Grafici condivisi tra web app e PDF: mappa delle regioni e ruota della pedalata.
   Tutti i colori passano da variabili CSS, così funzionano in tema chiaro/scuro e in stampa. */

function mappaCorpo(vista) {
  // Schema dell'arto inferiore DESTRO. Non in scala: serve a orientarsi tra le regioni.
  const R = (id, d, label) => `<path class="reg" data-reg="${id}" d="${d}" tabindex="0" role="button" aria-label="${label}"><title>${label}</title></path>`;
  const B = (d) => `<path class="osso" d="${d}"/>`;
  let g = "";
  if (vista === "ant") {
    g += B("M28 66 Q40 22 108 18 Q170 22 208 62 L208 70 L28 70 Z");
    g += R("glutea", "M28 70 L70 70 L66 140 L40 150 Q30 110 28 70 Z", "Regione glutea laterale (tensore della fascia lata, medio gluteo)");
    g += R("flessori-anca", "M85 70 L204 70 L140 146 Z", "Inguine: ileopsoas");
    g += R("coscia-med", "M204 70 Q218 120 212 170 Q204 222 180 264 L160 264 L140 146 Z", "Coscia mediale: adduttori");
    g += R("coscia-ant", "M70 70 L85 70 L140 146 L160 264 L62 264 Q42 210 40 150 L66 140 Z", "Coscia anteriore: quadricipite, sartorio");
    g += `<ellipse class="osso" cx="112" cy="285" rx="19" ry="21"/>`;
    g += R("gamba-lat", "M70 310 L95 310 L105 466 L92 466 Q72 384 70 310 Z", "Gamba laterale: peronei");
    g += R("gamba-ant", "M95 310 L128 310 L122 466 L105 466 Z", "Gamba anteriore: tibiale anteriore, estensori");
    g += B("M128 310 L141 310 L133 466 L122 466 Z");
    g += R("gamba-post-sup", "M141 310 L164 310 Q162 392 140 466 L133 466 Z", "Polpaccio (visibile dal lato mediale)");
    g += R("piede-dors", "M90 472 L140 472 L150 500 Q168 530 120 532 Q72 532 80 500 Z", "Dorso del piede");
    g += `<text class="lbl" x="34" y="300">LAT</text><text class="lbl" x="176" y="300">MED</text>`;
    g += `<text class="lbl dim" x="146" y="400" transform="rotate(-84 146 400)">tibia</text>`;
  } else {
    g += R("glutea", "M36 64 Q44 22 114 20 Q192 24 210 70 L212 150 Q160 168 100 162 L48 152 Q32 110 36 64 Z", "Regione glutea: glutei e rotatori");
    g += R("coscia-med", "M30 128 L48 152 Q62 210 82 264 L62 260 Q34 200 30 128 Z", "Coscia mediale: adduttori (grande adduttore, gracile)");
    g += R("coscia-post", "M48 152 L100 162 Q160 168 212 150 Q208 214 182 264 L82 264 Q62 210 48 152 Z", "Coscia posteriore: femorali");
    g += `<path class="rischio" data-rischio="1" d="M130 262 L168 286 L130 314 L92 286 Z" tabindex="0" role="button" aria-label="Cavo popliteo: zona a rischio"><title>Cavo popliteo: zona a rischio, solo sfioramento</title></path>`;
    g += R("gamba-post-sup", "M70 292 L92 286 L130 314 L168 286 L180 292 Q182 362 152 466 L106 466 Q66 362 70 292 Z", "Polpaccio: gastrocnemio, soleo");
    g += `<ellipse class="reg prof" data-reg="gamba-post-prof" cx="128" cy="402" rx="17" ry="44" tabindex="0" role="button" aria-label="Loggia posteriore profonda"><title>Loggia posteriore profonda</title></ellipse>`;
    g += R("piede-plant", "M102 472 L150 472 Q166 502 160 530 Q128 546 98 530 Q92 502 102 472 Z", "Pianta del piede");
    g += `<text class="lbl" x="22" y="300">MED</text><text class="lbl" x="188" y="300">LAT</text>`;
    g += `<text class="lbl dim" x="113" y="406">prof.</text>`;
  }
  return `<svg class="mappa" viewBox="0 0 240 548" role="group" aria-label="Schema arto inferiore destro, vista ${vista === "ant" ? "anteriore" : "posteriore"}">${g}</svg>`;
}

function _pt(cx, cy, r, deg) {
  const t = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(t), cy - r * Math.cos(t)];
}
function _arco(cx, cy, r, da, a) {
  let sweep = (a - da + 360) % 360;
  if (sweep === 0) sweep = 360;
  const [x1, y1] = _pt(cx, cy, r, da);
  const [x2, y2] = _pt(cx, cy, r, da + Math.min(sweep, 359.9));
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
function attivo(angolo, da, a) {
  angolo = ((angolo % 360) + 360) % 360;
  return da <= a ? angolo >= da && angolo <= a : angolo >= da || angolo <= a;
}

function ruotaPedalata(pedalata, angolo) {
  // 0° = punto morto superiore; rotazione oraria = ciclista visto dal lato destro che va verso destra.
  const cx = 200, cy = 200, r0 = 62, step = 15;
  let s = "";
  // settori di fase
  s += `<path class="fase-spinta" d="${_arco(cx, cy, 186, 0, 180)}" />`;
  s += `<path class="fase-risalita" d="${_arco(cx, cy, 186, 180, 360)}" />`;
  pedalata.forEach((p, i) => {
    const r = r0 + i * step;
    const on = angolo == null ? true : attivo(angolo, p.da, p.a);
    s += `<circle class="traccia" cx="${cx}" cy="${cy}" r="${r}"/>`;
    s += `<path class="arco c${i}${on ? " on" : ""}" d="${_arco(cx, cy, r, p.da, p.a)}"><title>${p.muscolo}: ${p.da}°–${p.a}°</title></path>`;
  });
  [0, 90, 180, 270].forEach((d) => {
    const [x1, y1] = _pt(cx, cy, 44, d), [x2, y2] = _pt(cx, cy, 176, d);
    s += `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  });
  const lab = (d, t, dy) => { const [x, y] = _pt(cx, cy, 198, d); return `<text class="wl" x="${x.toFixed(1)}" y="${(y + (dy || 0)).toFixed(1)}" text-anchor="middle">${t}</text>`; };
  s += lab(0, "0° PMS", 4) + lab(90, "90°", 4) + lab(180, "180° PMI", 4) + lab(270, "270°", 4);
  s += `<text class="wl fase" x="${cx + 120}" y="${cy - 150}" text-anchor="middle">SPINTA</text>`;
  s += `<text class="wl fase" x="${cx - 120}" y="${cy + 160}" text-anchor="middle">RISALITA</text>`;
  if (angolo != null) {
    const [px, py] = _pt(cx, cy, 36, angolo), [lx, ly] = _pt(cx, cy, 182, angolo);
    s += `<line class="lancetta" x1="${cx}" y1="${cy}" x2="${lx.toFixed(1)}" y2="${ly.toFixed(1)}"/>`;
    s += `<circle class="perno" cx="${cx}" cy="${cy}" r="9"/><circle class="pedale" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="8"/>`;
  } else {
    s += `<circle class="perno" cx="${cx}" cy="${cy}" r="9"/>`;
  }
  return `<svg class="ruota" viewBox="-20 -20 440 440" role="img" aria-label="Attivazione muscolare durante il giro di pedivella">${s}</svg>`;
}

const SVG = { mappaCorpo, ruotaPedalata, attivo };
if (typeof module !== "undefined") module.exports = SVG;
if (typeof window !== "undefined") window.SVG = SVG;
