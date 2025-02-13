function setup() {
  createCanvas(600, 600);
  background(255);
  translate(width / 2, height / 2);
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();

  beginShape();
  for (let t = 0; t < TWO_PI; t += 0.01) {
    let x = 16 * pow(sin(t), 3) * 15;
    let y = -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)) * 15;
    vertex(x, y);
  }
  endShape(CLOSE);
}
