/******************************* controls *******************************************/
/* Autor: Dr.-Ing. V. Naumburger	                                                  */
/* Datum: 16.10.2022                                                                */
/************************************************************************************/

	

/********************* Basisroutinen **********************/
/*                                                        */
/* - kXi, kYi, iXk, iYk Koordinaten-Transformationen      */
/* - Mouse-handling                             		  */
/*                                                        */
/**********************************************************/

/* Transformation kartesischer in interne Koordinaten bezügl. xi0 und yi0 (in Constants.js deklariert) */
function kXi(a)
	{ /* a ist beliebige kart. Größe */
	  return(a + xi0);
	}

function kYi(b)
	{ /* b ist bel. kart. Größe */
	  return(yi0 - b);
	}

/* Transformation interner in kartesische Koordinaten */
function iXk(a)
	{ /* a ist beliebige interne Größe */
	  return(a - xi0);
	}
  
function iYk(b)
	{ /* b ist bel. interne Größe */
	  return(yi0 - b);
	}

/* Mouse-Routinen */
var mClicked = false;              // Merker für Mausstati
var mPressed = false;
var mReleased = false;
var mDragged = false;

function mouseClicked()
	{  /* der Merker mClick muss nach Gebrauch extern rückgesetzt werden! */
	   mClicked = true;
		 //alert("mouse");
	   //isTouchscreen = false;
	}

function mousePressed()
	{  
	  mPressed = true;              
	  mReleased = false;
	}
 
function mouseReleased()
	{  /* der Merker mReleased muss nach Gebrauch extern rückgesetzt werden! */
	  mReleased = true;
	  mPressed = false;  
	  mClicked = false;
		//console.log("mReleased: "+mReleased+" mPressed: "+mPressed+" mClicked: "+mClicked);
	}

function mouseDragged()
	{  /* der Merker mDragged muss nach Gebrauch extern rückgesetzt werden! */
	  mDragged = true;
	}

