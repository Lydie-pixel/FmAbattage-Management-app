// ===== BADGES FACTURES =====
export function getFactureBadge(statut) {
  switch (statut) {
    case "payee": return "bg-success";
    case "partielle": return "bg-info";
    case "archive": return "bg-secondary";
    case "en_attente": default: return "bg-warning text-dark";
  }
}

// ===== BADGES PAIEMENTS =====
export function statutLabels (statut) {
  switch (statut) {
    case "en_attente": default: return "En attente de payement";
    case "payee": return "Facture payée";
    case "partielle": return "Paiement partiel";
    case "archive": return "Archivé";
  }
}

// ===== COULEURS =====
export function statutBadge(statut) {
  switch (statut) {
    case "en_attente": return "bg-warning-subtle text-warning-emphasis";
    case "partielle": return "bg-info-subtle text-info-emphasis";
    case "payee": return "bg-success-subtle text-success-emphasis";
    case "archive": return "bg-secondary-subtle text-secondary-emphasis";
    default: return "bg-light text-dark";
  }
}