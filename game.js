/* GTAT2 Game Technology & Interactive Systems */
/* Autor: Paul Klingberg, 575868*/
/* Übung Nr. 10*/
/* Datum: 2023-01-16*/

/* declarations */

/* display */
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var M;                                                     // Maßstab [pixel/meter]
var xi0, yi0;                                              // Koordinatenursprung intern
var buttonPosX = canvasWidth * 0.85;                       // Button Position X [pixel]
var buttonPosY = canvasHeight * 0.9;                       // Button Position Y [pixel]
var buttonSizeX = canvasWidth * 0.12;                      // Button Breite [pixel]
var buttonSizeY = canvasWidth * 0.04;                      // Button Höhe [pixel]
var mouseStartY = 0;                                       // Wo sich die Maus beim Klick auf die Wippe befunden hatte [pixel]
var mouseDeltaY = 0;                                       // Wo sich die Maus daraufhin befindet [pixel]

/* pitch */
const playGroundWidth = 1.6;                               // Spielfeldgröße [m]
const playGroundHeight = 0.07;                             // Höhe des Spielfeldbodens [m]
const seesawDistance = 1;                                  // Entfernung der Wippe vom Zentrum [m]
const edgeDistance = 0.6;                                  // Entfernung des Spielfeldrands vom Zentrum [m]
const edgeBlockHeight = 0.01;                              // Höhe des Spielfeldrandanzeigers [m]
const edgeBlockWidth = 0.04;                               // Breite des Spielfeldrandanzeigers [m]
const seesawLength = 0.25;                                 // Länge der Wippen [m]
const seesawThickness = 0.005;                             // Dicke der Wippen [m]
const seesawTriangleOffset = 0.07;                         // Verschiebung des Wippen-Dreiecks vom Zentrum der Wippen [m]
const seesawTriangleSideLength = 0.025;                    // Seitenlänge des Wippen-Dreiecks [m]
const seesawSpringConstant = 2500;                         // Federkonstante [N/m]
var seesawSpringForce = 0;                                 // Rückstellkraft der Wippe [N]
var seesawSpringPressed = 0;                               // Strecke der Komprimierung der Feder [m]
var seesawSpringVelocity = 0;                              // Geschwindigkeit der Feder [m/s]
var triangleHeight;                                        // Höhe des Dreiecks unter der Wippe [m]
var seesawTriangleHeight;                                  // Höhe des Dreiecks auf der Wippe[m]
var seesawAngle = 20;                                      // Start-Winkel der Wippen [grad]
var seesawAngleRight;                                      // Winkel der rechten Wippe [rad]
var seesawAngleRightControl;                               // Einstell-Winkel der rechten Wippe durch Mausposition [rad]
var seesawAngleLeft;                                       // Winkel der linken Wippe [rad]
var seesawAngleLeftControl;                                // Einstell-Winkel der linken Wippe durch Mausposition [rad]
var seesawLeftPos;                                         // Position der linken Wippe als Vektor [m, m]
var seesawRightPos;                                        // Position der rechten Wippe als Vektor [m, m]

/* balls */
const cochonnetDiameter = 0.04;                            // Durchmesser des Cochonnet [m]
const bouleDiameter = 0.04;                                // Durchmesser der Boule [m]
const bouleWeight = 4.5;                                   // Boule Gewicht [g]
const bouleCW = 0.45;                                      // Boule Strömungswiderstandskoeffizient
var bouleFrictionMass;                                     // Boule Reibungs-Masse-Verhältnis
var bouleLeftV0;                                           // Startgeschwiundigkeit [m/s]
var bouleLeftPV;                                           // Ortsvektor linke Boule [m]
var bouleLeftPV0;                                          // Anfangs-Ortsvektor linke Boule [m]
var bouleLeftVV;                                           // Geschwindigkeitsvektor linke Boule [m/s]
var bouleLeftInclineV;                                     // Geschwindigkeit auf der schiefen Ebene linke Boule [m/s]
var bouleLeftInclineS;                                     // Position auf der schiefen Ebene linke Boule [m]
var bouleLeftInclineFloor;                                 // Aktuelles Segment der schiefen Ebenen linke Boule
var bouleRightV0;                                          // Startgeschwiundigkeit [m/s]
var bouleRightPV;                                          // Ortsvektor rechte Boule [m]
var bouleRightPV0;                                         // Anfangs-Ortsvektor rechte Boule [m]
var bouleRightVV;                                          // Geschwindigkeitsvektor rechte Boule [m/s]
var bouleRightInclineV;                                    // Geschwindigkeit auf der schiefen Ebene rechte Boule [m/s]
var bouleRightInclineS;                                    // Position auf der schiefen Ebene rechte Boule [m]
var bouleRightInclineFloor;                                // Aktuelles Segment der schiefen Ebenen rechte Boule

