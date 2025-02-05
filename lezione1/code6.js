let palette;

function setup() {
  createCanvas(800, 800);
  noLoop();
  pixelDensity(2);
  
  palette = [
    color(32, 24, 72),   // Blu notte profondo
    color(80, 45, 167),  // Viola elettrico
    color(239, 71, 111), // Rosso vibrante
    color(255, 209, 102),// Oro caldo
    color(6, 214, 160)   // Verde turchese
  ];
  
  drawBackgroundGradient();
  drawFractalShapes();
  drawFlowingTexture();
}

// **Gradiente di fondo per effetto pittorico profondo**
function drawBackgroundGradient() {
  for (let y = 0; y < height; y++) {
    let c = lerpColor(palette[0], palette[1], y / height);
    stroke(c);
    line(0, y, width, y);
  }
}

// **Strutture frattali astratte**
function drawFractalShapes() {
  for (let i = 0; i < 12; i++) {
    let x = random(width * 0.2, width * 0.8);
    let y = random(height * 0.2, height * 0.8);
    let size = random(60, 150);
    let col = palette[int(random(palette.length))];
    
    drawFractalPattern(x, y, size, col);
  }
}

// **Frattale con rami curvi e sovrapposti**
function drawFractalPattern(x, y, size, col, depth = 5) {
  if (depth == 0) return;
  
  stroke(col);
  strokeWeight(depth * 0.6);
  noFill();
  
  beginShape();
  for (let i = 0; i < TWO_PI; i += PI / 5) {
    let angle = i + random(-PI / 10, PI / 10);
    let xOffset = cos(angle) * size;
    let yOffset = sin(angle) * size;
    curveVertex(x + xOffset, y + yOffset);
  }
  endShape(CLOSE);
  
  drawFractalPattern(x + random(-size / 2, size / 2), y + random(-size / 2, size / 2), size * 0.6, col, depth - 1);
}

// **Texture fluida per un effetto pittorico naturale**
function drawFlowingTexture() {
  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height);
    let alpha = random(50, 120);
    let col = palette[int(random(palette.length))];
    
    stroke(col.levels[0], col.levels[1], col.levels[2], alpha);
    strokeWeight(random(0.5, 2));
    
    let len = random(5, 20);
    let angle = noise(x * 0.005, y * 0.005) * TWO_PI * 4;
    
    let x2 = x + cos(angle) * len;
    let y2 = y + sin(angle) * len;
    
    line(x, y, x2, y2);
  }
}
