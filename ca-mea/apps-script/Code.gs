/**
 * Ristorante Ca' Mea: motore prenotazioni
 * Google Sheets (archivio) + Gmail (email) + Apps Script (logica)
 *
 * Automazioni:
 *  1. Disponibilità in tempo reale per turno (il sito la legge)
 *  2. Prenotazione con controllo dei coperti (niente overbooking, con lock)
 *  3. Email di conferma al cliente, con link per annullare
 *  4. Email di notifica al ristorante per ogni nuova prenotazione
 *  5. Promemoria automatico al cliente il giorno prima
 *  6. Riepilogo serale al ristorante (lista prenotazioni della sera)
 *  7. Se nel foglio metti lo stato "Annullata", il cliente riceve un'email
 *  8. Chiusure straordinarie e ferie dal foglio "Chiusure"
 *
 * Prima volta: esegui setup() dall'editor e autorizza.
 */

const SHEET_BOOKINGS = 'Prenotazioni';
const SHEET_SETTINGS = 'Impostazioni';
const SHEET_CLOSURES = 'Chiusure';

const HEADERS = ['ID', 'Creata il', 'Data', 'Ora', 'Persone', 'Nome', 'Telefono', 'Email',
                 'Note', 'Stato', 'Promemoria inviato', 'Token', 'Lingua'];
const COL = Object.fromEntries(HEADERS.map((h, i) => [h, i + 1]));

const DEFAULT_SETTINGS = [
  ['NOME_RISTORANTE', "Ristorante Ca' Mea"],
  ['EMAIL_RISTORANTE', ''],                       // vuoto = email del proprietario dello script
  ['TELEFONO', '349 150 0498'],
  ['INDIRIZZO', 'SS 548 Km 13, Loc. Ravezza, 18010 Badalucco (IM)'],
  ['TURNI', '19:30,20:00,20:30,21:00,21:30'],
  ['COPERTI_PER_TURNO', '16'],                    // posti massimi che iniziano nello stesso turno
  ['COPERTI_PER_SERA', '40'],                     // posti massimi nell'intera serata
  ['MAX_PERSONE_ONLINE', '8'],
  ['GIORNI_CHIUSURA', ''],                        // es. "1" = lunedì, "1,2" = lun e mar (0 = domenica)
  ['ORA_PROMEMORIA', '11'],                       // ora in cui partono i promemoria del giorno dopo
  ['ORA_RIEPILOGO', '17'],                        // ora del riepilogo serale al ristorante
  ['URL_SITO', 'https://ristorantecamea.com']
];

/* ---------------- SETUP ---------------- */

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sh = ss.getSheetByName(SHEET_BOOKINGS) || ss.insertSheet(SHEET_BOOKINGS);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#2b211b').setFontColor('#f3e7d8');
    sh.getRange('C:D').setNumberFormat('@');      // data e ora come testo
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Confermata', 'Arrivati', 'No-show', 'Annullata'], true).build();
    sh.getRange(2, COL['Stato'], 1000).setDataValidation(rule);
    sh.hideColumns(COL['Token']);
  }

  let st = ss.getSheetByName(SHEET_SETTINGS) || ss.insertSheet(SHEET_SETTINGS);
  if (st.getLastRow() === 0) {
    st.getRange(1, 1, 1, 2).setValues([['Chiave', 'Valore']]).setFontWeight('bold');
    st.getRange(2, 1, DEFAULT_SETTINGS.length, 2).setValues(DEFAULT_SETTINGS);
    st.getRange('B:B').setNumberFormat('@');
    st.autoResizeColumns(1, 2);
  }

  let cl = ss.getSheetByName(SHEET_CLOSURES) || ss.insertSheet(SHEET_CLOSURES);
  if (cl.getLastRow() === 0) {
    cl.getRange(1, 1, 1, 2).setValues([['Data (AAAA-MM-GG)', 'Messaggio']]).setFontWeight('bold');
    cl.getRange('A:A').setNumberFormat('@');
  }

  // Trigger: rimuove i vecchi e crea quelli nuovi
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  const s = getSettings_();
  ScriptApp.newTrigger('sendReminders').timeBased().everyDays(1).atHour(Number(s.ORA_PROMEMORIA) || 11).create();
  ScriptApp.newTrigger('sendDailySummary').timeBased().everyDays(1).atHour(Number(s.ORA_RIEPILOGO) || 17).create();
  ScriptApp.newTrigger('onBookingEdit').forSpreadsheet(ss).onEdit().create();

  SpreadsheetApp.getUi && safeAlert_('Setup completato. Ora pubblica lo script come Web App (Distribuisci → Nuova distribuzione).');
}

