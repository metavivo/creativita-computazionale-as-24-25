let cols, rows;
let flowField;
let particles = [];
let zoff = 0;
let noiseScale = 0.02;
let palette;

function setup() {
  createCanvas(800, 800);
  cols = floor(width / 10);
  rows = floor(height / 10);
  flowField = new Array(cols * rows);
  palette = [
    color(239, 71, 111, 100),  // Rosso trasparente
    color(255, 209, 102, 120), // Giallo caldo
    color(6, 214, 160, 80),    // Verde acqua
    color(17, 138, 178, 90),   // Blu oceano
    color(7, 59, 76, 70)       // Blu notte
  ];

  for (let i = 0; i < 3000; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 15, 25, 30);

  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;
      xoff += noiseScale;
    }
    yoff += noiseScale;
  }
  zoff += 0.005;

  for (let p of particles) {
    p.follow(flowField);
    p.update();
    p.edges();
    p.show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.color = random(palette);
  }

  follow(vectors) {
    let x = floor(this.pos.x / 10);
    let y = floor(this.pos.y / 10);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    stroke(this.color);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
}
