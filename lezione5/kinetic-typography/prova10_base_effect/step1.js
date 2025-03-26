 Dove viene calcolato progress
Nel tuo draw() hai questo frammento:

js
Copia
Modifica
let progress = constrain((elapsed - anim.start_time) / anim.duration, 0, 1);
Ecco cosa fa:

elapsed = secondi totali trascorsi dall'inizio

anim.start_time = quando deve partire questa animazione

anim.duration = quanto deve durare

elapsed - start_time = tempo passato da quando è iniziata

Dividendo per duration ottieni un valore tra 0 e 1

constrain(..., 0, 1) limita progress a restare nel range [0, 1]
