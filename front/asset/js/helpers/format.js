// ===== DATE =====
function formatDateFR(dateString) {
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
function formatMode(mode_paiement) {
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
function formatType(type) {
  switch (type) {
    case "frais_carburant": return "Carburant";
    case "frais_materiel": return "Matériel";
    case "charges": return "Charges";
    case "autre": return "Autre";
    default: return type;
  }
}

// ===== STATUT DES RELANCES =====
function formatStatut(niveau){
    switch (niveau){
        case "envoyee": return "Envoyée";
        case "payee": return "Payée";
        case "procedure": return "En procédure";
        case "annulee": return "Annulée";
        default: return niveau;
    }
}

// ===== ICONE DE DEPENSE =====

function getDepenseIcon(type) {
  switch(type){
    case "frais_carburant": return "bi-fuel-pump-fill";
    case "frais_materiel": return "bi-tools";
    case "charges": return "bi-bank";
    case "autre": return "bi-wallet2";
    default: return "bi-cash";
  }
}