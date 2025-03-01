let words = "Kinetic Typography Engine Valitutti";
let letters = [];
let gravity = 0.05;
let friction = 0.99;
let spacing = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
  textSize(32);
  
  for (let i = 0; i < words.length; i++) {
    let x = width / 2 + (i - words.length / 2) * spacing;
    let y = height / 2;
    letters.push(new Letter(words[i], x, y));
  }
}

function draw() {
  background(0);
  for (let letter of letters) {
    letter.update();
    letter.display();
  }
}

class Letter {
  constructor(char, x, y) {
    this.char = char;
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, gravity);
    this.angle = 0;
    this.angularVelocity = random(-0.05, 0.05);
    this.size = random(20, 50);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(friction);
    this.pos.add(this.vel);

    this.angle += this.angularVelocity;

    if (this.pos.y > height - 30) {
      this.pos.y = height - 30;
      this.vel.y *= -0.8;
    }

    if (this.pos.x < 30 || this.pos.x > width - 30) {
      this.vel.x *= -0.8;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(255);
    textSize(this.size);
    text(this.char, 0, 0);
    pop();
  }
}
