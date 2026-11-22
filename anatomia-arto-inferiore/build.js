#!/usr/bin/env node
/* Genera dagli stessi dati (src/data.js):
   - webapp/index.html      → web app completa, un solo file, funziona offline
   - dist/artifact.html     → stessa app senza <html>/<head> (per la pubblicazione come pagina)
   - Anatomia-arto-inferiore-massaggio-ciclismo.pdf  → manuale stampabile A4
   Uso: node build.js  (richiede Playwright con Chromium per il PDF) */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const D = require("./src/data.js");
const S = require("./src/svg.js");

const root = __dirname;
const rd = (p) => fs.readFileSync(path.join(root, p), "utf8");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nervi = (m) => m.nK.map((k) => D.NERVI[k]).join(" + ");

/* ------------------------------------------------------------ WEB APP */
const frag = rd("src/app.html").replace("/*@@DATA@@*/", () => rd("src/data.js")).replace("/*@@SVG@@*/", () => rd("src/svg.js"));
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.mkdirSync(path.join(root, "webapp"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/artifact.html"), frag);
const full = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}</style>
</head>
<body>
${frag}
</body>
</html>
`;
fs.writeFileSync(path.join(root, "webapp/index.html"), full);
console.log("✓ webapp/index.html", (full.length / 1024).toFixed(0) + " KB");

/* ------------------------------------------------------------ PDF */
function printHtml(toc) {
  const pg = (k) => (toc && toc[k] ? toc[k] : "");
  const sezioni = [
    ["leggere", "Come usare questo manuale"],
    ["mappa", "Mappa delle regioni"],
    ["repere", "Punti di repere ossei"],
    ...D.REGIONI.map((r) => ["r-" + r.id, r.nome]),
    ["tendini", "Tendini e fasce"],
    ["pedalata", "Chi lavora durante la pedalata"],
    ["tecniche", "Tecniche di massaggio"],
    ["protocolli", "Protocolli: pre-gara, post-gara, allenamento, recupero"],
    ["sicurezza", "Sicurezza: zone a rischio e controindicazioni"],
    ["problemi", "Problemi frequenti del ciclista"],
    ["tabella", "Tabella riassuntiva"],
    ["scheda", "Scheda di valutazione dell'atleta"],
    ["biblio", "Bibliografia"]
  ];
  const H = (id, title, eyebrow) => `<h1 class="sec" data-toc="${id}"><span class="eb">${esc(eyebrow || "")}</span>${esc(title)}</h1>`;

  const muscolo = (m) => {
    const ped = D.PEDALATA.find((p) => p.id === m.id);
    return `<article class="m">
      <header><h3>${esc(m.nome)}</h3><span class="lat">${esc(m.lat)}</span><span class="tipo">${esc(m.tipo)}${m.strato ? " · " + m.strato + "° strato" : ""}</span></header>
      <div class="oi">
        <div class="o"><b>ORIGINE</b><p class="s">${esc(m.o)}</p><p>${esc(m.origine)}</p></div>
        <div class="i"><b>INSERZIONE</b><p class="s">${esc(m.i)}</p><p>${esc(m.inserzione)}</p></div>
      </div>
      <dl>
        <dt>Innervazione</dt><dd><strong>${esc(nervi(m))}</strong> <span class="mono">${esc(m.radici)}</span>${m.nervoNota ? `<br><span class="mut">${esc(m.nervoNota)}</span>` : ""}</dd>
        <dt>Azione</dt><dd>${m.azione.map(esc).join(" · ")}</dd>
        <dt class="bk">Ciclismo</dt><dd>${esc(m.ciclismo)}${ped ? ` <span class="mono">[EMG ≈ ${ped.da}°→${ped.a}°]</span>` : ""}</dd>
        <dt>Palpazione</dt><dd>${esc(m.palpazione)}</dd>
        <dt>Massaggio</dt><dd>${esc(m.massaggio)}</dd>
        ${m.attenzione ? `<dt class="wr">Attenzione</dt><dd class="wr">${esc(m.attenzione)}</dd>` : ""}
      </dl>
    </article>`;
  };

  let body = "";
  /* copertina */
  body += `<section class="cover">
    <div class="cv-top">RUNNER PROGRESSION · MASSAGGIO SPORTIVO</div>
    <div class="cv-main">
      <h1>Anatomia dei muscoli<br>dell'arto inferiore</h1>
      <p class="cv-sub">Origine, inserzione, innervazione, azione, palpazione e massaggio di ${D.MUSCOLI.length} muscoli, tendini e fasce. Con protocolli pre e post gara, sicurezza e biomeccanica della pedalata per il massaggiatore di una squadra di ciclismo.</p>
      <div class="cv-wheel">${S.ruotaPedalata(D.PEDALATA, null)}</div>
    </div>
    <div class="cv-foot"><span>Manuale di studio</span><span>Edizione ${new Date().toLocaleDateString("it-IT", { month: "long", year: "numeric" })}</span></div>
  </section>`;

  /* indice */
  body += `<section class="pb"><h1 class="sec"><span class="eb">Indice</span>Contenuti</h1><ol class="toc">${sezioni.map(([k, t]) => `<li><span>${esc(t)}</span><i></i><b>${pg(k)}</b></li>`).join("")}</ol></section>`;

  /* come leggere */
  body += `<section class="pb">${H("leggere", "Come usare questo manuale", "Introduzione")}
    <p class="lead">Ogni scheda muscolo ha la stessa struttura, così puoi ripassare velocemente. L'<span class="co">origine</span> è l'attacco di solito più vicino al tronco (prossimale) e più fisso; l'<span class="ci">inserzione</span> è l'attacco che di solito si muove quando il muscolo si contrae.</p>
    <div class="two">
      <div class="box"><h4>Struttura della scheda</h4><ul>
        <li><b>Origine / Inserzione</b>: in grassetto la sintesi da memorizzare, sotto la descrizione completa.</li>
        <li><b>Innervazione</b>: nervo e radici spinali principali (es. L4–S1).</li>
        <li><b>Azione</b>: cosa fa il muscolo sulle articolazioni.</li>
        <li><b>Ciclismo</b>: ruolo nella pedalata; tra parentesi l'intervallo indicativo di attività elettromiografica in gradi di pedivella.</li>
        <li><b>Palpazione</b>: posizione dell'atleta e come trovarlo con le mani.</li>
        <li><b>Massaggio</b>: posizione, tecniche e quando usarle.</li>
        <li><b>Attenzione</b>: vasi, nervi e segnali di allarme.</li></ul></div>
      <div class="box"><h4>Abbreviazioni</h4><dl class="abbr">
        <dt>SIAS</dt><dd>Spina iliaca antero-superiore</dd><dt>SIAI</dt><dd>Spina iliaca antero-inferiore</dd><dt>SIPS</dt><dd>Spina iliaca postero-superiore</dd>
        <dt>PMS</dt><dd>Punto morto superiore (pedivella in alto, 0°)</dd><dt>PMI</dt><dd>Punto morto inferiore (pedivella in basso, 180°)</dd>
        <dt>MTF</dt><dd>Articolazione metatarso-falangea</dd><dt>IF</dt><dd>Articolazione interfalangea</dd><dt>TVP</dt><dd>Trombosi venosa profonda</dd>
        <dt>EMG</dt><dd>Elettromiografia (misura dell'attività elettrica del muscolo)</dd><dt>DOMS</dt><dd>Indolenzimento muscolare a insorgenza ritardata</dd>
        <dt>Peroneo = fibulare</dt><dd>Stesso muscolo/nervo: la nomenclatura internazionale usa \"fibulare\"</dd></dl></div>
    </div>
    <div class="box note"><h4>Nota sulla precisione</h4><p>Origini, inserzioni e innervazioni seguono i principali testi di anatomia (Gray's, Moore, Netter). In anatomia la variabilità individuale è normale: alcuni muscoli possono mancare (piccolo psoas, plantare, terzo peroneo) e le radici nervose possono variare di un livello. Gli intervalli di attività nella pedalata sono valori medi da studi EMG e cambiano con potenza, cadenza e posizione.</p></div>
  </section>`;

  /* mappa */
  body += `<section class="pb">${H("mappa", "Mappa delle regioni", "Orientamento")}
    <p class="lead">Schema dell'arto inferiore destro (non in scala). Il rombo tratteggiato dietro il ginocchio è il cavo popliteo: solo sfioramento.</p>
    <div class="maps"><figure>${S.mappaCorpo("ant")}<figcaption>Vista anteriore</figcaption></figure><figure>${S.mappaCorpo("post")}<figcaption>Vista posteriore</figcaption></figure>
    <div class="reglist">${D.REGIONI.map((r) => `<div><b>${esc(r.nome)}</b><span>${D.MUSCOLI.filter((m) => m.regione === r.id).map((m) => esc(m.nome)).join(", ")}</span></div>`).join("")}</div></div>
  </section>`;

  /* repere */
  body += `<section class="pb">${H("repere", "Punti di repere ossei", "Palpazione")}
    <table class="t"><thead><tr><th>Punto</th><th>Dove si trova</th><th>Come trovarlo</th><th>Muscoli collegati</th></tr></thead><tbody>
    ${D.REPERE.map((r) => `<tr><td><b>${esc(r.nome)}</b></td><td>${esc(r.dove)}</td><td>${esc(r.come)}</td><td>${esc(r.muscoli)}</td></tr>`).join("")}</tbody></table></section>`;

  /* muscoli per regione */
  D.REGIONI.forEach((r, idx) => {
    const ms = D.MUSCOLI.filter((m) => m.regione === r.id);
    body += `<section class="pb">${H("r-" + r.id, r.nome, `Regione ${idx + 1} di ${D.REGIONI.length} · ${ms.length} muscol${ms.length === 1 ? "o" : "i"}`)}${ms.map(muscolo).join("")}</section>`;
  });

  /* tendini */
  body += `<section class="pb">${H("tendini", "Tendini e fasce", "Strutture fibrose")}
    ${D.TENDINI.map((t) => `<article class="m"><header><h3>${esc(t.nome)}</h3></header><div class="oi"><div class="o"><b>DA</b><p>${esc(t.da)}</p></div><div class="i"><b>A</b><p>${esc(t.a)}</p></div></div>
    <dl><dt>Note</dt><dd>${esc(t.note)}</dd><dt class="bk">Ciclismo</dt><dd>${esc(t.ciclismo)}</dd><dt>Massaggio</dt><dd>${esc(t.massaggio)}</dd></dl></article>`).join("")}</section>`;

  /* pedalata */
  body += `<section class="pb">${H("pedalata", "Chi lavora durante la pedalata", "Biomeccanica")}
    <p class="lead">0° = punto morto superiore; la rotazione è oraria (bici vista dal lato destro). Ogni anello è un muscolo: l'arco colorato indica quando è attivo. Valori indicativi da studi EMG (soprattutto Hug &amp; Dorel, 2009).</p>
    <div class="ped"><div class="wheel">${S.ruotaPedalata(D.PEDALATA, null)}</div>
    <table class="t"><thead><tr><th></th><th>Muscolo (dall'anello interno)</th><th>Intervallo</th><th>Fase</th></tr></thead><tbody>
    ${D.PEDALATA.map((p, i) => `<tr><td><span class="sw c${i}"></span></td><td>${esc(p.muscolo)}</td><td class="mono">${p.da}°–${p.a}°</td><td>${esc(p.fase)}</td></tr>`).join("")}</tbody></table></div>
    <div class="three">
      <div class="box"><h4>Spinta (0°–180°)</h4><p>Grande gluteo e vasti producono la maggior parte della potenza; soleo e gastrocnemio trasmettono la forza al pedale.</p></div>
      <div class="box"><h4>Punto morto inferiore</h4><p>Femorali e gastrocnemio accompagnano il pedale indietro e oltre il fondo.</p></div>
      <div class="box"><h4>Risalita (180°–360°)</h4><p>Ileopsoas, retto femorale e tibiale anteriore riportano su gamba e punta del piede.</p></div>
    </div>
    <div class="box note"><h4>Cosa significa per il massaggio</h4><p>Dopo salite e cronometro lavora soprattutto glutei, quadricipite e polpacci. Dopo tappe lunghe in pianura con molte ore in sella: flessori dell'anca (ileopsoas, retto femorale, TFL), glutei e drenaggio dei polpacci. Le regolazioni della bici (altezza della sella, tacchette) cambiano quanto lavora ogni muscolo: segnala al biomeccanico i fastidi ricorrenti.</p></div>
  </section>`;

  /* tecniche e protocolli */
  body += `<section class="pb">${H("tecniche", "Tecniche di massaggio", "Pratica")}
    <table class="t"><thead><tr><th>Tecnica</th><th>Come</th><th>Quando</th><th>Effetto</th></tr></thead><tbody>
    ${D.TECNICHE.map((t) => `<tr><td><b>${esc(t.nome)}</b></td><td>${esc(t.come)}</td><td>${esc(t.quando)}</td><td>${esc(t.effetto)}</td></tr>`).join("")}</tbody></table></section>`;
  body += `<section class="pb">${H("protocolli", "Protocolli: pre-gara, post-gara, allenamento, recupero", "Pratica")}
    ${D.PROTOCOLLI.map((p) => `<article class="proto"><h3>${esc(p.nome)}</h3>
      <div class="facts"><div><small>Quando</small>${esc(p.quando)}</div><div><small>Durata</small>${esc(p.durata)}</div><div><small>Ritmo</small>${esc(p.ritmo)}</div><div><small>Pressione</small>${esc(p.pressione)}</div></div>
      <p><b>Obiettivo.</b> ${esc(p.obiettivo)} <b>Prodotto.</b> ${esc(p.prodotto)}</p>
      <div class="two"><div><h4>Sequenza</h4><ol>${p.sequenza.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
      <div><h4 class="wrh">Da evitare</h4><ul>${p.evita.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><p class="mut sm">${esc(p.nota)}</p></div></div></article>`).join("")}</section>`;

  /* sicurezza */
  body += `<section class="pb">${H("sicurezza", "Sicurezza: zone a rischio e controindicazioni", "Prima di tutto")}
    <h2 class="h2">Zone a rischio</h2>
    <table class="t"><thead><tr><th>Zona</th><th>Dove</th><th>Cosa c'è</th><th>Regola</th></tr></thead><tbody>
    ${D.ZONE_RISCHIO.map((z) => `<tr><td><b>${esc(z.nome)}</b></td><td>${esc(z.dove)}</td><td>${esc(z.cosa)}</td><td><b>${esc(z.regola)}</b></td></tr>`).join("")}</tbody></table>
    <h2 class="h2 dg">Non massaggiare: invia al medico</h2>
    <div class="ci">${D.CONTROINDICAZIONI.assolute.map((c) => `<div class="cbox dg"><b>${esc(c.t)}</b><p>${esc(c.d)}</p></div>`).join("")}</div>
    <h2 class="h2 wrh">Adatta il trattamento o segnala</h2>
    <div class="ci">${D.CONTROINDICAZIONI.relative.map((c) => `<div class="cbox wr"><b>${esc(c.t)}</b><p>${esc(c.d)}</p></div>`).join("")}</div></section>`;

  /* problemi */
  const byId = Object.fromEntries(D.MUSCOLI.map((m) => [m.id, m]));
  body += `<section class="pb">${H("problemi", "Problemi frequenti del ciclista", "Sul campo")}
    <p class="lead">Il massaggiatore non fa diagnosi: osserva, tratta i tessuti e riferisce a medico, fisioterapista o biomeccanico.</p>
    ${D.PROBLEMI.map((p) => `<article class="m"><header><h3>${esc(p.nome)}</h3></header><dl>
      <dt>Segni</dt><dd>${esc(p.segni)}</dd><dt>Muscoli</dt><dd>${p.muscoli.map((id) => esc(byId[id].nome)).join(", ")}</dd>
      <dt class="bk">Bici</dt><dd>${esc(p.bike)}</dd><dt>Massaggio</dt><dd>${esc(p.massaggio)}</dd><dt class="wr">Invia</dt><dd class="wr">${esc(p.invia)}</dd></dl></article>`).join("")}</section>`;

  /* tabella riassuntiva */
  body += `<section class="pb">${H("tabella", "Tabella riassuntiva", "Ripasso veloce")}
    <table class="t sum"><thead><tr><th>Muscolo</th><th>Origine</th><th>Inserzione</th><th>Nervo</th></tr></thead><tbody>
    ${D.REGIONI.map((r) => `<tr class="rg"><td colspan="4">${esc(r.nome)}</td></tr>` + D.MUSCOLI.filter((m) => m.regione === r.id).map((m) => `<tr><td><b>${esc(m.nome)}</b></td><td class="co">${esc(m.o)}</td><td class="ci">${esc(m.i)}</td><td>${esc(nervi(m))} <span class="mono">${esc(m.radici)}</span></td></tr>`).join("")).join("")}
    </tbody></table></section>`;

  /* scheda atleta */
  const righe = (n) => Array.from({ length: n }, () => `<div class="ln"></div>`).join("");
  body += `<section class="pb">${H("scheda", "Scheda di valutazione dell'atleta", "Da fotocopiare")}
    <div class="sheet">
      <div class="f3"><div><small>Atleta</small>${righe(1)}</div><div><small>Data</small>${righe(1)}</div><div><small>Tipo di seduta</small><p class="opts">☐ pre-gara ☐ post-gara ☐ post-allenamento ☐ recupero</p></div></div>
      <div class="f3"><div><small>Gara / tappa / allenamento</small>${righe(1)}</div><div><small>Km · dislivello · durata</small>${righe(1)}</div><div><small>Fatica percepita (0–10)</small><p class="opts">0 1 2 3 4 5 6 7 8 9 10</p></div></div>
      <div class="f2"><div><small>Cadute, traumi, abrasioni, ematomi</small>${righe(2)}</div><div><small>Crampi, dolori segnalati dall'atleta</small>${righe(2)}</div></div>
      <div class="f2 body"><figure>${S.mappaCorpo("ant")}<figcaption>Anteriore</figcaption></figure><figure>${S.mappaCorpo("post")}<figcaption>Posteriore</figcaption></figure>
        <div><small>Segna sulle figure: X = dolore, ○ = contrattura, / = zona da evitare</small><p class="mut sm">Controlli di sicurezza</p>
        <p class="opts">☐ nessun segno di TVP (polpacci non gonfi/caldi)<br>☐ cute integra nelle zone trattate<br>☐ nessuna febbre o malessere<br>☐ nessun dolore acuto puntiforme</p>
        <small>Zone trattate e tecniche</small>${righe(4)}<small>Durata · prodotto</small>${righe(1)}</div></div>
      <div class="f2"><div><small>Osservazioni sui tessuti (rigidità, punti tesi, asimmetrie dx/sx)</small>${righe(3)}</div><div><small>Da riferire a medico / fisioterapista / biomeccanico</small>${righe(3)}</div></div>
    </div></section>`;

  /* bibliografia */
  body += `<section class="pb">${H("biblio", "Bibliografia", "Per approfondire")}
    <ol class="bib">${D.BIBLIOGRAFIA.map((b) => `<li>${esc(b)}</li>`).join("")}</ol>
    <div class="box note"><h4>Avvertenza</h4><p>Questo manuale è materiale di studio per massaggiatori sportivi. Non sostituisce la formazione pratica, la valutazione medica o fisioterapica. In caso di dubbio su un sintomo, non massaggiare e chiedi al medico della squadra.</p></div></section>`;

  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>Anatomia dell'arto inferiore — Runner Progression</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,500..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<style>
:root{--ink:#13222A;--muted:#566871;--line:#CBD6DA;--soft:#F1F5F5;--accent:#C8460F;--ori:#0B7285;--ori-bg:#E3F3F6;--ins:#B5173E;--ins-bg:#FBE7EC;--warn:#9A4A00;--warn-bg:#FFF1DE;--danger:#B42318;--danger-bg:#FDE8E6;
--bone:#E7E0D2;--reg:#F3C9BC;--reg-h:#EBA08B;--reg-line:#fff;--c0:#C8460F;--c1:#0B7285;--c2:#6D3FC9;--c3:#17803D;--c4:#A76300;--c5:#B5173E;--c6:#1E55C8;--c7:#5B6B75;
--fd:"Archivo","Arial Narrow",sans-serif;--fb:"Inter",system-ui,sans-serif;--fm:"JetBrains Mono",monospace}
@page{size:A4;margin:16mm 14mm 16mm 14mm}
*{box-sizing:border-box}
body{margin:0;font-family:var(--fb);font-size:9.4pt;line-height:1.45;color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,h4{font-family:var(--fd);font-stretch:85%;margin:0;line-height:1.15}
p{margin:0 0 4pt}
.pb{break-before:page}
.mono{font-family:var(--fm);font-size:8pt}
.mut{color:var(--muted)} .sm{font-size:8.2pt}
h1.sec{font-size:24pt;font-weight:800;margin-bottom:10pt;padding-bottom:6pt;border-bottom:2.5pt solid var(--ink)}
h1.sec .eb{display:block;font-family:var(--fb);font-size:8pt;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:3pt}
.h2{font-size:14pt;margin:12pt 0 6pt}
.h2.dg{color:var(--danger)} .wrh{color:var(--warn)}
.lead{font-size:10.5pt;max-width:165mm;margin-bottom:10pt}
.co{color:var(--ori)} .ci{color:var(--ins)}
span.co,span.ci{font-weight:700}
/* cover */
@page cover{margin:0}
.cover{page:cover;height:296mm;width:210mm;display:flex;flex-direction:column;justify-content:space-between;background:var(--ink);color:#EEF3F4;padding:18mm 16mm;overflow:hidden}
.cv-top{font-size:9pt;letter-spacing:.2em;font-weight:700;color:#FF8A57}
.cv-main h1{font-size:44pt;font-weight:800;line-height:1.02;font-stretch:80%}
.cv-sub{font-size:12pt;max-width:140mm;margin-top:12pt;color:#C9D6DA}
.cv-wheel{width:105mm;margin-top:14mm;--line:#2D4048;--muted:#9FB1B8;--ink:#EEF3F4;--accent:#FF8A57;--ori:#4CC6DB;--surface:#13222A}
.cv-foot{display:flex;justify-content:space-between;font-size:9pt;color:#9FB1B8;border-top:1px solid #2D4048;padding-top:8pt}
/* toc */
ol.toc{list-style:none;padding:0;margin:0;counter-reset:t;font-size:11pt}
ol.toc li{display:flex;align-items:baseline;gap:6pt;padding:5pt 0;border-bottom:1px solid var(--line);counter-increment:t}
ol.toc li::before{content:counter(t,decimal-leading-zero);font-family:var(--fm);font-size:8.5pt;color:var(--accent);width:18pt}
ol.toc i{flex:1} ol.toc b{font-family:var(--fm);font-weight:500}
/* boxes */
.two{display:grid;grid-template-columns:1fr 1fr;gap:10pt}
.three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8pt;margin-top:10pt}
.box{background:var(--soft);border-radius:5pt;padding:9pt 10pt;break-inside:avoid}
.box h4{font-size:11pt;margin-bottom:4pt}
.box ul{margin:0;padding-left:12pt}
.box.note{margin-top:10pt;border-left:3pt solid var(--accent)}
dl.abbr{display:grid;grid-template-columns:auto 1fr;gap:2pt 8pt;margin:0}
dl.abbr dt{font-family:var(--fm);font-size:8pt;font-weight:500} dl.abbr dd{margin:0}
/* muscle card */
article.m{border:1px solid var(--line);border-radius:5pt;padding:8pt 10pt;margin-bottom:8pt;break-inside:avoid}
article.m header{display:flex;align-items:baseline;gap:8pt;flex-wrap:wrap;margin-bottom:6pt}
article.m h3{font-size:14pt;font-weight:800}
article.m .lat{font-style:italic;color:var(--muted)}
article.m .tipo{margin-left:auto;font-size:7.8pt;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.oi{display:grid;grid-template-columns:1fr 1fr;gap:6pt;margin-bottom:6pt}
.oi > div{border-radius:4pt;padding:6pt 8pt}
.oi .o{background:var(--ori-bg);border-left:3pt solid var(--ori)} .oi .i{background:var(--ins-bg);border-left:3pt solid var(--ins)}
.oi b{font-family:var(--fm);font-size:7.5pt;font-weight:500;letter-spacing:.08em}
.oi .o b{color:var(--ori)} .oi .i b{color:var(--ins)}
.oi p{margin:2pt 0 0} .oi p.s{font-weight:700}
article.m dl{display:grid;grid-template-columns:22mm 1fr;gap:3pt 8pt;margin:0}
article.m dt{font-size:7.5pt;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700;padding-top:1.5pt}
article.m dd{margin:0}
dt.bk{color:var(--accent)!important} dt.wr{color:var(--warn)!important} dd.wr{background:var(--warn-bg);padding:2pt 5pt;border-radius:3pt}
/* tables */
table.t{width:100%;border-collapse:collapse;font-size:8.6pt}
table.t th{text-align:left;font-size:7.4pt;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);border-bottom:1.5pt solid var(--ink);padding:4pt 5pt}
table.t td{vertical-align:top;padding:4pt 5pt;border-bottom:1px solid var(--line)}
table.t tr{break-inside:avoid}
table.sum tr.rg td{background:var(--soft);font-family:var(--fd);font-stretch:85%;font-weight:700;font-size:10pt;color:var(--accent);padding-top:6pt}
thead{display:table-header-group}
/* maps */
.maps{display:grid;grid-template-columns:42mm 42mm 1fr;gap:10pt;align-items:start}
.maps figure,.body figure{margin:0;text-align:center}
figcaption{font-family:var(--fd);font-weight:700;font-size:10pt;margin-top:3pt}
svg.mappa{width:100%;height:auto}
svg.mappa .osso{fill:var(--bone)} svg.mappa .reg{fill:var(--reg);stroke:var(--reg-line);stroke-width:2.5;stroke-linejoin:round}
svg.mappa .reg.prof{fill:var(--reg-h);stroke:var(--ink);stroke-dasharray:4 3;stroke-width:1.2;fill-opacity:.55}
svg.mappa .rischio{fill:var(--danger-bg);stroke:var(--danger);stroke-width:1.5;stroke-dasharray:3 2}
svg.mappa .lbl{font:600 11px var(--fm);fill:var(--muted)} svg.mappa .lbl.dim{font-size:9px}
.reglist{display:flex;flex-direction:column;gap:5pt;font-size:8.6pt}
.reglist b{display:block;font-family:var(--fd);font-stretch:85%;font-size:10pt}
/* wheel */
.ped{display:grid;grid-template-columns:80mm 1fr;gap:10pt;align-items:center}
svg.ruota{width:100%;height:auto}
svg.ruota .traccia{fill:none;stroke:var(--line);stroke-width:9;opacity:.5}
svg.ruota .arco{fill:none;stroke-width:9;stroke-linecap:round}
svg.ruota .c0{stroke:var(--c0)} svg.ruota .c1{stroke:var(--c1)} svg.ruota .c2{stroke:var(--c2)} svg.ruota .c3{stroke:var(--c3)}
svg.ruota .c4{stroke:var(--c4)} svg.ruota .c5{stroke:var(--c5)} svg.ruota .c6{stroke:var(--c6)} svg.ruota .c7{stroke:var(--c7)}
svg.ruota .fase-spinta{fill:none;stroke:var(--accent);stroke-width:3;opacity:.6} svg.ruota .fase-risalita{fill:none;stroke:var(--ori);stroke-width:3;opacity:.6;stroke-dasharray:6 5}
svg.ruota .tick{stroke:var(--muted);stroke-width:1;stroke-dasharray:2 4}
svg.ruota .wl{font:500 12px var(--fm);fill:var(--muted)} svg.ruota .wl.fase{font:700 13px var(--fb);letter-spacing:.12em;fill:var(--ink)}
svg.ruota .perno{fill:var(--ink)}
.sw{display:inline-block;width:9pt;height:9pt;border-radius:2pt}
.sw.c0{background:var(--c0)}.sw.c1{background:var(--c1)}.sw.c2{background:var(--c2)}.sw.c3{background:var(--c3)}.sw.c4{background:var(--c4)}.sw.c5{background:var(--c5)}.sw.c6{background:var(--c6)}.sw.c7{background:var(--c7)}
/* protocols */
article.proto{border-top:2pt solid var(--ink);padding-top:6pt;margin-bottom:12pt;break-inside:avoid}
article.proto h3{font-size:15pt;margin-bottom:6pt}
article.proto h4{font-size:10.5pt;margin:4pt 0}
article.proto ol,article.proto ul{margin:0;padding-left:14pt}
.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:6pt;margin-bottom:6pt}
.facts div{background:var(--soft);border-radius:4pt;padding:5pt 6pt;font-size:8.6pt}
.facts small{display:block;font-size:7pt;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700}
/* safety */
.ci{display:grid;grid-template-columns:1fr 1fr;gap:6pt}
.cbox{border-radius:4pt;padding:6pt 8pt;break-inside:avoid}
.cbox.dg{background:var(--danger-bg);border-left:3pt solid var(--danger)} .cbox.wr{background:var(--warn-bg);border-left:3pt solid var(--warn)}
.cbox b{display:block;margin-bottom:2pt}
/* sheet */
.sheet{display:flex;flex-direction:column;gap:10pt}
.f3{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:10pt} .f2{display:grid;grid-template-columns:1fr 1fr;gap:10pt}
.f2.body{grid-template-columns:36mm 36mm 1fr}
.sheet small{display:block;font-size:7.4pt;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700;margin-top:4pt}
.ln{border-bottom:1px solid var(--muted);height:16pt}
.opts{font-size:8.6pt;margin-top:3pt;line-height:1.7}
ol.bib{padding-left:14pt} ol.bib li{margin-bottom:5pt}
</style></head><body>${body}</body></html>`;
}

async function pdf() {
  let chromium;
  try { ({ chromium } = require("playwright")); } catch (e) { console.log("Playwright non disponibile: salto il PDF"); return; }
  const out = path.join(root, "Anatomia-arto-inferiore-massaggio-ciclismo.pdf");
  const tmp = path.join(root, "dist/print.html");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const render = async (toc) => {
    fs.writeFileSync(tmp, printHtml(toc));
    await page.goto("file://" + tmp, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: out, format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-family:Inter,Arial,sans-serif;font-size:7pt;color:#7a8a92;padding:0 14mm;display:flex;justify-content:space-between"><span>Runner Progression · Anatomia dell'arto inferiore per il massaggio sportivo</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`
    });
  };
  await render(null);
  // seconda passata: cerca in che pagina compare ogni titolo di sezione e riempie l'indice
  const n = +execFileSync("pdfinfo", [out]).toString().match(/Pages:\s+(\d+)/)[1];
  const titles = {};
  const sezioni = { leggere: "Come usare questo manuale", mappa: "Mappa delle regioni", repere: "Punti di repere ossei", tendini: "Tendini e fasce", pedalata: "Chi lavora durante la pedalata", tecniche: "Tecniche di massaggio", protocolli: "Protocolli: pre-gara", sicurezza: "Sicurezza: zone a rischio", problemi: "Problemi frequenti del ciclista", tabella: "Tabella riassuntiva", scheda: "Scheda di valutazione", biblio: "Bibliografia" };
  D.REGIONI.forEach((r, i) => (sezioni["r-" + r.id] = `Regione ${i + 1} di ${D.REGIONI.length} ·`)); // intestazione univoca della sezione
  const flat = (s) => s.replace(/\s+/g, " ").replace(/[’']/g, "'").toLowerCase(); // gli eyebrow sono in maiuscolo via CSS
  for (let p = 3; p <= n; p++) {
    const txt = flat(execFileSync("pdftotext", ["-f", String(p), "-l", String(p), "-layout", out, "-"]).toString());
    for (const [k, t] of Object.entries(sezioni)) {
      if (titles[k]) continue;
      // il titolo di sezione è in cima alla pagina, dopo l'eyebrow
      const head = txt.slice(0, 400);
      if (head.includes(flat(t))) titles[k] = p;
    }
  }
  const missing = Object.keys(sezioni).filter((k) => !titles[k]);
  if (missing.length) console.warn("! sezioni non trovate per l'indice:", missing.join(", "));
  await render(titles);
  await browser.close();
  console.log("✓ PDF", out.replace(root + "/", ""), `${n} pagine`);
}
pdf().catch((e) => { console.error(e); process.exit(1); });
