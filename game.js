/* GTAT2 Game Technology & Interactive Systems */
/* Autor: Paul Klingberg, 575868*/
/* Übung Nr. 5*/
/* Datum: 2022-11-15*/

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
var edgeDistance = 0.6;                                    // Entfernung des Spielfeldrands vom Zentrum [m]
var edgeBlockHeight = 0.01;                                // Höhe des Spielfeldrandanzeigers [m]
var edgeBlockWidth = 0.04;                                 // Breite des Spielfeldrandanzeigers [m]
var cochonnetDiameter = 0.04;                              // Durchmesser des Cochonnet [m]
var bouleDiameter = 0.04;                                  // Durchmesser des Boule [m]
var buttonPosX = canvasWidth * 0.85;                       // Button Position X [pixel]
var buttonPosY = canvasHeight * 0.9;                       // Button Position Y [pixel]
var buttonSizeX = canvasWidth * 0.12;                      // Button Breite [pixel]
var buttonSizeY = canvasWidth * 0.04;                      // Button Höhe [pixel]
var mouseStartY = 0;                                       // Wo sich die Maus beim Klick auf die Wippe befunden hatte [pixel]
var mouseDeltaY = 0;                                       // Wo sich die Maus nun befindet [pixel]

/* derived variables */
var triangleHeight= Math.sin(degrees_to_radians(seesawAngle)) * seesawLength/2; // Höhe des Dreiecks unter der Wippe (wird berechnet) [m]
var seesawAngleRight = degrees_to_radians(seesawAngle);    // Winkel der rechten Wippe [rad]
var seesawAngleRightControl = seesawAngleRight;
var seesawAngleLeft = degrees_to_radians(-seesawAngle);    // Winkel der linken Wippe [rad]
var seesawAngleLeftControl = seesawAngleLeft;
var seesawTriangleHeight = 0.5 * seesawTriangleSideLength * Math.sqrt(3);

/* game state */
var gameTime, frameTime;                                   // Zeit und Zeitincrement [s]
var frmRate = 60;                                          // Bildwechselrate [frames/s]
var seesawLeftForce = 0;                                   // Kraft, die die linke Wippe auf den Ball auswirkt [N]
var seesawLeftTimeStart = 0;                               // Zeit, seit der linke Boule geworfen wurde [s]
var seesawRightForce = 0;                                  // Kraft, die die rechte Wippe auf den Ball auswirkt [N]
var seesawRightTimeStart = 0;                              // Zeit, seit der rechte Boule geworfen wurde [s]
var gameState = "stopped"                                  // State Machine für den Spielstatus
var bouleLeftState = "onSeesaw";                           // State Machine für den linken Boule
var bouleRightState = "onSeesaw";                          // State Machine für den rechten Boule
var seesawRightMousePressed = false;                       // Ob die rechte Wippe geklickt wurde
var seesawLeftMousePressed = false;                        // Ob die linke Wippe geklickt wurde

