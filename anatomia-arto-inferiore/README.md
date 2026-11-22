# Anatomia dell'arto inferiore — massaggio sportivo nel ciclismo

Materiale di studio Runner Progression per il massaggiatore di una squadra di ciclismo.

| File | Cosa contiene |
|---|---|
| `Anatomia-arto-inferiore-massaggio-ciclismo.pdf` | Manuale A4 di 55 pagine, stampabile |
| `webapp/index.html` | Web app interattiva in un solo file: si apre con qualsiasi browser, anche offline |
| `src/data.js` | Unica fonte dei dati: 52 muscoli, tendini, punti di repere, zone a rischio, protocolli |
| `src/svg.js`, `src/app.html` | Grafici (mappa, ruota della pedalata) e interfaccia della web app |
| `build.js` | Rigenera web app e PDF dai dati |

## Contenuti
- 52 muscoli in 11 regioni: origine (sintesi + descrizione completa), inserzione, innervazione con radici, azione, ruolo nella pedalata, palpazione, tecnica di massaggio, attenzioni
- Tendini e fasce (Achille, rotuleo, quadricipitale, tratto ileotibiale, zampa d'oca, fascia plantare…)
- Punti di repere ossei per la palpazione
- Ruota della pedalata con l'attività dei muscoli da 0° a 360°
- Protocolli pre-gara, post-gara/tappa, post-allenamento, giorno di recupero; tecniche
- Zone a rischio (vasi e nervi), controindicazioni e segnali da riferire al medico
- Problemi frequenti del ciclista con muscoli coinvolti e cause legate alla bici
- Web app: ricerca anche per punto osseo, mappa cliccabile, quiz, flashcard, progressi di studio salvati nel browser
- PDF: tabella riassuntiva e scheda di valutazione dell'atleta da fotocopiare

## Rigenerare
Dopo aver modificato `src/data.js`:
```bash
node build.js
```
Serve Node.js; per il PDF anche Playwright con Chromium e `pdfinfo`/`pdftotext` (poppler).
