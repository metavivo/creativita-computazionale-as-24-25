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

  sgommata(progress, maxSpeed) {
    if (progress < 1) {
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
    "canvas": { "width": 600, "height": 300, "backgroundColor": "#FFFFFF" },
    "text": { "content": "Ciaoooo!", "font": "Arial", "size": 60, "color": "#000000" },
    "animations": [
      { "type": "fade-in", "start_time": 0, "duration": 2 },
      { "type": "sgommata", "start_time": 2, "duration": 3, "maxSpeed": 10 },
      { "type": "fade-out", "start_time": 6, "duration": 3 }
    ]
  };

  createCanvas(animationData.canvas.width, animationData.canvas.height);
  background(animationData.canvas.backgroundColor);
  textFont(animationData.text.font);
  textSize(animationData.text.size);

  kString = new KString(
    animationData.text.content,
    50,
    150,
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
      if (anim.type === "fade-out") kString.fadeOut(progress);
    }
  });

  kString.display();
}
