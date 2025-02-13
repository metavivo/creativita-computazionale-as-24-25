let t = 0;
let scaleFactor = 15;
let freqSlider, durationSlider, colorSlider;

function setup() {
  createCanvas(600, 600);

  // Contenitore per i controlli sotto il canvas
  let controls = createDiv();
  controls.position(0, height);
  controls.style('width', '600px');
  controls.style('padding', '10px');
  controls.style('display', 'grid');
  controls.style('grid-template-columns', '100px 1fr 50px');
  controls.style('gap', '10px');
  controls.style('align-items', 'center');

  // Controlli per la frequenza del battito
  createSpan('Frequenza:').parent(controls);
  freqSlider = createSlider(0.01, 0.2, 0.05, 0.01);
  freqSlider.parent(controls);
  freqSlider.style('width', '100%');
  window.freqValue = createSpan();
  freqValue.parent(controls);

  // Controlli per la durata del battito
  createSpan('Durata:').parent(controls);
  durationSlider = createSlider(10, 100, 30, 5);
  durationSlider.parent(controls);
  durationSlider.style('width', '100%');
  window.durationValue = createSpan();
  durationValue.parent(controls);

  // Controlli per il colore del cuore
  createSpan('Colore:').parent(controls);
  colorSlider = createSlider(100, 255, 200, 1);
  colorSlider.parent(controls);
  colorSlider.style('width', '100%');
  window.colorValue = createSpan();
  colorValue.parent(controls);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  // Legge i valori dagli slider
  let frequency = freqSlider.value();
  let duration = durationSlider.value();
  let colorIntensity = colorSlider.value();

  // Aggiorna i valori visualizzati
  freqValue.html(nf(frequency, 1, 2));
  durationValue.html(duration);
  colorValue.html(colorIntensity);

  // Funzione impulsiva con durata regolabile
  let pulseY = 1 + 0.5 * exp(-duration * pow(sin(t), 2)); 
  let pulseX = 1 + 0.2 * exp(-duration * pow(sin(t), 2));
  t += frequency;
  
  // Disegno del cuore con riempimento colorato
  fill(255, 0, 0, colorIntensity);
  stroke(255, 0, 0);
  strokeWeight(2);
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.01) {
    let x = 16 * pow(sin(angle), 3) * scaleFactor * pulseX;
    let y = -(13 * cos(angle) - 5 * cos(2 * angle) - 2 * cos(3 * angle) - cos(4 * angle)) * scaleFactor * pulseY;
    vertex(x, y);
  }
  endShape(CLOSE);
}
