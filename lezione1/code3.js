let palette;

function setup() {
  createCanvas(800, 800);
  noLoop();
  palette = [
    color(239, 71, 111),  // Rosso vivo
    color(255, 209, 102), // Giallo dorato
    color(6, 214, 160),  // Verde acqua
    color(17, 138, 178), // Blu oceano
    color(7, 59, 76)     // Blu notte
  ];
}

function draw() {
  background(10);
  
  drawSky();
  drawFractalTree(width / 2, height * 0.7, -PI / 2, 8);
  drawMountains();
  drawWaves();
}

// **Cielo con perlin noise**
function drawSky() {
  for (let y = 0; y < height * 0.5; y += 5) {
    let col = lerpColor(palette[1], palette[3], map(y, 0, height * 0.5, 0, 1));
    stroke(col);
    strokeWeight(3);
    line(0, y, width, y);
  }
}

// **Albero frattale con recursion**
function drawFractalTree(x, y, angle, depth) {
  if (depth === 0) return;
  
  let len = map(depth, 1, 8, 10, 80);
  let newX = x + cos(angle) * len;
  let newY = y + sin(angle) * len;
  
  stroke(palette[depth % palette.length]);
  strokeWeight(depth);
  line(x, y, newX, newY);
  
  drawFractalTree(newX, newY, angle - PI / 6, depth - 1);
  drawFractalTree(newX, newY, angle + PI / 4, depth - 1);
}

// **Montagne con effetto noise**
function drawMountains() {
  for (let i = 0; i < 3; i++) {
    let yOffset = height * 0.6 + i * 40;
    let hillColor = lerpColor(palette[2], palette[4], i / 3);
    stroke(hillColor);
    strokeWeight(3);
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

// **Onde frattali con sinusoidi**
function drawWaves() {
  noFill();
  for (let i = 0; i < 5; i++) {
    let yoff = i * 40;
    stroke(palette[i]);
    strokeWeight(3);
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let y = height * 0.8 + sin(x * 0.02 + i) * 50 + yoff + noise(x * 0.01) * 20;
      curveVertex(x, y);
    }
    endShape();
  }
}
