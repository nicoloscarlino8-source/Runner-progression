/* =====================================================================
   ANATOMIA DELL'ARTO INFERIORE PER IL MASSAGGIO SPORTIVO NEL CICLISMO
   Runner Progression — fonte unica di dati per web app e PDF.
   Nomenclatura italiana (con nome latino). Innervazione: radici
   principali secondo i testi di riferimento (Gray's, Moore, Netter);
   la variabilità individuale esiste ed è normale.
   oK / iK = chiavi dei punti ossei usate dal quiz per non proporre
   risposte "sbagliate" che in realtà condividono lo stesso attacco.
   ===================================================================== */

const REGIONI = [
  { id: "glutea", nome: "Regione glutea e rotatori dell'anca", breve: "Glutei e rotatori", vista: "post" },
  { id: "flessori-anca", nome: "Flessori profondi dell'anca (ileopsoas)", breve: "Ileopsoas", vista: "ant" },
  { id: "coscia-ant", nome: "Coscia — loggia anteriore", breve: "Coscia anteriore", vista: "ant" },
  { id: "coscia-med", nome: "Coscia — loggia mediale (adduttori)", breve: "Adduttori", vista: "ant" },
  { id: "coscia-post", nome: "Coscia — loggia posteriore (ischiocrurali)", breve: "Femorali", vista: "post" },
  { id: "gamba-ant", nome: "Gamba — loggia anteriore", breve: "Gamba anteriore", vista: "ant" },
  { id: "gamba-lat", nome: "Gamba — loggia laterale (peronei)", breve: "Peronei", vista: "ant" },
  { id: "gamba-post-sup", nome: "Gamba — loggia posteriore superficiale (tricipite surale)", breve: "Polpaccio", vista: "post" },
  { id: "gamba-post-prof", nome: "Gamba — loggia posteriore profonda", breve: "Polpaccio profondo", vista: "post" },
  { id: "piede-dors", nome: "Piede — dorso", breve: "Dorso del piede", vista: "ant" },
  { id: "piede-plant", nome: "Piede — pianta (4 strati)", breve: "Pianta del piede", vista: "post" }
];

const NERVI = {
  "gluteo-sup": "N. gluteo superiore",
  "gluteo-inf": "N. gluteo inferiore",
  "piriforme": "N. del piriforme (plesso sacrale)",
  "otturatore-int": "N. per l'otturatore interno",
  "quadrato-fem": "N. per il quadrato del femore",
  "lombari": "Rami anteriori dei nervi lombari (plesso lombare)",
  "femorale": "N. femorale",
  "otturatorio": "N. otturatorio",
  "tibiale": "N. tibiale (componente del n. sciatico)",
  "peroneo-comune": "N. peroneo (fibulare) comune",
  "peroneo-prof": "N. peroneo (fibulare) profondo",
  "peroneo-sup": "N. peroneo (fibulare) superficiale",
  "plantare-med": "N. plantare mediale",
  "plantare-lat": "N. plantare laterale"
};

