/**
 * COPA PRIDE · Resultados en vivo (Google Apps Script)
 *
 * Se pega en: Google Sheets -> Extensiones -> Apps Script.
 * Pasos completos en INSTALAR-EN-VIVO.txt.
 *
 * Cómo funciona:
 *  - La planilla guarda los resultados que cargan los veedores desde el celular.
 *  - La página pública lee esos resultados (lectura abierta, solo muestra datos).
 *  - Para ESCRIBIR hace falta un PIN. Cada PARTIDO tiene su propio PIN: lo genera
 *    el menú "Copa Pride -> Abrir jornada de hoy" y queda anotado en la hoja "PINs".
 *    Con el PIN de un partido solo se puede cargar ESE partido.
 *  - El PIN de un partido solo vale en su horario (10 min antes hasta 60 min después)
 *    y MUERE cuando el veedor finaliza el partido.
 *  - Hay un PIN de ADMINISTRACIÓN (fila "ADMIN" de la hoja "PINs"): entra a todos los
 *    partidos, sin horario, y puede reabrir partidos finalizados para corregirlos.
 *  - Un partido solo lo puede tener un dispositivo a la vez (si otro quiere tomarlo,
 *    la pantalla le pregunta y el primero deja de poder cargar).
 *  - La jornada se puede abrir la noche anterior: los PINs valen el día de los partidos (el de ADMIN ya sirve para probar
 *    desde que se abre) y se anulan al cerrar la jornada o al terminar ese día.
 */

var ZONA_HORARIA = "America/Argentina/Buenos_Aires";
var HOJA_PARTIDOS = "Partidos";
var HOJA_CONFIG = "Config";
var HOJA_PINS = "PINs";
var COLUMNAS = ["id", "estado", "golesLocal", "golesVisitante", "penLocal", "penVisitante",
                "goles", "tarjetas", "veedor", "lockHasta", "actualizado", "veedorEq", "disp", "mvp", "faltas"];
var MIN_ANTES = 10;           // el PIN de un partido se activa tantos minutos antes de su hora
var MIN_DESPUES = 80;         // y vence tantos minutos después de su hora de inicio (14:00 -> 15:20)
var MIN_PRUEBA = 240;         // duración de los PINs en una jornada de PRUEBA
var COLS_PIN = 10;            // columnas de la hoja PINs
var MINUTOS_BLOQUEO = 25;      // un partido tomado por un veedor queda reservado este tiempo
var HORA_CIERRE_DEFAULT = "23:30";
// Canal de YouTube de la Liga Pride (@LigaPride). La página toma de acá los videos de los partidos.
var CANAL_YT = "UC4kxNF6MJQn0qBw55NNi2lA";
var MIN_VIDEOS = 15;          // cada cuántos minutos se vuelve a mirar el canal