/* ---------------- API WEB ---------------- */

function doGet(e) {
  const p = e.parameter || {};
  if (p.action === 'availability') return json_(availability_(p.date));
  if (p.action === 'cancel') return cancelPage_(p.id, p.token);
  return json_({ ok: true, service: 'Ca Mea booking' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'Richiesta non valida.' }); }
  if (body.action !== 'book') return json_({ ok: false, error: 'Azione sconosciuta.' });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json_({ ok: false, error: 'Troppe richieste in questo momento, riprova tra qualche secondo.' });
  try {
    return json_(book_(body));
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- LOGICA ---------------- */

function availability_(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return { ok: false, error: 'Data non valida.' };
  const s = getSettings_();
  const closed = closedReason_(date, s);
  if (closed) return { ok: true, closed: true, message: closed };

  const slots = s.TURNI.split(',').map(x => x.trim()).filter(String);
  const perSlot = Number(s.COPERTI_PER_TURNO), perNight = Number(s.COPERTI_PER_SERA);
  const active = bookingsFor_(date).filter(b => b.status !== 'Annullata');
  const nightUsed = active.reduce((a, b) => a + b.people, 0);
  const out = {};
  slots.forEach(t => {
    const used = active.filter(b => b.time === t).reduce((a, b) => a + b.people, 0);
    out[t] = Math.max(0, Math.min(perSlot - used, perNight - nightUsed));
  });
  return { ok: true, date: date, slots: out };
}

function book_(b) {
  const s = getSettings_();
  const people = Number(b.people);
  const clean = v => String(v || '').replace(/^[=+\-@]/, "'$&").slice(0, 500); // evita formule nel foglio

  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || '')) return { ok: false, error: 'Data non valida.' };
  if (!/^\d{2}:\d{2}$/.test(b.time || '')) return { ok: false, error: 'Orario non valido.' };
  if (!(people >= 1 && people <= Number(s.MAX_PERSONE_ONLINE))) return { ok: false, error: 'Per gruppi numerosi chiamaci al ' + s.TELEFONO + '.' };
  if (!b.name || !/^\S+@\S+\.\S+$/.test(b.email || '') || !b.phone) return { ok: false, error: 'Compila nome, telefono ed email.' };

  const tz = Session.getScriptTimeZone();
  const when = Utilities.parseDate(b.date + ' ' + b.time, tz, 'yyyy-MM-dd HH:mm');
  if (when.getTime() < Date.now() + 2 * 3600 * 1000) return { ok: false, error: 'Per prenotazioni entro 2 ore chiamaci direttamente.' };

  const av = availability_(b.date);
  if (av.closed) return { ok: false, error: av.message };
  if (!(b.time in av.slots)) return { ok: false, error: 'Orario non disponibile.' };
  if (av.slots[b.time] < people) return { ok: false, error: 'Ci dispiace, alle ' + b.time + ' i posti sono finiti.' };

  const id = 'CM-' + Utilities.formatDate(new Date(), tz, 'MMdd') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  const token = Utilities.getUuid();
  const sh = sheet_(SHEET_BOOKINGS);
  sh.appendRow([id, new Date(), b.date, b.time, people, clean(b.name), clean(b.phone), clean(b.email),
                clean(b.notes), 'Confermata', '', token, clean(b.lang)]);

  const booking = { id, date: b.date, time: b.time, people, name: b.name, phone: b.phone, email: b.email, notes: b.notes || '', token };
  sendConfirmation_(booking, s);
  notifyRestaurant_(booking, s);
  return { ok: true, id: id };
}

function cancelPage_(id, token) {
  const sh = sheet_(SHEET_BOOKINGS);
  const rows = sh.getDataRange().getValues();
  const s = getSettings_();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][COL['ID'] - 1] === id && rows[i][COL['Token'] - 1] === token) {
      if (rows[i][COL['Stato'] - 1] !== 'Annullata') {
        sh.getRange(i + 1, COL['Stato']).setValue('Annullata');
        const b = rowToBooking_(rows[i]);
        MailApp.sendEmail(restaurantEmail_(s), 'Annullata: ' + b.name + ' ' + niceDate_(b.date) + ' ' + b.time,
          'Il cliente ha annullato la prenotazione ' + b.id + ' (' + b.people + ' persone).');
      }
      return html_('Prenotazione annullata', 'La prenotazione ' + id + ' è stata annullata. Speriamo di vederti presto da noi.', s);
    }
  }
  return html_('Link non valido', 'Non troviamo questa prenotazione. Chiamaci al ' + s.TELEFONO + '.', s);
}

