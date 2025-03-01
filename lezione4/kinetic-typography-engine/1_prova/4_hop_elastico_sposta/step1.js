
let textObj;
let duration = 2000; // Durata del salto in millisecondi
let startTime;
let inFactor = 0.66;
let outFactor = 0.66;
let amount = 100;
let moveSpeed = 5;
let moveDirection = 0;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.elt.setAttribute("tabindex", "0"); // Permette il controllo da tastiera
  canvas.elt.focus(); // Imposta automaticamente il focus sul canvas
  setTimeout(() => canvas.elt.focus(), 100); // Assicura il focus dopo il caricamento
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
  
  textObj.x += moveDirection * moveSpeed;
  textObj.x = constrain(textObj.x, 50, width - 50);
  
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

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    moveDirection = -1;
  } else if (keyCode === RIGHT_ARROW) {
    moveDirection = 1;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    moveDirection = 0;
  }
}
