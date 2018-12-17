/* eslint-env mocha */
/**
 * @author  Tania Torres
 * @description Se inicializa la variable del socket del lado del cliente.
 */
const socket = io()
var userId
var colorUser
var flagTiro

/**
* @author  Josué Zapata
* @description Su tarea es dibujar todo el tablero
* empezando por las filas, y en cada una de estas dibujar sus 20 columnas.
* Al terminar 20 filas se tendrá el tablero dibujado , 30x30 pixeles cuadrados.
* Este metodo funciona sobre el tag <table id="tablero">
*/
function Tablero () { // eslint-disable-line
  for (var fila = 0; fila < 20; fila++) {
    var filaActual = 'F' + fila // Almacena la fila actual
    var crearFila = document.createElement('TR')
    // importante darle id a cada fila para que las columnas se impriman desde la fila 0 a la 20.
    crearFila.setAttribute('id', filaActual)
    document.getElementById('tablero').appendChild(crearFila)

    for (var columna = 0; columna < 20; columna++) {
      var posicion = 'F' + fila + 'C' + columna // Se agrego una ID para cada cuadro que representa su cordenada
      var crearCuadro = document.createElement('TH')
      crearCuadro.classList.add('cuadro')

      // Se eliminan los bordes dependiendo si es el final de la columna o de la fila
      if (fila !== 19) {
        crearCuadro.setAttribute('id', posicion)
        if (columna === 19) {
          crearCuadro.style.borderStyle = 'hidden hidden hidden none'
        }
      } else {
        crearCuadro.setAttribute('id', posicion)
        crearCuadro.style.borderStyle = 'none hidden hidden hidden'
      }

      // Dependiendo de la fila en la que se esta imprimir sus respectivas 20 columnas
      document.getElementById(filaActual).appendChild(crearCuadro)
    }
  }
}

/**
 * @author  Nicolas Diego
 * @description Se crea un metodo que recibe la cordenada a la cual se quiere colocar la ficha
 * con los siguientes parametros: int X: la fila & int Y: la columna
 */

function Ficha (x, y) {
  let estadoFoo = 0 // variable que contendrá el estado actual del hueco; 0 representa vacío y 1 representa ocupado, Autor: LucNieto
  var crearFicha = document.createElement('DIV')
  document.getElementById('F' + x + 'C' + y).appendChild(crearFicha)
  crearFicha.classList.add('ficha')
  crearFicha.setAttribute('id', estadoFoo) // se le asigna un id al hueco para llevar control del estado de la ficha, Autor: LucNieto
  crearFicha.setAttribute('draggable', false)

  /**
 * @author  Lucio Nieto
 * @description se obtiene el id del hueco para cambiar el color e indicar que se está seleccionando
 * ya sea para el mouseover o el click
 */

  crearFicha.addEventListener('mouseover', () => {
    (crearFicha.id == 0) ? (crearFicha.style.backgroundColor = 'grey') : null
  }) // Autor: Lucio Nieto Bautista

  crearFicha.addEventListener('mouseout', () => { (crearFicha.id == 0) ? crearFicha.style.backgroundColor = 'lightgrey' : null })// Autor: Lucio Nieto Bautista

  crearFicha.addEventListener('mouseup', () => {
    (crearFicha.id == 0) ? (crearFicha.style.backgroundColor = colorUser, crearFicha.id = userId,
    socket.emit('pente:seleccion', { id: crearFicha.parentNode.id, color: colorUser, usuarioTiro: userId }),
    sumaJ1 = 1,
    fichasEneConsecu = 0,
    Evaluar(x, y),
    flagTiro = 1)
      : null// Fin  del bloque,Autor: Lucio Nieto Bautista
  })
}

/**
 * @author  Tania Torres,Josué Zapata
 * @param setPlayers
 * @description Se almacena en una variable global el ID del cliente actual para usos del algoritmo de evaluacion de tiro
 * asi como su color fijo para cada usuario
 * setScore dibuja el score a todos los usuarios dependiendo del numero de usuarios actuales
 */

