let animationData;
let kString;
let startTime;

class KString {
  constructor(text, x, y, size, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.startY = y;
    this.size = size;
    this.color = color;
    this.alpha = 0; // Inizia invisibile per il fade-in
    this.scaleY = 1;
    this.hopStartTime = null;
  }

  fadeIn(progress) {
    this.alpha = progress * 255;
  }

  fadeOut(progress) {
    this.alpha = (1 - progress) * 255;
  }

  move(from, to, progress) {
    this.x = lerp(from.x, to.x, progress);
    this.y = lerp(from.y, to.y, progress);
  }

  hop(progress, hopAmount, inFactor, outFactor, squashFactor) {
    let elapsed = (millis() / 1000) - this.hopStartTime;
    let t = elapsed / 5; // Normalizza rispetto alla durata dell'hop

    if (t >= 1) t = 1;

    if (t < 0.5) {
      t *= 2;
      this.y = this.startY - hopAmount * bezierCurve(t, inFactor, 0);
      this.scaleY = 1 + squashFactor * (1 - t);
    } else {
      t = (t - 0.5) * 2;
      this.y = this.startY - hopAmount * (1 - bezierCurve(t, 0, outFactor));
      this.scaleY = 1 + squashFactor * t;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(1, this.scaleY);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    textAlign(CENTER, CENTER);
    text(this.text, 0, 0);
    pop();
  }
}

// Funzione di interpolazione per il rimbalzo
function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}

function setup() {
  animationData = {
    "canvas": {
      "width": 600,
      "height": 300,
      "backgroundColor": "#FFFFFF"
    },
    "text": {
      "content": "Ciaoooo!",
      "font": "Arial",
      "size": 60,
      "color": "#000000"
    },
    "animations": [
      {
        "type": "fade-in",
        "start_time": 0,
        "duration": 2
      },
      {
        "type": "move",
        "start_time": 2,
        "duration": 3,
        "from": { "x": 100, "y": 150 },
        "to": { "x": 400, "y": 150 },
        "easing": "linear"
      },
      {
        "type": "hop",
        "start_time": 5,
        "duration": 5,
        "hopAmount": 100,
        "inFactor": 0.66,
        "outFactor": 0.66,
        "squashFactor": 0.2
      },
      {
        "type": "fade-out",
        "start_time": 10,
        "duration": 3
      }
    ]
  };

  createCanvas(animationData.canvas.width, animationData.canvas.height);
  background(animationData.canvas.backgroundColor);
  textFont(animationData.text.font);
  textSize(animationData.text.size);
  
  kString = new KString(
    animationData.text.content,
    animationData.animations[1].from.x, 
    animationData.animations[1].from.y,
    animationData.text.size,
    color(animationData.text.color)
  );

  startTime = millis() / 1000; // Converte il tempo in secondi
}

function draw() {
  background(animationData.canvas.backgroundColor);
  let elapsed = (millis() / 1000) - startTime;

  animationData.animations.forEach(anim => {
    let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);

    if (anim.type === "fade-in") {
      kString.fadeIn(progress);
    } 
    else if (anim.type === "move") {
      kString.move(anim.from, anim.to, progress);
    } 
    else if (anim.type === "hop" && elapsed >= anim.start_time) {
      if (kString.hopStartTime === null) kString.hopStartTime = millis() / 1000;
      kString.hop(progress, anim.hopAmount, anim.inFactor, anim.outFactor, anim.squashFactor);
    }
    else if (anim.type === "fade-out") {
      kString.fadeOut(progress);
    }
  });

  kString.display();
}
