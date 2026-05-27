// ===== DATE =====
export function formatDateFR(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

// ===== PRIX =====
export function formatPrice(value) {
    return Number(value || 0)
        .toLocaleString(
            "fr-FR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )
    + " €";
}

// ===== RELANCES =====
export function formatNiveau(niveau) {
    switch (niveau) {
        case "relance_1": return "Première relance";
        case "relance_2": return "Deuxième relance";
        case "relance_3": return "Troisième relance";
        case "mise_en_demeure": return "Mise en demeure";
        default: return niveau;
    }
}

// ===== MODE DE PAIEMENT =====
export function formatMode(mode_paiement) {
    switch (mode_paiement) {
        case "virement_A": return "Virement compte A";
        case "virement_B": return "Virement compte B";
        case "cb": return "Carte Bancaire";
        case "cheque": return "Chèque";
        case "especes": return "Espèces";
        case "autre": return "Autre";
        default: return mode_paiement;
    }
}

// ===== TYPES DE DEPENSES =====
export function formatType(type) {
  switch (type) {
    case "frais_carburant": return "Carburant";
    case "frais_materiel": return "Matériel";
    case "charge": return "Charges";
    case "autre": return "Autre";
    default: return type;
  }
}

// ===== STATUT DES RELANCES =====
export function formatStatut(niveau){
    switch (niveau){
        case "envoyee": return "Envoyée";
        case "payee": return "Payée";
        case "procedure": return "En procédure";
        case "annulee": return "Annulée";
        default: return niveau;
    }
}

// ===== ICONE DE DEPENSE =====

export function getDepenseIcon(type) {
  switch(type){
    case "frais_carburant": return "bi-fuel-pump-fill";
    case "frais_materiel": return "bi-tools";
    case "charges": return "bi-bank";
    case "autre": return "bi-wallet2";
    default: return "bi-cash";
  }
}

export function getDepenseColor(type) {
  switch(type){
    case "frais_carburant": return "icon-carburant";
    case "frais_materiel": return "icon-materiel";
    case "charges": return "icon-charges";
    case "autre": return "icon-autre";
    default: return "icon-default";
  }
}

// ===== TOASTS =====
export function showToast(message, type = "success") {

  const toastEl = document.getElementById("successToast");
  const messageEl = document.getElementById("toastMessage");

  if (!toastEl || !messageEl) {
    console.warn("Toast introuvable :", message);
    return;
  }

  messageEl.textContent = message;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}