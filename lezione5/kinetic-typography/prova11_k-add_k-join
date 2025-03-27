// sketch.js - p5.js completo con rotate + resetRotation (smooth o instant)

let animationData = {
  canvas: {
    width: 600,
    height: 300,
    backgroundColor: "#FFFFFF"
  },
  text: {
    content: "Ciaoooo!",
    font: "Arial",
    size: 60,
    color: "#000000"
  },
  structure: {
    op: "k-join",
    args: [
      { effect: "fade-in", duration: 2 },
      {
        op: "k-add",
        args: [
          {
            effect: "move",
            duration: 3,
            from: { x: 100, y: 150 },
            to: { x: 400, y: 150 },
            easing: "linear"
          },
          {
            effect: "rotate",
            duration: 3,
            angle: 360,
            direction: 1,
            resetRotation: {
              enabled: true,
              mode: "smooth",   // "instant" o "smooth"
              duration: 0.8,
              easing: "easeOut"
            }
          }
        ]
      },
      {
        effect: "hop",
        duration: 3,
        numHops: 10,
        hopAmount: 80,
        hopDuration: 0.3,
        inFactor: 0.66,
        outFactor: 0.66,
        squashFactor: 0.2
      },
      { effect: "fade-out", duration: 3 }
    ]
  }
};

function expandAnimations(node, startTime = 0) {
  let animations = [];
  if (node.effect) {
    const anim = structuredClone(node);
    anim.start_time = startTime;
    animations.push(anim);
  } else if (node.op === "k-join") {
    let localTime = startTime;
    for (let arg of node.args) {
      const childAnims = expandAnimations(arg, localTime);
      animations.push(...childAnims);
      const lastDuration = Math.max(...childAnims.map(a => a.duration || 0));
      localTime += lastDuration;
    }
  } else if (node.op === "k-add") {
    for (let arg of node.args) {
      const childAnims = expandAnimations(arg, startTime);
      animations.push(...childAnims);
    }
  }
  return animations;
}

let kString;
let startTime;
let rotationAngle = 0;

function setup() {
  createCanvas(animationData.canvas.width, animationData.canvas.height);
  background(animationData.canvas.backgroundColor);
  textFont(animationData.text.font);
  textSize(animationData.text.size);
  angleMode(RADIANS);

  animationData.animations = expandAnimations(animationData.structure);

  let initialX = width / 2;
  let initialY = height / 2;
  let moveAnim = animationData.animations.find(anim => anim.effect === "move");
  if (moveAnim) {
    initialX = moveAnim.from.x;
    initialY = moveAnim.from.y;
  }

  kString = new KString(
    animationData.text.content,
    initialX,
    initialY,
    animationData.text.size,
    color(animationData.text.color)
  );

  startTime = millis() / 1000;

  animationData.animations.forEach(anim => {
    if (anim.effect === 'fade-in' && anim.start_time === 0) {
      kString.startFadeIn(anim.duration);
    } else if (anim.effect === 'rotate' && anim.start_time === 0) {
      kString.startRotate(anim.duration, anim.angle, anim.direction, anim.resetRotation);
    }
  });
}

function draw() {
  background(animationData.canvas.backgroundColor);
  let elapsed = (millis() / 1000) - startTime;

  let activeAnimations = animationData.animations
    .filter(anim => elapsed >= anim.start_time && elapsed < anim.start_time + anim.duration)
    .sort((a, b) => {
      if (a.start_time !== b.start_time) return a.start_time - b.start_time;
      return animationData.animations.indexOf(a) - animationData.animations.indexOf(b);
    });

  activeAnimations.forEach(anim => {
    switch (anim.effect) {
      case 'fade-in':
        kString.fadeIn();
        break;
      case 'fade-out':
        kString.fadeOut();
        break;
      case 'move':
        if (kString.moveStartTime === null) {
          kString.startMove(anim.duration, anim.from, anim.to, anim.easing);
        }
        kString.move();
        break;
      case 'hop':
        if (kString.hopStartTime === null) {
          kString.startHop(anim.duration, anim.numHops, anim.hopAmount, anim.hopDuration, anim.inFactor, anim.outFactor, anim.squashFactor);
        }
        kString.hop();
        break;
      case 'rotate':
        if (!kString.rotating && !kString.rotationResetting) {
          kString.startRotate(anim.duration, anim.angle, anim.direction, anim.resetRotation);
        }
        kString.rotate();
        break;
    }
  });

  kString.display();
}

class KString {
  constructor(text, x, y, size, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.startY = y;
    this.size = size;
    this.color = color;
    this.alpha = 0;
    this.fadeStartTime = null;
    this.fadeDuration = 0;
    this.fadingIn = false;
    this.fadingOut = false;
    this.moveStartTime = null;
    this.moveDuration = 0;
    this.moveFrom = { x: 0, y: 0 };
    this.moveTo = { x: 0, y: 0 };
    this.easingType = 'linear';
    this.scaleY = 1;
    this.hopStartTime = null;
    this.numHops = 0;
    this.hopDuration = 0;
    this.hopAmount = 0;
    this.inFactor = 0;
    this.outFactor = 0;
    this.squashFactor = 0;
    this.rotationStartTime = null;
    this.rotationDuration = 0;
    this.totalRotationAngle = 0;
    this.rotationDirection = 1;
    this.rotating = false;
    this.rotationResetting = false;
    this.rotationResetStartTime = null;
    this.rotationResetDuration = 0;
    this.resetEasing = easeOut;
  }

