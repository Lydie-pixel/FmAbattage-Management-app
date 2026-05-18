import {
    formatDateFR
} from "../helpers/format.js";
  
import {
  initYearFilter
} from "../helpers/dates.js"

import {
  statutLabels
} from "../helpers/badges.js"

// Charger les factures
function facture(){
fetch("/api/facture")
    .then(res => res.json())
    .then(data => {

      const selectedYear = document.getElementById("yearFilter").value;

      data = data.filter(d => {
        if (!d.date_facture) return false;
        return new Date(d.date_facture).getFullYear() == selectedYear;
      });
    const container = document.getElementById("tableFactures");

    let html = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Numéro de la facture</th>
            <th>Devis</th>
            <th>Client</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Payé</th>
            <th>Reste à payer</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(facture => {
    const totalPaye = facture.paiements?.reduce((sum, p) => sum + Number(p.montant), 0) || 0;
    const reste = facture.montant - totalPaye;

      html += `
        <tr>
          <td>${facture.numero}</td>
          <td>${facture.devis?.numero || "-"}</td>
          <td>${facture.client?.nom || "-"}</td>
          <td>${formatDateFR(facture.date_facture)}</td>
          <td>${facture.montant}€</td>
          <td>${totalPaye.toFixed(2)} €</td>
          <td>${reste.toFixed(2)} €</td>
          <td>
            <select onchange="changeStatutFacture(${facture.id}, this.value)" 
                    class="form-select form-select-sm mt-1">

                <option value="en_attente" ${facture.statut === "en_attente" ? "selected" : ""}>En attente</option>
                <option value="partielle" ${facture.statut === "partielle" ? "selected" : ""}>Partielle</option>
                <option value="payee" ${facture.statut === "payee" ? "selected" : ""}>Payée</option>
            </select>
            </td>
          <td class="actions-cell">
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-sm"
              onclick="generateFacturePDF(${facture.id})">
              <i class="bi bi-file-earmark-pdf"></i> PDF
            </button>
            <button 
              class="btn btn-danger btn-sm btn-supprimer"  
              onclick="deleteFacture(${facture.id})">
              Supprimer
            </button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  });
}

  // Changer statut
function changeStatutFacture(id, statut) {
  fetch(`http://localhost:3000/api/facture/${id}/statut`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ statut })
  })
  .then(() => {
    alert("Statut mis à jour");
  })
  .catch(err => console.error(err));
}

// Supprimer
function deleteFacture(id) {
  if (!confirm("Supprimer cette facture ?")) return;

  fetch(`http://localhost:3000/api/facture/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Facture supprimée");
    location.reload();
  })
  .catch(err => console.error(err));
}

// PDF
function generateFacturePDF(id) {
  window.open(`http://localhost:3000/api/pdf/facture/${id}`, "_blank");
}

// rendre accessibles
window.changeStatutFacture = changeStatutFacture;
window.deleteFacture = deleteFacture;
window.generateFacturePDF = generateFacturePDF;
window. facture = facture;


// Créer facture depuis liste des devis
function facturerDepuisListe(id) {
  const frais = prompt("Frais de déplacement final ?");

  fetch(`http://localhost:3000/api/facture/from-devis/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      frais_deplacement_final: frais || 0
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Facture créée");

    // ouvrir PDF direct
    window.open(`http://localhost:3000/api/pdf/facture/${data.facture.id}`, "_blank");

    // refresh
    location.reload();
  });
}

window.onload = () => {
  initYearFilter("yearFilter");
  facture();
};