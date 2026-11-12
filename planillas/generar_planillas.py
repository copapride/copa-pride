# Genera las planillas de juego imprimibles (A4 horizontal, una hoja por partido).
# Uso: python3 generar_planillas.py   (lee ../data.js vía /tmp/sh/data.json; ver LEEME)
import json, os, sys
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, black, white

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
datos = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "/tmp/sh/data.json", encoding="utf-8"))
EQ = {e["id"]: e for e in datos["eq"]}
PL = {}
for j in datos["pl"]:
    PL.setdefault(j["equipo"], []).append((j["id"], j["nombre"]))
# Jugadores que ya jugaron al menos un partido (habilitados para la eliminatoria): su casilla JUGÓ sale en negro.
YA = set()
_f = os.path.join(AQUI, "ya_jugaron.json")
if os.path.exists(_f):
    for _l in json.load(open(_f, encoding="utf-8")).values(): YA.update(_l)

# ---- Eliminatorias ----
# Jugadores que NO jugaron ningún partido de grupos: no pueden jugar playoffs, no van en la planilla (lista de Fer, 11/11).
NO_HABILITADOS = {
    "p82", "p85", "p93",   # Tigres: Cristian Caporaso, Brayan José Reyes, Darío Hernán Toloza
    "p125",                # Impulse: Martín Pérez
    "p68",                 # Fenix: Cristian Chaile
    "p113",                # Crisol: Mariano Buera
    "p121",                # Panteras KFC: Rodrigo Juan
    "p21", "p23",          # Dogos: Miguel Daolio, Nicolás Crusco
    "p325", "p328",        # Cruzados: Milton Rivas, Alberto Ozuna
    "p300", "p344",        # FGR: Luis Guantay, Brian Oliva
}
# Suspendidos (salen en la planilla tachados, con la leyenda). Sale de "suspendidos" en data.js.
SUSP = {x["j"] for x in datos.get("susp", [])}
PLAYOFF = False   # en playoffs no va la columna JUGÓ y se sacan los no habilitados

ORO = HexColor("#C9A227"); NEGRO = HexColor("#111111"); GRIS = HexColor("#9a9a9a"); GRISCLARO = HexColor("#f1f1f1")
W, H = landscape(A4)
M = 8 * mm
DIAS = {"2026-10-24": "Sáb 24/10", "2026-10-31": "Sáb 31/10", "2026-11-14": "Sáb 14/11", "2026-11-28": "Sáb 28/11", "2026-12-12": "Sáb 12/12"}
FECHAS = {"2026-10-24": "Fecha 2", "2026-10-31": "Fecha 3", "2026-11-14": "Cuartos de final", "2026-11-28": "Semifinales", "2026-12-12": "Final y 3er puesto"}

def nombre_equipo(t):
    return EQ[t]["nombre"] if t in EQ else t

def box(c, x, y, s=4.2 * mm):
    c.setLineWidth(0.7); c.setStrokeColor(black); c.rect(x, y, s, s, fill=0)

