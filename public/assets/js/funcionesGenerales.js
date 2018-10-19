/*
* Autor: RannFerii
* Su tarea es dibujar todo el tablero
* empezando por las filas, y en cada una de estas dibujar sus 20 columnas.
* Al terminar 20 filas se tendrá el tablero dibujado , 30x30 pixeles cuadrados.
* Este metodo funciona sobre el tag <table id="tablero">
*/

const socket = io()

function Tablero() {
	for( var fila=0; fila<20; fila++) {
		var filaActual="F"+fila; //Almacena la fila actual
		var crearFila = document.createElement("TR");
	    //importante darle id a cada fila para que las columnas se impriman desde la fila 0 a la 20.
	    crearFila.setAttribute("id", filaActual);
	    document.getElementById("tablero").appendChild(crearFila);

		for(var columna=0; columna<20; columna++)	{

			var posicion = "F"+fila+"C"+columna; //Se agrego una ID para cada cuadro que representa su cordenada
			var crearCuadro = document.createElement("TH");
			crearCuadro.classList.add("cuadro");

			    //Se eliminan los bordes dependiendo si es el final de la columna o de la fila
			    if (fila != 19) {
			    	crearCuadro.setAttribute("id", posicion);
			    	if (columna == 19)
		    			crearCuadro.style.borderStyle="hidden hidden hidden none";
			    } else {
			    	crearCuadro.setAttribute("id", posicion);
			    	crearCuadro.style.borderStyle="none hidden hidden hidden";
			    }

			    //Dependiendo de la fila en la que se esta imprimir sus respectivas 20 columnas
		   		document.getElementById(filaActual).appendChild(crearCuadro);
		}
    }
}

/*
* Autor: BacteriaLoki
* Se crea un metodo que recibe la cordenada a la cual se quiere colocar la ficha
* con los siguientes parametros: int X: la fila & int Y: la columna
*/

function Ficha(x, y) {
	var colorUsuario = "black"; //variable que contendrá el color de la ficha según el usuario,  Autor: LucNieto
	let estadoFoo =0; //variable que contendrá el estado actual del hueco; 0 representa vacío y 1 representa ocupado, Autor: LucNieto
	var crearFicha = document.createElement("DIV");
	let idPadre=0;
    document.getElementById("F"+x+"C"+y).appendChild(crearFicha);
	crearFicha.classList.add("ficha");
	crearFicha.setAttribute("id",estadoFoo); //se le asigna un id al hueco para llevar control del estado de la ficha, Autor: LucNieto
	crearFicha.setAttribute("draggable",false);
/*
* Autor: LucNieto
* se obtiene el id del hueco para cambiar el color e indicar que se está seleccionando
* ya sea para el mouseover o el click
*/
	crearFicha.addEventListener('mouseover', () => {
		(crearFicha.id == 0) ? (crearFicha.style.backgroundColor = "grey") : null ; }); // Autor: Lucio Nieto Bautista

	crearFicha.addEventListener('mouseout', () => { (crearFicha.id == 0) ? crearFicha.style.backgroundColor = "lightgrey" : null});// Autor: Lucio Nieto Bautista
		
	crearFicha.addEventListener('mouseup', () => {
		(crearFicha.id == 0) ? ( crearFicha.style.backgroundColor = colorUsuario, crearFicha.id = 1,
			socket.emit('pente:selecion',{ id:crearFicha.parentNode.id}) )//Autor: Tania Torres Alvarado
		: null;});// Fin  del bloque,Autor: Lucio Nieto Bautista
	
	}

socket.on('pente:seleccion',function(data){
	var childNode =  document.getElementById(data.id).childNodes;
	childNode[0].setAttribute('style', 'background-color: red;');
	childNode[0].setAttribute('id', '1');
});

socket.on('timeout:inicio',function(data){
	if(data==1){
	alert("SOLO HAY UN JUGADOR");
	}
});
socket.on('desconectado',function(data){
	if(data==1){
	alert("SE SALIO EL OTRO JUGADOR");
	}
});
/*
* Autor: Tania Torres Alvarado y Roberto Sagaón H.luz
* Se integra el método que dibuja todas las fichas-hueco en el tablero que se
* utilizaran en el juego.
*/

function DibujarFichasTablero() {
    for (let i = 0; i <= 19; i++) {
        for (let j = 0; j <= 19; j++) {
            Ficha(i, j);
        }
    }
}
