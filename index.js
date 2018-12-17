/* eslint-env mocha */
const path = require('path')
const express = require('express')
const app = express()
const socketIO = require('socket.io')
var TOTAL_USERS
var USERS = 4 /* En esta variable se guardará la cantidad de usuarios permitidos */
var USER_ARRAY = []
var flagInicioJuego
var TIEMPO
var TIEMPO_ESPERA_SALA = 60
var TIEMPO_INICIAR_JUEGO = 3
var DETENER_TIEMPO_TURNO = false
var fichasComidas = [0, 0, 0, 0]

// Puerto
/**
 * @author Tania Torres
 * @param process.env.PORT
 * @description asigna el puerto actual o el 3000 por defecto
*/
app.set('port', process.env.PORT || 3000)

/**
 * @author Tania Torres
 * @callback app.get()
 * @param {middleware function} req
 * @param {middleware function} res
 * @description escucha en la ruta / y recibe una función anónima.
 */
app.get('/', function (req, res) {
  if (TOTAL_USERS === USERS) {
    res.redirect('/error')
  } else {
    console.log('juego ' + TOTAL_USERS)
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  }
})

/**
 * @author Tania Torres
 * @callback app.get()
 * @description ruta de error definida esperando a ser llamada
 */
app.get('/error', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'error.html'))
})

// Static
app.use(express.static(path.join(__dirname, 'public')))
// test
// Inicializa servidor

const server = app.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'))
})

/**
 * @author Tania Torres
 * @param server
 * @description instancia del socket, controla la cantidad de conexiones según el número de usuarios conectados
 */

const io = socketIO(server)

