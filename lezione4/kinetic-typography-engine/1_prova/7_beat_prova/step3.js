let sound, fft;
let playButton;
let started = false;
let lastBeatTime = 0;
let beatThreshold = 100;
let minBeatSeparation = 300;

let textObj;
let hopDuration = 800;
let amount = 100;
let hopping = false;
let hopStartTime = 0;
let inFactor = 0.66;
let outFactor = 0.66;

let freqSlider;

function preload() {
  sound = loadSound('beautiful_people.mp3');
}

function setup() {
  createCanvas(600, 400);
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

  // Slider per selezionare indice frequenza
  freqSlider = createSlider(0, 1023, 40, 1);
  freqSlider.position(20, height + 10);
  freqSlider.style('width', '200px');
}

function draw() {
  background(0);

  if (!started) {
    fill(255);
    textAlign(CENTER, CENTER);
    text("Clicca per avviare", width / 2, height / 2);
    return;
  }

  let spectrum = fft.analyze();
  let freqIndex = freqSlider.value();
  let energy = spectrum[freqIndex];

  // Rilevamento beat solo se c'è segnale sufficiente
  if (energy > beatThreshold && millis() - lastBeatTime > minBeatSeparation) {
    hopping = true;
    hopStartTime = millis();
    lastBeatTime = millis();
  }

  // Salto animato
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

  // Disegna la scritta
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Hop", textObj.x, textObj.y);

  // Disegna spettro audio
  noFill();
  stroke(0, 255, 0);
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    vertex(x, y);
  }
  endShape();

  // Evidenzia la frequenza scelta
  let markerX = map(freqIndex, 0, spectrum.length, 0, width);
  stroke(255, 0, 0);
  line(markerX, 0, markerX, height);

  // Testo informativo
  fill(255);
  textSize(14);
  text("Frequenza selezionata: indice " + freqIndex + " → energia " + nf(energy, 3, 1), width / 2, height - 20);
  text("Sposta lo slider per trovare il range del beat", width / 2, height + 25);
}

function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}