def tabla(c, x0, ytop, ancho, eid, filas=16):
    """Dibuja la tabla de un equipo. ytop = borde superior del título."""
    nombre = nombre_equipo(eid)
    # título del equipo
    c.setFillColor(GRISCLARO); c.setStrokeColor(black); c.setLineWidth(0.9); c.rect(x0, ytop - 9 * mm, ancho, 9 * mm, fill=1, stroke=1)
    c.setFillColor(black); c.setFont("Helvetica-Bold", 14)
    esc = os.path.join(RAIZ, EQ[eid]["escudo"]) if eid in EQ and EQ[eid].get("escudo") else ""
    tx = x0 + 3 * mm
    if esc and os.path.exists(esc):
        try:
            c.drawImage(esc, x0 + 1.5 * mm, ytop - 8.5 * mm, 8 * mm, 8 * mm, preserveAspectRatio=True, mask="auto"); tx = x0 + 11 * mm
        except Exception:
            pass
    c.drawString(tx, ytop - 6.3 * mm, nombre.upper())
    # faltas: arriba, en la barra del equipo (donde las buscan los veedores)
    fx = x0 + ancho - 68 * mm
    c.setFillColor(white); c.setLineWidth(0.8); c.rect(fx, ytop - 7.8 * mm, 66.5 * mm, 6.6 * mm, fill=1, stroke=1)
    c.setFillColor(black); c.setFont("Helvetica-Bold", 8.5)
    c.drawString(fx + 1.5 * mm, ytop - 5.6 * mm, "FALTAS")
    c.setFont("Helvetica-Bold", 8); c.drawString(fx + 15 * mm, ytop - 5.6 * mm, "1T")
    c.setLineWidth(0.6); c.line(fx + 20 * mm, ytop - 6.3 * mm, fx + 39 * mm, ytop - 6.3 * mm)
    c.drawString(fx + 42 * mm, ytop - 5.6 * mm, "2T")
    c.line(fx + 47 * mm, ytop - 6.3 * mm, fx + 65.5 * mm, ytop - 6.3 * mm)
    # columnas
    cols = [("Nº", 9), ("Nombre y apellido", 58), ("JUGÓ", 11), ("GOLES (palitos)", 21), ("AMAR.", 11), ("ROJA", 11), ("AZUL", 11)]
    if PLAYOFF: cols = [("Nº", 9), ("Nombre y apellido", 66), ("GOLES (palitos)", 24), ("AMAR.", 11), ("ROJA", 11), ("AZUL", 11)]
    iJ = None if PLAYOFF else 2          # columna JUGÓ
    iG = 2 if PLAYOFF else 3             # columna GOLES
    tot = sum(w for _, w in cols); esc_f = ancho / mm / tot
    xs = [x0]
    for _, w in cols: xs.append(xs[-1] + w * esc_f * mm)
    yh = ytop - 9 * mm
    c.setFillColor(GRISCLARO); c.rect(x0, yh - 6.5 * mm, ancho, 6.5 * mm, fill=1, stroke=0)
    c.setFillColor(black); c.setFont("Helvetica-Bold", 7)
    for i, (t, _) in enumerate(cols):
        cx = (xs[i] + xs[i + 1]) / 2
        if i == 1: c.drawString(xs[i] + 1.5 * mm, yh - 4.3 * mm, t)
        else: c.drawCentredString(cx, yh - 4.3 * mm, t)
    # filas
    alto = 6.35 * mm
    jug = [x for x in PL.get(eid, []) if not (PLAYOFF and x[0] in NO_HABILITADOS)]
    y = yh - 6.5 * mm
    for r in range(filas):
        yb = y - alto
        c.setLineWidth(0.4); c.setStrokeColor(GRIS); c.line(x0, yb, x0 + ancho, yb)
        pid, nom = jug[r] if r < len(jug) else ("", "")
        c.setFillColor(black); c.setFont("Helvetica", 9 if len(nom) < 26 else 7.5)
        s = 4.2 * mm
        cy = yb + (alto - s) / 2
        if pid in SUSP:
            # suspendido: nombre tachado, sin casilleros, con la leyenda
            c.setFillColor(GRISCLARO); c.rect(x0, yb, ancho, alto, fill=1, stroke=0)
            c.setFillColor(black); c.drawString(xs[1] + 1.5 * mm, yb + 2.2 * mm, nom)
            tw = c.stringWidth(nom, c._fontname, c._fontsize)
            c.setStrokeColor(black); c.setLineWidth(0.9); c.line(xs[1] + 1 * mm, yb + 3.1 * mm, xs[1] + 2 * mm + tw, yb + 3.1 * mm)
            c.setFont("Helvetica-Bold", 8.5); c.drawCentredString((xs[iG] + xs[-1]) / 2, yb + 2.2 * mm, "SUSPENDIDO · NO PUEDE JUGAR")
            y = yb; continue
        if nom: c.drawString(xs[1] + 1.5 * mm, yb + 2.2 * mm, nom)
        if iJ is not None:
            if pid in YA:
                c.setFillColor(black); c.setLineWidth(0.7); c.setStrokeColor(black); c.rect((xs[2] + xs[3]) / 2 - s / 2, cy, s, s, fill=1, stroke=1); c.setFillColor(black)
            else:
                box(c, (xs[2] + xs[3]) / 2 - s / 2, cy)
        bw = (xs[iG + 1] - xs[iG]) - 4 * mm
        c.setLineWidth(0.7); c.setStrokeColor(black); c.rect(xs[iG] + 2 * mm, yb + 0.9 * mm, bw, alto - 1.8 * mm, fill=0)
        for i in (iG + 1, iG + 2, iG + 3): box(c, (xs[i] + xs[i + 1]) / 2 - s / 2, cy)
        y = yb
    # líneas verticales
    c.setStrokeColor(GRIS); c.setLineWidth(0.4)
    top = yh - 6.5 * mm
    for xv in xs: c.line(xv, top, xv, y)
    c.setStrokeColor(black); c.setLineWidth(0.9); c.rect(x0, y, ancho, ytop - 9 * mm - y - 0, fill=0)
    # goles en contra
    c.setFont("Helvetica", 7.5); c.setFillColor(black)
    c.drawString(x0 + 1 * mm, y - 4.2 * mm, "Goles en contra a favor de este equipo:")
    for k in range(3): box(c, x0 + 63 * mm + k * 6 * mm, y - 5 * mm, 4 * mm)
    return y