const MUSCOLI = [
  /* ---------------------------------------------------------------- GLUTEA */
  {
    id: "grande-gluteo", nome: "Grande gluteo", lat: "M. gluteus maximus", regione: "glutea", tipo: "monoarticolare",
    o: "Ileo dietro la linea glutea posteriore, sacro, coccige, legamento sacrotuberoso",
    origine: "Faccia glutea dell'ileo posteriormente alla linea glutea posteriore e parte posteriore della cresta iliaca; faccia dorsale della parte inferiore del sacro e margine laterale del coccige; aponeurosi del muscolo erettore della colonna; legamento sacrotuberoso; fascia glutea.",
    oK: ["ileo-esterno", "sacro", "coccige", "sacrotub", "cresta"],
    i: "Tratto ileotibiale (fibre superficiali) e tuberosità glutea del femore (fibre profonde)",
    inserzione: "La maggior parte delle fibre (superficiali e superiori, circa 3/4) si inserisce nel tratto ileotibiale della fascia lata; le fibre profonde della parte inferiore si inseriscono sulla tuberosità glutea del femore.",
    iK: ["til", "tub-glutea"],
    nK: ["gluteo-inf"], radici: "L5–S2",
    azione: ["Estensione dell'anca (soprattutto da anca flessa: salire scale, spinta in salita)", "Extrarotazione dell'anca", "Fibre superiori: abduzione; fibre inferiori: adduzione", "Tramite il tratto ileotibiale stabilizza il ginocchio esteso"],
    ciclismo: "Motore principale della fase di spinta (circa da 340° a 130° della pedivella). Il lavoro aumenta in salita, in piedi sui pedali e con rapporti duri. Un gluteo poco attivo sposta il carico su quadricipite e schiena.",
    palpazione: "Atleta prono: chiedi di estendere l'anca a ginocchio flesso (alzare il tallone verso il soffitto). Il ventre si contrae tra cresta iliaca, margine laterale del sacro e piega glutea. Il margine inferiore NON coincide con la piega glutea.",
    massaggio: "Prono, cuscino sotto le caviglie. Sfioramento ampio, impastamento a due mani, pressioni con il palmo o il pugno morbido lungo le fibre (dal sacro verso il grande trocantere). Frizioni lungo il margine sacrale e sotto la cresta iliaca. Nel recupero: pressioni sostenute sui punti tesi.",
    attenzione: "Il nervo sciatico esce dal grande forame ischiatico sotto il piriforme, circa a metà fra tuberosità ischiatica e grande trocantere: lì niente pressioni profonde e prolungate con gomito o nocche. Verifica che la cute non sia irritata dalla sella (follicoliti, foruncoli)."
  },
  {
    id: "medio-gluteo", nome: "Medio gluteo", lat: "M. gluteus medius", regione: "glutea", tipo: "monoarticolare",
    o: "Faccia esterna dell'ileo tra linea glutea anteriore e posteriore",
    origine: "Faccia esterna (glutea) dell'ala iliaca compresa tra la linea glutea anteriore e la linea glutea posteriore, sotto la cresta iliaca; fascia glutea che lo ricopre anteriormente.",
    oK: ["ileo-esterno"],
    i: "Faccia laterale del grande trocantere",
    inserzione: "Faccia laterale del grande trocantere del femore (cresta obliqua che la attraversa in senso postero-superiore → antero-inferiore).",
    iK: ["gr-trocantere"],
    nK: ["gluteo-sup"], radici: "L4–S1",
    azione: ["Abduzione dell'anca", "Fibre anteriori: intrarotazione e flessione", "Fibre posteriori: extrarotazione ed estensione", "Stabilizza il bacino sul piano frontale (impedisce la caduta del bacino dal lato opposto)"],
    ciclismo: "Tiene il bacino stabile in sella e controlla la traiettoria del ginocchio durante la spinta. Se è debole il ginocchio tende a cadere verso l'interno (valgo dinamico): carico anomalo su rotula e bandelletta ileotibiale.",
    palpazione: "Decubito laterale, anca leggermente estesa: chiedi un'abduzione contro resistenza. Si sente subito sotto la cresta iliaca, tra la cresta e il grande trocantere, davanti al grande gluteo.",
    massaggio: "Decubito laterale (cuscino tra le ginocchia) o prono. Impastamento, pressioni digitali e frizioni trasversali dal margine della cresta verso il trocantere. Spesso è dolente nei ciclisti: aumenta la pressione in modo graduale.",
    attenzione: "Sopra il grande trocantere c'è la borsa trocanterica: niente frizioni profonde direttamente sull'osso se l'area è dolente o calda."
  },
  {
    id: "piccolo-gluteo", nome: "Piccolo gluteo", lat: "M. gluteus minimus", regione: "glutea", tipo: "monoarticolare",
    o: "Faccia esterna dell'ileo tra linea glutea anteriore e inferiore",
    origine: "Faccia esterna dell'ala iliaca compresa tra la linea glutea anteriore e la linea glutea inferiore; margine della grande incisura ischiatica.",
    oK: ["ileo-esterno"],
    i: "Faccia anteriore del grande trocantere",
    inserzione: "Faccetta anteriore (antero-laterale) del grande trocantere del femore; alcune fibre alla capsula articolare dell'anca.",
    iK: ["gr-trocantere"],
    nK: ["gluteo-sup"], radici: "L4–S1",
    azione: ["Abduzione dell'anca", "Intrarotazione dell'anca (fibre anteriori)", "Stabilizza il bacino e tiene centrata la testa del femore"],
    ciclismo: "Lavora insieme al medio gluteo per stabilizzare bacino e anca a ogni pedalata. I suoi punti trigger possono dare dolore riferito sul lato della coscia e della gamba, simile a una sciatalgia.",
    palpazione: "È profondo, sotto il medio gluteo: non si isola con certezza. Lo raggiungi indirettamente in decubito laterale, nella zona antero-superiore al grande trocantere, chiedendo una leggera intrarotazione.",
    massaggio: "Pressioni profonde, lente, attraverso il medio gluteo, solo nelle sedute di recupero (non pre-gara). Decubito laterale.",
    attenzione: ""
  },
  {
    id: "tensore-fascia-lata", nome: "Tensore della fascia lata", lat: "M. tensor fasciae latae", regione: "glutea", tipo: "biarticolare (tramite il tratto ileotibiale)",
    o: "SIAS e parte anteriore del labbro esterno della cresta iliaca",
    origine: "Spina iliaca antero-superiore (SIAS) e parte anteriore del labbro esterno della cresta iliaca; faccia profonda della fascia lata.",
    oK: ["sias", "cresta"],
    i: "Tratto ileotibiale → tubercolo di Gerdy (condilo laterale della tibia)",
    inserzione: "Si inserisce nel tratto ileotibiale, tra i due foglietti della fascia lata, nel terzo superiore della coscia; attraverso il tratto agisce fino al tubercolo di Gerdy (tubercolo antero-laterale del condilo laterale della tibia).",
    iK: ["til"],
    nK: ["gluteo-sup"], radici: "L4–S1",
    azione: ["Flessione, abduzione e intrarotazione dell'anca", "Mette in tensione la fascia lata e il tratto ileotibiale", "Stabilizza il ginocchio esteso"],
    ciclismo: "Con la posizione a busto flesso lavora sempre accorciato e diventa spesso ipertonico. È uno dei muscoli da controllare in caso di dolore laterale al ginocchio (sindrome della bandelletta ileotibiale).",
    palpazione: "Supino: appena sotto e lateralmente alla SIAS. Chiedi flessione + intrarotazione dell'anca: senti un ventre ovale, piccolo, che si contrae subito.",
    massaggio: "Supino o in decubito laterale. Impastamento, pressioni sostenute sul ventre, frizioni trasversali. Lavora anche la zona di passaggio verso il tratto ileotibiale con sfioramento profondo in direzione prossimale.",
    attenzione: "Medialmente alla SIAS passa il nervo cutaneo femorale laterale (sotto il legamento inguinale): una pressione insistente lì può dare formicolio sulla coscia laterale."
  },
  {
    id: "piriforme", nome: "Piriforme", lat: "M. piriformis", regione: "glutea", tipo: "monoarticolare",
    o: "Faccia anteriore (pelvica) del sacro, tra i forami sacrali S2–S4",
    origine: "Faccia anteriore (pelvica) del sacro, ai lati del 2°–4° forame sacrale anteriore; margine superiore della grande incisura ischiatica; parte del legamento sacrotuberoso.",
    oK: ["sacro-ant", "sacrotub"],
    i: "Margine superiore del grande trocantere",
    inserzione: "Margine superiore (apice) del grande trocantere del femore, con un tendine rotondo che esce dal bacino attraverso il grande forame ischiatico.",
    iK: ["gr-trocantere-apice"],
    nK: ["piriforme"], radici: "S1–S2",
    azione: ["Extrarotazione dell'anca estesa", "Abduzione dell'anca flessa", "Con l'anca molto flessa (oltre circa 60–90°) la sua azione di rotazione si inverte verso l'intrarotazione", "Stabilizza la testa del femore nell'acetabolo"],
    ciclismo: "In sella l'anca resta sempre flessa e il piriforme lavora come stabilizzatore per ore. Può dare dolore gluteo profondo e, raramente, irritare il nervo sciatico (\"sindrome del piriforme\").",
    palpazione: "Prono. Traccia una linea dal margine supero-laterale del sacro (livello S2, poco sotto la SIPS) all'apice del grande trocantere: il piriforme si trova lungo questa linea, sotto il grande gluteo. Con il ginocchio flesso a 90° fai ruotare l'anca per sentirlo tendersi.",
    massaggio: "Prono. Pressioni lente con pollice o pugno morbido sulla linea sacro–trocantere, attraverso il grande gluteo rilassato; frizioni trasversali vicino al trocantere. Nel recupero puoi associare una rotazione passiva dell'anca.",
    attenzione: "Il nervo sciatico esce sotto il piriforme (in una minoranza di persone lo attraversa o passa sopra). Se durante la pressione l'atleta sente scossa, formicolio o dolore che scende lungo la gamba, togli subito pressione e spostati."
  },
  {
    id: "otturatore-interno", nome: "Otturatore interno", lat: "M. obturator internus", regione: "glutea", tipo: "monoarticolare",
    o: "Faccia interna della membrana otturatoria e dei margini del forame otturato",
    origine: "Faccia interna (pelvica) della membrana otturatoria e delle ossa che delimitano il forame otturato (pube e ischio). Il tendine esce dal bacino attraverso il piccolo forame ischiatico, piegando ad angolo sull'ischio.",
    oK: ["membr-otturatoria-int"],
    i: "Faccia mediale del grande trocantere (con i due gemelli)",
    inserzione: "Faccia mediale del grande trocantere, sopra la fossa trocanterica, insieme ai tendini dei muscoli gemelli superiore e inferiore.",
    iK: ["gr-trocantere-mediale"],
    nK: ["otturatore-int"], radici: "L5–S2",
    azione: ["Extrarotazione dell'anca estesa", "Abduzione dell'anca flessa", "Stabilizza la testa del femore nell'acetabolo"],
    ciclismo: "Fa parte del gruppo dei rotatori profondi che tengono stabile l'anca durante la pedalata. Lavora in modo continuo e a basso carico.",
    palpazione: "Non palpabile in modo isolato. Il suo tendine (con i gemelli) si raggiunge in profondità tra la tuberosità ischiatica e il grande trocantere, sotto il piriforme.",
    massaggio: "Lavoro indiretto attraverso il grande gluteo nella zona tra tuberosità ischiatica e trocantere, con pressioni lente. Solo nelle sedute di recupero.",
    attenzione: "La zona è vicina al decorso del nervo sciatico: pressioni graduali e attenzione alle sensazioni riferite."
  },
  {
    id: "gemello-superiore", nome: "Gemello superiore", lat: "M. gemellus superior", regione: "glutea", tipo: "monoarticolare",
    o: "Faccia esterna della spina ischiatica",
    origine: "Faccia esterna (glutea) della spina ischiatica.",
    oK: ["spina-isch"],
    i: "Tendine dell'otturatore interno → faccia mediale del grande trocantere",
    inserzione: "Si fonde con il margine superiore del tendine dell'otturatore interno e si inserisce con esso sulla faccia mediale del grande trocantere.",
    iK: ["gr-trocantere-mediale"],
    nK: ["otturatore-int"], radici: "L5–S2",
    azione: ["Extrarotazione dell'anca estesa", "Abduzione dell'anca flessa", "Stabilizza la testa del femore"],
    ciclismo: "Rotatore profondo e stabilizzatore dell'anca.",
    palpazione: "Non palpabile in modo isolato (profondo, sotto il grande gluteo, appena sotto il piriforme).",
    massaggio: "Lavoro indiretto insieme agli altri rotatori profondi.",
    attenzione: "Vicinanza al nervo sciatico."
  },
  {
    id: "gemello-inferiore", nome: "Gemello inferiore", lat: "M. gemellus inferior", regione: "glutea", tipo: "monoarticolare",
    o: "Parte superiore della tuberosità ischiatica",
    origine: "Parte superiore della tuberosità ischiatica.",
    oK: ["tub-isch"],
    i: "Tendine dell'otturatore interno → faccia mediale del grande trocantere",
    inserzione: "Si fonde con il margine inferiore del tendine dell'otturatore interno e si inserisce con esso sulla faccia mediale del grande trocantere.",
    iK: ["gr-trocantere-mediale"],
    nK: ["quadrato-fem"], radici: "L4–S1",
    azione: ["Extrarotazione dell'anca estesa", "Abduzione dell'anca flessa", "Stabilizza la testa del femore"],
    ciclismo: "Rotatore profondo e stabilizzatore dell'anca.",
    palpazione: "Non palpabile in modo isolato.",
    massaggio: "Lavoro indiretto insieme agli altri rotatori profondi.",
    attenzione: "Vicinanza al nervo sciatico."
  },
  {
    id: "quadrato-femore", nome: "Quadrato del femore", lat: "M. quadratus femoris", regione: "glutea", tipo: "monoarticolare",
    o: "Margine laterale della tuberosità ischiatica",
    origine: "Margine laterale della tuberosità ischiatica.",
    oK: ["tub-isch"],
    i: "Tubercolo quadrato della cresta intertrocanterica",
    inserzione: "Tubercolo quadrato sulla cresta intertrocanterica del femore e area immediatamente sottostante.",
    iK: ["cresta-intertroc"],
    nK: ["quadrato-fem"], radici: "L4–S1",
    azione: ["Extrarotazione dell'anca", "Stabilizza la testa del femore nell'acetabolo"],
    ciclismo: "Il più basso dei rotatori profondi: stabilizza l'anca in sella.",
    palpazione: "Profondo: si raggiunge tra tuberosità ischiatica e grande trocantere, sotto il margine inferiore del grande gluteo, a livello del piccolo trocantere.",
    massaggio: "Pressioni lente e graduali, atleta prono, nelle sedute di recupero.",
    attenzione: "Il nervo sciatico scende proprio sopra (posteriormente a) questo muscolo."
  },
  {
    id: "otturatore-esterno", nome: "Otturatore esterno", lat: "M. obturator externus", regione: "glutea", tipo: "monoarticolare",
    o: "Faccia esterna della membrana otturatoria e dei margini del forame otturato",
    origine: "Faccia esterna della membrana otturatoria e margini ossei del forame otturato (rami del pube e dell'ischio).",
    oK: ["membr-otturatoria-est"],
    i: "Fossa trocanterica del femore",
    inserzione: "Fossa trocanterica del femore (faccia mediale del grande trocantere, alla base), con un tendine che passa sotto il collo del femore.",
    iK: ["fossa-troc"],
    nK: ["otturatorio"], radici: "L3–L4",
    azione: ["Extrarotazione dell'anca", "Stabilizza la testa del femore nell'acetabolo"],
    ciclismo: "Stabilizzatore profondo dell'anca. È l'unico rotatore esterno innervato dal n. otturatorio.",
    palpazione: "Non palpabile: è il più profondo del gruppo, coperto dagli adduttori anteriormente e dal quadrato del femore posteriormente.",
    massaggio: "Nessun lavoro diretto: si tratta con mobilizzazioni e lavoro sui muscoli vicini.",
    attenzione: ""
  },

  /* -------------------------------------------------------- ILEOPSOAS */
  {
    id: "grande-psoas", nome: "Grande psoas", lat: "M. psoas major", regione: "flessori-anca", tipo: "poliarticolare (colonna lombare + anca)",
    o: "Corpi vertebrali e dischi T12–L5, processi trasversi lombari",
    origine: "Facce laterali dei corpi vertebrali da T12 a L5 e dei dischi intervertebrali interposti; processi trasversi di tutte le vertebre lombari (L1–L5).",
    oK: ["vertebre-lomb"],
    i: "Piccolo trocantere del femore (tendine comune con l'iliaco)",
    inserzione: "Piccolo trocantere del femore, con un tendine comune all'iliaco (tendine dell'ileopsoas) che passa sotto il legamento inguinale e davanti all'articolazione dell'anca.",
    iK: ["pic-trocantere"],
    nK: ["lombari"], radici: "L1–L3",
    azione: ["Flessione dell'anca (principale flessore)", "Con il femore fisso: flessione del tronco sul bacino", "Flessione laterale della colonna lombare (contrazione monolaterale)", "Contribuisce a stabilizzare la colonna lombare"],
    ciclismo: "Riporta in alto la gamba nella fase di risalita (circa 200°–350°). Passa ore in posizione accorciata: un psoas rigido può tirare la lombare in avanti e contribuire al mal di schiena del ciclista.",
    palpazione: "Supino, ginocchia flesse. Il ventre si raggiunge solo in profondità dall'addome, lateralmente al margine del muscolo retto, scendendo lentamente con l'espirazione e chiedendo una leggera flessione dell'anca. Il tendine si sente sotto il legamento inguinale, lateralmente all'arteria femorale.",
    massaggio: "Il lavoro diretto addominale richiede formazione specifica e consenso dell'atleta. In alternativa: lavoro sull'iliaco dalla cresta iliaca, stretching (affondo con bacino in retroversione) e mobilizzazioni. Mai pre-gara in profondità.",
    attenzione: "Approccio addominale: aorta addominale e arterie iliache (se senti una pulsazione, spostati), intestino, reni. Controindicato con dolore addominale, ernie, problemi intestinali o vascolari. A livello inguinale c'è il triangolo femorale: niente pressioni profonde."
  },
  {
    id: "piccolo-psoas", nome: "Piccolo psoas (incostante)", lat: "M. psoas minor", regione: "flessori-anca", tipo: "poliarticolare",
    o: "Facce laterali dei corpi T12–L1 e disco interposto",
    origine: "Facce laterali dei corpi vertebrali di T12 e L1 e del disco intervertebrale interposto. Manca in circa il 40% delle persone.",
    oK: ["vertebre-lomb"],
    i: "Linea pettinea ed eminenza ileopubica",
    inserzione: "Linea pettinea del pube ed eminenza ileopubica (ileopettinea), tramite l'arco ileopettineo.",
    iK: ["eminenza-ileopubica"],
    nK: ["lombari"], radici: "L1",
    azione: ["Debole flessione del tronco sul bacino", "Mette in tensione la fascia iliaca"],
    ciclismo: "Ruolo minore. Da conoscere perché può essere assente.",
    palpazione: "Non palpabile in modo isolato.",
    massaggio: "Nessun lavoro specifico.",
    attenzione: ""
  },
  {
    id: "iliaco", nome: "Iliaco", lat: "M. iliacus", regione: "flessori-anca", tipo: "monoarticolare",
    o: "Fossa iliaca, labbro interno della cresta iliaca, ala del sacro",
    origine: "Due terzi superiori della fossa iliaca; labbro interno della cresta iliaca; ala del sacro; legamenti sacroiliaci anteriori e ileolombare.",
    oK: ["fossa-iliaca", "cresta"],
    i: "Piccolo trocantere (tendine dello psoas) e femore subito sotto",
    inserzione: "Tendine del grande psoas e piccolo trocantere; alcune fibre si inseriscono direttamente sul corpo del femore subito sotto il piccolo trocantere.",
    iK: ["pic-trocantere"],
    nK: ["femorale"], radici: "L2–L3",
    azione: ["Flessione dell'anca (insieme al grande psoas forma l'ileopsoas)", "Antiverte il bacino con il femore fisso"],
    ciclismo: "Flessore dell'anca nella fase di risalita, sempre in posizione accorciata in sella. Spesso teso e dolente.",
    palpazione: "Supino, ginocchia flesse per rilassare l'addome. Appoggia i polpastrelli sul margine interno della cresta iliaca, subito medialmente alla SIAS, e scivola dentro la fossa iliaca seguendo l'osso. Chiedi di sollevare leggermente il piede: senti il muscolo tendersi.",
    massaggio: "Pressioni lente con i polpastrelli, sempre a contatto con l'osso della fossa iliaca, in espirazione. Tieni il ritmo dell'atleta, interrompi se il fastidio è eccessivo. Ottimo nel recupero dopo tappe lunghe.",
    attenzione: "Resta sull'osso: verso il centro dell'addome ci sono intestino e vasi iliaci. Evita il lavoro con colon irritato, dolore addominale o se l'atleta ha appena mangiato."
  },

  /* ---------------------------------------------------- COSCIA ANTERIORE */
  {
    id: "sartorio", nome: "Sartorio", lat: "M. sartorius", regione: "coscia-ant", tipo: "biarticolare",
    o: "Spina iliaca antero-superiore (SIAS)",
    origine: "Spina iliaca antero-superiore (SIAS) e parte superiore dell'incisura sottostante.",
    oK: ["sias"],
    i: "Faccia mediale della tibia, parte superiore (zampa d'oca)",
    inserzione: "Parte superiore della faccia mediale della tibia, nella zampa d'oca superficiale, davanti ai tendini del gracile e del semitendinoso.",
    iK: ["zampa-oca"],
    nK: ["femorale"], radici: "L2–L3",
    azione: ["Anca: flessione, abduzione ed extrarotazione (la posizione \"a gambe incrociate\")", "Ginocchio: flessione e, a ginocchio flesso, intrarotazione della tibia"],
    ciclismo: "Muscolo lungo e sottile che partecipa alla flessione di anca e ginocchio nella risalita. Il suo tendine fa parte della zampa d'oca, sede di dolore mediale al ginocchio.",
    palpazione: "Supino: metti il tallone sul ginocchio opposto (anca flessa, abdotta, extraruotata) e chiedi di sollevare leggermente la gamba. Il muscolo si vede come una banda obliqua che parte dalla SIAS e scende verso il lato interno del ginocchio.",
    massaggio: "Supino. Sfioramento e impastamento leggero seguendo la banda dalla SIAS al ginocchio. Lavoro delicato: è sottile e superficiale.",
    attenzione: "È il margine laterale del triangolo femorale. Nel terzo medio della coscia copre il canale degli adduttori (vasi femorali e nervo safeno): niente pressioni profonde sotto il muscolo."
  },
  {
    id: "retto-femorale", nome: "Retto femorale", lat: "M. rectus femoris", regione: "coscia-ant", tipo: "biarticolare",
    o: "Capo diretto: SIAI. Capo riflesso: sopra l'acetabolo",
    origine: "Capo diretto: spina iliaca antero-inferiore (SIAI). Capo riflesso: solco sopracetabolare (sopra il margine dell'acetabolo) e capsula articolare dell'anca.",
    oK: ["siai", "acetabolo"],
    i: "Base della rotula → legamento rotuleo → tuberosità tibiale",
    inserzione: "Base della rotula tramite il tendine quadricipitale; attraverso il legamento (tendine) rotuleo l'azione arriva alla tuberosità tibiale.",
    iK: ["rotula", "tub-tibiale"],
    nK: ["femorale"], radici: "L2–L4",
    azione: ["Estensione del ginocchio", "Flessione dell'anca (unico capo del quadricipite che supera l'anca)"],
    ciclismo: "Biarticolare: lavora soprattutto nel passaggio dal punto morto superiore (circa 200°–110°, attraverso lo 0°), cioè quando l'anca finisce di flettersi e il ginocchio comincia a estendersi. In bici resta corto all'anca: spesso è rigido.",
    palpazione: "Supino o seduto: è il ventre centrale della coscia anteriore. Chiedi di sollevare la gamba tesa: si contrae al centro, a forma di V rovesciata sotto la SIAI.",
    massaggio: "Supino, cuscino sotto le ginocchia. Sfioramento dal ginocchio verso l'inguine, impastamento a due mani, scuotimenti. Nel recupero: frizioni lungo il setto con i vasti e stretching in decubito prono o laterale.",
    attenzione: "In alto, verso l'inguine, rimani lateralmente: medialmente c'è il triangolo femorale."
  },
  {
    id: "vasto-laterale", nome: "Vasto laterale", lat: "M. vastus lateralis", regione: "coscia-ant", tipo: "monoarticolare",
    o: "Linea intertrocanterica (alto), grande trocantere, tuberosità glutea, labbro laterale della linea aspra",
    origine: "Parte superiore della linea intertrocanterica; margini anteriore e inferiore del grande trocantere; labbro laterale della tuberosità glutea; metà prossimale del labbro laterale della linea aspra; setto intermuscolare laterale.",
    oK: ["linea-intertroc", "gr-trocantere", "tub-glutea", "linea-aspra"],
    i: "Base e margine laterale della rotula, retinacolo laterale → tuberosità tibiale",
    inserzione: "Base e margine laterale della rotula tramite il tendine quadricipitale; espansione nel retinacolo rotuleo laterale; attraverso il legamento rotuleo l'azione arriva alla tuberosità tibiale.",
    iK: ["rotula", "tub-tibiale"],
    nK: ["femorale"], radici: "L2–L4",
    azione: ["Estensione del ginocchio", "Tramite il retinacolo laterale tira la rotula lateralmente"],
    ciclismo: "Il muscolo più grande del quadricipite e uno dei più importanti nella spinta (circa 300°–130°). Nei ciclisti è spesso molto sviluppato e rigido: con un vasto mediale poco attivo può spostare la rotula lateralmente.",
    palpazione: "Supino: ventre laterale della coscia, davanti e sotto il tratto ileotibiale. Si contrae estendendo il ginocchio.",
    massaggio: "Supino o decubito laterale. Impastamento profondo, pressioni con palmo o avambraccio dal ginocchio verso il trocantere, frizioni lungo il margine con il tratto ileotibiale. È il muscolo dove lo \"scollamento\" della fascia dà più sollievo nel recupero.",
    attenzione: "Il tratto ileotibiale è tessuto fibroso: non si \"allunga\" massaggiandolo. Lavora il muscolo sotto e accanto, senza pressioni dolorose sulla banda."
  },
  {
    id: "vasto-mediale", nome: "Vasto mediale", lat: "M. vastus medialis", regione: "coscia-ant", tipo: "monoarticolare",
    o: "Linea intertrocanterica (basso), linea spirale, labbro mediale della linea aspra, tendini degli adduttori",
    origine: "Parte inferiore della linea intertrocanterica; linea spirale; labbro mediale della linea aspra; parte prossimale della linea sopracondiloidea mediale; tendini dell'adduttore lungo e del grande adduttore; setto intermuscolare mediale.",
    oK: ["linea-intertroc", "linea-aspra", "sopracond-med"],
    i: "Base e margine mediale della rotula, retinacolo mediale → tuberosità tibiale",
    inserzione: "Base e margine mediale della rotula tramite il tendine quadricipitale; espansione nel retinacolo rotuleo mediale; attraverso il legamento rotuleo l'azione arriva alla tuberosità tibiale. Le fibre distali oblique (vasto mediale obliquo, VMO) arrivano quasi orizzontali sul margine mediale della rotula.",
    iK: ["rotula", "tub-tibiale"],
    nK: ["femorale"], radici: "L2–L4",
    azione: ["Estensione del ginocchio", "Le fibre oblique (VMO) stabilizzano la rotula medialmente"],
    ciclismo: "Spinge insieme al vasto laterale (circa 300°–130°). Il suo equilibrio con il vasto laterale conta per il corretto scorrimento della rotula: è un muscolo chiave nel dolore anteriore di ginocchio.",
    palpazione: "Supino, ginocchio esteso: il ventre a \"goccia\" sopra e medialmente alla rotula. Si contrae spingendo il ginocchio contro il lettino.",
    massaggio: "Supino. Impastamento e pressioni dalla rotula verso l'alto e medialmente, lungo il setto con gli adduttori. Lavoro più delicato del vasto laterale.",
    attenzione: "Nel terzo medio, sotto il sartorio, c'è il canale degli adduttori: lavora il ventre, senza affondare sotto il sartorio."
  },
  {
    id: "vasto-intermedio", nome: "Vasto intermedio", lat: "M. vastus intermedius", regione: "coscia-ant", tipo: "monoarticolare",
    o: "Faccia anteriore e laterale dei 2/3 superiori del femore",
    origine: "Facce anteriore e laterale dei due terzi superiori del corpo del femore; parte inferiore del setto intermuscolare laterale.",
    oK: ["corpo-femore"],
    i: "Base della rotula (strato profondo del tendine quadricipitale) → tuberosità tibiale",
    inserzione: "Base della rotula, nello strato profondo del tendine quadricipitale; attraverso il legamento rotuleo l'azione arriva alla tuberosità tibiale.",
    iK: ["rotula", "tub-tibiale"],
    nK: ["femorale"], radici: "L2–L4",
    azione: ["Estensione del ginocchio"],
    ciclismo: "Spinge insieme agli altri vasti. Profondo, lavora a contatto con l'osso.",
    palpazione: "Non palpabile in modo isolato: si trova sotto il retto femorale. Si raggiunge spostando il retto femorale lateralmente o medialmente.",
    massaggio: "Pressioni profonde attraverso il retto femorale rilassato; impastamento \"a pinza\" sollevando il retto femorale.",
    attenzione: ""
  },
  {
    id: "articolare-ginocchio", nome: "Articolare del ginocchio", lat: "M. articularis genus", regione: "coscia-ant", tipo: "monoarticolare",
    o: "Faccia anteriore della parte distale del femore",
    origine: "Faccia anteriore della parte distale del corpo del femore, sotto il vasto intermedio (spesso unito ad esso).",
    oK: ["femore-distale-ant"],
    i: "Borsa sovrarotulea (capsula del ginocchio)",
    inserzione: "Parte superiore della membrana sinoviale del ginocchio e borsa sovrarotulea.",
    iK: ["borsa-sovrarot"],
    nK: ["femorale"], radici: "L3–L4",
    azione: ["Tira in alto la borsa sovrarotulea durante l'estensione, evitando che resti pizzicata"],
    ciclismo: "Piccolo muscolo che lavora a ogni estensione del ginocchio.",
    palpazione: "Non palpabile.",
    massaggio: "Nessun lavoro specifico.",
    attenzione: ""
  },

  /* ---------------------------------------------------- COSCIA MEDIALE */
  {
    id: "pettineo", nome: "Pettineo", lat: "M. pectineus", regione: "coscia-med", tipo: "monoarticolare",
    o: "Linea pettinea del pube (ramo superiore)",
    origine: "Linea pettinea (pecten) del pube e superficie del ramo superiore del pube davanti ad essa.",
    oK: ["linea-pettinea-pube"],
    i: "Linea pettinea del femore, sotto il piccolo trocantere",
    inserzione: "Linea pettinea del femore, tra il piccolo trocantere e la linea aspra.",
    iK: ["linea-pettinea-fem"],
    nK: ["femorale"], nKx: ["otturatorio"], radici: "L2–L3",
    nervoNota: "N. femorale; a volte riceve anche un ramo dal n. otturatorio (o dall'otturatorio accessorio).",
    azione: ["Adduzione dell'anca", "Flessione dell'anca"],
    ciclismo: "Collabora alla risalita della gamba e alla stabilità dell'anca.",
    palpazione: "Supino: forma il pavimento del triangolo femorale, tra ileopsoas (lato) e adduttore lungo (medio). Difficile da isolare.",
    massaggio: "Solo lavoro leggero o indiretto (stretching in abduzione): si trova nel triangolo femorale.",
    attenzione: "Sopra il pettineo passano arteria e vena femorali: niente pressioni profonde."
  },
  {
    id: "adduttore-lungo", nome: "Adduttore lungo", lat: "M. adductor longus", regione: "coscia-med", tipo: "monoarticolare",
    o: "Corpo del pube, sotto la cresta pubica, lateralmente alla sinfisi",
    origine: "Faccia anteriore del corpo del pube, sotto la cresta pubica e lateralmente alla sinfisi pubica, con un tendine robusto e arrotondato.",
    oK: ["pube-corpo"],
    i: "Terzo medio del labbro mediale della linea aspra",
    inserzione: "Terzo medio del labbro mediale della linea aspra del femore.",
    iK: ["linea-aspra"],
    nK: ["otturatorio"], radici: "L2–L4",
    azione: ["Adduzione dell'anca", "Partecipa alla flessione dell'anca e alla stabilità del bacino"],
    ciclismo: "Stabilizza la coscia e collabora nel passaggio dei punti morti. Nei ciclisti che fanno anche fuoristrada o ciclocross è più sollecitato.",
    palpazione: "Supino, anca abdotta: il tendine è la corda più evidente vicino al pube, nell'angolo tra coscia e inguine. Il ventre scende obliquo verso il centro della coscia.",
    massaggio: "Supino, gamba leggermente abdotta ed extraruotata (piede contro il ginocchio opposto). Impastamento, pressioni lungo il ventre dalla coscia verso il pube. Avvisa l'atleta prima di lavorare vicino all'inguine.",
    attenzione: "È il margine mediale del triangolo femorale. Zona intima: comunica sempre cosa fai, usa un telo e rimani a distanza dai genitali. Dolore all'inserzione pubica = valuta con medico (pubalgia)."
  },
  {
    id: "adduttore-breve", nome: "Adduttore breve", lat: "M. adductor brevis", regione: "coscia-med", tipo: "monoarticolare",
    o: "Corpo e ramo inferiore del pube",
    origine: "Corpo e ramo inferiore del pube, sotto l'origine dell'adduttore lungo.",
    oK: ["pube-corpo", "pube-ramo-inf"],
    i: "Linea pettinea (parte distale) e terzo superiore della linea aspra",
    inserzione: "Parte distale della linea pettinea e parte prossimale (terzo superiore) della linea aspra del femore.",
    iK: ["linea-pettinea-fem", "linea-aspra"],
    nK: ["otturatorio"], radici: "L2–L4",
    azione: ["Adduzione dell'anca", "Partecipa alla flessione dell'anca"],
    ciclismo: "Stabilizzatore della coscia.",
    palpazione: "Profondo, sotto adduttore lungo e pettineo: non si isola con certezza.",
    massaggio: "Lavoro attraverso l'adduttore lungo con pressioni lente.",
    attenzione: "Vicinanza al triangolo femorale."
  },
  {
    id: "grande-adduttore", nome: "Grande adduttore", lat: "M. adductor magnus", regione: "coscia-med", tipo: "monoarticolare",
    o: "Ramo inferiore del pube, ramo dell'ischio, tuberosità ischiatica",
    origine: "Parte adduttoria: ramo inferiore del pube e ramo dell'ischio. Parte ischiocrurale (\"femorale\"): tuberosità ischiatica (porzione infero-laterale).",
    oK: ["pube-ramo-inf", "ischio-ramo", "tub-isch"],
    i: "Tuberosità glutea, linea aspra, linea sopracondiloidea mediale; tubercolo dell'adduttore",
    inserzione: "Parte adduttoria: tuberosità glutea, linea aspra e linea sopracondiloidea mediale. Parte ischiocrurale: tubercolo dell'adduttore del femore (sopra il condilo mediale). Tra le due parti si apre lo iato degli adduttori.",
    iK: ["tub-glutea", "linea-aspra", "sopracond-med", "tub-adduttore"],
    nK: ["otturatorio", "tibiale"], radici: "L2–L4",
    nervoNota: "Parte adduttoria: n. otturatorio (ramo posteriore, L2–L4). Parte ischiocrurale: componente tibiale del n. sciatico (L4).",
    azione: ["Adduzione dell'anca", "Parte adduttoria: flessione dell'anca", "Parte ischiocrurale: estensione dell'anca"],
    ciclismo: "Grande e potente: la parte ischiocrurale aiuta il grande gluteo nell'estensione dell'anca durante la spinta. Spesso contratto nei ciclisti di gare a tappe.",
    palpazione: "Supino con anca abdotta o prono: è la massa più posteriore del lato interno della coscia, tra gracile e semimembranoso. Il tendine distale si sente sopra il condilo mediale, sul tubercolo dell'adduttore.",
    massaggio: "Prono o supino a gamba abdotta. Impastamento ampio, pressioni con palmo o avambraccio dal ginocchio verso l'ischio, scuotimenti.",
    attenzione: "Lo iato degli adduttori (terzo inferiore, sopra il ginocchio) è il passaggio dei vasi femorali verso il cavo popliteo: niente pressioni profonde puntiformi lì."
  },
  {
    id: "gracile", nome: "Gracile", lat: "M. gracilis", regione: "coscia-med", tipo: "biarticolare",
    o: "Corpo e ramo inferiore del pube",
    origine: "Margine inferiore del corpo del pube e ramo inferiore del pube.",
    oK: ["pube-corpo", "pube-ramo-inf"],
    i: "Faccia mediale della tibia, parte superiore (zampa d'oca)",
    inserzione: "Parte superiore della faccia mediale della tibia, nella zampa d'oca, tra il sartorio (davanti) e il semitendinoso (dietro).",
    iK: ["zampa-oca"],
    nK: ["otturatorio"], radici: "L2–L3",
    azione: ["Adduzione dell'anca", "Flessione del ginocchio", "Intrarotazione della tibia a ginocchio flesso"],
    ciclismo: "Il più superficiale e mediale degli adduttori. Biarticolare: partecipa alla flessione del ginocchio nella risalita. Fa parte della zampa d'oca.",
    palpazione: "Supino, anca abdotta: dietro il tendine dell'adduttore lungo, un tendine sottile che scende lungo il lato interno della coscia fino al ginocchio.",
    massaggio: "Sfioramento e impastamento leggero lungo il lato interno della coscia. Pinzamento delicato del ventre sottile.",
    attenzione: "Zona intima in alto: comunica e usa il telo."
  },

  /* ------------------------------------------------- COSCIA POSTERIORE */
  {
    id: "bicipite-femorale", nome: "Bicipite femorale", lat: "M. biceps femoris", regione: "coscia-post", tipo: "capo lungo biarticolare, capo breve monoarticolare",
    o: "Capo lungo: tuberosità ischiatica. Capo breve: linea aspra e linea sopracondiloidea laterale",
    origine: "Capo lungo: faccetta infero-mediale della parte superiore della tuberosità ischiatica, con un tendine comune al semitendinoso, e legamento sacrotuberoso. Capo breve: labbro laterale della linea aspra e due terzi prossimali della linea sopracondiloidea laterale del femore.",
    oK: ["tub-isch", "sacrotub", "linea-aspra", "sopracond-lat"],
    i: "Testa della fibula (faccia laterale)",
    inserzione: "Faccia laterale della testa della fibula; il tendine è diviso in due dal legamento collaterale laterale del ginocchio. Alcune fibre raggiungono il condilo laterale della tibia.",
    iK: ["testa-fibula"],
    nK: ["tibiale", "peroneo-comune"], radici: "L5–S2",
    nervoNota: "Capo lungo: componente tibiale del n. sciatico. Capo breve: componente peronea comune del n. sciatico (L5–S2).",
    azione: ["Flessione del ginocchio", "Extrarotazione della tibia a ginocchio flesso", "Capo lungo: estensione dell'anca"],
    ciclismo: "I femorali lavorano soprattutto da circa 10° a 230°: estendono l'anca nella seconda metà della spinta e \"tirano\" la pedivella oltre il punto morto inferiore. Una sella troppo alta li mette in tensione eccessiva (dolore dietro il ginocchio).",
    palpazione: "Prono, ginocchio flesso contro resistenza: il tendine è la corda laterale del cavo popliteo e si segue fino alla testa della fibula. Il ventre occupa il lato posteriore-esterno della coscia.",
    massaggio: "Prono, cuscino sotto le caviglie. Sfioramento dal ginocchio all'ischio, impastamento a due mani, pressioni lungo il ventre, scuotimenti. Nel recupero frizioni trasversali sul ventre (non sul tendine se dolente).",
    attenzione: "Il nervo peroneo comune scorre lungo il margine mediale del tendine del bicipite e gira intorno al collo della fibula, subito sotto la testa: lì niente pressioni o frizioni (rischio di parestesie). Nel cavo popliteo solo sfioramento leggero."
  },
  {
    id: "semitendinoso", nome: "Semitendinoso", lat: "M. semitendinosus", regione: "coscia-post", tipo: "biarticolare",
    o: "Tuberosità ischiatica (tendine comune con il capo lungo del bicipite)",
    origine: "Faccetta infero-mediale della parte superiore della tuberosità ischiatica, con un tendine comune al capo lungo del bicipite femorale.",
    oK: ["tub-isch"],
    i: "Faccia mediale della tibia, parte superiore (zampa d'oca)",
    inserzione: "Parte superiore della faccia mediale della tibia, nella zampa d'oca, dietro (e sotto) al tendine del gracile.",
    iK: ["zampa-oca"],
    nK: ["tibiale"], radici: "L5–S2",
    azione: ["Estensione dell'anca", "Flessione del ginocchio", "Intrarotazione della tibia a ginocchio flesso"],
    ciclismo: "Femorale mediale: lavora con il bicipite nella seconda parte della spinta e nel passaggio del punto morto inferiore.",
    palpazione: "Prono, ginocchio flesso contro resistenza: il tendine sottile e superficiale è la corda mediale più evidente del cavo popliteo.",
    massaggio: "Come il bicipite femorale, sul lato mediale della coscia posteriore.",
    attenzione: "Nel cavo popliteo solo sfioramento: arteria e vena poplitee, nervo tibiale."
  },
  {
    id: "semimembranoso", nome: "Semimembranoso", lat: "M. semimembranosus", regione: "coscia-post", tipo: "biarticolare",
    o: "Tuberosità ischiatica (faccetta supero-laterale)",
    origine: "Faccetta supero-laterale della tuberosità ischiatica, con un tendine appiattito e membranoso (da qui il nome).",
    oK: ["tub-isch"],
    i: "Faccia posteriore del condilo mediale della tibia",
    inserzione: "Parte posteriore del condilo mediale della tibia (solco orizzontale). Espansioni: legamento popliteo obliquo, fascia del muscolo popliteo, capsula e menisco mediale.",
    iK: ["condilo-tib-med"],
    nK: ["tibiale"], radici: "L5–S2",
    azione: ["Estensione dell'anca", "Flessione del ginocchio", "Intrarotazione della tibia a ginocchio flesso", "Tira indietro il menisco mediale durante la flessione"],
    ciclismo: "Femorale mediale profondo e voluminoso. Lavora con gli altri femorali nella spinta e nel passaggio del punto morto inferiore.",
    palpazione: "Prono: ai lati del tendine del semitendinoso, più profondo e più largo, sopra il ginocchio sul lato mediale.",
    massaggio: "Impastamento e pressioni sul lato mediale della coscia posteriore. Lavora la zona sopra il ginocchio con pollici, senza entrare nel cavo popliteo.",
    attenzione: "Nel cavo popliteo solo sfioramento."
  },

  /* ---------------------------------------------------- GAMBA ANTERIORE */
  {
    id: "tibiale-anteriore", nome: "Tibiale anteriore", lat: "M. tibialis anterior", regione: "gamba-ant", tipo: "monoarticolare (caviglia e piede)",
    o: "Condilo laterale e metà superiore della faccia laterale della tibia, membrana interossea",
    origine: "Condilo laterale e metà (fino a due terzi) superiore della faccia laterale della tibia; membrana interossea; fascia crurale profonda.",
    oK: ["condilo-tib-lat", "tibia-lat", "membr-interossea"],
    i: "Cuneiforme mediale (faccia mediale e plantare) e base del 1° metatarso",
    inserzione: "Faccia mediale e plantare del cuneiforme mediale e base del primo metatarso.",
    iK: ["cuneiforme-med", "meta1-base"],
    nK: ["peroneo-prof"], radici: "L4–L5",
    azione: ["Flessione dorsale della caviglia", "Inversione (supinazione) del piede", "Sostiene l'arco longitudinale mediale"],
    ciclismo: "Attivo soprattutto nella risalita e nel passaggio del punto morto superiore (circa 280°–90°): alza la punta del piede. Lavora molto con la pedalata \"rotonda\" e con tacchette troppo arretrate. Fastidi frequenti con scarpe troppo strette in punta o al collo del piede.",
    palpazione: "Supino o seduto: subito lateralmente alla cresta tibiale. Chiedi di alzare la punta e girare il piede all'interno: il tendine diventa la corda più evidente sulla parte anteriore-mediale della caviglia.",
    massaggio: "Supino. Sfioramento dalla caviglia al ginocchio, impastamento a pollici alternati, pressioni lungo il ventre accanto alla tibia. Evita di premere sull'osso (cresta tibiale).",
    attenzione: "Dolore intenso e crescente in loggia anteriore durante lo sforzo, che passa solo a riposo, con formicolio sul dorso del piede: possibile sindrome compartimentale da sforzo → medico, non massaggio aggressivo."
  },
  {
    id: "estensore-lungo-alluce", nome: "Estensore lungo dell'alluce", lat: "M. extensor hallucis longus", regione: "gamba-ant", tipo: "poliarticolare",
    o: "Parte media della faccia anteriore della fibula, membrana interossea",
    origine: "Parte media della faccia anteriore (mediale) della fibula e membrana interossea adiacente.",
    oK: ["fibula-ant", "membr-interossea"],
    i: "Base della falange distale dell'alluce (dorso)",
    inserzione: "Faccia dorsale della base della falange distale dell'alluce.",
    iK: ["falange-dist-1-dors"],
    nK: ["peroneo-prof"], radici: "L5–S1",
    azione: ["Estensione dell'alluce", "Flessione dorsale della caviglia"],
    ciclismo: "Collabora con il tibiale anteriore nel sollevare la punta in risalita. Con scarpe strette il tendine può infiammarsi sul dorso del piede.",
    palpazione: "Il ventre è coperto da tibiale anteriore ed estensore lungo delle dita. Il tendine si vede bene sul dorso del piede e della caviglia estendendo l'alluce, lateralmente al tendine del tibiale anteriore.",
    massaggio: "Sfioramento e pressioni leggere sul ventre tra tibiale anteriore ed estensore lungo delle dita; frizioni leggere lungo il tendine sul dorso del piede.",
    attenzione: "Lateralmente al suo tendine, sul dorso del piede, si sente il polso dell'arteria dorsale del piede (pedidia): pressione leggera."
  },
  {
    id: "estensore-lungo-dita", nome: "Estensore lungo delle dita", lat: "M. extensor digitorum longus", regione: "gamba-ant", tipo: "poliarticolare",
    o: "Condilo laterale della tibia, 3/4 superiori della faccia anteriore della fibula, membrana interossea",
    origine: "Condilo laterale della tibia; tre quarti superiori della faccia anteriore (mediale) della fibula; parte superiore della membrana interossea; fascia crurale profonda.",
    oK: ["condilo-tib-lat", "fibula-ant", "membr-interossea"],
    i: "Falangi media e distale del 2°–5° dito (espansioni dorsali)",
    inserzione: "Quattro tendini per il 2°–5° dito che formano le espansioni dorsali (cuffie degli estensori) e si inseriscono sulle basi delle falangi medie e distali.",
    iK: ["falangi-2-5-dors"],
    nK: ["peroneo-prof"], radici: "L5–S1",
    azione: ["Estensione del 2°–5° dito", "Flessione dorsale della caviglia", "Collabora all'eversione"],
    ciclismo: "Collabora alla risalita del piede. Contratture frequenti in chi \"artiglia\" le dita dentro la scarpa.",
    palpazione: "Lateralmente al tibiale anteriore, tra questo e i peronei. I quattro tendini si vedono sul dorso del piede estendendo le dita.",
    massaggio: "Supino. Pressioni a pollici lungo il ventre (lato esterno della loggia anteriore), sfioramento sul dorso del piede.",
    attenzione: "Vicino al collo della fibula, in alto, passa il nervo peroneo comune: niente pressioni lì."
  },
  {
    id: "terzo-peroneo", nome: "Terzo peroneo (fibulare terzo)", lat: "M. fibularis (peroneus) tertius", regione: "gamba-ant", tipo: "poliarticolare",
    o: "Terzo inferiore della faccia anteriore della fibula, membrana interossea",
    origine: "Terzo inferiore della faccia anteriore (mediale) della fibula e membrana interossea. Spesso è una parte separata dell'estensore lungo delle dita e in una piccola parte di persone manca.",
    oK: ["fibula-ant-inf", "membr-interossea"],
    i: "Dorso della base del 5° metatarso",
    inserzione: "Faccia dorsale della base del quinto metatarso.",
    iK: ["meta5-dors"],
    nK: ["peroneo-prof"], radici: "L5–S1",
    azione: ["Flessione dorsale della caviglia", "Eversione del piede"],
    ciclismo: "Ruolo minore nella risalita del piede.",
    palpazione: "Il tendine si sente sul dorso-laterale del piede, lateralmente all'ultimo tendine dell'estensore lungo delle dita, diretto alla base del 5° metatarso.",
    massaggio: "Lavoro insieme all'estensore lungo delle dita.",
    attenzione: ""
  },

  /* ---------------------------------------------------- GAMBA LATERALE */
  {
    id: "peroneo-lungo", nome: "Peroneo (fibulare) lungo", lat: "M. fibularis (peroneus) longus", regione: "gamba-lat", tipo: "poliarticolare",
    o: "Testa e 2/3 superiori della faccia laterale della fibula",
    origine: "Testa della fibula e due terzi superiori della faccia laterale della fibula; setti intermuscolari; alcune fibre dal condilo laterale della tibia.",
    oK: ["testa-fibula", "fibula-lat"],
    i: "Base del 1° metatarso e cuneiforme mediale (faccia plantare)",
    inserzione: "Faccia plantare-laterale della base del primo metatarso e del cuneiforme mediale. Il tendine passa dietro il malleolo laterale (posteriore al peroneo breve), poi nel solco del cuboide e attraversa la pianta.",
    iK: ["meta1-base", "cuneiforme-med"],
    nK: ["peroneo-sup"], radici: "L5–S2",
    azione: ["Eversione (pronazione) del piede", "Flessione plantare della caviglia (debole)", "Sostiene l'arco trasverso e longitudinale del piede", "Abbassa la testa del 1° metatarso (appoggio dell'avampiede)"],
    ciclismo: "Stabilizza il piede sul pedale durante la spinta. Con solette, cunei o tacchette regolate male lavora in eccesso: tensione laterale della gamba.",
    palpazione: "Supino o decubito laterale: lungo la fibula, dalla testa verso il basso. Chiedi di girare la pianta verso l'esterno: il tendine si sente dietro il malleolo laterale.",
    massaggio: "Decubito laterale o supino con gamba intraruotata. Pressioni con pollici dall'alto verso il basso e ritorno di sfioramento verso il ginocchio, impastamento leggero.",
    attenzione: "Sotto la testa della fibula, attorno al collo, passa il nervo peroneo comune: niente pressioni o frizioni nella parte più alta del muscolo."
  },
  {
    id: "peroneo-breve", nome: "Peroneo (fibulare) breve", lat: "M. fibularis (peroneus) brevis", regione: "gamba-lat", tipo: "poliarticolare",
    o: "2/3 inferiori della faccia laterale della fibula",
    origine: "Due terzi inferiori della faccia laterale della fibula; setti intermuscolari.",
    oK: ["fibula-lat"],
    i: "Tuberosità della base del 5° metatarso",
    inserzione: "Tuberosità (faccia dorsale-laterale) della base del quinto metatarso. Il tendine passa dietro il malleolo laterale, davanti (e più vicino all'osso) al peroneo lungo.",
    iK: ["meta5-tub"],
    nK: ["peroneo-sup"], radici: "L5–S2",
    azione: ["Eversione del piede", "Flessione plantare della caviglia (debole)", "Protegge dalla distorsione in inversione"],
    ciclismo: "Stabilizzatore laterale della caviglia. Importante dopo cadute o storte.",
    palpazione: "Il ventre è sotto il peroneo lungo, nella metà inferiore della gamba laterale. Il tendine si segue dal malleolo laterale alla base del 5° metatarso (sporgenza sul bordo esterno del piede).",
    massaggio: "Pressioni con pollici lungo il ventre, frizioni leggere lungo il tendine dietro il malleolo.",
    attenzione: ""
  },

  /* -------------------------------------------------- POLPACCIO SUPERF. */
  {
    id: "gastrocnemio", nome: "Gastrocnemio", lat: "M. gastrocnemius", regione: "gamba-post-sup", tipo: "biarticolare",
    o: "Capo mediale: sopra il condilo mediale del femore. Capo laterale: faccia laterale del condilo laterale",
    origine: "Capo mediale: faccia poplitea del femore, sopra il condilo mediale. Capo laterale: faccia laterale del condilo laterale del femore. Entrambi anche dalla capsula del ginocchio.",
    oK: ["condilo-fem-med", "condilo-fem-lat"],
    i: "Faccia posteriore del calcagno (tendine d'Achille)",
    inserzione: "Parte media della faccia posteriore del calcagno (tuberosità calcaneare), tramite il tendine calcaneare (d'Achille), comune al soleo.",
    iK: ["calcagno-post"],
    nK: ["tibiale"], radici: "S1–S2",
    azione: ["Flessione plantare della caviglia", "Flessione del ginocchio", "Solleva il tallone nel cammino e nella corsa"],
    ciclismo: "Trasmette la forza al pedale nella spinta e nel passaggio del punto morto inferiore (circa 30°–270°). Biarticolare: più è alta la sella, più lavora allungato. Con tacchette molto avanzate viene caricato di più.",
    palpazione: "Prono, piedi fuori dal lettino: chiedi di spingere la punta in basso contro la tua mano. I due capi formano il rilievo del polpaccio; il mediale scende più in basso del laterale.",
    massaggio: "Prono, cuscino sotto le caviglie (ginocchio leggermente flesso). Sfioramento dal tallone al ginocchio, impastamento a \"S\" e a due mani separando i due capi, scuotimenti, pressioni lungo la linea mediana. Pre-gara: scuotimenti e impastamento rapido. Post-gara: sfioramento lento centripeto con gamba sollevata.",
    attenzione: "Tra i due capi, in alto, c'è il cavo popliteo (vasi poplitei, nervo tibiale): solo sfioramento. Polpaccio gonfio, caldo, arrossato e dolente senza un trauma chiaro (soprattutto dopo viaggi lunghi in auto o aereo tra le tappe) → sospetta trombosi venosa profonda: NON massaggiare e invia subito al medico."
  },
  {
    id: "soleo", nome: "Soleo", lat: "M. soleus", regione: "gamba-post-sup", tipo: "monoarticolare",
    o: "Testa e faccia posteriore della fibula (alto), linea del soleo e margine mediale della tibia",
    origine: "Faccia posteriore della testa della fibula e quarto/terzo superiore della faccia posteriore della fibula; linea del soleo e terzo medio del margine mediale della tibia; arcata tendinea del soleo, tesa tra tibia e fibula.",
    oK: ["testa-fibula", "fibula-post", "linea-soleo", "tibia-margine-med"],
    i: "Faccia posteriore del calcagno (tendine d'Achille)",
    inserzione: "Parte media della faccia posteriore del calcagno, tramite il tendine calcaneare comune al gastrocnemio.",
    iK: ["calcagno-post"],
    nK: ["tibiale"], radici: "S1–S2",
    azione: ["Flessione plantare della caviglia (a qualsiasi angolo del ginocchio)", "Stabilizza la gamba sul piede in piedi", "Pompa muscolo-venosa: spinge il sangue venoso verso il cuore"],
    ciclismo: "Molto attivo in spinta (circa 340°–180°) e dominante quando il ginocchio è flesso, come nella pedalata. Ricco di fibre lente: lavora per ore. È la \"pompa\" del ritorno venoso: un massaggio drenante qui aiuta molto dopo tappe lunghe.",
    palpazione: "Prono con ginocchio flesso a 90° (così il gastrocnemio si rilassa): spingi la pianta verso il soffitto e chiedi di resistere. Il soleo sporge ai lati del gastrocnemio, soprattutto nella metà inferiore del polpaccio.",
    massaggio: "Prono con ginocchio flesso a 90° o supino con ginocchio flesso e piede appoggiato. Impastamento profondo, pressioni ai lati del tendine d'Achille risalendo verso il ginocchio, sfioramento drenante.",
    attenzione: "Stesse attenzioni del gastrocnemio per la trombosi venosa profonda. Le vene profonde del polpaccio corrono tra soleo e muscoli profondi."
  },
  {
    id: "plantare", nome: "Plantare (gracile)", lat: "M. plantaris", regione: "gamba-post-sup", tipo: "biarticolare",
    o: "Estremità inferiore della linea sopracondiloidea laterale, legamento popliteo obliquo",
    origine: "Estremità inferiore della linea sopracondiloidea laterale del femore e legamento popliteo obliquo. Manca in una parte delle persone (circa il 7–10%).",
    oK: ["sopracond-lat"],
    i: "Calcagno, medialmente al tendine d'Achille (o con esso)",
    inserzione: "Faccia posteriore del calcagno, sul lato mediale del tendine calcaneare (a volte si fonde con esso). Il suo tendine è lunghissimo e sottile.",
    iK: ["calcagno-post"],
    nK: ["tibiale"], radici: "S1–S2",
    azione: ["Debole flessione plantare", "Debole flessione del ginocchio"],
    ciclismo: "Ruolo minore. Il suo tendine può essere coinvolto in alcuni dolori del tendine d'Achille (lato mediale).",
    palpazione: "Difficile: il piccolo ventre si trova nel cavo popliteo, sotto il capo laterale del gastrocnemio.",
    massaggio: "Nessun lavoro specifico (si trova nel cavo popliteo).",
    attenzione: "Cavo popliteo: solo sfioramento."
  },

  /* -------------------------------------------------- POLPACCIO PROFONDO */
  {
    id: "popliteo", nome: "Popliteo", lat: "M. popliteus", regione: "gamba-post-prof", tipo: "monoarticolare",
    o: "Faccia laterale del condilo laterale del femore, menisco laterale",
    origine: "Faccia laterale del condilo laterale del femore (fossetta del popliteo), con un tendine intra-capsulare; menisco laterale; legamento popliteo arcuato.",
    oK: ["condilo-fem-lat", "menisco-lat"],
    i: "Faccia posteriore della tibia, sopra la linea del soleo",
    inserzione: "Faccia posteriore della tibia, nell'area triangolare sopra la linea del soleo.",
    iK: ["tibia-post-sup"],
    nK: ["tibiale"], radici: "L4–S1",
    azione: ["\"Sblocca\" il ginocchio esteso: ruota la tibia all'interno (o il femore all'esterno se il piede è a terra)", "Debole flessione del ginocchio", "Tira indietro il menisco laterale durante la flessione"],
    ciclismo: "Stabilizzatore postero-laterale del ginocchio. Può dare dolore dietro-lateralmente al ginocchio, soprattutto con tacchette troppo libere o ruotate.",
    palpazione: "Profondo, sotto i gastrocnemi. Il tendine si può cercare sul lato laterale del ginocchio, tra legamento collaterale laterale e tendine del bicipite, con ginocchio flesso.",
    massaggio: "Lavoro leggero e molto mirato, solo da esperti: il ventre è nel cavo popliteo, sotto vasi e nervi.",
    attenzione: "Cavo popliteo: niente pressioni profonde."
  },
  {
    id: "flessore-lungo-alluce", nome: "Flessore lungo dell'alluce", lat: "M. flexor hallucis longus", regione: "gamba-post-prof", tipo: "poliarticolare",
    o: "2/3 inferiori della faccia posteriore della fibula, membrana interossea",
    origine: "Due terzi inferiori della faccia posteriore della fibula e parte inferiore della membrana interossea.",
    oK: ["fibula-post", "membr-interossea"],
    i: "Base della falange distale dell'alluce (pianta)",
    inserzione: "Faccia plantare della base della falange distale dell'alluce. Il tendine passa nel solco della faccia posteriore del talo e sotto il sustentaculum tali del calcagno.",
    iK: ["falange-dist-1-plant"],
    nK: ["tibiale"], radici: "S2–S3",
    azione: ["Flessione dell'alluce", "Flessione plantare della caviglia (debole)", "Sostiene l'arco longitudinale mediale"],
    ciclismo: "Stabilizza l'avampiede sul pedale. Chi \"artiglia\" con l'alluce dentro la scarpa lo sovraccarica.",
    palpazione: "Il ventre è profondo, lateralmente nella metà inferiore del polpaccio, sotto il soleo. Il tendine si sente dietro il malleolo mediale (il più posteriore) flettendo l'alluce.",
    massaggio: "Pressioni profonde attraverso il soleo, lateralmente al tendine d'Achille, nella metà inferiore del polpaccio.",
    attenzione: "Dietro il malleolo mediale passa il fascio vascolo-nervoso tibiale posteriore (arteria, vene, nervo tibiale): niente frizioni profonde lì."
  },
  {
    id: "flessore-lungo-dita", nome: "Flessore lungo delle dita", lat: "M. flexor digitorum longus", regione: "gamba-post-prof", tipo: "poliarticolare",
    o: "Faccia posteriore della tibia sotto la linea del soleo (parte mediale)",
    origine: "Parte mediale della faccia posteriore della tibia, sotto la linea del soleo; con un largo tendine anche dalla fibula.",
    oK: ["tibia-post"],
    i: "Basi delle falangi distali del 2°–5° dito (pianta)",
    inserzione: "Faccia plantare delle basi delle falangi distali del 2°–5° dito. Il tendine passa dietro il malleolo mediale e in pianta riceve il quadrato della pianta e dà origine ai lombricali.",
    iK: ["falangi-dist-2-5-plant"],
    nK: ["tibiale"], radici: "S2–S3",
    azione: ["Flessione del 2°–5° dito", "Flessione plantare della caviglia (debole)", "Sostiene l'arco longitudinale"],
    ciclismo: "Stabilizza le dita sulla soletta durante la spinta.",
    palpazione: "Il ventre si sente in profondità lungo il margine mediale della tibia, nella metà inferiore della gamba, spingendo il soleo all'indietro. Il tendine è dietro il malleolo mediale, tra quello del tibiale posteriore e il fascio vascolo-nervoso.",
    massaggio: "Pressioni con pollici lungo il margine mediale della tibia (dietro l'osso), dal basso verso l'alto.",
    attenzione: "Dolore puntiforme lungo il margine mediale della tibia in chi corre anche a piedi: periostite / stress tibiale mediale → valutazione medica se persiste."
  },
  {
    id: "tibiale-posteriore", nome: "Tibiale posteriore", lat: "M. tibialis posterior", regione: "gamba-post-prof", tipo: "poliarticolare",
    o: "Membrana interossea, faccia posteriore di tibia e fibula",
    origine: "Membrana interossea; faccia posteriore della tibia sotto la linea del soleo (parte laterale); faccia posteriore della fibula (parte mediale).",
    oK: ["membr-interossea", "tibia-post", "fibula-post"],
    i: "Tuberosità del navicolare (principale), cuneiformi, cuboide, basi del 2°–4° metatarso",
    inserzione: "Principalmente sulla tuberosità del navicolare; espansioni a tutti e tre i cuneiformi, al cuboide, alle basi del 2°–4° metatarso e al sustentaculum tali del calcagno.",
    iK: ["navicolare", "cuneiformi", "cuboide", "metatarsi-2-4"],
    nK: ["tibiale"], radici: "L4–L5",
    azione: ["Inversione del piede", "Flessione plantare della caviglia", "Principale sostegno dinamico dell'arco longitudinale mediale"],
    ciclismo: "Tiene stabile l'arco del piede sotto carico. Con piede piatto o pronato e solette inadatte lavora di più.",
    palpazione: "Il ventre è il più profondo della loggia: non si palpa direttamente. Il tendine è il primo (il più anteriore) dietro il malleolo mediale e si segue fino al navicolare chiedendo inversione + flessione plantare.",
    massaggio: "Lavoro indiretto in profondità nella metà inferiore del polpaccio. Frizioni leggere lungo il tendine dal malleolo al navicolare (no se dolente o gonfio).",
    attenzione: "Ordine dei tendini dietro il malleolo mediale, da davanti a dietro: Tibiale posteriore, flessore lungo delle Dita, Arteria e Vene tibiali posteriori, Nervo tibiale, flessore lungo dell'alluce (Hallucis) → \"Tom, Dick And Very Nervous Harry\"."
  },

  /* ---------------------------------------------------- DORSO PIEDE */
  {
    id: "estensore-breve-dita", nome: "Estensore breve delle dita", lat: "M. extensor digitorum brevis", regione: "piede-dors", tipo: "intrinseco",
    o: "Faccia supero-laterale del calcagno, retinacolo inferiore degli estensori",
    origine: "Parte anteriore della faccia superiore e laterale del calcagno (davanti al seno del tarso); retinacolo inferiore degli estensori.",
    oK: ["calcagno-dors"],
    i: "Tendini dell'estensore lungo del 2°–4° dito",
    inserzione: "Tre tendini che si uniscono al lato laterale dei tendini dell'estensore lungo delle dita per il 2°, 3° e 4° dito.",
    iK: ["tendini-edl"],
    nK: ["peroneo-prof"], radici: "L5–S1",
    azione: ["Aiuta l'estensione del 2°–4° dito"],
    ciclismo: "Piccolo muscolo del dorso. Con scarpe troppo strette (chiusure, cinghie) il dorso del piede può diventare dolente.",
    palpazione: "Il ventre forma un piccolo rilievo morbido davanti al malleolo laterale, sul dorso laterale del piede, estendendo le dita.",
    massaggio: "Pressioni circolari con i pollici e sfioramento sul dorso del piede verso la caviglia.",
    attenzione: "Pressione leggera vicino al polso della pedidia."
  },
  {
    id: "estensore-breve-alluce", nome: "Estensore breve dell'alluce", lat: "M. extensor hallucis brevis", regione: "piede-dors", tipo: "intrinseco",
    o: "Faccia supero-laterale del calcagno (con l'estensore breve delle dita)",
    origine: "Faccia superiore del calcagno, insieme all'estensore breve delle dita (ne è considerato la parte mediale).",
    oK: ["calcagno-dors"],
    i: "Base della falange prossimale dell'alluce (dorso)",
    inserzione: "Faccia dorsale della base della falange prossimale dell'alluce.",
    iK: ["falange-prox-1-dors"],
    nK: ["peroneo-prof"], radici: "L5–S1",
    azione: ["Estensione dell'alluce a livello della metatarso-falangea"],
    ciclismo: "Piccolo muscolo del dorso del piede.",
    palpazione: "Mediale all'estensore breve delle dita, sul dorso del piede.",
    massaggio: "Come l'estensore breve delle dita.",
    attenzione: ""
  },

  /* ---------------------------------------------------- PIANTA PIEDE */
  {
    id: "abduttore-alluce", nome: "Abduttore dell'alluce", lat: "M. abductor hallucis", regione: "piede-plant", strato: 1, tipo: "intrinseco",
    o: "Processo mediale della tuberosità calcaneare, retinacolo dei flessori, aponeurosi plantare",
    origine: "Processo mediale della tuberosità del calcagno; retinacolo dei flessori; aponeurosi plantare; setto intermuscolare.",
    oK: ["calcagno-proc-med"],
    i: "Lato mediale della base della falange prossimale dell'alluce",
    inserzione: "Lato mediale della base della falange prossimale dell'alluce (insieme al sesamoide mediale e al flessore breve dell'alluce).",
    iK: ["falange-prox-1-med"],
    nK: ["plantare-med"], radici: "S2–S3",
    azione: ["Abduzione e flessione dell'alluce", "Sostiene l'arco longitudinale mediale"],
    ciclismo: "Sostiene l'arco interno del piede sotto la spinta.",
    palpazione: "Lungo il bordo mediale del piede, dal tallone alla base dell'alluce: un ventre morbido sotto l'arco.",
    massaggio: "Supino o prono con piede fuori dal lettino. Pressioni con pollici e sfioramento lungo il bordo mediale, dal tallone verso l'alluce e ritorno.",
    attenzione: "Sotto il muscolo, vicino al tallone, passano nervi e vasi plantari (tunnel tarsale): pressione graduale."
  },
  {
    id: "flessore-breve-dita", nome: "Flessore breve delle dita", lat: "M. flexor digitorum brevis", regione: "piede-plant", strato: 1, tipo: "intrinseco",
    o: "Processo mediale della tuberosità calcaneare, aponeurosi plantare",
    origine: "Processo mediale della tuberosità del calcagno; aponeurosi plantare; setti intermuscolari.",
    oK: ["calcagno-proc-med"],
    i: "Lati delle falangi medie del 2°–5° dito",
    inserzione: "Entrambi i lati delle falangi medie del 2°–5° dito (i tendini si dividono per far passare quelli del flessore lungo).",
    iK: ["falangi-medie-2-5"],
    nK: ["plantare-med"], radici: "S2–S3",
    azione: ["Flessione del 2°–5° dito (interfalangea prossimale)", "Sostiene l'arco longitudinale"],
    ciclismo: "Stabilizza le dita sulla soletta.",
    palpazione: "Al centro della pianta, sotto l'aponeurosi plantare.",
    massaggio: "Pressioni a pollici, frizioni circolari e sfioramento profondo dal tallone verso le dita. Rilassante dopo ore nelle scarpe rigide.",
    attenzione: ""
  },
  {
    id: "abduttore-quinto", nome: "Abduttore del 5° dito", lat: "M. abductor digiti minimi", regione: "piede-plant", strato: 1, tipo: "intrinseco",
    o: "Processi mediale e laterale della tuberosità calcaneare, aponeurosi plantare",
    origine: "Processi mediale e laterale della tuberosità del calcagno; aponeurosi plantare; setto intermuscolare.",
    oK: ["calcagno-proc-med", "calcagno-proc-lat"],
    i: "Lato laterale della base della falange prossimale del 5° dito",
    inserzione: "Lato laterale della base della falange prossimale del quinto dito.",
    iK: ["falange-prox-5-lat"],
    nK: ["plantare-lat"], radici: "S2–S3",
    azione: ["Abduzione e flessione del 5° dito", "Sostiene l'arco laterale"],
    ciclismo: "Con scarpe strette il bordo esterno del piede è spesso compresso.",
    palpazione: "Lungo il bordo laterale del piede, dal tallone al 5° dito.",
    massaggio: "Pressioni e sfioramento lungo il bordo laterale.",
    attenzione: ""
  },
  {
    id: "quadrato-pianta", nome: "Quadrato della pianta", lat: "M. quadratus plantae", regione: "piede-plant", strato: 2, tipo: "intrinseco",
    o: "Faccia mediale e margine laterale della faccia plantare del calcagno (due capi)",
    origine: "Due capi: mediale, dalla faccia mediale del calcagno; laterale, dal margine laterale della faccia plantare del calcagno.",
    oK: ["calcagno-plant"],
    i: "Margine postero-laterale del tendine del flessore lungo delle dita",
    inserzione: "Margine postero-laterale del tendine del flessore lungo delle dita.",
    iK: ["tendine-fdl"],
    nK: ["plantare-lat"], radici: "S2–S3",
    azione: ["Corregge la direzione obliqua di trazione del flessore lungo delle dita, aiutandolo a flettere le dita"],
    ciclismo: "Collabora con il flessore lungo delle dita.",
    palpazione: "Non palpabile in modo isolato (secondo strato, sotto il flessore breve delle dita).",
    massaggio: "Pressioni profonde nella parte posteriore della pianta.",
    attenzione: ""
  },
  {
    id: "lombricali", nome: "Lombricali (4)", lat: "Mm. lumbricales", regione: "piede-plant", strato: 2, tipo: "intrinseco",
    o: "Tendini del flessore lungo delle dita",
    origine: "Tendini del flessore lungo delle dita: il 1° dal margine mediale del tendine per il 2° dito; il 2°, 3° e 4° dalle facce adiacenti di due tendini.",
    oK: ["tendine-fdl"],
    i: "Lato mediale delle espansioni dorsali del 2°–5° dito",
    inserzione: "Faccia mediale delle espansioni dorsali (estensorie) del 2°–5° dito.",
    iK: ["espansioni-dorsali"],
    nK: ["plantare-med", "plantare-lat"], radici: "S2–S3",
    nervoNota: "1° lombricale: n. plantare mediale. 2°–4°: n. plantare laterale (ramo profondo).",
    azione: ["Flessione delle metatarso-falangee", "Estensione delle interfalangee"],
    ciclismo: "Mantengono le dita distese sulla soletta (contrastano l'\"artiglio\").",
    palpazione: "Non palpabili in modo isolato.",
    massaggio: "Pressioni e frizioni tra le teste dei metatarsi dalla pianta.",
    attenzione: "Tra le teste del 3° e 4° metatarso passa il nervo digitale comune (neuroma di Morton): dolore bruciante o scossa → niente pressioni lì."
  },
  {
    id: "flessore-breve-alluce", nome: "Flessore breve dell'alluce", lat: "M. flexor hallucis brevis", regione: "piede-plant", strato: 3, tipo: "intrinseco",
    o: "Faccia plantare del cuboide e del cuneiforme laterale",
    origine: "Faccia plantare del cuboide e del cuneiforme laterale; tendine del tibiale posteriore.",
    oK: ["cuboide", "cuneiforme-lat"],
    i: "Due lati della base della falange prossimale dell'alluce (sesamoidi)",
    inserzione: "Entrambi i lati della base della falange prossimale dell'alluce, tramite due tendini che contengono i sesamoidi mediale e laterale.",
    iK: ["falange-prox-1-med", "falange-prox-1-lat"],
    nK: ["plantare-med"], radici: "S2–S3",
    azione: ["Flessione dell'alluce a livello della metatarso-falangea"],
    ciclismo: "La zona dei sesamoidi è spesso sotto pressione sul pedale (tacchetta, suola rigida).",
    palpazione: "Sotto il primo metatarso, nella parte anteriore dell'arco mediale.",
    massaggio: "Pressioni con pollice sotto il primo metatarso, mobilizzazioni dell'alluce.",
    attenzione: "Dolore puntiforme sui sesamoidi → evitare pressione diretta (possibile sesamoidite)."
  },
  {
    id: "adduttore-alluce", nome: "Adduttore dell'alluce", lat: "M. adductor hallucis", regione: "piede-plant", strato: 3, tipo: "intrinseco",
    o: "Capo obliquo: basi del 2°–4° metatarso. Capo trasverso: legamenti plantari delle MTF 3°–5°",
    origine: "Capo obliquo: basi del 2°, 3° e 4° metatarso (e guaina del peroneo lungo). Capo trasverso: legamenti plantari delle articolazioni metatarso-falangee del 3°–5° dito.",
    oK: ["metatarsi-2-4", "lig-mtf"],
    i: "Lato laterale della base della falange prossimale dell'alluce",
    inserzione: "Lato laterale della base della falange prossimale dell'alluce, insieme al sesamoide laterale.",
    iK: ["falange-prox-1-lat"],
    nK: ["plantare-lat"], radici: "S2–S3",
    azione: ["Adduzione dell'alluce", "Sostiene l'arco trasverso"],
    ciclismo: "Sostiene l'arco trasverso dell'avampiede, la zona che appoggia sul pedale.",
    palpazione: "Non palpabile in modo isolato (terzo strato). Il capo trasverso si raggiunge sotto le teste metatarsali.",
    massaggio: "Pressioni sotto le teste metatarsali e \"apertura\" a ventaglio dell'avampiede.",
    attenzione: ""
  },
  {
    id: "flessore-breve-quinto", nome: "Flessore breve del 5° dito", lat: "M. flexor digiti minimi brevis", regione: "piede-plant", strato: 3, tipo: "intrinseco",
    o: "Base del 5° metatarso",
    origine: "Base del quinto metatarso (faccia plantare) e guaina del tendine del peroneo lungo.",
    oK: ["meta5-base-plant"],
    i: "Base della falange prossimale del 5° dito",
    inserzione: "Base della falange prossimale del quinto dito (lato plantare-laterale).",
    iK: ["falange-prox-5-lat"],
    nK: ["plantare-lat"], radici: "S2–S3",
    azione: ["Flessione del 5° dito a livello della metatarso-falangea"],
    ciclismo: "Ruolo minore.",
    palpazione: "Sotto il quinto metatarso.",
    massaggio: "Pressioni lungo il bordo laterale della pianta.",
    attenzione: ""
  },
  {
    id: "interossei-plantari", nome: "Interossei plantari (3)", lat: "Mm. interossei plantares", regione: "piede-plant", strato: 4, tipo: "intrinseco",
    o: "Basi e facce mediali del 3°–5° metatarso",
    origine: "Basi e facce mediali del 3°, 4° e 5° metatarso (ognuno da un solo osso: unipennati).",
    oK: ["metatarsi-3-5"],
    i: "Lato mediale delle basi delle falangi prossimali del 3°–5° dito",
    inserzione: "Lato mediale delle basi delle falangi prossimali del 3°–5° dito e relative espansioni dorsali.",
    iK: ["falangi-prox-3-5-med"],
    nK: ["plantare-lat"], radici: "S2–S3",
    azione: ["Adduzione del 3°–5° dito verso il 2° dito", "Flessione delle metatarso-falangee"],
    ciclismo: "Stabilizzano l'avampiede.",
    palpazione: "Non palpabili in modo isolato.",
    massaggio: "Pressioni negli spazi intermetatarsali dalla pianta.",
    attenzione: ""
  },
  {
    id: "interossei-dorsali", nome: "Interossei dorsali (4)", lat: "Mm. interossei dorsales", regione: "piede-plant", strato: 4, tipo: "intrinseco",
    o: "Facce adiacenti dei metatarsi 1°–5° (bipennati)",
    origine: "Facce adiacenti di due metatarsi vicini, dal 1° al 5° (ognuno da due ossa: bipennati).",
    oK: ["metatarsi"],
    i: "1°: lato mediale della falange prossimale del 2° dito; 2°–4°: lato laterale delle falangi prossimali del 2°–4° dito",
    inserzione: "1° interosseo dorsale: lato mediale della base della falange prossimale del 2° dito. 2°, 3° e 4°: lato laterale delle basi delle falangi prossimali del 2°, 3° e 4° dito (e espansioni dorsali).",
    iK: ["falangi-prox-2-4"],
    nK: ["plantare-lat"], nKx: ["peroneo-prof"], radici: "S2–S3",
    nervoNota: "N. plantare laterale; il 1° e il 2° ricevono spesso anche rami dal n. peroneo profondo.",
    azione: ["Abduzione del 2°–4° dito rispetto all'asse del 2° dito", "Flessione delle metatarso-falangee"],
    ciclismo: "Stabilizzano l'avampiede e lo allargano sotto carico.",
    palpazione: "Gli spazi tra i metatarsi si sentono dal dorso del piede.",
    massaggio: "Pressioni con pollici negli spazi intermetatarsali dal dorso, dalla caviglia verso le dita, e mobilizzazione dei metatarsi.",
    attenzione: ""
  }
];

