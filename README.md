 # Bienvenido al juego PENTE #

**Estándares de codificación:**

-Todos los nombres de variables y métodos se escriben en espaniol

-Las variables tendran la nomenclatura Lower Camel Case y se documentaran lateralmente ejemplo:

>var nombreCompleto; //Esta variable almacena el nombre completo del usuario 

-Al incio de cada archivo comentar su funcion, la inicializacion del bloque de comentario dependera del archivo (js, css, html)


> 	Bloque de comentario 
>	--Descripcion del archivo 
>	css y js    /*		Comentario css & JS 	*/
>	html	    <!--   comentario  html       -->


-Los métodos se comentan al inicio y al terminar, se utilizara 1 tabulador de 4 espacios, los nombres  inician  en mayúsculas .
Ejemplo

>    //Método que calcula la edad del usuario
>    class CalcularEdadUsuario(){
>		/*Codigo*/
>   }//Fin CalcularEdadUsuario


##Documentar referencias##

Se documentaran las refencias y que uso se le dio al final de cada archivo:

Referencias:
-https://brainking.com/es/GameRules?tp=38  se utilizó para conocer las reglas del juego.

##para correr las pruebas unitarias se usa el siguiente comando 
```js
./node_modules/mocha/bin/mocha
```
claro, antes se debe correr el comando
```js
npm install
```

 #Sugerencia
 Para llevar un mejor estándar en la s buenas prácticas, se puede utilizar el módulo ESLint con base en airbnb,  google o standard.
 Y para la documentación, jsdoc