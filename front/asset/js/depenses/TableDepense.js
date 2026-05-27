import {
    formatDateFR,
    formatPrice,
    formatType,
    formatMode,
    showToast
} from "../helpers/format.js";

import {
  initYearFilter
} from "../helpers/dates.js"

// Table des dépenses
function loadDepenses() {
  fetch("/api/depense")
    .then(res => {
      if (!res.ok) throw new Error("Erreur API");
      return res.json();
    })
    .then(data => {
      const selectedYear = document.getElementById("yearFilter").value;
      data = data.filter(d => {
        const year = new Date(d.date).getFullYear();
        return year == selectedYear;
      });
      const div = document.getElementById("depenseTable");
      let html=`
        <table class="table table-striped">
          <thead>
              <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Action</th>
              </tr>
          </thead>
          <tbody>
          `;
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      data.forEach(d => {
        html += `
          <tr>
            <td>${new Date(d.date).toLocaleDateString()}</td>
            <td>${formatType(d.type)}</td>
            <td>${d.description || ""}</td>
            <td>${Number(d.montant).toFixed(2)} €</td>
            <td class="actions-cell">
              <button 
                class="btn btn-outline-danger btn-sm" 
                onclick="deleteDepense(${d.id})">
                Supprimer
              </button>
            </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
                  if (data.length === 0) {
          div.innerHTML = "<p>Aucune dépense pour le moment</p>";
          return;
        }
      div.innerHTML = html;
    });
}

// Supprimer une dépense
function deleteDepense(id) {
  if (!confirm("Supprimer cette dépense ?")) return;

  fetch(`/api/depense/${id}`, {
    method: "DELETE"
  })
.then(async res => {

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Erreur suppression");
    }
    return data;
  })
  .then(() => {
    showToast("Dépense supprimé", "success");
    loadDepenses();
  })
  .catch(err => {
    showToast("Erreur de suppression", "danger");
  });
}

window.onload = () => {
  initYearFilter("yearFilter");
  loadDepenses();
};

window.initYearFilter = initYearFilter
window.loadDepenses = loadDepenses
window.deleteDepense = deleteDepense