/* ===================================================== TENDINI E FASCE */
const TENDINI = [
  {
    id: "achille", nome: "Tendine calcaneare (d'Achille)",
    da: "Unione delle lamine tendinee di gastrocnemio e soleo, circa a metà della gamba (il plantare corre sul suo lato mediale).",
    a: "Parte media della faccia posteriore del calcagno (tuberosità calcaneare).",
    note: "Il tendine più robusto del corpo. Le fibre ruotano di circa 90° scendendo. La zona 2–6 cm sopra il calcagno è la meno vascolarizzata e la più colpita da tendinopatia. Tra tendine e calcagno c'è la borsa retrocalcaneare.",
    ciclismo: "Sovraccaricato da sella troppo alta, tacchette troppo avanzate, pedalata \"di punta\" e freddo (copriscarpe!).",
    massaggio: "Lavora i ventri di gastrocnemio e soleo. Sul tendine: pinzamento leggero e scollamento del peritenonio tra pollice e indice. Niente frizioni profonde se è gonfio, caldo, scricchiola o fa male al mattino → fisioterapista/medico."
  },
  {
    id: "quadricipitale", nome: "Tendine quadricipitale",
    da: "Unione dei tendini di retto femorale, vasto laterale, vasto mediale e vasto intermedio, sopra la rotula.",
    a: "Base (margine superiore) della rotula; le fibre superficiali passano davanti alla rotula e continuano nel legamento rotuleo.",
    note: "La rotula è un osso sesamoide dentro questo sistema tendineo: aumenta la leva del quadricipite.",
    ciclismo: "Dolore sopra la rotula con sella bassa o rapporti duri in salita.",
    massaggio: "Frizioni leggere trasversali sopra la rotula, mobilizzazione della rotula (in alto/basso, medio/laterale) a ginocchio rilassato."
  },
  {
    id: "rotuleo", nome: "Legamento (tendine) rotuleo",
    da: "Apice (polo inferiore) della rotula.",
    a: "Tuberosità tibiale.",
    note: "È la continuazione del tendine quadricipitale. Dietro c'è il corpo adiposo di Hoffa.",
    ciclismo: "Sella troppo bassa o arretrata → ginocchio molto flesso in spinta → sovraccarico (tendinopatia rotulea).",
    massaggio: "Frizioni trasversali leggere solo se non è in fase dolorosa acuta. Lavora soprattutto il quadricipite."
  },
  {
    id: "til", nome: "Tratto (bandelletta) ileotibiale",
    da: "Ispessimento laterale della fascia lata: in alto dal tubercolo della cresta iliaca; riceve le inserzioni del tensore della fascia lata e di gran parte del grande gluteo.",
    a: "Tubercolo di Gerdy (tubercolo antero-laterale del condilo laterale della tibia); fibre al margine laterale della rotula e al retinacolo laterale. È ancorato al femore (linea aspra) dal setto intermuscolare laterale.",
    note: "È tessuto fibroso denso: non si allunga in modo apprezzabile con il massaggio né con il foam roller. Vicino al ginocchio scorre sopra l'epicondilo laterale del femore, separato da tessuto adiposo ricco di terminazioni nervose.",
    ciclismo: "La sindrome della bandelletta ileotibiale è tipica del ciclista: dolore laterale al ginocchio, peggiora con ripetute flessioni intorno ai 30°. Cause frequenti: sella troppo alta, tacchette troppo intraruotate, distanza tra i pedali, aumento brusco dei km.",
    massaggio: "Lavora TFL, grande gluteo e vasto laterale. Sulla banda solo sfioramento e scollamento leggero; niente frizioni aggressive sull'epicondilo laterale se dolente."
  },
  {
    id: "zampa-oca", nome: "Zampa d'oca superficiale (pes anserinus)",
    da: "Tendini di Sartorio, Gracile e semiTendinoso (da davanti a dietro: \"S-G-T\").",
    a: "Faccia antero-mediale della tibia, sotto il piatto tibiale mediale, medialmente alla tuberosità tibiale.",
    note: "Sotto i tendini c'è la borsa anserina. I tre muscoli arrivano da tre logge diverse (anteriore, mediale, posteriore) e da tre nervi diversi (femorale, otturatorio, tibiale).",
    ciclismo: "Dolore mediale sotto il ginocchio: spesso legato a ginocchio che lavora in valgo o a tacchette regolate male.",
    massaggio: "Lavora i ventri dei tre muscoli. Sull'inserzione: frizioni leggere solo se non è gonfia o calda (borsite → medico)."
  },
  {
    id: "femorali-prossimali", nome: "Tendine comune dei femorali (ischiocrurali)",
    da: "Ventri di semitendinoso e capo lungo del bicipite femorale (tendine comune) e semimembranoso (tendine separato, più laterale e profondo).",
    a: "Tuberosità ischiatica.",
    note: "La tuberosità ischiatica è il punto di appoggio sulla sella.",
    ciclismo: "Dolore profondo nella zona \"del sedere\" con sella alta o troppo arretrata, o con una sella di forma non adatta.",
    massaggio: "Pressioni lente vicino alla tuberosità, atleta prono. Lavoro rispettoso: zona intima, comunica sempre."
  },
  {
    id: "fascia-plantare", nome: "Aponeurosi (fascia) plantare",
    da: "Processo mediale della tuberosità calcaneare.",
    a: "Si divide in cinque bande dirette alle dita, che si inseriscono sui legamenti plantari delle metatarso-falangee e sulle guaine dei flessori, fino alle basi delle falangi prossimali.",
    note: "Meccanismo \"ad argano\" (windlass): quando le dita si estendono la fascia si tende e alza l'arco.",
    ciclismo: "Meno colpita che nella corsa, ma il ciclista che corre anche (duathlon, triathlon) o che usa scarpe molto rigide può soffrirne.",
    massaggio: "Pressioni con pollici e frizioni dal tallone verso le dita, rullare il piede su una pallina. Dolore al primo passo del mattino vicino al tallone → fascite plantare: niente frizioni profonde sull'inserzione dolente."
  },
  {
    id: "tib-post-tendine", nome: "Tendine del tibiale posteriore",
    da: "Ventre del tibiale posteriore, nella parte inferiore della gamba.",
    a: "Tuberosità del navicolare (e cuneiformi, cuboide, basi del 2°–4° metatarso, sustentaculum tali).",
    note: "Passa per primo dietro il malleolo mediale, sotto il retinacolo dei flessori.",
    ciclismo: "Sovraccaricato in piedi pronati senza un plantare adatto.",
    massaggio: "Frizioni leggere lungo il decorso retromalleolare, solo se non dolente o gonfio."
  },
  {
    id: "peronei-tendini", nome: "Tendini dei peronei (lungo e breve)",
    da: "Ventri dei peronei lungo e breve, lato esterno della gamba.",
    a: "Peroneo breve: tuberosità del 5° metatarso. Peroneo lungo: base del 1° metatarso e cuneiforme mediale (attraversando la pianta).",
    note: "Passano dietro il malleolo laterale (il breve davanti, a contatto con l'osso; il lungo dietro) sotto il retinacolo dei peronei superiore.",
    ciclismo: "Coinvolti dopo distorsioni di caviglia (cadute, appoggi a terra).",
    massaggio: "Frizioni leggere dietro il malleolo laterale, lavoro sui ventri."
  },
  {
    id: "retinacoli", nome: "Retinacoli della caviglia",
    da: "Ispessimenti della fascia della gamba.",
    a: "Superiore degli estensori: tra tibia e fibula sopra la caviglia. Inferiore degli estensori (a forma di Y): dal calcagno ai malleoli e al lato mediale del piede. Dei flessori: dal malleolo mediale al calcagno. Dei peronei: dal malleolo laterale al calcagno.",
    note: "Tengono i tendini aderenti all'osso come delle \"cinghie\".",
    ciclismo: "Cinghie e chiusure delle scarpe premono proprio qui: possibile irritazione dei tendini estensori sul collo del piede.",
    massaggio: "Sfioramento e frizioni leggere, mobilizzazione della caviglia."
  }
];

