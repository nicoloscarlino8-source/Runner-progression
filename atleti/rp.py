#!/usr/bin/env python3
"""Runner Progression - archivio atleti.

Raccoglie le attività dei tuoi atleti da Strava (e quindi anche da Garmin,
se l'atleta ha collegato Garmin Connect a Strava) oppure dagli export CSV di
Garmin Connect, e genera un report sui progressi per ogni atleta più una
dashboard riassuntiva.

Solo libreria standard di Python 3.9+: niente da installare.

Comandi principali (da lanciare dalla cartella del repository):

    python3 atleti/rp.py nuovo-atleta "Mario Rossi"
    python3 atleti/rp.py strava-link mario-rossi
    python3 atleti/rp.py strava-codice mario-rossi <codice>
    python3 atleti/rp.py sync                 # tutti gli atleti collegati
    python3 atleti/rp.py importa-garmin mario-rossi Activities.csv
    python3 atleti/rp.py report               # report + DASHBOARD.md

Vedi atleti/README.md per la guida completa.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path

BASE = Path(__file__).resolve().parent
SEGRETI = BASE / ".segreti"
CONFIG = SEGRETI / "config.json"
MODELLO = BASE / "_modello"

COLONNE = [
    "id", "fonte", "data", "sport", "titolo", "distanza_km", "durata_min",
    "dislivello_m", "fc_media", "fc_max", "passo_min_km", "cadenza", "sforzo",
]

STRAVA_AUTH = "https://www.strava.com/oauth/authorize"
STRAVA_TOKEN = "https://www.strava.com/oauth/token"
STRAVA_API = "https://www.strava.com/api/v3"
REDIRECT = "http://localhost/exchange_token"
SCOPE = "read,activity:read_all"


# --------------------------------------------------------------------------
# Utilità
# --------------------------------------------------------------------------

def slug(nome: str) -> str:
    s = unicodedata.normalize("NFKD", nome).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    if not s:
        sys.exit("Nome atleta non valido.")
    return s


def cartella_atleta(s: str) -> Path:
    p = BASE / s
    if not (p / "profilo.md").exists():
        sys.exit(f"Atleta '{s}' non trovato. Crealo con: python3 atleti/rp.py nuovo-atleta \"Nome Cognome\"")
    return p


def tutti_gli_atleti() -> list[str]:
    return sorted(
        p.name for p in BASE.iterdir()
        if p.is_dir() and not p.name.startswith((".", "_")) and (p / "profilo.md").exists()
    )


def numero(testo) -> float | None:
    """Converte '1.234,5' / '1,234.5' / '12,3' / '--' in float."""
    if testo is None:
        return None
    t = str(testo).strip().replace(" ", "").replace(" ", "")
    if t in ("", "--", "-", "None"):
        return None
    t = re.sub(r"[^0-9,.\-]", "", t)
    if not t:
        return None
    if "," in t and "." in t:
        # il separatore decimale è quello che compare per ultimo
        if t.rfind(",") > t.rfind("."):
            t = t.replace(".", "").replace(",", ".")
        else:
            t = t.replace(",", "")
    elif "," in t:
        parti = t.split(",")
        # "1,234" con tre cifre dopo la virgola = migliaia (tipico di dislivello/calorie)
        if len(parti) == 2 and len(parti[1]) == 3 and len(parti[0]) <= 3:
            t = t.replace(",", "")
        else:
            t = t.replace(",", ".")
    try:
        return float(t)
    except ValueError:
        return None


def intero(testo) -> float | None:
    """Per valori senza decimali (dislivello, FC, cadenza): '1.234' e '1,234' = 1234."""
    if testo is None:
        return None
    t = str(testo).strip()
    if re.fullmatch(r"\d{1,3}([.,]\d{3})+", t):
        t = re.sub(r"[.,]", "", t)
    return numero(t)


def durata_in_minuti(testo) -> float | None:
    """'1:02:03', '45:10', '1:02:03.4' -> minuti."""
    if not testo or str(testo).strip() in ("--", ""):
        return None
    parti = str(testo).strip().replace(",", ".").split(":")
    try:
        valori = [float(x) for x in parti]
    except ValueError:
        return None
    while len(valori) < 3:
        valori.insert(0, 0.0)
    h, m, s = valori[-3:]
    return h * 60 + m + s / 60


def passo(distanza_km, durata_min) -> str:
    if not distanza_km or not durata_min or distanza_km <= 0:
        return ""
    p = durata_min / distanza_km
    return f"{int(p)}:{int(round((p - int(p)) * 60)) % 60:02d}"


def fmt(v, cifre=1) -> str:
    if v is None or v == "":
        return ""
    if isinstance(v, float):
        return f"{v:.{cifre}f}"
    return str(v)


def leggi_attivita(cartella: Path) -> list[dict]:
    f = cartella / "attivita.csv"
    if not f.exists():
        return []
    with f.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def scrivi_attivita(cartella: Path, righe: list[dict]) -> None:
    righe.sort(key=lambda r: r["data"], reverse=True)
    with (cartella / "attivita.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=COLONNE, extrasaction="ignore")
        w.writeheader()
        w.writerows(righe)


def unisci(cartella: Path, nuove: list[dict]) -> tuple[int, int]:
    """Aggiunge le attività nuove evitando doppioni (stesso id, oppure stessa
    partenza al minuto ± 2 e distanza simile: la stessa uscita vista da Garmin
    e da Strava)."""
    esistenti = leggi_attivita(cartella)
    per_id = {r["id"]: r for r in esistenti}
    aggiunte = aggiornate = 0
    for n in nuove:
        if n["id"] in per_id:
            per_id[n["id"]].update(n)
            aggiornate += 1
            continue
        if doppione(n, per_id.values()):
            continue
        per_id[n["id"]] = n
        aggiunte += 1
    scrivi_attivita(cartella, list(per_id.values()))
    return aggiunte, aggiornate


def doppione(n: dict, esistenti) -> bool:
    try:
        tn = datetime.strptime(n["data"], "%Y-%m-%d %H:%M")
    except ValueError:
        return False
    dn = numero(n.get("distanza_km")) or 0
    for e in esistenti:
        try:
            te = datetime.strptime(e["data"], "%Y-%m-%d %H:%M")
        except ValueError:
            continue
        if abs((te - tn).total_seconds()) <= 120:
            de = numero(e.get("distanza_km")) or 0
            if max(dn, de) == 0 or abs(dn - de) / max(dn, de) < 0.05:
                return True
    return False


def e_corsa(sport: str) -> bool:
    s = (sport or "").lower()
    return any(k in s for k in ("run", "corsa", "trail", "tapis", "treadmill"))


# --------------------------------------------------------------------------
# Atleti
# --------------------------------------------------------------------------

def cmd_nuovo_atleta(args):
    s = slug(args.nome)
    p = BASE / s
    if (p / "profilo.md").exists():
        sys.exit(f"L'atleta '{s}' esiste già in {p}")
    p.mkdir(parents=True, exist_ok=True)
    for nome_file in ("profilo.md", "test.csv", "diario.md"):
        testo = (MODELLO / nome_file).read_text(encoding="utf-8")
        testo = testo.replace("{{NOME}}", args.nome).replace("{{OGGI}}", date.today().isoformat())
        (p / nome_file).write_text(testo, encoding="utf-8")
    scrivi_attivita(p, [])
    print(f"Creato atleta '{args.nome}' in atleti/{s}/")
    print(f"Prossimo passo: python3 atleti/rp.py strava-link {s}")


# --------------------------------------------------------------------------
# Strava
# --------------------------------------------------------------------------

def leggi_config() -> dict:
    if not CONFIG.exists():
        sys.exit(
            "Manca atleti/.segreti/config.json.\n"
            "Copia atleti/config.esempio.json in atleti/.segreti/config.json e inserisci\n"
            "client_id e client_secret della tua app Strava (vedi README)."
        )
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    if not cfg.get("client_id") or "INSERISCI" in str(cfg.get("client_secret", "")):
        sys.exit("Compila client_id e client_secret in atleti/.segreti/config.json")
    return cfg


def file_token(s: str) -> Path:
    return SEGRETI / f"strava_{s}.json"


def http_json(url: str, dati: dict | None = None, token: str | None = None):
    corpo = urllib.parse.urlencode(dati).encode() if dati is not None else None
    req = urllib.request.Request(url, data=corpo)
    req.add_header("User-Agent", "runner-progression-archivio/1.0")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        dettaglio = e.read().decode(errors="replace")[:500]
        if e.code == 429:
            sys.exit("Limite di richieste Strava raggiunto (100 ogni 15 minuti). Riprova tra un quarto d'ora.")
        sys.exit(f"Errore Strava {e.code}: {dettaglio}")


def cmd_strava_link(args):
    cfg = leggi_config()
    s = cartella_atleta(args.atleta).name
    q = urllib.parse.urlencode({
        "client_id": cfg["client_id"],
        "response_type": "code",
        "redirect_uri": REDIRECT,
        "approval_prompt": "force",
        "scope": SCOPE,
        "state": s,
    })
    print("Invia questo link all'atleta (deve aprirlo loggato nel SUO account Strava):\n")
    print(f"{STRAVA_AUTH}?{q}\n")
    print("Dopo aver cliccato 'Autorizza' il browser aprirà una pagina che NON si carica")
    print("(localhost): è normale. L'atleta ti manda l'indirizzo completo di quella pagina,")
    print("che contiene  ...&code=XXXXXXXX&...  . Poi lancia:\n")
    print(f"python3 atleti/rp.py strava-codice {s} \"<indirizzo o codice>\"")


def cmd_strava_codice(args):
    cfg = leggi_config()
    s = cartella_atleta(args.atleta).name
    codice = args.codice
    if "code=" in codice:
        qs = urllib.parse.parse_qs(urllib.parse.urlparse(codice).query)
        codice = qs.get("code", [""])[0]
        if "activity:read" not in qs.get("scope", [""])[0]:
            print("Attenzione: l'atleta non ha concesso l'accesso alle attività. Rimanda il link"
                  " e chiedi di lasciare spuntate tutte le caselle.")
    dati = http_json(STRAVA_TOKEN, {
        "client_id": cfg["client_id"],
        "client_secret": cfg["client_secret"],
        "code": codice,
        "grant_type": "authorization_code",
    })
    SEGRETI.mkdir(exist_ok=True)
    salva = {k: dati[k] for k in ("access_token", "refresh_token", "expires_at")}
    a = dati.get("athlete", {})
    salva["strava_athlete_id"] = a.get("id")
    file_token(s).write_text(json.dumps(salva, indent=2), encoding="utf-8")
    print(f"Collegato! Account Strava: {a.get('firstname', '')} {a.get('lastname', '')} (id {a.get('id')})")
    print(f"Ora scarica le attività con: python3 atleti/rp.py sync {s}")


def token_valido(s: str, cfg: dict) -> str | None:
    f = file_token(s)
    if not f.exists():
        return None
    t = json.loads(f.read_text(encoding="utf-8"))
    if t["expires_at"] - 300 < time.time():
        nuovo = http_json(STRAVA_TOKEN, {
            "client_id": cfg["client_id"],
            "client_secret": cfg["client_secret"],
            "grant_type": "refresh_token",
            "refresh_token": t["refresh_token"],
        })
        t.update({k: nuovo[k] for k in ("access_token", "refresh_token", "expires_at")})
        f.write_text(json.dumps(t, indent=2), encoding="utf-8")
    return t["access_token"]


def da_strava(a: dict) -> dict:
    km = (a.get("distance") or 0) / 1000
    minuti = (a.get("moving_time") or 0) / 60
    cad = a.get("average_cadence")
    sport = a.get("sport_type") or a.get("type") or ""
    if cad and e_corsa(sport):
        cad = cad * 2  # Strava dà i passi di una gamba sola per la corsa
    return {
        "id": f"strava-{a['id']}",
        "fonte": "strava",
        "data": (a.get("start_date_local") or "")[:16].replace("T", " "),
        "sport": sport,
        "titolo": a.get("name", ""),
        "distanza_km": fmt(round(km, 2), 2),
        "durata_min": fmt(round(minuti, 1)),
        "dislivello_m": fmt(a.get("total_elevation_gain"), 0),
        "fc_media": fmt(a.get("average_heartrate"), 0),
        "fc_max": fmt(a.get("max_heartrate"), 0),
        "passo_min_km": passo(km, minuti) if e_corsa(sport) else "",
        "cadenza": fmt(cad, 0),
        "sforzo": fmt(a.get("suffer_score"), 0),
    }


def cmd_sync(args):
    cfg = leggi_config()
    atleti = [cartella_atleta(args.atleta).name] if args.atleta else tutti_gli_atleti()
    collegati = [s for s in atleti if file_token(s).exists()]
    if not collegati:
        sys.exit("Nessun atleta collegato a Strava. Usa prima: python3 atleti/rp.py strava-link <atleta>")
    for s in collegati:
        cartella = BASE / s
        token = token_valido(s, cfg)
        strava = [r for r in leggi_attivita(cartella) if r["fonte"] == "strava"]
        if args.da:
            inizio = datetime.strptime(args.da, "%Y-%m-%d")
        elif strava:
            # un giorno di margine: start_date_local non è in UTC, i doppioni li scarta unisci()
            inizio = datetime.strptime(max(r["data"] for r in strava), "%Y-%m-%d %H:%M") - timedelta(days=1)
        else:
            inizio = datetime.now() - timedelta(days=365)
        dopo = int(inizio.timestamp())
        nuove, pagina = [], 1
        while True:
            url = f"{STRAVA_API}/athlete/activities?" + urllib.parse.urlencode(
                {"after": dopo, "per_page": 200, "page": pagina})
            blocco = http_json(url, token=token)
            if not blocco:
                break
            nuove += [da_strava(a) for a in blocco]
            pagina += 1
        agg, upd = unisci(cartella, nuove)
        print(f"{s}: {agg} attività nuove, {upd} aggiornate (dal {inizio:%d/%m/%Y})")
    if not args.senza_report:
        cmd_report(argparse.Namespace(atleta=None))


# --------------------------------------------------------------------------
# Garmin (export CSV da Garmin Connect)
# --------------------------------------------------------------------------

# Intestazioni Garmin Connect in inglese e in italiano -> nostre colonne
MAPPA_GARMIN = {
    "sport": ["activity type", "tipo di attività", "tipo attività"],
    "data": ["date", "data"],
    "titolo": ["title", "titolo"],
    "distanza_km": ["distance", "distanza"],
    "tempo": ["moving time", "tempo in movimento", "time", "tempo"],
    "dislivello_m": ["total ascent", "ascesa totale", "salita totale", "dislivello positivo"],
    "fc_media": ["avg hr", "fc media", "frequenza cardiaca media"],
    "fc_max": ["max hr", "fc max", "fc massima", "frequenza cardiaca massima"],
    "cadenza": ["avg run cadence", "cadenza di corsa media", "cadenza media di corsa", "cadenza media"],
}


def trova_colonna(intestazioni: list[str], alternative: list[str]) -> str | None:
    norm = {h.strip().lower(): h for h in intestazioni}
    for alt in alternative:
        if alt in norm:
            return norm[alt]
    return None


def leggi_data_garmin(testo: str) -> str:
    testo = (testo or "").strip()
    for formato in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%d/%m/%Y %H:%M:%S",
                    "%d/%m/%Y %H:%M", "%m/%d/%Y %H:%M:%S", "%m/%d/%Y %H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(testo, formato).strftime("%Y-%m-%d %H:%M")
        except ValueError:
            continue
    return ""


def cmd_importa_garmin(args):
    cartella = cartella_atleta(args.atleta)
    f = Path(args.file).expanduser()
    if not f.exists():
        sys.exit(f"File non trovato: {f}")
    testo = f.read_text(encoding="utf-8-sig")
    separatore = ";" if testo.splitlines()[0].count(";") > testo.splitlines()[0].count(",") else ","
    lettore = csv.DictReader(testo.splitlines(), delimiter=separatore)
    col = {k: trova_colonna(lettore.fieldnames or [], v) for k, v in MAPPA_GARMIN.items()}
    if not col["data"] or not col["distanza_km"]:
        sys.exit("Non riconosco questo CSV: servono almeno le colonne Data e Distanza "
                 "(export 'Attività' di Garmin Connect).")
    nuove, scartate = [], 0
    for r in lettore:
        quando = leggi_data_garmin(r.get(col["data"], ""))
        if not quando:
            scartate += 1
            continue
        sport = r.get(col["sport"], "") if col["sport"] else ""
        km = numero(r.get(col["distanza_km"]))
        if km and km > 500:  # nuoto o export in metri
            km = km / 1000
        minuti = durata_in_minuti(r.get(col["tempo"])) if col["tempo"] else None
        nuove.append({
            "id": f"garmin-{quando.replace(' ', 'T')}-{km or 0:.2f}",
            "fonte": "garmin",
            "data": quando,
            "sport": sport,
            "titolo": r.get(col["titolo"], "") if col["titolo"] else "",
            "distanza_km": fmt(km, 2) if km is not None else "",
            "durata_min": fmt(minuti) if minuti else "",
            "dislivello_m": fmt(intero(r.get(col["dislivello_m"])), 0) if col["dislivello_m"] else "",
            "fc_media": fmt(intero(r.get(col["fc_media"])), 0) if col["fc_media"] else "",
            "fc_max": fmt(intero(r.get(col["fc_max"])), 0) if col["fc_max"] else "",
            "passo_min_km": passo(km, minuti) if e_corsa(sport) else "",
            "cadenza": fmt(intero(r.get(col["cadenza"])), 0) if col["cadenza"] else "",
            "sforzo": "",
        })
    agg, upd = unisci(cartella, nuove)
    print(f"{cartella.name}: {agg} attività nuove, {upd} aggiornate, "
          f"{len(nuove) - agg - upd} doppioni saltati, {scartate} righe illeggibili")
    cmd_report(argparse.Namespace(atleta=None))


# --------------------------------------------------------------------------
# Report
# --------------------------------------------------------------------------

def lunedi(d: date) -> date:
    return d - timedelta(days=d.weekday())


def statistiche(righe: list[dict], oggi: date) -> dict:
    att = []
    for r in righe:
        try:
            d = datetime.strptime(r["data"], "%Y-%m-%d %H:%M")
        except ValueError:
            continue
        att.append({
            **r, "_dt": d, "_km": numero(r["distanza_km"]) or 0,
            "_min": numero(r["durata_min"]) or 0, "_dplus": numero(r["dislivello_m"]) or 0,
            "_fc": numero(r["fc_media"]), "_corsa": e_corsa(r["sport"]),
        })

    settimane = {}
    inizio = lunedi(oggi)
    for i in range(12):
        settimane[inizio - timedelta(weeks=i)] = {"n": 0, "km": 0.0, "dplus": 0.0, "min": 0.0,
                                                  "min_tot": 0.0, "fc": [], "lungo": 0.0}
    for a in att:
        w = lunedi(a["_dt"].date())
        if w in settimane:
            s = settimane[w]
            s["min_tot"] += a["_min"]
            if a["_corsa"]:
                s["n"] += 1
                s["km"] += a["_km"]
                s["dplus"] += a["_dplus"]
                s["min"] += a["_min"]
                s["lungo"] = max(s["lungo"], a["_km"])
                if a["_fc"]:
                    s["fc"].append(a["_fc"])

    # Rapporto carico acuto/cronico sui minuti totali di allenamento (ultimi 7 vs media 28 giorni)
    def minuti_tra(da: date, a: date) -> float:
        return sum(x["_min"] for x in att if da <= x["_dt"].date() <= a)

    acuto = minuti_tra(oggi - timedelta(days=6), oggi)
    cronico = minuti_tra(oggi - timedelta(days=27), oggi) / 4
    acwr = acuto / cronico if cronico > 0 else None

    mesi = {}
    for a in att:
        if a["_corsa"]:
            k = a["_dt"].strftime("%Y-%m")
            m = mesi.setdefault(k, {"n": 0, "km": 0.0, "dplus": 0.0, "min": 0.0})
            m["n"] += 1
            m["km"] += a["_km"]
            m["dplus"] += a["_dplus"]
            m["min"] += a["_min"]

    corse = [a for a in att if a["_corsa"] and a["_km"] > 0 and a["_min"] > 0]
    record = {}
    for nome, minimo in (("5 km+", 5), ("10 km+", 10), ("21 km+", 21)):
        cand = [a for a in corse if a["_km"] >= minimo]
        if cand:
            record[nome] = min(cand, key=lambda a: a["_min"] / a["_km"])
    piu_lunga = max(corse, key=lambda a: a["_km"]) if corse else None
    piu_dplus = max(corse, key=lambda a: a["_dplus"]) if corse else None

    return {"att": att, "settimane": settimane, "acwr": acwr, "acuto": acuto, "cronico": cronico,
            "mesi": mesi, "record": record, "piu_lunga": piu_lunga, "piu_dplus": piu_dplus,
            "ultima": max((a["_dt"] for a in att), default=None)}


def giudizio_acwr(acwr) -> str:
    if acwr is None:
        return "n.d."
    if acwr > 1.5:
        return f"{acwr:.2f} ⚠️ picco di carico"
    if acwr < 0.8:
        return f"{acwr:.2f} ↓ scarico / stop"
    return f"{acwr:.2f} ✅"


def ore(minuti: float) -> str:
    return f"{int(minuti // 60)}h{int(minuti % 60):02d}"


def leggi_test(cartella: Path) -> list[dict]:
    f = cartella / "test.csv"
    if not f.exists():
        return []
    with f.open(newline="", encoding="utf-8") as fh:
        return [r for r in csv.DictReader(fh) if (r.get("data") or "").strip()
                and not r["data"].startswith("#")]


def nome_atleta(cartella: Path) -> str:
    prima = (cartella / "profilo.md").read_text(encoding="utf-8").splitlines()[0]
    return prima.lstrip("# ").strip() or cartella.name


def scrivi_report(cartella: Path, st: dict, oggi: date) -> None:
    nome = nome_atleta(cartella)
    L = [f"# Progressi - {nome}", "",
         f"_Aggiornato il {oggi:%d/%m/%Y} · {len(st['att'])} attività in archivio · "
         f"ultima: {st['ultima']:%d/%m/%Y}_" if st["ultima"] else f"_Aggiornato il {oggi:%d/%m/%Y} · nessuna attività_",
         "", "> File generato automaticamente da `rp.py report`: non modificarlo a mano "
         "(le tue note vanno in `diario.md`).", ""]

    L += ["## Carico", "",
          f"- **Ultimi 7 giorni:** {ore(st['acuto'])} di allenamento (tutti gli sport)",
          f"- **Media settimanale ultime 4 settimane:** {ore(st['cronico'])}",
          f"- **Rapporto acuto/cronico (ACWR):** {giudizio_acwr(st['acwr'])}  ",
          "  _Indicativo: 0,8–1,3 zona di progressione tranquilla; sopra 1,5 aumento brusco "
          "da tenere d'occhio._", ""]

    L += ["## Ultime 12 settimane (solo corsa)", "",
          "| Settimana | Uscite | Km | D+ m | Tempo | Lungo km | FC media |",
          "|---|---:|---:|---:|---:|---:|---:|"]
    for w, s in st["settimane"].items():
        fc = f"{sum(s['fc']) / len(s['fc']):.0f}" if s["fc"] else ""
        L.append(f"| {w:%d/%m} | {s['n']} | {s['km']:.1f} | {s['dplus']:.0f} | {ore(s['min'])} | "
                 f"{s['lungo']:.1f} | {fc} |")
    L.append("")

    if st["mesi"]:
        L += ["## Mese per mese (solo corsa)", "",
              "| Mese | Uscite | Km | D+ m | Tempo |", "|---|---:|---:|---:|---:|"]
        for k in sorted(st["mesi"], reverse=True)[:12]:
            m = st["mesi"][k]
            L.append(f"| {k} | {m['n']} | {m['km']:.1f} | {m['dplus']:.0f} | {ore(m['min'])} |")
        L.append("")

    L += ["## Migliori prestazioni in archivio", ""]
    for nome_r, a in st["record"].items():
        L.append(f"- **Passo più veloce su uscita da {nome_r}:** {passo(a['_km'], a['_min'])} /km "
                 f"({a['_km']:.1f} km, {a['_dt']:%d/%m/%Y}, \"{a['titolo']}\")")
    if st["piu_lunga"]:
        a = st["piu_lunga"]
        L.append(f"- **Uscita più lunga:** {a['_km']:.1f} km ({a['_dt']:%d/%m/%Y}, \"{a['titolo']}\")")
    if st["piu_dplus"] and st["piu_dplus"]["_dplus"] > 0:
        a = st["piu_dplus"]
        L.append(f"- **Più dislivello:** {a['_dplus']:.0f} m D+ ({a['_dt']:%d/%m/%Y}, \"{a['titolo']}\")")
    if not st["record"] and not st["piu_lunga"]:
        L.append("_Nessuna corsa in archivio._")
    L.append("")

    test = leggi_test(cartella)
    if test:
        L += ["## Test atletici", "", "| Data | Test | Risultato | Unità | Note |", "|---|---|---|---|---|"]
        for t in sorted(test, key=lambda t: t["data"], reverse=True):
            L.append(f"| {t['data']} | {t.get('test', '')} | {t.get('risultato', '')} | "
                     f"{t.get('unita', '')} | {t.get('note', '')} |")
        L.append("")

    L += ["## Ultime 10 attività", "",
          "| Data | Sport | Titolo | Km | Tempo | D+ | Passo | FC |", "|---|---|---|---:|---:|---:|---:|---:|"]
    for a in sorted(st["att"], key=lambda a: a["_dt"], reverse=True)[:10]:
        titolo = a["titolo"].replace("|", "/")
        L.append(f"| {a['_dt']:%d/%m %H:%M} | {a['sport']} | {titolo} | {a['_km']:.1f} | "
                 f"{ore(a['_min'])} | {a['_dplus']:.0f} | {a['passo_min_km']} | {a['fc_media']} |")
    L.append("")
    (cartella / "report.md").write_text("\n".join(L), encoding="utf-8")


def cmd_report(args):
    oggi = date.today()
    atleti = [cartella_atleta(args.atleta).name] if args.atleta else tutti_gli_atleti()
    righe_dash = []
    for s in atleti:
        cartella = BASE / s
        st = statistiche(leggi_attivita(cartella), oggi)
        scrivi_report(cartella, st, oggi)
        sett = list(st["settimane"].values())
        km_4 = sum(x["km"] for x in sett[:4]) / 4
        ultima = f"{st['ultima']:%d/%m/%Y}" if st["ultima"] else "—"
        fonte = "Strava" if file_token(s).exists() else "manuale"
        righe_dash.append(
            f"| [{nome_atleta(cartella)}]({s}/report.md) | {ultima} | {sett[0]['km']:.1f} | "
            f"{sett[1]['km']:.1f} | {km_4:.1f} | {sett[0]['dplus']:.0f} | "
            f"{giudizio_acwr(st['acwr'])} | {fonte} |")
    if args.atleta:
        print(f"Report aggiornato: atleti/{args.atleta}/report.md")
        return
    D = ["# Dashboard atleti - Runner Progression", "",
         f"_Aggiornata il {oggi:%d/%m/%Y}. Km e D+ si riferiscono alla sola corsa; "
         "l'ACWR usa i minuti di tutti gli sport._", "",
         "| Atleta | Ultima attività | Km questa sett. | Km sett. scorsa | Media km 4 sett. | "
         "D+ questa sett. | ACWR | Dati |",
         "|---|---|---:|---:|---:|---:|---|---|"]
    D += righe_dash or ["| _nessun atleta: usa `rp.py nuovo-atleta`_ | | | | | | | |"]
    D.append("")
    (BASE / "DASHBOARD.md").write_text("\n".join(D), encoding="utf-8")
    print(f"Report aggiornati per {len(atleti)} atleti. Riepilogo: atleti/DASHBOARD.md")


# --------------------------------------------------------------------------

def main():
    p = argparse.ArgumentParser(description="Runner Progression - archivio atleti")
    sub = p.add_subparsers(dest="comando", required=True)

    a = sub.add_parser("nuovo-atleta", help="crea la cartella di un nuovo atleta")
    a.add_argument("nome")
    a.set_defaults(f=cmd_nuovo_atleta)

    a = sub.add_parser("strava-link", help="genera il link di autorizzazione da mandare all'atleta")
    a.add_argument("atleta")
    a.set_defaults(f=cmd_strava_link)

    a = sub.add_parser("strava-codice", help="salva l'autorizzazione Strava dell'atleta")
    a.add_argument("atleta")
    a.add_argument("codice", help="il codice o l'intero indirizzo della pagina localhost")
    a.set_defaults(f=cmd_strava_codice)

    a = sub.add_parser("sync", help="scarica le attività nuove da Strava")
    a.add_argument("atleta", nargs="?")
    a.add_argument("--da", help="scarica dal giorno indicato (AAAA-MM-GG)")
    a.add_argument("--senza-report", action="store_true")
    a.set_defaults(f=cmd_sync)

    a = sub.add_parser("importa-garmin", help="importa un export CSV di Garmin Connect")
    a.add_argument("atleta")
    a.add_argument("file")
    a.set_defaults(f=cmd_importa_garmin)

    a = sub.add_parser("report", help="rigenera report e dashboard")
    a.add_argument("atleta", nargs="?")
    a.set_defaults(f=cmd_report)

    args = p.parse_args()
    if getattr(args, "atleta", None):
        args.atleta = slug(args.atleta)
    args.f(args)


if __name__ == "__main__":
    main()
