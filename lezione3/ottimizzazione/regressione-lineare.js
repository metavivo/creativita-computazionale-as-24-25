let points = [];
let k = -1;  // Coefficiente angolare iniziale (parte dalla bisettrice del 2° e 4° quadrante)
let optimalK = -1;
let learningRate = 0.05;
let optimizing = false;
let button;
let draggedPoint = null; // Punto attualmente trascinato
let mse = 0; // Errore Quadratico Medio

function setup() {
  createCanvas(600, 600);
  
  // Bottone per avviare la regressione
  button = createButton('Avvia');
  button.position(20, 20);
  button.mousePressed(startOptimization);
}

function draw() {
  background(240);
  
  drawCartesianPlane();

  // Disegna i punti e permette di trascinarli
  fill(255, 0, 0);
  noStroke();
  for (let p of points) {
    ellipse(p.x, p.y, 8, 8);
  }

  // Disegna la retta di regressione (blu)
  drawRegressionLine(k);

  // Calcola e mostra il valore attuale di k
  fill(0);
  noStroke();
  textSize(16);
  text("k: " + nf(k, 1, 3), width - 150, 30);

  // Calcola l'Errore Quadratico Medio
  mse = computeMSE(k);
  
  // Mostra il valore di Errore Quadratico Medio in basso a sinistra
  textSize(14);
  text("Errore Quadratico Medio = " + nf(mse, 1, 5), 20, height - 20);

  // Se l'ottimizzazione è attiva, aggiorna il coefficiente angolare
  if (optimizing) {
    gradientDescentStep();
  }
}

// Disegna il piano cartesiano
function drawCartesianPlane() {
  stroke(0);
  strokeWeight(2);
  line(width / 2, 0, width / 2, height); // Asse y
  line(0, height / 2, width, height / 2); // Asse x
}

// Disegna la retta di regressione con k corretto
function drawRegressionLine(m) {
  stroke(0, 0, 255);
  strokeWeight(2);
  
  let x1 = -width / 2;
  let y1 = m * x1;
  let x2 = width / 2;
  let y2 = m * x2;
  
  // Trasformazione di coordinate per il canvas
  x1 += width / 2;
  y1 = height / 2 - y1;
  x2 += width / 2;
  y2 = height / 2 - y2;

  line(x1, y1, x2, y2);
}

// Aggiunge punti con il mouse
function mousePressed() {
  if (mouseY > 50) { // Evita il bottone
    let clicked = false;
    for (let p of points) {
      if (dist(mouseX, mouseY, p.x, p.y) < 10) {
        draggedPoint = p;
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      points.push(createVector(mouseX, mouseY));
    }
  }
}

// Trascina i punti con il mouse
function mouseDragged() {
  if (draggedPoint) {
    draggedPoint.x = mouseX;
    draggedPoint.y = mouseY;
  }
}

// Rilascia il punto dopo averlo trascinato
function mouseReleased() {
  draggedPoint = null;
}

// Inizia l'ottimizzazione
function startOptimization() {
  if (points.length > 1) {
    optimizing = true;
    optimalK = computeOptimalK();
  }
}

// Calcola k ottimale con regressione lineare
function computeOptimalK() {
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  let n = points.length;
  
  for (let p of points) {
    let x = p.x - width / 2;
    let y = height / 2 - p.y;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }
  
  return sumXY / sumX2; // k ottimale
}

// Calcola l'Errore Quadratico Medio (MSE)
function computeMSE(m) {
  if (points.length === 0) return 0;
  
  let totalError = 0;
  for (let p of points) {
    let x = p.x - width / 2;
    let y = height / 2 - p.y;
    let predictedY = m * x;
    totalError += (y - predictedY) ** 2;
  }
  
  return totalError / points.length;
}

// Anima il valore di k fino a quello ottimale
function gradientDescentStep() {
  if (abs(k - optimalK) > 0.001) {
    k += (optimalK - k) * learningRate;
  } else {
    optimizing = false; // Ferma quando k è vicino a optimalK
  }
}