def hoja(c, p):
    local, visit = p["local"], p["visitante"]
    # cabecera (sin rellenos: se imprime en blanco y negro)
    c.drawImage(os.path.join(AQUI, "logo-copa-bn.png"), M, H - 23 * mm, 26 * mm, 22.8 * mm, preserveAspectRatio=True, mask="auto")
    c.setFillColor(black); c.setFont("Helvetica-Bold", 20); c.drawString(M + 32 * mm, H - 12 * mm, "PLANILLA DE JUEGO")
    c.setFont("Helvetica", 10)
    c.drawString(M + 32 * mm, H - 18.5 * mm, "Copa Pride 2026 · By Liga Pride · Juntxs por el deporte")
    c.setStrokeColor(black); c.setLineWidth(1.6); c.line(M, H - 24 * mm, W - M, H - 24 * mm)
    # datos del partido (derecha)
    fecha = FECHAS.get(p["fecha"], p["fase"]); dia = DIAS.get(p["fecha"], p["fecha"])
    c.setFillColor(black); c.setFont("Helvetica-Bold", 11)
    zona = ("Zona " + p["zona"] + " · ") if p.get("zona") else ""
    if p.get("cruce"): zona, fecha = "", p["cruce"]
    c.drawRightString(W - M, H - 12 * mm, f"{zona}{fecha} · {dia} · {p['hora'] or 'Horario a definir'} hs · {p['cancha'] or 'Cancha a definir'}".replace("a definir hs", "a definir"))
    c.setFont("Helvetica-Bold", 10); c.drawRightString(W - M - 62 * mm, H - 20.5 * mm, "Veedor/a:")
    c.setStrokeColor(black); c.setLineWidth(0.7); c.line(W - M - 60 * mm, H - 21 * mm, W - M, H - 21 * mm)
    vn = p.get("veedor") or ""; ve = nombre_equipo(p["veedorEq"]) if p.get("veedorEq") else ""
    if vn or ve:
        c.setFont("Helvetica", 10); c.drawString(W - M - 59 * mm, H - 20.2 * mm, (vn + (f" ({ve})" if ve else "")).strip())
    # recuadro de resultado final: arriba, entre la cabecera y las listas
    bh = 15 * mm
    yr = H - 26 * mm
    c.setFillColor(GRISCLARO); c.setStrokeColor(black); c.setLineWidth(1.2); c.rect(M, yr - bh, W - 2 * M, bh, fill=1, stroke=1)
    c.setFillColor(black); c.setFont("Helvetica-Bold", 8.5)
    c.drawString(M + 3 * mm, yr - 8.8 * mm, "RESULTADO FINAL")
    c.setFont("Helvetica-Bold", 13)
    nl, nv = nombre_equipo(local).upper(), nombre_equipo(visit).upper()
    cx = W / 2
    c.drawRightString(cx - 24 * mm, yr - 9.4 * mm, nl)
    c.drawString(cx + 24 * mm, yr - 9.4 * mm, nv)
    c.setFillColor(white); c.setLineWidth(1.4)
    c.rect(cx - 20 * mm, yr - bh + 2 * mm, 16 * mm, 11 * mm, fill=1, stroke=1)
    c.rect(cx + 4 * mm, yr - bh + 2 * mm, 16 * mm, 11 * mm, fill=1, stroke=1)
    c.setFillColor(black); c.setFont("Helvetica-Bold", 20); c.drawCentredString(cx, yr - 9.6 * mm, "–")
    # tablas
    gap = 6 * mm; ancho = (W - 2 * M - gap) / 2
    ytop = yr - bh - 3 * mm
    y1 = tabla(c, M, ytop, ancho, local); y2 = tabla(c, M + ancho + gap, ytop, ancho, visit)
    ybase = min(y1, y2) - 7 * mm
    bh = 0
    # pie: firmas
    yf = ybase - bh - 3 * mm
    c.setFillColor(black); c.setFont("Helvetica-Bold", 8)
    campos = ["Jugador del partido", "Firma y aclaración capitán " + nombre_equipo(local), "Firma y aclaración capitán " + nombre_equipo(visit), "Firma árbitro", "Veedor (nombre y equipo)"]
    cw = (W - 2 * M) / len(campos)
    for i, t in enumerate(campos):
        x = M + i * cw
        c.setFont("Helvetica-Bold", 6.8 if len(t) > 24 else 7.5); c.drawString(x + 1 * mm, yf - 3 * mm, t[:48])
        c.setStrokeColor(GRIS); c.setLineWidth(0.6); c.line(x + 1 * mm, yf - 16 * mm, x + cw - 3 * mm, yf - 16 * mm)
    c.setFont("Helvetica-Bold", 7.5); c.drawString(M + 1 * mm, yf - 23.5 * mm, "Incidencias:")
    c.line(M + 18 * mm, yf - 24 * mm, W - M, yf - 24 * mm)
    # instrucción
    c.setStrokeColor(black); c.setLineWidth(1.2); c.line(M, 8 * mm, W - M, 8 * mm)
    c.setFillColor(black); c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(W / 2, 3.8 * mm, ("Si termina empatado se define por penales: anotá el resultado de la serie en Incidencias. " if PLAYOFF else "JUGÓ en negro = ya jugó antes. ") + "GOLES: palitos (la banda cierra el 5). TARJETAS: tildá el casillero.")