socket.on('setPlayers', function (data) {
  userId = data
  if (userId == 1) { colorUser = 'red' }

  if (userId == 2) { colorUser = 'blue' }

  if (userId == 3) { colorUser = 'green' }

  if (userId == 4) { colorUser = 'yellow' }
  document.getElementById('tablero').style.pointerEvents = 'none'
})

socket.on('setScore', function (data) {
  document.getElementById('panel-jugadores').innerHTML = ''
  for (var i = 1; i <= data; i++) {
    var jugadorCliente = ''
    if (i == userId) {
      jugadorCliente = "<span class='badge badge-secondary'>Jugador " + i + '</span></h5>'
    } else {
      jugadorCliente = 'Jugador ' + i + '</h5>'
    }

    document.getElementById('panel-jugadores').innerHTML +=
        "<div class='panel1'>" +
         "<div class='panel-Jugador1'>" +
          "<div class='card' style='width: 18rem;''>" +
            "<div class='card-body'>" +
              "<div class='row justify-content-md-center'>" +
                "<div cass='col-2 text-right'>" +
                  "<span id='" + i + "color' class='dot'></span>" +
                '</div>' +
                "<div cass='col-4'>" +
                  "<h5 class='card-title'> &nbsp; " +
                  jugadorCliente +
                '</div>' +
                "<div class='col-4 margin-down'>" +
                  "<div class='osahanloading'></div>" +
                '</div>' +
              '</div>' +
              "<div class='row'>" +
                "<div class='col-6'>" +
                  "<P class='text-right'>Comidas:<strong id='jugador" + i + "Comida'> 0</strong></P>" +
                  "<P class='text-right'>Filas de 4:<strong id='jugador" + i + "Filas4'> 0</strong></P>" +
                '</div>' +
                "<div class='col-6'>" +
                  '<P>Tiempo</P>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
         '</div>' +
        '</div>'
    var ficha = document.getElementById(i + 'color')

    if (i == 1) { ficha.style.backgroundColor = 'red' }

    if (i == 2) { ficha.style.backgroundColor = 'blue' }

    if (i == 3) { ficha.style.backgroundColor = 'green' }

    if (i == 4) { ficha.style.backgroundColor = 'yellow' }
  }
})

/**
 * @author  Tania Torres ,Josué Zapata
 * @description En este metodo se recibe el id del TH donde el otro usuario tiro
 * y se pinta en la pantalla contraria.
 */

socket.on('pente:seleccion', function (data) {
  var childNode = document.getElementById(data.id).childNodes

  childNode[0].setAttribute('style', `background-color: ${data.color}`)
  childNode[0].setAttribute('id', ` ${data.usuarioTiro}`)
})

socket.on('turno', function (data) {
  flagTiro = 0
  if (data == 1) {
    var timeLeft = 10

    var elem = document.getElementById('temporizador')
    var timerId = setInterval(countdown, 1000)

    function countdown () {
      if (timeLeft == 0 || flagTiro == 1) {
        timeLeft = 0
        clearTimeout(timerId)
        elem.innerHTML = 'Tiempo'
        document.getElementById('tablero').style.pointerEvents = 'none'
        socket.emit('siguienteTurno', userId)
      } else {
        document.getElementById('tablero').style.pointerEvents = 'auto'
        elem.innerHTML = timeLeft + ' segundos restantes'
        timeLeft--
      }
    }
  }
})

/**
 * @author Tania Torres
 *  @description Verifica el valor escogido por el primer usuario en el form formCantidadJugadores
 * y se lo envía al servidor.
 */

function Guardar (data) {
  socket.emit('cantidadJugadores', data)
  $('#formCantidadJugadores').modal('hide')
  document.getElementById('interfaz').style.display = 'block'
}

/**
 * @author Josue Zapata
 *  @description Recibe del servidor la indicacion de que se esta esperando a que se llene la sala,
 *  es recibida por los clientes
 */

