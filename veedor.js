/* =====================================================================
   PANTALLA DE VEEDORES · Copa Pride
   Cada veedor entra con el PIN de SU partido (uno por partido, solo vale en su
   horario y muere al finalizar) y carga goles, tarjetas y penales desde el celular.
   Todo se guarda solo. Un partido solo lo puede tener un dispositivo a la vez.
   El PIN de ADMINISTRACIÓN entra a todos los partidos y puede reabrir los finalizados.
   ===================================================================== */
(function () {
  "use strict";

  const A = window.CopaApp;
  const root = document.getElementById("v-app");
  if (!A || !root) return;
  const D = A.D;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* sin almacenamiento */ } }
  };

  // Identificador de ESTE dispositivo (queda guardado): el servidor lo usa para que un partido
  // no lo carguen dos dispositivos a la vez.
  function idDispositivo() {
    let d = ls.get("cp_disp");
    if (!d || !/^[A-Za-z0-9_-]{8,40}$/.test(d)) {
      const a = new Uint8Array(12);
      try { crypto.getRandomValues(a); } catch (e) { for (let i = 0; i < a.length; i++) a[i] = Math.floor(Math.random() * 256); }
      d = "d" + Array.from(a, (x) => x.toString(36).padStart(2, "0")).join("");
      ls.set("cp_disp", d);
    }
    return d;
  }

  const S = { nombre: ls.get("cp_nombre") || "", eq: ls.get("cp_equipo") || "", pin: ls.get("cp_pin") || "", disp: idDispositivo(), partido: ls.get("cp_partido") || "", admin: false, fechaP: "", remoto: {}, timerLista: null, aviso: "" };
  let M = null;                 // partido que se está cargando
  let enviando = false, pendiente = false;
  let wake = null;

  /* ---------------- comunicación con la planilla ---------------- */
  async function llamar(accion, datos) {
    const res = await fetch(D.api, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },   // sin preflight CORS
      body: JSON.stringify(Object.assign({ accion, pin: S.pin, veedor: S.nombre, veedorEq: S.eq, disp: S.disp }, datos || {}))
    });
    return res.json();
  }

  async function cargarEstado() {
    const res = await fetch(D.api + (D.api.indexOf("?") >= 0 ? "&" : "?") + "accion=estado&t=" + Date.now());
    const r = await res.json();
    if (r && r.ok) { S.remoto = r.partidos || {}; A.aplicarRemoto(r); A.normalizar(); }
  }

  // Devuelve true si el servidor dijo que la jornada/PIN ya no valen: se vuelve al login.
  function sesionCaida(r) {
    if (r && !r.ok && ["pin", "cerrada", "fecha", "hora"].indexOf(r.codigo) >= 0) {
      S.pin = ""; ls.del("cp_pin"); S.partido = ""; ls.del("cp_partido"); S.admin = false;
      S.aviso = r.error || "Tenés que volver a entrar.";
      detenerLista();
      pantallaLogin();
      return true;
    }
    return false;
  }

  /* ---------------- encabezado ---------------- */
  function pintarQuien() {
    const q = document.getElementById("vQuien");
    q.hidden = !S.pin;
    const eqq = S.eq ? A.equipo(S.eq) : null;
    document.getElementById("vNombre").textContent = S.nombre + (S.admin ? " · ADMIN" : eqq ? " (" + eqq.nombre + ")" : "");
    document.getElementById("vSub").textContent = (D.nombre || "") + " " + (D.edicion || "");
  }

  /* ---------------- pantallas ---------------- */
  function pantallaSinApi() {
    root.innerHTML = `<div class="vcaja"><h2>Falta un paso</h2>
      <p>Todavía no está conectada la planilla de resultados en vivo. Seguí los pasos de <b>INSTALAR-EN-VIVO.txt</b> y pegá la dirección en <b>api</b> dentro de <b>data.js</b>.</p></div>`;
  }

  function pantallaLogin() {
    pintarQuien();
    root.innerHTML = `<form class="vcaja" id="fLogin" autocomplete="off">
      <h2>Entrar como veedor</h2>
      <p class="vtxt">El PIN es de tu partido: te lo pasa la organización el día de la jornada. Solo sirve para ese partido, en su horario, y se vence cuando lo finalizás.</p>
      ${S.aviso ? `<p class="vaviso">${esc(S.aviso)}</p>` : ""}
      <label>Tu nombre<input id="iNombre" type="text" maxlength="30" value="${esc(S.nombre)}" placeholder="Ej: Nacho" list="lVeedores" required></label>
      <datalist id="lVeedores">${(D.veedores || []).map((x) => `<option value="${esc(x.nombre)}"></option>`).join("")}</datalist>
      <label>Tu equipo<select id="iEquipo" required><option value="">Elegí tu equipo</option>${A.equipos().slice().sort((a, b) => a.nombre.localeCompare(b.nombre, "es")).map((e) => `<option value="${esc(e.id)}" ${e.id === S.eq ? "selected" : ""}>${esc(e.nombre)}</option>`).join("")}</select></label>
      <label>PIN de tu partido<input id="iPin" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="6 números" required></label>
      <button class="vbtn grande" type="submit" id="bEntrar">Entrar</button>
    </form>`;
    S.aviso = "";
    // Si el nombre está en la lista de veedores, se completa solo el equipo.
    const clave = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    document.getElementById("iNombre").addEventListener("input", (ev) => {
      const f = (D.veedores || []).find((x) => clave(x.nombre) === clave(ev.target.value));
      if (f && f.equipo) document.getElementById("iEquipo").value = f.equipo;
    });
    document.getElementById("fLogin").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const nombre = document.getElementById("iNombre").value.trim();
      S.eq = document.getElementById("iEquipo").value;
      const pin = document.getElementById("iPin").value.trim();
      const b = document.getElementById("bEntrar");
      b.disabled = true; b.textContent = "Entrando…";
      try {
        S.nombre = nombre; S.pin = pin;
        const r = await llamar("login");
        if (r.ok) {
          S.partido = r.partido || ""; S.admin = !!r.admin; S.fechaP = r.fechaPartidos || "";
          ls.set("cp_nombre", S.nombre); ls.set("cp_equipo", S.eq); ls.set("cp_pin", S.pin); ls.set("cp_partido", S.partido);
          await abrirLista(); return;
        }
        S.pin = ""; S.aviso = r.error || "No se pudo entrar."; pantallaLogin();
      } catch (e) {
        S.pin = ""; S.aviso = "No hay conexión. Probá de nuevo."; pantallaLogin();
      }
    });
  }

  function equiposTxt(p) {
    const f = (id) => { const e = A.equipo(id); return e ? esc(e.nombre) : `<i>${esc(A.resolverSlot(id).texto)}</i>`; };
    return `${f(p.local)} <b>vs</b> ${f(p.visitante)}`;
  }

  function detenerLista() { if (S.timerLista) { clearInterval(S.timerLista); S.timerLista = null; } }

  // Veedor: "la lista" es una sola tarjeta (su partido). Administración: todos los partidos del día.
  async function abrirLista() {
    M = null;
    pintarQuien();
    detenerLista();
    try { await cargarEstado(); } catch (e) { /* se muestra lo que haya */ }
    pintarLista();
    if (S.admin) {
      S.timerLista = setInterval(async () => {
        if (document.hidden || M) return;
        try { await cargarEstado(); pintarLista(); } catch (e) { /* sin conexión */ }
      }, 8000);
    }
  }

  function chipEstado(p) {
    const x = S.remoto[p.id];
    if (!x || !x.estado) return { clase: "libre", txt: S.admin ? "Libre" : "Todavía no empezó" };
    const marc = `${x.gl}-${x.gv}`;
    if (x.estado === "FINAL") return { clase: "final", txt: "Final " + marc };
    if (!S.admin) return { clase: "mio", txt: "En juego " + marc };
    if (x.lock) return { clase: "ocupado", txt: "En carga: " + esc(x.veedor) + " · " + marc };
    return { clase: "libre", txt: "En juego " + marc + " · libre" };
  }

  function tarjetaPartido(p) {
    const listo = A.equipo(p.local) && A.equipo(p.visitante);
    const c = chipEstado(p);
    const cerrado = !S.admin && c.clase === "final";   // el veedor no vuelve a entrar a un partido finalizado
    return `<button type="button" class="vp ${c.clase}" data-act="abrir" data-id="${esc(p.id)}" ${listo && !cerrado ? "" : "disabled"}>
      <span class="vp-top"><span>${esc(p.hora)} · ${esc(p.cancha)} · ${esc(A.faseLabel(p))}</span><span class="vp-est">${listo ? c.txt : "Equipos por definir"}</span></span>
      <span class="vp-eq">${equiposTxt(p)}</span></button>`;
  }

  function pintarLista() {
    let html;
    if (S.admin) {
      const dia = S.fechaP;
      const ps = A.partidos().filter((p) => p.fecha === dia)
        .sort((a, b) => (a.hora + a.cancha).localeCompare(b.hora + b.cancha, "es", { numeric: true }));
      html = `<h2 class="vtit">Administración</h2><p class="vtxt">${dia ? esc(A.fechaLarga(dia)) + ". " : ""}Podés abrir cualquier partido, también los finalizados, para corregirlos.</p>`;
      if (!ps.length) html += `<div class="vcaja"><p>No hay partidos para esa fecha.</p></div>`;
      [...new Set(ps.map((p) => p.hora))].forEach((h) => {
        html += `<h3 class="vhora">${esc(h)}</h3><div class="vlista">${ps.filter((p) => p.hora === h).map(tarjetaPartido).join("")}</div>`;
      });
    } else {
      const p = A.partidos().find((x) => x.id === S.partido);
      html = `<h2 class="vtit">Tu partido</h2>`;
      if (!p) {
        html += `<div class="vcaja"><p>Este PIN es de un partido que no está en la lista. Avisale a la organización.</p></div>`;
      } else if (!A.equipo(p.local) || !A.equipo(p.visitante)) {
        html += `<div class="vcaja"><p>Los equipos de este partido todavía no están definidos. Avisale a la organización.</p></div>`;
      } else {
        const fin = chipEstado(p).clase === "final";
        html += `<p class="vtxt">${esc(A.fechaLarga(p.fecha))}. ${fin ? "Este partido ya está finalizado. Si hay que corregir algo, avisale a la organización." : "Tocá el partido para cargarlo."}</p>
          <div class="vlista">${tarjetaPartido(p)}</div>`;
      }
    }
    root.innerHTML = html;
  }

  /* ---------------- cargar un partido ---------------- */
  const idsDe = () => ({ L: M.p.local, V: M.p.visitante });
  const cuenta = (lado) => M.goles.filter((g) => g.e === idsDe()[lado]).length;
  const esPlayoff = () => M.p.fase !== "Zona";
  const empate = () => cuenta("L") === cuenta("V");

  async function abrirPartido(id, forzar) {
    const p = A.partidos().find((x) => x.id === id);
    if (!p || !A.equipo(p.local) || !A.equipo(p.visitante)) return;
    let r;
    try { r = await llamar("tomar", { id, forzar: !!forzar }); }
    catch (e) { alert("No hay conexión. Probá de nuevo."); return; }
    if (!r.ok) {
      if (sesionCaida(r)) return;
      if (r.ocupado) {
        if (confirm(`Este partido lo está cargando otro dispositivo (${r.por}).\n\n¿Tomarlo en este dispositivo? El otro deja de poder cargar.\n\nHacelo solo si el otro se quedó sin batería o ya no lo estás usando.`)) return abrirPartido(id, true);
        return;
      }
      alert(r.error || "No se pudo tomar el partido.");
      return;
    }
    detenerLista();
    const x = r.partido;
    M = { id, p, mvp: x.mvp || "", estado: x.estado || "EN_JUEGO", goles: x.goles || [], tarjetas: x.tarjetas || [], faltas: faltasDe(x.faltas),
          pl: x.pl === "" || x.pl == null ? null : Number(x.pl), pv: x.pv === "" || x.pv == null ? null : Number(x.pv), guardado: "ok" };
    // Si quedó algo sin enviar en este celular (se cortó la conexión), se recupera.
    try {
      const d = JSON.parse(ls.get("cp_draft_" + id) || "null");
      if (d && d.sent === false && d.nombre === S.nombre && d.disp === S.disp) {
        Object.assign(M, { estado: d.estado, goles: d.goles, tarjetas: d.tarjetas, pl: d.pl, pv: d.pv, mvp: d.mvp || M.mvp, faltas: faltasDe(d.faltas || M.faltas) });
        guardarYa();
      }
    } catch (e) { /* borrador roto: se ignora */ }
    pedirPantallaActiva();
    pintarPartido();
  }

  async function pedirPantallaActiva() {
    try { if (navigator.wakeLock) wake = await navigator.wakeLock.request("screen"); } catch (e) { /* no disponible */ }
  }
  function soltarPantalla() { try { if (wake) wake.release(); } catch (e) { /* nada */ } wake = null; }

  function nombreEq(lado) { return A.equipo(idsDe()[lado]).nombre; }
  const jugadorTxt = (j) => { const x = A.jugador(j); return x ? esc(x.nombre) : "Sin dato del jugador"; };

  function guardadoTxt() {
    return { ok: "✓ Guardado", pend: "Guardando…", offline: "Sin conexión · reintentando", err: "No se pudo guardar", lock: "Perdiste el partido" }[M.guardado] || "";
  }
  function pintarGuardado() {
    const el = document.getElementById("vGuardado");
    if (el) { el.textContent = guardadoTxt(); el.className = "vchip " + M.guardado; }
  }

  function panelEquipo(lado) {
    const nom = esc(nombreEq(lado));
    const bloqueado = M.estado === "FINAL";
    return `<section class="veq">
      <h3>${nom}</h3>
      <button type="button" class="vbtn gol" data-act="gol-${lado}" ${bloqueado ? "disabled" : ""}>⚽ GOL</button>
      <div class="vtarj">
        <button type="button" class="vbtn am" data-act="am-${lado}" ${bloqueado ? "disabled" : ""}>🟨 Amarilla</button>
        <button type="button" class="vbtn ro" data-act="ro-${lado}" ${bloqueado ? "disabled" : ""}>🟥 Roja</button>
        <button type="button" class="vbtn az" data-act="az-${lado}" ${bloqueado ? "disabled" : ""}>🟦 Azul</button>
      </div></section>`;
  }

  function eventos() {
    const lista = [];
    M.goles.forEach((g, i) => lista.push({ k: "g", i, g }));
    M.tarjetas.forEach((t, i) => lista.push({ k: "t", i, g: t }));
    // Los goles primero (en el orden cargado) y debajo las tarjetas.
    return lista.map((x) => {
      const eq = A.equipo(x.g.e);
      const ico = x.k === "g" ? "⚽" : x.g.t === "R" ? "🟥" : x.g.t === "Z" ? "🟦" : "🟨";
      const quien = x.g.j ? jugadorTxt(x.g.j) : (x.k === "g" ? "Gol (sin dato del goleador)" : "Tarjeta (sin dato del jugador)");
      return `<li><span class="ev-i">${ico}</span><span class="ev-t"><b>${quien}</b><small>${esc(eq ? eq.nombre : "")}</small></span>
        ${M.estado === "FINAL" ? "" : `<button type="button" class="vbtn chico borrar" data-act="del-${x.k}-${x.i}" aria-label="Borrar">Borrar</button>`}</li>`;
    }).join("") || `<li class="vacio-ev">Todavía no hay goles ni tarjetas.</li>`;
  }

  /* ---------------- faltas acumuladas (por equipo y por tiempo) ----------------
     Reglamento: a la 5ª falta el árbitro avisa; desde la 6ª, cada falta es tiro libre. */
  function faltasDe(f) {
    const n = (x) => Math.max(0, Math.min(30, parseInt(x, 10) || 0));
    if (Array.isArray(f) && f.length === 4) return { L: [n(f[0]), n(f[1])], V: [n(f[2]), n(f[3])] };
    if (f && f.L && f.V) return { L: [n(f.L[0]), n(f.L[1])], V: [n(f.V[0]), n(f.V[1])] };
    return { L: [0, 0], V: [0, 0] };
  }
  const faltasArr = () => [M.faltas.L[0], M.faltas.L[1], M.faltas.V[0], M.faltas.V[1]];
  function faltasFila(lado, t) {
    const c = M.faltas[lado][t], fin = M.estado === "FINAL";
    let h = "";
    for (let i = 1; i <= 6; i++) {
      const on = c >= i, cls = i === 6 ? "f6" : i === 5 ? "f5" : "";
      h += `<button type="button" class="vfal ${cls}${on ? " on" : ""}" data-act="fal-${lado}-${t}-${i}" ${fin ? "disabled" : ""} aria-label="Falta ${i}">${i === 6 && c > 6 ? "+" + (c - 5) : i}</button>`;
    }
    const extra = c >= 6 ? `<button type="button" class="vfal mas" data-act="fal-${lado}-${t}-mas" ${fin ? "disabled" : ""} aria-label="Una falta más">+1</button>` : "";
    const aviso = c >= 6 ? `<span class="vfal-av tl">Tiro libre</span>` : c === 5 ? `<span class="vfal-av">Aviso del árbitro</span>` : "";
    return `<div class="vfal-fila"><span class="vfal-t">${t === 0 ? "1T" : "2T"}</span><div class="vfal-bx">${h}${extra}</div><b class="vfal-n">${c}</b>${aviso}</div>`;
  }
  function faltasHtml() {
    const eq = (lado) => `<div class="vfal-eq"><h4>${esc(nombreEq(lado))}</h4>${faltasFila(lado, 0)}${faltasFila(lado, 1)}</div>`;
    return `<section class="vcaja"><h3>Faltas</h3><p class="vtxt">Tocá un casillero por cada falta. A la 5ª avisa el árbitro; desde la 6ª es tiro libre. Para corregir, tocá de nuevo la última.</p>${eq("L")}${eq("V")}</section>`;
  }

  function penalesHtml() {
    if (!esPlayoff() || !empate() || M.estado === "FINAL" && M.pl == null) return "";
    const pl = M.pl == null ? 0 : M.pl, pv = M.pv == null ? 0 : M.pv;
    const ctl = (lado, v) => `<div class="vpen"><span>${esc(nombreEq(lado))}</span>
      <div><button type="button" class="vbtn chico" data-act="pen-${lado}--" ${M.estado === "FINAL" ? "disabled" : ""}>−</button><b>${v}</b>
      <button type="button" class="vbtn chico" data-act="pen-${lado}-+" ${M.estado === "FINAL" ? "disabled" : ""}>+</button></div></div>`;
    return `<section class="vcaja"><h3>Penales</h3><p class="vtxt">Quedó empatado y es un playoff. Cargá cómo salieron los penales.</p>${ctl("L", pl)}${ctl("V", pv)}</section>`;
  }

  function pintarPartido() {
    pintarQuien();
    const final = M.estado === "FINAL";
    root.innerHTML = `
      <div class="vbar"><button type="button" class="vbtn chico" data-act="lista">← Inicio</button>
        <span class="vmeta">${esc(M.p.cancha)} · ${esc(M.p.hora)} · ${esc(A.faseLabel(M.p))}</span>
        <span id="vGuardado" class="vchip ${M.guardado}">${guardadoTxt()}</span></div>
      <div class="vmarc">
        <div class="vm-eq">${esc(nombreEq("L"))}</div>
        <div class="vm-n"><b>${cuenta("L")}</b><i>-</i><b>${cuenta("V")}</b></div>
        <div class="vm-eq">${esc(nombreEq("V"))}</div>
      </div>
      ${final ? `<p class="vfinal">Partido finalizado ✓ (${cuenta("L")} - ${cuenta("V")}${M.pl != null && M.pv != null ? `, penales ${M.pl} - ${M.pv}` : ""})</p>` : ""}
      <div class="vpaneles">${panelEquipo("L")}${panelEquipo("V")}</div>
      ${penalesHtml()}
      ${faltasHtml()}
      <section class="vcaja"><h3>⭐ Jugador del partido</h3><p class="vtxt">${M.mvp ? `<b>${jugadorTxt(M.mvp)}</b>` : "Todavía no elegido. Los equipos lo eligen al terminar: anotalo antes de finalizar."}</p>
        <button type="button" class="vbtn" data-act="mvp" ${final ? "disabled" : ""}>${M.mvp ? "Cambiar jugador del partido" : "Elegir jugador del partido"}</button></section>
      <section class="vcaja"><h3>Qué pasó</h3><ul class="vev">${eventos()}</ul></section>
      <div class="vfin">
        ${final
          ? (S.admin ? `<button type="button" class="vbtn grande" data-act="reabrir">Reabrir para corregir</button>`
              : `<p class="vtxt">Tu PIN ya se usó: el partido quedó cerrado. Si hay que corregir algo, avisale a la organización.</p>`) +
            `<button type="button" class="vbtn grande sec" data-act="lista">Volver al inicio</button>`
          : `<button type="button" class="vbtn grande fin" data-act="finalizar">Finalizar partido</button>
             <button type="button" class="vbtn sec" data-act="soltar">Soltar el partido sin finalizar</button>`}
      </div>`;
  }

  /* ---------------- selector de jugador ---------------- */
  function selector(tipo, lado) {
    const eqId = idsDe()[lado];
    const jug = A.jugadores().filter((j) => j.equipo === eqId).sort((a, b) => (a.numero || 99) - (b.numero || 99));
    const titulo = tipo === "gol" ? "¿Quién hizo el gol?" : tipo === "A" ? "¿Quién vio la amarilla?" : tipo === "Z" ? "¿Quién vio la azul?" : "¿Quién vio la roja?";
    const ov = document.createElement("div");
    ov.className = "vov";
    ov.innerHTML = `<div class="vsheet" role="dialog" aria-modal="true"><h3>${titulo}</h3><p class="vtxt">${esc(nombreEq(lado))}</p>
      <div class="vjug">${jug.map((j) => `<button type="button" class="vbtn jug" data-j="${esc(j.id)}">${j.numero != null ? `<b>#${esc(j.numero)}</b>` : ""} ${esc(j.nombre)}</button>`).join("")}
      <button type="button" class="vbtn jug sin" data-j="">${tipo === "gol" ? "Sin dato del goleador / autogol" : "Sin dato del jugador"}</button></div>
      <button type="button" class="vbtn sec" data-cerrar="1">Cancelar</button></div>`;
    ov.addEventListener("click", (ev) => {
      const b = ev.target.closest("button");
      if (ev.target === ov || (b && b.dataset.cerrar)) { ov.remove(); return; }
      if (!b || b.dataset.j === undefined) return;
      const ev2 = { j: b.dataset.j, e: eqId };
      if (tipo === "gol") M.goles.push(ev2); else M.tarjetas.push(Object.assign(ev2, { t: tipo }));
      ov.remove();
      cambio();
    });
    document.body.appendChild(ov);
  }

  function selectorMvp() {
    const ov = document.createElement("div");
    ov.className = "vov";
    const grupo = (lado) => {
      const eqId = idsDe()[lado];
      const jug = A.jugadores().filter((j) => j.equipo === eqId).sort((a, b) => (a.numero || 99) - (b.numero || 99));
      return `<p class="vtxt"><b>${esc(nombreEq(lado))}</b></p><div class="vjug">${jug.map((j) => `<button type="button" class="vbtn jug" data-j="${esc(j.id)}">${j.numero != null ? `<b>#${esc(j.numero)}</b>` : ""} ${esc(j.nombre)}</button>`).join("")}</div>`;
    };
    ov.innerHTML = `<div class="vsheet" role="dialog" aria-modal="true"><h3>Jugador del partido</h3>${grupo("L")}${grupo("V")}
      <div class="vjug"><button type="button" class="vbtn jug sin" data-j="">Sacar / ninguno</button></div>
      <button type="button" class="vbtn sec" data-cerrar="1">Cancelar</button></div>`;
    ov.addEventListener("click", (ev) => {
      const b = ev.target.closest("button");
      if (ev.target === ov || (b && b.dataset.cerrar)) { ov.remove(); return; }
      if (!b || b.dataset.j === undefined) return;
      M.mvp = b.dataset.j;
      ov.remove();
      cambio();
    });
    document.body.appendChild(ov);
  }

  /* ---------------- guardado automático ---------------- */
  function snapshot() {
    const gl = cuenta("L"), gv = cuenta("V");
    const pen = esPlayoff() && gl === gv && M.pl != null && M.pv != null;
    return { id: M.id, estado: M.estado, gl, gv, pl: pen ? M.pl : null, pv: pen ? M.pv : null, goles: M.goles, tarjetas: M.tarjetas, mvp: M.mvp || "", faltas: faltasArr() };
  }

  function guardarBorrador(sent) {
    ls.set("cp_draft_" + M.id, JSON.stringify({ nombre: S.nombre, disp: S.disp, sent, estado: M.estado, goles: M.goles, tarjetas: M.tarjetas, pl: M.pl, pv: M.pv, mvp: M.mvp || "", faltas: faltasArr() }));
  }

  function cambio() { guardarBorrador(false); pintarPartido(); guardarYa(); }

  function guardarYa() { pendiente = true; if (!enviando) bombear(); }

  async function bombear() {
    enviando = true;
    while (pendiente && M) {
      pendiente = false;
      M.guardado = "pend"; pintarGuardado();
      const yo = M;
      try {
        const r = await llamar("guardar", snapshot());
        if (r.ok) { if (M === yo) { M.guardado = pendiente ? "pend" : "ok"; if (!pendiente) guardarBorrador(true); } }
        else if (sesionCaida(r)) { break; }
        else if (r.codigo === "lock") { M.guardado = "lock"; pintarGuardado(); alert(r.error); break; }
        else if (r.codigo === "partido") { M.guardado = "err"; pintarGuardado(); alert(r.error || "Ese PIN es de otro partido."); break; }
        else { M.guardado = "err"; pintarGuardado(); alert(r.error || "No se pudo guardar."); break; }
      } catch (e) {
        if (!M) break;
        M.guardado = "offline"; pintarGuardado();
        pendiente = true; await esperar(4000);
        continue;
      }
      pintarGuardado();
    }
    enviando = false;
  }

  async function esperarGuardado() { while (enviando || pendiente) await esperar(150); }

  /* ---------------- acciones ---------------- */
  function finalizar() {
    const gl = cuenta("L"), gv = cuenta("V");
    if (esPlayoff() && gl === gv && (M.pl == null || M.pv == null || M.pl === M.pv)) {
      if (M.pl == null) { M.pl = 0; M.pv = 0; pintarPartido(); }
      alert("Es un playoff y quedó empatado: cargá los penales, tienen que desempatar.");
      return;
    }
    const pen = esPlayoff() && gl === gv ? ` (penales ${M.pl} - ${M.pv})` : "";
    if (!M.mvp && !confirm("Todavía no elegiste el Jugador del partido.\n\nDespués de finalizar ya no vas a poder cargarlo. ¿Finalizar igual?")) return;
    if (!confirm(`${nombreEq("L")} ${gl} - ${gv} ${nombreEq("V")}${pen}\n\n¿Finalizar el partido? Después podés reabrirlo para corregir.`)) return;
    M.estado = "FINAL"; cambio();
  }

  async function volverALista(soltar) {
    if (M && M.guardado !== "ok") {
      if (!confirm("Hay cambios sin guardar (sin conexión). Si salís ahora se guardan cuando vuelva la señal, pero no cierres esta página. ¿Salir igual?")) return;
    }
    if (soltar && M) { await esperarGuardado(); try { await llamar("liberar", { id: M.id }); } catch (e) { /* se libera solo a los 25 min */ } }
    soltarPantalla();
    await esperarGuardado().catch(() => {});
    M = null;
    await abrirLista();
  }

  root.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-act]");
    if (!b || b.disabled) return;
    const a = b.dataset.act;
    if (a === "abrir") return abrirPartido(b.dataset.id);
    if (!M) return;
    let m;
    if ((m = /^(gol|am|ro|az)-(L|V)$/.exec(a))) return selector(m[1] === "gol" ? "gol" : m[1] === "am" ? "A" : m[1] === "az" ? "Z" : "R", m[2]);
    if ((m = /^del-(g|t)-(\d+)$/.exec(a))) {
      if (!confirm("¿Borrar este evento?")) return;
      (m[1] === "g" ? M.goles : M.tarjetas).splice(Number(m[2]), 1);
      return cambio();
    }
    if ((m = /^pen-(L|V)-(\+|-)$/.exec(a))) {
      if (M.pl == null) { M.pl = 0; M.pv = 0; }
      const k = m[1] === "L" ? "pl" : "pv";
      M[k] = Math.max(0, Math.min(99, M[k] + (m[2] === "+" ? 1 : -1)));
      return cambio();
    }
    if ((m = /^fal-(L|V)-(0|1)-(\d+|mas)$/.exec(a))) {
      const arr = M.faltas[m[1]], t = Number(m[2]);
      if (m[3] === "mas") arr[t] = Math.min(30, arr[t] + 1);
      else { const i = Number(m[3]); arr[t] = (i === 6 && arr[t] > 6) ? arr[t] - 1 : arr[t] === i ? i - 1 : i; }
      return cambio();
    }
    if (a === "mvp") return selectorMvp();
    if (a === "finalizar") return finalizar();
    if (a === "reabrir") { if (!S.admin) return; M.estado = "EN_JUEGO"; return cambio(); }
    if (a === "lista") return volverALista(false);
    if (a === "soltar") { if (confirm("¿Soltar el partido? Otro dispositivo lo va a poder tomar.")) return volverALista(true); }
  });

  document.addEventListener("click", (ev) => {
    const b = ev.target.closest('[data-act="salir"]');
    if (!b) return;
    if (!confirm("¿Salir? Vas a tener que volver a poner el PIN.")) return;
    S.pin = ""; ls.del("cp_pin"); S.partido = ""; ls.del("cp_partido"); S.admin = false; detenerLista(); soltarPantalla(); M = null; pintarQuien(); pantallaLogin();
  });

  /* ---------------- arranque ---------------- */
  async function iniciar() {
    const falta = document.getElementById("falta");
    if (falta && window.LIGA_DATA) falta.style.display = "none";
    pintarQuien();
    if (!D.api) { pantallaSinApi(); return; }
    if (S.pin && S.nombre) {
      try {
        const r = await llamar("login");
        if (r.ok) {
          S.partido = r.partido || ""; S.admin = !!r.admin; S.fechaP = r.fechaPartidos || ""; ls.set("cp_partido", S.partido);
          await abrirLista();
          // Si se refrescó la página en medio de un partido, vuelve directo al partido (lo cargado ya está en la planilla).
          const x = S.remoto[S.partido];
          if (!S.admin && x && x.estado === "EN_JUEGO") await abrirPartido(S.partido);
          return;
        }
        S.pin = ""; ls.del("cp_pin"); S.partido = ""; ls.del("cp_partido"); S.admin = false; S.aviso = r.error || "";
      } catch (e) { S.aviso = "No hay conexión para verificar tu PIN."; }
    }
    pantallaLogin();
  }
  iniciar();
})();