/* prepare program */
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(frmRate);                                    // Setzen der Bildwechselrate
    frameTime = 1/frmRate;                                 // Zeitincrement mit Bildwechsel synchron
    gameTime = 0;
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
    switch (gameState) {
        case "started":
            text('RESET', buttonPosX, buttonPosY);
            break;
        case "stopped":
            text('START', buttonPosX, buttonPosY);
            break;
    }
    strokeWeight(1.5);
    if(mPressed && mouseInRange(buttonPosX, buttonPosY, buttonSizeX, buttonSizeY)) {
        switch (gameState) {
            case "started":
                gameState = "stopped";
                bouleLeftState = "onSeesaw";
                bouleRightState = "onSeesaw";
                seesawAngleLeftControl = seesawAngleLeft;
                seesawAngleRightControl = seesawAngleRight;
                break;
            case "stopped":
                gameState = "started";
                gameTime = 0;
                break;
        }
        mPressed = false;
    }

    // Mouse Dragging Left
    if(gameState == "started" && bouleLeftState == "onSeesaw" && mPressed && mouseInRangeCircular(toCanvasCoords(-(seesawDistance/2 + seesawLength/2) * M, (triangleHeight + seesawThickness/2) * M).x, toCanvasCoords(seesawDistance/2 * M, (triangleHeight * 2 + seesawThickness/2) * M).y, windowWidth * 0.015)) {
        seesawLeftMousePressed = true;
        mouseStartY = mouseY;
        mPressed = false;
    }

    if (seesawLeftMousePressed) {
        push();
            noFill();
            stroke(0, 0, 255);
            //ellipse(mouseX, mouseY, 20);
        pop();

        mouseDeltaY = -(mouseY - mouseStartY);
        seesawAngleLeftControl = degrees_to_radians(-seesawAngle - (mouseDeltaY / 2));
    }

    if (seesawLeftMousePressed && mReleased) {
        seesawLeftForce = (seesawAngleLeft + degrees_to_radians(seesawAngle)) * 1500;
        seesawLeftTimeStart = gameTime;
        mouseDeltaY = 0;
        seesawLeftMousePressed = false;
        mReleased = false;
        bouleLeftState = "onFlight";
    }

    // Mouse Dragging Right
    if(gameState == "started" && bouleRightState == "onSeesaw" && mPressed && mouseInRangeCircular(toCanvasCoords((seesawDistance/2 + seesawLength/2) * M, (triangleHeight + seesawThickness/2) * M).x, toCanvasCoords(seesawDistance/2 * M, (triangleHeight * 2 + seesawThickness/2) * M).y, windowWidth * 0.015)) {
        seesawRightMousePressed = true;
        mouseStartY = mouseY;
        mPressed = false;
    }

    if (seesawRightMousePressed) {
        push();
            noFill();
            stroke(0, 0, 255);
            //ellipse(mouseX, mouseY, 20);
        pop();

        mouseDeltaY = -(mouseY - mouseStartY);
        seesawAngleRightControl = degrees_to_radians(seesawAngle + (mouseDeltaY / 2));
    }

    if (seesawRightMousePressed && mReleased) {
        seesawRightForce = (-seesawAngleRight + degrees_to_radians(seesawAngle)) * 1500;
        seesawRightTimeStart = gameTime;
        mouseDeltaY = 0;
        seesawRightMousePressed = false;
        mReleased = false;
        bouleRightState = "onFlight";
    }

    /* calculation */

    // current time
    
    switch (gameState) {
        case "started":
            gameTime = gameTime + frameTime;
            break;
        case "stopped":
            gameTime = 0;
            break;
    }

    // left Boule position
    var bouleLeftPosX, bouleLeftPosY;
    var bouleLeftTime = 0
    switch(bouleLeftState) {
        case "onFlight":
            bouleLeftTime = gameTime - seesawLeftTimeStart;
            bouleLeftPosX = schraegerWurfX((-seesawDistance/2 - seesawTriangleOffset - seesawTriangleSideLength/2 - 0.015) * M, seesawLeftForce, bouleLeftTime);
            bouleLeftPosY = schraegerWurfY((triangleHeight * 2 + bouleDiameter/2) * M, seesawLeftForce, bouleLeftTime);
            break;
        case "onSlope":
            bouleLeftTime = gameTime - seesawLeftTimeStart;
            bouleLeftPosX = schraegerWurfX((-seesawDistance/2 - seesawTriangleOffset - seesawTriangleSideLength/2 - 0.015) * M, seesawLeftForce, bouleLeftTime);
            bouleLeftPosY = bouleDiameter/2 * M;
            break;
    }


    // left Boule collision
    if (bouleLeftPosY < bouleDiameter/2 * M) bouleLeftState = "onSlope";

    // right Boule position
    var bouleRightPosX, bouleRightPosY;
    var bouleRightTime = 0;
    switch(bouleRightState) {
        case "onFlight":
            bouleRightTime = gameTime - seesawRightTimeStart;
            bouleRightPosX = schraegerWurfX((seesawDistance/2 + seesawTriangleOffset + seesawTriangleSideLength/2 + 0.015) * M, -seesawRightForce, bouleRightTime);
            bouleRightPosY = schraegerWurfY((triangleHeight * 2 + bouleDiameter/2) * M, seesawRightForce, bouleRightTime);
            break;
        case "onSlope":
            bouleRightTime = gameTime - seesawRightTimeStart;
            bouleRightPosX = schraegerWurfX((seesawDistance/2 + seesawTriangleOffset + seesawTriangleSideLength/2 + 0.015) * M, -seesawRightForce, bouleRightTime);
            bouleRightPosY = bouleDiameter/2 * M;
            break;
    }

    // right Boule collision
    if (bouleRightPosY < bouleDiameter/2 * M) bouleRightState = "onSlope";

    // left Seesaw angle
    switch(bouleLeftState) {
        case "onSeesaw":
            seesawAngleLeft = seesawAngleLeftControl;
            if (seesawAngleLeft < degrees_to_radians(-seesawAngle)) seesawAngleLeft = degrees_to_radians(-seesawAngle);
            if (seesawAngleLeft > degrees_to_radians(seesawAngle)) seesawAngleLeft = degrees_to_radians(seesawAngle);
            break;
        case "onFlight":
            var seesawLeftmyLerpAmount = bouleLeftTime * 15;
            if (seesawLeftmyLerpAmount >= 1) seesawLeftmyLerpAmount = 1;
            seesawAngleLeft = myLerp(seesawAngleLeftControl, degrees_to_radians(-seesawAngle), seesawLeftmyLerpAmount);
            break;
        case "onSlope":
            seesawAngleLeft = degrees_to_radians(-seesawAngle);
            break;
    }

    // right Seesaw angle
    switch(bouleRightState) {
        case "onSeesaw":
            seesawAngleRight = seesawAngleRightControl;
            if (seesawAngleRight < degrees_to_radians(-seesawAngle)) seesawAngleRight = degrees_to_radians(-seesawAngle);
            if (seesawAngleRight > degrees_to_radians(seesawAngle)) seesawAngleRight = degrees_to_radians(seesawAngle);
            break;
        case "onFlight":
            var seesawRightmyLerpAmount = bouleRightTime * 15;
            if (seesawRightmyLerpAmount >= 1) seesawRightmyLerpAmount = 1;
            seesawAngleRight = myLerp(seesawAngleRightControl, degrees_to_radians(seesawAngle), seesawRightmyLerpAmount);
            break;
        case "onSlope":
            seesawAngleRight = degrees_to_radians(seesawAngle);
            break;
    }

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
        drawTriangleFromHeight(-seesawDistance/2, 0, triangleHeight);
        drawTriangleFromHeight(seesawDistance/2, 0, triangleHeight);
        
        // Wippe links
        rectMode(CENTER);
        
        push();
            translate(-seesawDistance/2 * M, (triangleHeight + seesawThickness/2) * M);
            rotate(seesawAngleLeft);
            rect(0, 0, seesawLength * M, seesawThickness * M);
            drawTriangleFromHeight(-seesawTriangleOffset, seesawThickness/2, seesawTriangleHeight);
        pop();

        // Wippe rechts
        push();
            translate(seesawDistance/2 * M, (triangleHeight + seesawThickness/2) * M);
            rotate(seesawAngleRight);
            rect(0, 0, seesawLength * M, seesawThickness * M);
            drawTriangleFromHeight(seesawTriangleOffset, seesawThickness/2, seesawTriangleHeight);
        pop();

        rectMode(CORNER);

        // Boule links
        fill('grey');

        switch(bouleLeftState){
        case "onSeesaw":
            push();
                translate(-seesawDistance/2 * M, (triangleHeight + seesawThickness/2) * M);
                rotate(seesawAngleLeft);
                translate((-seesawTriangleOffset - seesawTriangleSideLength/2 - 0.01) * M,  (bouleDiameter/2 + 0.005) * M)
                circle(0, 0, bouleDiameter * M);
            pop();
            break;
        case "onFlight":
            push();
                translate(bouleLeftPosX, bouleLeftPosY);
                circle(0, 0, bouleDiameter * M);
            pop();
            break;
        case "onSlope":
            push();
                translate(bouleLeftPosX, bouleLeftPosY);
                circle(0, 0, bouleDiameter * M);
            pop();
            break;
    }
    
        // Boule rechts
        switch(bouleRightState){
            case "onSeesaw":
                push();
                    translate(seesawDistance/2 * M, (triangleHeight + seesawThickness/2) * M);
                    rotate(seesawAngleRight);
                    translate((seesawTriangleOffset + seesawTriangleSideLength/2 + 0.01) * M,  (bouleDiameter/2 + 0.005) * M)
                    circle(0, 0, bouleDiameter * M);
                pop();
                break;
            case "onFlight":
                push();
                    translate(bouleRightPosX, bouleRightPosY);
                    circle(0, 0, bouleDiameter * M);
                pop();
                break;
            case "onSlope":
                push();
                    translate(bouleRightPosX, bouleRightPosY);
                    circle(0, 0, bouleDiameter * M);
                pop();
                break;
        }
    pop();
}

/* isr */
function windowResized() {                      /* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}

// Calculation functions

function degrees_to_radians(xdegrees) {
  let pi = Math.PI;
  return xdegrees * (pi/180);
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

function schraegerWurfX(x0, v0x, gameTime) {
    let x = 0;
    x = x0 + v0x * gameTime; 
    return x;
}

function schraegerWurfY(y0, v0y, gameTime) {
    let y = 0;
    y = -9.81 * M * gameTime * gameTime/ 2 + v0y * gameTime+ y0; 
    return y;
}

function myLerp (start, end, amount){
  return (1 - amount) * start + amount * end;
}

// Drawing Functions

function drawTriangleFromHeight(posX, posY, height) {
    let sideLength = 2 * height/Math.sqrt(3);
    triangle((posX - sideLength/2) * M, posY * M, posX * M, (posY + height) * M, (posX + sideLength/2) * M, posY * M);
}