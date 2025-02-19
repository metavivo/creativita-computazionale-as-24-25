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
    let d = (i * 6000.0) / 160.0; // Riduzione del ritardo per velocizzare l'effetto
    let x = 300 * (random() - 0.5); // Ridotta dispersione laterale
    let y = 300 * (random() - 0.5);
    let r = 30 * (random() - 0.5);
    drops.push({
      startTime: millis() + 1500 + d,
      duration: 700, // Ridotto il tempo di espansione per maggiore velocità
      xOffset: x,
      yOffset: y,
      rotation: r,
      dropScale: 0.05, // Partono ancora più piccole
      opacity: 0,
    });
  }
}

function draw() {
  background(0);
  let elapsed = millis() - startTime;

  // Fase iniziale: comparsa della scritta "Doccia"
  if (elapsed < fadeDuration) {
    opacity = map(elapsed, 0, fadeDuration, 0, 255);
  } else if (elapsed < 3000) {
    opacity = 255;
  } else {
    opacity = map(elapsed, 3000, 4000, 255, 0);
  }

  fill(255, opacity);
  text("Doccia", width / 2, height / 2);

  // Generazione delle gocce
  for (let drop of drops) {
    let dropElapsed = millis() - drop.startTime;
    if (dropElapsed >= 0 && dropElapsed < drop.duration) {
      let t = dropElapsed / drop.duration;
      let dropScale = easeOutExpo(t) * 2 + 0.1; // Ingrandimento più controllato (max 1/4 dello schermo)
      let dropOpacity = t < 0.9 ? map(t, 0, 0.9, 0, 255) : map(t, 0.9, 1, 255, 0);
      
      push();
      translate(width / 2 + drop.xOffset, height / 2 + drop.yOffset);
      rotate(radians(drop.rotation));
      scale(dropScale);
      fill(255, dropOpacity);
      text("goccia", 0, 0);
      pop();
    }
  }
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - pow(2, -10 * t);
}