socket.on('notificacionEsperarSala', function (data) {
  document.getElementById('notificacionTitulo').innerHTML = 'Esperando jugadores'
  document.getElementById('notificacionDescripcion').innerHTML = 'tiempo estimado'
  document.getElementById('temporizador').innerHTML = data
})

/**
 * @author Josue Zapata
 *  @description Recibe del servidor la indicacion de que se esta esperando a que el juego empiece en 3
 *  segundos
 */

socket.on('notificacionIniciarJuego', function (data) {
  document.getElementById('notificacionTitulo').innerHTML = 'EL juego inicia en'
  document.getElementById('notificacionDescripcion').innerHTML = ''
  document.getElementById('temporizador').innerHTML = data
})

/**
 * @author Tania Torres,Josué Zapata
 * @description En este metodo si detecta que eres el primer usuario en entrar a /juego
 * bloquea el tablero de juego.
 */
socket.on('jugador1', function (data) {
  if (data == 1) {
    $('#formCantidadJugadores').modal('show')
  }
})

socket.on('jugador2', function (data) {
  document.getElementById('interfaz').style.display = 'block'
})

socket.on('jugador3', function (data) {
  document.getElementById('interfaz').style.display = 'block'
})

socket.on('jugador4', function (data) {
  document.getElementById('interfaz').style.display = 'block'
})

/**
 * @author Roberto Sagaón , Nicolas Diego
 * @description En este metodo se desaparecen las fichas que se hayan comido en el turno.
 */
socket.on('pente:comeer', function (data) {
  var childNode = document.getElementById(data.id).childNodes
  childNode[0].setAttribute('style', 'background-color: lightgrey;')
  childNode[0].setAttribute('id', '0')
})

/**
 * @author Tania Torres, Josué Zapata
 * @description En este metodo  el servidor detecta cuando  solo queda un jugador
 * en la partida ganando por default
 */

socket.on('desconectado', function (data) {
  if (data == 1) {
    // NotificacionJugadorFuera()
    document.getElementById('tablero').style.pointerEvents = 'none'
  }
})
socket.on('perdedor', function (data) {
  if (data.flag == 1) {
    NotificacionHasPerdido()
  }
})

/**
 * @author Tania Torres, Roberto Sagaón
 * @description Se integra el método que dibuja todas las fichas-hueco en el tablero que se
 * utilizaran en el juego.
 */

// Funciones que no son utilizadas en este archivo comentarlas con disable
function DibujarFichasTablero () { // eslint-disable-line
  for (let i = 0; i <= 19; i++) {
    for (let j = 0; j <= 19; j++) {
      Ficha(i, j)
    }
  }
}

/**
 *  @author Roberto Sagaón, Nicolás Diego
 * @description Se integran los métodos Evaluar y sus respectivos metodos de ayuda para
 * realizar recorrido de todas las posiciones a su alrededor y decidir si
 * puede comer fichas o si existen 4 o 5 fichas del mismo jugador.
 */

socket.on('recibirTiro', function () {
  EvaluarLineas4()
})

/**
 *  @author Nicolás Diego
 * @description Metodo que recibe el id y el puntaje del usuario actual para actualizarce y
 *
 */

socket.on('actualizarPuntaje', function (datos) {
  for (var i = 0; i < jugadoresTotal; i++) {
    document.getElementById('jugador' + (i + 1) + 'Comida').innerHTML = ' ' + datos[i]
  }
})

var jugadoresTotal = 0
socket.on('totalJugadores', function (jugadoresT) {
  jugadoresTotal = jugadoresT
})

/**
 * @author Roberto Sagaón, Nicolás Diego
 * @description Se integran los métodos Evaluar y sus respectivos metodos de ayuda para
 * realizar recorrido de todas las posiciones a su alrededor y decidir si
 * puede comer fichas o si existen 4 o 5 fichas del mismo jugador.
 */
var sumaJ1 = 1
var fichasEneConsecu = 0
var fichasConsecu = 1
var fichasComidas = 0