/* ===================================================== PUNTI DI REPERE */
const REPERE = [
  { nome: "Cresta iliaca", dove: "Bordo superiore del bacino, si sente con le mani sui fianchi.", come: "Atleta in piedi o supino: segui il bordo osseo dalla SIAS alla SIPS.", muscoli: "Grande, medio gluteo, TFL, iliaco (labbro interno)" },
  { nome: "SIAS — spina iliaca antero-superiore", dove: "Estremità anteriore della cresta iliaca.", come: "Supino: la sporgenza ossea più evidente davanti al bacino.", muscoli: "Sartorio, TFL (+ legamento inguinale)" },
  { nome: "SIAI — spina iliaca antero-inferiore", dove: "Circa 2–3 cm sotto la SIAS, profonda.", come: "Supino con anca flessa per rilassare i tessuti; difficile da sentire.", muscoli: "Retto femorale (capo diretto)" },
  { nome: "SIPS — spina iliaca postero-superiore", dove: "Estremità posteriore della cresta, sotto le \"fossette di Venere\".", come: "Prono: segui la cresta indietro fino alla fossetta.", muscoli: "Riferimento per il piriforme (sacro S2 poco sotto)" },
  { nome: "Sacro e coccige", dove: "Osso triangolare al centro, sotto la colonna lombare.", come: "Prono: margini laterali del sacro fino al coccige.", muscoli: "Grande gluteo, piriforme (faccia anteriore)" },
  { nome: "Tuberosità ischiatica", dove: "\"Osso della seduta\", in basso nel gluteo.", come: "Decubito laterale con anca flessa: il gluteo scorre in alto e la tuberosità si sente sotto la piega glutea.", muscoli: "Femorali, grande adduttore (parte ischiocrurale), gemello inferiore, quadrato del femore" },
  { nome: "Grande trocantere", dove: "Sporgenza laterale del femore, a livello dell'anca.", come: "Ruota passivamente la gamba: lo senti girare sotto la mano.", muscoli: "Medio e piccolo gluteo, piriforme, gemelli, otturatori, vasto laterale" },
  { nome: "Tubercolo pubico e sinfisi", dove: "Davanti, in basso al centro del bacino.", come: "Comunica sempre prima di toccare. Si raggiunge dal tendine dell'adduttore lungo risalendo.", muscoli: "Adduttori, gracile, pettineo" },
  { nome: "Tubercolo dell'adduttore", dove: "Sopra il condilo mediale del femore.", come: "Segui il tendine del grande adduttore sul lato interno della coscia fino al ginocchio.", muscoli: "Grande adduttore (parte ischiocrurale)" },
  { nome: "Rotula e suoi margini", dove: "Davanti al ginocchio.", come: "Ginocchio esteso e rilassato: si muove in tutte le direzioni.", muscoli: "Quadricipite (base), legamento rotuleo (apice)" },
  { nome: "Tuberosità tibiale", dove: "Sporgenza sotto la rotula, sul davanti della tibia.", come: "Segui il legamento rotuleo verso il basso.", muscoli: "Quadricipite tramite il legamento rotuleo" },
  { nome: "Tubercolo di Gerdy", dove: "Lato antero-laterale della tibia, sotto il ginocchio, a metà tra tuberosità tibiale e testa della fibula.", come: "Segui il tratto ileotibiale fino alla tibia.", muscoli: "Tratto ileotibiale (TFL, grande gluteo)" },
  { nome: "Zampa d'oca", dove: "Faccia antero-mediale della tibia, circa 5 cm sotto la rima articolare.", come: "Flessione del ginocchio contro resistenza: si sentono i tendini arrivare.", muscoli: "Sartorio, gracile, semitendinoso" },
  { nome: "Testa della fibula", dove: "Lato esterno della gamba, subito sotto il ginocchio, un po' indietro.", come: "Segui il tendine del bicipite femorale verso il basso.", muscoli: "Bicipite femorale, soleo, peroneo lungo — ATTENZIONE: nervo peroneo comune sul collo" },
  { nome: "Margine mediale e faccia mediale della tibia", dove: "Lato interno della gamba: la faccia è sottocutanea (si sente l'osso).", come: "Scorri dal ginocchio al malleolo mediale.", muscoli: "Soleo, flessore lungo delle dita (dietro il margine)" },
  { nome: "Malleolo mediale", dove: "Sporgenza interna della caviglia (tibia).", come: "Evidente. Dietro passano i tendini \"Tom, Dick, Harry\".", muscoli: "Tibiale posteriore, flessore lungo dita e alluce (dietro)" },
  { nome: "Malleolo laterale", dove: "Sporgenza esterna della caviglia (fibula), più bassa e posteriore del mediale.", come: "Evidente. Dietro passano i tendini dei peronei.", muscoli: "Peroneo lungo e breve (dietro)" },
  { nome: "Tuberosità calcaneare", dove: "Tallone.", come: "Prono: il tendine d'Achille arriva sulla sua faccia posteriore.", muscoli: "Tricipite surale (Achille), plantare, muscoli plantari, fascia plantare" },
  { nome: "Sustentaculum tali", dove: "Circa un dito sotto il malleolo mediale.", come: "Sporgenza ossea del calcagno sotto il malleolo mediale.", muscoli: "Sotto: tendine del flessore lungo dell'alluce; inserzione accessoria del tibiale posteriore" },
  { nome: "Tuberosità del navicolare", dove: "Bordo mediale del piede, 2–3 cm davanti e sotto il malleolo mediale.", come: "Inversione del piede: il tendine del tibiale posteriore la indica.", muscoli: "Tibiale posteriore" },
  { nome: "Tuberosità del 5° metatarso", dove: "Metà del bordo esterno del piede.", come: "Sporgenza ossea evidente sul bordo laterale.", muscoli: "Peroneo breve, terzo peroneo (dorso), flessore breve del 5° dito" },
  { nome: "Teste metatarsali e sesamoidi dell'alluce", dove: "Avampiede, sotto la base delle dita.", come: "Dalla pianta: i sesamoidi sono due piccoli noduli sotto la testa del 1° metatarso.", muscoli: "Flessore breve dell'alluce, adduttore dell'alluce, lombricali, interossei" }
];