/* Fixture (id, fecha, hora, cancha, encuentro). Sale de data.js; si cambian fechas u horarios de los playoffs, se vuelve a pegar. */
var FIXTURE = [
  ["m1", "2026-10-17", "14:00", "Cancha 1", "Zona C · Red Aguará vs Impulse"],
  ["m2", "2026-10-17", "14:00", "Cancha 2", "Zona D · Panteras FC vs Apex Aguará"],
  ["m3", "2026-10-17", "14:00", "Cancha 3", "Zona D · Cruzados vs Tigres"],
  ["m4", "2026-10-17", "15:00", "Cancha 1", "Zona B · Dogos F5 vs Fenix"],
  ["m5", "2026-10-17", "15:00", "Cancha 2", "Zona B · FGR vs Grindr"],
  ["m6", "2026-10-17", "15:00", "Cancha 3", "Zona A · Panteras KFC vs Crisol"],
  ["m7", "2026-10-17", "16:00", "Cancha 1", "Zona C · Yacares BA vs Huemules"],
  ["m8", "2026-10-17", "16:00", "Cancha 3", "Zona A · Aguará Guazú vs Escorpiones"],
  ["m9", "2026-10-24", "14:00", "Cancha 1", "Zona A · Aguará Guazú vs Crisol"],
  ["m10", "2026-10-24", "14:00", "Cancha 2", "Zona A · Panteras KFC vs Escorpiones"],
  ["m11", "2026-10-24", "14:00", "Cancha 3", "Zona B · Dogos F5 vs Grindr"],
  ["m12", "2026-10-24", "15:00", "Cancha 1", "Zona D · Panteras FC vs Tigres"],
  ["m13", "2026-10-24", "15:00", "Cancha 2", "Zona C · Yacares BA vs Impulse"],
  ["m14", "2026-10-24", "15:00", "Cancha 3", "Zona C · Red Aguará vs Huemules"],
  ["m15", "2026-10-24", "16:00", "Cancha 1", "Zona D · Cruzados vs Apex Aguará"],
  ["m16", "2026-10-24", "16:00", "Cancha 3", "Zona B · FGR vs Fenix"],
  ["m17", "2026-10-31", "14:00", "Cancha 1", "Zona B · Grindr vs Fenix"],
  ["m18", "2026-10-31", "14:00", "Cancha 2", "Zona B · Dogos F5 vs FGR"],
  ["m19", "2026-10-31", "14:00", "Cancha 3", "Zona C · Red Aguará vs Yacares BA"],
  ["m20", "2026-10-31", "15:00", "Cancha 1", "Zona A · Crisol vs Escorpiones"],
  ["m21", "2026-10-31", "15:00", "Cancha 2", "Zona D · Panteras FC vs Cruzados"],
  ["m22", "2026-10-31", "15:00", "Cancha 3", "Zona D · Tigres vs Apex Aguará"],
  ["m23", "2026-10-31", "16:00", "Cancha 1", "Zona A · Aguará Guazú vs Panteras KFC"],
  ["m24", "2026-10-31", "16:00", "Cancha 3", "Zona C · Huemules vs Impulse"],
  ["m25", "2026-11-07", "14:00", "Cancha 1", "Cuartos Oro · (m25)"],
  ["m26", "2026-11-07", "14:00", "Cancha 2", "Cuartos Oro · (m26)"],
  ["m27", "2026-11-07", "14:00", "Cancha 3", "Cuartos Oro · (m27)"],
  ["m28", "2026-11-07", "15:00", "Cancha 1", "Cuartos Oro · (m28)"],
  ["m29", "2026-11-07", "15:00", "Cancha 2", "Cuartos Plata · (m29)"],
  ["m30", "2026-11-07", "15:00", "Cancha 3", "Cuartos Plata · (m30)"],
  ["m31", "2026-11-07", "16:00", "Cancha 1", "Cuartos Plata · (m31)"],
  ["m32", "2026-11-07", "16:00", "Cancha 2", "Cuartos Plata · (m32)"],
  ["m33", "2026-11-14", "15:00", "Cancha 1", "Semifinal Oro · (m33)"],
  ["m34", "2026-11-14", "15:00", "Cancha 2", "Semifinal Oro · (m34)"],
  ["m35", "2026-11-14", "16:00", "Cancha 1", "Semifinal Plata · (m35)"],
  ["m36", "2026-11-14", "16:00", "Cancha 2", "Semifinal Plata · (m36)"],
  ["m37", "2026-11-21", "15:00", "Cancha 1", "3er puesto Oro · (m37)"],
  ["m38", "2026-11-21", "15:00", "Cancha 2", "3er puesto Plata · (m38)"],
  ["m39", "2026-11-21", "17:00", "Cancha 1", "Final Oro · (m39)"],
  ["m40", "2026-11-21", "17:00", "Cancha 2", "Final Plata · (m40)"]
];


/* ---------------- utilidades de fecha (se pueden pisar en las pruebas) ---------------- */
function ahora_() { return new Date(); }
function hoy_() { return Utilities.formatDate(ahora_(), ZONA_HORARIA, "yyyy-MM-dd"); }
function hora_() { return Utilities.formatDate(ahora_(), ZONA_HORARIA, "HH:mm"); }

