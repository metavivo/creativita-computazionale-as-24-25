let animationData = {
  "canvas": { "width": 800, "height": 400, "backgroundColor": "#FFFFFF" },
  "k-string": {
    "x": 0,
    "y": 200, "content": "Ciaoooo!", "font": "Arial", "size": 50, "color": "#000000" },
  "animations": [
    { "type": "fadeIn", "duration": 1 },
    { "type": "sgommata", "duration": 3, "maxSpeed": 10 },
    { "type": "fadeOut", "duration": 1 }
  ]
};

let kString;
let startTime;

class KString {
  applyAnimation(anim, progress) {
    let methodName = anim.type.replace(/-([a-z])/g, g => g[1].toUpperCase());
    if (typeof this[methodName] === "function") {
      this[methodName](progress, ...Object.values(anim).slice(2));
    }
  }
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

  display() {
    push();
    translate(this.x, this.y);
    shearX(this.shearX);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    textAlign(LEFT, CENTER);
    text(this.text, 0, 0);
    pop();
  }
}

function setup() {
  createCanvas(animationData.canvas.width, animationData.canvas.height);
  background(animationData.canvas.backgroundColor);
  textFont(animationData["k-string"].font);
  textSize(animationData["k-string"].size);

  kString = new KString(
    animationData["k-string"].content,
    50,
    200,
    animationData["k-string"].size,
    color(animationData["k-string"].color)
  );

  startTime = millis() / 1000;

  let accumulatedStartTime = 0;
  animationData.animations.forEach(anim => {
    anim.start_time = accumulatedStartTime;
    accumulatedStartTime += anim.duration;
  });
}

function draw() {
  background(animationData.canvas.backgroundColor);
  let elapsed = (millis() / 1000) - startTime;

  animationData.animations.forEach(anim => {
    let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);
    if (progress > 0) {
      kString.applyAnimation(anim, progress);
    }
  });

  kString.display();
}