/* ===================================================== ZONE A RISCHIO */
const ZONE_RISCHIO = [
  { nome: "Triangolo femorale (di Scarpa)", dove: "Inguine. Limiti: legamento inguinale (sopra), sartorio (lato), adduttore lungo (medio).", cosa: "Da laterale a mediale: Nervo, Arteria, Vena femorali e Linfonodi inguinali profondi (\"N-A-V-L\").", regola: "Solo sfioramento leggero e drenante verso i linfonodi. Mai pressioni profonde o prolungate. Se senti la pulsazione dell'arteria, spostati." },
  { nome: "Canale degli adduttori (di Hunter)", dove: "Terzo medio della coscia interna, sotto il sartorio.", cosa: "Arteria e vena femorali, nervo safeno.", regola: "Lavora i ventri muscolari, non affondare sotto il sartorio con pressioni puntiformi." },
  { nome: "Iato degli adduttori", dove: "Terzo inferiore della coscia, lato interno-posteriore, sopra il ginocchio.", cosa: "Passaggio dei vasi femorali che diventano poplitei.", regola: "Niente pressioni profonde puntiformi." },
  { nome: "Cavo popliteo", dove: "Dietro il ginocchio, a rombo tra i tendini dei femorali (sopra) e i capi del gastrocnemio (sotto).", cosa: "Arteria e vena poplitee, nervo tibiale, nervo peroneo comune, linfonodi poplitei.", regola: "Solo sfioramento leggero (drenaggio). Mai pressioni, impastamenti o frizioni." },
  { nome: "Testa e collo della fibula", dove: "Lato esterno, subito sotto il ginocchio.", cosa: "Nervo peroneo comune, molto superficiale, gira intorno al collo della fibula.", regola: "Niente pressioni o frizioni. Rischio di formicolio e, nei casi gravi, deficit di sollevamento del piede." },
  { nome: "Zona del nervo sciatico", dove: "Gluteo: a metà fra tuberosità ischiatica e grande trocantere, poi lungo il centro della coscia posteriore.", cosa: "Nervo sciatico (il più grosso del corpo).", regola: "Niente gomito o nocche sostenuti sulla linea del nervo. Scossa o formicolio → togli pressione." },
  { nome: "Dietro il malleolo mediale (tunnel tarsale)", dove: "Tra malleolo mediale e calcagno.", cosa: "Arteria e vene tibiali posteriori, nervo tibiale.", regola: "Solo frizioni leggere e sfioramento." },
  { nome: "Dorso del piede", dove: "Tra i tendini dell'estensore lungo dell'alluce e delle dita.", cosa: "Arteria dorsale del piede (pedidia), nervo peroneo profondo.", regola: "Pressione leggera." },
  { nome: "Vena grande safena e varici", dove: "Lato interno di gamba e coscia, davanti al malleolo mediale.", cosa: "Vena superficiale, spesso dilatata.", regola: "Su varici evidenti: solo sfioramento leggero centripeto, mai pressioni o impastamenti." }
];