/* physics calculation */
const gravity = 9.81;                                      // Erdbeschleunigungskonstante [m/s²]
const frameQuantization = 200;                             // Anzahl der Zwischenschritte in der Berechnung für jeden Frame
const timescale = 1;                                       // Zeit-Dehnung
const frictionFactor =  0.05;                              // Der Reibungskoeffizienz der Boules auf den Ebenen
const airDensity = 1.30;                                   // Luftdichte [kg/m³]
const windSpeedMax = 5;                                    // Maximale Windgeschwindigkeit [m/s]
var windSpeed = (Math.random()*2 - 1) * windSpeedMax;      // Windgeschwindigkeit [m/s]
var floorPV = [];                                          // Ortsvektoren der Segmente Wippe links, Ebene, Wippe rechts
var floorSV = [];                                          // Segmentvektoren der Segmente
var floorSVLength = [];                                    // Länge der Segmentvektoren der Segmente

/* game state */
var frameTime;                                             // Zeitincrement [s]
var frmRate = 60;                                          // Bildwechselrate [frames/s]
var gameState = "stopped"                                  // State Machine für den Spielstatus
var bouleLeftState = "onSeesaw";                           // State Machine für den linken Boule
var bouleRightState = "onSeesaw";                          // State Machine für den rechten Boule
var seesawRightMousePressed = false;                       // Ob die rechte Wippe geklickt wurde
var seesawLeftMousePressed = false;                        // Ob die linke Wippe geklickt wurde
var bouleLeftLeftStartingPosition = false;                 // Ob die linke Boule die Startposition verlassen hat
var bouleRightLeftStartingPosition = false;                // Ob die rechte Boule die Startposition verlassen hat

