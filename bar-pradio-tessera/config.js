/* =====================================================================
   CONFIGURAZIONE TESSERA BAR PRADIO
   Questo è l'unico file da modificare. Vedi GUIDA.md.
   ===================================================================== */
window.PRADIO_CONFIG = {

  // ---- Collegamento al database Supabase ----
  // Supabase → Project Settings → API (oppure "Connect").
  // Se lasci vuoti questi due campi la tessera gira in MODALITÀ DEMO
  // (i dati restano solo sul dispositivo: utile per provarla, non per i clienti).
  supabaseUrl: "",        // es. "https://abcdefghijklmno.supabase.co"
  supabaseAnonKey: "",    // la chiave "anon" / "publishable" (NON la "service_role"/"secret")

  // ---- Testi della tessera ----
  stagione: "2025/26",
  premio: "Il prossimo caffè (o cappuccino) te lo offriamo noi!",
  regola: "Un timbro per ogni colazione o consumazione al banco.",
  timbriDemo: 10,         // solo modalità demo: col database vale "timbri_per_premio" nel database

  // ---- Raccolta punti (bevande) ----
  // Il listino (prodotti e punti) e la soglia si cambiano nel database: vedi GUIDA.md
  premioPunti: "Una bevuta a scelta offerta da noi!",
  regolaPunti: "Ogni consumazione al bar ti fa guadagnare punti.",
  avvisoAlcol: "Punti sugli alcolici riservati ai maggiorenni · Bevi responsabilmente.",
  puntiDemo: 50,          // solo modalità demo: col database vale "punti_per_premio" nel database

  // ---- Contatti (lascia "" per nascondere) ----
  indirizzo: "Badalucco (IM)",
  mappa: "https://maps.google.com/?q=Bar+Pradio+Badalucco",
  telefono: "",           // es. "+39 0184 000000"
  instagram: "",          // es. "barpradio" (senza @)
  orari: "",              // es. "Tutti i giorni 6:30 – 20:00 · Chiuso il mercoledì"

  // ---- Privacy (servono per l'informativa, vedi privacy.html) ----
  titolareTrattamento: "",   // es. "Bar Pradio di Mario Rossi – P.IVA 01234567890 – Via Roma 1, 18010 Badalucco (IM)"
  emailPrivacy: "",          // es. "barpradio@gmail.com"

  // ---- Vantaggi mostrati ai clienti ----
  vantaggi: [
    { ico: "☕", titolo: "Caffè omaggio", testo: "Completa la raccolta timbri e il prossimo è offerto da noi." },
    { ico: "🍸", titolo: "Bevuta omaggio", testo: "Accumula punti con le consumazioni al bar: raggiunta la soglia, una bevuta è offerta da noi." },
    { ico: "🎂", titolo: "Sorpresa di compleanno", testo: "Nel giorno del tuo compleanno una pasta o un gelato in omaggio." },
    { ico: "🍰", titolo: "-10% su torte su ordinazione", testo: "Per i titolari della tessera, su tutte le torte della nostra pasticceria." },
    { ico: "🍨", titolo: "Gusti in anteprima", testo: "Assaggia per primo i nuovi gusti di gelato della stagione." }
  ]
};
