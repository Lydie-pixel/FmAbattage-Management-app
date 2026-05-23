import {
    formatDateFR,
    formatPrice,
    formatMode,
    showToast
} from "../helpers/format.js";

import {
  initYearFilter
} from "../helpers/dates.js"

let editingId = null;

//Tableau de paiement
function loadPaie () {
  fetch("/api/paiement")
    .then(res => {
      if (!res.ok) throw new Error("Erreur API");
      return res.json();
    })
    .then(data => {

      const selectedYear = document.getElementById("yearFilter").value;

      data = data.filter(d => {
        const year = new Date(d.date_paiement).getFullYear();
        return year == selectedYear;
      });

      // Calcul total payé par facture
      const paiementsParFacture = {};

      data.forEach(p => {
        if (!paiementsParFacture[p.facture_id]) {
          paiementsParFacture[p.facture_id] = 0;
        }
        paiementsParFacture[p.facture_id] += Number(p.montant);
      });

      const div = document.getElementById("paiementTable");

      if (data.length === 0) {
        div.innerHTML = "<p>Aucun paiement pour le moment</p>";
        return;
      }

      let html = `
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Numéro de facture</th>
              <th>Client</th>
              <th>Montant réglé</th>
              <th>Date de paiement</th>
              <th>Mode de paiement</th>
              <th>Reste à payer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach(paiement => {
        const totalPaye = paiementsParFacture[paiement.facture_id] || 0;
        const montantFacture = paiement.facture?.montant || 0;
        const reste = montantFacture - totalPaye;

        html += `
          <tr>
            <td>${paiement.facture?.numero || "-"}</td>
            <td>${paiement.facture?.client?.nom || "-"}</td>
            <td>${formatPrice(paiement.montant)}</td>
            <td>${formatDateFR(paiement.date_paiement)}</td>
            <td>${formatMode(paiement.mode_paiement)}</td>
            <td>${formatPrice(reste)}</td>
            <td class="actions-cell">
              <button
                class="btn btn-sm btn-secondary" 
                onclick="openEditModal(${paiement.id})">
                Modifier
              </button>
              <button 
                class="btn btn-sm btn-danger"
                onclick="deletePaiement(${paiement.id})">
                Supprimer
              </button>
            </td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      div.innerHTML = html;
    })
    .catch(error => console.error(error));
}

// Supprimer un paiement
function deletePaiement(id) {
  if (!confirm("Supprimer ce paiement ?")) return;

  fetch(`/api/paiement/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    showToast("Paiement supprimé", "success");
    loadPaie();
  })
  .catch(err => console.error(err));
}

//Ouvrir une modale selon l'id pour la modifier
async function openEditModal(id) {

  const res = await fetch(`/api/paiement/${id}`);
  const p = await res.json();
  document.getElementById("paieForm").dataset.id = id;

  await loadFactures(p.facture_id);

  const select =
    document.getElementById("facture_id");

  select.value = p.facture_id;
  select.disabled = true;

  document.getElementById("paiement_montant").value = p.montant;
  document.getElementById("date_paiement").value = p.date_paiement.split("T")[0];
  document.getElementById("mode_paiement").value = p.mode_paiement;

  const modal = new bootstrap.Modal(
    document.getElementById("paieModal")
  );

  modal.show();
}

window.onload = () => {
  initYearFilter("yearFilter");
  loadPaie();
};

window.initYearFilter = initYearFilter
window.openEditModal = openEditModal;
window.deletePaiement = deletePaiement;
window. loadPaie = loadPaie