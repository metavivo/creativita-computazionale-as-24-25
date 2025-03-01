let animationData;
let textObj;
let startTime;

function preload() {
  // Carica il JSON delle animazioni
  animationData = {
    "text": "Kinetic Typography",
    "font": "Arial",
    "size": 48,
    "color": "#FFFFFF",
    "animations": [
      {
        "type": "fade-in",
        "start_time": 0,
        "duration": 1,
        "target": "word",
        "easing": "ease-in-out"
      },
      {
        "type": "move",
        "start_time": 1,
        "duration": 2,
        "from": { "x": 0, "y": 100 },
        "to": { "x": 200, "y": 100 },
        "easing": "linear"
      },
      {
        "type": "scale",
        "start_time": 3,
        "duration": 1.5,
        "from": 1,
        "to": 2,
        "easing": "ease-out"
      }
    ]
  };
}

function setup() {
  createCanvas(400, 200);
  textFont(animationData.font);
  textSize(animationData.size);
  fill(animationData.color);
  
  // Inizializza il testo con le proprietà di base
  textObj = {
    text: animationData.text,
    x: animationData.animations[1].from.x,
    y: animationData.animations[1].from.y,
    alpha: 0,
    scale: animationData.animations[2].from
  };

  startTime = millis() / 1000; // Converte il tempo in secondi
}

function draw() {
  background(0);
  let elapsed = (millis() / 1000) - startTime;
  
  // Applica le animazioni
  animationData.animations.forEach(anim => {
    let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);
    
    if (anim.type === "fade-in") {
      textObj.alpha = easeInOut(progress) * 255;
    } 
    else if (anim.type === "move") {
      textObj.x = lerp(anim.from.x, anim.to.x, progress);
    } 
    else if (anim.type === "scale") {
      textObj.scale = lerp(anim.from, anim.to, progress);
    }
  });

  // Disegna il testo con le trasformazioni applicate
  push();
  translate(textObj.x, textObj.y);
  scale(textObj.scale);
  fill(255, 255, 255, textObj.alpha);
  textAlign(CENTER, CENTER);
  text(animationData.text, 0, 0);
  pop();
}

// Funzione di easing per il fade-in
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