/* ---------------- menú de la planilla ---------------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Copa Pride")
    .addItem("Abrir jornada de hoy", "abrirJornada")
    .addItem("Abrir jornada de PRUEBA (PINs sin horario)", "abrirJornadaPrueba")
    .addItem("Cerrar jornada", "cerrarJornada")
    .addItem("Liberar todos los partidos", "liberarBloqueos")
    .addItem("Revisar videos de YouTube ahora", "revisarVideos")
    .addToUi();
}

function pinNuevo_(usados) {
  var pin;
  do { pin = String(100000 + Math.floor(Math.random() * 900000)); } while (usados[pin]);
  usados[pin] = true;
  return pin;
}

function fmtFechaHora_(ms) { return Utilities.formatDate(new Date(ms), ZONA_HORARIA, "yyyy-MM-dd HH:mm"); }
function aMs_(txt) { return Date.parse(String(txt).trim().replace(" ", "T") + ":00-03:00"); }   // Argentina: UTC-3 todo el año
function horaDe_(txt) { return String(txt).trim().substring(11, 16); }

function abrirJornada() { abrir_(false); }
function abrirJornadaPrueba() { abrir_(true); }

function abrir_(prueba) {
  var ui = SpreadsheetApp.getUi();
  prepararHojas_();
  var fecha = hoy_();
  var ps = FIXTURE.filter(function (f) { return f[1] === fecha; });
  if (!ps.length) {
    var resp = ui.prompt("No hay partidos hoy en el fixture",
      "Escribí la fecha de los partidos para los que querés crear PINs (formato aaaa-mm-dd, por ejemplo 2026-10-17):",
      ui.ButtonSet.OK_CANCEL);
    if (resp.getSelectedButton() !== ui.Button.OK) return;
    fecha = String(resp.getResponseText()).trim();
    ps = FIXTURE.filter(function (f) { return f[1] === fecha; });
    if (!ps.length) { ui.alert("Sin partidos", "No encontré partidos para " + fecha + ".", ui.ButtonSet.OK); return; }
  }
  ps = ps.slice().sort(function (a, b) { return (a[2] + a[3]).localeCompare(b[2] + b[3]); });
  var usados = {}, ahoraMs = ahora_().getTime();
  var pinAdmin = pinNuevo_(usados);
  var filas = [["*", fecha, "", "", "ADMIN · todos los partidos (sin horario)", pinAdmin, "", "", "", ""]];
  var texto = [];
  ps.forEach(function (f) {
    var pin = pinNuevo_(usados), desde, hasta;
    if (prueba) { desde = ahoraMs; hasta = ahoraMs + MIN_PRUEBA * 60000; }
    else { var ini = aMs_(f[1] + " " + f[2]); desde = ini - MIN_ANTES * 60000; hasta = ini + MIN_DESPUES * 60000; }
    filas.push([f[0], f[1], f[2], f[3], f[4], pin, "", fmtFechaHora_(desde), fmtFechaHora_(hasta), ""]);
    texto.push(f[2] + " · " + f[3] + " · " + f[4] + "  →  PIN " + pin + "  (activo " + horaDe_(fmtFechaHora_(desde)) + " a " + horaDe_(fmtFechaHora_(hasta)) + ")");
  });
  var hp = hoja_(HOJA_PINS);
  if (hp.getLastRow() > 1) hp.getRange(2, 1, hp.getLastRow() - 1, COLS_PIN).clearContent();
  hp.getRange(2, 1, filas.length, COLS_PIN).setNumberFormat("@").setValues(filas);
  // Se guarda la fecha DE LOS PARTIDOS (no la de hoy): así se puede dejar abierta la noche anterior.
  escribirConfig_({ pin: "", fecha: fecha, abierta: "SI" });
  limpiarCache_();
  ui.alert(prueba ? "Jornada de PRUEBA abierta" : "Jornada abierta",
    "PIN DE ADMINISTRACIÓN (solo para vos, entra a todos los partidos y puede corregir): " + pinAdmin +
    "\n\nUn PIN por partido (también están en la hoja \"PINs\"):\n\n" + texto.join("\n") +
    "\n\nCada PIN vale solo para su partido y se anula cuando el veedor lo finaliza." +
    (prueba ? "\nEsta es una jornada de PRUEBA: los PINs duran " + (MIN_PRUEBA / 60) + " horas desde ahora." : ""),
    ui.ButtonSet.OK);
}

function cerrarJornada() {
  prepararHojas_();
  escribirConfig_({ pin: "", abierta: "NO" });
  var hp = hoja_(HOJA_PINS);
  if (hp.getLastRow() > 1) hp.getRange(2, 1, hp.getLastRow() - 1, COLS_PIN).clearContent();
  limpiarCache_();
  SpreadsheetApp.getUi().alert("Jornada cerrada",
    "Los veedores ya no pueden cargar resultados. Todos los PINs quedaron anulados.",
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function liberarBloqueos() {
  var mapa = leerPartidos_();
  for (var id in mapa) {
    var r = mapa[id];
    if (Number(r.lockHasta) > 0) { r.lockHasta = 0; escribirFila_(r, r._fila); }
  }
  limpiarCache_();
}

/* ---------------- hojas ---------------- */
function hoja_(nombre) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var h = libro.getSheetByName(nombre);
  if (!h) h = libro.insertSheet(nombre);
  return h;
}

