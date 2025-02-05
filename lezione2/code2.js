let palette;

function setup() {
  createCanvas(800, 800);
  noLoop();
  noiseDetail(3);
  palette = [
    color(240, 144, 90),  // Arancio tenue
    color(245, 221, 127), // Giallo caldo
    color(112, 193, 179), // Verde acqua
    color(72, 133, 237),  // Azzurro
    color(19, 70, 132)    // Blu notte
  ];
}

function draw() {
  background(255);
  
  drawSky();
  drawHills();
  drawFlowers();
}

// Cielo con pennellate
function drawSky() {
  for (let y = 0; y < height * 0.5; y += 5) {
    let col = lerpColor(palette[1], palette[3], map(y, 0, height * 0.5, 0, 1));
    stroke(col);
    strokeWeight(3);
    line(0, y, width, y);
  }
}

// Colline con effetto pennellata
function drawHills() {
  for (let i = 0; i < 3; i++) {
    let yOffset = height * 0.5 + i * 40;
    let hillColor = lerpColor(palette[2], palette[4], i / 3);
    stroke(hillColor);
    strokeWeight(5);
    fill(hillColor);
    
    beginShape();
    for (let x = 0; x <= width; x += 20) {
      let y = yOffset + noise(x * 0.005, i * 0.5) * 80 - 40;
      curveVertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

// Fiori astratti tipo Monet
function drawFlowers() {
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let size = random(5, 12);
    
    let flowerColor = palette[int(random(0, palette.length))];
    
    fill(flowerColor);
    noStroke();
    
    for (let j = 0; j < 5; j++) {
      let offsetX = random(-size, size);
      let offsetY = random(-size, size);
      ellipse(x + offsetX, y + offsetY, size * 0.8);
    }
  }
}
