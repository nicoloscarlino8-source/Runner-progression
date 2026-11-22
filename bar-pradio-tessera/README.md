# Tessera digitale – Bar Pradio (Badalucco)

Tessera fedeltà digitale per i clienti del Bar Pradio: si apre dal telefono, si aggiunge alla schermata Home come un'app e funziona anche offline.

## Cosa fa
- **Registrazione**: il cliente inserisce nome, cognome e (facoltativo) la data di nascita.
- **Tessera**: numero univoco (`PRD-XXXX-XXXX`), nome del titolare, "cliente dal".
- **QR code**: da mostrare alla cassa.
- **Raccolta timbri**: 10 timbri = premio. I timbri li aggiunge solo lo staff con un PIN.
- **Vantaggi**, **dove trovarci**, istruzioni per **aggiungere alla Home** (iPhone e Android).

## Da personalizzare
Tutto è nell'oggetto `CONFIG` in `index.html`: stagione, numero di timbri, premio, **PIN staff (da cambiare!)**, indirizzo, telefono, Instagram, orari, lista vantaggi.

## Come pubblicarla
Sono file statici: basta caricare la cartella su un hosting gratuito (GitHub Pages, Netlify, Cloudflare Pages) o sul sito del bar. Serve **HTTPS** per l'installazione sulla Home e il funzionamento offline. Poi si condivide il link via WhatsApp, Instagram o con un QR stampato sul bancone.

## Limiti da conoscere
- I dati restano **solo sul telefono del cliente** (localStorage): se cancella i dati del browser o cambia telefono, la tessera riparte da zero.
- Il PIN staff è un controllo semplice lato client: scoraggia i furbetti ma non è a prova di esperto. Per un sistema con database centrale (elenco clienti, statistiche, timbri sincronizzati) serve un backend.
