let palette;

function setup() {
  createCanvas(800, 800);
  noLoop();
  palette = [
    color(239, 71, 111, 220),  // Rosso intenso
    color(255, 209, 102, 180), // Giallo dorato
    color(6, 214, 160, 200),   // Verde acqua
    color(17, 138, 178, 180),  // Blu oceano
    color(7, 59, 76, 150)      // Blu notte
  ];
  drawBackgroundTexture();
  drawFractal(width / 2, height - 100, -PI / 2, 100, 6);
  drawMountainLayer();
  drawAbstractBranches();
}

// **Texture di sfondo per effetto pittorico**
function drawBackgroundTexture() {
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let alpha = random(10, 50);
    stroke(255, alpha);
    point(x, y);
  }
}

// **Albero frattale ricorsivo per una struttura intricata**
function drawFractal(x, y, angle, length, depth) {
  if (depth == 0) return;
  let newX = x + cos(angle) * length;
  let newY = y + sin(angle) * length;
  stroke(palette[depth % palette.length]);
  strokeWeight(depth);
  line(x, y, newX, newY);
  drawFractal(newX, newY, angle - PI / 6, length * 0.7, depth - 1);
  drawFractal(newX, newY, angle + PI / 6, length * 0.7, depth - 1);
}

// **Strati di montagne sfumate**
function drawMountainLayer() {
  for (let i = 0; i < 3; i++) {
    let yOffset = height * 0.6 + i * 40;
    let mountainColor = lerpColor(palette[2], palette[4], i / 3);
    fill(mountainColor);
    noStroke();
    
    beginShape();
    for (let x = 0; x <= width; x += 20) {
      let y = yOffset + noise(x * 0.01, i * 0.5) * 80 - 40;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

// **Pattern astratti con rami e curve**
function drawAbstractBranches() {
  for (let i = 0; i < 8; i++) {
    let x = random(width);
    let y = random(height * 0.5, height);
    let len = random(30, 100);
    let angle = random(-PI / 4, PI / 4);
    
    stroke(palette[int(random(0, palette.length))]);
    strokeWeight(random(1, 4));
    for (let j = 0; j < 5; j++) {
      let newX = x + cos(angle) * len;
      let newY = y + sin(angle) * len;
      line(x, y, newX, newY);
      x = newX;
      y = newY;
      angle += random(-PI / 6, PI / 6);
      len *= 0.7;
    }
  }
}
