let bob = [];
let spreadMin = 2;
let spread = spreadMin;
let spreadMax = 80;
let drawSwitch = false;
let fps = 60;
let counter = 0;
let counterMax;

class Particle {
  constructor(x, y, xs, ys) {
    this.xPos = x;
    this.yPos = y;
    this.xSize = xs;
    this.ySize = ys;
  }

  update() {
    this.drawParticle();
  }

  drawParticle() {
    stroke(0);
    line(this.xPos, this.yPos, mouseX, mouseY);
    ellipseMode(CENTER);
    ellipse(this.xPos, this.yPos, this.xSize, this.ySize);
  }
}

function setup() {
  createCanvas(640, 480);
  frameRate(fps);
  smooth();
  counterMax = floor(0.2 * fps); // Replace int() with floor()

  for (let i = 0; i < 10; i++) {
    bob.push(new Particle(mouseX, mouseY, 4, 4));
  }
}

function draw() {
  drawCheck();

  if (drawSwitch) {
    for (let i = 0; i < bob.length; i++) {
      let x = mouseX + random(spread) - random(spread);
      let y = mouseY + random(spread) - random(spread);

      stroke(0);
      line(x, y, pmouseX, pmouseY);

      bob[i].xPos = x;
      bob[i].yPos = y;
      bob[i].update();
    }

    if (mouseIsPressed && spread < spreadMax) {
      spread++;
    } else if (!mouseIsPressed && spread > spreadMin) {
      spread--;
    }
  }

  console.log(`spread: ${spread}, drawSwitch: ${drawSwitch}, counter: ${counter}`);
}

function drawCheck() {
  if (mouseIsPressed) {
    drawSwitch = true;
  } else if (!mouseIsPressed && drawSwitch && counter < counterMax) {
    counter++;
  } else if (!mouseIsPressed && drawSwitch && counter >= counterMax) {
    spread = spreadMin;
    drawSwitch = false;
    counter = 0;
  }
}
