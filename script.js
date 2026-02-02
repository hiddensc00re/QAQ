/* ========================================
   CRAVE METAL SWITCH FUNCTIONALITY
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    const metalSwitch = document.getElementById('craveMetalSwitch');
    
    if (!metalSwitch) {
        console.warn('Crave Metal Switch: elemento #craveMetalSwitch non trovato');
        return;
    }

    const switchToggle = document.getElementById('metalSwitchToggle');
    const switchIndicator = document.getElementById('metalSwitchIndicator');
    let isActive = false;

    // Click handler
    if (switchToggle) {
        switchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSwitch();
        });

        // Touch support
        switchToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleSwitch();
        });

        // Keyboard support (spacebar quando focus)
        switchToggle.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                toggleSwitch();
            }
        });
    }

    function toggleSwitch() {
        isActive = !isActive;
        switchToggle.classList.add('glitch');
        
        setTimeout(() => {
            switchToggle.classList.remove('glitch');
            switchToggle.classList.toggle('active');
            
            // Dispatch custom event
            const event = new CustomEvent('metalSwitchToggle', {
                detail: { isActive: isActive }
            });
            metalSwitch.dispatchEvent(event);
            
            // Log per debug
            console.log('Crave Metal Switch:', isActive ? 'ON' : 'OFF');
        }, 75);
    }

    // API pubblica
    window.CraveMetalSwitch = {
        toggle: toggleSwitch,
        setActive: function(active) {
            if (active !== isActive) {
                toggleSwitch();
            }
        },
        getState: function() {
            return isActive;
        }
    };
});


//   SELEZIONE ELEMENTI DOM


// Slider principale
const slider = document.getElementById("slider");

// Elementi rotanti (port)
const port1 = document.querySelector("#port1");
const port2 = document.querySelector("#port2");

// Elemento LED/illuminazione
const m = document.getElementById("m");



// PARAMETRI CONFIGURABILI


// 🔧 PARAMETRO MODIFICABILE: velocità massima raggiungibile
const MAX_SPEED = 4; // rotazioni/frame quando slider = 100



//   VARIABILI DI STATO


// Angoli di rotazione attuali per port1 e port2
let angle1 = 10;
let angle2 = 0;

// Velocità dinamiche (aggiornate dall'input dello slider)
let speed1 = 0;
let speed2 = 0;

// Flag per tracciare se lo slider è attivo
let isSliderActive = false;



//   FUNZIONE DI MAPPING LINEARE
//   Converte un valore da un range a un altro
//   Esempio: map(50, 0, 100, 0, MAX_SPEED) = MAX_SPEED/2


function map(value, inMin, inMax, outMin, outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}



// GESTIONE SLIDER - INPUT DRAG
// Calcola velocità proporzionali alla posizione dello slider


slider.addEventListener("input", (e) => {
  isSliderActive = true;
  const val = Number(e.target.value);

  // Port1: accelera da 0 a MAX_SPEED (senso orario)
  speed1 = map(val, 0, 100, 0, MAX_SPEED);

  // Port2: decelera da MAX_SPEED a 0 (senso antiorario)
  // Relazione inversa garantita dal map inverso
  speed2 = map(val, 0, 100, MAX_SPEED, 0);

  // Aggiorna illuminazione elemento M in base al valore
  updateIllumination(val);
});



// GESTIONE RILASCIO SLIDER
//   Reset della posizione a 0 e arresto della rotazione


//   GESTIONE TOUCH & MOUSE - INIZIO DRAG
//   Attiva la rotazione quando l'utente tocca/preme lo slider


["mousedown", "touchstart"].forEach((eventType) => {
  slider.addEventListener(eventType, (e) => {
    isSliderActive = true;
    // Previene comportamenti di default su mobile (scroll, zoom)
    e.preventDefault();
  });
});


// GESTIONE TOUCH & MOUSE - DURANTE DRAG
//   Aggiorna il valore dello slider durante il trascinamento touch
//   Necessario perché touch non trigga "input" come mouse


slider.addEventListener("touchmove", (e) => {
  // Ottiene le coordinate del tocco
  const touch = e.touches[0];
  
  // Ottiene le dimensioni e posizione dello slider
  const sliderRect = slider.getBoundingClientRect();
  
  // Calcola la posizione percentuale del tocco relativa allo slider
  const touchX = touch.clientX - sliderRect.left;
  const sliderWidth = sliderRect.width;
  const percentage = Math.max(0, Math.min(100, (touchX / sliderWidth) * 100));
  
  // Aggiorna il valore dello slider
  slider.value = percentage;
  
  // Forza l'evento input per aggiornare velocità e illuminazione
  slider.dispatchEvent(new Event("input", { bubbles: true }));
}, { passive: false });



// GESTIONE TOUCH & MOUSE - FINE DRAG
// Resetta slider e arresta rotazione al rilascio
// Funziona solo quando il tocco termina sullo slider


["mouseup", "touchend"].forEach((eventType) => {
  slider.addEventListener(eventType, (e) => {
    e.preventDefault();
    slider.value = 0;
    speed1 = 0;
    speed2 = 0;
    isSliderActive = false;
    updateIllumination(0);
  });
});



// GESTIONE ILLUMINAZIONE ELEMENTO M
// Aumenta progressivamente brightness e opacity
// con il valore dello slider (0-100)


function updateIllumination(sliderValue) {
  // Calcola intensità lineare (0.5 = minimo, 2.0 = massimo)
  const brightness = 0.5 + (sliderValue / 100) * 1.5;
  
  // Calcola opacità lineare (0.4 = minimo, 1.0 = massimo)
  const opacity = 0.4 + (sliderValue / 100) * 0.6;
  
  // Calcola raggio glow progressivo (0-20px)
  const glowRadius = (sliderValue / 100) * 20;

  // Applica filtri CSS per effetto luminoso
  m.style.filter = `
    brightness(${brightness})
    drop-shadow(0 0 ${glowRadius}px #0f0)
  `;
  m.style.opacity = opacity;
}



// LOOP DI ANIMAZIONE - requestAnimationFrame
// Aggiorna la rotazione continua dei port
// Esegue ogni frame per massima fluidità


function animate() {
  // Se slider attivo: incrementa angoli di rotazione
  if (isSliderActive) {
    angle1 += speed1;        // Port1 orario (incremento positivo)
    angle2 -= speed2;        // Port2 antiorario (decremento)
  }

  // Applica rotazione CSS ai port
  port1.style.transform = `rotate(${angle1}deg)`;
  port2.style.transform = `rotate(${angle2}deg)`;

  // Richiama la prossima iterazione
  requestAnimationFrame(animate);
}

// Avvio del loop di animazione
animate();


/*
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
