// Format date FR
function formatDateFR(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

const badge = {
  en_attente: "secondary",
  partielle: "warning",
  payee: "success"
};

const statutLabel = {
  en_attente: "En attente",
  partielle: "Paiement partiel",
  payee: "Payée"
};

// Charger les factures
fetch("http://localhost:3000/api/facture")
  .then(res => res.json())
  .then(data => {

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
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach(facture => {

      html += `
        <tr>
          <td>${facture.numero}</td>
          <td>${facture.devis?.numero || "-"}</td>
          <td>${facture.client?.nom || "-"}</td>
          <td>${formatDateFR(facture.date_facture)}</td>
          <td>${facture.montant} €</td>
            <td>
            <span class="badge bg-${badge[facture.statut]}">
                ${facture.statut}
            </span>

            <select onchange="changeStatutFacture(${facture.id}, this.value)" 
                    class="form-select form-select-sm mt-1">

                <option value="en_attente" ${facture.statut === "en_attente" ? "selected" : ""}>En attente</option>
                <option value="partielle" ${facture.statut === "partielle" ? "selected" : ""}>Partielle</option>
                <option value="payee" ${facture.statut === "payee" ? "selected" : ""}>Payée</option>
            </select>
            </td>
          <td>
            <button onclick="generateFacturePDF(${facture.id})">📄 PDF</button>
            <button class="btn btn-danger" onclick="deleteFacture(${facture.id})">Supprimer</button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  });

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
    alert("Statut mis à jour 💫");
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

// Créer une facture depuis un devis
function ouvrirCreationFacture() {
  fetch("http://localhost:3000/api/devis")
    .then(res => res.json())
    .then(devis => {

      // filtrer les devis acceptés
      const acceptes = devis.filter(d => d.statut === "accepte");

      let message = "Choisir un devis :\n";

      acceptes.forEach(d => {
        message += `${d.id} - ${d.numero} (${d.client?.nom})\n`;
      });

      const id = prompt(message);

      if (!id) return;

      facturerDepuisListe(id);
    });
}

// Créer facture depuis liste
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
    alert("Facture créée 💰");

    // ouvrir PDF direct 🔥
    window.open(`http://localhost:3000/api/pdf/facture/${data.facture.id}`, "_blank");

    // refresh
    location.reload();
  });
}