var lineasCuatro = [
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y']]

var lineaTemporal = ['', '', '', '']
var posicionesJ1 = [0, 0, 0, 0, 0]

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */

function Evaluar (x, y) {
  lineaTemporal[0] = x + ',' + y
  sumaJ1 = 1
  fichasConsecu = 1
  fichasEneConsecu = 0
  Arriba(x, y)
  fichasEneConsecu = 0
  Abajo(x, y)

  if (fichasConsecu >= 5) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }
  if (fichasComidas >= 10) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }

  if (fichasConsecu == 4) {
    var checar = true
    for (var i = 0; i < 5; i++) {
      if (posicionesJ1[i] === 0 && checar === true) {
        posicionesJ1[i] = 1
        for (var j = 0; j < 4; j++) {
          lineasCuatro[i][j] = lineaTemporal[j]
        }
        checar = false
      }
    }
  }

  lineaTemporal[0] = x + ',' + y
  sumaJ1 = 1
  fichasConsecu = 1
  fichasEneConsecu = 0
  ArribaDerecha(x, y)
  fichasEneConsecu = 0
  IzquierdaAbajo(x, y)

  if (fichasConsecu >= 5) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }
  if (fichasComidas >= 10) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }

  if (fichasConsecu == 4) {
    var checar = true
    for (var i = 0; i < 5; i++) {
      if (posicionesJ1[i] === 0 && checar === true) {
        posicionesJ1[i] = 1
        for (var j = 0; j < 4; j++) {
          lineasCuatro[i][j] = lineaTemporal[j]
        }
        checar = false
      }
    }
  }

  lineaTemporal[0] = x + ',' + y
  sumaJ1 = 1
  fichasConsecu = 1
  fichasEneConsecu = 0
  Derecha(x, y)
  fichasEneConsecu = 0
  Izquierda(x, y)

  if (fichasConsecu >= 5) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }
  if (fichasComidas >= 10) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }

  if (fichasConsecu == 4) {
    var checar = true
    for (var i = 0; i < 5; i++) {
      if (posicionesJ1[i] == 0 && checar == true) {
        posicionesJ1[i] = 1
        for (var j = 0; j < 4; j++) {
          lineasCuatro[i][j] = lineaTemporal[j]
        }
        checar = false
      }
    }
  }

  lineaTemporal[0] = x + ',' + y
  sumaJ1 = 1
  fichasConsecu = 1
  fichasEneConsecu = 0
  DerechaAbajo(x, y)
  fichasEneConsecu = 0
  IzquierdaArriba(x, y)

  if (fichasConsecu >= 5) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }
  if (fichasComidas >= 10) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }

  if (fichasConsecu == 4) {
    var checar = true
    for (var i = 0; i < 5; i++) {
      if (posicionesJ1[i] == 0 && checar == true) {
        posicionesJ1[i] = 1
        for (var j = 0; j < 4; j++) {
          lineasCuatro[i][j] = lineaTemporal[j]
        }
        checar = false
      }
    }
  }

  socket.emit('pasarTiro')

  // Funcion recorrer arreglo filass de 5
  var ganar = 0
  posicionesJ1.forEach(function (valor) {
    if (valor == 1) {
      ganar++
    }
  })
  // Funcion verifica Ganar 5 Lineas
  if (ganar >= 5) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }
}// Fin Evaluar

