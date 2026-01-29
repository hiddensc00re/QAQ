/* =====================================================
   SELEZIONE ELEMENTI DOM
   ===================================================== */

// Slider di controllo
const slider = document.getElementById("slider");

// Immagini vinile: una in d1 e una in d3
const port1 = document.querySelector("#d1 .port");
const port2 = document.querySelector("#d3 .port");

// LED di feedback visivo
const leds = document.querySelectorAll(".leds span");


/* =====================================================
   VARIABILI DI STATO (ROTazione & VELOCITÀ)
   ===================================================== */

// Angoli di rotazione attuali
let angle1 = 0;
let angle2 = 0;

// Velocità di rotazione (dinamiche)
let speed1 = 0;
let speed2 = 0;


/* =====================================================
   FUNZIONE DI MAPPING LINEARE
   Trasforma un valore da un range a un altro
   (usata per slider → velocità / slider → LED)
   ===================================================== */

function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


/* =====================================================
   GESTIONE SLIDER
   - port1 accelera
   - port2 rallenta
   ===================================================== */

slider.addEventListener("input", () => {
  const val = Number(slider.value);

  // Vinile in d1: da fermo a veloce (senso orario)
  speed1 = map(val, 0, 100, 0, 6);

  // Vinile in d3: da veloce a fermo (senso antiorario)
  speed2 = map(val, 0, 100, 6, 0);

  // Aggiorna LED in base al valore dello slider
  updateLeds(val);
});


/* =====================================================
   GESTIONE LED
   Mostrano visivamente il livello dello slider
   ===================================================== */

function updateLeds(val) {
  const level = Math.round(map(val, 0, 100, 0, leds.length));

  leds.forEach((led, index) => {
    led.classList.toggle("active", index < level);
  });
}


/* =====================================================
   LOOP DI ANIMAZIONE
   - Rotazione continua
   - Nessun reset
   - requestAnimationFrame per fluidità
   ===================================================== */

function animate() {
  // Aggiornamento angoli
  angle1 += speed1;
  angle2 -= speed2;

  // Applicazione trasformazioni
  port1.style.transform = `rotate(${angle1}deg)`;
  port2.style.transform = `rotate(${angle2}deg)`;

  // Loop continuo
  requestAnimationFrame(animate);
}

// Avvio animazione (le velocità iniziano a 0)
animate();
//ROTAZIONE E MOBILE//

const slider = document.getElementById("slider");
const leds = document.querySelectorAll(".leds span");

function updateLeds(value) {
  const max = slider.max;
  const activeCount = Math.round((value / max) * leds.length);

  leds.forEach((led, index) => {
    led.classList.toggle("active", index < activeCount);
  });
}

slider.addEventListener("input", e => {
  updateLeds(e.target.value);
});

// ritorno automatico a zero
["mouseup", "touchend"].forEach(evt => {
  slider.addEventListener(evt, () => {
    slider.value = 0;
    updateLeds(0);
  });
});

//==BACK PUSH==//
const slider = document.getElementById("slider");
const logo = document.getElementById("m");

slider.addEventListener("input", () => {
  const value = slider.value;        // 0 - 100
  const intensity = 0.5 + value / 100 * 1.5;

  logo.style.filter = `
    brightness(${intensity})
    drop-shadow(0 0 ${value / 5}px #0f0)
  `;
  logo.style.opacity = 0.4 + value / 100 * 0.6;
});
//==ILLUMINAZIONE==//

// ============================================================
// FEATURE 9: Stessa fonte dati - Array condiviso di coppie immagine-testo
// ============================================================
const contenuti = [
  {
    testo: "dimensioni a scacchiera",
    immagine: "img/board.jpeg.webp"
  },
  {
    testo: "tutti i loghi che direzionano gli elementi grafici in gioco",
    immagine: "img/loghi.jpeg.webp"
  },
  {
    testo: "hey tu nel web",
    immagine: "img/maxe.png.jpg"
  },
  {
    testo: "quoteandquit",
    immagine: "img/algo.png.jpg"
  },
  {
    testo: "cigarettes",
    immagine: "img/same.png.jpg"
  },
  {
    testo: "sign",
    immagine: "img/sign.png.jpg"
  },
  {
    testo: "points",
    immagine: "img/points.png.jpg"
  }
];


