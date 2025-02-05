/*
Prompt:
prova a creare uno sketch con P5 che generi un quadro digitale bello e sorprendente

ChatGPT:
Ecco uno sketch in p5.js che genera un quadro digitale astratto con effetti sorprendenti, combinando perlin noise, gradienti di colore e curve fluide per ottenere un'estetica simile all'arte generativa. Questo codice crea un paesaggio dinamico con forme morbide e colori vibranti.

*/

let cols, rows;
let noiseScale = 0.02;
let palette;

function setup() {
  createCanvas(800, 800);
  cols = width;
  rows = height;
  noLoop();
  palette = [
    color(239, 71, 111), // Rosso acceso
    color(255, 209, 102), // Giallo caldo
    color(6, 214, 160),  // Verde acqua
    color(17, 138, 178), // Blu oceano
    color(7, 59, 76)     // Blu notte
  ];
}

function draw() {
  background(10);
  for (let y = 0; y < rows; y += 10) {
    for (let x = 0; x < cols; x += 10) {
      let noiseVal = noise(x * noiseScale, y * noiseScale);
      let cIndex = int(map(noiseVal, 0, 1, 0, palette.length));
      stroke(palette[cIndex]);
      strokeWeight(2);
      point(x + sin(y * 0.01) * 20, y + cos(x * 0.01) * 20);
    }
  }
  
  drawWaves();
}

function drawWaves() {
  noFill();
  for (let i = 0; i < 5; i++) {
    let yoff = i * 40;
    stroke(palette[i]);
    strokeWeight(3);
    beginShape();
    for (let x = 0; x < width; x += 10) {
      let y = height * 0.7 + sin(x * 0.02 + i) * 50 + yoff;
      curveVertex(x, y);
    }
    endShape();
  }
}
