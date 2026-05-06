// Mettre les dates au format FR
function formatDateFR(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

function formatMode(mode_paiement) {
  switch (mode_paiement) {
    case "virement_A": return "Virement compte A";
    case "virement_B": return "Virement compte B";
    case "cheque": return "Chèque";
    case "especes": return "Espèces";
    case "autre": return "Autre";
    default: return mode_paiement;
  }
}

// Trier par année
function initYearFilter() {
  const select = document.getElementById("yearFilter");
  const currentYear = new Date().getFullYear();

  for (let i = currentYear; i >= currentYear - 5; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }

  select.value = currentYear;
}

//Tableau de paiement
function loadPaie (){
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
    const div = document.getElementById("paiementTable");

    let html = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Numéro de facture</th>
            <th>Montant réglé</th>
            <th>Date de paiement</th>
            <th>Mode de paiement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(paiement => {
      html += `
        <tr>
          <td>${paiement.facture_id}</td>
          <td>${paiement.montant}</td>
          <td>${paiement.date_paiement}</td>
          <td>${formatMode(paiement.mode_paiement)}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="openEditModal(${paiement.id})">Modifier</button>
            <button class="btn btn-sm btn-danger" onclick="deletePaiement(${paiement.id})">Supprimer</button>
         </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;

                  if (data.length === 0) {
          div.innerHTML = "<p>Aucun paiement pour le moment</p>";
          return;
        }

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
  .then(() => loadPaie());
}

//Charger les factures
function loadFactures() {
  fetch("/api/facture")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("facture_id");
      select.innerHTML = "";

      data.forEach(f => {
        select.innerHTML += `<option value="${f.id}">${f.numero}</option>`;
      });
    });
}

// Ajouter un paiement
function addPaie() {
    const data = {
        facture_id: document.getElementById("facture_id").value,
        montant: document.getElementById("montant").value,
        date_paiement: document.getElementById("date_paiement").value,
        mode_paiement: document.getElementById("mode_paiement").value
    };

  fetch("/api/paiement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
.then(() => {
  loadPaie();
  bootstrap.Modal.getInstance(document.getElementById('paieModal')).hide();

  document.getElementById("facture_id").value = "";
  document.getElementById("montant").value = "";
  document.getElementById("date_paiement").value = "";
  document.getElementById("mode_paiement").value = "";
});
}

function openCreateModal() {
  const modal = new bootstrap.Modal(document.getElementById('paieModal'));
  modal.show();
}

window.onload = () => {
  initYearFilter();
  loadPaie();
  loadFactures();
};