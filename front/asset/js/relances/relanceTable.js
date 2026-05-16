// Mettre les dates au format FR
function formatDateFR(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

let editingId = null;

//Mettre les prix au format €
function formatPrice(value) {
  return Number(value).toLocaleString(
    "fr-FR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
    ) + " €";
}

//UX des niveau de relance
function formatNiveau(niveau){
    switch (niveau){
        case "relance_1": return "Première relance";
        case "relance_2": return "Deuxième relance";
        case "relance_3": return "Troisième relance";
        case "mise_en_demeure": return "Mise en demeure";
        default: return niveau;
    }
}

//UX des statut
function formatStatut(niveau){
    switch (niveau){
        case "envoyee": return "Envoyée";
        case "payee": return "Payée";
        case "procedure": return "En procédure";
        case "annulee": return "Annulée";
        default: return niveau;
    }
}

//Tableau
function relance() {

  fetch("/api/relance")

    .then(res => res.json())

    .then(data => {

      const container =
        document.getElementById("tableRelance");

      let html = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Niveau</th>
              <th>Client</th>
              <th>Facture</th>
              <th>Date</th>
              <th>Montant initial</th>
              <th>Montant restant</th>
              <th>Pénalités</th>
              <th>Numéro AR</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(relance => {

        // total payé
        let totalPaye = 0;

        relance.facture?.paiements?.forEach(p => {
          totalPaye += Number(p.montant);
        });

        // reste à payer
        const reste =
          Number(relance.facture?.montant || 0)
          - totalPaye;

        html += `
          <tr>
            <td>${formatNiveau(relance.niveau)}</td>

            <td>
              ${relance.facture?.client?.nom || "-"}
            </td>

            <td>
              ${relance.facture?.numero || "-"}
            </td>

            <td>
              ${formatDateFR(relance.date_relance || "-")}
            </td>

            <td>
              ${relance.facture?.montant || 0} €
            </td>

            <td>
              ${formatPrice(reste)}
            </td>

            <td>
              ${formatPrice(relance.penalites || 0)}
            </td>

            <td>
              ${relance.numero_ar || "-"}
            </td>

            <td>
              ${formatStatut(relance.statut || "-")}
            </td>

            <td>
              <button
                class="btn btn-sm btn-secondary">
                Voir
              </button>
            </td>
          </tr>
        `;

      });

      html += `
          </tbody>
        </table>
      `;

      container.innerHTML = html;

    })

    .catch(error => {
      console.error(error);
    });

}

window.onload = () => {
  relance();
};