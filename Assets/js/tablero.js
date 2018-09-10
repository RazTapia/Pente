/*Funcion activada cuando se termina de cargar el HTML
* Su tarea es dibujar todo el tablero 
* empezando por las filas, y en cada una de estas dibujar sus 20 columnas.
* Al terminar 20 filas se tendrá el tablero dibujado , 30x30 pixeles cuadrados.
* Este metodo funciona sobre el tag <table id="tablero">
*
* Se anexo que se oculta la ultima columna y la ultima fila 
*/
$(document).ready(function () {
	for( var fila=0; fila<20;fila++)
	{
		var currentFila="F"+fila; //Almacena la fila actual
		var crearFila = document.createElement("TR"); 
	    //importante darle id a cada fila para que las columnas se impriman desde la fila 0 a la 20.
	    crearFila.setAttribute("id", currentFila);
	    document.getElementById("tablero").appendChild(crearFila);
	    

		for(var columna=0;columna<20;columna++)
		{
			//Se agrego una ID para cada cuadro que representa su cordenada
			var posicion = "F"+fila+"C"+columna; 
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
	   		document.getElementById(currentFila).appendChild(crearCuadro);
		} 
    }   
});
