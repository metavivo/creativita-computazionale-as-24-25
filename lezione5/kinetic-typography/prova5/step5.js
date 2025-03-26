let animationData = {
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
            "duration": 3,
            "numHops": 10,
            "hopAmount": 80,
            "hopDuration": 0.3,
            "inFactor": 0.66,
            "outFactor": 0.66,
            "squashFactor": 0.2
        },
        {
            "type": "fade-out",
            "start_time": 8,
            "duration": 3
        },
        {
            "type": "rotate", // Aggiungiamo anche rotate qui
            "start_time": 0,    // Puoi cambiare lo start_time
            "duration": 5,    // Durata della rotazione
            "angle": 360,       // Angolo di rotazione
            "direction": 1      // Direzione (1 o -1)
        }
    ]
};

let kString;
let startTime;
let rotationAngle = 0;

class KString {
    constructor(text, x, y, size, color) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.startY = y;
        this.size = size;
        this.color = color;
        this.alpha = 0;
        this.targetColor = color;
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
        this.angularSpeed = 0;
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
            if (this.easingType === 'easeInOut') {
                easedProgress = easeInOut(progress);
            } else if (this.easingType === 'easeIn') {
                easedProgress = easeIn(progress);
            } else if (this.easingType === 'easeOut') {
                easedProgress = easeOut(progress);
            }
            this.x = lerp(this.moveFrom.x, this.moveTo.x, easedProgress);
            this.y = lerp(this.moveFrom.y, this.moveTo.y, easedProgress);
            if (progress >= 1) {
                this.moveStartTime = null;
            }
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

    startRotate(duration, angle, direction) {
        this.rotationStartTime = millis() / 1000;
        this.rotationDuration = duration;
        this.totalRotationAngle = radians(angle);
        this.rotationDirection = direction;
        this.rotating = true;
        this.angularSpeed = this.totalRotationAngle / this.rotationDuration;
        rotationAngle = 0;
    }

    rotate() {
        if (this.rotating && this.rotationStartTime !== null) {
            let elapsed = (millis() / 1000) - this.rotationStartTime;
            if (elapsed < this.rotationDuration) {
                rotationAngle = this.angularSpeed * elapsed * this.rotationDirection;
                console.log("Rotating (during): elapsed =", elapsed, "rotationAngle (deg) =", degrees(rotationAngle));
            } else if (this.rotating) {
                rotationAngle = this.totalRotationAngle * this.rotationDirection;
                this.rotating = false;
                this.rotationStartTime = null;
                console.log("Rotation Finished (natural): elapsed =", elapsed, "rotationAngle (deg) =", degrees(rotationAngle));
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

// Easing functions
function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeIn(t) {
    return t * t;
}

function easeOut(t) {
    return t * (2 - t);
}

function bezierCurve(t, inFactor, outFactor) {
    let c = 3 * inFactor;
    let b = 3 * (1 - outFactor - inFactor) - c;
    let a = 1 - c - b;
    return a * pow(t, 3) + b * pow(t, 2) + c * t;
}

function setup() {
    createCanvas(animationData.canvas.width, animationData.canvas.height);
    background(animationData.canvas.backgroundColor);
    textFont(animationData.text.font);
    textSize(animationData.text.size);
    angleMode(RADIANS);

    let initialX = width / 2;
    let initialY = height / 2;

    // Trova la posizione iniziale per la prima animazione di movimento (se presente)
    let moveAnim = animationData.animations.find(anim => anim.type === "move");
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

    // Avvia le animazioni iniziali
    animationData.animations.forEach(anim => {
        if (anim.type === 'fade-in' && anim.start_time === 0) {
            kString.startFadeIn(anim.duration);
        } else if (anim.type === 'rotate' && anim.start_time === 0) {
            kString.startRotate(anim.duration, anim.angle, anim.direction);
        }
    });
}

function draw() {
    background(animationData.canvas.backgroundColor);
    let elapsed = (millis() / 1000) - startTime;
    const rotationAnim = animationData.animations.find(anim => anim.type === "rotate");

    // Forza l'angolo di rotazione finale se necessario
    if (rotationAnim && kString.rotating && elapsed >= rotationAnim.start_time + rotationAnim.duration - 0.001) {
        rotationAngle = kString.totalRotationAngle * kString.rotationDirection;
        kString.rotating = false;
        kString.rotationStartTime = null;
        console.log("Rotation Finished (forced in draw): elapsed =", elapsed, "rotationAngle (deg) =", degrees(rotationAngle));
    }

    animationData.animations.forEach(anim => {
        if (elapsed >= anim.start_time && elapsed < anim.start_time + anim.duration) {
            switch (anim.type) {
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
                    if (!kString.rotating) {
                        kString.startRotate(anim.duration, anim.angle, anim.direction);
                    }
                    kString.rotate();
                    break;
            }
        }
    });

    kString.display();
}
