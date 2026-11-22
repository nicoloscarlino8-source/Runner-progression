# Ristorante Ca' Mea: sito e prenotazioni

Sito di una pagina con prenotazione online. Le prenotazioni finiscono in un **Google Foglio** e le email partono da **Gmail**. Il sistema costa **0 €** e il ristorante non deve installare niente.

```
ca-mea/
├── index.html              ← il sito (unico file)
└── apps-script/
    ├── Code.gs             ← il motore delle prenotazioni
    └── appsscript.json     ← impostazioni (fuso orario Europe/Rome)
```

## Cosa fa da solo

| Quando | Cosa succede |
|---|---|
| Il cliente sceglie il giorno | Il sito mostra solo gli orari con posti liberi |
| Il cliente prenota | Riga nel Foglio, email di conferma al cliente (con link "annulla"), email al ristorante con pulsante WhatsApp |
| Due clienti prenotano insieme | Un blocco (lock) impedisce l'overbooking |
| Il giorno prima, ore 11 | Promemoria al cliente con link per annullare |
| Ogni giorno, ore 17 | Riepilogo al ristorante: tavoli, coperti, telefoni e note della sera |
| Il cliente clicca "annulla" | Lo stato diventa Annullata, il posto si libera e il ristorante riceve un avviso |
| Il ristorante scrive "Annullata" nel Foglio | Il cliente riceve un'email di scuse |
| Ferie o chiusure | Basta scrivere la data nel foglio "Chiusure" |

## Installazione (circa 15 minuti)

1. Con l'account Google del ristorante crea un nuovo **Google Foglio** e chiamalo "Prenotazioni Ca' Mea".
2. Apri **Estensioni → Apps Script**, cancella il contenuto e incolla `Code.gs`.
   Da ⚙️ *Impostazioni progetto* spunta "Mostra appsscript.json" e incolla `appsscript.json`.
3. Scegli la funzione **`setup`** e premi ▶ **Esegui**. Autorizza i permessi: si creano i fogli *Prenotazioni*, *Impostazioni* e *Chiusure* e le automazioni a orario.
4. **Distribuisci → Nuova distribuzione → Applicazione web**
   - Esegui come: *Me*
   - Chi ha accesso: *Chiunque*
   Copia l'URL che finisce con `/exec`.
5. In `index.html`, nella sezione `CONFIG`, incolla l'URL in `BOOKING_API: "…/exec"`.
6. Fai una prova: dall'editor esegui `testBooking` (crea una prenotazione e manda l'email a te), poi prenota dal sito.

Ogni volta che modifichi `Code.gs`: **Distribuisci → Gestisci distribuzioni → Modifica → Nuova versione**. In questo modo l'URL resta lo stesso.

## Da configurare con il ristorante

Nel foglio **Impostazioni**:
- `COPERTI_PER_TURNO` e `COPERTI_PER_SERA`: quanti posti ci sono davvero
- `TURNI`: orari prenotabili (oggi 19:30–21:30)
- `GIORNI_CHIUSURA`: giorno di riposo (0 = domenica, 1 = lunedì…)
- `EMAIL_RISTORANTE`: dove arrivano le notifiche

In `index.html`, sezione `CONFIG`:
- `HOURS`: orari mostrati sul sito (**pranzo e giorno di chiusura sono da confermare**)
- `CLOSED_WEEKDAYS` e `SLOTS`: gli stessi valori del foglio
- nel footer: P.IVA e link alla privacy policy (obbligatori)

Da aggiungere: **foto vere** del locale, dei paioli e dei piatti, al posto dei disegni.

## Pubblicare il sito

Il dominio `ristorantecamea.com` esiste già. Per pubblicare il sito:
- **Netlify** o **Cloudflare Pages** (gratis): trascina la cartella `ca-mea` e collega il dominio dal pannello DNS.
- Oppure carica `index.html` sull'hosting attuale del dominio.

## Limiti

- Gmail gratuito manda circa **100 email al giorno** (Google Workspace 1.500). Per un ristorante di queste dimensioni bastano.
- WhatsApp automatico (non solo link) richiede l'API ufficiale di WhatsApp Business, che ha un costo per messaggio. Si può aggiungere in seguito.
- GDPR: tieni una privacy policy sul sito e cancella periodicamente le prenotazioni vecchie dal Foglio.
