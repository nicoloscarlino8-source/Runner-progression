-- =====================================================================
--  TESSERA DIGITALE BAR PRADIO – database Supabase
--  Incolla tutto questo file in Supabase → SQL Editor → "Run".
--  Si può rieseguire senza problemi (non cancella i dati esistenti):
--  rieseguilo anche per aggiornare un database creato con una versione precedente.
-- =====================================================================

-- ---------- Tabelle ----------

create table if not exists public.impostazioni (
  id                 int primary key default 1 check (id = 1),
  timbri_per_premio  int not null default 10 check (timbri_per_premio between 1 and 50)
);
alter table public.impostazioni add column if not exists punti_per_premio int not null default 50;
alter table public.impostazioni drop constraint if exists impostazioni_punti_check;
alter table public.impostazioni add constraint impostazioni_punti_check check (punti_per_premio between 1 and 10000);
insert into public.impostazioni (id) values (1) on conflict (id) do nothing;

create table if not exists public.clienti (
  id               uuid primary key default gen_random_uuid(),
  numero           text not null unique,                     -- es. PRD-1234-5678 (è nel QR code)
  token            uuid not null unique default gen_random_uuid(), -- chiave segreta salvata sul telefono del cliente
  nome             text not null check (char_length(nome) between 1 and 60),
  cognome          text not null check (char_length(cognome) between 1 and 60),
  nascita          date,
  timbri           int  not null default 0 check (timbri >= 0),
  premi            int  not null default 0 check (premi >= 0),
  timbri_totali    int  not null default 0 check (timbri_totali >= 0),
  consenso_privacy timestamptz not null,
  creato_il        timestamptz not null default now(),
  ultimo_timbro    timestamptz
);
-- raccolta punti (bevande)
alter table public.clienti add column if not exists punti        int not null default 0;
alter table public.clienti add column if not exists punti_totali int not null default 0;
alter table public.clienti add column if not exists premi_punti  int not null default 0;
alter table public.clienti drop constraint if exists clienti_punti_check;
alter table public.clienti add constraint clienti_punti_check check (punti >= 0 and punti_totali >= 0 and premi_punti >= 0);

create table if not exists public.movimenti (
  id          bigint generated always as identity primary key,
  cliente_id  uuid not null references public.clienti(id) on delete cascade,
  tipo        text not null,
  operatore   uuid,
  creato_il   timestamptz not null default now()
);
alter table public.movimenti add column if not exists punti     int;
alter table public.movimenti add column if not exists prodotto  text;
alter table public.movimenti add column if not exists quantita  int;
alter table public.movimenti add column if not exists annullato boolean not null default false;
alter table public.movimenti drop constraint if exists movimenti_tipo_check;
alter table public.movimenti add constraint movimenti_tipo_check
  check (tipo in ('timbro', 'premio', 'annullato', 'punti', 'premio_punti', 'punti_annullati'));
create index if not exists movimenti_cliente_idx on public.movimenti (cliente_id, creato_il desc);
create index if not exists movimenti_data_idx on public.movimenti (creato_il desc);

-- Listino punti: modificalo da Supabase → Table Editor → prodotti_punti
create table if not exists public.prodotti_punti (
  id        bigint generated always as identity primary key,
  nome      text not null check (char_length(nome) between 1 and 40),
  punti     int  not null check (punti between 1 and 1000),
  alcolico  boolean not null default true,
  attivo    boolean not null default true,
  ordine    int not null default 0
);
insert into public.prodotti_punti (nome, punti, alcolico, ordine)
select * from (values
  ('Superalcolico', 5, true, 1),
  ('Cocktail',      5, true, 2),
  ('Amaro',         3, true, 3),
  ('Spritz / Aperitivo', 3, true, 4),
  ('Birra',         2, true, 5),
  ('Calice di vino', 2, true, 6),
  ('Analcolico / Succo', 1, false, 7)
) v(nome, punti, alcolico, ordine)
where not exists (select 1 from public.prodotti_punti);