  startFadeIn(duration) {
    this.alpha = 0;
    this.fadeStartTime = millis() / 1000;
    this.fadeDuration = duration;
    this.fadingIn = true;
    this.fadingOut = false;
  }

  fadeIn() {
    if (this.fadingIn && this.fadeStartTime !== null) {
      let elapsed = (millis() / 1000) - this.fadeStartTime;
      let progress = constrain(elapsed / this.fadeDuration, 0, 1);
      const eased = easeInOut(progress);
      this.alpha = 255 * eased;
      if (progress >= 1) {
        this.fadeStartTime = null;
        this.fadingIn = false;
      }
    }
  }

  startFadeOut(duration) {
    this.alpha = 255;
    this.fadeStartTime = millis() / 1000;
    this.fadeDuration = duration;
    this.fadingOut = true;
    this.fadingIn = false;
  }

  fadeOut() {
    if (this.fadingOut && this.fadeStartTime !== null) {
      let elapsed = (millis() / 1000) - this.fadeStartTime;
      let progress = constrain(elapsed / this.fadeDuration, 0, 1);
      const eased = easeInOut(progress);
      this.alpha = 255 * (1 - eased);
      if (progress >= 1) {
        this.fadeStartTime = null;
        this.fadingOut = false;
        this.alpha = 0;
      }
    }
  }

  startMove(duration, from, to, easing = 'linear') {
    this.moveStartTime = millis() / 1000;
    this.moveDuration = duration;
    this.moveFrom = from;
    this.moveTo = to;
    this.easingType = easing;
  }

  move() {
    if (this.moveStartTime !== null) {
      let elapsed = (millis() / 1000) - this.moveStartTime;
      let progress = constrain(elapsed / this.moveDuration, 0, 1);
      let easedProgress = progress;
      if (this.easingType === 'easeInOut') easedProgress = easeInOut(progress);
      else if (this.easingType === 'easeIn') easedProgress = easeIn(progress);
      else if (this.easingType === 'easeOut') easedProgress = easeOut(progress);
      this.x = lerp(this.moveFrom.x, this.moveTo.x, easedProgress);
      this.y = lerp(this.moveFrom.y, this.moveTo.y, easedProgress);
      if (progress >= 1) this.moveStartTime = null;
    }
  }

  startHop(duration, numHops, hopAmount, hopDuration, inFactor, outFactor, squashFactor) {
    this.hopStartTime = millis() / 1000;
    this.numHops = numHops;
    this.hopDuration = hopDuration;
    this.hopAmount = hopAmount;
    this.inFactor = inFactor;
    this.outFactor = outFactor;
    this.squashFactor = squashFactor;
  }

  hop() {
    if (this.hopStartTime !== null) {
      let elapsed = (millis() / 1000) - this.hopStartTime;
      let singleHopTime = this.hopDuration;
      let currentHop = floor(elapsed / singleHopTime);
      let t = (elapsed % singleHopTime) / singleHopTime;
      if (currentHop >= this.numHops) return;
      if (t < 0.5) {
        t *= 2;
        this.y = this.startY - this.hopAmount * bezierCurve(t, this.inFactor, 0);
        this.scaleY = 1 + this.squashFactor * (1 - t);
      } else {
        t = (t - 0.5) * 2;
        this.y = this.startY - this.hopAmount * (1 - bezierCurve(t, 0, this.outFactor));
        this.scaleY = 1 + this.squashFactor * t;
      }
    }
  }

  startRotate(duration, angle, direction, resetOpts) {
    this.rotationStartTime = millis() / 1000;
    this.rotationDuration = duration;
    this.totalRotationAngle = radians(angle);
    this.rotationDirection = direction;
    this.rotating = true;
    this.angularSpeed = this.totalRotationAngle / this.rotationDuration;
    this.resetRotationOpts = resetOpts;
  }

  rotate() {
    let now = millis() / 1000;
    if (this.rotating && this.rotationStartTime !== null) {
      let elapsed = now - this.rotationStartTime;
      if (elapsed < this.rotationDuration) {
        rotationAngle = this.angularSpeed * elapsed * this.rotationDirection;
      } else {
        this.rotating = false;
        this.rotationStartTime = null;

        if (this.resetRotationOpts?.enabled) {
          if (this.resetRotationOpts.mode === "instant") {
            rotationAngle = 0;
          } else if (this.resetRotationOpts.mode === "smooth") {
            this.rotationResetting = true;
            this.rotationResetStartTime = now;
            this.rotationResetDuration = this.resetRotationOpts.duration || 0.8;
            this.resetEasing = getEasingFunction(this.resetRotationOpts.easing);
            this.rotationStartAngle = rotationAngle;
          }
        } else {
          rotationAngle = this.totalRotationAngle * this.rotationDirection;
        }
      }
    } else if (this.rotationResetting) {
      let elapsed = now - this.rotationResetStartTime;
      let progress = constrain(elapsed / this.rotationResetDuration, 0, 1);
      rotationAngle = lerp(this.rotationStartAngle, 0, this.resetEasing(progress));
      if (progress >= 1) {
        this.rotationResetting = false;
        rotationAngle = 0;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(rotationAngle);
    scale(1, this.scaleY);
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    textAlign(CENTER, CENTER);
    text(this.text, 0, 0);
    pop();
  }
}

// --------------------------
// Easing functions
// --------------------------
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeIn(t) {
  return t * t;
}
function easeOut(t) {
  return t * (2 - t);
}
function getEasingFunction(name) {
  if (name === "easeIn") return easeIn;
  if (name === "easeOut") return easeOut;
  return easeInOut;
}
function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}
