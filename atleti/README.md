# Archivio atleti · Runner Progression

Una cartella per ogni atleta, con le attività scaricate da Strava/Garmin, i test, il
diario del coach e un report dei progressi che si aggiorna da solo.
Il riepilogo di tutti gli atleti sta in **`dashboard.html`** (aprila con un doppio clic:
si vede nel browser, anche dal telefono e anche senza internet) e in versione testo in
[`DASHBOARD.md`](DASHBOARD.md).

```
atleti/
├── dashboard.html        ← pagina web con grafici, tutti gli atleti (generata)
├── DASHBOARD.md          ← stesso riepilogo in versione testo (generato)
├── rp.py                 ← lo strumento (Python 3, niente da installare)
├── _modello/             ← modelli usati per i nuovi atleti
├── .segreti/             ← chiavi Strava e token: NON va su GitHub (.gitignore)
└── mario-rossi/
    ├── profilo.md        ← anagrafica, zone, obiettivi, infortuni (lo compili tu)
    ├── diario.md         ← le tue note da coach (lo compili tu)
    ├── test.csv          ← test atletici: data,test,risultato,unita,note
    ├── attivita.csv      ← tutte le attività (generato da sync/import)
    └── report.md         ← progressi (generato)
```

## Come arrivano i dati Garmin

Garmin non offre un'API aperta ai singoli coach: il programma sviluppatori di Garmin
Connect è riservato alle aziende approvate. La strada semplice è passare da Strava:

1. **L'atleta collega Garmin a Strava** (app Garmin Connect → Altro → Impostazioni →
   App collegate → Strava). Da quel momento ogni allenamento finisce anche su Strava.
2. **Tu scarichi tutto da Strava** con `rp.py sync`.

Chi non usa Strava può mandarti l'**export CSV di Garmin Connect** (vedi più sotto).
Se la stessa uscita arriva sia da Garmin che da Strava, lo script la riconosce
(stessa partenza ±2 minuti e distanza simile) e la tiene una volta sola.

## Configurazione iniziale (una volta sola)

1. Vai su <https://www.strava.com/settings/api> e crea un'app:
   - *Application Name*: Runner Progression Coach
   - *Category*: Training
   - *Website*: il tuo sito o profilo social
   - *Authorization Callback Domain*: `localhost`
2. Copia il file di esempio e inserisci **Client ID** e **Client Secret**:
   ```bash
   mkdir -p atleti/.segreti && cp atleti/config.esempio.json atleti/.segreti/config.json
   ```
3. **Capacità dell'app.** Le app Strava nuove partono con un limite di atleti collegabili
   molto basso (di solito solo il tuo account). Dalla pagina dell'app Strava puoi chiedere
   l'aumento compilando il modulo di revisione: spiega che è uno strumento di coaching
   privato in cui ogni atleta autorizza il proprio coach a vedere i suoi dati.

## Aggiungere un atleta

```bash
python3 atleti/rp.py nuovo-atleta "Mario Rossi"
python3 atleti/rp.py strava-link mario-rossi
```

Il secondo comando stampa un link: mandalo all'atleta (WhatsApp, email). L'atleta lo
apre, accede al **proprio** Strava e clicca *Autorizza*. Si aprirà una pagina bianca
che non si carica (`localhost`): è normale. L'atleta ti manda l'indirizzo di quella
pagina, e tu lanci:

```bash
python3 atleti/rp.py strava-codice mario-rossi "http://localhost/exchange_token?state=mario-rossi&code=abc123...&scope=read,activity:read_all"
```

Il codice vale pochi minuti e una volta sola: se scade basta rimandare il link.

## Uso settimanale

```bash
python3 atleti/rp.py sync
```

Scarica le attività nuove di tutti gli atleti collegati e rigenera report e dashboard.
La prima volta prende gli ultimi 12 mesi; per andare più indietro:
`python3 atleti/rp.py sync mario-rossi --da 2024-01-01`.

## Import da Garmin Connect (senza Strava)

1. L'atleta (o tu, se condivide l'account) va su <https://connect.garmin.com> da computer
   → **Attività → Tutte le attività**, scorre fino in fondo per caricare il periodo che
   interessa, poi clicca **Esporta CSV**.
2. Importa il file:
   ```bash
   python3 atleti/rp.py importa-garmin mario-rossi ~/Downloads/Activities.csv
   ```
   Funziona con Garmin Connect in italiano o in inglese. Puoi reimportare lo stesso
   file più volte: le attività già presenti vengono aggiornate, non duplicate.

## Cosa c'è nel report

- **Carico:** ore degli ultimi 7 giorni, media delle ultime 4 settimane e rapporto
  acuto/cronico (ACWR). Sopra 1,5 c'è un aumento brusco da guardare; sotto 0,8 c'è uno
  scarico o uno stop. È un indicatore grezzo, basato sul tempo e non sull'intensità, e la
  letteratura sul suo valore predittivo degli infortuni è discussa: usalo come campanello,
  non come diagnosi.
- **Ultime 12 settimane** e **mese per mese** (solo corsa): uscite, km, D+, tempo, lungo, FC.
- **Migliori prestazioni in archivio:** passo medio più veloce su uscite da 5, 10 e 21 km
  in su, uscita più lunga, uscita con più dislivello. Sono medie di intere uscite, non
  tempi di gara o segmenti.
- **Test atletici** presi da `test.csv`, per esempio:
  ```
  data,test,risultato,unita,note
  2026-10-05,Test Cooper,3150,m,pista, vento leggero
  2026-10-20,Soglia (test 30'),3:52,min/km,FC media 172
  2026-11-15,1000 m,2:58,min:s,
  ```
- **Ultime 10 attività.**

## La pagina web

`dashboard.html` si rigenera a ogni `sync`, `importa-garmin` o `report`. La prima schermata
mostra la squadra: i totali della settimana, quanti atleti hanno il carico da controllare
e una scheda per atleta (in alto chi ha bisogno di attenzione). Toccando un atleta si
apre il suo dettaglio con i grafici di km e dislivello delle ultime 12 settimane,
l'andamento dell'ACWR con la fascia 0,8–1,3, le tabelle settimanali e mensili, le
migliori prestazioni, i test e le ultime attività.

`report.md`, `DASHBOARD.md` e `dashboard.html` vengono riscritti a ogni sync: le note vanno in `diario.md`
e `profilo.md`, che lo script non tocca mai.

## Privacy

Questi sono dati sanitari dei tuoi atleti (frequenza cardiaca, carichi, infortuni):

- tieni il repository GitHub **privato**;
- chiedi a ogni atleta un consenso scritto al trattamento dei dati (anche una riga su
  WhatsApp o email salvata, meglio un modulo firmato);
- se un atleta smette, cancella la sua cartella e il file `atleti/.segreti/strava_<nome>.json`;
  lui può revocare l'accesso da Strava → Impostazioni → Le mie app.
