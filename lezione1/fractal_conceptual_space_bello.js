let curlx = 0;
let curly = 0;
let f = Math.sqrt(2) / 2;
let deley = 10;
let growth = 0;
let growthTarget = 0;

let rectX = 10;
let rectY = 10;
let rectWidth = 250;
let rectHeight = 250;

let newX;
let newY;

let clickX, clickY;

function setup() {
  createCanvas(950, 450, P2D);
  clickX = width / 2;
  clickY = height / 2;
}

function draw() {
  background(250);
  stroke(0);

  strokeWeight(2);
  rect(rectX, rectY, rectWidth, rectHeight);
  strokeWeight(1);

  if (mouseIsPressed &&
    mouseX >= rectX && mouseX <= rectX + rectWidth &&
    mouseY >= rectY && mouseY <= rectY + rectHeight) {

    clickX = mouseX;
    clickY = mouseY;
    stroke(255, 0, 0);
    strokeWeight(8);
    point(clickX, clickY);
    stroke(0);
    strokeWeight(1);
  } else {
    stroke(255, 0, 0);
    strokeWeight(8);
    point(clickX, clickY);
    stroke(0);
    strokeWeight(1);
  }

  newX = mouseX + 390;
  newY = mouseY - 20;

  curlx += (radians(360 / height * newX) - curlx) / deley;
  curly += (radians(360 / height * newY) - curly) / deley;

  push();
  translate(width / 2, (height / 3) * 2);
  branch(height / 4, 17);
  pop();

  growth += (growthTarget / 10 - growth + 1) / deley;
}

// **Gestisce lo scorrimento del mouse per modificare la crescita**
function mouseWheel(event) {
  growthTarget += event.delta > 0 ? 1 : -1;
}

// **Funzione ricorsiva per disegnare il frattale**
function branch(len, num) {
  len *= f;
  num -= 1;
  if (len > 1 && num > 0) {
    push();
    rotate(curlx);
    line(0, 0, 0, -len);
    translate(0, -len);
    branch(len, num);
    pop();

    len *= growth;
    push();
    rotate(curlx - curly);
    line(0, 0, 0, -len);
    translate(0, -len);
    branch(len, num);
    pop();
  }
}

// **Mostra le coordinate quando il mouse viene cliccato**
function mouseClicked() {
  console.log("x = " + mouseX);
  console.log("y = " + mouseY);
}
