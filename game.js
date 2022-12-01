// Paul Klingberg, 575868, 2022-10-11

function setup() {
    createCanvas(1500, 600); // 1 pixel == 1 mm
    textAlign(CENTER, CENTER);
    textSize(25);
}

function draw() {
    strokeWeight(1.5);
    stroke ('black');
    background(255);

    // Boden
    fill('#ba8f29');
    rect(0, 520, 1500, 80);
   
    // Cochonnet
    fill('pink');
    circle(750,500,40);

    // Spielfeldrand
    fill('red');
    rect(430,520,40,10);
    rect(1030,520,40,10);

    // Wippen Dreiecke
    fill('blue');
    triangle(225.32, 520, 250, 477.25, 274.68, 520);
    triangle(1225.32, 520, 1250, 477.25, 1274.68, 520);

    // Wippen Linien
    strokeWeight(6);
    stroke ('blue');
    line (132.54, 434.5, 367.46, 520);
    line (1132.54, 520, 1367.46, 434.5);

    // Wippen Dreiecke
    strokeWeight(1.5);
    triangle(170.13, 448.18, 189.27, 432.11, 193.62, 456.68);
    triangle(1329.87, 448.18, 1310.73, 432.11, 1306.38, 456.68);

    // Bool links
    stroke ('black');
    fill('grey');
    circle(168,422,40);
    fill('black');
    text('L', 168,422);

    // Bool rechts
    stroke ('black');
    fill('grey');
    circle(1332,422,40);
    fill('black');
    text('R', 1332,422);
}