import {
    formatDateFR,
    formatPrice
} from "../helpers/format.js";

import {
    initYearFilter
} from "../helpers/dates.js";

// Action sur un devis
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("btn-supprimer")) {

    const id = e.target.dataset.id;

    if (!confirm("Supprimer ce devis ?")) return;

    fetch(`http://localhost:3000/api/devis/${id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
      alert("Devis supprimé");
      location.reload(); // refresh liste
    })
    .catch(err => console.error(err));
  }

  if (e.target.classList.contains("btn-modifier")) {
  const id = e.target.dataset.id;
  window.location.href = `/pages/ModifDevis.html?id=${id}`;
}
if (e.target.classList.contains("btn-facturer")) {
  const id = e.target.dataset.id;
  facturer(id);
}
});

//Changer de statut
function changeStatut(id, statut) {
  fetch(`http://localhost:3000/api/devis/${id}/statut`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ statut })
  })
  .then(() => {
    alert("Statut mis à jour");
    location.reload();
  });
}

function facturer(devisId) {
  const frais = prompt("Frais de déplacement final ?");

  fetch(`http://localhost:3000/api/facture/from-devis/${devisId}`, {
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

    // 1. ouvrir le PDF
    window.open(`http://localhost:3000/api/pdf/facture/${data.facture.id}`, "_blank");

    // 2. rediriger vers la page factures
    window.location.href = "/pages/factures.html";
  })
  .catch(err => {
    showToast("Erreur lors de la facturation", "danger");
  });
}

//Générer PDF
function generatePDF(id) {
  window.open(`/api/pdf/devis/${id}`, "_blank");
}

// Affiché les devis
function devis(){
  fetch("/api/devis")
    .then(res => res.json())
    .then(data => {

      const selectedYear = document.getElementById("yearFilter").value;

      data = data.filter(d => {
        if (!d.date_devis) return false;
        return new Date(d.date_devis).getFullYear() == selectedYear;
      });

    const container = document.getElementById("tableDevis");


    let html = `

      <table class="table table-striped">
        <thead>
          <tr>
            <th>Numéro du devis</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Date échéance</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        `;

    data.forEach(devis => {    
    const statutLabels = {
        en_attente: "En attente ",
        accepte: "Accepté ",
        refuse: "Refusé ",
        archive: "Archivé "
      };

      let factureBtn = "";

let actions = "";

// Bouton modifier seulement si PAS accepté
if (devis.statut !== "accepte") {
 actions += `
  <button 
    class="btn btn-warning btn-sm btn-modifier me-2" 
    data-id="${devis.id}">
    Modifier
  </button>`;
}

// Bouton facturer uniquement si accepté
if (devis.statut === "accepte") {
  actions += `
  <button 
    class="btn btn-success btn-sm btn-facturer me-2" 
    data-id="${devis.id}">
    Facturer
  </button>`;
}

// Toujours afficher supprimer (ou à adapter selon ton besoin)
actions += `
<button 
  class="btn btn-danger btn-sm btn-supprimer" 
  data-id="${devis.id}">
  Supprimer
</button>`;

    html += `
      <tr>
        <td>${devis.numero}</td>
        <td>${devis.client?.nom || "-"}</td>
        <td>${devis.client?.tel || "-"}</td>
        <td>${formatDateFR(devis.date_echeance)}</td>
        <td>${formatPrice(devis.montant)} €</td>
        <td>
          <select onchange="changeStatut(${devis.id}, this.value)" class="form-select form-select-sm">
            <option value="en_attente" ${devis.statut === "en_attente" ? "selected" : ""}>En attente</option>
            <option value="accepte" ${devis.statut === "accepte" ? "selected" : ""}>Accepté</option>
            <option value="refuse" ${devis.statut === "refuse" ? "selected" : ""}>Refusé</option>
            <option value="archive" ${devis.statut === "archive" ? "selected" : ""}>Archivé</option>
          </select>
        </td>
        <td class="actions-cell">
          <button 
            type="button" 
            class="btn btn-outline-secondary btn-sm"
            onclick="generatePDF(${devis.id})">
            <i class="bi bi-file-earmark-pdf"></i> PDF
          </button>
          ${actions}
        </td>
      </tr>
    `;
  });

    html += `</tbody></table>`;

    container.innerHTML = html;
});
}

window.facturer = facturer;
window.changeStatut = changeStatut;
window.generatePDF = generatePDF;
window.devis = devis;

window.onload = () => {
  initYearFilter("yearFilter");
  devis();
};