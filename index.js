const path = require('path');
const express = require('express');
const app = express();
const socketIO= require('socket.io');
var TOTAL_USERS;
var flag;
//Puerto
app.set('port', process.env.PORT || 3000);

//Routeo
app.get('/', function(req, res) {

  res.sendFile(path.join(__dirname,'public','login.html'));
  });

  app.get('/juego',function(req,res)
  {  
    if(TOTAL_USERS==2){ 
      res.redirect('/error');
   
    }else{
      console.log('juego '+ TOTAL_USERS);
       res.sendFile(path.join(__dirname,'public','index.html'));
    }
  });
  app.get('/error', function(req, res){
    res.sendFile(path.join(__dirname,'public','error.html'));
  });

//Static
app.use(express.static(path.join(__dirname,'public')));
//test
//Inicializa servidor

const server = app.listen(app.get('port'),() =>{
    console.log('server on port', app.get('port'));
});

//websockets
const io=socketIO(server);

io.on('connection',(socket) => {
    console.log("Nueva conexion", socket.id);  
    TOTAL_USERS=io.engine.clientsCount;
    if(TOTAL_USERS==1){
      socket.emit('timeout:inicio', TOTAL_USERS);    
    }
    console.log(TOTAL_USERS);
    if(io.engine.clientsCount==2){
      socket.broadcast.emit('totaljugadores', TOTAL_USERS);    
    }
    socket.on('disconnect', ()=>{
      TOTAL_USERS=io.engine.clientsCount;
      socket.broadcast.emit('desconectado', TOTAL_USERS);
  })
  
  socket.on('pente:selecion',(data) => {
    socket.broadcast.emit('pente:seleccion', data);
  })

  socket.on('pente:comer',(data) => {
    socket.broadcast.emit('pente:comeer', data);
  })
});

