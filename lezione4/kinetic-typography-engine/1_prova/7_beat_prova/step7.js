let sound, analyzer, fft, lowPass;
let playButton;
let restartButton;
let started = false;
let startTimeSlider;
let startTimeValueLabel;
let currentStartTime = 0;
let soundLoaded = false;
let songTimeLabel;

let textObj;
let hopDuration = 150;
let amount = 120;
let hopping = false;
let hopStartTime = 0;
let lastBeatTime = 0;
let beatCooldown = 460;
let beatThresholdSlider;
let beatThreshold = 0.06;
let initialY;
let thresholdValueLabel;

let beatCooldownSlider;
let beatCooldownValueLabel;
let lowPassFreqSlider;
let lowPassFreqValueLabel;
let lowPassResSlider;
let lowPassResValueLabel;

const numBarsFFT = 64; // Più barre per un effetto equalizzatore
let fftBins = new Array(numBarsFFT).fill(0);
let showEqualizer = true; // Stato iniziale dell'equalizzatore
let equalizerCheckbox;

function preload() {
    sound = loadSound('beautiful_people.mp3', () => {
        console.log('Audio caricato con successo');
        soundLoaded = true;
        initializeAudio(); // Call function after sound is loaded
    }, (err) => console.error('Errore caricamento audio:', err));
}

function initializeAudio() {
    lowPass = new p5.LowPass();
    lowPass.freq(970); // Inizializzato a 970 Hz
    lowPass.res(1);
    sound.connect(lowPass);
    analyzer = new p5.Amplitude();
    analyzer.setInput(lowPass);
    fft = new p5.FFT(0.8, numBarsFFT); // Crea l'oggetto FFT
    fft.setInput(lowPass);
    console.log("Audio engine initialized with FFT.");
}

function setup() {
    createCanvas(600, 400);

    initialY = height * 0.75;
    textObj = {
        x: width / 2,
        y: initialY,
        startY: initialY
    };

    if (!sound) {
        console.error('Nessun suono caricato (controllo in setup)');
        return;
    }

    playButton = createButton('▶️ Avvia musica');
    playButton.position(20, 20);
    playButton.mousePressed(toggleMusic);

    restartButton = createButton('🔄 Riavvia');
    restartButton.position(playButton.x + playButton.width + 10, 20);
    restartButton.mousePressed(restartMusic);

    songTimeLabel = createDiv("Tempo: 0:00");
    songTimeLabel.position(20, height + 140);

    beatThresholdSlider = createSlider(0, 1, beatThreshold, 0.01);
    beatThresholdSlider.position(20, height + 160);
    beatThresholdSlider.style('width', '300px');
    thresholdValueLabel = createDiv("Soglia Beat: " + beatThreshold.toFixed(2));
    thresholdValueLabel.position(330, height + 160);
    beatThresholdSlider.value(beatThreshold);
    beatThresholdSlider.input(() => {
        beatThreshold = beatThresholdSlider.value();
        thresholdValueLabel.html("Soglia Beat: " + beatThreshold.toFixed(2));
    });

    startTimeSlider = createSlider(0, 60, 10, 1);
    startTimeSlider.position(20, height + 200);
    startTimeSlider.style('width', '300px');
    startTimeSlider.input(updateStartTime);
    startTimeValueLabel = createDiv("Partenza al secondo: 10");
    startTimeValueLabel.position(330, height + 200);
    currentStartTime = 10;

    beatCooldownSlider = createSlider(10, 500, beatCooldown, 10);
    beatCooldownSlider.position(20, height + 240);
    beatCooldownSlider.style('width', '300px');
    beatCooldownValueLabel = createDiv("Cooldown Beat: " + beatCooldown);
    beatCooldownValueLabel.position(330, height + 240);
    beatCooldownSlider.value(beatCooldown);
    beatCooldownSlider.input(() => {
        beatCooldown = beatCooldownSlider.value();
        beatCooldownValueLabel.html("Cooldown Beat: " + beatCooldown);
    });

    lowPassFreqSlider = createSlider(50, 1000, 970, 10); // Inizializzato anche lo slider
    lowPassFreqSlider.position(20, height + 280);
    lowPassFreqSlider.style('width', '300px');
    lowPassFreqValueLabel = createDiv("Freq. Low Pass: " + 970);
    lowPassFreqValueLabel.position(330, height + 280);
    lowPassFreqSlider.input(() => {
        lowPass.freq(lowPassFreqSlider.value());
        lowPassFreqValueLabel.html("Freq. Low Pass: " + lowPass.freq());
    });

    lowPassResSlider = createSlider(0, 10, 1, 0.1); // Initialize with default value
    lowPassResSlider.position(20, height + 320);
    lowPassResValueLabel = createDiv("Res. Low Pass: " + 1.0);
    lowPassResValueLabel.position(330, height + 320);
    lowPassResSlider.input(() => {
        lowPass.res(lowPassResSlider.value());
        lowPassResValueLabel.html("Res. Low Pass: " + lowPass.res().toFixed(1));
    });

    equalizerCheckbox = createCheckbox('Equalizzatore', true);
    equalizerCheckbox.position(20, height + 360);
    equalizerCheckbox.changed(() => {
        showEqualizer = equalizerCheckbox.checked();
    });
}