/* ===================================================== CONTROINDICAZIONI */
const CONTROINDICAZIONI = {
  assolute: [
    { t: "Sospetta trombosi venosa profonda (TVP)", d: "Polpaccio o coscia gonfi, caldi, arrossati, dolenti, spesso da un solo lato, senza un trauma chiaro. Rischio più alto dopo viaggi lunghi in auto o aereo tra le gare, disidratazione, immobilità, traumi. NON massaggiare: medico subito (il massaggio potrebbe mobilizzare il coagulo)." },
    { t: "Febbre, infezione in corso, malessere generale", d: "Rimanda il massaggio." },
    { t: "Lesione muscolare acuta (stiramento/strappo)", d: "Dolore improvviso, puntiforme, durante lo sforzo, a volte con ecchimosi: niente massaggio sulla zona nelle prime 48–72 ore. Protezione, ghiaccio, compressione → fisioterapista o medico." },
    { t: "Sospetta frattura o lussazione dopo caduta", d: "Dolore forte su un punto osseo, deformità, impossibilità a caricare: immobilizza e invia al medico." },
    { t: "Ferite aperte, abrasioni da caduta, ustioni", d: "Le abrasioni da caduta sono frequentissime nel ciclismo: non massaggiare sopra né vicino; copri con garze e lavora solo le zone integre, con mani e prodotti puliti." },
    { t: "Sospetta rabdomiolisi", d: "Dolore muscolare intenso e sproporzionato, muscoli gonfi e duri, debolezza, urine scure (color tè/cola) dopo uno sforzo estremo: emergenza medica, niente massaggio." },
    { t: "Sospetto trauma cranico dopo caduta", d: "Mal di testa, confusione, nausea, vista offuscata: la priorità è la valutazione medica, non il massaggio." },
    { t: "Infezioni cutanee, linfangite, cellulite infettiva", d: "Cute rossa, calda, striature rosse, febbre." }
  ],
  relative: [
    { t: "Ematomi e contusioni", d: "Evita la zona nella fase acuta; dopo alcuni giorni solo drenaggio leggero intorno, mai sopra con pressione." },
    { t: "Varici evidenti", d: "Solo sfioramento leggero centripeto." },
    { t: "Farmaci anticoagulanti o antiaggreganti", d: "Pressione leggera: rischio di lividi." },
    { t: "Tendinopatia in fase dolorosa", d: "Niente frizioni profonde sul tendine; lavora i ventri muscolari e invia al fisioterapista." },
    { t: "Gonfiore di origine non chiara, dolore notturno, perdita di peso", d: "Chiedi una valutazione medica prima di continuare." },
    { t: "Cute irritata da sella (follicoliti, foruncoli, \"saddle sores\")", d: "Non lavorare sulle zone arrossate di inguine e glutei. Le gambe depilate possono avere follicoliti: usa prodotti non comedogenici e mani pulite." },
    { t: "Diabete con neuropatia, disturbi della sensibilità", d: "L'atleta può non sentire la pressione: lavora con pressione moderata." },
    { t: "Sindrome compartimentale cronica da sforzo sospetta", d: "Dolore a \"tensione\" in una loggia della gamba che sale con lo sforzo e passa a riposo: valutazione medica." },
    { t: "Endofibrosi dell'arteria iliaca esterna sospetta", d: "Tipica del ciclista d'élite: \"gamba che si svuota\", dolore o perdita di forza a una coscia SOLO agli sforzi massimali, che passa in pochi minuti. Non è un problema muscolare: invia a un medico dello sport/angiologo." }
  ]
};