-- Chi lavora al bar: solo questi utenti possono mettere timbri/punti e vedere i clienti
create table if not exists public.staff (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  nome     text
);

-- Nessun accesso diretto alle tabelle: tutto passa dalle funzioni qui sotto
alter table public.impostazioni   enable row level security;
alter table public.clienti        enable row level security;
alter table public.movimenti      enable row level security;
alter table public.staff          enable row level security;
alter table public.prodotti_punti enable row level security;
revoke all on public.impostazioni, public.clienti, public.movimenti, public.staff, public.prodotti_punti from anon, authenticated;

-- ---------- Funzioni di supporto ----------

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where user_id = auth.uid());
$$;

create or replace function public._richiedi_staff() returns void
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_staff() then
    raise exception 'non_autorizzato' using errcode = '42501';
  end if;
end $$;

create or replace function public._obiettivo() returns int
language sql stable security definer set search_path = public as $$
  select timbri_per_premio from impostazioni where id = 1;
$$;

create or replace function public._obiettivo_punti() returns int
language sql stable security definer set search_path = public as $$
  select punti_per_premio from impostazioni where id = 1;
$$;

create or replace function public._listino(con_id boolean) returns json
language sql stable security definer set search_path = public as $$
  select coalesce(json_agg(
    case when con_id
      then json_build_object('id', id, 'nome', nome, 'punti', punti, 'alcolico', alcolico)
      else json_build_object('nome', nome, 'punti', punti, 'alcolico', alcolico) end
    order by ordine, id), '[]'::json)
  from prodotti_punti where attivo;
$$;

-- Dati della tessera visibili al cliente
create or replace function public._tessera_json(c public.clienti) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'numero', c.numero, 'nome', c.nome, 'cognome', c.cognome, 'nascita', c.nascita,
    'timbri', c.timbri, 'premi', c.premi, 'timbri_totali', c.timbri_totali,
    'creato_il', c.creato_il, 'ultimo_timbro', c.ultimo_timbro,
    'obiettivo', public._obiettivo(),
    'punti', c.punti, 'punti_totali', c.punti_totali, 'premi_punti', c.premi_punti,
    'obiettivo_punti', public._obiettivo_punti(),
    'listino', public._listino(false)
  );
$$;

-- Dati visibili allo staff (in più: token per il link di recupero, ultimi movimenti, listino con id)
create or replace function public._scheda_staff(c public.clienti) returns json
language sql stable security definer set search_path = public as $$
  select (public._tessera_json(c)::jsonb || jsonb_build_object(
    'token', c.token,
    'listino', public._listino(true),
    'movimenti', coalesce((
      select json_agg(json_build_object('tipo', m.tipo, 'creato_il', m.creato_il, 'punti', m.punti,
                                        'prodotto', m.prodotto, 'quantita', m.quantita, 'annullato', m.annullato)
                      order by m.creato_il desc, m.id desc)
      from (select * from movimenti where cliente_id = c.id order by creato_il desc, id desc limit 10) m
    ), '[]'::json)
  ))::json;
$$;

create or replace function public._nuovo_numero() returns text
language plpgsql volatile security definer set search_path = public as $$
declare n text;
begin
  loop
    n := lpad((floor(random() * 100000000))::bigint::text, 8, '0');
    n := 'PRD-' || substr(n, 1, 4) || '-' || substr(n, 5, 4);
    exit when not exists (select 1 from clienti where numero = n);
  end loop;
  return n;
end $$;

create or replace function public._trova(p_numero text) returns public.clienti
language plpgsql stable security definer set search_path = public as $$
declare c clienti; v text;
begin
  -- accetta "PRD-1234-5678", "prd12345678", "1234 5678"...
  v := regexp_replace(upper(coalesce(p_numero, '')), '[^0-9]', '', 'g');
  if char_length(v) <> 8 then
    raise exception 'tessera_non_trovata' using errcode = 'P0002';
  end if;
  select * into c from clienti where numero = 'PRD-' || substr(v, 1, 4) || '-' || substr(v, 5, 4);
  if not found then
    raise exception 'tessera_non_trovata' using errcode = 'P0002';
  end if;
  return c;