function updateStartTime() {
    currentStartTime = startTimeSlider.value();
    startTimeValueLabel.html("Partenza al secondo: " + currentStartTime);
}

function toggleMusic() {
    if (sound && soundLoaded) {
        if (sound.isPlaying()) {
            sound.pause();
            playButton.html('▶️ Riprendi');
        } else {
            sound.play();
            sound.jump(currentStartTime);
            started = true;
            playButton.html('⏸️ Pausa');
        }
    } else if (!soundLoaded) {
        console.log("Audio non ancora caricato.");
    }
}

function restartMusic() {
    if (sound && soundLoaded) {
        sound.stop();
        sound.play();
        sound.jump(currentStartTime);
        started = true;
        playButton.html('⏸️ Pausa');
    } else if (!soundLoaded) {
        console.log("Audio non ancora caricato.");
    }
}

function draw() {
    background(0);

    if (!started) {
        fill(255);
        textAlign(CENTER, CENTER);
        text("Clicca ▶️ per avviare la musica", width / 2, height / 2);
        return;
    }

    if (sound && sound.isPlaying()) {
        let songTime = sound.currentTime();
        let minutes = floor(songTime / 60);
        let seconds = floor(songTime % 60);
        seconds = seconds < 10 ? '0' + seconds : seconds;
        songTimeLabel.html("Tempo: " + minutes + ":" + seconds);
    } else {
        songTimeLabel.html("Tempo: 0:00");
    }

    let level = analyzer.getLevel();
    let beatTime = millis();

    if (!hopping && level > beatThreshold && (beatTime - lastBeatTime) > beatCooldown) {
        lastBeatTime = beatTime;
        hopping = true;
        hopStartTime = beatTime;
        console.log("Beat rilevato (LPF):", level, "a tempo:", beatTime, "Soglia:", beatThreshold);
    }

    if (hopping) {
        let t = (millis() - hopStartTime) / hopDuration;
        let easedT = sin(t * PI);

        if (t >= 1) {
            hopping = false;
            textObj.y = textObj.startY;
            console.log("Salto completato (LPF)");
        } else {
            textObj.y = textObj.startY - amount * easedT;
        }
    } else {
        textObj.y = textObj.startY;
    }

    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Hop", textObj.x, textObj.y);

    if (showEqualizer) {
        let barWidthFFT = width / (numBarsFFT + 1);
        let spacingFFT = 1;

        let fftAnalysis = fft.analyze(); // Ottieni l'analisi delle frequenze

        for (let i = 0; i < numBarsFFT; i++) {
            let energy = fftAnalysis[i]; // Ottieni l'energia per questa banda di frequenza
            let barHeightFFT = map(energy, 0, 255, 0, 100); // Mappa l'energia all'altezza della barra
            fill(color(i * 3, 180, 200)); // Colori che cambiano con la frequenza
            rect(i * (barWidthFFT + spacingFFT), height - barHeightFFT - 20, barWidthFFT, barHeightFFT); // Posizionate in basso a sinistra
        }
    }

    fill(255, 100);
    textSize(12);
    text("Soglia Beat: " + beatThreshold.toFixed(2), 20, height + 180);
    text("Cooldown Beat: " + beatCooldown, 20, height + 220);
    text("Freq. Low Pass: " + lowPass.freq().toFixed(0), 20, height + 260);
    text("Res. Low Pass: " + lowPass.res().toFixed(1), 20, height + 300);
    text("Partenza al secondo: " + currentStartTime, 20, height + 340);
}
