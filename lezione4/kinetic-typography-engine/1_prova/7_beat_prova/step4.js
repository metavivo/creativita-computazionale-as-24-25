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

// Intervallo di frequenze (indici FFT) da monitorare
let freqMinSlider, freqMaxSlider;

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

  // Slider per range frequenze
  freqMinSlider = createSlider(0, 1023, 10, 1);
  freqMinSlider.position(20, height + 10);
  freqMinSlider.style('width', '130px');

  freqMaxSlider = createSlider(0, 1023, 40, 1);
  freqMaxSlider.position(170, height + 10);
  freqMaxSlider.style('width', '130px');
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
  let minIndex = freqMinSlider.value();
  let maxIndex = freqMaxSlider.value();
  if (minIndex >= maxIndex) maxIndex = minIndex + 1;

  // Calcolo media energia nel range
  let sum = 0;
  for (let i = minIndex; i <= maxIndex; i++) {
    sum += spectrum[i];
  }
  let avgEnergy = sum / (maxIndex - minIndex + 1);

  // Rilevamento beat se media supera soglia
  if (avgEnergy > beatThreshold && millis() - lastBeatTime > minBeatSeparation) {
    hopping = true;
    hopStartTime = millis();
    lastBeatTime = millis();
  }

  // Salto
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

  // Scritta Hop
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Hop", textObj.x, textObj.y);

  // Disegna solo il range selezionato dello spettro
  noFill();
  stroke(0, 255, 0);
  beginShape();
  for (let i = minIndex; i <= maxIndex; i++) {
    let x = map(i, minIndex, maxIndex, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    vertex(x, y);
  }
  endShape();

  // Visualizzazione del range selezionato
  fill(255);
  textSize(14);
  text(
    `Range FFT: ${minIndex} – ${maxIndex} | Energia media: ${nf(avgEnergy, 3, 1)}`,
    width / 2,
    height - 20
  );
  text("Sposta i due slider per esplorare il beat della batteria", width / 2, height + 30);
}

function bezierCurve(t, inFactor, outFactor) {
  let c = 3 * inFactor;
  let b = 3 * (1 - outFactor - inFactor) - c;
  let a = 1 - c - b;
  return a * pow(t, 3) + b * pow(t, 2) + c * t;
}
