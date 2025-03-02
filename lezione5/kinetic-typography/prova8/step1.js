let animationData;
let kString;
let startTime;

class KString {
  applyAnimation(anim, progress) {
    let methodName = anim.type.replace(/-([a-z])/g, g => g[1].toUpperCase());
    if (typeof this[methodName] === "function") {
      this[methodName](progress, ...Object.values(anim).slice(3));
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

  display() {
    push();
    translate(this.x, this.y);
    shearX(this.shearX);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    textAlign(CENTER, CENTER);
    text(this.text, 0, 0);
    pop();
  }
}

function setup() {
  animationData = {
    "canvas": { "width": 800, "height": 400, "backgroundColor": "#FFFFFF" },
    "text": { "content": "Ciaoooo!", "font": "Arial", "size": 50, "color": "#000000" },
    "animations": [
      { "type": "fadeIn", "start_time": 0, "duration": 2 },
      { "type": "sgommata", "start_time": 2, "duration": 3, "maxSpeed": 10 },
      { "type": "fadeOut", "start_time": 8, "duration": 3 }
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
      kString.applyAnimation(anim, progress);
    }
  });

  kString.display();
}