/* ===================================================== TECNICHE */
const TECNICHE = [
  { nome: "Sfioramento (effleurage)", come: "Scorrimento lungo e continuo delle mani, a pressione leggera o media, sempre in direzione del cuore (centripeto) quando si spinge.", quando: "Apertura e chiusura di ogni zona; in tutti i protocolli. Post-gara: lento e profondo per il drenaggio. Pre-gara: rapido.", effetto: "Spalma il prodotto, valuta i tessuti, rilassa (lento) o attiva (rapido), favorisce il ritorno venoso e linfatico." },
  { nome: "Impastamento (pétrissage)", come: "Sollevare, comprimere e torcere il muscolo tra le mani, come impastare.", quando: "Grandi masse: quadricipite, femorali, polpacci, glutei. Pre-gara: rapido e superficiale. Recupero: lento e più profondo.", effetto: "Mobilizza le fibre e la fascia, riduce la sensazione di rigidità." },
  { nome: "Pressioni (statiche e scorrevoli)", come: "Pressione con pollice, palmo, pugno morbido o avambraccio, ferma (5–30 s) o in scorrimento lungo le fibre.", quando: "Sedute di recupero; pressioni leggere drenanti dopo gara.", effetto: "Rilascio di punti tesi (trigger point), drenaggio." },
  { nome: "Frizioni (circolari e trasversali)", come: "Piccoli movimenti della cute sui piani profondi; le trasversali (tipo Cyriax) vanno perpendicolari alle fibre, su tendini o inserzioni.", quando: "Recupero, lontano da gare importanti. Mai su tendini infiammati in fase acuta.", effetto: "Mobilizza tessuti aderenti, stimola il rimodellamento." },
  { nome: "Scuotimenti / vibrazioni (shaking)", come: "Muovere rapidamente la massa muscolare rilassata da un lato all'altro.", quando: "Pre-gara (attivazione) e post-gara (rilassamento), su polpacci, femorali, quadricipite.", effetto: "Riduce il tono, sensazione di \"gambe sciolte\"." },
  { nome: "Percussioni (tapotement)", come: "Colpetti ritmici con il bordo delle mani, le mani a coppa o i pugni morbidi.", quando: "Solo pre-gara e brevi (pochi secondi per zona), sulle grandi masse. Evitare dopo gara.", effetto: "Stimola, aumenta la sensazione di reattività." },
  { nome: "Scollamento / pinzamento cutaneo", come: "Sollevare la pelle e il sottocutaneo tra pollice e indici e farlo rotolare.", quando: "Recupero; zona del tendine d'Achille, coscia laterale.", effetto: "Mobilizza i piani superficiali e la fascia." },
  { nome: "Mobilizzazioni passive e stretching assistito", come: "Muovere le articolazioni nel range comodo; allungamenti lenti 20–30 s senza dolore.", quando: "Post-gara dolce; recupero più completo. Pre-gara solo mobilizzazioni dinamiche leggere.", effetto: "Mantiene il range di movimento, rilassa." }
];

