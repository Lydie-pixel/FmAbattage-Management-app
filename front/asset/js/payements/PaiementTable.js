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
  return Number(value).toLocaleString("fr-FR") + " €";
}

//UX des modes de paiement
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

      // 🔥 Calcul total payé par facture
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
  .then(() => loadPaie());
}

//Charger les factures
function loadFactures() {

  fetch("/api/facture")
    .then(res => res.json())
    .then(data => {

      const select = document.getElementById("facture_id");

      select.innerHTML = "";

      // 🔥 garder uniquement les factures non payées
      const facturesFiltrees = data.filter(f =>
        f.statut !== "payee"
      );

      if (facturesFiltrees.length === 0) {
        select.innerHTML =
          `<option>Aucune facture à payer</option>`;
        return;
      }

      facturesFiltrees.forEach(f => {

        select.innerHTML += `
          <option value="${f.id}">
            ${f.numero}
          </option>
        `;
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

  const method = editingId ? "PUT" : "POST";
  const url = editingId
    ? `/api/paiement/${editingId}`
    : "/api/paiement";

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(async res => {

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Erreur serveur");
    }

    return result;
  })
  .then(result => {

    console.log("Paiement ajouté :", result);

    editingId = null;

    loadPaie();

    bootstrap.Modal
      .getInstance(document.getElementById("paieModal"))
      .hide();

    document.getElementById("paieForm").reset();
  })
  .catch(error => {
    console.error(error);

    alert(error.message);
  });
}

//Ouviri la modal
function openCreateModal() {

  editingId = null;
  document.getElementById("paieForm").reset();

  const modal = new bootstrap.Modal(
    document.getElementById('paieModal')
  );
  modal.show();
}

//Ouvrir une modale selon l'id
function openEditModal(id) {
  fetch(`/api/paiement/${id}`)
    .then(res => res.json())
    .then(p => {
      editingId = id;

      document.getElementById("facture_id").value = p.facture_id;
      document.getElementById("montant").value = p.montant;
      document.getElementById("date_paiement").value = p.date_paiement;
      document.getElementById("mode_paiement").value = p.mode_paiement;

      const modal = new bootstrap.Modal(document.getElementById('paieModal'));
      modal.show();
    });
}

window.onload = () => {
  initYearFilter();
  loadPaie();
  loadFactures();
};