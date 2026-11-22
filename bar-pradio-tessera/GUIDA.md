# Guida: mettere online la tessera del Bar Pradio

Tempo: circa 30 minuti. Costo: **0 €** (piani gratuiti di Supabase e Netlify).

Il sistema ha due pagine:

| Pagina | Per chi | Indirizzo |
|---|---|---|
| **Tessera** | i clienti | `https://TUO-SITO/` |
| **Cassa** | il personale del bar | `https://TUO-SITO/cassa.html` |

---

## 1. Crea il database (Supabase)

1. Vai su **supabase.com** → *Start your project* → registrati (va bene anche con un account GitHub o Google).
2. **New project**:
   - Nome: `bar-pradio`
   - Database password: inventane una robusta e **salvala** (non servirà tutti i giorni).
   - Region: **Central EU (Frankfurt)**: i dati restano in Europa, come scritto nell'informativa privacy.
3. Aspetta 1-2 minuti che il progetto sia pronto.

## 2. Carica le tabelle

1. Nel menu a sinistra apri **SQL Editor** → *New query*.
2. Apri il file `supabase/schema.sql`, copia **tutto** il contenuto, incollalo e premi **Run**.
3. Deve comparire "Success. No rows returned".

## 3. Crea l'account del bar

1. Menu **Authentication** → **Users** → *Add user* → *Create new user*.
2. Metti l'email del bar e una password, e spunta **Auto Confirm User**.
3. Torna in **SQL Editor**, nuova query, incolla questa riga (con l'email appena usata) e premi **Run**:

   ```sql
   insert into public.staff (user_id, nome)
   select id, 'Titolare' from auth.users where email = 'EMAIL-DEL-BAR@esempio.it';
   ```

   Puoi creare più account (uno per ogni dipendente) ripetendo i passi 1-3.

4. **Importante:** in **Authentication** → impostazioni di Sign In / Providers, **disattiva "Allow new users to sign up"**. Così nessuno può crearsi un account da solo. Anche se qualcuno ci riuscisse non potrebbe mettere timbri, perché non è nella tabella `staff`.

## 4. Collega le pagine al database

1. In Supabase apri **Project Settings** → **API** (o il pulsante **Connect** in alto).
2. Copia:
   - **Project URL** (tipo `https://abcdefgh.supabase.co`)
   - la chiave **anon / publishable** (⚠️ **mai** la `service_role` / `secret`)
3. Apri `config.js` e incollale:

   ```js
   supabaseUrl: "https://abcdefgh.supabase.co",
   supabaseAnonKey: "eyJhbGciOi...",
   ```

4. Nello stesso file compila telefono, orari, Instagram, vantaggi e soprattutto **`titolareTrattamento`** (ragione sociale, P.IVA, indirizzo), che compare nell'informativa privacy.

> Finché `supabaseUrl` è vuoto, il sito gira in **modalità demo** (barra scura in alto, password cassa `demo`). Serve per provarlo, non per i clienti.

## 5. Pubblica il sito (Netlify, gratis)

1. Vai su **app.netlify.com/drop** (crea un account gratuito).
2. Trascina dentro **la cartella `bar-pradio-tessera`**.
3. In pochi secondi hai un indirizzo tipo `https://nome-a-caso.netlify.app`.
4. In *Site configuration* → *Change site name* mettilo, ad esempio, `tessera-barpradio` → `https://tessera-barpradio.netlify.app`.

Ogni volta che modifichi `config.js` ripeti il trascinamento (in *Deploys*).

In alternativa vanno bene GitHub Pages, Cloudflare Pages o il sito del bar: basta che sia **https**, perché è obbligatorio per la fotocamera e per l'installazione sulla Home.

## 6. Prepara il telefono del bar

1. Sul telefono o tablet della cassa apri `https://TUO-SITO/cassa.html`.
2. Accedi con email e password del bar (resta collegato).
3. Aggiungila alla schermata Home: diventa l'app **"Cassa Pradio"**.
4. Al primo "Apri fotocamera" consenti l'accesso alla fotocamera.

## 7. Come si usa al banco

1. Il cliente apre la tessera e mostra il QR.
2. Il barista tocca **Apri fotocamera** e inquadra il QR (bip + vibrazione).
3. Tocca **+1 Timbro** (più volte se ha preso più consumazioni).
4. Il timbro compare **da solo** sul telefono del cliente in pochi secondi.
5. Al 10° timbro il pulsante diventa **🎁 Consegna premio** e la tessera riparte da zero.

Altre funzioni:
- **Togli un timbro**: per correggere un errore.
- **Nuova scansione**: passa al cliente successivo.
- **Link di recupero**: il cliente ha cambiato telefono? Gli fai inquadrare questo QR e ritrova la tessera con tutti i timbri.
- **Elimina cliente**: se un cliente chiede la cancellazione dei dati.
- Scheda **Clienti**: statistiche, compleanni del mese, ricerca, esportazione **CSV** (si apre con Excel).
- Se la fotocamera non va, puoi scrivere a mano il numero della tessera.

## 8. Fai conoscere la tessera

- Stampa un QR code che punta all'indirizzo del sito e mettilo sul bancone o sui tavolini ("Inquadra e attiva la tua tessera Pradio").
- Condividi il link su WhatsApp e Instagram.

---

## Da sapere

- **Progetto in pausa:** sul piano gratuito Supabase mette in pausa i progetti senza attività per 7 giorni. Con l'uso quotidiano non succede. Se il bar resta chiuso per ferie più a lungo, al rientro entra in Supabase e premi **Restore project**.
- **Numero di timbri:** per cambiare quanti timbri servono per il premio (ad esempio 8), esegui in SQL Editor:
  `update public.impostazioni set timbri_per_premio = 8 where id = 1;`
- **Privacy:** l'informativa (`privacy.html`) è un modello di partenza. Falla controllare a chi segue il bar (commercialista o consulente privacy). Le tessere inattive da 24 mesi vengono cancellate in automatico.
- **Sicurezza:** i clienti non vedono mai i dati degli altri. Solo gli account nella tabella `staff` possono cercare clienti e mettere timbri.