function prepararHojas_() {
  var hp = hoja_(HOJA_PARTIDOS);
  if (hp.getLastRow() < 1) hp.appendRow(COLUMNAS);
  else hp.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]);
  var hpin = hoja_(HOJA_PINS);
  if (hpin.getLastRow() < 1) hpin.appendRow(["partido", "fecha", "hora", "cancha", "encuentro", "PIN", "veedor", "activo desde", "activo hasta", "estado"]);
  var hc = hoja_(HOJA_CONFIG);
  if (hc.getLastRow() < 1) {
    hc.appendRow(["pin", ""]);
    hc.appendRow(["fecha", ""]);
    hc.appendRow(["abierta", "NO"]);
    hc.appendRow(["horaCierre", HORA_CIERRE_DEFAULT]);
    hc.getRange(1, 2, 4, 1).setNumberFormat("@");
  }
}

function leerConfig_() {
  prepararHojas_();
  var vals = hoja_(HOJA_CONFIG).getDataRange().getValues();
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || ZONA_HORARIA;
  var c = {};
  for (var i = 0; i < vals.length; i++) {
    var k = String(vals[i][0]).replace(/\s+/g, "");
    if (!k) continue;
    var v = vals[i][1];
    if (v instanceof Date) v = Utilities.formatDate(v, tz, k === "horaCierre" ? "HH:mm" : "yyyy-MM-dd");
    c[k] = (v === null || v === undefined) ? "" : String(v).trim();
  }
  return c;
}

function escribirConfig_(cambios) {
  var hoja = hoja_(HOJA_CONFIG);
  var vals = hoja.getDataRange().getValues();
  for (var i = 0; i < vals.length; i++) {
    var k = String(vals[i][0]).replace(/\s+/g, "");
    if (cambios.hasOwnProperty(k)) {
      hoja.getRange(i + 1, 2).setNumberFormat("@");   // texto: no pierde ceros ni se vuelve fecha
      hoja.getRange(i + 1, 2).setValue(String(cambios[k]));
    }
  }
}

function leerPartidos_() {
  prepararHojas_();
  var vals = hoja_(HOJA_PARTIDOS).getDataRange().getValues();
  var mapa = {};
  for (var i = 1; i < vals.length; i++) {
    var r = {};
    for (var j = 0; j < COLUMNAS.length; j++) r[COLUMNAS[j]] = vals[i][j];
    if (r.id === "" || r.id === null || r.id === undefined) continue;
    r._fila = i + 1;
    mapa[String(r.id)] = r;
  }
  return mapa;
}

function escribirFila_(r, fila) {
  var hoja = hoja_(HOJA_PARTIDOS);
  var arr = COLUMNAS.map(function (c) { return (r[c] === undefined || r[c] === null) ? "" : r[c]; });
  if (fila) hoja.getRange(fila, 1, 1, COLUMNAS.length).setValues([arr]);
  else hoja.appendRow(arr);
}

function limpiarCache_() { CacheService.getScriptCache().remove("estado"); }

function parse_(txt) {
  if (!txt) return [];
  try { var v = JSON.parse(txt); return Array.isArray(v) ? v : []; } catch (e) { return []; }
}