/* prepare program */
function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(frmRate);                                    // Setzen der Bildwechselrate
    frameTime = 1/frmRate/timescale;                       // Zeitincrement mit Bildwechsel synchron

    /* derived variables */
    seesawAngle = radians(seesawAngle);                   // Startwinkel in rad umrechnen
    triangleHeight = Math.sin(seesawAngle) * seesawLength/2; // Höhe des Dreiecks unter der Wippe (wird berechnet) [m]
    seesawSpringLength = 2 * triangleHeight;              // Ruhefederlänge berechnen [m]
    seesawAngleRight = seesawAngle;                       // Winkel der rechten Wippe [rad]
    seesawAngleLeft = mirrorAngle(seesawAngle);           // Winkel der linken Wippe [rad]
    seesawAngleRightControl = seesawAngleRight;
    seesawAngleLeftControl = seesawAngleLeft;
    seesawTriangleHeight = 0.5 * seesawTriangleSideLength * Math.sqrt(3);
    bouleFrictionMass = bouleWeight/1000/(airDensity * bouleCW * Math.PI * Math.pow((bouleDiameter/2), 2));

    bouleLeftPV = createVector(0, 0);                      // Ortsvektor linke Boule kreieren
    bouleLeftPV0 = createVector(0, 0);                     // Anfangs-Ortsvektor linke Boule kreieren
    bouleLeftVV = createVector(0, 0);                      // Geschwindigkeitsvektor linke Boule kreieren
    bouleRightPV = createVector(0, 0);                     // Ortsvektor rechte Boule kreieren
    bouleRightPV0 = createVector(0, 0);                    // Anfangs-Ortsvektor rechte Boule kreieren 
    bouleRightVV = createVector(0, 0);                     // Geschwindigkeitsvektor rechte Boule kreieren

    /* rest position boules on the seesaws (cartesian) */
    seesawLeftPos = createVector(-seesawDistance/2, triangleHeight);
    bouleLeftPV0.x = -seesawDistance/2 - seesawLength/2 + seesawTriangleOffset/2.5;
    bouleLeftPV0.y = triangleHeight + bouleDiameter/2;
    bouleLeftPV0 = rotateVectorAroundVector(bouleLeftPV0, seesawLeftPos, mirrorAngle(seesawAngle));

    seesawRightPos = createVector(seesawDistance/2, triangleHeight);
    bouleRightPV0.x = seesawDistance/2 + seesawLength/2 - seesawTriangleOffset/2.5;
    bouleRightPV0.y = triangleHeight + bouleDiameter/2;
    bouleRightPV0 = rotateVectorAroundVector(bouleRightPV0, seesawRightPos, seesawAngle);

    /* set up ground location vectors */
    floorPV[0] = createVector(-seesawDistance/2 - 0.5 * seesawLength * cos(seesawAngle), triangleHeight * 2); // Endpunkt linke Wippe
    floorPV[1] = createVector(-seesawDistance/2 + 0.5 * seesawLength * cos(seesawAngle), 0);                  // Fußpunkt     -"-
    floorPV[2] = createVector(seesawDistance/2 - 0.5 * seesawLength * cos(seesawAngle), 0);                   // Fußpunkt rechte Wippe
    floorPV[3] = createVector(seesawDistance/2 + 0.5 * seesawLength * cos(seesawAngle), triangleHeight * 2);  // Endpunkt     -"-

    /* calculate additional ground properties */
    for (let i = 0; i < floorPV.length - 1; i++) {
        // Segmentvektoren
        floorSV[i] = p5.Vector.sub(floorPV[i + 1], floorPV[i]);

        // Länge der Segmente
        floorSVLength[i] = floorSV[i].mag();
    }
}