end $$;

-- ---------- Funzioni per il CLIENTE (non serve login) ----------

create or replace function public.registra_cliente(p_nome text, p_cognome text, p_nascita date default null, p_consenso boolean default false)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti;
begin
  if not coalesce(p_consenso, false) then
    raise exception 'consenso_mancante' using errcode = '22023';
  end if;
  if char_length(trim(coalesce(p_nome, ''))) = 0 or char_length(trim(coalesce(p_cognome, ''))) = 0 then
    raise exception 'dati_mancanti' using errcode = '22023';
  end if;
  if p_nascita is not null and (p_nascita > current_date or p_nascita < date '1900-01-01') then
    p_nascita := null;
  end if;
  -- freno anti-spam: massimo 60 nuove tessere ogni 10 minuti
  if (select count(*) from clienti where creato_il > now() - interval '10 minutes') >= 60 then
    raise exception 'troppe_richieste' using errcode = '53400';
  end if;

  -- conservazione dati (vedi privacy.html): via le tessere inattive da 24 mesi
  delete from clienti where coalesce(ultimo_timbro, creato_il) < now() - interval '24 months';

  insert into clienti (numero, nome, cognome, nascita, consenso_privacy)
  values (public._nuovo_numero(), left(trim(p_nome), 60), left(trim(p_cognome), 60), p_nascita, now())
  returning * into c;

  return (public._tessera_json(c)::jsonb || jsonb_build_object('token', c.token))::json;
end $$;

create or replace function public.leggi_tessera(p_token uuid)
returns json language plpgsql stable security definer set search_path = public as $$
declare c clienti;
begin
  select * into c from clienti where token = p_token;
  if not found then return null; end if;
  return public._tessera_json(c);
end $$;

