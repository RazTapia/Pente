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
		: null;

			//console.log("hola");
			//crearFicha.setAttribute('style','background-color: red;');
			sumaJ1=1;
			sumaJ2=0;
			fichasEneConsecu=0;
			Evaluar(x, y);
		});// Fin  del bloque,Autor: Lucio Nieto Bautista
	}

socket.on('pente:seleccion',function(data){
	var childNode =  document.getElementById(data.id).childNodes;
	childNode[0].setAttribute('style', 'background-color: red;');
	childNode[0].setAttribute('id', '2');
});

/*
* Autor: Roberto Sagaón H.Luz , Nicolar Omar Diego Hernandez
* Se integra metodo para comer fichas y que se actualice en el servidor
*/
socket.on('pente:comeer',function(data){
	var childNode =  document.getElementById(data.id).childNodes;
	childNode[0].setAttribute('style', 'background-color: lightgrey;');
	childNode[0].setAttribute('id', '0');
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

/*
* Autor: Roberto Sagaón H.Luz , Nicolar Omar Diego Hernandez
* Se integran las funciones Evaluar junto con sus funciones necesarias para que realice 
* un recorrido de todas los puntos alrededor de la ficha que se acaba de tirar y se verifique 
* si puede comer fichas, juntar lineas de 4 o la linea ganadora de 5.
*/
var sumaJ1=1;
var sumaJ2=0;
var fichasEneConsecu =0;
var fichasConsecu =1;

var lineaCuatro = new Array(5);
lineaCuatro[0] = new Array(4);
lineaCuatro[1] = new Array(4);
lineaCuatro[2] = new Array(4);
lineaCuatro[3] = new Array(4);
lineaCuatro[4] = new Array(4);

function Evaluar(x, y) {
	sumaJ1=1;
	sumaJ2=0;
	fichasConsecu=1;
	fichasEneConsecu =0;
	Arriba(x,y);
	fichasEneConsecu =0;
	Abajo(x,y);
	console.log(fichasConsecu + " en el eje vertical");


    sumaJ1=1;
	sumaJ2=0;
	fichasConsecu=1;
	fichasEneConsecu =0;
	ArribaDerecha(x,y);	
	fichasEneConsecu =0;
	IzquierdaAbajo(x,y);
	console.log(fichasConsecu + " en el eje inclinado 1");

	sumaJ1=1;
	sumaJ2=0;
	fichasConsecu=1;
	fichasEneConsecu =0;
	Derecha(x,y);
	fichasEneConsecu =0;
	Izquierda(x,y);
	console.log(fichasConsecu + " en el eje horizontal");

	sumaJ1=1;
	sumaJ2=0;
	fichasConsecu=1;
	fichasEneConsecu =0;	
	DerechaAbajo(x,y);
	fichasEneConsecu =0;
	IzquierdaArriba(x,y);
	console.log(fichasConsecu + " en el eje inclinado 2");	
}

function  Arriba(x, y)
{
	//console.log(x + " & " + y);
	if(x>0)
	{
		
		console.log(`${x}${y}`);
		x--;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+(x+1)+"C"+y).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+(x+2)+"C"+y).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
				{
					Arriba(x, y);
				}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			Arriba(x, y);
		}	
	}
}

function  ArribaDerecha(x, y)
{
	if(x>0 && y<19)
	{
		y++;
		x--;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+(x+1)+"C"+(y-1)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+(x+2)+"C"+(y-2)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
				{
					ArribaDerecha(x, y);
				}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			ArribaDerecha(x, y);
		}	
	}	
}

function  Derecha(x, y)
{
	if(y<19)
	{
		y++;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+x+"C"+(y-1)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+x+"C"+(y-2)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
				{
					Derecha(x, y);
				}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			Derecha(x, y);
		}	
	}
}

function  DerechaAbajo(x, y)
{
	if(x<19 && y<19)
	{
		y++;
		x++;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+(x-1)+"C"+(y-1)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+(x-2)+"C"+(y-2)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
				{
					DerechaAbajo(x, y);
				}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			DerechaAbajo(x, y);
		}		
	}	
}

function Abajo(x, y)
{
	if(x<19)
	{
		x++;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+(x-1)+"C"+y).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+(x-2)+"C"+y).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
			{
				Abajo(x, y);
			}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			Abajo(x, y);
		}	
	}
}

function  IzquierdaAbajo(x, y)
{
	if(x<19 && y>0)
	{
		y--;
		x++;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+(x-1)+"C"+(y+1)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+(x-2)+"C"+(y+2)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
			{
				IzquierdaAbajo(x, y);
			}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			IzquierdaAbajo(x, y);
		}	
	}	
}

function  Izquierda(x, y)
{
	if(y>0)
	{
		y--;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+x+"C"+(y+1)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+x+"C"+(y+2)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
				{
					Izquierda(x, y);
				}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			Izquierda(x, y);
		}	
	}	
}

function  IzquierdaArriba(x, y)
{
	if(x>0 && y>0)
	{
		y--;
		x--;
		var ficha = document.getElementById("F"+x+"C"+y).lastChild;
		if(ficha.id == 1 && (fichasEneConsecu == 0 || fichasEneConsecu == 2))
		{
			sumaJ1 += 1;
			fichasConsecu++;
			if (fichasEneConsecu == 2 && sumaJ1 <=2) 
			{
				sumaJ1 = 0;
				ficha = document.getElementById("F"+(x+1)+"C"+(y+1)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
				ficha = document.getElementById("F"+(x+2)+"C"+(y+2)).lastChild;
				ficha.style.backgroundColor = "lightgrey", ficha.id = 0;
				socket.emit('pente:comer',{id:ficha.parentNode.id})
			}
			else
				{
					IzquierdaArriba(x, y);
				}		
		}	
		else if (ficha.id == 2)
		{		
			sumaJ2 += 1;
			fichasEneConsecu++;
			IzquierdaArriba(x, y);
		}		
	}
	
}