/* run program */
function draw() {
    /* administration */
    background(255);
    strokeWeight(1.5);
    stroke ('black');

    M = 0.9 * windowWidth/playGroundWidth;                 // Maßstab bezügl. 90% Spielfeldgröße
    xi0 = 0.5 * windowWidth;                               // Koordinatenursprung x festlegen
    yi0 = 0.75 * windowHeight;                             // Koordinatenursprung y festlegen

    // Start/Reset-Button Aussehen
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

    // Start/Reset-Button Logik
    if (mPressed && mouseInRange(buttonPosX, buttonPosY, buttonSizeX, buttonSizeY)) {
        switch (gameState) {
            case "started":
                gameState = "stopped";
                bouleLeftState = "onSeesaw";
                bouleRightState = "onSeesaw";
                seesawAngleLeftControl = seesawAngleLeft;
                seesawAngleRightControl = seesawAngleRight;
                seesawSpringForce = 0;
                seesawSpringPressed = 0;
                seesawSpringVelocity = 0;
                windSpeed = (Math.random()*2 - 1) * windSpeedMax;
                break;
            case "stopped":
                gameState = "started";
                break;
        }
        mPressed = false;
    }

    // Maus-ziehen an der Wippe links
    if (gameState == "started" 
        && bouleLeftState == "onSeesaw" 
        && mPressed 
        && mouseInRangeCircular(toCanvasCoords(-(seesawDistance/2 + seesawLength/2) * M, triangleHeight * M).x,
                                toCanvasCoords(seesawDistance/2 * M, (triangleHeight * 2) * M).y, windowWidth * 0.015)) {
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

        mouseDeltaY = -(mouseY - mouseStartY)/windowWidth * 1000; // Maus-Positions-Delta mit Anpassung an die Fensterbreite
        seesawAngleLeftControl = mirrorAngle(seesawAngle) - radians((mouseDeltaY));
    }

    if (seesawLeftMousePressed && mReleased) {
        seesawSpringPressed = triangleHeight - Math.sin(mirrorAngle(seesawAngleLeft)) * seesawLength / 2;
        seesawSpringForce = springForce(seesawSpringConstant, seesawSpringPressed);
        mouseDeltaY = 0;
        seesawLeftMousePressed = false;
        mReleased = false;
        bouleLeftState = "accelerated";
    }

    // Maus-ziehen an der Wippe rechts
    if (gameState == "started"
        && bouleRightState == "onSeesaw"
        && mPressed
        && mouseInRangeCircular(toCanvasCoords((seesawDistance/2 + seesawLength/2) * M, triangleHeight * M).x,
                                toCanvasCoords(seesawDistance/2 * M, (triangleHeight * 2) * M).y, windowWidth * 0.015)) {
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

        mouseDeltaY = -(mouseY - mouseStartY)/windowWidth * 1000; // Maus-Positions-Delta mit Anpassung an die Fensterbreite
        seesawAngleRightControl = seesawAngle + radians((mouseDeltaY));
    }

    if (seesawRightMousePressed && mReleased) {
        seesawSpringPressed = triangleHeight - Math.sin(seesawAngleRight) * seesawLength / 2;
        seesawSpringForce = springForce(seesawSpringConstant, seesawSpringPressed);
        mouseDeltaY = 0;
        seesawRightMousePressed = false;
        mReleased = false;
        bouleRightState = "accelerated";
    }

    /* calculation */

    for (let timeSteps = 0; timeSteps < frameQuantization; timeSteps++) { // Zwischenschritte
        var frameTimeStepped = frameTime/frameQuantization;

        // Boule links Position
        switch(bouleLeftState) {
            case "onSeesaw":
                bouleLeftPV.x = -seesawDistance/2 - seesawLength/2 + seesawTriangleOffset/2.5;
                bouleLeftPV.y = triangleHeight + bouleDiameter/2;
                bouleLeftPV = rotateVectorAroundVector(bouleLeftPV, seesawLeftPos, seesawAngleLeft);
                break;
            case "accelerated":
                bouleLeftPV.x = -seesawDistance/2 - seesawLength/2 + seesawTriangleOffset/2.5;
                bouleLeftPV.y = triangleHeight + bouleDiameter/2;
                bouleLeftPV = rotateVectorAroundVector(bouleLeftPV, seesawLeftPos, seesawAngleLeft);
                break;
            case "onFlight":
                var collision = distanceFromFloor(bouleLeftPV, floorPV, floorSV);

                // Testen, ob eine der Entfernungen kleiner als der Boule-Radius sind und die Boule ihre Startposition verlassen hat
                for (let i = 0; i < collision.distance.length; i++) {
                    if (collision.distance[i] < bouleDiameter/2 && bouleLeftLeftStartingPosition) {
                        bouleLeftState = "onSlope";
                        bouleLeftLeftStartingPosition = false;
                        var newCoords = transformVectorAlongCoords(bouleLeftVV, floorSV[i].heading());
                        bouleLeftInclineV = newCoords.y;
                        bouleLeftInclineS = collision.lengthFromPV[i];
                        bouleLeftInclineFloor = i;
                        break;
                    } else if (!bouleLeftLeftStartingPosition) {
                        bouleLeftLeftStartingPosition = true;
                        for (let j = 0; j < collision.distance.length; j++) {
                            if (collision.distance[j] < bouleDiameter/2) {
                                bouleLeftLeftStartingPosition = false;
                            }
                        }
                    }
                }

                var bouleLeftVectors = obliqueThrowNumeric(bouleLeftPV, bouleLeftVV, frameTimeStepped);
                bouleLeftPV = bouleLeftVectors[0];
                bouleLeftVV = bouleLeftVectors[1];
                break;
            case "onSlope":
                // Check, ob zwischen den Ebenen übergeben werden muss
                var handover = inclinedPlaneHandover(bouleLeftInclineFloor, floorSVLength, bouleLeftInclineS, bouleDiameter, seesawAngle);
                bouleLeftInclineS = handover.bouleS;
                bouleLeftInclineFloor = handover.floor;

                // Berechnung der Position auf der Schiefen Ebene
                var inclinedPlane = inclinedPlaneNumeric(bouleLeftInclineV, bouleLeftInclineS, floorSV[bouleLeftInclineFloor].heading(), frameTimeStepped);
                bouleLeftInclineV = inclinedPlane.v;
                bouleLeftInclineS = inclinedPlane.s;
                var floorSVnormalized = floorSV[bouleLeftInclineFloor].normalize();
                bouleLeftPV = p5.Vector.add(floorPV[bouleLeftInclineFloor], p5.Vector.mult(floorSVnormalized, bouleLeftInclineS));
                bouleLeftPV.add(p5.Vector.mult(createVector(-floorSVnormalized.y, floorSVnormalized.x), bouleDiameter/2)); // Boule um Radius hochschieben
                break;
        }

        // Boule rechts Position
        switch(bouleRightState) {
            case "onSeesaw":
                bouleRightPV.x = seesawDistance/2 + seesawLength/2 - seesawTriangleOffset/2.5;
                bouleRightPV.y = triangleHeight + bouleDiameter/2;
                bouleRightPV = rotateVectorAroundVector(bouleRightPV, seesawRightPos, seesawAngleRight);
                break;
            case "accelerated":
                bouleRightPV.x = seesawDistance/2 + seesawLength/2 - seesawTriangleOffset/2.5;
                bouleRightPV.y = triangleHeight + bouleDiameter/2;
                bouleRightPV = rotateVectorAroundVector(bouleRightPV, seesawRightPos, seesawAngleRight);
                break;
            case "onFlight":
                var collision = distanceFromFloor(bouleRightPV, floorPV, floorSV);

                // Testen, ob eine der Entfernungen kleiner als der Boule-Radius sind und die Boule ihre Startposition verlassen hat
                for (let i = 0; i < collision.distance.length; i++) {
                    if (collision.distance[i] < bouleDiameter/2 && bouleRightLeftStartingPosition) {
                        bouleRightState = "onSlope";
                        bouleRightLeftStartingPosition = false;
                        var newCoords = transformVectorAlongCoords(bouleRightVV, floorSV[i].heading());
                        bouleRightInclineV = newCoords.y;
                        bouleRightInclineS = collision.lengthFromPV[i];
                        bouleRightInclineFloor = i;
                        break;
                    } else if (!bouleRightLeftStartingPosition) {
                        bouleRightLeftStartingPosition = true;
                        for (let j = 0; j < collision.distance.length; j++) {
                            if (collision.distance[j] < bouleDiameter/2) {
                                bouleRightLeftStartingPosition = false;
                            }
                        }
                    }
                }

                var bouleRightVectors = obliqueThrowNumeric(bouleRightPV, bouleRightVV, frameTimeStepped);
                bouleRightPV = bouleRightVectors[0];
                bouleRightVV = bouleRightVectors[1];
                break;
            case "onSlope":
                // Check, ob zwischen den Ebenen übergeben werden muss
                var handover = inclinedPlaneHandover(bouleRightInclineFloor, floorSVLength, bouleRightInclineS, bouleDiameter, seesawAngle);
                bouleRightInclineS = handover.bouleS;
                bouleRightInclineFloor = handover.floor;

                // Berechnung der Position auf der Schiefen Ebene
                var inclinedPlane = inclinedPlaneNumeric(bouleRightInclineV, bouleRightInclineS, floorSV[bouleRightInclineFloor].heading(), frameTimeStepped);
                var debugAlpha = "alpha: " + degrees(floorSV[bouleRightInclineFloor].heading());
                var debugV = "v: " + inclinedPlane.v;
                var debugS = "s: " + inclinedPlane.s;
                bouleRightInclineV = inclinedPlane.v;
                bouleRightInclineS = inclinedPlane.s;
                var floorSVnormalized = floorSV[bouleRightInclineFloor].normalize();
                bouleRightPV = p5.Vector.add(floorPV[bouleRightInclineFloor], p5.Vector.mult(floorSVnormalized, bouleRightInclineS));
                bouleRightPV.add(p5.Vector.mult(createVector(-floorSVnormalized.y, floorSVnormalized.x), bouleDiameter/2)); // Boule um Radius hochschieben
                break;
        }

        // Wippe links Winkel
        switch(bouleLeftState) {
            case "onSeesaw":
                seesawAngleLeft = seesawAngleLeftControl;
                if (seesawAngleLeft < mirrorAngle(seesawAngle)) seesawAngleLeft = mirrorAngle(seesawAngle);
                if (seesawAngleLeft > seesawAngle) seesawAngleLeft = seesawAngle;
                break;
            case "accelerated":
                seesawSpringVelocity = seesawSpringVelocity + seesawSpringForce * frameTimeStepped;
                seesawSpringPressed = seesawSpringPressed + seesawSpringVelocity * frameTimeStepped;
                seesawSpringForce = springForce(seesawSpringConstant, seesawSpringPressed);
                seesawAngleLeft = mirrorAngle(Math.asin((triangleHeight - seesawSpringPressed) * 2/seesawLength));
                if (seesawAngleLeft < mirrorAngle(seesawAngle)) {
                    seesawAngleLeft = mirrorAngle(seesawAngle);
                    // Setzen der Anfangswerte für den schrägen Wurf
                    bouleLeftPV = bouleLeftPV0;
                    bouleLeftVV.x = 0;
                    bouleLeftVV.y = -seesawSpringVelocity;
                    bouleLeftVV = bouleLeftVV.rotate(mirrorAngle(seesawAngle));
                    seesawSpringForce = 0;
                    seesawSpringPressed = 0;
                    seesawSpringVelocity = 0;
                    bouleLeftState = "onFlight";
                }
                break;
            case "onFlight":
                seesawAngleLeft = mirrorAngle(seesawAngle);
                break;
            case "onSlope":
                seesawAngleLeft = mirrorAngle(seesawAngle);
                break;
        }

        // Wippe rechts Winkel
        switch(bouleRightState) {
            case "onSeesaw":
                seesawAngleRight = seesawAngleRightControl;
                if (seesawAngleRight < mirrorAngle(seesawAngle)) seesawAngleRight = mirrorAngle(seesawAngle);
                if (seesawAngleRight > seesawAngle) seesawAngleRight = seesawAngle;
                break;
            case "accelerated":
                seesawSpringVelocity = seesawSpringVelocity + seesawSpringForce * frameTimeStepped;
                seesawSpringPressed = seesawSpringPressed + seesawSpringVelocity * frameTimeStepped;
                seesawSpringForce = springForce(seesawSpringConstant, seesawSpringPressed);
                seesawAngleRight = Math.asin((triangleHeight - seesawSpringPressed) * 2/seesawLength);
                if (seesawAngleRight > seesawAngle) {
                    seesawAngleRight = seesawAngle;
                    // Setzen der Anfangswerte für den schrägen Wurf
                    bouleRightPV = bouleRightPV0;
                    bouleRightVV.x = 0;
                    bouleRightVV.y = -seesawSpringVelocity;
                    bouleRightVV = bouleRightVV.rotate(seesawAngle);
                    seesawSpringForce = 0;
                    seesawSpringPressed = 0;
                    seesawSpringVelocity = 0;
                    bouleRightState = "onFlight";
                }
                break;
            case "onFlight":
                seesawAngleRight = seesawAngle;
                break;
            case "onSlope":
                seesawAngleRight = seesawAngle;
                break;
        }
    }

    /* display */
    rectMode(CORNER);
    push();                                                    // neues Koord.system kreieren
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
            translate(-seesawDistance/2 * M, (triangleHeight - seesawThickness/2) * M);
            rotate(seesawAngleLeft);
            rect(0, 0, seesawLength * M, seesawThickness * M);
            drawTriangleFromHeight(-seesawTriangleOffset, seesawThickness/2, seesawTriangleHeight);
        pop();

        // Wippe rechts
        push();
            translate(seesawDistance/2 * M, (triangleHeight - seesawThickness/2) * M);
            rotate(seesawAngleRight);
            rect(0, 0, seesawLength * M, seesawThickness * M);
            drawTriangleFromHeight(seesawTriangleOffset, seesawThickness/2, seesawTriangleHeight);
        pop();
        rectMode(CORNER);

        // Boule links
        fill('grey');
        push();
            translate(bouleLeftPV.x * M, bouleLeftPV.y * M);
            circle(0, 0, bouleDiameter * M);
        pop();
    
        // Boule rechts
        push();
                translate(bouleRightPV.x * M, bouleRightPV.y * M);
                circle(0, 0, bouleDiameter * M);
        pop();



        // Debug Form der Kollisions-Vektoren
        /*for (let i = 0; i < floorSV.length; i++) {
            strokeWeight(5);
            stroke(255,0,0);
            line(floorPV[i].x * M, floorPV[i].y * M, p5.Vector.add(floorPV[i], floorSV[i]).x * M, p5.Vector.add(floorPV[i], floorSV[i]).y * M);
        }*/
    pop();

    // Debug
    textAlign(LEFT);
    fill('black');
    textSize(36);
    /*text(debugAlpha, 50, 30);
    text(debugV, 50, 100);
    text(debugS, 50, 200);*/
    var windSpeedText = "Windgeschwindigkeit: " + Math.floor(Math.abs(windSpeed)*100)/100 + " m/s";
    if (windSpeed > 0) {
        windSpeedText = windSpeedText + " →";
    } else {
        windSpeedText = windSpeedText + " ←";
    }
    text(windSpeedText, 50, 300);
    
}

