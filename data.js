/* =====================================================================
   DATOS DE LA COPA PRIDE
   Este es el ÚNICO archivo que tenés que editar para cargar datos.
   Ahora tiene datos de EJEMPLO: reemplazalos por los reales.
   Reglas: cada cosa va entre llaves { }, separadas por coma, y los
   textos van entre comillas "así". Si te olvidás una coma, la página
   no carga: revisá la línea anterior al error.
   ===================================================================== */

window.LIGA_DATA = {

  // true = aparece un cartel de "datos de ejemplo". Poné false con datos reales.
  ejemplo: false,

  nombre: "Copa Pride",
  edicion: "2026",
  numeroEdicion: "3ª edición",
  subtitulo: "By Liga Pride · Fútbol 5 LGBT+",
  lema: "Juntxs por el deporte",
  // Texto de horario que aparece arriba en Inicio y Fixture.
  horario: "Sábados de 14 a 17 hs",
  // Cuántos jugadores puede sumar cada equipo una vez empezada la Copa.
  // Un jugador agregado lleva agregado: "AAAA-MM-DD" (la fecha en que se sumó).
  cupoAgregados: 2,

  // Dirección web de los resultados en vivo (Google Apps Script).
  // Se completa una sola vez, siguiendo INSTALAR-EN-VIVO.txt. Vacío = sin en vivo.
  api: "https://script.google.com/macros/s/AKfycbzHGG3stmLzJkFKf2Q8w_EZhjxt941q64by9HBj8hkLHTbz23nS8Y7wKWkBCHG0XKZqvw/exec",
  // Cada cuántos segundos se actualiza la página sola (solo si hay api).
  refrescoSeg: 10,

  // La sede es siempre la misma.
  sede: { nombre: "Santiago del Estero 1253", direccion: "CABA", canchas: ["Cancha 1", "Cancha 2", "Cancha 3"] },

  // A qué copa va cada puesto de la zona (se pinta en la tabla de Zonas).
  // tono: "oro", "plata" o "bronce".
  clasificacion: [
    { copa: "Copa Oro",   desde: 1, hasta: 2, tono: "oro" },
    { copa: "Copa Plata", desde: 3, hasta: 4, tono: "plata" }
  ],

  // ---------------------------------------------------------------
  // EQUIPOS: 16 equipos en 4 zonas (A, B, C, D) de 4.
  // cabeza: 1 a 4 marca a los cabezas de serie (1 = el primero). Se muestra con una estrella.
  // id: código corto y único (e1, e2...). escudo: ruta a la imagen
  // (ej: "img/escudos/fenix.png"). Si no hay, salen las iniciales.
  // ---------------------------------------------------------------
  equipos: [
    // Zona A
    { id: "e1", nombre: "Aguará Guazú", zona: "A", escudo: "img/escudos/aguara.png", cabeza: 1, colores: ["#26c6e8", "#0a3d52"] },
    { id: "e2", nombre: "Panteras KFC", zona: "A", escudo: "img/escudos/panteras-kfc.png", colores: ["#1a1408", "#b07d16"] },
    { id: "e6", nombre: "Crisol", zona: "A", escudo: "img/escudos/crisol.png", colores: ["#e8590c", "#4a1a0a"] },
    { id: "e7", nombre: "Escorpiones", zona: "A", escudo: "img/escudos/escorpiones.png", colores: ["#e0141a", "#1a0405"] },
    // Zona B
    { id: "e5", nombre: "Dogos F5", zona: "B", escudo: "img/escudos/e2.png", cabeza: 2, colores: ["#4fb3ff", "#0f3a7a"] },
    { id: "e3", nombre: "FGR", zona: "B", escudo: "img/escudos/e1.png", colores: ["#e86aa5", "#3a86ff"] },
    { id: "e12", nombre: "Grindr", zona: "B", escudo: "img/escudos/grindr.png", colores: ["#ff4d4d", "#ffb000", "#34c759", "#2d9cff", "#9b59f6"] },
    { id: "e14", nombre: "Fenix", zona: "B", escudo: "img/escudos/fenix.png", colores: ["#ff7a00", "#111111"] },
    // Zona C
    { id: "e9", nombre: "Red Aguará", zona: "C", escudo: "img/escudos/red.png", cabeza: 3, colores: ["#e32017", "#ffb700"] },
    { id: "e10", nombre: "Yacares BA", zona: "C", escudo: "img/escudos/yacares.png", colores: ["#0e9aa7", "#05181a"] },
    { id: "e11", nombre: "Huemules", zona: "C", escudo: "img/escudos/huemules.png", colores: ["#6b1d12", "#b8651b"] },
    { id: "e8", nombre: "Impulse", zona: "C", escudo: "img/escudos/impulse.png", colores: ["#ff4d4d", "#ffb000", "#34c759", "#2d9cff", "#9b59f6"] },
    // Zona D
    { id: "e13", nombre: "Panteras FC", zona: "D", escudo: "img/escudos/panteras.png", cabeza: 4, colores: ["#0d0d0d", "#e2b13c"] },
    { id: "e4", nombre: "Cruzados", zona: "D", escudo: "img/escudos/cruzados.png", colores: ["#1e63d6", "#0b2a66"] },
    { id: "e15", nombre: "Tigres", zona: "D", escudo: "img/escudos/tigres.png", colores: ["#f28a00", "#0e0e0e"] },
    { id: "e16", nombre: "Apex Aguará", zona: "D", escudo: "img/escudos/apex-aguara.png", colores: ["#ff5fa8", "#7a1a52"] }
  ],

  // ---------------------------------------------------------------
  // JUGADORES
  // foto: ruta (ej: "img/jugadores/lucas.jpg"). Opcional: sin foto
  // se muestran las iniciales. Cargá fotos solo de quien lo autorizó.
  // Los veedores eligen al goleador de esta lista, así que cargá
  // a todos los jugadores de cada equipo.
  // ---------------------------------------------------------------
  jugadores: [
    { id: "p300", nombre: "Luis Alberto Guantay", equipo: "e3", foto: "" },
    { id: "p301", nombre: "Elias Ezequiel Ale", equipo: "e3", foto: "" },
    { id: "p302", nombre: "Rolando Zena", equipo: "e3", foto: "" },
    { id: "p303", nombre: "Roberto Ricardo Rojas", equipo: "e3", foto: "" },
    { id: "p304", nombre: "Alberto Vallejos", equipo: "e3", foto: "" },
    { id: "p305", nombre: "Francisco Hereñu", equipo: "e3", foto: "" },
    { id: "p306", nombre: "Eduardo Jose Flores", equipo: "e3", foto: "" },
    { id: "p307", nombre: "Sebastian Alejandro Alvarenga", equipo: "e3", foto: "" },
    { id: "p308", nombre: "Fabian Aranda", equipo: "e3", foto: "" },
    { id: "p309", nombre: "Ruben Dario Ledezma", equipo: "e3", foto: "" },
    { id: "p310", nombre: "Jimmy Torres Arbieto", equipo: "e3", foto: "" },
    { id: "p311", nombre: "Juan Cruz Peñalva", equipo: "e3", foto: "" },
    { id: "p312", nombre: "Hernan Cabello", equipo: "e3", foto: "" },
    { id: "p320", nombre: "Moisés Sanabria Estigarribia", equipo: "e4", foto: "" },
    { id: "p321", nombre: "Marcos Torres", equipo: "e4", foto: "" },
    { id: "p322", nombre: "Derlis Rodas", equipo: "e4", foto: "" },
    { id: "p323", nombre: "Sergio Roldan", equipo: "e4", foto: "" },
    { id: "p324", nombre: "Javier Estigarribia", equipo: "e4", foto: "" },
    { id: "p325", nombre: "Milton Rivas", equipo: "e4", foto: "" },
    { id: "p326", nombre: "German Medina", equipo: "e4", foto: "" },
    { id: "p327", nombre: "Diego Ozuna", equipo: "e4", foto: "" },
    { id: "p328", nombre: "Alberto Ozuna", equipo: "e4", foto: "" },
    { id: "p329", nombre: "Oscar Maza", equipo: "e4", foto: "" },
    { id: "p331", nombre: "Samuel Suarez", equipo: "e4", foto: "" },
    { id: "p332", nombre: "Gonzalo Alvarau", equipo: "e4", foto: "" },
    { id: "p2", nombre: "Juan Pablo Duarte", equipo: "e1", foto: "" },
    { id: "p3", nombre: "Alfredo Segovia", equipo: "e1", foto: "" },
    { id: "p4", nombre: "Alejandro del Fallo", equipo: "e1", foto: "" },
    { id: "p5", nombre: "Cristian Pare", equipo: "e1", foto: "" },
    { id: "p6", nombre: "Carlos Guzmán", equipo: "e2", foto: "" },
    { id: "p7", nombre: "Jose Sforza", equipo: "e2", foto: "" },
    { id: "p8", nombre: "Fernando Arámbulo", equipo: "e2", foto: "" },
    { id: "p9", nombre: "Nicolas Álvarez", equipo: "e2", foto: "" },
    { id: "p10", nombre: "Sebastián Salinas", equipo: "e2", foto: "" },
    { id: "p21", nombre: "Miguel Daolio", equipo: "e5", foto: "" },
    { id: "p22", nombre: "Martin Andres Balay", equipo: "e5", foto: "" },
    { id: "p23", nombre: "Nicolas Crusco", equipo: "e5", foto: "" },
    { id: "p24", nombre: "Emanuel Gigena", equipo: "e5", foto: "" },
    { id: "p25", nombre: "Santiago Agustin Monzon", equipo: "e5", foto: "" },
    { id: "p26", nombre: "Julio Cesar Ebel", equipo: "e6", foto: "" },
    { id: "p27", nombre: "Federico Belluscio", equipo: "e6", foto: "" },
    { id: "p28", nombre: "Joel Galeanos", equipo: "e6", foto: "" },
    { id: "p29", nombre: "Adolfo Ariel Valdez", equipo: "e6", foto: "" },
    { id: "p30", nombre: "Jonatan Echeverria", equipo: "e6", foto: "" },
    { id: "p31", nombre: "Fernando Trilles", equipo: "e7", foto: "img/jugadores/p31.webp" },
    { id: "p32", nombre: "Ivan Sanchez", equipo: "e7", foto: "" },
    { id: "p33", nombre: "Angel Cruceño", equipo: "e7", foto: "" },
    { id: "p34", nombre: "Diego Carlo", equipo: "e7", foto: "" },
    { id: "p35", nombre: "Franco Antunez", equipo: "e7", foto: "" },
    { id: "p36", nombre: "Agustin Jose Balladares", equipo: "e8", foto: "" },
    { id: "p37", nombre: "Enzo Ponce", equipo: "e8", foto: "" },
    { id: "p38", nombre: "Alfredo Jose Rivera Viloria", equipo: "e8", foto: "" },
    { id: "p39", nombre: "Nicolas Cortez", equipo: "e8", foto: "" },
    { id: "p40", nombre: "Gabriel Eduardo Baez", equipo: "e8", foto: "" },
    { id: "p41", nombre: "Franco Bruno Di Benedetto", equipo: "e9", foto: "" },
    { id: "p42", nombre: "Matías Hernán Saavedra", equipo: "e9", foto: "" },
    { id: "p43", nombre: "Josias Leonel Sotelo", equipo: "e9", foto: "" },
    { id: "p44", nombre: "Federico Gallardo", equipo: "e9", foto: "" },
    { id: "p45", nombre: "Mario Rene Gutierrez", equipo: "e9", foto: "" },
    { id: "p46", nombre: "Daniel Chalén", equipo: "e10", foto: "" },
    { id: "p47", nombre: "Nano Retamozo", equipo: "e10", foto: "" },
    { id: "p48", nombre: "Dieguis Sanchez", equipo: "e10", foto: "" },
    { id: "p49", nombre: "Cristian Rojas", equipo: "e10", foto: "" },
    { id: "p50", nombre: "Felipe Pereyra", equipo: "e10", foto: "" },
    { id: "p51", nombre: "Matias Scavone", equipo: "e11", foto: "" },
    { id: "p52", nombre: "Juan Pablo Artin", equipo: "e11", foto: "" },
    { id: "p53", nombre: "Santiago Morrone", equipo: "e11", foto: "" },
    { id: "p54", nombre: "Dario Coronel", equipo: "e11", foto: "" },
    { id: "p55", nombre: "Rodrigo Gonzalez", equipo: "e11", foto: "" },
    { id: "p56", nombre: "Gustavo Alexis Reyes", equipo: "e12", foto: "" },
    { id: "p57", nombre: "Luciano Nicolas Mayorga", equipo: "e12", foto: "" },
    { id: "p58", nombre: "Lucas Salazar", equipo: "e12", foto: "" },
    { id: "p59", nombre: "Victorio Molina", equipo: "e12", foto: "" },
    { id: "p60", nombre: "Leandro Martin", equipo: "e12", foto: "" },
    { id: "p61", nombre: "Agustín Bahl", equipo: "e13", foto: "" },
    { id: "p62", nombre: "Federico Enzo Duran", equipo: "e13", foto: "" },
    { id: "p63", nombre: "Alessandro Ramos", equipo: "e13", foto: "" },
    { id: "p64", nombre: "Fabián Torres", equipo: "e13", foto: "" },
    { id: "p65", nombre: "Alex de los Santos", equipo: "e13", foto: "" },
    { id: "p66", nombre: "Brian Barrera", equipo: "e14", foto: "" },
    { id: "p67", nombre: "Nazareno Paredes", equipo: "e14", foto: "" },
    { id: "p68", nombre: "Cristian Chaile", equipo: "e14", foto: "" },
    { id: "p69", nombre: "Junior Villalba", equipo: "e14", foto: "" },
    { id: "p70", nombre: "Agustin Ramirez", equipo: "e14", foto: "" },
    { id: "p81", nombre: "Emiliano Baez", equipo: "e15", foto: "" },
    { id: "p82", nombre: "Cristian Sebastian Caporaso", equipo: "e15", foto: "" },
    { id: "p83", nombre: "Miguel Mariano Cejas", equipo: "e15", foto: "" },
    { id: "p84", nombre: "Sergio Gonzalez Miñaro", equipo: "e15", foto: "" },
    { id: "p85", nombre: "Brayan Jose Reyes Martinez", equipo: "e15", foto: "" },
    { id: "p86", nombre: "Juan Gasco Gonzalez", equipo: "e15", foto: "" },
    { id: "p87", nombre: "Henrry Brayan Cuellar Cariño", equipo: "e15", foto: "" },
    { id: "p88", nombre: "Jorge Rafael Arias", equipo: "e15", foto: "" },
    { id: "p89", nombre: "Pablo Lihuel Osorio", equipo: "e15", foto: "" },
    { id: "p90", nombre: "Jonatan Alejandro Auver", equipo: "e15", foto: "" },
    { id: "p91", nombre: "Yoel Mendoza Leal", equipo: "e15", foto: "" },
    { id: "p92", nombre: "Nahuel Santiago Baresi", equipo: "e15", foto: "" },
    { id: "p93", nombre: "Dario Hernan Toloza", equipo: "e15", foto: "" },
    { id: "p94", nombre: "Walter Carricondo", equipo: "e15", foto: "" },
    { id: "p95", nombre: "Lucas Sosa", equipo: "e5", foto: "" },
    { id: "p96", nombre: "Miguel Villan", equipo: "e5", foto: "" },
    { id: "p97", nombre: "Hernan Varela", equipo: "e5", foto: "" },
    { id: "p98", nombre: "Jesus Caceres", equipo: "e5", foto: "" },
    { id: "p99", nombre: "David Alexis Noval", equipo: "e5", foto: "" },
    { id: "p100", nombre: "Amadeo Benjamin Segundo", equipo: "e5", foto: "" },
    { id: "p340", nombre: "Juan Farinella", equipo: "e5", foto: "" },
    { id: "p101", nombre: "Erik Rodriguez", equipo: "e10", foto: "" },
    { id: "p102", nombre: "Nicolás Quiroga", equipo: "e10", foto: "" },
    { id: "p103", nombre: "Alonso Machin", equipo: "e10", foto: "" },
    { id: "p104", nombre: "Alexander Monteagudo", equipo: "e10", foto: "" },
    { id: "p105", nombre: "Leonel Facundo Papa", equipo: "e10", foto: "" },
    { id: "p106", nombre: "Franco Schiuma", equipo: "e10", foto: "" },
    { id: "p107", nombre: "Emiliano Garcia", equipo: "e10", foto: "" },
    { id: "p108", nombre: "Marcos Lopez", equipo: "e11", foto: "" },
    { id: "p109", nombre: "Alejandro Espinoza", equipo: "e11", foto: "" },
    { id: "p110", nombre: "Dario Lopez Melgarejo", equipo: "e6", foto: "" },
    { id: "p111", nombre: "Cristian Nuñez", equipo: "e6", foto: "" },
    { id: "p112", nombre: "Enzo Ponce", equipo: "e6", foto: "" },
    { id: "p113", nombre: "Mariano Buera", equipo: "e6", foto: "" },
    { id: "p114", nombre: "Leonardo Vega", equipo: "e6", foto: "" },
    { id: "p200", nombre: "Fabian Pare", equipo: "e1", foto: "" },
    { id: "p201", nombre: "Marcelo Barrios", equipo: "e1", foto: "" },
    { id: "p202", nombre: "Axel Avila", equipo: "e1", foto: "" },
    { id: "p203", nombre: "Enrique Imbert", equipo: "e1", foto: "" },
    { id: "p210", nombre: "Nahuel Correa", equipo: "e14", foto: "" },
    { id: "p211", nombre: "Gustavo Fabian", equipo: "e14", foto: "" },
    { id: "p212", nombre: "Nicolas Sequeira", equipo: "e14", foto: "" },
    { id: "p115", nombre: "Demian Mareco", equipo: "e1", foto: "" },
    { id: "p116", nombre: "Julián Madoz", equipo: "e2", foto: "" },
    { id: "p117", nombre: "Gustavo Nievas", equipo: "e2", foto: "" },
    { id: "p118", nombre: "Ramón Gonzaléz", equipo: "e2", foto: "" },
    { id: "p119", nombre: "Eduardo Dillon", equipo: "e2", foto: "" },
    { id: "p120", nombre: "Fran Martin", equipo: "e2", foto: "" },
    { id: "p121", nombre: "Rodrigo Juan", equipo: "e2", foto: "" },
    { id: "p341", nombre: "Nicolas Samaniego", equipo: "e2", foto: "", agregado: "2026-10-22" },   // agregado ya empezada la Copa (cupo 1 de 2)
    { id: "p122", nombre: "Fernando Torres", equipo: "e7", foto: "" },
    { id: "p123", nombre: "Victor Ramirez", equipo: "e8", foto: "" },
    { id: "p124", nombre: "Nahuel Tabares", equipo: "e8", foto: "" },
    { id: "p125", nombre: "Martin Perez", equipo: "e8", foto: "" },
    { id: "p126", nombre: "Abel Palmero", equipo: "e8", foto: "" },
    { id: "p127", nombre: "Alejandro Sanchez", equipo: "e8", foto: "" },
    { id: "p128", nombre: "Jose Luis Cabral", equipo: "e8", foto: "" },
    { id: "p129", nombre: "Mariano Federico Royano", equipo: "e9", foto: "" },
    { id: "p130", nombre: "Marcelo Gerardo Romanowicz", equipo: "e9", foto: "" },
    { id: "p131", nombre: "Ruben Dario Gonzalez", equipo: "e9", foto: "" },
    { id: "p132", nombre: "Gastón Andres Rios", equipo: "e9", foto: "" },
    { id: "p133", nombre: "César Guzman", equipo: "e9", foto: "" },
    { id: "p134", nombre: "Alex Llamocca", equipo: "e9", foto: "" },
    { id: "p135", nombre: "Bernardo Vleminchx", equipo: "e9", foto: "" },
    { id: "p136", nombre: "Lucas Gaston", equipo: "e12", foto: "" },
    { id: "p137", nombre: "Juan Manuel Gaitan", equipo: "e12", foto: "" },
    { id: "p138", nombre: "Aldo Tolosa", equipo: "e12", foto: "" },
    { id: "p139", nombre: "Mariano Ledesma", equipo: "e12", foto: "" },
    { id: "p342", nombre: "Alejo Manuel Marcos", equipo: "e12", foto: "", agregado: "2026-10-23" },   // agregado ya empezada la Copa (cupo 1 de 2)
    { id: "p140", nombre: "Juan Manuel Menéndez", equipo: "e13", foto: "" },
    { id: "p141", nombre: "Marcos Telleldin", equipo: "e13", foto: "" },
    { id: "p142", nombre: "Francisco Alberio", equipo: "e13", foto: "" },
    { id: "p143", nombre: "Martin Tassero", equipo: "e13", foto: "" },
    { id: "p144", nombre: "Juan Gerez", equipo: "e13", foto: "" },
    { id: "p145", nombre: "Mateo de Chiara", equipo: "e13", foto: "" },
    { id: "p146", nombre: "Ángel Daniel Coceres", equipo: "e16", foto: "" },
    { id: "p147", nombre: "Bruno Agustín Caro", equipo: "e16", foto: "" },
    { id: "p148", nombre: "Sidney Scott Rinaldi", equipo: "e16", foto: "" },
    { id: "p149", nombre: "Emanuel Acevedo", equipo: "e16", foto: "" },
    { id: "p150", nombre: "Leandro Agustín Sanchez", equipo: "e16", foto: "" },
    { id: "p76", nombre: "Lucas Javier Paintner", equipo: "e16", foto: "" },
    { id: "p77", nombre: "Agustin Garcin", equipo: "e16", foto: "" },
    { id: "p78", nombre: "Fabian Eduardo Espindola", equipo: "e16", foto: "" },
    { id: "p79", nombre: "Diego Miño", equipo: "e16", foto: "" },
    { id: "p80", nombre: "Sebastián Figola", equipo: "e16", foto: "" }
  ],

  // ---------------------------------------------------------------
  // PARTIDOS
  // fase: "Zona" para la fase de grupos; en playoffs, el nombre de la ronda.
  // veedorEq: equipo que veeda (solo el equipo). mvp: id del jugador del partido.
  // fecha: "AAAA-MM-DD". hora: "HH:MM". cancha: "Cancha 1". veedor: opcional.
  // golesLocal / golesVisitante: null si todavía no se jugó.
  //   (Los resultados en vivo que cargan los veedores pisan estos valores.)
  // goles:    [ { j: "id jugador", e: "id equipo" } ]
  // tarjetas: [ { j: "id jugador", e: "id equipo", t: "A" } ]   A = amarilla, R = roja, Z = azul
  // En playoffs, local/visitante pueden ser un texto que se resuelve solo:
  //   "#1" a "#16" = puesto del ranking general (cuando terminan todas las zonas):
  //                  primero la posición en la zona, y dentro de cada posición puntos, DG y fair play
  //   "1º Zona A"  = primero de la zona A (cuando la zona termina)
  //   "G:OC1"      = ganador del cruce OC1 (ver llaves más abajo)
  //   "P:OS1"      = perdedor del cruce OS1 (para el 3er puesto)
  // Si hay empate en playoffs: penales: { local: 4, visitante: 3 }
  // manual: true  = resultado cargado acá a mano: los datos en vivo de la planilla no lo pisan.
  // Walkover (resultado de mesa, ej. 3-0): agregar  wo: true  al partido. No cuenta en PJ ni en GR de la valla.
  // Equipo que abandona el torneo: agregar  abandono: true  al equipo. No figura en el ranking de valla.
  // Arquero titular (el que más partidos ataja): agregar  arquero: true  al jugador. Es quien figura en la valla menos vencida.
  // ---------------------------------------------------------------
  partidos: [

    // ----- Fecha 1 (sorteo del 15/10) -----
    { id: "m1", fase: "Zona", manual: true, veedorEq: "e3", mvp: "p43", zona: "C", fecha: "2026-10-17", hora: "14:00", cancha: "Cancha 1",
      local: "e9", visitante: "e8", golesLocal: 4, golesVisitante: 2,
      goles: [
        { j: "p43", e: "e9" },
        { j: "p43", e: "e9" },
        { j: "p43", e: "e9" },
        { j: "p129", e: "e9" },
        { j: "p38", e: "e8" },
        { j: "p126", e: "e8" }
      ],
      tarjetas: [] },

    { id: "m2", fase: "Zona", manual: true, veedorEq: "e12", mvp: "p142", zona: "D", fecha: "2026-10-17", hora: "14:00", cancha: "Cancha 2",
      local: "e13", visitante: "e16", golesLocal: 7, golesVisitante: 1,
      goles: [
        { j: "p64", e: "e13" },
        { j: "p65", e: "e13" },
        { j: "p65", e: "e13" },
        { j: "p141", e: "e13" },
        { j: "p142", e: "e13" },
        { j: "p142", e: "e13" },
        { j: "p145", e: "e13" },
        { j: "p79", e: "e16" }
      ],
      tarjetas: [
        { j: "p150", e: "e16", t: "A" }
      ] },

    { id: "m3", fase: "Zona", manual: true, veedorEq: "e7", mvp: "p91", zona: "D", fecha: "2026-10-17", hora: "14:00", cancha: "Cancha 3",
      local: "e4", visitante: "e15", golesLocal: 2, golesVisitante: 2,
      goles: [
        { j: "p327", e: "e4" },
        { j: "p331", e: "e4" },
        { j: "p81", e: "e15" },
        { j: "p81", e: "e15" }
      ],
      tarjetas: [
        { j: "p323", e: "e4", t: "A" }
      ] },

    { id: "m4", fase: "Zona", manual: true, veedorEq: "e4", mvp: "p210", zona: "B", fecha: "2026-10-17", hora: "15:00", cancha: "Cancha 1",
      local: "e5", visitante: "e14", golesLocal: 5, golesVisitante: 5,
      goles: [
        { j: "p22", e: "e5" },
        { j: "p96", e: "e5" },
        { j: "p96", e: "e5" },
        { j: "p340", e: "e5" },
        { j: "p340", e: "e5" },
        { j: "p69", e: "e14" },
        { j: "p69", e: "e14" },
        { j: "p210", e: "e14" },
        { j: "p210", e: "e14" },
        { j: "p210", e: "e14" }
      ],
      tarjetas: [
        { j: "p96", e: "e5", t: "A" },
        { j: "p67", e: "e14", t: "A" },
        { j: "p69", e: "e14", t: "A" },
        { j: "p70", e: "e14", t: "A" }
      ] },

    { id: "m5", fase: "Zona", manual: true, veedorEq: "e8", mvp: "p59", zona: "B", fecha: "2026-10-17", hora: "15:00", cancha: "Cancha 2",
      local: "e3", visitante: "e12", golesLocal: 3, golesVisitante: 7,
      goles: [
        { j: "p306", e: "e3" },
        { j: "p308", e: "e3" },
        { j: "p310", e: "e3" },
        { j: "p58", e: "e12" },
        { j: "p58", e: "e12" },
        { j: "p59", e: "e12" },
        { j: "p59", e: "e12" },
        { j: "p59", e: "e12" },
        { j: "p136", e: "e12" },
        { j: "p137", e: "e12" }
      ],
      tarjetas: [
        { j: "p301", e: "e3", t: "A" },
        { j: "p302", e: "e3", t: "A" }
      ] },

    { id: "m6", fase: "Zona", manual: true, veedorEq: "e9", mvp: "p112", zona: "A", fecha: "2026-10-17", hora: "15:00", cancha: "Cancha 3",
      local: "e2", visitante: "e6", golesLocal: 1, golesVisitante: 6,
      goles: [
        { j: "p9", e: "e2" },
        { j: "p112", e: "e6" },
        { j: "p112", e: "e6" },
        { j: "p112", e: "e6" },
        { j: "p114", e: "e6" },
        { j: "p114", e: "e6" },
        { j: "p114", e: "e6" }
      ],
      tarjetas: [
        { j: "p120", e: "e2", t: "A" }
      ] },

    { id: "m7", fase: "Zona", manual: true, veedorEq: "e13", mvp: "p55", zona: "C", fecha: "2026-10-17", hora: "16:00", cancha: "Cancha 1",
      local: "e10", visitante: "e11", golesLocal: 0, golesVisitante: 2,
      goles: [
        { j: "p55", e: "e11" },
        { j: "p109", e: "e11" }
      ],
      tarjetas: [] },

    { id: "m8", fase: "Zona", manual: true, veedorEq: "e5", mvp: "p5", zona: "A", fecha: "2026-10-17", hora: "16:00", cancha: "Cancha 3",
      local: "e1", visitante: "e7", golesLocal: 18, golesVisitante: 1,
      goles: [
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p5", e: "e1" },
        { j: "p201", e: "e1" },
        { j: "p201", e: "e1" },
        { j: "p201", e: "e1" },
        { j: "p201", e: "e1" },
        { j: "p202", e: "e1" },
        { j: "p202", e: "e1" },
        { j: "p2", e: "e1" },
        { j: "p203", e: "e1" },
        { j: "p35", e: "e7" }
      ],
      tarjetas: [] },

    // ----- Fecha 2 (sorteo del 15/10) -----
    { id: "m9", fase: "Zona", zona: "A", fecha: "2026-10-24", hora: "14:00", cancha: "Cancha 1",
      local: "e1", visitante: "e6", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m10", fase: "Zona", zona: "A", fecha: "2026-10-24", hora: "14:00", cancha: "Cancha 2",
      local: "e2", visitante: "e7", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m11", fase: "Zona", manual: true, zona: "B", fecha: "2026-10-24", hora: "14:00", cancha: "Cancha 3",
      local: "e5", visitante: "e12", golesLocal: 4, golesVisitante: 1,
      veedor: "Sid", veedorEq: "e16", mvp: "p96",   // cargado de la planilla en papel
      goles: [
        { j: "p25", e: "e5" },
        { j: "p96", e: "e5" },
        { j: "p96", e: "e5" },
        { j: "p96", e: "e5" },
        { j: "p59", e: "e12" }
      ],
      tarjetas: [
        { j: "p95", e: "e5", t: "A" }
      ] },

    { id: "m12", fase: "Zona", zona: "D", fecha: "2026-10-24", hora: "15:00", cancha: "Cancha 1",
      local: "e13", visitante: "e15", golesLocal: null, golesVisitante: null,
      veedor: "David", veedorEq: "e5",
      goles: [], tarjetas: [] },

    { id: "m13", fase: "Zona", zona: "C", fecha: "2026-10-24", hora: "15:00", cancha: "Cancha 2",
      local: "e10", visitante: "e8", golesLocal: null, golesVisitante: null,
      veedor: "Julio", veedorEq: "e6",
      goles: [], tarjetas: [] },

    { id: "m14", fase: "Zona", zona: "C", fecha: "2026-10-24", hora: "15:00", cancha: "Cancha 3",
      local: "e9", visitante: "e11", golesLocal: null, golesVisitante: null,
      veedor: "Trilles / Ari", veedorEq: "e7",
      goles: [], tarjetas: [] },

    { id: "m15", fase: "Zona", zona: "D", fecha: "2026-10-24", hora: "16:00", cancha: "Cancha 1",
      local: "e4", visitante: "e16", golesLocal: null, golesVisitante: null,
      veedor: "Madi", veedorEq: "e2",
      goles: [], tarjetas: [] },

    { id: "m16", fase: "Zona", zona: "B", fecha: "2026-10-24", hora: "16:00", cancha: "Cancha 3",
      local: "e3", visitante: "e14", golesLocal: null, golesVisitante: null,
      veedor: "Juanpy / Matute", veedorEq: "e11",
      goles: [], tarjetas: [] },

    // ----- Fecha 3 (sorteo del 15/10) -----
    { id: "m17", fase: "Zona", zona: "B", fecha: "2026-10-31", hora: "14:00", cancha: "Cancha 1",
      local: "e12", visitante: "e14", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m18", fase: "Zona", zona: "B", fecha: "2026-10-31", hora: "14:00", cancha: "Cancha 2",
      local: "e5", visitante: "e3", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m19", fase: "Zona", zona: "C", fecha: "2026-10-31", hora: "14:00", cancha: "Cancha 3",
      local: "e9", visitante: "e10", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m20", fase: "Zona", zona: "A", fecha: "2026-10-31", hora: "15:00", cancha: "Cancha 1",
      local: "e6", visitante: "e7", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m21", fase: "Zona", zona: "D", fecha: "2026-10-31", hora: "15:00", cancha: "Cancha 2",
      local: "e13", visitante: "e4", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m22", fase: "Zona", zona: "D", fecha: "2026-10-31", hora: "15:00", cancha: "Cancha 3",
      local: "e15", visitante: "e16", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m23", fase: "Zona", zona: "A", fecha: "2026-10-31", hora: "16:00", cancha: "Cancha 1",
      local: "e1", visitante: "e2", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    { id: "m24", fase: "Zona", zona: "C", fecha: "2026-10-31", hora: "16:00", cancha: "Cancha 3",
      local: "e11", visitante: "e8", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },

    // ----- Playoffs (equipos por definir) -----
    // Cuadro de arriba hacia abajo: Cuartos 1 y 2 van a la Semi 1; Cuartos 3 y 4 a la Semi 2.
    // Oro: C1 = 1 vs 8, C2 = 4 vs 5, C3 = 2 vs 7, C4 = 3 vs 6. Plata: C1 = 9 vs 16, C2 = 12 vs 13, C3 = 10 vs 15, C4 = 11 vs 14.
    // Día, horario y cancha: "" = "A definir" (se cargan semana a semana; los mejores clasificados, en los horarios más tarde).,
    { id: "m25", fase: "Cuartos Oro", fecha: "", hora: "", cancha: "",
      local: "#1", visitante: "#8", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m26", fase: "Cuartos Oro", fecha: "", hora: "", cancha: "",
      local: "#4", visitante: "#5", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m27", fase: "Cuartos Oro", fecha: "", hora: "", cancha: "",
      local: "#2", visitante: "#7", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m28", fase: "Cuartos Oro", fecha: "", hora: "", cancha: "",
      local: "#3", visitante: "#6", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m29", fase: "Cuartos Plata", fecha: "", hora: "", cancha: "",
      local: "#9", visitante: "#16", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m30", fase: "Cuartos Plata", fecha: "", hora: "", cancha: "",
      local: "#12", visitante: "#13", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m31", fase: "Cuartos Plata", fecha: "", hora: "", cancha: "",
      local: "#10", visitante: "#15", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m32", fase: "Cuartos Plata", fecha: "", hora: "", cancha: "",
      local: "#11", visitante: "#14", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m33", fase: "Semifinal Oro", fecha: "", hora: "", cancha: "",
      local: "G:OC1", visitante: "G:OC2", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m34", fase: "Semifinal Oro", fecha: "", hora: "", cancha: "",
      local: "G:OC3", visitante: "G:OC4", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m35", fase: "Semifinal Plata", fecha: "", hora: "", cancha: "",
      local: "G:PC1", visitante: "G:PC2", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m36", fase: "Semifinal Plata", fecha: "", hora: "", cancha: "",
      local: "G:PC3", visitante: "G:PC4", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m37", fase: "3er puesto Oro", fecha: "", hora: "", cancha: "",
      local: "P:OS1", visitante: "P:OS2", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m38", fase: "3er puesto Plata", fecha: "", hora: "", cancha: "",
      local: "P:PS1", visitante: "P:PS2", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m39", fase: "Final Oro", fecha: "", hora: "", cancha: "",
      local: "G:OS1", visitante: "G:OS2", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] },
    { id: "m40", fase: "Final Plata", fecha: "", hora: "", cancha: "",
      local: "G:PS1", visitante: "G:PS2", golesLocal: null, golesVisitante: null,
      goles: [], tarjetas: [] }
  ],

  // ---------------------------------------------------------------
  // SUSPENDIDOS (se muestran en Estadísticas)
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------
  // VEEDORES: los chicos de la liga que veedan partidos, cada uno con su equipo.
  // nombre: igual a como lo escribe en la pantalla de veedores (no importan mayúsculas ni tildes).
  // equipo: el id del equipo al que pertenece (ej. "e3"). Si no tiene, dejá "".
  // Con esto el partido muestra "Veedor: Nombre (Equipo)" y en Estadísticas
  // aparece el cuadro de cuántos partidos veedó cada uno (incluso los que 0).
  // (Todavía sin cargar: cuando tengamos la lista real, agregarla acá.)
  // ---------------------------------------------------------------
  veedores: [],

  suspendidos: [],

  // ---------------------------------------------------------------
  // LLAVES de las dos copas. Cada cruce apunta a un partido de la lista
  // de arriba con partidoId. Equipos y resultados salen de ese partido.
  // ---------------------------------------------------------------
  llaves: [
    { copa: "Copa Oro", descripcion: "Puestos 1 al 8 del ranking general", rondas: [
      { nombre: "Cuartos de final", cruces: [
        { id: "OC1", nombre: "Cuartos Oro 1", partidoId: "m25" },
        { id: "OC2", nombre: "Cuartos Oro 2", partidoId: "m26" },
        { id: "OC3", nombre: "Cuartos Oro 3", partidoId: "m27" },
        { id: "OC4", nombre: "Cuartos Oro 4", partidoId: "m28" }
      ] },
      { nombre: "Semifinales", cruces: [
        { id: "OS1", nombre: "Semi Oro 1", partidoId: "m33" },
        { id: "OS2", nombre: "Semi Oro 2", partidoId: "m34" }
      ] },
      { nombre: "Final y 3er puesto", cruces: [
        { id: "OF", nombre: "Final Oro", partidoId: "m39" },
        { id: "O3", nombre: "3er puesto Oro", partidoId: "m37" }
      ] }
    ] },
    { copa: "Copa Plata", descripcion: "Puestos 9 al 16 del ranking general", rondas: [
      { nombre: "Cuartos de final", cruces: [
        { id: "PC1", nombre: "Cuartos Plata 1", partidoId: "m29" },
        { id: "PC2", nombre: "Cuartos Plata 2", partidoId: "m30" },
        { id: "PC3", nombre: "Cuartos Plata 3", partidoId: "m31" },
        { id: "PC4", nombre: "Cuartos Plata 4", partidoId: "m32" }
      ] },
      { nombre: "Semifinales", cruces: [
        { id: "PS1", nombre: "Semi Plata 1", partidoId: "m35" },
        { id: "PS2", nombre: "Semi Plata 2", partidoId: "m36" }
      ] },
      { nombre: "Final y 3er puesto", cruces: [
        { id: "PF", nombre: "Final Plata", partidoId: "m40" },
        { id: "P3", nombre: "3er puesto Plata", partidoId: "m38" }
      ] }
    ] }
  ],

  // ---------------------------------------------------------------
  // HISTORIAL de ediciones (Liga y Copa). Una línea por edición.
  // ---------------------------------------------------------------
  // Equipos que jugaron ediciones anteriores y no están en esta (solo para mostrar su escudo en el Historial).
  equiposHistoricos: [
    { nombre: "Stitch", escudo: "img/escudos/stitch.png" }
  ],

  historial: [
    { edicion: "Copa Pride segunda edición", anio: "2025",
      oro:   { campeon: "Dogos F5", subcampeon: "Aguará Guazú" },
      plata: { campeon: "Impulse", subcampeon: "Stitch" },
      goleador: "Hugo Ayala", goleadorEquipo: "Yacares BA", notas: "" },
    { edicion: "Copa Pride primera edición", anio: "2024",
      oro:   { campeon: "FGR", subcampeon: "Grindr" },
      plata: { campeon: "Fenix", subcampeon: "Huemules" },
      goleador: "Rodrigo Acosta", goleadorEquipo: "Yacares BA", notas: "" }
  ]
};
