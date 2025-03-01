let animationData;
let kString;
let startTime;

class KString {
  constructor(text, x, y, size, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.alpha = 0; // Inizia invisibile per il fade-in
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

  hopElastic(progress, height, frequency) {
    let elapsed = (millis() / 1000) - this.hopStartTime;
    this.y += sin(elapsed * frequency * TWO_PI) * height;
  }

  display() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }
}

function preload() {
  // Carica i dati JSON (in questo caso è hardcoded)
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
        "type": "hop-elastic",
        "start_time": 5,
        "duration": 5,
        "height": 50,
        "frequency": 2
      },
      {
        "type": "fade-out",
        "start_time": 10,
        "duration": 3
      }
    ]
  };
}

function setup() {
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
    else if (anim.type === "hop-elastic" && elapsed >= anim.start_time) {
      if (kString.hopStartTime === null) kString.hopStartTime = millis() / 1000;
      kString.hopElastic(progress, anim.height, anim.frequency);
    }
    else if (anim.type === "fade-out") {
      kString.fadeOut(progress);
    }
  });

  kString.display();
}
