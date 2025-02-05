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

// **Simulazione di pennellate fluide**
function drawBrushStrokes() {
  for (let i = 0; i < 50; i++) {  // Numero di pennellate
    let x = random(width);
    let y = random(height);
    let length = random(100, 300); // Lunghezza pennellata
    let angle = random(TWO_PI);  // Direzione casuale
    let brushSize = random(15, 40); // Larghezza pennellata
    let colorIndex = int(random(palette.length));

    drawBrushStroke(x, y, length, angle, brushSize, palette[colorIndex]);
  }
}

// **Disegna una pennellata direzionata con punti**
function drawBrushStroke(x, y, length, angle, size, col) {
  let numPoints = length * 8;  // Numero di punti nella pennellata
  for (let i = 0; i < numPoints; i++) {
    let progress = i / numPoints;
    let px = x + cos(angle) * length * progress + random(-size / 4, size / 4);
    let py = y + sin(angle) * length * progress + random(-size / 4, size / 4);
    
    let alphaVar = random(180, 255);
    let weight = random(1, size / 5);
    
    stroke(col.levels[0], col.levels[1], col.levels[2], alphaVar);
    strokeWeight(weight);
    point(px, py);
  }
}
