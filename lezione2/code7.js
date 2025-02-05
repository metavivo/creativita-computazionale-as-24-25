let palette;

function setup() {
  createCanvas(800, 800);
  noLoop();
  pixelDensity(2);

  // Palette di colori artistici
  palette = [
    color(239, 71, 111, 180),  // Rosso vibrante
    color(255, 209, 102, 200), // Oro caldo
    color(6, 214, 160, 220),   // Verde acqua
    color(17, 138, 178, 180),  // Blu oceano
    color(7, 59, 76, 200)      // Blu notte
  ];

  drawBrushStrokes();
}

// **Simulazione di pennellate con punti sovrapposti**
function drawBrushStrokes() {
  for (let i = 0; i < 100; i++) {  // Numero di pennellate
    let x = random(width);
    let y = random(height);
    let brushSize = random(30, 80); // Dimensione pennellata
    let colorIndex = int(random(palette.length));
    drawBrushStroke(x, y, brushSize, palette[colorIndex]);
  }
}

// **Pennellata digitale con punti densi**
function drawBrushStroke(x, y, size, col) {
  let density = size * 20;  // Numero di punti nella pennellata
  for (let i = 0; i < density; i++) {
    let angle = random(TWO_PI);
    let radius = sqrt(random()) * size; // Distribuzione realistica
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;

    let alphaVar = random(150, 255);
    let weight = random(1, 3);

    stroke(col.levels[0], col.levels[1], col.levels[2], alphaVar);
    strokeWeight(weight);
    point(px, py);
  }
}
