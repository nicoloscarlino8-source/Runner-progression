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
    "non_autorizzato", "consenso_mancante", "dati_mancanti", "troppe_richieste"
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
      eliminaCliente: (n) => rpc("elimina_cliente", { p_numero: n }),
      pannello: () => rpc("pannello")
    };
  }

  /* ------------------------------------------------------------------
     DEMO (localStorage) – stessa logica del database, solo in locale
     ------------------------------------------------------------------ */
  function creaDemo() {
    const KEY = "pradio-demo-db", SKEY = "pradio-demo-staff";
    const obiettivo = CFG.timbriDemo || 10;
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
        timbri_totali: c.timbri_totali, creato_il: c.creato_il, ultimo_timbro: c.ultimo_timbro, obiettivo };
    }
    function scheda(d, c) {
      const mov = d.movimenti.filter(m => m.cliente === c.numero).slice(-8).reverse().map(m => ({ tipo: m.tipo, creato_il: m.creato_il }));
      return Object.assign(pubblico(c), { token: c.token, movimenti: mov });
    }
    function staff() { if (!ls.get(SKEY)) throw errore("non_autorizzato"); }
    function trova(d, n) {
      const num = normalizzaNumero(n);
      const c = num && d.clienti.find(x => x.numero === num);
      if (!c) throw errore("tessera_non_trovata");
      return c;
    }
    function movimento(d, c, tipo) { d.movimenti.push({ cliente: c.numero, tipo, creato_il: new Date().toISOString() }); }
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
      eliminaCliente: (n) => op(d => {
        staff(); const c = trova(d, n);
        d.clienti = d.clienti.filter(x => x !== c); d.movimenti = d.movimenti.filter(m => m.cliente !== c.numero); return true;
      }),
      pannello: () => op(d => {
        staff();
        const oggi = new Date(); oggi.setHours(0, 0, 0, 0);
        const sett = Date.now() - 7 * 864e5, mese = Date.now() - 30 * 864e5;
        const conta = (tipo, da) => d.movimenti.filter(m => m.tipo === tipo && new Date(m.creato_il) >= da).length;
        return {
          obiettivo,
          stats: {
            clienti: d.clienti.length,
            nuovi_30gg: d.clienti.filter(c => new Date(c.creato_il) > mese).length,
            timbri_oggi: conta("timbro", oggi) - conta("annullato", oggi),
            premi_oggi: conta("premio", oggi),
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
