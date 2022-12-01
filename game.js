/* GTAT2 Game Technology & Interactive Systems */
/* Autor: Paul Klingberg, 575868*/
/* Übung Nr. 3*/
/* Datum: 2022-10-31*/

/* declarations */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var M;                                                     // Maßstab [pixel/meter]
var xi0, yi0;                                              // Koordinatenursprung intern

var playGroundWidth = 1.6;                                 // Spielfeldgröße [m]
var playGroundHeight = 0.07;                               // Höhe des Spielfeldbodens [m]
var seesawDistance = 1;                                    // Entfernung der Wippe vom Zentrum [m]
var seesawAngle = 20;                                      // Start-Winkel der Wippen [grad]
var seesawLength = 0.25;                                   // Länge der Wippen [m]
var seesawThickness = 0.0075;                              // Dicke der Wippen [m]
var seesawTriangleOffset = 0.07;                           // Verschiebung des Wippen-Dreiecks vom Zentrum der Wippen [m]
var seesawTriangleSideLength = 0.025;                      // Seitenlänge des Wippen-Dreiecks [m]
var triangleHeight;                                        // Höhe des Dreiecks unter der Wippe (wird berechnet) [m]
var edgeDistance = 0.6;                                    // Entfernung des Spielfeldrands vom Zentrum [m]
var edgeBlockHeight = 0.01;                                // Höhe des Spielfeldrandanzeigers [m]
var edgeBlockWidth = 0.04;                                 // Breite des Spielfeldrandanzeigers [m]
var cochonnetDiameter = 0.04;                              // Durchmesser des Cochonnet [m]
var bouleDiameter = 0.04;                                  // Durchmesser des Boule [m]
var buttonPosX = canvasWidth * 0.85;                       // Button Position X [pixel]
var buttonPosY = canvasHeight * 0.9;                       // Button Position Y [pixel]
var buttonSizeX = canvasWidth * 0.12;                      // Button Breite [pixel]
var buttonSizeY = canvasWidth * 0.04;                      // Button Höhe [pixel]
var gameStarted = false;                                   // Ob das Spiel gestartet wurde
var mouseStartY = 0;                                       // Wo sich die Maus beim Klick auf die Wippe befunden hatte [pixel]
var mouseDeltaY = 0;                                       // Wo sich die Maus nun befindet [pixel]
var seesawRightMousePressed = false;                       // Ob die rechte Wippe geklickt wurde
var seesawLeftMousePressed = false;                        // Ob die linke Wippe geklickt wurde
var seesawAngleRight = degrees_to_radians(seesawAngle);    // Winkel der rechten Wippe [rad]
var seesawAngleLeft = degrees_to_radians(-seesawAngle);    // Winkel der linken Wippe [rad]

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
    yi0 = 0.75 * windowHeight;

    /* administration */

    // Start/Rest-Button
    rectMode(CENTER);
    fill('Orange');
    rect(buttonPosX, buttonPosY, buttonSizeX, buttonSizeY, windowWidth * 0.012);
    fill('white');
    textSize(windowWidth * 0.025);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    if(gameStarted === false) {
        text('START', buttonPosX, buttonPosY);
    } else {
        text('RESET', buttonPosX, buttonPosY);
    }
    strokeWeight(1.5);
    if(mClicked && mouseInRange(buttonPosX, buttonPosY, buttonSizeX, buttonSizeY)) {
        if (gameStarted === false) gameStarted = true;
        else gameStarted = false;
        mClicked = false;
    }

    // Mouse Dragging Right
    if(mPressed && mouseInRangeCircular(toCanvasCoords((seesawDistance/2 + seesawLength/2) * M, (triangleHeight + seesawThickness/2) * M).x, toCanvasCoords(seesawDistance/2 * M, (triangleHeight * 2 + seesawThickness/2) * M).y, windowWidth * 0.015)) {
        seesawRightMousePressed = true;
        mouseStartY = mouseY;
        mPressed = false;
    }

    if (seesawRightMousePressed) {
        push();
            noFill();
            stroke(0, 0, 255);
            ellipse(mouseX, mouseY, 20);
        pop();

        mouseDeltaY = -(mouseY - mouseStartY);
        seesawAngleRight = degrees_to_radians(seesawAngle + (mouseDeltaY / 2));

        if (seesawAngleRight < degrees_to_radians(-seesawAngle)) seesawAngleRight = degrees_to_radians(-seesawAngle);
        if (seesawAngleRight > degrees_to_radians(seesawAngle)) seesawAngleRight = degrees_to_radians(seesawAngle);
    }

    if (seesawRightMousePressed&& mReleased) {
        mouseDeltaY = 0;
        seesawAngleRight = degrees_to_radians(seesawAngle);
        seesawRightMousePressed = false;
        mReleased = false;
    }

    // Mouse Dragging Left
    if(mPressed && mouseInRangeCircular(toCanvasCoords(-(seesawDistance/2 + seesawLength/2) * M, (triangleHeight + seesawThickness/2) * M).x, toCanvasCoords(seesawDistance/2 * M, (triangleHeight * 2 + seesawThickness/2) * M).y, windowWidth * 0.015)) {
        seesawLeftMousePressed = true;
        mouseStartY = mouseY;
        mPressed = false;
    }

    if (seesawLeftMousePressed) {
        push();
            noFill();
            stroke(0, 0, 255);
            ellipse(mouseX, mouseY, 20);
        pop();

        mouseDeltaY = -(mouseY - mouseStartY);
        seesawAngleLeft = degrees_to_radians(-seesawAngle - (mouseDeltaY / 2));

        if (seesawAngleLeft < degrees_to_radians(-seesawAngle)) seesawAngleLeft = degrees_to_radians(-seesawAngle);
        if (seesawAngleLeft > degrees_to_radians(seesawAngle)) seesawAngleLeft = degrees_to_radians(seesawAngle);
    }

    if (seesawLeftMousePressed && mReleased) {
        mouseDeltaY = 0;
        seesawAngleLeft = degrees_to_radians(-seesawAngle);
        seesawLeftMousePressed = false;
        mReleased = false;
    }

    /* calculation */

    /* display */
    rectMode(CORNER);
    push();                                                // neues Koord.system kreieren
        translate(xi0, yi0);                                   // Koordinatenursprung festlegen
        scale(1, -1);                                          // y-Achse spiegeln
        // Boden
        fill('#ba8f29');
        rect(-0.5 * playGroundWidth * M, 0, playGroundWidth * M, -playGroundHeight * M);
       
        // Cochonnet
        fill('pink');
        circle(0, cochonnetDiameter/2 * M,cochonnetDiameter * M);
    
        // Spielfeldrand
        fill('red');
        rect(-0.5 * edgeDistance * M, 0, -edgeBlockWidth * M, -edgeBlockHeight * M);
        rect(0.5 * edgeDistance * M, 0, edgeBlockWidth * M, -edgeBlockHeight * M);
    
        // Wippenbasis Dreiecke
        fill('blue');
        triangleHeight = Math.sin(degrees_to_radians(seesawAngle)) * seesawLength/2;
        let triangleSide = 2 * triangleHeight / Math.sqrt(3);
        triangle((-seesawDistance/2 - triangleSide /2) * M, 0, (-seesawDistance/2) * M, (triangleHeight) * M, (-seesawDistance/2 + triangleSide /2) * M, 0);
        triangle((seesawDistance/2 - triangleSide /2) * M, 0, (seesawDistance/2) * M, (triangleHeight) * M, (seesawDistance/2 + triangleSide /2) * M, 0);
    
        // Wippe links
        rectMode(CENTER);
        let seesawTriangleHeight = 0.5 * seesawTriangleSideLength * Math.sqrt(3);
        push();
            translate(-seesawDistance/2 * M, (triangleHeight + seesawThickness/2) * M);
            rotate(seesawAngleLeft);
            rect(0, 0, seesawLength * M, seesawThickness * M);
            triangle((-seesawTriangleOffset - seesawTriangleSideLength/2) * M, seesawThickness/2 * M,
                -seesawTriangleOffset * M, (seesawThickness/2 + seesawTriangleHeight) * M,
                (-seesawTriangleOffset + seesawTriangleSideLength/2) * M, seesawThickness/2 * M);
        pop();

        // Wippe rechts
        push();
            translate(seesawDistance/2 * M, (triangleHeight + seesawThickness/2) * M);
            rotate(seesawAngleRight);
            rect(0, 0, seesawLength * M, seesawThickness * M);
            triangle((seesawTriangleOffset - seesawTriangleSideLength/2) * M, seesawThickness/2 * M,
                seesawTriangleOffset * M, (seesawThickness/2 + seesawTriangleHeight) * M,
                (seesawTriangleOffset + seesawTriangleSideLength/2) * M, seesawThickness/2 * M);
        pop();
        rectMode(CORNER);

        // Boule links
        stroke ('black');
        fill('grey');
        textAlign(CENTER, CENTER);
        textSize(0.015 * windowWidth);
        circle((-seesawDistance/2 - seesawTriangleOffset - seesawTriangleSideLength/2 - 0.015) * M, (triangleHeight * 2 + bouleDiameter/2) * M, bouleDiameter * M);
        fill('black');
        text('Γ', (-seesawDistance/2 - seesawTriangleOffset - seesawTriangleSideLength/2 - 0.015) * M, (triangleHeight * 2  + bouleDiameter/2) * M);
    
        // Boule rechts
        stroke ('black');
        fill('grey');
        circle((seesawDistance/2 + seesawTriangleOffset + seesawTriangleSideLength/2 + 0.015) * M, (triangleHeight * 2  + bouleDiameter/2) * M, bouleDiameter * M);
        textAlign(CENTER, CENTER);
        textSize(0.015 * windowWidth);
        fill('black');
        text('ᖉ', (seesawDistance/2 + seesawTriangleOffset + seesawTriangleSideLength/2 + 0.015) * M, (triangleHeight * 2  + bouleDiameter/2) * M);
    pop();
}

/* isr */
function windowResized() {                      /* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}

function degrees_to_radians(degrees) {
  let pi = Math.PI;
  return degrees * (pi/180);
}

function toCartesianCoords(posX, posY) {
    return {
        x: posX - xi0,
        y: -posY - yi0
    };
}

function toCanvasCoords(posX, posY) {
    return {
        x: posX + xi0,
        y: -posY + yi0
    };
}

function mouseInRange(areaPosX, areaPosY, areaSizeX, areaSizeY) {
    return mouseX > areaPosX - areaSizeX/2
        && mouseX < areaPosX + areaSizeX/2
        && mouseY > areaPosY - areaSizeY/2
        && mouseY < areaPosY + areaSizeY/2;
}

function mouseInRangeCircular(areaPosX, areaPosY, radius) {
    let deltaX = Math.abs(mouseX-areaPosX);
    let deltaY = Math.abs(mouseY-areaPosY);
    return Math.sqrt(deltaX * deltaX  + deltaY * deltaY) < radius;
}