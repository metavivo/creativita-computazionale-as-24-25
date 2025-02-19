let textObj;
let hopAmount = 100; // Altezza del salto
let duration = 2000; // Durata del salto in millisecondi
let startTime;
let inFactor = 0.66;
let outFactor = 0.66;
let squashFactor = 0.2;
let moveSpeed = 5;
let moveDirection = 0;
let phrase = "Benvenuti nel mondo della tipografia cinetica!".split(" ");
let wordIndex = 0;
let rotationAngle = 0;
let rotationSpeed = 0;
let rotationDirection = 1;
let textColor;

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.elt.setAttribute("tabindex", "0"); // Rende il canvas focalizzabile senza clic
  canvas.elt.focus(); // Imposta il focus automaticamente
  setTimeout(() => canvas.elt.focus(), 100); // Assicura il focus anche dopo il caricamento
  textAlign(CENTER, CENTER);
  textSize(32);
  textColor = color(random(255), random(255), random(255));
  textObj = { x: width / 2, y: height + 50, startY: height / 2, scaleY: 1 };
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
    textObj.y = textObj.startY - hopAmount * bezierCurve(t, inFactor, 0);
    textObj.scaleY = 1 + squashFactor * (1 - t);
  } else {
    t = (t - 0.5) * 2;
    textObj.y = textObj.startY - hopAmount * (1 - bezierCurve(t, 0, outFactor));
    textObj.scaleY = 1 + squashFactor * t;
  }

  textObj.x = width / 2;
  rotationAngle += rotationSpeed * rotationDirection;

  fill(textColor);
  push();
  translate(textObj.x, textObj.y);
  rotate(radians(rotationAngle));
  scale(1, textObj.scaleY);
  text(phrase[wordIndex], 0, 0);
  pop();

  if (elapsed >= duration) {
    startTime = millis();
    wordIndex = (wordIndex + 1) % phrase.length;
    rotationAngle = random(-10, 10); // Imposta un angolo di partenza casuale
    rotationSpeed = random(0.5, 2); // Imposta una velocità di rotazione casuale
    rotationDirection = random([-1, 1]); // Direzione casuale di rotazione
    textColor = color(random(255), random(255), random(255)); // Cambia colore ad ogni rimbalzo
  }
}

function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}
