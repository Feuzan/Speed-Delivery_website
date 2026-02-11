// ========================================
// CONSTANTES ET VARIABLES GLOBALES
// ========================================

const DONATION_GOAL = 18200;
let totalDonations = 0;

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
  "carte éboueurs.png",
];

// ========================================
// SYSTÈME DES CARTES
// ========================================

function initGame() {
  const grid = document.getElementById("card-grid");
  if (!grid) return;

  grid.innerHTML = "";
  cardImages.forEach((imgName) => {
    try {
      grid.appendChild(createCard(imgName));
    } catch (e) {
      console.error("Erreur création carte:", e);
    }
  });
}

function createCard(imageSrc) {
  const container = document.createElement("div");
  container.className = "card-container";
  container.dataset.type = getType(imageSrc);

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const front = document.createElement("div");
  front.className = "card-front";
  const img = document.createElement("img");
  img.src = `assets/${imageSrc}`;
  img.alt = "Carte Speed Delivery";
  img.loading = "lazy";
  img.onerror = () => (container.style.display = "none");
  front.appendChild(img);

  const back = document.createElement("div");
  back.className = "card-back";
  const backSrc = getBackImage(imageSrc);
  back.style.backgroundImage = `url('assets/${backSrc}')`;
  back.style.backgroundSize = "cover";
  back.style.backgroundPosition = "center";

  inner.appendChild(front);
  inner.appendChild(back);
  container.appendChild(inner);
  container.addEventListener("click", () =>
    container.classList.toggle("flipped"),
  );

  return container;
}

function getBackImage(frontSrc) {
  if (frontSrc.startsWith("front team ")) {
    const team = frontSrc.replace("front team ", "").replace(".png", "");
    return `back team ${team}.png`;
  } else if (
    [
      "carte A.png",
      "Carte B.png",
      "carte C.png",
      "carte D.png",
      "carte E.png",
      "Carte F.png",
    ].includes(frontSrc)
  ) {
    return "dos de carte location.png";
  } else {
    return "back card.png";
  }
}

function getType(frontSrc) {
  if (frontSrc.startsWith("front team ")) return "team";
  if (frontSrc.includes("étoile")) return "star";
  if (
    [
      "carte A.png",
      "Carte B.png",
      "carte C.png",
      "carte D.png",
      "carte E.png",
      "Carte F.png",
    ].includes(frontSrc)
  )
    return "location";
  return "event";
}

// ========================================
// FILTRAGE DES CARTES
// ========================================

function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.dataset.filter;
      buttons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      document.querySelectorAll(".card-container").forEach((card) => {
        card.style.display =
          filter === "all" || card.dataset.type === filter ? "" : "none";
      });
    });
  });
}

// ========================================
// MODALE DES RÈGLES
// ========================================

function initRulesModal() {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const rulesImages = document.querySelectorAll(".rules-visuals img");

  rulesImages.forEach((img) => {
    img.addEventListener("click", function () {
      modal.style.display = "flex";
      modalImg.src = this.src;
    });
  });

  modal.addEventListener("click", () => (modal.style.display = "none"));
}

// ========================================
// SYSTÈME DE DONATION
// ========================================

function initDonationSystem() {
  loadDonations();
  setupDonationModal();
  setupPresetDonations();
  setupCustomDonation();
  updateProgressBar();
}

function setupDonationModal() {
  const donationBtn = document.getElementById("donation-btn");
  const donationModal = document.getElementById("donation-modal");
  const closeDonationModal = document.getElementById("close-donation-modal");

  if (!donationBtn || !donationModal) return;

  donationBtn.addEventListener("click", () =>
    donationModal.classList.add("show"),
  );
  closeDonationModal?.addEventListener("click", () =>
    donationModal.classList.remove("show"),
  );
  donationModal.addEventListener("click", (e) => {
    if (e.target === donationModal) donationModal.classList.remove("show");
  });
}

function setupPresetDonations() {
  const donationModal = document.getElementById("donation-modal");
  document.querySelectorAll(".donation-preset").forEach((btn) => {
    btn.addEventListener("click", function () {
      addDonation(parseInt(this.dataset.amount));
      donationModal.classList.remove("show");
    });
  });
}

function setupCustomDonation() {
  const donationModal = document.getElementById("donation-modal");
  const customDonateBtn = document.getElementById("custom-donate-btn");
  const customAmountInput = document.getElementById("custom-amount");

  if (!customDonateBtn || !customAmountInput) return;

  const processDonation = () => {
    const amount = parseInt(customAmountInput.value);
    if (amount && amount > 0) {
      addDonation(amount);
      customAmountInput.value = "";
      donationModal.classList.remove("show");
    } else {
      alert("Veuillez entrer un montant valide");
    }
  };

  customDonateBtn.addEventListener("click", processDonation);
  customAmountInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") processDonation();
  });
}

function addDonation(amount) {
  const amountNum = parseInt(amount) || 0;
  if (amountNum > 0) {
    totalDonations += amountNum;
    localStorage.setItem("totalDonations", totalDonations.toString());
    updateProgressBar();
    showDonationSuccess(amountNum);
  }
}

function loadDonations() {
  const stored = localStorage.getItem("totalDonations");
  totalDonations = stored ? parseInt(stored) || 0 : 0;
}

function resetDonations() {
  localStorage.removeItem("totalDonations");
  totalDonations = 0;
  updateProgressBar();
  console.log("Donations réinitialisées");
}

function updateProgressBar() {
  const currentAmount =
    parseInt(document.getElementById("collected-amount").textContent) || 0;
  const percentage = Math.min((totalDonations / DONATION_GOAL) * 100, 100);
  const progressBar = document.getElementById("donation-progress-bar");
  const progressPercentage = document.getElementById("progress-percentage");
  const collectedAmount = document.getElementById("collected-amount");

  progressBar.style.width = percentage + "%";
  progressBar.style.boxShadow = "0 0 10px rgba(255, 215, 0, 0.8)";

  setTimeout(() => (progressBar.style.boxShadow = "none"), 500);

  const currentPercentage = parseInt(progressPercentage.textContent) || 0;
  animateNumber(progressPercentage, currentPercentage, Math.round(percentage));
  animateNumber(collectedAmount, currentAmount, totalDonations, true);
}

function animateNumber(element, startValue, endValue, isCurrency = false) {
  const duration = 600;
  const startTime = Date.now();
  const start = isNaN(startValue) ? 0 : startValue;
  const end = isNaN(endValue) ? 0 : endValue;

  function updateValue() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(start + (end - start) * progress);

    element.textContent = isCurrency
      ? currentValue.toLocaleString("fr-FR") + " €"
      : currentValue + "%";

    if (progress < 1) requestAnimationFrame(updateValue);
  }

  updateValue();
}

function showDonationSuccess(amount) {
  const message = document.createElement("div");
  message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
  message.textContent = `Merci ! Donation de ${amount} € reçue !`;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 3000);
}

// ========================================
// INITIALISATION
// ========================================

initGame();
initRulesModal();
initFilters();
initDonationSystem();