/* ---------------- AUTOMAZIONI A ORARIO ---------------- */

function sendReminders() {
  const s = getSettings_();
  const tomorrow = Utilities.formatDate(new Date(Date.now() + 864e5), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const sh = sheet_(SHEET_BOOKINGS);
  bookingsFor_(tomorrow).forEach(b => {
    if (b.status !== 'Confermata' || b.reminded) return;
    const link = cancelLink_(b);
    MailApp.sendEmail({
      to: b.email,
      subject: 'Promemoria: domani sera da ' + s.NOME_RISTORANTE + ' alle ' + b.time,
      htmlBody: emailHtml_(s, 'A domani, ' + esc_(b.name) + '!',
        'Ti ricordiamo la prenotazione per <b>' + b.people + ' persone</b> domani, <b>' + niceDate_(b.date) + ' alle ' + b.time + '</b>.' +
        '<br><br>Se non riesci a venire, annulla qui così liberiamo il tavolo: <a href="' + link + '">annulla prenotazione</a>.')
    });
    sh.getRange(b.row, COL['Promemoria inviato']).setValue(new Date());
  });
}

function sendDailySummary() {
  const s = getSettings_();
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const list = bookingsFor_(today).filter(b => b.status !== 'Annullata').sort((a, b) => a.time.localeCompare(b.time));
  if (!list.length) return;
  const tot = list.reduce((a, b) => a + b.people, 0);
  const rows = list.map(b => '<tr><td>' + b.time + '</td><td>' + b.people + '</td><td>' + esc_(b.name) + '</td><td>' +
    esc_(b.phone) + '</td><td>' + esc_(b.notes) + '</td></tr>').join('');
  MailApp.sendEmail({
    to: restaurantEmail_(s),
    subject: 'Stasera: ' + list.length + ' tavoli, ' + tot + ' coperti',
    htmlBody: '<h2>Prenotazioni di ' + niceDate_(today) + '</h2><table border="1" cellpadding="6" style="border-collapse:collapse">' +
      '<tr><th>Ora</th><th>Pers.</th><th>Nome</th><th>Telefono</th><th>Note</th></tr>' + rows + '</table>'
  });
}

/** Trigger installabile: quando nel foglio cambi lo stato in "Annullata", avvisa il cliente. */
function onBookingEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() !== SHEET_BOOKINGS || r.getColumn() !== COL['Stato'] || r.getRow() < 2) return;
  if (e.value !== 'Annullata') return;
  const s = getSettings_();
  const b = rowToBooking_(r.getSheet().getRange(r.getRow(), 1, 1, HEADERS.length).getValues()[0]);
  MailApp.sendEmail({
    to: b.email,
    subject: 'Prenotazione annullata: ' + s.NOME_RISTORANTE,
    htmlBody: emailHtml_(s, 'Ciao ' + esc_(b.name) + ',',
      'purtroppo dobbiamo annullare la prenotazione di ' + niceDate_(b.date) + ' alle ' + b.time + '. ' +
      'Chiamaci al ' + s.TELEFONO + ' per trovare un\'altra data. Ci scusiamo per il disagio.')
  });
}

/* ---------------- EMAIL ---------------- */

function sendConfirmation_(b, s) {
  MailApp.sendEmail({
    to: b.email,
    replyTo: restaurantEmail_(s),
    name: s.NOME_RISTORANTE,
    subject: 'Prenotazione confermata: ' + niceDate_(b.date) + ' alle ' + b.time,
    htmlBody: emailHtml_(s, 'Grazie ' + esc_(b.name) + ', ti aspettiamo!',
      '<table cellpadding="4"><tr><td>Giorno</td><td><b>' + niceDate_(b.date) + '</b></td></tr>' +
      '<tr><td>Ora</td><td><b>' + b.time + '</b></td></tr><tr><td>Persone</td><td><b>' + b.people + '</b></td></tr>' +
      '<tr><td>Codice</td><td>' + b.id + '</td></tr>' + (b.notes ? '<tr><td>Note</td><td>' + esc_(b.notes) + '</td></tr>' : '') + '</table>' +
      '<p>Il giorno prima ti mandiamo un promemoria. Se cambi programma: <a href="' + cancelLink_(b) + '">annulla la prenotazione</a>.</p>')
  });
}

