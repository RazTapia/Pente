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
	document.getElementById("F"+x+"C"+y).appendChild(crearFicha); 
	crearFicha.classList.add("ficha");
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
/*
* Autor: Bryan Román
* Se Agrega la funcion de cambio de estados de la ficha por jugador, la funcion utiliza como parametros "x" y "y",
* los estados son determinados por numero de jugador, y se obtienen por cada elemento de id de su respectiva 
* filas y columnas, esto con la finalidad de que se pueda dibujar o ocultar los diferentes 4 estados en el tablero.
*/
 //Se agregua window.onload a la funcion para evitar error y conflictos con las funciones que solo se permite en Principal();
window.onload = function EstadoFicha(x, y){
	/*Definiendo los estados por jugador,es decir, estadoHueco y estado ocupado representan a jugador 1,
		estadoHueco1 y estado ocupado1 representan a jugador 2, y asi sucesivamente*/
	var estadoHueco = document.createElement("DIV"),estadoOcupado = document.createElement("DIV"); 
	var estadoHueco1 = document.createElement("DIV"),estadoOcupado1 = document.createElement("DIV"); 
	var estadoHueco2 = document.createElement("DIV"),estadoOcupado2 = document.createElement("DIV"); 
	var estadoHueco3 = document.createElement("DIV"),estadoOcupado3 = document.createElement("DIV"); 
	
	/*Definiendo los estados por jugador,es decir, por color*/
	estadoHueco.classList.add("fichaHueca"); 
	estadoOcupado.classList.add("fichaOcupada");
	estadoHueco1.classList.add("Aqui va el color de la fichaHueca1"); 
	estadoOcupado1.classList.add("Aqui va el color de la ficha Ocupada o Puesta1"); 
	estadoHueco2.classList.add("Aqui va el color de la fichaHueca2"); 
	estadoOcupado2.classList.add("Aqui va el color de la ficha Ocupada o Puesta2");  
	estadoHueco3.classList.add("Aqui va el color de la fichaHueca3"); 
	estadoOcupado3.classList.add("Aqui va el color de la ficha Ocupada o Puesta3"); 

	/*Tomando elementos de id F y C para cada jugador*/
	document.getElementById("F"+x+"C"+y).appendChild(estadoHueco); 
	document.getElementById("F"+x+"C"+y).appendChild(estadoOcupado); 
	document.getElementById("F"+x+"C"+y).appendChild(estadoHueco1); 
	document.getElementById("F"+x+"C"+y).appendChild(estadoOcupado1); 
	document.getElementById("F"+x+"C"+y).appendChild(estadoHueco2); 
	document.getElementById("F"+x+"C"+y).appendChild(estadoOcupado2); 
	document.getElementById("F"+x+"C"+y).appendChild(estadoHueco3); 
	document.getElementById("F"+x+"C"+y).appendChild(estadoOcupado3); 
}
