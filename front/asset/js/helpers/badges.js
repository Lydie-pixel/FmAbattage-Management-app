// Paiement en attent
  let badge = "bg-warning";
  if (f.statut === "partielle") badge = "bg-info";

        const statutLabels = {
    en_attente: "En attente de payement",
    payee: "Facture payée",
    partielle: "Paiement partiel",
    archive: "Archivé"
  };