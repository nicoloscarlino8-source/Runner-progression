# Tessera digitale – Bar Pradio (Badalucco)

Tessera fedeltà digitale con QR code e raccolta timbri, collegata a un database (Supabase).

- `index.html`: **tessera del cliente** (registrazione, QR, timbri che si aggiornano da soli, vantaggi, installazione sulla Home)
- `cassa.html`: **area staff** (login, scanner QR con fotocamera, +1 timbro, premio, annulla, link di recupero, elenco clienti, statistiche, compleanni, export CSV)
- `privacy.html`: informativa privacy (modello da completare)
- `config.js`: **l'unico file da modificare** (collegamento a Supabase, testi, contatti, vantaggi)
- `api.js`: collegamento ai dati (Supabase oppure modalità demo in locale)
- `supabase/schema.sql`: tabelle, sicurezza e funzioni del database
- `vendor/`: librerie incluse (supabase-js 2.118.0, qrcode-generator 1.4.4, jsQR 1.4.0)

👉 **Per metterla online segui [GUIDA.md](GUIDA.md).**

Senza Supabase configurato il sito funziona in **modalità demo** (dati solo nel browser, password cassa: `demo`).