io.on('connection', (socket) => {
  console.log('Nueva conexion', socket.id)
  TOTAL_USERS = io.engine.clientsCount
  io.to(socket.id).emit('setPlayers', TOTAL_USERS)

  if (TOTAL_USERS === 1) {
    clearInterval(TIEMPO)
    socket.emit('jugador1', TOTAL_USERS)
    USER_ARRAY[0] = socket.id
    io.to(USER_ARRAY[0]).emit('setScore', TOTAL_USERS)
  }

  if (TOTAL_USERS === 2) {
    USER_ARRAY[1] = socket.id
    socket.emit('jugador2', TOTAL_USERS)
    io.to(USER_ARRAY[0]).emit('setScore', TOTAL_USERS)
    io.to(USER_ARRAY[1]).emit('setScore', TOTAL_USERS)
  }

  if (TOTAL_USERS === 3) {
    USER_ARRAY[2] = socket.id
    socket.emit('jugador3', TOTAL_USERS)
    io.to(USER_ARRAY[0]).emit('setScore', TOTAL_USERS)
    io.to(USER_ARRAY[1]).emit('setScore', TOTAL_USERS)
    io.to(USER_ARRAY[2]).emit('setScore', TOTAL_USERS)
  }

  if (TOTAL_USERS === 4) {
    USER_ARRAY[3] = socket.id
    socket.emit('jugador4', TOTAL_USERS)
    io.to(USER_ARRAY[0]).emit('setScore', TOTAL_USERS)
    io.to(USER_ARRAY[1]).emit('setScore', TOTAL_USERS)
    io.to(USER_ARRAY[2]).emit('setScore', TOTAL_USERS)
    io.to(USER_ARRAY[3]).emit('setScore', TOTAL_USERS)
  }

  if (TOTAL_USERS == USERS) {
    RecargarTiempo()
    clearInterval(TIEMPO)
    TiempoIniciarJuego()
  }

  socket.on('disconnect', () => {
    TOTAL_USERS = io.engine.clientsCount
    socket.broadcast.emit('desconectado', TOTAL_USERS)
  })

  /**
 * @author Tania Torres
 * @callback socket.on()
 * @param {class} formCantidadJugadores
 * @description En este metodo recibe lo obtenido en el formulario formCantidadJugadores
 * y le asigna a una variable global del servidor de cuantos seran la partida
 */
  socket.on('cantidadJugadores', (users) => {
    USERS = users
    flagInicioJuego = 1
    RecargarTiempo()
    clearInterval(TIEMPO)
    TiempoEmpezarSala()
    console.log('Cantidad de jugadores máxima', users)
  })

  /**
 * @author Josue Zapata
 * @callback setInterval
 * @description Lleva el control sobre tiemer, cuando empezar al igual que el tiempo de espera
 */
  function TiempoEmpezarSala () {
    TIEMPO = setInterval(
      function () {
        if (TIEMPO_ESPERA_SALA >= 0) {
          EnviarATodos('notificacionEsperarSala', TIEMPO_ESPERA_SALA)
          TIEMPO_ESPERA_SALA--
        } else {
          clearInterval(TIEMPO)
          TiempoIniciarJuego()
        }
        console.log('Tiempo de llenado de sala', TIEMPO_ESPERA_SALA)
      }, 1000
    )
  }

  /**
 * @author Josue Zapata
 * @callback setInterval
 * @description Lleva el control sobre tiempo para iniciar la partida
 */

  function TiempoIniciarJuego () {
    TIEMPO = setInterval(
      function () {
        if (TIEMPO_INICIAR_JUEGO >= 0) {
          EnviarATodos('notificacionIniciarJuego', TIEMPO_INICIAR_JUEGO)
          TIEMPO_INICIAR_JUEGO--
        } else {
          clearInterval(TIEMPO)
          IniciarJuego()
        }
        console.log('Tiempo para iniciar el juego', TIEMPO_INICIAR_JUEGO)
      }, 1000
    )
  }

  /**
 * @author Josue Zapata
 * @description Sirve para iniciar el juego una vez terminado el contador de 3s de inicio de partida
 */
  function IniciarJuego () {
    io.to(USER_ARRAY[0]).emit('turno', flagInicioJuego)
  }

  /**
 * @author
 * @description Reinicia los valores del timer
 */
  function RecargarTiempo () {
    TIEMPO_ESPERA_SALA = 60
    TIEMPO_INICIAR_JUEGO = 3
    DETENER_TIEMPO_TURNO = false
  }

  /**
 * @author
 * @description Emite un mensaje para todos los clientes
 */
  function EnviarATodos (metodo, tiempo) {
    for (var i = 0; i <= USER_ARRAY.length; i++) {
      io.to(USER_ARRAY[i]).emit(metodo, tiempo)
    }
  }

  socket.on('pente:seleccion', (data) => {
    socket.broadcast.emit('pente:seleccion', data)
  })

  socket.on('pente:comer', (data) => {
    socket.broadcast.emit('pente:comeer', data)
  })

  socket.on('pasarTiro', () => {
    socket.broadcast.emit('recibirTiro')
  })

  socket.on('perdedor', () => {
    DETENER_TIEMPO_TURNO = true
    socket.broadcast.emit('perdedor')
  })

  /*
  if (TOTAL_USERS == USERS && flagInicioJuego == 1) {
    io.to(USER_ARRAY[0]).emit('turno', flagInicioJuego)
  }
  */

  socket.on('siguienteTurno', function (data) {
    if (data == TOTAL_USERS && DETENER_TIEMPO_TURNO == false) {
      io.to(USER_ARRAY[0]).emit('turno', flagInicioJuego)
    } else if (DETENER_TIEMPO_TURNO == false) {
      io.to(USER_ARRAY[data]).emit('turno', flagInicioJuego)
    }
  })

  socket.on('saberTurno', function (data) {
    EnviarATodos('saberTurno', data)
  })

  /**
 * @author Nicolas Omar
 * @callback totalPuntajeComer
 * @description En este metodo se manda el total de usuarios en partida y se actualizan los puntajes de los jugadores
 */

  socket.on('totalPuntajeComer', (data) => {
    socket.broadcast.emit('totalJugadores', USERS)
    if (data[0] === 1) {
      fichasComidas[0] = data[1]
    }
    if (data[0] === 2) {
      fichasComidas[1] = data[1]
    }
    if (data[0] === 3) {
      fichasComidas[2] = data[1]
    }
    if (data[0] === 4) {
      fichasComidas[3] = data[1]
    }
    socket.broadcast.emit('actualizarPuntaje', fichasComidas)
  })
})
