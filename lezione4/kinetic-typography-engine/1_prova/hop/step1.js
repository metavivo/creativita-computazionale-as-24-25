let textObj;
let duration = 2000; // Durata del salto in millisecondi
let startTime;
let inFactor = 0.66;
let outFactor = 0.66;
let amount = 100;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  textObj = { x: width / 2, y: height / 2, startY: height / 2 };
  startTime = millis();
}

function draw() {
  background(0);
  let elapsed = millis() - startTime;
  let t = elapsed / duration;
  
  if (t >= 1) {
    t = 1;
  }
  
  if (t < 0.5) {
    t *= 2;
    textObj.y = textObj.startY - amount * bezierCurve(t, inFactor, 0);
  } else {
    t = (t - 0.5) * 2;
    textObj.y = textObj.startY - amount * (1 - bezierCurve(t, 0, outFactor));
  }

  text("Hop", textObj.x, textObj.y);
  
  if (elapsed >= duration) {
    startTime = millis();
  }
}

function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}
