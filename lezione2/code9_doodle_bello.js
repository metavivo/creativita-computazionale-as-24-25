let n = 1000;
let maxage = 20;
let rdodge = 30;
let opacity = 40;
let speed = 0.2;
let zoom = 0.01;
let crayons = false, soft = false, dodge = true;

let particles = [];
let ages = [];
let c = 0;
let t = 0;
let s;
let w, h;

function setup() {
  createCanvas(500, 500);
  w = width / 2;
  h = height / 2;
  colorMode(HSB, TWO_PI, 2, 1);
  reset();
}

function draw() {
  let np = n / maxage;
  for (let i = 0; i < np && c < n; i++, c++) newParticle(c);

  for (let i = 0; i < c; i++) {
    ages[i]++;
    let p = particles[i];

    if (ages[i] > maxage) {
      newParticle(i);
    } else {
      let f = flowField(p[0], p[1]);
      
      let m = maxage / 2;
      let o = soft ? mag(f[0], f[1]) * 2 * opacity : (m - abs(m - ages[i])) * opacity / m;
      let h = atan2(f[0], f[1]) + PI;

      stroke(h, crayons ? 1 : 0, crayons ? 1 : 0, o / 255);
      
      line(p[0], p[1], p[0] += s * f[0], p[1] += s * f[1]);
    }
  }
}

// **Noise-based flow field**
function flowField(x, y) {
  return [
    noise(t, x * zoom, y * zoom) - 0.5,
    noise(t + 1, x * zoom, y * zoom) - 0.5
  ];
}

// **Create new particles**
function newParticle(p) {
  if (dodge) {
    let r = random(rdodge);
    let ang = random(TWO_PI);
    particles[p] = [mouseX + r * cos(ang), mouseY + r * sin(ang)];
  } else {
    particles[p] = [random(width), random(height)];
  }
  ages[p] = 0;
}

// **Reset the canvas**
function reset() {
  background(crayons ? 0 : 255);
  s = speed / zoom;
  c = 0;
}

// **Key controls**
function keyPressed() {
  if (key === 's' || key === 'S') soft = !soft; // Toggle modalità soft
  if (key === 'd' || key === 'D') dodge = !dodge; // Attiva/disattiva dodge mode
  if (key === 'f' || key === 'F') t++; // Cambia il valore di t nel noise field
  if (key === 'c' || key === 'C') crayons = !crayons; // Cambia la modalità colori
  
  // Gestione del tasto '+' e '-'
  if (keyCode === 187) zoom /= 1.1; // Tasto '+'
  if (keyCode === 189) zoom *= 1.1; // Tasto '-'

  reset();
  return false; // Previene comportamenti indesiderati nel browser
}
