let animationData;
let kString;
let startTime;
let rotationAngle = 0; // Angolo di rotazione corrente

class KString {
    constructor(text, x, y, size) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.startY = y;
        this.size = size;
        this.color = color(255); // Inizializza con colore bianco
        this.alpha = 0; // Inizia invisibile per il fade-in
        this.targetColor = color(0); // Colore finale nero
        this.fadeStartTime = null;
        this.fadeDuration = 0;
        this.fadingIn = false;
        this.scaleY = 1;
        this.hopStartTime = null;
        this.numHops = 0;
        this.hopDuration = 0;
        this.rotationStartTime = null;
        this.rotationDuration = 0;
        this.rotationDirection = 1; // 1 per orario, -1 per antiorario
        this.totalRotationAngle = 0; // Angolo totale di rotazione
        this.rotating = false;
    }

    startFadeIn(duration) {
        this.alpha = 0;
        this.fadeStartTime = millis() / 1000;
        this.fadeDuration = duration;
        this.fadingIn = true;
    }

    fadeIn() {
        if (this.fadingIn && this.fadeStartTime !== null) {
            let elapsed = (millis() / 1000) - this.fadeStartTime;
            let progress = constrain(elapsed / this.fadeDuration, 0, 1);
            const eased = easeInOut(progress);
            this.color = lerpColor(color(255), this.targetColor, eased);
            this.alpha = 255; // Rendi completamente opaco nel colore corrente
            if (progress >= 1) {
                this.fadeStartTime = null;
                this.fadingIn = false;
            }
        } else if (!this.fadingIn && this.alpha < 255) {
            this.alpha = 255; // Assicura opacità dopo il fade-in
            this.color = this.targetColor; // Assicura il colore nero dopo il fade-in
        }
    }

    startRotate(duration, angle, direction) {
        this.rotationStartTime = millis() / 1000;
        this.rotationDuration = duration;
        this.totalRotationAngle = radians(angle);
        this.rotationDirection = direction;
        this.rotating = true;
        rotationAngle = 0; // Resetta l'angolo all'inizio della rotazione
    }

    rotate() {
        if (this.rotating && this.rotationStartTime !== null) {
            let elapsed = (millis() / 1000) - this.rotationStartTime;
            let progress = constrain(elapsed / this.rotationDuration, 0, 1);
            rotationAngle = this.totalRotationAngle * progress * this.rotationDirection;
            console.log("Rotating: elapsed =", elapsed, "progress =", progress, "rotationAngle (deg) =", degrees(rotationAngle));
            if (progress >= 1) {
                this.rotating = false;
                this.rotationStartTime = null;
                rotationAngle = 0; // Forza l'angolo a 0 alla fine
                console.log("Rotation Finished: rotationAngle (deg) =", degrees(rotationAngle));
            }
        }
    }

    fadeOut(progress) {
        const eased = easeInOut(progress);
        this.alpha = (1 - eased) * 255;
    }

    move(from, to, progress) {
        this.x = lerp(from.x, to.x, progress);
        this.y = lerp(from.y, to.y, progress);
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
        rotate(rotationAngle);
        scale(1, this.scaleY);
        fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
        textAlign(CENTER, CENTER);
        text(this.text, 0, 0);
        pop();
    }
}

// Funzione easing per fade-in/out
function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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
            "content": "Ruota!",
            "font": "Arial",
            "size": 60
        },
        "animations": [
            {
                "type": "fade-in",
                "start_time": 0,
                "duration": 2
            },
            {
                "type": "rotate",
                "start_time": 2,
                "duration": 1.5,
                "angle": 360,
                "direction": 1 // 1 = orario, -1 = antiorario
            },
            {
                "type": "move",
                "start_time": 3.5,
                "duration": 3,
                "from": { "x": 100, "y": 150 },
                "to": { "x": 400, "y": 150 },
                "easing": "linear"
            },
            {
                "type": "hop",
                "start_time": 6.5,
                "duration": 3,
                "numHops": 5,
                "hopAmount": 50,
                "hopDuration": 0.4,
                "inFactor": 0.66,
                "outFactor": 0.66,
                "squashFactor": 0.15
            },
            {
                "type": "fade-out",
                "start_time": 9.5,
                "duration": 2
            }
        ]
    };

    createCanvas(animationData.canvas.width, animationData.canvas.height);
    background(animationData.canvas.backgroundColor);
    textFont(animationData.text.font);
    textSize(animationData.text.size);

    // Trova la posizione iniziale per la prima animazione di movimento (se presente)
    let initialX = width / 2;
    let initialY = height / 2;
    let moveAnim = animationData.animations.find(anim => anim.type === "move");
    if (moveAnim) {
        initialX = moveAnim.from.x;
        initialY = moveAnim.from.y;
    }

    kString = new KString(
        animationData.text.content,
        initialX,
        initialY,
        animationData.text.size
    );

    startTime = millis() / 1000;

    // Inizia il fade-in all'avvio
    let fadeInAnim = animationData.animations.find(anim => anim.type === "fade-in");
    if (fadeInAnim) {
        kString.startFadeIn(fadeInAnim.duration);
    }
}

function draw() {
    background(animationData.canvas.backgroundColor);
    let elapsed = (millis() / 1000) - startTime;

    animationData.animations.forEach(anim => {
        let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);

        if (anim.type === "fade-in") {
            kString.fadeIn();
        }
        else if (anim.type === "rotate" && elapsed >= anim.start_time && elapsed < anim.start_time + anim.duration) {
            if (!kString.rotating) {
                kString.startRotate(anim.duration, anim.angle, anim.direction);
            }
            kString.rotate();
        }
        else if (anim.type === "move") {
            kString.move(anim.from, anim.to, progress);
        }
        else if (anim.type === "hop" && elapsed >= anim.start_time) {
            if (kString.hopStartTime === null) kString.hopStartTime = millis() / 1000;
            kString.hop(progress, anim.numHops, anim.hopAmount, anim.hopDuration, anim.inFactor, anim.outFactor, anim.squashFactor);
        }
        else if (anim.type === "fade-out") {
            kString.fadeOut(progress);
        }
    });

    kString.display();
}

// Funzione easing per fade-in/out
function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Funzione di interpolazione per il rimbalzo
function bezierCurve(t, inFactor, outFactor) {
    let c = 3 * inFactor;
    let b = 3 * (1 - outFactor - inFactor) - c;
    let a = 1 - c - b;
    return a * pow(t, 3) + b * pow(t, 2) + c * t;
}
