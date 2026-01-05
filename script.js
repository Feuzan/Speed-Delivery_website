// --- CONFIGURATION ---
console.log("Speed Delivery JS chargé");

// Liste des images de cartes, triées par type
const cardImages = [
    // Cartes d'équipe
    "front team burger.png",
    "front team pizza.png",
    "front team sushi.png",
    "front team tacos.png",
    // Cartes étoile
    "carte demi étoile.png",
    "carte étoile.png",
    // Cartes de localisation
    "carte A.png",
    "Carte B.png",
    "carte C.png",
    "carte D.png",
    "carte E.png",
    "Carte F.png",
    // Cartes d'événements
    "carte banqueroute.png",
    "carte coffre.png",
    "carte commande double.png",
    "carte essence.png",
    "carte excès de vitesse.png",
    "carte fin de travaux.png",
    "carte fuite de pizza.png",
    "carte gilet jaune.png",
    "carte glisser.png",
    "carte gros gourmand.png",
    "carte grêle.png",
    "carte livreur du futur.png",
    "carte mauvaise destition.png",
    "carte moteur trafiqué.png",
    "carte permis de conduire.png",
    "carte pluie.png",
    "carte pneu blindé.png",
    "carte pneu crever.png",
    "carte police.png",
    "carte prioritaire.png",
    "carte racourci.png",
    "carte rat.png",
    "carte sauce piquante.png",
    "carte soleil.png",
    "carte travaux.png",
    "carte éboueurs.png"
];

// --- MAIN LOGIC ---
function initGame() {
    const grid = document.getElementById('card-grid');
    
    if (!grid) {
        console.error("Erreur: Élément #card-grid introuvable");
        return;
    }

    // Vider la grille par sécurité
    grid.innerHTML = '';

    cardImages.forEach(imgName => {
        try {
            const cardElement = createCard(imgName);
            grid.appendChild(cardElement);
        } catch (e) {
            console.error("Erreur lors de la création de la carte:", e);
        }
    });
    
    console.log(`${cardImages.length} cartes générées.`);
}

// Function to create card HTML structure
function createCard(imageSrc) {
    const container = document.createElement('div');
    container.className = 'card-container';
    container.dataset.type = getType(imageSrc);
    
    // Inner container for 3D Transform
    const inner = document.createElement('div');
    inner.className = 'card-inner';

    // Front Face (L'illustration)
    const front = document.createElement('div');
    front.className = 'card-front';
    const img = document.createElement('img');
    img.src = `assets/${imageSrc}`;
    img.alt = "Carte Speed Delivery";
    img.loading = "lazy";
    
    // Gestion d'erreur d'image : si l'image n'existe pas, on cache la carte
    img.onerror = function() {
        container.style.display = 'none'; // Cache toute la carte si l'image n'existe pas
    };
    
    front.appendChild(img);

    // Back Face (Le dos/motif)
    const back = document.createElement('div');
    back.className = 'card-back';
    // Déterminer l'image de dos
    const backSrc = getBackImage(imageSrc);
    back.style.backgroundImage = `url('assets/${backSrc}')`;
    back.style.backgroundSize = 'cover';
    back.style.backgroundPosition = 'center';

    // Assemblage
    inner.appendChild(front);
    inner.appendChild(back);
    container.appendChild(inner);

    // Interaction au clic
    container.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });

    return container;
}

// Function to get the back image based on front
function getBackImage(frontSrc) {
    if (frontSrc.startsWith('front team ')) {
        const team = frontSrc.replace('front team ', '').replace('.png', '');
        return `back team ${team}.png`;
    } else if (['carte A.png', 'Carte B.png', 'carte C.png', 'carte D.png', 'carte E.png', 'Carte F.png'].includes(frontSrc)) {
        return 'dos de carte location.png';
    } else {
        return 'back card.png';
    }
}

// Function to get the type of card
function getType(frontSrc) {
    if (frontSrc.startsWith('front team ')) return 'team';
    else if (frontSrc.includes('étoile')) return 'star';
    else if (['carte A.png', 'Carte B.png', 'carte C.png', 'carte D.png', 'carte E.png', 'Carte F.png'].includes(frontSrc)) return 'location';
    else return 'event';
}

// Function to initialize rules images modal
function initRulesModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const rulesImages = document.querySelectorAll('.rules-visuals img');

    rulesImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.src;
        });
    });

    modal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

// Lancement direct
initGame();
initRulesModal();
initFilters();

// Function to initialize filters
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            // Remove active class
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Filter cards
            const cards = document.querySelectorAll('.card-container');
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.type === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
