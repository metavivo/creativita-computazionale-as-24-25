let t = 0;
let scaleFactor = 15;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  // Funzione impulsiva più stretta e intensa per simulare un battito forte
  let pulse = 1 + 0.5 * exp(-30 * pow(sin(t), 2));
  t += 0.05;
  
  // Disegno del cuore
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.01) {
    let x = 16 * pow(sin(angle), 3) * scaleFactor * pulse;
    let y = -(13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle)) * scaleFactor * pulse;
    vertex(x, y);
  }
  endShape(CLOSE);
}