function EvaluarLineas4 () {
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 4; j++) {
      if (lineasCuatro[i][j] != 'x,y') {
        var charExtra = 0
        var tempXC = lineasCuatro[i][j].charAt(0)
        var tempXD = ''
        if (lineasCuatro[i][j].charAt(1) != ',') {
          tempXD = lineasCuatro[i][j].charAt(1)
          charExtra++
        }
        var tempYC = lineasCuatro[i][j].charAt(2 + charExtra)
        var tempYD = ''
        if (lineasCuatro[i][j].charAt(1) != null) {
          tempYD = lineasCuatro[i][j].charAt(3 + charExtra)
          charExtra++
        }
        var ficha = document.getElementById('F' + tempXC + tempXD + 'C' + tempYC + tempYD).lastChild
        if (ficha.id == 0) {
          posicionesJ1[i] = 0
        }
      }
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */
function Arriba (x, y) {
  if (x > 0) {
    x--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild

    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++

      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x + 1) + 'C' + y).lastChild
        var fichaSig2 = document.getElementById('F' + (x + 2) + 'C' + y).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + (x + 1) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x + 2) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        Arriba(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      Arriba(x, y)
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */
function ArribaDerecha (x, y) {
  if (x > 0 && y < 19) {
    y++
    x--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x + 1) + 'C' + (y - 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x + 2) + 'C' + (y - 2)).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + (x + 1) + 'C' + (y - 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x + 2) + 'C' + (y - 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        ArribaDerecha(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      ArribaDerecha(x, y)
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */
function Derecha (x, y) {
  if (y < 19) {
    y++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + x + 'C' + (y - 1)).lastChild
        var fichaSig2 = document.getElementById('F' + x + 'C' + (y - 2)).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + x + 'C' + (y - 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + x + 'C' + (y - 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        Derecha(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      Derecha(x, y)
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */

function DerechaAbajo (x, y) {
  if (x < 19 && y < 19) {
    y++
    x++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x - 1) + 'C' + (y - 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x - 2) + 'C' + (y - 2)).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + (x - 1) + 'C' + (y - 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x - 2) + 'C' + (y - 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        DerechaAbajo(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      DerechaAbajo(x, y)
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */
function Abajo (x, y) {
  if (x < 19) {
    x++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++

      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x - 1) + 'C' + y).lastChild
        var fichaSig2 = document.getElementById('F' + (x - 2) + 'C' + y).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + (x - 1) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x - 2) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        Abajo(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      Abajo(x, y)
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */
function IzquierdaAbajo (x, y) {
  if (x < 19 && y > 0) {
    y--
    x++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x - 1) + 'C' + (y + 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x - 2) + 'C' + (y + 2)).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + (x - 1) + 'C' + (y + 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x - 2) + 'C' + (y + 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        IzquierdaAbajo(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      IzquierdaAbajo(x, y)
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */
function Izquierda (x, y) {
  if (y > 0) {
    y--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + x + 'C' + (y + 1)).lastChild
        var fichaSig2 = document.getElementById('F' + x + 'C' + (y + 2)).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + x + 'C' + (y + 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + x + 'C' + (y + 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        Izquierda(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      Izquierda(x, y)
    }
  }
}

/**
 * @author colocar autor
 * @description colocar descripción aquí.
 */
function IzquierdaArriba (x, y) {
  if (x > 0 && y > 0) {
    y--
    x--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x + 1) + 'C' + (y + 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x + 2) + 'C' + (y + 2)).lastChild
        if (fichaSig1.id == fichaSig2.id && fichaSig1.id != 0) {
          ficha = document.getElementById('F' + (x + 1) + 'C' + (y + 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x + 2) + 'C' + (y + 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          fichasComidas += 2
          document.getElementById('jugador' + userId + 'Comida').innerHTML = ' ' + fichasComidas
          var data = [userId, fichasComidas]
          socket.emit('totalPuntajeComer', data)
        }
      } else {
        IzquierdaArriba(x, y)
      }
    } else if (ficha.id != userId) {
      fichasEneConsecu++
      IzquierdaArriba(x, y)
    }
  }
}

/**
 * @author Raziel Tapia
 *  @description Funciones ganar, usadas para notificar a los jugadores quien gano
 *  Recargar pagina cuando  hay un ganador
 */
function NotificacionHasGanado () {
  document.getElementById('temporizador').innerHTML = 'Ganaste'
  RecargarPagina()
  console.log('ganaste 5F')
  console.log('ganaste Comio: ' + fichasComidas)
}

function NotificacionHasPerdido () {
  document.getElementById('temporizador').innerHTML = 'Perdiste'
  RecargarPagina()
  console.log('Perdiste')
}

function RecargarPagina () {
  // setTimeout(function () { window.location.href = '/' }, 3000)
}
