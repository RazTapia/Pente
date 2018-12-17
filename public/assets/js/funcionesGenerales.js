/* eslint-env mocha */

/* Autor: Tania Torres Alvarado
* Se inicializa la variable del socket del lado del cliente.
*/
const socket = io()
var userId
var colorUser

/*
* Autor: RannFerii
* Su tarea es dibujar todo el tablero
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

/*
* Autor: BacteriaLoki
* Se crea un metodo que recibe la cordenada a la cual se quiere colocar la ficha
* con los siguientes parametros: int X: la fila & int Y: la columna
*/

function Ficha (x, y) {
  let estadoFoo = 0 // variable que contendrá el estado actual del hueco; 0 representa vacío y 1 representa ocupado, Autor: LucNieto
  var crearFicha = document.createElement('DIV')

  document.getElementById('F' + x + 'C' + y).appendChild(crearFicha)
  crearFicha.classList.add('ficha')
  crearFicha.setAttribute('id', estadoFoo) // se le asigna un id al hueco para llevar control del estado de la ficha, Autor: LucNieto
  crearFicha.setAttribute('draggable', false)
  /*
* Autor: LucNieto
* se obtiene el id del hueco para cambiar el color e indicar que se está seleccionando
* ya sea para el mouseover o el click
*/
  crearFicha.addEventListener('mouseover', () => {
    (crearFicha.id == 0) ? (crearFicha.style.backgroundColor = 'grey') : null
  }) // Autor: Lucio Nieto Bautista

  crearFicha.addEventListener('mouseout', () => { (crearFicha.id == 0) ? crearFicha.style.backgroundColor = 'lightgrey' : null })// Autor: Lucio Nieto Bautista

  crearFicha.addEventListener('mouseup', () => {
    (crearFicha.id == 0) ? (crearFicha.style.backgroundColor = colorUser, crearFicha.id = userId,
    socket.emit('pente:seleccion', { id: crearFicha.parentNode.id, color: colorUser, usuarioTiro: userId }), sumaJ1 = 1,
    fichasEneConsecu = 0,
    Evaluar(x, y),
    document.getElementById('tablero').style.pointerEvents = 'none')// Autor: Tania Torres Alvarado
      : null()// Fin  del bloque,Autor: Lucio Nieto Bautista
  })
}

/*
* Autor: Tania Torres Alvarado,Josue Zapata Moreno
* setPlayers Se almacena en una variable global el ID del cliente actual para usos del algoritmo de evaluacion de tiro
* asi como su color fijo para cada usuario
* setScore dibuja el score a todos los usuarios dependiendo del numero de usuarios actuales
*/

socket.on('setPlayers', function (data) {
  userId = data

  if (userId == 1) { colorUser = 'red' }

  if (userId == 2) { colorUser = 'blue' }

  if (userId == 3) { colorUser = 'green' }

  if (userId == 4) { colorUser = 'yellow' }
})

