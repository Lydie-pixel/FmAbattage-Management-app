//Facturer un devis
function facturer(id) {
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
  .then(() => {
    alert("Facture créée 🔥");
    location.reload();
  });
}

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
    alerte("Statut mis à jour");
  });
}

//Générer PDF
function generatePDF(id) {
  window.open(`http://localhost:3000/api/pdf/devis/${id}`, "_blank");
}

fetch("http://localhost:3000/api/devis")
  .then(response => response.json())
  .then(data => {

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

    if (devis.statut === "accepte") {
      factureBtn = `
        <button class="btn btn-sm btn-success" onclick="facturer(${devis.id})">
          Facturer
        </button>
      `;
    }

    html += `
      <tr>
        <td>${devis.numero}</td>
        <td>${devis.client?.nom || "-"}</td>
        <td>${devis.client?.tel || "-"}</td>
        <td>${devis.date_echeance}</td>
        <td>${devis.montant} €</td>
        <td>
          <select onchange="changeStatut(${devis.id}, this.value)" class="form-select form-select-sm">
            <option value="en_attente" ${devis.statut === "en_attente" ? "selected" : ""}>En attente</option>
            <option value="accepte" ${devis.statut === "accepte" ? "selected" : ""}>Accepté</option>
            <option value="refuse" ${devis.statut === "refuse" ? "selected" : ""}>Refusé</option>
            <option value="archive" ${devis.statut === "archive" ? "selected" : ""}>Archivé</option>
          </select>
        </td>
        <td>
          <button type="button" onclick="generatePDF(${devis.id})">📄 PDF</button>
          ${factureBtn}
          <button class="btn btn-sm btn-primary">Modifier</button>
          <button class="btn btn-sm btn-danger">Supprimer</button>
        </td>
      </tr>
    `;
  });

    html += `</tbody></table>`;

    container.innerHTML = html;
});

window.facturer = facturer;
window.changeStatut = changeStatut;
window.generatePDF = generatePDF;