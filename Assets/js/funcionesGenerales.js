/*
* Autor: RannFerii
* Su tarea es dibujar todo el tablero 
* empezando por las filas, y en cada una de estas dibujar sus 20 columnas.
* Al terminar 20 filas se tendrá el tablero dibujado , 30x30 pixeles cuadrados.
* Este metodo funciona sobre el tag <table id="tablero">
*/

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
	var crearFicha = document.createElement("DIV"); 
	let hueco = `${x}hueco${y}`; //variable que contendá la posición del puntero sobre el hueco actual, Autor: LucNieto
	document.getElementById("F"+x+"C"+y).appendChild(crearFicha); 
	crearFicha.classList.add("ficha");
	crearFicha.setAttribute("id",hueco); //se le asigna un id al hueco para llevar control de la posición, Autor: LucNieto

/*
* Autor: LucNieto
* se obtiene el id del hueco para cambiar el la opacida para indicar que se está seleccionando,
* ya sea para el onmouseover o el onclick
*/
	crearFicha.addEventListener('mouseover', (hueco) => {  document.getElementById(hueco.path[0].id).style.opacity = "0.5"; }); // Autor: Lucio Nieto Bautista 

	crearFicha.addEventListener('mouseout', (hueco) => { document.getElementById(hueco.path[0].id).style.opacity = "1"; });// Autor: Lucio Nieto Bautista 

	crearFicha.addEventListener('click', (hueco) => { 
		let pos = document.getElementById(hueco.path[0].id);	
		pos.style.opacity = "1";
		pos.style.backgroundColor = "black"; 
	});// Fin  del bloque,Autor: Lucio Nieto Bautista 
}

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

