class KString {
  constructor(content, x, y, fontSize, color, xShear, yShear, duration) {
    this.content = content;
    this.pos = createVector(x, y);
    this.fontSize = fontSize;
    this.color = color;
    this.xShear = xShear;
    this.yShear = yShear;
    this.startTime = frameCount;
    this.duration = duration;
  }

  display() {
    let elapsed = frameCount - this.startTime;
    if (elapsed > this.duration) return; // Scompare dopo la durata impostata

    push();
    translate(this.pos.x, this.pos.y);
    
    // Applicazione dello shear (inclinazione)
    applyMatrix(1, this.xShear, this.yShear, 1, 0, 0);

    // Disegna il testo
    fill(this.color);
    textSize(this.fontSize);
    text(this.content, 0, 0);
    pop();
  }
}

// Array di stringhe cinetiche
let kineticStrings = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");

  // Creazione di più stringhe cinetiche
  kineticStrings.push(new KString("Kinetic", 200, 200, 40, color(255, 0, 0), 0.2, 0, 100));
  kineticStrings.push(new KString("Typography", 300, 300, 50, color(0, 255, 0), 0, 0.3, 150));
  kineticStrings.push(new KString("Valitutti", 400, 400, 60, color(0, 0, 255), -0.1, 0.1, 200));
}

function draw() {
  background(10);
  
  // Visualizza tutte le stringhe cinetiche
  for (let ks of kineticStrings) {
    ks.display();
  }
}
