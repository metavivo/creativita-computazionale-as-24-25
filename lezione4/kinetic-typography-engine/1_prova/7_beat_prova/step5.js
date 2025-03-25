let sound, fft;
let playButton;
let started = false;
let lastBeatTime = 0;

let textObj;
let hopDuration = 800;
let amount = 100;
let hopping = false;
let hopStartTime = 0;
let inFactor = 0.66;
let outFactor = 0.66;

function preload() {
  sound = loadSound('beautiful_people.mp3');
}

function setup() {
  createCanvas(700, 500);
  fft = new p5.FFT();
  fft.setInput(sound);

  textObj = { x: width / 2, y: height / 2, startY: height / 2 };

  playButton = createButton('▶️ Avvia musica');
  playButton.position(20, 20);
  playButton.mousePressed(() => {
    sound.play();
    started = true;
    playButton.hide();
  });
}

function draw() {
  background(0);

  if (!started) {
    fill(255);
    textAlign(CENTER, CENTER);
    text("Clicca ▶️ per avviare la musica", width / 2, height / 2);
    return;
  }

  let spectrum = fft.analyze();
  let yellowBand = { from: 151, to: 400 };
  let sum = 0;
  for (let i = yellowBand.from; i <= yellowBand.to; i++) {
    sum += spectrum[i];
  }
  let avgEnergy = sum / (yellowBand.to - yellowBand.from + 1);
  let beatThreshold = 60;
  let delta = millis() - lastBeatTime;

  // mostra temporaneamente il valore energia
  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  text("Energia Mid: " + nf(avgEnergy, 1, 2), 10, 10);

  if (avgEnergy > beatThreshold && delta > hopDuration) {
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

  // Equalizzatore verticale (solo visual)
  let bands = [
    { label: "Bassi", from: 0, to: 50, color: color(255, 0, 0) },
    { label: "LowMid", from: 51, to: 150, color: color(255, 128, 0) },
    { label: "Mid", from: 151, to: 400, color: color(255, 255, 0) },
    { label: "HighMid", from: 401, to: 700, color: color(0, 255, 0) },
    { label: "Alti", from: 701, to: 1023, color: color(0, 128, 255) }
  ];

  let barWidth = 20;
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    let total = 0;
    for (let j = band.from; j <= band.to; j++) {
      total += spectrum[j];
    }
    let avg = total / (band.to - band.from + 1);
    fill(band.color);
    let barHeight = map(avg, 0, 255, 0, height - 100);
    rect(20 + i * (barWidth + 10), height - barHeight, barWidth, barHeight);
    fill(255);
    textSize(12);
    textAlign(CENTER);
    text(band.label, 20 + i * (barWidth + 10) + barWidth / 2, height - 5);
  }
}

function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}