/* ===================================================== PROTOCOLLI */
const PROTOCOLLI = [
  {
    id: "pre-gara", nome: "Pre-gara", quando: "30–60 minuti prima della partenza, prima del riscaldamento sui rulli.", durata: "10–15 minuti per entrambe le gambe (5–7 per arto).",
    obiettivo: "Gambe \"pronte\", attivazione, routine e tranquillità mentale dell'atleta.",
    ritmo: "Vivace", pressione: "Leggera–media",
    prodotto: "Olio leggero o crema. Con freddo e pioggia si usano oli/creme riscaldanti: provali sempre prima in allenamento (mai la prima volta in gara), tieni lontano da mucose, inguine e occhi, lavati bene le mani.",
    sequenza: [
      "Prono — polpacci: sfioramento rapido, impastamento veloce, scuotimenti",
      "Prono — femorali: sfioramento, impastamento rapido, scuotimenti",
      "Prono — glutei: impastamento e pressioni brevi con il palmo",
      "Supino — loggia anteriore e peronei: sfioramento, pressioni rapide a pollici",
      "Supino — quadricipite: sfioramento, impastamento rapido, scuotimenti, percussioni brevi",
      "Supino — adduttori e TFL: impastamento rapido",
      "Chiusura: sfioramento energico di tutta la gamba dal piede all'anca"
    ],
    evita: ["Lavoro profondo, trigger point, frizioni trasverse", "Massaggio lungo, lento e rilassante (può togliere reattività)", "Stretching passivo intenso e prolungato", "Prodotti nuovi o mai provati dall'atleta", "Lavorare su zone dolenti scoperte all'ultimo: segnalale al medico o al fisioterapista della squadra"],
    nota: "Le ricerche non mostrano un miglioramento diretto della prestazione grazie al massaggio pre-gara; il beneficio è soprattutto di percezione e routine. Per questo deve essere breve, stimolante e sempre seguito dal riscaldamento in bici."
  },
  {
    id: "post-gara", nome: "Post-gara / post-tappa", quando: "Dopo reintegro, doccia e pasto di recupero: di solito 1–3 ore dopo l'arrivo. Nelle gare a tappe ogni sera.", durata: "20–30 minuti per le gambe (seduta totale 30–45 minuti con schiena bassa, collo, spalle e avambracci).",
    obiettivo: "Rilassamento, drenaggio, riduzione della sensazione di fatica e di indolenzimento, controllo dei tessuti.",
    ritmo: "Lento", pressione: "Leggera → media, mai dolorosa",
    prodotto: "Olio o crema neutra. Ambiente caldo, telo per coprire le zone non trattate.",
    sequenza: [
      "Valutazione: chiedi com'è andata la gara, cadute, crampi, dolori. Guarda la pelle (abrasioni, ematomi, gonfiori)",
      "Supino con gambe sollevate (cuscino sotto i polpacci): sfioramento lungo dal piede all'inguine",
      "Piede: pressioni e frizioni in pianta, mobilizzazioni delle dita e della caviglia",
      "Gamba anteriore e peronei: sfioramento e pressioni drenanti dal basso verso l'alto",
      "Quadricipite e adduttori: impastamento lento, pressioni scorrevoli, scuotimenti",
      "Prono: polpacci (soleo a ginocchio flesso), femorali, glutei: impastamento lento e pressioni scorrevoli",
      "Mobilizzazioni passive e stretching dolce (opzionale)",
      "Chiusura: sfioramento lento centripeto di tutta la gamba, a gamba sollevata"
    ],
    evita: ["Frizioni profonde, trigger point dolorosi e lavoro aggressivo dopo gare molto dure", "Lavorare su abrasioni, ematomi recenti, zone gonfie o calde", "Pressioni nel cavo popliteo e nel triangolo femorale", "Massaggiare un polpaccio sospetto per TVP"],
    nota: "Le revisioni scientifiche (es. Dupuy et al. 2018; Davis et al. 2020) indicano che il massaggio riduce l'indolenzimento muscolare e la percezione di fatica; gli effetti diretti sulla prestazione successiva sono piccoli o non chiari. È però molto apprezzato dagli atleti e aiuta a monitorare lo stato dei tessuti."
  },
  {
    id: "post-allenamento", nome: "Post-allenamento", quando: "Dopo sedute di qualità (ripetute, salite, lavori di forza) o uscite lunghe.", durata: "15–30 minuti.",
    obiettivo: "Recupero tra due sedute ravvicinate.",
    ritmo: "Lento–moderato", pressione: "Media",
    prodotto: "Olio o crema neutra.",
    sequenza: [
      "Come il post-gara, con un po' più di lavoro mirato sui muscoli più caricati (es. quadricipite e glutei dopo salite, polpacci dopo lavori di agilità)",
      "Controlla le zone che l'atleta segnala ripetutamente: annotale nella scheda"
    ],
    evita: ["Lavoro profondo se il giorno dopo c'è un'altra seduta di qualità o una gara"],
    nota: "Il ciclismo è uno sport con poco lavoro eccentrico: l'indolenzimento (DOMS) è di solito minore che nella corsa, ma la fatica di quadricipite e glutei dopo salite e cronometro è alta."
  },
  {
    id: "recupero", nome: "Giorno di riposo / seduta di lavoro", quando: "Giorni di scarico o di riposo, a distanza di almeno 48 ore da una gara importante.", durata: "40–60 minuti.",
    obiettivo: "Lavoro più profondo su rigidità, punti tesi e aderenze; mantenimento della mobilità.",
    ritmo: "Lento", pressione: "Media → profonda (sempre tollerata, scala del fastidio 5–6 su 10 al massimo)",
    prodotto: "Poco olio o crema (serve più presa).",
    sequenza: [
      "Riscaldamento dei tessuti: sfioramento e impastamento",
      "Lavoro mirato: pressioni sostenute sui punti tesi (gluteo medio, piriforme, TFL, vasto laterale, soleo)",
      "Frizioni trasversali su zone aderenti (non su tendini dolenti in fase acuta)",
      "Scollamento della fascia (coscia laterale, polpaccio)",
      "Mobilizzazioni e stretching assistito di ileopsoas, retto femorale, femorali, polpacci",
      "Chiusura drenante"
    ],
    evita: ["Lavoro profondo nelle 48 ore prima di una gara importante", "Superare la soglia di dolore tollerata: crea difesa muscolare"],
    nota: "È la seduta in cui conosci davvero i muscoli dell'atleta: annota cosa trovi."
  }
];

/* ===================================================== PEDALATA */
/* 0° = punto morto superiore (pedivella in alto), 180° = punto morto inferiore.
   Intervalli indicativi da studi EMG (soprattutto Hug & Dorel 2009, review);
   cambiano con potenza, cadenza, posizione e atleta. */
const PEDALATA = [
  { muscolo: "Grande gluteo", id: "grande-gluteo", da: 340, a: 130, fase: "Spinta" },
  { muscolo: "Vasto laterale e mediale", id: "vasto-laterale", da: 300, a: 130, fase: "Spinta" },
  { muscolo: "Retto femorale", id: "retto-femorale", da: 200, a: 110, fase: "Fine risalita e inizio spinta" },
  { muscolo: "Soleo", id: "soleo", da: 340, a: 180, fase: "Spinta" },
  { muscolo: "Gastrocnemio", id: "gastrocnemio", da: 30, a: 270, fase: "Spinta e punto morto inferiore" },
  { muscolo: "Femorali (bicipite, semitendinoso, semimembranoso)", id: "bicipite-femorale", da: 10, a: 230, fase: "Seconda metà della spinta e punto morto inferiore" },
  { muscolo: "Tibiale anteriore", id: "tibiale-anteriore", da: 280, a: 90, fase: "Risalita e punto morto superiore" },
  { muscolo: "Ileopsoas (stima: non misurabile con EMG di superficie)", id: "iliaco", da: 200, a: 350, fase: "Risalita" }
];

/* ===================================================== PROBLEMI DEL CICLISTA */
const PROBLEMI = [
  { nome: "Dolore laterale al ginocchio (sindrome della bandelletta ileotibiale)", segni: "Dolore sul lato esterno del ginocchio, sopra l'epicondilo laterale, che compare dopo un certo tempo di pedalata e peggiora.", muscoli: ["tensore-fascia-lata", "grande-gluteo", "vasto-laterale", "medio-gluteo"], bike: "Sella troppo alta, tacchette troppo intraruotate, piedi troppo vicini, aumento brusco del volume.", massaggio: "TFL, grande gluteo e vasto laterale; scollamento leggero della coscia laterale; niente frizioni dolorose sull'epicondilo.", invia: "Gonfiore, dolore a riposo, nessun miglioramento in 1–2 settimane → fisioterapista e biomeccanico (bike fit)." },
  { nome: "Dolore anteriore al ginocchio (femoro-rotuleo)", segni: "Dolore intorno o dietro la rotula, peggiora in salita, con rapporti duri e dopo stare seduti a lungo.", muscoli: ["vasto-laterale", "vasto-mediale", "retto-femorale", "tensore-fascia-lata", "medio-gluteo"], bike: "Sella troppo bassa o troppo avanzata, pedivelle lunghe, rapporti troppo duri.", massaggio: "Quadricipite (attenzione al vasto laterale rigido), TFL, retinacolo laterale con frizioni leggere, mobilizzazione della rotula.", invia: "Gonfiore del ginocchio, blocchi, cedimenti." },
  { nome: "Tendinopatia rotulea / quadricipitale", segni: "Dolore puntiforme sotto (rotuleo) o sopra (quadricipitale) la rotula, all'inizio della pedalata e dopo.", muscoli: ["retto-femorale", "vasto-laterale", "vasto-mediale", "vasto-intermedio"], bike: "Sella bassa, carichi improvvisi (salite, forza).", massaggio: "Ventri del quadricipite; sul tendine solo lavoro leggero fuori dalla fase acuta.", invia: "Dolore che limita l'allenamento: programma di carico con il fisioterapista." },
  { nome: "Tendinopatia d'Achille", segni: "Dolore e rigidità al tendine, peggiore al mattino e all'inizio dello sforzo; a volte tendine ispessito.", muscoli: ["gastrocnemio", "soleo", "plantare"], bike: "Sella alta, tacchette molto avanzate, pedalata di punta, freddo.", massaggio: "Ventri del tricipite surale, scollamento leggero del peritenonio, niente frizioni profonde su tendine gonfio.", invia: "Gonfiore, scricchiolio, dolore che peggiora → fisioterapista/medico." },
  { nome: "Dolore dietro il ginocchio", segni: "Dolore posteriore, a volte sul tendine del bicipite femorale (laterale) o del semimembranoso (mediale).", muscoli: ["bicipite-femorale", "semimembranoso", "semitendinoso", "popliteo", "gastrocnemio"], bike: "Sella alta o arretrata, gamba troppo distesa al punto morto inferiore.", massaggio: "Ventri dei femorali e del gastrocnemio, niente lavoro nel cavo popliteo.", invia: "Gonfiore dietro il ginocchio (cisti di Baker), dolore al polpaccio (escludere TVP)." },
  { nome: "Mal di schiena lombare e flessori dell'anca rigidi", segni: "Dolore lombare in sella, soprattutto dopo ore o in posizione aerodinamica; difficoltà a raddrizzarsi scendendo dalla bici.", muscoli: ["iliaco", "grande-psoas", "retto-femorale", "grande-gluteo", "medio-gluteo"], bike: "Manubrio troppo basso o lontano, sella troppo alta (bacino che oscilla), core debole.", massaggio: "Glutei, iliaco (dalla cresta), retto femorale; stretching dei flessori dell'anca. Il quadrato dei lombi e i paravertebrali vanno trattati in una seduta per il tronco.", invia: "Dolore che scende sotto il ginocchio, formicolio, perdita di forza → medico." },
  { nome: "Dolore gluteo profondo (piriforme e rotatori)", segni: "Dolore profondo nel gluteo, a volte esteso dietro la coscia, peggiore stando seduti.", muscoli: ["piriforme", "medio-gluteo", "piccolo-gluteo", "quadrato-femore", "otturatore-interno"], bike: "Sella non adatta, bacino instabile, dislivello tra le gambe non compensato.", massaggio: "Pressioni lente sul piriforme e sui rotatori, medio e piccolo gluteo, stretching in rotazione.", invia: "Formicolio, perdita di sensibilità o di forza alla gamba." },
  { nome: "Crampi muscolari", segni: "Contrazione involontaria dolorosa, di solito polpacci, femorali, adduttori, quadricipite, a fine gara o con caldo.", muscoli: ["gastrocnemio", "soleo", "bicipite-femorale", "grande-adduttore", "vasto-mediale"], bike: "La causa principale è la fatica neuromuscolare (intensità e durata superiori all'abitudine); disidratazione e perdita di sali contribuiscono, soprattutto con il caldo.", massaggio: "Nel crampo: allungamento lento e continuo del muscolo (es. polpaccio: porta la punta verso la tibia), poi sfioramento leggero. Dopo: massaggio drenante delicato, niente lavoro profondo.", invia: "Crampi frequenti a riposo, debolezza, urine scure." },
  { nome: "Dolore all'avampiede, formicolii (metatarsalgia, neuroma di Morton, \"hot foot\")", segni: "Bruciore o formicolio sotto l'avampiede, spesso tra 3° e 4° dito, che peggiora con le ore e passa togliendo la scarpa.", muscoli: ["lombricali", "adduttore-alluce", "interossei-plantari", "flessore-breve-dita"], bike: "Scarpe strette, chiusure troppo serrate, tacchette troppo avanzate, piedi che si gonfiano col caldo.", massaggio: "Pianta, apertura dell'avampiede, mobilizzazione dei metatarsi; nessuna pressione diretta sul punto del nervo.", invia: "Formicolio persistente: podologo/biomeccanico (plantare, scarpe, tacchette)." },
  { nome: "Contusioni ed ematomi da caduta", segni: "Zona dolente, gonfia, livida dopo una caduta.", muscoli: ["vasto-laterale", "grande-gluteo", "tibiale-anteriore"], bike: "Caduta.", massaggio: "Nelle prime 48–72 ore niente massaggio sulla zona (ghiaccio, compressione, protezione). Poi drenaggio leggero intorno alla zona, verso i linfonodi. Mai impastamenti su un ematoma: rischio di miosite ossificante.", invia: "Gonfiore molto grande o in aumento, dolore forte, impossibilità di muovere l'articolazione." }
];

/* ===================================================== BIBLIOGRAFIA */
const BIBLIOGRAFIA = [
  "Standring S. (ed.). Gray's Anatomy — The Anatomical Basis of Clinical Practice. 42ª ed. Elsevier, 2020.",
  "Moore K.L., Dalley A.F., Agur A.M.R. Clinically Oriented Anatomy. 9ª ed. Wolters Kluwer, 2022.",
  "Netter F.H. Atlante di anatomia umana. Edra (ed. italiana più recente).",
  "Biel A. Trail Guide to the Body — guida alla palpazione. Books of Discovery.",
  "Hug F., Dorel S. Electromyographic analysis of pedaling: a review. Journal of Electromyography and Kinesiology, 2009; 19(2):182–198.",
  "Weerapong P., Hume P.A., Kolt G.S. The mechanisms of massage and effects on performance, muscle recovery and injury prevention. Sports Medicine, 2005; 35(3):235–256.",
  "Dupuy O. et al. An evidence-based approach for choosing post-exercise recovery techniques to reduce markers of muscle damage, soreness, fatigue, and inflammation: a systematic review with meta-analysis. Frontiers in Physiology, 2018; 9:403.",
  "Davis H.L., Alabed S., Chico T.J.A. Effect of sports massage on performance and recovery: a systematic review and meta-analysis. BMJ Open Sport & Exercise Medicine, 2020; 6:e000614."
];

const DATI = { REGIONI, NERVI, MUSCOLI, TENDINI, REPERE, ZONE_RISCHIO, CONTROINDICAZIONI, TECNICHE, PROTOCOLLI, PEDALATA, PROBLEMI, BIBLIOGRAFIA };
if (typeof module !== "undefined") module.exports = DATI;
if (typeof window !== "undefined") window.DATI = DATI;
