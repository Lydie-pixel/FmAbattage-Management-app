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

// ===== BADGES DEVIS =====
export function statutDevis(dateEcheance) {

  const joursRestants = Math.ceil(
    (new Date(dateEcheance) - new Date()) /
    (1000 * 60 * 60 * 24)
  );

  if (joursRestants <= 3)
    return "bg-danger-subtle text-danger-emphasis";

  if (joursRestants <= 5)
    return "bg-warning-subtle text-warning-emphasis";

  if (joursRestants <= 10)
    return "bg-primary-subtle text-primary-emphasis";

  return "bg-success-subtle text-success-emphasis";
}

export function texteDevis(devis) {

  const joursRestants =
    Math.ceil(
      (new Date(devis.date_echeance) - new Date()) /
      (1000 * 60 * 60 * 24)
    );

  if (joursRestants < 0)
    return "Expiré";

  if (joursRestants === 0)
    return "Expire aujourd'hui";

  if (joursRestants === 1)
    return "Expire demain";

  return `Expire dans ${joursRestants} jours`;
}