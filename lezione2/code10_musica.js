let n = 10; // Numero di note attive contemporaneamente
let maxage = 20;
let zoom = 0.01;
let speed = 0.2;
let scale = [60, 62, 64, 65, 67, 69, 71, 72]; // Scala maggiore di C (Do)
let particles = [];
let ages = [];
let c = 0;
let t = 0;
let s;
let synth;

function setup() {
  createCanvas(400, 400);
  noLoop();
  
  synth = new p5.PolySynth();
  
  for (let i = 0; i < n; i++) {
    particles.push(newParticle());
    ages.push(0);
  }
  s = speed / zoom;
  setInterval(playMusic, 300); // Suona una nota ogni 300ms
}

function draw() {
  // Movimento delle particelle
  for (let i = 0; i < n; i++) {
    ages[i]++;
    let p = particles[i];

    if (ages[i] > maxage) {
      particles[i] = newParticle();
      ages[i] = 0;
    } else {
      let f = flowField(p.x, p.y);
      p.x += s * f[0];
      p.y += s * f[1];

      // Disegna una traccia per visualizzare il movimento
      stroke(255, 100);
      strokeWeight(2);
      point(p.x, p.y);
    }
  }
}

// **Campo di Perlin Noise per dirigere le note**
function flowField(x, y) {
  return [
    noise(t, x * zoom, y * zoom) - 0.5,
    noise(t + 1, x * zoom, y * zoom) - 0.5
  ];
}

// **Crea una nuova particella musicale**
function newParticle() {
  return { x: random(width), y: random(height) };
}

// **Genera musica basata sul movimento**
function playMusic() {
  if (particles.length > 0) {
    let p = particles[int(random(n))];
    let noteIndex = int(map(p.y, 0, height, 0, scale.length)); // Scala musicale
    let note = scale[noteIndex];

    let velocity = map(p.x, 0, width, 0.3, 1.0); // Volume basato sulla posizione
    let duration = map(p.y, 0, height, 0.1, 0.5); // Durata dinamica
    
    synth.play(midiToFreq(note), velocity, 0, duration);
  }
}

// **Controlli per modificare la musica in tempo reale**
function keyPressed() {
  if (key === '1') scale = [60, 62, 64, 65, 67, 69, 71, 72]; // Scala Maggiore
  if (key === '2') scale = [60, 62, 63, 65, 67, 68, 70, 72]; // Scala Minore
  if (key === '+') zoom /= 1.1; // Più dettagli
  if (key === '-') zoom *= 1.1; // Meno dettagli
}
