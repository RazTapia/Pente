/*
* Se tuvo que hacer una modificacion a la parte del tablero para darle un ID por que no se pueden agregar las fichas correctamente.
* Se crea un metodo que recibe la cordenada a la cual se quiere colocar la ficha  con los siguientes parametros: int X: la fila & int Y: la columna
*/

$(document).ready(function () {

	for (i = 0; i <= 19; i++) {
		for (j = 0; j <= 19; j++) {
			Ficha(i,j);
		}
	};
	//Metodo que se usa´para colocoar la ficha mediante cordenadas x & y
	function Ficha(x, y) {
		var crearFicha = document.createElement("DIV"); 
		document.getElementById("F"+x+"C"+y).appendChild(crearFicha); 
		crearFicha.classList.add("ficha");
	}//fin metodo: fichas
});