function notifyRestaurant_(b, s) {
  MailApp.sendEmail({
    to: restaurantEmail_(s),
    replyTo: b.email,
    subject: 'Nuova prenotazione: ' + niceDate_(b.date) + ' ' + b.time + ' · ' + b.people + ' pers. · ' + b.name,
    htmlBody: '<p><b>' + esc_(b.name) + '</b> · ' + b.people + ' persone<br>' + niceDate_(b.date) + ' alle ' + b.time +
      '<br>Tel: ' + esc_(b.phone) + '<br>Email: ' + esc_(b.email) + '<br>Note: ' + esc_(b.notes || '-') + '</p>' +
      '<p><a href="https://wa.me/' + String(b.phone).replace(/\D/g, '').replace(/^(?!39)(3\d{8,9})$/, '39$1') + '">Scrivi al cliente su WhatsApp</a></p>'
  });
}

function emailHtml_(s, title, body) {
  return '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#231c17">' +
    '<div style="background:#2b211b;color:#f3e7d8;padding:18px 22px;font-size:20px">' + s.NOME_RISTORANTE + '</div>' +
    '<div style="padding:22px;border:1px solid #e3d9cc;border-top:0"><h2 style="font-weight:normal">' + title + '</h2>' + body +
    '<p style="color:#6e6158;font-size:13px;margin-top:28px">' + s.INDIRIZZO + ' · Tel. ' + s.TELEFONO + '</p></div></div>';
}

/* ---------------- UTILITÀ ---------------- */

function getSettings_() {
  const out = Object.fromEntries(DEFAULT_SETTINGS);
  const st = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SETTINGS);
  if (st) st.getDataRange().getValues().slice(1).forEach(([k, v]) => { if (k) out[k] = String(v); });
  return out;
}

function closedReason_(date, s) {
  const wd = Utilities.parseDate(date + ' 12:00', Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm').getDay();
  const closedDays = String(s.GIORNI_CHIUSURA).split(',').map(x => x.trim()).filter(String).map(Number);
  if (closedDays.includes(wd)) return 'È il nostro giorno di chiusura. Scegli un altro giorno.';
  const cl = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_CLOSURES);
  if (cl) {
    const hit = cl.getDataRange().getValues().slice(1).find(r => normDate_(r[0]) === date);
    if (hit) return hit[1] || 'Siamo chiusi in questa data.';
  }
  return '';
}

function bookingsFor_(date) {
  const rows = sheet_(SHEET_BOOKINGS).getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const b = rowToBooking_(rows[i]);
    if (b.date === date) { b.row = i + 1; out.push(b); }
  }
  return out;
}

function rowToBooking_(r) {
  return {
    id: r[COL['ID'] - 1], date: normDate_(r[COL['Data'] - 1]), time: normTime_(r[COL['Ora'] - 1]),
    people: Number(r[COL['Persone'] - 1]) || 0, name: String(r[COL['Nome'] - 1]), phone: String(r[COL['Telefono'] - 1]),
    email: String(r[COL['Email'] - 1]), notes: String(r[COL['Note'] - 1] || ''), status: String(r[COL['Stato'] - 1]),
    reminded: !!r[COL['Promemoria inviato'] - 1], token: r[COL['Token'] - 1]
  };
}

function normDate_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v).trim();
}
function normTime_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'HH:mm');
  return String(v).trim();
}
function niceDate_(iso) {
  const d = Utilities.parseDate(iso + ' 12:00', Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
  const giorni = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  const mesi = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
  return giorni[d.getDay()] + ' ' + d.getDate() + ' ' + mesi[d.getMonth()];
}
function cancelLink_(b) {
  return ScriptApp.getService().getUrl() + '?action=cancel&id=' + encodeURIComponent(b.id) + '&token=' + encodeURIComponent(b.token);
}
function restaurantEmail_(s) { return s.EMAIL_RISTORANTE || Session.getEffectiveUser().getEmail(); }
function sheet_(name) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); }
function esc_(t) { return String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function html_(title, text, s) {
  return HtmlService.createHtmlOutput(emailHtml_(s, title, '<p>' + esc_(text) + '</p><p><a href="' + s.URL_SITO + '">Torna al sito</a></p>'))
    .setTitle(title);
}
function safeAlert_(m) { try { SpreadsheetApp.getUi().alert(m); } catch (e) { Logger.log(m); } }

/** Test rapido dall'editor: crea una prenotazione finta tra 3 giorni (usa la tua email). */
function testBooking() {
  const d = Utilities.formatDate(new Date(Date.now() + 3 * 864e5), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  Logger.log(JSON.stringify(book_({ date: d, time: '20:00', people: 2, name: 'Prova Test', phone: '3490000000',
    email: Session.getEffectiveUser().getEmail(), notes: 'prenotazione di prova' })));
}