/* isr */
function windowResized() {                      /* responsive design */
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  resizeCanvas(windowWidth, windowHeight);
}

// Calculation functions
// Winkel spiegeln
function mirrorAngle(angle) {
  return radians(degrees(-angle));
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

// Schräger Wurf mit Luftreibung, numerischer Ansatz
function obliqueThrowNumeric(PV0, VV0, deltaT) {
    var speed = Math.sqrt(Math.pow((VV0.x - windSpeed), 2) + Math.pow(VV0.y, 2));    
    var VV = createVector(VV0.x - (VV0.x * speed - windSpeed)/(bouleFrictionMass * 2) * deltaT, VV0.y - (VV0.y * speed/(2*bouleFrictionMass) + gravity) * deltaT);
    var PV = createVector(PV0.x + VV0.x * deltaT, PV0.y + VV0.y * deltaT);
    var newVectors = [PV, VV];
    return newVectors;
}

// Schiefe Ebene, numerischer Ansatz, mit Reibung
function inclinedPlaneNumeric(v0, s0, alpha, deltaT) {
    // Fallunterscheidung für Vorzeichen von v0
    var sign;
    if (Math.abs(v0) < gravity * frictionFactor * deltaT) {
        sign = 0;
    } else if (v0 > 0) {
        sign = 1;
    } else {
        sign = -1;
    }

    var v = v0 + gravity * (-sin(alpha) - sign * frictionFactor * cos(alpha)) * deltaT;

    // falls alpha = 0 vereinfacht sich die Formel
    if (degrees(alpha) == 0) {
        v = v0 - gravity * sign * frictionFactor * deltaT;
    }

    var s = s0 + v0 * deltaT;

    // Berechnungs-Ungenauigkeiten ignorieren
    if (Math.abs(v) < 0.0001) {
        s = s0;
    }

    return {
        v: v,
        s: s
    };
}

// Übergabe zwischen den schiefen Ebenen
function inclinedPlaneHandover(floor0, floorSVLength, bouleS0, bouleDiameter, seesawAngle) {
    var limiter = bouleDiameter/2 * sin(seesawAngle/2);
    var bouleS = bouleS0;
    var floor = floor0;

    // Überprüfen, ob Boule-Position innerhalb der beiden Limiter ist
    if (bouleS0 > floorSVLength[floor0] - limiter) {
        floor++;
        bouleS = limiter;
        //console.log("Übergabe! Von " + floor0 + " nach " + floor + ". Von " + bouleS0 + " nach " + bouleS);
    } else if (bouleS0 < limiter) {
        floor--;
        bouleS = floorSVLength[floor] - limiter;
        //console.log("Übergabe! Von " + floor0 + " nach " + floor + ". Von " + bouleS0 + " nach " + bouleS + ". floorSVLength: " + floorSVLength[floor]);
    }

    return {
        bouleS: bouleS,
        floor: floor
    }
}

// Rotiert einen Vektor um einen anderen Vektor
function rotateVectorAroundVector(vector, pivotVector, rotationAngle) {
    // Vector mittels pivotVector zum Ursprung bewegen
    vector.x = vector.x - pivotVector.x;
    vector.y = vector.y - pivotVector.y;

    // Vector rotieren
    vector.rotate(rotationAngle);

    // Vector zurückbewegen
    vector.x = vector.x + pivotVector.x;
    vector.y = vector.y + pivotVector.y;

    return vector;
}

// Gibt zurück, wie nah eine Position an der Kollisionsform ist und wo sich der Lotfußpunkt befindet
function distanceFromFloor(positionVector, floorPV, floorSV) {
    var distance = [];
    var intersection = [];
    var lengthFromPV = [];

    for (let i = 0; i < floorSV.length; i++) {
        // Lotfußpunkt, Formel aus https://de.wikipedia.org/w/index.php?title=Lot_(Mathematik)&stable=1#Lotgerade,_Fu%C3%9Fpunkt
        var a = floorPV[i];     // Stützvektor
        var r = floorSV[i];     // Richtungsvektor
        var p = positionVector; // Punkt
        
        // a + ((p - a) * r/r * r) * r, "*" bedeutet Skalarprodukt
        var dot1 = p5.Vector.dot(p5.Vector.sub(p, a), r);
        var dot2 = p5.Vector.dot(r, r);
        var scalar = dot1/dot2;
        var mult = p5.Vector.mult(r, scalar);
        var intersection = p5.Vector.add(a, mult);

        // Vektor zwischen intersection und positionVector
        var connection = p5.Vector.sub(intersection, positionVector);

        // Skalarprodukt zwischen connection und normalisierter Normale für Entfernung und Seite
        var normal = createVector(r.y, -r.x).normalize();
        distance[i] = p5.Vector.dot(connection, normal);
        intersection[i] = intersection;
        lengthFromPV[i] = p5.Vector.dist(intersection, a);
    }

    return {
        distance: distance,
        intersection: intersection,
        lengthFromPV: lengthFromPV
    };
}

// Vektor in gedrehtes Koordinatensystem überführen
function transformVectorAlongCoords(inputV, phi) {
    var outputV = createVector(0, 0);
    var alpha = inputV.heading();
    var magnitude = inputV.mag();
    outputV.x = magnitude * sin(alpha - phi);
    outputV.y = magnitude * cos(alpha - phi);
    return outputV;
}

function springForce(force, distance) {
    return -force * distance;
}

/* drawing functions */

function drawTriangleFromHeight(posX, posY, height) {
    let sideLength = 2 * height/Math.sqrt(3);
    triangle((posX - sideLength/2) * M, posY * M, posX * M, (posY + height) * M, (posX + sideLength/2) * M, posY * M);
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x * M, base.y * M);
  line(0, 0, vec.x * M, vec.y * M);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}