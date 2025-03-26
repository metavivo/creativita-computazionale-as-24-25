let animationData = {
  "canvas": { "width": 800, "height": 400, "backgroundColor": "#ffffff" },
  "k-string": {
    "x": 0,
    "y": 200, 
    "content": "Ciaoooo!", 
    "font": "Arial", 
    "size": 50, 
    "color": "#000000"
  },
  "animations": [
    { "type": "move", "duration": 3, "fromX": 0, "toX": 600 }
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

  constructor(content, x, y, size, color) {
    this.text = content;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.alpha = 255;
    this.shearX = 0;
  }

  move(progress, fromX, toX) {
    this.x = lerp(fromX, toX, easeOut(progress));
  }

  display() {
    console.log("DISPLAYING:", this.text, "at", this.x, this.y);
    push();
    translate(this.x, this.y);
    // shearX(this.shearX); // rimosso per debug
    fill(0); // forziamo colore nero per debug
    textAlign(LEFT, CENTER);
    textSize(this.size);
    text(this.text, 0, 0);
    pop();
  }
}

function easeOut(t) {
  return t * (2 - t);
}

function setup() {
  createCanvas(animationData.canvas.width, animationData.canvas.height);
  background(animationData.canvas.backgroundColor);
  textFont(animationData["k-string"].font);
  textSize(animationData["k-string"].size);

  kString = new KString(
    animationData["k-string"].content,
    animationData["k-string"].x,
    animationData["k-string"].y,
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
