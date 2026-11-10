/* RP Studio — montaggio video IA nel browser.
 * Tutto gira in locale: anteprima su <canvas>, audio con Web Audio,
 * trascrizione con Whisper (transformers.js) in un Web Worker,
 * export con MediaRecorder. */
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';
  const FALLBACK_MODEL = 'Xenova/whisper-base';

  /* ---------------------------------------------------------------- dati */

  const FONTS = [
    { name: 'Montserrat', w: 900 }, { name: 'Poppins', w: 800 }, { name: 'Bebas Neue', w: 400 },
    { name: 'Anton', w: 400 }, { name: 'Oswald', w: 700 }, { name: 'Roboto', w: 900 },
    { name: 'Inter', w: 800 }, { name: 'Luckiest Guy', w: 400 }, { name: 'Bangers', w: 400 },
    { name: 'Archivo Black', w: 400 }, { name: 'Lilita One', w: 400 }, { name: 'Rubik', w: 800 },
    { name: 'Barlow Condensed', w: 800 }, { name: 'Permanent Marker', w: 400 },
  ];

  const PRESETS = [
    { id: 'hormozi', label: 'Hormozi', sub: 'giallo + pop', font: 'Montserrat', weight: 900,
      s: { subColor: '#ffffff', subHi: '#ffe100', subStroke: '#000000', subStrokeW: 12, subMode: 'highlight', subAnim: 'pop', subSize: 8, subWords: 3, subUpper: true, subNoPunct: true, subShadow: 50, subBg: 0, subRotate: false, subY: 70 } },
    { id: 'beast', label: 'Cartoon', sub: 'stile MrBeast', font: 'Luckiest Guy', weight: 400,
      s: { subColor: '#ffffff', subHi: '#3dff6a', subStroke: '#000000', subStrokeW: 14, subMode: 'highlight', subAnim: 'pop', subSize: 9, subWords: 2, subUpper: true, subNoPunct: true, subShadow: 60, subBg: 0, subRotate: true, subY: 68 } },
    { id: 'box', label: 'Box', sub: 'parola nel box', font: 'Montserrat', weight: 800,
      s: { subColor: '#ffffff', subHi: '#ffffff', subBox: '#7c3aed', subStroke: '#000000', subStrokeW: 0, subMode: 'box', subAnim: 'pop', subSize: 7.5, subWords: 3, subUpper: true, subNoPunct: true, subShadow: 35, subBg: 0, subRotate: false, subY: 70 } },
    { id: 'karaoke', label: 'Karaoke', sub: 'si colora parlando', font: 'Anton', weight: 400,
      s: { subColor: '#ffffff', subHi: '#00e5ff', subStroke: '#000000', subStrokeW: 9, subMode: 'karaoke', subAnim: 'fade', subSize: 8, subWords: 4, subUpper: true, subNoPunct: true, subShadow: 40, subBg: 0, subRotate: false, subY: 72 } },
    { id: 'single', label: 'Una parola', sub: 'ritmo veloce', font: 'Archivo Black', weight: 400,
      s: { subColor: '#ffffff', subHi: '#ffe100', subStroke: '#000000', subStrokeW: 12, subMode: 'word', subAnim: 'pop', subSize: 11, subWords: 1, subUpper: true, subNoPunct: true, subShadow: 50, subBg: 0, subRotate: false, subY: 60 } },
    { id: 'youtube', label: 'Classico', sub: 'YouTube orizzontale', font: 'Roboto', weight: 700,
      s: { subColor: '#ffffff', subHi: '#ffffff', subStroke: '#000000', subStrokeW: 0, subMode: 'none', subAnim: 'none', subSize: 4.5, subWords: 8, subUpper: false, subNoPunct: false, subShadow: 0, subBg: 70, subRotate: false, subY: 86 } },
    { id: 'minimal', label: 'Minimal', sub: 'pulito, elegante', font: 'Poppins', weight: 600,
      s: { subColor: '#ffffff', subHi: '#ffd23f', subStroke: '#000000', subStrokeW: 0, subMode: 'none', subAnim: 'fade', subSize: 5.5, subWords: 5, subUpper: false, subNoPunct: true, subShadow: 80, subBg: 0, subRotate: false, subY: 75 } },
    { id: 'rp', label: 'Runner Progression', sub: 'brand arancio', font: 'Oswald', weight: 700,
      s: { subColor: '#ffffff', subHi: '#ff6b00', subStroke: '#000000', subStrokeW: 10, subMode: 'highlight', subAnim: 'pop', subSize: 8.5, subWords: 3, subUpper: true, subNoPunct: true, subShadow: 50, subBg: 0, subRotate: false, subY: 70 } },
  ];

  const GRADES = [
    { label: 'Naturale', v: { bri: 100, con: 100, sat: 100, warm: 0, hue: 0, vig: 0 } },
    { label: 'Cinematico', v: { bri: 95, con: 118, sat: 85, warm: 10, hue: -4, vig: 45 } },
    { label: 'Sport', v: { bri: 102, con: 125, sat: 125, warm: 0, hue: 0, vig: 30 } },
    { label: 'Caldo', v: { bri: 104, con: 105, sat: 112, warm: 24, hue: 0, vig: 15 } },
    { label: 'Freddo', v: { bri: 100, con: 110, sat: 90, warm: 0, hue: -12, vig: 15 } },
    { label: 'Vivido', v: { bri: 105, con: 115, sat: 145, warm: 0, hue: 0, vig: 0 } },
    { label: 'Vintage', v: { bri: 98, con: 90, sat: 80, warm: 35, hue: 0, vig: 50 } },
    { label: 'Bianco e nero', v: { bri: 100, con: 125, sat: 0, warm: 0, hue: 0, vig: 35 } },
  ];

  const STOPWORDS = new Set(('il lo la i gli le un uno una di a da in con su per tra fra e ed o ma se che chi cui non ne ci vi si mi ti è sono ho hai ha abbiamo avete hanno era essere fare questo questa questi quello quella del dello della dei degli delle al allo alla ai agli alle dal dalla dai nel nello nella nei negli nelle sul sulla sui come anche più molto poi già quando dove perché però quindi allora così tutto tutti cosa sempre ancora proprio solo the and of to is it that you for on with this are was be have at or but not').split(' '));

  // Impostazioni collegate agli input (id → formattazione dell'output)
  const BIND = {
    fit: null, zoom: (v) => v + '%', panX: null, panY: null, punchZoom: null,
    silDb: (v) => v + ' dB', silMin: (v) => (v / 100).toFixed(2) + ' s', silPad: (v) => (v / 100).toFixed(2) + ' s',
    lang: null, model: null,
    subColor: null, subHi: null, subStroke: null, subBox: null, subMode: null, subAnim: null,
    subSize: (v) => v + '%', subWords: null, subY: (v) => v + '%', subStrokeW: null, subShadow: null,
    subBg: (v) => v + '%', subUpper: null, subNoPunct: null, subRotate: null,
    bri: null, con: null, sat: null, warm: null, hue: (v) => v + '°', vig: null, speed: (v) => (v / 100).toFixed(2) + '×',
    hookText: null, hookDur: null, hookFont: null, hookColor: null, hookBg: null, hookY: (v) => v + '%',
    handle: null, handlePos: null, logoSize: (v) => v + '%', logoOp: (v) => v + '%',
    progBar: null, progColor: null, progPos: null, ctaText: null, ctaDur: null,
    volOrig: (v) => v + '%', volMusic: (v) => v + '%', duck: null, fade: (v) => (v / 10).toFixed(1) + ' s',
    quality: null, fps: null, bitrate: null,
  };
  const STORAGE_KEY = 'rp-studio-settings-v1';

  /* ---------------------------------------------------------------- stato */

  const S = { subFont: 'Montserrat', subWeight: 900, preset: 'hormozi' }; // impostazioni
  const st = {
    ratio: '9:16',
    sources: [],   // { id, name, url, video, duration, words, pcm, thumb, audioNode }
    segs: [],      // { id, src, in, out }
    selected: null,
    t: 0, cur: 0,
    playing: false, switching: false,
    exporting: false, exportEnd: null,
    music: null, musicUrl: null, logo: null,
    needsDraw: true,
    cues: null,
  };
  let uid = 1;

  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');
  const bgCanvas = document.createElement('canvas');
  const bgCtx = bgCanvas.getContext('2d');

  /* ------------------------------------------------------------ utilità */

  function toast(msg, ms = 2800) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), ms);
  }
  function fmtTime(s, srt) {
    s = Math.max(0, s || 0);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (srt) {
      const ms = Math.round((sec - Math.floor(sec)) * 1000);
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(sec)).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
    }
    return `${String(m + h * 60).padStart(2, '0')}:${sec.toFixed(1).padStart(4, '0')}`;
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e) { /* storage non disponibile */ }
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { return null; }
  }
  function redraw() { st.needsDraw = true; }
  function dirtyCues() { st.cues = null; redraw(); }
  const speed = () => (S.speed || 100) / 100;
  const srcOf = (seg) => st.sources.find((s) => s.id === seg.src);
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);
    else {
      c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    }
  }
  function fontLoad(name, w) {
    if (!document.fonts) return Promise.resolve();
    return document.fonts.load(`${w} 64px "${name}"`).then(redraw).catch(() => {});
  }

  /* ----------------------------------------------------------- timeline */

  function segDur(seg) { return Math.max(0, seg.out - seg.in) / speed(); }
  function starts() {
    const out = []; let acc = 0;
    for (const s of st.segs) { out.push(acc); acc += segDur(s); }
    return out;
  }
  function total() { return st.segs.reduce((a, s) => a + segDur(s), 0); }
  function locate(t) {
    const ss = starts();
    for (let i = 0; i < st.segs.length; i++) {
      const d = segDur(st.segs[i]);
      if (t < ss[i] + d || i === st.segs.length - 1) {
        const seg = st.segs[i];
        const local = clamp(t - ss[i], 0, d);
        return { i, seg, start: ss[i], srcTime: seg.in + local * speed() };
      }
    }
    return null;
  }
  function srcToTimeline(srcId, time) {
    const ss = starts();
    for (let i = 0; i < st.segs.length; i++) {
      const s = st.segs[i];
      if (s.src === srcId && time >= s.in && time < s.out) return ss[i] + (time - s.in) / speed();
    }
    return null;
  }

  /* --------------------------------------------------------------- media */

  function addVideos(files) {
    const list = [...files].filter((f) => f.type.startsWith('video/') || /\.(mp4|mov|webm|mkv|m4v)$/i.test(f.name));
    if (!list.length) { toast('Seleziona un file video'); return; }
    stopPlayback();
    list.forEach(addVideo);
  }

  function addVideo(file) {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.src = url; v.preload = 'auto'; v.playsInline = true; v.crossOrigin = 'anonymous';
    const src = { id: uid++, name: file.name, file, url, video: v, duration: 0, words: [], pcm: null, thumb: null, audioNode: null };
    v.addEventListener('loadedmetadata', () => {
      src.duration = v.duration;
      st.sources.push(src);
      st.segs.push({ id: uid++, src: src.id, in: 0, out: v.duration });
      connectSourceAudio(src);
      if (st.sources.length === 1 && v.videoWidth > v.videoHeight && st.ratio === '9:16') {
        toast('Video orizzontale: uso lo sfondo sfocato per il 9:16. Puoi passare al 16:9 in alto.', 4000);
      }
      $('emptyStage').hidden = true;
      dirtyCues(); renderTimeline(); renderTranscript();
      makeThumb(src);
      if (st.segs.length === 1) setTime(0);
    }, { once: true });
    v.addEventListener('error', () => toast(`Impossibile leggere ${file.name}: formato non supportato dal browser`), { once: true });
    v.addEventListener('seeked', redraw);
    v.addEventListener('loadeddata', redraw);
  }

  function makeThumb(src) {
    // miniatura da un video separato per non disturbare l'anteprima
    const v = document.createElement('video');
    v.src = src.url; v.muted = true; v.preload = 'auto';
    v.addEventListener('loadeddata', () => { v.currentTime = Math.min(1, src.duration / 2); }, { once: true });
    v.addEventListener('seeked', () => {
      const c = document.createElement('canvas');
      c.height = 52; c.width = Math.round(52 * (v.videoWidth / v.videoHeight || 1.77));
      c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      try { src.thumb = c.toDataURL('image/jpeg', 0.7); } catch (e) { /* ignore */ }
      v.removeAttribute('src'); v.load();
      renderTimeline();
    }, { once: true });
  }

  /* --------------------------------------------------------------- audio */

  let actx = null, voiceGain, musicGain, outGain, dest, analyser, anaBuf, musicNode = null;
  let speakHold = 0;

  function ensureAudio() {
    if (actx) { if (actx.state === 'suspended') actx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    actx = new AC();
    voiceGain = actx.createGain(); musicGain = actx.createGain(); outGain = actx.createGain();
    analyser = actx.createAnalyser(); analyser.fftSize = 1024; anaBuf = new Float32Array(analyser.fftSize);
    dest = actx.createMediaStreamDestination();
    voiceGain.connect(outGain); voiceGain.connect(analyser);
    musicGain.connect(outGain);
    outGain.connect(actx.destination); outGain.connect(dest);
    st.sources.forEach(connectSourceAudio);
    if (st.music) connectMusic();
  }
  function connectSourceAudio(src) {
    if (!actx || src.audioNode) return;
    try { src.audioNode = actx.createMediaElementSource(src.video); src.audioNode.connect(voiceGain); } catch (e) { console.warn(e); }
  }
  function connectMusic() {
    if (!actx || !st.music || st.music._node) return;
    try { st.music._node = actx.createMediaElementSource(st.music); st.music._node.connect(musicGain); } catch (e) { console.warn(e); }
  }
  function updateGains(dt) {
    if (!actx) return;
    const now = actx.currentTime;
    voiceGain.gain.setTargetAtTime((S.volOrig ?? 100) / 100, now, 0.03);
    if (!st.music) return;
    // rilevamento voce per il ducking
    analyser.getFloatTimeDomainData(anaBuf);
    let sum = 0; for (let i = 0; i < anaBuf.length; i++) sum += anaBuf[i] * anaBuf[i];
    const rms = Math.sqrt(sum / anaBuf.length);
    if (rms > 0.02) speakHold = 0.35; else speakHold = Math.max(0, speakHold - dt);
    const T = total(), f = (S.fade ?? 15) / 10;
    let env = 1;
    if (f > 0) env = Math.min(1, st.t / f, Math.max(0, (T - st.t) / f));
    const duck = S.duck && speakHold > 0 ? 0.35 : 1;
    musicGain.gain.setTargetAtTime(((S.volMusic ?? 25) / 100) * env * duck, now, 0.12);
  }
  function syncMusic(play) {
    const m = st.music; if (!m) return;
    if (!play) { m.pause(); return; }
    if (m.duration) {
      const target = st.t % m.duration;
      if (Math.abs(m.currentTime - target) > 0.25) m.currentTime = target;
    }
    m.play().catch(() => {});
  }

  /* ------------------------------------------------------------ playback */

  function seekVideo(v, time) {
    return new Promise((res) => {
      if (Math.abs(v.currentTime - time) < 0.01 && v.readyState >= 2) return res();
      const done = () => { clearTimeout(to); v.removeEventListener('seeked', done); res(); };
      const to = setTimeout(done, 4000);
      v.addEventListener('seeked', done);
      v.currentTime = time;
    });
  }
  function pauseAll(except) { st.sources.forEach((s) => { if (s.video !== except) s.video.pause(); }); }

  async function startPlayback() {
    if (!st.segs.length || st.playing) return;
    ensureAudio();
    if (st.t >= total() - 0.05) st.t = 0;
    const L = locate(st.t);
    st.cur = L.i;
    const v = srcOf(L.seg).video;
    pauseAll(v);
    st.switching = true;
    await seekVideo(v, L.srcTime);
    st.switching = false;
    st.playing = true;
    playCurrent();
    $('btnPlay').textContent = '❚❚';
  }
  function playCurrent() {
    const seg = st.segs[st.cur]; const v = srcOf(seg).video;
    v.playbackRate = speed();
    v.play().catch((e) => console.warn(e));
    syncMusic(true);
  }
  function stopPlayback() {
    st.playing = false;
    pauseAll(null);
    syncMusic(false);
    $('btnPlay').textContent = '▶';
  }
  async function advance() {
    st.switching = true;
    const prev = st.segs[st.cur];
    const prevV = srcOf(prev).video;
    const next = st.cur + 1;
    if (next >= st.segs.length) {
      prevV.pause();
      st.t = total();
      st.switching = false;
      stopPlayback();
      redraw();
      if (st.exportEnd) st.exportEnd();
      return;
    }
    const seg = st.segs[next];
    const v = srcOf(seg).video;
    const contiguous = v === prevV && Math.abs(v.currentTime - seg.in) < 0.08;
    if (!contiguous) {
      prevV.pause();
      if (st.rec && st.rec.state === 'recording') st.rec.pause();
      if (st.music) st.music.pause();
      await seekVideo(v, seg.in);
    }
    st.cur = next;
    st.t = starts()[next];
    draw();
    if (!st.playing) { st.switching = false; return; } // fermato durante il cambio
    if (st.rec && st.rec.state === 'paused') st.rec.resume();
    if (!contiguous) playCurrent();
    st.switching = false;
  }
  function setTime(t) {
    if (!st.segs.length) return;
    st.t = clamp(t, 0, total());
    const L = locate(st.t);
    st.cur = L.i;
    const v = srcOf(L.seg).video;
    if (st.playing) {
      stopPlayback();
      seekVideo(v, L.srcTime).then(startPlayback);
    } else {
      pauseAll(v);
      if (Math.abs(v.currentTime - L.srcTime) > 0.02) v.currentTime = L.srcTime;
    }
    redraw();
  }

  let lastFrame = performance.now();
  function tick(now) {
    const dt = Math.min(0.1, (now - lastFrame) / 1000); lastFrame = now;
    if (st.playing && !st.switching && st.segs.length) {
      const seg = st.segs[st.cur];
      const v = srcOf(seg).video;
      st.t = starts()[st.cur] + (v.currentTime - seg.in) / speed();
      if (v.currentTime >= seg.out - 0.025 || v.ended) advance();
      st.needsDraw = true;
    }
    try {
      if (st.playing) updateGains(dt);
      if (st.needsDraw) { st.needsDraw = false; draw(); updateUI(); }
    } catch (e) { console.error(e); }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------- sottotitoli */

  function cleanWord(text) {
    let w = (text || '').trim();
    if (S.subNoPunct) w = w.replace(/[.,!?;:"“”«»…()\[\]]/g, '');
    if (S.subUpper) w = w.toLocaleUpperCase('it-IT');
    return w;
  }

  function buildCues() {
    if (st.cues) return st.cues;
    const words = [];
    const ss = starts(), sp = speed();
    st.segs.forEach((seg, i) => {
      const src = srcOf(seg); if (!src) return;
      src.words.forEach((w, idx) => {
        if (w.hidden || !w.text.trim()) return;
        const mid = (w.start + w.end) / 2;
        if (mid < seg.in || mid >= seg.out) return;
        words.push({
          raw: w.text, text: cleanWord(w.text), emph: w.emph, src: src.id, idx,
          start: ss[i] + (Math.max(w.start, seg.in) - seg.in) / sp,
          end: ss[i] + (Math.min(w.end, seg.out) - seg.in) / sp,
        });
      });
    });
    const maxW = S.subMode === 'word' ? 1 : Number(S.subWords || 3);
    const cues = []; let cur = null;
    words.forEach((w, k) => {
      if (!w.text) return;
      const prev = words[k - 1];
      const brk = !cur || cur.words.length >= maxW || (prev && w.start - prev.end > 0.7) ||
        (prev && /[.!?]$/.test(prev.raw.trim())) || (w.end - cur.start > 3.2);
      if (brk) { cur = { words: [], start: w.start, end: w.end, seed: cues.length }; cues.push(cur); }
      cur.words.push(w); cur.end = w.end;
    });
    // riduce lo sfarfallio fra frasi ravvicinate
    for (let i = 0; i < cues.length - 1; i++) {
      const gap = cues[i + 1].start - cues[i].end;
      if (gap > 0 && gap < 0.35) cues[i].end = cues[i + 1].start;
    }
    st.cues = cues;
    return cues;
  }
  function activeCue(t) {
    const cues = buildCues();
    let lo = 0, hi = cues.length - 1;
    while (lo <= hi) {
      const m = (lo + hi) >> 1;
      if (cues[m].end <= t) lo = m + 1; else if (cues[m].start > t) hi = m - 1; else return cues[m];
    }
    return null;
  }

  /* -------------------------------------------------------------- render */

  function filterString() {
    const f = [];
    if (S.bri != 100) f.push(`brightness(${S.bri}%)`);
    if (S.con != 100) f.push(`contrast(${S.con}%)`);
    if (S.sat != 100) f.push(`saturate(${S.sat}%)`);
    if (+S.warm) f.push(`sepia(${S.warm}%)`);
    if (+S.hue) f.push(`hue-rotate(${S.hue}deg)`);
    return f.length ? f.join(' ') : 'none';
  }

  function drawVideo(v, W, H, segIndex) {
    const vw = v.videoWidth, vh = v.videoHeight;
    if (!vw || v.readyState < 2) return;
    const zoom = (S.zoom || 100) / 100 * (S.punchZoom && segIndex % 2 === 1 ? 1.12 : 1);
    const filt = filterString();
    const fit = S.fit || 'blur';
    if (fit === 'blur') {
      // sfondo sfocato economico: disegno piccolo + ingrandimento
      const bw = 48, bh = Math.round(48 * H / W);
      if (bgCanvas.width !== bw || bgCanvas.height !== bh) { bgCanvas.width = bw; bgCanvas.height = bh; }
      const cs = Math.max(bw / vw, bh / vh);
      bgCtx.filter = 'blur(2px)';
      bgCtx.drawImage(v, (bw - vw * cs) / 2, (bh - vh * cs) / 2, vw * cs, vh * cs);
      ctx.save();
      ctx.filter = filt === 'none' ? 'brightness(60%)' : filt + ' brightness(60%)';
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bgCanvas, -W * 0.05, -H * 0.05, W * 1.1, H * 1.1);
      ctx.restore();
    }
    const base = fit === 'cover' ? Math.max(W / vw, H / vh) : Math.min(W / vw, H / vh);
    const sc = base * zoom;
    const dw = vw * sc, dh = vh * sc;
    const ox = Math.abs(dw - W) / 2 * (S.panX || 0) / 100;
    const oy = Math.abs(dh - H) / 2 * (S.panY || 0) / 100;
    ctx.save();
    ctx.filter = filt;
    ctx.drawImage(v, (W - dw) / 2 - ox, (H - dh) / 2 - oy, dw, dh);
    ctx.restore();
  }

  function easeOutBack(p) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }

  function wrap(c, text, maxW) {
    const words = text.split(/\s+/).filter(Boolean); const lines = []; let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (c.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawSubs(W, H, t) {
    const cue = activeCue(t);
    if (!cue) return;
    const base = Math.min(W, H);
    const fs = base * (S.subSize || 7) / 100;
    const font = (scale) => `${S.subWeight} ${fs * scale}px "${S.subFont}", Impact, sans-serif`;
    const maxW = W * 0.86;
    const lh = fs * 1.18;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.font = font(1);
    const space = ctx.measureText(' ').width;

    // impaginazione parole in righe
    const items = cue.words.map((w) => {
      const sc = w.emph ? 1.12 : 1;
      ctx.font = font(sc);
      return { w, sc, width: ctx.measureText(w.text).width };
    });
    const lines = []; let line = [], lw = 0;
    for (const it of items) {
      const add = (line.length ? space : 0) + it.width;
      if (line.length && lw + add > maxW) { lines.push({ items: line, width: lw }); line = []; lw = 0; }
      lw += (line.length ? space : 0) + it.width; line.push(it);
    }
    if (line.length) lines.push({ items: line, width: lw });

    // animazione d'entrata
    const p = clamp((t - cue.start) / 0.18, 0, 1);
    let scale = 1, alpha = 1, dy = 0;
    if (S.subAnim === 'pop') scale = 0.7 + 0.3 * easeOutBack(p);
    else if (S.subAnim === 'fade') alpha = p;
    else if (S.subAnim === 'slide') { alpha = p; dy = (1 - p) * fs * 0.6; }

    const cx = W / 2, cy = H * (S.subY || 70) / 100 + dy;
    ctx.translate(cx, cy);
    if (S.subRotate) ctx.rotate(((cue.seed * 9301 + 49297) % 233280 / 233280 - 0.5) * 0.09);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    const blockH = lines.length * lh;
    let y = -blockH / 2 + lh / 2;

    for (const ln of lines) {
      if (S.subBg > 0) {
        ctx.fillStyle = `rgba(0,0,0,${S.subBg / 100})`;
        roundRect(ctx, -ln.width / 2 - fs * 0.3, y - lh / 2, ln.width + fs * 0.6, lh, fs * 0.18);
        ctx.fill();
      }
      let x = -ln.width / 2;
      for (const it of ln.items) {
        const w = it.w;
        const active = t >= w.start && t < w.end + 0.02;
        const spoken = t >= w.start;
        let color = w.emph ? S.subHi : S.subColor;
        let wsc = it.sc;
        if (S.subMode === 'highlight' && active) { color = S.subHi; wsc *= 1 + 0.08 * clamp(1 - (t - w.start) / 0.25, 0, 1) + 0.04; }
        if (S.subMode === 'karaoke') color = spoken ? S.subHi : S.subColor;
        const wx = x + it.width / 2;
        ctx.save();
        ctx.translate(wx, y);
        ctx.scale(wsc / it.sc, wsc / it.sc);
        if (S.subMode === 'box' && active) {
          ctx.fillStyle = S.subBox;
          roundRect(ctx, -it.width / 2 - fs * 0.16, -fs * 0.62, it.width + fs * 0.32, fs * 1.18, fs * 0.2);
          ctx.fill();
        }
        ctx.font = font(it.sc);
        ctx.textAlign = 'center';
        ctx.lineJoin = 'round';
        if (S.subShadow > 0) {
          ctx.shadowColor = `rgba(0,0,0,${S.subShadow / 100})`;
          ctx.shadowBlur = fs * 0.18; ctx.shadowOffsetY = fs * 0.06;
        }
        if (S.subStrokeW > 0) {
          ctx.strokeStyle = S.subStroke;
          ctx.lineWidth = S.subStrokeW * fs / 60;
          ctx.strokeText(w.text, 0, 0);
          ctx.shadowColor = 'transparent';
        }
        ctx.fillStyle = color;
        ctx.fillText(w.text, 0, 0);
        ctx.restore();
        x += it.width + space;
      }
      y += lh;
    }
    ctx.restore();
  }

  function drawBanner(text, W, H, yPct, fontName, color, bg, p, fadeOut) {
    const base = Math.min(W, H);
    const fs = base * 0.06;
    ctx.save();
    ctx.font = `800 ${fs}px "${fontName}", sans-serif`;
    const lines = wrap(ctx, text, W * 0.78);
    const lh = fs * 1.22;
    const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + fs * 1.1;
    const bh = lines.length * lh + fs * 0.6;
    const s = 0.75 + 0.25 * easeOutBack(clamp(p, 0, 1));
    ctx.globalAlpha = clamp(fadeOut, 0, 1) * clamp(p * 2, 0, 1);
    ctx.translate(W / 2, H * yPct / 100);
    ctx.scale(s, s);
    ctx.rotate(-0.015);
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = fs * 0.4; ctx.shadowOffsetY = fs * 0.1;
    ctx.fillStyle = bg;
    roundRect(ctx, -bw / 2, -bh / 2, bw, bh, fs * 0.35);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((l, i) => ctx.fillText(l, 0, -bh / 2 + fs * 0.3 + lh * (i + 0.5)));
    ctx.restore();
  }

  function drawOverlays(W, H, t) {
    const base = Math.min(W, H), T = total();
    // vignettatura
    if (S.vig > 0) {
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) / 2);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${S.vig / 100 * 0.85})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    drawSubs(W, H, t);
    // hook iniziale
    const hd = +S.hookDur || 0;
    if (S.hookText && t < hd) drawBanner(S.hookText, W, H, S.hookY || 18, S.hookFont || 'Montserrat', S.hookColor, S.hookBg, t / 0.35, (hd - t) / 0.3);
    // call to action finale
    const cd = +S.ctaDur || 0;
    if (S.ctaText && T > 0 && t > T - cd) drawBanner(S.ctaText, W, H, 42, S.hookFont || 'Montserrat', '#111111', '#ffffff', (t - (T - cd)) / 0.35, (T - t) / 0.15 + 0.01);
    // firma + logo
    const m = base * 0.045;
    const pos = S.handlePos || 'tr';
    const top = pos[0] === 't', right = pos[1] === 'r';
    let hy = top ? m : H - m;
    if (S.progBar && ((S.progPos === 'top') === top)) hy += (top ? 1 : -1) * base * 0.02;
    if (S.handle) {
      ctx.save();
      const fs = base * 0.034;
      ctx.font = `700 ${fs}px Montserrat, sans-serif`;
      ctx.textAlign = right ? 'right' : 'left'; ctx.textBaseline = top ? 'top' : 'bottom';
      ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = fs * 0.4;
      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.fillText(S.handle, right ? W - m : m, hy);
      ctx.restore();
    }
    if (st.logo) {
      const lw = W * (S.logoSize || 14) / 100;
      const lh = lw * st.logo.naturalHeight / st.logo.naturalWidth;
      const lx = right ? m : W - m - lw; // lato opposto alla firma
      const ly = top ? hy : hy - lh;
      ctx.save(); ctx.globalAlpha = (S.logoOp || 85) / 100;
      ctx.drawImage(st.logo, lx, ly, lw, lh); ctx.restore();
    }
    // barra di avanzamento
    if (S.progBar && T > 0) {
      const bh = Math.max(4, base * 0.011);
      const y = S.progPos === 'top' ? 0 : H - bh;
      ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(0, y, W, bh);
      ctx.fillStyle = S.progColor; ctx.fillRect(0, y, W * clamp(t / T, 0, 1), bh);
    }
  }

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    if (!st.segs.length) return;
    const seg = st.segs[st.cur] || st.segs[0];
    const src = srcOf(seg);
    if (src) drawVideo(src.video, W, H, st.cur);
    drawOverlays(W, H, st.t);
  }

  /* ------------------------------------------------------------------ UI */

  function setCanvasRes(short) {
    const [a, b] = st.ratio.split(':').map(Number);
    let W, H;
    if (a >= b) { H = short; W = Math.round(short * a / b); } else { W = short; H = Math.round(short * b / a); }
    W -= W % 2; H -= H % 2;
    canvas.width = W; canvas.height = H;
    redraw();
  }
  const previewRes = () => setCanvasRes(Math.round(+S.quality === 720 ? 540 : 720));

  let lastNowEl = null;
  function updateUI() {
    const T = total();
    $('tc').textContent = `${fmtTime(st.t)} / ${fmtTime(T)}`;
    if (document.activeElement !== $('scrub')) $('scrub').value = T ? Math.round(st.t / T * 1000) : 0;
    // testina nella timeline
    const el = $('timeline').querySelector(`.clip[data-i="${st.cur}"]`);
    if (el && st.segs[st.cur]) {
      const d = segDur(st.segs[st.cur]) || 1;
      const local = st.t - starts()[st.cur];
      $('playhead').style.left = (el.offsetLeft + clamp(local / d, 0, 1) * el.offsetWidth - $('timeline').scrollLeft) + 'px';
    }
    // parola attuale nella trascrizione
    const cue = activeCue(st.t);
    let nowEl = null;
    if (cue) {
      const w = cue.words.find((x) => st.t >= x.start && st.t < x.end) || null;
      if (w) nowEl = document.querySelector(`.word[data-s="${w.src}"][data-i="${w.idx}"]`);
    }
    if (nowEl !== lastNowEl) {
      if (lastNowEl) lastNowEl.classList.remove('now');
      if (nowEl) {
        nowEl.classList.add('now');
        if (st.playing && document.activeElement?.classList?.contains('word') !== true) {
          const box = $('transcript');
          const top = nowEl.offsetTop - box.offsetTop;
          if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 30) box.scrollTop = top - 40;
        }
      }
      lastNowEl = nowEl;
    }
    if (st.exporting) {
      const p = T ? st.t / T : 0;
      $('exProgress').firstElementChild.style.width = (p * 100).toFixed(1) + '%';
      $('exStatus').textContent = `Esportazione in corso… ${Math.round(p * 100)}% (non cambiare scheda)`;
    }
  }

  function renderTimeline() {
    const tl = $('timeline');
    tl.querySelectorAll('.clip').forEach((n) => n.remove());
    const T = total();
    const avail = Math.max(200, tl.clientWidth - 12 - st.segs.length * 3);
    st.segs.forEach((seg, i) => {
      const src = srcOf(seg);
      const d = document.createElement('div');
      d.className = 'clip' + (seg.id === st.selected ? ' selected' : '');
      d.dataset.i = i;
      d.style.width = Math.max(24, segDur(seg) / (T || 1) * avail) + 'px';
      if (src && src.thumb) d.style.backgroundImage = `url(${src.thumb})`;
      d.title = `${src ? src.name : ''} · ${segDur(seg).toFixed(1)} s`;
      const lab = document.createElement('span');
      lab.textContent = segDur(seg).toFixed(1) + 's';
      d.appendChild(lab);
      tl.appendChild(d);
    });
    const sel = st.segs.find((s) => s.id === st.selected);
    $('clipEdit').hidden = !sel;
    $('tlInfo').textContent = st.segs.length
      ? `${st.segs.length} clip · ${fmtTime(T)}${sel ? '' : ' — clicca una clip per modificarla'}`
      : 'Carica uno o più video: verranno messi in sequenza.';
    if (sel) {
      $('clipIn').value = sel.in.toFixed(2); $('clipOut').value = sel.out.toFixed(2);
      $('clipIn').max = $('clipOut').max = srcOf(sel).duration.toFixed(2);
    }
    redraw();
  }

  function renderTranscript() {
    const box = $('transcript');
    box.innerHTML = '';
    lastNowEl = null;
    const used = st.sources.filter((s) => st.segs.some((g) => g.src === s.id) && s.words.length);
    if (!used.length) {
      box.innerHTML = '<p class="empty">Nessun sottotitolo. Genera con l\'IA o importa un file .srt.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    used.forEach((src) => {
      if (used.length > 1) {
        const h = document.createElement('div'); h.className = 'src-title'; h.textContent = src.name; frag.appendChild(h);
      }
      src.words.forEach((w, i) => {
        const el = document.createElement('span');
        el.className = 'word' + (w.emph ? ' emph' : '') + (w.hidden ? ' hidden' : '') + (srcToTimeline(src.id, (w.start + w.end) / 2) === null ? ' cut' : '');
        el.contentEditable = 'true';
        el.spellcheck = false;
        el.dataset.s = src.id; el.dataset.i = i;
        el.textContent = w.text;
        frag.appendChild(el);
        frag.appendChild(document.createTextNode(' '));
      });
    });
    box.appendChild(frag);
  }

  function wordFromEl(el) {
    const src = st.sources.find((s) => s.id === +el.dataset.s);
    return src ? { src, w: src.words[+el.dataset.i] } : null;
  }

  /* --------------------------------------------------------- trascrizione */

  async function decodePCM(src) {
    if (src.pcm) return src.pcm;
    const buf = await src.file.arrayBuffer();
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const oac = new OAC(1, 16000, 16000);
    const audio = await oac.decodeAudioData(buf);
    let pcm;
    if (audio.numberOfChannels > 1) {
      const a = audio.getChannelData(0), b = audio.getChannelData(1);
      pcm = new Float32Array(a.length);
      for (let i = 0; i < a.length; i++) pcm[i] = (a[i] + b[i]) / 2;
    } else pcm = audio.getChannelData(0).slice();
    src.pcm = pcm;
    return pcm;
  }

  const WORKER_CODE = `
    import { pipeline, env } from '${TRANSFORMERS_URL}';
    env.allowLocalModels = false;
    let asr = null, loaded = null;
    async function load(model) {
      const progress_callback = (p) => self.postMessage({ type: 'progress', p });
      if (self.navigator && self.navigator.gpu) {
        try {
          asr = await pipeline('automatic-speech-recognition', model, { device: 'webgpu', dtype: { encoder_model: 'fp32', decoder_model_merged: 'q4' }, progress_callback });
          loaded = model; return 'webgpu';
        } catch (e) { /* ripiego su wasm */ }
      }
      asr = await pipeline('automatic-speech-recognition', model, { progress_callback });
      loaded = model; return 'wasm';
    }
    self.onmessage = async (e) => {
      const { audio, model, fallback, language } = e.data;
      try {
        let usedModel = model;
        if (!asr || loaded !== model) {
          try { await load(model); }
          catch (err) { self.postMessage({ type: 'status', msg: 'Modello non disponibile, uso ' + fallback }); usedModel = fallback; await load(fallback); }
        }
        self.postMessage({ type: 'status', msg: 'Trascrizione in corso…' });
        const opts = { language, task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 };
        let out, mode = 'word';
        try { out = await asr(audio, { ...opts, return_timestamps: 'word' }); }
        catch (err) { mode = 'segment'; out = await asr(audio, { ...opts, return_timestamps: true }); }
        self.postMessage({ type: 'done', chunks: out.chunks || [], text: out.text, mode });
      } catch (err) {
        self.postMessage({ type: 'error', msg: String((err && err.message) || err) });
      }
    };`;
  let worker = null;
  function getWorker() {
    if (!worker) worker = new Worker(URL.createObjectURL(new Blob([WORKER_CODE], { type: 'text/javascript' })), { type: 'module' });
    return worker;
  }
  function runWhisper(audio) {
    return new Promise((resolve, reject) => {
      const w = getWorker();
      const files = {};
      w.onmessage = (e) => {
        const d = e.data;
        if (d.type === 'progress') {
          const p = d.p;
          if (p.status === 'progress' && p.file) {
            files[p.file] = [p.loaded || 0, p.total || 0];
            const vals = Object.values(files);
            const tot = vals.reduce((a, v) => a + v[1], 0), ld = vals.reduce((a, v) => a + v[0], 0);
            const pct = tot ? ld / tot * 100 : 0;
            $('trProgress').firstElementChild.style.width = pct + '%';
            $('trStatus').textContent = `Download modello IA… ${Math.round(pct)}% (${(ld / 1048576).toFixed(0)} MB)`;
          }
        } else if (d.type === 'status') {
          $('trStatus').textContent = d.msg;
          if (d.msg.startsWith('Trascrizione')) $('trProgress').firstElementChild.style.width = '100%';
        } else if (d.type === 'done') resolve(d);
        else if (d.type === 'error') reject(new Error(d.msg));
      };
      w.onerror = (e) => reject(new Error(e.message || 'Errore del worker IA'));
      w.postMessage({ audio, model: S.model || 'onnx-community/whisper-base_timestamped', fallback: FALLBACK_MODEL, language: S.lang || 'italian' });
    });
  }
  function chunksToWords(res, duration) {
    const out = [];
    for (const c of res.chunks) {
      let [s, e] = c.timestamp || [0, null];
      if (s == null) continue;
      if (e == null) e = Math.min(duration, s + 2);
      const text = (c.text || '').trim();
      if (!text) continue;
      if (res.mode === 'word') { out.push({ text, start: s, end: Math.max(e, s + 0.05), emph: false, hidden: false }); continue; }
      // timestamp per frase → suddivido in parole in proporzione alla lunghezza
      const parts = text.split(/\s+/);
      const totalLen = parts.reduce((a, p) => a + p.length + 1, 0);
      let acc = s;
      parts.forEach((p) => {
        const d = (e - s) * (p.length + 1) / totalLen;
        out.push({ text: p, start: acc, end: acc + d, emph: false, hidden: false }); acc += d;
      });
    }
    return out;
  }

  async function transcribe() {
    const used = st.sources.filter((s) => st.segs.some((g) => g.src === s.id));
    if (!used.length) { toast('Carica prima un video'); return; }
    const btn = $('btnTranscribe');
    btn.disabled = true;
    $('trProgress').hidden = false;
    $('trProgress').firstElementChild.style.width = '0%';
    try {
      for (let k = 0; k < used.length; k++) {
        const src = used[k];
        $('trStatus').textContent = `Estraggo l'audio (${k + 1}/${used.length})…`;
        let pcm;
        try { pcm = await decodePCM(src); } catch (e) { toast(`${src.name}: nessuna traccia audio leggibile`); continue; }
        const t0 = performance.now();
        const res = await runWhisper(pcm.slice());
        src.words = chunksToWords(res, src.duration);
        $('trStatus').textContent = `Fatto: ${src.words.length} parole in ${((performance.now() - t0) / 1000).toFixed(0)} s` + (res.mode === 'segment' ? ' (tempi per frase)' : '');
      }
      dirtyCues(); renderTranscript();
      toast('Sottotitoli generati! Controlla il testo e scegli lo stile.');
    } catch (e) {
      console.error(e);
      $('trStatus').textContent = 'Errore: ' + e.message + '. Serve una connessione per scaricare il modello la prima volta.';
    } finally {
      btn.disabled = false;
      setTimeout(() => { $('trProgress').hidden = true; }, 800);
    }
  }

  function autoEmphasis() {
    const cues = buildCues();
    if (!cues.length) { toast('Prima genera i sottotitoli'); return; }
    let n = 0;
    cues.forEach((c) => {
      let best = null, score = 0;
      c.words.forEach((w) => {
        const clean = w.raw.toLowerCase().replace(/[^\p{L}\p{N}%]/gu, '');
        if (!clean || STOPWORDS.has(clean)) return;
        let sc = clean.length;
        if (/\d/.test(clean)) sc += 20; // numeri, tempi, distanze
        if (/[!?]/.test(w.raw)) sc += 4;
        if (sc > score) { score = sc; best = w; }
      });
      if (best && score >= 7) { const sw = st.sources.find((s) => s.id === best.src).words[best.idx]; if (!sw.emph) { sw.emph = true; n++; } }
    });
    dirtyCues(); renderTranscript();
    toast(`${n} parole chiave evidenziate`);
  }

  /* ---------------------------------------------------------------- SRT */

  function exportSrt() {
    const cues = buildCues();
    if (!cues.length) { toast('Nessun sottotitolo da esportare'); return; }
    const txt = cues.map((c, i) => `${i + 1}\n${fmtTime(c.start, true)} --> ${fmtTime(c.end, true)}\n${c.words.map((w) => w.raw).join(' ')}\n`).join('\n');
    download(new Blob([txt], { type: 'text/plain' }), 'sottotitoli.srt');
  }
  function parseTime(s) {
    const m = s.trim().replace(',', '.').split(':').map(Number);
    return m.length === 3 ? m[0] * 3600 + m[1] * 60 + m[2] : m[0] * 60 + m[1];
  }
  async function importSrt(file) {
    if (!st.segs.length) { toast('Carica prima il video'); return; }
    const txt = await file.text();
    const re = /(\d{1,2}:?\d{2}:\d{2}[.,]\d{1,3})\s*-->\s*(\d{1,2}:?\d{2}:\d{2}[.,]\d{1,3})[^\n]*\n([\s\S]*?)(?=\n\s*\n|$)/g;
    st.sources.forEach((s) => { s.words = []; });
    let m, n = 0;
    while ((m = re.exec(txt.replace(/\r/g, '')))) {
      const a = parseTime(m[1]), b = parseTime(m[2]);
      const parts = m[3].replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean);
      const len = parts.reduce((x, p) => x + p.length + 1, 0);
      let acc = a;
      parts.forEach((p) => {
        const d = (b - a) * (p.length + 1) / len;
        const mid = acc + d / 2;
        const L = locate(Math.min(mid, total() - 0.001));
        if (L) {
          const off = (d / 2) * speed();
          srcOf(L.seg).words.push({ text: p, start: L.srcTime - off, end: L.srcTime + off, emph: false, hidden: false });
          n++;
        }
        acc += d;
      });
    }
    st.sources.forEach((s) => s.words.sort((x, y) => x.start - y.start));
    dirtyCues(); renderTranscript();
    toast(n ? `Importate ${n} parole` : 'Nessun sottotitolo trovato nel file');
  }

  /* -------------------------------------------------------- taglio silenzi */

  async function cutSilences() {
    if (!st.segs.length) { toast('Carica prima un video'); return; }
    stopPlayback();
    const status = $('silStatus');
    const thr = +S.silDb, minSil = S.silMin / 100, pad = S.silPad / 100;
    const before = total();
    const out = [];
    for (const seg of st.segs) {
      const src = srcOf(seg);
      status.textContent = `Analizzo l'audio di ${src.name}…`;
      let pcm;
      try { pcm = await decodePCM(src); } catch (e) { out.push(seg); continue; }
      const sr = 16000, win = 320; // 20 ms
      const frames = Math.floor(pcm.length / win);
      const loud = new Uint8Array(frames);
      for (let f = 0; f < frames; f++) {
        let s = 0; const o = f * win;
        for (let i = 0; i < win; i++) s += pcm[o + i] * pcm[o + i];
        const db = 10 * Math.log10(s / win + 1e-12);
        loud[f] = db > thr ? 1 : 0;
      }
      // intervalli di parlato
      const fd = win / sr;
      const speech = []; let startF = -1;
      for (let f = 0; f <= frames; f++) {
        if (f < frames && loud[f]) { if (startF < 0) startF = f; }
        else if (startF >= 0) { speech.push([startF * fd, f * fd]); startF = -1; }
      }
      // unisce pause brevi e aggiunge margine
      const merged = [];
      for (const [a, b] of speech) {
        const last = merged[merged.length - 1];
        if (last && a - last[1] < minSil) last[1] = b; else merged.push([a, b]);
      }
      const pieces = merged
        .map(([a, b]) => [Math.max(seg.in, a - pad), Math.min(seg.out, b + pad)])
        .filter(([a, b]) => b - a > 0.15);
      // fonde i pezzi che si sovrappongono per via del margine
      const final = [];
      for (const p of pieces) {
        const last = final[final.length - 1];
        if (last && p[0] <= last[1] + 0.01) last[1] = Math.max(last[1], p[1]); else final.push(p);
      }
      if (!final.length) { out.push(seg); continue; }
      final.forEach(([a, b]) => out.push({ id: uid++, src: seg.src, in: a, out: b }));
    }
    st.segs = out;
    st.selected = null;
    st.t = 0; st.cur = 0;
    dirtyCues(); renderTimeline(); renderTranscript(); setTime(0);
    const saved = before - total();
    status.textContent = saved > 0.05
      ? `Rimossi ${saved.toFixed(1)} s di silenzio · ${st.segs.length} clip. Annulla con Ctrl+Z.`
      : 'Nessun silenzio da tagliare con queste impostazioni.';
  }

  /* -------------------------------------------------------------- export */

  function pickMime() {
    if (!window.MediaRecorder) return null;
    const list = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2',
      'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    return list.find((m) => MediaRecorder.isTypeSupported(m)) || '';
  }
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  }

  async function exportVideo() {
    if (st.exporting) { // annulla
      st.cancel = true;
      if (st.exportEnd) st.exportEnd();
      return;
    }
    if (!st.segs.length) { toast('Carica prima un video'); return; }
    const mime = pickMime();
    if (mime === null || !canvas.captureStream) { toast('Il tuo browser non supporta l\'esportazione. Usa Chrome o Edge aggiornati.', 5000); return; }
    stopPlayback();
    ensureAudio();
    await actx.resume();
    await Promise.all(FONTS.map((f) => fontLoad(f.name, f.w)));
    switchTab('export');
    setCanvasRes(+S.quality || 1080);
    const fps = +S.fps || 30;
    const stream = canvas.captureStream(fps);
    dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
    const rec = new MediaRecorder(stream, { mimeType: mime || undefined, videoBitsPerSecond: +S.bitrate || 8e6, audioBitsPerSecond: 192000 });
    const parts = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) parts.push(e.data); };
    const stopped = new Promise((r) => { rec.onstop = r; });
    st.rec = rec; st.cancel = false;
    st.exporting = true;
    $('btnExport').textContent = 'Annulla esportazione';
    $('btnExportTop').textContent = 'Annulla';
    $('exProgress').hidden = false;
    document.body.classList.add('busy');

    st.t = 0; st.cur = 0;
    const v0 = srcOf(st.segs[0]).video;
    pauseAll(v0);
    await seekVideo(v0, st.segs[0].in);
    if (st.music) st.music.currentTime = 0;
    draw();
    const ended = new Promise((r) => { st.exportEnd = r; });
    rec.start(1000);
    st.playing = true;
    playCurrent();
    await ended;
    st.exportEnd = null;
    stopPlayback();
    if (rec.state !== 'inactive') rec.stop();
    await stopped;
    stream.getVideoTracks().forEach((tr) => tr.stop());
    st.rec = null;
    st.exporting = false;
    document.body.classList.remove('busy');
    $('btnExport').textContent = 'Esporta video';
    $('btnExportTop').textContent = 'Esporta video';
    $('exProgress').hidden = true;
    previewRes();
    if (st.cancel) { $('exStatus').textContent = 'Esportazione annullata.'; return; }
    const type = (mime || 'video/webm').split(';')[0];
    const blob = new Blob(parts, { type });
    const ext = type.includes('mp4') ? 'mp4' : 'webm';
    const name = `runner-progression-${st.ratio.replace(':', 'x')}-${new Date().toISOString().slice(0, 10)}.${ext}`;
    download(blob, name);
    $('exStatus').textContent = `Video pronto: ${name} (${(blob.size / 1048576).toFixed(1)} MB).` +
      (ext === 'webm' ? ' Formato WEBM: YouTube lo accetta; per Instagram convertilo in MP4 o usa Chrome aggiornato.' : '');
    toast('Video esportato! 🎉');
  }

  /* ------------------------------------------------------------ cronologia */

  const history = [];
  function snapshot() {
    history.push(JSON.stringify(st.segs));
    if (history.length > 50) history.shift();
  }
  function undo() {
    if (!history.length) { toast('Niente da annullare'); return; }
    stopPlayback();
    st.segs = JSON.parse(history.pop());
    st.selected = null;
    dirtyCues(); renderTimeline(); renderTranscript(); setTime(Math.min(st.t, total()));
    toast('Annullato');
  }

  /* ------------------------------------------------------------- eventi */

  function switchTab(name) {
    document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.tabpane').forEach((p) => p.classList.toggle('active', p.dataset.pane === name));
  }

  function applySettings(obj) {
    Object.assign(S, obj);
    for (const id of Object.keys(BIND)) {
      const el = $(id); if (!el || !(id in S)) continue;
      if (el.type === 'checkbox') el.checked = !!S[id]; else el.value = S[id];
      const out = $(id + 'Out'); if (out) out.textContent = BIND[id] ? BIND[id](S[id]) : S[id];
    }
    document.querySelectorAll('.font-btn').forEach((b) => b.classList.toggle('active', b.dataset.font === S.subFont));
    document.querySelectorAll('#presets .preset').forEach((b) => b.classList.toggle('active', b.dataset.id === S.preset));
    fontLoad(S.subFont, S.subWeight);
    dirtyCues();
  }

  function initControls() {
    // font per hook
    const hf = $('hookFont');
    ['Montserrat', 'Poppins', 'Bebas Neue', 'Anton', 'Oswald', 'Luckiest Guy', 'Archivo Black', 'Rubik', 'Permanent Marker'].forEach((f) => {
      const o = document.createElement('option'); o.value = o.textContent = f; hf.appendChild(o);
    });
    // lettura valori iniziali dal DOM
    for (const id of Object.keys(BIND)) {
      const el = $(id); if (!el) continue;
      const read = () => (el.type === 'checkbox' ? el.checked : (el.type === 'range' || el.type === 'number') ? +el.value : el.value);
      S[id] = read();
      el.addEventListener('input', () => {
        S[id] = read();
        const out = $(id + 'Out'); if (out) out.textContent = BIND[id] ? BIND[id](S[id]) : S[id];
        if (id.startsWith('sub') && id !== 'subY') { S.preset = null; document.querySelectorAll('#presets .preset').forEach((b) => b.classList.remove('active')); }
        if (id === 'speed') { st.sources.forEach((s) => { s.video.playbackRate = speed(); }); renderTimeline(); }
        if (id === 'quality' && !st.exporting) previewRes();
        if (id === 'hookFont') fontLoad(S.hookFont, 800);
        save(); dirtyCues();
      });
    }

    // preset sottotitoli
    const pr = $('presets');
    PRESETS.forEach((p) => {
      const b = document.createElement('button');
      b.className = 'preset'; b.dataset.id = p.id;
      const demo = document.createElement('span');
      demo.style.fontFamily = `"${p.font}"`; demo.style.fontWeight = p.weight;
      demo.style.textShadow = p.s.subStrokeW ? '0 0 2px #000, 2px 2px 0 #000' : 'none';
      const w1 = document.createElement('span'); w1.textContent = p.s.subUpper ? 'CORRI ' : 'Corri ';
      const w2 = document.createElement('span'); w2.textContent = p.s.subUpper ? 'FORTE' : 'forte';
      if (p.s.subMode === 'box') { w2.style.background = p.s.subBox; w2.style.padding = '0 4px'; w2.style.borderRadius = '4px'; }
      else w2.style.color = p.s.subHi;
      demo.append(w1, w2);
      const sm = document.createElement('small'); sm.textContent = `${p.label} · ${p.sub}`;
      b.append(demo, sm);
      b.addEventListener('click', () => { applySettings({ ...p.s, subFont: p.font, subWeight: p.weight, preset: p.id }); save(); });
      pr.appendChild(b);
    });

    // font
    const fb = $('fonts');
    FONTS.forEach((f) => {
      const b = document.createElement('button');
      b.className = 'font-btn'; b.dataset.font = f.name;
      b.textContent = f.name; b.style.fontFamily = `"${f.name}"`; b.style.fontWeight = f.w;
      b.addEventListener('click', () => { applySettings({ subFont: f.name, subWeight: f.w, preset: null }); save(); });
      fb.appendChild(b);
    });

    // grading
    const gr = $('grades');
    GRADES.forEach((g) => {
      const b = document.createElement('button');
      b.className = 'preset'; b.style.fontSize = '14px'; b.style.fontWeight = '700';
      b.style.background = `linear-gradient(135deg, hsl(${25 + g.v.hue * 3} ${g.v.sat / 2}% ${30 + g.v.warm / 2}%), #111)`;
      b.textContent = g.label;
      b.addEventListener('click', () => {
        gr.querySelectorAll('.preset').forEach((x) => x.classList.toggle('active', x === b));
        applySettings(g.v); save();
      });
      gr.appendChild(b);
    });

    // tab
    document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.tab)));

    // formato
    document.querySelectorAll('.fmt').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('.fmt').forEach((x) => x.classList.toggle('active', x === b));
      st.ratio = b.dataset.ratio; S.ratio = st.ratio; save();
      if (st.ratio === '16:9' && S.preset && ['hormozi', 'beast', 'single', 'rp'].includes(S.preset)) {
        toast('Per YouTube orizzontale prova anche il preset "Classico" o "Minimal"');
      }
      previewRes();
    }));

    // caricamento video
    $('fileVideo').addEventListener('change', (e) => { addVideos(e.target.files); e.target.value = ''; });
    const drop = $('drop');
    ['dragenter', 'dragover'].forEach((ev) => window.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach((ev) => window.addEventListener(ev, (e) => { e.preventDefault(); if (ev === 'drop' || e.target === drop) drop.classList.remove('over'); }));
    window.addEventListener('drop', (e) => { if (e.dataTransfer?.files?.length) addVideos(e.dataTransfer.files); });

    // trasporto
    $('btnPlay').addEventListener('click', () => (st.playing ? stopPlayback() : startPlayback()));
    $('scrub').addEventListener('input', (e) => setTime(e.target.value / 1000 * total()));
    $('btnSplit').addEventListener('click', splitAtPlayhead);

    // timeline
    $('timeline').addEventListener('click', (e) => {
      const el = e.target.closest('.clip'); if (!el) return;
      const i = +el.dataset.i, seg = st.segs[i];
      st.selected = seg.id;
      const r = el.getBoundingClientRect();
      const frac = clamp((e.clientX - r.left) / r.width, 0, 1);
      renderTimeline();
      setTime(starts()[i] + frac * segDur(seg) - 0.001);
    });
    $('timeline').addEventListener('scroll', redraw);
    const editSel = (fn) => () => {
      const i = st.segs.findIndex((s) => s.id === st.selected); if (i < 0) return;
      snapshot(); stopPlayback(); fn(i); dirtyCues(); renderTimeline(); renderTranscript(); setTime(Math.min(st.t, total()));
    };
    $('clipIn').addEventListener('change', editSel((i) => { const s = st.segs[i]; s.in = clamp(+$('clipIn').value, 0, s.out - 0.1); }));
    $('clipOut').addEventListener('change', editSel((i) => { const s = st.segs[i]; s.out = clamp(+$('clipOut').value, s.in + 0.1, srcOf(s).duration); }));
    $('clipLeft').addEventListener('click', editSel((i) => { if (i > 0) [st.segs[i - 1], st.segs[i]] = [st.segs[i], st.segs[i - 1]]; }));
    $('clipRight').addEventListener('click', editSel((i) => { if (i < st.segs.length - 1) [st.segs[i + 1], st.segs[i]] = [st.segs[i], st.segs[i + 1]]; }));
    $('clipDel').addEventListener('click', editSel((i) => { st.segs.splice(i, 1); st.selected = null; st.cur = 0; }));

    // trascrizione
    $('btnTranscribe').addEventListener('click', transcribe);
    $('btnAutoEmph').addEventListener('click', autoEmphasis);
    $('btnClearEmph').addEventListener('click', () => { st.sources.forEach((s) => s.words.forEach((w) => { w.emph = false; })); dirtyCues(); renderTranscript(); });
    $('btnSrt').addEventListener('click', exportSrt);
    $('fileSrt').addEventListener('change', (e) => { if (e.target.files[0]) importSrt(e.target.files[0]); e.target.value = ''; });
    $('btnClearSubs').addEventListener('click', () => {
      if (!confirm('Cancellare tutti i sottotitoli?')) return;
      st.sources.forEach((s) => { s.words = []; }); dirtyCues(); renderTranscript();
    });
    const tr = $('transcript');
    tr.addEventListener('click', (e) => {
      const el = e.target.closest('.word'); if (!el) return;
      const r = wordFromEl(el); if (!r) return;
      if (e.shiftKey) {
        e.preventDefault(); r.w.emph = !r.w.emph; el.classList.toggle('emph', r.w.emph); el.blur(); dirtyCues(); return;
      }
      const t = srcToTimeline(r.src.id, (r.w.start + r.w.end) / 2);
      if (t !== null) setTime(t - (r.w.end - r.w.start) / 2 / speed() + 0.001);
      else toast('Questa parola è in una parte tagliata del video');
    });
    tr.addEventListener('input', (e) => {
      const el = e.target.closest('.word'); if (!el) return;
      const r = wordFromEl(el); if (!r) return;
      r.w.text = el.textContent.replace(/\s+/g, ' ').trim();
      r.w.hidden = !r.w.text;
      el.classList.toggle('hidden', r.w.hidden);
      dirtyCues();
    });
    tr.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
    });

    // taglio silenzi
    $('btnSilence').addEventListener('click', () => { snapshot(); cutSilences(); });

    // brand
    $('fileLogo').addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      const img = new Image(); img.onload = () => { st.logo = img; redraw(); }; img.src = URL.createObjectURL(f);
      e.target.value = '';
    });
    $('btnLogoClear').addEventListener('click', () => { st.logo = null; redraw(); });

    // musica
    $('fileMusic').addEventListener('change', (e) => {
      const f = e.target.files[0]; if (!f) return;
      if (st.music) { st.music.pause(); if (st.music._node) st.music._node.disconnect(); }
      const a = new Audio(URL.createObjectURL(f));
      a.loop = true; a.preload = 'auto';
      st.music = a;
      connectMusic();
      $('musicName').textContent = '♪ ' + f.name;
      e.target.value = '';
      if (st.playing) syncMusic(true);
    });
    $('btnMusicClear').addEventListener('click', () => {
      if (st.music) { st.music.pause(); if (st.music._node) st.music._node.disconnect(); }
      st.music = null; $('musicName').textContent = 'Nessuna musica caricata.';
    });

    // export
    $('btnExport').addEventListener('click', exportVideo);
    $('btnExportTop').addEventListener('click', exportVideo);
    const m = pickMime();
    $('codecInfo').textContent = m === null ? 'Esportazione non supportata da questo browser: usa Chrome o Edge.'
      : m.startsWith('video/mp4') ? 'Formato di uscita: MP4 (H.264) — pronto per YouTube e Instagram.'
        : 'Formato di uscita: WEBM. Per MP4 nativo usa Chrome/Edge aggiornati (v. 130+).';

    // tastiera
    window.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea' || e.target.isContentEditable) return;
      if (e.code === 'Space') { e.preventDefault(); st.playing ? stopPlayback() : startPlayback(); }
      else if (e.key === 's' || e.key === 'S') splitAtPlayhead();
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && st.selected) $('clipDel').click();
      else if (e.key === 'ArrowRight') setTime(st.t + (e.shiftKey ? 5 : 1));
      else if (e.key === 'ArrowLeft') setTime(st.t - (e.shiftKey ? 5 : 1));
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && st.exporting) toast('Torna su questa scheda: l\'esportazione richiede che resti visibile!', 6000);
    });
    window.addEventListener('resize', renderTimeline);
    window.addEventListener('beforeunload', (e) => { if (st.segs.length) { e.preventDefault(); e.returnValue = ''; } });
  }

  function splitAtPlayhead() {
    if (!st.segs.length) return;
    const L = locate(st.t);
    if (L.srcTime - L.seg.in < 0.1 || L.seg.out - L.srcTime < 0.1) { toast('Sposta la testina all\'interno di una clip'); return; }
    snapshot();
    stopPlayback();
    const a = { ...L.seg, out: L.srcTime };
    const b = { id: uid++, src: L.seg.src, in: L.srcTime, out: L.seg.out };
    st.segs.splice(L.i, 1, a, b);
    st.selected = b.id;
    dirtyCues(); renderTimeline(); setTime(st.t);
    toast('Clip divisa ✂');
  }

  /* --------------------------------------------------------------- avvio */

  initControls();
  const saved = load();
  if (saved) {
    const ratio = saved.ratio;
    applySettings(saved);
    if (ratio) {
      st.ratio = ratio;
      document.querySelectorAll('.fmt').forEach((x) => x.classList.toggle('active', x.dataset.ratio === ratio));
    }
  } else {
    const p = PRESETS[0];
    applySettings({ ...p.s, subFont: p.font, subWeight: p.weight, preset: p.id });
  }
  FONTS.forEach((f) => fontLoad(f.name, f.w));
  previewRes();
  renderTimeline();
  requestAnimationFrame(tick);

  // espone alcune funzioni per debug / test
  window.RPStudio = { st, S, setTime, total, buildCues, importSrt };
})();
