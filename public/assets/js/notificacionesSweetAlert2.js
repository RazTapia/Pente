/* Autor: Josue Zapata
 * Funciones SweetAlert, usadas para las notificaciones
 */
function jugadorUnoListo(){
  let timerInterval
  swal({
    title: 'Jugador 1 Listo',
    html: 'Espera a tu oponente<strong></strong> ',
    timer: 3000,
    onClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    if (
      // Read more about handling dismissals
      result.dismiss === swal.DismissReason.timer
    ) {
      console.log('I was closed by the timer')
    }
  })
}

function EmpezarPartida(){
  let timerInterval
  swal({
    title: 'Jugador 2 listo',
    html: 'Empezando partida en <strong></strong> ',
    timer: 10000,
    onOpen: () => {
      swal.showLoading()
      timerInterval = setInterval(() => {
        swal.getContent().querySelector('strong')
          .textContent = swal.getTimerLeft()
      }, 1000)
    },
    onClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    if (
      // Read more about handling dismissals
      result.dismiss === swal.DismissReason.timer
    ) {
      //console.log('I was closed by the timer')
    }
  })
}

function JugadorFuera(){
  let timerInterval
  swal({
    title: 'Has ganado',
    html: 'To oponente se ha salido de la partida<strong></strong> ',
    timer: 10000,
    onClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    if (
      // Read more about handling dismissals
      result.dismiss === swal.DismissReason.timer
    ) {
      //console.log('I was closed by the timer')
    }
  })
}