// ============================================================
// FEATURE 7 & 8: Due caroselli indipendenti - Riferimenti DOM
// ============================================================
const button1 = document.getElementById("next1");
const immagine1 = document.getElementById("port1");
const testo1 = document.getElementById("textPort1");

const button2 = document.getElementById("next2");
const immagine2 = document.getElementById("port2");
const testo2 = document.getElementById("textPort2");

// Indici correnti per ogni carosello
let index1 = 0;
let index2 = 0;

// ============================================================
// FEATURE 10 & 12: Randomizzazione iniziale con controllo unicità
// ============================================================
function inizializzaCaroselli() {
  // Genera indice casuale per il primo carosello
  index1 = Math.floor(Math.random() * contenuti.length);
  
  // Genera indice casuale per il secondo carosello, diverso dal primo
  do {
    index2 = Math.floor(Math.random() * contenuti.length);
  } while (index2 === index1);
  
  // Mostra i contenuti iniziali
  aggiornaCarosello(immagine1, testo1, index1);
  aggiornaCarosello(immagine2, testo2, index2);
}

// ============================================================
// FEATURE 5 & 6: Associazione e cambio sincronizzato testo-immagine
// ============================================================
function aggiornaCarosello(imgElement, textElement, indice) {
  imgElement.src = contenuti[indice].immagine;
  textElement.textContent = contenuti[indice].testo;
}

// ============================================================
// FEATURE 12: Controllo unicità - Trova prossimo indice diverso
// ============================================================
function prossimoIndiceDiverso(indiceCorrente, indiceAltroCarosello) {
  let nuovoIndice = (indiceCorrente + 1) % contenuti.length;
  
  // Se il nuovo indice coincide con l'altro carosello, salta al successivo
  if (nuovoIndice === indiceAltroCarosello) {
    nuovoIndice = (nuovoIndice + 1) % contenuti.length;
  }
  
  return nuovoIndice;
}

// ============================================================
// FEATURE 2, 3, 4, 11: Click indipendenti - Bottone carosello 1
// ============================================================
button1.addEventListener("click", () => {
  index1 = prossimoIndiceDiverso(index1, index2);
  aggiornaCarosello(immagine1, testo1, index1);
});

// ============================================================
// FEATURE 2, 3, 4, 11: Click indipendenti - Bottone carosello 2
// ============================================================
button2.addEventListener("click", () => {
  index2 = prossimoIndiceDiverso(index2, index1);
  aggiornaCarosello(immagine2, testo2, index2);
});

// ============================================================
// Inizializzazione all'apertura della pagina
// ============================================================
inizializzaCaroselli();


/*
// Selezioniamo tutte le immagini all'interno del contenitore polaroid
const polaroidImages = document.querySelectorAll('.polaroid-container img');

// Aggiungiamo event listener per ogni immagine
polaroidImages.forEach((img, index) => {
  // Salviamo la posizione e rotazione originale
  const originalTransform = window.getComputedStyle(img).transform;
  
  img.addEventListener('mouseenter', function() {
    // Aggiungiamo la classe active per l'effetto hover
    this.classList.add('active');
  });
  
  img.addEventListener('mouseleave', function() {
    // Rimuoviamo la classe active per tornare allo stato originale
    this.classList.remove('active');
  });
});

// Opzionale: versione alternativa che calcola il centro dinamicamente
polaroidImages.forEach((img) => {
  img.addEventListener('mouseenter', function() {
    // Otteniamo la posizione corrente
    const rect = this.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Impostiamo il transform-origin al centro dell'immagine
    this.style.transformOrigin = 'center center';
  });
}); */