create or replace function public.aggiorna_nome(p_token uuid, p_nome text, p_cognome text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti;
begin
  if char_length(trim(coalesce(p_nome, ''))) = 0 or char_length(trim(coalesce(p_cognome, ''))) = 0 then
    raise exception 'dati_mancanti' using errcode = '22023';
  end if;
  update clienti set nome = left(trim(p_nome), 60), cognome = left(trim(p_cognome), 60)
  where token = p_token returning * into c;
  if not found then raise exception 'tessera_non_trovata' using errcode = 'P0002'; end if;
  return public._tessera_json(c);
end $$;

-- Diritto alla cancellazione (GDPR): il cliente elimina la propria tessera
create or replace function public.elimina_tessera(p_token uuid)
returns boolean language plpgsql volatile security definer set search_path = public as $$
begin
  delete from clienti where token = p_token;
  return found;
end $$;

-- ---------- Funzioni per lo STAFF (serve login) ----------

create or replace function public.cerca_cliente(p_numero text)
returns json language plpgsql stable security definer set search_path = public as $$
begin
  perform public._richiedi_staff();
  return public._scheda_staff(public._trova(p_numero));
end $$;

-- ===== Timbri caffetteria =====

create or replace function public.aggiungi_timbro(p_numero text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti;
begin
  perform public._richiedi_staff();
  c := public._trova(p_numero);
  if c.timbri >= public._obiettivo() then
    raise exception 'tessera_completa' using errcode = '22023';
  end if;
  update clienti set timbri = timbri + 1, timbri_totali = timbri_totali + 1, ultimo_timbro = now()
  where id = c.id returning * into c;
  insert into movimenti (cliente_id, tipo, operatore) values (c.id, 'timbro', auth.uid());
  return public._scheda_staff(c);
end $$;

create or replace function public.riscatta_premio(p_numero text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti;
begin
  perform public._richiedi_staff();
  c := public._trova(p_numero);
  if c.timbri < public._obiettivo() then
    raise exception 'timbri_insufficienti' using errcode = '22023';
  end if;
  update clienti set timbri = 0, premi = premi + 1 where id = c.id returning * into c;
  insert into movimenti (cliente_id, tipo, operatore) values (c.id, 'premio', auth.uid());
  return public._scheda_staff(c);
end $$;

-- Toglie l'ultimo timbro (in caso di errore alla cassa)
create or replace function public.annulla_timbro(p_numero text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti;
begin
  perform public._richiedi_staff();
  c := public._trova(p_numero);
  if c.timbri <= 0 then
    raise exception 'nessun_timbro' using errcode = '22023';
  end if;
  update clienti set timbri = timbri - 1, timbri_totali = greatest(timbri_totali - 1, 0)
  where id = c.id returning * into c;
  insert into movimenti (cliente_id, tipo, operatore) values (c.id, 'annullato', auth.uid());
  return public._scheda_staff(c);
end $$;

-- ===== Punti bevande =====

create or replace function public.aggiungi_punti(p_numero text, p_prodotto bigint, p_quantita int default 1)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti; p prodotti_punti; tot int;
begin
  perform public._richiedi_staff();
  c := public._trova(p_numero);
  select * into p from prodotti_punti where id = p_prodotto and attivo;
  if not found then
    raise exception 'prodotto_non_valido' using errcode = '22023';
  end if;
  if p_quantita is null or p_quantita < 1 or p_quantita > 20 then
    raise exception 'quantita_non_valida' using errcode = '22023';
  end if;
  -- se la data di nascita è nota, niente punti su alcolici ai minorenni
  if p.alcolico and c.nascita is not null and c.nascita > (current_date - interval '18 years')::date then
    raise exception 'minorenne' using errcode = '22023';
  end if;
  tot := p.punti * p_quantita;
  update clienti set punti = punti + tot, punti_totali = punti_totali + tot, ultimo_timbro = now()
  where id = c.id returning * into c;
  insert into movimenti (cliente_id, tipo, operatore, punti, prodotto, quantita)
  values (c.id, 'punti', auth.uid(), tot, p.nome, p_quantita);
  return public._scheda_staff(c);
end $$;

create or replace function public.riscatta_premio_punti(p_numero text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti; ob int := public._obiettivo_punti();
begin
  perform public._richiedi_staff();
  c := public._trova(p_numero);
  if c.punti < ob then
    raise exception 'punti_insufficienti' using errcode = '22023';
  end if;
  -- i punti in eccesso restano sulla tessera
  update clienti set punti = punti - ob, premi_punti = premi_punti + 1 where id = c.id returning * into c;
  insert into movimenti (cliente_id, tipo, operatore, punti) values (c.id, 'premio_punti', auth.uid(), -ob);
  return public._scheda_staff(c);
end $$;

-- Annulla l'ultima aggiunta di punti (in caso di errore alla cassa)
create or replace function public.annulla_punti(p_numero text)
returns json language plpgsql volatile security definer set search_path = public as $$
declare c clienti; m movimenti;
begin
  perform public._richiedi_staff();
  c := public._trova(p_numero);
  select * into m from movimenti
  where cliente_id = c.id and tipo = 'punti' and not annullato
  order by creato_il desc, id desc limit 1;
  if not found then
    raise exception 'nessun_punto' using errcode = '22023';
  end if;
  if c.punti < m.punti then
    raise exception 'punti_gia_usati' using errcode = '22023';
  end if;
  update movimenti set annullato = true where id = m.id;
  update clienti set punti = punti - m.punti, punti_totali = greatest(punti_totali - m.punti, 0)
  where id = c.id returning * into c;
  insert into movimenti (cliente_id, tipo, operatore, punti, prodotto, quantita)
  values (c.id, 'punti_annullati', auth.uid(), -m.punti, m.prodotto, m.quantita);
  return public._scheda_staff(c);
end $$;

create or replace function public.elimina_cliente(p_numero text)
returns boolean language plpgsql volatile security definer set search_path = public as $$
declare c clienti;
begin
  perform public._richiedi_staff();
  c := public._trova(p_numero);
  delete from clienti where id = c.id;
  return true;
end $$;

-- Elenco clienti + statistiche per il pannello del titolare
create or replace function public.pannello()
returns json language plpgsql stable security definer set search_path = public as $$
declare oggi timestamptz := date_trunc('day', now() at time zone 'Europe/Rome') at time zone 'Europe/Rome';
begin
  perform public._richiedi_staff();
  return json_build_object(
    'obiettivo', public._obiettivo(),
    'obiettivo_punti', public._obiettivo_punti(),
    'stats', json_build_object(
      'clienti',        (select count(*) from clienti),
      'nuovi_30gg',     (select count(*) from clienti where creato_il > now() - interval '30 days'),
      'timbri_oggi',    (select count(*) from movimenti where tipo = 'timbro' and creato_il >= oggi)
                      - (select count(*) from movimenti where tipo = 'annullato' and creato_il >= oggi),
      'premi_oggi',     (select count(*) from movimenti where tipo in ('premio', 'premio_punti') and creato_il >= oggi),
      'timbri_7gg',     (select count(*) from movimenti where tipo = 'timbro' and creato_il > now() - interval '7 days')
                      - (select count(*) from movimenti where tipo = 'annullato' and creato_il > now() - interval '7 days'),
      'punti_oggi',     (select coalesce(sum(punti), 0) from movimenti where tipo in ('punti', 'punti_annullati') and creato_il >= oggi),
      'premi_totali',   (select coalesce(sum(premi), 0) from clienti),
      'premi_punti_totali', (select coalesce(sum(premi_punti), 0) from clienti)
    ),
    'clienti', coalesce((
      select json_agg(json_build_object(
        'numero', numero, 'nome', nome, 'cognome', cognome, 'nascita', nascita,
        'timbri', timbri, 'premi', premi, 'timbri_totali', timbri_totali,
        'punti', punti, 'punti_totali', punti_totali, 'premi_punti', premi_punti,
        'creato_il', creato_il, 'ultimo_timbro', ultimo_timbro
      ) order by coalesce(ultimo_timbro, creato_il) desc)
      from clienti
    ), '[]'::json)
  );
end $$;

-- ---------- Permessi ----------

revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function public.registra_cliente(text, text, date, boolean) to anon, authenticated;
grant execute on function public.leggi_tessera(uuid)                      to anon, authenticated;
grant execute on function public.aggiorna_nome(uuid, text, text)          to anon, authenticated;
grant execute on function public.elimina_tessera(uuid)                    to anon, authenticated;

grant execute on function public.is_staff()                           to authenticated;
grant execute on function public.cerca_cliente(text)                  to authenticated;
grant execute on function public.aggiungi_timbro(text)                to authenticated;
grant execute on function public.riscatta_premio(text)                to authenticated;
grant execute on function public.annulla_timbro(text)                 to authenticated;
grant execute on function public.aggiungi_punti(text, bigint, int)    to authenticated;
grant execute on function public.riscatta_premio_punti(text)          to authenticated;
grant execute on function public.annulla_punti(text)                  to authenticated;
grant execute on function public.elimina_cliente(text)                to authenticated;
grant execute on function public.pannello()                           to authenticated;

-- =====================================================================
--  DOPO aver creato l'utente del bar (Authentication → Users → Add user),
--  esegui questa riga mettendo la sua email:
--
--  insert into public.staff (user_id, nome)
--  select id, 'Titolare' from auth.users where email = 'EMAIL-DEL-BAR@esempio.it';
--
--  Timbri necessari per il caffè omaggio (es. 8):
--  update public.impostazioni set timbri_per_premio = 8 where id = 1;
--
--  Punti necessari per la bevuta omaggio (es. 40):
--  update public.impostazioni set punti_per_premio = 40 where id = 1;
--
--  Listino punti (prodotti e punti): Table Editor → prodotti_punti
--  (modifica nome/punti, "attivo = false" per nascondere un prodotto).
-- =====================================================================
