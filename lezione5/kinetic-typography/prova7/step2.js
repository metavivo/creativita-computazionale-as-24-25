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
    this.alpha = 0;
    this.shearX = 0;
    this.velocityX = 0;
    this.accelerationX = 0.5;
    this.hopStartTime = null;
    this.numHops = 0;
    this.hopDuration = 0;
  }

  fadeIn(progress) {
    this.alpha = progress * 255;
  }

  fadeOut(progress) {
    this.alpha = (1 - progress) * 255;
  }

  sgommata(progress, maxSpeed) {
    if (progress < 1 && this.x < 600) {
      this.velocityX += this.accelerationX;
      if (this.velocityX > maxSpeed) this.velocityX = maxSpeed;
      this.x += this.velocityX;
      this.shearX = sin(progress * PI) * 0.5;
    }
  }

  hop(progress, numHops, hopAmount, hopDuration, inFactor, outFactor, squashFactor) {
    let elapsed = (millis() / 1000) - this.hopStartTime;
    let singleHopTime = hopDuration;
    let totalHopDuration = numHops * singleHopTime;

    let currentHop = floor(elapsed / singleHopTime);
    let t = (elapsed % singleHopTime) / singleHopTime;

    if (currentHop >= numHops) return;

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
    shearX(this.shearX);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    textAlign(CENTER, CENTER);
    text(this.text, 0, 0);
    pop();
  }
}

function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}

function setup() {
  animationData = {
    "canvas": { "width": 800, "height": 400, "backgroundColor": "#FFFFFF" },
    "text": { "content": "Ciaoooo!", "font": "Arial", "size": 50, "color": "#000000" },
    "animations": [
      { "type": "fade-in", "start_time": 0, "duration": 2 },
      { "type": "sgommata", "start_time": 2, "duration": 3, "maxSpeed": 10 },
      { "type": "hop", "start_time": 5, "duration": 3, "numHops": 10, "hopAmount": 50, "hopDuration": 0.3, "inFactor": 0.66, "outFactor": 0.66, "squashFactor": 0.2 },
      { "type": "fade-out", "start_time": 8, "duration": 3 }
    ]
  };

  createCanvas(animationData.canvas.width, animationData.canvas.height);
  background(animationData.canvas.backgroundColor);
  textFont(animationData.text.font);
  textSize(animationData.text.size);

  kString = new KString(
    animationData.text.content,
    50,
    200,
    animationData.text.size,
    color(animationData.text.color)
  );

  startTime = millis() / 1000;
}

function draw() {
  background(animationData.canvas.backgroundColor);
  let elapsed = (millis() / 1000) - startTime;

  animationData.animations.forEach(anim => {
    let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);
    if (progress > 0) {
      if (anim.type === "fade-in") kString.fadeIn(progress);
      if (anim.type === "sgommata") kString.sgommata(progress, anim.maxSpeed);
      if (anim.type === "hop") {
        if (kString.hopStartTime === null) kString.hopStartTime = millis() / 1000;
        kString.hop(progress, anim.numHops, anim.hopAmount, anim.hopDuration, anim.inFactor, anim.outFactor, anim.squashFactor);
      }
      if (anim.type === "fade-out") kString.fadeOut(progress);
    }
  });

  kString.display();
}