/* ---------------- seguridad: PIN por partido + jornada ---------------- */
function buscarPin_(pin) {
  var hp = hoja_(HOJA_PINS);
  var n = hp.getLastRow();
  if (n < 2) return null;
  var vals = hp.getRange(2, 1, n - 1, COLS_PIN).getValues();
  for (var i = 0; i < vals.length; i++) {
    var p = String(vals[i][5]).trim();
    if (p && p === pin)
      return { partido: String(vals[i][0]), fecha: String(vals[i][1]), encuentro: String(vals[i][4]), fila: i + 2,
               hora: vals[i][2] instanceof Date ? Utilities.formatDate(vals[i][2], ZONA_HORARIA, "HH:mm") : String(vals[i][2] || "").trim(),
               desde: String(vals[i][7] || ""), hasta: String(vals[i][8] || ""), estado: String(vals[i][9] || "") };
  }
  return null;
}

function filaPin_(partido) {
  var hp = hoja_(HOJA_PINS), n = hp.getLastRow();
  if (n < 2) return 0;
  var vals = hp.getRange(2, 1, n - 1, 1).getValues();
  for (var i = 0; i < vals.length; i++) if (String(vals[i][0]) === String(partido)) return i + 2;
  return 0;
}

function validar_(pin) {
  var c = leerConfig_();
  if (String(c.abierta || "").toUpperCase() !== "SI")
    return { ok: false, codigo: "cerrada", error: "La jornada está cerrada. La organización tiene que abrirla." };
  // El día de los partidos entran todos. Antes de ese día (la noche anterior) solo entra el PIN de administración, para probar.
  var hitAntes = null;
  if (c.fecha !== hoy_()) {
    hitAntes = pin ? buscarPin_(String(pin).trim()) : null;
    if (!(hitAntes && hitAntes.partido === "*" && hoy_() < c.fecha))
      return { ok: false, codigo: "fecha", error: c.fecha > hoy_() ? "La jornada es el " + c.fecha + ". Tu PIN se activa ese día, a la hora de tu partido." : "La jornada de hoy no está abierta." };
  }
  var cierre = c.horaCierre || HORA_CIERRE_DEFAULT;
  if (hora_() > cierre)
    return { ok: false, codigo: "hora", error: "La jornada ya cerró (" + cierre + ")." };
  var hit = pin ? buscarPin_(String(pin).trim()) : null;
  if (!hit) {
    Utilities.sleep(1200);   // frena los intentos de adivinar el PIN
    return { ok: false, codigo: "pin", error: "PIN incorrecto." };
  }
  if (hit.partido === "*")
    return { ok: true, admin: true, partido: "*", fecha: hit.fecha, encuentro: hit.encuentro, fila: hit.fila };
  if (hit.estado === "FINALIZADO")
    return { ok: false, codigo: "pin", error: "Este PIN ya se usó: el partido está finalizado. Si hay que corregir algo, avisale a la organización." };
  var t = ahora_().getTime();
  if (hit.desde && t < aMs_(hit.desde))
    return { ok: false, codigo: "pin", error: "Todavía no es el horario de tu partido. Tu PIN se activa a las " + horaDe_(hit.desde) + "." };
  // El vencimiento se calcula con la hora del partido y MIN_DESPUES (así un cambio de minutos vale también para PINs ya creados).
  // Si la hoja dice más tarde (jornada de PRUEBA), se respeta la hoja.
  var hastaMs = hit.hasta ? aMs_(hit.hasta) : 0;
  if (/^\d{2}:\d{2}$/.test(hit.hora) && /^\d{4}-\d{2}-\d{2}$/.test(hit.fecha)) {
    var porHora = aMs_(hit.fecha + " " + hit.hora) + MIN_DESPUES * 60000;
    hastaMs = Math.max(hastaMs, porHora);
  }
  if (hastaMs && t > hastaMs)
    return { ok: false, codigo: "pin", error: "El PIN de tu partido venció a las " + horaDe_(fmtFechaHora_(hastaMs)) + ". Avisale a la organización." };
  return { ok: true, partido: hit.partido, fecha: hit.fecha, encuentro: hit.encuentro, fila: hit.fila };
}

function permitido_(v, id) {
  if (v.admin) return FIXTURE.some(function (f) { return f[0] === id; });
  return id === v.partido;
}

