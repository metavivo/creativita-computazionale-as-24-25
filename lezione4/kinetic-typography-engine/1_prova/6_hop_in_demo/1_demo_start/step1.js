let textObj;
let startTime;
let duration = 4000;
let fadeDuration = 1000;
let curveDuration = 800;
let curveAmount = 100;
let shearAmount = 0.2;
let opacity = 0;
let xOffset = 0;
let shear = 0;
let moveStart = 2000; // Tempo di inizio del movimento
let moveDuration = 1200;
let moveAmount = 400;
let moveProgress = 0;

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.elt.setAttribute("tabindex", "0");
  canvas.elt.focus();
  setTimeout(() => canvas.elt.focus(), 100);
  textAlign(CENTER, CENTER);
  textSize(32);
  textObj = { x: width / 2, y: height / 2 };
  startTime = millis();
}

function draw() {
  background(0);
  let elapsed = millis() - startTime;
  let t = elapsed / duration;

  // Fase iniziale: comparsa della scritta ferma
  if (t < fadeDuration / duration) {
    opacity = map(elapsed, 0, fadeDuration, 0, 255);
  } else {
    opacity = 255;
  }

  // Effetto di oscillazione elastica iniziale (fermo con rimbalzo orizzontale)
  if (elapsed >= moveStart - curveDuration && elapsed < moveStart) {
    let tCurve = (elapsed - (moveStart - curveDuration)) / curveDuration;
    xOffset = symmetricCurveEffect(tCurve, curveAmount);
    shear = symmetricCurveSecondaryEffect(tCurve, shearAmount);
  }

  // Dopo l'oscillazione, movimento fluido verso destra senza scatti
  if (elapsed >= moveStart) {
    let tMove = (elapsed - moveStart) / moveDuration;
    moveProgress = easeOutExpo(tMove);
  }

  fill(255, opacity);
  push();
  translate(textObj.x + xOffset + moveProgress * moveAmount, textObj.y);
  shearX(shear);
  text("demo start", 0, 0);
  pop();
}

function symmetricCurveEffect(t, amount) {
  if (t > 1) return 0;
  let c = 3 * 0.6;
  let b = 3 * (1 - 0.6 - 0.6) - c;
  let a = 1 - c - b;
  return amount * (a * pow(t, 3) + b * pow(t, 2) + c * t);
}

function symmetricCurveSecondaryEffect(t, amount) {
  if (t > 1) return 0;
  let c = 3 * 0.6;
  let b = 3 * (1 - 0.6 - 0.6) - c;
  let a = 1 - c - b;
  return amount * (3 * a * pow(t, 2) + 2 * b * t + c);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - pow(2, -10 * t);
}
