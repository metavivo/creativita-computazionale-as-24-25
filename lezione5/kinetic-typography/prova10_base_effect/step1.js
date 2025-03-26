let animationData = {
  "canvas": { "width": 800, "height": 400, "backgroundColor": "#ffffff" },
  "k-string": {
    "x": 0,
    "y": 200, 
    "content": "parola", 
    "font": "Arial", 
    "size": 50, 
    "color": "#000000"
  },
  "animations": [
    { "type": "move", "duration": 3, "fromX": 0, "toX": 0 }
  ]
};

let kString;
let startTime;

class KString {
  applyAnimation(anim, progress) {
    let methodName = anim.type.replace(/-([a-z])/g, g => g[1].toUpperCase());
    if (typeof this[methodName] === "function") {
      this[methodName](progress, ...Object.values(anim).slice(2));
    }
  }

  constructor(content, x, y, size, color) {
    this.text = content;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.alpha = 255;
    this.shearX = 0;
  }

  move(progress, fromX, toX) {
    this.x = lerp(fromX, toX, easeOut(progress)); // lerp: interpolazione lineare
/*    
Restituisce un valore intermedio tra a e b in base a quanto t è vicino a 0 o a 1.

Se t = 0 → restituisce a

Se t = 1 → restituisce b

Se t = 0.5 → restituisce il punto a metà tra a e b

*/
    
/*
PROGRESS

 Cos’è progress e perché va da 0 a 1
Hai ragione: progress rappresenta il tempo, ma normalizzato.
In pratica: è la frazione del tempo trascorso rispetto alla durata dell’animazione.

Esempio:
Se un’animazione dura 3 secondi, e sono passati 1.5 secondi…

Allora:

progress = 1.5 / 3 = 0.5
→ siamo a metà dell’animazione


 Dove viene calcolato progress
Nel tuo draw() hai questo frammento:

let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);
Ecco cosa fa:

elapsed = secondi totali trascorsi dall'inizio

anim.start_time = quando deve partire questa animazione

anim.duration = quanto deve durare

elapsed - start_time = tempo passato da quando è iniziata

Dividendo per duration ottieni un valore tra 0 e 1

constrain(..., 0, 1) limita progress a restare nel range [0, 1]


*/
    
    
  }

  display() {
    console.log("DISPLAYING:", this.text, "at", this.x, this.y);
    push();
    translate(this.x, this.y);
    // shearX(this.shearX); // rimosso per debug
    fill(0); // forziamo colore nero per debug
    textAlign(LEFT, CENTER);
    textSize(this.size);
    text(this.text, 0, 0);
    pop();
  }
}

/*

easeOut(t) → interpolazione "morbida"
La funzione:

function easeOut(t) {
  return t * (2 - t);
}
è una funzione che rallenta il movimento alla fine, come se l'oggetto perdesse velocità avvicinandosi al traguardo.

Per t vicino a 0, il risultato cresce velocemente

Per t vicino a 1, il risultato si avvicina a 1 più lentamente

*/

function easeOut(t) {
  return t * (2 - t);
}



function setup() {
  createCanvas(animationData.canvas.width, animationData.canvas.height);
  background(animationData.canvas.backgroundColor);
  textFont(animationData["k-string"].font);
  textSize(animationData["k-string"].size);

  kString = new KString(
    animationData["k-string"].content,
    animationData["k-string"].x,
    animationData["k-string"].y,
    animationData["k-string"].size,
    color(animationData["k-string"].color)
  );

  startTime = millis() / 1000;

  let accumulatedStartTime = 0;
  animationData.animations.forEach(anim => {
    anim.start_time = accumulatedStartTime;
    accumulatedStartTime += anim.duration;
  });
}

function draw() {
  background(animationData.canvas.backgroundColor);
  let elapsed = (millis() / 1000) - startTime;

  animationData.animations.forEach(anim => {
    let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);
    if (progress > 0) {
      kString.applyAnimation(anim, progress);
    }
  });

  kString.display();
}