def pdf(nombre, partidos):
    c = canvas.Canvas(os.path.join(AQUI, nombre), pagesize=landscape(A4))
    c.setTitle(nombre.replace(".pdf", "")); c.setAuthor("Liga Pride")
    for p in partidos:
        hoja(c, p); c.showPage()
    c.save(); print(nombre, len(partidos), "hojas")

if __name__ == "__main__":
    # Cuartos 14/11: equipos resueltos (ranking final de zonas, criterio Winner).
    PLAYOFF = True
    CRUCES = {"m25": ("e1", "e16"), "m27": ("e13", "e8"), "m28": ("e5", "e12"), "m26": ("e9", "e6"),
              "m29": ("e14", "e7"), "m31": ("e2", "e3"), "m32": ("e10", "e4"), "m30": ("e15", "e11")}
    NOM = {c["partidoId"]: c["nombre"] for c in datos.get("cruces", [])}
    orden = ["m25", "m27", "m28", "m26", "m29", "m31", "m32", "m30"]   # Oro 1-4, Plata 1-4
    P = {p["id"]: p for p in datos["pa"]}
    lista = []
    for m in orden:
        p = dict(P[m]); p["local"], p["visitante"] = CRUCES[m]; p["cruce"] = NOM.get(m, p["fase"]); p.pop("zona", None)
        lista.append(p)
    pdf("Planillas_Cuartos_14-11.pdf", lista)
