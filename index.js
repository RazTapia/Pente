/* eslint-env mocha */
const path = require('path')
const express = require('express')
const app = express()
const socketIO = require('socket.io')
var TOTAL_USERS
var USERS=1; /*En esta variable se guardará la cantidad de usuarios permitidos */ 
var USER_ARRAY = new Array();
var flagInicioJuego;

// Puerto
app.set('port', process.env.PORT || 3000)

// Routeo
app.get('/', function (req, res) {
  if (TOTAL_USERS === USERS) {
    res.redirect('/error')
  } else {
    console.log('juego ' + TOTAL_USERS)
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  }
})

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

// websockets
const io = socketIO(server)

io.on('connection', (socket) => {
  console.log('Nueva conexion', socket.id)
  TOTAL_USERS = io.engine.clientsCount
  io.to(socket.id).emit('setPlayers',TOTAL_USERS)

  if (TOTAL_USERS === 1) {
    socket.emit('jugador1', TOTAL_USERS)
    USER_ARRAY[0]=socket.id
    io.to(USER_ARRAY[0]).emit('setScore',TOTAL_USERS)

  }

  if (TOTAL_USERS === 2) {
    USER_ARRAY[1]=socket.id
    io.to(USER_ARRAY[0]).emit('setScore',TOTAL_USERS)
    io.to(USER_ARRAY[1]).emit('setScore',TOTAL_USERS)
  }

  if (TOTAL_USERS === 3) {
    USER_ARRAY[2]=socket.id
    io.to(USER_ARRAY[0]).emit('setScore',TOTAL_USERS)
    io.to(USER_ARRAY[1]).emit('setScore',TOTAL_USERS)
    io.to(USER_ARRAY[2]).emit('setScore',TOTAL_USERS)
  }

  if (TOTAL_USERS === 4) {
    USER_ARRAY[3]=socket.id
    io.to(USER_ARRAY[0]).emit('setScore',TOTAL_USERS)
    io.to(USER_ARRAY[1]).emit('setScore',TOTAL_USERS)
    io.to(USER_ARRAY[2]).emit('setScore',TOTAL_USERS)
    io.to(USER_ARRAY[3]).emit('setScore',TOTAL_USERS)
  }

  socket.on('disconnect', () => {
    TOTAL_USERS = io.engine.clientsCount
    socket.broadcast.emit('desconectado', TOTAL_USERS)
  })
/*
* Autor: Tania Torres Alvarado
* En este metodo recibe lo obtenido en el formulario formCantidadJugadores
* y le asigna a una variable global del servidor de cuantos seran la partida;
*/
  socket.on('cantidadJugadores', (users) => {
    USERS=users;
    flagInicioJuego=1;
  })

  socket.on('pente:seleccion', (data) => {
    socket.broadcast.emit('pente:seleccion', data)
  })

  socket.on('pente:comer', (data) => {
    socket.broadcast.emit('pente:comeer', data)
  })

  socket.on('pasarTiro', () => {
    console.log('Servidor Metodo Evaluar Lineas 4')
    socket.broadcast.emit('recibirTiro')
  })

  socket.on('perdedor', function (data) {
    socket.broadcast.emit('perdedor', data)
  })

  if(TOTAL_USERS==USERS&& flagInicioJuego==1){
   
    io.to(USER_ARRAY[0]).emit('turno',flagInicioJuego);
  }//endif

  socket.on('siguienteTurno', function (data) {
    if(data==TOTAL_USERS){
      io.to(USER_ARRAY[0]).emit('turno',flagInicioJuego);
    }else{
    io.to(USER_ARRAY[data]).emit('turno',flagInicioJuego);
    }
  })
})

