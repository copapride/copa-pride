# CUADRO DE COPAS — imagen para el grupo de referentes (Copa Oro y Copa Plata)
# Genera Cuadro_Copa_Oro_2026.png y Cuadro_Copa_Plata_2026.png (3200x2000) con el cuadro tal como
# está en la página (#/copas): logo de la Copa, título grande dorado/plateado, cuartos -> semis ->
# final -> campeón con líneas conectoras, 3er puesto abajo y relegado, pie con "Juntxs por el deporte".
# Se actualiza sola con los datos de data.js (equipos clasificados, resultados, días y canchas).
#
# Uso (desde la carpeta del repo):  python3 herramientas/cuadro_copas.py [carpeta_salida]
# Necesita Python con playwright y Chromium.
import asyncio, sys, os, subprocess, time
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(RAIZ, "herramientas", "salida")
os.makedirs(SALIDA, exist_ok=True)
from playwright.async_api import async_playwright
CSS = r"""
:root{--display:'Inter Display','Inter',sans-serif}
html,body{margin:0;background:#070605}
body>*:not(#poster){display:none!important}
#poster{width:1600px;height:1000px;box-sizing:border-box;padding:46px 56px 40px;position:relative;overflow:hidden;display:flex!important;flex-direction:column;gap:22px;
  background:radial-gradient(70% 60% at 85% 0%,rgba(var(--glow),.20),transparent 60%),radial-gradient(60% 50% at 0% 100%,rgba(var(--glow),.10),transparent 60%),#0a0908;color:#f5f2ea;font-family:'Inter',sans-serif}
#poster::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 39px,rgba(255,255,255,.025) 39px 40px);pointer-events:none}
#poster .franja{position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(180deg,#e40303,#ff8c00,#ffed00,#008026,#004dff,#750787)}
.p-cab{display:flex;align-items:center;gap:30px;position:relative;z-index:1}
.p-cab img{height:118px;width:auto}
.p-tit{display:flex;flex-direction:column;gap:6px;border-left:2px solid var(--oro);padding-left:30px}
.p-k{font-size:15px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:var(--oro-t)}
.p-h{font-family:'Inter Display';font-weight:900;font-size:76px;line-height:.9;letter-spacing:-.01em;text-transform:uppercase;margin:0;
  background:var(--oro-grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.p-s{font-size:19px;color:#cfc9bc}
.p-s b{color:#f5f2ea}
#poster .bracket{flex:1;overflow:visible!important;padding:6px 0 0;gap:44px;position:relative;z-index:1}
#poster .rcol{flex:1 1 0!important}
#poster .rcol>h3{font-family:'Inter Display';font-weight:900;font-size:22px;letter-spacing:.08em;margin-bottom:14px;padding-bottom:10px}
#poster .celda.cruce{background:#15130f}
#poster .fe .n{font-size:17px}
#poster .res-top{font-size:12px}
#poster .veedor{font-size:12px}
#poster .campeon h3{font-family:'Inter Display';font-weight:900;font-size:30px}
#poster svg.conect path{stroke-width:2.5;opacity:1}
.p-pie{display:flex;align-items:center;justify-content:space-between;gap:20px;position:relative;z-index:1;border-top:1px solid #2d2924;padding-top:16px}
.p-pie p{margin:0;font-size:15px;color:#a8a398}
.p-pie p b{color:var(--oro-t)}
.p-pie .der{display:flex;align-items:center;gap:16px}
.p-pie .lema{font-family:'Inter Display';font-weight:800;font-size:20px;letter-spacing:.04em;color:var(--oro-t);text-transform:uppercase}
.p-pie img{height:40px}
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for idx, nombre, glow, sub in [(0,"oro","200,147,42","Puestos <b>1 al 8</b> del ranking general"),(1,"plata","190,196,204","Puestos <b>9 al 16</b> del ranking general")]:
            pg = await b.new_page(viewport={"width":1600,"height":1000}, device_scale_factor=2)
            if os.environ.get("ESTADO"):  # JSON de ?accion=estado guardado en un archivo
                _est = open(os.environ["ESTADO"]).read()
                await pg.route("**/script.google.com/**", lambda r: r.fulfill(status=200, content_type="application/json", body=_est))
            else:
                await pg.route("**/script.google.com/**", lambda r: r.abort())
            await pg.route("**/fonts.googleapis.com/**", lambda r: r.abort())
            await pg.goto("http://localhost:8765/index.html#/copas")
            await pg.wait_for_timeout(2500 if os.environ.get("ESTADO") else 500)
            await pg.evaluate("document.getElementById('intro')&&document.getElementById('intro').remove()")
            await pg.click(f"button[data-copa='{idx}']"); await pg.wait_for_timeout(300)
            await pg.add_style_tag(content=CSS)
            await pg.evaluate("""([nombre, glow, sub]) => {
              const v = document.querySelector('.copas-v'); const br = v.querySelector('.bracket');
              const P = document.createElement('div'); P.id = 'poster'; if (v.classList.contains('tono-plata')) P.className = 'tono-plata';
              P.style.setProperty('--glow', glow);
              P.innerHTML = `<i class="franja"></i><header class="p-cab"><img src="img/logo-copa.png" alt=""><div class="p-tit"><span class="p-k">Copa Pride 2026 · 3ª edición · Eliminatorias</span><h1 class="p-h">Copa ${nombre === 'oro' ? 'Oro' : 'Plata'}</h1><span class="p-s">${sub} · Cuartos, semis, final y 3er puesto</span></div></header>`;
              P.appendChild(br);
              const pie = document.createElement('footer'); pie.className = 'p-pie';
              pie.innerHTML = `<p><b>Cuartos: sábado 14/11.</b> Canchas a definir. Semis 28/11 · Final y 3er puesto 12/12.</p><div class="der"><span class="lema">Juntxs por el deporte</span><img src="img/liga-pride.png" alt=""></div>`;
              P.appendChild(pie); document.body.appendChild(P);
              window.dispatchEvent(new Event('resize'));
            }""", [nombre, glow, sub])
            await pg.wait_for_timeout(700)
            await (await pg.query_selector("#poster")).screenshot(path=os.path.join(SALIDA, f"Cuadro_Copa_{nombre.capitalize()}_2026.png"))
        await b.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", "8765"], cwd=RAIZ, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    asyncio.run(main())
    print("Listo:", SALIDA)
finally:
    srv.terminate()
