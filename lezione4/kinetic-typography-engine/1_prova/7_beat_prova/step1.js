let sound, fft;
let playButton;
let started = false;

function preload() {
  sound = loadSound('beautiful_people.mp3');
}

function setup() {
  createCanvas(600, 300);
  fft = new p5.FFT();
  fft.setInput(sound); // importantissimo

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
    text("Clicca per avviare", width / 2, height / 2);
    return;
  }

  let spectrum = fft.analyze();

  // 🔍 Stampa a console i primi valori per vedere se variano
  console.log(spectrum.slice(0, 10));

  // 🎛️ Disegna lo spettro audio
  noFill();
  stroke(0, 255, 0);
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    vertex(x, y);
  }
  endShape();
}
