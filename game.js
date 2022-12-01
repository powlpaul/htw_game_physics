/* GTAT2 Game Technology & Interactive Systems */
/* Autor: Paul Klingberg, 575868*/
/* Übung Nr. 2*/
/* Datum: 2022-10-19*/

/* declarations */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var M;                                                     // Maßstab [pixel/meter]
var xi0, yi0;                                              // Koordinatenursprung intern

var playGroundWidth = 1.6;                                 // Spielfeldgröße [m]
var playGroundHeight = 0.2;                                // Höhe des Spielfeldbodens [m]
var seesawDistance = 1;
var seesawAngle = 20;
var seesawLength = 0.25;
var seesawTriangleOffset = 0.07;
var seesawTriangleSideLength = 0.025;
var edgeDistance = 0.6;

/* prepare program */
function setup() {
    createCanvas(windowWidth, windowHeight);
}

/* run program */
function draw() {
    background(255);
    strokeWeight(1.5);
    stroke ('black');

    M = 0.9 * windowWidth / playGroundWidth;               // Maßstab bezügl. 90% Spielfeldgröße
    xi0 = 0.5 * windowWidth;                               // Koordinatenursprung festlegen
    yi0 = 0.9 * windowHeight;

    /* administration */

    /* calculation */

    /* display */
    push();                                                // neues Koord.system kreieren
    translate(xi0, yi0);                                   // Koordinatenursprung festlegen
    scale(1, -1);                                          // y-Achse spiegeln
        // Boden
        fill('#ba8f29');
        rect(-0.75 * M, 0, 1.5 * M, -0.20 * M);
       
        // Cochonnet
        fill('pink');
        circle(0, 0.02 * M,0.04 * M);
    
        // Spielfeldrand
        fill('red');
        rect(-0.5 * edgeDistance * M, 0, 0.04 * M, -0.01 * M);
        rect(0.5 * edgeDistance * M, 0, 0.04 * M, -0.01 * M);
    
        // Wippen Dreiecke
        fill('blue');
        var triangleHeight = Math.sin(degrees_to_radians(seesawAngle)) * seesawLength/2;
        var triangleSide = 2 * triangleHeight / Math.sqrt(3);
        triangle((-seesawDistance/2 - triangleSide /2) * M, 0, (-seesawDistance/2) * M, (triangleHeight) * M, (-seesawDistance/2 + triangleSide /2) * M, 0);
        triangle((seesawDistance/2 - triangleSide /2) * M, 0, (seesawDistance/2) * M, (triangleHeight) * M, (seesawDistance/2 + triangleSide /2) * M, 0);
    
        // Wippen Linien
        strokeWeight(6);
        stroke ('blue');
        line ((-seesawDistance/2 - seesawLength/2) * M, triangleHeight * M, (-seesawDistance/2 + seesawLength/2) * M, triangleHeight * M);
        line ((seesawDistance/2 - seesawLength/2) * M, triangleHeight * M, (seesawDistance/2 + seesawLength/2) * M, triangleHeight * M);
    
        // Wippen Dreiecke 
        strokeWeight(1.5);
        var seesawTriangleHeight = 0.5 * seesawTriangleSideLength * Math.sqrt(3);
        triangle((-seesawDistance/2 - seesawTriangleOffset - seesawTriangleSideLength/2) * M, triangleHeight * M, (-seesawDistance/2 - seesawTriangleOffset) * M, (triangleHeight + seesawTriangleHeight) * M, (-seesawDistance/2 - seesawTriangleOffset + seesawTriangleSideLength/2) * M, triangleHeight * M);
        triangle((seesawDistance/2 + seesawTriangleOffset - seesawTriangleSideLength/2) * M, triangleHeight * M, (seesawDistance/2 + seesawTriangleOffset) * M, (triangleHeight + seesawTriangleHeight) * M, (seesawDistance/2 + seesawTriangleOffset + seesawTriangleSideLength/2) * M, triangleHeight * M);
    
        // Bool links
        stroke ('black');
        fill('grey');
        textAlign(CENTER, CENTER);
        textSize(0.015 * windowWidth);
        circle((-seesawDistance/2 - seesawTriangleOffset - seesawTriangleSideLength/2 - 0.015) * M, (triangleHeight + 0.02) * M, 0.04 * M);
        fill('black');
        text('Γ', (-seesawDistance/2 - seesawTriangleOffset - seesawTriangleSideLength/2 - 0.015) * M, (triangleHeight + 0.02) * M);
    
        // Bool rechts
        stroke ('black');
        fill('grey');
        circle((seesawDistance/2 + seesawTriangleOffset + seesawTriangleSideLength/2 + 0.015) * M, (triangleHeight + 0.02) * M, 0.04 * M);
        textAlign(CENTER, CENTER);
        textSize(0.015 * windowWidth);
        fill('black');
        text('ᖉ', (seesawDistance/2 + seesawTriangleOffset + seesawTriangleSideLength/2 + 0.015) * M, (triangleHeight + 0.02) * M);
    pop();
}

/* isr */
function windowResized() {                      /* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}