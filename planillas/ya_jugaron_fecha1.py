# Quiénes jugaron en la Fecha 1 (leído de las planillas; donde el veedor no marcó JUGÓ se dedujo por goles/tarjetas).
# Ajustes a mano (la planilla escribe el apellido distinto que la lista de buena fe)
A_MANO = {"e15": ["p84"], "e12": ["p56"], "e3": ["p312"],
  # Completado por Fer (22/10): jugadores que jugaron la Fecha 1 y no estaban marcados
  "e1":  ["p115", "p4"],                                              # Demian Mareco, Alejandro del Fallo
  "e6":  ["p26", "p27"],                                              # Julio Cesar Ebel, Federico Belluscio
  "e2":  ["p6", "p7", "p8", "p10", "p116", "p117", "p118", "p119"],   # todos menos Rodrigo Juan y Nicolas Samaniego (agregado)
  "e7":  ["p33", "p34", "p122"],                                      # los 6 de Escorpiones
  "e10": ["p47", "p104", "p101", "p102", "p105"],                     # Nano, Alexander, Erik, Nicolás Quiroga, Leonel
  "e11": ["p51", "p108"],                                             # los 7 de Huemules
  "e14": ["p212"],                                                    # Nicolas Sequeira
}

JUGARON = {
 "e9":  ["Josias Sotelo","Mariano Royano","Marcelo Romanowicz","Ruben González","Gaston Rios","Cesar Guzman","Alex Llamocca"],
 "e8":  ["Enzo Ponce","Alfredo Rivera","Nicolás Cortéz","Nahuel Tabares","Abel Palmero","Alejandro Sanchez"],
 "e13": ["Agustin Bahl","Alessandro Ramos","Fabián Torres","Alex De los Santos","Juan Manuel Menéndez","Marcos Telleldin","Francisco Alberio","Martin Tassero","Mateo De Chiara"],
 "e16": ["Javier Paintner","Fabián Espindola","Diego Miño","Sebastián Figola","Angel Coceres","Bruno Caro","Sidney Scott","Emanuel Acevedo","Agustin Sanchez"],
 "e4":  ["Marcos Torres","Derlis Rodas","Sergio Roldan","Javier Estigarribia","Germán Medina","Diego Ozuna","Oscar Maza","Samuel Suárez","Gonzalo Alvarau"],
 "e15": ["Emiliano Baez","Miguel Cejas","Sergio Miñaro","Juan Gasco","Pablo Osorio","Jonatan Auver","Yoel Mendoza"],
 "e12": ["Gustavo Reyes","Luciano Mayorga","Lucas Salazar","Victorio Molina","Lucas Gaston","Juan Manuel Gaitan","Aldo Tolosa","Mariano Ledesma"],
 "e3":  ["Elias Ale","Rolando Zena","Eduardo Flores","Sebastián Alvarenga","Fabian Aranda","Jimmy Torres","Hernán Cabello"],
 # equipos donde el veedor no marcó JUGÓ: se deduce por goles / tarjetas
 "e5":  ["Martin Balay","Miguel Villan","Juan Farinella","Emanuel Gigena","Lucas Sosa","Hernan Varela","David Noval"],
 "e14": ["Nazareno Paredes","Junior Villalba","Agustin Ramirez","Nahuel Correa","Brian Barrera"],
 "e2":  ["Nicolás Alvarez","Fran Martin"],
 "e6":  ["Enzo Ponce","Leonardo Vega","Dario Lopez","Jonatan Echeverria"],
 "e11": ["Rodrigo González","Alejandro Espinoza","Juan Pablo Artin","Santiago Morrone","Dario Coronel"],
 "e1":  ["Juan Pablo Duarte","Cristian Pare","Marcelo Barrios","Axel Ávila","Enrique Imbert"],
 "e7":  ["Franco Antúnez","Fernando Trilles","Ivan Sanchez"],
 "e10": ["Daniel Chalen","Dieguis Sanchez","Alonso Machin","Emiliano Garcia"],
}

# ----- Fecha 2 (24/10), leído de las planillas: jugadores que jugaron por PRIMERA vez -----
FECHA2 = {
  "e5":  ["p25", "p98", "p100"],   # Dogos F5: Santiago Agustin Monzon, Jesus Caceres, Amadeo Benjamin Segundo
  "e12": ["p60", "p342"],          # Grindr: Leandro Martin, Alejo Manuel Marcos
}
for _e, _l in FECHA2.items():
    A_MANO.setdefault(_e, [])
    A_MANO[_e] += [x for x in _l if x not in A_MANO[_e]]
