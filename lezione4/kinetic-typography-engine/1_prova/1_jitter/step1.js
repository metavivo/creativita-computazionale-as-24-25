let textObj;
let jitterAmount = 5; // Intensità della vibrazione
let jitterRate = 50; // Frequenza del jitter (ms)
let lastJitterTime = 0;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  textObj = { x: width / 2, y: height / 2 };
}

function draw() {
  background(0);
  let elapsedTime = millis();
  
  if (elapsedTime - lastJitterTime > jitterRate) {
    textObj.x = width / 2 + random(-jitterAmount, jitterAmount);
    textObj.y = height / 2 + random(-jitterAmount, jitterAmount);
    lastJitterTime = elapsedTime;
  }
  
  text("Jitter", textObj.x, textObj.y);
}