function nombreVeedor_(v) {
  return String(v || "").replace(/[^\wÁÉÍÓÚÜÑáéíóúüñ .'-]/g, "").trim().substring(0, 30);
}

function err_(msg, codigo) { return { ok: false, error: msg, codigo: codigo || "datos" }; }

/* ---------------- lectura pública ---------------- */
function publico_(r) {
  return {
    estado: r.estado, gl: r.golesLocal, gv: r.golesVisitante, pl: r.penLocal, pv: r.penVisitante,
    goles: parse_(r.goles), tarjetas: parse_(r.tarjetas), veedor: r.veedor || "", veedorEq: r.veedorEq || "", mvp: r.mvp || "", faltas: parse_(r.faltas),
    lock: Number(r.lockHasta) > ahora_().getTime(), t: r.actualizado
  };
}

/* ---------------- videos de YouTube ----------------
   Lee los últimos videos públicos del canal (el feed público de YouTube, sin claves) y se los pasa a la
   página. La página reconoce a qué partido es cada video por los dos equipos que dice el título. */
function videosYT_(forzar) {
  var cache = CacheService.getScriptCache();
  if (!forzar) { var hit = cache.get("videos"); if (hit) return JSON.parse(hit); }
  var lista = [], motivo = "";
  // 1) Conexión oficial (servicio "YouTube Data API" agregado en Apps Script > Servicios). Es la más confiable.
  try {
    if (typeof YouTube !== "undefined") {
      var r = YouTube.PlaylistItems.list("snippet", { playlistId: "UU" + CANAL_YT.substring(2), maxResults: 50 });
      (r.items || []).forEach(function (it) {
        var s = it.snippet || {}, id = s.resourceId && s.resourceId.videoId;
        if (id && s.title && s.title !== "Private video" && s.title !== "Deleted video") lista.push({ id: id, t: s.title, f: String(s.publishedAt || "").substring(0, 10) });
      });
      motivo = "conexión oficial de YouTube";
    }
  } catch (x) { motivo = "falló la conexión oficial (" + x + ")"; lista = []; }
  // 2) Respaldo: el listado público del canal.
  if (!lista.length) {
    try {
      var res = UrlFetchApp.fetch("https://www.youtube.com/feeds/videos.xml?channel_id=" + CANAL_YT, { muteHttpExceptions: true });
      var cod = res.getResponseCode();
      if (cod === 200) {
        var raiz = XmlService.parse(res.getContentText()).getRootElement();
        var atom = XmlService.getNamespace("http://www.w3.org/2005/Atom");
        var yt = XmlService.getNamespace("yt", "http://www.youtube.com/xml/schemas/2015");
        raiz.getChildren("entry", atom).forEach(function (en) {
          var id = en.getChildText("videoId", yt), t = en.getChildText("title", atom), f = en.getChildText("published", atom);
          if (id && t) lista.push({ id: id, t: t, f: String(f || "").substring(0, 10) });
        });
        motivo = (motivo ? motivo + "; " : "") + "listado público";
      } else motivo = (motivo ? motivo + "; " : "") + "el listado público respondió " + cod;
    } catch (x2) { motivo = (motivo ? motivo + "; " : "") + "no se pudo leer el listado público"; }
  }
  cache.put("videos", JSON.stringify(lista), lista.length ? MIN_VIDEOS * 60 : 120);   // si no hay nada, se reintenta en 2 minutos
  cache.put("videosMotivo", motivo, 3600);
  return lista;
}

function revisarVideos() {
  var v = videosYT_(true), motivo = CacheService.getScriptCache().get("videosMotivo") || "";
  CacheService.getScriptCache().remove("estado");
  SpreadsheetApp.getUi().alert(v.length ? ("Encontré " + v.length + " videos en el canal (" + motivo + "). El último: " + v[0].t)
    : ("No encontré videos en el canal. Detalle: " + motivo + "."));
}

function estadoJson_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get("estado");
  if (hit) return hit;
  var mapa = leerPartidos_(), out = {};
  for (var id in mapa) { if (mapa[id].estado) out[id] = publico_(mapa[id]); }
  var json = JSON.stringify({ ok: true, partidos: out, videos: videosYT_(), ahora: ahora_().getTime() });
  cache.put("estado", json, 8);
  return json;
}

/* ---------------- escritura (solo veedores con PIN) ---------------- */
function login_(d, v) {
  if (!nombreVeedor_(d.veedor)) return err_("Poné tu nombre.");
  return { ok: true, fecha: hoy_(), partido: v.partido, encuentro: v.encuentro, admin: !!v.admin, fechaPartidos: v.fecha };
}

function dispValido_(x) { return /^[A-Za-z0-9_-]{8,40}$/.test(String(x || "")); }

function tomar_(d, v) {
  var id = String(d.id || ""), nombre = nombreVeedor_(d.veedor);
  if (!/^[A-Za-z0-9_-]{1,20}$/.test(id)) return err_("Partido inválido.");
  if (!permitido_(v, id)) return err_("Ese PIN es de otro partido.", "partido");
  if (!nombre) return err_("Poné tu nombre.");
  if (!dispValido_(d.disp)) return err_("Recargá la página e intentá de nuevo.");
  var mapa = leerPartidos_(), r = mapa[id] || { id: id }, ts = ahora_().getTime();
  var otro = r.disp ? String(r.disp) !== String(d.disp) : (r.veedor && r.veedor !== nombre);
  var ocupado = r.veedor && Number(r.lockHasta) > ts && otro;
  if (ocupado && !d.forzar)
    return { ok: false, ocupado: true, por: r.veedor, codigo: "ocupado", error: "Lo está cargando otro dispositivo (" + r.veedor + ")." };
  r.veedor = nombre;
  r.disp = String(d.disp);
  var fp = v.admin ? filaPin_(id) : v.fila;
  if (fp) hoja_(HOJA_PINS).getRange(fp, 7).setValue(v.admin ? nombre + " (admin)" : nombre);
  if (/^e\d{1,3}$/.test(String(d.veedorEq || ""))) r.veedorEq = String(d.veedorEq);
  r.lockHasta = ts + MINUTOS_BLOQUEO * 60000;
  if (!r.estado) {
    r.estado = "EN_JUEGO"; r.golesLocal = 0; r.golesVisitante = 0; r.goles = "[]"; r.tarjetas = "[]";
  }
  r.actualizado = ahora_().toISOString();
  escribirFila_(r, r._fila);
  limpiarCache_();
  return { ok: true, partido: publico_(r) };
}

function entero_(x, max) {
  if (x === null || x === undefined || x === "") return null;
  var n = Number(x);
  if (!isFinite(n) || n < 0 || n > max || Math.floor(n) !== n) return NaN;
  return n;
}

function listaValida_(lista, max, conTipo) {
  if (!Array.isArray(lista) || lista.length > max) return null;
  var out = [];
  for (var i = 0; i < lista.length; i++) {
    var x = lista[i] || {};
    var j = String(x.j === undefined || x.j === null ? "" : x.j), e = String(x.e || "");
    if (j.length > 20 || !/^[A-Za-z0-9_-]{1,20}$/.test(e) || (j && !/^[A-Za-z0-9_-]+$/.test(j))) return null;
    var item = { j: j, e: e };
    if (conTipo) { if (x.t !== "A" && x.t !== "R" && x.t !== "Z") return null; item.t = x.t; }
    out.push(item);
  }
  return out;
}

function guardar_(d, v) {
  var id = String(d.id || ""), nombre = nombreVeedor_(d.veedor);
  if (!permitido_(v, id)) return err_("Ese PIN es de otro partido.", "partido");
  var estado = d.estado;
  if (estado !== "EN_JUEGO" && estado !== "FINAL") return err_("Estado inválido.");
  var gl = entero_(d.gl, 99), gv = entero_(d.gv, 99);
  var pl = entero_(d.pl, 99), pv = entero_(d.pv, 99);
  if (gl === null || gv === null || isNaN(gl) || isNaN(gv) || isNaN(pl) || isNaN(pv)) return err_("Marcador inválido.");
  var goles = listaValida_(d.goles || [], 99, false), tarjetas = listaValida_(d.tarjetas || [], 60, true);
  if (!goles || !tarjetas) return err_("Detalle de goles o tarjetas inválido.");

  // Jugador del partido (opcional): id del jugador, o vacío.
  var mvp = (d.mvp === undefined || d.mvp === null) ? null : String(d.mvp);
  if (mvp !== null && !/^[A-Za-z0-9_-]{0,20}$/.test(mvp)) return err_("Jugador del partido inválido.");

  // Faltas (opcional): [local 1T, local 2T, visitante 1T, visitante 2T].
  var faltas = null;
  if (d.faltas !== undefined && d.faltas !== null) {
    if (!Array.isArray(d.faltas) || d.faltas.length !== 4) return err_("Faltas inválidas.");
    faltas = d.faltas.map(function (x) { var n = parseInt(x, 10); return isNaN(n) ? 0 : Math.max(0, Math.min(30, n)); });
  }

  var mapa = leerPartidos_(), r = mapa[id];
  var mio = r && (r.disp ? String(r.disp) === String(d.disp) : r.veedor === nombre);
  if (!mio)
    return { ok: false, codigo: "lock", error: "Otro dispositivo tomó este partido. Si querés seguir cargando, volvé a entrar y tomalo de nuevo." };

  r.estado = estado;
  r.golesLocal = gl; r.golesVisitante = gv;
  r.penLocal = pl === null ? "" : pl; r.penVisitante = pv === null ? "" : pv;
  r.goles = JSON.stringify(goles); r.tarjetas = JSON.stringify(tarjetas);
  if (mvp !== null) r.mvp = mvp;
  if (faltas !== null) r.faltas = JSON.stringify(faltas);
  r.lockHasta = estado === "FINAL" ? 0 : ahora_().getTime() + MINUTOS_BLOQUEO * 60000;
  r.actualizado = ahora_().toISOString();
  escribirFila_(r, r._fila);
  // Al finalizar, el PIN de ese partido muere: el veedor ya no puede volver a entrar.
  // Solo la administración (PIN ADMIN) puede reabrirlo para corregir.
  if (estado === "FINAL") { var fp = filaPin_(id); if (fp) hoja_(HOJA_PINS).getRange(fp, 10).setValue("FINALIZADO"); }
  limpiarCache_();
  return { ok: true, partido: publico_(r) };
}

function liberar_(d, v) {
  var id = String(d.id || ""), nombre = nombreVeedor_(d.veedor);
  if (!permitido_(v, id)) return err_("Ese PIN es de otro partido.", "partido");
  var mapa = leerPartidos_(), r = mapa[id];
  if (r && (r.disp ? String(r.disp) === String(d.disp) : r.veedor === nombre)) { r.lockHasta = 0; escribirFila_(r, r._fila); limpiarCache_(); }
  return { ok: true };
}

/* ---------------- puntos de entrada de la web ---------------- */
function respuesta_(obj) {
  return ContentService.createTextOutput(typeof obj === "string" ? obj : JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var accion = e && e.parameter && e.parameter.accion;
  if (accion === "estado") return respuesta_(estadoJson_());
  return respuesta_({ ok: true, mensaje: "Copa Pride en vivo" });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d;
    try { d = JSON.parse(e.postData.contents); } catch (x) { return respuesta_(err_("Pedido inválido.")); }
    // Si el celu todavía tiene guardada una versión vieja de la página (sin identificador de dispositivo), se arma uno con el nombre.
    if (!dispValido_(d.disp)) d.disp = "disp-" + String(d.veedor || "x").replace(/[^A-Za-z0-9]/g, "") + "-0";
    // El PIN y la jornada se validan ANTES de tomar el candado, así un PIN
    // incorrecto (que espera 1 segundo a propósito) no traba a los demás veedores.
    var v = validar_(d.pin);
    if (!v.ok) return respuesta_(v);
    lock.waitLock(15000);
    switch (d.accion) {
      case "login": return respuesta_(login_(d, v));
      case "tomar": return respuesta_(tomar_(d, v));
      case "guardar": return respuesta_(guardar_(d, v));
      case "liberar": return respuesta_(liberar_(d, v));
      default: return respuesta_(err_("Acción desconocida."));
    }
  } catch (ex) {
    return respuesta_({ ok: false, codigo: "error", error: "Error del servidor, probá de nuevo." });
  } finally {
    try { lock.releaseLock(); } catch (x2) { /* no estaba tomado */ }
  }
}
