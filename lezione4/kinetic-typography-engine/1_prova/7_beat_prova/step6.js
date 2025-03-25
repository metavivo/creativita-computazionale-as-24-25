let sound, fft;
let playButton;
let started = false;
let lastBeatTime = 0;
let beatThreshold = 60;
let minBeatSeparation = 300;

let textObj;
let hopDuration = 800;
let amount = 100;
let hopping = false;
let hopStartTime = 0;
let inFactor = 0.66;
let outFactor = 0.66;

let beatSlider;

function preload() {
  sound = loadSound('beautiful_people.mp3');
}

function setup() {
  createCanvas(600, 400);
  fft = new p5.FFT(0.9, 1024);
  fft.setInput(sound);

  textObj = { x: width / 2, y: height / 2, startY: height / 2 };

  playButton = createButton('▶️ Avvia musica');
  playButton.position(20, 20);
  playButton.mousePressed(() => {
    sound.play();
    started = true;
    playButton.hide();
  });

  beatSlider = createSlider(200, 2000, minBeatSeparation, 10);
  beatSlider.position(20, height + 10);
  beatSlider.style('width', '200px');
}

function draw() {
  background(0);

  if (!started) {
    fill(255);
    textAlign(CENTER, CENTER);
    text("Clicca ▶️ per avviare la musica", width / 2, height / 2);
    return;
  }

  minBeatSeparation = beatSlider.value();

  let spectrum = fft.analyze();
  let minIndex = 10;
  let maxIndex = 40;
  let sum = 0;
  for (let i = minIndex; i <= maxIndex; i++) {
    sum += spectrum[i];
  }
  let avgEnergy = sum / (maxIndex - minIndex + 1);

  if (avgEnergy > beatThreshold && millis() - lastBeatTime > minBeatSeparation) {
    hopping = true;
    hopStartTime = millis();
    lastBeatTime = millis();
  }

  if (hopping) {
    let t = (millis() - hopStartTime) / hopDuration;
    if (t >= 1) {
      hopping = false;
      textObj.y = textObj.startY;
    } else if (t < 0.5) {
      t *= 2;
      textObj.y = textObj.startY - amount * bezierCurve(t, inFactor, 0);
    } else {
      t = (t - 0.5) * 2;
      textObj.y = textObj.startY - amount * (1 - bezierCurve(t, 0, outFactor));
    }
  } else {
    textObj.y = textObj.startY;
  }

  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Hop", textObj.x, textObj.y);

  // Etichetta slider
  fill(200);
  textSize(14);
  textAlign(LEFT, TOP);
  text("Periodo minimo tra beat: " + minBeatSeparation + " ms", 240, height + 15);
}

function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}