socket.on('setScore', function (data) {
  document.getElementById('panel-jugadores').innerHTML = ''
  for (var i = 1; i <= data; i++) {
    document.getElementById('panel-jugadores').innerHTML +=
        "<div class='panel1'>" +
         "<div class='panel-Jugador1'>" +
          "<div class='card' style='width: 18rem;''>" +
            "<div class='card-body'>" +
              "<div class='row justify-content-md-center'>" +
                "<div cass='col-2'>" +
                  "<span id='" + i + "color' class='dot'></span>" +
                '</div>' +
                "<div cass='col-4'>" +
                  "<h5 class='card-title'> &nbsp; <label id='jugador'>Jugador " + i + '</label> </h5>' +
                '</div>' +
                "<div class='col-4 margin-down'>" +
                  "<div class='osahanloading'></div>" +
                '</div>' +
              '</div>' +
              "<div class='row'>" +
                "<div class='col-6'>" +
                  "<P id='jugador" + i + "Comida'>Comidas: 0</P>" +
                  "<P id='jugador" + i + "Filas'>Filas de 4: 0</P>" +
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

/*
* Autor: Tania Torres Alvarado,Josue Zapata Moreno
* En este metodo se recibe el id del TH donde el otro usuario tiro
* y se pinta en la pantalla contraria.
*/

socket.on('pente:seleccion', function (data) {
  var childNode = document.getElementById(data.id).childNodes
  console.log(data.usuarioTiro)

  childNode[0].setAttribute('style', `background-color: ${data.color}`)
  childNode[0].setAttribute('id', ` ${data.usuarioTiro}`)
  document.getElementById('tablero').style.pointerEvents = 'auto'
})

/*
* Autor: Tania Torres Alvarado
* Verifica el valor escogido por el primer usuario en el form formCantidadJugadores
* y se lo envía al servidor.
*/

function Guardar() {
  var users;
  if(document.getElementById('2').checked) {
    users=2;
  }else if(document.getElementById('3').checked) {
    users=3;
  }else if(document.getElementById('4').checked) {
    users=4;
  }
  socket.emit('cantidadJugadores',users)
  $('#formCantidadJugadores').modal('hide')
}
/*
* Autor: Tania Torres Alvarado,Josue Zapata Moreno
* En este metodo si detecta que eres el primer usuario en entrar a /juego
* bloquea el tablero de juego.
*/
socket.on('jugador1', function (data) {
  if (data == 1) {
    $('#formCantidadJugadores').modal('show')
    document.getElementById('tablero').style.pointerEvents = 'none'
  }
})
/*
* Autor: Tania Torres Alvarado,Josue Zapata Moreno
* En este metodo si ya hay dos jugadores y activa el tablero al primer jugador que llego.
* Envia un mensaje avisando
*/
socket.on('jugador2', function (data) {
  if (data == 2) {
    // NotificacionEmpezarPartida()
    document.getElementById('tablero').style.pointerEvents = 'auto'
  }
})
/*
* Autor: Roberto Sagaón , Nicolas Omar Diego
* En este metodo se desaparecen las fichas que se hayan comido en el turno.
*/
socket.on('pente:comeer', function (data) {
  var childNode = document.getElementById(data.id).childNodes
  childNode[0].setAttribute('style', 'background-color: lightgrey;')
  childNode[0].setAttribute('id', '0')
})

/*
* Autor: Tania Torres Alvarado,Josue Zapata Moreno
* En este metodo  el servidor detecta cuando  solo queda un jugador
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
    // NotificacionHasPerdido()
  }
})
/*
* Autor: Tania Torres Alvarado y Roberto Sagaón H.luz
* Se integra el método que dibuja todas las fichas-hueco en el tablero que se
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

/*
* Autor: Roberto Sagaón, Nicolar Omar Diego
* Se integran los métodos Evaluar y sus respectivos metodos de ayuda para
* realizar recorrido de todas las posiciones a su alrededor y decidir si
* puede comer fichas o si existen 4 o 5 fichas del mismo jugador.
*/

socket.on('recibirTiro', function () {
  EvaluarLineas4()
  console.log('Paso metodo Evaluar Lineas 4')
})

/*
* Autor: Roberto Sagaón, Nicolar Omar Diego
* Se integran los métodos Evaluar y sus respectivos metodos de ayuda para
* realizar recorrido de todas las posiciones a su alrededor y decidir si
* puede comer fichas o si existen 4 o 5 fichas del mismo jugador.
*/
var sumaJ1 = 1
var fichasEneConsecu = 0
var fichasConsecu = 1

var lineasCuatro = [
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y'],
  ['x,y', 'x,y', 'x,y', 'x,y']]

var lineaTemporal = ['', '', '', '']
var posicionesJ1 = [0, 0, 0, 0, 0]

function Evaluar (x, y) {
  lineaTemporal[0] = x + ',' + y
  sumaJ1 = 1
  fichasConsecu = 1
  fichasEneConsecu = 0
  Arriba(x, y)
  fichasEneConsecu = 0
  Abajo(x, y)

  if (fichasConsecu === 5) {
   NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }

  if (fichasConsecu === 4) {
    // console.log("lineaTemporal: " + lineaTemporal[0] + " - " + lineaTemporal[1] + " - " + lineaTemporal[2] + " - " + lineaTemporal[3]);
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

  if (fichasConsecu === 5) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }

  if (fichasConsecu === 4) {
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

  if (fichasConsecu == 5) {
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

  if (fichasConsecu == 5) {
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
  console.log('posicionesJ1: \n' + 'Pos 1: ' + posicionesJ1[0] + ' Pos 2: ' + posicionesJ1[1] + ' Pos 3: ' + posicionesJ1[2] + ' Pos 4: ' + posicionesJ1[3] + ' Pos 5: ' + posicionesJ1[4])

  var ganar = 0
  posicionesJ1.forEach(function (valor) {
    if (valor == 1) {
      ganar++
    }
  })

  if (ganar == 5) {
    NotificacionHasGanado()
    socket.emit('perdedor', { flag: 1 })
  }
}// Fin Evaluar

function EvaluarLineas4 () {
  console.log('Metodo: Evaluar Lineas 4')
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 4; j++) {
      console.log('Matriz: ' + lineasCuatro[i][j])
      if (lineasCuatro[i][j] != 'x,y') {
        console.log('Entre es distinto de x,y')
        console.log('Linea Pasante:' + lineasCuatro[i][j])
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
        console.log('Cuak!: ' + tempXC + tempXD + ' | ' + tempYC + tempYD + ' | ficha id: ' + ficha.id + ' == ' + '0')
        if (ficha.id == 0) {
          console.log('¡¡¡LO BORRO!!! : ' + i)
          posicionesJ1[i] = 0
        }
      }
      // console.log("j"+j);
    }

    // console.log("i"+i);
  }
  console.log('----------------------------')
}

function Arriba (x, y) {
  // console.log(x + " & " + y);
  if (x > 0) {
    // console.log(`${x}${y}`);
    x--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild

    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Arriba: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++

      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x + 1) + 'C' + y).lastChild
        var fichaSig2 = document.getElementById('F' + (x + 2) + 'C' + y).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + (x + 1) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x + 2) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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

function ArribaDerecha (x, y) {
  if (x > 0 && y < 19) {
    y++
    x--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Arriba: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x + 1) + 'C' + (y - 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x + 2) + 'C' + (y - 2)).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + (x + 1) + 'C' + (y - 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x + 2) + 'C' + (y - 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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

function Derecha (x, y) {
  if (y < 19) {
    y++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Arriba: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + x + 'C' + (y - 1)).lastChild
        var fichaSig2 = document.getElementById('F' + x + 'C' + (y - 2)).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + x + 'C' + (y - 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + x + 'C' + (y - 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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

function DerechaAbajo (x, y) {
  if (x < 19 && y < 19) {
    y++
    x++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Arriba: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x - 1) + 'C' + (y - 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x - 2) + 'C' + (y - 2)).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + (x - 1) + 'C' + (y - 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x - 2) + 'C' + (y - 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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

function Abajo (x, y) {
  if (x < 19) {
    x++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Abajo: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++

      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x - 1) + 'C' + y).lastChild
        var fichaSig2 = document.getElementById('F' + (x - 2) + 'C' + y).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + (x - 1) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x - 2) + 'C' + y).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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

function IzquierdaAbajo (x, y) {
  if (x < 19 && y > 0) {
    y--
    x++
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Arriba: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x - 1) + 'C' + (y + 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x - 2) + 'C' + (y + 2)).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + (x - 1) + 'C' + (y + 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x - 2) + 'C' + (y + 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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

function Izquierda (x, y) {
  if (y > 0) {
    y--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Arriba: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + x + 'C' + (y + 1)).lastChild
        var fichaSig2 = document.getElementById('F' + x + 'C' + (y + 2)).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + x + 'C' + (y + 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + x + 'C' + (y + 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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

function IzquierdaArriba (x, y) {
  if (x > 0 && y > 0) {
    y--
    x--
    var ficha = document.getElementById('F' + x + 'C' + y).lastChild
    if (ficha.id == userId && (fichasEneConsecu == 0 || fichasEneConsecu == 2)) {
      sumaJ1 += 1
      if (fichasConsecu <= 4) {
        lineaTemporal[fichasConsecu] = x + ',' + y
        /// console.log("Linea Temporal Arriba: " + lineaTemporal[fichasConsecu]);
      }
      fichasConsecu++
      if (fichasEneConsecu == 2 && sumaJ1 <= 2) {
        sumaJ1 = 0
        var fichaSig1 = document.getElementById('F' + (x + 1) + 'C' + (y + 1)).lastChild
        var fichaSig2 = document.getElementById('F' + (x + 2) + 'C' + (y + 2)).lastChild
        if (fichaSig1.id == fichaSig2.id) {
          ficha = document.getElementById('F' + (x + 1) + 'C' + (y + 1)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
          ficha = document.getElementById('F' + (x + 2) + 'C' + (y + 2)).lastChild
          ficha.style.backgroundColor = 'lightgrey', ficha.id = 0
          socket.emit('pente:comer', { id: ficha.parentNode.id })
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
/*
 *Autor: Josué Zapata
 * Funciones para mostrar el puntaje segun el jugador y su movimiento
 * como por ejemplo, mostrar cuantas fichas comidas por jugador hay
 * y asi mismo cuantas filas de 4.
 *2
 */

function PuntajeComidaJugador1 (comida) {
  document.getElementById('jugador1Comida').textContent = comida
}

function PuntajeFilas4Jugador1 (filas) {
  document.getElementById('jugador1Filas4').textContent = filas
}

function PuntajeComidaJugador2 (comida) {
  document.getElementById('jugador2Comida').textContent = comida
}

function PuntajeFilas4Jugador2 (filas) {
  document.getElementById('jugador2Filas4').textContent = filas
}

/* Autor: Josue Zapata
 *  Funciones SweetAlert, usadas para notificar a los jugadores de como se desarrolla el juego
 */
function NotificacionHasGanado () {
  RecargarPagina()
  console.log()
}

/*  Autor: Josue Zapata
 *  Recargar pagina cuando  hay un ganador
 */

function RecargarPagina () {
  setTimeout(function () { window.location.href = '/' }, 3000)
}

/* $( document ).ready(function() {

  $('#formCantidadJugadores').modal('show')
}); */

$('#formCantidadJugadores').modal({
  backdrop: 'static',
  keyboard: false
})
