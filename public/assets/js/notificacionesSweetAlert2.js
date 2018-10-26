let timerInterval
swal({
  title: 'Auto close alert!',
  html: 'I will close in <strong></strong> seconds.',
  timer: 2000,
  onOpen: () => {
    swal.showLoading()
    timerInterval = setInterval(() => {
      swal.getContent().querySelector('strong')
        .textContent = swal.getTimerLeft()
    }, 100)
  },
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