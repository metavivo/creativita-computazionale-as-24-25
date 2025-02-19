let textObj;
let startTime;
let fadeDuration = 1000;
let showerDuration = 4000;
let opacity = 0;
let drops = [];
let numDrops = 150;

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.elt.setAttribute("tabindex", "0");
  canvas.elt.focus();
  setTimeout(() => canvas.elt.focus(), 100);
  textAlign(CENTER, CENTER);
  textSize(32);
  textObj = { x: width / 2, y: height / 2 };
  startTime = millis();
  
  for (let i = 0; i < numDrops; i++) {
    let d = (i * 12000.0) / 160.0;
    let x = 400 * (random() - 0.5);
    let y = 400 * (random() - 0.5);
    let r = 30 * (random() - 0.5);
    drops.push({
      startTime: millis() + 2000 + d,
      duration: 1000,
      xOffset: x,
      yOffset: y,
      rotation: r,
      dropScale: 0.1,
      opacity: 0,
    });
  }
}

function draw() {
  background(0);
  let elapsed = millis() - startTime;

  // Fase iniziale: comparsa della scritta "Shower"
  if (elapsed < fadeDuration) {
    opacity = map(elapsed, 0, fadeDuration, 0, 255);
  } else if (elapsed < 3000) {
    opacity = 255;
  } else {
    opacity = map(elapsed, 3000, 4000, 255, 0);
  }

  fill(255, opacity);
  text("Shower", width / 2, height / 2);

  // Generazione delle gocce
  for (let drop of drops) {
    let dropElapsed = millis() - drop.startTime;
    if (dropElapsed >= 0 && dropElapsed < drop.duration) {
      let t = dropElapsed / drop.duration;
      let dropScale = easeOutExpo(t) * 0.8 + 0.1;
      let dropOpacity = t < 0.9 ? map(t, 0, 0.9, 0, 255) : map(t, 0.9, 1, 255, 0);
      
      push();
      translate(width / 2 + drop.xOffset, height / 2 + drop.yOffset);
      rotate(radians(drop.rotation));
      scale(dropScale);
      fill(255, dropOpacity);
      text("drop", 0, 0);
      pop();
    }
  }
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - pow(2, -10 * t);
}
