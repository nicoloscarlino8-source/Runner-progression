# RP Studio — Montaggio video IA per YouTube e Instagram

Webapp di montaggio che gira **interamente nel browser**: i video non vengono caricati su nessun server.

## Funzioni

| Area | Cosa fa |
|---|---|
| **Formati** | 9:16 (Reels / Shorts / TikTok), 16:9 (YouTube), 4:5 (post IG), 1:1 |
| **Media** | Più video in sequenza, taglio inizio/fine, dividi clip (✂ / tasto `S`), riordino, zoom e reframing, sfondo sfocato per video orizzontali in verticale |
| **Taglio silenzi IA** | Analizza l'audio e rimuove pause e respiri (soglia, pausa minima e margine regolabili) |
| **Zoom dinamico** | Effetto "punch-in" alternato a ogni taglio, tipico dei creator |
| **Sottotitoli IA** | Trascrizione automatica con Whisper (italiano e altre lingue) con tempi parola per parola, eseguita nel browser |
| **Editor testo** | Correggi le parole, nascondile, evidenziale (★ con Maiusc+clic) o lascia che l'IA trovi le parole chiave |
| **Stili sottotitoli** | Preset virali: Hormozi, Cartoon (stile MrBeast), Box, Karaoke, Una parola, Classico YouTube, Minimal, **Runner Progression** |
| **Font** | Montserrat, Poppins, Bebas Neue, Anton, Oswald, Roboto, Inter, Luckiest Guy, Bangers, Archivo Black, Lilita One, Rubik, Barlow Condensed, Permanent Marker |
| **Look** | Preset di color grading (Cinematico, Sport, Caldo, Freddo, Vivido, Vintage, B/N), luminosità, contrasto, saturazione, calore, tonalità, vignettatura, velocità |
| **Testi & brand** | Titolo hook iniziale, call to action finale, @handle, logo PNG, barra di avanzamento |
| **Audio** | Volume voce, musica di sottofondo con ducking automatico quando parli e dissolvenze |
| **Export** | MP4 H.264 (Chrome/Edge recenti) o WEBM, 1080p/720p, 30/60 fps; importa ed esporta `.srt` |

## Come usarla

Serve un browser desktop recente: **Chrome o Edge** consigliati (export MP4 nativo).

Avvio in locale:

```bash
cd video-editor
python3 -m http.server 8000
# poi apri http://localhost:8000
```

Oppure pubblicala gratis con **GitHub Pages** (Settings → Pages → branch e cartella) e aprila da qualsiasi computer.

### Flusso consigliato per un Reel
1. Scegli **9:16** e trascina i video.
2. **Media → Taglia i silenzi** per un ritmo serrato (+ *Zoom dinamico ai tagli*).
3. **Sottotitoli IA → Genera sottotitoli**, correggi il testo e premi *★ Evidenzia parole chiave*.
4. **Stile →** scegli un preset (es. *Hormozi* o *Runner Progression*).
5. **Testi & Brand →** hook dei primi 3 secondi, @handle, logo, barra di avanzamento, CTA finale.
6. **Audio →** musica con ducking.
7. **Esporta** (tieni la scheda aperta e visibile: l'esportazione avviene in tempo reale).

### Scorciatoie
`Spazio` play/pausa · `S` dividi · `←/→` ±1 s (Maiusc ±5 s) · `Canc` elimina clip selezionata · `Ctrl+Z` annulla taglio

## Note tecniche
- Nessuna build: `index.html`, `styles.css`, `app.js`.
- Trascrizione: [transformers.js](https://github.com/huggingface/transformers.js) con modelli Whisper ONNX scaricati da Hugging Face al primo uso (poi in cache). Usa WebGPU se disponibile, altrimenti WebAssembly.
- Export: `canvas.captureStream()` + Web Audio + `MediaRecorder`.
