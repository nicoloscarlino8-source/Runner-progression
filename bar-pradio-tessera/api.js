/* =====================================================================
   Collegamento ai dati della tessera.
   - Con supabaseUrl/supabaseAnonKey in config.js → database Supabase (uso reale)
   - Senza → modalità DEMO: dati salvati solo in questo browser
   Non serve modificare questo file.
   ===================================================================== */
(function () {
  const CFG = window.PRADIO_CONFIG || {};
  const CODICI = [
    "tessera_completa", "timbri_insufficienti", "nessun_timbro", "tessera_non_trovata",
    "non_autorizzato", "consenso_mancante", "dati_mancanti", "troppe_richieste",
    "punti_insufficienti", "nessun_punto", "punti_gia_usati", "prodotto_non_valido", "quantita_non_valida", "minorenne"
  ];
  const MESSAGGI = {
    tessera_completa: "Tessera completa: prima riscatta il premio.",
    timbri_insufficienti: "Non ci sono ancora abbastanza timbri per il premio.",
    nessun_timbro: "Non ci sono timbri da togliere.",
    tessera_non_trovata: "Tessera non trovata. Controlla il numero.",
    non_autorizzato: "Questo account non è abilitato come staff del bar.",
    consenso_mancante: "Per continuare accetta l'informativa privacy.",
    dati_mancanti: "Inserisci nome e cognome.",
    troppe_richieste: "Troppe richieste in questo momento, riprova tra qualche minuto.",
    punti_insufficienti: "Non ci sono ancora abbastanza punti per il premio.",
    nessun_punto: "Non ci sono punti da annullare.",
    punti_gia_usati: "Quei punti sono già stati usati per un premio: non si possono annullare.",
    prodotto_non_valido: "Prodotto non più nel listino: ricarica la scheda.",
    quantita_non_valida: "Quantità non valida.",
    minorenne: "Cliente minorenne: niente punti sugli alcolici.",
    login: "Email o password non corretti.",
    rete: "Connessione assente. Controlla internet e riprova.",
    sconosciuto: "Qualcosa è andato storto, riprova."
  };

  function errore(code, dettaglio) {
    const e = new Error(MESSAGGI[code] || MESSAGGI.sconosciuto);
    e.code = code; e.dettaglio = dettaglio;
    return e;
  }
  function normalizzaNumero(s) {
    const v = String(s || "").replace(/[^0-9]/g, "");
    return v.length === 8 ? "PRD-" + v.slice(0, 4) + "-" + v.slice(4) : null;
  }

  /* ------------------------------------------------------------------
     SUPABASE
     ------------------------------------------------------------------ */
  function creaSupabase(opts) {
    const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {
      auth: opts.staff
        ? { persistSession: true, autoRefreshToken: true, storageKey: "pradio-staff-auth" }
        : { persistSession: false, autoRefreshToken: false, storageKey: "pradio-cliente-auth" }
    });

    async function rpc(nome, params) {
      let res;
      try { res = await sb.rpc(nome, params || {}); }
      catch (e) { throw errore("rete", e); }
      if (res.error) {
        const msg = (res.error.message || "") + " " + (res.error.details || "");
        const code = CODICI.find(c => msg.includes(c));
        if (code) throw errore(code, res.error);
        if (/fetch|network|Failed to|Load failed/i.test(msg)) throw errore("rete", res.error);
        if (/permission denied|JWT/i.test(msg)) throw errore("non_autorizzato", res.error);
        throw errore("sconosciuto", res.error);
      }
      return res.data;
    }

    return {
      demo: false,
      // cliente
      registra: (d) => rpc("registra_cliente", { p_nome: d.nome, p_cognome: d.cognome, p_nascita: d.nascita || null, p_consenso: !!d.consenso }),
      leggi: (token) => rpc("leggi_tessera", { p_token: token }),
      aggiornaNome: (token, nome, cognome) => rpc("aggiorna_nome", { p_token: token, p_nome: nome, p_cognome: cognome }),
      eliminaTessera: (token) => rpc("elimina_tessera", { p_token: token }),
      // staff
      async login(email, password) {
        let r;
        try { r = await sb.auth.signInWithPassword({ email, password }); }
        catch (e) { throw errore("rete", e); }
        if (r.error) throw errore(/fetch|network/i.test(r.error.message) ? "rete" : "login", r.error);
        if (!(await rpc("is_staff"))) { await sb.auth.signOut(); throw errore("non_autorizzato"); }
        return { email: r.data.user.email };
      },
      async logout() { try { await sb.auth.signOut(); } catch (e) {} },
      async sessione() {
        const { data } = await sb.auth.getSession();
        if (!data.session) return null;
        try { if (!(await rpc("is_staff"))) return null; }
        catch (e) { if (e.code !== "rete") return null; }
        return { email: data.session.user.email };
      },
      cerca: (n) => rpc("cerca_cliente", { p_numero: n }),
      timbro: (n) => rpc("aggiungi_timbro", { p_numero: n }),
      premio: (n) => rpc("riscatta_premio", { p_numero: n }),
      annulla: (n) => rpc("annulla_timbro", { p_numero: n }),
      punti: (n, prodotto, qta) => rpc("aggiungi_punti", { p_numero: n, p_prodotto: prodotto, p_quantita: qta || 1 }),
      premioPunti: (n) => rpc("riscatta_premio_punti", { p_numero: n }),
      annullaPunti: (n) => rpc("annulla_punti", { p_numero: n }),
      eliminaCliente: (n) => rpc("elimina_cliente", { p_numero: n }),
      pannello: () => rpc("pannello")
    };
  }

  /* ------------------------------------------------------------------
     DEMO (localStorage) – stessa logica del database, solo in locale
     ------------------------------------------------------------------ */
  function creaDemo() {
    const KEY = "pradio-demo-db", SKEY = "pradio-demo-staff";
    const obiettivo = CFG.timbriDemo || 10, obiettivoPunti = CFG.puntiDemo || 50;
    // stesso listino iniziale del database (supabase/schema.sql)
    const LISTINO = [
      { id: 1, nome: "Superalcolico", punti: 5, alcolico: true }, { id: 2, nome: "Cocktail", punti: 5, alcolico: true },
      { id: 3, nome: "Amaro", punti: 3, alcolico: true }, { id: 4, nome: "Spritz / Aperitivo", punti: 3, alcolico: true },
      { id: 5, nome: "Birra", punti: 2, alcolico: true }, { id: 6, nome: "Calice di vino", punti: 2, alcolico: true },
      { id: 7, nome: "Analcolico / Succo", punti: 1, alcolico: false }
    ];
    const minorenne = (n) => { if (!n) return false; const d = new Date(n); d.setFullYear(d.getFullYear() + 18); return d > new Date(); };
    const ls = {
      get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
      set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
      del(k) { try { localStorage.removeItem(k); } catch (e) {} }
    };
    const db = () => ls.get(KEY) || { clienti: [], movimenti: [] };
    const salva = (d) => ls.set(KEY, d);
    const attesa = (v) => new Promise(r => setTimeout(() => r(v), 120));
    const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now());

    function pubblico(c) {
      return { numero: c.numero, nome: c.nome, cognome: c.cognome, nascita: c.nascita, timbri: c.timbri, premi: c.premi,
        timbri_totali: c.timbri_totali, creato_il: c.creato_il, ultimo_timbro: c.ultimo_timbro, obiettivo,
        punti: c.punti || 0, punti_totali: c.punti_totali || 0, premi_punti: c.premi_punti || 0, obiettivo_punti: obiettivoPunti,
        listino: LISTINO.map(({ nome, punti, alcolico }) => ({ nome, punti, alcolico })) };
    }
    function scheda(d, c) {
      const mov = d.movimenti.filter(m => m.cliente === c.numero).slice(-10).reverse()
        .map(m => ({ tipo: m.tipo, creato_il: m.creato_il, punti: m.punti, prodotto: m.prodotto, quantita: m.quantita, annullato: !!m.annullato }));
      return Object.assign(pubblico(c), { token: c.token, movimenti: mov, listino: LISTINO });
    }
    function staff() { if (!ls.get(SKEY)) throw errore("non_autorizzato"); }
    function trova(d, n) {
      const num = normalizzaNumero(n);
      const c = num && d.clienti.find(x => x.numero === num);
      if (!c) throw errore("tessera_non_trovata");
      return c;
    }
    function movimento(d, c, tipo, extra) { d.movimenti.push(Object.assign({ cliente: c.numero, tipo, creato_il: new Date().toISOString() }, extra || {})); }
    async function op(fn) { await attesa(); const d = db(); const r = fn(d); salva(d); return r; }

    return {
      demo: true,
      registra: (x) => op(d => {
        if (!x.consenso) throw errore("consenso_mancante");
        if (!String(x.nome || "").trim() || !String(x.cognome || "").trim()) throw errore("dati_mancanti");
        let numero;
        do {
          const v = String(Math.floor(Math.random() * 1e8)).padStart(8, "0");
          numero = "PRD-" + v.slice(0, 4) + "-" + v.slice(4);
        } while (d.clienti.some(c => c.numero === numero));
        const c = { numero, token: uuid(), nome: x.nome.trim().slice(0, 60), cognome: x.cognome.trim().slice(0, 60),
          nascita: x.nascita || null, timbri: 0, premi: 0, timbri_totali: 0, creato_il: new Date().toISOString(), ultimo_timbro: null };
        d.clienti.push(c);
        return Object.assign(pubblico(c), { token: c.token });
      }),
      leggi: (t) => op(d => { const c = d.clienti.find(x => x.token === t); return c ? pubblico(c) : null; }),
      aggiornaNome: (t, nome, cognome) => op(d => {
        const c = d.clienti.find(x => x.token === t); if (!c) throw errore("tessera_non_trovata");
        if (!nome.trim() || !cognome.trim()) throw errore("dati_mancanti");
        c.nome = nome.trim(); c.cognome = cognome.trim(); return pubblico(c);
      }),
      eliminaTessera: (t) => op(d => {
        const c = d.clienti.find(x => x.token === t); if (!c) return false;
        d.clienti = d.clienti.filter(x => x !== c); d.movimenti = d.movimenti.filter(m => m.cliente !== c.numero); return true;
      }),
      async login(email, password) {
        await attesa();
        if (password !== "demo") throw errore("login");
        ls.set(SKEY, { email: email || "demo@bar" }); return ls.get(SKEY);
      },
      async logout() { ls.del(SKEY); },
      async sessione() { return ls.get(SKEY); },
      cerca: (n) => op(d => { staff(); return scheda(d, trova(d, n)); }),
      timbro: (n) => op(d => {
        staff(); const c = trova(d, n);
        if (c.timbri >= obiettivo) throw errore("tessera_completa");
        c.timbri++; c.timbri_totali++; c.ultimo_timbro = new Date().toISOString(); movimento(d, c, "timbro");
        return scheda(d, c);
      }),
      premio: (n) => op(d => {
        staff(); const c = trova(d, n);
        if (c.timbri < obiettivo) throw errore("timbri_insufficienti");
        c.timbri = 0; c.premi++; movimento(d, c, "premio"); return scheda(d, c);
      }),
      annulla: (n) => op(d => {
        staff(); const c = trova(d, n);
        if (c.timbri <= 0) throw errore("nessun_timbro");
        c.timbri--; c.timbri_totali = Math.max(0, c.timbri_totali - 1); movimento(d, c, "annullato"); return scheda(d, c);
      }),
      punti: (n, prodotto, qta) => op(d => {
        staff(); const c = trova(d, n); qta = qta || 1;
        const p = LISTINO.find(x => x.id === prodotto); if (!p) throw errore("prodotto_non_valido");
        if (qta < 1 || qta > 20) throw errore("quantita_non_valida");
        if (p.alcolico && minorenne(c.nascita)) throw errore("minorenne");
        const tot = p.punti * qta;
        c.punti = (c.punti || 0) + tot; c.punti_totali = (c.punti_totali || 0) + tot; c.ultimo_timbro = new Date().toISOString();
        movimento(d, c, "punti", { punti: tot, prodotto: p.nome, quantita: qta }); return scheda(d, c);
      }),
      premioPunti: (n) => op(d => {
        staff(); const c = trova(d, n);
        if ((c.punti || 0) < obiettivoPunti) throw errore("punti_insufficienti");
        c.punti -= obiettivoPunti; c.premi_punti = (c.premi_punti || 0) + 1;
        movimento(d, c, "premio_punti", { punti: -obiettivoPunti }); return scheda(d, c);
      }),
      annullaPunti: (n) => op(d => {
        staff(); const c = trova(d, n);
        const m = d.movimenti.filter(x => x.cliente === c.numero && x.tipo === "punti" && !x.annullato).pop();
        if (!m) throw errore("nessun_punto");
        if ((c.punti || 0) < m.punti) throw errore("punti_gia_usati");
        m.annullato = true; c.punti -= m.punti; c.punti_totali = Math.max(0, c.punti_totali - m.punti);
        movimento(d, c, "punti_annullati", { punti: -m.punti, prodotto: m.prodotto, quantita: m.quantita }); return scheda(d, c);
      }),
      eliminaCliente: (n) => op(d => {
        staff(); const c = trova(d, n);
        d.clienti = d.clienti.filter(x => x !== c); d.movimenti = d.movimenti.filter(m => m.cliente !== c.numero); return true;
      }),
      pannello: () => op(d => {
        staff();
        const oggi = new Date(); oggi.setHours(0, 0, 0, 0);
        const sett = Date.now() - 7 * 864e5, mese = Date.now() - 30 * 864e5;
        const conta = (tipo, da) => d.movimenti.filter(m => m.tipo === tipo && new Date(m.creato_il) >= da).length;
        const somma = (tipi, da) => d.movimenti.filter(m => tipi.includes(m.tipo) && new Date(m.creato_il) >= da).reduce((s, m) => s + (m.punti || 0), 0);
        return {
          obiettivo, obiettivo_punti: obiettivoPunti,
          stats: {
            clienti: d.clienti.length,
            nuovi_30gg: d.clienti.filter(c => new Date(c.creato_il) > mese).length,
            timbri_oggi: conta("timbro", oggi) - conta("annullato", oggi),
            premi_oggi: conta("premio", oggi) + conta("premio_punti", oggi),
            punti_oggi: somma(["punti", "punti_annullati"], oggi),
            premi_punti_totali: d.clienti.reduce((s, c) => s + (c.premi_punti || 0), 0),
            timbri_7gg: conta("timbro", new Date(sett)) - conta("annullato", new Date(sett)),
            premi_totali: d.clienti.reduce((s, c) => s + c.premi, 0)
          },
          clienti: d.clienti.map(pubblico).sort((a, b) => new Date(b.ultimo_timbro || b.creato_il) - new Date(a.ultimo_timbro || a.creato_il))
        };
      })
    };
  }

  const usaSupabase = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);
  window.PradioAPI = {
    crea(opts) { return usaSupabase ? creaSupabase(opts || {}) : creaDemo(); },
    normalizzaNumero,
    messaggio: (e) => (e && e.code && MESSAGGI[e.code]) || MESSAGGI.sconosciuto
  };
})();
