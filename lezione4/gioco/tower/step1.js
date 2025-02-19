let blocks = [];
let gravity = 0.02;
let towerStability = 1.0;
let gameOver = false;
let activeBlock;
let moveSpeed = 5;
let movingLeft = false;
let movingRight = false;

function setup() {
  let cnv = createCanvas(400, 600);
  cnv.elt.setAttribute("tabindex", "0"); // Rende il canvas focalizzabile senza clic
  cnv.elt.focus(); // Imposta il focus automaticamente
  setTimeout(() => cnv.elt.focus(), 100); // Assicura il focus anche dopo il caricamento
  activeBlock = new Block(width / 2, 50);
}

function draw() {
  background(220);
  console.log("Moving Left:", movingLeft, "Moving Right:", movingRight); // Debug per vedere lo stato dei tasti
  
  if (!gameOver) {
    if (movingLeft && activeBlock.x - moveSpeed >= 0) {
      activeBlock.move(-moveSpeed);
    } 
    if (movingRight && activeBlock.x + moveSpeed <= width - activeBlock.size) {
      activeBlock.move(moveSpeed);
    }
    
    activeBlock.update();
    activeBlock.display();
    
    if (activeBlock.hasLanded()) {
      blocks.push(activeBlock);
      activeBlock = new Block(width / 2, 50);
      checkStability();
    }
  }
  
  for (let block of blocks) {
    block.display();
  }
}

function keyPressed() {
  console.log("Tasto premuto:", keyCode); // Debug per verificare la pressione dei tasti
  if (keyCode === LEFT_ARROW) {
    movingLeft = true;
  } else if (keyCode === RIGHT_ARROW) {
    movingRight = true;
  }
}

function keyReleased() {
  console.log("Tasto rilasciato:", keyCode); // Debug per verificare il rilascio dei tasti
  if (keyCode === LEFT_ARROW) {
    movingLeft = false;
  } else if (keyCode === RIGHT_ARROW) {
    movingRight = false;
  }
}

function checkStability() {
  let instability = random(0, 1);
  if (instability > towerStability) {
    gameOver = true;
  }
}

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.speed = 0;
  }

  update() {
    if (!gameOver) {
      this.speed += gravity;
      this.y += this.speed;
      
      if (this.hasLanded()) {
        this.y = this.getLandingPosition();
        this.speed = 0;
      }
    }
  }

  display() {
    fill(150, 75, 0);
    rect(this.x, this.y, this.size, this.size);
  }
  
  move(dir) {
    this.x += dir;
    this.x = constrain(this.x, 0, width - this.size);
  }

  hasLanded() {
    if (this.y + this.size >= height) return true;
    for (let block of blocks) {
      if (this.y + this.size >= block.y && abs(this.x - block.x) < this.size) {
        return true;
      }
    }
    return false;
  }
  
  getLandingPosition() {
    if (this.y + this.size >= height) return height - this.size;
    let highestY = height;
    for (let block of blocks) {
      if (abs(block.x - this.x) < this.size && block.y < highestY) {
        highestY = block.y;
      }
    }
    return highestY - this.size;
  }
}
